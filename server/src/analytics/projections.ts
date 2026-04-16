import { neo4jDriver } from '../db/neo4j-client'

import { replaceProjectionRows } from './clickhouse'

interface ApplicationProjectionRow {
  readonly id: string
  readonly company_id: string
  readonly name: string
  readonly status: string
  readonly criticality: string
  readonly vendor: string
  readonly monthly_cost: number
  readonly updated_at: string
  readonly updated_month: string
}

interface CapabilityCoverageRow {
  readonly capability_id: string
  readonly company_id: string
  readonly capability_name: string
  readonly maturity: string
  readonly supported_applications: number
  readonly updated_at: string
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  if (value && typeof value === 'object' && 'toNumber' in value) {
    const maybeInteger = value as { toNumber?: () => number }
    if (typeof maybeInteger.toNumber === 'function') {
      return maybeInteger.toNumber()
    }
  }

  return 0
}

function normalizeUpdatedMonth(updatedAt: string): string {
  const date = new Date(updatedAt)
  const year = date.getUTCFullYear()
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  return `${year}-${month}-01`
}

function formatClickHouseDateTime(value: string): string {
  const date = new Date(value)

  const year = date.getUTCFullYear()
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  const day = `${date.getUTCDate()}`.padStart(2, '0')
  const hours = `${date.getUTCHours()}`.padStart(2, '0')
  const minutes = `${date.getUTCMinutes()}`.padStart(2, '0')
  const seconds = `${date.getUTCSeconds()}`.padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

async function loadApplicationProjectionRows(
  companyId: string | null
): Promise<ApplicationProjectionRow[]> {
  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (application:Application)-[:OWNED_BY]->(company:Company)
        OPTIONAL MATCH (application)-[:PROVIDED_BY]->(provider:Supplier)
        WITH application, company, head(collect(provider.name)) AS providerName
        WHERE $companyId IS NULL OR company.id = $companyId
        RETURN
          application.id AS id,
          company.id AS companyId,
          application.name AS name,
          toString(application.status) AS status,
          toString(application.criticality) AS criticality,
          coalesce(providerName, application.vendor, '') AS vendor,
          coalesce(application.costs, 0.0) AS monthlyCost,
          toString(coalesce(application.updatedAt, application.createdAt, datetime())) AS updatedAt
        ORDER BY company.id, application.name
      `,
      { companyId }
    )

    return result.records.map(record => {
      const updatedAt = String(record.get('updatedAt'))

      return {
        id: String(record.get('id')),
        company_id: String(record.get('companyId')),
        name: String(record.get('name')),
        status: String(record.get('status')),
        criticality: String(record.get('criticality')),
        vendor: String(record.get('vendor')),
        monthly_cost: toNumber(record.get('monthlyCost')),
        updated_at: formatClickHouseDateTime(updatedAt),
        updated_month: normalizeUpdatedMonth(updatedAt),
      }
    })
  } finally {
    await session.close()
  }
}

async function loadCapabilityCoverageRows(
  companyId: string | null
): Promise<CapabilityCoverageRow[]> {
  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (capability:BusinessCapability)-[:OWNED_BY]->(company:Company)
        OPTIONAL MATCH (application:Application)-[:SUPPORTS]->(capability)
        WITH capability, company, count(application) AS supportedApplications
        WHERE $companyId IS NULL OR company.id = $companyId
        RETURN
          capability.id AS capabilityId,
          company.id AS companyId,
          capability.name AS capabilityName,
          coalesce(toString(capability.maturityLevel), toString(capability.status), 'UNKNOWN') AS maturity,
          supportedApplications AS supportedApplications,
          toString(coalesce(capability.updatedAt, capability.createdAt, datetime())) AS updatedAt
        ORDER BY company.id, capability.name
      `,
      { companyId }
    )

    return result.records.map(record => ({
      capability_id: String(record.get('capabilityId')),
      company_id: String(record.get('companyId')),
      capability_name: String(record.get('capabilityName')),
      maturity: String(record.get('maturity')),
      supported_applications: toNumber(record.get('supportedApplications')),
      updated_at: formatClickHouseDateTime(String(record.get('updatedAt'))),
    }))
  } finally {
    await session.close()
  }
}

export async function syncAnalyticsProjections(companyId: string | null) {
  const [applicationRows, capabilityRows] = await Promise.all([
    loadApplicationProjectionRows(companyId),
    loadCapabilityCoverageRows(companyId),
  ])

  await replaceProjectionRows('application_projection', applicationRows, companyId)
  await replaceProjectionRows('capability_coverage_projection', capabilityRows, companyId)

  return {
    companyId,
    syncedAt: new Date().toISOString(),
    applications: applicationRows.length,
    capabilities: capabilityRows.length,
  }
}
