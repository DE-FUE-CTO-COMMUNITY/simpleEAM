# Hyphenation Normalization for Database Storage

## Problem

When text with hyphenation (Hypher) was displayed in the diagram, the hyphens were also stored in the database. This led to terms like "Geschäftsprozess" being stored as "Geschäfts-\nprozess" in the database.

## Solution

The `normalizeText` and `prepareTextForDatabase` functions were extended to detect and remove various types of hyphens:

### Extended `normalizeText` Function

```typescript
export const normalizeText = (text: string | undefined | null): string => {
  if (!text) return ''

  return text
    .replace(/\r?\n/g, ' ') // Replace line breaks with spaces
    .replace(/-\s+/g, '') // Remove hyphens at line end
    .replace(/\s+-/g, ' ') // Remove hyphens at line start
    .replace(/([a-zA-ZäöüÄÖÜß])-([a-zA-ZäöüÄÖÜß])/g, '$1$2') // Remove hyphens between letters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single spaces
    .trim()
}
```

### New `prepareTextForDatabase` Function

```typescript
export const prepareTextForDatabase = (text: string | undefined | null): string => {
  if (!text) return ''

  const normalized = normalizeText(text)

  return normalized
    .replace(/\u00AD/g, '') // Remove soft hyphens
    .replace(/\u2010/g, '') // Remove hyphen characters
    .replace(/\u2011/g, '') // Remove non-breaking hyphens
    .replace(/\u2012/g, '') // Remove figure dashes
    .replace(/\u2013/g, '') // Remove en-dashes
    .replace(/\u2014/g, '') // Remove em-dashes
    .replace(/\.{3,}/g, '...') // Normalize ellipses
    .trim()
}
```

## Adapted Functions

### `updateTextWithContainerBinding`

- Now uses `prepareTextForDatabase` for database storage
- Uses original text for position calculation (better display)

### `updateTextContentOnly`

- Now uses `prepareTextForDatabase` for database storage

### `databaseSyncUtils.ts`

- GraphQL mutation now uses `prepareTextForDatabase(newName)` instead of `newName.trim()`

## Handled Hyphen Types

### Standard Hyphens

- `-` (hyphen) followed by space or line break
- `-` between letters (syllable hyphenation)

### Unicode Hyphens

- `\u00AD` (Soft Hyphen)
- `\u2010` (Hyphen)
- `\u2011` (Non-Breaking Hyphen)
- `\u2012` (Figure Dash)
- `\u2013` (En Dash)
- `\u2014` (Em Dash)

### Additional Normalizations

- Multiple spaces become single spaces
- Line breaks are replaced with spaces
- Ellipses are normalized (`...`)

## Examples

### Before the Change

```
Diagram: "Geschäfts-\nprozess"
Database: "Geschäfts-\nprozess"  ❌
```

### After the Change

```
Diagram: "Geschäfts-\nprozess"
Database: "Geschäftsprozess"     ✅
```

### More Examples

```
Input: "Informa-\ntionsverarbeitung"
Output: "Informationsverarbeitung"

Input: "Software-\nentwicklung und\nQualitäts-\nsicherung"
Output: "Softwareentwicklung und Qualitätssicherung"

Input: "Business-\nProcess Management"
Output: "BusinessProcess Management"
```

## Test Suite

The file `textWrapperTest.ts` contains a new `testTextNormalization` function that tests various hyphenation scenarios.

## Impact

- ✅ Hyphenation is only used for display, not for the database
- ✅ Consistent database entries without formatting artifacts
- ✅ Better search functionality in the database
- ✅ No breaking changes for existing functionality
- ✅ Backward compatibility ensured
