// Sovereignty maturity levels in order from lowest to highest
export const MATURITY_LEVELS = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'] as const
export type MaturityLevel = (typeof MATURITY_LEVELS)[number]

// Convert maturity string to numeric score (1–5)
export function maturityScore(level: string | null | undefined): number {
  if (!level) return 1
  const idx = MATURITY_LEVELS.indexOf(level as MaturityLevel)
  return idx >= 0 ? idx + 1 : 1
}

const SOVEREIGNTY_ACH_FIELDS: Array<keyof AchievedEntity> = [
  'sovereigntyAchDataResidency',
  'sovereigntyAchJurisdictionControl',
  'sovereigntyAchOperationalControl',
  'sovereigntyAchInteroperability',
  'sovereigntyAchPortability',
  'sovereigntyAchSupplyChainTransparency',
]

const SOVEREIGNTY_REQ_FIELDS: Array<keyof RequirementEntity> = [
  'sovereigntyReqDataResidency',
  'sovereigntyReqJurisdictionControl',
  'sovereigntyReqOperationalControl',
  'sovereigntyReqInteroperability',
  'sovereigntyReqPortability',
  'sovereigntyReqSupplyChainTransparency',
]

export interface AchievedEntity {
  id: string
  name: string
  sovereigntyAchDataResidency?: string | null
  sovereigntyAchJurisdictionControl?: string | null
  sovereigntyAchOperationalControl?: string | null
  sovereigntyAchInteroperability?: string | null
  sovereigntyAchPortability?: string | null
  sovereigntyAchSupplyChainTransparency?: string | null
}

export interface RequirementEntity {
  id: string
  name: string
  sovereigntyReqDataResidency?: string | null
  sovereigntyReqJurisdictionControl?: string | null
  sovereigntyReqOperationalControl?: string | null
  sovereigntyReqInteroperability?: string | null
  sovereigntyReqPortability?: string | null
  sovereigntyReqSupplyChainTransparency?: string | null
  sovereigntyReqWeight?: number | null
}

// Compute average sovereignty score across all 6 dimensions for a single entity
export function computeEntityAchivedScore(entity: AchievedEntity): number {
  const scores = SOVEREIGNTY_ACH_FIELDS.map(field =>
    maturityScore(entity[field] as string | null | undefined)
  )
  return scores.reduce((sum, s) => sum + s, 0) / scores.length
}

export function computeEntityRequiredScore(entity: RequirementEntity): number {
  const scores = SOVEREIGNTY_REQ_FIELDS.map(field =>
    maturityScore(entity[field] as string | null | undefined)
  )
  return scores.reduce((sum, s) => sum + s, 0) / scores.length
}

// Aggregate achieved scores across multiple entities (avg of entity averages)
export function computeAggregatedAchievedScore(entities: AchievedEntity[]): number {
  if (entities.length === 0) return 0
  const entityScores = entities.map(computeEntityAchivedScore)
  return entityScores.reduce((sum, s) => sum + s, 0) / entityScores.length
}

export function formatSovereigntyScore(score: number): string {
  return (Math.round(score * 100) / 100).toFixed(2)
}

// Returns true if at least one requirement field has been explicitly set (non-null)
export function hasAnySovereigntyReqs(entity: RequirementEntity): boolean {
  return SOVEREIGNTY_REQ_FIELDS.some(field => entity[field] != null)
}

// Returns true if at least one achievement field has been explicitly set (non-null)
export function hasAnySovereigntyAchs(entity: AchievedEntity): boolean {
  return SOVEREIGNTY_ACH_FIELDS.some(field => entity[field] != null)
}
