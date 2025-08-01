'use client'

import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ExcalidrawElement } from '../diagrams/types/relationshipTypes'

// Import der Form-Komponenten (alle einheitlich als Forms)
import ApplicationForm, { ApplicationFormValues } from '../applications/ApplicationForm'
import CapabilityForm, { CapabilityFormValues } from '../capabilities/CapabilityForm'
import DataObjectForm, { DataObjectFormValues } from '../dataobjects/DataObjectForm'
import InfrastructureForm, { InfrastructureFormValues } from '../infrastructure/InfrastructureForm'
import ApplicationInterfaceForm, {
  ApplicationInterfaceFormValues,
} from '../interfaces/ApplicationInterfaceForm'

// Import der GraphQL-Queries
import { GET_APPLICATION } from '@/graphql/application'
import { GET_CAPABILITY, GET_CAPABILITIES } from '@/graphql/capability'
import { GET_APPLICATION_INTERFACE } from '@/graphql/applicationInterface'
import { GET_INFRASTRUCTURE } from '@/graphql/infrastructure'
import { GET_DATA_OBJECT } from '@/graphql/dataObject'

// Import der Mutations
import { UPDATE_APPLICATION } from '@/graphql/application'
import { UPDATE_CAPABILITY } from '@/graphql/capability'
import { UPDATE_INFRASTRUCTURE } from '@/graphql/infrastructure'
import { UPDATE_DATA_OBJECT } from '@/graphql/dataObject'
import { UPDATE_APPLICATION_INTERFACE } from '@/graphql/applicationInterface'

interface ElementFormDialogProps {
  element: ExcalidrawElement | null
  mode: 'view' | 'edit'
  isOpen: boolean
  onClose: () => void
  onElementUpdated?: () => void
}

interface CustomData {
  databaseId?: string
  elementType?: string // Changed from 'type' to 'elementType'
}

export default function ElementFormDialog({
  element,
  mode,
  isOpen,
  onClose,
  onElementUpdated,
}: ElementFormDialogProps) {
  const [currentMode, setCurrentMode] = useState<'view' | 'edit'>(mode)

  // Reset mode when props change
  useEffect(() => {
    setCurrentMode(mode)
  }, [mode])

  if (!element || !isOpen) {
    return null
  }

  const customData = element.customData as CustomData
  const databaseId = customData?.databaseId
  const elementType = customData?.elementType // Changed from 'type' to 'elementType'

  if (!databaseId || !elementType) {
    console.warn('Element has no database ID or elementType:', element)
    return null
  }

  const handleEditMode = () => {
    setCurrentMode('edit')
  }

  const handleClose = () => {
    setCurrentMode(mode) // Reset to original mode
    onClose()
  }

  // Render appropriate form based on element type
  switch (elementType.toLowerCase()) {
    case 'application':
      return (
        <ApplicationFormWrapper
          databaseId={databaseId}
          mode={currentMode}
          isOpen={isOpen}
          onClose={handleClose}
          onEditMode={handleEditMode}
          onElementUpdated={onElementUpdated}
        />
      )

    case 'business capability':
    case 'businesscapability':
    case 'capability':
      return (
        <CapabilityFormWrapper
          databaseId={databaseId}
          mode={currentMode}
          isOpen={isOpen}
          onClose={handleClose}
          onEditMode={handleEditMode}
          onElementUpdated={onElementUpdated}
        />
      )

    case 'data object':
    case 'dataobject':
      return (
        <DataObjectFormWrapper
          databaseId={databaseId}
          mode={currentMode}
          isOpen={isOpen}
          onClose={handleClose}
          onEditMode={handleEditMode}
          onElementUpdated={onElementUpdated}
        />
      )

    case 'application interface':
    case 'applicationinterface':
    case 'interface':
      return (
        <InterfaceFormWrapper
          databaseId={databaseId}
          mode={currentMode}
          isOpen={isOpen}
          onClose={handleClose}
          onEditMode={handleEditMode}
          onElementUpdated={onElementUpdated}
        />
      )

    case 'infrastructure':
      return (
        <InfrastructureFormWrapper
          databaseId={databaseId}
          mode={currentMode}
          isOpen={isOpen}
          onClose={handleClose}
          onEditMode={handleEditMode}
          onElementUpdated={onElementUpdated}
        />
      )

    default:
      console.warn('Unknown element type:', elementType)
      return null
  }
}

