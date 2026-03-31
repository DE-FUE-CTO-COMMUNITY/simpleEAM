import { Response, Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { verifyToken } from '../auth/auth-jwks'
import { graphqlRequest } from '../graphql/client'
import { startAiRunWorkflow, startSovereigntyScoreWorkflow } from './temporal-client'
import { AiRunUseCase, CreateAiAuditEventInput, StrategicDraftPayload } from './types'

type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'LLM_CONFIG_MISSING'
  | 'WORKFLOW_START_FAILED'
  | 'INTERNAL_ERROR'

type ApiError = Error & {
  status?: number
  code?: ApiErrorCode
}

type DecodedToken = {
  sub?: string
  company_ids?: string[]
  realm_access?: {
    roles?: string[]
  }
}

type AiRunRecord = {
  id: string
  companyId: string
  prompt: string
  objective: string | null
  useCase: AiRunUseCase
  status: string
  approvalStatus: string | null
  workflowId: string | null
  initiatedBy: string | null
  resultSummary: string | null
  draftPayload: string | null
  errorMessage: string | null
  createdAt: string | null
  updatedAt: string | null
  startedAt: string | null
  completedAt: string | null
}

type AiAuditEventRecord = {
  id: string
  runId: string
  action: 'APPROVED' | 'REJECTED'
  actor: string
  comment: string | null
  createdAt: string | null
}

type AssistantEntityType =
  | 'APPLICATION'
  | 'BUSINESS_CAPABILITY'
  | 'DATA_OBJECT'
  | 'APPLICATION_INTERFACE'
  | 'INFRASTRUCTURE'
  | 'BUSINESS_PROCESS'

type AssistantQuestionEntity = {
  id: string
  name: string
  status?: string
}

type AssistantApplicationEntity = AssistantQuestionEntity & {
  supportsCapabilities: Array<{
    id: string
    name: string
  }>
}

type AssistantArchitectureSnapshot = {
  applications: AssistantApplicationEntity[]
  businessCapabilities: AssistantQuestionEntity[]
  capabilityApplicationCounts: Array<{
    capabilityId: string
    capabilityName: string
    applicationCount: number
  }>
  dataObjects: AssistantQuestionEntity[]
  applicationInterfaces: AssistantQuestionEntity[]
  infrastructure: AssistantQuestionEntity[]
  businessProcesses: AssistantQuestionEntity[]
}

type AssistantCitation = {
  entityType: AssistantEntityType
  entityId: string
  entityName: string
  evidenceLink: string
}

type AssistantAnswerPayload = {
  answer: string
  confidence: number
  citations: AssistantCitation[]
  referencedEntities: Array<{ entityType: AssistantEntityType; entityId: string; name: string }>
}

type AssistantChangeAction =
  | {
      kind: 'CREATE'
      entityType: AssistantEntityType
      values: {
        name: string
        description?: string
      }
    }
  | {
      kind: 'UPDATE'
      entityType: AssistantEntityType
      entityId: string
      field: 'name' | 'description' | 'status'
      value: string
    }
  | {
      kind: 'CONNECT' | 'DISCONNECT'
      sourceEntityType: AssistantEntityType
      sourceEntityId: string
      targetEntityType: AssistantEntityType
      targetEntityId: string
    }

type DryRunFinding = {
  severity: 'INFO' | 'WARNING' | 'ERROR'
  message: string
}

type AssistantChangePlanPayload = {
  mode: 'CHANGE_PLAN'
  requestText: string
  actions: AssistantChangeAction[]
  dryRun: {
    isValid: boolean
    findings: DryRunFinding[]
  }
  impactSummary: {
    creates: number
    updates: number
    connects: number
    disconnects: number
    touchedEntityIds: string[]
  }
  applied: boolean
  executionResults: Array<Record<string, unknown>>
}

const getBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) return null
  if (!authorizationHeader.startsWith('Bearer ')) return null
  return authorizationHeader.slice(7)
}

const createApiError = (status: number, code: ApiErrorCode, message: string): ApiError => {
  const error = new Error(message) as ApiError
  error.status = status
  error.code = code
  return error
}

const sendApiError = (res: Response, error: unknown, context?: Record<string, unknown>) => {
  const typedError = error as ApiError
  const status = typedError.status ?? 500
  const code = typedError.code ?? 'INTERNAL_ERROR'
  const message = typedError.message || 'Unknown error'

  console.error('[AI RUN][ERROR]', {
    status,
    code,
    message,
    ...context,
  })

  return res.status(status).json({
    error: {
      code,
      message,
    },
  })
}

const toIsoString = (value: unknown): string | null => {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'toString' in value) {
    const toStringFn = (value as { toString: () => string }).toString
    return typeof toStringFn === 'function' ? toStringFn.call(value) : null
  }
  return null
}

const getUserContext = async (authorizationHeader?: string): Promise<DecodedToken> => {
  const token = getBearerToken(authorizationHeader)
  if (!token) {
    throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
  }

  const decoded = await verifyToken(token)
  if (!decoded) {
    throw createApiError(401, 'UNAUTHENTICATED', 'Invalid token')
  }

  return decoded as DecodedToken
}

const enforceAiRunAccess = (decodedToken: DecodedToken, companyId: string) => {
  const roles = decodedToken.realm_access?.roles ?? []
  const isAdmin = roles.includes('admin')
  const isArchitect = roles.includes('architect')

  if (!isAdmin && !isArchitect) {
    throw createApiError(403, 'FORBIDDEN', 'Missing required role for AI run execution')
  }

  const companyIds = decodedToken.company_ids ?? []
  if (!isAdmin && !companyIds.includes(companyId)) {
    throw createApiError(403, 'FORBIDDEN', 'No access to selected company')
  }

  return {
    initiatedBy: decodedToken.sub ?? 'unknown',
  }
}

const enforceAdminAccess = (decodedToken: DecodedToken) => {
  const roles = decodedToken.realm_access?.roles ?? []
  const isAdmin = roles.includes('admin')

  if (!isAdmin) {
    throw createApiError(403, 'FORBIDDEN', 'Only admins can delete AI run history')
  }
}

const mapAiRunRecord = (run: Record<string, unknown>): AiRunRecord => ({
  id: String(run.id),
  companyId: String(run.companyId ?? ''),
  prompt: String(run.prompt ?? ''),
  objective: typeof run.objective === 'string' ? run.objective : null,
  useCase: (run.useCase as AiRunUseCase) ?? 'STRATEGIC_ENRICHMENT',
  status: String(run.status ?? 'UNKNOWN'),
  approvalStatus: typeof run.approvalStatus === 'string' ? run.approvalStatus : null,
  workflowId: typeof run.workflowId === 'string' ? run.workflowId : null,
  initiatedBy: typeof run.initiatedBy === 'string' ? run.initiatedBy : null,
  resultSummary: typeof run.resultSummary === 'string' ? run.resultSummary : null,
  draftPayload: typeof run.draftPayload === 'string' ? run.draftPayload : null,
  errorMessage: typeof run.errorMessage === 'string' ? run.errorMessage : null,
  createdAt: toIsoString(run.createdAt),
  updatedAt: toIsoString(run.updatedAt),
  startedAt: toIsoString(run.startedAt),
  completedAt: toIsoString(run.completedAt),
})

const loadAiRunById = async (runId: string, accessToken: string): Promise<AiRunRecord | null> => {
  const data = await graphqlRequest<{ aiRuns: Array<Record<string, unknown>> }>({
    query: `
      query LoadAiRunById($runId: ID!) {
        aiRuns(where: { id: { eq: $runId } }, limit: 1) {
          id
          companyId
          prompt
          objective
          useCase
          status
          approvalStatus
          workflowId
          initiatedBy
          resultSummary
          draftPayload
          errorMessage
          createdAt
          updatedAt
          startedAt
          completedAt
        }
      }
    `,
    variables: { runId },
    accessToken,
  })

  if (!data.aiRuns || data.aiRuns.length === 0) {
    return null
  }

  return mapAiRunRecord(data.aiRuns[0])
}

const createAuditEvent = async (
  input: CreateAiAuditEventInput & { accessToken: string }
): Promise<void> => {
  await graphqlRequest({
    query: `
      mutation CreateAiRunAuditEvent($input: [AiRunAuditEventCreateInput!]!) {
        createAiRunAuditEvents(input: $input) {
          aiRunAuditEvents {
            id
          }
        }
      }
    `,
    variables: {
      input: [
        {
          id: uuidv4(),
          runId: input.runId,
          action: input.action,
          actor: input.actor,
          comment: input.comment ?? null,
          run: {
            connect: [{ where: { node: { id: { eq: input.runId } } } }],
          },
        },
      ],
    },
    accessToken: input.accessToken,
  })
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const parseStrategicDraftPayload = (
  rawDraftPayload: string | null
): StrategicDraftPayload | null => {
  if (!rawDraftPayload) {
    return null
  }

  try {
    const parsed = JSON.parse(rawDraftPayload) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null
    }
    return parsed as StrategicDraftPayload
  } catch {
    return null
  }
}

const assistantEntityTypeLabelMap: Record<AssistantEntityType, string> = {
  APPLICATION: 'application',
  BUSINESS_CAPABILITY: 'business capability',
  DATA_OBJECT: 'data object',
  APPLICATION_INTERFACE: 'application interface',
  INFRASTRUCTURE: 'infrastructure',
  BUSINESS_PROCESS: 'business process',
}

const normalizeEntityType = (value: string): AssistantEntityType | null => {
  const normalized = value.trim().toLowerCase()
  if (['application', 'applications', 'app'].includes(normalized)) return 'APPLICATION'
  if (
    ['business capability', 'business capabilities', 'capability', 'capabilities'].includes(
      normalized
    )
  ) {
    return 'BUSINESS_CAPABILITY'
  }
  if (['data object', 'data objects', 'dataobject', 'dataobjects'].includes(normalized)) {
    return 'DATA_OBJECT'
  }
  if (
    ['application interface', 'application interfaces', 'interface', 'interfaces'].includes(
      normalized
    )
  ) {
    return 'APPLICATION_INTERFACE'
  }
  if (['infrastructure', 'infrastructures'].includes(normalized)) return 'INFRASTRUCTURE'
  if (['business process', 'business processes', 'process', 'processes'].includes(normalized)) {
    return 'BUSINESS_PROCESS'
  }

  return null
}

const getSnapshotEntities = (
  snapshot: AssistantArchitectureSnapshot,
  entityType: AssistantEntityType
): AssistantQuestionEntity[] => {
  switch (entityType) {
    case 'APPLICATION':
      return snapshot.applications
    case 'BUSINESS_CAPABILITY':
      return snapshot.businessCapabilities
    case 'DATA_OBJECT':
      return snapshot.dataObjects
    case 'APPLICATION_INTERFACE':
      return snapshot.applicationInterfaces
    case 'INFRASTRUCTURE':
      return snapshot.infrastructure
    case 'BUSINESS_PROCESS':
      return snapshot.businessProcesses
  }
}

