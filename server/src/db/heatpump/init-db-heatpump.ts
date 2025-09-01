// Main Controller Script for Heat Pump Manufacturing Company Scenario
// Orchestrates the creation of a comprehensive enterprise architecture model

import { Driver, Session } from 'neo4j-driver'
import { createHeatPumpCompany } from './heatpump-company'
import { associateHeatPumpEntitiesWithCompany } from './heatpump-company-relationships'
import { createHeatPumpBusinessCapabilities } from './heatpump-business-capabilities'
import { createHeatPumpPersons, createHeatPumpCapabilityOwnership } from './heatpump-persons'
import {
  createHeatPumpApplications,
  createHeatPumpApplicationOwnership,
} from './heatpump-applications'
import {
  createHeatPumpDataObjects,
  createHeatPumpDataObjectOwnership,
} from './heatpump-data-objects'
import {
  createHeatPumpArchitectures,
  createHeatPumpArchitectureOwnership,
} from './heatpump-architectures'
import {
  createHeatPumpArchitecturePrinciples,
  createHeatPumpArchitecturePrincipleOwnership,
} from './heatpump-architecture-principles'
import {
  createHeatPumpInfrastructure,
  createHeatPumpInfrastructureOwnership,
} from './heatpump-infrastructure'
import {
  createHeatPumpApplicationInterfaces,
  createHeatPumpApplicationInterfaceOwnership,
  createHeatPumpApplicationInterfaceConnections,
} from './heatpump-application-interfaces'

export async function initHeatPumpScenario(driver: Driver): Promise<void> {
  console.log(
    '🌡️ Starting Heat Pump Manufacturing Company Enterprise Architecture Initialization...'
  )

  const session = driver.session()

  try {
    // ===== PHASE 0: COMPANY FOUNDATION =====
    console.log('\n🏢 Phase 0: Creating Company Foundation...')

    // Create the main company entity
    await createHeatPumpCompany(session)

    // ===== PHASE 1: CORE ENTITIES =====
    console.log('\n📋 Phase 1: Creating Core Business Entities...')

    // 1. Business Capabilities (L1 and L2)
    await createHeatPumpBusinessCapabilities(session)

    // 2. Organizational Structure (Persons)
    await createHeatPumpPersons(session)

    // 3. Application Portfolio
    await createHeatPumpApplications(session)

    // 4. Data Objects
    await createHeatPumpDataObjects(session)

    // 5. Architectures
    await createHeatPumpArchitectures(session)

    // 6. Architecture Principles
    await createHeatPumpArchitecturePrinciples(session)

    // 7. Infrastructure
    await createHeatPumpInfrastructure(session)

    // 8. Application Interfaces
    await createHeatPumpApplicationInterfaces(session)

    // ===== PHASE 2: RELATIONSHIPS =====
    console.log('\n🔗 Phase 2: Establishing Core Relationships...')

    // 1. Capability Ownership
    await createHeatPumpCapabilityOwnership(session)

    // 2. Application Ownership
    await createHeatPumpApplicationOwnership(session)

    // 3. Data Object Ownership
    await createHeatPumpDataObjectOwnership(session)

    // 4. Architecture Ownership
    await createHeatPumpArchitectureOwnership(session)

    // 5. Architecture Principle Ownership
    await createHeatPumpArchitecturePrincipleOwnership(session)

    // 6. Infrastructure Ownership
    await createHeatPumpInfrastructureOwnership(session)

    // 7. Application Interface Ownership
    await createHeatPumpApplicationInterfaceOwnership(session)

    // ===== PHASE 3: ADVANCED RELATIONSHIPS =====
    console.log('\n🌐 Phase 3: Establishing Advanced Relationships...')

    // 1. Application-Interface Connections
    await createHeatPumpApplicationInterfaceConnections(session)

    // ===== PHASE 4: COMPANY ASSOCIATIONS =====
    console.log('\n🏢 Phase 4: Associating all entities with company...')

    // Associate all entities with the main company
    await associateHeatPumpEntitiesWithCompany(session)

    // ===== COMPLETION SUMMARY =====
    console.log('\n✅ Heat Pump Manufacturing Company Scenario Complete!')

    // Generate summary statistics
    const stats = await generateHeatPumpScenarioStatistics(session)
    console.log('\n📊 Scenario Statistics:')
    console.log(`   • Companies: ${stats.companies}`)
    console.log(
      `   • Business Capabilities: ${stats.capabilities} (${stats.l1Capabilities} L1, ${stats.l2Capabilities} L2)`
    )
    console.log(`   • Persons: ${stats.persons}`)
    console.log(`   • Applications: ${stats.applications}`)
    console.log(`   • Data Objects: ${stats.dataObjects}`)
    console.log(`   • Architectures: ${stats.architectures}`)
    console.log(`   • Architecture Principles: ${stats.principles}`)
    console.log(`   • Infrastructure: ${stats.infrastructure}`)
    console.log(`   • Application Interfaces: ${stats.interfaces}`)
    console.log(`   • Total Relationships: ${stats.relationships}`)

    console.log('\n🎯 Key Features Implemented:')
    console.log('   ✓ Comprehensive L1/L2 business capability model for HVAC manufacturing')
    console.log('   ✓ Specialized heat pump and thermal system capabilities')
    console.log('   ✓ IoT-enabled remote monitoring and energy analytics')
    console.log('   ✓ Modern cloud-first application architecture')
    console.log('   ✓ Integrated quality management and sustainability focus')
    console.log('   ✓ Complete ownership and accountability model')
    console.log('   ✓ HVAC-specific manufacturing and service capabilities')

    console.log('\n🚀 Scenario ready for Enterprise Architecture Management!')
  } catch (error) {
    console.error('❌ Error during Heat Pump Manufacturing scenario initialization:', error)
    throw error
  } finally {
    await session.close()
  }
}

