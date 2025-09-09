// Company relationship setup for Solar Panel Manufacturing Company
// Associates all entities with the main company

import { Session } from 'neo4j-driver'

export async function associateEntitiesWithCompany(session: Session): Promise<void> {
  console.log('Associating all entities with Solar Panels GmbH...')

  const companyId = 'company-solar-panels-gmbh'

  // Associate all Persons with Company
  await session.run(
    `
    MATCH (person:Person), (company:Company {id: $companyId})
    WHERE person.id STARTS WITH "person-"
    CREATE (person)-[:EMPLOYED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ Persons associated with company')

  // Associate all Business Capabilities with Company
  await session.run(
    `
    MATCH (capability:BusinessCapability), (company:Company {id: $companyId})
    WHERE capability.id STARTS WITH "cap-"
    CREATE (capability)-[:OWNED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ Business Capabilities associated with company')

  // Associate all Applications with Company
  await session.run(
    `
    MATCH (application:Application), (company:Company {id: $companyId})
    WHERE application.id STARTS WITH "app-"
    CREATE (application)-[:OWNED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ Applications associated with company')

  // Associate all Data Objects with Company
  await session.run(
    `
    MATCH (dataObject:DataObject), (company:Company {id: $companyId})
    WHERE dataObject.id STARTS WITH "data-"
    CREATE (dataObject)-[:OWNED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ Data Objects associated with company')

  // Associate all Infrastructure with Company
  await session.run(
    `
    MATCH (infrastructure:Infrastructure), (company:Company {id: $companyId})
    WHERE infrastructure.id STARTS WITH "infra-"
    CREATE (infrastructure)-[:OWNED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ Infrastructure associated with company')

  // Associate all Application Interfaces with Company
  await session.run(
    `
    MATCH (interface:ApplicationInterface), (company:Company {id: $companyId})
    WHERE interface.id STARTS WITH "interface-"
    CREATE (interface)-[:OWNED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ Application Interfaces associated with company')

  // Associate all AI Assets with Company (if any exist)
  await session.run(
    `
    MATCH (aiAsset:AIAsset), (company:Company {id: $companyId})
    WHERE aiAsset.id STARTS WITH "ai-"
    CREATE (aiAsset)-[:OWNED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ AI Assets associated with company')

  // Associate all AI Components with Company
  await session.run(
    `
    MATCH (aiComponent:AIComponent), (company:Company {id: $companyId})
    WHERE aiComponent.id STARTS WITH "ai-"
    CREATE (aiComponent)-[:OWNED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ AI Components associated with company')

  // Associate all Architectures with Company
  await session.run(
    `
    MATCH (architecture:Architecture), (company:Company {id: $companyId})
    WHERE architecture.id STARTS WITH "arch-"
    CREATE (architecture)-[:OWNED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ Architectures associated with company')

  // Associate all Architecture Principles with Company
  await session.run(
    `
    MATCH (principle:ArchitecturePrinciple), (company:Company {id: $companyId})
    WHERE principle.id STARTS WITH "principle-"
    CREATE (principle)-[:OWNED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ Architecture Principles associated with company')

  // Associate all Diagrams with Company (if any exist)
  await session.run(
    `
    MATCH (diagram:Diagram), (company:Company {id: $companyId})
    WHERE diagram.id STARTS WITH "diagram-"
    CREATE (diagram)-[:OWNED_BY]->(company)
  `,
    { companyId }
  )

  console.log('✓ Diagrams associated with company')

  console.log('All entities successfully associated with Solar Panels GmbH!')
}
