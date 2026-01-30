# Tanstack Table V8 Migration Guide für GitHub Copilot

> **Hinweis für GitHub Copilot**: Dieses Dokument enthält wichtige Anweisungen zur korrekten Verwendung von Tanstack Table V8 in diesem Projekt.

## Tanstack Table V8 in Simple-EAM

Das Simple-EAM Projekt verwendet Tanstack Table V8, welches sich erheblich von der vorherigen React Table v7 unterscheidet. Bitte stelle sicher, dass alle Tabellenimplementierungen mit dem neuen API erstellt werden.

### 1. Import Statements

```tsx
// ❌ FALSCH: Veraltete React Table v7 Imports
import { useTable, usePagination, useSortBy } from 'react-table'

// ✅ RICHTIG: Neue Tanstack Table V8 Imports
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
```

### 2. Table-Hook und Initialisierung

```tsx
// ❌ FALSCH: React Table v7 Initialisierung
const tableInstance = useTable({ columns, data }, useSortBy, usePagination)

// ✅ RICHTIG: Tanstack Table V8 Initialisierung
const tableInstance = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### 3. Spalten-Definition

```tsx
// ❌ FALSCH: V7 Spalten-Definition
const columns = [
  {
    Header: 'Name',
    accessor: 'name',
    width: 200,
  },
  {
    Header: () => <span>Alter</span>,
    accessor: row => row.age,
    minWidth: 100,
  },
]

// ✅ RICHTIG: V8 Spalten-Definition mit columnHelper
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    size: 200,
  }),
  columnHelper.accessor(row => row.age, {
    header: () => <span>Alter</span>,
    minSize: 100,
  }),
]

// ALTERNATIV: Direkte Spalten-Definition in V8
const columns = [
  {
    accessorKey: 'name', // Für String-Accessor
    header: 'Name',
    size: 200,
  },
  {
    accessorFn: row => row.age, // Für Funktions-Accessor
    header: () => <span>Alter</span>,
    minSize: 100,
  },
]
```

### 4. Rendering in JSX

```tsx
// ❌ FALSCH: V7 Rendering
<table>
  <thead>
    {tableInstance.headerGroups.map(headerGroup => (
      <tr {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map(column => (
          <th {...column.getHeaderProps()}>{column.render('Header')}</th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {tableInstance.rows.map(row => {
      prepareRow(row)
      return (
        <tr {...row.getRowProps()}>
          {row.cells.map(cell => (
            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
          ))}
        </tr>
      )
    })}
  </tbody>
</table>

// ✅ RICHTIG: V8 Rendering mit flexRender
<table>
  <thead>
    {table.getHeaderGroups().map(headerGroup => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <th key={header.id} colSpan={header.colSpan}>
            {flexRender(
              header.column.columnDef.header,
              header.getContext()
            )}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {table.getRowModel().rows.map(row => (
      <tr key={row.id}>
        {row.getVisibleCells().map(cell => (
          <td key={cell.id}>
            {flexRender(
              cell.column.columnDef.cell,
              cell.getContext()
            )}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

### 5. Zustandsmanagement

```tsx
// ❌ FALSCH: V7 hat keinen kontrollierten Zustand
const tableInstance = useTable({ columns, data })

// ✅ RICHTIG: V8 mit kontrolliertem Zustand
import { useState } from 'react'
import { SortingState } from '@tanstack/react-table'

// Sortierzustand
const [sorting, setSorting] = useState<SortingState>([])

const table = useReactTable({
  columns,
  data,
  state: {
    sorting,
  },
  onSortingChange: setSorting,
  // Weitere Konfiguration...
})
```

### 6. Wichtige API-Änderungen in V8

#### Namensänderungen

- Alle `disable*` Optionen sind nun `enable*` (z.B. `disableSortBy` → `enableSorting`)
- Status-Werte sind nun Funktionen (z.B. `isGrouped` → `getIsGrouped()`)
- Filter-Funktionen haben eine neue Signatur: `(row, id, value) => boolean` statt `(rows, id, value) => rows`
- Werte werden lazy evaluiert (z.B. `getValue()` statt direktem `value`)

#### Event-Handler und Selektoren

```tsx
// ❌ FALSCH: V7 verwendete get*Props für Events
<input type="checkbox" {...row.getToggleRowSelectedProps()} />

// ✅ RICHTIG: V8 bietet Handler-Funktionen
<input
  type="checkbox"
  checked={row.getIsSelected()}
  onChange={row.getToggleSelectedHandler()}
/>
```

### 7. Best Practices für V8

- Spalten-Definitionen in `useMemo` speichern für bessere Performance
- Verwenden des eingebauten Dev-Tools für Debugging (`@tanstack/react-table-devtools`)
- Immer explizite Typisierung für bessere TypeScript-Unterstützung verwenden
- Accessibility-Attribute manuell setzen (role, aria-\*, etc.)
- Virtuelle Listen für große Datensätze verwenden

### 8. Vollständiges Code-Beispiel

```tsx
import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'

interface Person {
  id: string
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
}

const TableExample = ({ data }: { data: Person[] }) => {
  // 1. Zustandsmanagement
  const [sorting, setSorting] = useState<SortingState>([])

  // 2. Spalten-Definition mit columnHelper (typsicher)
  const columnHelper = createColumnHelper<Person>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('firstName', {
        header: 'Vorname',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('lastName', {
        header: 'Nachname',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('age', {
        header: 'Alter',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('visits', {
        header: 'Besuche',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => info.getValue(),
      }),
    ],
    []
  )

  // 3. Table-Hook
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // 4. Render
  return (
    <div>
      <table className="table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {/* Sortier-Indikator */}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
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

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </button>
        <span>
          Seite{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}
          </strong>
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
      </div>
    </div>
  )
}

export default TableExample
```

Bitte berücksichtigen Sie diese Änderungen bei allen Vorschlägen für Tabellenimplementierungen mit Tanstack Table V8.
