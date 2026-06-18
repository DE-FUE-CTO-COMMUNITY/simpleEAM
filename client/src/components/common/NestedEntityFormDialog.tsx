'use client'

import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_APPLICATION, GET_APPLICATIONS, UPDATE_APPLICATION } from '@/graphql/application'
import {
  GET_APPLICATION_INTERFACE,
  UPDATE_APPLICATION_INTERFACE,
} from '@/graphql/applicationInterface'
import { GET_ARCHITECTURES, UPDATE_ARCHITECTURE } from '@/graphql/architecture'
import {
  GET_ARCHITECTURE_PRINCIPLES,
  UPDATE_ARCHITECTURE_PRINCIPLE,
} from '@/graphql/architecturePrinciple'
import { GET_CAPABILITIES, GET_CAPABILITY, UPDATE_CAPABILITY } from '@/graphql/capability'
import { GET_DATA_OBJECT, UPDATE_DATA_OBJECT } from '@/graphql/dataObject'
import { GET_INFRASTRUCTURE, UPDATE_INFRASTRUCTURE } from '@/graphql/infrastructure'
import { useCompanyWhere } from '@/hooks/useCompanyWhere'
import { buildDataObjectRelationshipConnectInput } from '@/utils/dataObjectRelationshipUtils'
import ApplicationForm, { ApplicationFormValues } from '../applications/ApplicationForm'
import ArchitecturePrincipleForm, {
  ArchitecturePrincipleFormValues,
} from '../architecture-principles/ArchitecturePrincipleForm'
import ArchitectureForm, { ArchitectureFormValues } from '../architectures/ArchitectureForm'
import CapabilityForm, { CapabilityFormValues } from '../capabilities/CapabilityForm'
import DataObjectForm, { DataObjectFormValues } from '../dataobjects/DataObjectForm'
import InfrastructureForm, { InfrastructureFormValues } from '../infrastructure/InfrastructureForm'
import ApplicationInterfaceForm, {
  ApplicationInterfaceFormValues,
} from '../interfaces/ApplicationInterfaceForm'

interface NestedEntityFormDialogProps {
  entityId: string | null
  entityType: string | null
  isOpen: boolean
  mode: 'view' | 'edit'
  onClose: () => void
}

const disconnectAll = [{ where: {} }]

const connectMany = (ids: string[]) =>
  ids.map(id => ({
    where: {
      node: {
        id: { eq: id },
      },
    },
  }))

const connectSingle = (id: string) => [
  {
    where: {
      node: {
        id: { eq: id },
      },
    },
  },
]

const relationValue = (ids?: string[]) =>
  ids && ids.length > 0
    ? {
        disconnect: disconnectAll,
        connect: connectMany(ids),
      }
    : {
        disconnect: disconnectAll,
      }

const relationArrayValue = (ids?: string[]) => [relationValue(ids)]

const singleRelationValue = (id?: string | null) =>
  id
    ? {
        disconnect: disconnectAll,
        connect: connectSingle(id),
      }
    : {
        disconnect: disconnectAll,
      }

const singleRelationArrayValue = (id?: string | null) => [singleRelationValue(id)]

