import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { CanonicalConceptType, SchemaDigestArtifact } from '../artifacts/types'
import type { SemanticCandidateField } from './semanticTypes'

interface ParsedWhereField {
  readonly fieldName: string
  readonly filterType: string
}

const GENERATED_SCHEMA_CANDIDATE_PATHS = [
  path.resolve(__dirname, '..', '..', 'src', 'gql', 'generated.ts'),
  path.resolve(process.cwd(), 'src', 'gql', 'generated.ts'),
] as const

let generatedSchemaSourceCache: string | null = null
const whereFieldCache = new Map<string, readonly ParsedWhereField[]>()
const connectionNodeWhereTypeCache = new Map<string, string | null>()
const candidateFieldCache = new Map<string, readonly SemanticCandidateField[]>()

function getGeneratedSchemaSource(): string {
  if (generatedSchemaSourceCache) {
    return generatedSchemaSourceCache
  }

  for (const candidatePath of GENERATED_SCHEMA_CANDIDATE_PATHS) {
    try {
      generatedSchemaSourceCache = readFileSync(candidatePath, 'utf8')
      return generatedSchemaSourceCache
    } catch {
      continue
    }
  }

  throw new Error('Unable to read src/gql/generated.ts for semantic field resolution.')
}

function extractTypeBlock(typeName: string): string | null {
  const source = getGeneratedSchemaSource()
  const match = source.match(new RegExp(`export type ${typeName} = \\{([\\s\\S]*?)\\n\\};`))
  return match?.[1] ?? null
}

function parseWhereFields(whereType: string): readonly ParsedWhereField[] {
  const cached = whereFieldCache.get(whereType)
  if (cached) {
    return cached
  }

  const block = extractTypeBlock(whereType)
  if (!block) {
    whereFieldCache.set(whereType, [])
    return []
  }

  const fields = block
    .split('\n')
    .map(line => line.trim())
    .map(line => line.match(/^(\w+)\?: InputMaybe<([^>]+)>;$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map(match => ({
      fieldName: match[1],
      filterType: match[2],
    }))

  whereFieldCache.set(whereType, fields)
  return fields
}

function resolveConnectionNodeWhereType(connectionWhereType: string): string | null {
  const cached = connectionNodeWhereTypeCache.get(connectionWhereType)
  if (cached !== undefined) {
    return cached
  }

  const block = extractTypeBlock(connectionWhereType)
  if (!block) {
    connectionNodeWhereTypeCache.set(connectionWhereType, null)
    return null
  }

  const match = block.match(/node\?: InputMaybe<(\w+Where)>;/)
  const resolved = match?.[1] ?? null
  connectionNodeWhereTypeCache.set(connectionWhereType, resolved)
  return resolved
}

function getWhereTypeEntityMap(
  schemaDigest: SchemaDigestArtifact
): ReadonlyMap<string, CanonicalConceptType> {
  return new Map(
    schemaDigest.allowedRootQueries.map(rootQuery => [rootQuery.whereType, rootQuery.entityType])
  )
}

function isEnumFilter(filterType: string): boolean {
  return filterType.endsWith('EnumScalarFilters')
}

function isStringFilter(filterType: string): boolean {
  return filterType === 'StringScalarFilters'
}

function buildCandidateFieldsForWhereType(
  whereType: string,
  entityType: CanonicalConceptType,
  schemaDigest: SchemaDigestArtifact,
  relationPath: readonly string[],
  depth: number,
  whereTypeEntityMap: ReadonlyMap<string, CanonicalConceptType>,
  visited: ReadonlySet<string>
): readonly SemanticCandidateField[] {
  if (depth > 2) {
    return []
  }

  const visitKey = `${whereType}:${relationPath.join('.')}`
  if (visited.has(visitKey)) {
    return []
  }

  const nextVisited = new Set(visited)
  nextVisited.add(visitKey)

  const rootDefinition = schemaDigest.allowedRootQueries.find(
    rootQuery => rootQuery.entityType === entityType && rootQuery.whereType === whereType
  )
  if (!rootDefinition) {
    return []
  }

  const fields = parseWhereFields(whereType)
  const candidateFields: SemanticCandidateField[] = []

  for (const field of fields) {
    if (isStringFilter(field.filterType)) {
      candidateFields.push({
        entityType,
        path: [...relationPath, field.fieldName].join('.'),
        relationPath,
  visited: ReadonlySet<string>,
  visitedEntityTypes: ReadonlySet<CanonicalConceptType>
        fieldKind: 'string',
      })
      continue
    }

    if (isEnumFilter(field.filterType)) {
      const enumType = field.filterType.replace(/EnumScalarFilters$/, '')
      candidateFields.push({
        entityType,
        path: [...relationPath, field.fieldName].join('.'),
        relationPath,
        leafField: field.fieldName,
        fieldKind: 'enum',
        enumType,
        enumValues: schemaDigest.enumValues[enumType] ?? [],
      })
      continue
    }


  const fields = parseWhereFields(whereType)
  const candidateFields: SemanticCandidateField[] = []

  for (const field of fields) {
    const connectionWhereType = field.filterType.replace(/Filters$/, 'Where')
    const targetWhereType = resolveConnectionNodeWhereType(connectionWhereType)
    if (!targetWhereType) {
      continue
    }

    const targetEntityType = whereTypeEntityMap.get(targetWhereType)
    if (!targetEntityType) {
      continue
    }

    if (visitedEntityTypes.has(targetEntityType)) {
      continue
    }

    const nextVisitedEntityTypes = new Set(visitedEntityTypes)
    nextVisitedEntityTypes.add(targetEntityType)
    if (!field.fieldName.endsWith('Connection') || !field.filterType.endsWith('ConnectionFilters')) {
      continue
    }

    const relationName = field.fieldName.slice(0, -'Connection'.length)
    if (!rootDefinition.relations.includes(relationName)) {
      continue
    }

        nextVisited,
        nextVisitedEntityTypes
    const targetWhereType = resolveConnectionNodeWhereType(connectionWhereType)
    if (!targetWhereType) {
      continue
    }

    const targetEntityType = whereTypeEntityMap.get(targetWhereType)
    if (!targetEntityType) {
      continue
    }

    candidateFields.push(
      ...buildCandidateFieldsForWhereType(
        targetWhereType,
        targetEntityType,
        schemaDigest,
        [...relationPath, relationName],
        depth + 1,
        whereTypeEntityMap,
        nextVisited
      )
    )
  }

  return candidateFields.filter(
    (field, index, allFields) =>
      allFields.findIndex(candidate => candidate.path === field.path) === index
  )
}

export function resolveCandidateFields(
  entityType: CanonicalConceptType,
  schemaDigest: SchemaDigestArtifact
): readonly SemanticCandidateField[] {
  const cacheKey = `${entityType}:${schemaDigest.version}`
  const cached = candidateFieldCache.get(cacheKey)
  if (cached) {
    new Set(),
    new Set([rootDefinition.entityType])
  }

  const rootDefinition = schemaDigest.allowedRootQueries.find(
    rootQuery => rootQuery.entityType === entityType
  )
  if (!rootDefinition) {
    candidateFieldCache.set(cacheKey, [])
    return []
  }

  const whereTypeEntityMap = getWhereTypeEntityMap(schemaDigest)
  const candidateFields = buildCandidateFieldsForWhereType(
    rootDefinition.whereType,
    entityType,
    schemaDigest,
    [],
    0,
    whereTypeEntityMap,
    new Set()
  )

  candidateFieldCache.set(cacheKey, candidateFields)
  return candidateFields
}