const loadArchitectureSnapshot = async (
  companyId: string,
  accessToken: string
): Promise<AssistantArchitectureSnapshot> => {
  const data = await graphqlRequest<{
    applications: Array<{
      id: string
      name: string
      status: string
      supportsCapabilities: Array<{ id: string; name: string }>
    }>
    businessCapabilities: Array<{
      id: string
      name: string
      status: string
      supportedByApplications: Array<{ id: string }>
    }>
    dataObjects: Array<{ id: string; name: string; classification: string }>
    applicationInterfaces: Array<{ id: string; name: string; status: string }>
    infrastructures: Array<{ id: string; name: string; status: string }>
    businessProcesses: Array<{ id: string; name: string; status: string }>
  }>({
    query: `
      query AssistantArchitectureSnapshot($companyId: ID!) {
        applications(where: { company: { some: { id: { eq: $companyId } } } }, limit: 50) {
          id
          name
          status
          supportsCapabilities(limit: 200) {
            id
            name
          }
        }
        businessCapabilities(
          where: { company: { some: { id: { eq: $companyId } } } }
          limit: 50
        ) {
          id
          name
          status
          supportedByApplications(limit: 200) {
            id
          }
        }
        dataObjects(where: { company: { some: { id: { eq: $companyId } } } }, limit: 50) {
          id
          name
          classification
        }
        applicationInterfaces(
          where: { company: { some: { id: { eq: $companyId } } } }
          limit: 50
        ) {
          id
          name
          status
        }
        infrastructures(where: { company: { some: { id: { eq: $companyId } } } }, limit: 50) {
          id
          name
          status
        }
        businessProcesses(
          where: { company: { some: { id: { eq: $companyId } } } }
          limit: 50
        ) {
          id
          name
          status
        }
      }
    `,
    variables: { companyId },
    accessToken,
  })

  return {
    applications: data.applications,
    businessCapabilities: data.businessCapabilities,
    capabilityApplicationCounts: data.businessCapabilities.map(capability => ({
      capabilityId: capability.id,
      capabilityName: capability.name,
      applicationCount: capability.supportedByApplications.length,
    })),
    dataObjects: data.dataObjects.map(item => ({
      id: item.id,
      name: item.name,
      status: item.classification,
    })),
    applicationInterfaces: data.applicationInterfaces,
    infrastructure: data.infrastructures,
    businessProcesses: data.businessProcesses,
  }
}

const toNumericToken = (value: string): number | null => {
  const parsed = Number(value)
  if (Number.isFinite(parsed)) return parsed

  const normalized = value.trim().toLowerCase()
  const words: Record<string, number> = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
  }

  return normalized in words ? words[normalized] : null
}

const parseTopLimit = (question: string, fallback = 5): number => {
  const match = question.toLowerCase().match(/\btop\s+([a-z0-9]+)\b/i)
  if (!match) return fallback
  const parsed = toNumericToken(match[1])
  if (parsed === null) return fallback
  return Math.max(1, Math.min(20, parsed))
}

const getApplicationStatusFilter = (question: string): string | null => {
  const lowered = question.toLowerCase()
  if (/(\bretired\b|\bretire\b)/.test(lowered)) return 'RETIRED'
  if (/(\bactive\b)/.test(lowered)) return 'ACTIVE'
  if (/(\bin development\b|\bdeveloping\b|\bunder development\b)/.test(lowered)) {
    return 'IN_DEVELOPMENT'
  }
  return null
}

const stopWords = new Set([
  'how',
  'many',
  'applications',
  'application',
  'support',
  'supports',
  'supporting',
  'capability',
  'capabilities',
  'have',
  'more',
  'than',
  'with',
  'associated',
  'the',
  'a',
  'an',
  'do',
  'i',
  'of',
  'to',
  'and',
  'for',
])

const resolveCapabilityFromQuestion = (
  question: string,
  snapshot: AssistantArchitectureSnapshot
): { id: string; name: string } | null => {
  const lowered = question.toLowerCase()

  const explicitMatch = lowered.match(/\bcapabilit(?:y|ies)\s+([a-z0-9\s\-_/]+)\??$/i)
  const candidateText = explicitMatch?.[1]?.trim() || question
  const tokens = tokenize(candidateText).filter(token => !stopWords.has(token))
  if (tokens.length === 0) return null

  const scored = snapshot.businessCapabilities
    .map(capability => ({
      capability,
      score: tokens.reduce(
        (sum, token) => (capability.name.toLowerCase().includes(token) ? sum + 1 : sum),
        0
      ),
    }))
    .filter(item => item.score > 0)
    .sort((left, right) => right.score - left.score)

  if (scored.length === 0) return null

  return {
    id: scored[0].capability.id,
    name: scored[0].capability.name,
  }
}

const parseCapabilityAssociationConstraint = (question: string) => {
  const lowered = question.toLowerCase()

  const targetsCapabilityApplicationRelation =
    /\bcapabilit(y|ies)\b/.test(lowered) &&
    /\bapplication(s)?\b/.test(lowered) &&
    (/\bassociated\b/.test(lowered) ||
      /\bconnected\b/.test(lowered) ||
      /\bsupported\b/.test(lowered) ||
      /\bwith\b/.test(lowered))

  if (!targetsCapabilityApplicationRelation) {
    return null
  }

  const moreThan = lowered.match(/more than\s+([a-z0-9]+)/i)
  if (moreThan) {
    const threshold = toNumericToken(moreThan[1])
    if (threshold !== null) return { operator: 'gt' as const, threshold }
  }

  const atLeast = lowered.match(/at least\s+([a-z0-9]+)/i)
  if (atLeast) {
    const threshold = toNumericToken(atLeast[1])
    if (threshold !== null) return { operator: 'gte' as const, threshold }
  }

  const lessThan = lowered.match(/less than\s+([a-z0-9]+)/i)
  if (lessThan) {
    const threshold = toNumericToken(lessThan[1])
    if (threshold !== null) return { operator: 'lt' as const, threshold }
  }

  const exactly = lowered.match(/exactly\s+([a-z0-9]+)/i)
  if (exactly) {
    const threshold = toNumericToken(exactly[1])
    if (threshold !== null) return { operator: 'eq' as const, threshold }
  }

  return null
}

const isArchitectureValueImprovementQuestion = (question: string): boolean => {
  const lowered = question.toLowerCase()
  return (
    (/(\bincrease\b|\bimprove\b|\boptimi[sz]e\b|\braise\b|\bboost\b)/.test(lowered) &&
      /(\bvalue\b|\bimpact\b|\bbenefit\b)/.test(lowered) &&
      /(\barchitecture\b|\bit landscape\b|\beam\b)/.test(lowered)) ||
    /(\bhow can i\b|\bwhat should i do\b|\brecommend\b)/.test(lowered)
  )
}

const buildArchitectureValueImprovementAnswer = (snapshot: AssistantArchitectureSnapshot) => {
  const orphanCapabilities = snapshot.capabilityApplicationCounts.filter(
    capability => capability.applicationCount === 0
  )
  const heavilySupportedCapabilities = snapshot.capabilityApplicationCounts.filter(
    capability => capability.applicationCount >= 4
  )

  const applicationsWithoutCapabilities = snapshot.applications.filter(
    application => application.supportsCapabilities.length === 0
  )
  const retiredApplications = snapshot.applications.filter(
    application => (application.status || '').toUpperCase() === 'RETIRED'
  )
  const retiredApplicationsStillSupporting = retiredApplications.filter(
    application => application.supportsCapabilities.length > 0
  )

  const recommendations: string[] = []

  recommendations.push(
    `1) Close capability coverage gaps: ${orphanCapabilities.length} capabilities currently have no supporting application.`
  )

  recommendations.push(
    `2) Reduce support concentration risk: ${heavilySupportedCapabilities.length} capabilities are supported by 4+ applications.`
  )

  recommendations.push(
    `3) Improve application-to-capability alignment: ${applicationsWithoutCapabilities.length} applications are not mapped to any capability.`
  )

  recommendations.push(
    `4) Rationalize lifecycle debt: ${retiredApplicationsStillSupporting.length} retired applications still support active capability mappings.`
  )

  const citations: AssistantCitation[] = [
    ...orphanCapabilities.slice(0, 2).map(capability => ({
      entityType: 'BUSINESS_CAPABILITY' as const,
      entityId: capability.capabilityId,
      entityName: capability.capabilityName,
      evidenceLink: `graphql://BUSINESS_CAPABILITY/${capability.capabilityId}?supportedByApplications=${capability.applicationCount}`,
    })),
    ...retiredApplicationsStillSupporting.slice(0, 2).map(application => ({
      entityType: 'APPLICATION' as const,
      entityId: application.id,
      entityName: application.name,
      evidenceLink: `graphql://APPLICATION/${application.id}?status=${application.status ?? 'UNKNOWN'}&supportedCapabilities=${application.supportsCapabilities.length}`,
    })),
  ]

  return {
    answer: `To increase architecture value, focus on these actions: ${recommendations.join(' ')}`,
    confidence: 0.88,
    citations,
    referencedEntities: citations.map(citation => ({
      entityType: citation.entityType,
      entityId: citation.entityId,
      name: citation.entityName,
    })),
  }
}

const isArchitectureAssessmentQuestion = (question: string): boolean => {
  const lowered = question.toLowerCase()
  return (
    /(\bbad\b|\bwrong\b|\bweak(ness|nesses)?\b|\brisk(s)?\b|\bproblem(s)?\b|\bissue(s)?\b|\bpain point(s)?\b)/.test(
      lowered
    ) && /(\barchitecture\b|\bit landscape\b|\beam\b|\blandscape\b)/.test(lowered)
  )
}

const getAssistantLlmTimeoutMs = () => {
  const value = Number(process.env.AI_LLM_TIMEOUT_MS)
  return Number.isFinite(value) && value >= 5000 ? Math.floor(value) : 45000
}

const getSnapshotEntitiesByType = (
  snapshot: AssistantArchitectureSnapshot,
  entityType: AssistantEntityType
): AssistantQuestionEntity[] => {
  if (entityType === 'APPLICATION') return snapshot.applications
  if (entityType === 'BUSINESS_CAPABILITY') return snapshot.businessCapabilities
  if (entityType === 'DATA_OBJECT') return snapshot.dataObjects
  if (entityType === 'APPLICATION_INTERFACE') return snapshot.applicationInterfaces
  if (entityType === 'INFRASTRUCTURE') return snapshot.infrastructure
  return snapshot.businessProcesses
}

const buildSnapshotContextForAssistantLlm = (snapshot: AssistantArchitectureSnapshot): string => {
  const orphanCapabilities = snapshot.capabilityApplicationCounts
    .filter(capability => capability.applicationCount === 0)
    .map(capability => capability.capabilityName)
  const applicationsWithoutCapabilities = snapshot.applications
    .filter(application => application.supportsCapabilities.length === 0)
    .map(application => application.name)
  const retiredApplicationsStillSupporting = snapshot.applications
    .filter(application => (application.status || '').toUpperCase() === 'RETIRED')
    .filter(application => application.supportsCapabilities.length > 0)
    .map(application => application.name)

  const sample = (entityType: AssistantEntityType, max = 8) =>
    getSnapshotEntitiesByType(snapshot, entityType)
      .slice(0, max)
      .map(entity => entity.name)
      .join(', ')

  return [
    `Counts: applications=${snapshot.applications.length}, capabilities=${snapshot.businessCapabilities.length}, businessProcesses=${snapshot.businessProcesses.length}, dataObjects=${snapshot.dataObjects.length}, interfaces=${snapshot.applicationInterfaces.length}, infrastructure=${snapshot.infrastructure.length}.`,
    `Capabilities without supporting applications (${orphanCapabilities.length}): ${orphanCapabilities.slice(0, 10).join(', ') || 'none'}.`,
    `Applications without mapped capabilities (${applicationsWithoutCapabilities.length}): ${applicationsWithoutCapabilities.slice(0, 10).join(', ') || 'none'}.`,
    `Retired applications still supporting capabilities (${retiredApplicationsStillSupporting.length}): ${retiredApplicationsStillSupporting.slice(0, 10).join(', ') || 'none'}.`,
    `Sample applications: ${sample('APPLICATION') || 'none'}.`,
    `Sample capabilities: ${sample('BUSINESS_CAPABILITY') || 'none'}.`,
    `Sample business processes: ${sample('BUSINESS_PROCESS') || 'none'}.`,
    `Sample data objects: ${sample('DATA_OBJECT') || 'none'}.`,
  ].join('\n')
}

