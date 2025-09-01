// Companies for Solar Panel Manufacturing Company Scenario
// Creates the main company entity for the PV manufacturing scenario

import { Session } from 'neo4j-driver'

export async function createSolarCompany(session: Session): Promise<void> {
  console.log('Creating Solar Panel Manufacturing Company...')

  const query = `
    CREATE (company:Company {
      id: 'company-solar-panels-gmbh',
      name: 'Solar Panels GmbH',
      description: 'Leading manufacturer of high-efficiency photovoltaic solar panels and renewable energy solutions. Specializing in monocrystalline and polycrystalline solar cell technology with global distribution.',
      address: 'Sonnenallee 42, 10997 Berlin, Germany',
      website: 'https://www.solarpanels-gmbh.de',
      industry: 'Renewable Energy / Solar Manufacturing',
      size: 'LARGE',
      createdAt: datetime(),
      updatedAt: datetime()
    })
    RETURN company.id as companyId
  `

  try {
    const result = await session.run(query)
    if (result.records.length > 0) {
      console.log(`Solar Panels GmbH created with ID: ${result.records[0].get('companyId')}`)
    }
    console.log('Solar Panel Manufacturing Company created successfully.')
  } catch (error) {
    console.error('Error creating Solar Panel Manufacturing Company:', error)
    throw error
  }
}
