/**
 * Utility-Funktionen für die Erstellung von Beziehungen in der Datenbank
 * Verwendet die generierten GraphQL-Mutations aus der generated.ts
 */

import { ApolloClient } from '@apollo/client'
import { gql } from '@apollo/client'
import { NewRelationship } from '../types/relationshipTypes'
import { getRelationshipDisplayName } from './relationshipValidation'

// GraphQL Mutations basierend auf den generierten Typen
const UPDATE_APPLICATION_SUPPORTS_CAPABILITIES = gql`
  mutation UpdateApplicationSupportsCapabilities(
    $where: ApplicationWhere!
    $update: ApplicationUpdateInput!
  ) {
    updateApplications(where: $where, update: $update) {
      applications {
        id
        name
        supportsCapabilities {
          id
          name
        }
      }
    }
  }
`

const UPDATE_APPLICATION_USES_DATA_OBJECTS = gql`
  mutation UpdateApplicationUsesDataObjects(
    $where: ApplicationWhere!
    $update: ApplicationUpdateInput!
  ) {
    updateApplications(where: $where, update: $update) {
      applications {
        id
        name
        usesDataObjects {
          id
          name
        }
      }
    }
  }
`

const UPDATE_APPLICATION_HOSTED_ON = gql`
  mutation UpdateApplicationHostedOn($where: ApplicationWhere!, $update: ApplicationUpdateInput!) {
    updateApplications(where: $where, update: $update) {
      applications {
        id
        name
        hostedOn {
          id
          name
        }
      }
    }
  }
`

const UPDATE_APPLICATION_SOURCE_OF_INTERFACES = gql`
  mutation UpdateApplicationSourceOfInterfaces(
    $where: ApplicationWhere!
    $update: ApplicationUpdateInput!
  ) {
    updateApplications(where: $where, update: $update) {
      applications {
        id
        name
        sourceOfInterfaces {
          id
          name
        }
      }
    }
  }
`

const UPDATE_APPLICATION_TARGET_OF_INTERFACES = gql`
  mutation UpdateApplicationTargetOfInterfaces(
    $where: ApplicationWhere!
    $update: ApplicationUpdateInput!
  ) {
    updateApplications(where: $where, update: $update) {
      applications {
        id
        name
        targetOfInterfaces {
          id
          name
        }
      }
    }
  }
`

const UPDATE_BUSINESS_CAPABILITY_RELATED_DATA_OBJECTS = gql`
  mutation UpdateBusinessCapabilityRelatedDataObjects(
    $where: BusinessCapabilityWhere!
    $update: BusinessCapabilityUpdateInput!
  ) {
    updateBusinessCapabilities(where: $where, update: $update) {
      businessCapabilities {
        id
        name
        relatedDataObjects {
          id
          name
        }
      }
    }
  }
`

const UPDATE_APPLICATION_INTERFACE_TRANSFERS = gql`
  mutation UpdateApplicationInterfaceTransfers(
    $where: ApplicationInterfaceWhere!
    $update: ApplicationInterfaceUpdateInput!
  ) {
    updateApplicationInterfaces(where: $where, update: $update) {
      applicationInterfaces {
        id
        name
        dataObjects {
          id
          name
        }
      }
    }
  }
`

const UPDATE_DATA_OBJECT_DATA_SOURCES = gql`
  mutation UpdateDataObjectDataSources($where: DataObjectWhere!, $update: DataObjectUpdateInput!) {
    updateDataObjects(where: $where, update: $update) {
      dataObjects {
        id
        name
        dataSources {
          id
          name
        }
      }
    }
  }
`

// GraphQL Queries für Existing Relationship Detection
const CHECK_APPLICATION_SUPPORTS_CAPABILITY = gql`
  query CheckApplicationSupportsCapability($applicationId: ID!, $capabilityId: ID!) {
    applications(where: { id: { eq: $applicationId } }) {
      supportsCapabilities(where: { id: { eq: $capabilityId } }) {
        id
      }
    }
  }
`

const CHECK_APPLICATION_INTERFACE_SOURCE = gql`
  query CheckApplicationInterfaceSource($applicationId: ID!, $interfaceId: ID!) {
    applications(where: { id: { eq: $applicationId } }) {
      sourceOfInterfaces(where: { id: { eq: $interfaceId } }) {
        id
      }
    }
  }
`

const CHECK_APPLICATION_INTERFACE_TARGET = gql`
  query CheckApplicationInterfaceTarget($interfaceId: ID!, $applicationId: ID!) {
    applicationInterfaces(where: { id: { eq: $interfaceId } }) {
      targetApplications(where: { id: { eq: $applicationId } }) {
        id
      }
    }
  }
`

