#!/usr/bin/env node

/**
 * Test-Script für JWT-Authentifizierung mit dem GraphQL-Server
 *
 * Dieses Script testet:
 * 1. Keycloak-Token-Abruf
 * 2. GraphQL-Abfrage ohne Token (sollte fehlschlagen oder eingeschränkte Daten liefern)
 * 3. GraphQL-Abfrage mit gültigem Token
 * 4. Token-Validierung durch den Server
 */

const axios = require('axios')
const dotenv = require('dotenv')

// Konfiguration aus .env-Datei laden
dotenv.config()

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'simple-eam'
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID_CLIENT || 'eam-client'
const GRAPHQL_URL = 'https://api.dev-server.mf2.eu/graphql'

// Test-Benutzer (diese sollten in Keycloak existieren)
const TEST_USERNAME = 'admin' // Passen Sie dies an Ihre Keycloak-Konfiguration an
const TEST_PASSWORD = 'admin' // Passen Sie dies an Ihre Keycloak-Konfiguration an

console.log('🧪 JWT-Authentifizierung Test gestartet...\n')
console.log(`Keycloak URL: ${KEYCLOAK_URL}`)
console.log(`GraphQL URL: ${GRAPHQL_URL}`)
console.log(`Realm: ${KEYCLOAK_REALM}`)
console.log(`Client ID: ${KEYCLOAK_CLIENT_ID}\n`)

/**
 * Schritt 1: Token von Keycloak abrufen
 */
async function getKeycloakToken() {
  console.log('📝 Schritt 1: Token von Keycloak abrufen...')

  const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'password',
        client_id: KEYCLOAK_CLIENT_ID,
        username: TEST_USERNAME,
        password: TEST_PASSWORD,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    console.log('✅ Token erfolgreich abgerufen')
    console.log(`Token-Typ: ${response.data.token_type}`)
    console.log(`Expires in: ${response.data.expires_in} Sekunden`)
    console.log(
      `Access Token (erste 50 Zeichen): ${response.data.access_token.substring(0, 50)}...\n`
    )

    return response.data.access_token
  } catch (error) {
    console.error('❌ Fehler beim Abrufen des Tokens:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    } else {
      console.error('Error:', error.message)
    }
    throw error
  }
}

/**
 * Schritt 2: GraphQL-Query ohne Token testen
 */
async function testGraphQLWithoutToken() {
  console.log('📝 Schritt 2: GraphQL-Abfrage ohne Token...')

  const query = `
    query {
      businessCapabilities {
        id
        name
        description
      }
    }
  `

  try {
    const response = await axios.post(
      GRAPHQL_URL,
      {
        query: query,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('📊 Response ohne Token:')
    console.log('Status:', response.status)
    console.log('Data:', JSON.stringify(response.data, null, 2))
    console.log()

    return response.data
  } catch (error) {
    console.error('❌ Fehler bei GraphQL-Abfrage ohne Token:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', JSON.stringify(error.response.data, null, 2))
    } else {
      console.error('Error:', error.message)
    }
    console.log()
    return null
  }
}

/**
 * Schritt 3: GraphQL-Query mit Token testen
 */
async function testGraphQLWithToken(token) {
  console.log('📝 Schritt 3: GraphQL-Abfrage mit Token...')

  const query = `
    query {
      businessCapabilities {
        id
        name
        description
        status
        createdAt
      }
    }
  `

  try {
    const response = await axios.post(
      GRAPHQL_URL,
      {
        query: query,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    console.log('📊 Response mit Token:')
    console.log('Status:', response.status)
    console.log('Data:', JSON.stringify(response.data, null, 2))
    console.log()

    return response.data
  } catch (error) {
    console.error('❌ Fehler bei GraphQL-Abfrage mit Token:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', JSON.stringify(error.response.data, null, 2))
    } else {
      console.error('Error:', error.message)
    }
    console.log()
    return null
  }
}

/**
 * Schritt 4: Mutation mit Token testen (erfordert Berechtigung)
 */
async function testMutationWithToken(token) {
  console.log('📝 Schritt 4: Mutation mit Token testen...')

  const mutation = `
    mutation {
      createBusinessCapabilities(input: [{
        name: "Test Capability - JWT Auth Test"
        description: "Test-Capability erstellt durch JWT-Auth-Test"
        status: ACTIVE
        businessValue: 5
      }]) {
        businessCapabilities {
          id
          name
          description
          status
          businessValue
          createdAt
        }
      }
    }
  `

  try {
    const response = await axios.post(
      GRAPHQL_URL,
      {
        query: mutation,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    console.log('📊 Mutation Response:')
    console.log('Status:', response.status)
    console.log('Data:', JSON.stringify(response.data, null, 2))
    console.log()

    return response.data
  } catch (error) {
    console.error('❌ Fehler bei Mutation:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', JSON.stringify(error.response.data, null, 2))
    } else {
      console.error('Error:', error.message)
    }
    console.log()
    return null
  }
}

/**
 * Schritt 5: Server-Health prüfen
 */
async function testServerHealth() {
  console.log('📝 Schritt 5: Server-Health prüfen...')

  try {
    const response = await axios.get('https://api.dev-server.mf2.eu/health')

    console.log('✅ Server ist erreichbar')
    console.log('Health Status:', response.data)
    console.log()

    return true
  } catch (error) {
    console.error('❌ Server-Health-Check fehlgeschlagen:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    } else {
      console.error('Error:', error.message)
    }
    console.log()
    return false
  }
}

/**
 * Haupttest-Funktion
 */
async function runAuthTest() {
  try {
    // Schritt 1: Server-Health prüfen
    const serverHealthy = await testServerHealth()
    if (!serverHealthy) {
      console.log('⚠️ Server ist nicht erreichbar. Test wird trotzdem fortgesetzt...\n')
    }

    // Schritt 2: GraphQL ohne Token testen
    await testGraphQLWithoutToken()

    // Schritt 3: Token abrufen
    const token = await getKeycloakToken()

    // Schritt 4: GraphQL mit Token testen
    await testGraphQLWithToken(token)

    // Schritt 5: Mutation mit Token testen
    await testMutationWithToken(token)

    console.log('🎉 JWT-Authentifizierung Test abgeschlossen!')
  } catch (error) {
    console.error('💥 Test-Fehler:', error.message)
    process.exit(1)
  }
}

// Test ausführen
runAuthTest()
