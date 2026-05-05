import { Client, Connection } from '@temporalio/client'

import type { AiQueryWorkflowInput } from '../activities'
import type {
  CoordinatorWorkflowInput,
  SovereigntyScoreWorkflowInput,
} from '../../src/types/agents'

export const AI_RUN_TASK_QUEUE = process.env.AI_RUN_TASK_QUEUE || 'nextgen-eam-ai'
export const COORDINATOR_WORKFLOW_NAME = 'coordinatorWorkflow'
export const SOVEREIGNTY_SCORE_WORKFLOW_NAME = 'sovereigntyScoreWorkflow'
export const AI_QUERY_WORKFLOW_NAME = 'aiQueryWorkflow'

const getTemporalAddress = () => process.env.TEMPORAL_ADDRESS || 'localhost:7233'
const getTemporalNamespace = () => process.env.TEMPORAL_NAMESPACE || 'default'

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

export const startAiQueryWorkflow = async (
  input: AiQueryWorkflowInput & { readonly workflowId: string }
): Promise<void> => {
  const temporalClient = await getTemporalClient()
  await temporalClient.workflow.start(AI_QUERY_WORKFLOW_NAME, {
    taskQueue: AI_RUN_TASK_QUEUE,
    workflowId: input.workflowId,
    args: [input],
    workflowExecutionTimeout: '10 minutes',
  })
}

export const getTemporalWorkerConfig = () => ({
  address: getTemporalAddress(),
  namespace: getTemporalNamespace(),
  taskQueue: AI_RUN_TASK_QUEUE,
})

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
