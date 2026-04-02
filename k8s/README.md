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
helm install nextgen-eam . -f my-values.yaml -n nextgen-eam --create-namespace
```

## Image Registry

Images are pulled from GitHub Container Registry (GHCR):

| Service | Image |
|---------|-------|
| Client  | `ghcr.io/<imageRepository>/nextgen-eam-client:<tag>` |
| Server  | `ghcr.io/<imageRepository>/nextgen-eam-server:<tag>` |
| AI Server | `ghcr.io/<imageRepository>/nextgen-eam-ai-server:<tag>` |
| AI Worker | `ghcr.io/<imageRepository>/nextgen-eam-ai-worker:<tag>` |

For private registries, create an image pull secret and reference it:

```bash
kubectl create secret docker-registry ghcr-pull-secret \
  --docker-server=ghcr.io \
  --docker-username=<github-user> \
  --docker-password=<github-pat> \
  -n nextgen-eam
```

Then set in your values:

```yaml
global:
  imagePullSecrets:
    - name: ghcr-pull-secret
```

## Configuration

### Required Values

| Key | Description |
|-----|-------------|
| `global.baseDomain` | Base DNS domain (e.g., `eam.example.com`) |
| `neo4j.auth.password` | Neo4j password |
| `keycloak.admin.password` | Keycloak admin console password |
| `keycloak.db.password` | Keycloak PostgreSQL password |

### Service URLs

By default the chart creates Ingress resources for these subdomains:

| Subdomain key | Default | Service |
|---------------|---------|---------|
| `ingress.subdomains.client` | `eam` | Next.js frontend |
| `ingress.subdomains.api` | `api` | GraphQL + AI API |
| `ingress.subdomains.auth` | `auth` | Keycloak |
| `ingress.subdomains.excalidrawRoom` | `room` | Excalidraw room |
| `ingress.subdomains.temporalUi` | `temporal` | Temporal UI (AI only) |

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

The AI stack (ai-server, ai-worker, Temporal) is **disabled by default**. Enable it with:

```yaml
ai:
  enabled: true

  llm:
    url: "http://localai.example.com/v1"
    model: "mistral-7b-instruct-v0.3"
    # apiKey: ""  # set via --set ai.llm.apiKey=<key>

  agentConfig:
    bootstrapClientId: "ai-bootstrap"
    bootstrapClientSecret: "change-me"

  temporal:
    db:
      password: "change-me-temporal-db"
```

When `ai.enabled=true`, the chart also deploys:
- **temporal-db** — PostgreSQL 15 for Temporal persistence
- **temporal** — Temporal server (`temporalio/auto-setup:1.24.2`)
- **temporal-ui** — Temporal web UI
- **ai-server** — REST orchestration server on port 4001
- **ai-worker** — Temporal workflow worker

The `TEMPORAL_ADDRESS` is automatically set to the internal service DNS name `<release>-temporal:7233`. Set `ai.temporal.address` to override (e.g., for an external Temporal cluster).

## Upgrade

```bash
helm upgrade nextgen-eam . -f my-values.yaml -n nextgen-eam
```

## Uninstall

```bash
helm uninstall nextgen-eam -n nextgen-eam
# PVCs are NOT deleted automatically — delete manually if desired:
kubectl delete pvc -l app.kubernetes.io/instance=nextgen-eam -n nextgen-eam
```

## Chart Structure

```
k8s/
├── Chart.yaml                      # Chart metadata
├── values.yaml                     # Default values (no secrets)
├── realm-export.json               # Keycloak realm bootstrap
├── .helmignore
├── README.md
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
    ├── ai.yaml                     # AI stack: temporal + ai-server + ai-worker (optional)
    └── ingress.yaml                # Ingress resources (optional)
```
