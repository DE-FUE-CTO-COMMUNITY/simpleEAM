import { Neo4jGraphQL } from '@neo4j/graphql'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import neo4jDriver from '../db/neo4j-client'

// GraphQL-Typendefinitionen aus der Schema-Datei lesen
const typeDefs = readFileSync(resolve(__dirname, 'schema.graphql')).toString('utf-8')

// Neo4j GraphQL-Instanz erstellen mit deaktiviertem CYPHER-Präfix für Neo4j 5.x Kompatibilität
export const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver: neo4jDriver,
  features: {},
})

// Schema generieren
export const getSchema = async () => {
  return await neoSchema.getSchema()
}

export default neoSchema
