'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_DIAGRAM, UPDATE_DIAGRAM, GET_ARCHITECTURES_FOR_DIAGRAM } from '@/graphql/diagram'
import { useAuth } from '@/contexts/AuthContext'

export interface DiagramType {
  value: string
  label: string
  description: string
}

export const DIAGRAM_TYPES: DiagramType[] = [
  {
    value: 'ARCHITECTURE',
    label: 'Architekturdiagramm',
    description: 'Technische oder fachliche Architektur',
  },
  {
    value: 'APPLICATION_LANDSCAPE',
    label: 'Anwendungslandschaft',
    description: 'Übersicht über alle Anwendungen und deren Beziehungen',
  },
  { value: 'CAPABILITY_MAP', label: 'Capability Map', description: 'Fähigkeitslandkarte' },
  { value: 'DATA_FLOW', label: 'Datenflussdiagramm', description: 'Darstellung von Datenströmen' },
  { value: 'PROCESS', label: 'Prozessdiagramm', description: 'Geschäftsprozesse und Workflows' },
  { value: 'NETWORK', label: 'Netzwerkdiagramm', description: 'IT-Infrastruktur und Netzwerke' },
  {
    value: 'INTEGRATION_ARCHITECTURE',
    label: 'Integrationsarchitektur',
    description: 'Systemintegration und Schnittstellen',
  },
  {
    value: 'SECURITY_ARCHITECTURE',
    label: 'Sicherheitsarchitektur',
    description: 'Sicherheitskonzepte und -maßnahmen',
  },
  {
    value: 'CONCEPTUAL',
    label: 'Konzeptdiagramm',
    description: 'Konzeptuelle Darstellung und Ideen',
  },
  { value: 'OTHER', label: 'Sonstige', description: 'Andere Diagrammtypen' },
]

export interface SaveDiagramDialogProps {
  open: boolean
  onClose: () => void
  onSave: (savedDiagram: any) => void
  diagramData: string // JSON string des Excalidraw-Diagramms
  existingDiagram?: {
    id: string
    title: string
    description?: string
    diagramType?: string
    architecture?:
      | {
          id: string
          name: string
          type: string
          domain: string
        }[]
      | {
          id: string
          name: string
          type: string
          domain: string
        }
  }
  forceSaveAs?: boolean // Wenn true, wird immer ein neues Diagramm erstellt (für "Speichern unter")
}

