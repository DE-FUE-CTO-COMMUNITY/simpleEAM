import type { SupportedLocale } from '../artifacts/types'
import { summarizeLookupResult } from '../graph/summarizeLookupResult'

export interface ResponseFormatterContext {
  readonly text?: string
  readonly locale?: SupportedLocale | null
  readonly intent?: string | null
  readonly entityType?: string | null
  readonly queryForm?: string | null
  readonly relationType?: string | null
  readonly selectedQueryArgs?: Readonly<Record<string, unknown>> | null
}

const ROOT_LABELS: Record<SupportedLocale, Record<string, string>> = {
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

const ROOT_SINGULAR_LABELS: Record<SupportedLocale, Record<string, string>> = {
  de: {
    applications: 'Anwendung',
    applicationInterfaces: 'Schnittstelle',
    businessCapabilities: 'Fähigkeit',
    businessProcesses: 'Prozess',
    dataObjects: 'Datenobjekt',
    infrastructures: 'Infrastruktur',
  },
  en: {
    applications: 'Application',
    applicationInterfaces: 'Interface',
    businessCapabilities: 'Capability',
    businessProcesses: 'Process',
    dataObjects: 'Data object',
    infrastructures: 'Infrastructure element',
  },
  fr: {
    applications: 'Application',
    applicationInterfaces: 'Interface',
    businessCapabilities: 'Capacité',
    businessProcesses: 'Processus',
    dataObjects: 'Objet de données',
    infrastructures: 'Infrastructure',
  },
}

const GROUP_ENTITY_LABELS: Record<SupportedLocale, Record<string, string>> = {
  de: {
    dataObjects: 'Datenobjekt',
    hostedOn: 'Hosting',
    hostsApplications: 'Anwendung',
    sourceApplications: 'Anwendung',
    sourceOfInterfaces: 'Schnittstelle',
    supportedByApplications: 'Anwendung',
    supportedByBusinessProcesses: 'Prozess',
    targetApplications: 'Anwendung',
    targetOfInterfaces: 'Schnittstelle',
    transferredInInterfaces: 'Schnittstelle',
    usedByApplications: 'Anwendung',
    usedByInfrastructure: 'Infrastruktur',
    usesDataObjects: 'Datenobjekt',
    usesHardwareProducts: 'Hardwareprodukt',
    usesSoftwareProducts: 'Softwareprodukt',
    versions: 'Version',
  },
  en: {
    dataObjects: 'Data object',
    hostedOn: 'Hosting',
    hostsApplications: 'Application',
    sourceApplications: 'Application',
    sourceOfInterfaces: 'Interface',
    supportedByApplications: 'Application',
    supportedByBusinessProcesses: 'Process',
    targetApplications: 'Application',
    targetOfInterfaces: 'Interface',
    transferredInInterfaces: 'Interface',
    usedByApplications: 'Application',
    usedByInfrastructure: 'Infrastructure',
    usesDataObjects: 'Data object',
    usesHardwareProducts: 'Hardware product',
    usesSoftwareProducts: 'Software product',
    versions: 'Version',
  },
  fr: {
    dataObjects: 'Objet de données',
    hostedOn: 'Hébergement',
    hostsApplications: 'Application',
    sourceApplications: 'Application',
    sourceOfInterfaces: 'Interface',
    supportedByApplications: 'Application',
    supportedByBusinessProcesses: 'Processus',
    targetApplications: 'Application',
    targetOfInterfaces: 'Interface',
    transferredInInterfaces: 'Interface',
    usedByApplications: 'Application',
    usedByInfrastructure: 'Infrastructure',
    usesDataObjects: 'Objet de données',
    usesHardwareProducts: 'Produit matériel',
    usesSoftwareProducts: 'Produit logiciel',
    versions: 'Version',
  },
}

const GROUP_ENTITY_PLURAL_LABELS: Record<SupportedLocale, Record<string, string>> = {
  de: {
    dataObjects: 'Datenobjekten',
    hostedOn: 'Hosting-Zielen',
    hostsApplications: 'Anwendungen',
    sourceApplications: 'Anwendungen',
    sourceOfInterfaces: 'Schnittstellen',
    supportedByApplications: 'Anwendungen',
    supportedByBusinessProcesses: 'Prozessen',
    targetApplications: 'Anwendungen',
    targetOfInterfaces: 'Schnittstellen',
    transferredInInterfaces: 'Schnittstellen',
    usedByApplications: 'Anwendungen',
    usedByInfrastructure: 'Infrastrukturen',
    usesDataObjects: 'Datenobjekten',
    usesHardwareProducts: 'Hardwareprodukten',
    usesSoftwareProducts: 'Softwareprodukten',
    versions: 'Versionen',
  },
  en: {
    dataObjects: 'data objects',
    hostedOn: 'hosting targets',
    hostsApplications: 'applications',
    sourceApplications: 'applications',
    sourceOfInterfaces: 'interfaces',
    supportedByApplications: 'applications',
    supportedByBusinessProcesses: 'processes',
    targetApplications: 'applications',
    targetOfInterfaces: 'interfaces',
    transferredInInterfaces: 'interfaces',
    usedByApplications: 'applications',
    usedByInfrastructure: 'infrastructure elements',
    usesDataObjects: 'data objects',
    usesHardwareProducts: 'hardware products',
    usesSoftwareProducts: 'software products',
    versions: 'versions',
  },
  fr: {
    dataObjects: 'objets de données',
    hostedOn: "cibles d'hébergement",
    hostsApplications: 'applications',
    sourceApplications: 'applications',
    sourceOfInterfaces: 'interfaces',
    supportedByApplications: 'applications',
    supportedByBusinessProcesses: 'processus',
    targetApplications: 'applications',
    targetOfInterfaces: 'interfaces',
    transferredInInterfaces: 'interfaces',
    usedByApplications: 'applications',
    usedByInfrastructure: 'infrastructures',
    usesDataObjects: 'objets de données',
    usesHardwareProducts: 'produits matériels',
    usesSoftwareProducts: 'produits logiciels',
    versions: 'versions',
  },
}

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

function normalizeForSort(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function normalizeForContains(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function humanizeRootKey(rootKey: string, locale: SupportedLocale): string {
  return (
    ROOT_LABELS[locale][rootKey] ?? rootKey.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
  )
}

function humanizeRootSingularKey(rootKey: string, locale: SupportedLocale): string {
  return (
    ROOT_SINGULAR_LABELS[locale][rootKey] ??
    rootKey.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/s$/i, '')
  )
}

function humanizeGroupEntityLabel(relationType: string, locale: SupportedLocale): string {
  return (
    GROUP_ENTITY_LABELS[locale][relationType] ??
    relationType.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/s$/i, '')
  )
}

function humanizeGroupEntityPlural(relationType: string, locale: SupportedLocale): string {
  return (
    GROUP_ENTITY_PLURAL_LABELS[locale][relationType] ??
    relationType.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
  )
}

function filterRelatedItems(
  relatedItems: readonly unknown[],
  relatedFilterClause: string | null
): readonly unknown[] {
  if (!relatedFilterClause?.trim()) {
    return relatedItems
  }

  const eqMatch = relatedFilterClause.match(/(\w+):\s*\{\s*eq:\s*(?:"([^"]+)"|([A-Z0-9_]+))\s*\}/)
  if (eqMatch) {
    const fieldName = eqMatch[1]
    const expected = eqMatch[2] ?? eqMatch[3]
    return relatedItems.filter(item => {
      if (!item || typeof item !== 'object') {
        return false
      }

      return String((item as Record<string, unknown>)[fieldName] ?? '') === expected
    })
  }

  const containsMatch = relatedFilterClause.match(/(\w+):\s*\{\s*contains:\s*"([^"]+)"\s*\}/)
  if (containsMatch) {
    const fieldName = containsMatch[1]
    const expected = normalizeForContains(containsMatch[2])
    return relatedItems.filter(item => {
      if (!item || typeof item !== 'object') {
        return false
      }

      const value = (item as Record<string, unknown>)[fieldName]
      return typeof value === 'string' && normalizeForContains(value).includes(expected)
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

function formatGroupDescriptor(record: Record<string, unknown>): string | null {
  const name = typeof record.name === 'string' ? record.name.trim() : ''
  if (!name) {
    return null
  }

  const preferredAttributes = [
    record.hostingEnvironment,
    record.infrastructureType,
    record.classification,
    record.protocol,
    record.interfaceType,
    record.status,
  ]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .slice(0, 2)

  if (preferredAttributes.length === 0) {
    return name
  }

  return `${name} (${preferredAttributes.join(', ')})`
}

function getNestedRelationEntries(
  record: Record<string, unknown>
): Array<[string, readonly unknown[]]> {
  return Object.entries(record)
    .filter(([, value]) => Array.isArray(value) && value.length > 0)
    .map(
      ([relationKey, value]) =>
        [relationKey, value as readonly unknown[]] as [string, readonly unknown[]]
    )
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
}

function formatRelationEntryLabel(relationType: string, locale: SupportedLocale): string {
  return humanizeGroupEntityLabel(relationType, locale)
}

function formatRelatedFilterDescription(
  relationType: string,
  relatedFilterClause: string | null,
  locale: SupportedLocale
): string | null {
  if (!relatedFilterClause?.trim()) {
    return null
  }

  const groupPlural = humanizeGroupEntityPlural(relationType, locale)
  const hostingEnvironmentContainsMatch = relatedFilterClause.match(
    /hostingEnvironment:\s*\{\s*contains:\s*"([^"]+)"\s*\}/
  )
  if (hostingEnvironmentContainsMatch) {
    const environment = hostingEnvironmentContainsMatch[1]
    if (locale === 'de') {
      return `${environment}-gehosteten ${groupPlural}`
    }
    if (locale === 'fr') {
      return `${groupPlural} hébergées sur ${environment}`
    }
    return `${environment}-hosted ${groupPlural}`
  }

  const nameContainsMatch = relatedFilterClause.match(/name:\s*\{\s*contains:\s*"([^"]+)"\s*\}/)
  if (nameContainsMatch) {
    const name = nameContainsMatch[1]
    if (locale === 'de') {
      return `${groupPlural} mit "${name}"`
    }
    if (locale === 'fr') {
      return `${groupPlural} correspondant à "${name}"`
    }
    return `${groupPlural} matching "${name}"`
  }

  const classificationMatch = relatedFilterClause.match(
    /classification:\s*\{\s*eq:\s*([A-Z_]+)\s*\}/
  )
  if (classificationMatch) {
    const classification = classificationMatch[1].toLowerCase().replace(/_/g, ' ')
    if (locale === 'de') {
      return `${classification}en ${groupPlural}`
    }
    if (locale === 'fr') {
      return `${groupPlural} ${classification}`
    }
    return `${classification} ${groupPlural}`
  }

  return null
}

function formatGroupedHeader(
  rootKey: string,
  childCount: number,
  relationType: string,
  relatedFilterClause: string | null,
  locale: SupportedLocale
): string {
  const rootLabel = humanizeRootKey(rootKey, locale)
  const filterDescription = formatRelatedFilterDescription(
    relationType,
    relatedFilterClause,
    locale
  )

  if (locale === 'de') {
    if (relationType === 'supportedByApplications' && filterDescription) {
      return `Gefundene ${rootLabel} (${childCount}), unterstützt von ${filterDescription}:`
    }

    return `Gefundene ${rootLabel} (${childCount}):`
  }

  if (locale === 'fr') {
    if (relationType === 'supportedByApplications' && filterDescription) {
      return `${rootLabel} trouvés (${childCount}), pris en charge par ${filterDescription} :`
    }

    return `${rootLabel} trouvés (${childCount}) :`
  }

  if (relationType === 'supportedByApplications' && filterDescription) {
    return `Found ${childCount} ${rootLabel} supported by ${filterDescription}:`
  }

  return `Found ${childCount} ${rootLabel}:`
}

function formatRootOnlyHeader(
  rootKey: string,
  childCount: number,
  locale: SupportedLocale
): string {
  const rootLabel = humanizeRootKey(rootKey, locale)

  if (locale === 'de') {
    return `Gefundene ${rootLabel} (${childCount}):`
  }

  if (locale === 'fr') {
    return `${rootLabel} trouvés (${childCount}) :`
  }

  return `Found ${rootLabel} (${childCount}):`
}

function formatRelationItemLines(
  item: Record<string, unknown>,
  relationType: string,
  locale: SupportedLocale,
  indentLevel: number
): readonly string[] {
  const descriptor = formatGroupDescriptor(item)
  if (!descriptor) {
    return []
  }

  const indent = '  '.repeat(indentLevel)
  const lines = [`${indent}- ${formatRelationEntryLabel(relationType, locale)}: ${descriptor}`]
  const nestedRelationEntries = getNestedRelationEntries(item)

  for (const [nestedRelationType, nestedItems] of nestedRelationEntries) {
    const nestedLines = nestedItems
      .filter(
        (nestedItem): nestedItem is Record<string, unknown> =>
          Boolean(nestedItem) && typeof nestedItem === 'object'
      )
      .sort((left, right) => {
        const leftDescriptor = formatGroupDescriptor(left) ?? ''
        const rightDescriptor = formatGroupDescriptor(right) ?? ''
        return normalizeForSort(leftDescriptor).localeCompare(normalizeForSort(rightDescriptor))
      })
      .flatMap(nestedItem =>
        formatRelationItemLines(nestedItem, nestedRelationType, locale, indentLevel + 1)
      )

    lines.push(...nestedLines)
  }

  return lines
}

function tryFormatRootAnchoredRelationResult(
  rootKey: string,
  items: readonly unknown[],
  relationType: string,
  relatedFilterClause: string | null,
  locale: SupportedLocale
): string | null {
  const rootSections = items
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map(record => {
      const rootName = typeof record.name === 'string' ? record.name.trim() : ''
      if (!rootName) {
        return null
      }

      const relationItems = record[relationType]
      if (!Array.isArray(relationItems) || relationItems.length === 0) {
        return null
      }

      const matchedRelatedItems = relationItems
        .map(relatedItem => pruneRelatedItem(relatedItem, relatedFilterClause))
        .filter((relatedItem): relatedItem is Record<string, unknown> => Boolean(relatedItem))
        .sort((left, right) => {
          const leftDescriptor = formatGroupDescriptor(left) ?? ''
          const rightDescriptor = formatGroupDescriptor(right) ?? ''
          return normalizeForSort(leftDescriptor).localeCompare(normalizeForSort(rightDescriptor))
        })

      if (matchedRelatedItems.length === 0) {
        return null
      }

      const sectionHeader = `${humanizeRootSingularKey(rootKey, locale)}: ${rootName}`
      const sectionLines = matchedRelatedItems.flatMap(relatedItem =>
        formatRelationItemLines(relatedItem, relationType, locale, 1)
      )

      if (sectionLines.length === 0) {
        return null
      }

      return {
        sortKey: normalizeForSort(rootName),
        text: `${sectionHeader}\n${sectionLines.join('\n')}`,
      }
    })
    .filter((section): section is { sortKey: string; text: string } => Boolean(section))

  if (rootSections.length === 0) {
    return null
  }

  const sortedSections = rootSections.sort((left, right) =>
    left.sortKey.localeCompare(right.sortKey)
  )
  const header = formatGroupedHeader(
    rootKey,
    rootSections.length,
    relationType,
    relatedFilterClause,
    locale
  )
  const body = sortedSections.map(section => section.text).join('\n\n')

  return `${header}\n\n${body}`
}

function tryFormatRootAnchoredMultiRelationResult(
  rootKey: string,
  items: readonly unknown[],
  relatedFilterClause: string | null,
  locale: SupportedLocale
): string | null {
  const rootSections = items
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map(record => {
      const rootName = typeof record.name === 'string' ? record.name.trim() : ''
      if (!rootName) {
        return null
      }

      const sectionLines = getNestedRelationEntries(record)
        .flatMap(([relationType, relationItems]) => {
          const matchedRelatedItems = relationItems
            .map(relatedItem => pruneRelatedItem(relatedItem, relatedFilterClause))
            .filter((relatedItem): relatedItem is Record<string, unknown> => Boolean(relatedItem))
            .sort((left, right) => {
              const leftDescriptor = formatGroupDescriptor(left) ?? ''
              const rightDescriptor = formatGroupDescriptor(right) ?? ''
              return normalizeForSort(leftDescriptor).localeCompare(normalizeForSort(rightDescriptor))
            })

          return matchedRelatedItems.flatMap(relatedItem =>
            formatRelationItemLines(relatedItem, relationType, locale, 1)
          )
        })

      if (sectionLines.length === 0) {
        return null
      }

      return {
        sortKey: normalizeForSort(rootName),
        text: `${humanizeRootSingularKey(rootKey, locale)}: ${rootName}\n${sectionLines.join('\n')}`,
      }
    })
    .filter((section): section is { sortKey: string; text: string } => Boolean(section))

  if (rootSections.length === 0) {
    return null
  }

  const sortedSections = rootSections.sort((left, right) =>
    left.sortKey.localeCompare(right.sortKey)
  )
  const header = formatRootOnlyHeader(rootKey, rootSections.length, locale)
  const body = sortedSections.map(section => section.text).join('\n\n')

  return `${header}\n\n${body}`
}

export const responseFormatter = {
  format(data: unknown, context: ResponseFormatterContext): string {
    const locale = context.locale ?? (context.text ? detectLocale(context.text) : 'en')

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const entries = Object.entries(data as Record<string, unknown>)
      const arrayEntry = entries.find(([, value]) => Array.isArray(value))
      const relationType = context.relationType
      const relatedFilterClause =
        typeof context.selectedQueryArgs?.relatedFilterClause === 'string'
          ? context.selectedQueryArgs.relatedFilterClause
          : null

      if (arrayEntry && relationType) {
        const [rootKey, value] = arrayEntry
        const groupedResult = tryFormatRootAnchoredRelationResult(
          rootKey,
          value as readonly unknown[],
          relationType,
          relatedFilterClause,
          locale
        )

        if (groupedResult) {
          return groupedResult
        }
      }

      if (arrayEntry && !relationType) {
        const [rootKey, value] = arrayEntry
        const groupedResult = tryFormatRootAnchoredMultiRelationResult(
          rootKey,
          value as readonly unknown[],
          relatedFilterClause,
          locale
        )

        if (groupedResult) {
          return groupedResult
        }
      }
    }

    return summarizeLookupResult({
      data,
      text: context.text,
      locale,
      selectedQueryArgs: context.selectedQueryArgs,
    })
  },
}
