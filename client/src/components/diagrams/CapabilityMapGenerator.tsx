import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material'

interface CapabilityMapGeneratorProps {
  open: boolean
  onClose: () => void
}

const CapabilityMapGenerator: React.FC<CapabilityMapGeneratorProps> = ({ open, onClose }) => {
  const handleGenerate = () => {
    // TODO: Implementiere Diagramm-Generierung
    console.log('Capability Map Generator gestartet...')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Capability Map generieren</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" gutterBottom>
            Diese Funktion generiert automatisch eine Capability Map aus den verfügbaren Daten.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Die Implementierung der Diagramm-Generierung folgt in einem späteren Schritt.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={handleGenerate} variant="contained">
          Generieren
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CapabilityMapGenerator
