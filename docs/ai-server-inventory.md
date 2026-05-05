# AI Server Inventory And Baseline Report

Last updated: 2026-05-05

This report began as a baseline inspection. It now also records the current migration state after the root-level package architecture became the active build surface.

## Migration Status Snapshot

Current runtime/build facts:

- `ai-server/index.ts` is the package entrypoint and public export surface.
- `ai-server/package.json` now runs `dev` from `index.ts` and `worker` from `temporal/worker.ts`.
- `ai-server/tsconfig.json` now compiles the root-level directories plus legacy `src/` compatibility code.
- root-level modules under `artifacts/`, `state/`, `policy/`, `agents/`, `graph/`, and `temporal/` are build-active.
- selected `src/` files now exist only as compatibility wrappers to preserve existing imports during the migration.
- several legacy implementations still remain under `src/` and are intentionally imported from the new root-level modules until those slices are migrated fully.

## 1. Package Summary

Source inspected: `ai-server/package.json`

- Name: `nextgen-eam-ai-runtime`
- Version: `1.3.4`
- Description: `NextGen EAM AI server`
- Main entry point: `dist/index.js`
- Package manager: `yarn@4.9.1`

### Scripts

- `build`: compile TypeScript with `tsc`
- `start`: run the HTTP server from `dist/index.js`
- `dev`: run the HTTP server from `index.ts` via `ts-node-dev`
- `worker`: run the Temporal worker from `dist/temporal/worker.js`
- `worker:dev`: run the Temporal worker from `temporal/worker.ts`
- `generate-schema-digest`: regenerate `src/agents/data-lookup/generated-schema-digest.ts`
- `codegen`: regenerate `src/gql/generated.ts` from the live GraphQL endpoint
- `test`: placeholder only, prints `No ai-server tests configured`

### Dependencies

Runtime dependencies:

- HTTP and process shell: `express`, `cors`, `helmet`, `dotenv`
- Auth: `jsonwebtoken`, `jwks-client`
- Workflow/orchestration: `@temporalio/client`, `@temporalio/worker`, `@temporalio/workflow`
- LLM and graph orchestration helpers: `@langchain/core`, `@langchain/langgraph`
- Utilities: `uuid`, `zod`

Development dependencies:

- TypeScript/runtime tooling: `typescript`, `ts-node-dev`, `@types/*`
- GraphQL tooling: `@graphql-codegen/cli`, `@graphql-codegen/typescript`, `graphql`
- Env expansion: `dotenv-expand`

### Effective entry points

- HTTP API server:
  - dev: `index.ts`
  - runtime: `dist/index.js`
- Temporal worker:
  - dev: `temporal/worker.ts`
  - runtime: `dist/temporal/worker.js`

## 2. Current Folder Structure

Complete recursive inspection was performed across `ai-server/`. The package currently contains source, generated output, package-manager state, and installed dependencies.

Notes:

- `node_modules/` exists and is populated.
- `.yarn/` exists.
- `dist/` exists and contains compiled output.
- The tree below expands the owned and generated structure. The full vendor contents of `node_modules/` are intentionally not inlined in this report because they dominate the output without adding architectural signal.