export default function NestedEntityFormDialog({
  entityId,
  entityType,
  isOpen,
  mode,
  onClose,
}: NestedEntityFormDialogProps) {
  const [currentMode, setCurrentMode] = useState<'view' | 'edit'>(mode)

  useEffect(() => {
    setCurrentMode(mode)
  }, [mode, entityId, entityType, isOpen])

  if (!isOpen || !entityId || !entityType) {
    return null
  }

  const handleEditMode = () => {
    setCurrentMode('edit')
  }

  const handleSaveSuccess = () => {}

  switch (entityType) {
    case 'applications':
      return (
        <NestedApplicationForm
          entityId={entityId}
          isOpen={isOpen}
          mode={currentMode}
          onClose={onClose}
          onEditMode={handleEditMode}
          onSaved={handleSaveSuccess}
        />
      )
    case 'capabilities':
      return (
        <NestedCapabilityForm
          entityId={entityId}
          isOpen={isOpen}
          mode={currentMode}
          onClose={onClose}
          onEditMode={handleEditMode}
          onSaved={handleSaveSuccess}
        />
      )
    case 'dataObjects':
      return (
        <NestedDataObjectForm
          entityId={entityId}
          isOpen={isOpen}
          mode={currentMode}
          onClose={onClose}
          onEditMode={handleEditMode}
          onSaved={handleSaveSuccess}
        />
      )
    case 'applicationInterfaces':
      return (
        <NestedApplicationInterfaceForm
          entityId={entityId}
          isOpen={isOpen}
          mode={currentMode}
          onClose={onClose}
          onEditMode={handleEditMode}
          onSaved={handleSaveSuccess}
        />
      )
    case 'architectures':
      return (
        <NestedArchitectureForm
          entityId={entityId}
          isOpen={isOpen}
          mode={currentMode}
          onClose={onClose}
          onEditMode={handleEditMode}
          onSaved={handleSaveSuccess}
        />
      )
    case 'architecturePrinciples':
      return (
        <NestedArchitecturePrincipleForm
          entityId={entityId}
          isOpen={isOpen}
          mode={currentMode}
          onClose={onClose}
          onEditMode={handleEditMode}
          onSaved={handleSaveSuccess}
        />
      )
    case 'infrastructures':
      return (
        <NestedInfrastructureForm
          entityId={entityId}
          isOpen={isOpen}
          mode={currentMode}
          onClose={onClose}
          onEditMode={handleEditMode}
          onSaved={handleSaveSuccess}
        />
      )
    default:
      return null
  }
}

interface NestedFormProps {
  entityId: string
  isOpen: boolean
  mode: 'view' | 'edit'
  onClose: () => void
  onEditMode: () => void
  onSaved: () => void
}

function NestedApplicationForm({
  entityId,
  isOpen,
  mode,
  onClose,
  onEditMode,
  onSaved,
}: NestedFormProps) {
  const companyWhere = useCompanyWhere('company')
  const { data, loading, error, refetch } = useQuery(GET_APPLICATION, {
    variables: { id: entityId },
    skip: !isOpen,
  })
  const {
    data: allApplicationsData,
    loading: allApplicationsLoading,
    error: allApplicationsError,
  } = useQuery(GET_APPLICATIONS, {
    variables: { where: companyWhere },
    skip: !isOpen,
  })
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const handleSubmit = async (formData: ApplicationFormValues) => {
    const {
      ownerId,
      supportsCapabilityIds,
      supportsBusinessProcessIds,
      usesDataObjectIds,
      sourceOfInterfaceIds,
      targetOfInterfaceIds,
      implementsPrincipleIds,
      parentIds,
      componentIds,
      predecessorIds,
      successorIds,
      hostedOnIds,
      softwareVersionIds,
      providedByIds,
      supportedByIds,
      maintainedByIds,
      ...applicationData
    } = formData

    const input: Record<string, unknown> = {
      name: { set: applicationData.name },
      description: { set: applicationData.description },
      sovereigntyAchStrategicAutonomy: {
        set: applicationData.sovereigntyAchStrategicAutonomy ?? null,
      },
      sovereigntyAchResilience: { set: applicationData.sovereigntyAchResilience ?? null },
      sovereigntyAchSecurity: { set: applicationData.sovereigntyAchSecurity ?? null },
      sovereigntyAchControl: { set: applicationData.sovereigntyAchControl ?? null },
      sovereigntyAchStrategicAutonomyEvidence: {
        set: applicationData.sovereigntyAchStrategicAutonomyEvidence ?? null,
      },
      lastSovereigntyAssessmentAt: { set: applicationData.lastSovereigntyAssessmentAt ?? null },
      status: { set: applicationData.status },
      criticality: { set: applicationData.criticality },
      costs: { set: applicationData.costs },
      vendor: { set: applicationData.vendor },
      version: { set: applicationData.version },
      technologyStack: { set: applicationData.technologyStack },
      planningDate: { set: applicationData.planningDate },
      introductionDate: { set: applicationData.introductionDate },
      endOfUseDate: { set: applicationData.endOfUseDate },
      endOfLifeDate: { set: applicationData.endOfLifeDate },
      timeCategory: { set: applicationData.timeCategory },
      sevenRStrategy: { set: applicationData.sevenRStrategy },
      owners: singleRelationValue(ownerId),
      supportsCapabilities: relationValue(supportsCapabilityIds),
      supportsBusinessProcesses: relationValue(supportsBusinessProcessIds),
      usesDataObjects: relationValue(usesDataObjectIds),
      sourceOfInterfaces: relationValue(sourceOfInterfaceIds),
      targetOfInterfaces: relationValue(targetOfInterfaceIds),
      parents: relationValue(parentIds),
      components: relationValue(componentIds),
      predecessors: relationValue(predecessorIds),
      successors: relationValue(successorIds),
      implementsPrinciples: relationValue(implementsPrincipleIds),
      hostedOn: relationValue(hostedOnIds),
      softwareVersions: relationValue(softwareVersionIds),
      providedBy: relationValue(providedByIds),
      supportedBy: relationValue(supportedByIds),
      maintainedBy: relationValue(maintainedByIds),
    }

    await updateApplication({
      variables: { id: entityId, input },
    })

    await refetch()
    onSaved()
  }

  if (
    loading ||
    allApplicationsLoading ||
    error ||
    allApplicationsError ||
    !data?.applications?.[0]
  ) {
    return null
  }

  return (
    <ApplicationForm
      data={data.applications[0]}
      availableApplications={allApplicationsData?.applications || []}
      isNested={true}
      isOpen={isOpen}
      loading={false}
      mode={mode}
      onClose={onClose}
      onEditMode={onEditMode}
      onSubmit={handleSubmit}
    />
  )
}

