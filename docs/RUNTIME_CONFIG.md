# Runtime Environment Configuration for NextGen EAM

NextGen EAM uses **runtime environment variables** instead of build-time `NEXT_PUBLIC_*` variables. You can change runtime behavior by editing `.env` and restarting containers.

## Runtime Services

### `server` (GraphQL API)

The `server` container exposes the GraphQL API and reads its configuration from `process.env` at startup.

### `ai-server` (AI REST API)

The `ai-server` container exposes AI REST endpoints (for example `/ai-runs`) and communicates with the GraphQL API (not directly with Neo4j).

LLM provider access is resolved per company from the persisted company fields `llmUrl`, `llmModel`, and `llmKey`. There is no global `AI_LLM_URL` runtime variable for selecting the model endpoint.

### `ai-worker` (Temporal worker)

The `ai-worker` container executes AI workflows and activities and updates run state through GraphQL.

### `analytics-worker` (Temporal worker)

The `analytics-worker` container executes analytics projection refresh workflows against the GraphQL analytics endpoints.

### `analytics-scheduler` (Temporal schedule reconciler)

The `analytics-scheduler` container keeps the analytics projection refresh schedule registered in Temporal when scheduled refresh is enabled.

### `clickhouse` and `cube` (analytics query stack)

`clickhouse` stores flattened analytics projections. `cube` exposes those projections as analytics measures and dimensions, while `cubestore` provides query acceleration and cache persistence.

### `client` (Next.js frontend)

The client fetches runtime config from `/api/runtime-config`, so frontend endpoints and branding can be updated without rebuilding the image.

## Runtime Profiles And Shared Services

AI services are profile-based and optional:

- `ai-server` and `ai-worker` are in the `ai` profile.
- Start AI stack explicitly with:

```bash
COMPOSE_PROFILES=ai docker compose up -d
```

- `temporal`, `temporal-db`, `temporal-ui`, `analytics-worker`, `analytics-scheduler`, `clickhouse`, `cube`, and `cubestore` are part of the standard stack because analytics depends on them.
- Enabling the AI profile only starts the AI workloads. End-user AI execution still depends on company-level LLM configuration in the application data.

## Key Runtime Variables

### GraphQL Server (`server`)

- `GRAPHQL_INTERNAL_PORT` - Internal GraphQL port (default `4000`)
- `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD` - Neo4j connection for GraphQL service
- `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID_SERVER` - Auth validation settings

### AI Server / Worker (`ai-server`, `ai-worker`)

- `GRAPHQL_INTERNAL_URL` - Internal GraphQL endpoint used by AI services (e.g. `http://server:4000/graphql`)
- `AI_SERVER_INTERNAL_PORT`, `AI_SERVER_EXTERNAL_PORT` - AI server port mapping
- `AI_RUN_TASK_QUEUE`, `TEMPORAL_ADDRESS`, `TEMPORAL_NAMESPACE` - Temporal runtime settings
- `AI_LLM_TIMEOUT_MS`, `AI_LLM_RETRY_COUNT`, `AI_ALLOW_LLM_FALLBACK` - LLM behavior controls
- `AI_WEB_SOURCE_COUNT`, `AI_WEB_SEARCH_RESULT_COUNT`, `AI_WEB_FETCH_TIMEOUT_MS` - Web research settings
- `AI_SEARCH_PROVIDERS`, `AI_SEARCH_SEARXNG_URL`, `AI_SEARCH_SEARXNG_API_KEY` - Search provider settings
- `AI_AGENT_CONFIG_BOOTSTRAP_CLIENT_ID`, `AI_AGENT_CONFIG_BOOTSTRAP_CLIENT_SECRET` - Optional bootstrap credentials for persisted agent configuration seeding

### Company-Level AI Configuration

- `Company.llmUrl` - LLM endpoint for the selected company
- `Company.llmModel` - LLM model identifier for the selected company
- `Company.llmKey` - API key or token for the selected company

These values are maintained in the application data model and are edited through company management, not through root-level environment variables.

### Analytics Runtime (`server`, `analytics-worker`, `analytics-scheduler`, `clickhouse`, `cube`)

- `ANALYTICS_ENABLED` - Enables analytics UI runtime features in the client
- `ANALYTICS_API_URL` - Public analytics API base URL used by the frontend
- `ANALYTICS_CUBE_API_URL` - Public Cube API base URL used by the analytics workspace
- `ANALYTICS_SYNC_URL` - Internal sync endpoint used by the analytics worker
- `ANALYTICS_PROJECTION_TASK_QUEUE` - Temporal queue for analytics projection refresh workflows
- `ANALYTICS_PROJECTION_SCHEDULE_ENABLED` - Enables scheduled analytics refresh registration
- `ANALYTICS_PROJECTION_SCHEDULE_ID` - Stable Temporal schedule identifier for projection refreshes
- `ANALYTICS_PROJECTION_SCHEDULE_INTERVAL` - Temporal schedule interval, for example `1 hour`
- `ANALYTICS_PROJECTION_MAX_CONCURRENCY` - Maximum parallel company refreshes in one workflow run
- `CLICKHOUSE_URL`, `CLICKHOUSE_DB`, `CLICKHOUSE_USER`, `CLICKHOUSE_PASSWORD` - ClickHouse connection settings used by the server
- `CLICKHOUSE_HTTP_EXTERNAL_PORT`, `CLICKHOUSE_NATIVE_EXTERNAL_PORT` - Host port mappings for ClickHouse
- `CUBEJS_API_SECRET`, `CUBEJS_EXTERNAL_PORT` - Cube API security and port mapping
- `CUBESTORE_HTTP_EXTERNAL_PORT`, `CUBESTORE_META_EXTERNAL_PORT` - CubeStore host ports
- `TEMPORAL_ADDRESS`, `TEMPORAL_NAMESPACE`, `TEMPORAL_UI_EXTERNAL_PORT` - Shared Temporal runtime settings for analytics and AI

### Client Runtime (`client`)

- `GRAPHQL_URL` - Public GraphQL URL for browser/API routes
- `AI_API_URL` - Public AI API base URL (used for `/ai-runs` calls)
- `ANALYTICS_ENABLED` - Enables analytics navigation and workspace runtime features
- `ANALYTICS_API_URL`, `ANALYTICS_CUBE_API_URL` - Analytics endpoints used by the analytics workspace
- `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID_CLIENT` - Client auth setup
- `EXCALIDRAW_WS_SERVER_URL` - Collaboration endpoint
- `THEME_PRIMARY_COLOR`, `THEME_SECONDARY_COLOR`, `THEME_FONT_FAMILY` - Runtime branding
- `LOGO_URL`, `LOGO_ALT`, `LOGO_DARK_URL`, `LOGO_LENGTH`, `FAVICON_URL` - Runtime logo and favicon configuration

## Runtime Config Endpoint

The frontend consumes runtime values via:

- `GET /api/runtime-config`

This endpoint returns the effective runtime config object used by hooks such as runtime GraphQL and AI API configuration.

## Related Components

- Analytics UI entry point: `client/src/app/[lang]/analytics/page.tsx`
- Analytics workspace: `client/src/components/analytics/AnalyticsWorkspace.tsx`
- Analytics routes: `server/src/analytics/routes.ts`
- Analytics projection sync logic: `server/src/analytics/projections.ts`
- Analytics runtime worker/scheduler: `analytics/runtime`
- Company AI configuration UI: `client/src/components/companies/CompanyForm.tsx`
- AI execution route with company LLM resolution: `ai-server/src/agents/routes.ts`