```text
ai-server/
├── .yarn/
├── .yarnrc.yml
├── Dockerfile
├── codegen.ts
├── dist/
│   ├── agents/
│   │   ├── analytics/
│   │   ├── analytics-worker.js
│   │   ├── analytics-workflows.js
│   │   ├── coordinator/
│   │   ├── data-lookup/
│   │   ├── document-research/
│   │   ├── internet-research/
│   │   ├── quality-control/
│   │   ├── registry.js
│   │   ├── routes.js
│   │   ├── shared/
│   │   ├── sovereignty/
│   │   ├── strategy-generator/
│   │   ├── temporal-client.js
│   │   ├── types.js
│   │   ├── worker.js
│   │   └── workflows.js
│   ├── ai/
│   │   ├── activities.js
│   │   ├── routes.js
│   │   ├── temporal-client.js
│   │   ├── types.js
│   │   ├── worker.js
│   │   └── workflows.js
│   ├── analytics-scheduler.js
│   ├── auth/
│   ├── db/
│   ├── gql/
│   ├── graphql/
│   └── index.js
├── node_modules/
├── package.json
├── scripts/
│   └── generate-schema-digest.mjs
├── src/
│   ├── agents/
│   │   ├── analytics/
│   │   ├── coordinator/
│   │   │   ├── activities.ts
│   │   │   ├── agent-routing-logic.v1.0.0.yaml
│   │   │   ├── intent-schema.v1.0.0.json
│   │   │   └── workflow.ts
│   │   ├── data-lookup/
│   │   │   ├── activities.ts
│   │   │   ├── concept-dictionary.v1.0.0.json
│   │   │   ├── entity-resolution-rules.v1.0.0.json
│   │   │   ├── generated-schema-digest.ts
│   │   │   ├── graph-query-library.v1.0.0.json
│   │   │   └── tools.ts
│   │   ├── document-research/
│   │   │   └── activities.ts
│   │   ├── internet-research/
│   │   │   └── activities.ts
│   │   ├── quality-control/
│   │   │   └── activities.ts
│   │   ├── shared/
│   │   │   ├── agent-config.ts
│   │   │   ├── default-agent-configs.ts
│   │   │   ├── llm.ts
│   │   │   └── web-search.ts
│   │   ├── sovereignty/
│   │   │   ├── activities.ts
│   │   │   └── workflow.ts
│   │   ├── strategy-generator/
│   │   │   └── activities.ts
│   │   ├── registry.ts
│   │   ├── routes.ts
│   │   ├── temporal-client.ts
│   │   ├── types.ts
│   │   ├── worker.ts
│   │   └── workflows.ts
│   ├── auth/
│   │   ├── auth-jwks.ts
│   │   └── keycloak-service-token.ts
│   ├── db/
│   ├── gql/
│   │   └── generated.ts
│   ├── graphql/
│   │   └── client.ts
│   ├── index.ts
│   └── types/
│       └── jwks-client.d.ts
├── tsconfig.json
└── yarn.lock
```

## 3. Architecture Description

`ai-server` is a standalone TypeScript package with two runtime roles built from the same image and codebase:

1. An Express HTTP API in `src/index.ts`
2. A Temporal worker in `src/agents/worker.ts`

### HTTP server role

At startup the HTTP server:

- loads environment variables
- checks GraphQL reachability through `src/graphql/client.ts`
- fetches an optional Keycloak service token
- seeds persisted `AgentConfig` records via GraphQL if bootstrap credentials are available
- mounts the main router from `src/agents/routes.ts`
- exposes `GET /health`

The API is responsible for:

- AI run creation, listing, deletion, approval, rejection, and audit lookup
- sovereignty recalculation requests
- assistant query handling
- controlled assistant change-plan creation, approval, rejection, audit, and apply

### Worker role

The Temporal worker:

- connects to the configured Temporal namespace and task queue
- registers activities from coordinator, data-lookup, internet-research, document-research, quality-control, strategy-generator, and sovereignty modules
- executes workflows exported from `src/agents/workflows.ts`

### Workflow model

There are two separate workflow paths:

- `coordinatorWorkflow`
  - manages AI runs end-to-end
  - updates run lifecycle state through GraphQL
  - classifies intent, builds a plan, runs specialized activities, performs quality control, and aggregates the result
- `sovereigntyScoreWorkflow`
  - performs non-LLM sovereignty score recomputation
  - reads scoped entities through GraphQL, computes scores, and writes them back to the company record

### Data access model

The inspected runtime path is GraphQL-over-HTTP, not direct Neo4j driver access.

- `graphqlRequest(...)` in `src/graphql/client.ts` is the common transport
- runtime modules query the GraphQL server, which is the layer that sits in front of Neo4j
- no inspected runtime code opens Bolt sessions or executes Cypher directly

### Artifact model

The repository already contains a versioned artifact set under `src/agents/coordinator/` and `src/agents/data-lookup/`:

- intent schema
- routing logic
- concept dictionary
- entity resolution rules
- graph query library
- generated schema digest

Only part of that artifact set is actively used at runtime.

## 4. Components And Responsibilities

### Coordinator logic

- `src/agents/coordinator/workflow.ts`
  - Main orchestration workflow for AI runs.
  - Marks runs running/completed/failed.
  - Executes a step plan sequentially and collects results.
- `src/agents/coordinator/activities.ts`
  - Loads planner artifacts.
  - Builds the intent-classification prompt.
  - Converts the chosen intent into agent steps.
  - Updates `AiRun` state and status messages via GraphQL.
  - Aggregates final results.
- `src/agents/coordinator/intent-schema.v1.0.0.json`
  - Versioned runtime intent definitions.
