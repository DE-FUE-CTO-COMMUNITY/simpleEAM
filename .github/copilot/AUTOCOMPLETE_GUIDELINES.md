# Material UI Autocomplete - Best Practices und Richtlinien

Dieses Dokument enthält Richtlinien und Best Practices für die Verwendung der Material UI Autocomplete-Komponente in Simple-EAM, insbesondere zur Fehlerbehebung bei der Anzeige von IDs statt Namen in Autocomplete-Chips.

## Grundlegende Konzepte

Die Autocomplete-Komponente von Material UI (v7+) wird für Felder mit Auswahlmöglichkeiten verwendet, die Funktionen wie Suche, Mehrfachauswahl und freie Eingabe unterstützen.

### Prop-Typen

```typescript
interface SelectOption {
  value: string | number | boolean | null
  label: string
  [key: string]: any // Erlaubt zusätzliche Eigenschaften
}
```

## Wichtige Props für korrekte Autocomplete-Konfiguration

Bei der Arbeit mit Objekten (z.B. GraphQL-Entitäten) und in Formularen mit der GenericForm-Komponente sind folgende Props besonders wichtig:

### 1. `isOptionEqualToValue` (ERFORDERLICH bei Objekten)

Diese Prop ist **entscheidend**, wenn die Options-Werte Objekte sind. Sie bestimmt, wie die Gleichheit zwischen einer Option und einem Wert ermittelt wird.

```tsx
isOptionEqualToValue={(option, value) => {
  // Wenn beide null oder undefined sind
  if (!option && !value) return true;
  // Wenn einer null/undefined ist, der andere aber nicht
  if (!option || !value) return false;

  // Wenn beide Strings sind
  if (typeof option === 'string' && typeof value === 'string')
    return option === value;

  // Wenn beide Objekte sind mit value/label-Struktur
  if (typeof option === 'object' && typeof value === 'object') {
    // Wenn value ein einfaches {value: id} Objekt ist
    if (value.value && !value.label) {
      return option.value === value.value;
    }
    // Normale Objekte mit value/label
    return option.value === value.value;
  }

  // Wenn value ein Wert ist und option ein Objekt
  if (typeof value !== 'object' && typeof option === 'object') {
    return option.value === value;
  }

  return false;
}}
```

### 2. `getOptionLabel` (ERFORDERLICH für Anzeige)

Diese Prop bestimmt, wie eine Option als Text angezeigt wird:

```tsx
getOptionLabel={(option) => {
  if (typeof option === 'string') return option;
  // Wenn option ein Objekt mit value und label ist
  if (option?.label) return option.label;
  // Wenn es ein Wert ist, der in der options-Liste existiert
  if (option?.value) {
    const foundOption = field.options?.find(opt =>
      opt.value === option.value || opt.value === option
    );
    return foundOption?.label || String(option.value || '');
  }
  return String(option || '');
}}
```

### 3. `renderOption` (EMPFOHLEN für benutzerdefinierte Anzeige)

Steuert die Darstellung der Optionen in der Dropdown-Liste:

```tsx
renderOption={(props, option) => (
  <li {...props} key={String(option.value)}>
    {typeof option === 'string'
      ? option
      : option.label || String(option.value || '')}
  </li>
)}
```

### 4. `renderValue` (WICHTIG bei Mehrfachauswahl)

Besonders wichtig bei der Anzeige von ausgewählten Elementen in Chips bei `multiple={true}`:

```tsx
renderValue={(selected) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
    {selected.map((value) => (
      <Chip
        key={typeof value === 'string' ? value : value.value}
        label={typeof value === 'string' ? value : value.label || String(value.value)}
      />
    ))}
  </Box>
)}
```

## Typische Fehler und Lösungen

### 1. Problem: IDs statt Namen in Chips

**Symptom:** In Chips oder Auswahlfeldern werden IDs angezeigt statt der Anzeigenamen.

**Ursachen:**

- Fehlende oder unzureichende `getOptionLabel`-Definition
- Fehlender `renderValue` bei komplexen Objekten
- Daten werden als einfache IDs statt als komplette Objekte gespeichert

**Lösung:**

- Implementieren Sie `isOptionEqualToValue` für korrekten Vergleich
- Verbessern Sie `getOptionLabel`, um Labels aus IDs zu extrahieren
- Verwenden Sie `renderOption` für verbesserte Anzeige

### 2. Problem: Auswahlprobleme bei Bearbeitung

**Symptom:** Ausgewählte Elemente werden beim Bearbeiten eines Formulars nicht korrekt angezeigt.

**Ursachen:**

- Unterschiedliche Objektreferenzen zwischen gespeicherten und angezeigten Optionen
- Fehlender `isOptionEqualToValue`

**Lösung:**

- Verwenden Sie immer `isOptionEqualToValue` für zuverlässige Objektvergleiche

## Komplette Beispiel-Implementation

```tsx
<Autocomplete
  options={field.options || []}
  value={formField.state.value}
  onChange={(_, newValue) => formField.handleChange(newValue)}
  disabled={disabled}
  multiple={field.multiple}
  freeSolo={field.freeSolo}
  isOptionEqualToValue={(option, value) => {
    if (!option && !value) return true
    if (!option || !value) return false

    if (typeof option === 'string' && typeof value === 'string') return option === value

    if (typeof option === 'object' && typeof value === 'object') {
      if (value.value && !value.label) {
        return option.value === value.value
      }
      return option.value === value.value
    }

    if (typeof value !== 'object' && typeof option === 'object') {
      return option.value === value
    }

    return false
  }}
  getOptionLabel={option => {
    if (typeof option === 'string') return option
    if (option?.label) return option.label
    if (option?.value) {
      const foundOption = field.options?.find(
        opt => opt.value === option.value || opt.value === option
      )
      return foundOption?.label || String(option.value || '')
    }
    return String(option || '')
  }}
  renderOption={(props, option) => (
    <li {...props} key={typeof option === 'string' ? option : String(option.value)}>
      {typeof option === 'string' ? option : option.label || String(option.value || '')}
    </li>
  )}
  renderInput={params => (
    <TextField
      {...params}
      error={isError}
      placeholder={field.placeholder}
      InputProps={{
        ...params.InputProps,
        readOnly: !!field.readOnly,
      }}
      onBlur={formField.handleBlur}
    />
  )}
/>
```

## Best Practices

1. **Datenkonsistenz:** Stellen Sie sicher, dass die Datenstruktur für Optionen konsistent ist und stets `value` und `label` enthält.

2. **Typüberprüfung:** Implementieren Sie immer robuste Typüberprüfungen in `getOptionLabel` und `isOptionEqualToValue`, um mit verschiedenen Datenformaten umgehen zu können.

3. **Erforderliche Props:** Die Props `isOptionEqualToValue` und `getOptionLabel` sollten für alle Autocomplete-Komponenten mit Objekten definiert werden.

4. **Memoization:** Verwenden Sie `useMemo` für Options-Arrays, um unnötige Re-Renders zu vermeiden.

5. **Fehlerbehandlung:** Implementieren Sie defensive Programmierung, um mit fehlenden Daten umzugehen.

## Referenzen

- [Material UI Autocomplete Dokumentation](https://mui.com/material-ui/react-autocomplete/)
- [Material UI Autocomplete API-Referenz](https://mui.com/material-ui/api/autocomplete/)
