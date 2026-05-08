import type { CanonicalConceptType, SchemaDigestArtifact } from '../artifacts/types'
import { resolveCandidateFields } from './semanticFieldResolver'
import type {
  SemanticAmbiguity,
  SemanticCandidateField,
  SemanticConstraint,
  SemanticExtractionResult,
} from './semanticTypes'

interface SemanticFieldMatch {
  readonly constraint: SemanticConstraint
  readonly score: number
  readonly phrase: string
  readonly field: SemanticCandidateField
}

const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'applications',
  'application',
  'are',
  'by',
  'capabilities',
  'capability',
  'data',
  'de',
  'des',
  'do',
  'does',
  'en',
  'for',
  'have',
  'how',
  'in',
  'interfaces',
  'interface',
  'is',
  'les',
  'list',
  'me',
  'on',
  'or',
  'run',
  'running',
  'runs',
  'show',
  'supported',
  'supporting',
  'supports',
  'that',
  'the',
  'these',
  'those',
  'use',
  'used',
  'uses',
  'using',
  'what',
  'which',
  'with',
])

function normalizeText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function singularizeToken(token: string): string {
  if (/ies$/i.test(token)) {
    return `${token.slice(0, -3)}y`
  }

  if (/sses$/i.test(token) || /ches$/i.test(token) || /shes$/i.test(token)) {
    return token.slice(0, -2)
  }

  if (/s$/i.test(token) && token.length > 3) {
    return token.slice(0, -1)
  }

  return token
}

function normalizeEnumValue(value: string): string {
  return normalizeText(value.replace(/_/g, ' ')).split(' ').map(singularizeToken).join(' ')
}

function stemToken(token: string): string {
  return singularizeToken(token.replace(/(ing|ed)$/i, ''))
}

function splitPathTokens(value: string): readonly string[] {
  return normalizeText(value)
    .split(' ')
    .flatMap(token => token.split('_'))
    .map(stemToken)
    .filter(Boolean)
}

function isContextualField(fieldName: string): boolean {
  return /(type|status|environment|location|classification|protocol|format|category|vendor|version)/i.test(
    fieldName
  )
}

function isLocativeField(fieldName: string): boolean {
  return /(environment|type|platform|host|region|zone|infrastructure)/i.test(fieldName)
}

function isGeographicField(fieldName: string): boolean {
  return /(location|region|zone|country|site)/i.test(fieldName)
}

function isOperatingSystemField(fieldName: string): boolean {
  return /operatingSystem/i.test(fieldName)
}

function isProviderField(fieldName: string): boolean {
  return /(vendor|provider|supplier|manufacturer)/i.test(fieldName)
}

function isLifecycleField(fieldName: string): boolean {
  return /(version|release)/i.test(fieldName)
}

function hasLocativeCue(tokens: readonly string[]): boolean {
  return tokens.some(token =>
    ['in', 'on', 'at', 'run', 'runs', 'running', 'hosted'].includes(token)
  )
}

function hasAssociationCue(tokens: readonly string[]): boolean {
  return tokens.some(token =>
    [
      'use',
      'uses',
      'using',
      'support',
      'supports',
      'supported',
      'provided',
      'source',
      'target',
    ].includes(token)
  )
}

function hasSupportCue(tokens: readonly string[]): boolean {
  return tokens.some(token => ['support', 'supports', 'supported', 'supporting'].includes(token))
}

function hasApplicationCue(tokens: readonly string[]): boolean {
  return tokens.some(token => ['application', 'applications', 'app', 'apps'].includes(token))
}

function hasInterfaceCue(tokens: readonly string[]): boolean {
  return tokens.some(token => ['interface', 'interfaces', 'schnittstelle', 'schnittstellen'].includes(token))
}

function hasUsageCue(tokens: readonly string[]): boolean {
  return tokens.some(token => ['use', 'uses', 'using', 'used'].includes(token))
}

function hasSourceCue(tokens: readonly string[]): boolean {
  return tokens.some(token => ['source', 'sources', 'provides', 'provided', 'produces', 'producer'].includes(token))
}

function isInterfaceRelationPath(relationPath: readonly string[]): boolean {
  return relationPath.some(segment => /interfaces?/i.test(segment))
}

