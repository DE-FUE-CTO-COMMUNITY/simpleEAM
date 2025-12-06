'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/auth'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { GET_ARCHITECTURES_FOR_DIAGRAM } from '@/graphql/diagram'
import type { LocalStoredDiagramMetadata, LocalDiagramTypeValue } from './types'

interface LocalSaveDiagramDialogProps {
  open: boolean
  initialName?: string | null
  initialMetadata?: LocalStoredDiagramMetadata
  forceSaveAs?: boolean
  isUpdate?: boolean
  onCancel: () => void
  onConfirm: (payload: {
    name: string
    metadata: LocalStoredDiagramMetadata
  }) => boolean | Promise<boolean>
}

interface DiagramTypeOption {
  value: LocalDiagramTypeValue
  label: string
  description: string
}

const createDiagramTypes = (t: ReturnType<typeof useTranslations>): DiagramTypeOption[] => [
  {
    value: 'ARCHITECTURE',
    label: t('diagramTypes.ARCHITECTURE'),
    description: t('diagramTypeDescriptions.ARCHITECTURE'),
  },
  {
    value: 'APPLICATION_LANDSCAPE',
    label: t('diagramTypes.APPLICATION_LANDSCAPE'),
    description: t('diagramTypeDescriptions.APPLICATION_LANDSCAPE'),
  },
  {
    value: 'CAPABILITY_MAP',
    label: t('diagramTypes.CAPABILITY_MAP'),
    description: t('diagramTypeDescriptions.CAPABILITY_MAP'),
  },
  {
    value: 'DATA_FLOW',
    label: t('diagramTypes.DATA_FLOW'),
    description: t('diagramTypeDescriptions.DATA_FLOW'),
  },
  {
    value: 'PROCESS',
    label: t('diagramTypes.PROCESS'),
    description: t('diagramTypeDescriptions.PROCESS'),
  },
  {
    value: 'NETWORK',
    label: t('diagramTypes.NETWORK'),
    description: t('diagramTypeDescriptions.NETWORK'),
  },
  {
    value: 'INTEGRATION_ARCHITECTURE',
    label: t('diagramTypes.INTEGRATION_ARCHITECTURE'),
    description: t('diagramTypeDescriptions.INTEGRATION_ARCHITECTURE'),
  },
  {
    value: 'SECURITY_ARCHITECTURE',
    label: t('diagramTypes.SECURITY_ARCHITECTURE'),
    description: t('diagramTypeDescriptions.SECURITY_ARCHITECTURE'),
  },
  {
    value: 'CONCEPTUAL',
    label: t('diagramTypes.CONCEPTUAL'),
    description: t('diagramTypeDescriptions.CONCEPTUAL'),
  },
  {
    value: 'OTHER',
    label: t('diagramTypes.OTHER'),
    description: t('diagramTypeDescriptions.OTHER'),
  },
]

interface ArchitectureOption {
  id: string
  name: string
  type?: string | null
  domain?: string | null
}

