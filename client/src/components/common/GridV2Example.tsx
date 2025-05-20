'use client'

import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'

interface DemoItemProps {
  children: React.ReactNode
}

// Beispiel-Komponente für Material UI v7 mit Grid v2 API
const GridV2Example = () => {
  const DemoItem = ({ children }: DemoItemProps) => (
    <Paper
      sx={{
        p: 2,
        textAlign: 'center',
        color: 'text.primary',
        bgcolor: 'background.paper',
      }}
    >
      <Typography>{children}</Typography>
    </Paper>
  )

  return (
    <Box sx={{ flexGrow: 1, mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Grundlegendes Grid-Layout (V7 Grid v2 API)
      </Typography>

      {/* Container benötigt explizite volle Breite */}
      <Grid container spacing={2} sx={{ width: '100%' }}>
        {/* Einheitliche Größe für alle Breakpoints */}
        <Grid size={6}>
          <DemoItem>size=6</DemoItem>
        </Grid>
        <Grid size={6}>
          <DemoItem>size=6</DemoItem>
        </Grid>

        {/* Responsive Größen mit Objektsyntax */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DemoItem>size={{'{{'}} xs: 12, sm: 6, md: 4 {{'}}'}} </DemoItem>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <DemoItem>size={{'{{'}} xs: 12, sm: 6, md: 4 {{'}}'}} </DemoItem>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <DemoItem>size={{'{{'}} xs: 12, sm: 12, md: 4 {{'}}'}} </DemoItem>
        </Grid>

        {/* Flexibles Wachstum statt boolean xs */}
        <Grid size="grow">
          <DemoItem>size="grow"</DemoItem>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Vertikales Layout mit Stack (statt Grid direction="column")
      </Typography>

      {/* Für vertikale Layouts Stack verwenden statt Grid mit direction="column" */}
      <Stack spacing={2}>
        <DemoItem>Item 1</DemoItem>
        <DemoItem>Item 2</DemoItem>
        <DemoItem>Item 3</DemoItem>
      </Stack>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Verschachtelte Grids
      </Typography>

      {/* Verschachteltes Grid */}
      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid size={6}>
          <DemoItem>Äußeres Grid size=6</DemoItem>
        </Grid>
        <Grid size={6}>
          {/* Inneres Grid */}
          <Grid container spacing={1} sx={{ width: '100%' }}>
            <Grid size={6}>
              <DemoItem>Inneres Grid size=6</DemoItem>
            </Grid>
            <Grid size={6}>
              <DemoItem>Inneres Grid size=6</DemoItem>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default GridV2Example