async function generateHeatPumpScenarioStatistics(session: Session) {
  // Count all created entities
  const companyResult = await session.run(
    'MATCH (c:Company) WHERE c.id STARTS WITH "company-thermo-dynamics" RETURN count(c) as total'
  )
  const capabilityResult = await session.run(
    'MATCH (c:BusinessCapability) WHERE c.id STARTS WITH "hp-cap-" RETURN count(c) as total'
  )
  const l1CapabilityResult = await session.run(
    'MATCH (c:BusinessCapability) WHERE c.id STARTS WITH "hp-cap-" AND c.level = 1 RETURN count(c) as total'
  )
  const l2CapabilityResult = await session.run(
    'MATCH (c:BusinessCapability) WHERE c.id STARTS WITH "hp-cap-" AND c.level = 2 RETURN count(c) as total'
  )
  const personResult = await session.run(
    'MATCH (p:Person) WHERE p.id STARTS WITH "hp-person-" RETURN count(p) as total'
  )
  const applicationResult = await session.run(
    'MATCH (a:Application) WHERE a.id STARTS WITH "hp-app-" RETURN count(a) as total'
  )
  const dataObjectResult = await session.run(
    'MATCH (d:DataObject) WHERE d.id STARTS WITH "hp-data-" RETURN count(d) as total'
  )
  const architectureResult = await session.run(
    'MATCH (a:Architecture) WHERE a.id STARTS WITH "hp-arch-" RETURN count(a) as total'
  )
  const principleResult = await session.run(
    'MATCH (p:ArchitecturePrinciple) WHERE p.id STARTS WITH "hp-principle-" RETURN count(p) as total'
  )
  const infrastructureResult = await session.run(
    'MATCH (i:Infrastructure) WHERE i.id STARTS WITH "hp-infra-" RETURN count(i) as total'
  )
  const interfaceResult = await session.run(
    'MATCH (ai:ApplicationInterface) WHERE ai.id STARTS WITH "hp-interface-" RETURN count(ai) as total'
  )
  const relationshipResult = await session.run(`
    MATCH (n)-[r]->(m) 
    WHERE (n.id STARTS WITH "hp-" OR n.id STARTS WITH "company-thermo-dynamics") 
       OR (m.id STARTS WITH "hp-" OR m.id STARTS WITH "company-thermo-dynamics")
    RETURN count(r) as total
  `)

  return {
    companies: companyResult.records[0].get('total').toNumber(),
    capabilities: capabilityResult.records[0].get('total').toNumber(),
    l1Capabilities: l1CapabilityResult.records[0].get('total').toNumber(),
    l2Capabilities: l2CapabilityResult.records[0].get('total').toNumber(),
    persons: personResult.records[0].get('total').toNumber(),
    applications: applicationResult.records[0].get('total').toNumber(),
    dataObjects: dataObjectResult.records[0].get('total').toNumber(),
    architectures: architectureResult.records[0].get('total').toNumber(),
    principles: principleResult.records[0].get('total').toNumber(),
    infrastructure: infrastructureResult.records[0].get('total').toNumber(),
    interfaces: interfaceResult.records[0].get('total').toNumber(),
    relationships: relationshipResult.records[0].get('total').toNumber(),
  }
}

// Example usage function for testing
export async function testHeatPumpScenario(driver: Driver) {
  console.log('🧪 Testing Heat Pump Manufacturing Scenario...')

  const session = driver.session()

  try {
    // Test query: Find all applications supporting thermal capabilities
    const thermalAppsResult = await session.run(`
      MATCH (cap:BusinessCapability)<-[:SUPPORTS]-(app:Application)
      WHERE cap.id STARTS WITH "hp-cap-" AND (cap.name CONTAINS 'Thermal' OR cap.name CONTAINS 'Heat')
      RETURN cap.name as capability, app.name as application
      ORDER BY cap.name, app.name
    `)

    console.log('\n🌡️ Applications Supporting Thermal Capabilities:')
    thermalAppsResult.records.forEach(record => {
      console.log(`   • ${record.get('application')} → ${record.get('capability')}`)
    })

    // Test query: Company ownership validation
    const companyEntitiesResult = await session.run(`
      MATCH (company:Company {id: "company-thermo-dynamics-ag"})<-[r]-(entity)
      RETURN type(r) as relationship, labels(entity)[0] as entityType, count(entity) as count
      ORDER BY entityType
    `)

    console.log('\n🏢 Company Entity Ownership:')
    companyEntitiesResult.records.forEach(record => {
      console.log(
        `   • ${record.get('entityType')}: ${record.get('count').toNumber()} entities via ${record.get('relationship')}`
      )
    })
  } catch (error) {
    console.error('Error during testing:', error)
  } finally {
    await session.close()
  }
}
