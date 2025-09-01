# Database Management

## Überblick

Dieses Verzeichnis verwaltet alle datenbankbezogenen Skripte und Szenarien für Simple-EAM. Das System nutzt Neo4j als Graph-Datenbank für die Speicherung des Enterprise Architecture Models.

## Verzeichnisstruktur

```
server/src/db/
├── init-db.ts              # Basis-Datenbankinitialisierung
├── neo4j-client.ts         # Neo4j Client-Konfiguration
├── pv/                     # Photovoltaik-Hersteller Szenario
│   ├── README.md            # PV-Szenario Dokumentation
│   ├── init-db-pv-runner.ts # CLI-Ausführung für PV-Szenario
│   ├── init-db-pv.ts        # PV-Szenario Orchestrierung
│   └── pv-*.ts              # PV-spezifische Komponenten
└── heatpump/               # Wärmepumpen-Hersteller Szenario
    ├── README.md            # Heat Pump-Szenario Dokumentation
    ├── init-db-heatpump-runner.ts # CLI-Ausführung für Heat Pump-Szenario
    ├── init-db-heatpump.ts  # Heat Pump-Szenario Orchestrierung
    └── heatpump-*.ts        # Heat Pump-spezifische Komponenten
```

## Verfügbare Szenarien

### 1. Basis-Szenario (`init-db.ts`)

Grundlegende Datenbankinitialisierung ohne spezielle Unternehmensdaten.

```bash
yarn init-db
```

### 2. Photovoltaik-Hersteller (`pv/`)

Vollständiges Enterprise Architecture Szenario für einen Solarpanel-Hersteller.

```bash
yarn init-db-pv --reset --test
```

Siehe [PV-Szenario README](./pv/README.md) für detaillierte Informationen.

### 3. Wärmepumpen-Hersteller (`heatpump/`)

Vollständiges Enterprise Architecture Szenario für einen HVAC/Wärmepumpen-Hersteller.

```bash
yarn init-db-heatpump --reset --test
```

Siehe [Heat Pump-Szenario README](./heatpump/README.md) für detaillierte Informationen.

## Szenario-Architektur

### Design-Prinzipien

- **Modulare Struktur**: Jedes Szenario in eigenem Verzeichnis
- **Wiederverwendbare Komponenten**: Gemeinsame Utilities im Hauptverzeichnis
- **CLI-freundlich**: Separate Runner-Skripte für Kommandozeilenausführung
- **Testbar**: Eingebaute Validierungslogik

### Datei-Konventionen

- `init-db-{scenario}.ts`: Hauptorchestrator für Szenario-Logik
- `init-db-{scenario}-runner.ts`: CLI-Wrapper für Kommandozeilenausführung
- `{scenario}-{component}.ts`: Spezifische Komponenten des Szenarios

## Neue Szenarien hinzufügen

1. **Verzeichnis erstellen**: `mkdir {scenario-name}`
2. **Komponenten implementieren**: Separate Dateien für jede Entitätsart
3. **Orchestrator erstellen**: `init-db-{scenario}.ts` mit Hauptlogik
4. **CLI-Runner erstellen**: `init-db-{scenario}-runner.ts` für Kommandozeile
5. **Package.json erweitern**: Skript für `yarn init-db-{scenario}` hinzufügen
6. **Dokumentation**: README.md im Szenario-Verzeichnis

### Beispiel-Struktur für neues Szenario:

```
{scenario-name}/
├── README.md
├── init-db-{scenario}-runner.ts    # CLI-Interface
├── init-db-{scenario}.ts           # Hauptorchestrator
├── {scenario}-applications.ts      # Anwendungen
├── {scenario}-capabilities.ts      # Geschäftsfähigkeiten
├── {scenario}-infrastructure.ts    # Infrastruktur
└── {scenario}-relationships.ts     # Beziehungen
```

## Datenbank-Konfiguration

### Neo4j Setup

Die Datenbank läuft über Docker Compose:

```bash
# Starten der Datenbank
docker-compose up -d neo4j

# Neo4j Browser
http://localhost:7474
```

### Verbindungsparameter

- **URL**: `bolt://localhost:7688`
- **Username**: `neo4j`
- **Password**: Konfiguriert in `.env`

### Umgebungsvariablen

```env
NEO4J_URI=bolt://localhost:7688
NEO4J_USER=neo4j
NEO4J_PASSWORD=your-password
```

## Entwicklung

### Neue Komponenten hinzufügen

1. TypeScript-Datei im entsprechenden Szenario-Verzeichnis erstellen
2. Export-Funktionen für Create, Update, Delete implementieren
3. Integration in den Hauptorchestrator (`init-db-{scenario}.ts`)
4. Beziehungen in `{scenario}-relationships.ts` definieren

### Testing

Jedes Szenario sollte Validierungslogik enthalten:

```typescript
export async function test{Scenario}Scenario(driver: Driver): Promise<void> {
  // Validierungslogik hier
}
```

### Error Handling

- Comprehensive Logging mit Console-Output
- Rollback-Unterstützung durch `--reset` Flags
- Transaktionale Operationen wo möglich

## Troubleshooting

### Häufige Probleme

1. **Constraint-Verletzungen**: Datenbank mit `--reset` leeren
2. **Verbindungsfehler**: Neo4j Container-Status prüfen
3. **Importfehler**: TypeScript-Pfade in `tsconfig.json` prüfen

### Debug-Modus

```bash
# Verbose Logging aktivieren
DEBUG=* yarn init-db-{scenario}
```

## Siehe auch

- [Neo4j GraphQL Library](https://neo4j.com/docs/graphql-library/)
- [Simple-EAM Hauptdokumentation](../../../docs/)
- [Docker Compose Setup](../../../docker-compose.yml)
