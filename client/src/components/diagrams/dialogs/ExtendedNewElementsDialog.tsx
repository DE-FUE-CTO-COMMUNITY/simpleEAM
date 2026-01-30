'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { getElementTypeLabel } from '../utils/newElementsUtils'
import { NewRelationship } from '../types/relationshipTypes'
import { getRelationshipDisplayName } from '../utils/relationshipValidation'

interface NewElement {
  id: string
  text: string
  elementType: string
  x: number
  y: number
  width: number
  height: number
  strokeColor: string
  backgroundColor: string
  selected: boolean
}

interface ExtendedNewElementsDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (selectedElements: NewElement[], selectedRelationships: NewRelationship[]) => void
  newElements: NewElement[]
  newRelationships?: NewRelationship[]
  incompleteRelationships?: NewRelationship[]
  invalidRelationships?: NewRelationship[]
  loading?: boolean
}

export const ExtendedNewElementsDialog: React.FC<ExtendedNewElementsDialogProps> = ({
  open,
  onClose,
  onConfirm,
  newElements,
  newRelationships = [],
  incompleteRelationships = [],
  invalidRelationships = [],
  loading = false,
}) => {
  const [selectedElements, setSelectedElements] = useState<NewElement[]>([])
  const [selectedRelationships, setSelectedRelationships] = useState<NewRelationship[]>([])
  const [selectedIncompleteRelationships, setSelectedIncompleteRelationships] = useState<
    NewRelationship[]
  >([])
  const [selectedInvalidRelationships, setSelectedInvalidRelationships] = useState<
    NewRelationship[]
  >([])

  const t = useTranslations('diagrams.dialogs.newElements')
  const tRel = useTranslations('diagrams.dialogs.newRelationships')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  // Translate element types using internationalization
  const getElementTypeLabelTranslated = (elementType: string): string => {
    return t(`elementTypes.${elementType}` as any) || getElementTypeLabel(elementType)
  }

  // Helper function to translate invalidReason text
  const translateInvalidReason = (invalidReason: string): string => {
    // Check if it's a translation key
    if (invalidReason.startsWith('diagrams.dialogs.newRelationships.invalidReasons.')) {
      // Handle parameterized translations (e.g., incompatibleElementTypes with sourceType and targetType)
      if (invalidReason.includes(':sourceType=') && invalidReason.includes(':targetType=')) {
        const [, params] = invalidReason.split(':sourceType=')
        const [sourceType, targetType] = params.split(':targetType=')

        return tRel('invalidReasons.incompatibleElementTypes', {
          sourceType: getElementTypeLabelTranslated(sourceType),
          targetType: getElementTypeLabelTranslated(targetType),
        })
      } else {
        // Simple translation key
        const translationKey = invalidReason.replace(
          'diagrams.dialogs.newRelationships.',
          ''
        ) as any
        return tRel(translationKey)
      }
    }

    // Fallback for non-translated text (shouldn't happen after migration)
    return invalidReason
  }

  // Initialize selection state when dialog opens
  React.useEffect(() => {
    if (open && newElements.length > 0) {
      // Initially select all elements
      setSelectedElements(newElements.map(el => ({ ...el, selected: true })))
    }
  }, [open, newElements])

  React.useEffect(() => {
    if (open && newRelationships.length > 0) {
      // Initially select all valid relationships
      setSelectedRelationships(newRelationships.map(rel => ({ ...rel, selected: true })))
    }
  }, [open, newRelationships])

  React.useEffect(() => {
    if (open && incompleteRelationships.length > 0) {
      // Initially deselect incomplete relationships
      setSelectedIncompleteRelationships(
        incompleteRelationships.map(rel => ({ ...rel, selected: false }))
      )
    }
  }, [open, incompleteRelationships])

  React.useEffect(() => {
    if (open && invalidRelationships.length > 0) {
      // Initially deselect invalid relationships
      setSelectedInvalidRelationships(
        invalidRelationships.map(rel => ({ ...rel, selected: false }))
      )
    }
  }, [open, invalidRelationships])

  const handleElementToggle = (elementId: string) => {
    setSelectedElements(prev =>
      prev.map(el => (el.id === elementId ? { ...el, selected: !el.selected } : el))
    )
  }

  const handleElementSelectAll = () => {
    const allSelected = selectedElements.every(el => el.selected)
    setSelectedElements(prev => prev.map(el => ({ ...el, selected: !allSelected })))
  }

  const handleRelationshipToggle = (
    relationshipId: string,
    type: 'valid' | 'incomplete' | 'invalid'
  ) => {
    if (type === 'valid') {
      setSelectedRelationships(prev =>
        prev.map(rel => (rel.id === relationshipId ? { ...rel, selected: !rel.selected } : rel))
      )
    } else if (type === 'incomplete') {
      setSelectedIncompleteRelationships(prev =>
        prev.map(rel => (rel.id === relationshipId ? { ...rel, selected: !rel.selected } : rel))
      )
    } else if (type === 'invalid') {
      setSelectedInvalidRelationships(prev =>
        prev.map(rel => (rel.id === relationshipId ? { ...rel, selected: !rel.selected } : rel))
      )
    }
  }

  const handleRelationshipSelectAll = (type: 'valid' | 'incomplete' | 'invalid') => {
    if (type === 'valid') {
      const allSelected = selectedRelationships.every(rel => rel.selected)
      setSelectedRelationships(prev => prev.map(rel => ({ ...rel, selected: !allSelected })))
    } else if (type === 'incomplete') {
      const allSelected = selectedIncompleteRelationships.every(rel => rel.selected)
      setSelectedIncompleteRelationships(prev =>
        prev.map(rel => ({ ...rel, selected: !allSelected }))
      )
    } else if (type === 'invalid') {
      const allSelected = selectedInvalidRelationships.every(rel => rel.selected)
      setSelectedInvalidRelationships(prev => prev.map(rel => ({ ...rel, selected: !allSelected })))
    }
  }

  const handleConfirm = () => {
    const elementsToCreate = selectedElements.filter(el => el.selected)
    // Nur gültige Beziehungen können erstellt werden
    const relationshipsToCreate = selectedRelationships.filter(rel => rel.selected)
    onConfirm(elementsToCreate, relationshipsToCreate)
  }

  const formatRelationship = (relationship: NewRelationship): string => {
    // Hilfsfunktion: Prüft ob ein Element neu ist (in der newElements-Liste enthalten)
    const isNewElement = (elementId: string): boolean => {
      return newElements.some(el => el.id === elementId)
    }

    // Hilfsfunktion: Bestimmt wie ein Element angezeigt werden soll
    const getElementDisplay = (
      elementId: string,
      elementName: string,
      missingType?: 'source' | 'target' | 'both'
    ) => {
      if (
        missingType &&
        (relationship.missingElement === missingType || relationship.missingElement === 'both')
      ) {
        // Physisch fehlendes Element (kein Binding im Diagramm)
        return tRel('missingElement')
      } else if (isNewElement(elementId)) {
        // Neues Element (existiert im Diagramm, aber nicht in der Datenbank)
        return tRel('newElement', { elementName })
      } else {
        // Bestehendes Element
        return elementName
      }
    }

    // Helper function: Determines the element type for display
    const getElementTypeDisplay = (
      elementType: string,
      elementName: string,
      missingType?: 'source' | 'target' | 'both'
    ) => {
      // If the element is physically missing (Missing Element), don't show a type
      if (
        missingType &&
        (relationship.missingElement === missingType || relationship.missingElement === 'both')
      ) {
        return ''
      }
      return getElementTypeLabelTranslated(elementType)
    }

    // For IN relationships, reverse the order to correctly show the relationship direction
    const isReverseRelationship = relationship.relationshipDefinition.direction === 'IN'

    let actualSourceElement, actualTargetElement, actualSourceType, actualTargetType

    if (isReverseRelationship) {
      // For IN relationships: Show the relationship direction (reversed from arrow direction)
      actualSourceElement = getElementDisplay(
        relationship.targetElementId,
        relationship.targetElementName,
        'target'
      )
      actualTargetElement = getElementDisplay(
        relationship.sourceElementId,
        relationship.sourceElementName,
        'source'
      )
      actualSourceType = getElementTypeDisplay(
        relationship.targetElementType,
        relationship.targetElementName,
        'target'
      )
      actualTargetType = getElementTypeDisplay(
        relationship.sourceElementType,
        relationship.sourceElementName,
        'source'
      )
    } else {
      // For OUT relationships: Show the arrow direction (same as relationship direction)
      actualSourceElement = getElementDisplay(
        relationship.sourceElementId,
        relationship.sourceElementName,
        'source'
      )
      actualTargetElement = getElementDisplay(
        relationship.targetElementId,
        relationship.targetElementName,
        'target'
      )
      actualSourceType = getElementTypeDisplay(
        relationship.sourceElementType,
        relationship.sourceElementName,
        'source'
      )
      actualTargetType = getElementTypeDisplay(
        relationship.targetElementType,
        relationship.targetElementName,
        'target'
      )
    }

    const relationshipName = getRelationshipDisplayName(
      relationship.relationshipDefinition.type,
      locale
    )

    // Prüfe, ob es sich um eine unvollständige Beziehung mit Missing Elements handelt
    const sourceIsMissing =
      relationship.missingElement === 'source' || relationship.missingElement === 'both'
    const targetIsMissing =
      relationship.missingElement === 'target' || relationship.missingElement === 'both'
    const hasMissingElements = sourceIsMissing || targetIsMissing

    if (hasMissingElements) {
      // Für Missing Elements: Verwende ein einfacheres Format ohne Typen für die fehlenden Elemente
      const sourceDisplay = sourceIsMissing
        ? actualSourceElement
        : `${actualSourceElement} (${actualSourceType})`
      const targetDisplay = targetIsMissing
        ? actualTargetElement
        : `${actualTargetElement} (${actualTargetType})`
      return `${sourceDisplay} → ${relationshipName} → ${targetDisplay}`
    }

    return tRel('relationshipFormat', {
      sourceElement: actualSourceElement,
      sourceType: actualSourceType,
      relationshipName,
      targetElement: actualTargetElement,
      targetType: actualTargetType,
    })
  }

  const selectedElementCount = selectedElements.filter(el => el.selected).length
  // Nur gültige Beziehungen sind auswählbar
  const selectedRelationshipCount = selectedRelationships.filter(rel => rel.selected).length

  const hasElements = newElements.length > 0
  const hasRelationships =
    newRelationships.length > 0 ||
    incompleteRelationships.length > 0 ||
    invalidRelationships.length > 0

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth disableEscapeKeyDown={loading}>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {hasElements && hasRelationships
            ? `${t('title')} & ${tRel('title')}`
            : hasElements
              ? t('title')
              : tRel('title')}
        </Typography>
        {hasElements && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('description', { count: newElements.length })}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {/* Neue Elemente Sektion */}
        {hasElements && (
          <>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedElements.every(el => el.selected)}
                    indeterminate={
                      selectedElements.some(el => el.selected) &&
                      !selectedElements.every(el => el.selected)
                    }
                    onChange={handleElementSelectAll}
                    disabled={loading}
                  />
                }
                label={t('selectAll', {
                  selectedCount: selectedElementCount,
                  totalCount: newElements.length,
                })}
              />
            </Box>

            <Box sx={{ maxHeight: 400, overflowY: 'auto', mb: 3 }}>
              {selectedElements.map((element, index) => (
                <Paper
                  key={element.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    border: element.selected ? '2px solid' : '1px solid',
                    borderColor: element.selected ? 'primary.main' : 'divider',
                    backgroundColor: element.selected ? 'action.selected' : 'background.paper',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={element.selected}
                        onChange={() => handleElementToggle(element.id)}
                        disabled={loading}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {element.text || t('elementLabel', { index: index + 1 })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('elementType', {
                            type: getElementTypeLabelTranslated(element.elementType),
                          })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t('elementPosition', {
                            x: Math.round(element.x),
                            y: Math.round(element.y),
                            width: Math.round(element.width),
                            height: Math.round(element.height),
                          })}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', margin: 0 }}
                  />
                </Paper>
              ))}
            </Box>

            {newElements.length === 0 && (
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                {t('noElementsFound')}
              </Typography>
            )}

            {hasRelationships && <Divider sx={{ my: 3 }} />}
          </>
        )}

        {/* Neue Beziehungen Sektion */}
        {hasRelationships && (
          <Box sx={{ mt: hasElements ? 0 : 2 }}>
            {/* Gültige Beziehungen */}
            {newRelationships.length > 0 && (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                    {tRel('title')} ({newRelationships.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tRel('description')}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedRelationships.every(rel => rel.selected)}
                          indeterminate={
                            selectedRelationships.some(rel => rel.selected) &&
                            !selectedRelationships.every(rel => rel.selected)
                          }
                          onChange={() => handleRelationshipSelectAll('valid')}
                          disabled={loading}
                        />
                      }
                      label={tRel('selectAll', {
                        selectedCount: selectedRelationships.filter(rel => rel.selected).length,
                        totalCount: newRelationships.length,
                      })}
                    />
                  </Box>

                  {selectedRelationships.map(relationship => (
                    <Paper
                      key={relationship.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        border: relationship.selected ? '2px solid' : '1px solid',
                        borderColor: relationship.selected ? 'success.main' : 'divider',
                        backgroundColor: relationship.selected
                          ? 'success.lighter'
                          : 'background.paper',
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={relationship.selected}
                            onChange={() => handleRelationshipToggle(relationship.id, 'valid')}
                            disabled={loading}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            {formatRelationship(relationship)}
                          </Typography>
                        }
                        sx={{ width: '100%', margin: 0 }}
                      />
                    </Paper>
                  ))}

                  {newRelationships.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                      sx={{ py: 2 }}
                    >
                      {tRel('noValidRelationships')}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            )}

            {/* Unvollständige Beziehungen - nur anzeigen wenn vorhanden */}
            {incompleteRelationships.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" color="warning.main">
                    {tRel('incompleteTitle')} ({incompleteRelationships.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {tRel('incompleteDescription')}
                  </Alert>

                  {/* Unvollständige Beziehungen haben KEINE Checkboxen - nur Anzeige */}
                  {selectedIncompleteRelationships.map(relationship => (
                    <Paper
                      key={relationship.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        border: '1px solid',
                        borderColor: 'warning.main',
                        backgroundColor: 'warning.lighter',
                      }}
                    >
                      <Typography variant="body2">{formatRelationship(relationship)}</Typography>
                    </Paper>
                  ))}
                </AccordionDetails>
              </Accordion>
            )}

            {/* Ungültige Beziehungen - nur anzeigen wenn vorhanden */}
            {invalidRelationships.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" color="error.main">
                    {tRel('invalidTitle')} ({invalidRelationships.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {tRel('invalidDescription')}
                  </Alert>

                  {/* Ungültige Beziehungen haben KEINE Checkboxen - nur Anzeige */}
                  {selectedInvalidRelationships.map(relationship => (
                    <Paper
                      key={relationship.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        border: '1px solid',
                        borderColor: 'error.main',
                        backgroundColor: 'error.lighter',
                      }}
                    >
                      <Box>
                        <Typography variant="body2">{formatRelationship(relationship)}</Typography>
                        <Typography variant="caption" color="error.main">
                          {translateInvalidReason(relationship.invalidReason || '')}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {tCommon('cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading
            ? hasElements && hasRelationships
              ? tRel('terms.creatingElementsAndRelationships')
              : hasElements
                ? t('creatingElements')
                : tRel('creatingRelationships')
            : (() => {
                const parts = []
                if (selectedElementCount > 0) {
                  parts.push(
                    t('createButton', {
                      count: selectedElementCount,
                      elementText:
                        selectedElementCount === 1 ? tRel('terms.element') : tRel('terms.elements'),
                    })
                  )
                }
                if (selectedRelationshipCount > 0) {
                  parts.push(
                    tRel('createButton', {
                      count: selectedRelationshipCount,
                      relationshipText:
                        selectedRelationshipCount === 1
                          ? tRel('terms.relationship')
                          : tRel('terms.relationships'),
                    })
                  )
                }
                // Fallback wenn nichts ausgewählt ist - trotzdem fortfahren erlauben
                return parts.length > 0 ? parts.join(' & ') : tCommon('confirm')
              })()}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
