# AI Server Migration Plan

Last updated: 2026-05-05

This document started as a target-state migration plan. The package has now been partially migrated, and the root-level structure is the active build surface.

## Migration Status

Implemented now:

- `ai-server/index.ts` is the single public package entrypoint.
- `ai-server/tsconfig.json` builds the package root instead of only `src/`.
- root-level modules under `artifacts/`, `state/`, `policy/`, `agents/`, `graph/`, and `temporal/` are part of the compiled runtime surface.
- `package.json` development and worker scripts now point at the root-level entrypoints.
- legacy `src` entrypoints such as `src/index.ts`, `src/graphql/client.ts`, `src/agents/shared/llm.ts`, `src/agents/temporal-client.ts`, `src/agents/worker.ts`, and `src/agents/workflows.ts` are compatibility wrappers.

Still intentionally retained under `src/`:

- legacy route composition and some auth/bootstrap modules
- legacy Temporal workflows and activity implementations still registered by the worker
- shared runtime types currently imported by both root-level and legacy modules
- data-lookup tool definitions still re-exported through the root graph registry

This document therefore describes both the target architecture and the remaining migration boundary.

## 1. Target Architecture Description

### Goals

The target architecture reorganizes `ai-server` by responsibility so that:

- data lookup remains GraphQL-based
- `SCHEMA_DIGEST` becomes the authoritative contract for graph-readable shape
- direct Cypher execution is not allowed
- every executable query is addressable by `QueryId`
- routing, policy, state, graph access, and workflow orchestration are separated cleanly

### Target top-level structure

```text
ai-server/
├── artifacts/
├── state/
├── policy/
├── agents/
├── graph/
└── temporal/
```

### Architectural model

The target model splits the package into six layers:

1. `artifacts/`
   - versioned machine-readable contracts and generated metadata
   - source of truth for intent schema, concept dictionary, entity resolution rules, routing logic, and `SCHEMA_DIGEST`

2. `state/`
   - persisted-state adapters and in-memory runtime state abstractions
   - `AiRun`, audit, `AgentConfig`, status updates, and assistant plan state

3. `policy/`
   - execution guards and architectural invariants
   - tenant scope rules, read-only query validation, allowed `QueryId` registry rules, auth/access rules

4. `agents/`
   - business-facing agent behaviors and HTTP/API-facing orchestration entrypoints
   - coordinator, research agents, quality control, strategy generator, assistant entrypoints

5. `graph/`
   - GraphQL-only graph access layer
   - `QueryId` registry, query builders, GraphQL client wrappers, query execution, response normalization

6. `temporal/`
   - Temporal-specific workers, workflows, activity bindings, and task-queue integration

### Required design principles

#### GraphQL-only graph access

All graph reads and writes in `ai-server` must continue to go through GraphQL. The target architecture does not introduce direct Neo4j or Cypher runtime execution.

#### `SCHEMA_DIGEST` as authoritative contract

`SCHEMA_DIGEST` is the authoritative contract for what the AI layer may assume about graph-readable entity shapes, filters, relations, and count queries.

In the target architecture:

- generated query definitions must be derived from the digest-compatible schema surface
- agent prompts may reference `SCHEMA_DIGEST`, but execution must not depend on prompt-only interpretation
- `QueryId` definitions must map to GraphQL operations that are valid against the digest-defined contract

#### No direct Cypher access

The existing Cypher artifact files may remain as historical or design artifacts, but the target runtime architecture does not execute Cypher directly. The runtime graph access layer is GraphQL-only.

#### QueryId-addressable queries

Every executable graph query must be referenced by a stable `QueryId`, not by free-form generated query text.

Target execution model:

- agents request graph data via `QueryId`
- `graph/queries/` resolves `QueryId` to a code-owned GraphQL operation or builder
- `policy/` validates that the query is allowed, tenant-scoped, and read-only when applicable
- `graph/executor` executes through the shared GraphQL client

Example target concept:

```text
QueryId =
  APPLICATION_LIST
  CAPABILITY_LIST
  COMPANY_OVERVIEW
  APPLICATION_COUNT
  CAPABILITY_GAPS
  ASSISTANT_SNAPSHOT
```

The exact `QueryId` set can be expanded incrementally, but the identifier must become the stable lookup key.

### Recommended internal shape

One workable target layout is:

