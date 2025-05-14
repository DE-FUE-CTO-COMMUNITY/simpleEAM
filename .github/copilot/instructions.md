# Simple-EAM (Enterprise Architecture Management)

## Projektübersicht

Dies ist ein Enterprise Architecture Management (EAM) System mit folgenden Komponenten:

- Neo4j-Datenbank für Grafenspeicherung
- GraphQL-Server für API-Funktionalität
- Keycloak für Authentifizierung und Autorisierung
- Next.js-Frontend für die Benutzeroberfläche

Alle Komponenten werden in separaten Docker-Containern bereitgestellt.

## Technologie-Stack

### Backend & Datenbanken

- **Neo4j**: Graphdatenbank für die Speicherung des Enterprise Architecture Models
- **GraphQL**: API-Schicht für effiziente Datenkommunikation
- **Keycloak**: Identitäts- und Zugriffsverwaltung

### Frontend

- **Next.js 15**: React-Framework für serverseitiges Rendering und optimierte Client-Anwendungen
- **Material UI 7**: UI-Komponentenbibliothek für ein konsistentes und ansprechendes Design
- **Excalidraw**: Für visuelle Diagramme und Zeichnungen
- **Tanstack Table**: Für fortschrittliche Tabellenfunktionen
- **Tanstack Form**: Für einfache und leistungsstarke Formularerstellung
- **Internationalisierungs-Bibliothek**: next-intl für mehrsprachigen Support
- **Excel-Bibliothek**: SheetJS (xlsx) für Import und Export von Excel-Dateien

## Best Practices

### TypeScript

- Strenge Typisierung für alle Komponenten und Funktionen verwenden
- Interface über Type bevorzugen, außer bei Union-Typen
- readonly-Attribute nutzen, wo sinnvoll
- Utility-Types wie Partial<T>, Pick<T>, Omit<T> aktiv einsetzen
- Null-Assertions (!) vermeiden, stattdessen ordnungsgemäße Null-Checks implementieren
- Enums vermeiden, stattdessen Union-Typen mit as const verwenden

### GraphQL

- Schema-First-Entwicklung befolgen
- Resolver modular organisieren
- Datenlader-Muster implementieren, um N+1-Probleme zu vermeiden
- Pagination für große Datenmengen implementieren
- Verschachtelte Objekte mit Fragment-Colocation abfragen
- Beziehungen effizient über Neo4j-Graphenstrukturen abbilden

### Next.js 15

- App Router für Routing und Layout-Verwaltung verwenden
- Server Components wo immer möglich einsetzen
- Optimale Image-Optimierung mit next/image
- Caching-Strategien gezielt einsetzen: force-cache, no-store, etc.
- SEO-Optimierung durch Metadata API
- Streaming-Strategien für verbesserte Benutzererfahrung

### Material UI 7

- Theme-Provider für konsistentes Styling verwenden
- System-API für responsives Design nutzen
- Custom Theme-Erweiterungen für Projektspezifische Design-Tokens
- Stack und Grid für Layout-Aufbau bevorzugen
- React Server Components Patterns für MUI-Komponenten anwenden
- Barrierefreiheit nach WCAG-Standards gewährleisten

### Paketmanager

- als Paketmanager yarn verwenden

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

## Entwicklungsrichtlinien

- Flache Verzeichnisstruktur beibehalten
- Code in jeweiligen src-Verzeichnissen organisieren
- Feature-basierte Organisation innerhalb der Komponentenverzeichnisse
- Tests parallel zur Implementierung in **tests**-Ordnern
- Konsistente Namenskonventionen: camelCase für Variablen und Funktionen, PascalCase für Komponenten und Klassen
