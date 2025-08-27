// Template für Entity Types
// Platzhalter: {{ENTITY_NAME}}, {{ENTITY_SINGULAR}}, {{ENTITY_UPPER}}, {{ENTITY_SINGULAR_UPPER}}

import { z } from 'zod'
import { {{ENTITY_SINGULAR_UPPER}} } from '../../gql/generated'

// GraphQL generierter Typ erweitern
export type {{ENTITY_SINGULAR_UPPER}}Type = {{ENTITY_SINGULAR_UPPER}}

// Formular-Validierungsschema mit Zod
export const {{ENTITY_SINGULAR}}FormSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  description: z.string().optional(),
  // TODO: Weitere feldspezifische Validierungen hinzufügen
})

// Formular-Werte-Typ
export type {{ENTITY_SINGULAR_UPPER}}FormValues = z.infer<typeof {{ENTITY_SINGULAR}}FormSchema>

// Filter-State für die Suche und Filterung
export interface {{ENTITY_SINGULAR_UPPER}}FilterState {
  search: string
  // TODO: Weitere Filter hinzufügen (z.B. status, category, etc.)
}

// Standard-Filterwerte
export const default{{ENTITY_SINGULAR_UPPER}}Filter: {{ENTITY_SINGULAR_UPPER}}FilterState = {
  search: '',
}