function NestedCapabilityForm({
  entityId,
  isOpen,
  mode,
  onClose,
  onEditMode,
  onSaved,
}: NestedFormProps) {
  const companyWhere = useCompanyWhere('company')
  const { data, loading, error, refetch } = useQuery(GET_CAPABILITY, {
    variables: { id: entityId },
    skip: !isOpen,
  })
  const {
    data: allCapabilitiesData,
    loading: allCapabilitiesLoading,
    error: allCapabilitiesError,
  } = useQuery(GET_CAPABILITIES, {
    variables: { where: companyWhere },
    skip: !isOpen,
  })
  const [updateCapability] = useMutation(UPDATE_CAPABILITY)

  const handleSubmit = async (formData: CapabilityFormValues) => {
    const {
      parentId,
      ownerId,
      children,
      supportedByApplications,
      partOfArchitectures,
      ...capabilityData
    } = formData

    const input: Record<string, unknown> = {
      name: { set: capabilityData.name },
      description: { set: capabilityData.description },
      maturityLevel: { set: capabilityData.maturityLevel },
      sovereigntyReqStrategicAutonomy: {
        set: capabilityData.sovereigntyReqStrategicAutonomy ?? null,
      },
      sovereigntyReqResilience: { set: capabilityData.sovereigntyReqResilience ?? null },
      sovereigntyReqSecurity: { set: capabilityData.sovereigntyReqSecurity ?? null },
      sovereigntyReqControl: { set: capabilityData.sovereigntyReqControl ?? null },
      sovereigntyReqWeight: { set: capabilityData.sovereigntyReqWeight ?? null },
      sovereigntyReqStrategicAutonomyRationale: {
        set: capabilityData.sovereigntyReqStrategicAutonomyRationale ?? null,
      },
      businessValue: { set: capabilityData.businessValue },
      status: { set: capabilityData.status },
      sequenceNumber: { set: capabilityData.sequenceNumber },
      tags: { set: capabilityData.tags },
      introductionDate: { set: capabilityData.introductionDate },
      endDate: { set: capabilityData.endDate },
      owners: singleRelationValue(ownerId),
      parents: singleRelationValue(parentId),
      children: relationValue(children),
      supportedByApplications: relationValue(supportedByApplications),
      partOfArchitectures: relationValue(partOfArchitectures),
    }

    if (capabilityData.type) {
      input.type = { set: capabilityData.type }
    }

    await updateCapability({
      variables: { id: entityId, input },
    })

    await refetch()
    onSaved()
  }

  if (
    loading ||
    allCapabilitiesLoading ||
    error ||
    allCapabilitiesError ||
    !data?.businessCapabilities?.[0]
  ) {
    return null
  }

  return (
    <CapabilityForm
      data={data.businessCapabilities[0]}
      availableCapabilities={allCapabilitiesData?.businessCapabilities || []}
      isNested={true}
      isOpen={isOpen}
      loading={false}
      mode={mode}
      onClose={onClose}
      onEditMode={onEditMode}
      onSubmit={handleSubmit}
    />
  )
}

