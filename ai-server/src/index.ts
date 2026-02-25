import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import http from 'http'

import { isGraphqlReachable } from './graphql/client'
import { aiRunRouter } from './ai/routes'

dotenv.config()

const PORT = parseInt(process.env.AI_SERVER_INTERNAL_PORT || '4001')

async function startAiServer() {
  const graphqlReachable = await isGraphqlReachable()
  if (!graphqlReachable) {
    console.error('Warning: GraphQL API is currently not reachable at startup.')
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
