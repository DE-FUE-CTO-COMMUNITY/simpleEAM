---
applyTo: '**'
---

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

- **Next.js 15**: React-Framework für serverseitiges Rendering und optimierte Client-Anwendungen ([Dokumentation](https://nextjs.org/docs/app/guides/upgrading/version-15))
- **Material UI 7**: UI-Komponentenbibliothek für ein konsistentes und ansprechendes Design ([Integration mit Next.js](https://mui.com/material-ui/integrations/nextjs/))
- **Excalidraw**: Für visuelle Diagramme und Zeichnungen
- **Tanstack Table**: Für fortschrittliche Tabellenfunktionen ([Migrationsleitfaden](https://tanstack.com/table/latest/docs/guide/migrating))
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

> [Offizielle Dokumentation: Upgrading auf Next.js 15](https://nextjs.org/docs/app/guides/upgrading/version-15)

- App Router für Routing und Layout-Verwaltung verwenden
- Server Components wo immer möglich einsetzen
- Optimale Image-Optimierung mit next/image
- Caching-Strategien gezielt einsetzen: force-cache, no-store, etc.
- SEO-Optimierung durch Metadata API
- Streaming-Strategien für verbesserte Benutzererfahrung

### Material UI 7

> [Offizielle Dokumentation: Material UI mit Next.js](https://mui.com/material-ui/integrations/nextjs/)

- Theme-Provider für konsistentes Styling verwenden
- System-API für responsives Design nutzen
- Custom Theme-Erweiterungen für Projektspezifische Design-Tokens
- Stack und Grid für Layout-Aufbau bevorzugen
- React Server Components Patterns für MUI-Komponenten anwenden
- Barrierefreiheit nach WCAG-Standards gewährleisten

#### Integration mit Next.js 15

Bei der Integration von Material UI 7 mit Next.js 15 sind folgende Punkte zu beachten:

1. **Server Components Support**: Material UI 7 unterstützt React Server Components. Nutzen Sie die entsprechenden Imports:

   ```tsx
   // Server Component
   import { Button } from '@mui/material/server';

   // Client Component
   ('use client');
   import { Button } from '@mui/material';
   ```

2. **Styling Setup**: Für die korrekte Styling-Hydration mit Next.js 15:

   ```tsx
   // app/layout.tsx
   import { ThemeRegistry } from '@/theme/ThemeRegistry';

   export default function RootLayout({ children }) {
     return (
       <html lang="de">
         <body>
           <ThemeRegistry>{children}</ThemeRegistry>
         </body>
       </html>
     );
   }
   ```

3. **CSS Injection Order**: Die korrekte CSS-Injektionsreihenfolge sicherstellen, um Styling-Konflikte zu vermeiden

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
- Bevorzugt generierte GraphQL-Typen aus `src/gql/generated.ts` verwenden, anstatt eigene Typen zu definieren
- `page.tsx`-Dateien möglichst klein halten und Logik in Komponenten auslagern (wie bei der Capability-Seite implementiert)
  - UI-Komponenten in `/components/<feature>/` auslagern
  - Weitere Typen in `/components/<feature>/types.ts` definieren
  - Hilfsfunktionen in `/components/<feature>/utils.ts` auslagern
  - Filter-Logik in Custom Hooks (`use<Feature>Filter.ts`) auslagern

## Weiterführende Anweisungen

Für detaillierte Anweisungen und Dokumentation zu bestimmten Komponenten sind folgende Dateien verfügbar:

1. **Produktanforderungen**: `docs/product_requirements.md`
2. **Server-Komponente Dokumentation**: `server/README.md`
3. **Client-Anwendung Dokumentation**: `client/README.md`
4. **Datenbank-Dokumentation**: `db/README.md`

### Wie man Links zu weiteren Dokumenten hinzufügt:

1. Erstellen Sie die Dokumentationsdateien in den entsprechenden Verzeichnissen
2. Verwenden Sie relative Markdown-Links wie folgt:
   ```markdown
   [Linktext](../../pfad/zur/datei.md)
   ```
3. Für detailliertere Anweisungen können Sie auch tiefergehende Strukturen erstellen:
   ```
   docs/
    ├── product_requirements.md
    ├── server/
    │   ├── setup.md
    │   └── api.md
    ├── client/
    │   ├── components.md
    │   └── pages.md
    └── database/
        ├── schema.md
        └── sample_data.md
   ```
