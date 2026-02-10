import { Driver, driver, auth } from 'neo4j-driver'
import * as dotenv from 'dotenv'

dotenv.config()

const NEO4J_DEBUG = process.env.NEO4J_DEBUG === 'true'
const NEO4J_LOG_LEVEL = (process.env.NEO4J_LOG_LEVEL || 'info').toLowerCase()
const NEO4J_ALLOWED_LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const
const NEO4J_LOG_LEVEL_SAFE = NEO4J_ALLOWED_LOG_LEVELS.includes(
  NEO4J_LOG_LEVEL as (typeof NEO4J_ALLOWED_LOG_LEVELS)[number]
)
  ? (NEO4J_LOG_LEVEL as (typeof NEO4J_ALLOWED_LOG_LEVELS)[number])
  : 'info'

// Neo4j connection parameters from environment variables or default values
// Use the container name als Hostname for more reliable connection
const URI = process.env.NEO4J_URI || 'bolt://neo4j:7687'
const USER = process.env.NEO4J_USER || 'neo4j'
const PASSWORD = process.env.NEO4J_PASSWORD || 'eam_password'

// Creating the Neo4j driver instance with advanced connection options
const driverConfig = {
  // Increased timeouts for slower networks/container starts
  connectionTimeout: 30000, // 30 Sekunden Verbindungs-Timeout
  maxTransactionRetryTime: 30000,
  maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 Stunden
  maxConnectionPoolSize: 50,
  connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 Minuten
  // Explicitly disable encryption for development environment
  encrypted: false,
  ...(NEO4J_DEBUG
    ? {
        logging: {
          level: NEO4J_LOG_LEVEL_SAFE,
          logger: (level: string, message: string) => {
            console.log(`[NEO4J ${level.toUpperCase()}] ${message}`)
          },
        },
      }
    : {}),
}

export const neo4jDriver: Driver = driver(URI, auth.basic(USER, PASSWORD), driverConfig)

if (NEO4J_DEBUG) {
  console.log('[NEO4J DEBUG] Driver config', {
    uri: URI,
    user: USER,
    encrypted: driverConfig.encrypted,
    connectionTimeout: driverConfig.connectionTimeout,
    maxTransactionRetryTime: driverConfig.maxTransactionRetryTime,
    maxConnectionLifetime: driverConfig.maxConnectionLifetime,
    maxConnectionPoolSize: driverConfig.maxConnectionPoolSize,
    connectionAcquisitionTimeout: driverConfig.connectionAcquisitionTimeout,
    logLevel: NEO4J_LOG_LEVEL_SAFE,
  })
}

// Function to test database connection with retry mechanism
export const testConnection = async (): Promise<boolean> => {
  const maxRetries = 5
  let retries = 0
  let success = false

  while (retries < maxRetries && !success) {
    const session = neo4jDriver.session()
    const start = Date.now()
    try {
      if (NEO4J_DEBUG) {
          const driverWithVerify = neo4jDriver as { verifyConnectivity?: () => Promise<unknown> }
          if (driverWithVerify.verifyConnectivity) {
            await driverWithVerify.verifyConnectivity()
          }
      }
      await session.run('RETURN 1 AS test')
      success = true
      if (NEO4J_DEBUG) {
        console.log('[NEO4J DEBUG] Connection test succeeded', {
          durationMs: Date.now() - start,
          attempt: retries + 1,
        })
      }
      return true
    } catch (error) {
      if (NEO4J_DEBUG) {
        console.error('[NEO4J DEBUG] Connection test failed', {
          durationMs: Date.now() - start,
          attempt: retries + 1,
          error,
        })
      }
      console.error(
        `Fehler bei der Neo4j-Verbindung (Versuch ${retries + 1}/${maxRetries}):`,
        error
      )
      retries++

      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
      }
    } finally {
      await session.close()
    }
  }

  if (!success) {
    console.error(`Maximale Anzahl an Verbindungsversuchen (${maxRetries}) erreicht.`)
  }

  return success
}

// Function to close database connection
export const closeDriver = async (): Promise<void> => {
  await neo4jDriver.close()
}

export default neo4jDriver
