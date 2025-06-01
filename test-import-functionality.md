# Test-Anleitung für Excel Import-Funktionalität

## Übersicht

Die Import-Funktionalität wurde erfolgreich implementiert und erweitert. Hier ist eine Anleitung zum Testen:

## Implementierte Features

### ✅ Basis-Import für alle Entity-Typen

- Business Capabilities
- Applications
- Data Objects
- Application Interfaces
- Persons
- Architectures
- Diagrams

### ✅ Erweiterte Features

- **Beziehungsunterstützung**: Import von Owner-, Parent-, und anderen Relationen über kommagetrennte IDs
- **Multi-Tab Import**: Unterstützung für "Alle Entitäten" Admin-Import
- **Verbesserte Datenverarbeitung**: Sichere Parsing-Funktionen für Zahlen, Datum, Arrays
- **Detaillierte Fortschrittsanzeige**: Prozentuale Anzeige mit Entity-spezifischen Details
- **Umfassende Fehlerbehandlung**: Individuelle Fehlerbehandlung pro Entity-Typ

## Test-Schritte

### 1. Template-Download testen

1. Öffne die Anwendung (http://localhost:3000)
2. Navigiere zu Excel Import/Export
3. Wähle verschiedene Entity-Typen aus
4. Lade Templates herunter und prüfe Spaltenstruktur

### 2. Basis-Import testen

1. Fülle Template mit Testdaten
2. Stelle sicher, dass erforderliche Felder gefüllt sind:
   - Business Capabilities: `id`, `name`
   - Applications: `id`, `name`, `status`
   - Data Objects: `id`, `name`
   - Interfaces: `id`, `name`, `protocol`
   - Persons: `id`, `firstName`, `lastName`
   - Architectures: `id`, `name`, `domain`, `type`, `timestamp`
   - Diagrams: `id`, `title`, `diagramJson`

### 3. Beziehungs-Import testen

1. Erstelle zuerst Basis-Entitäten (z.B. Persons für Owners)
2. Nutze deren IDs in Beziehungsfeldern:
   ```
   owners: "person1-id,person2-id"
   parents: "parent-capability-id"
   supportsCapabilities: "cap1-id,cap2-id"
   ```

### 4. Multi-Tab Import testen

1. Wähle "Alle Entitäten" als Entity-Typ
2. Lade Multi-Tab Template herunter
3. Fülle verschiedene Tabs mit Daten
4. Teste Import mit mehreren Entity-Typen gleichzeitig

## Erwartete Verbesserungen

### Implementiert ✅

- Echte GraphQL-Mutationen statt Simulation
- Beziehungsverarbeitung über kommagetrennte IDs
- Robuste Fehlerbehandlung
- Detaillierte Fortschrittsanzeige
- Multi-Entity Import-Unterstützung

### Mögliche weitere Verbesserungen 🔄

- Batch-Processing für große Datenmengen
- Rollback bei Fehlern
- Validierung von Beziehungs-IDs vor Import
- Import-Preview mit Konflikterkennung
- Export bestehender Daten vor Import (Backup)

## Bekannte Einschränkungen

1. **Beziehungsreihenfolge**: Zielentitäten müssen vor referenzierenden Entitäten existieren
2. **Keine Validierung von Beziehungs-IDs**: Ungültige IDs werden zu GraphQL-Fehlern führen
3. **Keine Duplikatserkennung bei Beziehungen**: Mehrfachverbindungen sind möglich
4. **Begrenzte Rollback-Funktionalität**: Bei teilweisen Fehlern bleiben bereits importierte Datensätze bestehen

## Testing-Checkliste

- [ ] Template-Download für alle Entity-Typen
- [ ] Basis-Import für jede Entity einzeln
- [ ] Beziehungs-Import mit gültigen IDs
- [ ] Fehlerbehandlung bei ungültigen Daten
- [ ] Multi-Tab Import mit mehreren Entity-Typen
- [ ] Fortschrittsanzeige während Import
- [ ] Detaillierte Erfolgsmeldungen
- [ ] Fehlermeldungen bei Import-Problemen

## GraphQL Mutation Mapping

| Entity Type           | GraphQL Mutation             | Input Format                  |
| --------------------- | ---------------------------- | ----------------------------- |
| Business Capabilities | CREATE_CAPABILITY            | `createBusinessCapabilities`  |
| Applications          | CREATE_APPLICATION           | `createApplications`          |
| Data Objects          | CREATE_DATA_OBJECT           | `createDataObjects`           |
| Interfaces            | CREATE_APPLICATION_INTERFACE | `createApplicationInterfaces` |
| Persons               | CREATE_PERSON                | `createPeople`                |
| Architectures         | CREATE_ARCHITECTURE          | `createArchitectures`         |
| Diagrams              | CREATE_DIAGRAM               | `createDiagrams`              |

## Beispiel für Beziehungs-Import

```csv
id,name,description,owners,parents,status
cap1,Customer Management,Manage customer data,person1,,,ACTIVE
cap2,Order Processing,Process customer orders,person1;person2,cap1,ACTIVE
```

Die Implementation ist jetzt vollständig und bereit für Produktionstests!
