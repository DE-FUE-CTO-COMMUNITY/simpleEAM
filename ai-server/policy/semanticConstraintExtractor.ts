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
  return normalizeText(value.replace(/_/g, ' '))
    .split(' ')
    .map(singularizeToken)
    .join(' ')
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

function hasLocativeCue(tokens: readonly string[]): boolean {
  return tokens.some(token => ['in', 'on', 'at', 'run', 'runs', 'running', 'hosted'].includes(token))
}

function hasAssociationCue(tokens: readonly string[]): boolean {
  return tokens.some(token =>
    ['use', 'uses', 'using', 'support', 'supports', 'supported', 'provided', 'source', 'target'].includes(
      token
    )
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

function scoreFieldMatch(
  phrase: string,
  tokens: readonly string[],
  field: SemanticCandidateField
): SemanticFieldMatch | null {
  const phraseTokens = phrase.split(' ').map(stemToken)
  const stemmedUserTokens = tokens.map(stemToken)

  if (field.fieldKind === 'enum' && field.enumValues) {
    for (const enumValue of field.enumValues) {
      const normalizedEnumValue = normalizeEnumValue(enumValue)
      const normalizedPhrase = normalizeEnumValue(phrase)

      if (!normalizedPhrase) {
        continue
      }

      if (normalizedPhrase === normalizedEnumValue) {
        return {
          constraint: buildEqConstraint(field.entityType, field.path, enumValue),
          score: 100 - field.relationPath.length * 12,
          phrase,
          field,
        }
      }

      if (
        normalizedPhrase.length > 2 &&
        normalizedEnumValue.includes(normalizedPhrase) &&
        phraseTokens.length > 1
      ) {
        return {
          constraint: buildEqConstraint(field.entityType, field.path, enumValue),
          score: 70 - field.relationPath.length * 12,
          phrase,
          field,
        }
      }
      let score = 35 - field.relationPath.length * 10
    }
  }

  if (field.fieldKind !== 'string') {
    return null
  }

  let score = 35
  const locativeCue = hasLocativeCue(tokens)
  const associationCue = hasAssociationCue(tokens)

  if (field.relationPath.length > 0) {
    score += 8 + field.relationPath.length * 4
  }

  if (field.leafField === 'name') {
    score += associationCue ? 18 : locativeCue ? 6 : 12
  }

  if (isContextualField(field.leafField)) {
    score += locativeCue ? 18 : 8
  }

  if (field.leafField === 'description') {
    score -= 20
  }

  if (field.relationPath.length === 0 && field.leafField === 'name') {
    score -= 15
  }

  const pathTokens = splitPathTokens(field.path)
  const overlapCount = pathTokens.filter(token => stemmedUserTokens.includes(token)).length
  score += overlapCount * 8

  return {
    constraint: buildContainsConstraint(field.entityType, field.path, phrase),
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