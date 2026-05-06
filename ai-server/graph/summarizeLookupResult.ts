import type { SupportedLocale } from '../artifacts/types'

export interface SummarizeLookupResultArgs {
  readonly data: unknown
  readonly text?: string
  readonly locale?: SupportedLocale | null
  readonly selectedQueryArgs?: Readonly<Record<string, unknown>> | null
}

const LIST_KEYWORDS = {
  de: ['welche', 'welcher', 'welches', 'liste', 'zeige', 'nenn'],
  en: ['which', 'what', 'list', 'show', 'name'],
  fr: ['quel', 'quels', 'quelle', 'quelles', 'liste', 'montre', 'affiche'],
} as const

function normalizeText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function detectLocale(text: string): SupportedLocale {
  const normalized = normalizeText(text)

  if (
    /\b(welche|welcher|welches|wieviele|wie viele|zeige|schnittstellen|daten|vertraulich)\b/.test(
      normalized
    )
  ) {
    return 'de'
  }

  if (/\b(which|what|show|list|how many|confidential|data)\b/.test(normalized)) {
    return 'en'
  }

  if (/\b(quel|quels|quelle|quelles|montre|affiche|donnees|confidentiel)\b/.test(normalized)) {
    return 'fr'
  }

  return 'en'
}

function summarizeValue(value: unknown): string {
  if (Array.isArray(value)) {
    return `array(${value.length})`
  }

  if (value && typeof value === 'object') {
    return `object(${Object.keys(value as Record<string, unknown>).join(', ')})`
  }

  return String(value)
}

function humanizeRootKey(rootKey: string, locale: SupportedLocale): string {
  const labels: Record<SupportedLocale, Record<string, string>> = {
    de: {
      applications: 'Anwendungen',
      applicationInterfaces: 'Schnittstellen',
      businessCapabilities: 'Fähigkeiten',
      businessProcesses: 'Prozesse',
      dataObjects: 'Datenobjekte',
      infrastructures: 'Infrastrukturen',
    },
    en: {
      applications: 'applications',
      applicationInterfaces: 'interfaces',
      businessCapabilities: 'capabilities',
      businessProcesses: 'processes',
      dataObjects: 'data objects',
      infrastructures: 'infrastructure elements',
    },
    fr: {
      applications: 'applications',
      applicationInterfaces: 'interfaces',
      businessCapabilities: 'capacités',
      businessProcesses: 'processus',
      dataObjects: 'objets de données',
      infrastructures: 'infrastructures',
    },
  }

  return labels[locale][rootKey] ?? rootKey.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
}

