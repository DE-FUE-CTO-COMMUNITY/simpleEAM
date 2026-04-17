const clickHouseUrl = process.env.CLICKHOUSE_URL || 'http://clickhouse:8123'
const clickHouseDb = process.env.CLICKHOUSE_DB || 'nextgen_analytics'
const clickHouseUser = process.env.CLICKHOUSE_USER || 'default'
const clickHousePassword = process.env.CLICKHOUSE_PASSWORD || ''

const analyticsProjectionTableStatements = [
  `CREATE TABLE IF NOT EXISTS ${clickHouseDb}.business_capability_projection (
    id String,
    company_id String,
    name String,
    status LowCardinality(String),
    capability_type LowCardinality(String),
    maturity_level Float64,
    business_value Float64,
    supported_applications UInt32,
    supporting_ai_components UInt32,
    related_data_objects UInt32,
    updated_at DateTime,
    updated_month Date
  ) ENGINE = MergeTree
  ORDER BY (company_id, status, capability_type, id)`,
  `CREATE TABLE IF NOT EXISTS ${clickHouseDb}.application_analytics_projection (
    id String,
    company_id String,
    name String,
    status LowCardinality(String),
    criticality LowCardinality(String),
    vendor String,
    time_category LowCardinality(String),
    hosting_environment String,
    monthly_cost Float64,
    supported_capabilities UInt32,
    used_data_objects UInt32,
    ai_components UInt32,
    interfaces UInt32,
    updated_at DateTime,
    updated_month Date
  ) ENGINE = MergeTree
  ORDER BY (company_id, status, criticality, id)`,
  `CREATE TABLE IF NOT EXISTS ${clickHouseDb}.ai_component_projection (
    id String,
    company_id String,
    name String,
    status LowCardinality(String),
    ai_type LowCardinality(String),
    provider String,
    license String,
    monthly_cost Float64,
    accuracy Float64,
    supported_capabilities UInt32,
    training_data_objects UInt32,
    updated_at DateTime,
    updated_month Date
  ) ENGINE = MergeTree
  ORDER BY (company_id, status, ai_type, id)`,
  `CREATE TABLE IF NOT EXISTS ${clickHouseDb}.data_object_projection (
    id String,
    company_id String,
    name String,
    classification LowCardinality(String),
    format String,
    using_applications UInt32,
    transferring_interfaces UInt32,
    training_ai_components UInt32,
    updated_at DateTime,
    updated_month Date
  ) ENGINE = MergeTree
  ORDER BY (company_id, classification, id)`,
  `CREATE TABLE IF NOT EXISTS ${clickHouseDb}.application_interface_projection (
    id String,
    company_id String,
    name String,
    status LowCardinality(String),
    interface_type LowCardinality(String),
    protocol LowCardinality(String),
    source_applications UInt32,
    target_applications UInt32,
    transferred_data_objects UInt32,
    updated_at DateTime,
    updated_month Date
  ) ENGINE = MergeTree
  ORDER BY (company_id, status, interface_type, id)`,
  `CREATE TABLE IF NOT EXISTS ${clickHouseDb}.infrastructure_projection (
    id String,
    company_id String,
    name String,
    status LowCardinality(String),
    infrastructure_type LowCardinality(String),
    vendor String,
    location String,
    operating_system LowCardinality(String),
    monthly_cost Float64,
    hosted_applications UInt32,
    hosted_ai_components UInt32,
    updated_at DateTime,
    updated_month Date
  ) ENGINE = MergeTree
  ORDER BY (company_id, status, infrastructure_type, id)`,
] as const

let analyticsProjectionSchemaPromise: Promise<void> | null = null

function buildClickHouseUrl(query?: string): string {
  const url = new URL(clickHouseUrl)
  url.searchParams.set('database', clickHouseDb)
  url.searchParams.set('user', clickHouseUser)
  if (clickHousePassword) {
    url.searchParams.set('password', clickHousePassword)
  }
  if (query) {
    url.searchParams.set('query', query)
  }
  return url.toString()
}

function escapeLiteral(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export async function executeClickHouseStatement(statement: string, body?: string): Promise<void> {
  const isReadOnlyStatement = /^\s*(SELECT|SHOW|DESCRIBE|EXISTS|WITH)\b/i.test(statement)
  const response = await fetch(buildClickHouseUrl(statement), {
    method: body || !isReadOnlyStatement ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'text/plain; charset=utf-8' } : undefined,
    body,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`ClickHouse request failed with HTTP ${response.status}: ${message}`)
  }
}

export async function ensureAnalyticsProjectionSchema(): Promise<void> {
  if (!analyticsProjectionSchemaPromise) {
    analyticsProjectionSchemaPromise = (async () => {
      for (const statement of analyticsProjectionTableStatements) {
        await executeClickHouseStatement(statement)
      }
    })().catch(error => {
      analyticsProjectionSchemaPromise = null
      throw error
    })
  }

  await analyticsProjectionSchemaPromise
}

export async function replaceProjectionRows<T extends object>(
  tableName:
    | 'application_projection'
    | 'capability_coverage_projection'
    | 'business_capability_projection'
    | 'application_analytics_projection'
    | 'ai_component_projection'
    | 'data_object_projection'
    | 'application_interface_projection'
    | 'infrastructure_projection',
  rows: readonly T[],
  companyId: string | null
): Promise<void> {
  await ensureAnalyticsProjectionSchema()

  if (companyId) {
    await executeClickHouseStatement(
      `DELETE FROM ${clickHouseDb}.${tableName} WHERE company_id = '${escapeLiteral(companyId)}' SETTINGS mutations_sync = 1`
    )
  } else {
    await executeClickHouseStatement(`TRUNCATE TABLE ${clickHouseDb}.${tableName}`)
  }

  if (rows.length === 0) {
    return
  }

  const payload = rows.map(row => JSON.stringify(row)).join('\n')
  await executeClickHouseStatement(
    `INSERT INTO ${clickHouseDb}.${tableName} FORMAT JSONEachRow`,
    payload
  )
}
