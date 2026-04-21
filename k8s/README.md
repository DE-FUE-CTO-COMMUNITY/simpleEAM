# NextGen EAM Helm Chart

Deploy the full NextGen Enterprise Architecture Management stack on Kubernetes.

## Prerequisites

- Kubernetes ≥ 1.25
- Helm ≥ 3.10
- An ingress controller (e.g., `ingress-nginx`)
- A StorageClass that supports `ReadWriteOnce` PVCs
- (Optional) cert-manager for automatic TLS certificates

## Quick Start

```bash
# 1. Add the chart (local clone)
cd k8s/

# Optional: choose any target namespace
export NAMESPACE=nextgen-eam

# 2. Create a values override with your secrets
cat > my-values.yaml <<EOF
global:
  baseDomain: eam.example.com
  imageRepository: de-fue-cto-community/simpleeam

neo4j:
  auth:
    password: "change-me-neo4j"

keycloak:
  admin:
    password: "change-me-keycloak-admin"
  db:
    password: "change-me-keycloak-db"
EOF

# 3. Install
helm install nextgen-eam . -f my-values.yaml -n "$NAMESPACE" --create-namespace
```

The chart does not hardcode a Kubernetes namespace. Resources are created in whichever namespace you pass to Helm via `-n/--namespace`.

Resource names are also configurable via Helm values:

```yaml
nameOverride: ''
fullnameOverride: ''
```

Use `fullnameOverride` only for fresh installs or planned migrations. Changing it on an existing release renames most Kubernetes resources and is not a safe in-place cosmetic change.

## Image Registry

Images are pulled from GitHub Container Registry (GHCR):

| Service           | Image                                                           |
| ----------------- | --------------------------------------------------------------- |
| Client            | `ghcr.io/<imageRepository>/nextgen-eam-client:<tag>`            |
| Server            | `ghcr.io/<imageRepository>/nextgen-eam-server:<tag>`            |
| Analytics Runtime | `ghcr.io/<imageRepository>/nextgen-eam-analytics-runtime:<tag>` |
| AI Runtime        | `ghcr.io/<imageRepository>/nextgen-eam-ai-runtime:<tag>`        |

For private registries, create an image pull secret and reference it:

```bash
kubectl create secret docker-registry ghcr-pull-secret \
  --docker-server=ghcr.io \
  --docker-username=<github-user> \
  --docker-password=<github-pat> \
  -n "$NAMESPACE"
```

Then set in your values:

```yaml
global:
  imagePullSecrets:
    - name: ghcr-pull-secret
```

## Configuration

### Required Values

| Key                       | Description                               |
| ------------------------- | ----------------------------------------- |
| `global.baseDomain`       | Base DNS domain (e.g., `eam.example.com`) |
| `neo4j.auth.password`     | Neo4j password                            |
| `keycloak.admin.password` | Keycloak admin console password           |
| `keycloak.db.password`    | Keycloak PostgreSQL password              |

### Naming Overrides

| Key                | Description                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `nameOverride`     | Overrides the chart/app name portion used in generated resource names.                                                                     |
| `fullnameOverride` | Replaces the generated release-based resource prefix entirely. Safe for fresh installs; treat changes on existing releases as a migration. |

### Service URLs

By default the chart creates Ingress resources for these subdomains:

| Subdomain key                       | Default    | Service          |
| ----------------------------------- | ---------- | ---------------- |
| `ingress.subdomains.client`         | `eam`      | Next.js frontend |
| `ingress.subdomains.api`            | `api`      | GraphQL + AI API |
| `ingress.subdomains.auth`           | `auth`     | Keycloak         |
| `ingress.subdomains.excalidrawRoom` | `room`     | Excalidraw room  |
| `ingress.subdomains.temporalUi`     | `temporal` | Temporal UI      |

### TLS / cert-manager

```yaml
ingress:
  tls: true
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
```

### Using Existing Secrets

Instead of supplying plain-text passwords, reference pre-existing Kubernetes Secrets:

```yaml
neo4j:
  auth:
    existingSecret: my-neo4j-secret
    existingSecretKey: password

keycloak:
  admin:
    existingSecret: my-keycloak-admin-secret
    existingSecretPasswordKey: adminPassword
  db:
    existingSecret: my-keycloak-db-secret
    existingSecretKey: password
```

## AI Stack

The optional AI stack (ai-server, ai-worker) is **disabled by default**. Enable it with:

```yaml
ai:
  enabled: true

  llm:
    url: 'http://localai.example.com/v1'
    model: 'mistral-7b-instruct-v0.3'
    # apiKey: ""  # set via --set ai.llm.apiKey=<key>

  agentConfig:
    bootstrapClientId: 'ai-bootstrap'
    bootstrapClientSecret: 'change-me'

  temporal:
    db:
      password: 'change-me-temporal-db'
```

When `ai.enabled=true`, the chart also deploys:

- **ai-server** — REST orchestration server on port 4001
- **ai-worker** — Temporal workflow worker

Both workloads are backed by the shared `nextgen-eam-ai-runtime` image and use different container commands (`yarn start` and `yarn worker`).

## Analytics Runtime

The analytics stack now includes standalone Temporal-based runtime services:

- **analytics-scheduler** — reconciles the analytics refresh Temporal schedule
- **analytics-worker** — executes analytics refresh workflows on the dedicated analytics queue

Temporal is no longer treated as AI-only. The chart deploys **temporal-db**, **temporal**, and optionally **temporal-ui** whenever `temporal.enabled=true` and either the analytics runtime or the AI stack is enabled. The `TEMPORAL_ADDRESS` is automatically set to the internal service DNS name `<release>-temporal:7233`. Set `ai.temporal.address` to override when pointing workloads at an external Temporal cluster.

## Upgrade

```bash
yarn sync:cube-schema
helm upgrade nextgen-eam . -f my-values.yaml -n "$NAMESPACE"
```

The Helm chart packages its Cube schema from `k8s/files/cube`, which is generated from the canonical source in `analytics/cube`. Run `yarn sync:cube-schema` before packaging or upgrading the chart after Cube model changes.

## Uninstall

```bash
helm uninstall nextgen-eam -n "$NAMESPACE"
# PVCs are NOT deleted automatically — delete manually if desired:
kubectl delete pvc -l app.kubernetes.io/instance=nextgen-eam -n "$NAMESPACE"
```

## Chart Structure

```
k8s/
├── Chart.yaml                      # Chart metadata
├── values.yaml                     # Default values (no secrets)
├── realm-export.json               # Keycloak realm bootstrap
├── .helmignore
├── README.md
├── files/
│   └── cube/                       # Generated from analytics/cube via yarn sync:cube-schema
└── templates/
    ├── _helpers.tpl                # Named templates / helpers
    ├── configmap.yaml              # Non-secret environment config
    ├── secrets.yaml                # Secrets (created only if not existingSecret)
    ├── neo4j.yaml                  # Neo4j StatefulSet + Service + PVC
    ├── keycloak.yaml               # Keycloak + keycloak-db
    ├── keycloak-realm-configmap.yaml  # Realm JSON import
    ├── server.yaml                 # GraphQL server
    ├── client.yaml                 # Next.js frontend
    ├── excalidraw-room.yaml        # Collaboration room (optional)
    ├── ai.yaml                     # Temporal + optional AI stack
    ├── analytics.yaml              # Analytics infra + analytics runtime
    └── ingress.yaml                # Ingress resources (optional)
```