const tryParseJsonObject = (value: string): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(value) as unknown
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
    return null
  } catch {
    return null
  }
}

const extractAssistantLlmText = (payload: unknown): string => {
  const asObject = payload as {
    choices?: Array<{
      message?: {
        content?: unknown
      }
      text?: unknown
    }>
  }

  const choice = asObject?.choices?.[0]
  if (!choice) return ''

  if (typeof choice.message?.content === 'string') {
    return choice.message.content.trim()
  }

  if (Array.isArray(choice.message?.content)) {
    const content = choice.message.content
      .map(item => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object' && 'text' in item) {
          const text = (item as { text?: unknown }).text
          return typeof text === 'string' ? text : ''
        }
        return ''
      })
      .join('\n')
      .trim()

    if (content) return content
  }

  return typeof choice.text === 'string' ? choice.text.trim() : ''
}

const buildEntityIndex = (
  snapshot: AssistantArchitectureSnapshot
): Array<{
  entityType: AssistantEntityType
  entityId: string
  entityName: string
  normalizedName: string
}> => {
  const types: AssistantEntityType[] = [
    'APPLICATION',
    'BUSINESS_CAPABILITY',
    'DATA_OBJECT',
    'APPLICATION_INTERFACE',
    'INFRASTRUCTURE',
    'BUSINESS_PROCESS',
  ]

  return types.flatMap(entityType =>
    getSnapshotEntitiesByType(snapshot, entityType).map(entity => ({
      entityType,
      entityId: entity.id,
      entityName: entity.name,
      normalizedName: entity.name.trim().toLowerCase(),
    }))
  )
}

const buildDeterministicRiskCitations = (
  snapshot: AssistantArchitectureSnapshot
): AssistantCitation[] => {
  const orphanCapabilities = snapshot.capabilityApplicationCounts
    .filter(capability => capability.applicationCount === 0)
    .slice(0, 3)
    .map(capability => ({
      entityType: 'BUSINESS_CAPABILITY' as const,
      entityId: capability.capabilityId,
      entityName: capability.capabilityName,
      evidenceLink: `graphql://BUSINESS_CAPABILITY/${capability.capabilityId}?supportedByApplications=${capability.applicationCount}`,
    }))

  const applicationsWithoutCapabilities = snapshot.applications
    .filter(application => application.supportsCapabilities.length === 0)
    .slice(0, 2)
    .map(application => ({
      entityType: 'APPLICATION' as const,
      entityId: application.id,
      entityName: application.name,
      evidenceLink: `graphql://APPLICATION/${application.id}?supportedCapabilities=0`,
    }))

  return [...orphanCapabilities, ...applicationsWithoutCapabilities]
}

const buildAssistantLlmAnswer = async (
  question: string,
  snapshot: AssistantArchitectureSnapshot,
  llmConfig: { llmUrl: string; llmModel: string; llmKey: string }
): Promise<AssistantAnswerPayload | null> => {
  const llmUrl = llmConfig.llmUrl
  const model = llmConfig.llmModel
  const apiKey = llmConfig.llmKey
  const timeoutMs = getAssistantLlmTimeoutMs()
  const context = buildSnapshotContextForAssistantLlm(snapshot)

  const body = {
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are an enterprise architecture assistant. Answer only based on provided architecture snapshot context. If question is broad or underspecified, provide best-effort answer and add one short follow-up question in field followUpQuestion. Return strict JSON with keys: answer (string), confidence (number 0..1), entityNames (string[]), followUpQuestion (string, optional).',
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nArchitecture snapshot context:\n${context}`,
      },
    ],
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  const abortController = new AbortController()
  const timeoutHandle = setTimeout(() => abortController.abort(), timeoutMs)

  try {
    const response = await fetch(llmUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: abortController.signal,
    })

    if (!response.ok) {
      throw new Error(`LLM request failed (${response.status})`)
    }

    const payload = (await response.json()) as unknown
    const text = extractAssistantLlmText(payload)
    if (!text) return null

    const json = tryParseJsonObject(text)
    if (!json) return null

    const answerText = typeof json.answer === 'string' ? json.answer.trim() : ''
    if (!answerText) return null

    const confidenceRaw = typeof json.confidence === 'number' ? json.confidence : 0.7
    const confidence = Math.min(0.99, Math.max(0.2, confidenceRaw))
    const followUpQuestion =
      typeof json.followUpQuestion === 'string' ? json.followUpQuestion.trim() : ''
    const answer = followUpQuestion ? `${answerText}\n\nFollow-up: ${followUpQuestion}` : answerText

    const candidateNames = Array.isArray(json.entityNames)
      ? json.entityNames
          .filter((name): name is string => typeof name === 'string')
          .map(name => name.trim())
      : []

    const entityIndex = buildEntityIndex(snapshot)
    const citedEntitiesFromEntityNames = candidateNames
      .map(candidateName => {
        const normalizedCandidate = candidateName.toLowerCase()
        return (
          entityIndex.find(entity => entity.normalizedName === normalizedCandidate) ??
          entityIndex.find(entity => entity.normalizedName.includes(normalizedCandidate)) ??
          null
        )
      })
      .filter((entity): entity is NonNullable<typeof entity> => Boolean(entity))
      .slice(0, 6)

    const citedEntitiesFromAnswerText = entityIndex
      .filter(entity => {
        if (entity.entityName.length < 4) return false
        return answer.toLowerCase().includes(entity.normalizedName)
      })
      .slice(0, 6)

    const mergedEntityCitations = [...citedEntitiesFromEntityNames, ...citedEntitiesFromAnswerText]
      .reduce<Array<(typeof citedEntitiesFromEntityNames)[number]>>((acc, entity) => {
        if (acc.some(existing => existing.entityId === entity.entityId)) {
          return acc
        }
        return [...acc, entity]
      }, [])
      .slice(0, 5)

    const citationsFromEntities: AssistantCitation[] = mergedEntityCitations.map(entity => ({
      entityType: entity.entityType,
      entityId: entity.entityId,
      entityName: entity.entityName,
      evidenceLink: `graphql://${entity.entityType}/${entity.entityId}`,
    }))

    const citations =
      citationsFromEntities.length > 0
        ? citationsFromEntities
        : buildDeterministicRiskCitations(snapshot)

    return {
      answer,
      confidence,
      citations,
      referencedEntities: citations.map(citation => ({
        entityType: citation.entityType,
        entityId: citation.entityId,
        name: citation.entityName,
      })),
    }
  } catch (error) {
    console.warn('[AI ASSISTANT][LLM][FAILED]', {
      error: error instanceof Error ? error.message : 'Unknown LLM error',
      llmUrl,
      model,
    })
    return null
  } finally {
    clearTimeout(timeoutHandle)
  }
}

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .split(/[^a-z0-9äöüß]+/i)
    .map(token => token.trim())
    .filter(token => token.length > 2)

const scoreEntityMatch = (entityName: string, tokens: string[]): number => {
  if (tokens.length === 0) return 0
  const normalizedName = entityName.toLowerCase()
  return tokens.reduce((score, token) => (normalizedName.includes(token) ? score + 1 : score), 0)
}

