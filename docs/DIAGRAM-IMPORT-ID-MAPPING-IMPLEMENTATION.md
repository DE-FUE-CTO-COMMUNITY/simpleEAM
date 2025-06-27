# Import ID-Mapping für Diagramme - Implementation Guide

## Überblick

Diese Implementierung löst das Problem, dass beim Import von Diagramm-JSON-Dateien aus anderen Simple-EAM-Instanzen die Element-IDs unterschiedlich sind und die Elemente daher nicht in der lokalen Datenbank gefunden werden.

## Problem

Beim Import eines Diagramms aus einer anderen Simple-EAM-Instanz:

- Elemente haben unterschiedliche UUIDs (z.B. `cap-123` vs. `cap-456`)
- Elemente mit gleichem Typ und Namen existieren in beiden Instanzen
- Ohne ID-Mapping werden Elemente als "nicht gefunden" markiert
- Synchronisation funktioniert nicht korrekt

## Lösung

### 1. Automatische ID-Erkennung und Mapping

Die neue Funktionalität in `importIdMappingUtils.ts` implementiert:

1. **ID-Existenz-Prüfung**: Überprüft, ob Original-IDs in der lokalen DB existieren
2. **Name-basierte Suche**: Sucht nach Elementen mit gleichem Typ und Namen
3. **Automatisches Mapping**: Ersetzt alte IDs durch gefundene lokale IDs
4. **Benutzer-Feedback**: Informiert über durchgeführte Mappings

### 2. Integration in Import-Handler

Der JSON-Import in `DiagramHandlers.ts` wurde erweitert um:

```typescript
// Verarbeite importierte Daten und mappe IDs bei Bedarf
const { processedData, mappings, summary } = await processImportedDiagramData(
  apolloClient,
  importedData
)

// Zeige detaillierte Erfolgs-Nachricht mit ID-Mapping-Info
const successMessage =
  mappings.length > 0
    ? `JSON erfolgreich importiert!\n\n${summary}`
    : 'JSON erfolgreich importiert!'
```

## API-Referenz

### `createIdMappingsForImport(apolloClient, importedData)`

Erstellt ID-Mappings für importierte Diagramm-Elemente.

**Parameter:**

- `apolloClient`: Apollo GraphQL Client
- `importedData`: Importierte Diagramm-Daten

**Rückgabe:**

```typescript
ElementIdMapping[] = {
  oldId: string,      // Original-ID aus importierter Datei
  newId: string,      // Gefundene lokale ID
  elementType: string, // Typ des Elements (capability, application, etc.)
  elementName: string  // Name des Elements
}
```

### `applyIdMappingsToImportedData(importedData, mappings)`

Wendet ID-Mappings auf importierte Daten an.

**Parameter:**

- `importedData`: Importierte Diagramm-Daten
- `mappings`: Array von ElementIdMapping

**Rückgabe:** Aktualisierte Diagramm-Daten mit neuen IDs

### `processImportedDiagramData(apolloClient, importedData)`

Hauptfunktion für vollständige Import-Verarbeitung.

**Rückgabe:**

```typescript
{
  processedData: ImportedDiagramData,  // Verarbeitete Daten
  mappings: ElementIdMapping[],        // Angewandte Mappings
  summary: string                      // Benutzerfreundliche Zusammenfassung
}
```

## Unterstützte Element-Typen

Die ID-Mapping-Funktionalität unterstützt alle Architektur-Element-Typen:

- **Business Capabilities** (`capability`, `businessCapability`)
- **Applications** (`application`)
- **Data Objects** (`dataObject`)
- **Interfaces** (`interface`, `applicationInterface`)

## GraphQL-Queries

Die Funktionalität nutzt spezifische GraphQL-Queries:

### Existenz-Prüfung

```graphql
query CheckCapabilityExists($id: ID!) {
  businessCapabilities(where: { id: { eq: $id } }) {
    id
    name
  }
}
```

### Name-basierte Suche

```graphql
query FindCapabilityByName($name: String!) {
  businessCapabilities(where: { name: { eq: $name } }) {
    id
    name
    description
  }
}
```

## Benutzer-Workflow

### 1. Normaler Import (keine Mappings nötig)

