import type { CodegenConfig } from '@graphql-codegen/cli'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import path from 'node:path'

dotenvExpand.expand(dotenv.config({ path: path.resolve(process.cwd(), '../.env') }))

console.log('Generating GraphQL types from schema...', process.env.GRAPHQL_URL)

const config: CodegenConfig = {
  overwrite: true,
  // WICHTIG: Das Remote-Schema MUSS verwendet werden, da die Neo4j GraphQL Library
  // automatisch Queries und Mutations aus der lokalen Schema-Datei generiert.
  // Diese generierten Operationen sind nur über das laufende GraphQL-Server verfügbar
  // und nicht in der statischen Schema-Datei enthalten.
  schema: process.env.GRAPHQL_URL || 'http://localhost:4000/graphql',
  config: {
    // This tells codegen that the `Money` scalar is a number
    scalars: { Money: 'number' },
    // This ensures generated enums do not conflict with the built-in types.
    namingConvention: { enumValues: 'keep' },
  },
  generates: {
    // The path to the generated type file in your
    // plugin directory. Adjust accordingly.
    'src/gql/generated.ts': {
      plugins: ['typescript'],
    },
  },
}

export default config
