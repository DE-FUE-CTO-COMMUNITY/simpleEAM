import { z } from 'zod'

export const supportedLocaleSchema = z.enum(['de', 'en', 'fr'])

export const intentSchema = z.enum([
  'FACT_LOOKUP',
  'IMPACT_ANALYSIS',
  'DEPENDENCY_EXPLORATION',
  'STRATEGIC_ENRICHMENT',
  'ENTITY_IDENTIFICATION',
])

export const entityTypeSchema = z.enum([
  'BusinessCapability',
  'BusinessProcess',
  'GEA_Vision',
  'GEA_Mission',
  'GEA_Value',
  'GEA_Goal',
  'GEA_Strategy',
  'AiRun',
  'AiRunAuditEvent',
  'AgentConfig',
  'Person',
  'ReportFolder',
  'AnalyticsReport',
  'Supplier',
  'Application',
  'ApplicationInterface',
  'DataObject',
  'Infrastructure',
  'SoftwareProduct',
  'SoftwareVersion',
  'HardwareProduct',
  'HardwareVersion',
  'ProductFamily',
  'SbomDocument',
  'LifecycleRecord',
  'AIComponent',
  'Company',
  'Organisation',
  'Architecture',
  'Diagram',
  'ArchitecturePrinciple',
])

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue }

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ])
)

export const entityFiltersSchema = z
  .record(z.string(), jsonValueSchema)
  .refine(value => Object.keys(value).length > 0, {
    message: 'entityHint.filters must contain at least one filter',
  })

export const entityHintByNameSchema = z
  .object({
    entityType: entityTypeSchema,
    name: z.string().trim().min(1),
  })
  .strict()

export const entityHintByFiltersSchema = z
  .object({
    entityType: entityTypeSchema,
    filters: entityFiltersSchema,
  })
  .strict()

export const entityHintByDescriptionSchema = z
  .object({
    entityType: entityTypeSchema,
    description: z.string().trim().min(1),
  })
  .strict()

export const entityHintSchema = z.union([
  entityHintByNameSchema,
  entityHintByFiltersSchema,
  entityHintByDescriptionSchema,
])

export const clarificationSchema = z
  .object({
    question: z.string().trim().min(1),
    reason: z.string().trim().min(1),
    isRequired: z.boolean().default(true),
  })
  .strict()

export const planSchema = z
  .object({
    intent: intentSchema,
    entityHint: entityHintSchema.optional(),
    clarification: clarificationSchema.nullish(),
  })
  .strict()