const LocalSaveDiagramDialog = ({
  open,
  initialName,
  initialMetadata,
  forceSaveAs = false,
  isUpdate = false,
  onCancel,
  onConfirm,
}: LocalSaveDiagramDialogProps) => {
  const t = useTranslations('diagrams')
  const tCommon = useTranslations('common')
  const diagramTypes = useMemo(() => createDiagramTypes(t), [t])
  const { keycloak } = useAuth()
  const { selectedCompanyId } = useCompanyContext()

  const [title, setTitle] = useState(initialName ?? '')
  const [description, setDescription] = useState(initialMetadata?.description ?? '')
  const [diagramType, setDiagramType] = useState<LocalDiagramTypeValue>(
    initialMetadata?.diagramType ?? 'ARCHITECTURE'
  )
  const [selectedArchitecture, setSelectedArchitecture] = useState<ArchitectureOption | null>(
    initialMetadata?.architecture ?? null
  )
  const [titleError, setTitleError] = useState(false)
  const [architectureError, setArchitectureError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const shouldQueryArchitectures = Boolean(open && keycloak?.authenticated && keycloak?.token)
  const { data, loading, error } = useQuery(GET_ARCHITECTURES_FOR_DIAGRAM, {
    skip: !shouldQueryArchitectures,
    fetchPolicy: 'cache-and-network',
    variables: selectedCompanyId
      ? {
          where: {
            company: { some: { id: { eq: selectedCompanyId } } },
          },
        }
      : undefined,
  })

  const architectureOptions = (data?.architectures as ArchitectureOption[]) ?? []

  useEffect(() => {
    if (open) {
      setTitle(initialName ?? '')
      setDescription(initialMetadata?.description ?? '')
      setDiagramType(initialMetadata?.diagramType ?? 'ARCHITECTURE')
      setSelectedArchitecture(initialMetadata?.architecture ?? null)
      setTitleError(false)
      setArchitectureError(false)
      setIsSubmitting(false)
    }
  }, [
    initialMetadata?.architecture,
    initialMetadata?.description,
    initialMetadata?.diagramType,
    initialName,
    open,
  ])

  const selectedDiagramType = useMemo(
    () => diagramTypes.find(option => option.value === diagramType),
    [diagramType, diagramTypes]
  )

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault()

    const trimmedTitle = title.trim()
    const hasTitle = trimmedTitle.length > 0
    const hasArchitecture = Boolean(selectedArchitecture)

    setTitleError(!hasTitle)
    setArchitectureError(!hasArchitecture)

    if (!hasTitle || !hasArchitecture) {
      return
    }

    setIsSubmitting(true)
    const result = await onConfirm({
      name: trimmedTitle,
      metadata: {
        description: description.trim() || undefined,
        diagramType,
        architecture: selectedArchitecture
          ? {
              id: selectedArchitecture.id,
              name: selectedArchitecture.name,
              type: selectedArchitecture.type,
              domain: selectedArchitecture.domain,
            }
          : undefined,
        architectureName: selectedArchitecture?.name,
      },
    })
    setIsSubmitting(false)

    if (!result) {
      setTitleError(true)
    }
  }

  const dialogTitle = useMemo(() => {
    if (forceSaveAs) {
      return t('dialogs.save.title')
    }
    if (isUpdate) {
      return t('dialogs.save.title')
    }
    return t('dialogs.save.title')
  }, [forceSaveAs, isUpdate, t])

  const primaryButtonLabel = isSubmitting
    ? t('dialogs.save.saving')
    : forceSaveAs
      ? t('dialogs.save.saveAsCopy')
      : isUpdate
        ? t('dialogs.save.update')
        : tCommon('save')

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label={t('dialogs.save.titleField')}
              value={title}
              onChange={event => {
                setTitle(event.target.value)
                setTitleError(false)
              }}
              fullWidth
              required
              error={titleError}
              helperText={
                titleError ? t('dialogs.save.titleRequired') : t('dialogs.save.titleHelperText')
              }
            />

            <TextField
              label={t('dialogs.save.descriptionField')}
              value={description}
              onChange={event => setDescription(event.target.value)}
              fullWidth
              multiline
              rows={3}
              helperText={t('dialogs.save.descriptionHelperText')}
            />

            <FormControl fullWidth>
              <InputLabel>{t('dialogs.save.typeField')}</InputLabel>
              <Select
                value={diagramType}
                label={t('dialogs.save.typeField')}
                onChange={event => setDiagramType(event.target.value as LocalDiagramTypeValue)}
              >
                {diagramTypes.map(type => (
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
              options={architectureOptions}
              value={selectedArchitecture}
              onChange={(_, option) => {
                setSelectedArchitecture(option)
                setArchitectureError(!option)
              }}
              disabled={loading || Boolean(error)}
              loading={loading}
              getOptionLabel={option => {
                if (!option || !option.name) {
                  return ''
                }
                return option.type ? `${option.name} (${option.type})` : option.name
              }}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props
                return (
                  <Box key={key} component="li" {...otherProps}>
                    <Box>
                      <Typography variant="body2">{option.name}</Typography>
                      {(option.type || option.domain) && (
                        <Typography variant="caption" color="text.secondary">
                          {[option.type, option.domain].filter(Boolean).join(' • ')}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('dialogs.save.architectureField')}
                  required
                  error={architectureError}
                  helperText={
                    architectureError
                      ? t('dialogs.save.architectureRequired')
                      : error
                        ? t('dialogs.save.loadingArchitecturesError', { message: error.message })
                        : loading
                          ? t('dialogs.save.loadingArchitectures')
                          : t('dialogs.save.architectureHelperText')
                  }
                />
              )}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} disabled={isSubmitting}>
            {tCommon('cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {primaryButtonLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default LocalSaveDiagramDialog
