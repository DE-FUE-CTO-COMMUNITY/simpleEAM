#!/usr/bin/env ts-node

// Executable script for initializing the Heat Pump Manufacturing scenario
// Run with: yarn init-db-heatpump --reset
// Or directly with: ts-node src/db/heatpump/init-db-heatpump-runner.ts --reset

import neo4j from 'neo4j-driver'
import dotenv from 'dotenv'
import { initHeatPumpScenario, testHeatPumpScenario } from './init-db-heatpump'

// Load environment variables
dotenv.config()

async function main() {
  console.log('🌡️ Heat Pump Manufacturing Company - Enterprise Architecture Initialization')
  console.log('================================================================================')

  // Parse command line arguments
  const args = process.argv.slice(2)
  const shouldReset = args.includes('--reset')
  const shouldTest = args.includes('--test')

  // Database connection
  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687'
  const user = process.env.NEO4J_USER || 'neo4j'
  const password = process.env.NEO4J_PASSWORD || 'password'

  console.log(`🔌 Connecting to Neo4j at: ${uri}`)

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

  try {
    // Test connection
    await driver.verifyConnectivity()
    console.log('✅ Neo4j connection established successfully')

    // Clear database if reset flag is provided
    if (shouldReset) {
      console.log('\n🧹 Clearing existing data...')
      const session = driver.session()
      try {
        await session.run('MATCH (n) DETACH DELETE n')
        console.log('✅ Database cleared')
      } finally {
        await session.close()
      }
    }

    // Initialize the Heat Pump Manufacturing scenario
    await initHeatPumpScenario(driver)

    // Run tests if test flag is provided
    if (shouldTest) {
      console.log('\n🧪 Running scenario validation tests...')
      await testHeatPumpScenario(driver)
    }

    console.log(
      '\n================================================================================'
    )
    console.log('🎉 Heat Pump Manufacturing Enterprise Architecture successfully initialized!')
    console.log('\n💡 Next Steps:')
    console.log('   1. Start the GraphQL server: yarn dev')
    console.log('   2. Open GraphQL Playground: http://localhost:4000/graphql')
    console.log('   3. Explore the enterprise architecture model')
    console.log('   4. Run with --test flag to see validation queries')
    console.log('   5. Use the Simple-EAM frontend to visualize the architecture')
  } catch (error) {
    console.error('❌ Failed to initialize Heat Pump Manufacturing scenario:', error)
    process.exit(1)
  } finally {
    console.log('🔌 Neo4j connection closed')
    await driver.close()
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Run the main function
if (require.main === module) {
  main()
}