```text
ai-server/
├── artifacts/
│   ├── concept-dictionary/
│   ├── intent-schema/
│   ├── entity-resolution/
│   ├── routing/
│   ├── schema-digest/
│   └── query-catalog/
├── state/
│   ├── ai-runs/
│   ├── audit/
│   ├── agent-config/
│   ├── assistant-plans/
│   └── types/
├── policy/
│   ├── auth/
│   ├── tenant-scope/
│   ├── query-guards/
│   ├── access-control/
│   └── validation/
├── agents/
│   ├── coordinator/
│   ├── data-lookup/
│   ├── document-research/
│   ├── internet-research/
│   ├── quality-control/
│   ├── strategy-generator/
│   ├── assistant/
│   ├── sovereignty/
│   └── http/
├── graph/
│   ├── client/
│   ├── query-ids/
│   ├── queries/
│   ├── builders/
│   ├── executor/
│   ├── scope/
│   └── generated/
└── temporal/
    ├── workflows/
    ├── activities/
    ├── worker/
    ├── client/
    └── types/
```

## 2. Folder Responsibilities

### `artifacts/`

Responsibilities:

- stores versioned, machine-readable architecture contracts
- contains the source artifacts the planner and graph layer depend on
- owns generated `SCHEMA_DIGEST`
- owns the future `QueryId` catalog contract

Must contain:

- concept dictionary
- intent schema
- entity resolution rules
- routing logic
- generated schema digest
- `QueryId` catalog metadata

Must not contain:

- live GraphQL execution code
- Temporal workflow code
- route handlers

### `state/`

Responsibilities:

- encapsulates persisted application state transitions and read/write helpers
- owns `AiRun`, audit event, and `AgentConfig` persistence adapters
- centralizes assistant plan payload persistence and load helpers
- provides typed state DTOs independent of HTTP or Temporal transport

Must not contain:

- LLM prompt construction
- GraphQL query selection policy
- Temporal worker bootstrap

### `policy/`

Responsibilities:

- encodes non-negotiable rules and runtime guards
- validates auth and company access
- validates read-only graph access rules
- enforces tenant scoping before graph execution
- enforces that queries are resolved by `QueryId`
- prevents direct free-form graph execution outside approved adapters

Must contain policies for:

- company access
- token verification boundaries
- query read/write classification
- required company filters
- allowed query registry access

### `agents/`

Responsibilities:

- defines agent behaviors and API-facing orchestration entrypoints
- owns planner behavior, specialized activity behavior, assistant response logic, and HTTP routing composition
- delegates all graph access to `graph/`
- delegates persisted state updates to `state/`
- delegates Temporal wiring to `temporal/`

Must not contain:

- raw GraphQL operation strings for reusable graph queries
- direct persistence mutation logic when that logic belongs to shared state services
- Temporal worker bootstrap code

### `graph/`

Responsibilities:

- the only graph access layer used by agents and workflows
- keeps data lookup GraphQL-based
- owns the shared GraphQL client wrapper
- resolves `QueryId` to query builders or stored GraphQL operations
- applies tenant scope and read-only guards before execution
- normalizes results for agent consumption

Must not contain:

- direct Cypher execution
- Neo4j driver access
- LLM prompt logic unrelated to graph query selection

### `temporal/`

Responsibilities:

- isolates Temporal client, worker, workflows, activity registration, and task queue definitions
- keeps workflow code separate from HTTP concerns
- binds workflow activities to agent/state/graph services

Must not contain:

- route handlers
- artifact generation scripts
- direct assistant UI logic

## 3. Mapping Table: Current Module To Target Location

The table below maps current files to the target structure. This is a design mapping only; no moves are performed by this plan.

