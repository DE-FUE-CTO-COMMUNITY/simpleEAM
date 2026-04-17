import jwt from 'jsonwebtoken'

import { AnalyticsUser } from './auth'
import {
  AnalyticsDimensionKey,
  AnalyticsElementType,
  AnalyticsMeasureKey,
  getAnalyticsCubeName,
  getAnalyticsDimensionMember,
  getAnalyticsMeasureMember,
  isAnalyticsDimensionSupported,
  isAnalyticsMeasureSupported,
} from './schema'

interface CubeQueryResponse {
  readonly data?: Array<Record<string, string | number | null>>
}

const cubeApiUrl = process.env.ANALYTICS_CUBE_API_URL || 'http://cube:4000/cubejs-api/v1'
const cubeApiSecret = process.env.CUBEJS_API_SECRET || 'nextgen-eam-analytics-dev'

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
    readonly elementType: AnalyticsElementType
    readonly companyId: string | null
    readonly companyIds: readonly string[]
    readonly dimension: AnalyticsDimensionKey
    readonly measure: AnalyticsMeasureKey
  }
) {
  if (!isAnalyticsDimensionSupported(input.elementType, input.dimension)) {
    throw new Error(`Unsupported analytics dimension '${input.dimension}' for ${input.elementType}`)
  }

  if (!isAnalyticsMeasureSupported(input.elementType, input.measure)) {
    throw new Error(`Unsupported analytics measure '${input.measure}' for ${input.elementType}`)
  }

  const cubeName = getAnalyticsCubeName(input.elementType)
  const dimensionMember = `${cubeName}.${getAnalyticsDimensionMember(input.elementType, input.dimension)}`
  const measureMember = `${cubeName}.${getAnalyticsMeasureMember(input.elementType, input.measure)}`

  const companyMember = `${cubeName}.companyId`
  const filters =
    input.companyIds.length > 0
      ? [
          {
            member: companyMember,
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
          : String(rawLabel ?? 'UNSPECIFIED')
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
