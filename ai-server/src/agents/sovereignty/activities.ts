import { graphqlRequest } from '../../graphql/client'
import { SovereigntyScores } from '../types'

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const SOVEREIGNTY_BATCH_SIZE = 200

const MATURITY_SCORE: Record<string, number> = {
  NONE: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  VERY_HIGH: 5,
}

const REQ_DIMS = [
  'sovereigntyReqStrategicAutonomy',
  'sovereigntyReqResilience',
  'sovereigntyReqSecurity',
  'sovereigntyReqControl',
] as const

const ACH_DIMS = [
  'sovereigntyAchStrategicAutonomy',
  'sovereigntyAchResilience',
  'sovereigntyAchSecurity',
  'sovereigntyAchControl',
] as const

type SovereigntyEntity = Record<string, string | number | null | undefined>

// ─────────────────────────────────────────────
// Pagination helper
// ─────────────────────────────────────────────

async function fetchAllPages<T>(fetcher: (offset: number) => Promise<T[]>): Promise<T[]> {
  const all: T[] = []
  let offset = 0
  while (true) {
    const batch = await fetcher(offset)
    all.push(...batch)
    if (batch.length < SOVEREIGNTY_BATCH_SIZE) break
    offset += SOVEREIGNTY_BATCH_SIZE
  }
  return all
}

// ─────────────────────────────────────────────
// Activities
// ─────────────────────────────────────────────

export async function fetchSovereigntyReqEntities(input: {
  readonly companyId: string
  readonly accessToken: string
}): Promise<SovereigntyEntity[]> {
  const companyFilter = { company: { some: { id: { eq: input.companyId } } } }
  const reqFields = `
    sovereigntyReqStrategicAutonomy
    sovereigntyReqResilience
    sovereigntyReqSecurity
    sovereigntyReqControl
    sovereigntyReqWeight
  `
  const [capabilities, dataObjs] = await Promise.all([
    fetchAllPages<SovereigntyEntity>(offset =>
      graphqlRequest<{ businessCapabilities: SovereigntyEntity[] }>({
        query: `query FetchCapReq($where: BusinessCapabilityWhere, $limit: Int!, $offset: Int!) {
          businessCapabilities(where: $where, limit: $limit, offset: $offset) { ${reqFields} }
        }`,
        variables: { where: companyFilter, limit: SOVEREIGNTY_BATCH_SIZE, offset },
        accessToken: input.accessToken,
      }).then(d => d.businessCapabilities)
    ),
    fetchAllPages<SovereigntyEntity>(offset =>
      graphqlRequest<{ dataObjects: SovereigntyEntity[] }>({
        query: `query FetchDoReq($where: DataObjectWhere, $limit: Int!, $offset: Int!) {
          dataObjects(where: $where, limit: $limit, offset: $offset) { ${reqFields} }
        }`,
        variables: { where: companyFilter, limit: SOVEREIGNTY_BATCH_SIZE, offset },
        accessToken: input.accessToken,
      }).then(d => d.dataObjects)
    ),
  ])
  return [...capabilities, ...dataObjs]
}

export async function fetchSovereigntyAchEntities(input: {
  readonly companyId: string
  readonly accessToken: string
}): Promise<SovereigntyEntity[]> {
  const companyFilter = { company: { some: { id: { eq: input.companyId } } } }
  const achFields = `
    sovereigntyAchStrategicAutonomy
    sovereigntyAchResilience
    sovereigntyAchSecurity
    sovereigntyAchControl
  `
  const [applications, aiComponents, infrastructure, suppliers] = await Promise.all([
    fetchAllPages<SovereigntyEntity>(offset =>
      graphqlRequest<{ applications: SovereigntyEntity[] }>({
        query: `query FetchAppAch($where: ApplicationWhere, $limit: Int!, $offset: Int!) {
          applications(where: $where, limit: $limit, offset: $offset) { ${achFields} }
        }`,
        variables: { where: companyFilter, limit: SOVEREIGNTY_BATCH_SIZE, offset },
        accessToken: input.accessToken,
      }).then(d => d.applications)
    ),
    fetchAllPages<SovereigntyEntity>(offset =>
      graphqlRequest<{ aiComponents: SovereigntyEntity[] }>({
        query: `query FetchAiAch($where: AIComponentWhere, $limit: Int!, $offset: Int!) {
          aiComponents(where: $where, limit: $limit, offset: $offset) { ${achFields} }
        }`,
        variables: { where: companyFilter, limit: SOVEREIGNTY_BATCH_SIZE, offset },
        accessToken: input.accessToken,
      }).then(d => d.aiComponents)
    ),
    fetchAllPages<SovereigntyEntity>(offset =>
      graphqlRequest<{ infrastructures: SovereigntyEntity[] }>({
        query: `query FetchInfraAch($where: InfrastructureWhere, $limit: Int!, $offset: Int!) {
          infrastructures(where: $where, limit: $limit, offset: $offset) { ${achFields} }
        }`,
        variables: { where: companyFilter, limit: SOVEREIGNTY_BATCH_SIZE, offset },
        accessToken: input.accessToken,
      }).then(d => d.infrastructures)
    ),
    fetchAllPages<SovereigntyEntity>(offset =>
      graphqlRequest<{ suppliers: SovereigntyEntity[] }>({
        query: `query FetchSupAch($where: SupplierWhere, $limit: Int!, $offset: Int!) {
          suppliers(where: $where, limit: $limit, offset: $offset) { ${achFields} }
        }`,
        variables: { where: companyFilter, limit: SOVEREIGNTY_BATCH_SIZE, offset },
        accessToken: input.accessToken,
      }).then(d => d.suppliers)
    ),
  ])
  return [...applications, ...aiComponents, ...infrastructure, ...suppliers]
}

