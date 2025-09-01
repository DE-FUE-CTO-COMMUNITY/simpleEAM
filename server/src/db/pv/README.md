# Photovoltaic (PV) Manufacturing Scenario

## Überblick

Dieses Verzeichnis enthält alle Dateien für das Szenario eines Photovoltaik-Herstellers. Das Szenario zeigt eine vollständige Enterprise Architecture für ein Unternehmen, das Solarpanels entwickelt, produziert und verkauft.

## Verzeichnisstruktur

```
pv/
├── README.md                           # Diese Dokumentation
├── init-db-pv-runner.ts               # CLI-Ausführbares Skript für die Initialisierung
├── init-db-pv.ts                      # Hauptkontroller für die Szenario-Orchestrierung
├── pv-company.ts                      # Company-Entität (Solar Panels GmbH)
├── pv-company-relationships.ts        # Zuordnung aller Entitäten zur Company
├── pv-company-validation.ts           # Validierung der Company-Beziehungen
├── pv-applications.ts                 # Anwendungen und deren Beziehungen
├── pv-architecture-principles.ts      # Architekturprinzipien
├── pv-architectures.ts                # Enterprise Architecture Modelle
├── pv-business-capabilities.ts        # Geschäftsfähigkeiten
├── pv-data-objects.ts                 # Datenobjekte und Datenmodelle
├── pv-infrastructure.ts               # Infrastruktur-Komponenten
├── pv-interfaces.ts                   # Anwendungsschnittstellen
├── pv-persons.ts                      # Personen und Rollen
└── pv-relationships.ts                # Übergreifende Beziehungen
```

## Verwendung

### Szenario initialisieren

```bash
# Komplette Initialisierung mit Reset der Datenbank
yarn init-db-pv --reset

# Mit Validierungstests
yarn init-db-pv --reset --test

# Nur neue Daten hinzufügen (ohne Reset)
yarn init-db-pv
```

### Direkte Ausführung

```bash
# Direkt mit ts-node ausführen
ts-node src/db/pv/init-db-pv-runner.ts --reset --test
```

## Szenario-Details

### Unternehmensprofil

- **Name**: Solar Panels GmbH
- **Branche**: Photovoltaik-Hersteller (Renewable Energy / Solar Manufacturing)
- **Standort**: Berlin, Deutschland
- **Fokus**: Entwicklung, Produktion und Verkauf von Solarpanels
- **Architektur**: Cloud-first mit AWS-Infrastruktur
- **Größe**: Großunternehmen (LARGE)

### Kernkomponenten

#### Company-Integration (NEU!)

- **Vollständige Unternehmensstruktur**: Alle Entitäten sind mit "Solar Panels GmbH" verknüpft
- **Mitarbeiter-Zuordnung**: 15 Personen über EMPLOYED_BY-Beziehung
- **Asset-Ownership**: Alle technischen und organisatorischen Assets gehören zur Company
- **Governance**: Klare Eigentumsstrukturen für alle Architektur-Komponenten

#### Geschäftsfähigkeiten (36)

- Vollständiges L1/L2 Business Capability Model
- Manufacturing-spezifische Solarpanel-Produktionsfähigkeiten
- Von Forschung & Entwicklung bis Kundenservice

#### Anwendungen (17)

- Mix aus Standard-Software (COTS) und Custom-Entwicklungen
- Cloud-native Anwendungen auf AWS
- Integrierte Produktions- und ERP-Systeme

#### Infrastruktur (11)

- AWS-basierte Cloud-Infrastruktur
- Kubernetes (EKS) für Container-Workloads
- Hybrid-Ansatz mit physischen Servern für spezielle Anwendungen

#### Daten (27)

- Vollständige Datenarchitektur von Produktdaten bis Analytics
- Manufacturing-spezifische Datenobjekte
- End-to-End Datenflüsse

#### Schnittstellen (17)

- Vollständige Integration zwischen allen Anwendungen
- REST APIs und Message Queues
- Real-time Datenintegration

#### Architektur-Modelle (8)

- Current State, Transition State und Target State Architekturen
- Spezifische Modelle für verschiedene Geschäftsbereiche

#### Architekturprinzipien (18)

- Erweiterte Sammlung von Architekturprinzipien
- Manufacturing- und Cloud-spezifische Prinzipien

### Beziehungen (597 total)

- **Company-Beziehungen**: 149 neue Beziehungen für vollständige Unternehmensintegration
- Vollständiges Ownership- und Verantwortlichkeitsmodell
- Detaillierte Abhängigkeiten zwischen allen Komponenten
- Komplexe Datenflüsse und Integrationen
- **Neue Beziehungstypen**:
  - `EMPLOYED_BY`: Personen ↔ Company
  - `OWNED_BY`: Alle Assets ↔ Company

## Technische Implementierung

### Architektur-Pattern

- **Company-First Design**: Alle Entitäten sind primär einer Company zugeordnet
- **Modular**: Jede Komponente in separater Datei
- **Orchestriert**: Zentrale Steuerung über `init-db-pv.ts`
- **Validiert**: Eingebaute Company-Validierungslogik
- **Testbar**: Eingebaute Validierungslogik
- **CLI-freundlich**: Separater Runner für Befehlszeilen-Ausführung

### Datenbank-Schema

- Neo4j Graph Database
- Constraint-basierte Eindeutigkeit
- Hierarchische Beziehungsmodelle
- Performance-optimierte Queries

### Error Handling

- Comprehensive Error Logging
- Rollback-Unterstützung durch `--reset` Flag
- Validation Tests für Datenintegrität

## Erweiterung

Um das Szenario zu erweitern:

1. **Neue Komponenten**: Neue `.ts` Dateien mit entsprechenden Create-Funktionen
2. **Integration**: Import und Aufruf in `init-db-pv.ts`
3. **Beziehungen**: Ergänzung in `pv-relationships.ts`
4. **Validierung**: Tests in `init-db-pv.ts` erweitern

## Abhängigkeiten

- Neo4j Database (läuft über Docker)
- TypeScript Runtime (ts-node)
- Neo4j Driver für Node.js
- Dotenv für Umgebungsvariablen

## Siehe auch

- [Haupt-Datenbank README](../README.md)
- [Simple EAM Dokumentation](../../../../docs/)
- [Neo4j GraphQL Library Dokumentation](https://neo4j.com/docs/graphql-library/)
