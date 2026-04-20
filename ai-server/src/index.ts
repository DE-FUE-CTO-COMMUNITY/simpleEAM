import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import http from 'http'

import { isGraphqlReachable } from './graphql/client'
import { aiRunRouter } from './agents/routes'
import { seedAgentConfigsAtStartup } from './agents/shared/agent-config'
import { ensureAnalyticsProjectionRefreshSchedule } from './agents/temporal-client'
import { fetchServiceAccessToken } from './auth/keycloak-service-token'

dotenv.config()

const PORT = parseInt(process.env.AI_SERVER_INTERNAL_PORT || '4001')

async function startAiServer() {
  const graphqlReachable = await isGraphqlReachable()
  if (!graphqlReachable) {
    console.error('Warning: GraphQL API is currently not reachable at startup.')
  }

  let bootstrapToken: string | null = null
  try {
    bootstrapToken = await fetchServiceAccessToken()
  } catch (error) {
    console.error(
      '⚠️ Failed to fetch bootstrap service token - skipping AgentConfig startup bootstrap',
      {
        error: error instanceof Error ? error.message : String(error),
      }
    )
  }
  if (bootstrapToken) {
    try {
      await seedAgentConfigsAtStartup(bootstrapToken)
      console.log('✅ AgentConfig startup bootstrap completed')
    } catch (error) {
      console.error('⚠️ AgentConfig startup bootstrap failed', {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  } else {
    console.warn(
      '⚠️ Missing or invalid bootstrap client credentials - skipping AgentConfig startup bootstrap'
    )
  }

  try {
    await ensureAnalyticsProjectionRefreshSchedule()
  } catch (error) {
    console.error('⚠️ Failed to register analytics projection refresh schedule', {
      error: error instanceof Error ? error.message : String(error),
    })
  }

  const app = express()
  const httpServer = http.createServer(app)

  app.use(cors())
  app.use(
    helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false })
  )

  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))

  app.use(aiRunRouter)

  app.get('/health', (_, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'ai-server',
      timestamp: new Date().toISOString(),
    })
  })

  httpServer.listen(PORT, () => {
    console.log(`🤖 AI server started at http://localhost:${PORT}`)
    console.log(`📊 Health check available at http://localhost:${PORT}/health`)
  })

  const cleanup = async () => {
    console.log('AI server is shutting down...')
    process.exit(0)
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

startAiServer().catch(error => {
  console.error('AI server error:', error)
  process.exit(1)
})
