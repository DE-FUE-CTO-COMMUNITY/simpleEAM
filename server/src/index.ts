import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'

// Import custom modules
import { testConnection, closeDriver } from './db/neo4j-client'
import { neoSchema } from './graphql/schema'

// Load environment variables
dotenv.config()

// Server port number (by default 4000)
const PORT = parseInt(process.env.GRAPHQL_INTERNAL_PORT || '4000')

async function startServer() {
  // Test Neo4j connection
  const connectionSuccessful = await testConnection()
  if (!connectionSuccessful) {
    console.error('Critical error: Could not establish Neo4j connection.')
    process.exit(1)
  }

  // Initialize Express app
  const app = express()

  // Create HTTP server
  const httpServer = http.createServer(app)

  // Configure middleware
  app.use(cors())
  app.use(
    helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false })
  )

  // Increase body parser limits for large diagram payloads
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))

  // Create GraphQL schema
  const schema = await neoSchema.getSchema()

  // Initialize Apollo server
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      token: req.headers.authorization, // Token directly from Authorization header forward to Neo4j GraphQL Library
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true, // Enable for development
  })

  // Start Apollo server
  await server.start()

  // Connect Apollo middleware to Express with extended body parser options
  server.applyMiddleware({
    app,
    path: '/graphql',
    bodyParserConfig: {
      limit: '50mb',
    },
  })

  // Health check endpoint
  app.get('/health', (_, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  })

  // Start server
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server started at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`📊 Health check available at http://localhost:${PORT}/health`)
  })

  // Cleanup on server termination
  const cleanup = async () => {
    console.log('Server is shutting down...')
    await closeDriver()
    process.exit(0)
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

// Start server and catch errors
startServer().catch(error => {
  console.error('Server error:', error)
  process.exit(1)
})