function humanizeRelationKey(relationKey: string, locale: SupportedLocale): string {
  const labels: Record<SupportedLocale, Record<string, string>> = {
    de: {
      dataObjects: 'Datenobjekte',
      hostsApplications: 'gehostete Anwendungen',
      providedBy: 'bereitgestellt von',
      softwareProduct: 'Softwareprodukt',
      sourceApplications: 'Quellanwendungen',
      sourceOfInterfaces: 'Quellschnittstellen',
      supportedByApplications: 'unterstützende Anwendungen',
      supportedByBusinessProcesses: 'unterstützende Prozesse',
      supportsBusinessProcesses: 'unterstützte Prozesse',
      supportsCapabilities: 'unterstützte Fähigkeiten',
      targetApplications: 'Zielanwendungen',
      targetOfInterfaces: 'Zielschnittstellen',
      transferredInInterfaces: 'übertragende Schnittstellen',
      usedByApplications: 'nutzende Anwendungen',
      usedByInfrastructure: 'nutzende Infrastrukturen',
      usesDataObjects: 'genutzte Datenobjekte',
      usesHardwareProducts: 'genutzte Hardwareprodukte',
      usesSoftwareProducts: 'genutzte Softwareprodukte',
      versions: 'Versionen',
    },
    en: {
      dataObjects: 'data objects',
      hostsApplications: 'hosted applications',
      providedBy: 'provided by',
      softwareProduct: 'software product',
      sourceApplications: 'source applications',
      sourceOfInterfaces: 'source interfaces',
      supportedByApplications: 'supporting applications',
      supportedByBusinessProcesses: 'supporting processes',
      supportsBusinessProcesses: 'supported processes',
      supportsCapabilities: 'supported capabilities',
      targetApplications: 'target applications',
      targetOfInterfaces: 'target interfaces',
      transferredInInterfaces: 'transferring interfaces',
      usedByApplications: 'using applications',
      usedByInfrastructure: 'using infrastructure',
      usesDataObjects: 'used data objects',
      usesHardwareProducts: 'used hardware products',
      usesSoftwareProducts: 'used software products',
      versions: 'versions',
    },
    fr: {
      dataObjects: 'objets de données',
      hostsApplications: 'applications hébergées',
      providedBy: 'fourni par',
      softwareProduct: 'produit logiciel',
      sourceApplications: 'applications source',
      sourceOfInterfaces: 'interfaces source',
      supportedByApplications: 'applications de support',
      supportedByBusinessProcesses: 'processus de support',
      supportsBusinessProcesses: 'processus pris en charge',
      supportsCapabilities: 'capacités prises en charge',
      targetApplications: 'applications cibles',
      targetOfInterfaces: 'interfaces cibles',
      transferredInInterfaces: 'interfaces de transfert',
      usedByApplications: 'applications utilisatrices',
      usedByInfrastructure: 'infrastructures utilisatrices',
      usesDataObjects: 'objets de données utilisés',
      usesHardwareProducts: 'produits matériels utilisés',
      usesSoftwareProducts: 'produits logiciels utilisés',
      versions: 'versions',
    },
  }

  return (
    labels[locale][relationKey] ?? relationKey.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
  )
}

function isListIntent(text: string, locale: SupportedLocale): boolean {
  const normalized = normalizeText(text)
  return LIST_KEYWORDS[locale].some(keyword => normalized.includes(keyword))
}

function formatNoMatch(rootKey: string, locale: SupportedLocale): string {
  const label = humanizeRootKey(rootKey, locale)

  if (locale === 'de') {
    return `Keine passenden ${label} gefunden.`
  }

  if (locale === 'fr') {
    return `Aucun résultat correspondant trouvé pour ${label}.`
  }

  return `No matching ${label} were found.`
}

function formatItemList(
  rootKey: string,
  names: readonly string[],
  locale: SupportedLocale
): string {
  const label = humanizeRootKey(rootKey, locale)
  const listing = names.map(name => `- ${name}`).join('\n')

  if (locale === 'de') {
    return `Gefundene ${label} (${names.length}):\n${listing}`
  }

  if (locale === 'fr') {
    return `${label} trouvés (${names.length}) :\n${listing}`
  }

  return `Found ${label} (${names.length}):\n${listing}`
}

function formatRelatedItem(item: unknown, locale: SupportedLocale): string | null {
  if (!item || typeof item !== 'object') {
    return null
  }

  const record = item as Record<string, unknown>
  if (typeof record.name !== 'string' || !record.name.trim()) {
    return null
  }

  const nestedRelations = Object.entries(record).filter(([, value]) => Array.isArray(value))
  if (nestedRelations.length > 0) {
    const details = nestedRelations
      .map(([relationKey, relationItems]) => {
        const relatedNames = (relationItems as readonly unknown[])
          .map(relatedItem => formatRelatedItem(relatedItem, locale))
          .filter((name): name is string => Boolean(name))

        if (relatedNames.length === 0) {
          return null
        }

        return `${humanizeRelationKey(relationKey, locale)}: ${relatedNames.join(', ')}`
      })
      .filter((detail): detail is string => Boolean(detail))

    if (details.length > 0) {
      return `${record.name.trim()} (${details.join('; ')})`
    }
  }

  if (typeof record.classification === 'string' && record.classification.trim()) {
    return `${record.name.trim()} (${record.classification.trim()})`
  }

  if (typeof record.hostingEnvironment === 'string' && record.hostingEnvironment.trim()) {
    const hostingEnvironmentLabel =
      locale === 'de'
        ? 'Hosting-Umgebung'
        : locale === 'fr'
          ? "environnement d'hébergement"
          : 'hosting environment'

    return `${record.name.trim()} (${hostingEnvironmentLabel}: ${record.hostingEnvironment.trim()})`
  }

  return record.name.trim()
}

