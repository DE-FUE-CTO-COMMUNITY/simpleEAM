export type EntityType = 'capability' | 'application' | 'aicomponent' | 'dataobject'

export interface EntityRef {
  id: string
  type: EntityType
}
