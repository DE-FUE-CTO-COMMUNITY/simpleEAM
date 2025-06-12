import { Driver, driver, auth } from 'neo4j-driver'
import * as dotenv from 'dotenv'

dotenv.config()

// Neo4j-Verbindungsparameter aus Umgebungsvariablen oder Standardwerte
// Verwende den Container-Namen als Hostname für zuverlässigere Verbindung
const URI = process.env.NEO4J_URI || 'bolt://neo4j:7687'
const USER = process.env.NEO4J_USER || 'neo4j'
const PASSWORD = process.env.NEO4J_PASSWORD || 'eam_password'

// Erstellen der Neo4j-Driver-Instanz mit erweiterten Verbindungsoptionen
export const neo4jDriver: Driver = driver(URI, auth.basic(USER, PASSWORD), {
  // Erhöhte Timeouts für langsamere Netzwerke/Container-Starts
  connectionTimeout: 30000, // 30 Sekunden Verbindungs-Timeout
  maxTransactionRetryTime: 30000,
  maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 Stunden
  maxConnectionPoolSize: 50,
  connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 Minuten
  // Encryption explizit deaktivieren für Entwicklungsumgebung
  encrypted: false,
})

// Funktion zum Testen der Datenbankverbindung mit Retry-Mechanismus
export const testConnection = async (): Promise<boolean> => {
  const maxRetries = 5
  let retries = 0
  let success = false

  while (retries < maxRetries && !success) {
    const session = neo4jDriver.session()
    try {
      await session.run('RETURN 1 AS test')
      success = true
      return true
    } catch (error) {
      console.error(
        `Fehler bei der Neo4j-Verbindung (Versuch ${retries + 1}/${maxRetries}):`,
        error
      )
      retries++

      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // 5 Sekunden warten
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

// Funktion zum Beenden der Datenbankverbindung
export const closeDriver = async (): Promise<void> => {
  await neo4jDriver.close()
}

export default neo4jDriver
