# Runtime Environment Configuration for Simple EAM

This project uses **runtime environment variables** instead of build-time variables. This means you can change configuration without rebuilding the application.

## How it Works

### Server (GraphQL API)

The server reads environment variables directly from `process.env` at runtime. Simply update the `.env` file and restart the server container.

### Client (Next.js Frontend)

The client uses a special runtime configuration system:

1. Configuration is loaded from `/api/config` endpoint at runtime
2. The API endpoint reads from environment variables (without `NEXT_PUBLIC_` prefix)
3. No rebuild needed - just restart the client container

## Environment Variables

### Server Configuration

- `NEO4J_URI` - Neo4j database connection URI
- `NEO4J_USER` - Neo4j username
- `NEO4J_PASSWORD` - Neo4j password
- `KEYCLOAK_URL` - Keycloak server URL
- `KEYCLOAK_REALM` - Keycloak realm name
- `KEYCLOAK_CLIENT_ID_SERVER` - Keycloak client ID for server
- `PORT` - Server port (default: 4000)

### Client Configuration

- `GRAPHQL_URL` - GraphQL API endpoint URL
- `KEYCLOAK_URL` - Keycloak server URL
- `KEYCLOAK_REALM` - Keycloak realm name
- `KEYCLOAK_CLIENT_ID` - Keycloak client ID
- `THEME_PRIMARY_COLOR` - Primary theme color (hex)
- `THEME_SECONDARY_COLOR` - Secondary theme color (hex)
- `THEME_FONT_FAMILY` - Font family
- `LOGO_PATH` - Path to logo image
- `LOGO_NAME` - Application name
- `EXCALIDRAW_WS_SERVER_URL` - Excalidraw collaboration server URL
- `DEBUG_MODE` - Enable debug mode (true/false)

## Docker Configuration

The runtime configuration is injected via environment variables in `docker-compose.yml`:

```yaml
services:
  client:
    environment:
      - GRAPHQL_URL=${GRAPHQL_URL}
      - KEYCLOAK_URL=${KEYCLOAK_URL}
      # ... other variables
```
