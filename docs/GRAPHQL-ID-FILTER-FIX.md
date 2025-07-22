# Fix: GraphQL ID-Filterung für Relationship-Erstellung

## Problem

Beim Erstellen von Relationships zwischen Diagramm-Elementen trat ein GraphQL-Validierungsfehler auf:

```
Expected type "IDScalarFilters" to be an object.
Variable "$where" got invalid value "1OQNcS1qQm9z4ZAd_K-1u" at "where.id"
Variable "$update" got invalid value "tbEZ5Mw6jLLbuHg5V7BGi" at "update.sourceOfInterfaces.connect[0].where.node.id"
```

## Ursache

Die GraphQL-Mutations in `relationshipCreation.ts` verwendeten das falsche Format für ID-Filter:

**❌ Falsch:**

```typescript
where: {
  id: sourceElementId
}
connect: [{ where: { node: { id: targetElementId } } }]
```

**✅ Korrekt:**

```typescript
where: {
  id: {
    eq: sourceElementId
  }
}
connect: [{ where: { node: { id: { eq: targetElementId } } } }]
```

## Lösung

Alle GraphQL-Mutations in `/client/src/components/diagrams/utils/relationshipCreation.ts` wurden korrigiert:

### Korrigierte Relationship-Typen:

- ✅ `SUPPORTS` (Application → BusinessCapability)
- ✅ `USES` (Application → DataObject)
- ✅ `HOSTED_ON` (Application → Infrastructure)
- ✅ `INTERFACE_SOURCE` (Application ↔ ApplicationInterface)
- ✅ `INTERFACE_TARGET` (Application ↔ ApplicationInterface)
- ✅ `RELATED_TO` (BusinessCapability → DataObject)
- ✅ `TRANSFERS` (ApplicationInterface → DataObject)
- ✅ `DATA_SOURCE` (DataObject → Application)

### Zusätzliche Korrekturen:

- ✅ Korrekte Verwendung der `getRelationshipDisplayName(relationshipDefinition.type)` Funktion
- ✅ Proper Import der `getRelationshipDisplayName` Funktion

## Verifikation

Nach der Korrektur:

- ✅ Alle TypeScript-Kompilierungsfehler behoben
- ✅ GraphQL-Mutations verwenden korrekte `IdScalarFilters` Struktur
- ✅ Relationship-Erstellung sollte ohne Fehler funktionieren

## GraphQL ID-Filter Schema

Das korrekte Format für ID-Filter in Neo4j GraphQL:

```typescript
// Für WHERE-Klauseln:
where: { id: { eq: "element-id" } }

// Für CONNECT-Operationen:
connect: [{ where: { node: { id: { eq: "target-id" } } } }]

// Available IdScalarFilters operators:
{
  eq?: string       // equals
  in?: string[]     // in array
  contains?: string // contains substring
  startsWith?: string
  endsWith?: string
}
```

## Testing

Die korrigierten Mutations können jetzt getestet werden durch:

1. Erstellen eines Diagramms mit neuen Elementen
2. Definieren von Relationships zwischen den Elementen
3. Speichern des Diagramms - sollte ohne GraphQL-Fehler funktionieren
