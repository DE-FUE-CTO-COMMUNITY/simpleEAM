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
  { value: 'CAPABILITY_MAP', label: 'Capability Map', description: 'Fähigkeitslandkarte' },
  { value: 'DATA_FLOW', label: 'Datenflussdiagramm', description: 'Darstellung von Datenströmen' },
  { value: 'PROCESS', label: 'Prozessdiagramm', description: 'Geschäftsprozesse und Workflows' },
  { value: 'NETWORK', label: 'Netzwerkdiagramm', description: 'IT-Infrastruktur und Netzwerke' },
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
    architectureId?: string
  }
}

const SaveDiagramDialog: React.FC<SaveDiagramDialogProps> = ({
  open,
  onClose,
  onSave,
  diagramData,
  existingDiagram,
}) => {
  const { user } = useAuth()
  const [title, setTitle] = useState(existingDiagram?.title || '')
  const [description, setDescription] = useState(existingDiagram?.description || '')
  const [diagramType, setDiagramType] = useState(existingDiagram?.diagramType || 'ARCHITECTURE')
  const [selectedArchitecture, setSelectedArchitecture] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const { data: architecturesData } = useQuery(GET_ARCHITECTURES_FOR_DIAGRAM)

  const [createDiagram] = useMutation(CREATE_DIAGRAM)
  const [updateDiagram] = useMutation(UPDATE_DIAGRAM)

  const handleSave = async () => {
    if (!title.trim()) {
      return
    }

    setSaving(true)
    try {
      const input = {
        title: title.trim(),
        description: description.trim() || undefined,
        diagramJson: diagramData,
        ...(selectedArchitecture && {
          architecture: {
            connect: [
              {
                where: {
                  node: { id: { eq: selectedArchitecture.id } },
                },
              },
            ],
          },
        }),
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
      if (existingDiagram?.id) {
        // Update bestehende Diagramm
        const updateInput = {
          title: { set: title.trim() },
          description: { set: description.trim() || undefined },
          diagramJson: { set: diagramData },
          ...(selectedArchitecture && {
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
          }),
        }

        result = await updateDiagram({
          variables: {
            id: existingDiagram.id,
            input: updateInput,
          },
        })

        onSave(result.data.updateDiagrams.diagrams[0])
      } else {
        // Neue Diagramm erstellen
        result = await createDiagram({
          variables: {
            input: [input],
          },
        })

        onSave(result.data.createDiagrams.diagrams[0])
      }

      onClose()
    } catch (error) {
      console.error('Fehler beim Speichern des Diagramms:', error)
    } finally {
      setSaving(false)
    }
  }

  const selectedDiagramType = DIAGRAM_TYPES.find(type => type.value === diagramType)

  React.useEffect(() => {
    if (existingDiagram?.architectureId && architecturesData?.architectures) {
      const arch = architecturesData.architectures.find(
        (a: any) => a.id === existingDiagram.architectureId
      )
      if (arch) {
        setSelectedArchitecture(arch)
      }
    }
  }, [existingDiagram?.architectureId, architecturesData])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{existingDiagram ? 'Diagramm aktualisieren' : 'Diagramm speichern'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Titel"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            required
            helperText="Eindeutiger Name für das Diagramm"
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
            onChange={(_, newValue) => setSelectedArchitecture(newValue)}
            getOptionLabel={option => `${option.name} (${option.type})`}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body2">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.type} • {option.domain}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={params => (
              <TextField
                {...params}
                label="Zugehörige Architektur"
                helperText="Optional: Ordnet das Diagramm einer bestimmten Architektur zu"
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
        <Button onClick={handleSave} variant="contained" disabled={!title.trim() || saving}>
          {saving ? 'Speichere...' : existingDiagram ? 'Aktualisieren' : 'Speichern'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SaveDiagramDialog
