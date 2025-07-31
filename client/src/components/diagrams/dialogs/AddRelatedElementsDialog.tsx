'use client'

import React, { useState, useEffect } from 'react'
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
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useForm } from '@tanstack/react-form'
import { useApolloClient } from '@apollo/client'
import { ArrowType, RelativePosition } from '../types/addRelatedElements'
import { loadAndCreateRelatedElements } from '../utils/addRelatedElementsService'

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
  const apolloClient = useApolloClient()

  // Extract element information when dialog opens
  useEffect(() => {
    if (isOpen && selectedElement) {
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
    }
  }, [isOpen, selectedElement])

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
          value
        )

        if (result.success) {
          console.log(`Successfully added ${result.elementsAdded} related elements`)
          setResultMessage(`${result.elementsAdded} verwandte Elemente hinzugefügt`)

          // Kurz warten und dann Dialog schließen
          setTimeout(() => {
            onClose()
          }, 1500)
        } else {
          console.error('Failed to add related elements:', result.errorMessage)
          setResultMessage(result.errorMessage || 'Fehler beim Hinzufügen der Elemente')
        }
      } catch (error) {
        console.error('Error adding related elements:', error)
        setResultMessage(`Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`)
      } finally {
        setIsLoading(false)
      }
    },
  })

  if (!selectedElement) {
    return null
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('description', { element: elementName })}
        </Typography>

        {/* Ergebnis-Nachricht anzeigen */}
        {resultMessage && (
          <Alert severity={resultMessage.includes('Fehler') ? 'error' : 'success'} sx={{ mb: 2 }}>
            {resultMessage}
          </Alert>
        )}

        <form
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
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
              disabled={!canSubmit || isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
              {t('add')}
            </Button>
          )}
        </form.Subscribe>
      </DialogActions>
    </Dialog>
  )
}
