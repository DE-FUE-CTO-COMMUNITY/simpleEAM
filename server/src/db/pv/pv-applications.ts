// Applications for Solar Panel Manufacturing Company
// Mix of commercial off-the-shelf software and custom-developed applications

import { Session } from 'neo4j-driver'

export async function createApplications(session: Session) {
  console.log('Creating Applications for Solar Panel Manufacturing...')

  await session.run(`
    CREATE 
    // ===== ENTERPRISE RESOURCE PLANNING =====
    (sap_s4hana:Application {
      id: "app-sap-s4hana",
      name: "SAP S/4HANA",
      description: "Enterprise Resource Planning system for finance, procurement, and operations",
      status: "ACTIVE",
      criticality: "CRITICAL",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["SAP HANA", "ABAP", "Fiori"],
      version: "2023 FPS02",
      hostingEnvironment: "AWS Cloud",
      vendor: "SAP",
      costs: 850000.00,
      introductionDate: date("2022-01-15"),
      planningDate: date("2021-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== CUSTOMER RELATIONSHIP MANAGEMENT =====
    (salesforce_crm:Application {
      id: "app-salesforce-crm",
      name: "Salesforce Sales Cloud",
      description: "Customer relationship management and sales automation platform",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Salesforce Platform", "Apex", "Lightning"],
      version: "Summer 2024",
      hostingEnvironment: "Salesforce Cloud",
      vendor: "Salesforce",
      costs: 120000.00,
      introductionDate: date("2021-03-01"),
      planningDate: date("2020-10-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== MANUFACTURING EXECUTION SYSTEM =====
    (mes_system:Application {
      id: "app-mes-solar",
      name: "Solar MES Platform",
      description: "Custom manufacturing execution system for solar panel production",
      status: "ACTIVE",
      criticality: "CRITICAL",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Node.js", "React", "PostgreSQL", "Docker", "Kubernetes"],
      version: "3.2.1",
      hostingEnvironment: "AWS EKS",
      vendor: "In-house Development",
      costs: 450000.00,
      introductionDate: date("2023-06-01"),
      planningDate: date("2022-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== QUALITY MANAGEMENT SYSTEM =====
    (quality_system:Application {
      id: "app-quality-solar",
      name: "Solar Quality Management System",
      description: "Custom quality management and testing system for solar panels",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Python", "Django", "PostgreSQL", "InfluxDB", "Grafana"],
      version: "2.8.5",
      hostingEnvironment: "AWS ECS",
      vendor: "In-house Development",
      costs: 280000.00,
      introductionDate: date("2022-09-15"),
      planningDate: date("2021-11-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== SUPPLY CHAIN MANAGEMENT =====
    (oracle_scm:Application {
      id: "app-oracle-scm",
      name: "Oracle Supply Chain Management",
      description: "Supply chain planning and procurement management",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "TOLERATE",
      sevenRStrategy: "REPLATFORM",
      technologyStack: ["Oracle Cloud", "Java", "Oracle Database"],
      version: "23C",
      hostingEnvironment: "Oracle Cloud",
      vendor: "Oracle",
      costs: 320000.00,
      introductionDate: date("2020-08-01"),
      planningDate: date("2019-12-01"),
      endOfLifeDate: date("2026-12-31"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== RESEARCH & DEVELOPMENT =====
    (rd_platform:Application {
      id: "app-rd-platform",
      name: "R&D Innovation Platform",
      description: "Custom platform for research data management and collaboration",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Python", "FastAPI", "MongoDB", "Apache Kafka", "Jupyter"],
      version: "1.4.2",
      hostingEnvironment: "AWS EKS",
      vendor: "In-house Development",
      costs: 180000.00,
      introductionDate: date("2023-02-01"),
      planningDate: date("2022-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== HUMAN RESOURCES =====
    (workday_hr:Application {
      id: "app-workday-hr",
      name: "Workday HCM",
      description: "Human capital management and HR processes",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Workday Platform", "Cloud Native"],
      version: "2024R1",
      hostingEnvironment: "Workday Cloud",
      vendor: "Workday",
      costs: 95000.00,
      introductionDate: date("2021-07-01"),
      planningDate: date("2021-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== MARKETING AUTOMATION =====
    (hubspot_marketing:Application {
      id: "app-hubspot-marketing",
      name: "HubSpot Marketing Hub",
      description: "Marketing automation and lead generation platform",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["HubSpot Platform", "JavaScript", "APIs"],
      version: "Professional",
      hostingEnvironment: "HubSpot Cloud",
      vendor: "HubSpot",
      costs: 48000.00,
      introductionDate: date("2020-11-01"),
      planningDate: date("2020-08-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== CUSTOMER SERVICE =====
    (zendesk_service:Application {
      id: "app-zendesk-service",
      name: "Zendesk Support",
      description: "Customer service and support ticket management",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Zendesk Platform", "APIs", "Webhooks"],
      version: "Suite Professional",
      hostingEnvironment: "Zendesk Cloud",
      vendor: "Zendesk",
      costs: 36000.00,
      introductionDate: date("2020-05-01"),
      planningDate: date("2020-02-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== WAREHOUSE MANAGEMENT =====
    (wms_system:Application {
      id: "app-wms-manhattan",
      name: "Manhattan WMS",
      description: "Warehouse management system for inventory and logistics",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "TOLERATE",
      sevenRStrategy: "REPLATFORM",
      technologyStack: ["Java", "Oracle Database", "Windows Server"],
      version: "2020.1",
      hostingEnvironment: "On-Premise",
      vendor: "Manhattan Associates",
      costs: 240000.00,
      introductionDate: date("2019-04-01"),
      planningDate: date("2018-09-01"),
      endOfLifeDate: date("2025-12-31"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== BUSINESS INTELLIGENCE =====
    (power_bi:Application {
      id: "app-power-bi",
      name: "Microsoft Power BI",
      description: "Business intelligence and analytics platform",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Power BI Service", "DAX", "Power Query"],
      version: "Premium P1",
      hostingEnvironment: "Microsoft Cloud",
      vendor: "Microsoft",
      costs: 24000.00,
      introductionDate: date("2021-09-01"),
      planningDate: date("2021-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== PRODUCT LIFECYCLE MANAGEMENT =====
    (siemens_plm:Application {
      id: "app-siemens-plm",
      name: "Siemens Teamcenter",
      description: "Product lifecycle management for solar panel designs",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Teamcenter", "Oracle Database", "Windows Server"],
      version: "14.3",
      hostingEnvironment: "On-Premise",
      vendor: "Siemens",
      costs: 380000.00,
      introductionDate: date("2021-01-15"),
      planningDate: date("2020-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== LEGACY SYSTEM (TO BE RETIRED) =====
        (legacy_erp:Application {
      id: "app-legacy-erp",
      name: "Legacy ERP System",
      description: "Legacy enterprise resource planning system being phased out",
      status: "RETIRED",
      criticality: "LOW",
      timeCategory: "ELIMINATE",
      sevenRStrategy: "RETIRE",
      technologyStack: ["COBOL", "DB2", "mainframe"],
      version: "8.2",
      hostingEnvironment: "On-Premise Mainframe",
      vendor: "Internal",
      costs: 0.00,
      introductionDate: date("2005-01-01"),
      endOfLifeDate: date("2022-12-31"),
      endOfUseDate: date("2022-12-31"),
      planningDate: date("2004-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== IT SERVICE MANAGEMENT =====
    (servicenow:Application {
      id: "app-servicenow",
      name: "ServiceNow ITSM",
      description: "IT Service Management platform for service desk, incident, and change management",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["ServiceNow Platform", "JavaScript", "REST APIs"],
      version: "Vancouver",
      hostingEnvironment: "ServiceNow Cloud",
      vendor: "ServiceNow",
      costs: 180000.00,
      introductionDate: date("2023-02-01"),
      planningDate: date("2022-08-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== EXPENSE MANAGEMENT =====
    (concur:Application {
      id: "app-concur",
      name: "SAP Concur",
      description: "Travel and expense management solution",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["SAP Concur Platform", "APIs"],
      version: "Standard",
      hostingEnvironment: "SAP Cloud",
      vendor: "SAP",
      costs: 24000.00,
      introductionDate: date("2022-05-01"),
      planningDate: date("2022-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== TRAINING MANAGEMENT =====
    (cornerstone:Application {
      id: "app-cornerstone-lms",
      name: "Cornerstone OnDemand",
      description: "Learning management system for employee and customer training",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Cornerstone Platform", "APIs", "SCORM"],
      version: "Q3 2024",
      hostingEnvironment: "Cornerstone Cloud",
      vendor: "Cornerstone OnDemand",
      costs: 72000.00,
      introductionDate: date("2021-09-01"),
      planningDate: date("2021-04-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== FINANCIAL CONSOLIDATION =====
    (hyperion:Application {
      id: "app-oracle-hyperion",
      name: "Oracle Hyperion",
      description: "Financial planning, budgeting, and consolidation",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "TOLERATE",
      sevenRStrategy: "REPLATFORM",
      technologyStack: ["Oracle Hyperion", "Essbase", "Oracle Database"],
      version: "11.2.11",
      hostingEnvironment: "On-Premise",
      vendor: "Oracle",
      costs: 150000.00,
      introductionDate: date("2019-03-01"),
      planningDate: date("2018-08-01"),
      endOfLifeDate: date("2026-06-30"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('Applications created successfully.')
}

export async function createApplicationOwnership(session: Session) {
  console.log('Creating Application Ownership relationships...')

  await session.run(`
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (cfo:Person {id: "person-cfo"})
    MATCH (cio:Person {id: "person-cio"})
    CREATE (sap_s4hana)-[:OWNED_BY]->(cfo)
    CREATE (sap_s4hana)-[:OWNED_BY]->(cio)
  `)

  await session.run(`
    MATCH (salesforce_crm:Application {id: "app-salesforce-crm"})
    MATCH (dir_sales:Person {id: "person-dir-sales"})
    CREATE (salesforce_crm)-[:OWNED_BY]->(dir_sales)
  `)

  await session.run(`
    MATCH (mes_system:Application {id: "app-mes-solar"})
    MATCH (dir_manufacturing:Person {id: "person-dir-manufacturing"})
    CREATE (mes_system)-[:OWNED_BY]->(dir_manufacturing)
  `)

  await session.run(`
    MATCH (quality_system:Application {id: "app-quality-solar"})
    MATCH (dir_quality:Person {id: "person-dir-quality"})
    CREATE (quality_system)-[:OWNED_BY]->(dir_quality)
  `)

  await session.run(`
    MATCH (oracle_scm:Application {id: "app-oracle-scm"})
    MATCH (vp_supply_chain:Person {id: "person-vp-supply-chain"})
    CREATE (oracle_scm)-[:OWNED_BY]->(vp_supply_chain)
  `)

  await session.run(`
    MATCH (rd_platform:Application {id: "app-rd-platform"})
    MATCH (vp_rd:Person {id: "person-vp-rd"})
    CREATE (rd_platform)-[:OWNED_BY]->(vp_rd)
  `)

  await session.run(`
    MATCH (workday_hr:Application {id: "app-workday-hr"})
    MATCH (dir_hr:Person {id: "person-dir-hr"})
    CREATE (workday_hr)-[:OWNED_BY]->(dir_hr)
  `)

  await session.run(`
    MATCH (hubspot_marketing:Application {id: "app-hubspot-marketing"})
    MATCH (dir_marketing:Person {id: "person-dir-marketing"})
    CREATE (hubspot_marketing)-[:OWNED_BY]->(dir_marketing)
  `)

  await session.run(`
    MATCH (zendesk_service:Application {id: "app-zendesk-service"})
    MATCH (dir_cs:Person {id: "person-dir-cs"})
    CREATE (zendesk_service)-[:OWNED_BY]->(dir_cs)
  `)

  await session.run(`
    MATCH (wms_system:Application {id: "app-wms-manhattan"})
    MATCH (vp_supply_chain:Person {id: "person-vp-supply-chain"})
    CREATE (wms_system)-[:OWNED_BY]->(vp_supply_chain)
  `)

  await session.run(`
    MATCH (power_bi:Application {id: "app-power-bi"})
    MATCH (cio:Person {id: "person-cio"})
    CREATE (power_bi)-[:OWNED_BY]->(cio)
  `)

  await session.run(`
    MATCH (siemens_plm:Application {id: "app-siemens-plm"})
    MATCH (vp_rd:Person {id: "person-vp-rd"})
    CREATE (siemens_plm)-[:OWNED_BY]->(vp_rd)
  `)

  await session.run(`
    MATCH (legacy_erp:Application {id: "app-legacy-erp"})
    MATCH (cio:Person {id: "person-cio"})
    CREATE (legacy_erp)-[:OWNED_BY]->(cio)
  `)

  await session.run(`
    MATCH (servicenow:Application {id: "app-servicenow"})
    MATCH (cio:Person {id: "person-cio"})
    CREATE (servicenow)-[:OWNED_BY]->(cio)
  `)

  await session.run(`
    MATCH (concur:Application {id: "app-concur"})
    MATCH (cfo:Person {id: "person-cfo"})
    CREATE (concur)-[:OWNED_BY]->(cfo)
  `)

  await session.run(`
    MATCH (cornerstone:Application {id: "app-cornerstone-lms"})
    MATCH (dir_hr:Person {id: "person-dir-hr"})
    CREATE (cornerstone)-[:OWNED_BY]->(dir_hr)
  `)

  await session.run(`
    MATCH (hyperion:Application {id: "app-oracle-hyperion"})
    MATCH (cfo:Person {id: "person-cfo"})
    CREATE (hyperion)-[:OWNED_BY]->(cfo)
  `)

  console.log('Application ownership relationships created successfully.')
}
