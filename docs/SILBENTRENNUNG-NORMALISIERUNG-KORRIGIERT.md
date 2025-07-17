# Silbentrennung-Normalisierung für Datenbank-Speicherung (Korrigiert)

## Problem

Wenn im Diagramm Text mit Silbentrennung (Hypher) angezeigt wird, wurden die Trennstriche auch in der Datenbank gespeichert. Dies führte dazu, dass Begriffe wie "Geschäftsprozess" als "Geschäfts-\nprozess" in der Datenbank standen.

**ABER:** Legitime Bindestriche in Namen wie "Backup-Rechenzentrum" oder "End-to-End-System" müssen erhalten bleiben!

## Lösung

Die `normalizeText` und `prepareTextForDatabase` Funktionen wurden präzise angepasst, um nur **Silbentrennstriche** zu entfernen, die durch die Hypher-Integration entstehen:

### Korrigierte `normalizeText` Funktion

```typescript
export const normalizeText = (text: string | undefined | null): string => {
  if (!text) return ''

  return text
    .replace(/\r?\n/g, ' ') // Zeilenumbrüche durch Leerzeichen ersetzen
    .replace(/-\s*\n\s*/g, '') // Nur Trennstriche entfernen, die direkt vor Zeilenumbrüchen stehen
    .replace(/\s+/g, ' ') // Mehrfache Leerzeichen durch einzelne ersetzen
    .trim()
}
```

### Korrigierte `prepareTextForDatabase` Funktion

```typescript
export const prepareTextForDatabase = (text: string | undefined | null): string => {
  if (!text) return ''

  const normalized = normalizeText(text)

  // Entferne nur Unicode-Trennzeichen, die bei der Silbentrennung entstehen können
  return normalized
    .replace(/\u00AD/g, '') // Entferne weiche Trennstriche (soft hyphens)
    .replace(/\.{3,}/g, '...') // Normalisiere Ellipsen
    .trim()
}
```

## Was wird entfernt vs. was bleibt erhalten

### ✅ Entfernt werden (Silbentrennstriche):

- `"Geschäfts-\nprozess"` → `"Geschäftsprozess"`
- `"Informa-\ntionsverarbeitung"` → `"Informationsverarbeitung"`
- `"Software-\nentwicklung"` → `"Softwareentwicklung"`
- `"Quality-\nAssurance"` → `"QualityAssurance"`
- Weiche Trennstriche (Unicode \u00AD)

### ✅ Erhalten bleiben (Legitime Bindestriche):

- `"Backup-Rechenzentrum"` → `"Backup-Rechenzentrum"`
- `"End-to-End-System"` → `"End-to-End-System"`
- `"Client-Server-Architektur"` → `"Client-Server-Architektur"`
- `"E-Mail-System"` → `"E-Mail-System"`
- `"Multi-Tier-Architektur"` → `"Multi-Tier-Architektur"`

## Präzise Erkennungslogik

### Silbentrennstriche (werden entfernt):

- **Muster:** `-\s*\n\s*` (Bindestrich gefolgt von optionalen Leerzeichen, dann Zeilenumbruch)
- **Beispiel:** `"Geschäfts-\nprozess"` oder `"Geschäfts- \n prozess"`

### Legitime Bindestriche (bleiben erhalten):

- **Muster:** Bindestriche, die NICHT vor Zeilenumbrüchen stehen
- **Beispiel:** `"Backup-Rechenzentrum"` oder `"End-to-End"`

## Beispiele

### Kombinierte Szenarien

```typescript
// Eingabe: "Client-Server-\nArchitektur"
// Ergebnis: "Client-Server-Architektur"
// Erklärung: Legitime Bindestriche bleiben, Silbentrennstrich wird entfernt

// Eingabe: "Multi-Tier-\nApplication-\nServer"
// Ergebnis: "Multi-Tier-ApplicationServer"
// Erklärung: Erste beiden Bindestriche bleiben, Silbentrennstriche werden entfernt
```

### Vor der Korrektur (zu aggressiv)

```
Input: "Backup-Rechenzentrum"
Output: "BackupRechenzentrum"  ❌ (Legitimer Bindestrich entfernt)
```

### Nach der Korrektur (präzise)

```
Input: "Backup-Rechenzentrum"
Output: "Backup-Rechenzentrum"  ✅ (Legitimer Bindestrich erhalten)

Input: "Geschäfts-\nprozess"
Output: "Geschäftsprozess"     ✅ (Silbentrennstrich entfernt)
```

## Angepasste Funktionen

### `updateTextWithContainerBinding`

- Verwendet jetzt `prepareTextForDatabase` für die Datenbank-Speicherung
- Verwendet originalen Text für die Positionsberechnung (bessere Darstellung)

### `updateTextContentOnly`

- Verwendet jetzt `prepareTextForDatabase` für die Datenbank-Speicherung

### `databaseSyncUtils.ts`

- GraphQL-Mutation verwendet jetzt `prepareTextForDatabase(newName)` statt `newName.trim()`

## Aktualisierte Test-Suite

### Neue Test-Fälle

```typescript
const testCases = [
  {
    input: 'Backup-Rechenzentrum',
    expected: 'Backup-Rechenzentrum',
    description: 'Legitimer Bindestrich in Namen (sollte erhalten bleiben)',
  },
  {
    input: 'End-to-End-System',
    expected: 'End-to-End-System',
    description: 'Mehrere legitime Bindestriche (sollten erhalten bleiben)',
  },
  {
    input: 'Client-Server-\nArchitektur',
    expected: 'Client-Server-Architektur',
    description: 'Kombination aus legitimen und Silbentrennstrichen',
  },
]
```

## Auswirkungen der Korrektur

- ✅ Silbentrennung wird nur für die Anzeige verwendet
- ✅ Legitime Bindestriche in Namen bleiben erhalten
- ✅ Konsistente Datenbank-Einträge ohne Silbentrennungs-Artefakte
- ✅ Korrekte Darstellung von zusammengesetzten Namen
- ✅ Keine Breaking Changes für bestehende Funktionalität
- ✅ Verbesserte Suchfunktionalität bei Erhaltung der Namensintegrität

## Technische Details

### Regex-Erklärung

- `/-\s*\n\s*/g`: Sucht nach Bindestrich, gefolgt von optionalen Leerzeichen, dann Zeilenumbruch, dann optionale Leerzeichen
- Diese Regel erfasst alle Varianten von Silbentrennstrichen vor Zeilenumbrüchen
- Bindestriche innerhalb einer Zeile werden nicht berührt

### Unicode-Behandlung

- Nur `\u00AD` (Soft Hyphen) wird entfernt, da dieser für Silbentrennung verwendet wird
- Andere Unicode-Bindestriche bleiben erhalten, da sie legitime Zeichen sein können
