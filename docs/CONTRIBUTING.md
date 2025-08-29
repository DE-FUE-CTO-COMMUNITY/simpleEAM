# Beitragsrichtlinien für das Simple-EAM Projekt

> **🤖 AI-Entwicklungshinweis**: Der Code dieses Projekts wurde vollständig mit GitHub Copilot im Agent-Modus erstellt. Dies gewährleistet eine konsistente Codebasis und moderne Best Practices.

## Material UI v7 Grid-Komponenten

Ab Material UI v7 muss die neue Grid v2 API verwendet werden. Es gibt wichtige Unterschiede zur vorherigen Grid-Implementierung:

### Korrekte Verwendung von Grid v2

```tsx
// ✅ Richtiger Import
import Grid from '@mui/material/Grid'

// ✅ Korrekte Props
;<Grid container spacing={2} sx={{ width: '100%' }}>
  <Grid size={6}>Item 1</Grid>
  <Grid size={6}>Item 2</Grid>

  {/* Responsive Grid */}
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>Responsive Item</Grid>

  {/* Flexibles Wachstum */}
  <Grid size="grow">Flexibles Item</Grid>
</Grid>
```

### Häufige Fehler, die vermieden werden sollten

```tsx
// ❌ FALSCH: Alter Import
import Grid from '@mui/material/GridLegacy';

// ❌ FALSCH: Alte Props
<Grid xs={12} sm={6}>Item</Grid>

// ❌ FALSCH: 'item' Prop ist nicht mehr erforderlich
<Grid item size={6}>Item</Grid>

// ❌ FALSCH: Container ohne explizite Breitenangabe
<Grid container>...</Grid>

// ❌ FALSCH: direction="column" wird nicht unterstützt
<Grid container direction="column">...</Grid>
```

### Vertikale Layouts mit Stack

Für vertikale Layouts verwenden Sie die Stack-Komponente anstelle von Grid mit direction="column":

```tsx
// ✅ RICHTIG: Stack für vertikale Layouts
import Stack from '@mui/material/Stack'
;<Stack spacing={2}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
  <Item>Item 3</Item>
</Stack>
```

## Tanstack Table V8

Simple-EAM verwendet Tanstack Table V8 (ehemals React Table V7) für Tabellenimplementierungen. Es gibt wichtige Unterschiede zur vorherigen Version:

### Korrekte Verwendung von Tanstack Table V8

```tsx
// ✅ Richtige Imports
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table'

// ✅ Korrekte Initialisierung
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel()
})

// ✅ Korrektes Rendering
<th key={header.id}>
  {flexRender(
    header.column.columnDef.header,
    header.getContext()
  )}
</th>
```

### Häufige Fehler, die vermieden werden sollten

```tsx
// ❌ FALSCH: Alte Imports
import { useTable, useSortBy } from 'react-table'

// ❌ FALSCH: Alte Initialisierung
const tableInstance = useTable({ columns, data }, useSortBy)

// ❌ FALSCH: Veraltetes Rendering
<th {...header.getHeaderProps()}>{header.render('Header')}</th>
```

### Zustandsmanagement

Für zustandsbehaftete Funktionen wie Sortierung, Paginierung oder Filterung sollten Sie explizite State-Variablen verwenden:

```tsx
// ✅ RICHTIG: Explizites State-Management
const [sorting, setSorting] = useState<SortingState>([])

const table = useReactTable({
  // ...
  state: {
    sorting,
  },
  onSortingChange: setSorting,
})
```

## Beispiel-Implementierungen

Im Projekt stehen Beispielkomponenten zur Verfügung, die die korrekte Verwendung demonstrieren:

- `/client/src/components/common/TanstackTableExample.tsx` - Tanstack Table V8
- `/client/src/components/common/GridV2Example.tsx` - Material UI Grid v2

Weitere Informationen finden Sie in der [offiziellen Tanstack Table Dokumentation](https://tanstack.com/table/latest/docs/guide/introduction) und in der [Anleitung zur Migration](https://tanstack.com/table/latest/docs/guide/migrating).