export async function computeSovereigntyScores(input: {
  readonly reqEntities: SovereigntyEntity[]
  readonly achEntities: SovereigntyEntity[]
}): Promise<SovereigntyScores> {
  const extractEntityScore = (
    entity: SovereigntyEntity,
    dims: readonly string[]
  ): number | null => {
    const scores = dims
      .map(dim => {
        const val = entity[dim]
        return typeof val === 'string' ? (MATURITY_SCORE[val] ?? null) : null
      })
      .filter((s): s is number => s !== null)
    return scores.length === 0 ? null : scores.reduce((a, b) => a + b, 0) / scores.length
  }

  const reqScores = input.reqEntities
    .map(e => extractEntityScore(e, REQ_DIMS))
    .filter((s): s is number => s !== null)

  const achScores = input.achEntities
    .map(e => extractEntityScore(e, ACH_DIMS))
    .filter((s): s is number => s !== null)

  const expectedSovereigntyScore = reqScores.length > 0 ? Math.max(...reqScores) : null
  const achievedSovereigntyScore = achScores.length > 0 ? Math.min(...achScores) : null
  const sovereigntyGap =
    expectedSovereigntyScore !== null && achievedSovereigntyScore !== null
      ? expectedSovereigntyScore - achievedSovereigntyScore
      : null
  const sovereigntyScorePercent =
    expectedSovereigntyScore !== null &&
    achievedSovereigntyScore !== null &&
    expectedSovereigntyScore > 0
      ? (achievedSovereigntyScore / expectedSovereigntyScore) * 100
      : null

  return {
    expectedSovereigntyScore,
    achievedSovereigntyScore,
    sovereigntyGap,
    sovereigntyScorePercent,
  }
}

export async function updateCompanySovereigntyScores(input: {
  readonly companyId: string
  readonly scores: SovereigntyScores
  readonly accessToken: string
}): Promise<void> {
  await graphqlRequest({
    query: `
      mutation UpdateSovereigntyScores($id: ID!, $update: CompanyUpdateInput!) {
        updateCompanies(where: { id: { eq: $id } }, update: $update) { companies { id } }
      }
    `,
    variables: {
      id: input.companyId,
      update: {
        expectedSovereigntyScore: { set: input.scores.expectedSovereigntyScore },
        achievedSovereigntyScore: { set: input.scores.achievedSovereigntyScore },
        sovereigntyGap: { set: input.scores.sovereigntyGap },
        sovereigntyScorePercent: { set: input.scores.sovereigntyScorePercent },
        sovereigntyScoreStatus: { set: 'IDLE' },
      },
    },
    accessToken: input.accessToken,
  })
}

export async function markSovereigntyCalculating(input: {
  readonly companyId: string
  readonly accessToken: string
}): Promise<void> {
  await graphqlRequest({
    query: `
      mutation MarkSovereigntyCalculating($id: ID!, $update: CompanyUpdateInput!) {
        updateCompanies(where: { id: { eq: $id } }, update: $update) { companies { id } }
      }
    `,
    variables: { id: input.companyId, update: { sovereigntyScoreStatus: { set: 'CALCULATING' } } },
    accessToken: input.accessToken,
  })
}

export async function markSovereigntyError(input: {
  readonly companyId: string
  readonly accessToken: string
}): Promise<void> {
  await graphqlRequest({
    query: `
      mutation MarkSovereigntyError($id: ID!, $update: CompanyUpdateInput!) {
        updateCompanies(where: { id: { eq: $id } }, update: $update) { companies { id } }
      }
    `,
    variables: { id: input.companyId, update: { sovereigntyScoreStatus: { set: 'ERROR' } } },
    accessToken: input.accessToken,
  })
}
