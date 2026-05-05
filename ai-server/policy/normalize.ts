import type {
  CanonicalConceptType,
  ConceptDictionaryArtifact,
  LoadedArtifacts,
  SupportedLocale,
} from '../artifacts/types'

export interface ConceptMatch {
  readonly entityType: CanonicalConceptType
  readonly locale: SupportedLocale | 'any'
  readonly matchedText: string
  readonly canonicalTerm: string
}

export interface NormalizedUserInput {
  readonly rawText: string
  readonly locale: SupportedLocale | null
  readonly normalizedText: string
  readonly canonicalText: string
  readonly tokens: readonly string[]
  readonly conceptMatches: readonly ConceptMatch[]
  readonly candidateEntityTypes: readonly CanonicalConceptType[]
  readonly preferredEntityType: CanonicalConceptType | null
}

export interface NormalizeUserInputArgs {
  readonly text: string
  readonly locale?: SupportedLocale | null
  readonly artifacts: Pick<LoadedArtifacts, 'conceptDictionary'>
}

const WORD_BOUNDARY = ' '

function canonicalizeText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function uniqueStrings(values: readonly string[]): readonly string[] {
  return Array.from(new Set(values))
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildCanonicalAliases(
  entityType: CanonicalConceptType,
  conceptDictionary: ConceptDictionaryArtifact,
  locale: SupportedLocale | null
): ReadonlyArray<{ locale: SupportedLocale | 'any'; alias: string }> {
  const concept = conceptDictionary.concepts[entityType]
  const localizedAliases = locale ? concept.synonyms[locale] : []
  const allAliases = locale
    ? uniqueStrings([...localizedAliases, entityType, concept.graphLabel])
    : uniqueStrings([
        ...concept.synonyms.de,
        ...concept.synonyms.en,
        ...concept.synonyms.fr,
        entityType,
        concept.graphLabel,
      ])

  return allAliases
    .map(alias => ({
      locale: (locale && localizedAliases.includes(alias) ? locale : 'any') as
        | SupportedLocale
        | 'any',
      alias,
    }))
    .filter(entry => canonicalizeText(entry.alias).length > 0)
}

function findConceptMatches(
  normalizedText: string,
  conceptDictionary: ConceptDictionaryArtifact,
  locale: SupportedLocale | null
): readonly ConceptMatch[] {
  const paddedText = `${WORD_BOUNDARY}${normalizedText}${WORD_BOUNDARY}`
  const matches: ConceptMatch[] = []

  for (const entityType of Object.keys(conceptDictionary.concepts) as CanonicalConceptType[]) {
    const aliases = buildCanonicalAliases(entityType, conceptDictionary, locale)
    for (const { alias, locale: matchLocale } of aliases) {
      const normalizedAlias = canonicalizeText(alias)
      if (!normalizedAlias) {
        continue
      }

      const paddedAlias = `${WORD_BOUNDARY}${normalizedAlias}${WORD_BOUNDARY}`
      if (!paddedText.includes(paddedAlias)) {
        continue
      }

      matches.push({
        entityType,
        locale: matchLocale,
        matchedText: alias,
        canonicalTerm: entityType,
      })
    }
  }

  return matches.filter(
    (match, index, allMatches) =>
      allMatches.findIndex(
        candidate =>
          candidate.entityType === match.entityType && candidate.matchedText === match.matchedText
      ) === index
  )
}

function buildCanonicalText(normalizedText: string, matches: readonly ConceptMatch[]): string {
  let canonicalText = ` ${normalizedText} `

  const sortedMatches = [...matches].sort(
    (left, right) => right.matchedText.length - left.matchedText.length
  )

  for (const match of sortedMatches) {
    const search = canonicalizeText(match.matchedText)
    if (!search) {
      continue
    }

    canonicalText = canonicalText.replace(
      new RegExp(`(^| )${escapeRegExp(search)}(?= |$)`, 'g'),
      `$1${canonicalizeText(match.canonicalTerm)}`
    )
  }

  return canonicalText.trim().replace(/\s+/g, ' ')
}

export function normalizeUserInput(args: NormalizeUserInputArgs): NormalizedUserInput {
  const locale = args.locale ?? null
  const normalizedText = canonicalizeText(args.text)
  const tokens = normalizedText ? normalizedText.split(' ') : []
  const conceptMatches = findConceptMatches(
    normalizedText,
    args.artifacts.conceptDictionary,
    locale
  )
  const candidateEntityTypes = uniqueStrings(
    conceptMatches.map(match => match.entityType)
  ) as readonly CanonicalConceptType[]

  return {
    rawText: args.text,
    locale,
    normalizedText,
    canonicalText: buildCanonicalText(normalizedText, conceptMatches),
    tokens,
    conceptMatches,
    candidateEntityTypes,
    preferredEntityType: candidateEntityTypes.length === 1 ? candidateEntityTypes[0] : null,
  }
}
