import { DataClassification } from '../../gql/generated'

/**
 * Vereinfachte Version des Owner-Typs für Beispieldaten
 */
export interface SimplePerson {
  id: string
  firstName: string
  lastName: string
}

/**
 * Erweiterter Typ für DataObjects mit zusätzlichen Feldern oder angepassten Typen
 */
export interface DataObject {
  id: string
  name: string
  description?: string | null
  classification: DataClassification
  format?: string | null
  source?: string | null
  owners: SimplePerson[]
  createdAt: string
  updatedAt?: string | null
}

/**
 * Typ für Formulareingaben für DataObjects
 */
export interface DataObjectFormValues {
  name: string
  description?: string
  classification: DataClassification
  format?: string
  source?: string
  ownerId?: string
}

/**
 * Filter State für DataObjects
 */
export interface FilterState {
  classificationFilter: DataClassification[]
  formatFilter: string[]
  sourceFilter: string[]
  descriptionFilter: string
  ownerFilter: string
  updatedDateRange: [string, string]
}
