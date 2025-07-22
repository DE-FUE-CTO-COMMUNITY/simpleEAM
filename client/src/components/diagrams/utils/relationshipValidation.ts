/**
 * Schema-basierte Beziehungsvalidierung für Excalidraw-Diagramme
 * Definiert gültige Beziehungen basierend auf dem GraphQL-Schema
 */

// Definiere alle gültigen Elementtypen basierend auf dem Schema
// Nur Architekturelemente, die in Diagrammen vorkommen können
export type ElementType =
  | 'businessCapability'
  | 'application'
  | 'dataObject'
  | 'applicationInterface'
  | 'infrastructure'

// Beziehungsdefinition aus dem Schema
export interface RelationshipDefinition {
  type: string // Der @relationship type aus dem Schema
  direction: 'IN' | 'OUT'
  sourceType: ElementType
  targetType: ElementType
  fieldName: string // Name des Feldes im Schema
}

// Alle gültigen Beziehungen basierend auf dem GraphQL Schema
// Nur OUT-Beziehungen, da IN-Beziehungen die Umkehrung sind
export const VALID_RELATIONSHIPS: RelationshipDefinition[] = [
  // BusinessCapability Beziehungen
  {
    type: 'RELATED_TO',
    direction: 'OUT',
    sourceType: 'businessCapability',
    targetType: 'dataObject',
    fieldName: 'relatedDataObjects',
  },

  // Application Beziehungen
  {
    type: 'SUPPORTS',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'businessCapability',
    fieldName: 'supportsCapabilities',
  },
  {
    type: 'USES',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'dataObject',
    fieldName: 'usesDataObjects',
  },
  {
    type: 'INTERFACE_SOURCE',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'applicationInterface',
    fieldName: 'sourceOfInterfaces',
  },
  {
    type: 'INTERFACE_TARGET',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'applicationInterface',
    fieldName: 'targetOfInterfaces',
  },
  {
    type: 'HOSTED_ON',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'infrastructure',
    fieldName: 'hostedOn',
  },

  // ApplicationInterface Beziehungen
  {
    type: 'TRANSFERS',
    direction: 'OUT',
    sourceType: 'applicationInterface',
    targetType: 'dataObject',
    fieldName: 'dataObjects',
  },

  // DataObject Beziehungen (umgekehrte TRANSFERS Richtung)
  {
    type: 'TRANSFERS',
    direction: 'IN', // umgekehrte Richtung
    sourceType: 'dataObject',
    targetType: 'applicationInterface',
    fieldName: 'transferredInInterfaces',
  },
  {
    type: 'DATA_SOURCE',
    direction: 'OUT',
    sourceType: 'dataObject',
    targetType: 'application',
    fieldName: 'dataSources',
  },
]

/**
 * Findet gültige Beziehungen zwischen zwei Elementtypen
 * Berücksichtigt sowohl direkte (OUT) als auch umgekehrte (IN) Beziehungen
 */
export const getValidRelationships = (
  sourceType: ElementType,
  targetType: ElementType
): RelationshipDefinition[] => {
  const directRelationships = VALID_RELATIONSHIPS.filter(
    rel => rel.sourceType === sourceType && rel.targetType === targetType
  )

  // Finde auch umgekehrte Beziehungen (IN-Richtung)
  const reverseRelationships = VALID_RELATIONSHIPS.filter(
    rel => rel.sourceType === targetType && rel.targetType === sourceType
  ).map(rel => ({
    ...rel,
    direction: 'IN' as const,
    sourceType,
    targetType,
    // Für umgekehrte Beziehungen verwenden wir ein angepasstes fieldName-Mapping
    fieldName: getReverseFieldName(rel.type, sourceType),
  }))

  return [...directRelationships, ...reverseRelationships]
}

/**
 * Mappt Beziehungstypen zu ihren umgekehrten Feldnamen
 */
const getReverseFieldName = (relationshipType: string, sourceType: ElementType): string => {
  const reverseFieldMapping: Record<string, Record<string, string>> = {
    SUPPORTS: {
      businessCapability: 'supportedByApplications',
    },
    USES: {
      dataObject: 'usedByApplications',
    },
    DATA_SOURCE: {
      application: 'usesDataObjects',
    },
    INTERFACE_SOURCE: {
      applicationInterface: 'sourceApplications',
    },
    INTERFACE_TARGET: {
      applicationInterface: 'targetApplications',
    },
    HOSTED_ON: {
      infrastructure: 'hostsApplications',
    },
    TRANSFERS: {
      dataObject: 'transferredInInterfaces',
    },
    RELATED_TO: {
      dataObject: 'relatedToCapabilities',
    },
  }

  return reverseFieldMapping[relationshipType]?.[sourceType] || 'unknown'
}

/**
 * Prüft ob eine Beziehung zwischen zwei Elementtypen gültig ist
 */
export const isValidRelationship = (
  sourceType: ElementType,
  targetType: ElementType,
  relationshipType: string
): boolean => {
  return VALID_RELATIONSHIPS.some(
    rel =>
      rel.sourceType === sourceType &&
      rel.targetType === targetType &&
      rel.type === relationshipType
  )
}

/**
 * Gibt den übersetzten Namen einer Beziehung zurück
 * @param relationshipType - Der Beziehungstyp aus dem Schema
 * @param locale - Das gewünschte Locale (de, en)
 * @returns Der übersetzte Name der Beziehung
 */
export const getRelationshipDisplayName = (
  relationshipType: string,
  locale: string = 'de'
): string => {
  // Diese Funktion sollte mit der Internationalisierung integriert werden
  // Für jetzt verwenden wir ein einfaches Mapping
  const translations: Record<string, Record<string, string>> = {
    de: {
      SUPPORTS: 'unterstützt',
      USES: 'verwendet',
      DATA_SOURCE: 'ist Datenquelle für',
      INTERFACE_SOURCE: 'ist Quell-Anwendung von',
      INTERFACE_TARGET: 'ist Ziel-Anwendung von',
      HOSTED_ON: 'gehostet auf',
      TRANSFERS: 'überträgt',
      RELATED_TO: 'bezieht sich auf',
    },
    en: {
      SUPPORTS: 'supports',
      USES: 'uses',
      DATA_SOURCE: 'is data source for',
      INTERFACE_SOURCE: 'is source application of',
      INTERFACE_TARGET: 'is target application of',
      HOSTED_ON: 'hosted on',
      TRANSFERS: 'transfers',
      RELATED_TO: 'relates to',
    },
  }

  return translations[locale]?.[relationshipType] || relationshipType
}
/**
 * Konvertiert Element-Typ-Strings zu ElementType
 * Nur gültige Architekturelemente, die in Diagrammen vorkommen können
 */
export const normalizeElementType = (elementType: string): ElementType | null => {
  const typeMapping: Record<string, ElementType> = {
    capability: 'businessCapability',
    businessCapability: 'businessCapability',
    application: 'application',
    dataObject: 'dataObject',
    interface: 'applicationInterface',
    applicationInterface: 'applicationInterface',
    infrastructure: 'infrastructure',
  }

  return typeMapping[elementType] || null
}