function NestedDataObjectForm({
  entityId,
  isOpen,
  mode,
  onClose,
  onEditMode,
  onSaved,
}: NestedFormProps) {
  const companyWhere = useCompanyWhere('company')
  const { data, loading, error, refetch } = useQuery(GET_DATA_OBJECT, {
    variables: { where: { id: { eq: entityId }, ...companyWhere } },
    skip: !isOpen,
  })
  const [updateDataObject] = useMutation(UPDATE_DATA_OBJECT)

  const handleSubmit = async (formData: DataObjectFormValues) => {
    const input: Record<string, unknown> = {
      name: { set: formData.name },
      description: { set: formData.description },
      sovereigntyReqStrategicAutonomy: { set: formData.sovereigntyReqStrategicAutonomy ?? null },
      sovereigntyReqResilience: { set: formData.sovereigntyReqResilience ?? null },
      sovereigntyReqSecurity: { set: formData.sovereigntyReqSecurity ?? null },
      sovereigntyReqControl: { set: formData.sovereigntyReqControl ?? null },
      sovereigntyReqWeight: { set: formData.sovereigntyReqWeight ?? null },
      sovereigntyReqStrategicAutonomyRationale: {
        set: formData.sovereigntyReqStrategicAutonomyRationale ?? null,
      },
      classification: { set: formData.classification },
      format: { set: formData.format },
      planningDate: { set: formData.planningDate },
      introductionDate: { set: formData.introductionDate },
      endOfUseDate: { set: formData.endOfUseDate },
      endOfLifeDate: { set: formData.endOfLifeDate },
      dataSources: relationArrayValue(formData.dataSources),
      owners: singleRelationArrayValue(formData.ownerId),
      depictedInDiagrams: relationArrayValue(formData.depictedInDiagrams),
      usedByApplications: relationArrayValue(formData.usedByApplications),
      relatedToCapabilities: relationArrayValue(formData.relatedToCapabilities),
      transferredInInterfaces: relationArrayValue(formData.transferredInInterfaces),
      relatedDataObjects: [
        formData.relatedDataObjects?.length
          ? {
              disconnect: disconnectAll,
              connect: buildDataObjectRelationshipConnectInput(formData.relatedDataObjects),
            }
          : {
              disconnect: disconnectAll,
            },
      ],
      partOfArchitectures: relationArrayValue(formData.partOfArchitectures),
    }

    await updateDataObject({
      variables: { id: entityId, input },
    })

    await refetch()
    onSaved()
  }

  if (loading || error || !data?.dataObjects?.[0]) {
    return null
  }

  return (
    <DataObjectForm
      data={data.dataObjects[0]}
      isNested={true}
      isOpen={isOpen}
      loading={false}
      mode={mode}
      onClose={onClose}
      onEditMode={onEditMode}
      onSubmit={handleSubmit}
    />
  )
}

function NestedApplicationInterfaceForm({
  entityId,
  isOpen,
  mode,
  onClose,
  onEditMode,
  onSaved,
}: NestedFormProps) {
  const { data, loading, error, refetch } = useQuery(GET_APPLICATION_INTERFACE, {
    variables: { id: entityId },
    skip: !isOpen,
  })
  const [updateApplicationInterface] = useMutation(UPDATE_APPLICATION_INTERFACE)

  const handleSubmit = async (formData: ApplicationInterfaceFormValues) => {
    const input: Record<string, unknown> = {
      name: { set: formData.name },
      description: { set: formData.description },
      interfaceType: { set: formData.interfaceType },
      protocol: { set: formData.protocol },
      version: { set: formData.version },
      status: { set: formData.status },
      planningDate: { set: formData.planningDate },
      introductionDate: { set: formData.introductionDate },
      endOfUseDate: { set: formData.endOfUseDate },
      endOfLifeDate: { set: formData.endOfLifeDate },
      owners: formData.owners
        ? {
            disconnect: disconnectAll,
            connect: {
              where: {
                node: { id: { eq: formData.owners } },
              },
            },
          }
        : { disconnect: disconnectAll },
      sourceApplications: relationValue(formData.sourceApplications),
      targetApplications: relationValue(formData.targetApplications),
      dataObjects: relationValue(formData.dataObjects),
      predecessors: relationValue(formData.predecessorIds),
      successors: relationValue(formData.successorIds),
      partOfArchitectures: relationValue(formData.partOfArchitectures),
      depictedInDiagrams: relationValue(formData.depictedInDiagrams),
    }

    await updateApplicationInterface({
      variables: { id: entityId, input },
    })

    await refetch()
    onSaved()
  }

  if (loading || error || !data?.applicationInterfaces?.[0]) {
    return null
  }

  return (
    <ApplicationInterfaceForm
      data={data.applicationInterfaces[0]}
      isNested={true}
      isOpen={isOpen}
      loading={false}
      mode={mode}
      onClose={onClose}
      onEditMode={onEditMode}
      onSubmit={handleSubmit}
    />
  )
}

