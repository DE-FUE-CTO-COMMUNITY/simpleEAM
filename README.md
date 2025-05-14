# Simple-EAM: Enterprise Architecture Management

Ein skalierbares Enterprise Architecture Management System, das aus mehreren Docker-Containern besteht und moderne Webtechnologien nutzt.

## Projektübersicht

Dieses Mono-Repository enthält alle Komponenten des Simple-EAM Systems:

- **Neo4j-Datenbank**: Graphdatenbank für die Speicherung des Enterprise Architecture Models
- **GraphQL-Server**: API-Schicht für effiziente Datenkommunikation
- **Keycloak**: Identitäts- und Zugriffsverwaltung
- **Next.js-Frontend**: Moderne, responsive Benutzeroberfläche

## Projektstruktur

```
simple-eam/
├── auth/                   # Keycloak-Konfiguration
│   └── src/                # Keycloak-Anpassungen
├── client/                 # Next.js-Frontend
│   └── src/
│       ├── app/            # Next.js App Router
│       └── components/     # React-Komponenten
├── db/                     # Neo4j-Datenbank
│   └── src/                # Datenbankskripte, Seed-Dateien
├── server/                 # GraphQL-Server
│   └── src/                # Server-Quellcode
└── docker-compose.yml      # Docker-Konfiguration für alle Services
```

## Technologie-Stack

- **Frontend**: Next.js 15, Material UI 7, Excalidraw, TanStack Table/Form, Internationalisierung
- **Backend**: GraphQL, Neo4j, Keycloak
- **Infrastruktur**: Docker, Docker Compose

## Erste Schritte

### Voraussetzungen

- Docker und Docker Compose installiert
- Node.js (empfohlene Version: 20.x oder höher)
- Git

### Installation

1. Repository klonen:
   ```bash
   git clone https://your-repository-url/simple-eam.git
   cd simple-eam
   ```

2. System starten:
   ```bash
   docker-compose up -d
   ```

3. Auf die verschiedenen Komponenten zugreifen:
   - Frontend: http://localhost:3000
   - GraphQL-Server: http://localhost:4000/graphql
   - Neo4j-Browser: http://localhost:7474
   - Keycloak-Admin: http://localhost:8080

## Entwicklung

Jede Komponente kann unabhängig entwickelt werden:

- **Client**: Im `client`-Verzeichnis arbeiten
- **Server**: Im `server`-Verzeichnis arbeiten
- **Datenbank**: Skripte im `db/src`-Verzeichnis pflegen
- **Auth**: Keycloak-Konfigurationen im `auth/src`-Verzeichnis anpassen

## Branching-Strategie

Wir empfehlen die folgende Branching-Strategie für dieses Mono-Repository:

- `main` - Produktionscode
- `develop` - Entwicklungszweig
- `feature/*` - Neue Features
- `bugfix/*` - Fehlerbehebungen
- `release/*` - Release-Kandidaten

## Lizenz

[MIT Lizenz](LICENSE)