function normalizeForContains(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function filterRelatedItems(
  relatedItems: readonly unknown[],
  relatedFilterClause: string | null
): readonly unknown[] {
  if (!relatedFilterClause?.trim()) {
    return relatedItems
  }

  const classificationMatch = relatedFilterClause.match(
    /classification:\s*\{\s*eq:\s*([A-Z_]+)\s*\}/
  )
  if (classificationMatch) {
    const classification = classificationMatch[1]
    return relatedItems.filter(item => {
      if (!item || typeof item !== 'object') {
        return false
      }

      return (item as Record<string, unknown>).classification === classification
    })
  }

  const nameContainsMatch = relatedFilterClause.match(/name:\s*\{\s*contains:\s*"([^"]+)"\s*\}/)
  if (nameContainsMatch) {
    const expected = normalizeForContains(nameContainsMatch[1])
    return relatedItems.filter(item => {
      if (!item || typeof item !== 'object') {
        return false
      }

      const name = (item as Record<string, unknown>).name
      return typeof name === 'string' && normalizeForContains(name).includes(expected)
    })
  }

  const hostingEnvironmentContainsMatch = relatedFilterClause.match(
    /hostingEnvironment:\s*\{\s*contains:\s*"([^"]+)"\s*\}/
  )
  if (hostingEnvironmentContainsMatch) {
    const expected = normalizeForContains(hostingEnvironmentContainsMatch[1])
    return relatedItems.filter(item => {
      if (!item || typeof item !== 'object') {
        return false
      }

      const hostingEnvironment = (item as Record<string, unknown>).hostingEnvironment
      return (
        typeof hostingEnvironment === 'string' &&
        normalizeForContains(hostingEnvironment).includes(expected)
      )
    })
  }

  return relatedItems
}

function pruneRelatedItem(
  item: unknown,
  relatedFilterClause: string | null
): Record<string, unknown> | null {
  if (!item || typeof item !== 'object') {
    return null
  }

  const record = item as Record<string, unknown>
  const arrayEntries = Object.entries(record).filter(([, value]) => Array.isArray(value))
  if (arrayEntries.length === 0) {
    return filterRelatedItems([record], relatedFilterClause).length > 0 ? record : null
  }

  const nextRecord: Record<string, unknown> = { ...record }
  let hasMatchingNestedItems = false

  for (const [relationKey, relationItems] of arrayEntries) {
    const prunedRelationItems = (relationItems as readonly unknown[])
      .map(relatedItem => pruneRelatedItem(relatedItem, relatedFilterClause))
      .filter((relatedItem): relatedItem is Record<string, unknown> => Boolean(relatedItem))

    nextRecord[relationKey] = prunedRelationItems
    if (prunedRelationItems.length > 0) {
      hasMatchingNestedItems = true
    }
  }

  if (hasMatchingNestedItems) {
    return nextRecord
  }

  return filterRelatedItems([record], relatedFilterClause).length > 0 ? nextRecord : null
}

