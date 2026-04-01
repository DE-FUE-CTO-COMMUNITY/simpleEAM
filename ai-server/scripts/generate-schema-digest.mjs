#!/usr/bin/env node
/**
 * generate-schema-digest.mjs
 *
 * Introspects the live GraphQL server and generates:
 *   src/agents/data-lookup/generated-schema-digest.ts
 *
 * This file is used by the data-lookup agent as the schema reference for
 * LLM-generated GraphQL queries. Re-run this script after any schema change.
 *
 * Usage:
 *   yarn generate-schema-digest
 *
 * Prerequisites: GraphQL server must be running.
 *   Default URL: http://localhost:4500/graphql
 *   Override:    GRAPHQL_URL=http://... yarn generate-schema-digest
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const OUTPUT_PATH = resolve(__dirname, '../src/agents/data-lookup/generated-schema-digest.ts')

const GRAPHQL_URL =
  process.env.GRAPHQL_URL || process.env.GRAPHQL_INTERNAL_URL || 'http://localhost:4500/graphql'

// ─────────────────────────────────────────────────────────────────────────────
// GraphQL introspection
// ─────────────────────────────────────────────────────────────────────────────

const INTROSPECTION_QUERY = `
  query {
    __schema {
      queryType { name }
      types {
        name
        kind
        fields(includeDeprecated: false) {
          name
          type { ...TypeRef }
          args { name type { ...TypeRef } }
        }
        enumValues(includeDeprecated: false) { name }
      }
    }
  }
  fragment TypeRef on __Type {
    kind name
    ofType { kind name ofType { kind name ofType { kind name } } }
  }
`

async function introspect() {
  const resp = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: INTROSPECTION_QUERY }),
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`)
  const json = await resp.json()
  if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join('; '))
  return json.data.__schema
}

// ─────────────────────────────────────────────────────────────────────────────
// Type helpers
// ─────────────────────────────────────────────────────────────────────────────

function getNamedType(type) {
  if (!type) return null
  if (type.name) return type.name
  return getNamedType(type.ofType)
}

function isList(type) {
  if (!type) return false
  if (type.kind === 'LIST') return true
  return isList(type.ofType)
}

const BUILT_IN_SCALARS = new Set([
  'String',
  'Int',
  'Float',
  'Boolean',
  'ID',
  'Date',
  'DateTime',
  'BigInt',
])

// ─────────────────────────────────────────────────────────────────────────────
// Entity types to include in the digest (main architectural entities)
// ─────────────────────────────────────────────────────────────────────────────

const ENTITY_TYPES = new Set([
  'Application',
  'BusinessCapability',
  'ApplicationInterface',
  'DataObject',
  'Infrastructure',
  'BusinessProcess',
  'AIComponent',
  'Organisation',
  'Person',
  'Supplier',
  'Company',
  'SoftwareProduct',
  'SoftwareVersion',
  'HardwareProduct',
  'Architecture',
  'ArchitecturePrinciple',
  'GEA_Vision',
  'GEA_Mission',
  'GEA_Goal',
  'GEA_Strategy',
  'GEA_Value',
])

// Scalar fields to exclude (sovereignty detail fields, audit timestamps, raw blobs)
const SKIP_SCALAR_FIELDS = new Set([
  'createdAt',
  'updatedAt',
  'sovereigntyAchStrategicAutonomy',
  'sovereigntyAchStrategicAutonomyEvidence',
  'sovereigntyAchResilience',
  'sovereigntyAchResilienceEvidence',
  'sovereigntyAchSecurity',
  'sovereigntyAchSecurityEvidence',
  'sovereigntyAchControl',
  'sovereigntyAchControlEvidence',
  'lastSovereigntyAssessmentAt',
  'sovereigntyReqStrategicAutonomy',
  'sovereigntyReqStrategicAutonomyRationale',
  'sovereigntyReqResilience',
  'sovereigntyReqResilienceRationale',
  'sovereigntyReqSecurity',
  'sovereigntyReqSecurityRationale',
  'sovereigntyReqControl',
  'sovereigntyReqControlRationale',
  'sovereigntyReqWeight',
  'bpmnXml',
  'sbom',
  'diagramJson',
])

// Relationship fields to exclude (diagrams, architecture containers, and company scope — JWT handles company)
const SKIP_RELATION_FIELDS = new Set([
  'company',
  'owners',
  'depictedInDiagrams',
  'partOfArchitectures',
  'implementsPrinciples',
])

// Enum types to exclude (sort directions, internal Neo4j enums)
const SKIP_ENUM_NAMES = new Set(['SortDirection', 'Neo4jPopulatedByOperation'])

// ─────────────────────────────────────────────────────────────────────────────
// Digest builder
// ─────────────────────────────────────────────────────────────────────────────

function buildDigest(schema) {
  const typeMap = new Map(schema.types.map(t => [t.name, t]))

  // Query type fields → identify collection query names (return list of ENTITY_TYPES)
  const queryType = typeMap.get(schema.queryType.name)
  const collectionFields = (queryType?.fields ?? []).filter(f => {
    const named = getNamedType(f.type)
    return named && ENTITY_TYPES.has(named) && isList(f.type)
  })

  // Enum types (user-defined, non-sort, non-internal)
  const enumTypes = schema.types.filter(
    t =>
      t.kind === 'ENUM' &&
      !t.name.startsWith('__') &&
      !t.name.endsWith('Sort') &&
      !t.name.includes('OrderBy') &&
      !SKIP_ENUM_NAMES.has(t.name) &&
      (t.enumValues?.length ?? 0) > 0
  )

  const lines = []

  // ── Section 1: Collection queries with argument signatures ────────────────
  lines.push('QUERYABLE ENTITY COLLECTIONS:')
  lines.push(
    'IMPORTANT: Every query MUST include company: { some: { id: { eq: "<companyId>" } } } in the where clause to scope results to the current company.'
  )
  lines.push('')

  for (const field of collectionFields) {
    const entityTypeName = getNamedType(field.type)
    const entityType = typeMap.get(entityTypeName)
    if (!entityType) continue

    // Build argument signature from actual introspected args
    const argsList = (field.args ?? [])
      .filter(a => !['after', 'first'].includes(a.name)) // skip cursor-pagination args
      .map(a => {
        const named = getNamedType(a.type)
        if (a.name === 'limit') return 'limit: Int'
        if (a.name === 'offset') return 'offset: Int'
        if (a.name === 'sort') return `sort: [${named}!]`
        if (a.name === 'where') return `where: ${named}`
        return a.name
      })
      .join(', ')

    lines.push(`${field.name}(${argsList})`)

    // Collect scalar+enum fields
    const scalarFields = []
    const relFields = []

    for (const f of entityType.fields ?? []) {
      if (f.name === 'id' || f.name.endsWith('Connection')) continue
      if (SKIP_SCALAR_FIELDS.has(f.name)) continue
      if (SKIP_RELATION_FIELDS.has(f.name)) continue

      const namedType = getNamedType(f.type)
      if (!namedType) continue
      const typeInfo = typeMap.get(namedType)

      const isBuiltInScalar = BUILT_IN_SCALARS.has(namedType)
      const isEnum = typeInfo?.kind === 'ENUM'

      if (isBuiltInScalar) {
        scalarFields.push(f.name)
      } else if (isEnum) {
        scalarFields.push(`${f.name}(${namedType})`)
      } else if (typeInfo?.kind === 'OBJECT' && ENTITY_TYPES.has(namedType)) {
        const arrow = isList(f.type) ? `[${namedType}]` : `→${namedType}`
        relFields.push(`${f.name}${arrow}`)
      }
    }

    lines.push(`  FIELDS: id ${scalarFields.join(' ')}`)
    if (relFields.length > 0) {
      lines.push(`  RELATIONS: ${relFields.join('  ')}`)
    }
    lines.push('')
  }

  // ── Section 2: Count queries ───────────────────────────────────────────────
  const connectionFieldNames = new Set((queryType?.fields ?? []).map(f => f.name))
  lines.push('COUNT QUERIES (returns integer totals, no data):')
  for (const field of collectionFields) {
    const connName = `${field.name}Connection`
    if (connectionFieldNames.has(connName)) {
      lines.push(`  ${connName}(where: ...) { aggregate { count { nodes } } }`)
    }
  }
  lines.push('')

  // ── Section 3: Filter syntax (static, correct) ────────────────────────────
  lines.push(`FILTER SYNTAX (all values inline — do NOT use $variables):
  String:    { name: { contains: "CRM" } }  or  { name: { eq: "ExactName" } }  or  { name: { startsWith: "A" } }
  Enum eq:   { status: { eq: ACTIVE } }                   ← no quotes around enum values
  Enum in:   { status: { in: [ACTIVE, PLANNED] } }
  Null:      { description: { isNull: false } }
  Relation:  { supportsCapabilities: { some: { name: { contains: "CRM" } } } }
             { supportedByApplications: { none: {} } }    ← gap/absence queries
             { dataObjects: { some: { classification: { eq: CONFIDENTIAL } } } }
  AND / OR:  { AND: [{ status: { eq: ACTIVE } }, { criticality: { eq: HIGH } }] }
             { OR:  [{ name: { contains: "ERP" } }, { name: { contains: "SAP" } }] }`)
  lines.push('')

  // ── Section 4: Pagination & sort ──────────────────────────────────────────
  lines.push(`PAGINATION AND SORT:
  limit: 50                          ← set a limit to avoid huge responses (default: 50)
  sort: [{ fieldName: ASC }]         ← sort by any scalar field; direction: ASC or DESC
  offset: 0                          ← for pagination`)
  lines.push('')

  // ── Section 5: Enum values (generated) ────────────────────────────────────
  lines.push('ENUM VALUES:')
  for (const enumType of enumTypes) {
    lines.push(`  ${enumType.name}: ${enumType.enumValues.map(v => v.name).join(' | ')}`)
  }
  lines.push('')

  // ── Section 6: Working examples (static, correct) ─────────────────────────
  lines.push(`EXAMPLE QUERIES:

# List all business capabilities:
query {
  businessCapabilities(limit: 50, sort: [{ name: ASC }]) {
    id name description status maturityLevel
    supportedByApplications { id name status }
  }
}

# Applications supporting a specific capability and hosted on a specific infrastructure:
query {
  applications(where: {
    supportsCapabilities: { some: { name: { contains: "Customer Management" } } }
    hostedOn: { some: { name: { contains: "AWS" } } }
  }, limit: 50) {
    id name status criticality
    supportsCapabilities { id name }
    hostedOn { id name infrastructureType }
  }
}

# Interfaces transferring CONFIDENTIAL data with source and target applications:
query {
  applicationInterfaces(where: {
    dataObjects: { some: { classification: { eq: CONFIDENTIAL } } }
  }, limit: 50) {
    id name interfaceType status
    sourceApplications { id name }
    targetApplications { id name }
    dataObjects { id name classification }
  }
}

# Capabilities not supported by any application (gap analysis):
query {
  businessCapabilities(where: {
    supportedByApplications: { none: {} }
    status: { eq: ACTIVE }
  }, limit: 50) {
    id name description maturityLevel
  }
}

# Count active applications:
query {
  applicationsConnection(where: { status: { eq: ACTIVE } }) {
    aggregate { count { nodes } }
  }
}`)

  return lines.join('\n')
}

// ─────────────────────────────────────────────────────────────────────────────
// TypeScript file generator
// ─────────────────────────────────────────────────────────────────────────────

function generateTs(digest, sourceUrl) {
  return `// ─────────────────────────────────────────────────────────────────────────────
// AUTO-GENERATED — do not edit manually.
// Run \`yarn generate-schema-digest\` after schema changes.
// Source: ${sourceUrl}
// Generated: ${new Date().toISOString()}
// ─────────────────────────────────────────────────────────────────────────────

export const SCHEMA_DIGEST = \`
${digest}
\`.trim()
`
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

console.log(`[generate-schema-digest] Introspecting: ${GRAPHQL_URL}`)

try {
  const schema = await introspect()
  const digest = buildDigest(schema)
  const output = generateTs(digest, GRAPHQL_URL)
  writeFileSync(OUTPUT_PATH, output, 'utf-8')

  const lineCount = digest.split('\n').length
  console.log(`[generate-schema-digest] ✓ Written ${lineCount} lines → ${OUTPUT_PATH}`)

  // Print first 40 lines as preview
  const preview = digest.split('\n').slice(0, 40).join('\n')
  console.log('\n--- Preview ---\n' + preview + (lineCount > 40 ? '\n...' : ''))
} catch (err) {
  console.error('[generate-schema-digest] Error:', err.message)
  process.exit(1)
}
