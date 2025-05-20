# Simple-EAM: Enterprise Architecture Management

Ein skalierbares Enterprise Architecture Management System, das aus mehreren Docker-Containern besteht und moderne Webtechnologien nutzt.

> **Hinweis für GitHub Copilot**: In diesem Projekt wird ausschließlich Yarn als Paketmanager verwendet. Bei allen Installationsbefehlen bitte immer Yarn-Syntax verwenden, nicht npm.

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

> **Wichtig für Material UI 7**: Wir verwenden die neue Grid v2 API, die sich deutlich von der Legacy Grid-Komponente unterscheidet. Bitte verwenden Sie `size` statt `xs/sm/md`, `<Grid container sx={{ width: '100%' }}>` für Container, und Stack für vertikale Layouts. Siehe [Beispielkomponente](./client/src/components/common/GridV2Example.tsx) und [Dokumentation](https://mui.com/material-ui/migration/upgrade-to-grid-v2/).

> **Wichtig für Tanstack Table**: Wir verwenden Tanstack Table V8, das sich deutlich von React Table v7 unterscheidet. Bitte verwenden Sie `useReactTable` statt `useTable`, `flexRender` für Zellen-Rendering, und explizites State-Management. Siehe [Beispielkomponente](./client/src/components/common/TanstackTableExample.tsx) und [Dokumentation](https://tanstack.com/table/latest/docs/guide/migrating).

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

2. Abhängigkeiten installieren:

   ```bash
   yarn
   ```

3. System starten:

   ```bash
   docker-compose up -d
   ```

4. Auf die verschiedenen Komponenten zugreifen:
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

**Wichtig:** In diesem Projekt verwenden wir **yarn** als Paketmanager. Bitte verwenden Sie keine npm-Befehle. Weitere Details finden Sie in der [YARN.md](./YARN.md) Dokumentation.

## Branching-Strategie

Wir empfehlen die folgende Branching-Strategie für dieses Mono-Repository:

- `main` - Produktionscode
- `develop` - Entwicklungszweig
- `feature/*` - Neue Features
- `bugfix/*` - Fehlerbehebungen
- `release/*` - Release-Kandidaten

## Lizenz

[MIT Lizenz](LICENSE)
