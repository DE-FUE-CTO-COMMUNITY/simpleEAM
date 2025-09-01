// Application Interfaces for Heat Pump Manufacturing Company
// Integration interfaces supporting IoT platform and enterprise applications

import { Session } from 'neo4j-driver'

export async function createHeatPumpApplicationInterfaces(session: Session): Promise<void> {
  console.log('Creating Application Interfaces for Heat Pump Manufacturing...')

  const query = `
    CREATE 
    // IoT Platform Interfaces
    (iotDeviceApi:ApplicationInterface {
      id: "hp-interface-iot-device-api",
      name: "IoT Device Management API",
      description: "RESTful API for managing heat pump IoT devices, configuration, and remote control",
      interfaceType: "API",
      protocol: "REST",
      version: "v2.1",
      status: "ACTIVE",
      introductionDate: date("2024-01-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (iotTelemetryApi:ApplicationInterface {
      id: "hp-interface-iot-telemetry-api",
      name: "IoT Telemetry Ingestion API",
      description: "High-throughput streaming API for real-time heat pump sensor data ingestion",
      interfaceType: "API",
      protocol: "TCP",
      version: "v1.5",
      status: "ACTIVE",
      introductionDate: date("2024-01-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (energyAnalyticsApi:ApplicationInterface {
      id: "hp-interface-energy-analytics-api",
      name: "Energy Analytics API",
      description: "API for retrieving energy consumption data, efficiency metrics, and optimization recommendations",
      interfaceType: "API",
      protocol: "REST",
      version: "v1.3",
      status: "ACTIVE",
      introductionDate: date("2024-02-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // ERP System Interfaces
    (erpCustomerApi:ApplicationInterface {
      id: "hp-interface-erp-customer-api",
      name: "ERP Customer Data API",
      description: "SOAP interface for customer master data synchronization with CRM and service systems",
      interfaceType: "API",
      protocol: "SOAP",
      version: "v3.0",
      status: "ACTIVE",
      introductionDate: date("2024-01-01"),
      throughput: "1,000 requests/minute",
      latency: "< 1000ms",
      securityLevel: "HIGH",
      rateLimiting: "200 calls/hour per system",
      documentation: "https://erp.thermo-dynamics.com/api/customer/wsdl",
      endpoint: "https://erp.thermo-dynamics.com/api/customer/v3",
      lastUpdated: date("2024-05-10"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (erpProductApi:ApplicationInterface {
      id: "hp-interface-erp-product-api",
      name: "ERP Product Information API",
      interfaceType: "API",
      description: "Product catalog, specifications, and bill of materials API for manufacturing and sales systems",
      protocol: "HTTPS",
      dataFormat: "JSON",
      authenticationMethod: "OAuth 2.0",
      version: "v2.5",
      status: "ACTIVE",
      availability: "99.7%",
      throughput: "2,000 requests/minute",
      latency: "< 300ms",
      securityLevel: "MEDIUM",
      rateLimiting: "1000 calls/hour per application",
      documentation: "https://api.thermo-dynamics.com/product/v2/docs",
      endpoint: "https://api.thermo-dynamics.com/product/v2",
      lastUpdated: date("2024-07-30"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (erpOrderApi:ApplicationInterface {
      id: "hp-interface-erp-order-api",
      name: "ERP Order Management API",
      interfaceType: "API",
      description: "Order processing, status tracking, and fulfillment API for sales and manufacturing integration",
      protocol: "HTTPS",
      dataFormat: "JSON",
      authenticationMethod: "OAuth 2.0",
      version: "v2.2",
      status: "ACTIVE",
      availability: "99.9%",
      throughput: "3,000 requests/minute",
      latency: "< 250ms",
      securityLevel: "HIGH",
      rateLimiting: "500 calls/hour per user",
      documentation: "https://api.thermo-dynamics.com/orders/v2/docs",
      endpoint: "https://api.thermo-dynamics.com/orders/v2",
      lastUpdated: date("2024-08-05"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // CRM System Interfaces
    (crmServiceApi:ApplicationInterface {
      id: "hp-interface-crm-service-api",
      name: "CRM Service Management API",
      interfaceType: "API",
      description: "Customer service case management, ticket routing, and resolution tracking API",
      protocol: "HTTPS",
      dataFormat: "JSON",
      authenticationMethod: "OAuth 2.0",
      version: "v1.8",
      status: "ACTIVE",
      availability: "99.6%",
      throughput: "1,500 requests/minute",
      latency: "< 400ms",
      securityLevel: "HIGH",
      rateLimiting: "300 calls/hour per agent",
      documentation: "https://api.thermo-dynamics.com/service/v1/docs",
      endpoint: "https://api.thermo-dynamics.com/service/v1",
      lastUpdated: date("2024-07-10"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (crmInstallerApi:ApplicationInterface {
      id: "hp-interface-crm-installer-api",
      name: "CRM Installer Portal API",
      interfaceType: "API",
      description: "API for certified installer access to product information, training materials, and support tools",
      protocol: "HTTPS",
      dataFormat: "JSON",
      authenticationMethod: "OAuth 2.0 + Certificate",
      version: "v1.4",
      status: "ACTIVE",
      availability: "99.4%",
      throughput: "800 requests/minute",
      latency: "< 600ms",
      securityLevel: "HIGH",
      rateLimiting: "200 calls/hour per installer",
      documentation: "https://installer.thermo-dynamics.com/api/docs",
      endpoint: "https://installer.thermo-dynamics.com/api/v1",
      lastUpdated: date("2024-06-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Manufacturing Interfaces
    (mesProductionApi:ApplicationInterface {
      id: "hp-interface-mes-production-api",
      name: "MES Production Control API",
      interfaceType: "API",
      description: "OPC UA interface for real-time production data exchange and manufacturing execution control",
      protocol: "TCP",
      dataFormat: "OPC UA",
      authenticationMethod: "X.509 Certificates",
      version: "v1.04",
      status: "ACTIVE",
      availability: "99.95%",
      throughput: "1,000 operations/second",
      latency: "< 100ms",
      securityLevel: "CRITICAL",
      rateLimiting: "No limit",
      documentation: "Internal MES documentation",
      endpoint: "opc.tcp://mes.thermo-dynamics.local:4840",
      lastUpdated: date("2024-07-20"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (qualityTestApi:ApplicationInterface {
      id: "hp-interface-quality-test-api",
      name: "Quality Testing Interface",
      interfaceType: "API",
      description: "API for automated quality testing equipment integration and test result management",
      protocol: "HTTPS",
      dataFormat: "JSON",
      authenticationMethod: "API Key",
      version: "v2.0",
      status: "ACTIVE",
      availability: "99.8%",
      throughput: "500 requests/minute",
      latency: "< 200ms",
      securityLevel: "HIGH",
      rateLimiting: "Unlimited for testing equipment",
      documentation: "https://quality.thermo-dynamics.com/api/docs",
      endpoint: "https://quality.thermo-dynamics.com/api/v2",
      lastUpdated: date("2024-08-10"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // External Partner Interfaces
    (supplierPortalApi:ApplicationInterface {
      id: "hp-interface-supplier-portal-api",
      name: "Supplier Portal API",
      interfaceType: "API",
      description: "B2B API for supplier integration, purchase orders, delivery schedules, and invoice processing",
      protocol: "HTTPS",
      dataFormat: "JSON",
      authenticationMethod: "OAuth 2.0 + API Key",
      version: "v1.6",
      status: "ACTIVE",
      availability: "99.5%",
      throughput: "1,200 requests/minute",
      latency: "< 800ms",
      securityLevel: "HIGH",
      rateLimiting: "100 calls/hour per supplier",
      documentation: "https://supplier.thermo-dynamics.com/api/docs",
      endpoint: "https://supplier.thermo-dynamics.com/api/v1",
      lastUpdated: date("2024-06-30"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (smartGridApi:ApplicationInterface {
      id: "hp-interface-smart-grid-api",
      name: "Smart Grid Integration API",
      interfaceType: "API",
      description: "API for smart grid communication, demand response, and energy market participation",
      protocol: "HTTPS",
      dataFormat: "JSON",
      authenticationMethod: "OAuth 2.0 + Digital Certificates",
      version: "v1.2",
      status: "IN_DEVELOPMENT",
      availability: "99.0%",
      throughput: "2,000 requests/minute",
      latency: "< 300ms",
      securityLevel: "CRITICAL",
      rateLimiting: "500 calls/hour per grid operator",
      documentation: "https://api.thermo-dynamics.com/grid/docs",
      endpoint: "https://api.thermo-dynamics.com/grid/v1",
      lastUpdated: date("2024-08-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Analytics and BI Interfaces
    (biReportingApi:ApplicationInterface {
      id: "hp-interface-bi-reporting-api",
      name: "Business Intelligence Reporting API",
      interfaceType: "API",
      description: "API for business intelligence data access, report generation, and dashboard integration",
      protocol: "HTTPS",
      dataFormat: "JSON",
      authenticationMethod: "OAuth 2.0",
      version: "v1.7",
      status: "ACTIVE",
      availability: "99.3%",
      throughput: "800 requests/minute",
      latency: "< 1500ms",
      securityLevel: "MEDIUM",
      rateLimiting: "50 calls/hour per user",
      documentation: "https://bi.thermo-dynamics.com/api/docs",
      endpoint: "https://bi.thermo-dynamics.com/api/v1",
      lastUpdated: date("2024-07-25"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (dataExportApi:ApplicationInterface {
      id: "hp-interface-data-export-api",
      name: "Data Export API",
      interfaceType: "API",
      description: "Bulk data export API for data warehousing, backup, and regulatory compliance reporting",
      protocol: "HTTPS",
      dataFormat: "JSON/CSV",
      authenticationMethod: "OAuth 2.0 + Admin Role",
      version: "v1.1",
      status: "ACTIVE",
      availability: "99.2%",
      throughput: "100 requests/minute",
      latency: "< 5000ms",
      securityLevel: "HIGH",
      rateLimiting: "10 calls/hour per admin",
      documentation: "https://api.thermo-dynamics.com/export/docs",
      endpoint: "https://api.thermo-dynamics.com/export/v1",
      lastUpdated: date("2024-05-20"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Mobile and Customer Interfaces
    (mobileCustomerApi:ApplicationInterface {
      id: "hp-interface-mobile-customer-api",
      name: "Mobile Customer App API",
      interfaceType: "API",
      description: "Mobile-optimized API for customer app providing heat pump control and monitoring",
      protocol: "HTTPS",
      dataFormat: "JSON",
      authenticationMethod: "OAuth 2.0 + Biometric",
      version: "v2.3",
      status: "ACTIVE",
      availability: "99.7%",
      throughput: "5,000 requests/minute",
      latency: "< 300ms",
      securityLevel: "HIGH",
      rateLimiting: "1000 calls/hour per customer",
      documentation: "https://app.thermo-dynamics.com/api/docs",
      endpoint: "https://app.thermo-dynamics.com/api/v2",
      lastUpdated: date("2024-08-12"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (technicalSupportApi:ApplicationInterface {
      id: "hp-interface-technical-support-api",
      name: "Technical Support API",
      interfaceType: "API",
      description: "API for field technicians providing diagnostic tools, manuals, and remote assistance",
      protocol: "HTTPS",
      dataFormat: "JSON",
      authenticationMethod: "OAuth 2.0 + Employee ID",
      version: "v1.9",
      status: "ACTIVE",
      availability: "99.6%",
      throughput: "1,000 requests/minute",
      latency: "< 400ms",
      securityLevel: "HIGH",
      rateLimiting: "500 calls/hour per technician",
      documentation: "https://support.thermo-dynamics.com/api/docs",
      endpoint: "https://support.thermo-dynamics.com/api/v1",
      lastUpdated: date("2024-07-05"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  try {
    await session.run(query)
    console.log('Application Interfaces created successfully.')
  } catch (error) {
    console.error('Error creating application interfaces:', error)
    throw error
  }
}

export async function createHeatPumpApplicationInterfaceOwnership(session: Session): Promise<void> {
  console.log('Creating Application Interface ownership relationships...')

  await session.run(`
    MATCH 
      (cto:Person {id: "hp-person-cto"}),
      (cio:Person {id: "hp-person-cio"}),
      (itManager:Person {id: "hp-person-it-manager"}),
      (iotSpecialist:Person {id: "hp-person-iot-specialist"}),
      (mfgDirector:Person {id: "hp-person-manufacturing-director"}),
      (salesDirector:Person {id: "hp-person-sales-director"}),
      (serviceDirector:Person {id: "hp-person-service-director"}),
      (productManager:Person {id: "hp-person-product-manager"}),
      (qualityManager:Person {id: "hp-person-quality-manager"}),

      (iotDeviceApi:ApplicationInterface {id: "hp-interface-iot-device-api"}),
      (iotTelemetryApi:ApplicationInterface {id: "hp-interface-iot-telemetry-api"}),
      (energyAnalyticsApi:ApplicationInterface {id: "hp-interface-energy-analytics-api"}),
      (erpCustomerApi:ApplicationInterface {id: "hp-interface-erp-customer-api"}),
      (erpProductApi:ApplicationInterface {id: "hp-interface-erp-product-api"}),
      (erpOrderApi:ApplicationInterface {id: "hp-interface-erp-order-api"}),
      (crmServiceApi:ApplicationInterface {id: "hp-interface-crm-service-api"}),
      (crmInstallerApi:ApplicationInterface {id: "hp-interface-crm-installer-api"}),
      (mesProductionApi:ApplicationInterface {id: "hp-interface-mes-production-api"}),
      (qualityTestApi:ApplicationInterface {id: "hp-interface-quality-test-api"}),
      (supplierPortalApi:ApplicationInterface {id: "hp-interface-supplier-portal-api"}),
      (smartGridApi:ApplicationInterface {id: "hp-interface-smart-grid-api"}),
      (biReportingApi:ApplicationInterface {id: "hp-interface-bi-reporting-api"}),
      (dataExportApi:ApplicationInterface {id: "hp-interface-data-export-api"}),
      (mobileCustomerApi:ApplicationInterface {id: "hp-interface-mobile-customer-api"}),
      (technicalSupportApi:ApplicationInterface {id: "hp-interface-technical-support-api"})

    CREATE
      // CTO ownership - Strategic APIs
      (iotDeviceApi)-[:OWNED_BY]->(cto),
      (energyAnalyticsApi)-[:OWNED_BY]->(cto),
      (smartGridApi)-[:OWNED_BY]->(cto),
      
      // CIO ownership - Enterprise Integration APIs
      (erpCustomerApi)-[:OWNED_BY]->(cio),
      (erpProductApi)-[:OWNED_BY]->(cio),
      (erpOrderApi)-[:OWNED_BY]->(cio),
      (biReportingApi)-[:OWNED_BY]->(cio),
      (dataExportApi)-[:OWNED_BY]->(cio),
      
      // IT Manager ownership - Operational APIs
      (erpCustomerApi)-[:OWNED_BY]->(itManager),
      (biReportingApi)-[:OWNED_BY]->(itManager),
      (dataExportApi)-[:OWNED_BY]->(itManager),
      
      // IoT Specialist ownership
      (iotDeviceApi)-[:OWNED_BY]->(iotSpecialist),
      (iotTelemetryApi)-[:OWNED_BY]->(iotSpecialist),
      (energyAnalyticsApi)-[:OWNED_BY]->(iotSpecialist),
      
      // Manufacturing Director ownership
      (mesProductionApi)-[:OWNED_BY]->(mfgDirector),
      (supplierPortalApi)-[:OWNED_BY]->(mfgDirector),
      
      // Sales Director ownership
      (erpOrderApi)-[:OWNED_BY]->(salesDirector),
      (crmInstallerApi)-[:OWNED_BY]->(salesDirector),
      (supplierPortalApi)-[:OWNED_BY]->(salesDirector),
      
      // Service Director ownership
      (crmServiceApi)-[:OWNED_BY]->(serviceDirector),
      (technicalSupportApi)-[:OWNED_BY]->(serviceDirector),
      (mobileCustomerApi)-[:OWNED_BY]->(serviceDirector),
      
      // Product Manager ownership
      (erpProductApi)-[:OWNED_BY]->(productManager),
      (mobileCustomerApi)-[:OWNED_BY]->(productManager),
      
      // Quality Manager ownership
      (qualityTestApi)-[:OWNED_BY]->(qualityManager)
  `)

  console.log('Application Interface ownership relationships created successfully.')
}

export async function createHeatPumpApplicationInterfaceConnections(
  session: Session
): Promise<void> {
  console.log('Creating Application-Interface connections...')

  await session.run(`
    MATCH 
      // Applications
      (iotPlatform:Application {id: "hp-app-iot-platform"}),
      (energyAnalytics:Application {id: "hp-app-energy-analytics"}),
      (erpSystem:Application {id: "hp-app-erp-system"}),
      (crmSystem:Application {id: "hp-app-crm-system"}),
      (mesSystem:Application {id: "hp-app-mes-system"}),
      (qualityManagement:Application {id: "hp-app-quality-management"}),
      (supplierPortal:Application {id: "hp-app-supplier-portal"}),
      (biPlatform:Application {id: "hp-app-bi-platform"}),
      (customerPortal:Application {id: "hp-app-customer-portal"}),
      (fieldServiceApp:Application {id: "hp-app-field-service"}),
      
      // Interfaces
      (iotDeviceApi:ApplicationInterface {id: "hp-interface-iot-device-api"}),
      (iotTelemetryApi:ApplicationInterface {id: "hp-interface-iot-telemetry-api"}),
      (energyAnalyticsApi:ApplicationInterface {id: "hp-interface-energy-analytics-api"}),
      (erpCustomerApi:ApplicationInterface {id: "hp-interface-erp-customer-api"}),
      (erpProductApi:ApplicationInterface {id: "hp-interface-erp-product-api"}),
      (erpOrderApi:ApplicationInterface {id: "hp-interface-erp-order-api"}),
      (crmServiceApi:ApplicationInterface {id: "hp-interface-crm-service-api"}),
      (crmInstallerApi:ApplicationInterface {id: "hp-interface-crm-installer-api"}),
      (mesProductionApi:ApplicationInterface {id: "hp-interface-mes-production-api"}),
      (qualityTestApi:ApplicationInterface {id: "hp-interface-quality-test-api"}),
      (supplierPortalApi:ApplicationInterface {id: "hp-interface-supplier-portal-api"}),
      (smartGridApi:ApplicationInterface {id: "hp-interface-smart-grid-api"}),
      (biReportingApi:ApplicationInterface {id: "hp-interface-bi-reporting-api"}),
      (dataExportApi:ApplicationInterface {id: "hp-interface-data-export-api"}),
      (mobileCustomerApi:ApplicationInterface {id: "hp-interface-mobile-customer-api"}),
      (technicalSupportApi:ApplicationInterface {id: "hp-interface-technical-support-api"})

    CREATE
      // IoT Platform provides interfaces
      (iotPlatform)-[:PROVIDES]->(iotDeviceApi),
      (iotPlatform)-[:PROVIDES]->(iotTelemetryApi),
      
      // Energy Analytics provides interface
      (energyAnalytics)-[:PROVIDES]->(energyAnalyticsApi),
      
      // ERP System provides interfaces
      (erpSystem)-[:PROVIDES]->(erpCustomerApi),
      (erpSystem)-[:PROVIDES]->(erpProductApi),
      (erpSystem)-[:PROVIDES]->(erpOrderApi),
      
      // CRM System provides interfaces
      (crmSystem)-[:PROVIDES]->(crmServiceApi),
      (crmSystem)-[:PROVIDES]->(crmInstallerApi),
      
      // MES System provides interface
      (mesSystem)-[:PROVIDES]->(mesProductionApi),
      
      // Quality Management provides interface
      (qualityManagement)-[:PROVIDES]->(qualityTestApi),
      
      // Supplier Portal provides interface
      (supplierPortal)-[:PROVIDES]->(supplierPortalApi),
      
      // BI Platform provides interfaces
      (biPlatform)-[:PROVIDES]->(biReportingApi),
      (biPlatform)-[:PROVIDES]->(dataExportApi),
      
      // Customer Portal provides interface
      (customerPortal)-[:PROVIDES]->(mobileCustomerApi),
      
      // Field Service provides interface
      (fieldServiceApp)-[:PROVIDES]->(technicalSupportApi),
      
      // IoT Platform also provides Smart Grid interface
      (iotPlatform)-[:PROVIDES]->(smartGridApi),
      
      // Cross-application interface consumption
      (crmSystem)-[:CONSUMES]->(erpCustomerApi),
      (customerPortal)-[:CONSUMES]->(iotDeviceApi),
      (customerPortal)-[:CONSUMES]->(energyAnalyticsApi),
      (fieldServiceApp)-[:CONSUMES]->(erpProductApi),
      (fieldServiceApp)-[:CONSUMES]->(crmServiceApi),
      (biPlatform)-[:CONSUMES]->(erpOrderApi),
      (biPlatform)-[:CONSUMES]->(mesProductionApi),
      (energyAnalytics)-[:CONSUMES]->(iotTelemetryApi),
      (supplierPortal)-[:CONSUMES]->(erpOrderApi),
      (mesSystem)-[:CONSUMES]->(erpProductApi)
  `)

  console.log('Application-Interface connections created successfully.')
}
