# Column Visibility Feature für GenericTable

Diese Dokumentation erklärt, wie die Column Visibility Funktionalität in der GenericTable-Komponente verwendet werden kann.

## Überblick

Die Column Visibility Funktionalität ermöglicht es Benutzern, Tabellenspalten ein- oder auszublenden. Sie ist in die `GenericToolbar`-Komponente integriert und kann einfach in bestehende Tabellen-Implementierungen eingebunden werden.

## Implementierung

### 1. Direkte Verwendung mit GenericTable und GenericToolbar

```tsx
import React, { useState } from 'react'
import { VisibilityState } from '@tanstack/react-table'
import GenericTable from '../common/GenericTable'
import GenericToolbar from '../common/GenericToolbar'

const MyTableComponent = ({ data, columns, ...otherProps }) => {
  // State für Spalten-Sichtbarkeit
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // State für Table-Instanz (wird für Toolbar benötigt)
  const [tableInstance, setTableInstance] = useState(null)

  return (
    <>
      <GenericToolbar {...toolbarProps} table={tableInstance} enableColumnVisibilityToggle={true} />

      <GenericTable
        data={data}
        columns={columns}
        {...otherProps}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        onTableReady={setTableInstance}
      />
    </>
  )
}
```

### 2. Verwendung mit GenericTableWithToolbar-Komponente

Die `GenericTableWithToolbar`-Komponente kombiniert `GenericTable` und `GenericToolbar` und kümmert sich automatisch um die State-Verwaltung für Column Visibility.

```tsx
import React from 'react'
import GenericTableWithToolbar from '../common/GenericTableWithToolbar'

const MyTableComponent = ({ data, columns, ...otherProps }) => {
  return (
    <GenericTableWithToolbar
      data={data}
      columns={columns}
      {...otherProps}
      enableColumnVisibilityToggle={true}
    />
  )
}
```

### 3. Verwendung mit useColumnVisibility-Hook

Für komplexere Anwendungsfälle oder wenn mehr Kontrolle über die Column Visibility benötigt wird, kann der `useColumnVisibility`-Hook verwendet werden.

```tsx
import React from 'react'
import GenericTable from '../common/GenericTable'
import GenericToolbar from '../common/GenericToolbar'
import useColumnVisibility from '../../hooks/useColumnVisibility'

const MyTableComponent = ({ data, columns, ...otherProps }) => {
  const {
    columnVisibility,
    onTableReady,
    tableInstance,
    getResponsiveVisibility,
    toggleAllColumns,
  } = useColumnVisibility()

  // Beispiel: Responsive Spalten basierend auf Bildschirmgröße
  useEffect(() => {
    // Für kleine Bildschirme weniger Spalten anzeigen
    if (window.innerWidth < 600) {
      getResponsiveVisibility('sm')
    }
  }, [getResponsiveVisibility])

  return (
    <>
      <GenericToolbar {...toolbarProps} table={tableInstance} enableColumnVisibilityToggle={true} />

      {/* Optional: Zusätzliche Steuerelemente */}
      <Button onClick={() => toggleAllColumns(true)}>Alle Spalten anzeigen</Button>

      <GenericTable
        data={data}
        columns={columns}
        {...otherProps}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        onTableReady={onTableReady}
      />
    </>
  )
}
```

## Erweiterte Anpassungen

### Benutzerdefinierte Column Visibility-Steuerelemente

Sie können eigene Steuerelemente für die Column Visibility erstellen, indem Sie auf die `tableInstance` zugreifen:

```tsx
{
  tableInstance
    ?.getAllLeafColumns()
    .map(column => (
      <FormControlLabel
        key={column.id}
        control={
          <Checkbox
            checked={column.getIsVisible()}
            onChange={column.getToggleVisibilityHandler()}
          />
        }
        label={String(column.columnDef.header)}
      />
    ))
}
```

### Spalten dauerhaft anzeigen/ausblenden

Um bestimmte Spalten immer anzuzeigen oder auszublenden:

```tsx
const columns = [
  {
    id: 'name',
    header: 'Name',
    cell: info => info.getValue(),
    enableHiding: false, // Diese Spalte kann nicht ausgeblendet werden
  },
  // Weitere Spalten...
]
```

### Speichern von Benutzereinstellungen

Um die Spalten-Sichtbarkeitseinstellungen der Benutzer zu speichern:

```tsx
// Beim Laden der Komponente
useEffect(() => {
  const savedVisibility = localStorage.getItem('tableColumnVisibility')
  if (savedVisibility) {
    setColumnVisibility(JSON.parse(savedVisibility))
  }
}, [])

// Beim Ändern der Sichtbarkeit
useEffect(() => {
  localStorage.setItem('tableColumnVisibility', JSON.stringify(columnVisibility))
}, [columnVisibility])
```

## Zusammenfassung

- Die Column Visibility-Funktion ist in die GenericToolbar integriert
- Der Benutzer kann Spalten über ein Dropdown-Menü ein- und ausblenden
- Die Funktion kann auf drei verschiedene Arten implementiert werden:
  1. Direkt mit GenericTable und GenericToolbar
  2. Mit der kombinierten GenericTableWithToolbar-Komponente
  3. Mit dem useColumnVisibility-Hook für erweiterte Funktionalität
- Die Spalten-Sichtbarkeit kann an Bildschirmgrößen angepasst werden