| Current file or module                                                 | Current responsibility                     | Target location                                                                                                    | Migration note                                                               |
| ---------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `ai-server/src/index.ts`                                               | HTTP bootstrap                             | `agents/http/server.ts`                                                                                            | Keep root entrypoint as thin wrapper during migration.                       |
| `ai-server/src/graphql/client.ts`                                      | Shared GraphQL transport                   | `graph/client/graphql-client.ts`                                                                                   | Becomes the single graph transport adapter.                                  |
| `ai-server/src/gql/generated.ts`                                       | Generated GraphQL TS types                 | `graph/generated/graphql-types.ts`                                                                                 | Codegen output stays generated, path changes later.                          |
| `ai-server/src/auth/auth-jwks.ts`                                      | JWT verification                           | `policy/auth/auth-jwks.ts`                                                                                         | Policy-owned auth guard.                                                     |
| `ai-server/src/auth/keycloak-service-token.ts`                         | Service-token bootstrap helper             | `policy/auth/service-token.ts`                                                                                     | Keep bootstrap behavior unchanged.                                           |
| `ai-server/src/agents/routes.ts`                                       | Monolithic router and assistant logic      | `agents/http/routes.ts` plus `agents/assistant/*` and `state/*`                                                    | Split by concern incrementally; do not rewrite behavior first.               |
| `ai-server/src/agents/registry.ts`                                     | Agent registry                             | `agents/registry.ts`                                                                                               | Remains agent-layer utility.                                                 |
| `ai-server/src/agents/types.ts`                                        | Cross-cutting workflow and agent types     | `state/types/runtime-types.ts` and `temporal/types/workflow-types.ts`                                              | Split by ownership, not all at once.                                         |
| `ai-server/src/agents/temporal-client.ts`                              | Temporal client and workflow start helpers | `temporal/client/temporal-client.ts`                                                                               | No behavior change.                                                          |
| `ai-server/src/agents/worker.ts`                                       | Worker bootstrap                           | `temporal/worker/worker.ts`                                                                                        | Keep current registration order initially.                                   |
| `ai-server/src/agents/workflows.ts`                                    | Workflow export surface                    | `temporal/workflows/index.ts`                                                                                      | Re-export only.                                                              |
| `ai-server/src/agents/coordinator/workflow.ts`                         | Coordinator workflow                       | `temporal/workflows/coordinator-workflow.ts`                                                                       | Temporal-owned workflow implementation.                                      |
| `ai-server/src/agents/coordinator/activities.ts`                       | Planner, aggregation, run-state updates    | split between `agents/coordinator/*`, `state/ai-runs/*`, `temporal/activities/coordinator.ts`                      | Separate agent logic from state mutations.                                   |
| `ai-server/src/agents/coordinator/intent-schema.v1.0.0.json`           | Intent artifact                            | `artifacts/intent-schema/intent-schema.v1.0.0.json`                                                                | Artifact-owned file.                                                         |
| `ai-server/src/agents/coordinator/agent-routing-logic.v1.0.0.yaml`     | Routing artifact                           | `artifacts/routing/agent-routing-logic.v1.0.0.yaml`                                                                | Artifact-owned file.                                                         |
| `ai-server/src/agents/data-lookup/tools.ts`                            | Typed GraphQL tool layer                   | `graph/queries/query-registry.ts` and `graph/query-ids/*`                                                          | Convert tool names to stable `QueryId`s.                                     |
| `ai-server/src/agents/data-lookup/activities.ts`                       | Data lookup agent logic                    | `agents/data-lookup/data-lookup-agent.ts`                                                                          | Must call graph layer by `QueryId`.                                          |
| `ai-server/src/agents/data-lookup/generated-schema-digest.ts`          | Generated schema digest                    | `artifacts/schema-digest/generated-schema-digest.ts`                                                               | Remains authoritative contract.                                              |
| `ai-server/scripts/generate-schema-digest.mjs`                         | Schema digest generator                    | `artifacts/schema-digest/generate-schema-digest.mjs`                                                               | Generator stays external to runtime.                                         |
| `ai-server/src/agents/data-lookup/concept-dictionary.v1.0.0.json`      | Concept artifact                           | `artifacts/concept-dictionary/concept-dictionary.v1.0.0.json`                                                      | Artifact-owned file.                                                         |
| `ai-server/src/agents/data-lookup/entity-resolution-rules.v1.0.0.json` | Resolution artifact                        | `artifacts/entity-resolution/entity-resolution-rules.v1.0.0.json`                                                  | Artifact-owned file.                                                         |
| `ai-server/src/agents/data-lookup/graph-query-library.v1.0.0.json`     | Cypher artifact                            | `artifacts/query-catalog/legacy-graph-query-library.v1.0.0.json`                                                   | Keep as historical artifact; do not execute at runtime.                      |
| `ai-server/src/agents/document-research/activities.ts`                 | Document research agent                    | `agents/document-research/document-research-agent.ts`                                                              | Agent layer only.                                                            |
| `ai-server/src/agents/internet-research/activities.ts`                 | Internet research agent                    | `agents/internet-research/internet-research-agent.ts`                                                              | Agent layer only.                                                            |
| `ai-server/src/agents/quality-control/activities.ts`                   | QC agent                                   | `agents/quality-control/quality-control-agent.ts`                                                                  | Agent layer only.                                                            |
| `ai-server/src/agents/strategy-generator/activities.ts`                | Strategy generation agent                  | `agents/strategy-generator/strategy-generator-agent.ts`                                                            | Agent layer only.                                                            |
| `ai-server/src/agents/sovereignty/workflow.ts`                         | Sovereignty workflow                       | `temporal/workflows/sovereignty-workflow.ts`                                                                       | Temporal-owned workflow.                                                     |
| `ai-server/src/agents/sovereignty/activities.ts`                       | Sovereignty read/update logic              | split between `graph/query-ids/sovereignty/*`, `state/company-sovereignty/*`, `temporal/activities/sovereignty.ts` | Graph queries and state updates should separate.                             |
| `ai-server/src/agents/shared/agent-config.ts`                          | Persisted `AgentConfig` load/create/cache  | `state/agent-config/agent-config-store.ts`                                                                         | State-owned persistence adapter.                                             |
| `ai-server/src/agents/shared/default-agent-configs.ts`                 | Static agent defaults                      | `artifacts/routing/default-agent-configs.ts` or `agents/config/default-agent-configs.ts`                           | Prefer artifact/config placement if treated as contract; else agents config. |
| `ai-server/src/agents/shared/llm.ts`                                   | LLM helpers                                | `agents/shared/llm.ts`                                                                                             | Shared agent/runtime helper, not graph layer.                                |
| `ai-server/src/agents/shared/web-search.ts`                            | Web search helpers                         | `agents/shared/web-search.ts`                                                                                      | Shared agent/runtime helper.                                                 |
| `ai-server/codegen.ts`                                                 | GraphQL type generation config             | `graph/generated/codegen.ts`                                                                                       | Build-time configuration.                                                    |
| `ai-server/package.json`                                               | Package manifest                           | `ai-server/package.json`                                                                                           | Remains at package root.                                                     |
| `ai-server/tsconfig.json`                                              | Build config                               | `ai-server/tsconfig.json`                                                                                          | Remains at package root.                                                     |
| `ai-server/Dockerfile`                                                 | Container build                            | `ai-server/Dockerfile`                                                                                             | Remains at package root.                                                     |
| `ai-server/src/types/jwks-client.d.ts`                                 | Type declaration shim                      | `policy/auth/types/jwks-client.d.ts`                                                                               | Auth-adjacent declaration.                                                   |

