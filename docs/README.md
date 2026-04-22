# NextGen EAM: Enterprise Architecture Management

A scalable Enterprise Architecture Management System consisting of multiple Docker containers using modern web technologies.

## ⚠️ IMPORTANT NOTE: PACKAGE MANAGER

**🚫 NPM IS STRICTLY PROHIBITED IN THIS PROJECT! 🚫**

This project uses **exclusively yarn** as package manager:

- ✅ `yarn install` - CORRECT
- ✅ `yarn add package` - CORRECT
- ✅ `yarn run script` - CORRECT
- ❌ `npm install` - PROHIBITED
- ❌ `npm run` - PROHIBITED
- ❌ `npm add` - PROHIBITED

The project is technically configured to block npm calls.

> **Note for GitHub Copilot**: This project exclusively uses Yarn as package manager. For all installation commands, please always use Yarn syntax, not npm.

## Project Overview

This mono-repository contains all components of the NextGen EAM System:

- **Neo4j Database**: Graph database for storing the Enterprise Architecture Model
- **GraphQL and Analytics API Server**: API layer for data access, analytics orchestration, and runtime contracts
- **Keycloak**: Identity and access management
- **Next.js Frontend**: Modern, responsive user interface
- **Analytics Stack**: ClickHouse projections, Cube semantic model, and CubeStore caching
- **Workflow Runtime**: Temporal-based execution for analytics refresh and AI runs
- **AI Services**: Profile-based REST and worker services for AI orchestration
- **Kubernetes Deployment**: Helm chart and values files for cluster-based installation

## Project Structure

```
nextgen-eam/
├── analytics/              # ClickHouse, Cube, and CubeStore assets
│   ├── clickhouse/         # Projection database init scripts and data
│   ├── cube/               # Cube semantic models
│   └── cubestore/          # CubeStore persistence
│   └── runtime/            # Temporal analytics worker and scheduler runtime
├── ai-server/              # AI orchestration service and worker code
├── auth/                   # Keycloak configuration
│   └── src/                # Keycloak customizations
├── client/                 # Next.js frontend
│   └── src/
│       ├── app/            # Next.js App Router
│       └── components/     # React components
├── db/                     # Neo4j database
│   └── src/                # Database scripts, seed files
├── k8s/                    # Helm chart, templates, and deployment values
├── server/                 # GraphQL and analytics server
│   └── src/                # Server source code
├── tools/temporal/         # Temporal persistence assets
└── compose.yml             # Docker Compose configuration for all services
```

## Technology Stack

- **Frontend**: Next.js 15, Material UI 7, Excalidraw, TanStack Table/Form, Internationalization
- **Backend**: GraphQL, Neo4j, Keycloak, ClickHouse, Cube
- **Infrastructure**: Docker, Docker Compose, Temporal

> **Important for Material UI 7**: We use the new Grid v2 API, which differs significantly from the legacy Grid component. Please use `size` instead of `xs/sm/md`, `<Grid container sx={{ width: '100%' }}>` for containers, and Stack for vertical layouts. See [example component](./client/src/components/common/GridV2Example.tsx) and [documentation](https://mui.com/material-ui/migration/upgrade-to-grid-v2/).

> **Important for Tanstack Table**: We use Tanstack Table V8, which differs significantly from React Table v7. Please use `useReactTable` instead of `useTable`, `flexRender` for cell rendering, and explicit state management. See [example component](./client/src/components/common/TanstackTableExample.tsx) and [documentation](https://tanstack.com/table/latest/docs/guide/migrating).

> **Important for TanStack Form**: We use TanStack Form for all forms. Please use strict typing, schema validation with Zod, `useForm` for the form instance, Render Props Pattern for fields and optimized reactivity with `useStore`. See our [form guidelines](./.github/copilot/TANSTACK_FORM_GUIDELINES.md) and [documentation](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts).

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js (recommended version: 20.x or higher)
- Git

### Installation

1. Clone repository:

   ```bash
   git clone https://your-repository-url/nextgen-eam.git
   cd nextgen-eam
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Start the core platform:

   ```bash
   docker compose up -d
   ```

4. Optional: start the AI profile as well:

   ```bash
   COMPOSE_PROFILES=ai docker compose up -d
   ```

5. Access the different components:
   - Frontend: http://localhost:3000
   - GraphQL Server: http://localhost:4000/graphql
   - Analytics API: http://localhost:4000/analytics
   - Cube API: http://localhost:4003/cubejs-api/v1
   - ClickHouse HTTP: http://localhost:8123
   - CubeStore HTTP: http://localhost:3030
   - Neo4j Browser: http://localhost:7474
   - Keycloak Admin: http://localhost:8080
   - Temporal UI: http://localhost:8088
   - Excalidraw Room: http://localhost:3001
   - AI Server (optional `ai` profile): http://localhost:4001/health

## Development

Each component can be developed independently:

- **Client**: Work in the `client` directory
- **Server**: Work in the `server` directory for GraphQL and analytics API changes
- **Analytics**: Update projection schemas in `analytics/` and analytics routes/schema in `server/src/analytics`
- **Analytics Runtime**: Update Temporal analytics worker and scheduler code in `analytics/runtime`
- **AI Services**: Work in `ai-server` for AI orchestration endpoints and Temporal workers
- **Database**: Maintain scripts in the `db/src` directory
- **Auth**: Customize Keycloak configurations in the `auth/src` directory

## Deployment Options

- **Docker Compose**: Use `compose.yml` for local and single-host deployments
- **Kubernetes / Helm**: Use the Helm chart in `k8s/` for cluster deployments

The Helm chart documentation lives in [../k8s/README.md](../k8s/README.md) and covers values, ingress, secrets, analytics services, and optional AI services.

**Important:** In this project we use **yarn** as package manager. Please do not use npm commands.

## Documentation Map

- [ANALYTICS_CHANGE_CHECKLIST.md](./ANALYTICS_CHANGE_CHECKLIST.md): What to update when GraphQL or Neo4j model changes affect analytics projections
- [RUNTIME_CONFIG.md](./RUNTIME_CONFIG.md): Runtime environment variables for client, server, analytics, and AI services
- [BRANDING.md](./BRANDING.md): Runtime branding and theming configuration
- [ENTITY-IMPLEMENTATION-PATTERN.md](./ENTITY-IMPLEMENTATION-PATTERN.md): Feature and entity implementation structure
- [../k8s/README.md](../k8s/README.md): Helm-based Kubernetes deployment

## Branching Strategy

We recommend the following branching strategy for this mono-repository:

- `main` - Production code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `release/*` - Release candidates

## License

[MIT License](LICENSE)
