import fs from 'node:fs'
import path from 'node:path'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import {
  importEntityDataWithMapping,
  updateEntityRelationships,
} from '../src/components/excel/operations'
import {
  entityTypeMapping,
  getEntityTypeOrder,
  isGeaEntityType,
} from '../src/components/excel/constants'
import { EntityType } from '../src/components/excel/types'

interface CliOptions {
  filePath: string
  graphqlUrl: string
  token?: string
  includeGea: boolean
  companyId?: string
  dryRun: boolean
}

const parseArgs = (): CliOptions => {
  const args = process.argv.slice(2)
  const options: Partial<CliOptions> = {
    filePath: 'demos/NextGenEAM_Company-Solar_Panels_GmbH.json',
    graphqlUrl:
      process.env.GRAPHQL_URL ||
      process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      'http://localhost:4000/graphql',
    token: process.env.IMPORT_AUTH_TOKEN || process.env.AUTH_TOKEN,
    includeGea: true,
    companyId: process.env.COMPANY_ID,
    dryRun: false,
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const next = args[i + 1]

    if (arg === '--file' && next) {
      options.filePath = next
      i++
    } else if (arg === '--graphql-url' && next) {
      options.graphqlUrl = next
      i++
    } else if (arg === '--token' && next) {
      options.token = next
      i++
    } else if (arg === '--company-id' && next) {
      options.companyId = next
      i++
    } else if (arg === '--include-gea') {
      options.includeGea = true
    } else if (arg === '--no-include-gea') {
      options.includeGea = false
    } else if (arg === '--dry-run') {
      options.dryRun = true
    }
  }

  return options as CliOptions
}

const resolveFilePath = (inputPath: string): string => {
  if (path.isAbsolute(inputPath)) {
    return inputPath
  }

  return path.resolve(process.cwd(), inputPath)
}

const getCompanyIdFromJson = (jsonData: Record<string, unknown>): string | undefined => {
  const companies = jsonData.Companies
  if (!Array.isArray(companies) || companies.length === 0) {
    return undefined
  }

  const firstCompany = companies[0]
  if (typeof firstCompany !== 'object' || firstCompany === null) {
    return undefined
  }

  const id = (firstCompany as { id?: unknown }).id
  return typeof id === 'string' && id.trim() ? id : undefined
}

const createApolloClient = (graphqlUrl: string, token?: string): ApolloClient<object> => {
  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
  }

  const link = new HttpLink({
    uri: graphqlUrl,
    headers,
    fetch,
  })

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: 'no-cache' },
      watchQuery: { fetchPolicy: 'no-cache' },
    },
  })
}

const main = async (): Promise<void> => {
  const options = parseArgs()
  const absoluteFilePath = resolveFilePath(options.filePath)

  if (!fs.existsSync(absoluteFilePath)) {
    throw new Error(`JSON file not found: ${absoluteFilePath}`)
  }

  const rawContent = fs.readFileSync(absoluteFilePath, 'utf-8')
  const allData = JSON.parse(rawContent) as Record<string, unknown>
  const derivedCompanyId = options.companyId || getCompanyIdFromJson(allData)

  const tabsToImport = Object.entries(allData)
    .filter(([tabName, tabData]) => {
      const entityType = entityTypeMapping[tabName] as EntityType | undefined
      if (!entityType) {
        return false
      }
      if (!options.includeGea && isGeaEntityType(entityType)) {
        return false
      }
      return Array.isArray(tabData) && tabData.length > 0
    })
    .map(([tabName, tabData]) => ({
      tabName,
      entityType: entityTypeMapping[tabName] as EntityType,
      data: tabData as any[],
    }))

  if (tabsToImport.length === 0) {
    console.log('No importable tabs found in JSON file.')
    return
  }

  const orderedEntityTypes = getEntityTypeOrder(options.includeGea)
  tabsToImport.sort(
    (a, b) => orderedEntityTypes.indexOf(a.entityType) - orderedEntityTypes.indexOf(b.entityType)
  )

  console.log(`Import file: ${absoluteFilePath}`)
  console.log(`Mode: ${options.dryRun ? 'dry-run (no mutations)' : 'execute import'}`)
  console.log(`GraphQL endpoint: ${options.graphqlUrl}`)
  console.log(`Include GEA: ${options.includeGea ? 'yes' : 'no'}`)
  if (derivedCompanyId) {
    console.log(`Selected company id: ${derivedCompanyId}`)
  }

  if (options.dryRun) {
    const totalRows = tabsToImport.reduce((acc, tab) => acc + tab.data.length, 0)
    console.log('\nDry-run summary (planned import order)')
    tabsToImport.forEach(tab => {
      console.log(`- ${tab.tabName} -> ${tab.entityType}: ${tab.data.length} rows`)
    })
    console.log(`\nPlanned tabs: ${tabsToImport.length}`)
    console.log(`Planned rows: ${totalRows}`)
    return
  }

  const client = createApolloClient(options.graphqlUrl, options.token)

  let totalImported = 0
  let totalFailed = 0
  const allEntityMappings: Record<string, Record<string, string>> = {}

  console.log('\nPhase 1/2: Import entities')
  for (const tab of tabsToImport) {
    const result = await importEntityDataWithMapping(
      client,
      tab.data,
      tab.entityType,
      false,
      'json',
      undefined,
      derivedCompanyId
    )

    allEntityMappings[tab.entityType] = result.entityMappings
    totalImported += result.imported
    totalFailed += result.failed
    console.log(
      `- ${tab.tabName}: imported ${result.imported}, failed ${result.failed}, mapped ${Object.keys(result.entityMappings).length}`
    )
  }

  const combinedMappings: Record<string, string> = {}
  Object.values(allEntityMappings).forEach(mappings => {
    Object.assign(combinedMappings, mappings)
  })

  console.log('\nPhase 2/2: Update relationships')
  for (const tab of tabsToImport) {
    await updateEntityRelationships(
      client,
      tab.data,
      tab.entityType,
      combinedMappings,
      undefined,
      'json'
    )
    console.log(`- ${tab.tabName}: relationships updated`)
  }

  console.log('\nImport finished')
  console.log(`Total imported: ${totalImported}`)
  console.log(`Total failed: ${totalFailed}`)
}

main().catch(error => {
  console.error('Import failed:', error)
  process.exit(1)
})
