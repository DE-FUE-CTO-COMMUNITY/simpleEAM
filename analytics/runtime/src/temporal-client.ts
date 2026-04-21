import { Client, Connection, ScheduleAlreadyRunning } from '@temporalio/client'
import type { Duration } from '@temporalio/common'

import { AnalyticsProjectionRefreshWorkflowInput } from './types'

export const ANALYTICS_PROJECTION_TASK_QUEUE =
  process.env.ANALYTICS_PROJECTION_TASK_QUEUE || 'nextgen-eam-analytics'
export const ANALYTICS_PROJECTION_REFRESH_WORKFLOW_NAME = 'analyticsProjectionRefreshWorkflow'
export const ANALYTICS_PROJECTION_SCHEDULE_ID =
  process.env.ANALYTICS_PROJECTION_SCHEDULE_ID || 'analytics-projection-refresh'

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

const buildAnalyticsProjectionWorkflowInput = (): AnalyticsProjectionRefreshWorkflowInput => ({
  companyId: null,
  initiatedBy: 'temporal-schedule',
  reason: 'scheduled',
  maxConcurrency: getAnalyticsProjectionMaxConcurrency(),
})

const buildAnalyticsProjectionScheduleSpec = () => ({
  intervals: [{ every: getAnalyticsProjectionScheduleInterval() }],
})

const buildAnalyticsProjectionScheduleAction = () => ({
  type: 'startWorkflow' as const,
  workflowType: ANALYTICS_PROJECTION_REFRESH_WORKFLOW_NAME,
  taskQueue: ANALYTICS_PROJECTION_TASK_QUEUE,
  args: [buildAnalyticsProjectionWorkflowInput()],
  workflowExecutionTimeout: '1 hour' as Duration,
})

const buildAnalyticsProjectionSchedulePolicies = () => ({
  catchupWindow: '1 hour' as Duration,
})

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

export const ensureAnalyticsProjectionRefreshSchedule = async (): Promise<void> => {
  if (!isAnalyticsProjectionScheduleEnabled()) {
    return
  }

  const temporalClient = await getTemporalClient()

  try {
    await temporalClient.schedule.create({
      scheduleId: ANALYTICS_PROJECTION_SCHEDULE_ID,
      spec: buildAnalyticsProjectionScheduleSpec(),
      action: buildAnalyticsProjectionScheduleAction(),
      policies: buildAnalyticsProjectionSchedulePolicies(),
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
      const scheduleHandle = temporalClient.schedule.getHandle(ANALYTICS_PROJECTION_SCHEDULE_ID)

      await scheduleHandle.update(current => ({
        spec: buildAnalyticsProjectionScheduleSpec(),
        action: buildAnalyticsProjectionScheduleAction(),
        policies: buildAnalyticsProjectionSchedulePolicies(),
        state: {
          paused: current.state.paused,
          note: current.state.note,
          remainingActions: current.state.remainingActions,
        },
      }))

      console.log('[TEMPORAL] Analytics projection refresh schedule reconciled', {
        scheduleId: ANALYTICS_PROJECTION_SCHEDULE_ID,
        interval: getAnalyticsProjectionScheduleInterval(),
        taskQueue: ANALYTICS_PROJECTION_TASK_QUEUE,
        maxConcurrency: getAnalyticsProjectionMaxConcurrency(),
      })
      return
    }

    throw error
  }
}

export const getAnalyticsTemporalWorkerConfig = () => ({
  address: getTemporalAddress(),
  namespace: getTemporalNamespace(),
  taskQueue: ANALYTICS_PROJECTION_TASK_QUEUE,
})