- `src/agents/coordinator/agent-routing-logic.v1.0.0.yaml`
  - Versioned routing and runtime-plan definitions.

### Data lookup logic (GraphQL-based)

- `src/agents/data-lookup/tools.ts`
  - Typed GraphQL query tool layer.
  - Prewritten query templates for applications, capabilities, interfaces, data objects, infrastructure, processes, AI components, suppliers, organisations, people, counts, and company overview.
  - Injects tenant scope in each tool `execute(...)` implementation.
- `src/agents/data-lookup/activities.ts`
  - Registers the data-lookup agent.
  - Uses the LLM to choose a typed tool or fall back to `genericGraphQuery`.
  - Enforces read-only GraphQL and company scoping for generic fallback.
  - Interprets raw results into plain-text summaries.
- `src/graphql/client.ts`
  - Shared GraphQL transport.
- `src/gql/generated.ts`
  - Generated GraphQL TypeScript types used by the tool layer.

### Workflow and orchestration

- `src/agents/temporal-client.ts`
  - Creates the Temporal client, starts workflows, and reads workflow status.
- `src/agents/worker.ts`
  - Creates the Temporal worker and registers activity implementations.
- `src/agents/workflows.ts`
  - Single export surface for workflows.
- `src/agents/sovereignty/workflow.ts`
  - Separate scoring workflow.
- `src/agents/sovereignty/activities.ts`
  - Paginates GraphQL reads, computes sovereignty scores, and persists them.

### Artifact and config handling

- `src/agents/data-lookup/concept-dictionary.v1.0.0.json`
  - Versioned canonical concept and synonym artifact.
- `src/agents/data-lookup/entity-resolution-rules.v1.0.0.json`
  - Versioned entity-resolution artifact.
- `src/agents/data-lookup/graph-query-library.v1.0.0.json`
  - Versioned Cypher template artifact.
- `src/agents/data-lookup/generated-schema-digest.ts`
  - Generated textual schema digest used by the generic GraphQL fallback.
- `scripts/generate-schema-digest.mjs`
  - Introspects the live GraphQL API and rewrites `generated-schema-digest.ts`.
- `codegen.ts`
  - Generates GraphQL TypeScript types from the live schema.
- `src/agents/shared/default-agent-configs.ts`
  - Default prompt and runtime settings per agent.
- `src/agents/shared/agent-config.ts`
  - Loads persisted `AgentConfig` from GraphQL, creates defaults if missing, and caches them in memory.

### State and context handling

- `src/agents/types.ts`
  - Shared types for run inputs, LLM config, workflow data, strategic drafts, and sovereignty scores.
- `src/agents/registry.ts`
  - In-memory agent descriptor registry.
- `src/agents/shared/llm.ts`
  - LLM transport, timeout/retry logic, prompt logging, and text parsing helpers.
- `src/agents/shared/web-search.ts`
  - Shared web collection and fetch helpers.
- `src/agents/routes.ts`
  - Holds assistant snapshot loading, dry-run validation, change-plan persistence, execution audit, and HTTP-level access enforcement.
- `src/auth/auth-jwks.ts`
  - JWT verification and request authentication.
- `src/auth/keycloak-service-token.ts`
  - Service-token acquisition for startup bootstrap.

### Specialized agents

- `src/agents/internet-research/activities.ts`
  - Web research plus LLM summary.
- `src/agents/document-research/activities.ts`
  - Document analysis plus extracted findings.
- `src/agents/quality-control/activities.ts`
  - LLM-based quality review with auto-pass fallback.
- `src/agents/strategy-generator/activities.ts`
  - Strategic draft generation and fallback draft construction.

## 5. Current Usage Of `SCHEMA_DIGEST`

### How it is generated

`SCHEMA_DIGEST` is generated by `scripts/generate-schema-digest.mjs`.

Observed generation flow:

- reads `GRAPHQL_URL`, then `GRAPHQL_INTERNAL_URL`, else defaults to `http://localhost:4500/graphql`
- runs GraphQL introspection against the live schema
- extracts queryable entity collections from the GraphQL query type
- derives fields, relationships, count queries, enum values, filter syntax hints, and example GraphQL queries
- writes a TypeScript file exporting a string constant:
  - output: `src/agents/data-lookup/generated-schema-digest.ts`

### How it is used

Confirmed runtime usage:

