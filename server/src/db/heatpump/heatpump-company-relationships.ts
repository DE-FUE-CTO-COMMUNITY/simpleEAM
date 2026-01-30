// Company Relationship Builder for Heat Pump Manufacturing Scenario
// Associates all Heat Pump entities with the main company entity

import { Session } from 'neo4j-driver'

export async function associateHeatPumpEntitiesWithCompany(session: Session): Promise<void> {
  console.log('🔗 Associating all Heat Pump entities with Thermo Dynamics AG...')

  try {
    // Associate all Business Capabilities with the company
    await session.run(`
      MATCH (company:Company {id: "company-thermo-dynamics-ag"}), 
            (capability:BusinessCapability) 
      WHERE capability.id STARTS WITH "hp-cap-"
      CREATE (capability)-[:OWNED_BY]->(company)
    `)

    // Associate all Persons with the company
    await session.run(`
      MATCH (company:Company {id: "company-thermo-dynamics-ag"}), 
            (person:Person) 
      WHERE person.id STARTS WITH "hp-person-"
      CREATE (person)-[:EMPLOYED_BY]->(company)
    `)

    // Associate all Applications with the company
    await session.run(`
      MATCH (company:Company {id: "company-thermo-dynamics-ag"}), 
            (app:Application) 
      WHERE app.id STARTS WITH "hp-app-"
      CREATE (app)-[:OWNED_BY]->(company)
    `)

    // Associate all Data Objects with the company
    await session.run(`
      MATCH (company:Company {id: "company-thermo-dynamics-ag"}), 
            (data:DataObject) 
      WHERE data.id STARTS WITH "hp-data-"
      CREATE (data)-[:OWNED_BY]->(company)
    `)

    // Associate all Architectures with the company
    await session.run(`
      MATCH (company:Company {id: "company-thermo-dynamics-ag"}), 
            (arch:Architecture) 
      WHERE arch.id STARTS WITH "hp-arch-"
      CREATE (arch)-[:OWNED_BY]->(company)
    `)

    // Associate all Architecture Principles with the company
    await session.run(`
      MATCH (company:Company {id: "company-thermo-dynamics-ag"}), 
            (principle:ArchitecturePrinciple) 
      WHERE principle.id STARTS WITH "hp-principle-"
      CREATE (principle)-[:OWNED_BY]->(company)
    `)

    // Associate all Infrastructure with the company
    await session.run(`
      MATCH (company:Company {id: "company-thermo-dynamics-ag"}), 
            (infra:Infrastructure) 
      WHERE infra.id STARTS WITH "hp-infra-"
      CREATE (infra)-[:OWNED_BY]->(company)
    `)

    // Associate all Application Interfaces with the company
    await session.run(`
      MATCH (company:Company {id: "company-thermo-dynamics-ag"}), 
            (interface:ApplicationInterface) 
      WHERE interface.id STARTS WITH "hp-interface-"
      CREATE (interface)-[:OWNED_BY]->(company)
    `)

    console.log('✓ All Heat Pump entities successfully associated with Thermo Dynamics AG')
  } catch (error) {
    console.error('Error associating entities with company:', error)
    throw error
  }
}
