export const DATA_OBJECT_RELATIONSHIP_SEPARATOR = '|~|'

export interface DataObjectRelationshipValue {
  id: string
  edgeName?: string
}

export interface DataObjectRelationshipFormValue {
  dataObjectId: string
  relationshipName: string
}

export const encodeDataObjectRelationshipValue = (id: string, edgeName?: string): string => {
  const trimmedId = id.trim()
  const trimmedEdgeName = edgeName?.trim()

  if (!trimmedId) {
    return ''
  }

  return trimmedEdgeName
    ? `${trimmedId}${DATA_OBJECT_RELATIONSHIP_SEPARATOR}${trimmedEdgeName}`
    : trimmedId
}

export const parseDataObjectRelationshipValue = (value: string): DataObjectRelationshipValue => {
  const trimmedValue = value.trim()
  const separatorIndex = trimmedValue.indexOf(DATA_OBJECT_RELATIONSHIP_SEPARATOR)

  if (separatorIndex === -1) {
    return { id: trimmedValue }
  }

  const id = trimmedValue.slice(0, separatorIndex).trim()
  const edgeName = trimmedValue
    .slice(separatorIndex + DATA_OBJECT_RELATIONSHIP_SEPARATOR.length)
    .trim()

  return {
    id,
    edgeName: edgeName || undefined,
  }
}

export const buildDataObjectRelationshipConnectInput = (
  relationships?: readonly DataObjectRelationshipFormValue[]
) =>
  (relationships ?? [])
    .map(relationship => ({
      dataObjectId: relationship.dataObjectId.trim(),
      relationshipName: relationship.relationshipName.trim(),
    }))
    .filter(
      relationship =>
        relationship.dataObjectId.length > 0 && relationship.relationshipName.length > 0
    )
    .map(relationship => ({
      where: {
        node: {
          id: { eq: relationship.dataObjectId },
        },
      },
      edge: {
        name: relationship.relationshipName,
      },
    }))

export const sortDataObjectRelationshipFormValues = (
  relationships?: readonly DataObjectRelationshipFormValue[]
) =>
  [...(relationships ?? [])]
    .map(relationship => ({
      dataObjectId: relationship.dataObjectId.trim(),
      relationshipName: relationship.relationshipName.trim(),
    }))
    .sort((left, right) => {
      if (left.dataObjectId === right.dataObjectId) {
        return left.relationshipName.localeCompare(right.relationshipName)
      }

      return left.dataObjectId.localeCompare(right.dataObjectId)
    })