function isDirectDataObjectRelationPath(relationPath: readonly string[]): boolean {
  return relationPath.some(segment => ['usesDataObjects', 'isDataSourceFor'].includes(segment))
}

function isUsesDataObjectsPath(relationPath: readonly string[]): boolean {
  return relationPath.includes('usesDataObjects')
}

function isDataSourcePath(relationPath: readonly string[]): boolean {
  return relationPath.includes('isDataSourceFor')
}

function isSupportedByApplicationsPath(relationPath: readonly string[]): boolean {
  return relationPath[0] === 'supportedByApplications'
}

function isDirectCapabilityDataObjectPath(relationPath: readonly string[]): boolean {
  return relationPath.length === 1 && relationPath[0] === 'relatedDataObjects'
}

function hasGeographicCue(tokens: readonly string[]): boolean {
  return tokens.some(token => ['location', 'located', 'region', 'country', 'site', 'where'].includes(token))
}

function hasOperatingSystemCue(tokens: readonly string[]): boolean {
  return tokens.some(token =>
    ['os', 'operating', 'system', 'linux', 'windows', 'ubuntu', 'rhel'].includes(token)
  )
}

function trimStopwords(tokens: readonly string[]): readonly string[] {
  let start = 0
  let end = tokens.length

  while (start < end && STOPWORDS.has(tokens[start])) {
    start += 1
  }

  while (end > start && STOPWORDS.has(tokens[end - 1])) {
    end -= 1
  }

  return tokens.slice(start, end)
}

function buildPhraseCandidates(tokens: readonly string[]): readonly string[] {
  const phrases: string[] = []

  for (let size = Math.min(tokens.length, 5); size >= 1; size -= 1) {
    for (let start = 0; start <= tokens.length - size; start += 1) {
      const trimmedTokens = trimStopwords(tokens.slice(start, start + size))
      if (trimmedTokens.length === 0) {
        continue
      }

      if (trimmedTokens.every(token => STOPWORDS.has(token))) {
        continue
      }

      const phrase = trimmedTokens.join(' ')
      if (!phrase || STOPWORDS.has(phrase)) {
        continue
      }

      phrases.push(phrase)
    }
  }

  return phrases.filter((phrase, index) => phrases.indexOf(phrase) === index)
}

function buildEqConstraint(
  entityType: CanonicalConceptType,
  path: string,
  value: string
): SemanticConstraint {
  return {
    entityType,
    path,
    operator: 'eq',
    value,
  }
}

function buildContainsConstraint(
  entityType: CanonicalConceptType,
  path: string,
  value: string
): SemanticConstraint {
  return {
    entityType,
    path,
    operator: 'contains',
    value,
  }
}

const GENERIC_DEPLOYMENT_NOUNS = new Set([
  'cloud',
  'cluster',
  'clusters',
  'platform',
  'platforms',
  'server',
  'servers',
  'datacenter',
  'datacenters',
  'data center',
  'data centers',
])

function normalizeStringConstraintValue(phrase: string, field: SemanticCandidateField): string {
  if (!isLocativeField(field.leafField) && field.relationPath.length === 0) {
    return phrase
  }

  const normalizedPhrase = normalizeText(phrase)
  const phraseTokens = normalizedPhrase.split(' ').filter(Boolean)
  if (phraseTokens.length < 2) {
    return phrase
  }

  const trimmedTokens = [...phraseTokens]
  while (trimmedTokens.length > 1) {
    const lastToken = trimmedTokens[trimmedTokens.length - 1]
    const lastTwoTokens = trimmedTokens.slice(-2).join(' ')
    if (GENERIC_DEPLOYMENT_NOUNS.has(lastTwoTokens)) {
      trimmedTokens.splice(-2, 2)
      continue
    }
    if (GENERIC_DEPLOYMENT_NOUNS.has(lastToken)) {
      trimmedTokens.pop()
      continue
    }
    break
  }

  return trimmedTokens.length > 0 ? trimmedTokens.join(' ') : phrase
}

