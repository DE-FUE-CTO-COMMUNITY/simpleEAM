// Main Controller Script for Solar Panel Manufacturing Company Scenario
// Orchestrates the creation of a comprehensive enterprise architecture model

import { Driver, Session } from 'neo4j-driver'
import { createBusinessCapabilities } from './pv-business-capabilities'
import { createPersons, createCapabilityOwnership } from './pv-persons'
import { createApplications, createApplicationOwnership } from './pv-applications'
import { createDataObjects, createDataObjectOwnership } from './pv-data-objects'
import {
  createInfrastructure,
  createInfrastructureRelationships,
  createInfrastructureOwnership,
} from './pv-infrastructure'
import {
  createArchitecturePrinciples,
  createPrincipleOwnership,
} from './pv-architecture-principles'
import {
  createCapabilityHierarchy,
  createApplicationCapabilitySupport,
  createApplicationDataRelationships,
  createApplicationInfrastructureHosting,
  createApplicationSuccessorRelationships,
  createArchitecturePrincipleRelationships,
  createArchitectureRelationships,
  createArchitectureOwnership,
} from './pv-relationships'
import {
  createApplicationInterfaces,
  createInterfaceRelationships,
  createInterfaceOwnership,
} from './pv-interfaces'
import { createArchitectures } from './pv-architectures'

export async function initPhotovoltaicScenario(driver: Driver) {
  const session: Session = driver.session()
  console.log(
    '🌞 Starting Solar Panel Manufacturing Company Enterprise Architecture Initialization...'
  )

  try {
    // ===== PHASE 1: CORE ENTITIES =====
    console.log('\n📋 Phase 1: Creating Core Business Entities...')

    // 1. Business Capabilities (L1 and L2)
    await createBusinessCapabilities(session)

    // 2. Organizational Structure (Persons)
    await createPersons(session)

    // 3. Application Portfolio
    await createApplications(session)

    // 4. Data Architecture
    await createDataObjects(session)

    // 5. Infrastructure Components
    await createInfrastructure(session)

    // 6. Architecture Principles
    await createArchitecturePrinciples(session)

    // ===== PHASE 2: INTEGRATION LAYER =====
    console.log('\n🔗 Phase 2: Creating Integration Layer...')

    // 7. Application Interfaces
    await createApplicationInterfaces(session)

    // ===== PHASE 3: ARCHITECTURE MODELS =====
    console.log('\n🏗️ Phase 3: Creating Architecture Models...')

    // 8. Enterprise Architectures
    await createArchitectures(session)

    // ===== PHASE 4: RELATIONSHIPS =====
    console.log('\n🔗 Phase 4: Establishing Relationships...')

    // 9. Capability Hierarchy
    await createCapabilityHierarchy(session)

    // 10. Ownership Relationships
    await createCapabilityOwnership(session)
    await createApplicationOwnership(session)
    await createDataObjectOwnership(session)
    await createInfrastructureOwnership(session)
    await createPrincipleOwnership(session)
    await createInterfaceOwnership(session)
    await createArchitectureOwnership(session)

    // 11. Application Support Relationships
    await createApplicationCapabilitySupport(session)

    // 12. Data Flow Relationships
    await createApplicationDataRelationships(session)

    // 13. Hosting Relationships
    await createApplicationInfrastructureHosting(session)
    await createInfrastructureRelationships(session)

    // 14. Application Succession
    await createApplicationSuccessorRelationships(session)

    // 15. Interface Relationships
    await createInterfaceRelationships(session)

    // 16. Architecture Relationships
    await createArchitectureRelationships(session)

    // 17. Architecture Principle Relationships
    await createArchitecturePrincipleRelationships(session)

    // 18. Architecture Ownership
    await createArchitectureOwnership(session)

    // ===== COMPLETION SUMMARY =====
    console.log('\n✅ Solar Panel Manufacturing Company Scenario Complete!')

    // Generate summary statistics
    const stats = await generateScenarioStatistics(session)
    console.log('\n📊 Scenario Statistics:')
    console.log(
      `   • Business Capabilities: ${stats.capabilities} (${stats.l1Capabilities} L1, ${stats.l2Capabilities} L2)`
    )
    console.log(`   • Persons: ${stats.persons}`)
    console.log(`   • Applications: ${stats.applications}`)
    console.log(`   • Data Objects: ${stats.dataObjects}`)
    console.log(`   • Infrastructure Components: ${stats.infrastructure}`)
    console.log(`   • Application Interfaces: ${stats.interfaces}`)
    console.log(`   • Architecture Principles: ${stats.principles}`)
    console.log(`   • Enterprise Architectures: ${stats.architectures}`)
    console.log(`   • Total Relationships: ${stats.relationships}`)

    console.log('\n🎯 Key Features Implemented:')
    console.log('   ✓ Comprehensive L1/L2 business capability model')
    console.log('   ✓ Cloud-first infrastructure architecture (AWS)')
    console.log('   ✓ Mix of COTS and custom applications')
    console.log('   ✓ End-to-end integration with 12 application interfaces')
    console.log('   ✓ Current state + transition + target state architectures')
    console.log('   ✓ Extended architecture principles (18 principles)')
    console.log('   ✓ Complete ownership and accountability model')
    console.log('   ✓ Manufacturing-specific solar panel production capabilities')

    console.log('\n🚀 Scenario ready for Enterprise Architecture Management!')
  } catch (error) {
    console.error('❌ Error during Solar Panel Manufacturing scenario initialization:', error)
    throw error
  } finally {
    await session.close()
  }
}

