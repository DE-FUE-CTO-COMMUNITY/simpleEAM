// Company validation queries for PV scenario
// These queries validate that all entities are properly associated with the company

import { Session } from 'neo4j-driver'

export async function validateCompanyAssociations(session: Session): Promise<void> {
  console.log('🔍 Validating Company Associations...')

  const companyId = 'company-solar-panels-gmbh'

  // Validate Company exists
  const companyResult = await session.run(`
    MATCH (c:Company {id: $companyId})
    RETURN c.name as name, c.industry as industry
  `, { companyId })

  if (companyResult.records.length > 0) {
    const company = companyResult.records[0]
    console.log(`✓ Company found: ${company.get('name')} (${company.get('industry')})`)
  } else {
    console.log('❌ Company not found!')
    return
  }

  // Validate all entity types are associated with company
  const entityTypes = [
    { label: 'Person', relationship: 'EMPLOYED_BY', description: 'Employees' },
    { label: 'BusinessCapability', relationship: 'OWNED_BY', description: 'Business Capabilities' },
    { label: 'Application', relationship: 'OWNED_BY', description: 'Applications' },
    { label: 'DataObject', relationship: 'OWNED_BY', description: 'Data Objects' },
    { label: 'Infrastructure', relationship: 'OWNED_BY', description: 'Infrastructure' },
    { label: 'ApplicationInterface', relationship: 'OWNED_BY', description: 'Interfaces' },
    { label: 'Architecture', relationship: 'OWNED_BY', description: 'Architectures' },
    { label: 'ArchitecturePrinciple', relationship: 'OWNED_BY', description: 'Architecture Principles' }
  ]

  for (const entityType of entityTypes) {
    const result = await session.run(`
      MATCH (c:Company {id: $companyId})<-[:${entityType.relationship}]-(e:${entityType.label})
      RETURN count(e) as count
    `, { companyId })

    const count = result.records[0].get('count').toNumber()
    console.log(`✓ ${entityType.description}: ${count} entities associated with company`)
  }

  // Show some example associations
  console.log('\n📋 Sample Company Associations:')

  // Show key employees
  const employeeResult = await session.run(`
    MATCH (c:Company {id: $companyId})<-[:EMPLOYED_BY]-(p:Person)
    WHERE p.role CONTAINS 'Chief'
    RETURN p.firstName + ' ' + p.lastName as name, p.role as role
    LIMIT 3
  `, { companyId })

  employeeResult.records.forEach(record => {
    console.log(`   👤 ${record.get('name')} - ${record.get('role')}`)
  })

  // Show key applications
  const appResult = await session.run(`
    MATCH (c:Company {id: $companyId})<-[:OWNED_BY]-(a:Application)
    RETURN a.name as name
    LIMIT 3
  `, { companyId })

  appResult.records.forEach(record => {
    console.log(`   💻 ${record.get('name')}`)
  })

  // Show architecture count by domain
  const archResult = await session.run(`
    MATCH (c:Company {id: $companyId})<-[:OWNED_BY]-(a:Architecture)
    RETURN a.domain as domain, count(a) as count
    ORDER BY count DESC
  `, { companyId })

  console.log('\n🏗️ Architecture Distribution by Domain:')
  archResult.records.forEach(record => {
    console.log(`   ${record.get('domain')}: ${record.get('count').toNumber()} architectures`)
  })

  console.log('\n✅ Company association validation complete!')
}