- `src/agents/data-lookup/activities.ts` imports `SCHEMA_DIGEST`
- it is embedded into the `buildGenericQueryPrompt(...)` prompt for the `genericGraphQuery` fallback path
- it serves as prompt context telling the LLM how to produce a valid read-only GraphQL query

### What it is not used for

- it is not used by the typed GraphQL tools in `src/agents/data-lookup/tools.ts`
- it is not used by the coordinator planner
- it is not used as a runtime-executed whitelist by itself

### Baseline interpretation

`SCHEMA_DIGEST` is a prompt artifact, not a deterministic execution artifact.

- It guides query generation.
- Runtime enforcement still depends on code checks such as `isReadOnlyQuery(...)`, `hasCompanyScope(...)`, and the final GraphQL server response.

## 6. GraphQL-Based And Tenant-Scoped Data Access

### GraphQL-based access

All inspected runtime reads and writes go through `graphqlRequest(...)` from `src/graphql/client.ts`.

Confirmed GraphQL consumers include:

- route handlers in `src/agents/routes.ts`
- coordinator activities
- data-lookup tools and fallback execution
- sovereignty activities
- agent config load/create/seed logic

No inspected runtime module imports `neo4j-driver` or constructs a direct Neo4j session.

### Tenant scope in typed tools

Tenant scoping is explicit and injected in code.

Confirmed patterns in `src/agents/data-lookup/tools.ts`:

- most entity tools start with `company: { some: { id: { eq: companyId } } }`
- person queries correctly use `companies: { some: { id: { eq: companyId } } }`
- `countEntities` uses a hardcoded entity-to-company-field config and injects the relevant company field before execution
- `getCompanyOverview` scopes the root company query with `id: { eq: companyId }`

The file comment is accurate: company scope is injected by the tool layer rather than delegated to the LLM.

### Tenant scope in generic GraphQL fallback

The `genericGraphQuery` fallback in `src/agents/data-lookup/activities.ts` enforces tenant scope in three places:

1. The prompt requires `$companyId` and explicit company scoping.
2. `hasCompanyScope(...)` rejects generated queries that do not contain company filtering.
3. Code forcibly sets `parsed.variables.companyId = input.companyId` before execution.

### Tenant scope in route-level GraphQL usage

`src/agents/routes.ts` also applies company scoping directly:

- assistant snapshot queries filter every collection by `company: { some: { id: { eq: $companyId } } }`
- dry-run entity loads combine `id` filtering with the selected company
- assistant mutation apply flows update or connect only when the targeted entity is scoped to the selected company
- access to AI runs is also limited by JWT roles and `company_ids` checks in `enforceAiRunAccess(...)`

## 7. Direct Cypher Or Neo4j Access

### What exists

Cypher and Neo4j references are present as artifacts or comments:

- `src/agents/data-lookup/graph-query-library.v1.0.0.json` contains versioned Cypher templates
- `src/agents/coordinator/agent-routing-logic.v1.0.0.yaml` describes a planned `graph-query-agent` executing whitelisted read-only Cypher
- `src/auth/auth-jwks.ts` comments refer to the Neo4j GraphQL Library request/token handling model
- `scripts/generate-schema-digest.mjs` excludes an internal enum named `Neo4jPopulatedByOperation`

### What was not found

No direct Neo4j execution path was found in inspected runtime code:

- no `neo4j-driver` import
- no Bolt URI usage
- no session or transaction API calls
- no `session.run(...)`
- no runtime code that loads and executes the Cypher templates from `graph-query-library.v1.0.0.json`

### Baseline conclusion

The current `ai-server` runtime is GraphQL-based and does not directly execute Cypher or talk to Neo4j via a driver in the inspected code path.

## 8. How `ai-server` Is Invoked From The Repository

### Root scripts

Root `package.json` invokes the package through:

- `yarn ai-server` -> `cd ai-server && yarn dev`
- `yarn build:ai-server` -> `cd ai-server && yarn build`
- `yarn test:ai-server` -> `cd ai-server && yarn test`
- `yarn build:all` also includes `build:ai-server`

### Docker Compose

`compose.yml` defines two workloads from the same Dockerfile:

- `ai-server`
  - command: `yarn start`
  - public HTTP exposure for `/ai-runs`, `/ai-assistant`, and `/sovereignty`
- `ai-worker`
  - command: `yarn worker`
  - Temporal worker only

### Frontend call sites

Confirmed frontend usage:

