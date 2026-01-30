# Contribution Guidelines for the Simple-EAM Project

## AI-only contributions

All contributions to this repository must be created through AI-assisted coding (GitHub Copilot Agent mode). Do not submit manually authored code; use the established AI workflow to ensure consistency and adherence to project patterns.

> **🤖 AI development note**: The code in this project was built entirely with GitHub Copilot in agent mode to ensure a consistent codebase and modern best practices.

## Material UI v7 Grid Components

Starting with Material UI v7, you must use the new Grid v2 API. There are important differences from the legacy Grid implementation:

### Correct Grid v2 usage

```tsx
// ✅ Correct import
import Grid from '@mui/material/Grid'

// ✅ Correct props
;<Grid container spacing={2} sx={{ width: '100%' }}>
  <Grid size={6}>Item 1</Grid>
  <Grid size={6}>Item 2</Grid>

  {/* Responsive grid */}
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>Responsive Item</Grid>

  {/* Flexible growth */}
  <Grid size="grow">Flexible Item</Grid>
</Grid>
```

### Common mistakes to avoid

```tsx
// ❌ WRONG: Legacy import
import Grid from '@mui/material/GridLegacy'

// ❌ WRONG: Legacy props
<Grid xs={12} sm={6}>Item</Grid>

// ❌ WRONG: The 'item' prop is no longer required
<Grid item size={6}>Item</Grid>

// ❌ WRONG: Container without an explicit width
<Grid container>...</Grid>

// ❌ WRONG: direction="column" is not supported
<Grid container direction="column">...</Grid>
```

### Vertical layouts with Stack

Use the Stack component instead of Grid with direction="column" for vertical layouts:

```tsx
// ✅ CORRECT: Stack for vertical layouts
import Stack from '@mui/material/Stack'
;<Stack spacing={2}>
  <Item>Item 1</Item>
  <Item>Item 2</Item>
  <Item>Item 3</Item>
</Stack>
```

## Tanstack Table V8

Simple-EAM uses Tanstack Table V8 (formerly React Table V7). There are key differences from the previous version:

### Correct Tanstack Table V8 usage

```tsx
// ✅ Correct imports
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'

// ✅ Correct initialization
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

// ✅ Correct rendering
<th key={header.id}>
  {flexRender(header.column.columnDef.header, header.getContext())}
</th>
```

### Common mistakes to avoid

```tsx
// ❌ WRONG: Legacy imports
import { useTable, useSortBy } from 'react-table'

// ❌ WRONG: Legacy initialization
const tableInstance = useTable({ columns, data }, useSortBy)

// ❌ WRONG: Legacy rendering
<th {...header.getHeaderProps()}>{header.render('Header')}</th>
```

### State management

Use explicit state variables for features like sorting, pagination, or filtering:

```tsx
// ✅ CORRECT: Explicit state management
const [sorting, setSorting] = useState<SortingState>([])

const table = useReactTable({
  // ...
  state: {
    sorting,
  },
  onSortingChange: setSorting,
})
```

## Example implementations

Reference components in the project that demonstrate correct usage:

- /client/src/components/common/TanstackTableExample.tsx - Tanstack Table V8
- /client/src/components/common/GridV2Example.tsx - Material UI Grid v2

For more details, see the [official Tanstack Table documentation](https://tanstack.com/table/latest/docs/guide/introduction) and the [migration guide](https://tanstack.com/table/latest/docs/guide/migrating).
