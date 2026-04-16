import { NativeConnection, Worker } from '@temporalio/worker'
import { getTemporalWorkerConfig } from './temporal-client'

// Import activities from all agent folders — each file also self-registers its
// agent descriptor in the AgentRegistry at module load time.
import * as coordinatorActivities from './coordinator/activities'
import * as internetResearchActivities from './internet-research/activities'
import * as documentResearchActivities from './document-research/activities'
import * as strategyGeneratorActivities from './strategy-generator/activities'
import * as qualityControlActivities from './quality-control/activities'
import * as sovereigntyActivities from './sovereignty/activities'
import * as dataLookupActivities from './data-lookup/activities'
import * as analyticsActivities from './analytics/activities'

const workflowsPath = require.resolve('./workflows')

const activities = {
  ...coordinatorActivities,
  ...internetResearchActivities,
  ...documentResearchActivities,
  ...strategyGeneratorActivities,
  ...qualityControlActivities,
  ...sovereigntyActivities,
  ...dataLookupActivities,
  ...analyticsActivities,
}

const run = async () => {
  const config = getTemporalWorkerConfig()

  const connection = await NativeConnection.connect({ address: config.address })

  const worker = await Worker.create({
    connection,
    namespace: config.namespace,
    taskQueue: config.taskQueue,
    workflowsPath,
    activities,
  })

  console.log('[AI WORKER] Started', {
    temporalAddress: config.address,
    temporalNamespace: config.namespace,
    taskQueue: config.taskQueue,
    registeredActivities: Object.keys(activities),
  })

  await worker.run()
}

run().catch(error => {
  console.error('[AI WORKER] Fatal error', error)
  process.exit(1)
})
