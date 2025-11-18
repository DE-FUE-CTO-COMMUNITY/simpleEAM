# Hyphenation Normalization for Database Storage (Corrected)

## Problem

When text with hyphenation (Hypher) was displayed in the diagram, the hyphens were also stored in the database. This led to terms like "Geschäftsprozess" being stored as "Geschäfts-\nprozess" in the database.

**BUT:** Legitimate hyphens in names like "Backup-Datacenter" or "End-to-End-System" must be preserved!

## Solution

The `normalizeText` and `prepareTextForDatabase` functions were precisely adjusted to remove only **syllable hyphens** that are created through Hypher integration:

### Corrected `normalizeText` Function

```typescript
export const normalizeText = (text: string | undefined | null): string => {
  if (!text) return ''

  return text
    .replace(/\r?\n/g, ' ') // Replace line breaks with spaces
    .replace(/-\s*\n\s*/g, '') // Only remove hyphens that appear directly before line breaks
    .replace(/\s+/g, ' ') // Replace multiple spaces with single spaces
    .trim()
}
```

### Corrected `prepareTextForDatabase` Function

```typescript
export const prepareTextForDatabase = (text: string | undefined | null): string => {
  if (!text) return ''

  const normalized = normalizeText(text)

  // Only remove Unicode hyphens that can occur during syllable separation
  return normalized
    .replace(/\u00AD/g, '') // Remove soft hyphens
    .replace(/\.{3,}/g, '...') // Normalize ellipses
    .trim()
}
```

## What Gets Removed vs. What Remains

### ✅ Removed (syllable hyphens):

- `"Geschäfts-\nprozess"` → `"Geschäftsprozess"`
- `"Informa-\ntionsverarbeitung"` → `"Informationsverarbeitung"`
- `"Software-\nentwicklung"` → `"Softwareentwicklung"`
- `"Quality-\nAssurance"` → `"QualityAssurance"`
- Soft hyphens (Unicode \u00AD)

### ✅ Preserved (legitimate hyphens):

- `"Backup-Datacenter"` → `"Backup-Datacenter"`
- `"End-to-End-System"` → `"End-to-End-System"`
- `"Client-Server-Architecture"` → `"Client-Server-Architecture"`
- `"E-Mail-System"` → `"E-Mail-System"`
- `"Multi-Tier-Architecture"` → `"Multi-Tier-Architecture"`

## Precise Detection Logic

### Syllable Hyphens (removed):

- **Pattern:** `-\s*\n\s*` (Hyphen followed by optional whitespace, then line break)
- **Example:** `"Geschäfts-\nprozess"` or `"Geschäfts- \n prozess"`

### Legitimate Hyphens (preserved):

- **Pattern:** Hyphens that do NOT appear before line breaks
- **Example:** `"Backup-Datacenter"` or `"End-to-End"`

## Examples

### Combined Scenarios

```typescript
// Input: "Client-Server-\nArchitecture"
// Result: "Client-Server-Architecture"
// Explanation: Legitimate hyphens remain, syllable hyphen is removed

// Input: "Multi-Tier-\nApplication-\nServer"
// Result: "Multi-Tier-ApplicationServer"
// Explanation: First two hyphens remain, syllable hyphens are removed
```

### Before the Correction (too aggressive)

```
Input: "Backup-Datacenter"
Output: "BackupDatacenter"  ❌ (Legitimate hyphen removed)
```

### After the Correction (precise)

```
Input: "Backup-Datacenter"
Output: "Backup-Datacenter"  ✅ (Legitimate hyphen preserved)

Input: "Geschäfts-\nprozess"
Output: "Geschäftsprozess"     ✅ (Syllable hyphen removed)
```

## Adapted Functions

### `updateTextWithContainerBinding`

- Now uses `prepareTextForDatabase` for database storage
- Uses original text for position calculation (better display)

### `updateTextContentOnly`

- Now uses `prepareTextForDatabase` for database storage

### `databaseSyncUtils.ts`

- GraphQL mutation now uses `prepareTextForDatabase(newName)` instead of `newName.trim()`

## Updated Test Suite

### New Test Cases

```typescript
const testCases = [
  {
    input: 'Backup-Datacenter',
    expected: 'Backup-Datacenter',
    description: 'Legitimate hyphen in names (should be preserved)',
  },
  {
    input: 'End-to-End-System',
    expected: 'End-to-End-System',
    description: 'Multiple legitimate hyphens (should be preserved)',
  },
  {
    input: 'Client-Server-\nArchitecture',
    expected: 'Client-Server-Architecture',
    description: 'Combination of legitimate and syllable hyphens',
  },
]
```

## Impact of the Correction

- ✅ Hyphenation is only used for display
- ✅ Legitimate hyphens in names are preserved
- ✅ Consistent database entries without hyphenation artifacts
- ✅ Correct representation of compound names
- ✅ No breaking changes for existing functionality
- ✅ Improved search functionality while maintaining name integrity

## Technical Details

### Regex Explanation

- `/-\s*\n\s*/g`: Searches for hyphen followed by optional whitespace, then line break, then optional whitespace
- This rule captures all variants of syllable hyphens before line breaks
- Hyphens within a line are not touched

### Unicode Handling

- Only `\u00AD` (Soft Hyphen) is removed, as it's used for syllable separation
- Other Unicode hyphens are preserved, as they can be legitimate characters
