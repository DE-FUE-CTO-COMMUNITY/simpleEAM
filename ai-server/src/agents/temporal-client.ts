import { Connection, WorkflowClient } from '@temporalio/client'
import { CoordinatorWorkflowInput, SovereigntyScoreWorkflowInput } from './types'

export const AI_RUN_TASK_QUEUE = process.env.AI_RUN_TASK_QUEUE || 'nextgen-eam-ai'
export const COORDINATOR_WORKFLOW_NAME = 'coordinatorWorkflow'
export const SOVEREIGNTY_SCORE_WORKFLOW_NAME = 'sovereigntyScoreWorkflow'

const getTemporalAddress = () => process.env.TEMPORAL_ADDRESS || 'localhost:7233'
const getTemporalNamespace = () => process.env.TEMPORAL_NAMESPACE || 'default'

let workflowClientPromise: Promise<WorkflowClient> | null = null

const createWorkflowClient = async () => {
  const connection = await Connection.connect({ address: getTemporalAddress() })
  return new WorkflowClient({ connection, namespace: getTemporalNamespace() })
}

const getWorkflowClient = async () => {
  if (!workflowClientPromise) {
    workflowClientPromise = createWorkflowClient()
  }
  return workflowClientPromise
}

export const startCoordinatorWorkflow = async (
  input: CoordinatorWorkflowInput & { readonly workflowId: string }
): Promise<void> => {
  const workflowClient = await getWorkflowClient()
  await workflowClient.start(COORDINATOR_WORKFLOW_NAME, {
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
  const workflowClient = await getWorkflowClient()
  await workflowClient.start(SOVEREIGNTY_SCORE_WORKFLOW_NAME, {
    taskQueue: AI_RUN_TASK_QUEUE,
    workflowId: input.workflowId,
    args: [input],
  })
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
    const client = await getWorkflowClient()
    const handle = client.getHandle(workflowId)
    const description = await handle.describe()
    return description.status.name
  } catch {
    return null
  }
}