## 4. Safe, Incremental Migration Steps

The sequence below is designed to avoid runtime behavior changes while moving toward the target architecture.

### Phase 1: Introduce structure without moving behavior

1. Create empty target folders: `artifacts/`, `state/`, `policy/`, `agents/`, `graph/`, `temporal/`.
2. Add a migration README in each target folder describing responsibility boundaries.
3. Keep current runtime imports untouched.

Safe outcome:

- no runtime behavior changes
- the target architecture becomes explicit in the repository

### Phase 2: Introduce `QueryId` registry alongside current tools

1. Define a `QueryId` enum or string union in `graph/query-ids/query-ids.ts`.
2. Wrap existing typed GraphQL tools in a `QueryId` registry without deleting tool names.
3. Add a compatibility map: current tool name -> `QueryId`.
4. Keep current `performDataLookup(...)` behavior, but resolve typed tools through the registry internally.

Safe outcome:

- no external API changes
- typed data access becomes addressable by `QueryId`

### Phase 3: Move artifact ownership first

1. Move or duplicate versioned JSON/YAML artifacts into `artifacts/`.
2. Update coordinator and data-lookup loaders to read from the new artifact paths through a single artifact loader module.
3. Keep file contents identical.

Safe outcome:

- runtime semantics stay unchanged
- artifact ownership becomes explicit and centralized

### Phase 4: Make `SCHEMA_DIGEST` contract-owned

1. Move the generated digest file and its generator under `artifacts/schema-digest/`.
2. Add a tiny compatibility re-export at the old path during transition.
3. Document that `SCHEMA_DIGEST` is authoritative for graph-readable shape.

Safe outcome:

- generator output location becomes intentional
- existing imports continue to work during transition

### Phase 5: Extract graph access layer

1. Move `graphqlRequest(...)` into `graph/client/`.
2. Move typed tool query definitions into `graph/queries/`.
3. Add `graph/executor/executeQueryById(...)`.
4. Move tenant-scope helpers into `policy/tenant-scope/` and call them from graph execution.
5. Keep the same GraphQL documents and variables.