// Wrapper für Application Form
function ApplicationFormWrapper({
  databaseId,
  mode,
  isOpen,
  onClose,
  onEditMode,
  onElementUpdated,
}: {
  databaseId: string
  mode: 'view' | 'edit'
  isOpen: boolean
  onClose: () => void
  onEditMode?: () => void
  onElementUpdated?: () => void
}) {
  const { data, loading, error } = useQuery(GET_APPLICATION, {
    variables: { id: databaseId },
    skip: !isOpen,
  })

  const [updateApplication] = useMutation(UPDATE_APPLICATION, {
    onCompleted: () => {
      onElementUpdated?.()
      onClose()
    },
  })

  const handleSubmit = async (formData: ApplicationFormValues) => {
    try {
      await updateApplication({
        variables: {
          id: databaseId,
          input: formData,
        },
      })
    } catch (error) {
      console.error('Error updating application:', error)
      throw error
    }
  }

  if (loading) return null
  if (error) {
    console.error('Error loading application:', error)
    return null
  }

  console.log('ApplicationFormWrapper - Debug data:', {
    data,
    application: data?.applications?.[0],
    databaseId,
    loading,
    error,
  })

  return (
    <ApplicationForm
      application={data?.applications?.[0]}
      mode={mode}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onEditMode={onEditMode}
      loading={false}
    />
  )
}

// Wrapper für Capability Form
function CapabilityFormWrapper({
  databaseId,
  mode,
  isOpen,
  onClose,
  onEditMode,
  onElementUpdated,
}: {
  databaseId: string
  mode: 'view' | 'edit'
  isOpen: boolean
  onClose: () => void
  onEditMode?: () => void
  onElementUpdated?: () => void
}) {
  const { data, loading, error } = useQuery(GET_CAPABILITY, {
    variables: { id: databaseId },
    skip: !isOpen,
  })

  // Lade alle Capabilities für die Parent/Child-Auswahl
  const {
    data: allCapabilitiesData,
    loading: allCapabilitiesLoading,
    error: allCapabilitiesError,
  } = useQuery(GET_CAPABILITIES, {
    skip: !isOpen,
  })

  const [updateCapability] = useMutation(UPDATE_CAPABILITY, {
    onCompleted: () => {
      onElementUpdated?.()
      onClose()
    },
  })

  const handleSubmit = async (formData: CapabilityFormValues) => {
    try {
      await updateCapability({
        variables: {
          id: databaseId,
          input: formData,
        },
      })
    } catch (error) {
      console.error('Error updating capability:', error)
      throw error
    }
  }

  if (loading || allCapabilitiesLoading) return null
  if (error) {
    console.error('Error loading capability:', error)
    return null
  }
  if (allCapabilitiesError) {
    console.error('Error loading all capabilities:', allCapabilitiesError)
    return null
  }

  console.log('CapabilityFormWrapper - Debug data:', {
    data,
    capability: data?.businessCapabilities?.[0],
    allCapabilities: allCapabilitiesData?.businessCapabilities,
    databaseId,
    loading,
    error,
  })

  return (
    <CapabilityForm
      capability={data?.businessCapabilities?.[0]}
      availableCapabilities={allCapabilitiesData?.businessCapabilities || []}
      mode={mode}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onEditMode={onEditMode}
      loading={false}
    />
  )
}

