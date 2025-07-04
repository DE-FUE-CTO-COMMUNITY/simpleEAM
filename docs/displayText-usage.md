# Verwendung des displayText-Feldtyps in GenericForm

Der `displayText`-Feldtyp in der GenericForm-Komponente ermöglicht die Anzeige von nicht editierbarem Text mit verschiedenen Formatierungsoptionen.

## Eigenschaften

Der Feldtyp `displayText` unterstützt folgende Eigenschaften:

- `label`: Die Beschriftung über dem Text
- `variant`: Die Typography-Variante (z.B. 'body1', 'h1', 'subtitle1', etc.)
- `preserveWhitespace`: Leerzeichen im Text beibehalten (true/false)
- `emptyText`: Text, der angezeigt wird, wenn der Wert leer ist (Standard: '-')
- `helperText`: Zusätzlicher Hilfetext unter dem Feld
- `sx`: Zusätzliche Styling-Eigenschaften (MUI SxProps)

## Beispiel

```tsx
const fields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Titel',
    type: 'text',
    required: true,
  },
  {
    name: 'description',
    label: 'Beschreibung',
    type: 'displayText',
    defaultValue: 'Dies ist ein Beispieltext, der nicht editierbar ist.',
    variant: 'body1',
    preserveWhitespace: true,
    helperText: 'Diese Information dient nur zur Ansicht',
  },
  {
    name: 'statusInfo',
    label: 'Status',
    type: 'displayText',
    defaultValue: 'Aktiv',
    variant: 'subtitle1',
    sx: { fontWeight: 'bold', color: 'success.main' },
  },
]
```

## Verwendung im Modus "view"

Der `displayText`-Feldtyp ist besonders nützlich im "view"-Modus der GenericForm, wenn Informationen angezeigt, aber nicht bearbeitet werden sollen.

```tsx
import { useForm } from '@tanstack/react-form'

// Form API Instanz erstellen
const form = useForm({
  defaultValues: data,
  onSubmit: async ({ value }) => {
    console.log('Formular abgesendet:', value)
  }
})

// GenericForm mit Form API
<GenericForm
  title="Detailansicht"
  isOpen={isOpen}
  onClose={handleClose}
  onSubmit={handleSubmit}
  mode="view"
  fields={fields}
  form={form}
/>
```

## Dynamische Werte

Die Werte für `displayText`-Felder können dynamisch gesetzt werden:

```tsx
const data = {
  id: '12345',
  name: 'Beispiel-Element',
  createdAt: '2023-09-15T14:30:00',
  updatedAt: '2023-09-16T10:15:00',
}

const fields: FieldConfig[] = [
  {
    name: 'id',
    label: 'ID',
    type: 'displayText',
    defaultValue: data.id,
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    defaultValue: data.name,
    required: true,
  },
  {
    name: 'createdAt',
    label: 'Erstellt am',
    type: 'displayText',
    defaultValue: new Date(data.createdAt).toLocaleString('de-DE'),
    variant: 'caption',
  },
]
```