Safe outcome:

- graph access remains GraphQL-based
- query execution becomes centrally governable

### Phase 6: Extract state adapters

1. Move `AiRun` lifecycle mutations and audit event persistence into `state/ai-runs/` and `state/audit/`.
2. Move `AgentConfig` persistence into `state/agent-config/`.
3. Update routes and workflow activities to call state services instead of embedding persistence logic directly.

Safe outcome:

- persistence logic becomes reusable
- route and workflow files shrink without behavior changes

### Phase 7: Split `routes.ts` by boundary

1. Extract assistant-specific logic into `agents/assistant/`.
2. Extract route composition into `agents/http/routes.ts`.
3. Keep the public HTTP route shapes unchanged.
4. Move access checks into `policy/access-control/`.

Safe outcome:

- same endpoints
- smaller modules and clearer ownership

### Phase 8: Move Temporal ownership

1. Move worker, client, workflow exports, and workflow files into `temporal/`.
2. Keep root wrappers or path-compatible re-exports until all imports are updated.

Safe outcome:

- no worker behavior change
- Temporal code becomes isolated from HTTP and graph concerns

### Phase 9: Retire free-form generic query execution gradually

1. Keep current generic GraphQL fallback initially for compatibility.
2. Add logging to observe which questions still require fallback.
3. Incrementally replace common fallback cases with new `QueryId` definitions.
4. Change fallback from “generate arbitrary GraphQL” to “select `QueryId` + typed arguments” only after coverage is sufficient.

Safe outcome:

- no immediate behavior break
- system moves from prompt-shaped execution toward deterministic execution

## 5. Expected Breaking Changes And Mitigations

### Breaking change risk: import paths will shift

Impact:

- internal imports across coordinator, routes, worker, and shared modules will break once files move.

Mitigation:

- introduce compatibility re-exports first
- move files behind stable facades before deleting old paths

### Breaking change risk: current data-lookup tool names are not `QueryId`s

Impact:

- agent code and tests that assume string tool names may not match the new graph registry.

Mitigation:

- add a compatibility layer mapping existing tool names to `QueryId`
- migrate call sites gradually

### Breaking change risk: artifact file paths are currently hardcoded

Impact:

- coordinator activities and data-lookup code currently resolve files from `src/...`

Mitigation:

- introduce a shared artifact loader module first
- switch code to the loader before physically relocating artifact files

### Breaking change risk: `SCHEMA_DIGEST` path changes may break generation or imports

Impact:

- generator scripts and runtime imports may fail if the generated file moves without compatibility handling.

Mitigation:

- move generator and generated file together
- keep a compatibility re-export at the original import path during migration

### Breaking change risk: route splitting can unintentionally change HTTP behavior

Impact:

- request validation, auth checks, response payloads, or error shapes may drift when extracting `routes.ts`

Mitigation:

- preserve endpoint shapes exactly
- move code behind route handlers before rewriting logic
- validate responses against current UI call sites

### Breaking change risk: token and tenant-scope enforcement may diverge across layers

Impact:

- extracting policy and graph modules can accidentally drop company scoping or duplicate checks inconsistently.

Mitigation:

- centralize company-scope injection in `graph/` and `policy/tenant-scope/`
- add regression checks around company filter presence before changing call sites

### Breaking change risk: Temporal activity bindings may break if logic is split too early

Impact:

- worker registration depends on concrete exported activity names today.

Mitigation:

- keep exported activity function names stable until worker bindings are updated
- move implementation behind adapters, not by renaming contracts first

### Breaking change risk: legacy Cypher artifacts may be mistaken for active runtime features

Impact:

- future contributors may wire in direct Cypher execution, violating the target constraints.

Mitigation:

- label the legacy graph query library as non-runtime and historical
- add policy-layer documentation stating that direct Cypher execution is forbidden in `ai-server`

### Breaking change risk: generic GraphQL fallback currently covers unknown queries

Impact:

- moving too quickly to `QueryId`-only execution could reduce answer coverage.

Mitigation:

- maintain the fallback until sufficient `QueryId` coverage exists
- instrument fallback usage and migrate by observed demand

## 6. Recommended First Milestone

The safest first milestone is:

1. create the target folder skeleton
2. introduce a `QueryId` registry that wraps existing typed GraphQL tools
3. add a shared artifact loader
4. move no behavior yet

That milestone establishes the new architecture without touching public routes, Temporal behavior, or actual query semantics.
