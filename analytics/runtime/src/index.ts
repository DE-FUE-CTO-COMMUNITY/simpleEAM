import dotenv from 'dotenv'

import { ensureAnalyticsProjectionRefreshSchedule } from './temporal-client'

dotenv.config()

const RECONCILE_INTERVAL_MS = Math.max(
  10_000,
  Number.parseInt(process.env.ANALYTICS_PROJECTION_SCHEDULE_RECONCILE_MS || '300000', 10) || 300_000
)

let reconcileTimer: NodeJS.Timeout | null = null

const reconcileSchedule = async (): Promise<void> => {
  try {
    await ensureAnalyticsProjectionRefreshSchedule()
  } catch (error) {
    console.error('[ANALYTICS SCHEDULER] Failed to reconcile analytics projection schedule', {
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

const shutdown = () => {
  if (reconcileTimer) {
    clearInterval(reconcileTimer)
  }
  process.exit(0)
}

async function startAnalyticsScheduler() {
  await reconcileSchedule()

  reconcileTimer = setInterval(() => {
    void reconcileSchedule()
  }, RECONCILE_INTERVAL_MS)

  console.log('[ANALYTICS SCHEDULER] Started', {
    reconcileIntervalMs: RECONCILE_INTERVAL_MS,
  })

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

startAnalyticsScheduler().catch(error => {
  console.error('[ANALYTICS SCHEDULER] Fatal error', error)
  process.exit(1)
})
