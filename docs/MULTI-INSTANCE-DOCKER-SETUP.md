# Multi-Instanz Docker Setup für Simple-EAM

## Übersicht

Das Simple-EAM System wurde so konfiguriert, dass mehrere Instanzen parallel auf demselben Docker-Host ausgeführt werden können. Dies wird durch die Verwendung von Umgebungsvariablen für Container-Namen und Netzwerke erreicht.

## Funktionsweise

### Automatische Container-Namen

- Docker Compose generiert automatisch eindeutige Container-Namen basierend auf:
  - Projekt-Name (COMPOSE_PROJECT_NAME oder Verzeichnisname)
  - Service-Name
  - Instanz-Nummer

### Konfigurierbare Netzwerke

- Netzwerk-Namen verwenden die Variable `${COMPOSE_PROJECT_NAME:-simple-eam}-network`
- Jede Instanz erhält ihr eigenes isoliertes Netzwerk

## Mehrere Instanzen starten

### Option 1: Verschiedene Verzeichnisse

```bash
# Instanz 1
cd /path/to/simple-eam-instance1
docker compose up -d

# Instanz 2
cd /path/to/simple-eam-instance2
docker compose up -d
```

### Option 2: Umgebungsvariable COMPOSE_PROJECT_NAME

```bash
# Instanz 1
COMPOSE_PROJECT_NAME=simple-eam-dev docker compose up -d

# Instanz 2
COMPOSE_PROJECT_NAME=simple-eam-staging docker compose up -d

# Instanz 3
COMPOSE_PROJECT_NAME=simple-eam-prod docker compose up -d
```

### Option 3: Docker Compose Projekt-Flag

```bash
# Instanz 1
docker compose -p simple-eam-dev up -d

# Instanz 2
docker compose -p simple-eam-staging up -d

# Instanz 3
docker compose -p simple-eam-prod up -d
```

## Wichtige Konfigurationspunkte

### Umgebungsvariablen anpassen

Jede Instanz benötigt ihre eigenen Ports und Domains:

```bash
# Instanz 1 (.env)
NEO4J_EXTERNAL_PORT=7474
NEO4J_EXTERNAL_BOLT_PORT=7687
GRAPHQL_EXTERNAL_PORT=4000
CLIENT_SUBDOMAIN=dev-app
API_SUBDOMAIN=dev-api
AUTH_SUBDOMAIN=dev-auth
NEO4J_SUBDOMAIN=dev-neo4j

# Instanz 2 (.env)
NEO4J_EXTERNAL_PORT=7475
NEO4J_EXTERNAL_BOLT_PORT=7688
GRAPHQL_EXTERNAL_PORT=4001
CLIENT_SUBDOMAIN=staging-app
API_SUBDOMAIN=staging-api
AUTH_SUBDOMAIN=staging-auth
NEO4J_SUBDOMAIN=staging-neo4j
```

### Daten-Verzeichnisse isolieren

Für separate Datenbestände sollten verschiedene Volume-Pfade verwendet werden:

```bash
# Instanz 1
./db/data:/data
./auth/data:/var/lib/postgresql/data

# Instanz 2
./db-staging/data:/data
./auth-staging/data:/var/lib/postgresql/data
```

## Beispiel-Befehle

### Status aller Instanzen prüfen

```bash
docker ps --filter "name=simple-eam"
```

### Spezifische Instanz verwalten

```bash
# Mit Projekt-Name
docker compose -p simple-eam-dev ps
docker compose -p simple-eam-dev logs
docker compose -p simple-eam-dev down

# Mit Umgebungsvariable
COMPOSE_PROJECT_NAME=simple-eam-dev docker compose ps
```

### Logs einer spezifischen Instanz

```bash
docker compose -p simple-eam-dev logs -f
```

## Container-Namen-Schema

Mit der neuen Konfiguration werden Container automatisch benannt als:

- `{projekt-name}-{service-name}-{nummer}`

Beispiele:

- `simple-eam-dev-neo4j-1`
- `simple-eam-dev-server-1`
- `simple-eam-staging-keycloak-1`

## Netzwerk-Isolation

Jede Instanz erhält ihr eigenes Docker-Netzwerk:

- `simple-eam-dev-network`
- `simple-eam-staging-network`
- `simple-eam-prod-network`

## Best Practices

1. **Konsistente Namensgebung**: Verwenden Sie aussagekräftige Projekt-Namen
2. **Port-Konflikte vermeiden**: Stellen Sie sicher, dass externe Ports eindeutig sind
3. **Daten-Isolation**: Verwenden Sie separate Volume-Pfade für verschiedene Umgebungen
4. **Umgebungsvariablen**: Nutzen Sie separate `.env`-Dateien für jede Instanz
5. **Monitoring**: Überwachen Sie Ressourcenverbrauch bei mehreren Instanzen

## Troubleshooting

### Port bereits in Verwendung

```bash
# Prüfen welcher Prozess den Port verwendet
sudo netstat -tulpn | grep :7474
```

### Container-Konflikte

```bash
# Alle Container einer Instanz stoppen
docker compose -p simple-eam-dev down

# Alle Simple-EAM Container anzeigen
docker ps -a --filter "name=simple-eam"
```

### Netzwerk-Probleme

```bash
# Netzwerke auflisten
docker network ls | grep simple-eam

# Netzwerk-Details anzeigen
docker network inspect simple-eam-dev-network
```
