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
  'sovereigntyAchStrategicAutonomy',
  'sovereigntyAchResilience',
  'sovereigntyAchSecurity',
  'sovereigntyAchControl',
]

const SOVEREIGNTY_REQ_FIELDS: Array<keyof RequirementEntity> = [
  'sovereigntyReqStrategicAutonomy',
  'sovereigntyReqResilience',
  'sovereigntyReqSecurity',
  'sovereigntyReqControl',
]

export interface AchievedEntity {
  id: string
  name: string
  sovereigntyAchStrategicAutonomy?: string | null
  sovereigntyAchResilience?: string | null
  sovereigntyAchSecurity?: string | null
  sovereigntyAchControl?: string | null
}

interface EntityRef {
  id: string
}

interface DependencyInfrastructure extends AchievedEntity {
  parentInfrastructure?: AchievedEntity[] | AchievedEntity | null
}

interface HasInfrastructureDependencies {
  hostedOn?: DependencyInfrastructure[] | null
}

export interface DependencyApplication extends AchievedEntity, HasInfrastructureDependencies {
  components?: EntityRef[] | null
}

export interface DependencyAIComponent extends AchievedEntity, HasInfrastructureDependencies {
  usedByApplications?: EntityRef[] | null
}

export interface RequirementEntity {
  id: string
  name: string
  sovereigntyReqStrategicAutonomy?: string | null
  sovereigntyReqResilience?: string | null
  sovereigntyReqSecurity?: string | null
  sovereigntyReqControl?: string | null
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

// Aggregate achieved scores across multiple entities using the worst-case element.
// The capability/data achieved score should reflect the lowest achieved linked entity.
export function computeAggregatedAchievedScore(entities: AchievedEntity[]): number {
  if (entities.length === 0) return 0

  const explicitEntityScores = entities
    .filter(hasAnySovereigntyAchs)
    .map(entity => computeEntityAchivedScore(entity))

  if (explicitEntityScores.length === 0) {
    return 0
  }

  return explicitEntityScores.reduce(
    (min, score) => (score < min ? score : min),
    explicitEntityScores[0]
  )
}

function mergeAchievedEntity(existing: AchievedEntity, incoming: AchievedEntity): AchievedEntity {
  return {
    ...existing,
    ...incoming,
    name: existing.name || incoming.name,
    sovereigntyAchStrategicAutonomy:
      existing.sovereigntyAchStrategicAutonomy ?? incoming.sovereigntyAchStrategicAutonomy,
    sovereigntyAchResilience:
      existing.sovereigntyAchResilience ?? incoming.sovereigntyAchResilience,
    sovereigntyAchSecurity:
      existing.sovereigntyAchSecurity ?? incoming.sovereigntyAchSecurity,
    sovereigntyAchControl:
      existing.sovereigntyAchControl ?? incoming.sovereigntyAchControl,
  }
}

function addAchievedEntity(
  target: Map<string, AchievedEntity>,
  entity: AchievedEntity | null | undefined
) {
  if (!entity) return
  const existing = target.get(entity.id)
  if (!existing) {
    target.set(entity.id, entity)
    return
  }
  target.set(entity.id, mergeAchievedEntity(existing, entity))
}

function addAssociatedInfrastructure(
  target: Map<string, AchievedEntity>,
  entity: HasInfrastructureDependencies | null | undefined
) {
  const pickParentInfrastructure = (
    parentInfrastructure: DependencyInfrastructure['parentInfrastructure']
  ): AchievedEntity | null => {
    if (!parentInfrastructure) {
      return null
    }

    if (Array.isArray(parentInfrastructure)) {
      if (parentInfrastructure.length === 0) {
        return null
      }

      const withSovereigntyValues = parentInfrastructure.find(parent => hasAnySovereigntyAchs(parent))
      return withSovereigntyValues ?? parentInfrastructure[0]
    }

    return parentInfrastructure
  }

  const buildEffectiveInfrastructure = (
    infrastructure: DependencyInfrastructure
  ): AchievedEntity => {
    const parent = pickParentInfrastructure(infrastructure.parentInfrastructure)
    if (!parent) {
      return infrastructure
    }

    // Inherit sovereignty achievements from parent infrastructure only as fallback.
    // Explicit child values must take precedence.
    return {
      ...infrastructure,
      sovereigntyAchStrategicAutonomy:
        infrastructure.sovereigntyAchStrategicAutonomy ?? parent.sovereigntyAchStrategicAutonomy,
      sovereigntyAchResilience:
        infrastructure.sovereigntyAchResilience ?? parent.sovereigntyAchResilience,
      sovereigntyAchSecurity:
        infrastructure.sovereigntyAchSecurity ?? parent.sovereigntyAchSecurity,
      sovereigntyAchControl:
        infrastructure.sovereigntyAchControl ?? parent.sovereigntyAchControl,
    }
  }

  if (!entity) return
  const relationLists = [entity.hostedOn]
  for (const list of relationLists) {
    if (!list) continue
    for (const infrastructure of list) {
      addAchievedEntity(target, buildEffectiveInfrastructure(infrastructure))
    }
  }
}

interface DependencyTreeParams {
  rootApplications: AchievedEntity[]
  rootAIComponents?: AchievedEntity[]
  allApplications: DependencyApplication[]
  allAIComponents: DependencyAIComponent[]
}

export function collectAchievedDependencyTree({
  rootApplications,
  rootAIComponents = [],
  allApplications,
  allAIComponents,
}: DependencyTreeParams): AchievedEntity[] {
  const allById = new Map<string, AchievedEntity>()
  const appById = new Map(allApplications.map(app => [app.id, app]))
  const aiById = new Map(allAIComponents.map(ai => [ai.id, ai]))
  const rootAppById = new Map(rootApplications.map(app => [app.id, app]))
  const rootAiById = new Map(rootAIComponents.map(ai => [ai.id, ai as DependencyAIComponent]))

  const visitedApplicationIds = new Set<string>()
  const applicationStack = rootApplications.map(app => app.id)

  while (applicationStack.length > 0) {
    const applicationId = applicationStack.pop()
    if (!applicationId || visitedApplicationIds.has(applicationId)) {
      continue
    }

    visitedApplicationIds.add(applicationId)

    const application =
      appById.get(applicationId) ??
      (rootAppById.get(applicationId) as DependencyApplication | undefined)
    if (!application) {
      continue
    }

    addAchievedEntity(allById, application)
    addAssociatedInfrastructure(allById, application)

    for (const componentRef of application.components ?? []) {
      if (componentRef?.id && !visitedApplicationIds.has(componentRef.id)) {
        applicationStack.push(componentRef.id)
      }
    }
  }

  const aiIds = new Set(rootAIComponents.map(ai => ai.id))
  for (const ai of allAIComponents) {
    const isLinkedToVisitedApp = (ai.usedByApplications ?? []).some(app =>
      visitedApplicationIds.has(app.id)
    )
    if (isLinkedToVisitedApp) {
      aiIds.add(ai.id)
    }
  }

  aiIds.forEach(aiId => {
    const aiComponent = aiById.get(aiId) ?? rootAiById.get(aiId)
    if (!aiComponent) {
      return
    }
    addAchievedEntity(allById, aiComponent)
    addAssociatedInfrastructure(allById, aiComponent)
  })

  return Array.from(allById.values())
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
