# 🌡️ Heat Pump Manufacturing Scenario

## Überblick

Dieses Verzeichnis enthält alle Dateien für das Szenario eines Wärmepumpen-Herstellers. Das Szenario zeigt eine vollständige Enterprise Architecture für ein Unternehmen, das innovative Wärmepumpensysteme entwickelt, produziert und vertreibt.

## 📊 Szenario-Statistiken

Das vollständige Szenario umfasst:

- **1 Unternehmen:** Thermo Dynamics AG
- **25 Business Capabilities:** 8 L1, 17 L2 (HVAC-spezialisiert)
- **15 Personen:** Vollständige Organisationsstruktur
- **13 Anwendungen:** IoT-Platform, Manufacturing, Analytics
- **24 Datenobjekte:** Produktdaten, IoT-Telemetrie, Compliance
- **10 Architekturen:** Enterprise + Solution Architectures
- **14 Architektur-Prinzipien:** Digital-First, Sustainability, Security
- **217 Beziehungen:** Vollständig vernetzte Enterprise Architecture

## Verzeichnisstruktur

```
heatpump/
├── README.md                               # Diese vollständige Dokumentation
├── init-db-heatpump-runner.ts             # CLI-Ausführbares Skript für die Initialisierung
├── init-db-heatpump.ts                    # Hauptkontroller für die Szenario-Orchestrierung
├── heatpump-company.ts                    # Company-Entität (Thermo Dynamics AG)
├── heatpump-company-relationships.ts      # Zuordnung aller Entitäten zur Company
├── heatpump-business-capabilities.ts      # Geschäftsfähigkeiten für HVAC-Hersteller
├── heatpump-persons.ts                    # Personen und Rollen mit Ownership
├── heatpump-applications.ts               # Anwendungen und deren Beziehungen
├── heatpump-data-objects.ts               # Datenobjekte für HVAC-Manufacturing
├── heatpump-architectures.ts              # Enterprise & Solution Architectures
└── heatpump-architecture-principles.ts    # Architektur-Prinzipien und Richtlinien
```

## Verwendung

### Szenario initialisieren

```bash
# Komplette Initialisierung mit Reset der Datenbank
yarn init-db-heatpump --reset

# Mit Validierungstests
yarn init-db-heatpump --reset --test

# Nur neue Daten hinzufügen (ohne Reset)
yarn init-db-heatpump
```

### Direkte Ausführung

```bash
# Direkt mit ts-node ausführen
ts-node src/db/heatpump/init-db-heatpump-runner.ts --reset --test
```

## Szenario-Details

### Unternehmensprofil

- **Name**: Thermo Dynamics AG
- **Branche**: HVAC Technology / Heat Pump Manufacturing
- **Standort**: München, Deutschland
- **Fokus**: Innovative Wärmepumpensysteme und nachhaltige Heizlösungen
- **Spezialisierung**: Luft-, Erdwärmepumpen und Hybrid-Technologien
- **Zielgruppen**: Wohn- und Gewerbeanwendungen
- **Größe**: Großunternehmen (LARGE)

### Kernkomponenten

#### Company-Integration

- **Vollständige Unternehmensstruktur**: Alle Entitäten mit "Thermo Dynamics AG" verknüpft
- **Mitarbeiter-Zuordnung**: 15 Personen über EMPLOYED_BY-Beziehung
- **Asset-Ownership**: Alle technischen und organisatorischen Assets gehören zur Company
- **Governance**: Klare Eigentumsstrukturen für alle Architektur-Komponenten

#### Geschäftsfähigkeiten (25+)

- **L1 Strategic Capabilities**: Strategy Management, R&D, Manufacturing, Sales & Marketing
- **L2 Specialized Capabilities**:
  - **Thermal System Design**: Spezialisierte thermische Systemauslegung
  - **Refrigerant Technology**: Umweltfreundliche Kältemitteltechnologie
  - **Smart Control Systems**: IoT-fähige Steuerungssysteme
  - **Compressor Manufacturing**: Hocheffiziente Kompressorproduktion
  - **Heat Exchanger Manufacturing**: Luft- und Erdwärmetauscher
  - **System Assembly & Testing**: Endmontage und Qualitätsprüfung
  - **Installation Services**: Professionelle Installation und Inbetriebnahme
  - **Remote Monitoring**: IoT-basierte Fernüberwachung
  - **Energy Efficiency Optimization**: Energieeffizienz-Optimierung
  - **Sustainability Management**: Nachhaltigkeitsmanagement

#### Personen (15)

- **C-Level**: CEO (Dr. Klaus Müller), CTO (Ingrid Schmidt), COO (Thomas Weber)
- **Fachexperten**: Thermal Engineer, Refrigerant Specialist, Quality Manager
- **Bereichsleiter**: R&D Director, Manufacturing Director, Sales Director, Service Director
- **Spezialisierte Rollen**: Sustainability Manager, IT Manager

