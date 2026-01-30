// Persons for Solar Panel Manufacturing Company
// Key stakeholders and owners for capabilities and applications

import { Session } from 'neo4j-driver'

export async function createPersons(session: Session) {
  console.log('Creating Persons for Solar Panel Manufacturing...')

  await session.run(`
    CREATE 
    (ceo:Person {
      id: "person-ceo",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@solarpanel.com",
      department: "Executive",
      role: "Chief Executive Officer",
      phone: "+1-555-0101",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (cto:Person {
      id: "person-cto",
      firstName: "Dr. Michael",
      lastName: "Chen",
      email: "michael.chen@solarpanel.com",
      department: "Technology",
      role: "Chief Technology Officer",
      phone: "+1-555-0102",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (coo:Person {
      id: "person-coo",
      firstName: "Jennifer",
      lastName: "Williams",
      email: "jennifer.williams@solarpanel.com",
      department: "Operations",
      role: "Chief Operating Officer",
      phone: "+1-555-0103",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (cfo:Person {
      id: "person-cfo",
      firstName: "Robert",
      lastName: "Davis",
      email: "robert.davis@solarpanel.com",
      department: "Finance",
      role: "Chief Financial Officer",
      phone: "+1-555-0104",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (vp_rd:Person {
      id: "person-vp-rd",
      firstName: "Dr. Lisa",
      lastName: "Anderson",
      email: "lisa.anderson@solarpanel.com",
      department: "Research & Development",
      role: "VP Research & Development",
      phone: "+1-555-0201",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (dir_manufacturing:Person {
      id: "person-dir-manufacturing",
      firstName: "James",
      lastName: "Thompson",
      email: "james.thompson@solarpanel.com",
      department: "Manufacturing",
      role: "Director of Manufacturing",
      phone: "+1-555-0301",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (vp_supply_chain:Person {
      id: "person-vp-supply-chain",
      firstName: "Maria",
      lastName: "Rodriguez",
      email: "maria.rodriguez@solarpanel.com",
      department: "Supply Chain",
      role: "VP Supply Chain",
      phone: "+1-555-0401",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (dir_sales:Person {
      id: "person-dir-sales",
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@solarpanel.com",
      department: "Sales",
      role: "Director of Sales",
      phone: "+1-555-0501",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (dir_marketing:Person {
      id: "person-dir-marketing",
      firstName: "Emily",
      lastName: "Brown",
      email: "emily.brown@solarpanel.com",
      department: "Marketing",
      role: "Director of Marketing",
      phone: "+1-555-0502",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (dir_quality:Person {
      id: "person-dir-quality",
      firstName: "Dr. Thomas",
      lastName: "Miller",
      email: "thomas.miller@solarpanel.com",
      department: "Quality",
      role: "Director of Quality",
      phone: "+1-555-0601",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (dir_cs:Person {
      id: "person-dir-cs",
      firstName: "Amanda",
      lastName: "Taylor",
      email: "amanda.taylor@solarpanel.com",
      department: "Customer Service",
      role: "Director of Customer Service",
      phone: "+1-555-0701",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (dir_hr:Person {
      id: "person-dir-hr",
      firstName: "Kevin",
      lastName: "Jones",
      email: "kevin.jones@solarpanel.com",
      department: "Human Resources",
      role: "Director of HR",
      phone: "+1-555-0801",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (cio:Person {
      id: "person-cio",
      firstName: "Sandra",
      lastName: "Garcia",
      email: "sandra.garcia@solarpanel.com",
      department: "IT",
      role: "Chief Information Officer",
      phone: "+1-555-0901",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (it_manager:Person {
      id: "person-it-manager",
      firstName: "Mark",
      lastName: "Lee",
      email: "mark.lee@solarpanel.com",
      department: "IT",
      role: "IT Infrastructure Manager",
      phone: "+1-555-0902",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (enterprise_architect:Person {
      id: "person-enterprise-architect",
      firstName: "Dr. Rachel",
      lastName: "White",
      email: "rachel.white@solarpanel.com",
      department: "IT",
      role: "Enterprise Architect",
      phone: "+1-555-0903",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (data_scientist:Person {
      id: "person-data-scientist",
      firstName: "Dr. Alex",
      lastName: "Chen",
      email: "alex.chen@solarpanel.com",
      department: "Data Science",
      role: "Lead Data Scientist",
      phone: "+1-555-1001",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (ml_engineer:Person {
      id: "person-ml-engineer",
      firstName: "Sarah",
      lastName: "Kumar",
      email: "sarah.kumar@solarpanel.com",
      department: "Data Science",
      role: "ML Engineer",
      phone: "+1-555-1002",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (ai_product_manager:Person {
      id: "person-ai-product-manager",
      firstName: "Michael",
      lastName: "Taylor",
      email: "michael.taylor@solarpanel.com",
      department: "Product Management",
      role: "AI Product Manager",
      phone: "+1-555-1003",
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('Persons created successfully.')
}

export async function createCapabilityOwnership(session: Session) {
  console.log('Creating Capability Ownership relationships...')

  // Level 1 capability ownership
  await session.run(`
    MATCH (research:BusinessCapability {id: "cap-research-development"})
    MATCH (vp_rd:Person {id: "person-vp-rd"})
    CREATE (research)-[:OWNED_BY]->(vp_rd)
  `)

  await session.run(`
    MATCH (manufacturing:BusinessCapability {id: "cap-manufacturing"})
    MATCH (dir_manufacturing:Person {id: "person-dir-manufacturing"})
    CREATE (manufacturing)-[:OWNED_BY]->(dir_manufacturing)
  `)

  await session.run(`
    MATCH (supply_chain:BusinessCapability {id: "cap-supply-chain"})
    MATCH (vp_supply_chain:Person {id: "person-vp-supply-chain"})
    CREATE (supply_chain)-[:OWNED_BY]->(vp_supply_chain)
  `)

  await session.run(`
    MATCH (sales_marketing:BusinessCapability {id: "cap-sales-marketing"})
    MATCH (dir_sales:Person {id: "person-dir-sales"})
    MATCH (dir_marketing:Person {id: "person-dir-marketing"})
    CREATE (sales_marketing)-[:OWNED_BY]->(dir_sales)
    CREATE (sales_marketing)-[:OWNED_BY]->(dir_marketing)
  `)

  await session.run(`
    MATCH (customer_service:BusinessCapability {id: "cap-customer-service"})
    MATCH (dir_cs:Person {id: "person-dir-cs"})
    CREATE (customer_service)-[:OWNED_BY]->(dir_cs)
  `)

  await session.run(`
    MATCH (quality_mgmt:BusinessCapability {id: "cap-quality-management"})
    MATCH (dir_quality:Person {id: "person-dir-quality"})
    CREATE (quality_mgmt)-[:OWNED_BY]->(dir_quality)
  `)

  await session.run(`
    MATCH (finance_accounting:BusinessCapability {id: "cap-finance-accounting"})
    MATCH (cfo:Person {id: "person-cfo"})
    CREATE (finance_accounting)-[:OWNED_BY]->(cfo)
  `)

  await session.run(`
    MATCH (hr_management:BusinessCapability {id: "cap-hr-management"})
    MATCH (dir_hr:Person {id: "person-dir-hr"})
    CREATE (hr_management)-[:OWNED_BY]->(dir_hr)
  `)

  await session.run(`
    MATCH (it_management:BusinessCapability {id: "cap-it-management"})
    MATCH (cio:Person {id: "person-cio"})
    CREATE (it_management)-[:OWNED_BY]->(cio)
  `)

  // Level 2 capability ownership
  await session.run(`
    MATCH (product_innovation:BusinessCapability {id: "cap-product-innovation"})
    MATCH (materials_research:BusinessCapability {id: "cap-materials-research"})
    MATCH (prototype_testing:BusinessCapability {id: "cap-prototype-testing"})
    MATCH (vp_rd:Person {id: "person-vp-rd"})
    CREATE (product_innovation)-[:OWNED_BY]->(vp_rd)
    CREATE (materials_research)-[:OWNED_BY]->(vp_rd)
    CREATE (prototype_testing)-[:OWNED_BY]->(vp_rd)
  `)

  await session.run(`
    MATCH (cell_production:BusinessCapability {id: "cap-cell-production"})
    MATCH (module_assembly:BusinessCapability {id: "cap-module-assembly"})
    MATCH (packaging_shipping:BusinessCapability {id: "cap-packaging-shipping"})
    MATCH (dir_manufacturing:Person {id: "person-dir-manufacturing"})
    CREATE (cell_production)-[:OWNED_BY]->(dir_manufacturing)
    CREATE (module_assembly)-[:OWNED_BY]->(dir_manufacturing)
    CREATE (packaging_shipping)-[:OWNED_BY]->(dir_manufacturing)
  `)

  await session.run(`
    MATCH (supplier_mgmt:BusinessCapability {id: "cap-supplier-management"})
    MATCH (procurement:BusinessCapability {id: "cap-procurement"})
    MATCH (inventory_mgmt:BusinessCapability {id: "cap-inventory-management"})
    MATCH (vp_supply_chain:Person {id: "person-vp-supply-chain"})
    CREATE (supplier_mgmt)-[:OWNED_BY]->(vp_supply_chain)
    CREATE (procurement)-[:OWNED_BY]->(vp_supply_chain)
    CREATE (inventory_mgmt)-[:OWNED_BY]->(vp_supply_chain)
  `)

  await session.run(`
    MATCH (lead_generation:BusinessCapability {id: "cap-lead-generation"})
    MATCH (dir_marketing:Person {id: "person-dir-marketing"})
    CREATE (lead_generation)-[:OWNED_BY]->(dir_marketing)
  `)

  await session.run(`
    MATCH (sales_execution:BusinessCapability {id: "cap-sales-execution"})
    MATCH (channel_mgmt:BusinessCapability {id: "cap-channel-management"})
    MATCH (dir_sales:Person {id: "person-dir-sales"})
    CREATE (sales_execution)-[:OWNED_BY]->(dir_sales)
    CREATE (channel_mgmt)-[:OWNED_BY]->(dir_sales)
  `)

  await session.run(`
    MATCH (incoming_inspection:BusinessCapability {id: "cap-incoming-inspection"})
    MATCH (production_testing:BusinessCapability {id: "cap-production-testing"})
    MATCH (certification_compliance:BusinessCapability {id: "cap-certification-compliance"})
    MATCH (dir_quality:Person {id: "person-dir-quality"})
    CREATE (incoming_inspection)-[:OWNED_BY]->(dir_quality)
    CREATE (production_testing)-[:OWNED_BY]->(dir_quality)
    CREATE (certification_compliance)-[:OWNED_BY]->(dir_quality)
  `)

  console.log('Capability ownership relationships created successfully.')
}
