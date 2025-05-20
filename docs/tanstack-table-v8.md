# Tanstack Table V8 in Simple-EAM

Dieses Dokument beschreibt die korrekte Verwendung von Tanstack Table V8 im Simple-EAM Projekt.

## Migration von React Table v7 zu Tanstack Table V8

Tanstack Table V8 ist eine komplette Neuimplementierung der beliebten React Table v7 Bibliothek.
Es bietet viele Vorteile wie bessere Typisierung, kontrollierten Zustand und Framework-Agnostik,
erfordert jedoch einige Anpassungen an bestehenden Implementierungen.

## Wichtige Änderungen in V8

### 1. Import-Pfade und Installation

```bash
# Paket installieren
yarn remove react-table @types/react-table
yarn add @tanstack/react-table
```

```tsx
// Aktualisierte Imports
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
```

### 2. Initialisierung und Konfiguration

```tsx
// Alter Stil (V7)
const tableInstance = useTable({ columns, data }, useSortBy, usePagination)

// Neuer Stil (V8)
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### 3. Spalten-Definition

```tsx
// Empfohlene Methode mit columnHelper für bessere Typisierung
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Person>()

const columns = useMemo(
  () => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor(row => row.age, {
      header: 'Alter',
      cell: info => info.getValue(),
    }),
  ],
  []
)

// Alternativ direkte Definition
const columns = [
  {
    accessorKey: 'name', // Für String-Properties
    header: 'Name',
  },
  {
    accessorFn: row => row.age, // Für berechnete Properties
    header: 'Alter',
  },
]
```

### 4. Rendering und JSX

```tsx
<table>
  <thead>
    {table.getHeaderGroups().map(headerGroup => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {table.getRowModel().rows.map(row => (
      <tr key={row.id}>
        {row.getVisibleCells().map(cell => (
          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

### 5. Zustandsmanagement

```tsx
// Die Zustände werden jetzt explizit verwaltet
const [sorting, setSorting] = useState<SortingState>([])
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useReactTable({
  // ...
  state: {
    sorting,
    pagination,
  },
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
```

## Weitere Änderungen

- `getHeaderProps()`, `getCellProps()` usw. wurden entfernt, Props müssen manuell hinzugefügt werden
- Alle `disable*` Optionen wurden zu `enable*` Optionen
- Status-Werte werden als Funktionen zugegriffen: `getIsSelected()` statt `isSelected`
- Werte werden durch Getter-Funktionen abgerufen: `getValue()` statt direktem Zugriff

## Beispiel-Komponente

Im Projekt ist eine Beispielkomponente verfügbar, die die korrekte Implementierung zeigt:

`/client/src/components/common/TanstackTableExample.tsx`

## Weitere Ressourcen

- [Offizielle Dokumentation](https://tanstack.com/table/latest/docs/guide/introduction)
- [Migration Guide](https://tanstack.com/table/latest/docs/guide/migrating)
- [API Referenz](https://tanstack.com/table/latest/docs/api/core/table)
