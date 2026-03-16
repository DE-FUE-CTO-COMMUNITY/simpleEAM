# Runtime Environment Configuration for NextGen EAM

NextGen EAM uses **runtime environment variables** instead of build-time `NEXT_PUBLIC_*` variables. You can change runtime behavior by editing `.env` and restarting containers.

## Runtime Services

### `server` (GraphQL API)

The `server` container exposes the GraphQL API and reads its configuration from `process.env` at startup.

### `ai-server` (AI REST API)

The `ai-server` container exposes AI REST endpoints (for example `/ai-runs`) and communicates with the GraphQL API (not directly with Neo4j).

### `ai-worker` (Temporal worker)

The `ai-worker` container executes AI workflows and activities and updates run state through GraphQL.

### `client` (Next.js frontend)

The client fetches runtime config from `/api/runtime-config`, so frontend endpoints and branding can be updated without rebuilding the image.

## AI Profile Behavior

AI services are profile-based and optional:

- `ai-server`, `ai-worker`, `temporal`, `temporal-db`, and `temporal-ui` are in the `ai` profile.
- Start AI stack explicitly with:

```bash
COMPOSE_PROFILES=ai docker compose up -d
```

- If `AI_LLM_URL` and `AI_API_URL` are empty, AI functionality stays disabled in runtime configuration.

## Key Runtime Variables

### GraphQL Server (`server`)

- `GRAPHQL_INTERNAL_PORT` - Internal GraphQL port (default `4000`)
- `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD` - Neo4j connection for GraphQL service
- `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID_SERVER` - Auth validation settings

### AI Server / Worker (`ai-server`, `ai-worker`)

- `GRAPHQL_INTERNAL_URL` - Internal GraphQL endpoint used by AI services (e.g. `http://server:4000/graphql`)
- `AI_SERVER_INTERNAL_PORT`, `AI_SERVER_EXTERNAL_PORT` - AI server port mapping
- `AI_RUN_TASK_QUEUE`, `TEMPORAL_ADDRESS`, `TEMPORAL_NAMESPACE` - Temporal runtime settings
- `AI_LLM_URL`, `AI_LLM_MODEL`, `AI_LLM_API_KEY` - LLM provider settings
- `AI_LLM_TIMEOUT_MS`, `AI_LLM_RETRY_COUNT`, `AI_ALLOW_LLM_FALLBACK` - LLM behavior controls
- `AI_WEB_SOURCE_COUNT`, `AI_WEB_SEARCH_RESULT_COUNT`, `AI_WEB_FETCH_TIMEOUT_MS` - Web research settings
- `AI_SEARCH_PROVIDERS`, `AI_SEARCH_SEARXNG_URL`, `AI_SEARCH_SEARXNG_API_KEY` - Search provider settings

### Client Runtime (`client`)

- `GRAPHQL_URL` - Public GraphQL URL for browser/API routes
- `AI_API_URL` - Public AI API base URL (used for `/ai-runs` calls)
- `AI_LLM_URL` - Used by UI feature gating for AI navigation/support visibility
- `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID_CLIENT` - Client auth setup
- `EXCALIDRAW_WS_SERVER_URL` - Collaboration endpoint
- `THEME_PRIMARY_COLOR`, `THEME_SECONDARY_COLOR`, `THEME_FONT_FAMILY` - Runtime branding
- `LOGO_URL`, `LOGO_ALT` - Runtime logo configuration

## Runtime Config Endpoint

The frontend consumes runtime values via:

- `GET /api/runtime-config`

This endpoint returns the effective runtime config object used by hooks such as runtime GraphQL and AI API configuration.