const buildQuestionAnswer = async (input: {
  question: string
  snapshot: AssistantArchitectureSnapshot
  llmConfig?: { llmUrl: string; llmModel: string; llmKey: string }
}): Promise<AssistantAnswerPayload> => {
  const question = input.question.trim()
  const lowered = question.toLowerCase()

  if (isArchitectureValueImprovementQuestion(question)) {
    return buildArchitectureValueImprovementAnswer(input.snapshot)
  }

  if (isArchitectureAssessmentQuestion(question)) {
    const llmAnswer = input.llmConfig
      ? await buildAssistantLlmAnswer(question, input.snapshot, input.llmConfig)
      : null
    if (llmAnswer) {
      return llmAnswer
    }

    const deterministic = buildArchitectureValueImprovementAnswer(input.snapshot)
    return {
      ...deterministic,
      answer: `Here are the main weak points I can infer from your architecture snapshot: ${deterministic.answer}`,
      confidence: 0.78,
    }
  }

  const isTopCapabilityByApplicationsQuestion =
    /\btop\b/.test(lowered) &&
    /\bcapabilit(y|ies)\b/.test(lowered) &&
    /\bapplication(s)?\b/.test(lowered) &&
    /(\bby\b|\bwith\b|\bassociated\b|\bsupport\b)/.test(lowered)

  if (isTopCapabilityByApplicationsQuestion) {
    const limit = parseTopLimit(question, 5)
    const ranked = [...input.snapshot.capabilityApplicationCounts]
      .sort((left, right) => right.applicationCount - left.applicationCount)
      .slice(0, limit)

    const citations = ranked.map(item => ({
      entityType: 'BUSINESS_CAPABILITY' as const,
      entityId: item.capabilityId,
      entityName: item.capabilityName,
      evidenceLink: `graphql://BUSINESS_CAPABILITY/${item.capabilityId}?supportedByApplications=${item.applicationCount}`,
    }))

    const listing = ranked
      .map((item, index) => `${index + 1}. ${item.capabilityName} (${item.applicationCount})`)
      .join('; ')

    return {
      answer:
        ranked.length > 0
          ? `Top ${ranked.length} capabilities by associated applications: ${listing}.`
          : 'No capabilities found to rank by associated applications.',
      confidence: 0.94,
      citations,
      referencedEntities: citations.map(citation => ({
        entityType: citation.entityType,
        entityId: citation.entityId,
        name: citation.entityName,
      })),
    }
  }

  const isApplicationSupportCapabilityCountQuestion =
    (/(\bhow many\b|\bcount\b|\bnumber of\b)/.test(lowered) || /\bdo i have\b/.test(lowered)) &&
    /\bapplication(s)?\b/.test(lowered) &&
    /\bsupport(s|ed|ing)?\b/.test(lowered) &&
    /\bcapabilit(y|ies)\b/.test(lowered)

  if (isApplicationSupportCapabilityCountQuestion) {
    const statusFilter = getApplicationStatusFilter(question)
    const resolvedCapability = resolveCapabilityFromQuestion(question, input.snapshot)

    if (!resolvedCapability) {
      return {
        answer:
          'I could not determine which capability you mean. Please include the capability name (for example: "How many retired applications support capability Customer Onboarding?").',
        confidence: 0.52,
        citations: [],
        referencedEntities: [],
      }
    }

    const matchingApplications = input.snapshot.applications.filter(application => {
      const supportsCapability = application.supportsCapabilities.some(
        capability => capability.id === resolvedCapability.id
      )
      if (!supportsCapability) return false
      if (!statusFilter) return true
      return (application.status || '').toUpperCase() === statusFilter
    })

    const citations: AssistantCitation[] = matchingApplications.slice(0, 5).map(application => ({
      entityType: 'APPLICATION',
      entityId: application.id,
      entityName: application.name,
      evidenceLink: `graphql://APPLICATION/${application.id}?supportsCapability=${resolvedCapability.id}`,
    }))

    const qualifier = statusFilter ? `${statusFilter.toLowerCase().replace('_', ' ')} ` : ''

    return {
      answer: `You have ${matchingApplications.length} ${qualifier}applications supporting capability ${resolvedCapability.name}.`,
      confidence: 0.92,
      citations,
      referencedEntities: [
        {
          entityType: 'BUSINESS_CAPABILITY',
          entityId: resolvedCapability.id,
          name: resolvedCapability.name,
        },
        ...citations.map(citation => ({
          entityType: citation.entityType,
          entityId: citation.entityId,
          name: citation.entityName,
        })),
      ],
    }
  }

  const capabilityConstraint = parseCapabilityAssociationConstraint(question)
  if (capabilityConstraint) {
    const matchingCapabilities = input.snapshot.capabilityApplicationCounts.filter(capability => {
      if (capabilityConstraint.operator === 'gt') {
        return capability.applicationCount > capabilityConstraint.threshold
      }
      if (capabilityConstraint.operator === 'gte') {
        return capability.applicationCount >= capabilityConstraint.threshold
      }
      if (capabilityConstraint.operator === 'lt') {
        return capability.applicationCount < capabilityConstraint.threshold
      }
      return capability.applicationCount === capabilityConstraint.threshold
    })

    const citations = matchingCapabilities.slice(0, 5).map(capability => ({
      entityType: 'BUSINESS_CAPABILITY' as const,
      entityId: capability.capabilityId,
      entityName: capability.capabilityName,
      evidenceLink: `graphql://BUSINESS_CAPABILITY/${capability.capabilityId}?supportedByApplications=${capability.applicationCount}`,
    }))

    const qualifier =
      capabilityConstraint.operator === 'gt'
        ? `more than ${capabilityConstraint.threshold}`
        : capabilityConstraint.operator === 'gte'
          ? `at least ${capabilityConstraint.threshold}`
          : capabilityConstraint.operator === 'lt'
            ? `less than ${capabilityConstraint.threshold}`
            : `exactly ${capabilityConstraint.threshold}`

    const example = matchingCapabilities
      .slice(0, 3)
      .map(capability => `${capability.capabilityName} (${capability.applicationCount})`)
      .join(', ')

    return {
      answer:
        matchingCapabilities.length > 0
          ? `You have ${matchingCapabilities.length} capabilities with ${qualifier} associated applications.${example ? ` Examples: ${example}.` : ''}`
          : `You have 0 capabilities with ${qualifier} associated applications.`,
      confidence: 0.93,
      citations,
      referencedEntities: citations.map(citation => ({
        entityType: citation.entityType,
        entityId: citation.entityId,
        name: citation.entityName,
      })),
    }
  }

  const candidateTypes: AssistantEntityType[] = [
    'APPLICATION',
    'BUSINESS_CAPABILITY',
    'DATA_OBJECT',
    'APPLICATION_INTERFACE',
    'INFRASTRUCTURE',
    'BUSINESS_PROCESS',
  ]

  const typeQuestionPatterns: Record<AssistantEntityType, RegExp[]> = {
    APPLICATION: [/\bapplication\b/i, /\bapplications\b/i, /\bapp\b/i, /\bapps\b/i],
    BUSINESS_CAPABILITY: [
      /\bbusiness capability\b/i,
      /\bbusiness capabilities\b/i,
      /\bcapability\b/i,
      /\bcapabilities\b/i,
    ],
    DATA_OBJECT: [/\bdata object\b/i, /\bdata objects\b/i, /\bdataobject\b/i],
    APPLICATION_INTERFACE: [
      /\bapplication interface\b/i,
      /\bapplication interfaces\b/i,
      /\binterface\b/i,
      /\binterfaces\b/i,
    ],
    INFRASTRUCTURE: [/\binfrastructure\b/i, /\binfrastructures\b/i],
    BUSINESS_PROCESS: [
      /\bbusiness process\b/i,
      /\bbusiness processes\b/i,
      /\bprocess\b/i,
      /\bprocesses\b/i,
    ],
  }

  const explicitType = candidateTypes.find(type =>
    typeQuestionPatterns[type].some(pattern => pattern.test(lowered))
  )

  const hasCountIntent =
    lowered.includes('how many') ||
    lowered.includes('count') ||
    lowered.includes('number of') ||
    lowered.includes('do i have') ||
    lowered.includes('have i got') ||
    lowered.includes('anzahl') ||
    lowered.includes('wieviele')

  if (explicitType && hasCountIntent) {
    const entities = getSnapshotEntities(input.snapshot, explicitType)
    const citations = entities.slice(0, 5).map(entity => ({
      entityType: explicitType,
      entityId: entity.id,
      entityName: entity.name,
      evidenceLink: `graphql://${explicitType}/${entity.id}`,
    }))

    return {
      answer: `I found ${entities.length} ${assistantEntityTypeLabelMap[explicitType]} entries for this company.`,
      confidence: 0.9,
      citations,
      referencedEntities: citations.map(citation => ({
        entityType: citation.entityType,
        entityId: citation.entityId,
        name: citation.entityName,
      })),
    }
  }

  const questionTokens = tokenize(question)
  const weightedMatches = candidateTypes
    .flatMap(entityType =>
      getSnapshotEntities(input.snapshot, entityType).map(entity => ({
        entityType,
        entity,
        score: scoreEntityMatch(entity.name, questionTokens),
      }))
    )
    .filter(entry => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 5)

  if (weightedMatches.length === 0) {
    const llmAnswer = input.llmConfig
      ? await buildAssistantLlmAnswer(question, input.snapshot, input.llmConfig)
      : null
    if (llmAnswer) {
      return llmAnswer
    }

    const fallbackSummary = [
      `${input.snapshot.applications.length} applications`,
      `${input.snapshot.businessCapabilities.length} capabilities`,
      `${input.snapshot.businessProcesses.length} business processes`,
      `${input.snapshot.dataObjects.length} data objects`,
      `${input.snapshot.applicationInterfaces.length} interfaces`,
      `${input.snapshot.infrastructure.length} infrastructure elements`,
    ].join(', ')

    return {
      answer: `I could not find specific named matches for that question. Current architecture snapshot includes ${fallbackSummary}.`,
      confidence: 0.45,
      citations: [],
      referencedEntities: [],
    }
  }

  const citations = weightedMatches.map(match => ({
    entityType: match.entityType,
    entityId: match.entity.id,
    entityName: match.entity.name,
    evidenceLink: `graphql://${match.entityType}/${match.entity.id}`,
  }))

  const topItems = weightedMatches
    .map(match => `${match.entity.name} (${assistantEntityTypeLabelMap[match.entityType]})`)
    .join(', ')

  return {
    answer: `Relevant architecture entities for your question are: ${topItems}.`,
    confidence: 0.72,
    citations,
    referencedEntities: citations.map(citation => ({
      entityType: citation.entityType,
      entityId: citation.entityId,
      name: citation.entityName,
    })),
  }
}

const parseChangeActionsFromRequest = (requestText: string): AssistantChangeAction[] => {
  const trimmed = requestText.trim()
  if (!trimmed) return []

  const connectPattern =
    /(connect|link|disconnect|unlink)\s+(application|business capability|capability|data object|application interface|interface|infrastructure|business process)\s+([a-zA-Z0-9-]+)\s+(to|with|from)\s+(application|business capability|capability|data object|application interface|interface|infrastructure|business process)\s+([a-zA-Z0-9-]+)/i
  const createPattern =
    /(create|add)\s+(application|business capability|capability|data object|application interface|interface|infrastructure|business process)\s+(named\s+)?"?([^"\n]+)"?/i
  const updatePattern =
    /(update|rename|set)\s+(application|business capability|capability|data object|application interface|interface|infrastructure|business process)\s+([a-zA-Z0-9-]+)\s+(name|description|status)\s*(to|=)?\s*"?([^"\n]+)"?/i

  const connectMatch = trimmed.match(connectPattern)
  if (connectMatch) {
    const operation = connectMatch[1].toLowerCase()
    const sourceEntityType = normalizeEntityType(connectMatch[2])
    const targetEntityType = normalizeEntityType(connectMatch[5])
    if (!sourceEntityType || !targetEntityType) return []
    return [
      {
        kind: operation === 'disconnect' || operation === 'unlink' ? 'DISCONNECT' : 'CONNECT',
        sourceEntityType,
        sourceEntityId: connectMatch[3],
        targetEntityType,
        targetEntityId: connectMatch[6],
      },
    ]
  }

  const createMatch = trimmed.match(createPattern)
  if (createMatch) {
    const entityType = normalizeEntityType(createMatch[2])
    if (!entityType) return []
    return [
      {
        kind: 'CREATE',
        entityType,
        values: {
          name: createMatch[4].trim(),
        },
      },
    ]
  }

  const updateMatch = trimmed.match(updatePattern)
  if (updateMatch) {
    const entityType = normalizeEntityType(updateMatch[2])
    const field = updateMatch[4].trim().toLowerCase()
    if (!entityType || !['name', 'description', 'status'].includes(field)) {
      return []
    }

    return [
      {
        kind: 'UPDATE',
        entityType,
        entityId: updateMatch[3],
        field: field as 'name' | 'description' | 'status',
        value: updateMatch[6].trim(),
      },
    ]
  }

  return []
}

const loadEntityForCompany = async (input: {
  entityType: AssistantEntityType
  entityId: string
  companyId: string
  accessToken: string
}): Promise<{ id: string; name: string; status?: string } | null> => {
  if (input.entityType === 'APPLICATION') {
    const data = await graphqlRequest<{
      applications: Array<{ id: string; name: string; status: string }>
    }>({
      query: `
        query LoadApplication($entityId: ID!, $companyId: ID!) {
          applications(
            where: { id: { eq: $entityId }, company: { some: { id: { eq: $companyId } } } }
            limit: 1
          ) {
            id
            name
            status
          }
        }
      `,
      variables: { entityId: input.entityId, companyId: input.companyId },
      accessToken: input.accessToken,
    })
    return data.applications[0] ?? null
  }

  if (input.entityType === 'BUSINESS_CAPABILITY') {
    const data = await graphqlRequest<{
      businessCapabilities: Array<{ id: string; name: string; status: string }>
    }>({
      query: `
        query LoadCapability($entityId: ID!, $companyId: ID!) {
          businessCapabilities(
            where: { id: { eq: $entityId }, company: { some: { id: { eq: $companyId } } } }
            limit: 1
          ) {
            id
            name
            status
          }
        }
      `,
      variables: { entityId: input.entityId, companyId: input.companyId },
      accessToken: input.accessToken,
    })
    return data.businessCapabilities[0] ?? null
  }

  if (input.entityType === 'DATA_OBJECT') {
    const data = await graphqlRequest<{
      dataObjects: Array<{ id: string; name: string; classification: string }>
    }>({
      query: `
        query LoadDataObject($entityId: ID!, $companyId: ID!) {
          dataObjects(
            where: { id: { eq: $entityId }, company: { some: { id: { eq: $companyId } } } }
            limit: 1
          ) {
            id
            name
            classification
          }
        }
      `,
      variables: { entityId: input.entityId, companyId: input.companyId },
      accessToken: input.accessToken,
    })
    const row = data.dataObjects[0]
    return row ? { id: row.id, name: row.name, status: row.classification } : null
  }

  if (input.entityType === 'APPLICATION_INTERFACE') {
    const data = await graphqlRequest<{
      applicationInterfaces: Array<{ id: string; name: string; status: string }>
    }>({
      query: `
        query LoadInterface($entityId: ID!, $companyId: ID!) {
          applicationInterfaces(
            where: { id: { eq: $entityId }, company: { some: { id: { eq: $companyId } } } }
            limit: 1
          ) {
            id
            name
            status
          }
        }
      `,
      variables: { entityId: input.entityId, companyId: input.companyId },
      accessToken: input.accessToken,
    })
    return data.applicationInterfaces[0] ?? null
  }

  if (input.entityType === 'INFRASTRUCTURE') {
    const data = await graphqlRequest<{
      infrastructures: Array<{ id: string; name: string; status: string }>
    }>({
      query: `
        query LoadInfrastructure($entityId: ID!, $companyId: ID!) {
          infrastructures(
            where: { id: { eq: $entityId }, company: { some: { id: { eq: $companyId } } } }
            limit: 1
          ) {
            id
            name
            status
          }
        }
      `,
      variables: { entityId: input.entityId, companyId: input.companyId },
      accessToken: input.accessToken,
    })
    return data.infrastructures[0] ?? null
  }

  const data = await graphqlRequest<{
    businessProcesses: Array<{ id: string; name: string; status: string }>
  }>({
    query: `
      query LoadBusinessProcess($entityId: ID!, $companyId: ID!) {
        businessProcesses(
          where: { id: { eq: $entityId }, company: { some: { id: { eq: $companyId } } } }
          limit: 1
        ) {
          id
          name
          status
        }
      }
    `,
    variables: { entityId: input.entityId, companyId: input.companyId },
    accessToken: input.accessToken,
  })

  return data.businessProcesses[0] ?? null
}

