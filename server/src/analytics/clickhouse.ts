const clickHouseUrl = process.env.CLICKHOUSE_URL || 'http://clickhouse:8123'
const clickHouseDb = process.env.CLICKHOUSE_DB || 'nextgen_analytics'
const clickHouseUser = process.env.CLICKHOUSE_USER || 'default'
const clickHousePassword = process.env.CLICKHOUSE_PASSWORD || ''

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

export async function replaceProjectionRows<T extends object>(
  tableName: 'application_projection' | 'capability_coverage_projection',
  rows: readonly T[],
  companyId: string | null
): Promise<void> {
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
