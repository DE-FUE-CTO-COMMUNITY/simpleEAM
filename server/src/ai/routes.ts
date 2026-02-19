import { Response, Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import neo4jDriver from '../db/neo4j-client'
import { verifyToken } from '../auth/auth-jwks'
import { startAiRunWorkflow } from './temporal-client'

type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
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

const sendApiError = (
  res: Response,
  error: unknown,
  context?: Record<string, unknown>
) => {
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

export const aiRunRouter = Router()

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
        return {
          id: run.id,
          companyId,
          prompt: run.prompt,
          objective: run.objective ?? null,
          status: run.status,
          workflowId: run.workflowId ?? null,
          initiatedBy: run.initiatedBy ?? null,
          resultSummary: run.resultSummary ?? null,
          errorMessage: run.errorMessage ?? null,
          createdAt: toIsoString(run.createdAt),
          updatedAt: toIsoString(run.updatedAt),
          startedAt: toIsoString(run.startedAt),
          completedAt: toIsoString(run.completedAt),
        }
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

  try {
    if (!companyId) {
      throw createApiError(400, 'BAD_REQUEST', 'companyId is required')
    }

    if (!prompt.trim()) {
      throw createApiError(400, 'BAD_REQUEST', 'Prompt must not be empty')
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
          status: 'QUEUED',
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
          prompt: prompt.trim(),
          objective,
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
          prompt: prompt.trim(),
          objective,
          initiatedBy,
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
        throw createApiError(500, 'WORKFLOW_START_FAILED', `Failed to start AI workflow: ${errorMessage}`)
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
          prompt: prompt.trim(),
          objective,
          status: 'QUEUED',
          workflowId,
          initiatedBy,
          createdAt,
          updatedAt,
          resultSummary: null,
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
