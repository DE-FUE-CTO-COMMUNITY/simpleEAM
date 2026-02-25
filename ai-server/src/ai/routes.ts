import { Response, Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { verifyToken } from '../auth/auth-jwks'
import { graphqlRequest } from '../graphql/client'
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

    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null
    if (!token) {
      throw createApiError(401, 'UNAUTHENTICATED', 'Authentication required')
    }

    const companyResult = await graphqlRequest<{ companies: Array<{ id: string; name: string }> }>({
      query: `
        query LoadCompany($companyId: ID!) {
          companies(where: { id: { eq: $companyId } }, limit: 1) {
            id
            name
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

    await graphqlRequest({
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
            id: runId,
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
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start workflow'
      await graphqlRequest({
        query: `
            mutation MarkRunFailed($runId: ID!, $errorMessage: String!) {
              updateAiRuns(
                where: { id: { eq: $runId } }
                update: {
                  status: "FAILED"
                  errorMessage: $errorMessage
                  completedAt: datetime()
                }
              ) {
                aiRuns { id }
              }
            }
          `,
        variables: {
          runId,
          errorMessage,
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
              update: { workflowId: $workflowId }
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

    await graphqlRequest({
      query: `
        mutation ApproveRun($runId: ID!, $actor: String!) {
          updateAiRuns(
            where: { id: { eq: $runId } }
            update: {
              approvalStatus: "APPROVED"
              approvedBy: $actor
              approvedAt: datetime()
            }
          ) {
            aiRuns { id }
          }
        }
      `,
      variables: { runId, actor: initiatedBy },
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

    await graphqlRequest({
      query: `
        mutation RejectRun($runId: ID!, $actor: String!) {
          updateAiRuns(
            where: { id: { eq: $runId } }
            update: {
              approvalStatus: "REJECTED"
              rejectedBy: $actor
              rejectedAt: datetime()
            }
          ) {
            aiRuns { id }
          }
        }
      `,
      variables: { runId, actor: initiatedBy },
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
