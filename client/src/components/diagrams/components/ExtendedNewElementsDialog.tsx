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
    const relationshipsToCreate = [
      ...selectedRelationships.filter(rel => rel.selected),
      ...selectedIncompleteRelationships.filter(rel => rel.selected),
      ...selectedInvalidRelationships.filter(rel => rel.selected),
    ]
    onConfirm(elementsToCreate, relationshipsToCreate)
  }

  const formatRelationship = (relationship: NewRelationship): string => {
    // Hilfsfunktion: Prüft ob ein Element neu ist (in der newElements-Liste enthalten)
    const isNewElement = (elementId: string): boolean => {
      return newElements.some(el => el.id === elementId)
    }

    // Bei IN-Beziehungen die Reihenfolge umkehren, um die Beziehungsrichtung korrekt anzuzeigen
    const isReverseRelationship = relationship.relationshipDefinition.direction === 'IN'

    let actualSourceElement, actualTargetElement, actualSourceType, actualTargetType

    if (isReverseRelationship) {
      // Bei IN-Beziehungen: Zeige die Beziehungsrichtung (umgekehrt zur Pfeilrichtung)
      const isTargetMissingOrNew =
        relationship.missingElement === 'target' || isNewElement(relationship.targetElementId)
      const isSourceMissingOrNew =
        relationship.missingElement === 'source' || isNewElement(relationship.sourceElementId)

      actualSourceElement = isTargetMissingOrNew
        ? tRel('newElement', { elementName: relationship.targetElementName })
        : relationship.targetElementName
      actualTargetElement = isSourceMissingOrNew
        ? tRel('newElement', { elementName: relationship.sourceElementName })
        : relationship.sourceElementName
      actualSourceType = getElementTypeLabelTranslated(relationship.targetElementType)
      actualTargetType = getElementTypeLabelTranslated(relationship.sourceElementType)
    } else {
      // Bei OUT-Beziehungen: Zeige die Pfeilrichtung (gleich der Beziehungsrichtung)
      const isSourceMissingOrNew =
        relationship.missingElement === 'source' || isNewElement(relationship.sourceElementId)
      const isTargetMissingOrNew =
        relationship.missingElement === 'target' || isNewElement(relationship.targetElementId)

      actualSourceElement = isSourceMissingOrNew
        ? tRel('newElement', { elementName: relationship.sourceElementName })
        : relationship.sourceElementName
      actualTargetElement = isTargetMissingOrNew
        ? tRel('newElement', { elementName: relationship.targetElementName })
        : relationship.targetElementName
      actualSourceType = getElementTypeLabelTranslated(relationship.sourceElementType)
      actualTargetType = getElementTypeLabelTranslated(relationship.targetElementType)
    }

    const relationshipName = getRelationshipDisplayName(
      relationship.relationshipDefinition.type,
      locale
    )

    return tRel('relationshipFormat', {
      sourceElement: actualSourceElement,
      sourceType: actualSourceType,
      relationshipName,
      targetElement: actualTargetElement,
      targetType: actualTargetType,
    })
  }

  const selectedElementCount = selectedElements.filter(el => el.selected).length
  const selectedRelationshipCount =
    selectedRelationships.filter(rel => rel.selected).length +
    selectedIncompleteRelationships.filter(rel => rel.selected).length +
    selectedInvalidRelationships.filter(rel => rel.selected).length

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

            {/* Unvollständige Beziehungen */}
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

                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedIncompleteRelationships.every(rel => rel.selected)}
                          indeterminate={
                            selectedIncompleteRelationships.some(rel => rel.selected) &&
                            !selectedIncompleteRelationships.every(rel => rel.selected)
                          }
                          onChange={() => handleRelationshipSelectAll('incomplete')}
                          disabled={loading}
                        />
                      }
                      label={tRel('selectAll', {
                        selectedCount: selectedIncompleteRelationships.filter(rel => rel.selected)
                          .length,
                        totalCount: incompleteRelationships.length,
                      })}
                    />
                  </Box>

                  {selectedIncompleteRelationships.map(relationship => (
                    <Paper
                      key={relationship.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        border: relationship.selected ? '2px solid' : '1px solid',
                        borderColor: relationship.selected ? 'warning.main' : 'divider',
                        backgroundColor: relationship.selected
                          ? 'warning.lighter'
                          : 'background.paper',
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={relationship.selected}
                            onChange={() => handleRelationshipToggle(relationship.id, 'incomplete')}
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
                </AccordionDetails>
              </Accordion>
            )}

            {/* Ungültige Beziehungen */}
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

                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedInvalidRelationships.every(rel => rel.selected)}
                          indeterminate={
                            selectedInvalidRelationships.some(rel => rel.selected) &&
                            !selectedInvalidRelationships.every(rel => rel.selected)
                          }
                          onChange={() => handleRelationshipSelectAll('invalid')}
                          disabled={loading}
                        />
                      }
                      label={tRel('selectAll', {
                        selectedCount: selectedInvalidRelationships.filter(rel => rel.selected)
                          .length,
                        totalCount: invalidRelationships.length,
                      })}
                    />
                  </Box>

                  {selectedInvalidRelationships.map(relationship => (
                    <Paper
                      key={relationship.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        border: relationship.selected ? '2px solid' : '1px solid',
                        borderColor: relationship.selected ? 'error.main' : 'divider',
                        backgroundColor: relationship.selected
                          ? 'error.lighter'
                          : 'background.paper',
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={relationship.selected}
                            onChange={() => handleRelationshipToggle(relationship.id, 'invalid')}
                            disabled={loading}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2">
                              {formatRelationship(relationship)}
                            </Typography>
                            <Typography variant="caption" color="error.main">
                              {relationship.invalidReason}
                            </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', margin: 0 }}
                      />
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
          disabled={loading || (selectedElementCount === 0 && selectedRelationshipCount === 0)}
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
                return parts.join(' & ')
              })()}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
