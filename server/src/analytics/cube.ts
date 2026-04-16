import jwt from 'jsonwebtoken'

import { AnalyticsUser } from './auth'

type AnalyticsDimensionKey = 'status' | 'criticality' | 'vendor' | 'month'
type AnalyticsMeasureKey = 'applicationCount' | 'monthlyCost'

interface CubeQueryResponse {
  readonly data?: Array<Record<string, string | number | null>>
}

const cubeApiUrl = process.env.ANALYTICS_CUBE_API_URL || 'http://cube:4000/cubejs-api/v1'
const cubeApiSecret = process.env.CUBEJS_API_SECRET || 'nextgen-eam-analytics-dev'

const dimensionMemberMap: Record<AnalyticsDimensionKey, string> = {
  status: 'ApplicationProjection.status',
  criticality: 'ApplicationProjection.criticality',
  vendor: 'ApplicationProjection.vendor',
  month: 'ApplicationProjection.updatedMonth',
}

const measureMemberMap: Record<AnalyticsMeasureKey, string> = {
  applicationCount: 'ApplicationProjection.count',
  monthlyCost: 'ApplicationProjection.totalMonthlyCost',
}

function normalizeMonthLabel(rawValue: string): string {
  if (/^\d{4}-\d{2}$/.test(rawValue)) {
    return rawValue
  }

  const date = new Date(rawValue)
  if (Number.isNaN(date.getTime())) {
    return rawValue
  }

  return `${date.getUTCFullYear()}-${`${date.getUTCMonth() + 1}`.padStart(2, '0')}`
}

function createCubeToken(user: AnalyticsUser, companyId: string | null): string {
  return jwt.sign(
    {
      sub: user.sub,
      preferred_username: user.username,
      companyId,
    },
    cubeApiSecret,
    { expiresIn: '5m' }
  )
}

export async function loadAnalyticsChartData(
  user: AnalyticsUser,
  input: {
    readonly companyId: string | null
    readonly companyIds: readonly string[]
    readonly dimension: AnalyticsDimensionKey
    readonly measure: AnalyticsMeasureKey
  }
) {
  const dimensionMember = dimensionMemberMap[input.dimension]
  const measureMember = measureMemberMap[input.measure]

  const filters =
    input.companyIds.length > 0
      ? [
          {
            member: 'ApplicationProjection.companyId',
            operator: 'equals',
            values: input.companyIds,
          },
        ]
      : []

  const cubeQuery = {
    measures: [measureMember],
    dimensions: [dimensionMember],
    filters,
    order: {
      [dimensionMember]: input.dimension === 'month' ? 'asc' : 'asc',
    },
    limit: 50,
  }

  const queryUrl = new URL(`${cubeApiUrl}/load`)
  queryUrl.searchParams.set('query', JSON.stringify(cubeQuery))

  const response = await fetch(queryUrl.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${createCubeToken(user, input.companyId)}`,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Cube query failed with HTTP ${response.status}: ${message}`)
  }

  const payload = (await response.json()) as CubeQueryResponse
  const rows = payload.data ?? []

  return {
    data: rows.map(row => {
      const rawLabel = row[dimensionMember]
      const rawValue = row[measureMember]
      const label =
        input.dimension === 'month'
          ? normalizeMonthLabel(String(rawLabel ?? ''))
          : String(rawLabel ?? '')
      const value = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0)

      return {
        label,
        value: Number.isFinite(value) ? value : 0,
      }
    }),
    source: 'cube' as const,
    query: cubeQuery,
  }
}