const dryRunChangeActions = async (input: {
  companyId: string
  actions: AssistantChangeAction[]
  accessToken: string
}): Promise<{
  isValid: boolean
  findings: DryRunFinding[]
}> => {
  const findings: DryRunFinding[] = []

  for (const action of input.actions) {
    if (action.kind === 'CREATE') {
      if (!isNonEmptyString(action.values.name)) {
        findings.push({
          severity: 'ERROR',
          message: `Create action for ${action.entityType} misses a name`,
        })
      } else {
        findings.push({
          severity: 'INFO',
          message: `Create ${action.entityType} with name "${action.values.name}"`,
        })
      }
      continue
    }

    if (action.kind === 'UPDATE') {
      const entity = await loadEntityForCompany({
        entityType: action.entityType,
        entityId: action.entityId,
        companyId: input.companyId,
        accessToken: input.accessToken,
      })

      if (!entity) {
        findings.push({
          severity: 'ERROR',
          message: `Update target ${action.entityType} ${action.entityId} is not accessible in selected company`,
        })
      } else {
        findings.push({
          severity: 'INFO',
          message: `Update ${action.entityType} ${action.entityId}: ${action.field} -> ${action.value}`,
        })
      }
      continue
    }

    if (
      !(
        action.sourceEntityType === 'APPLICATION' &&
        action.targetEntityType === 'BUSINESS_CAPABILITY'
      )
    ) {
      findings.push({
        severity: 'ERROR',
        message: `Only APPLICATION -> BUSINESS_CAPABILITY connect/disconnect is supported in this release`,
      })
      continue
    }

    const source = await loadEntityForCompany({
      entityType: action.sourceEntityType,
      entityId: action.sourceEntityId,
      companyId: input.companyId,
      accessToken: input.accessToken,
    })
    const target = await loadEntityForCompany({
      entityType: action.targetEntityType,
      entityId: action.targetEntityId,
      companyId: input.companyId,
      accessToken: input.accessToken,
    })

    if (!source || !target) {
      findings.push({
        severity: 'ERROR',
        message: `${action.kind} target not accessible in selected company (${action.sourceEntityId} -> ${action.targetEntityId})`,
      })
    } else {
      findings.push({
        severity: 'INFO',
        message: `${action.kind} ${source.name} (${source.id}) ${action.kind === 'CONNECT' ? 'to' : 'from'} ${target.name} (${target.id})`,
      })
    }
  }

  return {
    isValid: !findings.some(finding => finding.severity === 'ERROR'),
    findings,
  }
}

const buildImpactSummary = (actions: AssistantChangeAction[]) => {
  const touchedEntityIds = new Set<string>()
  let creates = 0
  let updates = 0
  let connects = 0
  let disconnects = 0

  for (const action of actions) {
    if (action.kind === 'CREATE') {
      creates += 1
      continue
    }
    if (action.kind === 'UPDATE') {
      updates += 1
      touchedEntityIds.add(action.entityId)
      continue
    }
    if (action.kind === 'CONNECT') {
      connects += 1
    } else {
      disconnects += 1
    }
    touchedEntityIds.add(action.sourceEntityId)
    touchedEntityIds.add(action.targetEntityId)
  }

  return {
    creates,
    updates,
    connects,
    disconnects,
    touchedEntityIds: Array.from(touchedEntityIds),
  }
}

const createAssistantChangePlanRun = async (input: {
  companyId: string
  prompt: string
  initiatedBy: string
  accessToken: string
  payload: AssistantChangePlanPayload
}): Promise<{ runId: string }> => {
  const result = await graphqlRequest<{ createAiRuns: { aiRuns: Array<{ id: string }> } }>({
    query: `
      mutation CreateAssistantPlanRun($input: [AiRunCreateInput!]!) {
        createAiRuns(input: $input) {
          aiRuns {
            id
          }
        }
      }
    `,
    variables: {
      input: [
        {
          companyId: input.companyId,
          prompt: input.prompt,
          useCase: 'CONVERSATIONAL_ASSISTANT',
          status: 'COMPLETED',
          approvalStatus: 'PENDING_REVIEW',
          initiatedBy: input.initiatedBy,
          resultSummary: 'Controlled change proposal generated with dry-run validation',
          draftPayload: JSON.stringify(input.payload),
          company: {
            connect: [{ where: { node: { id: { eq: input.companyId } } } }],
          },
        },
      ],
    },
    accessToken: input.accessToken,
  })

  const runId = result.createAiRuns.aiRuns[0]?.id
  if (!runId) {
    throw createApiError(500, 'INTERNAL_ERROR', 'Failed to create assistant change proposal run')
  }

  await createAuditEvent({
    runId,
    action: 'PROPOSAL_CREATED',
    actor: input.initiatedBy,
    comment: JSON.stringify({ prompt: input.prompt }),
    accessToken: input.accessToken,
  })

  await createAuditEvent({
    runId,
    action: 'DRY_RUN_VALIDATED',
    actor: input.initiatedBy,
    comment: JSON.stringify(input.payload.dryRun),
    accessToken: input.accessToken,
  })

  return { runId }
}

const loadAssistantChangePlan = (run: AiRunRecord): AssistantChangePlanPayload | null => {
  if (run.useCase !== 'CONVERSATIONAL_ASSISTANT' || !run.draftPayload) {
    return null
  }

  try {
    const parsed = JSON.parse(run.draftPayload) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const payload = parsed as AssistantChangePlanPayload
    if (payload.mode !== 'CHANGE_PLAN' || !Array.isArray(payload.actions)) return null
    return payload
  } catch {
    return null
  }
}

const executeChangeActions = async (input: {
  companyId: string
  actions: AssistantChangeAction[]
  accessToken: string
}): Promise<Array<Record<string, unknown>>> => {
  const results: Array<Record<string, unknown>> = []

  for (const action of input.actions) {
    if (action.kind === 'CREATE') {
      if (action.entityType === 'APPLICATION') {
        const entityId = uuidv4()
        await graphqlRequest({
          query: `
            mutation CreateAssistantApplication($input: [ApplicationCreateInput!]!) {
              createApplications(input: $input) {
                applications { id }
              }
            }
          `,
          variables: {
            input: [
              {
                id: entityId,
                name: action.values.name,
                description: action.values.description ?? null,
                status: 'IN_DEVELOPMENT',
                criticality: 'MEDIUM',
                company: {
                  connect: [{ where: { node: { id: { eq: input.companyId } } } }],
                },
              },
            ],
          },
          accessToken: input.accessToken,
        })
        results.push({ kind: 'CREATE', entityType: action.entityType, entityId })
        continue
      }

      if (action.entityType === 'BUSINESS_CAPABILITY') {
        const entityId = uuidv4()
        await graphqlRequest({
          query: `
            mutation CreateAssistantCapability($input: [BusinessCapabilityCreateInput!]!) {
              createBusinessCapabilities(input: $input) {
                businessCapabilities { id }
              }
            }
          `,
          variables: {
            input: [
              {
                id: entityId,
                name: action.values.name,
                description: action.values.description ?? null,
                status: 'PLANNED',
                company: {
                  connect: [{ where: { node: { id: { eq: input.companyId } } } }],
                },
              },
            ],
          },
          accessToken: input.accessToken,
        })
        results.push({ kind: 'CREATE', entityType: action.entityType, entityId })
        continue
      }

      throw createApiError(
        409,
        'CONFLICT',
        `Create action for ${action.entityType} is not supported`
      )
    }

    if (action.kind === 'UPDATE') {
      const field = action.field
      if (action.entityType === 'APPLICATION') {
        await graphqlRequest({
          query: `
            mutation UpdateAssistantApplication($entityId: ID!, $companyId: ID!, $value: String!) {
              updateApplications(
                where: {
                  id: { eq: $entityId }
                  company: { some: { id: { eq: $companyId } } }
                }
                update: { ${field}: $value }
              ) {
                applications { id }
              }
            }
          `,
          variables: {
            entityId: action.entityId,
            companyId: input.companyId,
            value: action.value,
          },
          accessToken: input.accessToken,
        })
        results.push({
          kind: 'UPDATE',
          entityType: action.entityType,
          entityId: action.entityId,
          field,
          value: action.value,
        })
        continue
      }

      if (
        action.entityType === 'BUSINESS_CAPABILITY' &&
        (field === 'name' || field === 'description')
      ) {
        await graphqlRequest({
          query: `
            mutation UpdateAssistantCapability($entityId: ID!, $companyId: ID!, $value: String!) {
              updateBusinessCapabilities(
                where: {
                  id: { eq: $entityId }
                  company: { some: { id: { eq: $companyId } } }
                }
                update: { ${field}: $value }
              ) {
                businessCapabilities { id }
              }
            }
          `,
          variables: {
            entityId: action.entityId,
            companyId: input.companyId,
            value: action.value,
          },
          accessToken: input.accessToken,
        })
        results.push({
          kind: 'UPDATE',
          entityType: action.entityType,
          entityId: action.entityId,
          field,
          value: action.value,
        })
        continue
      }

      throw createApiError(
        409,
        'CONFLICT',
        `Update action for ${action.entityType}.${field} is not supported`
      )
    }

    if (
      !(
        action.sourceEntityType === 'APPLICATION' &&
        action.targetEntityType === 'BUSINESS_CAPABILITY'
      )
    ) {
      throw createApiError(
        409,
        'CONFLICT',
        'Only APPLICATION -> BUSINESS_CAPABILITY relation changes are supported'
      )
    }

    await graphqlRequest({
      query: `
        mutation ${action.kind === 'CONNECT' ? 'ConnectAssistantEntities' : 'DisconnectAssistantEntities'}(
          $sourceId: ID!
          $targetId: ID!
          $companyId: ID!
        ) {
          updateApplications(
            where: {
              id: { eq: $sourceId }
              company: { some: { id: { eq: $companyId } } }
            }
            ${action.kind === 'CONNECT' ? 'connect' : 'disconnect'}: {
              supportsCapabilities: [{ where: { node: { id: { eq: $targetId } } } }]
            }
          ) {
            applications { id }
          }
        }
      `,
      variables: {
        sourceId: action.sourceEntityId,
        targetId: action.targetEntityId,
        companyId: input.companyId,
      },
      accessToken: input.accessToken,
    })

    results.push({
      kind: action.kind,
      sourceEntityType: action.sourceEntityType,
      sourceEntityId: action.sourceEntityId,
      targetEntityType: action.targetEntityType,
      targetEntityId: action.targetEntityId,
    })
  }

  return results
}

