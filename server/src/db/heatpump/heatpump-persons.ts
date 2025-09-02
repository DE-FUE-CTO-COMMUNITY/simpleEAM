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
    }),
    (hrDirector:Person {
      id: "hp-person-hr-director",
      firstName: "Brigitte",
      lastName: "Meyer",
      email: "brigitte.meyer@thermo-dynamics.de",
      department: "Human Resources",
      role: "HR Director",
      phone: "+49-89-1234-0801",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (procurementManager:Person {
      id: "hp-person-procurement-manager",
      firstName: "Lars",
      lastName: "Engel",
      email: "lars.engel@thermo-dynamics.de",
      department: "Procurement",
      role: "Procurement Manager",
      phone: "+49-89-1234-0901",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (marketingManager:Person {
      id: "hp-person-marketing-manager",
      firstName: "Claudia",
      lastName: "Neumann",
      email: "claudia.neumann@thermo-dynamics.de",
      department: "Marketing",
      role: "Marketing Manager",
      phone: "+49-89-1234-1001",
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
      (company:Company {id: "company-thermo-dynamics-ag"}),
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
      (hrDirector:Person {id: "hp-person-hr-director"}),
      (procurementManager:Person {id: "hp-person-procurement-manager"}),
      (marketingManager:Person {id: "hp-person-marketing-manager"}),

      // L1 Business Capabilities (New Structure)
      (strategy:BusinessCapability {id: "hp-cap-strategy-management"}),
      (rd:BusinessCapability {id: "hp-cap-research-development"}),
      (manufacturing:BusinessCapability {id: "hp-cap-manufacturing-operations"}),
      (salesMarketing:BusinessCapability {id: "hp-cap-sales-marketing"}),
      (service:BusinessCapability {id: "hp-cap-service-support"}),
      (businessSupport:BusinessCapability {id: "hp-cap-business-support"}),

      // L2 Strategic Capabilities
      (strategicPlanning:BusinessCapability {id: "hp-cap-strategic-planning"}),
      (corporateGovernance:BusinessCapability {id: "hp-cap-corporate-governance"}),
      (marketAnalysis:BusinessCapability {id: "hp-cap-market-analysis"}),
      (sustainability:BusinessCapability {id: "hp-cap-sustainability"}),

      // L2 R&D Capabilities
      (thermalDesign:BusinessCapability {id: "hp-cap-thermal-design"}),
      (refrigerantTech:BusinessCapability {id: "hp-cap-refrigerant-technology"}),
      (smartControls:BusinessCapability {id: "hp-cap-smart-controls"}),
      (productDevelopment:BusinessCapability {id: "hp-cap-product-development"}),
      (testing:BusinessCapability {id: "hp-cap-testing-validation"}),
      (energyEfficiency:BusinessCapability {id: "hp-cap-energy-efficiency"}),

      // L2 Manufacturing Capabilities
      (compressorMfg:BusinessCapability {id: "hp-cap-compressor-manufacturing"}),
      (heatExchangerMfg:BusinessCapability {id: "hp-cap-heat-exchanger-manufacturing"}),
      (systemAssembly:BusinessCapability {id: "hp-cap-system-assembly"}),
      (productionPlanning:BusinessCapability {id: "hp-cap-production-planning"}),
      (qualityMgmt:BusinessCapability {id: "hp-cap-quality-management"}),
      (supplyChain:BusinessCapability {id: "hp-cap-supply-chain"}),
      (warehouseMgmt:BusinessCapability {id: "hp-cap-warehouse-management"}),

      // L2 Sales & Marketing Capabilities
      (channelMgmt:BusinessCapability {id: "hp-cap-channel-management"}),
      (digitalMarketing:BusinessCapability {id: "hp-cap-digital-marketing"}),
      (productMgmt:BusinessCapability {id: "hp-cap-product-management"}),
      (salesOps:BusinessCapability {id: "hp-cap-sales-operations"}),
      (customerAnalytics:BusinessCapability {id: "hp-cap-customer-analytics"}),

      // L2 Service Capabilities
      (installation:BusinessCapability {id: "hp-cap-installation-services"}),
      (maintenance:BusinessCapability {id: "hp-cap-maintenance-services"}),
      (remoteMonitoring:BusinessCapability {id: "hp-cap-remote-monitoring"}),
      (customerSupport:BusinessCapability {id: "hp-cap-customer-support"}),
      (warranty:BusinessCapability {id: "hp-cap-warranty-management"}),

      // L2 Business Support Capabilities
      (hr:BusinessCapability {id: "hp-cap-human-resources"}),
      (talentManagement:BusinessCapability {id: "hp-cap-talent-management"}),
      (finance:BusinessCapability {id: "hp-cap-finance"}),
      (financialPlanning:BusinessCapability {id: "hp-cap-financial-planning"}),
      (accounting:BusinessCapability {id: "hp-cap-accounting-reporting"}),
      (it:BusinessCapability {id: "hp-cap-information-technology"}),
      (applicationMgmt:BusinessCapability {id: "hp-cap-application-management"}),
      (infrastructureMgmt:BusinessCapability {id: "hp-cap-infrastructure-management"}),
      (legal:BusinessCapability {id: "hp-cap-legal-compliance"})

    CREATE
      // L1 Capability Ownership
      (strategy)-[:OWNED_BY]->(ceo),
      (rd)-[:OWNED_BY]->(cto),
      (manufacturing)-[:OWNED_BY]->(coo),
      (salesMarketing)-[:OWNED_BY]->(salesDirector),
      (service)-[:OWNED_BY]->(serviceDirector),
      (businessSupport)-[:OWNED_BY]->(cio),
      
      // L2 Strategic Capabilities
      (strategicPlanning)-[:OWNED_BY]->(ceo),
      (corporateGovernance)-[:OWNED_BY]->(ceo),
      (marketAnalysis)-[:OWNED_BY]->(marketingManager),
      (sustainability)-[:OWNED_BY]->(sustainabilityManager),
      
      // L2 R&D Capabilities
      (thermalDesign)-[:OWNED_BY]->(thermalEngineer),
      (refrigerantTech)-[:OWNED_BY]->(refrigerantSpecialist),
      (smartControls)-[:OWNED_BY]->(rdDirector),
      (productDevelopment)-[:OWNED_BY]->(rdDirector),
      (testing)-[:OWNED_BY]->(qualityManager),
      (energyEfficiency)-[:OWNED_BY]->(sustainabilityManager),
      
      // L2 Manufacturing Capabilities
      (compressorMfg)-[:OWNED_BY]->(mfgDirector),
      (heatExchangerMfg)-[:OWNED_BY]->(mfgDirector),
      (systemAssembly)-[:OWNED_BY]->(mfgDirector),
      (productionPlanning)-[:OWNED_BY]->(mfgDirector),
      (qualityMgmt)-[:OWNED_BY]->(qualityManager),
      (supplyChain)-[:OWNED_BY]->(procurementManager),
      (warehouseMgmt)-[:OWNED_BY]->(procurementManager),
      
      // L2 Sales & Marketing Capabilities
      (channelMgmt)-[:OWNED_BY]->(salesDirector),
      (digitalMarketing)-[:OWNED_BY]->(marketingManager),
      (productMgmt)-[:OWNED_BY]->(productManager),
      (salesOps)-[:OWNED_BY]->(salesDirector),
      (customerAnalytics)-[:OWNED_BY]->(marketingManager),
      
      // L2 Service Capabilities
      (installation)-[:OWNED_BY]->(serviceDirector),
      (maintenance)-[:OWNED_BY]->(serviceDirector),
      (remoteMonitoring)-[:OWNED_BY]->(itManager),
      (customerSupport)-[:OWNED_BY]->(serviceDirector),
      (warranty)-[:OWNED_BY]->(serviceDirector),
      
      // L2 Business Support Capabilities
      (hr)-[:OWNED_BY]->(hrDirector),
      (talentManagement)-[:OWNED_BY]->(hrDirector),
      (finance)-[:OWNED_BY]->(cfo),
      (financialPlanning)-[:OWNED_BY]->(cfo),
      (accounting)-[:OWNED_BY]->(cfo),
      (it)-[:OWNED_BY]->(cio),
      (applicationMgmt)-[:OWNED_BY]->(cio),
      (infrastructureMgmt)-[:OWNED_BY]->(itManager),
      (legal)-[:OWNED_BY]->(cio),
      
      // Company ownership for all capabilities (L1)
      (strategy)-[:OWNED_BY]->(company),
      (rd)-[:OWNED_BY]->(company),
      (manufacturing)-[:OWNED_BY]->(company),
      (salesMarketing)-[:OWNED_BY]->(company),
      (service)-[:OWNED_BY]->(company),
      (businessSupport)-[:OWNED_BY]->(company),
      
      // Company ownership for all capabilities (L2)
      (strategicPlanning)-[:OWNED_BY]->(company),
      (corporateGovernance)-[:OWNED_BY]->(company),
      (marketAnalysis)-[:OWNED_BY]->(company),
      (sustainability)-[:OWNED_BY]->(company),
      (thermalDesign)-[:OWNED_BY]->(company),
      (refrigerantTech)-[:OWNED_BY]->(company),
      (smartControls)-[:OWNED_BY]->(company),
      (productDevelopment)-[:OWNED_BY]->(company),
      (testing)-[:OWNED_BY]->(company),
      (energyEfficiency)-[:OWNED_BY]->(company),
      (compressorMfg)-[:OWNED_BY]->(company),
      (heatExchangerMfg)-[:OWNED_BY]->(company),
      (systemAssembly)-[:OWNED_BY]->(company),
      (productionPlanning)-[:OWNED_BY]->(company),
      (qualityMgmt)-[:OWNED_BY]->(company),
      (supplyChain)-[:OWNED_BY]->(company),
      (warehouseMgmt)-[:OWNED_BY]->(company),
      (channelMgmt)-[:OWNED_BY]->(company),
      (digitalMarketing)-[:OWNED_BY]->(company),
      (productMgmt)-[:OWNED_BY]->(company),
      (salesOps)-[:OWNED_BY]->(company),
      (customerAnalytics)-[:OWNED_BY]->(company),
      (installation)-[:OWNED_BY]->(company),
      (maintenance)-[:OWNED_BY]->(company),
      (remoteMonitoring)-[:OWNED_BY]->(company),
      (customerSupport)-[:OWNED_BY]->(company),
      (warranty)-[:OWNED_BY]->(company),
      (hr)-[:OWNED_BY]->(company),
      (talentManagement)-[:OWNED_BY]->(company),
      (finance)-[:OWNED_BY]->(company),
      (financialPlanning)-[:OWNED_BY]->(company),
      (accounting)-[:OWNED_BY]->(company),
      (it)-[:OWNED_BY]->(company),
      (applicationMgmt)-[:OWNED_BY]->(company),
      (infrastructureMgmt)-[:OWNED_BY]->(company),
      (legal)-[:OWNED_BY]->(company)
  `)

  console.log('Capability ownership relationships created successfully.')
}
