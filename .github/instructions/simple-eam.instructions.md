---
applyTo: '**'
---

# Simple-EAM (Enterprise Architecture Management)

## Projektübersicht

Dies ist ein Enterprise Architecture Management (EAM) System mit folgenden Komponenten:

- Neo4j-Datenbank für Grafenspeicherung
- GraphQL-Server für API-Funktionalität
- Keycloak für Authentifizierung und Autorisierung
- Next.js-Frontend für die Benutzeroberfläche

Alle Komponenten werden in separaten Docker-Containern bereitgestellt.

## Technologie-Stack

### Backend & Datenbanken

- **Neo4j**: Graphdatenbank für die Speicherung des Enterprise Architecture Models
- **GraphQL**: API-Schicht für effiziente Datenkommunikation
- **Keycloak**: Identitäts- und Zugriffsverwaltung

### Frontend

- **Next.js 15**: React-Framework für serverseitiges Rendering und optimierte Client-Anwendungen ([Dokumentation](https://nextjs.org/docs/app/guides/upgrading/version-15))
- **Material UI 7**: UI-Komponentenbibliothek für ein konsistentes und ansprechendes Design ([Integration mit Next.js](https://mui.com/material-ui/integrations/nextjs/))
- **Excalidraw**: Für visuelle Diagramme und Zeichnungen
- **Tanstack Table**: Für fortschrittliche Tabellenfunktionen ([Migrationsleitfaden](https://tanstack.com/table/latest/docs/guide/migrating))
  - **Migration auf V8**:
    - Komplette Neuimplementierung in TypeScript mit integrierten Typen
    - Verbesserte Framework-Unterstützung (React, Vue, Solid, Svelte)
    - Neue Features wie Column Pinning und erweiterte Filteroptionen
    - Bessere Steuerung für serverseitige Operationen
- **Tanstack Form**: Für einfache und leistungsstarke Formularerstellung ([Dokumentation](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts))
  - **Grundkonzepte**:
    - **Form Options**: Konfiguration via `formOptions` für wiederverwendbare Form-Definitionen
    - **Form Instance**: Erstellt mit `useForm` Hook, verwaltet das Formular
    - **Field**: Repräsentiert ein einzelnes Eingabefeld mit eigenen Methoden
    - **Field State**: Speichert Wert, Validierungsstatus und Metadaten
    - **Field API**: Bietet Methoden wie `handleChange`, `handleBlur` für Interaktionen
  - **Feld-Status**:
    - `isTouched`: Nach User-Interaktion mit dem Feld
    - `isPristine`: Solange der Wert unverändert ist
    - `isDirty`: Nachdem der Wert geändert wurde (auch beim Zurücksetzen)
    - `isDefaultValue`: Überprüft, ob der Wert dem Standardwert entspricht
  - **Validierung**:
    ```tsx
    <form.Field
      name="firstName"
      validators={{
        onChange: ({ value }) => !value ? 'Name erforderlich' : undefined,
        onChangeAsync: async ({ value }) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return value.includes('error') ? 'Fehler im Namen' : undefined;
        },
      }}
    >
      {(field) => (/* Render-Logik */)}
    </form.Field>
    ```
  - **Schema-Validierung**: Unterstützt [Standard Schema](https://github.com/standard-schema/standard-schema) mit Zod, Valibot und ArkType
  - **Reaktivität**: Optimierte Neurendering durch `useStore` und `form.Subscribe`
  - **Philosophie**: Vollständige Typ-Inferenz ohne explizite Generics, kontrollierte Eingabefelder
  - **Framework-agnostisch**: Unterstützt React, Vue, Angular, Solid, Svelte und Lit
- **Internationalisierungs-Bibliothek**: next-intl für mehrsprachigen Support
- **Excel-Bibliothek**: SheetJS (xlsx) für Import und Export von Excel-Dateien

## Best Practices

### TypeScript

- Strenge Typisierung für alle Komponenten und Funktionen verwenden
- Interface über Type bevorzugen, außer bei Union-Typen
- readonly-Attribute nutzen, wo sinnvoll
- Utility-Types wie Partial<T>, Pick<T>, Omit<T> aktiv einsetzen
- Null-Assertions (!) vermeiden, stattdessen ordnungsgemäße Null-Checks implementieren
- Enums vermeiden, stattdessen Union-Typen mit as const verwenden

### GraphQL

- Schema-First-Entwicklung befolgen
- Resolver modular organisieren
- Datenlader-Muster implementieren, um N+1-Probleme zu vermeiden
- Pagination für große Datenmengen implementieren
- Verschachtelte Objekte mit Fragment-Colocation abfragen
- Beziehungen effizient über Neo4j-Graphenstrukturen abbilden

### Tanstack Table

> [Offizielle Dokumentation: Migration auf V8](https://tanstack.com/table/latest/docs/guide/migrating)

#### Installation und Einrichtung

- **Paket-Update**:

  ```bash
  npm uninstall react-table @types/react-table
  yarn install @tanstack/react-table
  ```

  Die Typen sind jetzt im Basispaket enthalten; `@types/react-table` kann entfernt werden.

- **API-Änderungen**:
  - `useTable` wurde zu `useReactTable`
  - Das Plugin-System wurde durch funktionsbasierte Row Models ersetzt
  - Reihenfolge der Features spielt keine Rolle mehr

```tsx
// Vor der Migration (V7)
import { useTable, usePagination, useSortBy } from 'react-table'
const tableInstance = useTable({ columns, data }, useSortBy, usePagination)

// Nach der Migration (V8)
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
const tableInstance = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

#### Spalten-Definition

- **Neues API für Spalten-Definitionen**:

  - `accessor` wurde aufgeteilt in `accessorKey` (für Strings) und `accessorFn` (für Funktionen)
  - `Header` wurde zu `header`
  - `Cell` wurde zu `cell`
  - `width/minWidth/maxWidth` wurden zu `size/minSize/maxSize`

- **TypeScript-Integration mit `columnHelper`**:

  ```tsx
  import { createColumnHelper } from '@tanstack/react-table'
  const columnHelper = createColumnHelper<YourDataType>()

  const columns = [
    columnHelper.accessor('firstName', {
      header: 'Vorname',
    }),
    columnHelper.accessor(row => row.lastName, {
      header: () => <span>Nachname</span>,
    }),
    // Alternativ ohne Helper
    {
      accessorKey: 'email',
      header: 'E-Mail',
    },
  ]
  ```

#### Rendering und Markup-Änderungen

- **Neues Rendering-System**:
  - `flexRender` statt `cell.render('Cell')` oder `column.columnDef.header`
  - Alle `get*Props` Hilfsfunktionen wurden entfernt (z.B. `getHeaderProps`, `getCellProps`)
  - Manuelles Hinzufügen von ARIA und Event-Handler-Props ist erforderlich

```tsx
// Vor der Migration (V7)
<th {...header.getHeaderProps()}>{header.render('Header')}</th>
<td {...cell.getCellProps()}>{cell.render('Cell')}</td>

// Nach der Migration (V8)
<th key={header.id} colSpan={header.colSpan}>
  {flexRender(header.column.columnDef.header, header.getContext())}
</th>
<td key={cell.id}>
  {flexRender(cell.column.columnDef.cell, cell.getContext())}
</td>
```

#### Zustandsmanagement

- **Verbesserte Kontrollmöglichkeiten**:
  - State wird nun als kontrollierter React-State behandelt
  - Direkte Zugriffs- und Update-Funktionen für jeden State-Typ

```tsx
// Kontrollierter Sorting-State
const [sorting, setSorting] = React.useState<SortingState>([])

const table = useReactTable({
  columns,
  data,
  state: {
    sorting,
  },
  onSortingChange: setSorting,
  // Rest der Konfiguration...
})
```

#### Feature-Übergreifende Änderungen

- **Namenskonvention**: Alle `disable*` Optionen wurden zu `enable*` (z.B. `disableSortBy` → `enableSorting`)
- **Status-Werte**: Direkte Werte wurden durch Getter-Funktionen ersetzt (z.B. `isGrouped` → `getIsGrouped()`)
- **Filter-Funktionen**: Angepasste Signatur von `(rows, id, value) => rows` zu `(row, id, value) => boolean`
- **Event-Handler**: Neue getHandler-Funktionen (z.B. `getToggleAllRowsSelectedHandler()`)
- **Lazy-Evaluation**: Werte werden erst bei Aufruf ausgewertet (z.B. `getValue()` statt direktem `value`)

#### Best Practices für V8

- Verwenden von `useMemo` für Spalten-Definitionen zur Verbesserung der Performance
- Einsatz des eingebauten Dev-Tools für Debugging (`@tanstack/react-table-devtools`)
- Feingranulare Zustandskontrolle für bessere Interaktivität
- Nutzung der React-Server-Components Patterns bei der Integration mit Next.js
- Implementierung korrekter Accessibility-Attribute manuell
- Benutzung von virtuellen Listen bei großen Datenmengen für bessere Performance

### Tanstack Form

> [Offizielle Dokumentation: Basic Concepts](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts)

- **Form Definition**:

  - Verwenden Sie `formOptions` zur Erstellung wiederverwendbarer Form-Konfigurationen
  - Typ-Parameter für strikte Typisierung der Formulardaten einsetzen
  - Defaultwerte konsistent definieren, um Schema und Formular abzugleichen

  ```tsx
  interface User {
    firstName: string
    lastName: string
    age: number
  }

  const defaultUser: User = { firstName: '', lastName: '', age: 0 }

  // Wiederverwendbare Form-Konfiguration
  const formOpts = formOptions({
    defaultValues: defaultUser,
  })

  // Form Instance erstellen
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      // Formular verarbeiten
      await saveUser(value)
    },
  })
  ```

- **Field Management**:

  - `form.Field` mit eindeutigen Namen verwenden
  - Stets mit Render Props arbeiten für optimale Typ-Unterstützung
  - Field-Status für UI-Anpassungen nutzen (`isTouched`, `isDirty`, `isPristine`)
  - Verwendung von `form.Field` mit mode="array" für Array-Manipulation

- **Validierung**:

  - Vorzugsweise Schema-Validierung mit Zod verwenden für konsistente Datentypen
  - Bei komplexen Szenarien kombinieren mit feldspezifischen Validierungen
  - Asynchrone Validierungen für Server-Checks wie Eindeutigkeit von Benutzernames

  ```tsx
  import { z } from 'zod'

  const userSchema = z.object({
    firstName: z.string().min(2, 'Name zu kurz'),
    lastName: z.string().min(2, 'Nachname zu kurz'),
    age: z.number().min(18, 'Mindestens 18 Jahre alt'),
  })

  // Schema-Validierung auf Form-Ebene
  const form = useForm({
    defaultValues: defaultUser,
    validators: {
      onChange: userSchema,
    },
    onSubmit: async ({ value }) => {
      // Formular verarbeiten
    },
  })
  ```

  #### Erweiterte Validierungskonzepte

  - **Validierungszeitpunkte (WICHTIG - Anti-Pattern vermeiden)**:

    ⚠️ **NICHT alle Events mit derselben Validierung ausstatten**:

    ```tsx
    // ❌ FALSCH - führt zu doppelter Validierung und Performance-Problemen
    validators: {
      onChange: schema,
      onBlur: schema,    // ❌ Doppelte Validierung
      onMount: schema,   // ❌ Unnötige initiale Validierung
      onSubmit: schema,
    }
    ```

    ✅ **RICHTIG - Optimierte Validierungsstrategie**:

    ```tsx
    // ✅ Empfohlene Konfiguration
    validators: {
      onChange: schema,  // Primäre Validierung bei Eingabe
      onSubmit: schema,  // Finale Validierung beim Absenden
      // onBlur: nur bei spezifischen Anforderungen (externe API-Checks)
      // onMount: nur bei vorausgefüllten Formularen
    }
    ```

  - **Volle Kontrolle über wann Validierung ausgeführt wird**: `onChange`, `onBlur`, `onSubmit`
  - **Verschiedene Validierungen für unterschiedliche Ereignisse** (nur bei Bedarf):

    ```tsx
    <form.Field
      name="age"
      validators={{
        onChange: ({ value }) => (value < 13 ? 'Muss mindestens 13 sein' : undefined),
        onBlur: ({ value }) => (value < 0 ? 'Ungültiger Wert' : undefined),
      }}
    >
      {field => (
        <>
          <input
            value={field.state.value}
            onChange={e => field.handleChange(e.target.valueAsNumber)}
            onBlur={field.handleBlur}
          />
          {/* Fehler anzeigen */}
          {!field.state.meta.isValid && <em role="alert">{field.state.meta.errors.join(', ')}</em>}
        </>
      )}
    </form.Field>
    ```

  - **Fehleranzeige**:

    - Zugriff auf Fehler als Array: `field.state.meta.errors`
    - Zugriff auf Fehler nach Validierungstyp: `field.state.meta.errorMap['onChange']`
    - Typsichere Fehlerbehandlung durch Inferenz der Fehlertypen

  - **Formular- vs. Feldvalidierung**:

    - Validierung kann auf Formularebene oder pro Feld definiert werden
    - Formularvalidierung kann Feldfehlermeldungen setzen:

    ```tsx
    const form = useForm({
      defaultValues: { age: 0, email: '' },
      validators: {
        onSubmitAsync: async ({ value }) => {
          // Serverseitige Validierung
          const hasErrors = await verifyDataOnServer(value)
          if (hasErrors) {
            return {
              form: 'Ungültige Daten', // Optionale Formularfehlermeldung
              fields: {
                age: 'Muss mindestens 13 sein',
                email: 'E-Mail-Adresse existiert bereits',
              },
            }
          }
          return null
        },
      },
    })
    ```

  - **Asynchrone Validierung**:

    - Unterstützung für asynchrone Validierungen mit Endungen wie `onChangeAsync`
    - Kombinierbar mit synchronen Validierungen (ausführbar in Reihenfolge)
    - Integriertes Debouncing:

    ```tsx
    <form.Field
      name="username"
      asyncDebounceMs={500} // Globales Debouncing
      validators={{
        onChangeAsyncDebounceMs: 1000, // Spezifisches Debouncing
        onChangeAsync: async ({ value }) => {
          // Überprüfung, ob Benutzername bereits existiert
          const exists = await checkUsernameExists(value)
          return exists ? 'Benutzername bereits vergeben' : undefined
        },
      }}
    />
    ```

  - **Schema-basierte Validierung**:

    - Unterstützung für Libraries nach [Standard Schema](https://github.com/standard-schema/standard-schema):
    - Zod, Valibot, ArkType, Effect/Schema
    - Kann mit benutzerdefinierten Funktionen kombiniert werden:

    ```tsx
    <form.Field
      name="email"
      validators={{
        onChange: z.string().email('Gültige E-Mail-Adresse eingeben'),
        onChangeAsync: async ({ value, fieldApi }) => {
          // Schema-Validierung mit anschließender Logik
          const errors = fieldApi.parseValueWithSchema(
            z.string().email('Gültige E-Mail-Adresse eingeben')
          )
          if (errors) return errors

          // Zusätzliche asynchrone Validierung
          const isUnique = await checkEmailUnique(value)
          return isUnique ? undefined : 'E-Mail wird bereits verwendet'
        },
      }}
    />
    ```

  - **Formularübermittlung blockieren**:

    - Formular-State enthält `canSubmit`-Flag, das `false` ist, wenn Felder ungültig sind
    - Submit-Button kann automatisch deaktiviert werden:

    ```tsx
    <form.Subscribe
      selector={state => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <button type="submit" aria-disabled={!canSubmit}>
          {isSubmitting ? 'Wird übermittelt...' : 'Absenden'}
        </button>
      )}
    />
    ```

- **Optimierung und Reaktivität**:

  - Fein abgestimmte Komponenten-Updates mit `useStore` und selektiven Selektoren
  - `form.Subscribe` für optimierte Rendering-Performance verwenden
  - Selektoren immer angeben, um unnötige Re-Renders zu vermeiden

  ```tsx
  // Richtig - feingranulares Update nur bei Änderung des firstNames
  const firstName = useStore(form.store, state => state.values.firstName)

  // Falsch - führt zu Re-Render bei jeder State-Änderung
  const store = useStore(form.store)
  ```

- **Formular-Reset**:

  - Verwenden von Button vom Typ "button" statt "reset" bei der Arbeit mit Tanstack Form
  - Native Form-Reset verhindern mit `event.preventDefault()` wenn nötig
  - Listener einsetzen für komplexe Reset-Logik mit Abhängigkeiten

- **Formular-Dialog Interaktion**:

  - **Klare Verantwortlichkeiten definieren**:
    - Die Tabellen-Komponente sollte primär für Zustandsverwaltung des Dialogs verantwortlich sein (geöffnet/geschlossen)
    - Die Formular-Komponente sollte nur für Datenvalidierung und -übermittlung verantwortlich sein
  - **Zustandskoordination**:
    - Nach erfolgreicher Formularübermittlung explizit den Dialog schließen:
      ```tsx
      onSubmit: async ({ value }) => {
        try {
          await submitData(value)
          onClose() // Dialog schließen nach erfolgreicher Übermittlung
        } catch (error) {
          console.error('Fehler bei der Übermittlung:', error)
        }
      }
      ```
    - Formularübermittlung nur im bearbeitbaren Modus auslösen:
      ```tsx
      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          if (!isViewMode) {
            void form.handleSubmit()
          }
        }}
      >
      ```
  - **Dialog-Steuerung**:
    - Dialog nur im View-Modus automatisch schließbar machen:
      ```tsx
      <Dialog open={isOpen} onClose={isViewMode ? onClose : undefined}>
      ```
    - Bei Aktionen wie Löschen immer explizit den Dialog schließen:
      ```tsx
      const handleDelete = async () => {
        try {
          await deleteData(id)
        } finally {
          setShowConfirm(false)
          onClose() // Dialog immer schließen
        }
      }
      ```

- **Integration mit UI-Bibliotheken**:

  - Tanstack Form ist eine headless Bibliothek und lässt sich mit verschiedenen UI-Frameworks kombinieren
  - Besonders gut geeignet für Material UI, aber auch mit anderen Bibliotheken wie Mantine nutzbar

  ```tsx
  // Beispiel mit Material UI
  import { TextField, Checkbox } from '@mui/material'
  import { useForm } from '@tanstack/react-form'

  export default function Form() {
    const form = useForm({
      defaultValues: {
        firstName: '',
        lastName: '',
        isChecked: false,
      },
      onSubmit: async ({ value }) => {
        console.log(value)
      },
    })

    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="lastName"
          children={({ state, handleChange, handleBlur }) => (
            <TextField
              label="Nachname"
              variant="filled"
              defaultValue={state.value}
              onChange={e => handleChange(e.target.value)}
              onBlur={handleBlur}
              placeholder="Nachname eingeben"
              error={!state.meta.isValid}
              helperText={state.meta.errors.join(', ')}
            />
          )}
        />

        <form.Field
          name="isChecked"
          children={({ state, handleChange, handleBlur }) => (
            <Checkbox
              onChange={e => handleChange(e.target.checked)}
              onBlur={handleBlur}
              checked={state.value}
            />
          )}
        />

        <button type="submit">Absenden</button>
      </form>
    )
  }
  ```

  - **Best Practices für UI-Integration**:

    ⚠️ **WICHTIG - onBlur Handler korrekt verwenden**:

    ```tsx
    // ❌ FALSCH - Arrow Function um handleBlur
    onBlur={() => handleBlur()}

    // ✅ RICHTIG - Direkte Referenz
    onBlur={handleBlur}
    ```

    - Verwenden von Render Props für optimale Typunterstützung und Kontrolle
    - Selektive Destrukturierung der benötigten Properties (state, handleChange, handleBlur)
    - Fehlerstatusweitergabe an UI-Komponenten (z.B. `error={!state.meta.isValid}`)
    - Fehlermeldungen an UI-Komponenten weitergeben (z.B. `helperText={state.meta.errors.join(', ')}`)
    - Ereignishandler richtig transformieren (z.B. für Checkboxen: `(e) => handleChange(e.target.checked)`)
    - Konsistente Validierungsrückmeldung über alle Formularkomponenten hinweg

- **Integration mit Next.js App Router und Server Components**:

  - Für die Integration mit Next.js App Router sind spezielle Import-Pfade und Konfigurationen erforderlich
  - Nutzung von React Server Actions für serverseitige Validierung und Formularverarbeitung

  ```tsx
  // 1. Formulardefinition erstellen (shared-code.ts)
  // Beachte den speziellen Import-Pfad für Server Components
  import { formOptions } from '@tanstack/react-form/nextjs'

  export const formOpts = formOptions({
    defaultValues: {
      firstName: '',
      lastName: '',
      age: 0,
    },
  })
  ```

  ```tsx
  // 2. Server Action für Formularverarbeitung (action.ts)
  'use server'

  import { ServerValidateError, createServerValidate } from '@tanstack/react-form/nextjs'
  import { formOpts } from './shared-code'

  // Server-Validierung mit Typen aus formOpts
  const serverValidate = createServerValidate({
    ...formOpts,
    onServerValidate: ({ value }) => {
      // Serverseite Validierungslogik
      if (value.age < 12) {
        return 'Server-Validierung: Mindestalter ist 12 Jahre'
      }
    },
  })

  export default async function formAction(prev: unknown, formData: FormData) {
    try {
      const validatedData = await serverValidate(formData)

      // Hier können die Daten in der Datenbank gespeichert werden
      console.log('Validierte Daten:', validatedData)

      // Erfolgreiche Verarbeitung ohne Rückgabe von Fehlern
      return { success: true }
    } catch (e) {
      if (e instanceof ServerValidateError) {
        // Fehler an Client zurückgeben
        return e.formState
      }

      throw e
    }
  }
  ```

  ```tsx
  // 3. Client-Komponente für das Formular (ClientFormComponent.tsx)
  'use client'

  import { useActionState } from 'react'
  import { initialFormState } from '@tanstack/react-form/nextjs'
  // Beachte: Standard-Import für Client-Komponenten
  import { mergeForm, useForm, useStore, useTransform } from '@tanstack/react-form'
  import formAction from './action'
  import { formOpts } from './shared-code'

  export function ClientForm() {
    // useActionState für React Server Actions
    const [state, action] = useActionState(formAction, initialFormState)

    const form = useForm({
      ...formOpts,
      // Zusammenführen der Client- und Server-Status
      transform: useTransform(baseForm => mergeForm(baseForm, state!), [state]),
    })

    // Zugriff auf Formularfehler
    const formErrors = useStore(form.store, formState => formState.errors)

    return (
      <form action={action as never} onSubmit={() => form.handleSubmit()}>
        {/* Formularfehler anzeigen */}
        {formErrors.map(error => (
          <p key={error as string}>{error}</p>
        ))}

        {/* Formularfeld mit Client- und Server-Validierung */}
        <form.Field
          name="age"
          validators={{
            onChange: ({ value }) =>
              value < 8 ? 'Client-Validierung: Mindestalter ist 8 Jahre' : undefined,
          }}
        >
          {field => (
            <div>
              <input
                name="age"
                type="number"
                value={field.state.value}
                onChange={e => field.handleChange(e.target.valueAsNumber)}
              />
              {field.state.meta.errors.map(error => (
                <p key={error as string}>{error}</p>
              ))}
            </div>
          )}
        </form.Field>

        {/* Submit-Button mit Statusanzeige */}
        <form.Subscribe selector={formState => [formState.canSubmit, formState.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Wird übermittelt...' : 'Absenden'}
            </button>
          )}
        </form.Subscribe>
      </form>
    )
  }
  ```

  - **Wichtige Hinweise für SSR mit Next.js**:

    - Unterschiedliche Import-Pfade beachten: `@tanstack/react-form/nextjs` für Server-Code
    - Formularoptionen sollten in einer gemeinsam genutzten Datei definiert werden
    - Server Actions müssen mit `'use server'` markiert sein
    - Verwendung von `useActionState` zusammen mit `mergeForm` und `useTransform`
    - Fehlerbehandlung über `ServerValidateError` Klasse
    - Formulare müssen als Client-Komponenten markiert sein (`'use client'`)

### Next.js 15

> [Offizielle Dokumentation: Upgrading auf Next.js 15](https://nextjs.org/docs/app/guides/upgrading/version-15)

#### Upgrade-Anleitung

1. **Paket-Aktualisierung**:

   ```bash
   # Mit der Codemod (empfohlen):
   yarn dlx @next/codemod@canary upgrade latest

   # Oder manuell:
   yarn add next@latest react@latest react-dom@latest eslint-config-next@latest
   ```

2. **React 19 Kompatibilität**:
   - Mindestanforderung ist React 19
   - Aktualisieren Sie bei TypeScript auch `@types/react` und `@types/react-dom`
   - Beachten Sie Änderungen wie die Ersetzung von `useFormState` durch `useActionState`

#### Wichtige Änderungen in Next.js 15

1. **Asynchrone Request APIs** (Breaking Change):

   - `cookies()`, `headers()`, `draftMode()` sind jetzt asynchron
   - Empfohlene Verwendung: `const cookieStore = await cookies()`
   - Temporär kann mit Type-Casting synchron gearbeitet werden:
     `const cookieStore = cookies() as unknown as UnsafeUnwrappedCookies`

2. **Fetch-Caching**:

   - `fetch` Requests werden standardmäßig nicht mehr gecached
   - Für explizites Caching: `fetch('https://...', { cache: 'force-cache' })`
   - Opt-in für alle Fetch-Requests mit `export const fetchCache = 'default-cache'`

3. **Route Handlers**:

   - `GET`-Funktionen werden standardmäßig nicht mehr gecached
   - Für Caching: `export const dynamic = 'force-static'`

4. **Client-Side Router Cache**:

   - Seiten-Segmente werden bei Navigation nicht mehr aus dem Client-Cache wiederverwendet
   - Konfigurierbar mit der `staleTimes`-Option in der next.config.js

5. **Weitere Stabilisierungen**:
   - `next/font` statt `@next/font` verwenden
   - `serverComponentsExternalPackages` ist jetzt `serverExternalPackages`
   - `bundlePagesExternals` ist jetzt `bundlePagesRouterDependencies`

#### Best Practices

- App Router für Routing und Layout-Verwaltung verwenden
- Server Components wo immer möglich einsetzen
- Optimale Image-Optimierung mit next/image
- Caching-Strategien gezielt einsetzen: force-cache, no-store, etc.
- SEO-Optimierung durch Metadata API
- Streaming-Strategien für verbesserte Benutzererfahrung

### Material UI 7

> [Offizielle Dokumentation: Material UI mit Next.js](https://mui.com/material-ui/integrations/nextjs/)

#### Upgrade von v6 auf v7

Die Migration von Material UI v6 auf v7 bringt folgende wichtige Änderungen:

1. **Verbesserte ESM-Unterstützung**:

   - Aktualisiertes Package-Layout mit eindeutiger Unterstützung für ESM und CommonJS
   - Behebt Probleme mit Bundlern wie Vite und webpack

2. **Package-Layout-Änderungen**:

   - Deep Imports mit mehr als einer Ebene funktionieren nicht mehr:
     ```tsx
     // Alt
     import createTheme from '@mui/material/styles/createTheme'
     // Neu
     import { createTheme } from '@mui/material/styles'
     ```
   - Modern Bundles wurden entfernt; Aliase für diese müssen entfernt werden

3. **Grid-Umbenennungen**:

   - Der veraltete `Grid` wurde zu `GridLegacy` umbenannt
   - `Grid2` ersetzt nun den `Grid`-Namespace
   - Codemod verfügbar: `yarn dlx @mui/codemod v7.0.0/grid-props <path>`

   **Upgrade zu Grid v2:**

   Die Migration zu Grid v2 bietet folgende Verbesserungen:

   - Verwendet CSS-Variablen, entfernt CSS-Spezifität von Klassenselektoren
   - Alle Grids werden als Items betrachtet, ohne dass der `item`-Prop angegeben werden muss
   - Bietet Offset-Funktionalität für flexiblere Positionierung
   - Verschachtelte Grids haben keine Tiefenbeschränkung mehr
   - Verwendet keine negativen Margins, vermeidet dadurch Überlauf-Probleme

   **So führen Sie das Upgrade durch:**

   1. Import aktualisieren:

      ```tsx
      // Der Legacy-Grid-Komponente heißt jetzt GridLegacy
      -import Grid from '@mui/material/GridLegacy';

      // Die aktualisierte Grid-Komponente heißt Grid
      +import Grid from '@mui/material/Grid';
      ```

   2. Legacy-Props entfernen:
      ```tsx
      -<Grid item zeroMinWidth>
      +<Grid>
      ```
   3. Size-Props aktualisieren:

      ```tsx
      // Ab Material UI v6 wurden diese Props in 'size' umbenannt
      <Grid
      -  xs={12}
      -  sm={6}
      +  size={{ xs: 12, sm: 6 }}
      >

      // Bei gleichem Wert für alle Breakpoints:
      -<Grid xs={6}>
      +<Grid size={6}>

      // Der Wert 'true' wurde zu "grow" umbenannt:
      -<Grid xs>
      +<Grid size="grow">
      ```

4. **InputLabel size-Prop standardisiert**:

   - `'normal'` wurde durch `'medium'` ersetzt
   - Codemod verfügbar: `yarn dlx @mui/codemod v7.0.0/input-label-size-normal-medium <path>`

5. **Theme-Verhalten bei CSS-Variablen**:

   - Bei aktivierten CSS-Variablen mit Light/Dark-Modi ändert sich das Theme-Objekt nicht mehr
   - Es wird empfohlen, direkt mit `theme.vars.*` zu arbeiten

6. **Entfernte APIs**:

   - `createMuiTheme` → `createTheme`
   - `onBackdropClick` in Dialog und Modal → `onClose`-Callback verwenden
   - `experimentalStyled` → `styled`
   - `Hidden` und `PigmentHidden` → `sx`-Prop oder `useMediaQuery`-Hook
   - Lab-Komponenten wurden in das Hauptpaket verschoben

7. **Pakete aktualisieren**:

   - Alle @mui-Pakete auf Version "7.0.0" aktualisieren:
     - `@mui/material`
     - `@mui/icons-material`
     - `@mui/system`
     - `@mui/lab`
     - `@mui/material-nextjs`
     - `@mui/styled-engine`
     - `@mui/styled-engine-sc`
     - `@mui/utils`

8. **TypeScript-Unterstützung**:
   - Minimale TypeScript-Version ist jetzt 4.9

- Theme-Provider für konsistentes Styling verwenden
- System-API für responsives Design nutzen
- Custom Theme-Erweiterungen für Projektspezifische Design-Tokens
- Stack und Grid für Layout-Aufbau bevorzugen
- React Server Components Patterns für MUI-Komponenten anwenden
- Barrierefreiheit nach WCAG-Standards gewährleisten

#### Integration mit Next.js 15

Bei der Integration von Material UI 7 mit Next.js 15 sind folgende Punkte zu beachten:

1. **Installation der Dependencies**:

   ```bash
   yarn install @mui/material-nextjs @emotion/cache
   ```

2. **Häufige Grid-bezogene Probleme nach Update auf Grid v2:**

   - **Spaltenrichtung**: Weder in GridLegacy noch in Grid v2 wird `direction="column"` oder `direction="column-reverse"` unterstützt. Für vertikale Layouts sollten die [Alternative Ansätze in der Dokumentation](https://mui.com/material-ui/react-grid/#column-direction) verwendet werden.
   - **Container-Breite**: Die aktualisierte Grid-Komponente wächst standardmäßig nicht auf die volle Breite des Containers:

     ```tsx
     -<GridLegacy container>
     +<Grid container sx={{ width: '100%' }}>

     // Alternativ, wenn der übergeordnete Container ein Flex-Container ist:
     -<GridLegacy container>
     +<Grid container sx={{ flexGrow: 1 }}>
     ```

   - **Codemod für umhüllte Grid-Komponenten**: Der bereitgestellte Codemod deckt keine Grid-Komponenten ab, die in anderen Komponenten eingewickelt oder gestylt sind:

     ```tsx
     // Der Codemod wird StyledGrid nicht abdecken
     const StyledGrid = styled(Grid)({
       // Styles
     })

     // Der Codemod wird WrappedGrid nicht abdecken
     const WrappedGrid = props => <Grid {...props} />
     ```

     Diese Komponenten müssen manuell aktualisiert werden.

3. **App Router Konfiguration**:

   ```tsx
   // app/layout.tsx
   import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
   import { ThemeProvider } from '@mui/material/styles'
   import theme from '../theme'

   export default function RootLayout({ children }) {
     return (
       <html lang="de">
         <body>
           <AppRouterCacheProvider>
             <ThemeProvider theme={theme}>{children}</ThemeProvider>
           </AppRouterCacheProvider>
         </body>
       </html>
     )
   }
   ```

4. **Server Components Support**: Material UI 7 unterstützt React Server Components:

   ```tsx
   // Server Component
   import { Button } from '@mui/material/server'

   // Client Component
   ;('use client')
   import { Button } from '@mui/material'
   ```

5. **Vermeidung von Hydration-Fehlern**:

   - Bei clientseitigen Komponenten verwenden Sie `'use client';` Direktive
   - Sorgen Sie für eine konsistente DOM-Struktur beim serverseitigen und clientseitigen Rendering
   - Verwenden Sie `AppRouterCacheProvider` für korrekte CSS-Handhabung
   - Bei bedingtem Rendering CSS-Properties wie `visibility` oder `display` nutzen, anstatt Komponenten zu entfernen

6. **Custom Emotion Cache** (optional):

   ```tsx
   <AppRouterCacheProvider options={{ key: 'mui' }}>{children}</AppRouterCacheProvider>
   ```

7. **CSS Injection Order**: Die korrekte CSS-Injektionsreihenfolge wird durch `AppRouterCacheProvider` sichergestellt, um Styling-Konflikte zu vermeiden

8. **Bei Verwendung anderer Styling-Lösungen** (z.B. Tailwind CSS):

   ```tsx
   <AppRouterCacheProvider options={{ enableCssLayer: true }}>{children}</AppRouterCacheProvider>
   ```

   Dies stellt sicher, dass die Material UI Styles mit `@layer mui` umschlossen werden.

#### Vermeidung von Hydration-Fehlern in Next.js 15 mit Material UI

Hydration-Fehler treten auf, wenn die serverseitig gerenderte HTML-Struktur nicht mit dem Client-seitigen Rendering übereinstimmt. Mit Next.js 15 und Material UI 7 können folgende Strategien angewendet werden:

1. **Konsistente Renderstruktur**: Stellen Sie sicher, dass die DOM-Struktur auf Client und Server identisch ist:

   ```tsx
   // Nicht empfohlen - Unterschiedliche DOM-Struktur
   {isClient ? <Component /> : <LoadingSpinner />}

   // Empfohlen - Gleiche DOM-Struktur mit bedingter Sichtbarkeit
   <Box sx={{ display: isClient ? 'block' : 'none' }}>
     <Component />
   </Box>
   <Box sx={{ display: isClient ? 'none' : 'block' }}>
     <LoadingSpinner />
   </Box>
   ```

2. **Client-Side Initialisierung**: Verwenden Sie `useState` und `useEffect` für clientseitige Initialisierung:

   ```tsx
   'use client'

   const [isClient, setIsClient] = useState(false)

   useEffect(() => {
     setIsClient(true)
   }, [])

   // Rest des Komponenten-Codes...
   ```

3. **Korrekte Emotion Cache-Verwaltung**:

   ```tsx
   // Emotion Cache erzeugen mit korrekter Konfiguration
   const createEmotionCache = () => {
     return createCache({
       key: 'mui',
       prepend: true, // Style-Tags am Anfang des <head> einfügen
     })
   }

   // Ordnungsgemäße Verwendung von AppRouterCacheProvider
   ;<AppRouterCacheProvider options={{ key: 'mui', prepend: true }}>
     {children}
   </AppRouterCacheProvider>
   ```

4. **Meta-Tag für Insertion Point**: Fügen Sie einen Meta-Tag für den Emotion-Insertion-Point hinzu:

   ```tsx
   // In app/layout.tsx im <head>
   <meta name="emotion-insertion-point" content="" />
   ```

5. **Debug-Tipps**:
   - React Dev Tools verwenden, um DOM-Unterschiede zu identifizieren
   - `suppressHydrationWarning` nur für Debugging verwenden, nicht als dauerhafte Lösung
   - Bei Authentifizierungskomponenten besonders auf verzögerte Initialisierung achten

#### Spezifische Lösungen für häufige Hydration-Fehler

1. **CircularProgress vs. AppBar Hydration-Fehler**:

   Dieser Fehler entsteht häufig, wenn Ladekomponenten in Server-Komponenten falsch initialisiert werden:

   ```tsx
   // Problematischer Code - kann zu unterschiedlichem DOM auf Client und Server führen
   ;<div className={dynamicStyles}>{loading ? <CircularProgress /> : <AppBar />}</div>

   // Lösung: Sicherstellen, dass beide Komponenten als Client-Komponenten markiert sind
   ;('use client')

   // Und dynamische Stiländerungen vermeiden, die zu unterschiedlichen Klassen führen können
   ;<div className={staticClassName}>{loading ? <CircularProgress size={40} /> : <AppBar />}</div>
   ```

2. **Lösung für Layout-Komponenten**:

   Bei Hydration-Fehlern in Layout-Komponenten:

   ```tsx
   // app/layout.tsx
   'use client'

   import { useState, useEffect } from 'react'
   import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
   import { ThemeProvider } from '@mui/material/styles'
   import CssBaseline from '@mui/material/CssBaseline'
   import theme from '../theme'

   export default function RootLayout({ children }) {
     // Verzögerte Rendering-Strategie
     const [mounted, setMounted] = useState(false)

     useEffect(() => {
       setMounted(true)
     }, [])

     // Einfaches Skeleton für den ersten Render
     if (!mounted) {
       return (
         <html lang="de">
           <body>
             <div
               style={{
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 height: '100vh',
               }}
             >
               Laden...
             </div>
           </body>
         </html>
       )
     }

     return (
       <html lang="de">
         <head>
           <meta name="emotion-insertion-point" content="" />
         </head>
         <body>
           <AppRouterCacheProvider options={{ key: 'mui' }}>
             <ThemeProvider theme={theme}>
               <CssBaseline />
               {children}
             </ThemeProvider>
           </AppRouterCacheProvider>
         </body>
       </html>
     )
   }
   ```

3. **Eindeutige CSS-Klassen sicherstellen**:

   Hydration-Fehler mit CSS-Klassen (wie im Beispiel `css-xrtj5z` vs. `css-ogmp5q`):

   ```tsx
   // Problem: Dynamische Berechnung von Styles während des Renderns
   <Box sx={{
     display: "flex",
     ...dynamicallyGeneratedStyles, // Diese können auf Client und Server unterschiedlich sein
   }}>

   // Lösung: Definieren Sie Styles außerhalb der Render-Funktion oder verwenden Sie statische Styles
   const boxStyles = { display: "flex", alignItems: "center" }; // Statisch definierte Styles

   // Im Render:
   <Box sx={boxStyles}>
   ```

4. **Verwendung der `useServerInsertedHTML`-Hook**:

   ```tsx
   // In einem Custom Provider zur Verbesserung des Server-Side Styles
   'use client'

   import { useServerInsertedHTML } from 'next/navigation'

   export function StyleRegistry({ children }) {
     // Diese Funktion wird aufgerufen, bevor Inhalte auf dem Server gerendert werden
     useServerInsertedHTML(() => {
       // Fügen Sie hier kritische CSS-Styles ein, die vor dem Hydration-Schritt benötigt werden
       return (
         <>
           <style id="mui-ssr-styles">{/* Kritische Styles */}</style>
         </>
       )
     })

     return children
   }
   ```

5. **Spezielle Next.js 15 Technik für schwer zu findende Hydration-Fehler**:

   ```tsx
   // In next.config.js
   module.exports = {
     // Diese Option hilft bei der Identifizierung von Hydration-Problemen
     reactStrictMode: true,

     // Experimentelle Feature für Debugging von Hydration
     experimental: {
       // Verbessert Fehlermeldungen bei Server/Client-Unterschieden
       optimizeFonts: false,
       strictFontDetect: true,
     },
   }
   ```

### Paketmanager

⚠️ **WICHTIG: NPM IST STRIKT VERBOTEN!** ⚠️

- **AUSSCHLIESSLICH yarn verwenden** - npm ist in diesem Projekt nicht erlaubt
- Yarn Berry (v4+) ist konfiguriert und muss verwendet werden
- Alle Skripte und Befehle verwenden yarn, niemals npm

**Verbotene Befehle:**

```bash
npm install    # ❌ NIEMALS verwenden
npm run        # ❌ NIEMALS verwenden
npm build      # ❌ NIEMALS verwenden
```

**Korrekte Befehle:**

```bash
yarn install   # ✅ Verwenden
yarn run       # ✅ Verwenden
yarn build     # ✅ Verwenden
```

Das Projekt ist so konfiguriert, dass npm-Aufrufe technisch blockiert werden.

## Projektstruktur

```
simple-eam/
├── auth/                   # Keycloak-Konfiguration
│   └── src/                # Keycloak-Anpassungen
├── client/                 # Next.js-Frontend
│   └── src/
│       ├── app/            # Next.js App Router
│       └── components/     # React-Komponenten
├── db/                     # Neo4j-Datenbank
│   └── src/                # Datenbankskripte, Seed-Dateien
├── server/                 # GraphQL-Server
│   └── src/                # Server-Quellcode
└── docker-compose.yml      # Docker-Konfiguration für alle Services
```

## Entwicklungsrichtlinien

- Flache Verzeichnisstruktur beibehalten
- Code in jeweiligen src-Verzeichnissen organisieren
- Feature-basierte Organisation innerhalb der Komponentenverzeichnisse
- Tests parallel zur Implementierung in **tests**-Ordnern
- Konsistente Namenskonventionen: camelCase für Variablen und Funktionen, PascalCase für Komponenten und Klassen
- Bevorzugt generierte GraphQL-Typen aus `src/gql/generated.ts` verwenden, anstatt eigene Typen zu definieren
- `page.tsx`-Dateien möglichst klein halten und Logik in Komponenten auslagern (wie bei der Capability-Seite implementiert)
  - UI-Komponenten in `/components/<feature>/` auslagern
  - Weitere Typen in `/components/<feature>/types.ts` definieren
  - Hilfsfunktionen in `/components/<feature>/utils.ts` auslagern
  - Filter-Logik in Custom Hooks (`use<Feature>Filter.ts`) auslagern