const CHECK_APPLICATION_INTERFACE_TRANSFERS = gql`
  query CheckApplicationInterfaceTransfers($interfaceId: ID!, $dataObjectId: ID!) {
    applicationInterfaces(where: { id: { eq: $interfaceId } }) {
      dataObjects(where: { id: { eq: $dataObjectId } }) {
        id
      }
    }
  }
`

const CHECK_DATA_OBJECT_TRANSFERS = gql`
  query CheckDataObjectTransfers($dataObjectId: ID!, $interfaceId: ID!) {
    dataObjects(where: { id: { eq: $dataObjectId } }) {
      transferredInInterfaces(where: { id: { eq: $interfaceId } }) {
        id
      }
    }
  }
`

const CHECK_CAPABILITY_RELATED_DATA_OBJECT = gql`
  query CheckCapabilityRelatedDataObject($capabilityId: ID!, $dataObjectId: ID!) {
    businessCapabilities(where: { id: { eq: $capabilityId } }) {
      relatedDataObjects(where: { id: { eq: $dataObjectId } }) {
        id
      }
    }
  }
`

const CHECK_DATA_OBJECT_DATA_SOURCE = gql`
  query CheckDataObjectDataSource($dataObjectId: ID!, $applicationId: ID!) {
    dataObjects(where: { id: { eq: $dataObjectId } }) {
      dataSources(where: { id: { eq: $applicationId } }) {
        id
      }
    }
  }
`

const UPDATE_APPLICATION_INTERFACE_TARGET_APPLICATIONS = gql`
  mutation UpdateApplicationInterfaceTargetApplications(
    $where: ApplicationInterfaceWhere!
    $update: ApplicationInterfaceUpdateInput!
  ) {
    updateApplicationInterfaces(where: $where, update: $update) {
      applicationInterfaces {
        id
        name
        targetApplications {
          id
          name
        }
      }
    }
  }
`

const UPDATE_APPLICATION_INTERFACE_SOURCE_APPLICATIONS = gql`
  mutation UpdateApplicationInterfaceSourceApplications(
    $where: ApplicationInterfaceWhere!
    $update: ApplicationInterfaceUpdateInput!
  ) {
    updateApplicationInterfaces(where: $where, update: $update) {
      applicationInterfaces {
        id
        name
        sourceApplications {
          id
          name
        }
      }
    }
  }
`

interface RelationshipCreationResult {
  success: boolean
  createdCount: number
  errors: string[]
}

/**
 * Erstellt die ausgewählten Beziehungen in der Datenbank
 */
export const createRelationshipsInDatabase = async (
  client: ApolloClient<any>,
  relationships: NewRelationship[]
): Promise<RelationshipCreationResult> => {
  const result: RelationshipCreationResult = {
    success: true,
    createdCount: 0,
    errors: [],
  }

  for (const relationship of relationships) {
    try {
      await createSingleRelationship(client, relationship)
      result.createdCount++
    } catch (error) {
      result.success = false
      result.errors.push(
        `Fehler beim Erstellen der Beziehung ${getRelationshipDisplayName(relationship.relationshipDefinition.type)}: ${error}`
      )
      console.error('Error creating relationship:', error, relationship)
    }
  }

  return result
}

/**
 * Erstellt eine einzelne Beziehung in der Datenbank
 */
