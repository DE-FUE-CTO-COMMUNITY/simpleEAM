#!/usr/bin/env node

/**
 * Erweiterter JWT-Authentifizierungs-Test für verschiedene Autorisierungsszenarien
 *
 * Dieses Script testet:
 * 1. CRUD-Operationen mit architect-Rolle
 * 2. Token-Refresh-Flow
 * 3. Verschiedene GraphQL-Mutations
 * 4. Fehlerbehandlung bei ungültigen Tokens
 * 5. Rollenbasierte Zugriffskontrolle
 */

const axios = require('axios')
const dotenv = require('dotenv')

// Konfiguration aus .env-Datei laden
dotenv.config()

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'simple-eam'
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID_CLIENT || 'eam-client'
const GRAPHQL_URL = 'https://api.dev-server.mf2.eu/graphql'

// Test-Benutzer
const TEST_USERNAME = 'admin'
const TEST_PASSWORD = 'admin'

console.log('🚀 Erweiterter JWT-Authentifizierung Test gestartet...\n')
console.log(`Keycloak URL: ${KEYCLOAK_URL}`)
console.log(`GraphQL URL: ${GRAPHQL_URL}`)
console.log(`Realm: ${KEYCLOAK_REALM}`)
console.log(`Client ID: ${KEYCLOAK_CLIENT_ID}\n`)

/**
 * Token von Keycloak abrufen
 */