// Wrapper für Interface Form
function InterfaceFormWrapper({
  databaseId,
  mode,
  isOpen,
  onClose,
  onEditMode,
  onElementUpdated,
}: {
  databaseId: string
  mode: 'view' | 'edit'
  isOpen: boolean
  onClose: () => void
  onEditMode?: () => void
  onElementUpdated?: () => void
}) {
  const { data, loading, error } = useQuery(GET_APPLICATION_INTERFACE, {
    variables: { id: databaseId },
    skip: !isOpen,
  })

  const [updateApplicationInterface] = useMutation(UPDATE_APPLICATION_INTERFACE, {
    onCompleted: () => {
      onElementUpdated?.()
      onClose()
    },
  })

  const handleSubmit = async (formData: ApplicationInterfaceFormValues) => {
    try {
      await updateApplicationInterface({
        variables: {
          id: databaseId,
          input: formData,
        },
      })
    } catch (error) {
      console.error('Error updating application interface:', error)
      throw error
    }
  }

  if (loading) return null
  if (error) {
    console.error('Error loading application interface:', error)
    return null
  }

  console.log('InterfaceFormWrapper - Debug data:', {
    data,
    applicationInterface: data?.applicationInterfaces?.[0],
    databaseId,
    loading,
    error,
  })

  return (
    <ApplicationInterfaceForm
      applicationInterface={data?.applicationInterfaces?.[0]}
      mode={mode}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onEditMode={onEditMode}
      loading={false}
    />
  )
}

// Wrapper für Infrastructure Form
function InfrastructureFormWrapper({
  databaseId,
  mode,
  isOpen,
  onClose,
  onEditMode,
  onElementUpdated,
}: {
  databaseId: string
  mode: 'view' | 'edit'
  isOpen: boolean
  onClose: () => void
  onEditMode?: () => void
  onElementUpdated?: () => void
}) {
  const { data, loading, error } = useQuery(GET_INFRASTRUCTURE, {
    variables: { id: databaseId },
    skip: !isOpen,
  })

  const [updateInfrastructure] = useMutation(UPDATE_INFRASTRUCTURE, {
    onCompleted: () => {
      onElementUpdated?.()
      onClose()
    },
  })

  const handleSubmit = async (formData: InfrastructureFormValues) => {
    try {
      await updateInfrastructure({
        variables: {
          id: databaseId,
          input: formData,
        },
      })
    } catch (error) {
      console.error('Error updating infrastructure:', error)
      throw error
    }
  }

  if (loading) return null
  if (error) {
    console.error('Error loading infrastructure:', error)
    return null
  }

  return (
    <InfrastructureForm
      infrastructure={data?.infrastructures?.[0]}
      mode={mode}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onEditMode={onEditMode}
      loading={false}
    />
  )
}

// Wrapper für DataObject Form (einheitlich wie die anderen)
function DataObjectFormWrapper({
  databaseId,
  mode,
  isOpen,
  onClose,
  onEditMode,
  onElementUpdated,
}: {
  databaseId: string
  mode: 'view' | 'edit'
  isOpen: boolean
  onClose: () => void
  onEditMode?: () => void
  onElementUpdated?: () => void
}) {
  const { data, loading, error } = useQuery(GET_DATA_OBJECT, {
    variables: { id: databaseId },
    skip: !isOpen,
  })

  const [updateDataObject] = useMutation(UPDATE_DATA_OBJECT, {
    onCompleted: () => {
      onElementUpdated?.()
      onClose()
    },
  })

  const handleSubmit = async (formData: DataObjectFormValues) => {
    try {
      await updateDataObject({
        variables: {
          id: databaseId,
          input: formData,
        },
      })
    } catch (error) {
      console.error('Error updating data object:', error)
      throw error
    }
  }

  if (loading) return null
  if (error) {
    console.error('Error loading data object:', error)
    return null
  }

  return (
    <DataObjectForm
      dataObject={data?.dataObjects?.[0]}
      mode={mode}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onEditMode={onEditMode}
      loading={false}
    />
  )
}
