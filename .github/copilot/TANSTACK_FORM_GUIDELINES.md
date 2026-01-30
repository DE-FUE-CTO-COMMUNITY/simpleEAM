# TanStack Form Richtlinien

Diese Richtlinien definieren, wie TanStack Form in diesem Projekt eingesetzt werden soll.

## Grundkonzepte

### Form Definition

- Verwende `useForm` zur Erstellung einer Form-Instanz
- Für wiederverwendbare Formularkonfigurationen nutze `formOptions`
- Definiere immer streng typisierte Default-Werte

```tsx
interface User {
  firstName: string
  lastName: string
  age: number
}

const defaultUser: User = { firstName: '', lastName: '', age: 0 }

// Form Instance erstellen
const form = useForm({
  defaultValues: defaultUser,
  onSubmit: async ({ value }) => {
    // Logik für Formularversand
    console.log(value)
  },
  validators: {
    onChange: userSchema, // Zod-Schema für Validierung
  },
})
```

### Field Management

- Verwende `form.Field` mit eindeutigen Namen für jedes Feld
- Arbeite mit Render Props für optimale Typisierung
- Nutze Field-States (`isTouched`, `isDirty`, `isPristine`) für UI-Anpassungen
- Setze `mode="array"` für Array-Felder (Listen, mehrere Werte)

```tsx
<form.Field name="firstName">
  {field => (
    <FormControl>
      <FormLabel>Vorname</FormLabel>
      <TextField
        value={field.state.value}
        onChange={e => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        error={field.state.meta.isTouched && !field.state.meta.isValid}
      />
      <FormHelperText>
        {field.state.meta.errors ? field.state.meta.errors.join(', ') : ''}
      </FormHelperText>
    </FormControl>
  )}
</form.Field>
```

### Feldstatus

TanStack Form bietet verschiedene Metadaten für Feldstatus:

- `isTouched`: Feld wurde angeklickt/fokussiert
- `isPristine`: Wert wurde noch nicht geändert
- `isDirty`: Wert wurde geändert
- `isDefaultValue`: Wert entspricht dem Standardwert

![Field states](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/field-states.png)

TanStack Form verwendet das persistente "dirty" State-Modell: Ein Feld bleibt "dirty", auch wenn es auf den Standardwert zurückgesetzt wird.

### Validierung

- Bevorzuge Schema-Validierung mit Zod
- Nutze die entsprechenden Validierungszeitpunkte (`onChange`, `onChangeAsync`, `onBlur`, `onSubmit`)
- Setze `disableSubmitOnErrors` in GenericForm auf `true`, um Absenden mit Fehlern zu verhindern

```tsx
<form.Field
  name="firstName"
  validators={{
    onChange: value => (!value ? 'Vorname ist erforderlich' : undefined),
    onBlur: value => (value.length < 3 ? 'Zu kurz' : undefined),
    // Asynchrone Validierung für Serveranfragen
    onChangeAsync: async value => {
      const exists = await checkIfNameExists(value)
      return exists ? 'Name bereits vergeben' : undefined
    },
  }}
>
  {/* Feldinhalt */}
</form.Field>
```

Für Schema-Validierung mit Zod:

```tsx
import { z } from 'zod'

const userSchema = z.object({
  firstName: z.string().min(3, 'Name muss mindestens 3 Zeichen haben'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen haben'),
  age: z.number().min(18, 'Muss mindestens 18 Jahre alt sein'),
})

const form = useForm({
  defaultValues: defaultUser,
  validators: {
    onChange: userSchema, // Schema für Formularvalidierung
  },
})
```

#### Validierungszeitpunkte

TanStack Form ermöglicht verschiedene Zeitpunkte für die Validierung:

- **onChange**: Validierung bei jeder Änderung des Feldwerts (für sofortiges Feedback)
- **onBlur**: Validierung, wenn das Feld den Fokus verliert (weniger aggressiv)
- **onSubmit**: Validierung nur beim Absenden des Formulars
- **onChangeAsync/onBlurAsync/onSubmitAsync**: Asynchrone Pendants (z.B. für Server-Validierung)

Sie können verschiedene Validierungen für verschiedene Zeitpunkte kombinieren:

```tsx
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) => (value < 13 ? 'Mindestens 13 Jahre alt' : undefined),
    onBlur: ({ value }) => (value < 0 ? 'Keine negativen Werte erlaubt' : undefined),
  }}
>
  {field => (
    <>
      <input
        value={field.state.value}
        onChange={e => field.handleChange(Number(e.target.value))}
        onBlur={field.handleBlur} // Wichtig für onBlur-Validierung
      />
      {!field.state.meta.isValid && <em>{field.state.meta.errors.join(', ')}</em>}
    </>
  )}
</form.Field>
```

#### Fehleranzeige

TanStack Form bietet zwei Hauptwege, um Validierungsfehler anzuzeigen:

1. **errors-Array**: Enthält alle Fehler aus allen Validierungszeitpunkten

   ```tsx
   {
     !field.state.meta.isValid && <em>{field.state.meta.errors.join(', ')}</em>
   }
   ```

2. **errorMap-Objekt**: Gibt Zugriff auf Fehler nach Validierungszeitpunkt
   ```tsx
   {
     field.state.meta.errorMap['onChange'] && <em>{field.state.meta.errorMap['onChange']}</em>
   }
   ```

Die `errorMap` und `errors` entsprechen den zurückgegebenen Typen der Validatoren:

```tsx
<form.Field
  name="age"
  validators={{
    onChange: ({ value }) => (value < 13 ? { tooYoung: true } : undefined),
  }}
>
  {field => (
    <>
      {/* errorMap.onChange ist vom Typ `{tooYoung: true} | undefined` */}
      {field.state.meta.errorMap['onChange']?.tooYoung && <em>Der Benutzer ist zu jung</em>}
    </>
  )}
</form.Field>
```

#### Formular- vs. Feldvalidierung

Validierungen können sowohl auf Feld- als auch auf Formularebene definiert werden:

```tsx
// Formular-Validierung
const form = useForm({
  defaultValues: { age: 0 },
  onSubmit: async ({ value }) => {
    console.log(value)
  },
  validators: {
    onChange({ value }) {
      if (value.age < 13) {
        return 'Muss mindestens 13 Jahre alt sein'
      }
      return undefined
    },
  },
})

// Zugriff auf Formularfehler mit useStore oder form.Subscribe
const formErrorMap = useStore(form.store, state => state.errorMap)

return (
  <div>
    {formErrorMap.onChange && (
      <div>
        <em>Formularfehler: {formErrorMap.onChange}</em>
      </div>
    )}
  </div>
)
```

#### Feldspezifische Fehler aus Formular-Validierung

Sie können Fehler für bestimmte Felder aus der Formular-Validierung zurückgeben:

```tsx
const form = useForm({
  defaultValues: {
    age: 0,
    details: { email: '' },
  },
  validators: {
    onSubmitAsync: async ({ value }) => {
      // Servervalidierung simulieren
      const hasErrors = await validateOnServer(value)
      if (hasErrors) {
        return {
          form: 'Ungültige Daten', // Optional: allgemeiner Formularfehler
          fields: {
            age: 'Muss mindestens 13 Jahre alt sein',
            // Bei verschachtelten Feldern den Feldpfad angeben
            'details.email': 'E-Mail ist erforderlich',
          },
        }
      }
      return null
    },
  },
})
```

> **Hinweis:** Wenn sowohl Formular- als auch feldspezifische Validierungen für ein Feld vorhanden sind, hat die feldspezifische Validierung Vorrang.

#### Asynchrone Validierung

Für Validierungen, die Netzwerkanfragen erfordern, verwenden Sie die asynchronen Validierungsmethoden:

```tsx
<form.Field
  name="username"
  validators={{
    onChangeAsync: async ({ value }) => {
      // API-Anfrage, um zu prüfen, ob Benutzername verfügbar ist
      const response = await fetch(`/api/check-username?username=${value}`)
      const data = await response.json()
      return data.isAvailable ? undefined : 'Benutzername bereits vergeben'
    },
  }}
>
  {/* Feldinhalt */}
</form.Field>
```

Um Ihre API nicht mit zu vielen Anfragen zu überlasten, können Sie asynchrone Validierungen drosseln:

```tsx
<form.Field
  name="username"
  asyncDebounceMs={500} // Wartet 500ms nach der letzten Eingabe
  validators={{
    onChangeAsync: async ({ value }) => {
      // Diese Validierung wird nur alle 500ms nach der letzten Eingabe aufgerufen
      const isAvailable = await checkUsername(value)
      return isAvailable ? undefined : 'Benutzername bereits vergeben'
    },
  }}
>
  {/* Feldinhalt */}
</form.Field>
```

