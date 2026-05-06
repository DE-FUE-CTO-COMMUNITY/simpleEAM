import { NativeConnection, Worker } from '@temporalio/worker'

import { getTemporalWorkerConfig } from './client/temporal-client'
import * as coordinatorActivities from './coordinator/activities'
import * as internetResearchActivities from '../agents/internet-research/activities'
import * as documentResearchActivities from '../agents/document-research/activities'
import * as strategyGeneratorActivities from '../agents/strategy-generator/activities'
import * as qualityControlActivities from '../agents/quality-control/activities'
import * as sovereigntyActivities from './sovereignty/activities'
// Legacy lookup system replaced by governed query architecture.
import * as legacyDataLookupActivities from '../agents/data-lookup/activities'
import * as temporalActivities from './activities'

const workflowsPath = require.resolve('./workflows')

const activities = {
  ...coordinatorActivities,
  ...internetResearchActivities,
  ...documentResearchActivities,
  ...strategyGeneratorActivities,
  ...qualityControlActivities,
  ...sovereigntyActivities,
  ...legacyDataLookupActivities,
  ...temporalActivities,
}

async function run(): Promise<void> {
  const config = getTemporalWorkerConfig()
  const connection = await NativeConnection.connect({ address: config.address })

  const worker = await Worker.create({
    connection,
    namespace: config.namespace,
    taskQueue: config.taskQueue,
    workflowsPath,
    activities,
  })

  console.info('[AI TEMPORAL WORKER] Started', {
    temporalAddress: config.address,
    temporalNamespace: config.namespace,
    taskQueue: config.taskQueue,
    registeredActivities: Object.keys(activities),
  })

  await worker.run()
}

run().catch(error => {
  console.error('[AI TEMPORAL WORKER] Fatal error', error)
  process.exit(1)
})
