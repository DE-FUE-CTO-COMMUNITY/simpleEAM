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
import { useMutation, useQuery, useApolloClient } from '@apollo/client'
import { CREATE_DIAGRAM, UPDATE_DIAGRAM, GET_ARCHITECTURES_FOR_DIAGRAM } from '@/graphql/diagram'
import {
  LINK_CAPABILITY_TO_ARCHITECTURE,
  LINK_APPLICATION_TO_ARCHITECTURE,
  LINK_DATA_OBJECT_TO_ARCHITECTURE,
  LINK_APPLICATION_INTERFACE_TO_ARCHITECTURE,
} from '@/graphql/architectureLinking'
import { useAuth } from '@/lib/auth'
import {
  createDiagramRelationshipUpdates,
  createDiagramRelationshipUpdatesWithDisconnect,
  createArchitectureLinkingUpdates,
} from '../utils/diagramRelationshipUtils'
import {
  detectNewElements,
  createNewElementsInDatabase,
  updateElementsWithDatabaseReferences,
} from '../utils/newElementsUtils'
import { NewElementsDialog } from './NewElementsDialog'

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
  onDiagramUpdate?: (updatedDiagramData: string) => void // Handler für Canvas-Updates nach Element-Erstellung
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
  onDiagramUpdate,
  existingDiagram,
  forceSaveAs = false,
}) => {
  const { keycloak } = useAuth()
  const apolloClient = useApolloClient()

  // Extrahiere Benutzerinformationen aus dem Keycloak-Token
  const user = React.useMemo(() => {
    if (!keycloak?.token) return null

    try {
      const tokenPayload = JSON.parse(atob(keycloak.token.split('.')[1]))
      return {
        id: tokenPayload.sub,
        preferred_username: tokenPayload.preferred_username,
        given_name: tokenPayload.given_name,
        family_name: tokenPayload.family_name,
        email: tokenPayload.email,
      }
    } catch (error) {
      console.error('Fehler beim Parsen des Tokens:', error)
      return null
    }
  }, [keycloak?.token])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [diagramType, setDiagramType] = useState('ARCHITECTURE')
  const [selectedArchitecture, setSelectedArchitecture] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const [architectureError, setArchitectureError] = useState(false)

  // State für neue Elemente
  const [newElementsDialogOpen, setNewElementsDialogOpen] = useState(false)
  const [detectedNewElements, setDetectedNewElements] = useState<any[]>([])
  const [creatingElements, setCreatingElements] = useState(false)

  // Führe die Query nur aus, wenn der Benutzer authentifiziert ist
  const {
    data: architecturesData,
    loading: architecturesLoading,
    error: architecturesError,
  } = useQuery(GET_ARCHITECTURES_FOR_DIAGRAM, {
    skip: !keycloak?.authenticated || !keycloak?.token,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  })

  const [createDiagram] = useMutation(CREATE_DIAGRAM)
  const [updateDiagram] = useMutation(UPDATE_DIAGRAM)

  // Mutations für Architektur-Verknüpfungen
  const [linkCapabilityToArchitecture] = useMutation(LINK_CAPABILITY_TO_ARCHITECTURE)
  const [linkApplicationToArchitecture] = useMutation(LINK_APPLICATION_TO_ARCHITECTURE)
  const [linkDataObjectToArchitecture] = useMutation(LINK_DATA_OBJECT_TO_ARCHITECTURE)
  const [linkApplicationInterfaceToArchitecture] = useMutation(
    LINK_APPLICATION_INTERFACE_TO_ARCHITECTURE
  )

  // Funktion zum Verknüpfen aller Diagramm-Elemente mit der Architektur
  const linkElementsToArchitecture = async (diagramJsonString: string, architectureId: string) => {
    const linkingData = createArchitectureLinkingUpdates(diagramJsonString, architectureId)
    const promises: Promise<any>[] = []

    // BusinessCapabilities verknüpfen
    for (const capabilityId of linkingData.capabilities) {
      promises.push(
        linkCapabilityToArchitecture({
          variables: { id: capabilityId, architectureId },
        }).catch(error => {
          console.warn('⚠️ Fehler beim Verknüpfen von BusinessCapability', capabilityId, ':', error)
        })
      )
    }

    // Applications verknüpfen
    for (const applicationId of linkingData.applications) {
      promises.push(
        linkApplicationToArchitecture({
          variables: { id: applicationId, architectureId },
        }).catch(error => {
          console.warn('⚠️ Fehler beim Verknüpfen von Application', applicationId, ':', error)
        })
      )
    }

    // DataObjects verknüpfen
    for (const dataObjectId of linkingData.dataObjects) {
      promises.push(
        linkDataObjectToArchitecture({
          variables: { id: dataObjectId, architectureId },
        }).catch(error => {
          console.warn('⚠️ Fehler beim Verknüpfen von DataObject', dataObjectId, ':', error)
        })
      )
    }

    // ApplicationInterfaces verknüpfen
    for (const interfaceId of linkingData.interfaces) {
      promises.push(
        linkApplicationInterfaceToArchitecture({
          variables: { id: interfaceId, architectureId },
        }).catch(error => {
          console.warn(
            '⚠️ Fehler beim Verknüpfen von ApplicationInterface',
            interfaceId,
            ':',
            error
          )
        })
      )
    }

    // Alle Verknüpfungen parallel ausführen
    const results = await Promise.allSettled(promises)
    const successCount = results.filter(result => result.status === 'fulfilled').length
    const errorCount = results.filter(result => result.status === 'rejected').length

    return { successCount, errorCount }
  }

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

    // Prüfe auf neue Elemente im Diagramm
    try {
      const parsedDiagramData = JSON.parse(diagramData)
      const newElements = detectNewElements(parsedDiagramData.elements || [])

      if (newElements.length > 0) {
        // Neue Elemente gefunden - Dialog öffnen
        setDetectedNewElements(newElements)
        setNewElementsDialogOpen(true)
        return
      }
    } catch (error) {
      console.warn('Fehler beim Parsen der Diagrammdaten:', error)
    }

    // Keine neuen Elemente oder Parsing-Fehler - normales Speichern
    const savedDiagram = await performSave()
    if (savedDiagram) {
      onClose() // Dialog schließen
      onSave(savedDiagram) // Parent über Speichern informieren
    }
  }

  const handleNewElementsConfirm = async (selectedElements: any[]) => {
    setNewElementsDialogOpen(false)
    setCreatingElements(true)

    try {
      // Erstelle die ausgewählten Elemente in der Datenbank
      const creationResult = await createNewElementsInDatabase(apolloClient, selectedElements)

      if (creationResult.success) {
        // Aktualisiere die Diagrammdaten mit den neuen Datenbankreferenzen
        const parsedDiagramData = JSON.parse(diagramData)
        const updatedElements = updateElementsWithDatabaseReferences(
          parsedDiagramData.elements,
          creationResult.createdElements
        )
        // Aktualisiere diagramData für das Speichern
        const updatedDiagramData = JSON.stringify({
          ...parsedDiagramData,
          elements: updatedElements,
        })
        // Führe das Speichern mit den aktualisierten Daten durch
        const savedDiagram = await performSave(updatedDiagramData)

        // Nach erfolgreichem Speichern: Dialog schließen und Canvas-Update
        if (savedDiagram) {
          // Dialog sofort schließen
          onClose()

          // Canvas sofort mit den neuen Daten aktualisieren
          if (onDiagramUpdate) {
            onDiagramUpdate(updatedDiagramData)
          }

          // Verwende die gespeicherten Diagrammdaten (mit Datenbankreferenzen) für Parent-Callback
          const diagramWithUpdatedElements = {
            ...savedDiagram,
            diagramJson: updatedDiagramData, // Verwende die aktualisierten Daten
          }

          // Parent-Component über das gespeicherte Diagramm informieren
          onSave(diagramWithUpdatedElements)
        }
      } else {
        // Zeige Fehler bei der Elementerstellung, aber speichere trotzdem
        console.error('Fehler beim Erstellen der Elemente:', creationResult.errors)
        const savedDiagram = await performSave()
        if (savedDiagram) {
          onClose()
          onSave(savedDiagram)
        }
      }
    } catch (error) {
      console.error('Fehler beim Erstellen neuer Elemente:', error)
      // Bei Fehler trotzdem normal speichern
      const savedDiagram = await performSave()
      if (savedDiagram) {
        onClose()
        onSave(savedDiagram)
      }
    } finally {
      setCreatingElements(false)
    }
  }

  const performSave = async (customDiagramData?: string) => {
    const dataToSave = customDiagramData || diagramData

    setSaving(true)
    try {
      // PNG-Generierung vor dem Speichern
      let diagramPng: string | null = null
      try {
        const parsedDiagramData = JSON.parse(dataToSave)
        const elements = parsedDiagramData.elements || []

        if (elements.length > 0) {
          // Import export function dynamically
          const { exportToBlob } = await import('@excalidraw/excalidraw')

          const appState = parsedDiagramData.appState || {}

          // Export to PNG blob
          const blob = await exportToBlob({
            elements,
            appState: {
              ...appState,
              exportBackground: true,
              viewBackgroundColor: appState.viewBackgroundColor || '#ffffff',
              exportWithDarkMode: false,
              exportEmbedScene: false,
            },
            files: {},
            mimeType: 'image/png',
            quality: 0.95,
            exportPadding: 20,
          })

          if (blob) {
            // Convert blob to base64
            const arrayBuffer = await blob.arrayBuffer()
            const base64String = btoa(
              new Uint8Array(arrayBuffer).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
            diagramPng = base64String
          }
        }
      } catch (pngError) {
        console.warn('PNG-Generierung fehlgeschlagen:', pngError)
        // Speichern ohne PNG fortsetzen
      }

      const baseInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        diagramJson: dataToSave,
        diagramType: diagramType,
        ...(diagramPng && { diagramPng }),
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
        const relationshipUpdates = createDiagramRelationshipUpdatesWithDisconnect(dataToSave)
        const updateInput = {
          title: { set: title.trim() },
          description: { set: description.trim() || undefined },
          diagramJson: { set: dataToSave },
          diagramType: { set: diagramType },
          ...(diagramPng && { diagramPng: { set: diagramPng } }),
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
          ...relationshipUpdates, // Automatische Beziehungen zu Datenbankelementen
        }
        result = await updateDiagram({
          variables: {
            id: existingDiagram.id,
            input: updateInput,
          },
        })

        const savedDiagram = result.data.updateDiagrams.diagrams[0]
        // Nach erfolgreichem Update: Alle Diagramm-Elemente mit der Architektur verknüpfen
        try {
          await linkElementsToArchitecture(dataToSave, selectedArchitecture.id)
        } catch (linkingError) {
          console.warn(
            '⚠️ Fehler bei Architektur-Verknüpfung (Diagramm wurde trotzdem gespeichert):',
            linkingError
          )
        }

        return savedDiagram
      } else {
        // Neue Diagramm erstellen (auch bei forceSaveAs)
        const relationshipUpdates = createDiagramRelationshipUpdates(dataToSave)
        const input = {
          ...baseInput,
          ...relationshipUpdates, // Automatische Beziehungen zu Datenbankelementen
        }
        result = await createDiagram({
          variables: {
            input: [input],
          },
        })

        const savedDiagram = result.data.createDiagrams.diagrams[0]

        // Nach erfolgreichem Speichern: Alle Diagramm-Elemente mit der Architektur verknüpfen
        try {
          await linkElementsToArchitecture(dataToSave, selectedArchitecture.id)
        } catch (linkingError) {
          console.warn(
            '⚠️ Fehler bei Architektur-Verknüpfung (Diagramm wurde trotzdem gespeichert):',
            linkingError
          )
        }

        return savedDiagram
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Diagramms:', error)
      return null
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
    <>
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
              disabled={architecturesLoading || !!architecturesError}
              loading={architecturesLoading}
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
                      : architecturesError
                        ? `Fehler beim Laden der Architekturen: ${architecturesError.message}`
                        : architecturesLoading
                          ? 'Lade Architekturen...'
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

      {/* Dialog für neue Elemente */}
      <NewElementsDialog
        open={newElementsDialogOpen}
        onClose={() => setNewElementsDialogOpen(false)}
        onConfirm={handleNewElementsConfirm}
        newElements={detectedNewElements}
        loading={creatingElements}
      />
    </>
  )
}

export default SaveDiagramDialog
