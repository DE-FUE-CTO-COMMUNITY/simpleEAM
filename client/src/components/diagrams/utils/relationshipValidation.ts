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
  reverseArrow: boolean // Ob die Pfeilrichtung umgekehrt werden soll
}

// Alle gültigen Beziehungen basierend auf dem GraphQL Schema
// Nur OUT-Beziehungen, da IN-Beziehungen die Umkehrung sind
export const VALID_RELATIONSHIPS: RelationshipDefinition[] = [
  // Business Capability Beziehungen
  {
    type: 'RELATED_TO',
    direction: 'OUT',
    sourceType: 'businessCapability',
    targetType: 'dataObject',
    fieldName: 'relatedDataObjects',
    reverseArrow: false,
  },
  {
    type: 'SUPPORTS',
    direction: 'IN', // umgekehrte Richtung: BusinessCapability → Application
    sourceType: 'businessCapability',
    targetType: 'application',
    fieldName: 'supportedByApplications',
    reverseArrow: true, // SUPPORTS soll umgekehrt werden
  },
  {
    type: 'HAS_PARENT',
    direction: 'OUT',
    sourceType: 'businessCapability',
    targetType: 'businessCapability',
    fieldName: 'parents',
    reverseArrow: false,
  },

  // Application Beziehungen
  {
    type: 'SUPPORTS',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'businessCapability',
    fieldName: 'supportsCapabilities',
    reverseArrow: true, // SUPPORTS soll umgekehrt werden
  },
  {
    type: 'USES',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'dataObject',
    fieldName: 'usesDataObjects',
    reverseArrow: false,
  },
  {
    type: 'INTERFACE_SOURCE',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'applicationInterface',
    fieldName: 'sourceOfInterfaces',
    reverseArrow: false,
  },
  {
    type: 'INTERFACE_TARGET',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'applicationInterface',
    fieldName: 'targetOfInterfaces',
    reverseArrow: true, // INTERFACE_TARGET soll umgekehrt werden
  },
  {
    type: 'HOSTED_ON',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'infrastructure',
    fieldName: 'hostedOn',
    reverseArrow: false,
  },
  {
    type: 'HAS_PARENT_APPLICATION',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'application',
    fieldName: 'parents',
    reverseArrow: false,
  },
  {
    type: 'SUCCESSOR_OF',
    direction: 'OUT',
    sourceType: 'application',
    targetType: 'application',
    fieldName: 'predecessors',
    reverseArrow: false,
  },

  // ApplicationInterface Beziehungen
  {
    type: 'INTERFACE_SOURCE',
    direction: 'IN', // umgekehrte Richtung: Interface → Application (Source)
    sourceType: 'applicationInterface',
    targetType: 'application',
    fieldName: 'sourceApplications',
    reverseArrow: false, // Pfeil läuft von Interface zu Application
  },
  {
    type: 'INTERFACE_TARGET',
    direction: 'IN', // umgekehrte Richtung: Interface → Application (Target)
    sourceType: 'applicationInterface',
    targetType: 'application',
    fieldName: 'targetApplications',
    reverseArrow: true, // Pfeil läuft von Application zu Interface
  },
  {
    type: 'TRANSFERS',
    direction: 'OUT',
    sourceType: 'applicationInterface',
    targetType: 'dataObject',
    fieldName: 'dataObjects',
    reverseArrow: true, // TRANSFERS soll umgekehrt werden
  },
  {
    type: 'SUCCESSOR_OF_INTERFACE',
    direction: 'OUT',
    sourceType: 'applicationInterface',
    targetType: 'applicationInterface',
    fieldName: 'predecessors',
    reverseArrow: false,
  },

  // Infrastructure Beziehungen
  {
    type: 'HAS_PARENT_INFRASTRUCTURE',
    direction: 'OUT',
    sourceType: 'infrastructure',
    targetType: 'infrastructure',
    fieldName: 'parentInfrastructure',
    reverseArrow: false,
  },

  // DataObject Beziehungen (umgekehrte TRANSFERS Richtung)
  {
    type: 'TRANSFERS',
    direction: 'IN', // umgekehrte Richtung
    sourceType: 'dataObject',
    targetType: 'applicationInterface',
    fieldName: 'transferredInInterfaces',
    reverseArrow: true, // TRANSFERS soll umgekehrt werden
  },
  {
    type: 'DATA_SOURCE',
    direction: 'OUT',
    sourceType: 'dataObject',
    targetType: 'application',
    fieldName: 'dataSources',
    reverseArrow: false,
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
      HAS_PARENT: 'ist Unterkategorie von',
      HAS_PARENT_APPLICATION: 'ist Komponente von',
      SUCCESSOR_OF: 'ist Nachfolger von',
      HAS_PARENT_INFRASTRUCTURE: 'ist Teil der Infrastruktur',
      SUCCESSOR_OF_INTERFACE: 'ist Nachfolger der Schnittstelle',
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
      HAS_PARENT: 'is subcategory of',
      HAS_PARENT_APPLICATION: 'is component of',
      SUCCESSOR_OF: 'is successor of',
      HAS_PARENT_INFRASTRUCTURE: 'is part of infrastructure',
      SUCCESSOR_OF_INTERFACE: 'is successor of interface',
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