Sie können auch unterschiedliche Verzögerungszeiten für verschiedene Validierungen festlegen:

```tsx
<form.Field
  name="username"
  asyncDebounceMs={500} // Standardverzögerung
  validators={{
    onChangeAsyncDebounceMs: 1000, // Spezifische Verzögerung für onChange
    onChangeAsync: async ({ value }) => {
      // ...
    },
    onBlurAsync: async ({ value }) => {
      // Verwendet die Standardverzögerung von 500ms
    },
  }}
>
  {/* Feldinhalt */}
</form.Field>
```

#### Verhindern der Formularübermittlung bei Fehlern

Das Formular besitzt einen `canSubmit`-Status, der `false` ist, wenn Validierungsfehler vorliegen:

```tsx
// Verwenden von form.Subscribe für optimiertes Rendering
<form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
  {([canSubmit, isSubmitting]) => (
    <Button type="submit" disabled={!canSubmit}>
      {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
    </Button>
  )}
</form.Subscribe>
```

In der GenericForm-Komponente wird dieses Verhalten durch die Prop `disableSubmitOnErrors` gesteuert (standardmäßig `true`).

#### Synchrone und asynchrone Validierung kombinieren

Wenn Sie sowohl synchrone als auch asynchrone Validierungen für dasselbe Ereignis haben, wird die asynchrone Validierung nur ausgeführt, wenn die synchrone Validierung erfolgreich ist:

```tsx
<form.Field
  name="age"
  validators={{
    onBlur: ({ value }) => (value < 13 ? 'Mindestens 13 Jahre alt' : undefined),
    onBlurAsync: async ({ value }) => {
      // Wird nur ausgeführt, wenn value >= 13 ist
      const currentAge = await fetchCurrentAge()
      return value < currentAge ? 'Alter kann nur erhöht werden' : undefined
    },
  }}
>
  {/* Feldinhalt */}
</form.Field>
```

Um dieses Verhalten zu ändern und die asynchrone Validierung immer auszuführen, setzen Sie die Option `asyncAlways` auf `true`.

### Reaktivität und Performance

- Nutze `useStore` mit selektiven Selektoren für optimierte Neurendering
- Vermeide Komponenten-Neurendering bei nicht relevanten State-Änderungen
- Setze `form.Subscribe` für Button-Status etc. ein

```tsx
// Gut: Nur bei Änderung von firstName neu rendern
const firstName = useStore(form.store, state => state.values.firstName)

// Gut: Nur bei Änderung von Absende-Status neu rendern
<form.Subscribe
  selector={(state) => [state.canSubmit, state.isSubmitting]}
>
  {([canSubmit, isSubmitting]) => (
    <Button type="submit" disabled={!canSubmit}>
      {isSubmitting ? '...' : 'Absenden'}
    </Button>
  )}
</form.Subscribe>

// Schlecht: Führt zu Neurendering bei jeder State-Änderung
const store = useStore(form.store) // Keinen Selektor angeben
```

### Reset-Buttons und Formular-Zurücksetzen

- Bei Reset-Buttons den nativen Reset-Mechanismus verhindern und `form.reset()` verwenden

```tsx
<Button
  type="reset"
  onClick={event => {
    // Vermeide Standard-HTML-Reset
    event.preventDefault()
    form.reset()
  }}
>
  Zurücksetzen
</Button>
```

### Integration mit Material UI

TanStack Form ist eine Headless-Bibliothek, die sich problemlos mit Material UI integrieren lässt. In diesem Projekt verwenden wir ausschließlich Material UI als UI-Bibliothek.

#### Grundprinzipien der Integration

1. **Render Props Pattern**: Die meisten Integrationen erfolgen über das Render Props-Pattern, wobei die Material UI-Komponenten innerhalb der `form.Field`-Komponente gerendert werden.

2. **Props-Weiterleitung**: Die TanStack Form Field-API stellt Status und Handler bereit, die an Material UI-Komponenten weitergeleitet werden.

3. **Typsichere Implementierung**: Die Integration bietet vollständige TypeScript-Unterstützung.

#### Beispiel mit Material UI TextField

Hier ist ein Beispiel für die Integration von TanStack Form mit Material UI:

