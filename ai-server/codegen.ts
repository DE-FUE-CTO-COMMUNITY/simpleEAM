import type { CodegenConfig } from '@graphql-codegen/cli'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import path from 'node:path'

dotenvExpand.expand(dotenv.config({ path: path.resolve(process.cwd(), '../.env') }))

console.log('Generating GraphQL types from schema...', process.env.GRAPHQL_URL)

if (!process.env.GRAPHQL_URL) {
  throw new Error(
    'GRAPHQL_URL environment variable is not defined. ' +
      'Please ensure .env file exists with GRAPHQL_URL configured.'
  )
}

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_URL,
  config: {
    scalars: { Money: 'number' },
    namingConvention: { enumValues: 'keep' },
  },
  generates: {
    'src/gql/generated.ts': {
      plugins: ['typescript'],
    },
  },
}

export default config
