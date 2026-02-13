import { config as dotenvConfig } from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { resolve } from 'path'
import type { CodegenConfig } from '@graphql-codegen/cli'

// Load environment variables from parent directory's .env file with variable expansion
const envConfig = dotenvConfig({ path: resolve(__dirname, '../.env') })
dotenvExpand(envConfig)

// Validate that GRAPHQL_URL is defined in environment
if (!process.env.GRAPHQL_URL) {
  throw new Error(
    'GRAPHQL_URL environment variable is not defined. ' +
      'Please ensure .env file exists with GRAPHQL_URL configured.'
  )
}

const config: CodegenConfig = {
  overwrite: true,
  // WICHTIG: Das Remote-Schema MUSS verwendet werden, da die Neo4j GraphQL Library
  // automatisch Queries und Mutations aus der lokalen Schema-Datei generiert.
  // Diese generierten Operationen sind nur über das laufende GraphQL-Server verfügbar
  // und nicht in der statischen Schema-Datei enthalten.
  schema: process.env.GRAPHQL_URL,
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