- `client/src/components/agentic-architect/AgenticArchitectChat.tsx`
  - `GET /ai-runs`
  - `POST /ai-runs`
  - `POST /ai-runs/:runId/approve`
  - `POST /ai-runs/:runId/reject`
  - `DELETE /ai-runs`
- `client/src/app/[lang]/page.tsx`
  - `POST /sovereignty/recalculate`

### Deployment and docs wiring

- `README.md` documents the AI stack as optional
- `docs/RUNTIME_CONFIG.md` documents `ai-server` as the REST API and `ai-worker` as the Temporal worker
- `.github/workflows/build-and-push-images.yml` builds the shared image from `ai-server/Dockerfile`
- Kubernetes manifests also deploy the shared image as separate `ai-server` and `ai-worker` workloads

## 9. Risks And Refactoring Challenges

1. `src/agents/routes.ts` is a very large, multi-responsibility module.
   - It mixes auth, GraphQL persistence, assistant logic, direct LLM calls, dry-run validation, controlled apply logic, and audit handling.

2. The request contract for AI runs is inconsistent.
   - The chat UI posts `useCase: 'CONVERSATIONAL_ASSISTANT'`.
   - `POST /ai-runs` currently hardcodes `STRATEGIC_ENRICHMENT` and ignores the request body use case.

3. The artifact-driven architecture is only partially enforced.
   - Runtime code loads `intent-schema` and `agent-routing-logic`.
   - The concept dictionary, entity-resolution rules, and graph query library are present but not referenced by inspected TypeScript runtime code.
   - `SCHEMA_DIGEST` is used as prompt context, not as a deterministic whitelist.

4. The checked-in intent schema already drifts from the attached rules.
   - `src/agents/coordinator/intent-schema.v1.0.0.json` contains an extra `TECH_LIFECYCLE_DISCOVERY` intent beyond the allowed initial set.

5. Assistant logic bypasses the coordinator/worker path in some cases.
   - `POST /ai-assistant/query` loads a company-scoped snapshot in the API route and can call the company LLM directly.

6. Build output appears stale or inconsistent with the current source tree.
   - `dist/` contains `analytics-*` artifacts and a `dist/ai/` subtree without matching current source folders.

7. The build is permissive.
   - `tsconfig.json` sets `noEmitOnError: false`.
   - `ai-server/Dockerfile` runs `yarn build || echo "TypeScript warnings ignored"`.

8. There is no real automated test coverage in this package.
   - `yarn test` is a placeholder only.

9. Workflow lifecycle depends on end-user tokens for GraphQL updates.
   - Route code starts workflows with the caller token.
   - `GET /ai-runs` contains explicit self-healing logic for stuck runs, with messages that mention JWT expiry and worker restart scenarios.

10. Runtime artifact loading depends on source files being present in the deployed image.
    - Coordinator activities resolve artifact files from `src/...`, not from emitted `dist/...` output.

11. Persisted `AgentConfig` caching has no visible invalidation strategy.
    - Process-local cache entries may stay stale until restart.

12. `generated-schema-digest.ts` includes company LLM fields in prompt context.
    - `Company.llmUrl`, `Company.llmModel`, and `Company.llmKey` appear in the digest and therefore in the generic query prompt context.

13. Tenant scoping is consistently applied, but it is duplicated across layers.
    - The same company filter logic appears in typed tools, generic fallback validation, route snapshot queries, entity loaders, and mutation guards.

14. Controlled assistant change application is intentionally narrow.
    - The inspected implementation supports only a limited subset of entity create/update operations and only `APPLICATION -> BUSINESS_CAPABILITY` relation connect/disconnect.

15. Some directories are placeholders or unused in the current source tree.
    - `src/db/` is empty.
    - `src/agents/analytics/` is empty while `dist/agents/analytics/` exists.

## 10. Baseline Conclusion

The current `ai-server` is a combined REST API, Temporal worker, coordinator, specialized activity runner, and GraphQL-backed state-management package.

The strongest baseline conclusions are:

- runtime data access is GraphQL-based
- tenant scoping is explicit and broadly enforced in code
- `SCHEMA_DIGEST` is generated from live GraphQL introspection and used only in the generic GraphQL fallback path
- direct Cypher execution is not wired into the inspected runtime
- the artifact set on disk is broader than what the runtime currently enforces

The main refactoring pressure points are the monolithic router, mixed execution paths, stale build output, missing tests, and the gap between the intended artifact-driven graph architecture and the currently implemented GraphQL-plus-LLM behavior.
