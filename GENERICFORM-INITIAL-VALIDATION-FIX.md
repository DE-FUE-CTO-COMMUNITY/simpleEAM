# GenericForm Initial Validation Fix

## Problem

Bei der GenericForm-Komponente wurde im Create-Modus beim initialen Laden keine Validierung durchgeführt. Alle Felder wurden als gültig angezeigt, obwohl ungültige Felder (z.B. leere Pflichtfelder) vorhanden waren.

## Ursache

Das Standardverhalten von TanStack Form zeigt Validierungsfehler nur für Felder an, die bereits berührt (`isTouched`) oder geändert (`isDirty`) wurden. Im Create-Modus sind alle Felder initial unberührt, wodurch Validierungsfehler nicht angezeigt werden.

## Lösung

### 1. Initiale Validierung im Create-Modus

**Neue useEffect-Hook** zur Durchführung einer initialen Validierung:

```tsx
React.useEffect(() => {
  if (isOpen && form && isCreateMode) {
    // Im Create-Modus führen wir eine initiale Validierung durch
    // Wir verwenden einen kleinen Timeout, um sicherzustellen, dass die Form vollständig initialisiert ist
    const timer = setTimeout(() => {
      try {
        // Validiere alle Felder mit dem 'change' Event-Typ
        form.validateAllFields('change')
      } catch (error) {
        console.warn('Initiale Validierung fehlgeschlagen:', error)
      }
    }, 100)

    return () => clearTimeout(timer)
  }
}, [form, isOpen, isCreateMode])
```

### 2. Erweiterte Validierungslogik

**Neue Logik für shouldShowError**:

```tsx
// Erweiterte Validierungslogik für bessere UX im Create-Modus
// Im Create-Modus zeigen wir Validierungsfehler für ungültige Felder sofort an,
// auch wenn sie noch nicht berührt wurden. Im Edit-Modus verwenden wir das Standard-Verhalten.
const shouldShowError = isCreateMode
  ? !formField.state.meta.isValid
  : !formField.state.meta.isValid &&
    (formField.state.meta.isTouched || formField.state.meta.isDirty)

// Im Create-Modus forcieren wir die Anzeige von Validierungsfehlern für Pflichtfelder
// die noch keinen Wert haben, unabhängig vom Touch-Status
const forceShowErrorInCreateMode =
  isCreateMode &&
  field.required &&
  (formField.state.value === '' ||
    formField.state.value === null ||
    formField.state.value === undefined)

const finalShouldShowError = shouldShowError || forceShowErrorInCreateMode
```

### 3. Verbesserte Helper-Text-Logik

**Standardfehlermeldung für leere Pflichtfelder**:

```tsx
const getHelperText = () => {
  if (finalShouldShowError && formField.state.meta.errors.length > 0) {
    // Bestehende Fehlerbehandlung...
    return formField.state.meta.errors.map(/* ... */).join(', ')
  }

  // Im Create-Modus zeigen wir für Pflichtfelder ohne Wert eine Standardmeldung
  if (forceShowErrorInCreateMode) {
    return `${field.label} ist ein Pflichtfeld`
  }

  return field.helperText || ''
}
```

## Geänderte Dateien

1. **GenericForm.tsx**:
   - Neue initiale Validierungslogik im Create-Modus
   - Erweiterte `shouldShowError`-Logik
   - Verbesserte `getHelperText`-Funktion
   - Alle UI-Komponenten verwenden jetzt `finalShouldShowError`

## Verhalten

### Vorher

- **Create-Modus**: Alle Felder werden als gültig angezeigt, auch wenn sie leer sind
- **Edit-Modus**: Validierungsfehler nur nach Benutzerinteraktion

### Nachher

- **Create-Modus**: Pflichtfelder werden sofort als ungültig angezeigt mit der Meldung "{Feldname} ist ein Pflichtfeld"
- **Edit-Modus**: Unverändert - Validierungsfehler nur nach Benutzerinteraktion

## Test Status

✅ **TypeScript-Kompilierung erfolgreich**  
✅ **Keine ESLint-Fehler**  
✅ **Alle `shouldShowError` korrekt durch `finalShouldShowError` ersetzt**

## Vorteile

1. **Bessere UX im Create-Modus**: Benutzer sehen sofort, welche Felder ausgefüllt werden müssen
2. **Konsistentes Verhalten**: Edit-Modus behält das bewährte Verhalten bei
3. **Klare Fehlermeldungen**: Standardmeldungen für leere Pflichtfelder
4. **TanStack Form Best Practices**: Nutzung der offiziellen API-Methoden

## Referenzen

- [TanStack Form Validation Guide](https://tanstack.com/form/latest/docs/react/guides/validation)
- [TanStack Form Field API](https://tanstack.com/form/latest/docs/framework/react/reference/useField)
