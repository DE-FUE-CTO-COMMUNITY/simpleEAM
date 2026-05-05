import { z } from 'zod'

import {
  clarificationSchema,
  entityFiltersSchema,
  entityHintByDescriptionSchema,
  entityHintByFiltersSchema,
  entityHintByNameSchema,
  entityHintSchema,
  entityTypeSchema,
  intentSchema,
  planSchema,
  supportedLocaleSchema,
} from './plan.schema'

export type SupportedLocale = z.infer<typeof supportedLocaleSchema>
export type Intent = z.infer<typeof intentSchema>
export type EntityType = z.infer<typeof entityTypeSchema>
export type EntityFilters = z.infer<typeof entityFiltersSchema>
export type EntityHintByName = z.infer<typeof entityHintByNameSchema>
export type EntityHintByFilters = z.infer<typeof entityHintByFiltersSchema>
export type EntityHintByDescription = z.infer<typeof entityHintByDescriptionSchema>
export type EntityHint = z.infer<typeof entityHintSchema>
export type Clarification = z.infer<typeof clarificationSchema>
export type Plan = z.infer<typeof planSchema>

export {
  clarificationSchema,
  entityFiltersSchema,
  entityHintByDescriptionSchema,
  entityHintByFiltersSchema,
  entityHintByNameSchema,
  entityHintSchema,
  entityTypeSchema,
  intentSchema,
  planSchema,
  supportedLocaleSchema,
}