async function generateScenarioStatistics(session: Session) {
  // Count all created entities
  const capabilityResult = await session.run(
    'MATCH (c:BusinessCapability) RETURN count(c) as total'
  )
  const l1CapabilityResult = await session.run(
    'MATCH (c:BusinessCapability) WHERE c.level = 1 RETURN count(c) as total'
  )
  const l2CapabilityResult = await session.run(
    'MATCH (c:BusinessCapability) WHERE c.level = 2 RETURN count(c) as total'
  )
  const personResult = await session.run('MATCH (p:Person) RETURN count(p) as total')
  const applicationResult = await session.run('MATCH (a:Application) RETURN count(a) as total')
  const dataObjectResult = await session.run('MATCH (d:DataObject) RETURN count(d) as total')
  const infrastructureResult = await session.run(
    'MATCH (i:Infrastructure) RETURN count(i) as total'
  )
  const interfaceResult = await session.run(
    'MATCH (int:ApplicationInterface) RETURN count(int) as total'
  )
  const principleResult = await session.run(
    'MATCH (pr:ArchitecturePrinciple) RETURN count(pr) as total'
  )
  const architectureResult = await session.run('MATCH (ar:Architecture) RETURN count(ar) as total')
  const relationshipResult = await session.run('MATCH ()-[r]->() RETURN count(r) as total')

  return {
    capabilities: capabilityResult.records[0].get('total').toNumber(),
    l1Capabilities: l1CapabilityResult.records[0].get('total').toNumber(),
    l2Capabilities: l2CapabilityResult.records[0].get('total').toNumber(),
    persons: personResult.records[0].get('total').toNumber(),
    applications: applicationResult.records[0].get('total').toNumber(),
    dataObjects: dataObjectResult.records[0].get('total').toNumber(),
    infrastructure: infrastructureResult.records[0].get('total').toNumber(),
    interfaces: interfaceResult.records[0].get('total').toNumber(),
    principles: principleResult.records[0].get('total').toNumber(),
    architectures: architectureResult.records[0].get('total').toNumber(),
    relationships: relationshipResult.records[0].get('total').toNumber(),
  }
}

// Example usage function for testing
export async function testPhotovoltaicScenario(driver: Driver) {
  console.log('🧪 Testing Solar Panel Manufacturing Scenario...')

  const session = driver.session()

  try {
    // Test query: Find all applications supporting manufacturing capabilities
    const manufacturingAppsResult = await session.run(`
      MATCH (cap:BusinessCapability)<-[:SUPPORTS]-(app:Application)
      WHERE cap.name CONTAINS 'Manufacturing' OR cap.name CONTAINS 'Production'
      RETURN cap.name as capability, app.name as application, app.applicationCategory as category
      ORDER BY cap.name, app.name
    `)

    console.log('\n🏭 Applications Supporting Manufacturing Capabilities:')
    manufacturingAppsResult.records.forEach(record => {
      console.log(
        `   • ${record.get('application')} (${record.get('category')}) → ${record.get('capability')}`
      )
    })

    // Test query: Find data flow through manufacturing process
    const dataFlowResult = await session.run(`
      MATCH (source:Application)-[:INTERFACE_SOURCE]->(int:ApplicationInterface)-[:INTERFACE_TARGET]->(target:Application)
      MATCH (int)-[:TRANSFERS]->(data:DataObject)
      WHERE source.name CONTAINS 'SAP' OR source.name CONTAINS 'MES' OR target.name CONTAINS 'MES' OR target.name CONTAINS 'Quality'
      RETURN source.name as sourceApp, target.name as targetApp, int.name as interface, data.name as dataTransferred
      ORDER BY sourceApp, targetApp
    `)

    console.log('\n📊 Manufacturing Data Flow:')
    dataFlowResult.records.forEach(record => {
      console.log(
        `   • ${record.get('sourceApp')} → ${record.get('targetApp')} via ${record.get('interface')}`
      )
      console.log(`     Data: ${record.get('dataTransferred')}`)
    })

    // Test query: Cloud vs On-Premise hosting distribution
    const hostingResult = await session.run(`
      MATCH (app:Application)-[:HOSTED_ON]->(infra:Infrastructure)
      RETURN infra.name as infrastructure, infra.infrastructureType as type, count(app) as appCount
      ORDER BY appCount DESC
    `)

    console.log('\n☁️ Application Hosting Distribution:')
    hostingResult.records.forEach(record => {
      console.log(
        `   • ${record.get('infrastructure')} (${record.get('type')}): ${record.get('appCount').toNumber()} applications`
      )
    })
  } finally {
    await session.close()
  }
}

// Export for use in main init-db.ts
export { initPhotovoltaicScenario as initPVScenario }
