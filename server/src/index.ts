import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'

// Eigene Module importieren
import { testConnection, closeDriver } from './db/neo4j-client'
import { neoSchema } from './graphql/schema'

// Umgebungsvariablen laden
dotenv.config()

// Server-Portnummer (standardmäßig 4000)
const PORT = parseInt(process.env.PORT || '4000')

async function startServer() {
  // Neo4j-Verbindung testen
  const connectionSuccessful = await testConnection()
  if (!connectionSuccessful) {
    console.error('Kritischer Fehler: Neo4j-Verbindung konnte nicht hergestellt werden.')
    process.exit(1)
  }

  // Express-App initialisieren
  const app = express()

  // HTTP-Server erstellen
  const httpServer = http.createServer(app)

  // Middleware konfigurieren
  app.use(cors())
  app.use(
    helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false })
  )
  app.use(express.json())

  // GraphQL-Schema erstellen
  const schema = await neoSchema.getSchema()

  // Apollo-Server initialisieren
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      token: req.headers.authorization, // Token direkt aus Authorization Header an Neo4j GraphQL Library weitergeben
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true, // Für Entwicklung aktivieren
  })

  // Apollo-Server starten
  await server.start()

  // Apollo-Middleware an Express anbinden
  server.applyMiddleware({ app, path: '/graphql' })

  // Gesundheitsprüfung-Endpunkt
  app.get('/health', (_, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  })

  // Server starten
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server gestartet auf http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`📊 Gesundheitsprüfung verfügbar auf http://localhost:${PORT}/health`)
  })

  // Aufräumen bei Server-Beendigung
  const cleanup = async () => {
    console.log('Server wird heruntergefahren...')
    await closeDriver()
    process.exit(0)
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}

// Server starten und Fehler abfangen
startServer().catch(error => {
  console.error('Serverfehler:', error)
  process.exit(1)
})