const createSingleRelationship = async (
  client: ApolloClient<any>,
  relationship: NewRelationship
): Promise<void> => {
  const {
    relationshipDefinition,
    sourceElementId,
    targetElementId,
    sourceElementType,
    targetElementType,
  } = relationship

  console.log(
    `Creating relationship: ${relationshipDefinition.type} between ${sourceElementType} (${sourceElementId}) and ${targetElementType} (${targetElementId})`
  )

  // Verwende die korrekten generierten GraphQL Mutations basierend auf dem Beziehungstyp
  switch (relationshipDefinition.type) {
    case 'SUPPORTS':
      if (sourceElementType === 'application' && targetElementType === 'businessCapability') {
        await client.mutate({
          mutation: UPDATE_APPLICATION_SUPPORTS_CAPABILITIES,
          variables: {
            where: { id: { eq: sourceElementId } },
            update: {
              supportsCapabilities: {
                connect: [{ where: { node: { id: { eq: targetElementId } } } }],
              },
            },
          },
        })
      }
      break

    case 'USES':
      if (sourceElementType === 'application' && targetElementType === 'dataObject') {
        await client.mutate({
          mutation: UPDATE_APPLICATION_USES_DATA_OBJECTS,
          variables: {
            where: { id: { eq: sourceElementId } },
            update: {
              usesDataObjects: {
                connect: [{ where: { node: { id: { eq: targetElementId } } } }],
              },
            },
          },
        })
      }
      break

    case 'HOSTED_ON':
      if (sourceElementType === 'application' && targetElementType === 'infrastructure') {
        await client.mutate({
          mutation: UPDATE_APPLICATION_HOSTED_ON,
          variables: {
            where: { id: { eq: sourceElementId } },
            update: {
              hostedOn: {
                connect: [{ where: { node: { id: { eq: targetElementId } } } }],
              },
            },
          },
        })
      }
      break

    case 'INTERFACE_SOURCE':
      if (sourceElementType === 'application' && targetElementType === 'applicationInterface') {
        // Application → ApplicationInterface: Application ist SourceApplication der Interface
        await client.mutate({
          mutation: UPDATE_APPLICATION_SOURCE_OF_INTERFACES,
          variables: {
            where: { id: { eq: sourceElementId } },
            update: {
              sourceOfInterfaces: {
                connect: [{ where: { node: { id: { eq: targetElementId } } } }],
              },
            },
          },
        })
      } else if (
        sourceElementType === 'applicationInterface' &&
        targetElementType === 'application'
      ) {
        // ApplicationInterface → Application: Application ist SourceApplication der Interface
        await client.mutate({
          mutation: UPDATE_APPLICATION_INTERFACE_SOURCE_APPLICATIONS,
          variables: {
            where: { id: { eq: sourceElementId } },
            update: {
              sourceApplications: {
                connect: [{ where: { node: { id: { eq: targetElementId } } } }],
              },
            },
          },
        })
      }
      break

    case 'INTERFACE_TARGET':
      if (sourceElementType === 'application' && targetElementType === 'applicationInterface') {
        // Application → ApplicationInterface: Application ist TargetApplication der Interface
        await client.mutate({
          mutation: UPDATE_APPLICATION_TARGET_OF_INTERFACES,
          variables: {
            where: { id: { eq: sourceElementId } },
            update: {
              targetOfInterfaces: {
                connect: [{ where: { node: { id: { eq: targetElementId } } } }],
              },
            },
          },
        })
      } else if (
        sourceElementType === 'applicationInterface' &&
        targetElementType === 'application'
      ) {
        // ApplicationInterface → Application: Application ist TargetApplication der Interface
        await client.mutate({
          mutation: UPDATE_APPLICATION_INTERFACE_TARGET_APPLICATIONS,
          variables: {
            where: { id: { eq: sourceElementId } },
            update: {
              targetApplications: {
                connect: [{ where: { node: { id: { eq: targetElementId } } } }],
              },
            },
          },
        })
      }
      break

    case 'RELATED_TO':
      if (sourceElementType === 'businessCapability' && targetElementType === 'dataObject') {
        await client.mutate({
          mutation: UPDATE_BUSINESS_CAPABILITY_RELATED_DATA_OBJECTS,
          variables: {
            where: { id: { eq: sourceElementId } },
            update: {
              relatedDataObjects: {
                connect: [{ where: { node: { id: { eq: targetElementId } } } }],
              },
            },
          },
        })
      }
      break

    case 'TRANSFERS':
      if (sourceElementType === 'applicationInterface' && targetElementType === 'dataObject') {
        console.log(
          'DEBUG: Executing UPDATE_APPLICATION_INTERFACE_TRANSFERS mutation (applicationInterface -> dataObject)'
        )
        const variables = {
          where: { id: { eq: sourceElementId } },
          update: {
            dataObjects: {
              connect: [{ where: { node: { id: { eq: targetElementId } } } }],
            },
          },
        }
        console.log('DEBUG: Mutation variables:', JSON.stringify(variables, null, 2))
        const result = await client.mutate({
          mutation: UPDATE_APPLICATION_INTERFACE_TRANSFERS,
          variables,
        })
        console.log('DEBUG: Mutation result:', JSON.stringify(result.data, null, 2))
      } else if (
        sourceElementType === 'dataObject' &&
        targetElementType === 'applicationInterface'
      ) {
        // Korrigiere die Richtung: Erstelle die Beziehung von ApplicationInterface zu DataObject
        console.log(
          'DEBUG: Correcting direction - Creating TRANSFERS from applicationInterface to dataObject'
        )
        const variables = {
          where: { id: { eq: targetElementId } }, // applicationInterface
          update: {
            dataObjects: {
              connect: [{ where: { node: { id: { eq: sourceElementId } } } }], // dataObject
            },
          },
        }
        console.log('DEBUG: Mutation variables (corrected):', JSON.stringify(variables, null, 2))
        const result = await client.mutate({
          mutation: UPDATE_APPLICATION_INTERFACE_TRANSFERS,
          variables,
        })
        console.log('DEBUG: Mutation result (corrected):', JSON.stringify(result.data, null, 2))
      }
      break

    case 'DATA_SOURCE':
      if (sourceElementType === 'dataObject' && targetElementType === 'application') {
        await client.mutate({
          mutation: UPDATE_DATA_OBJECT_DATA_SOURCES,
          variables: {
            where: { id: { eq: sourceElementId } },
            update: {
              dataSources: {
                connect: [{ where: { node: { id: { eq: targetElementId } } } }],
              },
            },
          },
        })
      }
      break

    default:
      console.warn(
        `Beziehungstyp ${relationshipDefinition.type} zwischen ${sourceElementType} und ${targetElementType} ist noch nicht implementiert`
      )
      return
  }

  console.log(
    `Successfully created relationship: ${getRelationshipDisplayName(relationshipDefinition.type)}`
  )
}

