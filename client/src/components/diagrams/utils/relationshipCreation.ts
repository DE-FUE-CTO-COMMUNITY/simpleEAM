/**
 * Utility-Funktionen für die Erstellung von Beziehungen in der Datenbank
 * Verwendet die generierten GraphQL-Mutations aus der generated.ts
 */

import { ApolloClient } from '@apollo/client'
import { gql } from '@apollo/client'
import { NewRelationship } from '../types/relationshipTypes'

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
        `Fehler beim Erstellen der Beziehung ${relationship.relationshipDefinition.displayName}: ${error}`
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
            where: { id: sourceElementId },
            update: {
              supportsCapabilities: {
                connect: [{ where: { node: { id: targetElementId } } }],
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
            where: { id: sourceElementId },
            update: {
              usesDataObjects: {
                connect: [{ where: { node: { id: targetElementId } } }],
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
            where: { id: sourceElementId },
            update: {
              hostedOn: {
                connect: [{ where: { node: { id: targetElementId } } }],
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
            where: { id: sourceElementId },
            update: {
              sourceOfInterfaces: {
                connect: [{ where: { node: { id: targetElementId } } }],
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
            where: { id: sourceElementId },
            update: {
              sourceApplications: {
                connect: [{ where: { node: { id: targetElementId } } }],
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
            where: { id: sourceElementId },
            update: {
              targetOfInterfaces: {
                connect: [{ where: { node: { id: targetElementId } } }],
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
            where: { id: sourceElementId },
            update: {
              targetApplications: {
                connect: [{ where: { node: { id: targetElementId } } }],
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
            where: { id: sourceElementId },
            update: {
              relatedDataObjects: {
                connect: [{ where: { node: { id: targetElementId } } }],
              },
            },
          },
        })
      }
      break

    case 'TRANSFERS':
      if (sourceElementType === 'applicationInterface' && targetElementType === 'dataObject') {
        await client.mutate({
          mutation: UPDATE_APPLICATION_INTERFACE_TRANSFERS,
          variables: {
            where: { id: sourceElementId },
            update: {
              dataObjects: {
                connect: [{ where: { node: { id: targetElementId } } }],
              },
            },
          },
        })
      }
      break

    case 'DATA_SOURCE':
      if (sourceElementType === 'dataObject' && targetElementType === 'application') {
        await client.mutate({
          mutation: UPDATE_DATA_OBJECT_DATA_SOURCES,
          variables: {
            where: { id: sourceElementId },
            update: {
              dataSources: {
                connect: [{ where: { node: { id: targetElementId } } }],
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

  console.log(`Successfully created relationship: ${relationshipDefinition.displayName}`)
}

/**
 * Prüft, ob eine Beziehung bereits in der Datenbank existiert
 * (Diese Funktion sollte später mit echten GraphQL-Queries implementiert werden)
 */
export const checkRelationshipExists = async (
  _client: ApolloClient<any>,
  _relationship: NewRelationship
): Promise<boolean> => {
  // TODO: Implementiere echte Datenbankabfrage
  // Für jetzt geben wir false zurück (Beziehung existiert nicht)
  return false
}
