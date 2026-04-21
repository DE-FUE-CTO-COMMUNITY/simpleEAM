import { Client, Connection } from '@temporalio/client'

const ANALYTICS_PROJECTION_TASK_QUEUE =
  process.env.ANALYTICS_PROJECTION_TASK_QUEUE || 'nextgen-eam-analytics'
const ANALYTICS_PROJECTION_REFRESH_WORKFLOW_NAME = 'analyticsProjectionRefreshWorkflow'

const getTemporalAddress = () => process.env.TEMPORAL_ADDRESS || 'localhost:7233'
const getTemporalNamespace = () => process.env.TEMPORAL_NAMESPACE || 'default'
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

export const startAnalyticsProjectionRefreshWorkflow = async (input: {
  readonly companyId?: string | null
  readonly initiatedBy: string
  readonly workflowId: string
}): Promise<void> => {
  const temporalClient = await getTemporalClient()

  await temporalClient.workflow.start(ANALYTICS_PROJECTION_REFRESH_WORKFLOW_NAME, {
    taskQueue: ANALYTICS_PROJECTION_TASK_QUEUE,
    workflowId: input.workflowId,
    args: [
      {
        companyId: input.companyId ?? null,
        initiatedBy: input.initiatedBy,
        reason: 'manual',
        maxConcurrency: getAnalyticsProjectionMaxConcurrency(),
      },
    ],
    workflowExecutionTimeout: '1 hour',
  })
}
