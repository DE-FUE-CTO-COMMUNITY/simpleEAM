import { Neo4jGraphQL } from '@neo4j/graphql'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import neo4jDriver from '../db/neo4j-client'
import dotenv from 'dotenv'

// Umgebungsvariablen laden
dotenv.config()

// GraphQL-Typendefinitionen aus der Schema-Datei lesen
const typeDefs = readFileSync(resolve(__dirname, 'schema.graphql')).toString('utf-8')

// JWKS URL konstruieren
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'https://auth.dev-server.mf2.eu'
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'simple-eam'
const jwksUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`

console.log('Neo4j GraphQL JWT-Konfiguration:')
console.log('KEYCLOAK_URL:', KEYCLOAK_URL)
console.log('KEYCLOAK_REALM:', KEYCLOAK_REALM)
console.log('JWKS URL:', jwksUrl)

// Neo4j GraphQL-Instanz erstellen mit JWT-Konfiguration
export const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver: neo4jDriver,
  features: {
    authorization: {
      key: {
        url: jwksUrl,
      },
    },
  },
})

// Schema generieren
export const getSchema = async () => {
  return await neoSchema.getSchema()
}

export default neoSchema
