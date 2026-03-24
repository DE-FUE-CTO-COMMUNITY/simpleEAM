export type EntityType =
  | 'capability'
  | 'application'
  | 'aicomponent'
  | 'dataobject'
  | 'infrastructure'

export interface EntityRef {
  id: string
  type: EntityType
}
