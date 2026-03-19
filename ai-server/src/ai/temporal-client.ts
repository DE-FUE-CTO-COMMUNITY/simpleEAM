import { Connection, WorkflowClient } from '@temporalio/client'
import { AiRunWorkflowInput, SovereigntyScoreWorkflowInput } from './types'

export const AI_RUN_TASK_QUEUE = process.env.AI_RUN_TASK_QUEUE || 'nextgen-eam-ai'
export const AI_RUN_WORKFLOW_NAME = 'aiRunWorkflow'
export const SOVEREIGNTY_SCORE_WORKFLOW_NAME = 'sovereigntyScoreWorkflow'

const getTemporalAddress = () => process.env.TEMPORAL_ADDRESS || 'localhost:7233'
const getTemporalNamespace = () => process.env.TEMPORAL_NAMESPACE || 'default'

let workflowClientPromise: Promise<WorkflowClient> | null = null

const createWorkflowClient = async () => {
  const connection = await Connection.connect({
    address: getTemporalAddress(),
  })

  return new WorkflowClient({
    connection,
    namespace: getTemporalNamespace(),
  })
}

const getWorkflowClient = async () => {
  if (!workflowClientPromise) {
    workflowClientPromise = createWorkflowClient()
  }

  return workflowClientPromise
}

export const startAiRunWorkflow = async (
  input: AiRunWorkflowInput & { readonly workflowId: string }
) => {
  const workflowClient = await getWorkflowClient()

  await workflowClient.start(AI_RUN_WORKFLOW_NAME, {
    taskQueue: AI_RUN_TASK_QUEUE,
    workflowId: input.workflowId,
    args: [input],
  })
}

export const startSovereigntyScoreWorkflow = async (
  input: SovereigntyScoreWorkflowInput & { readonly workflowId: string }
) => {
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