function scoreFieldMatch(
  phrase: string,
  tokens: readonly string[],
  field: SemanticCandidateField
): SemanticFieldMatch | null {
  const phraseTokens = phrase.split(' ').map(stemToken)
  const stemmedUserTokens = tokens.map(stemToken)
  const interfaceCue = hasInterfaceCue(tokens)
  const usageCue = hasUsageCue(tokens)
  const sourceCue = hasSourceCue(tokens)
  const supportCue = hasSupportCue(tokens)
  const applicationCue = hasApplicationCue(tokens)
  const supportedApplicationCue = supportCue && applicationCue

  if (field.fieldKind === 'enum' && field.enumValues) {
    for (const enumValue of field.enumValues) {
      const normalizedEnumValue = normalizeEnumValue(enumValue)
      const normalizedPhrase = normalizeEnumValue(phrase)

      if (!normalizedPhrase) {
        continue
      }

      if (normalizedPhrase === normalizedEnumValue) {
        let score = 100 - field.relationPath.length * 18
        if (interfaceCue) {
          score += isInterfaceRelationPath(field.relationPath) ? 34 : -24
        }
        if (usageCue) {
          score += isUsesDataObjectsPath(field.relationPath)
            ? 16
            : isDataSourcePath(field.relationPath)
              ? -14
              : isDirectDataObjectRelationPath(field.relationPath)
                ? 6
                : 0
        }
        if (sourceCue) {
          score += isDataSourcePath(field.relationPath) ? 16 : isUsesDataObjectsPath(field.relationPath) ? -12 : 0
        }
        if (supportedApplicationCue) {
          score += isSupportedByApplicationsPath(field.relationPath)
            ? 24
            : isDirectCapabilityDataObjectPath(field.relationPath)
              ? -20
              : 0
        }

        return {
          constraint: buildEqConstraint(field.entityType, field.path, enumValue),
          score,
          phrase,
          field,
        }
      }

      if (
        normalizedPhrase.length > 2 &&
        normalizedEnumValue.includes(normalizedPhrase) &&
        phraseTokens.length > 1
      ) {
        let score = 70 - field.relationPath.length * 18
        if (interfaceCue) {
          score += isInterfaceRelationPath(field.relationPath) ? 34 : -24
        }
        if (usageCue) {
          score += isUsesDataObjectsPath(field.relationPath)
            ? 16
            : isDataSourcePath(field.relationPath)
              ? -14
              : isDirectDataObjectRelationPath(field.relationPath)
                ? 6
                : 0
        }
        if (sourceCue) {
          score += isDataSourcePath(field.relationPath) ? 16 : isUsesDataObjectsPath(field.relationPath) ? -12 : 0
        }
        if (supportedApplicationCue) {
          score += isSupportedByApplicationsPath(field.relationPath)
            ? 24
            : isDirectCapabilityDataObjectPath(field.relationPath)
              ? -20
              : 0
        }

        return {
          constraint: buildEqConstraint(field.entityType, field.path, enumValue),
          score,
          phrase,
          field,
        }
      }
    }
  }

  if (field.fieldKind !== 'string') {
    return null
  }

  let score = 35
  const locativeCue = hasLocativeCue(tokens)
  const associationCue = hasAssociationCue(tokens)
  const geographicCue = hasGeographicCue(tokens)
  const operatingSystemCue = hasOperatingSystemCue(tokens)

  if (field.relationPath.length === 1) {
    score += 12
  } else if (field.relationPath.length >= 2) {
    score += 2
  }

  if (field.leafField === 'name') {
    if (associationCue && field.relationPath.length <= 1) {
      score += 16
    } else if (locativeCue) {
      score += field.relationPath.length === 1 ? 2 : -10
    } else {
      score += field.relationPath.length <= 1 ? 10 : -4
    }
  }

  if (isLocativeField(field.leafField)) {
    score += locativeCue ? 28 : 10
  } else if (isGeographicField(field.leafField)) {
    score += geographicCue ? 18 : locativeCue ? -8 : 4
  } else if (isOperatingSystemField(field.leafField)) {
    score += operatingSystemCue ? 20 : locativeCue ? -16 : -6
  } else if (isProviderField(field.leafField)) {
    score += associationCue ? 8 : -10
  } else if (isLifecycleField(field.leafField)) {
    score -= locativeCue ? 12 : 4
  } else if (isContextualField(field.leafField)) {
    score += locativeCue ? 10 : 6
  }

  if (field.leafField === 'description') {
    score -= 20
  }

  if (field.relationPath.length === 0 && field.leafField === 'name') {
    score -= 15
  }

  if (new Set(field.relationPath).size !== field.relationPath.length) {
    score -= 8
  }

  if (interfaceCue) {
    score += isInterfaceRelationPath(field.relationPath) ? 28 : -18
  }

  if (usageCue) {
    score += isUsesDataObjectsPath(field.relationPath)
      ? 12
      : isDataSourcePath(field.relationPath)
        ? -10
        : isDirectDataObjectRelationPath(field.relationPath)
          ? 4
          : 0
  }

  if (sourceCue) {
    score += isDataSourcePath(field.relationPath) ? 12 : isUsesDataObjectsPath(field.relationPath) ? -10 : 0
  }

  if (supportedApplicationCue) {
    score += isSupportedByApplicationsPath(field.relationPath)
      ? 18
      : isDirectCapabilityDataObjectPath(field.relationPath)
        ? -16
        : 0
  }

  const leafTokens = splitPathTokens(field.leafField)
  const relationHeadTokens = field.relationPath.length > 0 ? splitPathTokens(field.relationPath[0]) : []
  const leafOverlapCount = leafTokens.filter(token => stemmedUserTokens.includes(token)).length
  const relationHeadOverlapCount = relationHeadTokens.filter(token =>
    stemmedUserTokens.includes(token)
  ).length
  score += leafOverlapCount * 10
  score += Math.min(relationHeadOverlapCount, 1) * 4

  return {
    constraint: buildContainsConstraint(
      field.entityType,
      field.path,
      normalizeStringConstraintValue(phrase, field)
    ),
    score,
    phrase,
    field,
  }
}

