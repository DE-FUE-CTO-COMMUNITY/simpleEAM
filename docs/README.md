# Simple-EAM: Enterprise Architecture Management

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

This mono-repository contains all components of the Simple-EAM System:

- **Neo4j Database**: Graph database for storing the Enterprise Architecture Model
- **GraphQL Server**: API layer for efficient data communication
- **Keycloak**: Identity and access management
- **Next.js Frontend**: Modern, responsive user interface

## Project Structure

```
simple-eam/
├── auth/                   # Keycloak configuration
│   └── src/                # Keycloak customizations
├── client/                 # Next.js frontend
│   └── src/
│       ├── app/            # Next.js App Router
│       └── components/     # React components
├── db/                     # Neo4j database
│   └── src/                # Database scripts, seed files
├── server/                 # GraphQL server
│   └── src/                # Server source code
└── docker-compose.yml      # Docker configuration for all services
```

## Technology Stack

- **Frontend**: Next.js 15, Material UI 7, Excalidraw, TanStack Table/Form, Internationalization
- **Backend**: GraphQL, Neo4j, Keycloak
- **Infrastructure**: Docker, Docker Compose

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
   git clone https://your-repository-url/simple-eam.git
   cd simple-eam
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Start system:

   ```bash
   docker-compose up -d
   ```

4. Access the different components:
   - Frontend: http://localhost:3000
   - GraphQL Server: http://localhost:4000/graphql
   - Neo4j Browser: http://localhost:7474
   - Keycloak Admin: http://localhost:8080

## Development

Each component can be developed independently:

- **Client**: Work in the `client` directory
- **Server**: Work in the `server` directory
- **Database**: Maintain scripts in the `db/src` directory
- **Auth**: Customize Keycloak configurations in the `auth/src` directory

**Important:** In this project we use **yarn** as package manager. Please do not use npm commands. For more details, see the [YARN.md](./YARN.md) documentation.

## Branching Strategy

We recommend the following branching strategy for this mono-repository:

- `main` - Production code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `release/*` - Release candidates

## License

[MIT License](LICENSE)
