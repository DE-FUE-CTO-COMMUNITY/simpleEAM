// Company for Heat Pump Manufacturing Company Scenario
// Creates the main company entity for the heat pump manufacturing scenario

import { Session } from 'neo4j-driver'

export async function createHeatPumpCompany(session: Session): Promise<void> {
  console.log('Creating Heat Pump Manufacturing Company...')

  const query = `
    CREATE (company:Company {
      id: 'company-thermo-dynamics-ag',
      name: 'Thermo Dynamics AG',
      description: 'Leading manufacturer of innovative heat pump systems and sustainable heating solutions. Specializing in air-source, ground-source, and hybrid heat pump technologies for residential and commercial applications.',
      address: 'Wärmestraße 15, 80331 München, Germany',
      website: 'https://www.thermo-dynamics.de',
      industry: 'HVAC Technology / Heat Pump Manufacturing',
      size: 'LARGE',
      createdAt: datetime(),
      updatedAt: datetime()
    })
    RETURN company.id as companyId
  `

  try {
    const result = await session.run(query)
    if (result.records.length > 0) {
      console.log(`Thermo Dynamics AG created with ID: ${result.records[0].get('companyId')}`)
    }
    console.log('Heat Pump Manufacturing Company created successfully.')
  } catch (error) {
    console.error('Error creating Heat Pump Manufacturing Company:', error)
    throw error
  }
}