const validateStrategicDraftPayload = (
  draftPayload: StrategicDraftPayload | null
): string | null => {
  if (!draftPayload) {
    return 'Draft payload is missing'
  }

  const hasValidMission =
    draftPayload.mission &&
    isNonEmptyString(draftPayload.mission.name) &&
    isNonEmptyString(draftPayload.mission.purposeStatement)

  const hasValidVision =
    draftPayload.vision &&
    isNonEmptyString(draftPayload.vision.name) &&
    isNonEmptyString(draftPayload.vision.visionStatement)

  const hasValues =
    Array.isArray(draftPayload.values) &&
    draftPayload.values.length > 0 &&
    draftPayload.values.every(
      value => isNonEmptyString(value.name) && isNonEmptyString(value.valueStatement)
    )

  const hasGoals =
    Array.isArray(draftPayload.goals) &&
    draftPayload.goals.length > 0 &&
    draftPayload.goals.every(
      goal => isNonEmptyString(goal.name) && isNonEmptyString(goal.goalStatement)
    )

  const hasStrategies =
    Array.isArray(draftPayload.strategies) &&
    draftPayload.strategies.length > 0 &&
    draftPayload.strategies.every(
      strategy => isNonEmptyString(strategy.name) && isNonEmptyString(strategy.description)
    )

  if (!hasValidMission || !hasValidVision || !hasValues || !hasGoals || !hasStrategies) {
    return 'Draft payload does not contain required strategic fields'
  }

  return null
}

const persistStrategicDraftToGraphql = async (input: {
  companyId: string
  runId: string
  actor: string
  draftPayload: StrategicDraftPayload
  accessToken: string
}) => {
  const timestamp = new Date().toISOString()
  const missionId = uuidv4()
  const visionId = uuidv4()
  const valueRows = input.draftPayload.values.map(value => ({
    id: uuidv4(),
    name: value.name.trim(),
    valueStatement: value.valueStatement.trim(),
  }))
  const goalRows = input.draftPayload.goals.map(goal => ({
    id: uuidv4(),
    name: goal.name.trim(),
    goalStatement: goal.goalStatement.trim(),
  }))
  const strategyRows = input.draftPayload.strategies.map(strategy => ({
    id: uuidv4(),
    name: strategy.name.trim(),
    description: strategy.description.trim(),
  }))

  const missionYear = isNonEmptyString(input.draftPayload.mission.year)
    ? input.draftPayload.mission.year
    : `${new Date().getUTCFullYear()}-01-01`
  const visionYear = isNonEmptyString(input.draftPayload.vision.year)
    ? input.draftPayload.vision.year
    : `${new Date().getUTCFullYear()}-01-01`

  await graphqlRequest({
    query: `
      mutation CreateMission($input: [GEA_MissionCreateInput!]!) {
        createGeaMissions(input: $input) {
          geaMissions { id }
        }
      }
    `,
    variables: {
      input: [
        {
          id: missionId,
          name: input.draftPayload.mission.name.trim(),
          purposeStatement: input.draftPayload.mission.purposeStatement.trim(),
          keywords: input.draftPayload.mission.keywords,
          year: missionYear,
          company: {
            connect: [{ where: { node: { id: { eq: input.companyId } } } }],
          },
        },
      ],
    },
    accessToken: input.accessToken,
  })

  await graphqlRequest({
    query: `
      mutation CreateVision($input: [GEA_VisionCreateInput!]!) {
        createGeaVisions(input: $input) {
          geaVisions { id }
        }
      }
    `,
    variables: {
      input: [
        {
          id: visionId,
          name: input.draftPayload.vision.name.trim(),
          visionStatement: input.draftPayload.vision.visionStatement.trim(),
          timeHorizon: input.draftPayload.vision.timeHorizon,
          year: visionYear,
          company: {
            connect: [{ where: { node: { id: { eq: input.companyId } } } }],
          },
          supportsMissions: {
            connect: [
              {
                where: { node: { id: { eq: missionId } } },
                edge: { score: 2 },
              },
            ],
          },
        },
      ],
    },
    accessToken: input.accessToken,
  })

  if (valueRows.length > 0) {
    await graphqlRequest({
      query: `
        mutation CreateValues($input: [GEA_ValueCreateInput!]!) {
          createGeaValues(input: $input) {
            geaValues { id }
          }
        }
      `,
      variables: {
        input: valueRows.map(value => ({
          id: value.id,
          name: value.name,
          valueStatement: value.valueStatement,
          company: {
            connect: [{ where: { node: { id: { eq: input.companyId } } } }],
          },
          supportsMissions: {
            connect: [{ where: { node: { id: { eq: missionId } } }, edge: { score: 2 } }],
          },
          supportsVisions: {
            connect: [{ where: { node: { id: { eq: visionId } } }, edge: { score: 2 } }],
          },
        })),
      },
      accessToken: input.accessToken,
    })
  }

  if (goalRows.length > 0) {
    await graphqlRequest({
      query: `
        mutation CreateGoals($input: [GEA_GoalCreateInput!]!) {
          createGeaGoals(input: $input) {
            geaGoals { id }
          }
        }
      `,
      variables: {
        input: goalRows.map(goal => ({
          id: goal.id,
          name: goal.name,
          goalStatement: goal.goalStatement,
          company: {
            connect: [{ where: { node: { id: { eq: input.companyId } } } }],
          },
          supportsMissions: {
            connect: [{ where: { node: { id: { eq: missionId } } }, edge: { score: 2 } }],
          },
          operationalizesVisions: {
            connect: [{ where: { node: { id: { eq: visionId } } }, edge: { score: 2 } }],
          },
        })),
      },
      accessToken: input.accessToken,
    })
  }

  if (strategyRows.length > 0) {
    const firstGoalId = goalRows[0]?.id
    await graphqlRequest({
      query: `
        mutation CreateStrategies($input: [GEA_StrategyCreateInput!]!) {
          createGeaStrategies(input: $input) {
            geaStrategies { id }
          }
        }
      `,
      variables: {
        input: strategyRows.map(strategy => ({
          id: strategy.id,
          name: strategy.name,
          description: strategy.description,
          company: {
            connect: [{ where: { node: { id: { eq: input.companyId } } } }],
          },
          ...(firstGoalId
            ? {
                achievesGoals: {
                  connect: [
                    {
                      where: { node: { id: { eq: firstGoalId } } },
                      edge: { score: 2 },
                    },
                  ],
                },
              }
            : {}),
        })),
      },
      accessToken: input.accessToken,
    })
  }

  console.info('[AI RUN][APPROVAL][PERSISTED]', {
    runId: input.runId,
    actor: input.actor,
    companyId: input.companyId,
    createdAt: timestamp,
  })
}

export const aiRunRouter = Router()

aiRunRouter.post('/sovereignty/recalculate', async (req, res) => {
  const companyId = typeof req.body?.companyId === 'string' ? req.body.companyId.trim() : ''

  try {
    if (!companyId) {
      throw createApiError(400, 'BAD_REQUEST', 'companyId is required')
    }

    const token = getBearerToken(req.headers.authorization)
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Missing authorization token')
    }

    const decodedToken = await getUserContext(req.headers.authorization)
    const roles = decodedToken.realm_access?.roles ?? []
    const isAdminOrArchitect = roles.includes('admin') || roles.includes('architect')
    if (!isAdminOrArchitect) {
      throw createApiError(403, 'FORBIDDEN', 'Missing required role for sovereignty recalculation')
    }

    const companyIds = decodedToken.company_ids ?? []
    if (!roles.includes('admin') && !companyIds.includes(companyId)) {
      throw createApiError(403, 'FORBIDDEN', 'No access to selected company')
    }

    const workflowId = `sovereignty-score-${companyId}-${Date.now()}`

    await startSovereigntyScoreWorkflow({
      companyId,
      accessToken: token,
      workflowId,
    })

    console.info('[SOVEREIGNTY][RECALCULATE][STARTED]', { companyId, workflowId })

    return res.status(202).json({ workflowId, status: 'CALCULATING' })
  } catch (error) {
    return sendApiError(res, error, { companyId })
  }
})

aiRunRouter.delete('/ai-runs', async (req, res) => {
  const companyId = typeof req.query.companyId === 'string' ? req.query.companyId : ''

  try {
    if (!companyId) {
      throw createApiError(400, 'BAD_REQUEST', 'companyId query parameter is required')
    }

    const decodedToken = await getUserContext(req.headers.authorization)
    enforceAdminAccess(decodedToken)

    console.info('[AI RUN][DELETE_HISTORY][REQUEST]', {
      companyId,
      initiatedBy: decodedToken.sub ?? 'unknown',
    })

    const companiesResult = await graphqlRequest<{ companies: Array<{ id: string }> }>({
      query: `
        query CheckCompany($companyId: ID!) {
          companies(where: { id: { eq: $companyId } }, limit: 1) { id }
        }
      `,
      variables: { companyId },
      accessToken: req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null,
    })

    if (!companiesResult.companies || companiesResult.companies.length === 0) {
      throw createApiError(404, 'NOT_FOUND', 'Company not found')
    }

    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const runQuery = await graphqlRequest<{ aiRuns: Array<{ id: string }> }>({
      query: `
        query AiRunsByCompany($companyId: String!) {
          aiRuns(where: { companyId: { eq: $companyId } }) {
            id
          }
        }
      `,
      variables: { companyId },
      accessToken: token,
    })

    const runIds = runQuery.aiRuns.map(run => run.id)

    let deletedAuditEvents = 0
    if (runIds.length > 0) {
      const auditDeleteResult = await graphqlRequest<{
        deleteAiRunAuditEvents: { nodesDeleted: number }
      }>({
        query: `
          mutation DeleteAiRunAuditEvents($runIds: [String!]!) {
            deleteAiRunAuditEvents(where: { runId: { in: $runIds } }) {
              nodesDeleted
            }
          }
        `,
        variables: { runIds },
        accessToken: token,
      })

      deletedAuditEvents = Number(auditDeleteResult.deleteAiRunAuditEvents?.nodesDeleted ?? 0)
    }

    const runDeleteResult = await graphqlRequest<{ deleteAiRuns: { nodesDeleted: number } }>({
      query: `
        mutation DeleteAiRuns($companyId: String!) {
          deleteAiRuns(where: { companyId: { eq: $companyId } }) {
            nodesDeleted
          }
        }
      `,
      variables: { companyId },
      accessToken: token,
    })

    const deletedRuns = Number(runDeleteResult.deleteAiRuns?.nodesDeleted ?? 0)

    console.info('[AI RUN][DELETE_HISTORY][SUCCESS]', {
      companyId,
      deletedRuns,
      deletedAuditEvents,
      initiatedBy: decodedToken.sub ?? 'unknown',
    })

    return res.status(200).json({
      companyId,
      deletedRuns,
      deletedAuditEvents,
    })
  } catch (error) {
    return sendApiError(res, error, { companyId })
  }
})

aiRunRouter.get('/ai-runs', async (req, res) => {
  const companyId = typeof req.query.companyId === 'string' ? req.query.companyId : ''
  try {
    if (!companyId) {
      throw createApiError(400, 'BAD_REQUEST', 'companyId query parameter is required')
    }

    const decodedToken = await getUserContext(req.headers.authorization)
    enforceAiRunAccess(decodedToken, companyId)

    console.info('[AI RUN][LIST][REQUEST]', {
      companyId,
      initiatedBy: decodedToken.sub ?? 'unknown',
    })

    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const result = await graphqlRequest<{ aiRuns: Array<Record<string, unknown>> }>({
      query: `
        query AiRunsByCompany($companyId: String!) {
          aiRuns(where: { companyId: { eq: $companyId } }) {
            id
            companyId
            prompt
            objective
            useCase
            status
            approvalStatus
            workflowId
            initiatedBy
            resultSummary
            draftPayload
            errorMessage
            createdAt
            updatedAt
            startedAt
            completedAt
          }
        }
      `,
      variables: { companyId },
      accessToken: token,
    })

    const runs = result.aiRuns
      .map(run => mapAiRunRecord(run))
      .sort((left, right) => (right.createdAt || '').localeCompare(left.createdAt || ''))
      .slice(0, 20)

    console.info('[AI RUN][LIST][SUCCESS]', {
      companyId,
      count: runs.length,
    })

    return res.status(200).json(runs)
  } catch (error) {
    return sendApiError(res, error, { companyId })
  }
})