const SaveDiagramDialog: React.FC<SaveDiagramDialogProps> = ({
  open,
  onClose,
  onSave,
  diagramData,
  existingDiagram,
  forceSaveAs = false,
}) => {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [diagramType, setDiagramType] = useState('ARCHITECTURE')
  const [selectedArchitecture, setSelectedArchitecture] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const [architectureError, setArchitectureError] = useState(false)

  const { data: architecturesData } = useQuery(GET_ARCHITECTURES_FOR_DIAGRAM)

  const [createDiagram] = useMutation(CREATE_DIAGRAM)
  const [updateDiagram] = useMutation(UPDATE_DIAGRAM)

  // Update form fields when dialog opens
  React.useEffect(() => {
    if (open) {
      if (existingDiagram) {
        // Bei "Speichern unter" fügen wir " - Kopie" zum Titel hinzu
        const titleValue = forceSaveAs
          ? `${existingDiagram.title} - Kopie`
          : existingDiagram.title || ''
        setTitle(titleValue)
        setDescription(existingDiagram.description || '')
        setDiagramType(existingDiagram.diagramType || 'ARCHITECTURE')

        // Setze die bestehende Architektur wenn vorhanden
        if (existingDiagram.architecture) {
          // Die Architektur kommt als Array, wir nehmen das erste Element
          const architectureValue = Array.isArray(existingDiagram.architecture)
            ? existingDiagram.architecture[0]
            : existingDiagram.architecture
          setSelectedArchitecture(architectureValue)
          setArchitectureError(false) // Architektur ist vorhanden, kein Fehler
        } else {
          setSelectedArchitecture(null)
          setArchitectureError(true) // Keine Architektur, Fehler anzeigen
        }

        // Für existierende Diagramme: keine Titel-Fehler beim Laden
        setTitleError(false)
      } else {
        // Reset form for new diagrams
        setTitle('')
        setDescription('')
        setDiagramType('ARCHITECTURE')
        setSelectedArchitecture(null)

        // Für neue Diagramme: Validierungsfehler sofort anzeigen
        setTitleError(true) // Titel ist leer, also Fehler anzeigen
        setArchitectureError(true) // Architektur ist nicht gewählt, also Fehler anzeigen
      }
    }
  }, [open, existingDiagram, forceSaveAs])

  // Zusätzliche Validierung für Architektur wenn architecturesData geladen wird
  React.useEffect(() => {
    if (
      existingDiagram?.architecture &&
      architecturesData?.architectures &&
      open &&
      !selectedArchitecture
    ) {
      // Extrahiere die Architektur-ID (Array oder Objekt)
      const architectureFromDiagram = Array.isArray(existingDiagram.architecture)
        ? existingDiagram.architecture[0]
        : existingDiagram.architecture

      if (architectureFromDiagram?.id) {
        // Finde die Architektur in den geladenen Daten
        const foundArch = architecturesData.architectures.find(
          (a: any) => a.id === architectureFromDiagram.id
        )

        // Setze die gefundene Architektur nur wenn noch keine gesetzt ist
        if (foundArch) {
          setSelectedArchitecture(foundArch)
          setArchitectureError(false)
        }
      }
    }
  }, [architecturesData, open, existingDiagram?.architecture, selectedArchitecture])

  const handleSave = async () => {
    // Validierung
    const isTitleValid = title.trim().length > 0
    const isArchitectureValid = selectedArchitecture !== null

    setTitleError(!isTitleValid)
    setArchitectureError(!isArchitectureValid)

    if (!isTitleValid || !isArchitectureValid) {
      return
    }

    setSaving(true)
    try {
      const input = {
        title: title.trim(),
        description: description.trim() || undefined,
        diagramJson: diagramData,
        diagramType: diagramType, // Hinzufügen des diagramType-Felds
        architecture: {
          connect: [
            {
              where: {
                node: { id: { eq: selectedArchitecture.id } },
              },
            },
          ],
        },
        ...(user && {
          creator: {
            connect: [
              {
                where: {
                  node: { id: { eq: user.id } },
                },
              },
            ],
          },
        }),
      }

      let result
      if (existingDiagram?.id && !forceSaveAs) {
        // Update bestehende Diagramm
        const updateInput = {
          title: { set: title.trim() },
          description: { set: description.trim() || undefined },
          diagramJson: { set: diagramData },
          diagramType: { set: diagramType }, // Hinzufügen des diagramType-Felds für Updates
          architecture: {
            disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
            connect: [
              {
                where: {
                  node: { id: { eq: selectedArchitecture.id } },
                },
              },
            ],
          },
        }

        result = await updateDiagram({
          variables: {
            id: existingDiagram.id,
            input: updateInput,
          },
        })

        onSave(result.data.updateDiagrams.diagrams[0])
      } else {
        // Neue Diagramm erstellen (auch bei forceSaveAs)
        result = await createDiagram({
          variables: {
            input: [input],
          },
        })

        onSave(result.data.createDiagrams.diagrams[0])
      }

      onClose()
    } catch {
      // Fehler beim Speichern des Diagramms
    } finally {
      setSaving(false)
    }
  }

  const selectedDiagramType = DIAGRAM_TYPES.find(type => type.value === diagramType)

  // Handler für Titel-Änderungen mit Validierung
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    // Sofortige Validierung
    setTitleError(newTitle.trim().length === 0)
  }

  // Handler für Architektur-Änderungen mit Validierung
  const handleArchitectureChange = (_: any, newValue: any) => {
    setSelectedArchitecture(newValue)
    // Sofortige Validierung
    setArchitectureError(newValue === null)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {forceSaveAs
          ? 'Diagramm speichern unter...'
          : existingDiagram
            ? 'Diagramm aktualisieren'
            : 'Diagramm speichern'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Titel"
            value={title}
            onChange={handleTitleChange}
            fullWidth
            required
            error={titleError}
            helperText={
              titleError ? 'Titel ist ein Pflichtfeld' : 'Eindeutiger Name für das Diagramm'
            }
          />

          <TextField
            label="Beschreibung"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            helperText="Optionale Beschreibung des Diagramms"
          />

          <FormControl fullWidth>
            <InputLabel>Diagrammtyp</InputLabel>
            <Select
              value={diagramType}
              label="Diagrammtyp"
              onChange={e => setDiagramType(e.target.value)}
            >
              {DIAGRAM_TYPES.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {selectedDiagramType && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {selectedDiagramType.description}
              </Typography>
            )}
          </FormControl>

          <Autocomplete
            options={architecturesData?.architectures || []}
            value={selectedArchitecture}
            onChange={handleArchitectureChange}
            getOptionLabel={option => {
              if (!option || !option.name || !option.type) return ''
              return `${option.name} (${option.type})`
            }}
            isOptionEqualToValue={(option, value) => {
              if (!option || !value) return false
              return option.id === value.id
            }}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props
              return (
                <Box key={key} component="li" {...otherProps}>
                  <Box>
                    <Typography variant="body2">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.type} • {option.domain}
                    </Typography>
                  </Box>
                </Box>
              )
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Zugehörige Architektur"
                required
                error={architectureError}
                helperText={
                  architectureError
                    ? 'Architektur ist ein Pflichtfeld'
                    : 'Pflichtfeld: Ordnet das Diagramm einer bestimmten Architektur zu'
                }
              />
            )}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Abbrechen
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!title.trim() || !selectedArchitecture || saving}
        >
          {saving
            ? 'Speichere...'
            : forceSaveAs
              ? 'Als Kopie speichern'
              : existingDiagram
                ? 'Aktualisieren'
                : 'Speichern'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SaveDiagramDialog
