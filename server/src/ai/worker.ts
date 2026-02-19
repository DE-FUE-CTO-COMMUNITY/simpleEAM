import { NativeConnection, Worker } from '@temporalio/worker'
import { getTemporalWorkerConfig } from './temporal-client'
import * as activities from './activities'

const workflowsPath = require.resolve('./workflows')

const run = async () => {
  const config = getTemporalWorkerConfig()

  const connection = await NativeConnection.connect({
    address: config.address,
  })

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
  })

  await worker.run()
}

run().catch(error => {
  console.error('[AI WORKER] Fatal error', error)
  process.exit(1)
})