```tsx
<form.Field name="lastName">
  {({ state, handleChange, handleBlur }) => (
    <TextField
      label="Nachname"
      variant="outlined"
      value={state.value === null ? '' : state.value}
      onChange={e => handleChange(e.target.value)}
      onBlur={handleBlur}
      error={state.meta.isTouched && !state.meta.isValid}
      helperText={
        state.meta.isTouched && state.meta.errors
          ? state.meta.errors.join(', ')
          : 'Bitte geben Sie Ihren Nachnamen ein'
      }
      fullWidth
    />
  )}
</form.Field>
```

#### Integration mit weiteren Material UI-Komponenten

**Checkbox**:

```tsx
<form.Field name="isActive">
  {({ state, handleChange }) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={!!state.value}
          onChange={e => handleChange(e.target.checked)}
          name="isActive"
        />
      }
      label="Aktiv"
    />
  )}
</form.Field>
```

**Select**:

```tsx
<form.Field name="category">
  {({ state, handleChange, handleBlur }) => (
    <TextField
      select
      label="Kategorie"
      value={state.value || ''}
      onChange={e => handleChange(e.target.value)}
      onBlur={handleBlur}
      error={state.meta.isTouched && !state.meta.isValid}
      helperText={state.meta.errors ? state.meta.errors.join(', ') : ''}
      fullWidth
    >
      <MenuItem value="">
        <em>Bitte wählen</em>
      </MenuItem>
      <MenuItem value="it">IT</MenuItem>
      <MenuItem value="hr">Personalwesen</MenuItem>
      <MenuItem value="finance">Finanzen</MenuItem>
    </TextField>
  )}
</form.Field>
```

**DatePicker** (mit MUI X):

```tsx
<form.Field name="date">
  {({ state, handleChange }) => (
    <DatePicker
      label="Datum"
      value={state.value ? new Date(state.value) : null}
      onChange={newValue => {
        handleChange(newValue ? newValue.toISOString() : null)
      }}
      slotProps={{
        textField: {
          error: state.meta.isTouched && !state.meta.isValid,
          helperText: state.meta.errors ? state.meta.errors.join(', ') : '',
        },
      }}
    />
  )}
</form.Field>
```

**Autocomplete**:

```tsx
<form.Field name="tags">
  {({ state, handleChange }) => (
    <Autocomplete
      multiple
      options={availableTags}
      value={state.value || []}
      onChange={(_, newValue) => handleChange(newValue)}
      renderInput={params => (
        <TextField
          {...params}
          label="Tags"
          error={state.meta.isTouched && !state.meta.isValid}
          helperText={state.meta.errors ? state.meta.errors.join(', ') : ''}
        />
      )}
    />
  )}
</form.Field>
```

#### Verwendung mit GenericForm

Die GenericForm-Komponente in diesem Projekt abstrahiert die direkte Integration mit Material UI. Sie verwendet intern bereits Material UI-Komponenten und unterstützt verschiedene Feldtypen wie `text`, `textarea`, `select`, `date`, usw.

Für fortgeschrittenere Anwendungsfälle können Sie die `customRender`-Funktion in der `FieldConfig` nutzen:

```tsx
// Feldkonfiguration mit customRender für komplexere Material UI-Komponenten
const fields: FieldConfig[] = [
  {
    name: 'tags',
    label: 'Tags',
    type: 'custom',
    customRender: (formField, isDisabled) => (
      <Autocomplete
        multiple
        options={availableTags}
        value={formField.state.value || []}
        onChange={(_, newValue) => formField.handleChange(newValue)}
        disabled={isDisabled}
        renderInput={params => (
          <TextField
            {...params}
            label="Tags"
            error={formField.state.meta.isTouched && !formField.state.meta.isValid}
            helperText={
              formField.state.meta.isTouched && formField.state.meta.errors
                ? formField.state.meta.errors.join(', ')
                : ''
            }
          />
        )}
      />
    ),
  },
  // Weitere Feldkonfigurationen...
]
```

### Integration mit Next.js App Router und Server Components

TanStack Form ist vollständig mit dem Next.js App Router und React Server Components kompatibel, benötigt jedoch eine spezielle Konfiguration für die Integration. In diesem Abschnitt werden die Best Practices für die Verwendung von TanStack Form in einer Next.js-Anwendung erläutert.

#### Architektur-Überblick

