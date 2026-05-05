import type { CompanyScopingRule, SchemaDigestArtifact } from '../types'

export interface DigestCollectionIndexEntry {
  readonly fields: readonly string[]
  readonly relations: readonly string[]
  readonly companyScopeRuleId: string
}

export interface DigestIndex {
  readonly collections: Readonly<Record<string, DigestCollectionIndexEntry>>
  readonly enums: Readonly<Record<string, readonly string[]>>
  readonly companyScopeRules: Readonly<Record<string, CompanyScopingRule>>
}

export function parseSchemaDigest(schemaDigest: SchemaDigestArtifact): DigestIndex {
  const collections: Record<string, DigestCollectionIndexEntry> = {}

  for (const collection of schemaDigest.allowedRootQueries) {
    collections[collection.rootQuery] = {
      fields: collection.fields,
      relations: collection.relations,
      companyScopeRuleId: collection.companyScopeRuleId,
    }
  }

  for (const countQuery of schemaDigest.countQueries) {
    const rootField = countQuery.resultPath.split('.')[0] ?? 'aggregate'
    collections[countQuery.rootQuery] = {
      fields: [rootField],
      relations: [],
      companyScopeRuleId: countQuery.companyScopeRuleId,
    }
  }

  return {
    collections,
    enums: schemaDigest.enumValues,
    companyScopeRules: Object.fromEntries(
      schemaDigest.mandatoryCompanyScoping.map(rule => [rule.id, rule] as const)
    ),
  }
}