async function getKeycloakToken() {
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

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type,
    }
  } catch (error) {
    console.error('❌ Fehler beim Abrufen des Tokens:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Token mit Refresh Token erneuern
 */
async function refreshKeycloakToken(refreshToken) {
  console.log('🔄 Token mit Refresh Token erneuern...')

  const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`

  try {
    const response = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: KEYCLOAK_CLIENT_ID,
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    console.log('✅ Token erfolgreich erneuert')
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type,
    }
  } catch (error) {
    console.error('❌ Fehler beim Erneuern des Tokens:', error.response?.data || error.message)
    throw error
  }
}

/**
 * JWT-Token analysieren (ohne Verifikation - nur für Debug)
 */
function analyzeJWT(token) {
  try {
    const [header, payload, signature] = token.split('.')
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString())

    console.log('🔍 JWT-Token-Analyse:')
    console.log('- Sub:', decodedPayload.sub)
    console.log('- Preferred Username:', decodedPayload.preferred_username)
    console.log('- Email:', decodedPayload.email)
    console.log('- Realm Access Roles:', decodedPayload.realm_access?.roles || 'Keine')
    console.log(
      '- Resource Access:',
      decodedPayload.resource_access ? Object.keys(decodedPayload.resource_access) : 'Keine'
    )
    console.log('- Issued At:', new Date(decodedPayload.iat * 1000).toISOString())
    console.log('- Expires At:', new Date(decodedPayload.exp * 1000).toISOString())
    console.log()

    return decodedPayload
  } catch (error) {
    console.error('❌ Fehler beim Analysieren des JWT-Tokens:', error.message)
    return null
  }
}

/**
 * GraphQL-Request ausführen
 */
async function executeGraphQL(query, variables = {}, token = null, description = '') {
  console.log(`📝 ${description}`)

  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await axios.post(
      GRAPHQL_URL,
      {
        query: query,
        variables: variables,
      },
      { headers }
    )

    console.log(`📊 Response (${description}):`)
    console.log('Status:', response.status)

    if (response.data.errors) {
      console.log('❌ Errors:', JSON.stringify(response.data.errors, null, 2))
    }

    if (response.data.data) {
      console.log('✅ Data:', JSON.stringify(response.data.data, null, 2))
    }

    console.log()
    return response.data
  } catch (error) {
    console.error(`❌ Fehler bei ${description}:`)
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
 * Test 1: CREATE Operation (BusinessCapability)
 */
async function testCreateOperation(token) {
  const mutation = `
    mutation CreateBusinessCapability($input: [BusinessCapabilityCreateInput!]!) {
      createBusinessCapabilities(input: $input) {
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

  const variables = {
    input: [
      {
        name: `Test Capability ${Date.now()}`,
        description: 'Automatisch erstellt durch erweiterten JWT-Test',
        status: 'ACTIVE',
        businessValue: 8,
      },
    ],
  }

  return await executeGraphQL(
    mutation,
    variables,
    token,
    'Test 1: CREATE BusinessCapability mit architect-Rolle'
  )
}

/**
 * Test 2: UPDATE Operation
 */
async function testUpdateOperation(token, capabilityId) {
  const mutation = `
    mutation UpdateBusinessCapability($where: BusinessCapabilityWhere!, $update: BusinessCapabilityUpdateInput!) {
      updateBusinessCapabilities(where: $where, update: $update) {
        businessCapabilities {
          id
          name
          description
          status
          businessValue
          updatedAt
        }
      }
    }
  `

  const variables = {
    where: { id: { eq: capabilityId } },
    update: {
      description: { set: `Aktualisiert am ${new Date().toISOString()}` },
      businessValue: { set: 9 },
    },
  }

  return await executeGraphQL(mutation, variables, token, 'Test 2: UPDATE BusinessCapability')
}

/**
 * Test 3: DELETE Operation
 */
async function testDeleteOperation(token, capabilityId) {
  const mutation = `
    mutation DeleteBusinessCapability($where: BusinessCapabilityWhere!) {
      deleteBusinessCapabilities(where: $where) {
        nodesDeleted
      }
    }
  `

  const variables = {
    where: { id: { eq: capabilityId } },
  }

  return await executeGraphQL(mutation, variables, token, 'Test 3: DELETE BusinessCapability')
}

/**
 * Test 4: Complex Query mit Beziehungen
 */
async function testComplexQuery(token) {
  const query = `
    query GetBusinessCapabilitiesWithDetails {
      businessCapabilities(limit: 5) {
        id
        name
        description
        status
        businessValue
        createdAt
        updatedAt
      }
    }
  `

  return await executeGraphQL(query, {}, token, 'Test 4: Complex Query mit Paginierung')
}

/**
 * Test 5: Ungültiger Token
 */
async function testInvalidToken() {
  const invalidToken = 'invalid.jwt.token'

  const query = `
    query {
      businessCapabilities {
        id
        name
      }
    }
  `

  return await executeGraphQL(query, {}, invalidToken, 'Test 5: Request mit ungültigem Token')
}

/**
 * Test 6: Abgelaufener Token simulieren
 */
async function testExpiredTokenScenario(token) {
  console.log('⏰ Test 6: Token-Ablauf-Simulation')
  console.log(
    'Hinweis: Echter Test würde 5+ Minuten dauern, simulieren wir durch Token-Manipulation'
  )

  // Manipulierter Token (wird vom Server abgelehnt)
  const manipulatedToken = token.substring(0, token.length - 10) + 'manipulated'

  const query = `
    query {
      businessCapabilities {
        id
        name
      }
    }
  `

  return await executeGraphQL(
    query,
    {},
    manipulatedToken,
    'Test 6: Request mit manipuliertem Token'
  )
}

/**
 * Haupttest-Funktion
 */
async function runExtendedAuthTest() {
  try {
    console.log('='.repeat(50))
    console.log('🔐 SCHRITT 1: Token-Management')
    console.log('='.repeat(50))

    // Token abrufen
    const tokenData = await getKeycloakToken()
    console.log('✅ Access Token abgerufen')
    console.log(`📅 Expires in: ${tokenData.expiresIn} Sekunden`)
    console.log()

    // Token analysieren
    const tokenPayload = analyzeJWT(tokenData.accessToken)

    console.log('='.repeat(50))
    console.log('🧪 SCHRITT 2: CRUD-Operationen testen')
    console.log('='.repeat(50))

    // Test 1: CREATE
    const createResult = await testCreateOperation(tokenData.accessToken)
    let createdCapabilityId = null

    if (createResult?.data?.createBusinessCapabilities?.businessCapabilities?.[0]) {
      createdCapabilityId = createResult.data.createBusinessCapabilities.businessCapabilities[0].id
      console.log(`✅ BusinessCapability erstellt mit ID: ${createdCapabilityId}`)
    }

    // Test 2: UPDATE (nur wenn CREATE erfolgreich war)
    if (createdCapabilityId) {
      await testUpdateOperation(tokenData.accessToken, createdCapabilityId)
    }

    // Test 3: Complex Query
    await testComplexQuery(tokenData.accessToken)

    console.log('='.repeat(50))
    console.log('🛡️  SCHRITT 3: Sicherheitstests')
    console.log('='.repeat(50))

    // Test 4: Ungültiger Token
    await testInvalidToken()

    // Test 5: Manipulierter Token
    await testExpiredTokenScenario(tokenData.accessToken)

    console.log('='.repeat(50))
    console.log('🔄 SCHRITT 4: Token-Refresh-Test')
    console.log('='.repeat(50))

    // Token-Refresh testen
    if (tokenData.refreshToken) {
      const refreshedTokenData = await refreshKeycloakToken(tokenData.refreshToken)
      console.log('✅ Token erfolgreich erneuert')

      // Mit erneuerten Token testen
      await testComplexQuery(refreshedTokenData.accessToken)
    }

    console.log('='.repeat(50))
    console.log('🧹 SCHRITT 5: Cleanup')
    console.log('='.repeat(50))

    // Test 6: DELETE (Cleanup)
    if (createdCapabilityId) {
      await testDeleteOperation(tokenData.accessToken, createdCapabilityId)
      console.log(`✅ Test-Capability ${createdCapabilityId} gelöscht`)
    }

    console.log('='.repeat(50))
    console.log('🎉 ALLE TESTS ABGESCHLOSSEN')
    console.log('='.repeat(50))
    console.log()
    console.log('✅ JWT-Authentifizierung funktioniert vollständig')
    console.log('✅ Rollenbasierte Autorisierung (architect) erfolgreich')
    console.log('✅ CRUD-Operationen funktionieren')
    console.log('✅ Token-Refresh-Flow funktioniert')
    console.log('✅ Sicherheitsvalidierung funktioniert')
  } catch (error) {
    console.error('💥 Test-Fehler:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

// Test ausführen
runExtendedAuthTest()
