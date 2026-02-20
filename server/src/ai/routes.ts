import { Response, Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import neo4jDriver from '../db/neo4j-client'
import { verifyToken } from '../auth/auth-jwks'
import { startAiRunWorkflow } from './temporal-client'
import { AiRunUseCase, CreateAiAuditEventInput, StrategicDraftPayload } from './types'

type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'CONFLICT'
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

const mapAiRunRecord = (run: Record<string, unknown>, companyId: string): AiRunRecord => ({
  id: String(run.id),
  companyId,
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

const loadAiRunById = async (runId: string): Promise<AiRunRecord | null> => {
  const session = neo4jDriver.session()
  try {
    const result = await session.run(
      `
      MATCH (r:AiRun {id: $runId})-[:OWNED_BY]->(c:Company)
      RETURN r, c.id AS companyId
      LIMIT 1
      `,
      { runId }
    )

    if (result.records.length === 0) return null

    const record = result.records[0]
    const run = record.get('r').properties as Record<string, unknown>
    const companyId = String(record.get('companyId'))
    return mapAiRunRecord(run, companyId)
  } finally {
    await session.close()
  }
}

const createAuditEvent = async (input: CreateAiAuditEventInput): Promise<void> => {
  const session = neo4jDriver.session()
  try {
    const eventId = uuidv4()
    const timestamp = new Date().toISOString()
    await session.run(
      `
      MATCH (r:AiRun {id: $runId})
      CREATE (e:AiRunAuditEvent {
        id: $eventId,
        runId: $runId,
        action: $action,
        actor: $actor,
        comment: $comment,
        createdAt: datetime($timestamp)
      })
      MERGE (e)-[:FOR_RUN]->(r)
      `,
      {
        eventId,
        runId: input.runId,
        action: input.action,
        actor: input.actor,
        comment: input.comment ?? null,
        timestamp,
      }
    )
  } finally {
    await session.close()
  }
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

const persistStrategicDraftToNeo4j = async (input: {
  companyId: string
  runId: string
  actor: string
  draftPayload: StrategicDraftPayload
}) => {
  const session = neo4jDriver.session()
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

  const transaction = session.beginTransaction()

  try {
    const createCoreResult = await transaction.run(
      `
      MATCH (c:Company {id: $companyId})
      CREATE (m:GEA_Mission {
        id: $missionId,
        name: $missionName,
        purposeStatement: $missionStatement,
        keywords: $missionKeywords,
        year: date($missionYear),
        aiGenerated: true,
        aiGeneratedByRunId: $runId,
        aiGeneratedBy: $actor,
        createdAt: datetime($timestamp),
        updatedAt: datetime($timestamp)
      })
      CREATE (v:GEA_Vision {
        id: $visionId,
        name: $visionName,
        visionStatement: $visionStatement,
        timeHorizon: $visionTimeHorizon,
        year: date($visionYear),
        aiGenerated: true,
        aiGeneratedByRunId: $runId,
        aiGeneratedBy: $actor,
        createdAt: datetime($timestamp),
        updatedAt: datetime($timestamp)
      })
      MERGE (m)-[:OWNED_BY]->(c)
      MERGE (v)-[:OWNED_BY]->(c)
      MERGE (v)-[:SUPPORTS {score: 2}]->(m)
      RETURN c.id AS companyId
      `,
      {
        companyId: input.companyId,
        missionId,
        missionName: input.draftPayload.mission.name.trim(),
        missionStatement: input.draftPayload.mission.purposeStatement.trim(),
        missionKeywords: input.draftPayload.mission.keywords,
        missionYear,
        visionId,
        visionName: input.draftPayload.vision.name.trim(),
        visionStatement: input.draftPayload.vision.visionStatement.trim(),
        visionTimeHorizon: input.draftPayload.vision.timeHorizon,
        visionYear,
        runId: input.runId,
        actor: input.actor,
        timestamp,
      }
    )

    if (createCoreResult.records.length === 0) {
      throw createApiError(404, 'NOT_FOUND', 'Company not found')
    }

    if (valueRows.length > 0) {
      await transaction.run(
        `
        MATCH (c:Company {id: $companyId})
        MATCH (m:GEA_Mission {id: $missionId})
        MATCH (v:GEA_Vision {id: $visionId})
        UNWIND $values AS value
        CREATE (val:GEA_Value {
          id: value.id,
          name: value.name,
          valueStatement: value.valueStatement,
          aiGenerated: true,
          aiGeneratedByRunId: $runId,
          aiGeneratedBy: $actor,
          createdAt: datetime($timestamp),
          updatedAt: datetime($timestamp)
        })
        MERGE (val)-[:OWNED_BY]->(c)
        MERGE (val)-[:SUPPORTS {score: 2}]->(m)
        MERGE (val)-[:SUPPORTS {score: 2}]->(v)
        `,
        {
          companyId: input.companyId,
          missionId,
          visionId,
          values: valueRows,
          runId: input.runId,
          actor: input.actor,
          timestamp,
        }
      )
    }

    if (goalRows.length > 0) {
      await transaction.run(
        `
        MATCH (c:Company {id: $companyId})
        MATCH (m:GEA_Mission {id: $missionId})
        MATCH (v:GEA_Vision {id: $visionId})
        UNWIND $goals AS goal
        CREATE (g:GEA_Goal {
          id: goal.id,
          name: goal.name,
          goalStatement: goal.goalStatement,
          aiGenerated: true,
          aiGeneratedByRunId: $runId,
          aiGeneratedBy: $actor,
          createdAt: datetime($timestamp),
          updatedAt: datetime($timestamp)
        })
        MERGE (g)-[:OWNED_BY]->(c)
        MERGE (g)-[:SUPPORTS {score: 2}]->(m)
        MERGE (g)-[:OPERATIONALIZES {score: 2}]->(v)
        `,
        {
          companyId: input.companyId,
          missionId,
          visionId,
          goals: goalRows,
          runId: input.runId,
          actor: input.actor,
          timestamp,
        }
      )
    }

    if (strategyRows.length > 0) {
      await transaction.run(
        `
        MATCH (c:Company {id: $companyId})
        OPTIONAL MATCH (firstGoal:GEA_Goal)-[:OWNED_BY]->(c)
        WHERE firstGoal.aiGeneratedByRunId = $runId
        WITH c, firstGoal
        LIMIT 1
        UNWIND $strategies AS strategy
        CREATE (s:GEA_Strategy {
          id: strategy.id,
          name: strategy.name,
          description: strategy.description,
          aiGenerated: true,
          aiGeneratedByRunId: $runId,
          aiGeneratedBy: $actor,
          createdAt: datetime($timestamp),
          updatedAt: datetime($timestamp)
        })
        MERGE (s)-[:OWNED_BY]->(c)
        FOREACH (_ IN CASE WHEN firstGoal IS NULL THEN [] ELSE [1] END |
          MERGE (s)-[:ACHIEVES {score: 2}]->(firstGoal)
        )
        `,
        {
          companyId: input.companyId,
          strategies: strategyRows,
          runId: input.runId,
          actor: input.actor,
          timestamp,
        }
      )
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  } finally {
    await session.close()
  }
}

export const aiRunRouter = Router()

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

    const session = neo4jDriver.session()
    try {
      const result = await session.run(
        `
        MATCH (c:Company {id: $companyId})
        OPTIONAL MATCH (r:AiRun)-[:OWNED_BY]->(c)
        WITH c, [run IN collect(DISTINCT r) WHERE run IS NOT NULL] AS runs
        OPTIONAL MATCH (e:AiRunAuditEvent)-[:FOR_RUN]->(r2:AiRun)-[:OWNED_BY]->(c)
        WITH c, runs, [event IN collect(DISTINCT e) WHERE event IS NOT NULL] AS events
        FOREACH (event IN events | DETACH DELETE event)
        FOREACH (run IN runs | DETACH DELETE run)
        RETURN c.id AS companyId, size(runs) AS deletedRuns, size(events) AS deletedAuditEvents
        `,
        { companyId }
      )

      if (result.records.length === 0) {
        throw createApiError(404, 'NOT_FOUND', 'Company not found')
      }

      const record = result.records[0]
      const deletedRuns = Number(record.get('deletedRuns') ?? 0)
      const deletedAuditEvents = Number(record.get('deletedAuditEvents') ?? 0)

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
    } finally {
      await session.close()
    }
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

    const session = neo4jDriver.session()
    try {
      const result = await session.run(
        `
        MATCH (r:AiRun)-[:OWNED_BY]->(c:Company {id: $companyId})
        RETURN r
        ORDER BY r.createdAt DESC
        LIMIT 20
        `,
        { companyId }
      )

      const runs = result.records.map(record => {
        const run = record.get('r').properties as Record<string, unknown>
        return mapAiRunRecord(run, companyId)
      })

      console.info('[AI RUN][LIST][SUCCESS]', {
        companyId,
        count: runs.length,
      })

      return res.status(200).json(runs)
    } finally {
      await session.close()
    }
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

    const runId = uuidv4()
    const workflowId = `ai-run-${runId}`
    const createdAt = new Date().toISOString()

    console.info('[AI RUN][START][REQUEST]', {
      runId,
      workflowId,
      companyId,
      initiatedBy,
      useCase,
    })

    const session = neo4jDriver.session()
    try {
      const createResult = await session.run(
        `
        MATCH (c:Company {id: $companyId})
        CREATE (r:AiRun {
          id: $runId,
          prompt: $prompt,
          objective: $objective,
          useCase: $useCase,
          status: 'QUEUED',
          approvalStatus: 'PENDING_REVIEW',
          initiatedBy: $initiatedBy,
          createdAt: datetime($createdAt),
          updatedAt: datetime($createdAt)
        })
        MERGE (r)-[:OWNED_BY]->(c)
        RETURN c.id AS companyId
        `,
        {
          companyId,
          runId,
          prompt: effectivePrompt,
          objective,
          useCase,
          initiatedBy,
          createdAt,
        }
      )

      if (createResult.records.length === 0) {
        throw createApiError(404, 'NOT_FOUND', 'Company not found')
      }

      try {
        await startAiRunWorkflow({
          workflowId,
          runId,
          companyId,
          prompt: effectivePrompt,
          objective,
          initiatedBy,
          useCase,
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to start workflow'
        await session.run(
          `
          MATCH (r:AiRun {id: $runId})
          SET r.status = 'FAILED',
              r.errorMessage = $errorMessage,
              r.updatedAt = datetime($updatedAt),
              r.completedAt = datetime($updatedAt)
          `,
          {
            runId,
            errorMessage,
            updatedAt: new Date().toISOString(),
          }
        )
        throw createApiError(
          500,
          'WORKFLOW_START_FAILED',
          `Failed to start AI workflow: ${errorMessage}`
        )
      }

      const updatedAt = new Date().toISOString()
      await session.run(
        `
        MATCH (r:AiRun {id: $runId})
        SET r.workflowId = $workflowId,
            r.updatedAt = datetime($updatedAt)
        `,
        {
          runId,
          workflowId,
          updatedAt,
        }
      )

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
          updatedAt,
          resultSummary: null,
          draftPayload: null,
          errorMessage: null,
          startedAt: null,
          completedAt: null,
        },
      })
    } finally {
      await session.close()
    }
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
    const run = await loadAiRunById(runId)
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

    await persistStrategicDraftToNeo4j({
      companyId: run.companyId,
      runId,
      actor: initiatedBy,
      draftPayload,
    })

    const timestamp = new Date().toISOString()
    const session = neo4jDriver.session()
    try {
      await session.run(
        `
        MATCH (r:AiRun {id: $runId})
        SET r.approvalStatus = 'APPROVED',
            r.approvedBy = $actor,
            r.approvedAt = datetime($timestamp),
            r.updatedAt = datetime($timestamp)
        `,
        {
          runId,
          actor: initiatedBy,
          timestamp,
        }
      )
    } finally {
      await session.close()
    }

    await createAuditEvent({
      runId,
      action: 'APPROVED',
      actor: initiatedBy,
      comment,
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
    const run = await loadAiRunById(runId)
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

    const timestamp = new Date().toISOString()
    const session = neo4jDriver.session()
    try {
      await session.run(
        `
        MATCH (r:AiRun {id: $runId})
        SET r.approvalStatus = 'REJECTED',
            r.rejectedBy = $actor,
            r.rejectedAt = datetime($timestamp),
            r.updatedAt = datetime($timestamp)
        `,
        {
          runId,
          actor: initiatedBy,
          timestamp,
        }
      )
    } finally {
      await session.close()
    }

    await createAuditEvent({
      runId,
      action: 'REJECTED',
      actor: initiatedBy,
      comment,
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
    const run = await loadAiRunById(runId)
    if (!run) {
      throw createApiError(404, 'NOT_FOUND', 'AI run not found')
    }
    enforceAiRunAccess(decodedToken, run.companyId)

    const session = neo4jDriver.session()
    try {
      const result = await session.run(
        `
        MATCH (e:AiRunAuditEvent)-[:FOR_RUN]->(r:AiRun {id: $runId})
        RETURN e
        ORDER BY e.createdAt DESC
        `,
        { runId }
      )

      const events: AiAuditEventRecord[] = result.records.map(record => {
        const event = record.get('e').properties as Record<string, unknown>
        return {
          id: String(event.id),
          runId: String(event.runId),
          action: event.action === 'REJECTED' ? 'REJECTED' : 'APPROVED',
          actor: String(event.actor ?? ''),
          comment: typeof event.comment === 'string' ? event.comment : null,
          createdAt: toIsoString(event.createdAt),
        }
      })

      return res.status(200).json(events)
    } finally {
      await session.close()
    }
  } catch (error) {
    return sendApiError(res, error, { runId })
  }
})
