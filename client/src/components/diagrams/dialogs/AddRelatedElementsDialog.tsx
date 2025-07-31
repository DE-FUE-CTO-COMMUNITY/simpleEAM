'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useTranslations } from 'next-intl'
import { useForm } from '@tanstack/react-form'
import { useApolloClient } from '@apollo/client'
import { ArrowType, RelativePosition, AddRelatedElementsConfig } from '../types/addRelatedElements'
import { loadAndCreateRelatedElements } from '../utils/addRelatedElementsService'
import ElementTypeSelectionDialog, { ElementTypeOption } from './ElementTypeSelectionDialog'

interface AddRelatedElementsDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedElement: any | null // The selected Excalidraw element
  excalidrawAPI: any
}

export default function AddRelatedElementsDialog({
  isOpen,
  onClose,
  selectedElement,
  excalidrawAPI,
}: AddRelatedElementsDialogProps) {
  const t = useTranslations('diagrams.addRelatedElements')
  const tCommon = useTranslations('common')
  const [isLoading, setIsLoading] = useState(false)
  const [elementName, setElementName] = useState<string>('')
  const [resultMessage, setResultMessage] = useState<string>('')
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false)
  const [selectedElementTypes, setSelectedElementTypes] = useState<string[]>([
    'capability',
    'application',
    'dataObject',
    'interface',
    'infrastructure',
  ])
  const [expectedElementCount, setExpectedElementCount] = useState<number>(0)
  const [allRelatedElements, setAllRelatedElements] = useState<any[]>([])
  const apolloClient = useApolloClient()

  // Available element types for selection
  const availableElementTypes: ElementTypeOption[] = [
    {
      id: 'capability',
      label: 'Capabilities',
      description: 'Geschäftsfähigkeiten und Funktionen',
    },
    {
      id: 'application',
      label: 'Applications',
      description: 'Anwendungen und Software-Komponenten',
    },
    {
      id: 'dataObject',
      label: 'Data Objects',
      description: 'Datenobjekte und Informationsstrukturen',
    },
    {
      id: 'interface',
      label: 'Interfaces',
      description: 'Schnittstellen zwischen Komponenten',
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      description: 'Infrastruktur-Komponenten und Hardware',
    },
  ]

  // Function to calculate expected element count based on current filter
  const calculateExpectedCount = (relatedElements: any[], selectedTypes: string[]): number => {
    return relatedElements.filter(element => selectedTypes.includes(element.elementType)).length
  }

  // Function to load related elements for preview
  const loadRelatedElementsPreview = useCallback(
    async (element: any) => {
      if (!element?.customData?.databaseId) return []

      try {
        const databaseId = element.customData.databaseId
        const elementType = element.customData.elementType

        // Use the service function to load related elements
        const { loadRelatedElementsFromDatabase } = await import(
          '../utils/addRelatedElementsService'
        )
        const response = await loadRelatedElementsFromDatabase(
          apolloClient,
          databaseId,
          elementType
        )
        return response.elements || []
      } catch (error) {
        console.error('Error loading related elements preview:', error)
        return []
      }
    },
    [apolloClient]
  )

  // Update expected count when filter changes
  useEffect(() => {
    const newCount = calculateExpectedCount(allRelatedElements, selectedElementTypes)
    setExpectedElementCount(newCount)
  }, [allRelatedElements, selectedElementTypes])

  // Handler for element type selection changes
  const handleElementTypeChange = (newSelectedTypes: string[]) => {
    setSelectedElementTypes(newSelectedTypes)
    // Clear any previous result message when filter changes
    setResultMessage('')
  }

  // Extract element information and load related elements when dialog opens
  useEffect(() => {
    if (isOpen && selectedElement) {
      // Reset states
      setResultMessage('')
      setAllRelatedElements([])
      setExpectedElementCount(0)

      // Extract database ID and element name from customData
      const customData = selectedElement.customData
      if (customData?.databaseId && customData?.elementName) {
        setElementName(customData.elementName)
      } else {
        // Fallback: use text content if available
        const textElement = selectedElement.type === 'text' ? selectedElement : null
        if (textElement?.text) {
          setElementName(textElement.text)
        } else {
          setElementName('Unknown Element')
        }
      }

      // Load related elements for preview
      loadRelatedElementsPreview(selectedElement).then(elements => {
        setAllRelatedElements(elements)
      })
    }
  }, [isOpen, selectedElement, loadRelatedElementsPreview])

  // Form configuration
  const form = useForm({
    defaultValues: {
      hops: 1,
      position: 'right' as RelativePosition,
      arrowType: 'sharp' as ArrowType,
      spacing: 20,
    },
    onSubmit: async ({ value }) => {
      if (!selectedElement || !excalidrawAPI) {
        console.error('Missing required data for adding related elements')
        return
      }

      // Set loading state IMMEDIATELY before any async operations
      console.log('Setting isLoading to true')
      setIsLoading(true)
      setResultMessage('')

      try {
        // Extract database ID from the selected element
        const databaseId = selectedElement.customData?.databaseId
        if (!databaseId) {
          console.error('Selected element does not have a database ID')
          setResultMessage('Element hat keine Datenbankverknüpfung')
          return
        }

        console.log('Loading related elements for:', databaseId, 'with config:', value)

        // Verwende den echten Service zum Laden und Erstellen der Elemente
        const result = await loadAndCreateRelatedElements(
          apolloClient,
          selectedElement,
          excalidrawAPI,
          {
            ...value,
            selectedElementTypes,
          }
        )

        if (result.success) {
          console.log(`Successfully added ${result.elementsAdded} related elements`)
          setResultMessage(
            `${result.elementsAdded} verwandte Elemente wurden erfolgreich hinzugefügt`
          )

          // Bei Erfolg sofort schließen
          onClose()
        } else {
          console.error('Failed to add related elements:', result.errorMessage)
          setResultMessage(result.errorMessage || 'Fehler beim Hinzufügen der Elemente')
          // Bei Fehler NICHT automatisch schließen
        }
      } catch (error) {
        console.error('Error adding related elements:', error)
        setResultMessage(`Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`)
        // Bei Fehler NICHT automatisch schließen
      } finally {
        console.log('Setting isLoading to false')
        setIsLoading(false)
      }
    },
  })

  // Check if selectedElement exists - return null if not
  if (!selectedElement) {
    return null
  }

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle>{t('title')}</DialogTitle>
      <DialogContent>
        {/* Debug Information - IMMER SICHTBAR */}
        <Box sx={{ mb: 3, p: 2, border: '2px solid #ff0000', borderRadius: 1, bgcolor: '#ffebee' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#ff0000' }}>
            � DEBUG BOX - IMMER SICHTBAR
          </Typography>
          {selectedElement ? (
            <>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                Position: x={selectedElement.x}, y={selectedElement.y}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                Größe: width={selectedElement.width}, height={selectedElement.height}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                Typ: {selectedElement.type}
              </Typography>
              {selectedElement.customData && (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  Element-Typ: {selectedElement.customData.elementType}
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{ fontFamily: 'monospace', fontSize: '0.9rem', mt: 1, fontWeight: 'bold' }}
              >
                Neue Elemente: width={selectedElement.width}, height={selectedElement.height}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                Vertikaler Abstand (links/rechts): height + spacing = {selectedElement.height} + 20
                = {selectedElement.height + 20}px
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                Horizontaler Abstand (oben/unten): width + spacing = {selectedElement.width} + 20 ={' '}
                {selectedElement.width + 20}px
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: 'monospace', fontSize: '0.9rem', mt: 1, color: '#666' }}
              >
                ℹ️ Nur bekannte Element-Typen werden erstellt (capability, application, dataObject,
                interface, infrastructure)
              </Typography>
            </>
          ) : (
            <Typography variant="body2" sx={{ color: '#ff0000', fontWeight: 'bold' }}>
              ⚠️ FEHLER: selectedElement ist NULL!
            </Typography>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('description', { element: elementName })}
        </Typography>

        {/* Processing Indicator */}
        {isLoading && (
          <Alert
            severity="info"
            icon={<CircularProgress size={20} />}
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Verarbeite verwandte Elemente... Bitte warten.
          </Alert>
        )}

        {/* Ergebnis-Nachricht anzeigen */}
        {resultMessage && (
          <Alert severity={resultMessage.includes('Fehler') ? 'error' : 'success'} sx={{ mb: 3 }}>
            {resultMessage}
          </Alert>
        )}

        {/* Element Type Selection */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Typography variant="h6">Element-Typen</Typography>
            <Button
              startIcon={<FilterListIcon />}
              variant="outlined"
              size="small"
              onClick={() => setIsTypeSelectionOpen(true)}
            >
              Auswählen ({selectedElementTypes.length})
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedElementTypes.map(typeId => {
              const type = availableElementTypes.find(t => t.id === typeId)
              return type ? (
                <Chip key={typeId} label={type.label} size="small" variant="outlined" />
              ) : null
            })}
            {selectedElementTypes.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Keine Element-Typen ausgewählt
              </Typography>
            )}
          </Box>
        </Box>

        {/* Expected Element Count */}
        {expectedElementCount > 0 && !resultMessage && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {expectedElementCount} verwandte Elemente dieser Typen werden hinzugefügt
          </Alert>
        )}

        <form
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          style={{ marginTop: '40px' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Number of Hops */}
            <form.Field
              name="hops"
              validators={{
                onChange: ({ value }) => {
                  if (value < 1) return 'Mindestens 1 Hop erforderlich'
                  if (value > 5) return 'Maximal 5 Hops erlaubt'
                  return undefined
                },
              }}
            >
              {field => (
                <TextField
                  label={t('hops')}
                  type="number"
                  value={field.state.value}
                  onChange={e => field.handleChange(parseInt(e.target.value) || 1)}
                  onBlur={field.handleBlur}
                  error={!field.state.meta.isValid}
                  helperText={field.state.meta.errors.join(', ')}
                  inputProps={{ min: 1, max: 5 }}
                  fullWidth
                />
              )}
            </form.Field>

            {/* Position */}
            <form.Field name="position">
              {field => (
                <FormControl fullWidth>
                  <InputLabel>{t('position')}</InputLabel>
                  <Select
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value as RelativePosition)}
                    onBlur={field.handleBlur}
                    label={t('position')}
                  >
                    <MenuItem value="left">{t('positions.left')}</MenuItem>
                    <MenuItem value="right">{t('positions.right')}</MenuItem>
                    <MenuItem value="top">{t('positions.top')}</MenuItem>
                    <MenuItem value="bottom">{t('positions.bottom')}</MenuItem>
                  </Select>
                </FormControl>
              )}
            </form.Field>

            {/* Arrow Type */}
            <form.Field name="arrowType">
              {field => (
                <FormControl fullWidth>
                  <InputLabel>{t('arrowType')}</InputLabel>
                  <Select
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value as ArrowType)}
                    onBlur={field.handleBlur}
                    label={t('arrowType')}
                  >
                    <MenuItem value="sharp">{t('arrowTypes.sharp')}</MenuItem>
                    <MenuItem value="curved">{t('arrowTypes.curved')}</MenuItem>
                    <MenuItem value="elbow">{t('arrowTypes.elbow')}</MenuItem>
                  </Select>
                </FormControl>
              )}
            </form.Field>

            {/* Spacing */}
            <form.Field
              name="spacing"
              validators={{
                onChange: ({ value }) => {
                  if (value < 10) return 'Mindestabstand 10px'
                  if (value > 1000) return 'Maximalabstand 1000px'
                  return undefined
                },
              }}
            >
              {field => (
                <TextField
                  label={t('spacing')}
                  type="number"
                  value={field.state.value}
                  onChange={e => field.handleChange(parseInt(e.target.value) || 20)}
                  onBlur={field.handleBlur}
                  error={!field.state.meta.isValid}
                  helperText={field.state.meta.errors.join(', ')}
                  inputProps={{ min: 10, max: 1000, step: 10 }}
                  fullWidth
                />
              )}
            </form.Field>
          </Box>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          {tCommon('cancel')}
        </Button>
        <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              onClick={() => form.handleSubmit()}
              variant="contained"
              disabled={
                !canSubmit || isLoading || isSubmitting || selectedElementTypes.length === 0
              }
            >
              {isLoading || isSubmitting ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
              {t('add')}
            </Button>
          )}
        </form.Subscribe>
      </DialogActions>

      {/* Element Type Selection Dialog */}
      <ElementTypeSelectionDialog
        isOpen={isTypeSelectionOpen}
        onClose={() => setIsTypeSelectionOpen(false)}
        onConfirm={handleElementTypeChange}
        availableTypes={availableElementTypes}
        initialSelectedTypes={selectedElementTypes}
        title="Element-Typen auswählen"
        description="Wählen Sie die Typen von verwandten Elementen aus, die hinzugefügt werden sollen."
      />
    </Dialog>
  )
}
