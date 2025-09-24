# Simple-EAM (Enterprise Architecture Management)

> **🤖 AI-Generated Project**: Dieser Code wurde vollständig mit GitHub Copilot im Agent-Modus erstellt. Das gesamte Projekt, einschließlich Architektur, Implementation und Dokumentation, wurde durch AI-gestützte Entwicklung realisiert.

Ein modernes Enterprise Architecture Management System, das Unternehmen dabei unterstützt, ihre IT-Landschaft zu verwalten, zu visualisieren und zu optimieren.

## 🚀 Features

- **Grafische Darstellung**: Visualisierung von IT-Architekturen mit Excalidraw
- **Komponenten-Management**: Verwaltung von Anwendungen, Services, Datenbanken und Infrastruktur
- **Relationship-Mapping**: Darstellung von Abhängigkeiten zwischen Komponenten
- **Multi-Language Support**: Deutsch und Englisch
- **Moderne Tech-Stack**: Next.js 15, Material-UI 7, Neo4j, GraphQL

## 🛠️ Technologie-Stack

### Frontend

- **Next.js 15**: React-Framework mit App Router
- **Material-UI 7**: UI-Komponentenbibliothek
- **TypeScript**: Typsichere Entwicklung
- **Tanstack Table V8**: Erweiterte Tabellenfunktionen
- **Tanstack Form**: Leistungsstarke Formularerstellung
- **Apollo Client**: GraphQL-Client
- **Excalidraw**: Diagramm-Editor

### Backend

- **GraphQL**: API-Schicht
- **Neo4j**: Graphdatenbank für Architekturmodelle
- **Node.js**: Server-Runtime

### Infrastructure

- **Docker**: Containerisierung
- **Keycloak**: Authentifizierung und Autorisierung
- **Yarn Berry**: Paketmanager

## 📋 Voraussetzungen

- Node.js 18+
- Docker & Docker Compose
- Yarn Berry (wird automatisch konfiguriert)

## 🚀 Installation

1. **Repository klonen**

```bash
git clone https://github.com/marcus-friedrich/simple-eam.git
cd simple-eam
```

2. **Dependencies installieren**

```bash
yarn install
```

3. **Umgebungsvariablen konfigurieren**

```bash
cp env.sample .env
# Anpassen der Variablen nach Bedarf
```

4. **Docker Services starten**

```bash
docker-compose up -d
```

5. **Development Server starten**

```bash
cd client
yarn dev
```

Die Anwendung ist dann verfügbar unter: http://localhost:3000

## 📁 Projektstruktur

```
simple-eam/
├── auth/                   # Keycloak-Konfiguration
├── client/                 # Next.js-Frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React-Komponenten
│   │   └── graphql/       # GraphQL-Queries
├── db/                     # Neo4j-Datenbank
├── server/                 # GraphQL-Server
├── templates/              # Entity-Templates
├── scripts/               # Automatisierungsscripts
└── docs/                  # Dokumentation
```

## 🎯 Entity-Generierung

Das Projekt verwendet ein Template-System zur automatischen Generierung neuer Entities:

```bash
./scripts/create-entity.sh [entity-name]
```

Beispiel:

```bash
./scripts/create-entity.sh companies
```

## 🔧 Entwicklung

### Verfügbare Scripts

```bash
# Frontend Development
yarn dev              # Startet den Development Server
yarn build            # Erstellt eine Production Build
yarn lint             # Führt ESLint aus

# Entity Management
./scripts/create-entity.sh [name]  # Erstellt neue Entity

# Docker
docker-compose up -d   # Startet alle Services
docker-compose down    # Stoppt alle Services
```

### Code-Standards

- **TypeScript**: Strenge Typisierung
- **ESLint**: Code-Qualität
- **Prettier**: Code-Formatierung
- **Conventional Commits**: Standardisierte Commit-Messages

## 📚 Dokumentation

Detaillierte Dokumentation finden Sie im [`docs/`](./docs/) Verzeichnis:

- [Architektur-Übersicht](./docs/README.md)
- [Entity-Pattern](./docs/ENTITY-IMPLEMENTATION-PATTERN.md)
- [Entwicklungs-Guidelines](./docs/CONTRIBUTING.md)

## 🌐 Services

- **Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:4000/graphql
- **Neo4j Browser**: http://localhost:7474
- **Keycloak Admin**: http://localhost:8080

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne eine Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Copyright (c) 2025 Atos. Siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Acknowledgments

- Erstellt mit GitHub Copilot Agent-Modus
- Material-UI für die UI-Komponenten
- Neo4j für die Graphdatenbank
- Excalidraw für die Diagramm-Funktionalität
