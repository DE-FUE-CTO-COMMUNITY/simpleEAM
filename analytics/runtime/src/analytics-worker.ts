import { NativeConnection, Worker } from '@temporalio/worker'

import * as analyticsActivities from './analytics/activities'
import { getAnalyticsTemporalWorkerConfig } from './temporal-client'

const workflowsPath = require.resolve('./analytics-workflows')

const run = async () => {
  const config = getAnalyticsTemporalWorkerConfig()

  const connection = await NativeConnection.connect({ address: config.address })

  const worker = await Worker.create({
    connection,
    namespace: config.namespace,
    taskQueue: config.taskQueue,
    workflowsPath,
    activities: analyticsActivities,
  })

  console.log('[ANALYTICS WORKER] Started', {
    temporalAddress: config.address,
    temporalNamespace: config.namespace,
    taskQueue: config.taskQueue,
    registeredActivities: Object.keys(analyticsActivities),
  })

  await worker.run()
}

run().catch(error => {
  console.error('[ANALYTICS WORKER] Fatal error', error)
  process.exit(1)
})