aiRunRouter.post('/ai-runs', async (req, res) => {
  const companyId = typeof req.body?.companyId === 'string' ? req.body.companyId : ''
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt : ''
  const objective = typeof req.body?.objective === 'string' ? req.body.objective : null
  const useCase: AiRunUseCase = 'STRATEGIC_ENRICHMENT'
  const normalizedPrompt = prompt.trim()
  const effectivePrompt =
    normalizedPrompt ||
    'Create a strategic enrichment draft (mission, vision, values, goals, strategies, and business model canvas) based on publicly available company information.'

  try {
    if (!companyId) {
      throw createApiError(400, 'BAD_REQUEST', 'companyId is required')
    }

    const decodedToken = await getUserContext(req.headers.authorization)
    const { initiatedBy } = enforceAiRunAccess(decodedToken, companyId)

    let runId = ''
    let workflowId = ''
    const createdAt = new Date().toISOString()

    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const companyResult = await graphqlRequest<{
      companies: Array<{
        id: string
        name: string
        llmUrl?: string | null
        llmModel?: string | null
        llmKey?: string | null
      }>
    }>({
      query: `
        query LoadCompany($companyId: ID!) {
          companies(where: { id: { eq: $companyId } }, limit: 1) {
            id
            name
            llmUrl
            llmModel
            llmKey
          }
        }
      `,
      variables: { companyId },
      accessToken: token,
    })

    const company = companyResult.companies[0]
    if (!company) {
      throw createApiError(404, 'NOT_FOUND', 'Company not found')
    }

    if (!company.llmUrl?.trim() || !company.llmModel?.trim() || !company.llmKey?.trim()) {
      throw createApiError(
        422,
        'LLM_CONFIG_MISSING',
        'LLM configuration is incomplete for this company. Please configure LLM URL, model, and API key in the company settings.'
      )
    }

    const createResult = await graphqlRequest<{ createAiRuns: { aiRuns: Array<{ id: string }> } }>({
      query: `
        mutation CreateAiRun($input: [AiRunCreateInput!]!) {
          createAiRuns(input: $input) {
            aiRuns { id }
          }
        }
      `,
      variables: {
        input: [
          {
            companyId,
            prompt: effectivePrompt,
            objective,
            useCase,
            status: 'QUEUED',
            approvalStatus: 'PENDING_REVIEW',
            initiatedBy,
            company: {
              connect: [{ where: { node: { id: { eq: companyId } } } }],
            },
          },
        ],
      },
      accessToken: token,
    })

    runId = createResult.createAiRuns.aiRuns[0]?.id ?? ''
    if (!runId) {
      throw createApiError(500, 'INTERNAL_ERROR', 'Failed to create AI run')
    }

    workflowId = `ai-run-${runId}`

    console.info('[AI RUN][START][REQUEST]', {
      runId,
      workflowId,
      companyId,
      initiatedBy,
      useCase,
    })

    try {
      await startAiRunWorkflow({
        workflowId,
        runId,
        companyId,
        companyName: company.name,
        prompt: effectivePrompt,
        objective,
        initiatedBy,
        useCase,
        accessToken: token,
        llmUrl: company.llmUrl,
        llmModel: company.llmModel,
        llmKey: company.llmKey,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start workflow'
      const completedAt = new Date().toISOString()
      await graphqlRequest({
        query: `
            mutation MarkRunFailed($runId: ID!, $errorMessage: String!, $completedAt: DateTime!) {
              updateAiRuns(
                where: { id: { eq: $runId } }
                update: {
                  status: { set: "FAILED" }
                  errorMessage: { set: $errorMessage }
                  completedAt: { set: $completedAt }
                }
              ) {
                aiRuns { id }
              }
            }
          `,
        variables: {
          runId,
          errorMessage,
          completedAt,
        },
        accessToken: token,
      })
      throw createApiError(
        500,
        'WORKFLOW_START_FAILED',
        `Failed to start AI workflow: ${errorMessage}`
      )
    }

    await graphqlRequest({
      query: `
          mutation SetWorkflowId($runId: ID!, $workflowId: String!) {
            updateAiRuns(
              where: { id: { eq: $runId } }
              update: { workflowId: { set: $workflowId } }
            ) {
              aiRuns { id }
            }
          }
        `,
      variables: {
        runId,
        workflowId,
      },
      accessToken: token,
    })

    console.info('[AI RUN][START][QUEUED]', {
      runId,
      workflowId,
      companyId,
    })

    return res.status(201).json({
      workflowId,
      run: {
        id: runId,
        companyId,
        prompt: effectivePrompt,
        objective,
        useCase,
        status: 'QUEUED',
        approvalStatus: 'PENDING_REVIEW',
        workflowId,
        initiatedBy,
        createdAt,
        updatedAt: createdAt,
        resultSummary: null,
        draftPayload: null,
        errorMessage: null,
        startedAt: null,
        completedAt: null,
      },
    })
  } catch (error) {
    return sendApiError(res, error, {
      companyId,
    })
  }
})

aiRunRouter.post('/ai-runs/:runId/approve', async (req, res) => {
  const runId = req.params.runId
  const comment = typeof req.body?.comment === 'string' ? req.body.comment : null

  try {
    const decodedToken = await getUserContext(req.headers.authorization)
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const run = await loadAiRunById(runId, token)
    if (!run) {
      throw createApiError(404, 'NOT_FOUND', 'AI run not found')
    }

    const { initiatedBy } = enforceAiRunAccess(decodedToken, run.companyId)

    if (run.status !== 'COMPLETED') {
      throw createApiError(409, 'CONFLICT', 'AI run is not completed yet')
    }
    if (run.approvalStatus === 'APPROVED') {
      throw createApiError(409, 'CONFLICT', 'AI run already approved')
    }

    const draftPayload = parseStrategicDraftPayload(run.draftPayload)
    const validationError = validateStrategicDraftPayload(draftPayload)
    if (validationError) {
      throw createApiError(409, 'CONFLICT', `AI run draft payload invalid: ${validationError}`)
    }
    if (!draftPayload) {
      throw createApiError(
        409,
        'CONFLICT',
        'AI run draft payload invalid: Draft payload is missing'
      )
    }

    await persistStrategicDraftToGraphql({
      companyId: run.companyId,
      runId,
      actor: initiatedBy,
      draftPayload,
      accessToken: token,
    })

    const approvedAt = new Date().toISOString()
    await graphqlRequest({
      query: `
        mutation ApproveRun($runId: ID!, $actor: String!, $approvedAt: DateTime!) {
          updateAiRuns(
            where: { id: { eq: $runId } }
            update: {
              approvalStatus: { set: "APPROVED" }
              approvedBy: { set: $actor }
              approvedAt: { set: $approvedAt }
            }
          ) {
            aiRuns { id }
          }
        }
      `,
      variables: { runId, actor: initiatedBy, approvedAt },
      accessToken: token,
    })

    await createAuditEvent({
      runId,
      action: 'APPROVED',
      actor: initiatedBy,
      comment,
      accessToken: token,
    })

    console.info('[AI RUN][APPROVAL][APPROVED]', {
      runId,
      actor: initiatedBy,
      companyId: run.companyId,
    })

    return res.status(200).json({
      runId,
      approvalStatus: 'APPROVED',
    })
  } catch (error) {
    return sendApiError(res, error, { runId })
  }
})

aiRunRouter.post('/ai-runs/:runId/reject', async (req, res) => {
  const runId = req.params.runId
  const comment = typeof req.body?.comment === 'string' ? req.body.comment : null

  try {
    const decodedToken = await getUserContext(req.headers.authorization)
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const run = await loadAiRunById(runId, token)
    if (!run) {
      throw createApiError(404, 'NOT_FOUND', 'AI run not found')
    }

    const { initiatedBy } = enforceAiRunAccess(decodedToken, run.companyId)

    if (run.status !== 'COMPLETED') {
      throw createApiError(409, 'CONFLICT', 'AI run is not completed yet')
    }
    if (run.approvalStatus === 'REJECTED') {
      throw createApiError(409, 'CONFLICT', 'AI run already rejected')
    }

    const rejectedAt = new Date().toISOString()
    await graphqlRequest({
      query: `
        mutation RejectRun($runId: ID!, $actor: String!, $rejectedAt: DateTime!) {
          updateAiRuns(
            where: { id: { eq: $runId } }
            update: {
              approvalStatus: { set: "REJECTED" }
              rejectedBy: { set: $actor }
              rejectedAt: { set: $rejectedAt }
            }
          ) {
            aiRuns { id }
          }
        }
      `,
      variables: { runId, actor: initiatedBy, rejectedAt },
      accessToken: token,
    })

    await createAuditEvent({
      runId,
      action: 'REJECTED',
      actor: initiatedBy,
      comment,
      accessToken: token,
    })

    console.info('[AI RUN][APPROVAL][REJECTED]', {
      runId,
      actor: initiatedBy,
      companyId: run.companyId,
    })

    return res.status(200).json({
      runId,
      approvalStatus: 'REJECTED',
    })
  } catch (error) {
    return sendApiError(res, error, { runId })
  }
})

aiRunRouter.get('/ai-runs/:runId/audit', async (req, res) => {
  const runId = req.params.runId
  try {
    const decodedToken = await getUserContext(req.headers.authorization)
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const run = await loadAiRunById(runId, token)
    if (!run) {
      throw createApiError(404, 'NOT_FOUND', 'AI run not found')
    }
    enforceAiRunAccess(decodedToken, run.companyId)

    const result = await graphqlRequest<{ aiRunAuditEvents: Array<Record<string, unknown>> }>({
      query: `
        query LoadAiRunAudit($runId: String!) {
          aiRunAuditEvents(where: { runId: { eq: $runId } }) {
            id
            runId
            action
            actor
            comment
            createdAt
          }
        }
      `,
      variables: { runId },
      accessToken: token,
    })

    const events: AiAuditEventRecord[] = result.aiRunAuditEvents
      .map(event => ({
        id: String(event.id),
        runId: String(event.runId),
        action: (event.action === 'REJECTED' ? 'REJECTED' : 'APPROVED') as 'APPROVED' | 'REJECTED',
        actor: String(event.actor ?? ''),
        comment: typeof event.comment === 'string' ? event.comment : null,
        createdAt: toIsoString(event.createdAt),
      }))
      .sort((left, right) => (right.createdAt || '').localeCompare(left.createdAt || ''))

    return res.status(200).json(events)
  } catch (error) {
    return sendApiError(res, error, { runId })
  }
})

aiRunRouter.post('/ai-assistant/query', async (req, res) => {
  const companyId = typeof req.body?.companyId === 'string' ? req.body.companyId : ''
  const question = typeof req.body?.question === 'string' ? req.body.question : ''

  try {
    if (!companyId) {
      throw createApiError(400, 'BAD_REQUEST', 'companyId is required')
    }
    if (!question.trim()) {
      throw createApiError(400, 'BAD_REQUEST', 'question is required')
    }

    const decodedToken = await getUserContext(req.headers.authorization)
    enforceAiRunAccess(decodedToken, companyId)

    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const snapshot = await loadArchitectureSnapshot(companyId, token)

    const companyLlmResult = await graphqlRequest<{
      companies: Array<{ llmUrl?: string | null; llmModel?: string | null; llmKey?: string | null }>
    }>({
      query: `
        query LoadCompanyLlm($companyId: ID!) {
          companies(where: { id: { eq: $companyId } }, limit: 1) {
            llmUrl
            llmModel
            llmKey
          }
        }
      `,
      variables: { companyId },
      accessToken: token,
    })
    const companyLlm = companyLlmResult.companies[0]
    const llmConfig =
      companyLlm?.llmUrl?.trim() && companyLlm?.llmModel?.trim() && companyLlm?.llmKey?.trim()
        ? {
            llmUrl: companyLlm.llmUrl.trim(),
            llmModel: companyLlm.llmModel.trim(),
            llmKey: companyLlm.llmKey.trim(),
          }
        : undefined

    const answer = await buildQuestionAnswer({
      question,
      snapshot,
      llmConfig,
    })

    return res.status(200).json(answer)
  } catch (error) {
    return sendApiError(res, error, { companyId })
  }
})

aiRunRouter.post('/ai-assistant/change-proposals', async (req, res) => {
  const companyId = typeof req.body?.companyId === 'string' ? req.body.companyId : ''
  const requestText = typeof req.body?.requestText === 'string' ? req.body.requestText : ''

  try {
    if (!companyId) {
      throw createApiError(400, 'BAD_REQUEST', 'companyId is required')
    }
    if (!requestText.trim()) {
      throw createApiError(400, 'BAD_REQUEST', 'requestText is required')
    }

    const decodedToken = await getUserContext(req.headers.authorization)
    const { initiatedBy } = enforceAiRunAccess(decodedToken, companyId)

    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const actions = parseChangeActionsFromRequest(requestText)
    if (actions.length === 0) {
      throw createApiError(
        400,
        'BAD_REQUEST',
        'Could not derive a structured change action from requestText'
      )
    }

    const dryRun = await dryRunChangeActions({
      companyId,
      actions,
      accessToken: token,
    })
    const impactSummary = buildImpactSummary(actions)

    const payload: AssistantChangePlanPayload = {
      mode: 'CHANGE_PLAN',
      requestText,
      actions,
      dryRun,
      impactSummary,
      applied: false,
      executionResults: [],
    }

    const created = await createAssistantChangePlanRun({
      companyId,
      prompt: requestText,
      initiatedBy,
      accessToken: token,
      payload,
    })

    return res.status(201).json({
      runId: created.runId,
      proposal: payload,
      requiresApproval: true,
    })
  } catch (error) {
    return sendApiError(res, error, { companyId })
  }
})

aiRunRouter.post('/ai-assistant/change-proposals/:runId/approve', async (req, res) => {
  const runId = req.params.runId
  const comment = typeof req.body?.comment === 'string' ? req.body.comment : null

  try {
    const decodedToken = await getUserContext(req.headers.authorization)
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const run = await loadAiRunById(runId, token)
    if (!run) {
      throw createApiError(404, 'NOT_FOUND', 'Change proposal run not found')
    }
    const { initiatedBy } = enforceAiRunAccess(decodedToken, run.companyId)

    if (run.useCase !== 'CONVERSATIONAL_ASSISTANT') {
      throw createApiError(409, 'CONFLICT', 'Run is not a conversational assistant proposal')
    }

    const approvedAt = new Date().toISOString()
    await graphqlRequest({
      query: `
        mutation ApproveAssistantPlan($runId: ID!, $actor: String!, $approvedAt: DateTime!) {
          updateAiRuns(
            where: { id: { eq: $runId } }
            update: {
              approvalStatus: { set: "APPROVED" }
              approvedBy: { set: $actor }
              approvedAt: { set: $approvedAt }
            }
          ) {
            aiRuns { id }
          }
        }
      `,
      variables: { runId, actor: initiatedBy, approvedAt },
      accessToken: token,
    })

    await createAuditEvent({
      runId,
      action: 'APPROVED',
      actor: initiatedBy,
      comment,
      accessToken: token,
    })

    return res.status(200).json({ runId, approvalStatus: 'APPROVED' })
  } catch (error) {
    return sendApiError(res, error, { runId })
  }
})

aiRunRouter.post('/ai-assistant/change-proposals/:runId/reject', async (req, res) => {
  const runId = req.params.runId
  const comment = typeof req.body?.comment === 'string' ? req.body.comment : null

  try {
    const decodedToken = await getUserContext(req.headers.authorization)
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const run = await loadAiRunById(runId, token)
    if (!run) {
      throw createApiError(404, 'NOT_FOUND', 'Change proposal run not found')
    }
    const { initiatedBy } = enforceAiRunAccess(decodedToken, run.companyId)

    if (run.useCase !== 'CONVERSATIONAL_ASSISTANT') {
      throw createApiError(409, 'CONFLICT', 'Run is not a conversational assistant proposal')
    }

    const rejectedAt = new Date().toISOString()
    await graphqlRequest({
      query: `
        mutation RejectAssistantPlan($runId: ID!, $actor: String!, $rejectedAt: DateTime!) {
          updateAiRuns(
            where: { id: { eq: $runId } }
            update: {
              approvalStatus: { set: "REJECTED" }
              rejectedBy: { set: $actor }
              rejectedAt: { set: $rejectedAt }
            }
          ) {
            aiRuns { id }
          }
        }
      `,
      variables: { runId, actor: initiatedBy, rejectedAt },
      accessToken: token,
    })

    await createAuditEvent({
      runId,
      action: 'REJECTED',
      actor: initiatedBy,
      comment,
      accessToken: token,
    })

    return res.status(200).json({ runId, approvalStatus: 'REJECTED' })
  } catch (error) {
    return sendApiError(res, error, { runId })
  }
})

aiRunRouter.post('/ai-assistant/change-proposals/:runId/apply', async (req, res) => {
  const runId = req.params.runId
  const reason = typeof req.body?.reason === 'string' ? req.body.reason : null

  try {
    const decodedToken = await getUserContext(req.headers.authorization)
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const run = await loadAiRunById(runId, token)
    if (!run) {
      throw createApiError(404, 'NOT_FOUND', 'Change proposal run not found')
    }

    const { initiatedBy } = enforceAiRunAccess(decodedToken, run.companyId)

    if (run.useCase !== 'CONVERSATIONAL_ASSISTANT') {
      throw createApiError(409, 'CONFLICT', 'Run is not a conversational assistant proposal')
    }

    if (run.approvalStatus !== 'APPROVED') {
      throw createApiError(409, 'CONFLICT', 'Change proposal must be approved before apply')
    }

    const plan = loadAssistantChangePlan(run)
    if (!plan) {
      throw createApiError(409, 'CONFLICT', 'Invalid or missing change plan payload')
    }

    const dryRun = await dryRunChangeActions({
      companyId: run.companyId,
      actions: plan.actions,
      accessToken: token,
    })
    if (!dryRun.isValid) {
      throw createApiError(409, 'CONFLICT', 'Dry-run validation failed before apply')
    }

    await createAuditEvent({
      runId,
      action: 'APPLY_REQUESTED',
      actor: initiatedBy,
      comment: JSON.stringify({ reason }),
      accessToken: token,
    })

    const beforeSnapshot = await Promise.all(
      plan.actions
        .flatMap(action => {
          if (action.kind === 'CREATE') return []
          if (action.kind === 'UPDATE') {
            return [
              {
                entityType: action.entityType,
                entityId: action.entityId,
              },
            ]
          }
          return [
            {
              entityType: action.sourceEntityType,
              entityId: action.sourceEntityId,
            },
            {
              entityType: action.targetEntityType,
              entityId: action.targetEntityId,
            },
          ]
        })
        .map(async target => {
          const entity = await loadEntityForCompany({
            entityType: target.entityType,
            entityId: target.entityId,
            companyId: run.companyId,
            accessToken: token,
          })
          return {
            entityType: target.entityType,
            entityId: target.entityId,
            snapshot: entity,
          }
        })
    )

    const executionResults = await executeChangeActions({
      companyId: run.companyId,
      actions: plan.actions,
      accessToken: token,
    })

    const updatedPayload: AssistantChangePlanPayload = {
      ...plan,
      dryRun,
      applied: true,
      executionResults,
    }

    const completedAt = new Date().toISOString()
    await graphqlRequest({
      query: `
        mutation MarkAssistantPlanApplied($runId: ID!, $payload: String!, $summary: String!, $completedAt: DateTime!) {
          updateAiRuns(
            where: { id: { eq: $runId } }
            update: {
              status: { set: "APPLIED" }
              draftPayload: { set: $payload }
              resultSummary: { set: $summary }
              completedAt: { set: $completedAt }
            }
          ) {
            aiRuns { id }
          }
        }
      `,
      variables: {
        runId,
        payload: JSON.stringify(updatedPayload),
        summary: `Applied ${executionResults.length} controlled architecture change actions`,
        completedAt,
      },
      accessToken: token,
    })

    const afterSnapshot = await Promise.all(
      executionResults
        .flatMap(result => {
          if (result.kind === 'CREATE') {
            return [
              {
                entityType: result.entityType as AssistantEntityType,
                entityId: String(result.entityId),
              },
            ]
          }
          if (result.kind === 'UPDATE') {
            return [
              {
                entityType: result.entityType as AssistantEntityType,
                entityId: String(result.entityId),
              },
            ]
          }
          return [
            {
              entityType: result.sourceEntityType as AssistantEntityType,
              entityId: String(result.sourceEntityId),
            },
            {
              entityType: result.targetEntityType as AssistantEntityType,
              entityId: String(result.targetEntityId),
            },
          ]
        })
        .map(async target => {
          const entity = await loadEntityForCompany({
            entityType: target.entityType,
            entityId: target.entityId,
            companyId: run.companyId,
            accessToken: token,
          })
          return {
            entityType: target.entityType,
            entityId: target.entityId,
            snapshot: entity,
          }
        })
    )

    await createAuditEvent({
      runId,
      action: 'APPLIED',
      actor: initiatedBy,
      comment: JSON.stringify({
        why: reason,
        prompt: run.prompt,
        objective: run.objective,
        beforeSnapshot,
        afterSnapshot,
      }),
      accessToken: token,
    })

    return res.status(200).json({
      runId,
      status: 'APPLIED',
      executedActions: executionResults.length,
      executionResults,
    })
  } catch (error) {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    const decoded = await verifyToken(token ?? '').catch(() => null)
    const actor = (decoded as DecodedToken | null)?.sub ?? 'unknown'

    if (token) {
      await createAuditEvent({
        runId,
        action: 'UNAUTHORIZED_BLOCKED',
        actor,
        comment: JSON.stringify({ message: (error as Error).message ?? 'blocked' }),
        accessToken: token,
      }).catch(() => undefined)
    }

    return sendApiError(res, error, { runId })
  }
})

aiRunRouter.get('/ai-assistant/change-proposals/:runId/audit', async (req, res) => {
  const runId = req.params.runId
  try {
    const decodedToken = await getUserContext(req.headers.authorization)
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const run = await loadAiRunById(runId, token)
    if (!run) {
      throw createApiError(404, 'NOT_FOUND', 'Change proposal run not found')
    }
    enforceAiRunAccess(decodedToken, run.companyId)

    const result = await graphqlRequest<{ aiRunAuditEvents: Array<Record<string, unknown>> }>({
      query: `
        query LoadAssistantPlanAudit($runId: String!) {
          aiRunAuditEvents(where: { runId: { eq: $runId } }) {
            id
            runId
            action
            actor
            comment
            createdAt
          }
        }
      `,
      variables: { runId },
      accessToken: token,
    })

    const events = result.aiRunAuditEvents
      .map(event => ({
        id: String(event.id),
        runId: String(event.runId),
        action: String(event.action),
        actor: String(event.actor ?? ''),
        comment: typeof event.comment === 'string' ? event.comment : null,
        createdAt: toIsoString(event.createdAt),
      }))
      .sort((left, right) => (right.createdAt || '').localeCompare(left.createdAt || ''))

    return res.status(200).json(events)
  } catch (error) {
    return sendApiError(res, error, { runId })
  }
})
