// Applications for Heat Pump Manufacturing Company
// Core business applications supporting HVAC manufacturing operations

import { Session } from 'neo4j-driver'

export async function createHeatPumpApplications(session: Session): Promise<void> {
  console.log('Creating Applications for Heat Pump Manufacturing...')

  const query = `
    CREATE 
    // ERP & Core Business Systems
    (sapS4:Application {
      id: "hp-app-sap-s4hana",
      name: "SAP S/4HANA",
      description: "Enterprise Resource Planning system for financial management, procurement, and operations",
      status: "ACTIVE",
      criticality: "CRITICAL",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["SAP HANA", "ABAP", "SAP Fiori"],
      version: "2023",
      hostingEnvironment: "On-Premise",
      vendor: "SAP",
      costs: 850000.0,
      introductionDate: date("2022-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Manufacturing Systems
    (hvacMES:Application {
      id: "hp-app-hvac-mes",
      name: "HVAC Manufacturing Execution System",
      description: "Manufacturing execution system specifically designed for HVAC equipment production",
      status: "ACTIVE",
      criticality: "CRITICAL",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Java", "Spring Boot", "PostgreSQL", "REST APIs"],
      version: "3.2",
      hostingEnvironment: "Private Cloud",
      vendor: "HVAC Solutions Inc",
      costs: 420000.0,
      introductionDate: date("2021-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (thermalCAD:Application {
      id: "hp-app-thermal-cad",
      name: "ThermalCAD Pro",
      description: "Specialized CAD system for thermal system design and heat exchanger modeling",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["C++", "OpenGL", "CAD Engine"],
      version: "2024.1",
      hostingEnvironment: "On-Premise",
      vendor: "ThermalSoft",
      costs: 180000.0,
      introductionDate: date("2020-03-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (qualityMgmtSys:Application {
      id: "hp-app-quality-management",
      name: "Quality Management System",
      description: "Integrated quality management and compliance tracking system",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: [".NET Core", "SQL Server", "Angular"],
      version: "5.1",
      hostingEnvironment: "Azure Cloud",
      vendor: "QualityFirst Solutions",
      costs: 95000.0,
      introductionDate: date("2021-09-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // IoT & Monitoring
    (iotPlatform:Application {
      id: "hp-app-iot-platform",
      name: "ThermoDynamics IoT Platform",
      description: "IoT platform for remote monitoring and control of heat pump systems",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "REPLATFORM",
      technologyStack: ["Node.js", "MongoDB", "MQTT", "InfluxDB", "Grafana"],
      version: "2.3",
      hostingEnvironment: "AWS Cloud",
      vendor: "Custom Development",
      costs: 320000.0,
      introductionDate: date("2022-11-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (energyAnalytics:Application {
      id: "hp-app-energy-analytics",
      name: "Energy Analytics Suite",
      description: "Advanced analytics for energy efficiency optimization and performance monitoring",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "REPLATFORM",
      technologyStack: ["Python", "Apache Spark", "TensorFlow", "Elasticsearch"],
      version: "1.8",
      hostingEnvironment: "AWS Cloud",
      vendor: "Custom Development",
      costs: 220000.0,
      introductionDate: date("2023-02-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // CRM & Sales
    (crmSystem:Application {
      id: "hp-app-crm-salesforce",
      name: "Salesforce CRM",
      description: "Customer relationship management for sales and customer service",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Salesforce Platform", "Apex", "Lightning Web Components"],
      version: "Summer '24",
      hostingEnvironment: "Salesforce Cloud",
      vendor: "Salesforce",
      costs: 150000.0,
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (channelPortal:Application {
      id: "hp-app-installer-portal",
      name: "Installer Channel Portal",
      description: "Web portal for certified installers and distribution partners",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "REFACTOR",
      technologyStack: ["React", "Node.js", "PostgreSQL", "Docker"],
      version: "3.0",
      hostingEnvironment: "Azure Cloud",
      vendor: "Custom Development",
      costs: 180000.0,
      introductionDate: date("2021-04-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Service & Support
    (serviceManagement:Application {
      id: "hp-app-service-management",
      name: "Field Service Management",
      description: "Mobile-enabled field service management for installation and maintenance",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["ServiceNow", "Mobile Apps", "GPS Integration"],
      version: "Vancouver",
      hostingEnvironment: "ServiceNow Cloud",
      vendor: "ServiceNow",
      costs: 200000.0,
      introductionDate: date("2022-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (diagnosticTool:Application {
      id: "hp-app-diagnostic-tool",
      name: "Heat Pump Diagnostic Tool",
      description: "Mobile diagnostic application for technicians and service engineers",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Flutter", "Firebase", "Bluetooth", "REST APIs"],
      version: "2.1",
      hostingEnvironment: "Firebase",
      vendor: "Custom Development",
      costs: 85000.0,
      introductionDate: date("2023-01-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Analytics & Business Intelligence
    (powerBI:Application {
      id: "hp-app-power-bi",
      name: "Microsoft Power BI",
      description: "Business intelligence and analytics platform for operational dashboards",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Power BI", "DAX", "Power Query"],
      version: "2024",
      hostingEnvironment: "Microsoft Cloud",
      vendor: "Microsoft",
      costs: 45000.0,
      introductionDate: date("2021-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Infrastructure & IT
    (office365:Application {
      id: "hp-app-office365",
      name: "Microsoft 365",
      description: "Office productivity suite and collaboration platform",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Office 365", "SharePoint", "Teams", "Exchange"],
      version: "2024",
      hostingEnvironment: "Microsoft Cloud",
      vendor: "Microsoft",
      costs: 120000.0,
      introductionDate: date("2019-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Legacy Systems
    (legacyPLM:Application {
      id: "hp-app-legacy-plm",
      name: "Legacy PLM System",
      description: "Older product lifecycle management system for R&D documentation",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "MIGRATE",
      sevenRStrategy: "REPLACE",
      technologyStack: ["Oracle", "Java EE", "Legacy Framework"],
      version: "8.2",
      hostingEnvironment: "On-Premise",
      vendor: "Legacy Vendor",
      costs: 75000.0,
      introductionDate: date("2015-01-01"),
      endOfLifeDate: date("2025-12-31"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  try {
    await session.run(query)
    console.log('Applications created successfully.')
  } catch (error) {
    console.error('Error creating applications:', error)
    throw error
  }
}

export async function createHeatPumpApplicationOwnership(session: Session): Promise<void> {
  console.log('Creating Application Ownership relationships...')

  await session.run(`
    MATCH 
      (cfo:Person {id: "hp-person-cfo"}),
      (cto:Person {id: "hp-person-cto"}),
      (cio:Person {id: "hp-person-cio"}),
      (mfgDirector:Person {id: "hp-person-manufacturing-director"}),
      (qualityManager:Person {id: "hp-person-quality-manager"}),
      (salesDirector:Person {id: "hp-person-sales-director"}),
      (serviceDirector:Person {id: "hp-person-service-director"}),
      (itManager:Person {id: "hp-person-it-manager"}),
      (rdDirector:Person {id: "hp-person-rd-director"}),

      (sapS4:Application {id: "hp-app-sap-s4hana"}),
      (hvacMES:Application {id: "hp-app-hvac-mes"}),
      (thermalCAD:Application {id: "hp-app-thermal-cad"}),
      (qualityMgmtSys:Application {id: "hp-app-quality-management"}),
      (iotPlatform:Application {id: "hp-app-iot-platform"}),
      (energyAnalytics:Application {id: "hp-app-energy-analytics"}),
      (crmSystem:Application {id: "hp-app-crm-salesforce"}),
      (channelPortal:Application {id: "hp-app-installer-portal"}),
      (serviceManagement:Application {id: "hp-app-service-management"}),
      (diagnosticTool:Application {id: "hp-app-diagnostic-tool"}),
      (powerBI:Application {id: "hp-app-power-bi"}),
      (office365:Application {id: "hp-app-office365"}),
      (legacyPLM:Application {id: "hp-app-legacy-plm"})

    CREATE
      // CFO ownership
      (sapS4)-[:OWNED_BY]->(cfo),
      (powerBI)-[:OWNED_BY]->(cfo),
      
      // CTO ownership
      (thermalCAD)-[:OWNED_BY]->(cto),
      (iotPlatform)-[:OWNED_BY]->(cto),
      (energyAnalytics)-[:OWNED_BY]->(cto),
      (legacyPLM)-[:OWNED_BY]->(cto),
      
      // CIO ownership
      (office365)-[:OWNED_BY]->(cio),
      
      // Manufacturing Director ownership
      (hvacMES)-[:OWNED_BY]->(mfgDirector),
      
      // Quality Manager ownership
      (qualityMgmtSys)-[:OWNED_BY]->(qualityManager),
      
      // Sales Director ownership
      (crmSystem)-[:OWNED_BY]->(salesDirector),
      (channelPortal)-[:OWNED_BY]->(salesDirector),
      
      // Service Director ownership
      (serviceManagement)-[:OWNED_BY]->(serviceDirector),
      (diagnosticTool)-[:OWNED_BY]->(serviceDirector),
      
      // IT Manager additional ownership
      (iotPlatform)-[:OWNED_BY]->(itManager),
      (energyAnalytics)-[:OWNED_BY]->(itManager)
  `)

  console.log('Application ownership relationships created successfully.')
}
