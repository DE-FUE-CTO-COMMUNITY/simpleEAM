// Data Objects for Heat Pump Manufacturing Company
// Core data architecture supporting HVAC manufacturing and IoT operations

import { Session } from 'neo4j-driver'

export async function createHeatPumpDataObjects(session: Session): Promise<void> {
  console.log('Creating Data Objects for Heat Pump Manufacturing...')

  const query = `
    CREATE 
    // Product & Engineering Data
    (productSpecs:DataObject {
      id: "hp-data-product-specifications",
      name: "Heat Pump Product Specifications",
      description: "Technical specifications, performance data, and configuration details for all heat pump models",
      classification: "CONFIDENTIAL",
      format: "Structured/JSON",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (thermalModels:DataObject {
      id: "hp-data-thermal-models",
      name: "Thermal System Models",
      description: "CAD models, thermal calculations, and simulation data for heat pump components",
      classification: "STRICTLY_CONFIDENTIAL",
      format: "CAD Files/Binary",
      introductionDate: date("2019-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (refrigerantData:DataObject {
      id: "hp-data-refrigerant-properties",
      name: "Refrigerant Properties Database",
      description: "Thermodynamic properties, environmental data, and regulatory information for refrigerants",
      classification: "CONFIDENTIAL",
      format: "Database/CSV",
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (testResults:DataObject {
      id: "hp-data-test-results",
      name: "Performance Test Results",
      description: "Laboratory and field test results, efficiency measurements, and certification data",
      classification: "CONFIDENTIAL",
      format: "Structured/XML",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Manufacturing Data
    (bomData:DataObject {
      id: "hp-data-bill-of-materials",
      name: "Bill of Materials",
      description: "Complete BOM for all heat pump models including components, quantities, and suppliers",
      classification: "CONFIDENTIAL",
      format: "Structured/ERP",
      introductionDate: date("2019-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (qualityRecords:DataObject {
      id: "hp-data-quality-records",
      name: "Quality Control Records",
      description: "Quality inspection results, defect tracking, and compliance documentation",
      classification: "INTERNAL",
      format: "Structured/Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (productionData:DataObject {
      id: "hp-data-production-metrics",
      name: "Production Metrics",
      description: "Manufacturing KPIs, throughput data, and operational efficiency metrics",
      classification: "INTERNAL",
      format: "Time Series/InfluxDB",
      introductionDate: date("2021-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (supplierData:DataObject {
      id: "hp-data-supplier-information",
      name: "Supplier Information",
      description: "Supplier master data, contracts, performance metrics, and qualification records",
      classification: "CONFIDENTIAL",
      format: "Structured/Database",
      introductionDate: date("2019-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // IoT & Sensor Data
    (sensorData:DataObject {
      id: "hp-data-sensor-telemetry",
      name: "Heat Pump Sensor Telemetry",
      description: "Real-time sensor data from installed heat pump systems including temperatures, pressures, and flow rates",
      classification: "INTERNAL",
      format: "Time Series/MQTT",
      introductionDate: date("2022-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (energyMetrics:DataObject {
      id: "hp-data-energy-consumption",
      name: "Energy Consumption Data",
      description: "Energy usage patterns, efficiency metrics, and performance analytics from customer installations",
      classification: "CONFIDENTIAL",
      format: "Time Series/InfluxDB",
      introductionDate: date("2022-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (diagnosticData:DataObject {
      id: "hp-data-diagnostic-logs",
      name: "System Diagnostic Logs",
      description: "Error logs, maintenance alerts, and diagnostic information from heat pump controllers",
      classification: "INTERNAL",
      format: "Log Files/JSON",
      introductionDate: date("2022-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (weatherData:DataObject {
      id: "hp-data-weather-conditions",
      name: "Weather Condition Data",
      description: "Local weather data for performance correlation and system optimization",
      classification: "PUBLIC",
      format: "API/JSON",
      introductionDate: date("2022-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Customer & Sales Data
    (customerProfiles:DataObject {
      id: "hp-data-customer-profiles",
      name: "Customer Profiles",
      description: "Customer master data, preferences, and installation history",
      classification: "CONFIDENTIAL",
      format: "CRM/Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (salesData:DataObject {
      id: "hp-data-sales-transactions",
      name: "Sales Transaction Data",
      description: "Sales orders, pricing, and transaction history",
      classification: "CONFIDENTIAL",
      format: "ERP/Database",
      introductionDate: date("2019-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (marketData:DataObject {
      id: "hp-data-market-intelligence",
      name: "Market Intelligence Data",
      description: "Market trends, competitor analysis, and industry benchmarks",
      classification: "CONFIDENTIAL",
      format: "Reports/Analytics",
      introductionDate: date("2021-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Service & Support Data
    (serviceTickets:DataObject {
      id: "hp-data-service-tickets",
      name: "Service Ticket Data",
      description: "Customer service requests, issue tracking, and resolution history",
      classification: "CONFIDENTIAL",
      format: "ServiceNow/Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (installationData:DataObject {
      id: "hp-data-installation-records",
      name: "Installation Records",
      description: "Installation documentation, commissioning reports, and site information",
      classification: "CONFIDENTIAL",
      format: "Documents/PDF",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (maintenanceSchedules:DataObject {
      id: "hp-data-maintenance-schedules",
      name: "Maintenance Schedules",
      description: "Preventive maintenance plans, service intervals, and maintenance history",
      classification: "INTERNAL",
      format: "Calendar/Database",
      introductionDate: date("2021-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Financial & Business Data
    (financialData:DataObject {
      id: "hp-data-financial-reports",
      name: "Financial Reports",
      description: "P&L statements, cost accounting, and financial analytics",
      classification: "STRICTLY_CONFIDENTIAL",
      format: "ERP/Reports",
      introductionDate: date("2019-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (costData:DataObject {
      id: "hp-data-cost-analysis",
      name: "Cost Analysis Data",
      description: "Product costing, margin analysis, and cost optimization data",
      classification: "CONFIDENTIAL",
      format: "Analytics/Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Compliance & Sustainability Data
    (complianceData:DataObject {
      id: "hp-data-compliance-records",
      name: "Regulatory Compliance Records",
      description: "Certification documents, regulatory filings, and compliance tracking",
      classification: "CONFIDENTIAL",
      format: "Documents/Database",
      introductionDate: date("2019-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (sustainabilityMetrics:DataObject {
      id: "hp-data-sustainability-metrics",
      name: "Sustainability Metrics",
      description: "Carbon footprint data, environmental impact assessments, and sustainability KPIs",
      classification: "INTERNAL",
      format: "Analytics/Dashboard",
      introductionDate: date("2021-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Training & Knowledge Data
    (trainingMaterials:DataObject {
      id: "hp-data-training-materials",
      name: "Training Materials",
      description: "Technical documentation, training videos, and certification materials for installers",
      classification: "INTERNAL",
      format: "Documents/Media",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (knowledgeBase:DataObject {
      id: "hp-data-knowledge-base",
      name: "Technical Knowledge Base",
      description: "Technical articles, troubleshooting guides, and best practices documentation",
      classification: "INTERNAL",
      format: "Wiki/HTML",
      introductionDate: date("2021-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  try {
    await session.run(query)
    console.log('Data Objects created successfully.')
  } catch (error) {
    console.error('Error creating data objects:', error)
    throw error
  }
}

export async function createHeatPumpDataObjectOwnership(session: Session): Promise<void> {
  console.log('Creating Data Object Ownership relationships...')

  await session.run(`
    MATCH 
      (cto:Person {id: "hp-person-cto"}),
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

      (productSpecs:DataObject {id: "hp-data-product-specifications"}),
      (thermalModels:DataObject {id: "hp-data-thermal-models"}),
      (refrigerantData:DataObject {id: "hp-data-refrigerant-properties"}),
      (testResults:DataObject {id: "hp-data-test-results"}),
      (bomData:DataObject {id: "hp-data-bill-of-materials"}),
      (qualityRecords:DataObject {id: "hp-data-quality-records"}),
      (productionData:DataObject {id: "hp-data-production-metrics"}),
      (supplierData:DataObject {id: "hp-data-supplier-information"}),
      (sensorData:DataObject {id: "hp-data-sensor-telemetry"}),
      (energyMetrics:DataObject {id: "hp-data-energy-consumption"}),
      (diagnosticData:DataObject {id: "hp-data-diagnostic-logs"}),
      (weatherData:DataObject {id: "hp-data-weather-conditions"}),
      (customerProfiles:DataObject {id: "hp-data-customer-profiles"}),
      (salesData:DataObject {id: "hp-data-sales-transactions"}),
      (marketData:DataObject {id: "hp-data-market-intelligence"}),
      (serviceTickets:DataObject {id: "hp-data-service-tickets"}),
      (installationData:DataObject {id: "hp-data-installation-records"}),
      (maintenanceSchedules:DataObject {id: "hp-data-maintenance-schedules"}),
      (financialData:DataObject {id: "hp-data-financial-reports"}),
      (costData:DataObject {id: "hp-data-cost-analysis"}),
      (complianceData:DataObject {id: "hp-data-compliance-records"}),
      (sustainabilityMetrics:DataObject {id: "hp-data-sustainability-metrics"}),
      (trainingMaterials:DataObject {id: "hp-data-training-materials"}),
      (knowledgeBase:DataObject {id: "hp-data-knowledge-base"})

    CREATE
      // CTO ownership - Technical Data
      (productSpecs)-[:OWNED_BY]->(cto),
      (thermalModels)-[:OWNED_BY]->(cto),
      (testResults)-[:OWNED_BY]->(cto),
      
      // CFO ownership - Financial Data
      (financialData)-[:OWNED_BY]->(cfo),
      (costData)-[:OWNED_BY]->(cfo),
      
      // CIO ownership - IT & System Data
      (sensorData)-[:OWNED_BY]->(cio),
      (diagnosticData)-[:OWNED_BY]->(cio),
      (weatherData)-[:OWNED_BY]->(cio),
      
      // R&D Director ownership
      (thermalModels)-[:OWNED_BY]->(rdDirector),
      (testResults)-[:OWNED_BY]->(rdDirector),
      
      // Specialist ownership
      (thermalModels)-[:OWNED_BY]->(thermalEngineer),
      (refrigerantData)-[:OWNED_BY]->(refrigerantSpecialist),
      
      // Manufacturing Director ownership
      (bomData)-[:OWNED_BY]->(mfgDirector),
      (productionData)-[:OWNED_BY]->(mfgDirector),
      (supplierData)-[:OWNED_BY]->(mfgDirector),
      
      // Quality Manager ownership
      (qualityRecords)-[:OWNED_BY]->(qualityManager),
      (complianceData)-[:OWNED_BY]->(qualityManager),
      
      // Sales Director ownership
      (customerProfiles)-[:OWNED_BY]->(salesDirector),
      (salesData)-[:OWNED_BY]->(salesDirector),
      (marketData)-[:OWNED_BY]->(salesDirector),
      
      // Product Manager ownership
      (productSpecs)-[:OWNED_BY]->(productManager),
      (marketData)-[:OWNED_BY]->(productManager),
      
      // Service Director ownership
      (serviceTickets)-[:OWNED_BY]->(serviceDirector),
      (installationData)-[:OWNED_BY]->(serviceDirector),
      (maintenanceSchedules)-[:OWNED_BY]->(serviceDirector),
      (trainingMaterials)-[:OWNED_BY]->(serviceDirector),
      (knowledgeBase)-[:OWNED_BY]->(serviceDirector),
      
      // IT Manager additional ownership
      (energyMetrics)-[:OWNED_BY]->(itManager),
      
      // Sustainability Manager ownership
      (sustainabilityMetrics)-[:OWNED_BY]->(sustainabilityManager),
      (energyMetrics)-[:OWNED_BY]->(sustainabilityManager)
  `)

  console.log('Data Object ownership relationships created successfully.')
}