function NestedArchitectureForm({
  entityId,
  isOpen,
  mode,
  onClose,
  onEditMode,
  onSaved,
}: NestedFormProps) {
  const companyWhere = useCompanyWhere('company')
  const { data, loading, error, refetch } = useQuery(GET_ARCHITECTURES, {
    variables: { where: { id: { eq: entityId }, ...companyWhere } },
    skip: !isOpen,
  })
  const {
    data: allArchitecturesData,
    loading: allArchitecturesLoading,
    error: allArchitecturesError,
  } = useQuery(GET_ARCHITECTURES, {
    variables: { where: companyWhere },
    skip: !isOpen,
  })
  const [updateArchitecture] = useMutation(UPDATE_ARCHITECTURE)

  const handleSubmit = async (formData: ArchitectureFormValues) => {
    const {
      ownerId,
      containsApplicationIds,
      containsCapabilityIds,
      containsDataObjectIds,
      containsInterfaceIds,
      containsInfrastructureIds,
      diagramIds,
      parentArchitectureId,
      appliedPrincipleIds,
      ...architectureData
    } = formData

    const timestamp =
      architectureData.timestamp instanceof Date
        ? architectureData.timestamp
        : new Date(architectureData.timestamp)

    const input: Record<string, unknown> = {
      name: { set: architectureData.name },
      description: { set: architectureData.description },
      domain: { set: architectureData.domain },
      type: { set: architectureData.type },
      tags: { set: Array.isArray(architectureData.tags) ? architectureData.tags : [] },
      timestamp: { set: timestamp.toISOString() },
      owners: singleRelationValue(ownerId),
      containsApplications: relationValue(containsApplicationIds),
      containsCapabilities: relationValue(containsCapabilityIds),
      containsDataObjects: relationValue(containsDataObjectIds),
      containsInterfaces: relationValue(containsInterfaceIds),
      containsInfrastructure: relationValue(containsInfrastructureIds),
      diagrams: relationValue(diagramIds),
      parentArchitecture: parentArchitectureId
        ? {
            disconnect: disconnectAll,
            connect: {
              where: {
                node: {
                  id: { eq: parentArchitectureId },
                },
              },
            },
          }
        : { disconnect: disconnectAll },
      appliedPrinciples: relationValue(appliedPrincipleIds),
    }

    await updateArchitecture({
      variables: { id: entityId, input },
    })

    await refetch()
    onSaved()
  }

  if (
    loading ||
    allArchitecturesLoading ||
    error ||
    allArchitecturesError ||
    !data?.architectures?.[0]
  ) {
    return null
  }

  return (
    <ArchitectureForm
      availableArchitectures={allArchitecturesData?.architectures || []}
      data={data.architectures[0]}
      isNested={true}
      isOpen={isOpen}
      loading={false}
      mode={mode}
      onClose={onClose}
      onEditMode={onEditMode}
      onSubmit={handleSubmit}
    />
  )
}

