import { neo4jDriver, closeDriver } from './neo4j-client'
import { Session } from 'neo4j-driver'

/**
 * Deletes all data from the database
 */
async function clearDatabase(session: Session) {
  try {
    // Delete all nodes and relationships
    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `)
  } catch (error) {
    console.error('Error deleting data:', error)
    throw error
  }
}

/**
 * Initialisiert die Neo4j-Datenbank mit Constraints und Indizes
 */
async function initDatabase(reset: boolean = false) {
  const session = neo4jDriver.session()
  try {
    // If reset=true, delete all data first
    if (reset) {
      await clearDatabase(session)
    }

    // Constraints for Business Capabilities
    await session.run(`
      CREATE CONSTRAINT business_capability_id_unique IF NOT EXISTS
      FOR (c:BusinessCapability) REQUIRE c.id IS UNIQUE
    `)

    // Constraints for Applications
    await session.run(`
      CREATE CONSTRAINT application_id_unique IF NOT EXISTS
      FOR (a:Application) REQUIRE a.id IS UNIQUE
    `)

    // Constraints for Data Objects
    await session.run(`
      CREATE CONSTRAINT data_object_id_unique IF NOT EXISTS
      FOR (d:DataObject) REQUIRE d.id IS UNIQUE
    `)

    // Constraints for Application Interfaces
    await session.run(`
      CREATE CONSTRAINT application_interface_id_unique IF NOT EXISTS
      FOR (i:ApplicationInterface) REQUIRE i.id IS UNIQUE
    `)

    // Constraints for Persons
    await session.run(`
      CREATE CONSTRAINT person_id_unique IF NOT EXISTS
      FOR (p:Person) REQUIRE p.id IS UNIQUE
    `)

    // Constraints for Infrastructure
    await session.run(`
      CREATE CONSTRAINT infrastructure_id_unique IF NOT EXISTS
      FOR (inf:Infrastructure) REQUIRE inf.id IS UNIQUE
    `)

    // Indexes for search
    await session.run(`
      CREATE INDEX business_capability_name_index IF NOT EXISTS
      FOR (c:BusinessCapability) ON (c.name)
    `)

    await session.run(`
      CREATE INDEX application_name_index IF NOT EXISTS
      FOR (a:Application) ON (a.name)
    `)

    await session.run(`
      CREATE INDEX data_object_name_index IF NOT EXISTS
      FOR (d:DataObject) ON (d.name)
    `)

    await session.run(`
      CREATE INDEX infrastructure_name_index IF NOT EXISTS
      FOR (inf:Infrastructure) ON (inf.name)
    `)

    // Optional: Insert test data if database is empty
    const result = await session.run('MATCH (n) RETURN count(n) AS nodeCount')
    const nodeCount = result.records[0].get('nodeCount').toNumber()

    if (nodeCount === 0 && process.env.NODE_ENV !== 'production') {
      await createSampleData(session)
    } else {
      console.log(`Database already contains ${nodeCount} nodes. Skipping test data creation.`)
    }
  } catch (error) {
    console.error('Error during database initialization:', error)
    throw error
  } finally {
    await session.close()
  }
}

/**
 * Erstellt umfassende Testdaten in der Datenbank
 */
async function createSampleData(session: Session) {
  try {
    console.log('Erstelle Personen...')
    // Personen erstellen
    await session.run(`
      CREATE 
      (p1:Person {
        id: "person-001",
        firstName: "Max",
        lastName: "Mustermann",
        email: "max.mustermann@example.com",
        department: "IT-Architektur",
        role: "Senior Enterprise Architect",
        phone: "+49 89 12345-101",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (p2:Person {
        id: "person-002",
        firstName: "Anna",
        lastName: "Schmidt",
        email: "anna.schmidt@example.com",
        department: "IT-Entwicklung",
        role: "Application Manager",
        phone: "+49 89 12345-102",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (p3:Person {
        id: "person-003",
        firstName: "Thomas",
        lastName: "Müller",
        email: "thomas.mueller@example.com",
        department: "Vertrieb",
        role: "Vertriebsleiter",
        phone: "+49 89 12345-103",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (p4:Person {
        id: "person-004",
        firstName: "Sarah",
        lastName: "Weber",
        email: "sarah.weber@example.com",
        department: "Marketing",
        role: "Marketing Managerin",
        phone: "+49 89 12345-104",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (p5:Person {
        id: "person-005",
        firstName: "Michael",
        lastName: "Fischer",
        email: "michael.fischer@example.com",
        department: "Kundenservice",
        role: "Support Manager",
        phone: "+49 89 12345-105",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (p6:Person {
        id: "person-006",
        firstName: "Julia",
        lastName: "Wagner",
        email: "julia.wagner@example.com",
        department: "Datenmanagement",
        role: "Data Architect",
        phone: "+49 89 12345-106",
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    console.log('Erstelle Business Capabilities...')
    // Business Capabilities erstellen (18+ Capabilities)
    await session.run(`
      CREATE 
      (c1:BusinessCapability {
        id: "bc-001",
        name: "Kundenmanagement",
        description: "Verwaltung und Betreuung von Kundenbeziehungen",
        maturityLevel: 4,
        status: "ACTIVE",
        businessValue: 9,
        tags: ["Kunde", "CRM", "Beziehung"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c2:BusinessCapability {
        id: "bc-002",
        name: "Produktentwicklung",
        description: "Entwicklung und Innovation neuer Produkte",
        maturityLevel: 3,
        status: "ACTIVE",
        businessValue: 8,
        tags: ["Produkt", "Innovation", "F&E"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c3:BusinessCapability {
        id: "bc-003",
        name: "Marketing & Vertrieb",
        description: "Vermarktung und Verkauf von Produkten",
        maturityLevel: 4,
        status: "ACTIVE",
        businessValue: 9,
        tags: ["Marketing", "Vertrieb", "Sales"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c4:BusinessCapability {
        id: "bc-004",
        name: "Kundensupport",
        description: "Technischer und funktionaler Support für Kunden",
        maturityLevel: 5,
        status: "ACTIVE",
        businessValue: 8,
        tags: ["Support", "Service", "Helpdesk"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c5:BusinessCapability {
        id: "bc-005",
        name: "Finanzverwaltung",
        description: "Finanzplanung und Budgetierung",
        maturityLevel: 4,
        status: "ACTIVE",
        businessValue: 10,
        tags: ["Finanzen", "Controlling", "Budget"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c6:BusinessCapability {
        id: "bc-006",
        name: "Personalwesen",
        description: "Personalmanagement und HR-Prozesse",
        maturityLevel: 3,
        status: "ACTIVE",
        businessValue: 7,
        tags: ["HR", "Personal", "Recruiting"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c7:BusinessCapability {
        id: "bc-007",
        name: "Qualitätsmanagement",
        description: "Sicherstellung von Qualitätsstandards",
        maturityLevel: 4,
        status: "ACTIVE",
        businessValue: 8,
        tags: ["Qualität", "Standards", "Prozesse"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c8:BusinessCapability {
        id: "bc-008",
        name: "Datenanalyse",
        description: "Business Intelligence und Datenanalyse",
        maturityLevel: 3,
        status: "PLANNED",
        businessValue: 9,
        tags: ["BI", "Analytics", "Daten"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c9:BusinessCapability {
        id: "bc-009",
        name: "IT-Service Management",
        description: "Verwaltung von IT-Services und -Infrastruktur",
        maturityLevel: 4,
        status: "ACTIVE",
        businessValue: 8,
        tags: ["ITSM", "Infrastructure", "Services"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c10:BusinessCapability {
        id: "bc-010",
        name: "Compliance & Governance",
        description: "Einhaltung von Vorschriften und Governance",
        maturityLevel: 3,
        status: "ACTIVE",
        businessValue: 9,
        tags: ["Compliance", "Governance", "Audit"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c11:BusinessCapability {
        id: "bc-011",
        name: "Beschaffung",
        description: "Einkauf und Lieferantenmanagement",
        maturityLevel: 3,
        status: "ACTIVE",
        businessValue: 6,
        tags: ["Procurement", "Einkauf", "Supplier"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c12:BusinessCapability {
        id: "bc-012",
        name: "Logistik",
        description: "Warenlogistik und Lieferkettenmanagement",
        maturityLevel: 4,
        status: "ACTIVE",
        businessValue: 7,
        tags: ["Logistik", "Supply Chain", "Fulfillment"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c13:BusinessCapability {
        id: "bc-013",
        name: "Risikomanagement",
        description: "Identifizierung und Bewertung von Risiken",
        maturityLevel: 3,
        status: "ACTIVE",
        businessValue: 8,
        tags: ["Risk", "Management", "Assessment"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c14:BusinessCapability {
        id: "bc-014",
        name: "Projektmanagement",
        description: "Planung und Durchführung von Projekten",
        maturityLevel: 4,
        status: "ACTIVE",
        businessValue: 7,
        tags: ["Projekt", "PMO", "Planning"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c15:BusinessCapability {
        id: "bc-015",
        name: "Kommunikation",
        description: "Interne und externe Kommunikation",
        maturityLevel: 3,
        status: "ACTIVE",
        businessValue: 6,
        tags: ["Communication", "PR", "Internal"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c16:BusinessCapability {
        id: "bc-016",
        name: "Berichtswesen",
        description: "Erstellung von Management-Reports",
        maturityLevel: 3,
        status: "ACTIVE",
        businessValue: 7,
        tags: ["Reporting", "KPI", "Management"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c17:BusinessCapability {
        id: "bc-017",
        name: "Innovationsmanagement",
        description: "Förderung und Management von Innovationen",
        maturityLevel: 2,
        status: "PLANNED",
        businessValue: 8,
        tags: ["Innovation", "R&D", "Ideas"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c18:BusinessCapability {
        id: "bc-018",
        name: "Sicherheitsmanagement",
        description: "IT- und Informationssicherheit",
        maturityLevel: 4,
        status: "ACTIVE",
        businessValue: 10,
        tags: ["Security", "InfoSec", "Cyber"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c19:BusinessCapability {
        id: "bc-019",
        name: "Dokumentenmanagement",
        description: "Verwaltung von Dokumenten und Inhalten",
        maturityLevel: 3,
        status: "ACTIVE",
        businessValue: 6,
        tags: ["DMS", "Content", "Archive"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (c20:BusinessCapability {
        id: "bc-020",
        name: "Workflow-Management",
        description: "Automatisierung von Geschäftsprozessen",
        maturityLevel: 3,
        status: "PLANNED",
        businessValue: 7,
        tags: ["Workflow", "BPM", "Automation"],
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    console.log('Erstelle Capability-Hierarchien...')
    // Capability-Hierarchien erstellen
    await session.run(`
      MATCH 
        (c1:BusinessCapability {id: "bc-001"}),
        (c4:BusinessCapability {id: "bc-004"}),
        (c3:BusinessCapability {id: "bc-003"}),
        (c5:BusinessCapability {id: "bc-005"}),
        (c16:BusinessCapability {id: "bc-016"}),
        (c8:BusinessCapability {id: "bc-008"}),
        (c9:BusinessCapability {id: "bc-009"}),
        (c18:BusinessCapability {id: "bc-018"})
      CREATE 
        (c4)-[:HAS_PARENT]->(c1),
        (c16)-[:HAS_PARENT]->(c5),
        (c8)-[:HAS_PARENT]->(c5),
        (c18)-[:HAS_PARENT]->(c9)
    `)

    console.log('Erstelle Applikationen...')
    // Create applications (12+ Applications)
    await session.run(`
      CREATE 
      (a1:Application {
        id: "app-001",
        name: "Salesforce CRM",
        description: "Customer Relationship Management System für Vertrieb und Marketing",
        status: "ACTIVE",
        criticality: "HIGH",
        technologyStack: ["Salesforce", "Apex", "Lightning"],
        version: "Summer '24",
        hostingEnvironment: "Cloud",
        vendor: "Salesforce",
        costs: 125000.00,
        introductionDate: date("2020-06-15"),
        endOfLifeDate: date("2030-06-15"),
        timeCategory: "TOLERATE",
        sevenRStrategy: "RETAIN",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a2:Application {
        id: "app-002",
        name: "SAP ERP",
        description: "Enterprise Resource Planning System",
        status: "ACTIVE",
        criticality: "CRITICAL",
        technologyStack: ["SAP ABAP", "SAP HANA", "Fiori"],
        version: "S/4HANA 2023",
        hostingEnvironment: "On-Premises",
        vendor: "SAP",
        costs: 450000.00,
        introductionDate: date("2018-01-15"),
        endOfLifeDate: date("2035-12-31"),
        timeCategory: "INVEST",
        sevenRStrategy: "REPLATFORM",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a3:Application {
        id: "app-003",
        name: "Microsoft 365",
        description: "Office-Suite und Kollaborationsplattform",
        status: "ACTIVE",
        criticality: "HIGH",
        technologyStack: ["SharePoint", "Teams", "Exchange"],
        version: "2024",
        hostingEnvironment: "Cloud",
        vendor: "Microsoft",
        costs: 95000.00,
        introductionDate: date("2019-03-01"),
        timeCategory: "TOLERATE",
        sevenRStrategy: "RETAIN",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a4:Application {
        id: "app-004",
        name: "ServiceNow ITSM",
        description: "IT Service Management Platform",
        status: "ACTIVE",
        criticality: "HIGH",
        technologyStack: ["ServiceNow", "JavaScript", "REST"],
        version: "Vancouver",
        hostingEnvironment: "Cloud",
        vendor: "ServiceNow",
        costs: 75000.00,
        introductionDate: date("2021-09-01"),
        endOfLifeDate: date("2031-09-01"),
        timeCategory: "MIGRATE",
        sevenRStrategy: "REHOST",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a5:Application {
        id: "app-005",
        name: "Tableau Analytics",
        description: "Business Intelligence und Datenvisualisierung",
        status: "ACTIVE",
        criticality: "MEDIUM",
        technologyStack: ["Tableau", "Python", "R"],
        version: "2024.1",
        hostingEnvironment: "Cloud",
        vendor: "Salesforce",
        costs: 65000.00,
        introductionDate: date("2022-02-15"),
        timeCategory: "MIGRATE",
        sevenRStrategy: "REFACTOR",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a6:Application {
        id: "app-006",
        name: "Workday HCM",
        description: "Human Capital Management System",
        status: "ACTIVE",
        criticality: "HIGH",
        technologyStack: ["Workday", "REST API", "XSLT"],
        version: "2024R1",
        hostingEnvironment: "Cloud",
        vendor: "Workday",
        costs: 120000.00,
        introductionDate: date("2023-01-01"),
        endOfLifeDate: date("2033-01-01"),
        timeCategory: "TOLERATE",
        sevenRStrategy: "RETAIN",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a7:Application {
        id: "app-007",
        name: "Confluence Wiki",
        description: "Dokumentations- und Wissensmanagement",
        status: "ACTIVE",
        criticality: "MEDIUM",
        technologyStack: ["Confluence", "Java", "PostgreSQL"],
        version: "8.5.4",
        hostingEnvironment: "On-Premises",
        vendor: "Atlassian",
        costs: 25000.00,
        introductionDate: date("2020-11-15"),
        timeCategory: "ELIMINATE",
        sevenRStrategy: "RETIRE",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a8:Application {
        id: "app-008",
        name: "Jira Project Management",
        description: "Projektmanagement und Issue Tracking",
        status: "ACTIVE",
        criticality: "MEDIUM",
        technologyStack: ["Jira", "Java", "PostgreSQL"],
        version: "9.12.0",
        hostingEnvironment: "Cloud",
        vendor: "Atlassian",
        costs: 35000.00,
        introductionDate: date("2019-05-01"),
        timeCategory: "MIGRATE",
        sevenRStrategy: "REPLATFORM",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a9:Application {
        id: "app-009",
        name: "Slack Communication",
        description: "Team-Kommunikation und Kollaboration",
        status: "ACTIVE",
        criticality: "MEDIUM",
        technologyStack: ["Slack", "Node.js", "WebRTC"],
        version: "4.36.0",
        hostingEnvironment: "Cloud",
        vendor: "Salesforce",
        costs: 45000.00,
        introductionDate: date("2021-06-01"),
        timeCategory: "TOLERATE",
        sevenRStrategy: "RETAIN",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a10:Application {
        id: "app-010",
        name: "DocuSign Digital",
        description: "Digitale Signatur und Dokumentenworkflow",
        status: "ACTIVE",
        criticality: "MEDIUM",
        technologyStack: ["DocuSign", "REST API", "OAuth"],
        version: "2024.2",
        hostingEnvironment: "Cloud",
        vendor: "DocuSign",
        costs: 30000.00,
        introductionDate: date("2022-08-15"),
        timeCategory: "INVEST",
        sevenRStrategy: "REFACTOR",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a11:Application {
        id: "app-011",
        name: "Splunk Security",
        description: "Security Information and Event Management",
        status: "ACTIVE",
        criticality: "CRITICAL",
        technologyStack: ["Splunk", "Python", "Machine Learning"],
        version: "9.1.2",
        hostingEnvironment: "On-Premises",
        vendor: "Splunk",
        costs: 180000.00,
        introductionDate: date("2021-03-01"),
        endOfLifeDate: date("2031-03-01"),
        timeCategory: "INVEST",
        sevenRStrategy: "REPLACE",
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (a12:Application {
        id: "app-012",
        name: "Oracle Database",
        description: "Zentrale Unternehmensdatenbank",
        status: "ACTIVE",
        criticality: "CRITICAL",
        technologyStack: ["Oracle", "SQL", "PL/SQL"],
        version: "19c",
        hostingEnvironment: "On-Premises",
        vendor: "Oracle",
        costs: 200000.00,
        introductionDate: date("2017-09-01"),
        endOfLifeDate: date("2032-04-30"),
        timeCategory: "MIGRATE",
        sevenRStrategy: "REFACTOR",
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    console.log('Erstelle Infrastructure-Elemente...')
    // Infrastructure-Elemente erstellen (5 Infrastructures)
    await session.run(`
      CREATE 
      (inf1:Infrastructure {
        id: "inf-001",
        name: "AWS Cloud Frankfurt",
        description: "Amazon Web Services Cloud-Rechenzentrum in Frankfurt",
        infrastructureType: "CLOUD_DATACENTER",
        status: "ACTIVE",
        vendor: "Amazon Web Services",
        version: "Current",
        capacity: "Unlimited (Auto-scaling)",
        location: "Frankfurt, Deutschland",
        ipAddress: "52.59.0.0/16",
        operatingSystem: "AWS Linux 2",
        specifications: "Multi-AZ, Auto-scaling, High Availability",
        maintenanceWindow: "Sonntag 02:00-04:00 UTC",
        costs: 85000.00,
        planningDate: date("2019-01-01"),
        introductionDate: date("2019-06-15"),
        endOfLifeDate: date("2029-06-15"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (inf2:Infrastructure {
        id: "inf-002",
        name: "Azure Cloud West Europe",
        description: "Microsoft Azure Cloud-Rechenzentrum in Westeuropa",
        infrastructureType: "CLOUD_DATACENTER",
        status: "ACTIVE",
        vendor: "Microsoft",
        version: "Current",
        capacity: "Unlimited (Auto-scaling)",
        location: "Amsterdam, Niederlande",
        ipAddress: "20.50.0.0/16",
        operatingSystem: "Windows Server 2022",
        specifications: "Geo-redundant, Auto-scaling, Enterprise SLA",
        maintenanceWindow: "Samstag 01:00-03:00 UTC",
        costs: 95000.00,
        planningDate: date("2020-03-01"),
        introductionDate: date("2020-09-01"),
        endOfLifeDate: date("2030-09-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (inf3:Infrastructure {
        id: "inf-003",
        name: "Hauptrechenzentrum München",
        description: "Primäres On-Premise Rechenzentrum der Unternehmenszentrale",
        infrastructureType: "ON_PREMISE_DATACENTER",
        status: "ACTIVE",
        vendor: "Dell Technologies",
        version: "PowerEdge R750",
        capacity: "500 TB Storage, 2048 GB RAM",
        location: "München, Deutschland",
        ipAddress: "192.168.1.0/24",
        operatingSystem: "VMware vSphere 8.0",
        specifications: "Redundante Stromversorgung, 24/7 Überwachung",
        maintenanceWindow: "Sonntag 01:00-05:00 CET",
        costs: 150000.00,
        planningDate: date("2017-01-01"),
        introductionDate: date("2018-01-15"),
        endOfLifeDate: date("2028-01-15"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (inf4:Infrastructure {
        id: "inf-004",
        name: "Backup-Rechenzentrum Berlin",
        description: "Sekundäres On-Premise Rechenzentrum für Disaster Recovery",
        infrastructureType: "ON_PREMISE_DATACENTER",
        status: "ACTIVE",
        vendor: "HPE",
        version: "ProLiant DL380 Gen10+",
        capacity: "200 TB Storage, 1024 GB RAM",
        location: "Berlin, Deutschland",
        ipAddress: "192.168.2.0/24",
        operatingSystem: "Red Hat Enterprise Linux 9",
        specifications: "Disaster Recovery, Cold Standby, Geo-redundant",
        maintenanceWindow: "Samstag 02:00-06:00 CET",
        costs: 75000.00,
        planningDate: date("2019-06-01"),
        introductionDate: date("2020-02-01"),
        endOfLifeDate: date("2030-02-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (inf5:Infrastructure {
        id: "inf-005",
        name: "Kubernetes Cluster Prod",
        description: "Produktions-Kubernetes-Cluster für Container-Workloads",
        infrastructureType: "KUBERNETES_CLUSTER",
        status: "ACTIVE",
        vendor: "Red Hat",
        version: "OpenShift 4.14",
        capacity: "50 Nodes, 200 Pods/Node",
        location: "Hybrid (München + AWS)",
        ipAddress: "10.0.0.0/16",
        operatingSystem: "Red Hat CoreOS",
        specifications: "Multi-cloud, Auto-scaling, Service Mesh",
        maintenanceWindow: "Sonntag 03:00-05:00 CET",
        costs: 120000.00,
        planningDate: date("2021-01-01"),
        introductionDate: date("2021-09-01"),
        endOfLifeDate: date("2031-09-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    console.log('Erstelle Infrastructure-Application Beziehungen...')
    // Connect applications with infrastructure elements
    await session.run(`
      MATCH 
        (a1:Application {id: "app-001"}),
        (a2:Application {id: "app-002"}),
        (a3:Application {id: "app-003"}),
        (a4:Application {id: "app-004"}),
        (a5:Application {id: "app-005"}),
        (a6:Application {id: "app-006"}),
        (a7:Application {id: "app-007"}),
        (a8:Application {id: "app-008"}),
        (a9:Application {id: "app-009"}),
        (a10:Application {id: "app-010"}),
        (a11:Application {id: "app-011"}),
        (a12:Application {id: "app-012"}),
        (inf1:Infrastructure {id: "inf-001"}),
        (inf2:Infrastructure {id: "inf-002"}),
        (inf3:Infrastructure {id: "inf-003"}),
        (inf4:Infrastructure {id: "inf-004"}),
        (inf5:Infrastructure {id: "inf-005"})
      CREATE 
        // Cloud-based applications on AWS
        (a1)-[:HOSTED_ON]->(inf1),  // Salesforce CRM on AWS
        (a4)-[:HOSTED_ON]->(inf1),  // ServiceNow ITSM on AWS
        (a5)-[:HOSTED_ON]->(inf1),  // Tableau Analytics on AWS
        
        // Cloud-based applications on Azure
        (a3)-[:HOSTED_ON]->(inf2),  // Microsoft 365 on Azure
        (a6)-[:HOSTED_ON]->(inf2),  // Workday HCM on Azure
        (a9)-[:HOSTED_ON]->(inf2),  // Slack Communication on Azure
        (a10)-[:HOSTED_ON]->(inf2), // DocuSign Digital on Azure
        
        // On-premise applications in main data center Munich
        (a2)-[:HOSTED_ON]->(inf3),  // SAP ERP in Munich
        (a7)-[:HOSTED_ON]->(inf3),  // Confluence Wiki in Munich
        (a11)-[:HOSTED_ON]->(inf3), // Splunk Security in Munich
        (a12)-[:HOSTED_ON]->(inf3), // Oracle Database in Munich
        
        // Kubernetes-based applications
        (a8)-[:HOSTED_ON]->(inf5),  // Jira Project Management on Kubernetes
        
        // Backup infrastructure is a child of main infrastructure
        (inf4)-[:HAS_PARENT_INFRASTRUCTURE]->(inf3),
        
        // Kubernetes runs partially on main infrastructure
        (inf5)-[:HAS_PARENT_INFRASTRUCTURE]->(inf3)
    `)

    console.log('Erstelle Infrastructure-Verantwortliche...')
    // Assign infrastructure responsibles
    await session.run(`
      MATCH 
        (p1:Person {id: "person-001"}),
        (p2:Person {id: "person-002"}),
        (p6:Person {id: "person-006"}),
        (inf1:Infrastructure {id: "inf-001"}),
        (inf2:Infrastructure {id: "inf-002"}),
        (inf3:Infrastructure {id: "inf-003"}),
        (inf4:Infrastructure {id: "inf-004"}),
        (inf5:Infrastructure {id: "inf-005"})
      CREATE 
        (inf1)-[:HAS_RESPONSIBLE]->(p1),  // Max Mustermann for AWS
        (inf2)-[:HAS_RESPONSIBLE]->(p1),  // Max Mustermann for Azure
        (inf3)-[:HAS_RESPONSIBLE]->(p2),  // Anna Schmidt for main data center
        (inf4)-[:HAS_RESPONSIBLE]->(p2),  // Anna Schmidt for backup data center
        (inf5)-[:HAS_RESPONSIBLE]->(p6)   // Julia Wagner for Kubernetes
    `)

    console.log('Erstelle DataObjects...')
    // DataObjects erstellen (10+ DataObjects)
    await session.run(`
      CREATE 
      (d1:DataObject {
        id: "do-001",
        name: "Kundenstammdaten",
        description: "Zentrale Kundendaten mit Kontaktinformationen",
        classification: "CONFIDENTIAL",
        format: "JSON/XML",
        introductionDate: date("2020-01-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (d2:DataObject {
        id: "do-002",
        name: "Produktkatalog",
        description: "Kompletter Produktkatalog mit Preisen",
        classification: "INTERNAL",
        format: "SQL Database",
        introductionDate: date("2019-06-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (d3:DataObject {
        id: "do-003",
        name: "Verkaufsdaten",
        description: "Transaktionsdaten aus Verkaufsprozessen",
        classification: "CONFIDENTIAL",
        format: "CSV/Parquet",
        introductionDate: date("2020-03-15"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (d4:DataObject {
        id: "do-004",
        name: "Mitarbeiterdaten",
        description: "HR-Daten aller Mitarbeiter",
        classification: "STRICTLY_CONFIDENTIAL",
        format: "Encrypted Database",
        introductionDate: date("2018-01-01"),
        endOfLifeDate: date("2028-01-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (d5:DataObject {
        id: "do-005",
        name: "Finanzdaten",
        description: "Buchhaltung und Finanztransaktionen",
        classification: "STRICTLY_CONFIDENTIAL",
        format: "SAP Format",
        introductionDate: date("2018-01-15"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (d6:DataObject {
        id: "do-006",
        name: "Support-Tickets",
        description: "Kundensupport-Anfragen und -Tickets",
        classification: "INTERNAL",
        format: "JSON/REST",
        introductionDate: date("2021-09-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (d7:DataObject {
        id: "do-007",
        name: "Dokumentenarchiv",
        description: "Unternehmensdokumente und Verträge",
        classification: "CONFIDENTIAL",
        format: "PDF/Office",
        introductionDate: date("2020-11-15"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (d8:DataObject {
        id: "do-008",
        name: "Analytics-Metriken",
        description: "KPIs und Business-Intelligence-Daten",
        classification: "INTERNAL",
        format: "Time Series",
        introductionDate: date("2022-02-15"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (d9:DataObject {
        id: "do-009",
        name: "Sicherheitslogs",
        description: "IT-Sicherheitsereignisse und Audit-Logs",
        classification: "STRICTLY_CONFIDENTIAL",
        format: "Syslog/JSON",
        introductionDate: date("2021-03-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (d10:DataObject {
        id: "do-010",
        name: "Projektstatus",
        description: "Projektfortschritt und Meilensteine",
        classification: "INTERNAL",
        format: "JSON/XML",
        introductionDate: date("2019-05-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    console.log('Erstelle Application Interfaces...')
    // Application Interfaces erstellen (12+ Interfaces)
    await session.run(`
      CREATE 
      (i1:ApplicationInterface {
        id: "int-001",
        name: "CRM-ERP Integration",
        description: "Datenaustausch zwischen CRM und ERP System",
        interfaceType: "API",
        protocol: "REST",
        version: "v2.1",
        status: "ACTIVE",
        introductionDate: date("2020-08-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i2:ApplicationInterface {
        id: "int-002",
        name: "ERP-Analytics Connector",
        description: "Datenübertragung für Business Intelligence",
        interfaceType: "DATABASE",
        protocol: "JDBC",
        version: "v1.5",
        status: "ACTIVE",
        introductionDate: date("2022-03-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i3:ApplicationInterface {
        id: "int-003",
        name: "HCM-Payroll Interface",
        description: "Mitarbeiterdaten für Gehaltsabrechnung",
        interfaceType: "FILE",
        protocol: "SFTP",
        version: "v3.0",
        status: "ACTIVE",
        introductionDate: date("2023-02-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i4:ApplicationInterface {
        id: "int-004",
        name: "ITSM-Security Integration",
        description: "Sicherheitsereignisse an Service Management",
        interfaceType: "MESSAGE_QUEUE",
        protocol: "HTTP",
        version: "v1.0",
        status: "ACTIVE",
        introductionDate: date("2021-04-15"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i5:ApplicationInterface {
        id: "int-005",
        name: "Office365-CRM Sync",
        description: "Kontakte und Kalender Synchronisation",
        interfaceType: "API",
        protocol: "REST",
        version: "v2.0",
        status: "ACTIVE",
        introductionDate: date("2020-01-15"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i6:ApplicationInterface {
        id: "int-006",
        name: "Document-Signature Flow",
        description: "Dokumentenworkflow mit digitaler Signatur",
        interfaceType: "API",
        protocol: "REST",
        version: "v1.8",
        status: "ACTIVE",
        introductionDate: date("2022-09-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i7:ApplicationInterface {
        id: "int-007",
        name: "Project-Communication Bridge",
        description: "Projektupdate Notifications",
        interfaceType: "API",
        protocol: "REST",
        version: "v1.2",
        status: "ACTIVE",
        introductionDate: date("2021-07-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i8:ApplicationInterface {
        id: "int-008",
        name: "Analytics-Dashboard Feed",
        description: "Real-time Daten für Dashboards",
        interfaceType: "API",
        protocol: "GRAPHQL",
        version: "v1.0",
        status: "IN_DEVELOPMENT",
        introductionDate: date("2024-01-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i9:ApplicationInterface {
        id: "int-009",
        name: "Wiki-Knowledge Export",
        description: "Wissensexport für andere Systeme",
        interfaceType: "FILE",
        protocol: "REST",
        version: "v2.5",
        status: "ACTIVE",
        introductionDate: date("2021-01-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i10:ApplicationInterface {
        id: "int-010",
        name: "Security-SIEM Feed",
        description: "Sicherheitsdaten an SIEM System",
        interfaceType: "MESSAGE_QUEUE",
        protocol: "HTTPS",
        version: "v1.3",
        status: "ACTIVE",
        introductionDate: date("2021-05-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i11:ApplicationInterface {
        id: "int-011",
        name: "ERP-Database Replication",
        description: "Datenbankreplikation für Backup",
        interfaceType: "DATABASE",
        protocol: "TCP",
        version: "v4.1",
        status: "ACTIVE",
        introductionDate: date("2018-03-01"),
        endOfLifeDate: date("2028-03-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (i12:ApplicationInterface {
        id: "int-012",
        name: "Communication-Archive Bridge",
        description: "Chat-Archivierung für Compliance",
        interfaceType: "API",
        protocol: "REST",
        version: "v1.4",
        status: "PLANNED",
        introductionDate: date("2024-06-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    console.log('Erstelle Architekturen...')
    // Architekturen erstellen (5+ Architectures)
    await session.run(`
      CREATE 
      (arch1:Architecture {
        id: "arch-001",
        name: "Customer Experience Architecture",
        description: "Architektur für optimale Kundenerfahrung",
        timestamp: datetime("2024-01-15T10:00:00Z"),
        domain: "BUSINESS",
        type: "CONCEPTUAL",
        tags: ["Customer", "Experience", "CX"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (arch2:Architecture {
        id: "arch-002",
        name: "Data & Analytics Platform",
        description: "Zentrale Datenplattform für Analytics",
        timestamp: datetime("2023-11-20T14:30:00Z"),
        domain: "DATA",
        type: "CURRENT_STATE",
        tags: ["Data", "Analytics", "Platform"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (arch3:Architecture {
        id: "arch-003",
        name: "Security & Compliance Framework",
        description: "IT-Sicherheitsarchitektur und Compliance",
        timestamp: datetime("2023-09-10T09:15:00Z"),
        domain: "TECHNOLOGY",
        type: "CONCEPTUAL",
        tags: ["Security", "Compliance", "Framework"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (arch4:Architecture {
        id: "arch-004",
        name: "Digital Workplace Architecture",
        description: "Moderne Arbeitsplatzarchitektur",
        timestamp: datetime("2024-02-28T16:45:00Z"),
        domain: "APPLICATION",
        type: "FUTURE_STATE",
        tags: ["Digital", "Workplace", "Collaboration"],
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (arch5:Architecture {
        id: "arch-005",
        name: "Enterprise Integration Architecture",
        description: "Unternehmensweite Integrationsarchitektur",
        timestamp: datetime("2023-12-05T11:20:00Z"),
        domain: "APPLICATION",
        type: "CURRENT_STATE",
        tags: ["Integration", "Enterprise", "APIs"],
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    console.log('Erstelle Architektur-Prinzipien...')
    // Architektur-Prinzipien erstellen (20+ ArchitecturePrinciples)
    await session.run(`
      CREATE 
      (ap1:ArchitecturePrinciple {
        id: "ap-001",
        name: "API First",
        description: "Alle Services müssen API-first entwickelt werden",
        category: "INTEGRATION",
        priority: "HIGH",
        rationale: "Ermöglicht bessere Integration und Wiederverwendbarkeit von Services",
        implications: "Alle neuen Services benötigen eine vollständige API-Spezifikation vor der Entwicklung",
        tags: ["API", "Integration", "Services"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap2:ArchitecturePrinciple {
        id: "ap-002",
        name: "Cloud First",
        description: "Bevorzugung von Cloud-nativen Lösungen",
        category: "TECHNOLOGY",
        priority: "HIGH",
        rationale: "Reduziert Infrastrukturkosten und verbessert Skalierbarkeit",
        implications: "On-Premises-Lösungen nur bei besonderen Compliance-Anforderungen",
        tags: ["Cloud", "Infrastructure", "Scalability"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap3:ArchitecturePrinciple {
        id: "ap-003",
        name: "Security by Design",
        description: "Sicherheit von Anfang an mitdenken",
        category: "SECURITY",
        priority: "CRITICAL",
        rationale: "Nachträgliche Sicherheitsmaßnahmen sind kostspieliger und weniger effektiv",
        implications: "Security Reviews sind in jedem Entwicklungszyklus verpflichtend",
        tags: ["Security", "Design", "Compliance"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap4:ArchitecturePrinciple {
        id: "ap-004",
        name: "Microservices Architektur",
        description: "Aufteilung komplexer Anwendungen in kleinere Services",
        category: "APPLICATION",
        priority: "MEDIUM",
        rationale: "Verbessert Wartbarkeit, Skalierbarkeit und Entwicklungsgeschwindigkeit",
        implications: "Erhöhte Komplexität bei Service-zu-Service-Kommunikation",
        tags: ["Microservices", "Architecture", "Scalability"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap5:ArchitecturePrinciple {
        id: "ap-005",
        name: "Data Privacy by Design",
        description: "Datenschutz als integraler Bestandteil der Systemarchitektur",
        category: "DATA",
        priority: "CRITICAL",
        rationale: "DSGVO-Compliance und Aufbau von Kundenvertrauen",
        implications: "Alle Datenverarbeitungen müssen dokumentiert und minimiert werden",
        tags: ["Privacy", "GDPR", "Data Protection"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap6:ArchitecturePrinciple {
        id: "ap-006",
        name: "Open Source First",
        description: "Bevorzugung von Open-Source-Lösungen",
        category: "TECHNOLOGY",
        priority: "MEDIUM",
        rationale: "Reduziert Lizenzkosten und Vendor Lock-in",
        implications: "Support und Wartung müssen intern oder über Service-Partner sichergestellt werden",
        tags: ["Open Source", "Cost Optimization", "Vendor Independence"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap7:ArchitecturePrinciple {
        id: "ap-007",
        name: "Observability by Default",
        description: "Alle Services müssen Monitoring und Logging unterstützen",
        category: "PERFORMANCE",
        priority: "HIGH",
        rationale: "Ermöglicht proaktive Problemerkennung und -behebung",
        implications: "Zusätzlicher Aufwand für Instrumentierung in jedem Service",
        tags: ["Monitoring", "Logging", "Observability"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap8:ArchitecturePrinciple {
        id: "ap-008",
        name: "Fail Fast",
        description: "Systeme sollen schnell und kontrolliert versagen",
        category: "RELIABILITY",
        priority: "HIGH",
        rationale: "Verhindert Kaskadenausfälle und ermöglicht schnelle Wiederherstellung",
        implications: "Circuit Breaker und Timeout-Mechanismen sind obligatorisch",
        tags: ["Resilience", "Circuit Breaker", "Fault Tolerance"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap9:ArchitecturePrinciple {
        id: "ap-009",
        name: "Immutable Infrastructure",
        description: "Infrastructure as Code mit unveränderlichen Komponenten",
        category: "TECHNOLOGY",
        priority: "MEDIUM",
        rationale: "Verbessert Reproduzierbarkeit und reduziert Konfigurationsdrift",
        implications: "Alle Infrastrukturänderungen müssen über Code-Deployment erfolgen",
        tags: ["IaC", "Infrastructure", "Reproducibility"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap10:ArchitecturePrinciple {
        id: "ap-010",
        name: "Event-Driven Architecture",
        description: "Lose gekoppelte Systeme über Events",
        category: "INTEGRATION",
        priority: "MEDIUM",
        rationale: "Ermöglicht bessere Skalierbarkeit und Entkopplung",
        implications: "Event-Schema-Management und Message-Ordering müssen berücksichtigt werden",
        tags: ["Events", "Messaging", "Decoupling"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap11:ArchitecturePrinciple {
        id: "ap-011",
        name: "Mobile First",
        description: "Benutzeroberflächen primär für mobile Geräte optimieren",
        category: "APPLICATION",
        priority: "HIGH",
        rationale: "Majority der Nutzer greift über mobile Geräte zu",
        implications: "Responsive Design und Progressive Web Apps sind Standard",
        tags: ["Mobile", "Responsive", "UX"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap12:ArchitecturePrinciple {
        id: "ap-012",
        name: "Zero Trust Security",
        description: "Vertraue niemals, verifiziere immer",
        category: "SECURITY",
        priority: "HIGH",
        rationale: "Moderne Bedrohungslandschaft erfordert umfassende Verifikation",
        implications: "Alle Zugriffe müssen authentifiziert und autorisiert werden",
        tags: ["Zero Trust", "Authentication", "Authorization"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap13:ArchitecturePrinciple {
        id: "ap-013",
        name: "Continuous Deployment",
        description: "Automatisierte Deployments in Produktion",
        category: "PERFORMANCE",
        priority: "MEDIUM",
        rationale: "Reduziert Time-to-Market und Deployment-Risiken",
        implications: "Umfassende Test-Automatisierung und Rollback-Strategien erforderlich",
        tags: ["CD", "Automation", "DevOps"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap14:ArchitecturePrinciple {
        id: "ap-014",
        name: "Data Mesh",
        description: "Dezentrale Datenarchitektur mit Domain-Ownership",
        category: "DATA",
        priority: "LOW",
        rationale: "Skaliert besser als zentrale Data Lakes bei großen Organisationen",
        implications: "Daten-Teams in jeder Domain benötigt, höhere Governance-Komplexität",
        tags: ["Data Mesh", "Decentralization", "Domain"],
        isActive: false,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap15:ArchitecturePrinciple {
        id: "ap-015",
        name: "AI/ML by Design",
        description: "KI-Funktionalitäten von Anfang an mitdenken",
        category: "TECHNOLOGY",
        priority: "MEDIUM",
        rationale: "Ermöglicht datengetriebene Entscheidungen und Automatisierung",
        implications: "Datenqualität und ML-Pipelines müssen von Beginn an berücksichtigt werden",
        tags: ["AI", "ML", "Data Science"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap16:ArchitecturePrinciple {
        id: "ap-016",
        name: "Vendor Neutrality",
        description: "Vermeidung von Vendor Lock-in",
        category: "GOVERNANCE",
        priority: "MEDIUM",
        rationale: "Erhält Flexibilität und Verhandlungsmacht",
        implications: "Standards-basierte Schnittstellen und Multi-Vendor-Strategien bevorzugen",
        tags: ["Vendor Independence", "Standards", "Flexibility"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap17:ArchitecturePrinciple {
        id: "ap-017",
        name: "Cost Optimization",
        description: "Kontinuierliche Optimierung der IT-Kosten",
        category: "COST_OPTIMIZATION",
        priority: "HIGH",
        rationale: "Maximiert ROI und ermöglicht Investitionen in Innovation",
        implications: "Regelmäßige Reviews und FinOps-Praktiken implementieren",
        tags: ["Cost", "FinOps", "Optimization"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap18:ArchitecturePrinciple {
        id: "ap-018",
        name: "Self-Service Platforms",
        description: "Entwickler-Teams sollen sich selbst bedienen können",
        category: "REUSABILITY",
        priority: "MEDIUM",
        rationale: "Reduziert Abhängigkeiten und beschleunigt Entwicklung",
        implications: "Investment in Platform Engineering und Developer Experience",
        tags: ["Self-Service", "Platform", "Developer Experience"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap19:ArchitecturePrinciple {
        id: "ap-019",
        name: "Accessibility First",
        description: "Barrierefreie Gestaltung aller Benutzeroberflächen",
        category: "APPLICATION",
        priority: "HIGH",
        rationale: "Gesetzliche Anforderungen und gesellschaftliche Verantwortung",
        implications: "WCAG-Compliance muss in allen UI-Komponenten sichergestellt werden",
        tags: ["Accessibility", "WCAG", "Inclusion"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      }),
      (ap20:ArchitecturePrinciple {
        id: "ap-020",
        name: "Green IT",
        description: "Nachhaltige und energieeffiziente IT-Praktiken",
        category: "GOVERNANCE",
        priority: "MEDIUM",
        rationale: "Umweltverantwortung und Kostenreduktion durch Energieeffizienz",
        implications: "Carbon Footprint muss bei Architekturentscheidungen berücksichtigt werden",
        tags: ["Sustainability", "Energy Efficiency", "Green IT"],
        isActive: true,
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    console.log('Erstelle Beziehungen zwischen Entitäten...')
    // Ownership-Beziehungen
    await session.run(`
      MATCH 
        (p1:Person {id: "person-001"}), (arch1:Architecture {id: "arch-001"}),
        (p1), (arch2:Architecture {id: "arch-002"}),
        (p2:Person {id: "person-002"}), (a1:Application {id: "app-001"}),
        (p2), (a3:Application {id: "app-003"}),
        (p3:Person {id: "person-003"}), (c3:BusinessCapability {id: "bc-003"}),
        (p4:Person {id: "person-004"}), (c3),
        (p5:Person {id: "person-005"}), (c4:BusinessCapability {id: "bc-004"}),
        (p6:Person {id: "person-006"}), (d1:DataObject {id: "do-001"}),
        (p6), (d8:DataObject {id: "do-008"})
      CREATE 
        (arch1)-[:OWNED_BY]->(p1),
        (arch2)-[:OWNED_BY]->(p1),
        (a1)-[:OWNED_BY]->(p2),
        (a3)-[:OWNED_BY]->(p2),
        (c3)-[:OWNED_BY]->(p3),
        (c4)-[:OWNED_BY]->(p5),
        (d1)-[:OWNED_BY]->(p6),
        (d8)-[:OWNED_BY]->(p6)
    `)

    // Fehlende Architektur-Verantwortlichkeiten ergänzen
    await session.run(`
      MATCH 
        (p3:Person {id: "person-003"}), (arch3:Architecture {id: "arch-003"}),
        (p4:Person {id: "person-004"}), (arch4:Architecture {id: "arch-004"}),
        (p5:Person {id: "person-005"}), (arch5:Architecture {id: "arch-005"})
      CREATE 
        (arch3)-[:OWNED_BY]->(p3),
        (arch4)-[:OWNED_BY]->(p4),
        (arch5)-[:OWNED_BY]->(p5)
    `)

    // ArchitecturePrinciple-Verantwortlichkeiten
    await session.run(`
      MATCH 
        (p1:Person {id: "person-001"}), (ap1:ArchitecturePrinciple {id: "ap-001"}),
        (p1), (ap2:ArchitecturePrinciple {id: "ap-002"}),
        (p1), (ap3:ArchitecturePrinciple {id: "ap-003"}),
        (p1), (ap4:ArchitecturePrinciple {id: "ap-004"}),
        (p2:Person {id: "person-002"}), (ap5:ArchitecturePrinciple {id: "ap-005"}),
        (p2), (ap6:ArchitecturePrinciple {id: "ap-006"}),
        (p2), (ap7:ArchitecturePrinciple {id: "ap-007"}),
        (p3:Person {id: "person-003"}), (ap8:ArchitecturePrinciple {id: "ap-008"}),
        (p3), (ap9:ArchitecturePrinciple {id: "ap-009"}),
        (p3), (ap10:ArchitecturePrinciple {id: "ap-010"}),
        (p4:Person {id: "person-004"}), (ap11:ArchitecturePrinciple {id: "ap-011"}),
        (p4), (ap12:ArchitecturePrinciple {id: "ap-012"}),
        (p4), (ap13:ArchitecturePrinciple {id: "ap-013"}),
        (p4), (ap14:ArchitecturePrinciple {id: "ap-014"}),
        (p5:Person {id: "person-005"}), (ap15:ArchitecturePrinciple {id: "ap-015"}),
        (p5), (ap16:ArchitecturePrinciple {id: "ap-016"}),
        (p5), (ap17:ArchitecturePrinciple {id: "ap-017"}),
        (p6:Person {id: "person-006"}), (ap18:ArchitecturePrinciple {id: "ap-018"}),
        (p6), (ap19:ArchitecturePrinciple {id: "ap-019"}),
        (p6), (ap20:ArchitecturePrinciple {id: "ap-020"})
      CREATE 
        (ap1)-[:OWNED_BY]->(p1),
        (ap2)-[:OWNED_BY]->(p1),
        (ap3)-[:OWNED_BY]->(p1),
        (ap4)-[:OWNED_BY]->(p1),
        (ap5)-[:OWNED_BY]->(p2),
        (ap6)-[:OWNED_BY]->(p2),
        (ap7)-[:OWNED_BY]->(p2),
        (ap8)-[:OWNED_BY]->(p3),
        (ap9)-[:OWNED_BY]->(p3),
        (ap10)-[:OWNED_BY]->(p3),
        (ap11)-[:OWNED_BY]->(p4),
        (ap12)-[:OWNED_BY]->(p4),
        (ap13)-[:OWNED_BY]->(p4),
        (ap14)-[:OWNED_BY]->(p4),
        (ap15)-[:OWNED_BY]->(p5),
        (ap16)-[:OWNED_BY]->(p5),
        (ap17)-[:OWNED_BY]->(p5),
        (ap18)-[:OWNED_BY]->(p6),
        (ap19)-[:OWNED_BY]->(p6),
        (ap20)-[:OWNED_BY]->(p6)
    `)

    // Interface-Verantwortlichkeiten
    await session.run(`
      MATCH 
        (p2:Person {id: "person-002"}), (i1:ApplicationInterface {id: "int-001"}),
        (p2), (i2:ApplicationInterface {id: "int-002"}),
        (p6:Person {id: "person-006"}), (i3:ApplicationInterface {id: "int-003"}),
        (p1:Person {id: "person-001"}), (i4:ApplicationInterface {id: "int-004"}),
        (p2), (i5:ApplicationInterface {id: "int-005"})
      CREATE 
        (i1)-[:OWNED_BY]->(p2),
        (i2)-[:OWNED_BY]->(p2),
        (i3)-[:OWNED_BY]->(p6),
        (i4)-[:OWNED_BY]->(p1),
        (i5)-[:OWNED_BY]->(p2)
    `)

    // Fehlende Interface-Verantwortlichkeiten ergänzen
    await session.run(`
      MATCH 
        (p3:Person {id: "person-003"}), (i6:ApplicationInterface {id: "int-006"}),
        (p4:Person {id: "person-004"}), (i7:ApplicationInterface {id: "int-007"}),
        (p5:Person {id: "person-005"}), (i8:ApplicationInterface {id: "int-008"}),
        (p6:Person {id: "person-006"}), (i9:ApplicationInterface {id: "int-009"}),
        (p1:Person {id: "person-001"}), (i10:ApplicationInterface {id: "int-010"}),
        (p2:Person {id: "person-002"}), (i11:ApplicationInterface {id: "int-011"}),
        (p3), (i12:ApplicationInterface {id: "int-012"})
      CREATE 
        (i6)-[:OWNED_BY]->(p3),
        (i7)-[:OWNED_BY]->(p4),
        (i8)-[:OWNED_BY]->(p5),
        (i9)-[:OWNED_BY]->(p6),
        (i10)-[:OWNED_BY]->(p1),
        (i11)-[:OWNED_BY]->(p2),
        (i12)-[:OWNED_BY]->(p3)
    `)

    // Application-Capability Beziehungen
    await session.run(`
      MATCH 
        (a1:Application {id: "app-001"}), (c1:BusinessCapability {id: "bc-001"}),
        (a1), (c3:BusinessCapability {id: "bc-003"}),
        (a2:Application {id: "app-002"}), (c5:BusinessCapability {id: "bc-005"}),
        (a2), (c11:BusinessCapability {id: "bc-011"}),
        (a3:Application {id: "app-003"}), (c15:BusinessCapability {id: "bc-015"}),
        (a4:Application {id: "app-004"}), (c9:BusinessCapability {id: "bc-009"}),
        (a5:Application {id: "app-005"}), (c8:BusinessCapability {id: "bc-008"}),
        (a6:Application {id: "app-006"}), (c6:BusinessCapability {id: "bc-006"}),
        (a7:Application {id: "app-007"}), (c19:BusinessCapability {id: "bc-019"}),
        (a8:Application {id: "app-008"}), (c14:BusinessCapability {id: "bc-014"}),
        (a11:Application {id: "app-011"}), (c18:BusinessCapability {id: "bc-018"})
      CREATE 
        (a1)-[:SUPPORTS]->(c1),
        (a1)-[:SUPPORTS]->(c3),
        (a2)-[:SUPPORTS]->(c5),
        (a2)-[:SUPPORTS]->(c11),
        (a3)-[:SUPPORTS]->(c15),
        (a4)-[:SUPPORTS]->(c9),
        (a5)-[:SUPPORTS]->(c8),
        (a6)-[:SUPPORTS]->(c6),
        (a7)-[:SUPPORTS]->(c19),
        (a8)-[:SUPPORTS]->(c14),
        (a11)-[:SUPPORTS]->(c18)
    `)

    // Application-DataObject Beziehungen
    await session.run(`
      MATCH 
        (a1:Application {id: "app-001"}), (d1:DataObject {id: "do-001"}),
        (a1), (d3:DataObject {id: "do-003"}),
        (a2:Application {id: "app-002"}), (d2:DataObject {id: "do-002"}),
        (a2), (d5:DataObject {id: "do-005"}),
        (a5:Application {id: "app-005"}), (d8:DataObject {id: "do-008"}),
        (a6:Application {id: "app-006"}), (d4:DataObject {id: "do-004"}),
        (a11:Application {id: "app-011"}), (d9:DataObject {id: "do-009"}),
        (a12:Application {id: "app-012"}), (d1),
        (a12), (d2),
        (a12), (d5)
      CREATE 
        (a1)-[:USES]->(d1),
        (a1)-[:USES]->(d3),
        (a2)-[:USES]->(d2),
        (a2)-[:USES]->(d5),
        (a5)-[:USES]->(d8),
        (a6)-[:USES]->(d4),
        (a11)-[:USES]->(d9),
        (d1)-[:DATA_SOURCE]->(a12),
        (d2)-[:DATA_SOURCE]->(a12),
        (d5)-[:DATA_SOURCE]->(a12)
    `)

    // Add missing data sources for all DataObjects
    await session.run(`
      MATCH 
        (a3:Application {id: "app-003"}), (d3:DataObject {id: "do-003"}),
        (a4:Application {id: "app-004"}), (d4:DataObject {id: "do-004"}),
        (a7:Application {id: "app-007"}), (d6:DataObject {id: "do-006"}),
        (a8:Application {id: "app-008"}), (d7:DataObject {id: "do-007"}),
        (a9:Application {id: "app-009"}), (d8:DataObject {id: "do-008"}),
        (a10:Application {id: "app-010"}), (d9:DataObject {id: "do-009"}),
        (a11:Application {id: "app-011"}), (d10:DataObject {id: "do-010"})
      CREATE 
        (d3)-[:DATA_SOURCE]->(a3),
        (d4)-[:DATA_SOURCE]->(a4),
        (d6)-[:DATA_SOURCE]->(a7),
        (d7)-[:DATA_SOURCE]->(a8),
        (d8)-[:DATA_SOURCE]->(a9),
        (d9)-[:DATA_SOURCE]->(a10),
        (d10)-[:DATA_SOURCE]->(a11)
    `)

    // Interface Source/Target Beziehungen
    await session.run(`
      MATCH 
        (a1:Application {id: "app-001"}), (i1:ApplicationInterface {id: "int-001"}),
        (a2:Application {id: "app-002"}), (i1),
        (a2), (i2:ApplicationInterface {id: "int-002"}),
        (a5:Application {id: "app-005"}), (i2),
        (a6:Application {id: "app-006"}), (i3:ApplicationInterface {id: "int-003"}),
        (a2), (i3),
        (a11:Application {id: "app-011"}), (i4:ApplicationInterface {id: "int-004"}),
        (a4:Application {id: "app-004"}), (i4),
        (a3:Application {id: "app-003"}), (i5:ApplicationInterface {id: "int-005"}),
        (a1), (i5),
        (a7:Application {id: "app-007"}), (i6:ApplicationInterface {id: "int-006"}),
        (a10:Application {id: "app-010"}), (i6)
      CREATE 
        (a1)-[:INTERFACE_SOURCE]->(i1),
        (a2)-[:INTERFACE_TARGET]->(i1),
        (a2)-[:INTERFACE_SOURCE]->(i2),
        (a5)-[:INTERFACE_TARGET]->(i2),
        (a6)-[:INTERFACE_SOURCE]->(i3),
        (a2)-[:INTERFACE_TARGET]->(i3),
        (a11)-[:INTERFACE_SOURCE]->(i4),
        (a4)-[:INTERFACE_TARGET]->(i4),
        (a3)-[:INTERFACE_SOURCE]->(i5),
        (a1)-[:INTERFACE_TARGET]->(i5),
        (a7)-[:INTERFACE_SOURCE]->(i6),
        (a10)-[:INTERFACE_TARGET]->(i6)
    `)

    // Fehlende Interface Source/Target Beziehungen ergänzen
    await session.run(`
      MATCH 
        (a8:Application {id: "app-008"}), (i7:ApplicationInterface {id: "int-007"}),
        (a9:Application {id: "app-009"}), (i7),
        (a12:Application {id: "app-012"}), (i8:ApplicationInterface {id: "int-008"}),
        (a1:Application {id: "app-001"}), (i8),
        (a5:Application {id: "app-005"}), (i9:ApplicationInterface {id: "int-009"}),
        (a6:Application {id: "app-006"}), (i9),
        (a10:Application {id: "app-010"}), (i10:ApplicationInterface {id: "int-010"}),
        (a4:Application {id: "app-004"}), (i10),
        (a2:Application {id: "app-002"}), (i11:ApplicationInterface {id: "int-011"}),
        (a3:Application {id: "app-003"}), (i11),
        (a11:Application {id: "app-011"}), (i12:ApplicationInterface {id: "int-012"}),
        (a12), (i12)
      CREATE 
        (a8)-[:INTERFACE_SOURCE]->(i7),
        (a9)-[:INTERFACE_TARGET]->(i7),
        (a12)-[:INTERFACE_SOURCE]->(i8),
        (a1)-[:INTERFACE_TARGET]->(i8),
        (a5)-[:INTERFACE_SOURCE]->(i9),
        (a6)-[:INTERFACE_TARGET]->(i9),
        (a10)-[:INTERFACE_SOURCE]->(i10),
        (a4)-[:INTERFACE_TARGET]->(i10),
        (a2)-[:INTERFACE_SOURCE]->(i11),
        (a3)-[:INTERFACE_TARGET]->(i11),
        (a11)-[:INTERFACE_SOURCE]->(i12),
        (a12)-[:INTERFACE_TARGET]->(i12)
    `)

    // Interface-DataObject transfer relationships (all interfaces)
    await session.run(`
      MATCH 
        (i1:ApplicationInterface {id: "int-001"}), (d1:DataObject {id: "do-001"}),
        (i1), (d3:DataObject {id: "do-003"}),
        (i2:ApplicationInterface {id: "int-002"}), (d8:DataObject {id: "do-008"}),
        (i3:ApplicationInterface {id: "int-003"}), (d4:DataObject {id: "do-004"}),
        (i4:ApplicationInterface {id: "int-004"}), (d9:DataObject {id: "do-009"}),
        (i5:ApplicationInterface {id: "int-005"}), (d1),
        (i6:ApplicationInterface {id: "int-006"}), (d7:DataObject {id: "do-007"})
      CREATE 
        (i1)-[:TRANSFERS]->(d1),
        (i1)-[:TRANSFERS]->(d3),
        (i2)-[:TRANSFERS]->(d8),
        (i3)-[:TRANSFERS]->(d4),
        (i4)-[:TRANSFERS]->(d9),
        (i5)-[:TRANSFERS]->(d1),
        (i6)-[:TRANSFERS]->(d7)
    `)

    // Add missing Interface-DataObject transfer relationships for int-007 to int-012
    await session.run(`
      MATCH 
        (i7:ApplicationInterface {id: "int-007"}), (d10:DataObject {id: "do-010"}),
        (i8:ApplicationInterface {id: "int-008"}), (d8:DataObject {id: "do-008"}),
        (i8), (d5:DataObject {id: "do-005"}),
        (i9:ApplicationInterface {id: "int-009"}), (d7:DataObject {id: "do-007"}),
        (i9), (d6:DataObject {id: "do-006"}),
        (i10:ApplicationInterface {id: "int-010"}), (d9:DataObject {id: "do-009"}),
        (i11:ApplicationInterface {id: "int-011"}), (d2:DataObject {id: "do-002"}),
        (i11), (d5),
        (i12:ApplicationInterface {id: "int-012"}), (d6:DataObject {id: "do-006"})
      CREATE 
        (i7)-[:TRANSFERS]->(d10),
        (i8)-[:TRANSFERS]->(d8),
        (i8)-[:TRANSFERS]->(d5),
        (i9)-[:TRANSFERS]->(d7),
        (i9)-[:TRANSFERS]->(d6),
        (i10)-[:TRANSFERS]->(d9),
        (i11)-[:TRANSFERS]->(d2),
        (i11)-[:TRANSFERS]->(d5),
        (i12)-[:TRANSFERS]->(d6)
    `)

    // Fehlende Application-Verantwortlichkeiten ergänzen
    await session.run(`
      MATCH 
        (p1:Person {id: "person-001"}), (a2:Application {id: "app-002"}),
        (p3:Person {id: "person-003"}), (a4:Application {id: "app-004"}),
        (p4:Person {id: "person-004"}), (a5:Application {id: "app-005"}),
        (p5:Person {id: "person-005"}), (a6:Application {id: "app-006"}),
        (p6:Person {id: "person-006"}), (a7:Application {id: "app-007"}),
        (p1), (a8:Application {id: "app-008"}),
        (p2:Person {id: "person-002"}), (a9:Application {id: "app-009"}),
        (p3), (a10:Application {id: "app-010"}),
        (p4), (a11:Application {id: "app-011"}),
        (p5), (a12:Application {id: "app-012"})
      CREATE 
        (a2)-[:OWNED_BY]->(p1),
        (a4)-[:OWNED_BY]->(p3),
        (a5)-[:OWNED_BY]->(p4),
        (a6)-[:OWNED_BY]->(p5),
        (a7)-[:OWNED_BY]->(p6),
        (a8)-[:OWNED_BY]->(p1),
        (a9)-[:OWNED_BY]->(p2),
        (a10)-[:OWNED_BY]->(p3),
        (a11)-[:OWNED_BY]->(p4),
        (a12)-[:OWNED_BY]->(p5)
    `)

    // Fehlende Business Capability-Verantwortlichkeiten ergänzen
    await session.run(`
      MATCH 
        (p1:Person {id: "person-001"}), (c1:BusinessCapability {id: "bc-001"}),
        (p2:Person {id: "person-002"}), (c2:BusinessCapability {id: "bc-002"}),
        (p4:Person {id: "person-004"}), (c5:BusinessCapability {id: "bc-005"}),
        (p5:Person {id: "person-005"}), (c6:BusinessCapability {id: "bc-006"}),
        (p6:Person {id: "person-006"}), (c7:BusinessCapability {id: "bc-007"}),
        (p1), (c8:BusinessCapability {id: "bc-008"}),
        (p2), (c9:BusinessCapability {id: "bc-009"}),
        (p3:Person {id: "person-003"}), (c10:BusinessCapability {id: "bc-010"}),
        (p4), (c11:BusinessCapability {id: "bc-011"}),
        (p5), (c12:BusinessCapability {id: "bc-012"}),
        (p6), (c13:BusinessCapability {id: "bc-013"}),
        (p1), (c14:BusinessCapability {id: "bc-014"}),
        (p2), (c15:BusinessCapability {id: "bc-015"}),
        (p3), (c16:BusinessCapability {id: "bc-016"}),
        (p4), (c17:BusinessCapability {id: "bc-017"}),
        (p5), (c18:BusinessCapability {id: "bc-018"}),
        (p6), (c19:BusinessCapability {id: "bc-019"}),
        (p1), (c20:BusinessCapability {id: "bc-020"})
      CREATE 
        (c1)-[:OWNED_BY]->(p1),
        (c2)-[:OWNED_BY]->(p2),
        (c5)-[:OWNED_BY]->(p4),
        (c6)-[:OWNED_BY]->(p5),
        (c7)-[:OWNED_BY]->(p6),
        (c8)-[:OWNED_BY]->(p1),
        (c9)-[:OWNED_BY]->(p2),
        (c10)-[:OWNED_BY]->(p3),
        (c11)-[:OWNED_BY]->(p4),
        (c12)-[:OWNED_BY]->(p5),
        (c13)-[:OWNED_BY]->(p6),
        (c14)-[:OWNED_BY]->(p1),
        (c15)-[:OWNED_BY]->(p2),
        (c16)-[:OWNED_BY]->(p3),
        (c17)-[:OWNED_BY]->(p4),
        (c18)-[:OWNED_BY]->(p5),
        (c19)-[:OWNED_BY]->(p6),
        (c20)-[:OWNED_BY]->(p1)
    `)

    // Fehlende DataObject-Verantwortlichkeiten ergänzen
    await session.run(`
      MATCH 
        (p1:Person {id: "person-001"}), (d7:DataObject {id: "do-007"}),
        (p2:Person {id: "person-002"}), (d2:DataObject {id: "do-002"}), (d9:DataObject {id: "do-009"}),
        (p3:Person {id: "person-003"}), (d3:DataObject {id: "do-003"}), (d10:DataObject {id: "do-010"}),
        (p4:Person {id: "person-004"}), (d4:DataObject {id: "do-004"}),
        (p5:Person {id: "person-005"}), (d5:DataObject {id: "do-005"}),
        (p6:Person {id: "person-006"}), (d6:DataObject {id: "do-006"})
      CREATE 
        (d2)-[:OWNED_BY]->(p2),
        (d3)-[:OWNED_BY]->(p3),
        (d4)-[:OWNED_BY]->(p4),
        (d5)-[:OWNED_BY]->(p5),
        (d6)-[:OWNED_BY]->(p6),
        (d7)-[:OWNED_BY]->(p1),
        (d9)-[:OWNED_BY]->(p2),
        (d10)-[:OWNED_BY]->(p3)
    `)

    // Architecture-Entity Beziehungen
    await session.run(`
      MATCH 
        (arch1:Architecture {id: "arch-001"}), (a1:Application {id: "app-001"}),
        (arch1), (a3:Application {id: "app-003"}),
        (arch1), (c1:BusinessCapability {id: "bc-001"}),
        (arch2:Architecture {id: "arch-002"}), (a5:Application {id: "app-005"}),
        (arch2), (a12:Application {id: "app-012"}),
        (arch2), (c8:BusinessCapability {id: "bc-008"}),
        (arch3:Architecture {id: "arch-003"}), (a11:Application {id: "app-011"}),
        (arch3), (c18:BusinessCapability {id: "bc-018"}),
        (arch4:Architecture {id: "arch-004"}), (a3),
        (arch4), (a8:Application {id: "app-008"}),
        (arch5:Architecture {id: "arch-005"}), (a2:Application {id: "app-002"}),
        (arch5), (a4:Application {id: "app-004"})
      CREATE 
        (arch1)-[:CONTAINS]->(a1),
        (arch1)-[:CONTAINS]->(a3),
        (arch1)-[:CONTAINS]->(c1),
        (arch2)-[:CONTAINS]->(a5),
        (arch2)-[:CONTAINS]->(a12),
        (arch2)-[:CONTAINS]->(c8),
        (arch3)-[:CONTAINS]->(a11),
        (arch3)-[:CONTAINS]->(c18),
        (arch4)-[:CONTAINS]->(a3),
        (arch4)-[:CONTAINS]->(a8),
        (arch5)-[:CONTAINS]->(a2),
        (arch5)-[:CONTAINS]->(a4)
    `)

    // ArchitecturePrinciple-Architecture Beziehungen
    await session.run(`
      MATCH 
        (ap1:ArchitecturePrinciple {id: "ap-001"}), (arch1:Architecture {id: "arch-001"}),
        (ap1), (arch5:Architecture {id: "arch-005"}),
        (ap2:ArchitecturePrinciple {id: "ap-002"}), (arch2:Architecture {id: "arch-002"}),
        (ap2), (arch4:Architecture {id: "arch-004"}),
        (ap3:ArchitecturePrinciple {id: "ap-003"}), (arch3:Architecture {id: "arch-003"}),
        (ap3), (arch1),
        (ap4:ArchitecturePrinciple {id: "ap-004"}), (arch1),
        (ap4), (arch5),
        (ap5:ArchitecturePrinciple {id: "ap-005"}), (arch2),
        (ap5), (arch3),
        (ap7:ArchitecturePrinciple {id: "ap-007"}), (arch2),
        (ap7), (arch3),
        (ap8:ArchitecturePrinciple {id: "ap-008"}), (arch5),
        (ap11:ArchitecturePrinciple {id: "ap-011"}), (arch1),
        (ap12:ArchitecturePrinciple {id: "ap-012"}), (arch3),
        (ap15:ArchitecturePrinciple {id: "ap-015"}), (arch2),
        (ap17:ArchitecturePrinciple {id: "ap-017"}), (arch4)
      CREATE 
        (arch1)-[:APPLIES_PRINCIPLE]->(ap1),
        (arch5)-[:APPLIES_PRINCIPLE]->(ap1),
        (arch2)-[:APPLIES_PRINCIPLE]->(ap2),
        (arch4)-[:APPLIES_PRINCIPLE]->(ap2),
        (arch3)-[:APPLIES_PRINCIPLE]->(ap3),
        (arch1)-[:APPLIES_PRINCIPLE]->(ap3),
        (arch1)-[:APPLIES_PRINCIPLE]->(ap4),
        (arch5)-[:APPLIES_PRINCIPLE]->(ap4),
        (arch2)-[:APPLIES_PRINCIPLE]->(ap5),
        (arch3)-[:APPLIES_PRINCIPLE]->(ap5),
        (arch2)-[:APPLIES_PRINCIPLE]->(ap7),
        (arch3)-[:APPLIES_PRINCIPLE]->(ap7),
        (arch5)-[:APPLIES_PRINCIPLE]->(ap8),
        (arch1)-[:APPLIES_PRINCIPLE]->(ap11),
        (arch3)-[:APPLIES_PRINCIPLE]->(ap12),
        (arch2)-[:APPLIES_PRINCIPLE]->(ap15),
        (arch4)-[:APPLIES_PRINCIPLE]->(ap17)
    `)

    // ArchitecturePrinciple-Application Implementierungsbeziehungen
    await session.run(`
      MATCH 
        (ap1:ArchitecturePrinciple {id: "ap-001"}), (a1:Application {id: "app-001"}),
        (ap1), (a2:Application {id: "app-002"}),
        (ap1), (a5:Application {id: "app-005"}),
        (ap2:ArchitecturePrinciple {id: "ap-002"}), (a5),
        (ap2), (a9:Application {id: "app-009"}),
        (ap3:ArchitecturePrinciple {id: "ap-003"}), (a11:Application {id: "app-011"}),
        (ap3), (a1),
        (ap4:ArchitecturePrinciple {id: "ap-004"}), (a2),
        (ap4), (a3:Application {id: "app-003"}),
        (ap6:ArchitecturePrinciple {id: "ap-006"}), (a7:Application {id: "app-007"}),
        (ap7:ArchitecturePrinciple {id: "ap-007"}), (a5),
        (ap7), (a11),
        (ap8:ArchitecturePrinciple {id: "ap-008"}), (a1),
        (ap8), (a2),
        (ap11:ArchitecturePrinciple {id: "ap-011"}), (a1),
        (ap11), (a4:Application {id: "app-004"}),
        (ap12:ArchitecturePrinciple {id: "ap-012"}), (a11),
        (ap13:ArchitecturePrinciple {id: "ap-013"}), (a3),
        (ap13), (a5),
        (ap15:ArchitecturePrinciple {id: "ap-015"}), (a5),
        (ap15), (a12:Application {id: "app-012"}),
        (ap17:ArchitecturePrinciple {id: "ap-017"}), (a8:Application {id: "app-008"}),
        (ap19:ArchitecturePrinciple {id: "ap-019"}), (a1),
        (ap19), (a4)
      CREATE 
        (a1)-[:IMPLEMENTS_PRINCIPLE]->(ap1),
        (a2)-[:IMPLEMENTS_PRINCIPLE]->(ap1),
        (a5)-[:IMPLEMENTS_PRINCIPLE]->(ap1),
        (a5)-[:IMPLEMENTS_PRINCIPLE]->(ap2),
        (a9)-[:IMPLEMENTS_PRINCIPLE]->(ap2),
        (a11)-[:IMPLEMENTS_PRINCIPLE]->(ap3),
        (a1)-[:IMPLEMENTS_PRINCIPLE]->(ap3),
        (a2)-[:IMPLEMENTS_PRINCIPLE]->(ap4),
        (a3)-[:IMPLEMENTS_PRINCIPLE]->(ap4),
        (a7)-[:IMPLEMENTS_PRINCIPLE]->(ap6),
        (a5)-[:IMPLEMENTS_PRINCIPLE]->(ap7),
        (a11)-[:IMPLEMENTS_PRINCIPLE]->(ap7),
        (a1)-[:IMPLEMENTS_PRINCIPLE]->(ap8),
        (a2)-[:IMPLEMENTS_PRINCIPLE]->(ap8),
        (a1)-[:IMPLEMENTS_PRINCIPLE]->(ap11),
        (a4)-[:IMPLEMENTS_PRINCIPLE]->(ap11),
        (a11)-[:IMPLEMENTS_PRINCIPLE]->(ap12),
        (a3)-[:IMPLEMENTS_PRINCIPLE]->(ap13),
        (a5)-[:IMPLEMENTS_PRINCIPLE]->(ap13),
        (a5)-[:IMPLEMENTS_PRINCIPLE]->(ap15),
        (a12)-[:IMPLEMENTS_PRINCIPLE]->(ap15),
        (a8)-[:IMPLEMENTS_PRINCIPLE]->(ap17),
        (a1)-[:IMPLEMENTS_PRINCIPLE]->(ap19),
        (a4)-[:IMPLEMENTS_PRINCIPLE]->(ap19)
    `)

    console.log('Testdaten erfolgreich erstellt!')
    console.log('- 6 Personen')
    console.log('- 20 Business Capabilities (alle mit Verantwortlichen)')
    console.log('- 12 Applications (alle mit Verantwortlichen)')
    console.log('- 10 DataObjects (alle mit Verantwortlichen)')
    console.log('- 12 ApplicationInterfaces (all with source and target applications)')
    console.log('- 5 Infrastructure-Elemente (2 Cloud-DC, 2 On-Premise-DC, 1 Kubernetes-Cluster)')
    console.log('- 5 Architectures (alle mit Verantwortlichen)')
    console.log('- 20 ArchitecturePrinciples (alle mit Verantwortlichen)')
    console.log('- Vollständige Beziehungen zwischen allen Entitäten')
    console.log('- Alle Entitäten haben genau einen Verantwortlichen')
    console.log('- Infrastructure-Applikations-Beziehungen (HOSTS)')
  } catch (error) {
    console.error('Error creating test data:', error)
    throw error
  }
}

// Check if a reset parameter was passed
const resetArg = process.argv.includes('--reset')

// Execute script
initDatabase(resetArg)
  .then(() => {
    console.log('Datenbank-Initialisierung erfolgreich.')
    return closeDriver()
  })
  .catch(error => {
    console.error('Error during database initialization:', error)
    process.exit(1)
  })
