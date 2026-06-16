'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@apollo/client'
import { z } from 'zod'
import {
  Autocomplete,
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { GET_APPLICATIONS } from '@/graphql/application'
import { GET_Aicomponents } from '@/graphql/aicomponent'
import { GET_ARCHITECTURES } from '@/graphql/architecture'
import { GET_APPLICATION_INTERFACES } from '@/graphql/applicationInterface'
import { GET_BUSINESS_PROCESSES } from '@/graphql/businessProcess'
import { GET_CAPABILITIES } from '@/graphql/capability'
import { GET_DATA_OBJECTS } from '@/graphql/dataObject'
import { GET_GOALS } from '@/graphql/goal'
import { GET_INFRASTRUCTURES } from '@/graphql/infrastructure'
import { GET_PERSONS } from '@/graphql/person'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { useCurrentPerson } from '@/hooks/useCurrentPerson'
import {
  Application,
  ApplicationInterface,
  Architecture,
  BusinessCapability,
  BusinessProcess,
  DataObject,
  Gea_Goal,
  Infrastructure,
  Person,
  TransformationImpactAction,
  TransformationPriority,
  TransformationStatus,
} from '../../gql/generated'
import GenericForm, { FieldConfig, TabConfig } from '../common/GenericForm'
import { GenericFormProps } from '../common/GenericFormProps'
import { IdName, ImpactRelation, TransformationFormValues, TransformationType } from './types'
import {
  createEmptyTransformationFormValues,
  createImpactRelation,
  defaultImpactAction,
  formatPersonName,
  mapImpactEdges,
  normalizeDateValue,
  useImpactActionLabel,
  usePriorityLabel,
  useStatusLabel,
} from './utils'

const createTransformationSchema = (nameRequiredMessage: string) =>
  z.object({
    name: z.string().trim().min(1, nameRequiredMessage),
    description: z.string().optional().or(z.literal('')),
    status: z.nativeEnum(TransformationStatus),
    targetDate: z.date().nullable().optional(),
    startDate: z.date().nullable().optional(),
    completionDate: z.date().nullable().optional(),
    priority: z.union([z.literal(''), z.nativeEnum(TransformationPriority)]),
    rationale: z.string(),
    expectedOutcome: z.string(),
    tags: z.string(),
    ownerId: z.string(),
    sourceArchitectureId: z.string(),
    targetArchitectureIds: z.array(z.string()),
    goalIds: z.array(z.string()),
    impactsCapabilities: z.array(
      z.object({
        id: z.string(),
        action: z.nativeEnum(TransformationImpactAction),
        notes: z.string(),
      })
    ),
    impactsApplications: z.array(
      z.object({
        id: z.string(),
        action: z.nativeEnum(TransformationImpactAction),
        notes: z.string(),
      })
    ),
    impactsAIComponents: z.array(
      z.object({
        id: z.string(),
        action: z.nativeEnum(TransformationImpactAction),
        notes: z.string(),
      })
    ),
    impactsDataObjects: z.array(
      z.object({
        id: z.string(),
        action: z.nativeEnum(TransformationImpactAction),
        notes: z.string(),
      })
    ),
    impactsInterfaces: z.array(
      z.object({
        id: z.string(),
        action: z.nativeEnum(TransformationImpactAction),
        notes: z.string(),
      })
    ),
    impactsInfrastructure: z.array(
      z.object({
        id: z.string(),
        action: z.nativeEnum(TransformationImpactAction),
        notes: z.string(),
      })
    ),
    impactsBusinessProcesses: z.array(
      z.object({
        id: z.string(),
        action: z.nativeEnum(TransformationImpactAction),
        notes: z.string(),
      })
    ),
  })

interface ImpactFieldProps {
  formField: any
  disabled: boolean
  label: string
  notesLabel: string
  actionLabel: string
  options: IdName[]
  actionOptions: TransformationImpactAction[]
  getActionLabel: (action: TransformationImpactAction) => string
}

const getImpactActionAvatarLabel = (action: TransformationImpactAction) => {
  switch (action) {
    case TransformationImpactAction.CREATED:
      return 'C'
    case TransformationImpactAction.MODIFIED:
      return 'M'
    case TransformationImpactAction.REMOVED:
      return 'R'
    default:
      return 'M'
  }
}

const getImpactActionChipColor = (action: TransformationImpactAction) => {
  switch (action) {
    case TransformationImpactAction.CREATED:
      return 'success' as const
    case TransformationImpactAction.MODIFIED:
      return 'info' as const
    case TransformationImpactAction.REMOVED:
      return 'error' as const
    default:
      return 'default' as const
  }
}

function ImpactField({
  formField,
  disabled,
  label,
  notesLabel,
  actionLabel,
  options,
  actionOptions,
  getActionLabel,
}: ImpactFieldProps) {
  const tActions = useTranslations('transformations.actions')
  const relations = Array.isArray(formField.state.value)
    ? (formField.state.value as ImpactRelation[])
    : []
  const selectedOptions = options.filter(option =>
    relations.some(relation => relation.id === option.id)
  )
  const [editingRelationId, setEditingRelationId] = useState<string | null>(null)
  const [editingAction, setEditingAction] =
    useState<TransformationImpactAction>(defaultImpactAction)
  const [editingNotes, setEditingNotes] = useState('')
  const [isNewRelationDialog, setIsNewRelationDialog] = useState(false)

  const closeDialogState = () => {
    setEditingRelationId(null)
    setEditingAction(defaultImpactAction)
    setEditingNotes('')
    setIsNewRelationDialog(false)
  }

  const removeRelation = (id: string) => {
    formField.handleChange(relations.filter(relation => relation.id !== id))
  }

  const openRelationDialog = (relation: ImpactRelation, isNew = false) => {
    setEditingRelationId(relation.id)
    setEditingAction(relation.action || defaultImpactAction)
    setEditingNotes(relation.notes)
    setIsNewRelationDialog(isNew)
  }

  const handleSelectionChange = (selected: IdName[]) => {
    const ids = selected.map(item => item.id)
    const nextRelations = ids.map(
      id => relations.find(relation => relation.id === id) ?? createImpactRelation(id)
    )
    formField.handleChange(nextRelations)

    const newRelation = nextRelations.find(
      relation => !relations.some(existingRelation => existingRelation.id === relation.id)
    )

    if (newRelation) {
      openRelationDialog(newRelation, true)
    }
  }

  const handleRelationChange = (id: string, update: Partial<ImpactRelation>) => {
    formField.handleChange(
      relations.map(relation => (relation.id === id ? { ...relation, ...update } : relation))
    )
  }

  const handleDialogSave = () => {
    if (!editingRelationId) {
      return
    }

    handleRelationChange(editingRelationId, {
      action: editingAction,
      notes: editingNotes,
    })
    closeDialogState()
  }

  const handleDialogClose = () => {
    if (isNewRelationDialog && editingRelationId) {
      removeRelation(editingRelationId)
    }
    closeDialogState()
  }

  const editingOption = editingRelationId
    ? (options.find(option => option.id === editingRelationId) ?? null)
    : null

  return (
    <Stack spacing={1.5}>
      <Autocomplete
        multiple
        options={options}
        value={selectedOptions}
        onChange={(_event, value) => handleSelectionChange(value)}
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disabled={disabled}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const relation = relations.find(item => item.id === option.id)
            const tagProps = getTagProps({ index })

            return (
              <Chip
                {...tagProps}
                key={option.id}
                label={option.name}
                size="small"
                clickable={!disabled}
                color={getImpactActionChipColor(relation?.action || defaultImpactAction)}
                avatar={
                  <Avatar>
                    {getImpactActionAvatarLabel(relation?.action || defaultImpactAction)}
                  </Avatar>
                }
                onClick={event => {
                  event.preventDefault()
                  event.stopPropagation()
                  if (!disabled && relation) {
                    openRelationDialog(relation)
                  }
                }}
                onMouseDown={event => {
                  event.stopPropagation()
                }}
                onDelete={
                  disabled
                    ? undefined
                    : () => {
                        removeRelation(option.id)
                      }
                }
              />
            )
          })
        }
        renderInput={params => <TextField {...params} label={label} />}
      />
      <Dialog open={editingRelationId !== null} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingOption ? `${label}: ${editingOption.name}` : label}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              select
              label={actionLabel}
              value={editingAction}
              onChange={event => setEditingAction(event.target.value as TransformationImpactAction)}
              fullWidth
            >
              {actionOptions.map(action => (
                <MenuItem key={action} value={action}>
                  {getActionLabel(action)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={notesLabel}
              value={editingNotes}
              onChange={event => setEditingNotes(event.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>{tActions('cancel')}</Button>
          <Button onClick={handleDialogSave} variant="contained">
            {tActions('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

const TransformationForm: React.FC<
  GenericFormProps<TransformationType, TransformationFormValues>
> = ({
  data: transformation,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  mode,
  loading = false,
  onEditMode,
}) => {
  const t = useTranslations('transformations')
  const tForm = useTranslations('transformations.form')
  const getStatusLabel = useStatusLabel()
  const getPriorityLabel = usePriorityLabel()
  const getImpactActionLabel = useImpactActionLabel()
  const { currentPerson } = useCurrentPerson()

  const transformationSchema = useMemo(
    () => createTransformationSchema(t('messages.nameRequired')),
    [t]
  )

  const personWhere = useCompanyWhere('companies')
  const companyWhere = useCompanyWhere('company')

  const { data: personData, loading: personLoading } = useQuery(GET_PERSONS, {
    variables: { where: personWhere },
  })
  const { data: architectureData, loading: architectureLoading } = useQuery(GET_ARCHITECTURES, {
    variables: { where: companyWhere },
  })
  const { data: goalData, loading: goalLoading } = useQuery(GET_GOALS, {
    variables: { where: companyWhere },
  })
  const { data: capabilityData, loading: capabilityLoading } = useQuery(GET_CAPABILITIES, {
    variables: { where: companyWhere },
  })
  const { data: applicationData, loading: applicationLoading } = useQuery(GET_APPLICATIONS, {
    variables: { where: companyWhere },
  })
  const { data: aiComponentData, loading: aiComponentLoading } = useQuery(GET_Aicomponents, {
    variables: { where: companyWhere },
  })
  const { data: dataObjectData, loading: dataObjectLoading } = useQuery(GET_DATA_OBJECTS, {
    variables: { where: companyWhere },
  })
  const { data: interfaceData, loading: interfaceLoading } = useQuery(GET_APPLICATION_INTERFACES, {
    variables: { where: companyWhere },
  })
  const { data: infrastructureData, loading: infrastructureLoading } = useQuery(
    GET_INFRASTRUCTURES,
    {
      variables: { where: companyWhere },
    }
  )
  const { data: businessProcessData, loading: businessProcessLoading } = useQuery(
    GET_BUSINESS_PROCESSES,
    {
      variables: { where: companyWhere },
    }
  )

  const defaultValues = useMemo(
    () => createEmptyTransformationFormValues(currentPerson?.id ?? ''),
    [currentPerson?.id]
  )

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    validators: {
      onChange: formState => {
        try {
          transformationSchema.parse(formState.value)
          return undefined
        } catch (error) {
          if (error instanceof z.ZodError) {
            return error.format()
          }
          return { error: t('messages.nameRequired') }
        }
      },
      onSubmit: formState => {
        try {
          transformationSchema.parse(formState.value)
          return undefined
        } catch (error) {
          if (error instanceof z.ZodError) {
            return error.format()
          }
          return { error: t('messages.nameRequired') }
        }
      },
    },
  })

  useEffect(() => {
    if (!isOpen) {
      form.reset(defaultValues)
      return
    }

    if (mode === 'create') {
      form.reset(defaultValues)
    }
  }, [defaultValues, form, isOpen, mode])

  useEffect(() => {
    if (!transformation || !isOpen || mode === 'create') {
      return
    }

    form.reset({
      name: transformation.name ?? '',
      description: transformation.description ?? '',
      status: transformation.status,
      targetDate: normalizeDateValue(transformation.targetDate),
      startDate: normalizeDateValue(transformation.startDate),
      completionDate: normalizeDateValue(transformation.completionDate),
      priority: transformation.priority ?? '',
      rationale: transformation.rationale ?? '',
      expectedOutcome: transformation.expectedOutcome ?? '',
      tags: transformation.tags?.join(', ') ?? '',
      ownerId: transformation.owners?.[0]?.id ?? currentPerson?.id ?? '',
      sourceArchitectureId: transformation.sourceArchitecture?.[0]?.id ?? '',
      targetArchitectureIds: transformation.targetArchitectures?.map(item => item.id) ?? [],
      goalIds: transformation.goals?.map(item => item.id) ?? [],
      impactsCapabilities: mapImpactEdges(transformation.impactsCapabilitiesConnection?.edges),
      impactsApplications: mapImpactEdges(transformation.impactsApplicationsConnection?.edges),
      impactsAIComponents: mapImpactEdges(transformation.impactsAIComponentsConnection?.edges),
      impactsDataObjects: mapImpactEdges(transformation.impactsDataObjectsConnection?.edges),
      impactsInterfaces: mapImpactEdges(transformation.impactsInterfacesConnection?.edges),
      impactsInfrastructure: mapImpactEdges(transformation.impactsInfrastructureConnection?.edges),
      impactsBusinessProcesses: mapImpactEdges(
        transformation.impactsBusinessProcessesConnection?.edges
      ),
    })
  }, [currentPerson?.id, form, isOpen, mode, transformation])

  const people = (personData?.people as Person[] | undefined) ?? []
  const architectures = (architectureData?.architectures as Architecture[] | undefined) ?? []
  const goals = (goalData?.geaGoals as Gea_Goal[] | undefined) ?? []
  const capabilities =
    (capabilityData?.businessCapabilities as BusinessCapability[] | undefined) ?? []
  const applications = (applicationData?.applications as Application[] | undefined) ?? []
  const aiComponents =
    (aiComponentData as { aiComponents?: IdName[] } | undefined)?.aiComponents ?? []
  const dataObjects = (dataObjectData?.dataObjects as DataObject[] | undefined) ?? []
  const interfaces =
    (interfaceData?.applicationInterfaces as ApplicationInterface[] | undefined) ?? []
  const infrastructure = (infrastructureData?.infrastructures as Infrastructure[] | undefined) ?? []
  const businessProcesses =
    (businessProcessData?.businessProcesses as BusinessProcess[] | undefined) ?? []

  const impactOptions = {
    capabilities: capabilities.map(item => ({ id: item.id, name: item.name })),
    applications: applications.map(item => ({ id: item.id, name: item.name })),
    aiComponents: aiComponents.map(item => ({ id: item.id, name: item.name })),
    dataObjects: dataObjects.map(item => ({ id: item.id, name: item.name })),
    interfaces: interfaces.map(item => ({ id: item.id, name: item.name })),
    infrastructure: infrastructure.map(item => ({ id: item.id, name: item.name })),
    businessProcesses: businessProcesses.map(item => ({ id: item.id, name: item.name })),
  }

  const statusOptions = Object.values(TransformationStatus).map(status => ({
    value: status,
    label: getStatusLabel(status),
  }))
  const priorityOptions = [
    { value: '', label: tForm('noPriority') },
    ...Object.values(TransformationPriority).map(priority => ({
      value: priority,
      label: getPriorityLabel(priority),
    })),
  ]
  const impactActionOptions = Object.values(TransformationImpactAction)

  const tabs: TabConfig[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'dates', label: t('tabs.dates') },
    { id: 'outcome', label: t('tabs.outcome') },
    { id: 'relationships', label: t('tabs.relationships') },
    { id: 'impacts', label: t('tabs.impacts') },
  ]

  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: tForm('name'),
      type: 'text',
      required: true,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'status',
      label: tForm('status'),
      type: 'select',
      options: statusOptions,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'description',
      label: tForm('description'),
      type: 'textarea',
      rows: 4,
      size: 12,
      tabId: 'general',
    },
    {
      name: 'priority',
      label: tForm('priority'),
      type: 'select',
      options: priorityOptions,
      size: { xs: 12, md: 6 },
      tabId: 'general',
    },
    {
      name: 'ownerId',
      label: tForm('owner'),
      type: 'autocomplete',
      options: people.map(person => ({
        value: person.id,
        label: formatPersonName(person),
      })),
      loadingOptions: personLoading,
      size: { xs: 12, md: 6 },
      tabId: 'general',
      getOptionLabel: option => {
        if (typeof option === 'string') {
          const match = people.find(person => person.id === option)
          return match ? formatPersonName(match) : option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option, value) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
    },
    {
      name: 'targetDate',
      label: tForm('targetDate'),
      type: 'date',
      size: { xs: 12, md: 4 },
      tabId: 'dates',
    },
    {
      name: 'startDate',
      label: tForm('startDate'),
      type: 'date',
      size: { xs: 12, md: 4 },
      tabId: 'dates',
    },
    {
      name: 'completionDate',
      label: tForm('completionDate'),
      type: 'date',
      size: { xs: 12, md: 4 },
      tabId: 'dates',
    },
    {
      name: 'rationale',
      label: tForm('rationale'),
      type: 'textarea',
      rows: 3,
      size: 12,
      tabId: 'outcome',
    },
    {
      name: 'expectedOutcome',
      label: tForm('expectedOutcome'),
      type: 'textarea',
      rows: 3,
      size: 12,
      tabId: 'outcome',
    },
    {
      name: 'tags',
      label: tForm('tags'),
      type: 'text',
      helperText: tForm('tagsHint'),
      size: 12,
      tabId: 'general',
    },
    {
      name: 'sourceArchitectureId',
      label: tForm('sourceArchitecture'),
      type: 'autocomplete',
      options: architectures.map(architecture => ({
        value: architecture.id,
        label: architecture.name,
      })),
      loadingOptions: architectureLoading,
      size: 12,
      tabId: 'relationships',
      getOptionLabel: option => {
        if (typeof option === 'string') {
          return architectures.find(architecture => architecture.id === option)?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option, value) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
    },
    {
      name: 'targetArchitectureIds',
      label: tForm('targetArchitectures'),
      type: 'autocomplete',
      multiple: true,
      options: architectures.map(architecture => ({
        value: architecture.id,
        label: architecture.name,
      })),
      loadingOptions: architectureLoading,
      size: 12,
      tabId: 'relationships',
      getOptionLabel: option => {
        if (typeof option === 'string') {
          return architectures.find(architecture => architecture.id === option)?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option, value) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
    },
    {
      name: 'goalIds',
      label: tForm('goals'),
      type: 'autocomplete',
      multiple: true,
      options: goals.map(goal => ({ value: goal.id, label: goal.name })),
      loadingOptions: goalLoading,
      size: 12,
      tabId: 'relationships',
      getOptionLabel: option => {
        if (typeof option === 'string') {
          return goals.find(goal => goal.id === option)?.name || option
        }
        return option?.label || ''
      },
      isOptionEqualToValue: (option, value) => {
        if (typeof value === 'string') {
          return option.value === value
        }
        return option.value === value?.value || option.value === value
      },
    },
    {
      name: 'impactsCapabilities',
      label: tForm('impactsCapabilities'),
      type: 'custom',
      size: 12,
      tabId: 'impacts',
      customRender: (formField, disabled) => (
        <ImpactField
          formField={formField}
          disabled={disabled || capabilityLoading}
          label={tForm('impactsCapabilities')}
          notesLabel={tForm('impactNotes')}
          actionLabel={tForm('impactAction')}
          options={impactOptions.capabilities}
          actionOptions={impactActionOptions}
          getActionLabel={getImpactActionLabel}
        />
      ),
    },
    {
      name: 'impactsApplications',
      label: tForm('impactsApplications'),
      type: 'custom',
      size: 12,
      tabId: 'impacts',
      customRender: (formField, disabled) => (
        <ImpactField
          formField={formField}
          disabled={disabled || applicationLoading}
          label={tForm('impactsApplications')}
          notesLabel={tForm('impactNotes')}
          actionLabel={tForm('impactAction')}
          options={impactOptions.applications}
          actionOptions={impactActionOptions}
          getActionLabel={getImpactActionLabel}
        />
      ),
    },
    {
      name: 'impactsAIComponents',
      label: tForm('impactsAIComponents'),
      type: 'custom',
      size: 12,
      tabId: 'impacts',
      customRender: (formField, disabled) => (
        <ImpactField
          formField={formField}
          disabled={disabled || aiComponentLoading}
          label={tForm('impactsAIComponents')}
          notesLabel={tForm('impactNotes')}
          actionLabel={tForm('impactAction')}
          options={impactOptions.aiComponents}
          actionOptions={impactActionOptions}
          getActionLabel={getImpactActionLabel}
        />
      ),
    },
    {
      name: 'impactsDataObjects',
      label: tForm('impactsDataObjects'),
      type: 'custom',
      size: 12,
      tabId: 'impacts',
      customRender: (formField, disabled) => (
        <ImpactField
          formField={formField}
          disabled={disabled || dataObjectLoading}
          label={tForm('impactsDataObjects')}
          notesLabel={tForm('impactNotes')}
          actionLabel={tForm('impactAction')}
          options={impactOptions.dataObjects}
          actionOptions={impactActionOptions}
          getActionLabel={getImpactActionLabel}
        />
      ),
    },
    {
      name: 'impactsInterfaces',
      label: tForm('impactsInterfaces'),
      type: 'custom',
      size: 12,
      tabId: 'impacts',
      customRender: (formField, disabled) => (
        <ImpactField
          formField={formField}
          disabled={disabled || interfaceLoading}
          label={tForm('impactsInterfaces')}
          notesLabel={tForm('impactNotes')}
          actionLabel={tForm('impactAction')}
          options={impactOptions.interfaces}
          actionOptions={impactActionOptions}
          getActionLabel={getImpactActionLabel}
        />
      ),
    },
    {
      name: 'impactsInfrastructure',
      label: tForm('impactsInfrastructure'),
      type: 'custom',
      size: 12,
      tabId: 'impacts',
      customRender: (formField, disabled) => (
        <ImpactField
          formField={formField}
          disabled={disabled || infrastructureLoading}
          label={tForm('impactsInfrastructure')}
          notesLabel={tForm('impactNotes')}
          actionLabel={tForm('impactAction')}
          options={impactOptions.infrastructure}
          actionOptions={impactActionOptions}
          getActionLabel={getImpactActionLabel}
        />
      ),
    },
    {
      name: 'impactsBusinessProcesses',
      label: tForm('impactsBusinessProcesses'),
      type: 'custom',
      size: 12,
      tabId: 'impacts',
      customRender: (formField, disabled) => (
        <ImpactField
          formField={formField}
          disabled={disabled || businessProcessLoading}
          label={tForm('impactsBusinessProcesses')}
          notesLabel={tForm('impactNotes')}
          actionLabel={tForm('impactAction')}
          options={impactOptions.businessProcesses}
          actionOptions={impactActionOptions}
          getActionLabel={getImpactActionLabel}
        />
      ),
    },
  ]

  return (
    <GenericForm
      title={
        mode === 'create' ? t('createTitle') : mode === 'edit' ? t('editTitle') : t('viewTitle')
      }
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isLoading={loading}
      mode={mode}
      fields={fields}
      tabs={tabs}
      form={form}
      formWidth="xl"
      enableDelete={mode === 'edit' && !!transformation && !!onDelete}
      onDelete={transformation?.id && onDelete ? () => onDelete(transformation.id) : undefined}
      onEditMode={onEditMode}
      entityId={transformation?.id}
      entityName={t('entityName')}
      metadata={
        transformation
          ? {
              createdAt: transformation.createdAt,
              updatedAt: transformation.updatedAt,
            }
          : undefined
      }
    />
  )
}

export default TransformationForm