function formatDetailedItemList(
  rootKey: string,
  items: readonly unknown[],
  locale: SupportedLocale,
  relationField: string | null,
  relatedFilterClause: string | null
): string {
  const label = humanizeRootKey(rootKey, locale)
  const lines = items
    .map(item => {
      if (!item || typeof item !== 'object') {
        return null
      }

      const record = item as Record<string, unknown>
      const itemName = typeof record.name === 'string' ? record.name.trim() : ''
      if (!itemName) {
        return null
      }

      const relationEntries = (
        relationField
          ? [[relationField, record[relationField]]]
          : Object.entries(record).filter(([, value]) => Array.isArray(value) && value.length > 0)
      ).filter(([, value]) => Array.isArray(value) && (value as readonly unknown[]).length > 0)

      if (relationEntries.length === 0) {
        return `- ${itemName}`
      }

      const relationSegments = relationEntries
        .map(([rawRelationKey, relationItems]) => {
          const relationKey = String(rawRelationKey)
          const relatedNames = (relationItems as readonly unknown[])
            .map(relatedItem => pruneRelatedItem(relatedItem, relatedFilterClause))
            .filter((relatedItem): relatedItem is Record<string, unknown> => Boolean(relatedItem))
            .map(relatedItem => formatRelatedItem(relatedItem, locale))
            .filter((name): name is string => Boolean(name))

          if (relatedNames.length === 0) {
            return null
          }

          return `${humanizeRelationKey(relationKey, locale)}: ${relatedNames.join(', ')}`
        })
        .filter((segment): segment is string => Boolean(segment))

      if (relationSegments.length === 0) {
        return `- ${itemName}`
      }

      return `- ${itemName}: ${relationSegments.join('; ')}`
    })
    .filter((line): line is string => Boolean(line))

  if (locale === 'de') {
    return `Gefundene ${label} (${lines.length}):\n${lines.join('\n')}`
  }

  if (locale === 'fr') {
    return `${label} trouvés (${lines.length}) :\n${lines.join('\n')}`
  }

  return `Found ${label} (${lines.length}):\n${lines.join('\n')}`
}

function formatGenericSummary(
  entries: readonly [string, unknown][],
  locale: SupportedLocale
): string {
  const parts = entries.map(([key, value]) => `${key}: ${summarizeValue(value)}`)

  if (locale === 'de') {
    return `Abfrage abgeschlossen. ${parts.join('; ')}`
  }

  if (locale === 'fr') {
    return `Requête terminée. ${parts.join('; ')}`
  }

  return `Lookup completed. ${parts.join('; ')}`
}

export function summarizeLookupResult(args: SummarizeLookupResultArgs): string {
  const locale = args.locale ?? (args.text ? detectLocale(args.text) : 'en')
  const payload = args.data

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    if (locale === 'de') {
      return `Abfrage abgeschlossen mit ${summarizeValue(payload)}.`
    }
    if (locale === 'fr') {
      return `Requête terminée avec ${summarizeValue(payload)}.`
    }
    return `Lookup completed with ${summarizeValue(payload)}.`
  }

  const entries = Object.entries(payload as Record<string, unknown>)
  if (entries.length === 0) {
    if (locale === 'de') {
      return 'Abfrage abgeschlossen mit leerem Ergebnis.'
    }
    if (locale === 'fr') {
      return 'Requête terminée sans résultat.'
    }
    return 'Lookup completed with an empty result set.'
  }

  const arrayEntry = entries.find(([, value]) => Array.isArray(value))
  if (arrayEntry) {
    const [rootKey, value] = arrayEntry
    const items = value as unknown[]
    const relationField =
      typeof args.selectedQueryArgs?.relationField === 'string'
        ? args.selectedQueryArgs.relationField
        : null
    const relatedFilterClause =
      typeof args.selectedQueryArgs?.relatedFilterClause === 'string'
        ? args.selectedQueryArgs.relatedFilterClause
        : null
    if (items.length === 0) {
      return formatNoMatch(rootKey, locale)
    }

    const names = items
      .map(item => {
        if (!item || typeof item !== 'object') {
          return null
        }

        const record = item as Record<string, unknown>
        if (typeof record.name === 'string' && record.name.trim()) {
          return record.name.trim()
        }

        return null
      })
      .filter((name): name is string => Boolean(name))

    const hasNestedRelationDetails = items.some(
      item =>
        item &&
        typeof item === 'object' &&
        Object.values(item as Record<string, unknown>).some(
          value => Array.isArray(value) && value.length > 0
        )
    )

    if (hasNestedRelationDetails && (!args.text || isListIntent(args.text, locale))) {
      return formatDetailedItemList(rootKey, items, locale, relationField, relatedFilterClause)
    }

    if (names.length > 0 && (!args.text || isListIntent(args.text, locale))) {
      const uniqueNames = [...new Set(names)].sort((left, right) => left.localeCompare(right))
      return formatItemList(rootKey, uniqueNames, locale)
    }
  }

  return formatGenericSummary(entries, locale)
}
