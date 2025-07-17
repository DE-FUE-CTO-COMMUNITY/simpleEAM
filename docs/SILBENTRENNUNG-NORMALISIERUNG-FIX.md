# Silbentrennung-Normalisierung für Datenbank-Speicherung

## Problem

Wenn im Diagramm Text mit Silbentrennung (Hypher) angezeigt wird, wurden die Trennstriche auch in der Datenbank gespeichert. Dies führte dazu, dass Begriffe wie "Geschäftsprozess" als "Geschäfts-\nprozess" in der Datenbank standen.

## Lösung

Die `normalizeText` und `prepareTextForDatabase` Funktionen wurden erweitert, um verschiedene Arten von Trennstrichen zu erkennen und zu entfernen:

### Erweiterte `normalizeText` Funktion

```typescript
export const normalizeText = (text: string | undefined | null): string => {
  if (!text) return ''

  return text
    .replace(/\r?\n/g, ' ') // Zeilenumbrüche durch Leerzeichen ersetzen
    .replace(/-\s+/g, '') // Trennstriche am Zeilenende entfernen
    .replace(/\s+-/g, ' ') // Trennstriche am Zeilenanfang entfernen
    .replace(/([a-zA-ZäöüÄÖÜß])-([a-zA-ZäöüÄÖÜß])/g, '$1$2') // Trennstriche zwischen Buchstaben entfernen
    .replace(/\s+/g, ' ') // Mehrfache Leerzeichen durch einzelne ersetzen
    .trim()
}
```

### Neue `prepareTextForDatabase` Funktion

```typescript
export const prepareTextForDatabase = (text: string | undefined | null): string => {
  if (!text) return ''

  const normalized = normalizeText(text)

  return normalized
    .replace(/\u00AD/g, '') // Entferne weiche Trennstriche (soft hyphens)
    .replace(/\u2010/g, '') // Entferne Bindestrich-Zeichen
    .replace(/\u2011/g, '') // Entferne geschützte Bindestriche
    .replace(/\u2012/g, '') // Entferne Gedankenstriche
    .replace(/\u2013/g, '') // Entferne En-Dash
    .replace(/\u2014/g, '') // Entferne Em-Dash
    .replace(/\.{3,}/g, '...') // Normalisiere Ellipsen
    .trim()
}
```

## Angepasste Funktionen

### `updateTextWithContainerBinding`

- Verwendet jetzt `prepareTextForDatabase` für die Datenbank-Speicherung
- Verwendet originalen Text für die Positionsberechnung (bessere Darstellung)

### `updateTextContentOnly`

- Verwendet jetzt `prepareTextForDatabase` für die Datenbank-Speicherung

### `databaseSyncUtils.ts`

- GraphQL-Mutation verwendet jetzt `prepareTextForDatabase(newName)` statt `newName.trim()`

## Behandelte Trennzeichen-Typen

### Standard-Trennstriche

- `-` (Bindestrich) gefolgt von Leerzeichen oder Zeilenumbruch
- `-` zwischen Buchstaben (Silbentrennung)

### Unicode-Trennzeichen

- `\u00AD` (Soft Hyphen/Weicher Trennstrich)
- `\u2010` (Hyphen)
- `\u2011` (Non-Breaking Hyphen)
- `\u2012` (Figure Dash)
- `\u2013` (En Dash)
- `\u2014` (Em Dash)

### Zusätzliche Normalisierungen

- Mehrfache Leerzeichen werden zu einzelnen Leerzeichen
- Zeilenumbrüche werden durch Leerzeichen ersetzt
- Ellipsen werden normalisiert (`...`)

## Beispiele

### Vor der Änderung

```
Diagramm: "Geschäfts-\nprozess"
Datenbank: "Geschäfts-\nprozess"  ❌
```

### Nach der Änderung

```
Diagramm: "Geschäfts-\nprozess"
Datenbank: "Geschäftsprozess"     ✅
```

### Weitere Beispiele

```
Input: "Informa-\ntionsverarbeitung"
Output: "Informationsverarbeitung"

Input: "Software-\nentwicklung und\nQualitäts-\nsicherung"
Output: "Softwareentwicklung und Qualitätssicherung"

Input: "Business-\nProcess Management"
Output: "BusinessProcess Management"
```

## Test-Suite

Die Datei `textWrapperTest.ts` enthält eine neue `testTextNormalization` Funktion, die verschiedene Trennungs-Szenarien testet.

## Auswirkungen

- ✅ Silbentrennung wird nur für die Anzeige verwendet, nicht für die Datenbank
- ✅ Konsistente Datenbank-Einträge ohne Formatierungs-Artefakte
- ✅ Bessere Suchfunktionalität in der Datenbank
- ✅ Keine Breaking Changes für bestehende Funktionalität
- ✅ Rückwärtskompatibilität gewährleistet