```
1. Benutzer wählt JSON-Datei
2. System prüft IDs → alle existieren
3. Diagramm wird direkt importiert
4. Meldung: "JSON erfolgreich importiert!"
```

### 2. Import mit ID-Mappings

```
1. Benutzer wählt JSON-Datei
2. System prüft IDs → einige existieren nicht
3. System sucht nach Namen → findet passende Elemente
4. System ersetzt IDs automatisch
5. Diagramm wird mit neuen IDs importiert
6. Meldung: "JSON erfolgreich importiert!
   3 Element-IDs wurden automatisch angepasst:
   • capability: 'Kundenverwaltung' (cap-123 → cap-456)
   • application: 'CRM-System' (app-789 → app-012)
   • dataObject: 'Kundendaten' (data-345 → data-678)"
7. Zusätzliche Warnung nach 3 Sekunden
```

### 3. Import mit nicht-findbaren Elementen

```
1. Benutzer wählt JSON-Datei
2. System prüft IDs → einige existieren nicht
3. System sucht nach Namen → findet einige nicht
4. Diagramm wird mit verfügbaren Mappings importiert
5. Nicht-gefundene Elemente werden als "missing" markiert
6. Meldung enthält sowohl Erfolge als auch Warnungen
```

## Logging und Debugging

Die Funktionalität erstellt detaillierte Console-Logs:

```javascript
console.log('Processing element: capability with ID cap-123')
console.log('Element cap-123 not found, searching for "Kundenverwaltung" of type capability')
console.log('Found matching element: Kundenverwaltung -> cap-456 (was cap-123)')
console.log('Created 3 ID mappings')
console.log('Applying 3 ID mappings to imported data')
```

## Fehlerbehandlung

- **GraphQL-Fehler**: Werden gefangen und geloggt, Import wird fortgesetzt
- **Fehlende Element-Namen**: Elemente werden übersprungen
- **Unbekannte Element-Typen**: Werden geloggt und übersprungen
- **Netzwerk-Fehler**: Führen zu Fehlermeldung, kein Import

## Performance-Überlegungen

- **Batch-Verarbeitung**: Jedes Element wird einzeln verarbeitet (könnte optimiert werden)
- **Caching**: Keine Zwischenspeicherung von Suchergebnissen
- **Network-Only**: Immer aktuelle Daten aus der Datenbank
- **Parallele Verarbeitung**: Möglich für zukünftige Optimierung

## Testing

Vollständige Test-Suite in `importIdMappingUtils.test.ts`:

- Unit-Tests für alle Kern-Funktionen
- Mock Apollo Client für GraphQL-Operationen
- Edge-Cases und Fehlerbehandlung
- Integration-Tests für komplette Workflows

## Zukünftige Verbesserungen

### 1. Bulk-Operationen

```typescript
// Statt einzelner Queries:
const mappings = await createBulkIdMappings(apolloClient, elements)
```

### 2. Fuzzy-Matching

```typescript
// Für ähnliche Namen:
const similarity = calculateNameSimilarity(importedName, dbName)
if (similarity > 0.8) {
  /* suggest mapping */
}
```

### 3. Benutzer-Bestätigung

```typescript
// Interaktiver Dialog:
const userConfirmedMappings = await showMappingConfirmationDialog(mappings)
```

### 4. Mapping-Cache

```typescript
// Zwischenspeicherung für Batch-Imports:
const cachedMappings = getMappingCache(sourceInstance, targetInstance)
```

## Migration und Kompatibilität

- **Rückwärts-kompatibel**: Alte Import-Funktionalität bleibt erhalten
- **Opt-in**: Automatisches Mapping nur bei Bedarf
- **Graceful Degradation**: Funktioniert auch bei partiellen Fehlern
- **Keine Breaking Changes**: Bestehende Diagramme nicht betroffen

## Konfiguration

Aktuell keine Konfiguration erforderlich. Mögliche zukünftige Optionen:

```typescript
const importConfig = {
  autoMapping: true, // Automatisches Mapping aktivieren
  confirmMappings: false, // Benutzer-Bestätigung verlangen
  fuzzyThreshold: 0.8, // Schwellwert für Ähnlichkeit
  maxMappingAttempts: 100, // Maximale Anzahl Mapping-Versuche
}
```
