// Persons for Heat Pump Manufacturing Company
// Key stakeholders and owners for capabilities and applications

import { Session } from 'neo4j-driver'

export async function createHeatPumpPersons(session: Session): Promise<void> {
  console.log('Creating Persons for Heat Pump Manufacturing...')

  await session.run(`
    CREATE 
    (ceo:Person {
      id: "hp-person-ceo",
      firstName: "Dr. Klaus",
      lastName: "Müller",
      email: "klaus.mueller@thermo-dynamics.de",
      department: "Executive",
      role: "Chief Executive Officer",
      phone: "+49-89-1234-0101",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (cto:Person {
      id: "hp-person-cto",
      firstName: "Ingrid",
      lastName: "Schmidt",
      email: "ingrid.schmidt@thermo-dynamics.de",
      department: "Technology",
      role: "Chief Technology Officer",
      phone: "+49-89-1234-0102",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (coo:Person {
      id: "hp-person-coo",
      firstName: "Thomas",
      lastName: "Weber",
      email: "thomas.weber@thermo-dynamics.de",
      department: "Operations",
      role: "Chief Operating Officer",
      phone: "+49-89-1234-0103",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (cfo:Person {
      id: "hp-person-cfo",
      firstName: "Andrea",
      lastName: "Fischer",
      email: "andrea.fischer@thermo-dynamics.de",
      department: "Finance",
      role: "Chief Financial Officer",
      phone: "+49-89-1234-0104",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (cio:Person {
      id: "hp-person-cio",
      firstName: "Michael",
      lastName: "Bauer",
      email: "michael.bauer@thermo-dynamics.de",
      department: "IT",
      role: "Chief Information Officer",
      phone: "+49-89-1234-0105",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (rdDirector:Person {
      id: "hp-person-rd-director",
      firstName: "Dr. Petra",
      lastName: "Hoffmann",
      email: "petra.hoffmann@thermo-dynamics.de",
      department: "Research & Development",
      role: "R&D Director",
      phone: "+49-89-1234-0201",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (thermalEngineer:Person {
      id: "hp-person-thermal-engineer",
      firstName: "Stefan",
      lastName: "Wagner",
      email: "stefan.wagner@thermo-dynamics.de",
      department: "Engineering",
      role: "Lead Thermal Engineer",
      phone: "+49-89-1234-0202",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (refrigerantSpecialist:Person {
      id: "hp-person-refrigerant-specialist",
      firstName: "Dr. Maria",
      lastName: "Schneider",
      email: "maria.schneider@thermo-dynamics.de",
      department: "Engineering",
      role: "Refrigerant Technology Specialist",
      phone: "+49-89-1234-0203",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (mfgDirector:Person {
      id: "hp-person-manufacturing-director",
      firstName: "Hans",
      lastName: "Richter",
      email: "hans.richter@thermo-dynamics.de",
      department: "Manufacturing",
      role: "Manufacturing Director",
      phone: "+49-89-1234-0301",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (qualityManager:Person {
      id: "hp-person-quality-manager",
      firstName: "Sabine",
      lastName: "Koch",
      email: "sabine.koch@thermo-dynamics.de",
      department: "Quality",
      role: "Quality Manager",
      phone: "+49-89-1234-0302",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (salesDirector:Person {
      id: "hp-person-sales-director",
      firstName: "Frank",
      lastName: "Zimmermann",
      email: "frank.zimmermann@thermo-dynamics.de",
      department: "Sales",
      role: "Sales Director",
      phone: "+49-89-1234-0401",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (productManager:Person {
      id: "hp-person-product-manager",
      firstName: "Julia",
      lastName: "Braun",
      email: "julia.braun@thermo-dynamics.de",
      department: "Product Management",
      role: "Product Manager",
      phone: "+49-89-1234-0402",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (serviceDirector:Person {
      id: "hp-person-service-director",
      firstName: "Markus",
      lastName: "Klein",
      email: "markus.klein@thermo-dynamics.de",
      department: "Service",
      role: "Service Director",
      phone: "+49-89-1234-0501",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (itManager:Person {
      id: "hp-person-it-manager",
      firstName: "Nicole",
      lastName: "Schulz",
      email: "nicole.schulz@thermo-dynamics.de",
      department: "IT",
      role: "IT Manager",
      phone: "+49-89-1234-0601",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (sustainabilityManager:Person {
      id: "hp-person-sustainability-manager",
      firstName: "Alexander",
      lastName: "Huber",
      email: "alexander.huber@thermo-dynamics.de",
      department: "Sustainability",
      role: "Sustainability Manager",
      phone: "+49-89-1234-0701",
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('Persons created successfully.')
}

export async function createHeatPumpCapabilityOwnership(session: Session): Promise<void> {
  console.log('Creating Capability Ownership relationships...')

  await session.run(`
    MATCH 
      (ceo:Person {id: "hp-person-ceo"}),
      (cto:Person {id: "hp-person-cto"}),
      (coo:Person {id: "hp-person-coo"}),
      (cfo:Person {id: "hp-person-cfo"}),
      (cio:Person {id: "hp-person-cio"}),
      (rdDirector:Person {id: "hp-person-rd-director"}),
      (thermalEngineer:Person {id: "hp-person-thermal-engineer"}),
      (refrigerantSpecialist:Person {id: "hp-person-refrigerant-specialist"}),
      (mfgDirector:Person {id: "hp-person-manufacturing-director"}),
      (qualityManager:Person {id: "hp-person-quality-manager"}),
      (salesDirector:Person {id: "hp-person-sales-director"}),
      (productManager:Person {id: "hp-person-product-manager"}),
      (serviceDirector:Person {id: "hp-person-service-director"}),
      (itManager:Person {id: "hp-person-it-manager"}),
      (sustainabilityManager:Person {id: "hp-person-sustainability-manager"}),

      (strategy:BusinessCapability {id: "hp-cap-strategy-management"}),
      (rd:BusinessCapability {id: "hp-cap-research-development"}),
      (manufacturing:BusinessCapability {id: "hp-cap-manufacturing"}),
      (sales:BusinessCapability {id: "hp-cap-sales-marketing"}),
      (service:BusinessCapability {id: "hp-cap-service-support"}),
      (hr:BusinessCapability {id: "hp-cap-human-resources"}),
      (finance:BusinessCapability {id: "hp-cap-finance"}),
      (it:BusinessCapability {id: "hp-cap-it"}),
      (thermalDesign:BusinessCapability {id: "hp-cap-thermal-design"}),
      (refrigerantTech:BusinessCapability {id: "hp-cap-refrigerant-tech"}),
      (smartControls:BusinessCapability {id: "hp-cap-smart-controls"}),
      (compressorMfg:BusinessCapability {id: "hp-cap-compressor-manufacturing"}),
      (heatExchangerMfg:BusinessCapability {id: "hp-cap-heat-exchanger-manufacturing"}),
      (systemAssembly:BusinessCapability {id: "hp-cap-system-assembly"}),
      (channelMgmt:BusinessCapability {id: "hp-cap-channel-management"}),
      (digitalMarketing:BusinessCapability {id: "hp-cap-digital-marketing"}),
      (productMgmt:BusinessCapability {id: "hp-cap-product-management"}),
      (installation:BusinessCapability {id: "hp-cap-installation-services"}),
      (maintenance:BusinessCapability {id: "hp-cap-maintenance-services"}),
      (remoteMonitoring:BusinessCapability {id: "hp-cap-remote-monitoring"}),
      (customerSupport:BusinessCapability {id: "hp-cap-customer-support"}),
      (supplyChain:BusinessCapability {id: "hp-cap-supply-chain"}),
      (qualityMgmt:BusinessCapability {id: "hp-cap-quality-management"}),
      (sustainability:BusinessCapability {id: "hp-cap-sustainability"}),
      (energyEfficiency:BusinessCapability {id: "hp-cap-energy-efficiency"})

    CREATE
      // CEO ownership
      (strategy)-[:OWNED_BY]->(ceo),
      
      // CTO ownership
      (rd)-[:OWNED_BY]->(cto),
      (smartControls)-[:OWNED_BY]->(cto),
      
      // COO ownership
      (manufacturing)-[:OWNED_BY]->(coo),
      (compressorMfg)-[:OWNED_BY]->(coo),
      (heatExchangerMfg)-[:OWNED_BY]->(coo),
      (systemAssembly)-[:OWNED_BY]->(coo),
      (supplyChain)-[:OWNED_BY]->(coo),
      
      // CFO ownership
      (finance)-[:OWNED_BY]->(cfo),
      
      // CIO ownership
      (it)-[:OWNED_BY]->(cio),
      
      // R&D Director ownership
      (thermalDesign)-[:OWNED_BY]->(rdDirector),
      
      // Specialist ownership
      (thermalDesign)-[:OWNED_BY]->(thermalEngineer),
      (refrigerantTech)-[:OWNED_BY]->(refrigerantSpecialist),
      
      // Manufacturing Director ownership
      (qualityMgmt)-[:OWNED_BY]->(qualityManager),
      
      // Sales Director ownership
      (sales)-[:OWNED_BY]->(salesDirector),
      (channelMgmt)-[:OWNED_BY]->(salesDirector),
      (digitalMarketing)-[:OWNED_BY]->(salesDirector),
      
      // Product Manager ownership
      (productMgmt)-[:OWNED_BY]->(productManager),
      
      // Service Director ownership
      (service)-[:OWNED_BY]->(serviceDirector),
      (installation)-[:OWNED_BY]->(serviceDirector),
      (maintenance)-[:OWNED_BY]->(serviceDirector),
      (remoteMonitoring)-[:OWNED_BY]->(serviceDirector),
      (customerSupport)-[:OWNED_BY]->(serviceDirector),
      
      // IT Manager ownership
      (remoteMonitoring)-[:OWNED_BY]->(itManager),
      
      // Sustainability Manager ownership
      (sustainability)-[:OWNED_BY]->(sustainabilityManager),
      (energyEfficiency)-[:OWNED_BY]->(sustainabilityManager)
  `)

  console.log('Capability ownership relationships created successfully.')
}