export function matchValueToField(
  userTokens: readonly string[],
  candidateFields: readonly SemanticCandidateField[]
): readonly SemanticFieldMatch[] {
  const phrases = buildPhraseCandidates(userTokens)
  const matches = phrases.flatMap(phrase =>
    candidateFields
      .map(field => scoreFieldMatch(phrase, userTokens, field))
      .filter((match): match is SemanticFieldMatch => Boolean(match))
  )

  return matches.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score
    }

    if (right.phrase.length !== left.phrase.length) {
      return right.phrase.length - left.phrase.length
    }

    return left.constraint.path.localeCompare(right.constraint.path)
  })
}

function areOrCompatible(matches: readonly SemanticFieldMatch[]): boolean {
  if (matches.length === 0) {
    return false
  }

  const [firstMatch] = matches
  const firstSegments = firstMatch.constraint.path.split('.')
  if (firstSegments.length < 2) {
    return false
  }

  const tail = firstSegments.slice(1).join('.')
  return matches.every(match => {
    const segments = match.constraint.path.split('.')
    return (
      match.constraint.operator === firstMatch.constraint.operator &&
      match.constraint.value === firstMatch.constraint.value &&
      segments.length === firstSegments.length &&
      segments.slice(1).join('.') === tail
    )
  })
}

function buildAmbiguity(
  entityType: CanonicalConceptType,
  phrase: string,
  matches: readonly SemanticFieldMatch[]
): SemanticAmbiguity {
  return {
    entityType,
    value: phrase,
    candidatePaths: matches.map(match => match.constraint.path),
  }
}

export function extractConstraints(
  userInput: string,
  entityType: CanonicalConceptType,
  schemaDigest: SchemaDigestArtifact
): SemanticExtractionResult {
  const normalizedText = normalizeText(userInput)
  const tokens = normalizedText ? normalizedText.split(' ') : []
  const candidateFields = resolveCandidateFields(entityType, schemaDigest)
  const matches = matchValueToField(tokens, candidateFields)

  if (matches.length === 0) {
    return { constraints: [], ambiguities: [] }
  }

  const [topMatch] = matches
  const competingMatches = matches.filter(
    match => match.score === topMatch.score && match.phrase === topMatch.phrase
  )

  if (competingMatches.length > 1 && !areOrCompatible(competingMatches)) {
    return {
      constraints: [],
      ambiguities: [buildAmbiguity(entityType, topMatch.phrase, competingMatches)],
    }
  }

  const selectedMatches = competingMatches.length > 1 ? competingMatches : [topMatch]

  return {
    constraints: selectedMatches.map(match => match.constraint),
    ambiguities: [],
  }
}
