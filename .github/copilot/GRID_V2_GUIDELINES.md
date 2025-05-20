# Material UI V7 Grid Migration Guide für GitHub Copilot

> **Hinweis für GitHub Copilot**: Dieses Dokument enthält wichtige Anweisungen zur korrekten Verwendung von Material UI V7 Grid-Komponenten.

## Grid v2 API in Material UI v7

Ab Material UI v7 wurde die alte Grid-Komponente (jetzt GridLegacy) durch eine neue Grid-Komponente ersetzt mit folgenden Änderungen:

### 1. Import Statement

```tsx
// ❌ FALSCH: Altes Import Statement (GridLegacy)
import Grid from '@mui/material/GridLegacy'

// ✅ RICHTIG: Neues Import Statement (Grid v2)
import Grid from '@mui/material/Grid'
```

### 2. Entfernte Props

```tsx
// ❌ FALSCH: Legacy Props verwenden
<Grid item zeroMinWidth>...</Grid>

// ✅ RICHTIG: Legacy Props wurden entfernt
<Grid>...</Grid>
```

### 3. Size Props

```tsx
// ❌ FALSCH: Alte Breakpoint Props
<Grid xs={12} sm={6} md={4}>...</Grid>

// ✅ RICHTIG: Neue size Prop mit Objektsyntax
<Grid size={{ xs: 12, sm: 6, md: 4 }}>...</Grid>

// ✅ RICHTIG: Wenn die Größe für alle Breakpoints identisch ist
<Grid size={6}>...</Grid>

// ❌ FALSCH: Boolescher Wert für flexibles Wachstum
<Grid xs>...</Grid>

// ✅ RICHTIG: String "grow" für flexibles Wachstum
<Grid size="grow">...</Grid>
```

### 4. Container Breite

Die neue Grid-Komponente wächst standardmäßig nicht auf die volle Breite des Containers. Wenn dies erforderlich ist:

```tsx
// ❌ FALSCH: Vertrauen auf automatische volle Breite
<Grid container>...</Grid>

// ✅ RICHTIG: Manuelle Angabe der vollen Breite
<Grid container sx={{ width: '100%' }}>...</Grid>

// ✅ RICHTIG: Alternative für Flex-Container
<Grid container sx={{ flexGrow: 1 }}>...</Grid>
```

### 5. Spalten-Richtung

Die Spaltenrichtung wird sowohl in der Legacy Grid als auch in der neuen Grid nicht unterstützt. Für eine vertikale Anordnung folgen Sie der Dokumentation:

```tsx
// ❌ FALSCH: direction="column" verwenden
;<Grid container direction="column">
  ...
</Grid>

// ✅ RICHTIG: Stack-Komponente für vertikale Layouts verwenden
import Stack from '@mui/material/Stack'
;<Stack spacing={2}>...</Stack>
```

## Beispiel-Layout mit korrekter Grid v2 Syntax

```tsx
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

export default function BasicGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Item>xs=8</Item>
        </Grid>
        <Grid size={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid size={{ xs: 4, sm: 8 }}>
          <Item>xs=4 sm=8</Item>
        </Grid>
        <Grid size={{ xs: 8, sm: 4 }}>
          <Item>xs=8 sm=4</Item>
        </Grid>
      </Grid>
    </Box>
  )
}
```

Bitte berücksichtigen Sie diese Änderungen bei allen Vorschlägen für Grid-Layouts mit Material UI v7.