#### Anwendungen (13)

- **ERP & Core**: SAP S/4HANA für Unternehmensressourcen
- **Manufacturing**: HVAC-spezifisches MES, ThermalCAD Pro
- **IoT & Analytics**: ThermoDynamics IoT Platform, Energy Analytics Suite
- **CRM & Sales**: Salesforce CRM, Installer Channel Portal
- **Service**: Field Service Management, Heat Pump Diagnostic Tool
- **BI & Analytics**: Microsoft Power BI, Office 365
- **Legacy**: Legacy PLM System (wird ersetzt)

#### Technologie-Fokus

- **Cloud-First Architecture**: AWS und Azure Cloud-Plattformen
- **IoT Integration**: MQTT, InfluxDB, Grafana für Monitoring
- **Mobile Solutions**: Flutter-basierte Diagnose-Tools
- **Modern Development**: React, Node.js, PostgreSQL
- **Analytics**: Python, Apache Spark, TensorFlow

### Branchenspezifische Besonderheiten

#### HVAC-Manufacturing

- Spezialisierte thermische Berechnungen und Simulationen
- Kältemittelkreislauf-Optimierung
- Energieeffizienz-Metriken und -Optimierung
- Qualitätsmanagement für Wärmepumpen-Komponenten

#### IoT & Smart Systems

- Remote-Monitoring von Wärmepumpen-Anlagen
- Predictive Maintenance basierend auf Sensordaten
- Energieverbrauchsanalyse und -optimierung
- Smart Home Integration

#### Sustainability Focus

- Umweltfreundliche Kälgemittel (R32, R290)
- CO2-Fußabdruck-Reduzierung
- Kreislaufwirtschaft und Recycling
- Energieeffizienz-Standards

## Technische Implementierung

### Architektur-Pattern

- **Company-First Design**: Alle Entitäten sind primär einer Company zugeordnet
- **Industry-Specific**: HVAC- und Wärmepumpen-spezifische Capabilities
- **IoT-Enabled**: Umfassende IoT-Integration für Monitoring und Analytics
- **Sustainability-Focused**: Nachhaltigkeit als zentrales Thema
- **Modern Tech Stack**: Cloud-native und mobile-first Ansatz

### Datenbank-Schema

- Präfix-basierte Identifikation: `hp-` für alle Heat Pump Entitäten
- Company-ID: `company-thermo-dynamics-ag`
- Hierarchische Capability-Struktur (L1/L2)
- Umfassende Ownership-Modelle

### Capability-Hierarchie

```
L1: Strategy & Corporate Management
L1: Research & Development
    L2: Thermal System Design
    L2: Refrigerant Technology
    L2: Smart Control Systems
L1: Heat Pump Manufacturing
    L2: Compressor Manufacturing
    L2: Heat Exchanger Manufacturing
    L2: System Assembly & Testing
L1: Sales & Marketing
    L2: Channel Management
    L2: Digital Marketing
    L2: Product Management
L1: Service & Customer Support
    L2: Installation Services
    L2: Maintenance Services
    L2: Remote Monitoring
    L2: Customer Support
```

## Erweiterung

Um das Szenario zu erweitern:

1. **Neue Komponenten**: Weitere `.ts` Dateien mit entsprechenden Create-Funktionen
2. **Integration**: Import und Aufruf in `init-db-heatpump.ts`
3. **HVAC-Spezifika**: Branchenspezifische Erweiterungen für Wärmepumpen-Technologie
4. **IoT-Integration**: Weitere Sensoren und Monitoring-Capabilities

## Abhängigkeiten

- Neo4j Database (läuft über Docker)
- TypeScript Runtime (ts-node)
- Neo4j Driver für Node.js
- Dotenv für Umgebungsvariablen

## Vergleich zu anderen Szenarien

| Aspekt              | PV-Szenario             | Heat Pump-Szenario         |
| ------------------- | ----------------------- | -------------------------- |
| **Industrie**       | Solar/Photovoltaik      | HVAC/Wärmepumpen           |
| **Hauptfokus**      | Sonnenenergie           | Thermische Systeme         |
| **Technologie**     | Halbleiter, Solarzellen | Kältemittel, Wärmetauscher |
| **IoT-Integration** | Monitoring              | Steuerung + Monitoring     |
| **Nachhaltigkeit**  | Erneuerbare Energie     | Energieeffizienz           |
| **Komplexität**     | Hoch (597 Beziehungen)  | Mittel (anwachsend)        |

## Siehe auch

- [PV-Szenario](../pv/README.md)
- [Haupt-Datenbank README](../README.md)
- [NextGen EAM Dokumentation](../../../../docs/)
- [Neo4j GraphQL Library Dokumentation](https://neo4j.com/docs/graphql-library/)
