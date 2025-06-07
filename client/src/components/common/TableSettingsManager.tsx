'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Divider,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import {
  clearTableSettings,
  clearAllTableSettings,
  exportTableSettings,
  importTableSettings,
  DEFAULT_COLUMN_VISIBILITY,
} from '../../utils/columnVisibilityUtils'

interface TableSettingsManagerProps {
  isOpen: boolean
  onClose: () => void
}

const TableSettingsManager: React.FC<TableSettingsManagerProps> = ({ isOpen, onClose }) => {
  const [importJson, setImportJson] = useState('')
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Hilfsfunktion zum Aktualisieren der Anzeige
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    setImportError('')
    setImportSuccess(false)
  }

  // Einstellungen für eine spezifische Tabelle löschen
  const handleClearTableSettings = (tableKey: string) => {
    if (
      confirm(
        `Möchten Sie wirklich alle gespeicherten Einstellungen für die ${tableKey}-Tabelle löschen?`
      )
    ) {
      clearTableSettings(tableKey)
      handleRefresh()
    }
  }

  // Alle Einstellungen löschen
  const handleClearAllSettings = () => {
    if (
      confirm(
        'Möchten Sie wirklich ALLE gespeicherten Tabellen-Einstellungen löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
      )
    ) {
      clearAllTableSettings()
      handleRefresh()
    }
  }

  // Einstellungen exportieren
  const handleExportSettings = () => {
    const settings = exportTableSettings()
    const blob = new Blob([settings], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `simple-eam-table-settings-${new Date(Date.now()).toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Einstellungen importieren
  const handleImportSettings = () => {
    setImportError('')
    setImportSuccess(false)

    if (!importJson.trim()) {
      setImportError('Bitte geben Sie gültiges JSON ein')
      return
    }

    try {
      const success = importTableSettings(importJson)
      if (success) {
        setImportSuccess(true)
        setImportJson('')
        handleRefresh()
      } else {
        setImportError('Import fehlgeschlagen')
      }
    } catch (importError) {
      console.warn('JSON Import Fehler:', importError)
      setImportError('Ungültiges JSON-Format')
    }
  }

  // Datei-Upload für Import
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      const content = e.target?.result as string
      setImportJson(content)
    }
    reader.readAsText(file)
  }

  // Gespeicherte Einstellungen anzeigen
  const renderStoredSettings = () => {
    if (typeof window === 'undefined') return null

    const tableKeys = Object.keys(DEFAULT_COLUMN_VISIBILITY)
    const storedKeys: string[] = []

    // Prüfe welche Tabellen gespeicherte Einstellungen haben
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('simple-eam-column-visibility-')) {
        const tableKey = key.replace('simple-eam-column-visibility-', '')
        if (!storedKeys.includes(tableKey)) {
          storedKeys.push(tableKey)
        }
      }
    }

    return (
      <List>
        {tableKeys.map(tableKey => {
          const hasStoredSettings = storedKeys.includes(tableKey)
          return (
            <ListItem key={tableKey}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">
                      {tableKey.charAt(0).toUpperCase() + tableKey.slice(1)} Tabelle
                    </Typography>
                    {hasStoredSettings ? (
                      <Chip label="Gespeichert" color="success" size="small" />
                    ) : (
                      <Chip label="Standard" variant="outlined" size="small" />
                    )}
                  </Box>
                }
                secondary={
                  hasStoredSettings
                    ? 'Benutzerdefinierte Spalten-Einstellungen gespeichert'
                    : 'Verwendet Standard-Einstellungen'
                }
              />
              {hasStoredSettings && (
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleClearTableSettings(tableKey)}
                    title={`Einstellungen für ${tableKey} löschen`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          )
        })}
      </List>
    )
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { minHeight: '60vh' } }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          Tabellen-Einstellungen verwalten
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Hier können Sie Ihre gespeicherten Spalten-Einstellungen für alle Tabellen verwalten.
            Diese Einstellungen werden automatisch beim nächsten Besuch der entsprechenden Seiten
            geladen.
          </Alert>

          {/* Gespeicherte Einstellungen */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Gespeicherte Einstellungen</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box key={refreshKey}>{renderStoredSettings()}</Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>
                  Aktualisieren
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleClearAllSettings}
                >
                  Alle löschen
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Export/Import */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Export & Import</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Export */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Einstellungen exportieren
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Exportieren Sie Ihre aktuellen Tabellen-Einstellungen als JSON-Datei.
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportSettings}
                  >
                    Als JSON-Datei exportieren
                  </Button>
                </Box>

                <Divider />

                {/* Import */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Einstellungen importieren
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Importieren Sie gespeicherte Tabellen-Einstellungen aus einer JSON-Datei oder
                    fügen Sie JSON direkt ein.
                  </Typography>

                  {/* Datei-Upload */}
                  <Box sx={{ mb: 2 }}>
                    <input
                      accept=".json"
                      style={{ display: 'none' }}
                      id="import-file-input"
                      type="file"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="import-file-input">
                      <Button variant="outlined" component="span" startIcon={<UploadIcon />}>
                        JSON-Datei auswählen
                      </Button>
                    </label>
                  </Box>

                  {/* Manueller JSON-Import */}
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="JSON-Einstellungen"
                    placeholder="Fügen Sie hier das JSON mit den Tabellen-Einstellungen ein..."
                    value={importJson}
                    onChange={e => {
                      setImportJson(e.target.value)
                      setImportError('')
                      setImportSuccess(false)
                    }}
                    error={!!importError}
                    helperText={importError}
                    sx={{ mb: 2 }}
                  />

                  {importSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      Einstellungen erfolgreich importiert!
                    </Alert>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleImportSettings}
                    disabled={!importJson.trim()}
                  >
                    Einstellungen importieren
                  </Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Schließen
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TableSettingsManager