/**
 * Prüft, ob eine Beziehung bereits in der Datenbank existiert
 * (Diese Funktion sollte später mit echten GraphQL-Queries implementiert werden)
 */
export const checkRelationshipExists = async (
  client: ApolloClient<any>,
  relationshipDefinition: {
    type: string
    sourceElementId: string
    targetElementId: string
    sourceElementType: string
    targetElementType: string
  }
): Promise<boolean> => {
  console.log('\n=== DEBUG: checkRelationshipExists called ===')
  console.log('DEBUG: Checking relationship existence:', relationshipDefinition)

  const { type, sourceElementId, targetElementId, sourceElementType, targetElementType } =
    relationshipDefinition

  try {
    let query: any = null
    let variables: any = null

    // Wähle die richtige Query basierend auf dem Beziehungstyp
    switch (type) {
      case 'SUPPORTS':
        if (sourceElementType === 'application' && targetElementType === 'businessCapability') {
          console.log('DEBUG: Using CHECK_APPLICATION_SUPPORTS_CAPABILITY query')
          query = CHECK_APPLICATION_SUPPORTS_CAPABILITY
          variables = { applicationId: sourceElementId, capabilityId: targetElementId }
        }
        break

      case 'INTERFACE_SOURCE':
        if (sourceElementType === 'application' && targetElementType === 'applicationInterface') {
          console.log('DEBUG: Using CHECK_APPLICATION_INTERFACE_SOURCE query')
          query = CHECK_APPLICATION_INTERFACE_SOURCE
          variables = { applicationId: sourceElementId, interfaceId: targetElementId }
        }
        break

      case 'INTERFACE_TARGET':
        if (sourceElementType === 'applicationInterface' && targetElementType === 'application') {
          console.log('DEBUG: Using CHECK_APPLICATION_INTERFACE_TARGET query')
          query = CHECK_APPLICATION_INTERFACE_TARGET
          variables = { interfaceId: sourceElementId, applicationId: targetElementId }
        }
        break

      case 'TRANSFERS':
        if (sourceElementType === 'applicationInterface' && targetElementType === 'dataObject') {
          console.log('DEBUG: Using CHECK_APPLICATION_INTERFACE_TRANSFERS query')
          query = CHECK_APPLICATION_INTERFACE_TRANSFERS
          variables = { interfaceId: sourceElementId, dataObjectId: targetElementId }
        } else if (
          sourceElementType === 'dataObject' &&
          targetElementType === 'applicationInterface'
        ) {
          console.log('DEBUG: Using CHECK_DATA_OBJECT_TRANSFERS query')
          query = CHECK_DATA_OBJECT_TRANSFERS
          variables = { dataObjectId: sourceElementId, interfaceId: targetElementId }
        }
        break

      case 'RELATED_TO':
        if (sourceElementType === 'businessCapability' && targetElementType === 'dataObject') {
          console.log('DEBUG: Using CHECK_CAPABILITY_RELATED_DATA_OBJECT query')
          query = CHECK_CAPABILITY_RELATED_DATA_OBJECT
          variables = { capabilityId: sourceElementId, dataObjectId: targetElementId }
        }
        break

      case 'DATA_SOURCE':
        if (sourceElementType === 'dataObject' && targetElementType === 'application') {
          console.log('DEBUG: Using CHECK_DATA_OBJECT_DATA_SOURCE query')
          query = CHECK_DATA_OBJECT_DATA_SOURCE
          variables = { dataObjectId: sourceElementId, applicationId: targetElementId }
        }
        break

      default:
        console.log(`DEBUG: Relationship check not implemented for type: ${type}`)
        return false
    }

    if (!query) {
      console.log(
        `DEBUG: No query available for relationship ${type} between ${sourceElementType} and ${targetElementType}`
      )
      return false
    }

    console.log('DEBUG: Executing GraphQL query with variables:', variables)
    const result = await client.query({
      query,
      variables,
      fetchPolicy: 'no-cache', // Immer aktuelle Daten abrufen
    })

    console.log('DEBUG: GraphQL query result:', JSON.stringify(result.data, null, 2))

    // Prüfe das Ergebnis je nach Relationship-Typ
    const data = result.data
    let relationshipExists = false

    switch (type) {
      case 'SUPPORTS':
        relationshipExists = data.applications?.[0]?.supportsCapabilities?.length > 0
        console.log('DEBUG: SUPPORTS check - applications found:', data.applications?.length)
        console.log(
          'DEBUG: SUPPORTS check - supportsCapabilities found:',
          data.applications?.[0]?.supportsCapabilities?.length
        )
        break
      case 'INTERFACE_SOURCE':
        relationshipExists = data.applications?.[0]?.sourceOfInterfaces?.length > 0
        console.log(
          'DEBUG: INTERFACE_SOURCE check - applications found:',
          data.applications?.length
        )
        console.log(
          'DEBUG: INTERFACE_SOURCE check - sourceOfInterfaces found:',
          data.applications?.[0]?.sourceOfInterfaces?.length
        )
        break
      case 'INTERFACE_TARGET':
        relationshipExists = data.applicationInterfaces?.[0]?.targetApplications?.length > 0
        console.log(
          'DEBUG: INTERFACE_TARGET check - applicationInterfaces found:',
          data.applicationInterfaces?.length
        )
        console.log(
          'DEBUG: INTERFACE_TARGET check - targetApplications found:',
          data.applicationInterfaces?.[0]?.targetApplications?.length
        )
        break
      case 'TRANSFERS': {
        // Prüfe beide möglichen Query-Ergebnisse
        const applicationInterfaceTransfers =
          data.applicationInterfaces?.[0]?.dataObjects?.length > 0
        const dataObjectTransfers = data.dataObjects?.[0]?.transferredInInterfaces?.length > 0
        relationshipExists = applicationInterfaceTransfers || dataObjectTransfers

        console.log(
          'DEBUG: TRANSFERS check - applicationInterfaces found:',
          data.applicationInterfaces?.length
        )
        console.log(
          'DEBUG: TRANSFERS check - dataObjects (from interface) found:',
          data.applicationInterfaces?.[0]?.dataObjects?.length
        )
        console.log('DEBUG: TRANSFERS check - dataObjects found:', data.dataObjects?.length)
        console.log(
          'DEBUG: TRANSFERS check - transferredInInterfaces found:',
          data.dataObjects?.[0]?.transferredInInterfaces?.length
        )
        console.log('DEBUG: TRANSFERS relationship exists:', relationshipExists)
        break
      }
      case 'RELATED_TO':
        relationshipExists = data.businessCapabilities?.[0]?.relatedDataObjects?.length > 0
        console.log(
          'DEBUG: RELATED_TO check - businessCapabilities found:',
          data.businessCapabilities?.length
        )
        console.log(
          'DEBUG: RELATED_TO check - relatedDataObjects found:',
          data.businessCapabilities?.[0]?.relatedDataObjects?.length
        )
        break
      case 'DATA_SOURCE':
        relationshipExists = data.dataObjects?.[0]?.dataSources?.length > 0
        console.log('DEBUG: DATA_SOURCE check - dataObjects found:', data.dataObjects?.length)
        console.log(
          'DEBUG: DATA_SOURCE check - dataSources found:',
          data.dataObjects?.[0]?.dataSources?.length
        )
        break
    }

    console.log(
      `DEBUG: Relationship ${type} between ${sourceElementId} and ${targetElementId} exists: ${relationshipExists}`
    )
    return relationshipExists
  } catch (error) {
    console.error('DEBUG: Error checking relationship existence:', error)
    if (error instanceof Error) {
      console.error('DEBUG: Error message:', error.message)
      console.error('DEBUG: Error stack:', error.stack)
    }
    return false
  }
}