function NestedArchitecturePrincipleForm({
  entityId,
  isOpen,
  mode,
  onClose,
  onEditMode,
  onSaved,
}: NestedFormProps) {
  const companyWhere = useCompanyWhere('company')
  const { data, loading, error, refetch } = useQuery(GET_ARCHITECTURE_PRINCIPLES, {
    variables: { where: { id: { eq: entityId }, ...companyWhere } },
    skip: !isOpen,
  })
  const [updateArchitecturePrinciple] = useMutation(UPDATE_ARCHITECTURE_PRINCIPLE)

  const handleSubmit = async (formData: ArchitecturePrincipleFormValues) => {
    const input: Record<string, unknown> = {
      name: { set: formData.name },
      description: { set: formData.description },
      category: { set: formData.category },
      priority: { set: formData.priority },
      rationale: { set: formData.rationale || '' },
      implications: { set: formData.implications || '' },
      tags: { set: formData.tags || [] },
      isActive: { set: formData.isActive },
      owners: singleRelationValue(formData.ownerId),
      appliedInArchitectures: relationValue(formData.appliedInArchitectureIds),
      implementedByApplications: relationValue(formData.implementedByApplicationIds),
    }

    await updateArchitecturePrinciple({
      variables: { id: entityId, input },
    })

    await refetch()
    onSaved()
  }

  if (loading || error || !data?.architecturePrinciples?.[0]) {
    return null
  }

  return (
    <ArchitecturePrincipleForm
      data={data.architecturePrinciples[0]}
      isNested={true}
      isOpen={isOpen}
      loading={false}
      mode={mode}
      onClose={onClose}
      onEditMode={onEditMode}
      onSubmit={handleSubmit}
    />
  )
}

function NestedInfrastructureForm({
  entityId,
  isOpen,
  mode,
  onClose,
  onEditMode,
  onSaved,
}: NestedFormProps) {
  const { data, loading, error, refetch } = useQuery(GET_INFRASTRUCTURE, {
    variables: { id: entityId },
    skip: !isOpen,
  })
  const [updateInfrastructure] = useMutation(UPDATE_INFRASTRUCTURE)

  const handleSubmit = async (formData: InfrastructureFormValues) => {
    const parentId = Array.isArray(formData.parentInfrastructure)
      ? formData.parentInfrastructure[0]
      : formData.parentInfrastructure

    const input: Record<string, unknown> = {
      name: { set: formData.name },
      description: { set: formData.description || '' },
      sovereigntyAchStrategicAutonomy: { set: formData.sovereigntyAchStrategicAutonomy ?? null },
      sovereigntyAchResilience: { set: formData.sovereigntyAchResilience ?? null },
      sovereigntyAchSecurity: { set: formData.sovereigntyAchSecurity ?? null },
      sovereigntyAchControl: { set: formData.sovereigntyAchControl ?? null },
      sovereigntyAchStrategicAutonomyEvidence: {
        set: formData.sovereigntyAchStrategicAutonomyEvidence ?? null,
      },
      lastSovereigntyAssessmentAt: { set: formData.lastSovereigntyAssessmentAt ?? new Date() },
      infrastructureType: { set: formData.infrastructureType },
      status: { set: formData.status },
      vendor: { set: formData.vendor || '' },
      version: { set: formData.version || '' },
      capacity: { set: formData.capacity || '' },
      location: { set: formData.location || '' },
      ipAddress: { set: formData.ipAddress || '' },
      operatingSystem: { set: formData.operatingSystem || '' },
      specifications: { set: formData.specifications || '' },
      maintenanceWindow: { set: formData.maintenanceWindow || '' },
      costs: { set: formData.costs ?? null },
      planningDate: { set: formData.planningDate || null },
      introductionDate: { set: formData.introductionDate || null },
      endOfUseDate: { set: formData.endOfUseDate || null },
      endOfLifeDate: { set: formData.endOfLifeDate || null },
      owners: singleRelationArrayValue(formData.ownerId),
      parentInfrastructure: singleRelationArrayValue(parentId),
      childInfrastructures: relationArrayValue(formData.childInfrastructures),
      hostsApplications: relationArrayValue(formData.hostsApplications),
      softwareVersions: relationArrayValue(formData.softwareVersionIds),
      hardwareVersions: relationArrayValue(formData.hardwareVersionIds),
      providedBy: relationArrayValue(formData.providedBy),
      hostedBy: relationArrayValue(formData.hostedBy),
      maintainedBy: relationArrayValue(formData.maintainedBy),
      partOfArchitectures: relationArrayValue(formData.partOfArchitectures),
      depictedInDiagrams: relationArrayValue(formData.depictedInDiagrams),
    }

    await updateInfrastructure({
      variables: { id: entityId, input },
    })

    await refetch()
    onSaved()
  }

  if (loading || error || !data?.infrastructures?.[0]) {
    return null
  }

  return (
    <InfrastructureForm
      data={data.infrastructures[0]}
      isNested={true}
      isOpen={isOpen}
      loading={false}
      mode={mode}
      onClose={onClose}
      onEditMode={onEditMode}
      onSubmit={handleSubmit}
    />
  )
}