Bei der Integration von TanStack Form mit Next.js App Router sollte die Anwendung typischerweise folgenden Architektur-Mustern folgen:

1. **Server Components** - Für Datenabfragen und Routing
2. **Client Components** - Für interaktive Formulare mit TanStack Form
3. **Server Actions** - Für Formularvalidierung und Datenverarbeitungen

![Next.js App Router Integration](https://raw.githubusercontent.com/TanStack/form/main/docs/assets/nextjs-app-router-ui.png)

#### Import-Pfade für Server und Client

Next.js erfordert eine klare Trennung zwischen server- und clientseitigen Importen:

```tsx
// In Server Components oder Server Actions
import { formOptions, createServerValidate, initialFormState } from '@tanstack/react-form/nextjs'

// In Client Components
import { useForm, useTransform, mergeForm, useStore } from '@tanstack/react-form'
```

#### Gemeinsame Typendefinitionen

Für eine konsistente Typisierung zwischen Server und Client empfiehlt es sich, gemeinsame Typen und Schemas zu definieren:

```tsx
// types/user.ts (gemeinsamer Code)
import { z } from 'zod'

export const userSchema = z.object({
  firstName: z.string().min(3, 'Name muss mindestens 3 Zeichen haben'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen haben'),
  age: z.number().min(18, 'Muss mindestens 18 Jahre alt sein'),
})

export type User = z.infer<typeof userSchema>

export const defaultUser: User = {
  firstName: '',
  lastName: '',
  age: 0,
}
```

#### Gemeinsame Formular-Konfiguration

Mit `formOptions` können Sie eine gemeinsame Konfiguration erstellen, die sowohl auf dem Server als auch auf dem Client verwendet werden kann:

```tsx
// lib/forms/userForm.ts (gemeinsamer Code)
import { formOptions } from '@tanstack/react-form/nextjs'
import { defaultUser, userSchema } from '@/types/user'

export const userFormOpts = formOptions({
  defaultValues: defaultUser,
  // Optionale Validierungen, die sowohl client- als auch serverseitig verwendet werden
  validators: {
    onChange: userSchema,
  },
})
```

#### Server Actions für Formularverarbeitung

Server Actions ermöglichen die serverseitige Validierung und Verarbeitung von Formulardaten:

```tsx
// app/actions/userActions.ts
'use server'

import { createServerValidate, ServerValidateError } from '@tanstack/react-form/nextjs'
import { userFormOpts } from '@/lib/forms/userForm'
import { userSchema } from '@/types/user'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Server-Validator mit explizitem Zod-Schema und formOpts für Typ-Inferenz
const validateUserForm = createServerValidate({
  ...userFormOpts,
  onServerValidate: async ({ value }) => {
    // Serverseitige Validierung mit Zod
    try {
      userSchema.parse(value)
    } catch (error) {
      // Zod-Fehler in TanStack Form-Fehlerformat konvertieren
      if (error instanceof z.ZodError) {
        return error.errors.reduce(
          (acc, curr) => {
            const path = curr.path.join('.')
            return {
              ...acc,
              fields: {
                ...acc.fields,
                [path]: curr.message,
              },
            }
          },
          { form: 'Validierungsfehler', fields: {} }
        )
      }
    }

    // Geschäftslogik-Validierung (z.B. DB-Checks)
    const isUsernameAvailable = await checkUsernameAvailability(value.firstName)
    if (!isUsernameAvailable) {
      return {
        fields: {
          firstName: 'Dieser Name ist bereits vergeben',
        },
      }
    }

    // Keine Fehler
    return undefined
  },
})

export async function saveUserAction(prev: unknown, formData: FormData) {
  try {
    // 1. Validieren der Formulardaten
    const validatedData = await validateUserForm(formData)

    // 2. Daten speichern (z.B. in Datenbank)
    await saveUserToDatabase(validatedData)

    // 3. Cache invalidieren und weiterleiten
    revalidatePath('/users')
    redirect('/users')

    // Alternativ: Erfolgs-Response zurückgeben
    return { success: true, data: validatedData }
  } catch (error) {
    // Validierungsfehler zurückgeben
    if (error instanceof ServerValidateError) {
      return error.formState
    }

    // Andere Fehler behandeln
    console.error('Fehler beim Speichern:', error)
    return {
      success: false,
      form: 'Ein unerwarteter Fehler ist aufgetreten',
      fields: {},
    }
  }
}
```

#### Client-Komponente für das Formular

Die Client-Komponente erstellt und rendert das Formular mit TanStack Form:

```tsx
// components/UserForm.tsx
'use client'

import { useActionState } from 'react'
import { initialFormState } from '@tanstack/react-form/nextjs'
import { mergeForm, useForm, useStore, useTransform } from '@tanstack/react-form'
import { saveUserAction } from '@/app/actions/userActions'
import { userFormOpts } from '@/lib/forms/userForm'
import { TextField, Button, FormControl, FormHelperText, Box } from '@mui/material'

// Prop für initiale Daten (optional für Edit-Formulare)
interface UserFormProps {
  initialData?: User
}

export function UserForm({ initialData }: UserFormProps = {}) {
  // 1. Server Action mit initialFormState verbinden
  const [state, action] = useActionState(saveUserAction, initialFormState)

  // 2. TanStack Form mit Server-Zustand verbinden
  const form = useForm({
    ...userFormOpts,
    // Initiale Daten überschreiben, falls vorhanden
    defaultValues: initialData || userFormOpts.defaultValues,
    // Server-Zustand mit Client-Zustand zusammenführen
    transform: useTransform(baseForm => mergeForm(baseForm, state!), [state]),
  })

  // 3. Formularfehler mit useStore abonnieren
  const formErrors = useStore(form.store, formState => formState.errors)

  return (
    <form action={action as never} onSubmit={() => form.handleSubmit()}>
      {/* Allgemeine Formularfehler anzeigen */}
      {formErrors.length > 0 && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          {formErrors.map(error => (
            <div key={error as string}>{error}</div>
          ))}
        </Box>
      )}

      <Grid container spacing={2}>
        {/* Vorname-Feld */}
        <Grid size={6}>
          <form.Field
            name="firstName"
            validators={{
              // Client-seitige Validierung
              onChange: ({ value }) => (!value ? 'Vorname ist erforderlich' : undefined),
            }}
          >
            {field => (
              <TextField
                name="firstName" // Wichtig für FormData
                label="Vorname"
                value={field.state.value || ''}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.isTouched && !field.state.meta.isValid}
                helperText={field.state.meta.errors?.join(', ') || ''}
                fullWidth
              />
            )}
          </form.Field>
        </Grid>

        {/* Nachname-Feld */}
        <Grid size={6}>
          <form.Field name="lastName">
            {field => (
              <TextField
                name="lastName"
                label="Nachname"
                value={field.state.value || ''}
                onChange={e => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.isTouched && !field.state.meta.isValid}
                helperText={field.state.meta.errors?.join(', ') || ''}
                fullWidth
              />
            )}
          </form.Field>
        </Grid>

        {/* Alter-Feld */}
        <Grid size={6}>
          <form.Field name="age">
            {field => (
              <TextField
                name="age"
                label="Alter"
                type="number"
                value={field.state.value || ''}
                onChange={e => field.handleChange(Number(e.target.value))}
                onBlur={field.handleBlur}
                error={field.state.meta.isTouched && !field.state.meta.isValid}
                helperText={field.state.meta.errors?.join(', ') || ''}
                fullWidth
              />
            )}
          </form.Field>
        </Grid>
      </Grid>

      {/* Submit-Button mit Formstatus */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <form.Subscribe selector={formState => [formState.canSubmit, formState.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting} variant="contained">
              {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
            </Button>
          )}
        </form.Subscribe>
      </Box>
    </form>
  )
}
```

#### Verwendung in Server Components

Die Client-Komponente kann dann in einer Server-Komponente verwendet werden:

```tsx
// app/users/new/page.tsx
import { UserForm } from '@/components/UserForm'
import { Card, CardContent, CardHeader } from '@mui/material'

export default async function NewUserPage() {
  // Hier können serverseitige Daten geladen werden
  // z.B. für Select-Optionen oder andere Metadaten

  return (
    <Card>
      <CardHeader title="Neuen Benutzer anlegen" />
      <CardContent>
        {/* Client-Komponente in Server-Komponente einbetten */}
        <UserForm />
      </CardContent>
    </Card>
  )
}
```

#### Edit-Formular mit vorhandenen Daten

Für Bearbeitungsformulare können Sie vorhandene Daten vom Server laden:

```tsx
// app/users/[id]/edit/page.tsx
import { UserForm } from '@/components/UserForm'
import { getUserById } from '@/lib/api/users'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@mui/material'

export default async function EditUserPage({ params }: { params: { id: string } }) {
  // 1. Daten auf dem Server laden
  const user = await getUserById(params.id)

  // 2. 404-Fehler, wenn Benutzer nicht gefunden
  if (!user) {
    notFound()
  }

  return (
    <Card>
      <CardHeader title={`Benutzer ${user.firstName} bearbeiten`} />
      <CardContent>
        {/* 3. Daten als Props an die Client-Komponente übergeben */}
        <UserForm initialData={user} />
      </CardContent>
    </Card>
  )
}
```

#### Integration mit React Server Actions (RSC-Formen)

TanStack Form kann auch mit den nativen Server Action-Formularen von Next.js (`<form action={...}>`) verwendet werden:

```tsx
// app/users/actions.ts
'use server'

import { z } from 'zod'
import { userSchema } from '@/types/user'

export async function createUser(formData: FormData) {
  // Formular-Werte extrahieren
  const values = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    age: Number(formData.get('age')),
  }

  try {
    // Validieren mit Zod-Schema
    const validatedData = userSchema.parse(values)

    // In Datenbank speichern etc.

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
```

Verwendung in einer Client-Komponente mit TanStack Form:

```tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { createUser } from '@/app/users/actions'
import { userSchema, defaultUser } from '@/types/user'

export function SimpleUserForm() {
  const form = useForm({
    defaultValues: defaultUser,
    validators: {
      onChange: userSchema,
    },
  })

  return (
    <form action={createUser}>
      <form.Field name="firstName">
        {field => (
          <div>
            <label htmlFor="firstName">Vorname</label>
            <input
              id="firstName"
              name="firstName" // Wichtig für FormData
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors && <div>{field.state.meta.errors.join(', ')}</div>}
          </div>
        )}
      </form.Field>

      {/* Weitere Felder... */}

      <button type="submit">Speichern</button>
    </form>
  )
}
```

#### Wichtige Hinweise für die Next.js-Integration

1. **Pflicht zur Client-Direktive**: Der Formular-Code muss in einer Client-Komponente (`'use client'`) stehen, da TanStack Form React-Hooks verwendet.

2. **Richtige Import-Pfade**: Verwende `@tanstack/react-form/nextjs` für serverseitigen Code und `@tanstack/react-form` für clientseitigen Code.

3. **name-Attribute**: Felder müssen `name`-Attribute haben, die den Feldnamen im Schema entsprechen. Dies ist wichtig für die korrekte Datenübermittlung via FormData.

4. **TypeScript-Integration**: Konsistente Typen zwischen Server und Client sicherstellen durch gemeinsame Typendefinitionen.

5. **Formular-Reset**: Nach erfolgreicher Übermittlung kann das Formular zurückgesetzt werden:

   ```tsx
   useEffect(() => {
     if (state?.success) {
       form.reset() // Formular zurücksetzen
     }
   }, [state?.success, form])
   ```

6. **Serverseitige Verarbeitung**: Verwende `revalidatePath` und `redirect` in Server Actions für optimale Benutzererfahrung.

7. **Sicherheit**: Alle Eingaben (auch die bereits clientseitig validierten) müssen immer serverseitig validiert werden.

## Integration mit Generic Form

Bei der Verwendung der GenericForm-Komponente:

1. Erstelle ein validiertes Schema mit Zod
2. Definiere Defaultwerte die dem Schema entsprechen
3. Erstelle eine Form-Instanz mit `useForm`
4. Definiere Feldkonfigurationen mit Validatoren
5. Übergebe Form-Instanz und Konfigurationen an GenericForm

```tsx
// 1. Schema definieren
const schema = z.object({...})

// 2. Defaultwerte definieren
const defaultValues = {...}

// 3. Form erstellen
const form = useForm({
  defaultValues,
  onSubmit: async ({ value }) => {
    await onSubmit(value)
  },
  validators: {
    onChange: schema,
  },
})

// 4. & 5. Felder konfigurieren und GenericForm verwenden
return (
  <GenericForm
    form={form}
    fields={[...]} // FieldConfig-Array
    tabs={[...]}   // Optional: TabConfig-Array
    mode={mode}
    isOpen={isOpen}
    onClose={onClose}
    onSubmit={onSubmit}
    // weitere Props
  />
)
```
