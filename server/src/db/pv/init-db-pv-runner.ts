#!/usr/bin/env ts-node

// Executable script for initializing the Solar Panel Manufacturing scenario
// Run with: yarn init-db-pv --reset
// Or directly with: ts-node src/db/pv/init-db-pv-runner.ts --reset

import neo4j from 'neo4j-driver'
import dotenv from 'dotenv'
import { initPhotovoltaicScenario, testPhotovoltaicScenario } from './init-db-pv'

// Load environment variables
dotenv.config()

async function main() {
  console.log('🌞 Solar Panel Manufacturing Company - Enterprise Architecture Initialization')
  console.log('='.repeat(80))

  // Neo4j connection configuration
  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687'
  const user = process.env.NEO4J_USER || 'neo4j'
  const password = process.env.NEO4J_PASSWORD || 'password'

  console.log(`🔌 Connecting to Neo4j at: ${uri}`)

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))

  try {
    // Verify connection
    await driver.verifyConnectivity()
    console.log('✅ Neo4j connection established successfully')

    // Clear existing data (optional - uncomment if needed)
    const shouldClearData = process.argv.includes('--reset') || process.argv.includes('-r')
    if (shouldClearData) {
      console.log('\n🧹 Clearing existing data...')
      const session = driver.session()
      await session.run('MATCH (n) DETACH DELETE n')
      await session.close()
      console.log('✅ Database cleared')
    }

    // Initialize the Solar Panel Manufacturing scenario
    await initPhotovoltaicScenario(driver)

    // Run tests if requested
    const shouldRunTests = process.argv.includes('--test') || process.argv.includes('-t')
    if (shouldRunTests) {
      console.log('\n🧪 Running scenario validation tests...')
      await testPhotovoltaicScenario(driver)
    }

    console.log('\n' + '='.repeat(80))
    console.log('🎉 Solar Panel Manufacturing Enterprise Architecture successfully initialized!')
    console.log('\n💡 Next Steps:')
    console.log('   1. Start the GraphQL server: yarn dev')
    console.log('   2. Open GraphQL Playground: http://localhost:4000/graphql')
    console.log('   3. Explore the enterprise architecture model')
    console.log('   4. Run with --test flag to see validation queries')
    console.log('   5. Use the Simple-EAM frontend to visualize the architecture')
  } catch (error) {
    console.error('❌ Failed to initialize Solar Panel Manufacturing scenario:', error)
    process.exit(1)
  } finally {
    await driver.close()
    console.log('🔌 Neo4j connection closed')
  }
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error)
}
