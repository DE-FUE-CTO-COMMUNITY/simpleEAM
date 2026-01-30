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
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useForm } from '@tanstack/react-form'
import { ArrowType, RelativePosition } from '../types/addRelatedElements'

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
      spacing: 200,
    },
    onSubmit: async ({ value }) => {
      if (!selectedElement || !excalidrawAPI) {
        console.error('Missing required data for adding related elements')
        return
      }

      setIsLoading(true)
      try {
        // Extract database ID from the selected element
        const databaseId = selectedElement.customData?.databaseId
        if (!databaseId) {
          console.error('Selected element does not have a database ID')
          return
        }

        // TODO: Implement actual loading and creation
        console.log('Would load related elements for:', databaseId, 'with config:', value)

        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Close dialog on success
        onClose()
      } catch (error) {
        console.error('Error adding related elements:', error)
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
                  if (value < 50) return 'Mindestabstand 50px'
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
                  onChange={e => field.handleChange(parseInt(e.target.value) || 200)}
                  onBlur={field.handleBlur}
                  error={!field.state.meta.isValid}
                  helperText={field.state.meta.errors.join(', ')}
                  inputProps={{ min: 50, max: 1000, step: 50 }}
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
