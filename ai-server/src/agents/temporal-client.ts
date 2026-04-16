import { Client, Connection, ScheduleAlreadyRunning } from '@temporalio/client'
import type { Duration } from '@temporalio/common'
import {
  AnalyticsProjectionRefreshWorkflowInput,
  CoordinatorWorkflowInput,
  SovereigntyScoreWorkflowInput,
} from './types'

export const AI_RUN_TASK_QUEUE = process.env.AI_RUN_TASK_QUEUE || 'nextgen-eam-ai'
export const ANALYTICS_PROJECTION_REFRESH_WORKFLOW_NAME = 'analyticsProjectionRefreshWorkflow'
export const ANALYTICS_PROJECTION_SCHEDULE_ID =
  process.env.ANALYTICS_PROJECTION_SCHEDULE_ID || 'analytics-projection-refresh'
export const COORDINATOR_WORKFLOW_NAME = 'coordinatorWorkflow'
export const SOVEREIGNTY_SCORE_WORKFLOW_NAME = 'sovereigntyScoreWorkflow'

const getTemporalAddress = () => process.env.TEMPORAL_ADDRESS || 'localhost:7233'
const getTemporalNamespace = () => process.env.TEMPORAL_NAMESPACE || 'default'
const isAnalyticsProjectionScheduleEnabled = () =>
  (process.env.ANALYTICS_PROJECTION_SCHEDULE_ENABLED || '').trim().toLowerCase() === 'true'
const getAnalyticsProjectionScheduleInterval = () =>
  (process.env.ANALYTICS_PROJECTION_SCHEDULE_INTERVAL || '1 hour') as Duration
const getAnalyticsProjectionMaxConcurrency = () => {
  const parsedValue = Number.parseInt(process.env.ANALYTICS_PROJECTION_MAX_CONCURRENCY || '', 10)
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 5
}

let temporalClientPromise: Promise<Client> | null = null

const createTemporalClient = async () => {
  const connection = await Connection.connect({ address: getTemporalAddress() })
  return new Client({ connection, namespace: getTemporalNamespace() })
}

const getTemporalClient = async () => {
  if (!temporalClientPromise) {
    temporalClientPromise = createTemporalClient()
  }
  return temporalClientPromise
}

export const startCoordinatorWorkflow = async (
  input: CoordinatorWorkflowInput & { readonly workflowId: string }
): Promise<void> => {
  const temporalClient = await getTemporalClient()
  await temporalClient.workflow.start(COORDINATOR_WORKFLOW_NAME, {
    taskQueue: AI_RUN_TASK_QUEUE,
    workflowId: input.workflowId,
    args: [input],
    // Hard cap: plan (30s) + up to 3 agent steps (3min each × 2 attempts) + QC (3min) + aggregation (3min) + buffer
    workflowExecutionTimeout: '20 minutes',
  })
}

export const startSovereigntyScoreWorkflow = async (
  input: SovereigntyScoreWorkflowInput & { readonly workflowId: string }
): Promise<void> => {
  const temporalClient = await getTemporalClient()
  await temporalClient.workflow.start(SOVEREIGNTY_SCORE_WORKFLOW_NAME, {
    taskQueue: AI_RUN_TASK_QUEUE,
    workflowId: input.workflowId,
    args: [input],
  })
}

export const startAnalyticsProjectionRefreshWorkflow = async (
  input: AnalyticsProjectionRefreshWorkflowInput & { readonly workflowId: string }
): Promise<void> => {
  const temporalClient = await getTemporalClient()
  await temporalClient.workflow.start(ANALYTICS_PROJECTION_REFRESH_WORKFLOW_NAME, {
    taskQueue: AI_RUN_TASK_QUEUE,
    workflowId: input.workflowId,
    args: [
      {
        ...input,
        companyId: input.companyId ?? null,
        maxConcurrency: Math.max(
          1,
          Math.trunc(input.maxConcurrency ?? getAnalyticsProjectionMaxConcurrency())
        ),
      },
    ],
    workflowExecutionTimeout: '1 hour',
  })
}

export const ensureAnalyticsProjectionRefreshSchedule = async (): Promise<void> => {
  if (!isAnalyticsProjectionScheduleEnabled()) {
    return
  }

  const temporalClient = await getTemporalClient()

  try {
    await temporalClient.schedule.create({
      scheduleId: ANALYTICS_PROJECTION_SCHEDULE_ID,
      spec: {
        intervals: [{ every: getAnalyticsProjectionScheduleInterval() }],
      },
      action: {
        type: 'startWorkflow',
        workflowType: ANALYTICS_PROJECTION_REFRESH_WORKFLOW_NAME,
        taskQueue: AI_RUN_TASK_QUEUE,
        args: [
          {
            companyId: null,
            initiatedBy: 'temporal-schedule',
            reason: 'scheduled',
            maxConcurrency: getAnalyticsProjectionMaxConcurrency(),
          } satisfies AnalyticsProjectionRefreshWorkflowInput,
        ],
        workflowExecutionTimeout: '1 hour',
      },
      policies: {
        catchupWindow: '1 hour',
      },
      memo: {
        feature: 'analytics-projection-refresh',
      },
    })

    console.log('[TEMPORAL] Registered analytics projection refresh schedule', {
      scheduleId: ANALYTICS_PROJECTION_SCHEDULE_ID,
      interval: getAnalyticsProjectionScheduleInterval(),
      maxConcurrency: getAnalyticsProjectionMaxConcurrency(),
    })
  } catch (error) {
    if (error instanceof ScheduleAlreadyRunning) {
      console.log('[TEMPORAL] Analytics projection refresh schedule already exists', {
        scheduleId: ANALYTICS_PROJECTION_SCHEDULE_ID,
      })
      return
    }

    throw error
  }
}

export const getTemporalWorkerConfig = () => ({
  address: getTemporalAddress(),
  namespace: getTemporalNamespace(),
  taskQueue: AI_RUN_TASK_QUEUE,
})

/**
 * Returns the Temporal workflow execution status string
 * (e.g. 'RUNNING', 'FAILED', 'TERMINATED', 'TIMED_OUT', 'COMPLETED', 'CANCELED')
 * or null if the workflow cannot be found / Temporal is unreachable.
 */
export const getWorkflowStatus = async (workflowId: string): Promise<string | null> => {
  try {
    const client = await getTemporalClient()
    const handle = client.workflow.getHandle(workflowId)
    const description = await handle.describe()
    return description.status.name
  } catch {
    return null
  }
}
