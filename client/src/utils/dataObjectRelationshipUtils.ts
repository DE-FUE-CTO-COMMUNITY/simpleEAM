export const DATA_OBJECT_RELATIONSHIP_SEPARATOR = '|~|'

export interface DataObjectRelationshipValue {
  id: string
  edgeName?: string
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