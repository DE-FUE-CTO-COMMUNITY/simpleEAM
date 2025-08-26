// Application Interfaces for Solar Panel Manufacturing Company
// Interfaces between applications with data transfer specifications

import { Session } from 'neo4j-driver'

export async function createApplicationInterfaces(session: Session) {
  console.log('Creating Application Interfaces for Solar Panel Manufacturing...')

  await session.run(`
    CREATE 
    // ===== ERP TO CRM INTEGRATION =====
    (sap_to_salesforce:ApplicationInterface {
      id: "interface-sap-to-salesforce",
      name: "SAP to Salesforce Customer Sync",
      description: "Synchronizes customer master data and sales orders between SAP S/4HANA and Salesforce",
      interfaceType: "API",
      protocol: "REST",
      version: "2.1",
      status: "ACTIVE",
      introductionDate: date("2022-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== CRM TO MARKETING INTEGRATION =====
    (salesforce_to_hubspot:ApplicationInterface {
      id: "interface-salesforce-to-hubspot",
      name: "Salesforce to HubSpot Lead Transfer",
      description: "Transfers qualified leads from HubSpot to Salesforce and syncs customer data",
      interfaceType: "API",
      protocol: "REST",
      version: "1.5",
      status: "ACTIVE",
      introductionDate: date("2021-05-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== ERP TO MANUFACTURING INTEGRATION =====
    (sap_to_mes:ApplicationInterface {
      id: "interface-sap-to-mes",
      name: "SAP to MES Production Orders",
      description: "Transfers production orders and material requirements from SAP to Manufacturing Execution System",
      interfaceType: "API",
      protocol: "REST",
      version: "3.0",
      status: "ACTIVE",
      introductionDate: date("2023-06-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== MANUFACTURING TO QUALITY INTEGRATION =====
    (mes_to_quality:ApplicationInterface {
      id: "interface-mes-to-quality",
      name: "MES to Quality System Integration",
      description: "Real-time transfer of production data and quality test triggers",
      interfaceType: "MESSAGE_QUEUE",
      protocol: "TCP",
      version: "1.2",
      status: "ACTIVE",
      introductionDate: date("2023-07-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== QUALITY TO ERP INTEGRATION =====
    (quality_to_sap:ApplicationInterface {
      id: "interface-quality-to-sap",
      name: "Quality System to SAP Results",
      description: "Transfers quality test results and compliance certificates back to SAP",
      interfaceType: "API",
      protocol: "REST",
      version: "2.0",
      status: "ACTIVE",
      introductionDate: date("2022-10-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== ERP TO SUPPLY CHAIN INTEGRATION =====
    (sap_to_oracle_scm:ApplicationInterface {
      id: "interface-sap-to-oracle",
      name: "SAP to Oracle SCM Integration",
      description: "Synchronizes purchase orders, supplier data, and inventory information",
      interfaceType: "FILE",
      protocol: "SFTP",
      version: "1.8",
      status: "ACTIVE",
      introductionDate: date("2020-09-01"),
      endOfLifeDate: date("2026-12-31"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== WAREHOUSE TO ERP INTEGRATION =====
    (wms_to_sap:ApplicationInterface {
      id: "interface-wms-to-sap",
      name: "Manhattan WMS to SAP Inventory",
      description: "Real-time inventory updates and goods movements",
      interfaceType: "FILE",
      protocol: "FTP",
      version: "2.3",
      status: "ACTIVE",
      introductionDate: date("2019-05-01"),
      endOfLifeDate: date("2025-12-31"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== PLM TO MES INTEGRATION =====
    (plm_to_mes:ApplicationInterface {
      id: "interface-plm-to-mes",
      name: "Siemens PLM to MES Design Transfer",
      description: "Transfers product designs and manufacturing instructions to production system",
      interfaceType: "FILE",
      protocol: "SFTP",
      version: "1.4",
      status: "ACTIVE",
      introductionDate: date("2021-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== R&D TO PLM INTEGRATION =====
    (rd_to_plm:ApplicationInterface {
      id: "interface-rd-to-plm",
      name: "R&D Platform to PLM Data Exchange",
      description: "Transfers research results and material specifications to PLM system",
      interfaceType: "API",
      protocol: "REST",
      version: "1.1",
      status: "ACTIVE",
      introductionDate: date("2023-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== HR TO ERP INTEGRATION =====
    (workday_to_sap:ApplicationInterface {
      id: "interface-workday-to-sap",
      name: "Workday to SAP Employee Data",
      description: "Synchronizes employee master data and organizational structure",
      interfaceType: "API",
      protocol: "REST",
      version: "2.2",
      status: "ACTIVE",
      introductionDate: date("2021-08-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== CUSTOMER SERVICE TO CRM INTEGRATION =====
    (zendesk_to_salesforce:ApplicationInterface {
      id: "interface-zendesk-to-salesforce",
      name: "Zendesk to Salesforce Case Sync",
      description: "Synchronizes customer service tickets and warranty claims",
      interfaceType: "API",
      protocol: "REST",
      version: "1.3",
      status: "ACTIVE",
      introductionDate: date("2020-07-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== BUSINESS INTELLIGENCE INTEGRATION =====
    (powerbi_data_integration:ApplicationInterface {
      id: "interface-powerbi-data",
      name: "Power BI Data Integration",
      description: "Consolidates data from multiple systems for business intelligence and reporting",
      interfaceType: "DATABASE",
      protocol: "ODBC",
      version: "1.0",
      status: "ACTIVE",
      introductionDate: date("2021-10-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== SERVICENOW INTEGRATIONS =====
    (servicenow_to_sap:ApplicationInterface {
      id: "interface-servicenow-to-sap",
      name: "ServiceNow to SAP Asset Integration",
      description: "Synchronizes IT asset data and purchase requests between ServiceNow and SAP",
      interfaceType: "API",
      protocol: "REST",
      version: "1.0",
      status: "ACTIVE",
      introductionDate: date("2023-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (servicenow_to_powerbi:ApplicationInterface {
      id: "interface-servicenow-to-powerbi",
      name: "ServiceNow to Power BI Reporting",
      description: "Transfers IT service metrics and KPIs for dashboard reporting",
      interfaceType: "API",
      protocol: "REST",
      version: "1.0",
      status: "ACTIVE",
      introductionDate: date("2023-04-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== EXPENSE MANAGEMENT INTEGRATIONS =====
    (concur_to_sap:ApplicationInterface {
      id: "interface-concur-to-sap",
      name: "SAP Concur to SAP Expense Integration",
      description: "Transfers approved expense reports to SAP for reimbursement processing",
      interfaceType: "API",
      protocol: "REST",
      version: "2.0",
      status: "ACTIVE",
      introductionDate: date("2022-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== TRAINING SYSTEM INTEGRATIONS =====
    (cornerstone_to_workday:ApplicationInterface {
      id: "interface-cornerstone-to-workday",
      name: "Cornerstone to Workday Training Sync",
      description: "Synchronizes employee training records and certifications",
      interfaceType: "API",
      protocol: "REST",
      version: "1.2",
      status: "ACTIVE",
      introductionDate: date("2021-10-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== FINANCIAL PLANNING INTEGRATIONS =====
    (hyperion_to_sap:ApplicationInterface {
      id: "interface-hyperion-to-sap",
      name: "Oracle Hyperion to SAP Data Exchange",
      description: "Transfers budget and planning data between Hyperion and SAP",
      interfaceType: "FILE",
      protocol: "SFTP",
      version: "1.5",
      status: "ACTIVE",
      introductionDate: date("2019-04-01"),
      endOfLifeDate: date("2026-06-30"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('Application Interfaces created successfully.')
}

export async function createInterfaceRelationships(session: Session) {
  console.log('Creating Interface relationships...')

  // SAP to Salesforce interface
  await session.run(`
    MATCH (sap_to_salesforce:ApplicationInterface {id: "interface-sap-to-salesforce"})
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (salesforce_crm:Application {id: "app-salesforce-crm"})
    MATCH (customer_data:DataObject {id: "data-customer-master"})
    MATCH (sales_orders:DataObject {id: "data-sales-orders"})
    CREATE (sap_s4hana)-[:INTERFACE_SOURCE]->(sap_to_salesforce)
    CREATE (salesforce_crm)-[:INTERFACE_TARGET]->(sap_to_salesforce)
    CREATE (sap_to_salesforce)-[:TRANSFERS]->(customer_data)
    CREATE (sap_to_salesforce)-[:TRANSFERS]->(sales_orders)
  `)

  // Salesforce to HubSpot interface
  await session.run(`
    MATCH (salesforce_to_hubspot:ApplicationInterface {id: "interface-salesforce-to-hubspot"})
    MATCH (hubspot_marketing:Application {id: "app-hubspot-marketing"})
    MATCH (salesforce_crm:Application {id: "app-salesforce-crm"})
    MATCH (leads_prospects:DataObject {id: "data-leads-prospects"})
    CREATE (hubspot_marketing)-[:INTERFACE_SOURCE]->(salesforce_to_hubspot)
    CREATE (salesforce_crm)-[:INTERFACE_TARGET]->(salesforce_to_hubspot)
    CREATE (salesforce_to_hubspot)-[:TRANSFERS]->(leads_prospects)
  `)

  // SAP to MES interface
  await session.run(`
    MATCH (sap_to_mes:ApplicationInterface {id: "interface-sap-to-mes"})
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (mes_system:Application {id: "app-mes-solar"})
    MATCH (work_orders:DataObject {id: "data-work-orders"})
    MATCH (material_specifications:DataObject {id: "data-material-specs"})
    CREATE (sap_s4hana)-[:INTERFACE_SOURCE]->(sap_to_mes)
    CREATE (mes_system)-[:INTERFACE_TARGET]->(sap_to_mes)
    CREATE (sap_to_mes)-[:TRANSFERS]->(work_orders)
    CREATE (sap_to_mes)-[:TRANSFERS]->(material_specifications)
  `)

  // MES to Quality interface
  await session.run(`
    MATCH (mes_to_quality:ApplicationInterface {id: "interface-mes-to-quality"})
    MATCH (mes_system:Application {id: "app-mes-solar"})
    MATCH (quality_system:Application {id: "app-quality-solar"})
    MATCH (production_data:DataObject {id: "data-production-metrics"})
    MATCH (quality_test_results:DataObject {id: "data-quality-tests"})
    CREATE (mes_system)-[:INTERFACE_SOURCE]->(mes_to_quality)
    CREATE (quality_system)-[:INTERFACE_TARGET]->(mes_to_quality)
    CREATE (mes_to_quality)-[:TRANSFERS]->(production_data)
    CREATE (mes_to_quality)-[:TRANSFERS]->(quality_test_results)
  `)

  // Quality to SAP interface
  await session.run(`
    MATCH (quality_to_sap:ApplicationInterface {id: "interface-quality-to-sap"})
    MATCH (quality_system:Application {id: "app-quality-solar"})
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (quality_test_results:DataObject {id: "data-quality-tests"})
    MATCH (compliance_certificates:DataObject {id: "data-compliance-certs"})
    CREATE (quality_system)-[:INTERFACE_SOURCE]->(quality_to_sap)
    CREATE (sap_s4hana)-[:INTERFACE_TARGET]->(quality_to_sap)
    CREATE (quality_to_sap)-[:TRANSFERS]->(quality_test_results)
    CREATE (quality_to_sap)-[:TRANSFERS]->(compliance_certificates)
  `)

  // SAP to Oracle SCM interface
  await session.run(`
    MATCH (sap_to_oracle_scm:ApplicationInterface {id: "interface-sap-to-oracle"})
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (oracle_scm:Application {id: "app-oracle-scm"})
    MATCH (purchase_orders:DataObject {id: "data-purchase-orders"})
    MATCH (supplier_data:DataObject {id: "data-supplier-master"})
    CREATE (sap_s4hana)-[:INTERFACE_SOURCE]->(sap_to_oracle_scm)
    CREATE (oracle_scm)-[:INTERFACE_TARGET]->(sap_to_oracle_scm)
    CREATE (sap_to_oracle_scm)-[:TRANSFERS]->(purchase_orders)
    CREATE (sap_to_oracle_scm)-[:TRANSFERS]->(supplier_data)
  `)

  // WMS to SAP interface
  await session.run(`
    MATCH (wms_to_sap:ApplicationInterface {id: "interface-wms-to-sap"})
    MATCH (wms_system:Application {id: "app-wms-manhattan"})
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (inventory_data:DataObject {id: "data-inventory-levels"})
    CREATE (wms_system)-[:INTERFACE_SOURCE]->(wms_to_sap)
    CREATE (sap_s4hana)-[:INTERFACE_TARGET]->(wms_to_sap)
    CREATE (wms_to_sap)-[:TRANSFERS]->(inventory_data)
  `)

  // PLM to MES interface
  await session.run(`
    MATCH (plm_to_mes:ApplicationInterface {id: "interface-plm-to-mes"})
    MATCH (siemens_plm:Application {id: "app-siemens-plm"})
    MATCH (mes_system:Application {id: "app-mes-solar"})
    MATCH (product_designs:DataObject {id: "data-product-designs"})
    MATCH (material_specifications:DataObject {id: "data-material-specs"})
    CREATE (siemens_plm)-[:INTERFACE_SOURCE]->(plm_to_mes)
    CREATE (mes_system)-[:INTERFACE_TARGET]->(plm_to_mes)
    CREATE (plm_to_mes)-[:TRANSFERS]->(product_designs)
    CREATE (plm_to_mes)-[:TRANSFERS]->(material_specifications)
  `)

  // R&D to PLM interface
  await session.run(`
    MATCH (rd_to_plm:ApplicationInterface {id: "interface-rd-to-plm"})
    MATCH (rd_platform:Application {id: "app-rd-platform"})
    MATCH (siemens_plm:Application {id: "app-siemens-plm"})
    MATCH (research_data:DataObject {id: "data-research-experimental"})
    MATCH (material_specifications:DataObject {id: "data-material-specs"})
    CREATE (rd_platform)-[:INTERFACE_SOURCE]->(rd_to_plm)
    CREATE (siemens_plm)-[:INTERFACE_TARGET]->(rd_to_plm)
    CREATE (rd_to_plm)-[:TRANSFERS]->(research_data)
    CREATE (rd_to_plm)-[:TRANSFERS]->(material_specifications)
  `)

  // Workday to SAP interface
  await session.run(`
    MATCH (workday_to_sap:ApplicationInterface {id: "interface-workday-to-sap"})
    MATCH (workday_hr:Application {id: "app-workday-hr"})
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (employee_data:DataObject {id: "data-employee-master"})
    CREATE (workday_hr)-[:INTERFACE_SOURCE]->(workday_to_sap)
    CREATE (sap_s4hana)-[:INTERFACE_TARGET]->(workday_to_sap)
    CREATE (workday_to_sap)-[:TRANSFERS]->(employee_data)
  `)

  // Zendesk to Salesforce interface
  await session.run(`
    MATCH (zendesk_to_salesforce:ApplicationInterface {id: "interface-zendesk-to-salesforce"})
    MATCH (zendesk_service:Application {id: "app-zendesk-service"})
    MATCH (salesforce_crm:Application {id: "app-salesforce-crm"})
    MATCH (service_tickets:DataObject {id: "data-service-tickets"})
    MATCH (warranty_claims:DataObject {id: "data-warranty-claims"})
    CREATE (zendesk_service)-[:INTERFACE_SOURCE]->(zendesk_to_salesforce)
    CREATE (salesforce_crm)-[:INTERFACE_TARGET]->(zendesk_to_salesforce)
    CREATE (zendesk_to_salesforce)-[:TRANSFERS]->(service_tickets)
    CREATE (zendesk_to_salesforce)-[:TRANSFERS]->(warranty_claims)
  `)

  // Power BI data integration
  await session.run(`
    MATCH (powerbi_data_integration:ApplicationInterface {id: "interface-powerbi-data"})
    MATCH (power_bi:Application {id: "app-power-bi"})
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (mes_system:Application {id: "app-mes-solar"})
    MATCH (quality_system:Application {id: "app-quality-solar"})
    MATCH (production_data:DataObject {id: "data-production-metrics"})
    MATCH (financial_transactions:DataObject {id: "data-financial-transactions"})
    MATCH (quality_test_results:DataObject {id: "data-quality-tests"})
    CREATE (sap_s4hana)-[:INTERFACE_SOURCE]->(powerbi_data_integration)
    CREATE (mes_system)-[:INTERFACE_SOURCE]->(powerbi_data_integration)
    CREATE (quality_system)-[:INTERFACE_SOURCE]->(powerbi_data_integration)
    CREATE (power_bi)-[:INTERFACE_TARGET]->(powerbi_data_integration)
    CREATE (powerbi_data_integration)-[:TRANSFERS]->(production_data)
    CREATE (powerbi_data_integration)-[:TRANSFERS]->(financial_transactions)
    CREATE (powerbi_data_integration)-[:TRANSFERS]->(quality_test_results)
  `)

  // ServiceNow to SAP interface
  await session.run(`
    MATCH (servicenow_to_sap:ApplicationInterface {id: "interface-servicenow-to-sap"})
    MATCH (servicenow:Application {id: "app-servicenow"})
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (asset_inventory:DataObject {id: "data-asset-inventory"})
    MATCH (purchase_orders:DataObject {id: "data-purchase-orders"})
    CREATE (servicenow)-[:INTERFACE_SOURCE]->(servicenow_to_sap)
    CREATE (sap_s4hana)-[:INTERFACE_TARGET]->(servicenow_to_sap)
    CREATE (servicenow_to_sap)-[:TRANSFERS]->(asset_inventory)
    CREATE (servicenow_to_sap)-[:TRANSFERS]->(purchase_orders)
  `)

  // ServiceNow to Power BI interface
  await session.run(`
    MATCH (servicenow_to_powerbi:ApplicationInterface {id: "interface-servicenow-to-powerbi"})
    MATCH (servicenow:Application {id: "app-servicenow"})
    MATCH (power_bi:Application {id: "app-power-bi"})
    MATCH (incident_tickets:DataObject {id: "data-incident-tickets"})
    MATCH (change_requests:DataObject {id: "data-change-requests"})
    CREATE (servicenow)-[:INTERFACE_SOURCE]->(servicenow_to_powerbi)
    CREATE (power_bi)-[:INTERFACE_TARGET]->(servicenow_to_powerbi)
    CREATE (servicenow_to_powerbi)-[:TRANSFERS]->(incident_tickets)
    CREATE (servicenow_to_powerbi)-[:TRANSFERS]->(change_requests)
  `)

  // Concur to SAP interface
  await session.run(`
    MATCH (concur_to_sap:ApplicationInterface {id: "interface-concur-to-sap"})
    MATCH (concur:Application {id: "app-concur"})
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (expense_reports:DataObject {id: "data-expense-reports"})
    CREATE (concur)-[:INTERFACE_SOURCE]->(concur_to_sap)
    CREATE (sap_s4hana)-[:INTERFACE_TARGET]->(concur_to_sap)
    CREATE (concur_to_sap)-[:TRANSFERS]->(expense_reports)
  `)

  // Cornerstone to Workday interface
  await session.run(`
    MATCH (cornerstone_to_workday:ApplicationInterface {id: "interface-cornerstone-to-workday"})
    MATCH (cornerstone:Application {id: "app-cornerstone-lms"})
    MATCH (workday_hr:Application {id: "app-workday-hr"})
    MATCH (training_records:DataObject {id: "data-training-records"})
    CREATE (cornerstone)-[:INTERFACE_SOURCE]->(cornerstone_to_workday)
    CREATE (workday_hr)-[:INTERFACE_TARGET]->(cornerstone_to_workday)
    CREATE (cornerstone_to_workday)-[:TRANSFERS]->(training_records)
  `)

  // Hyperion to SAP interface
  await session.run(`
    MATCH (hyperion_to_sap:ApplicationInterface {id: "interface-hyperion-to-sap"})
    MATCH (hyperion:Application {id: "app-oracle-hyperion"})
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (budget_forecasts:DataObject {id: "data-budget-forecasts"})
    CREATE (hyperion)-[:INTERFACE_SOURCE]->(hyperion_to_sap)
    CREATE (sap_s4hana)-[:INTERFACE_TARGET]->(hyperion_to_sap)
    CREATE (hyperion_to_sap)-[:TRANSFERS]->(budget_forecasts)
  `)

  console.log('Interface relationships created successfully.')
}

export async function createInterfaceOwnership(session: Session) {
  console.log('Creating Interface Ownership relationships...')

  // Assign interface ownership to enterprise architect
  await session.run(`
    MATCH (sap_to_salesforce:ApplicationInterface {id: "interface-sap-to-salesforce"})
    MATCH (salesforce_to_hubspot:ApplicationInterface {id: "interface-salesforce-to-hubspot"})
    MATCH (sap_to_mes:ApplicationInterface {id: "interface-sap-to-mes"})
    MATCH (mes_to_quality:ApplicationInterface {id: "interface-mes-to-quality"})
    MATCH (quality_to_sap:ApplicationInterface {id: "interface-quality-to-sap"})
    MATCH (enterprise_architect:Person {id: "person-enterprise-architect"})
    CREATE (sap_to_salesforce)-[:OWNED_BY]->(enterprise_architect)
    CREATE (salesforce_to_hubspot)-[:OWNED_BY]->(enterprise_architect)
    CREATE (sap_to_mes)-[:OWNED_BY]->(enterprise_architect)
    CREATE (mes_to_quality)-[:OWNED_BY]->(enterprise_architect)
    CREATE (quality_to_sap)-[:OWNED_BY]->(enterprise_architect)
  `)

  await session.run(`
    MATCH (sap_to_oracle_scm:ApplicationInterface {id: "interface-sap-to-oracle"})
    MATCH (wms_to_sap:ApplicationInterface {id: "interface-wms-to-sap"})
    MATCH (plm_to_mes:ApplicationInterface {id: "interface-plm-to-mes"})
    MATCH (rd_to_plm:ApplicationInterface {id: "interface-rd-to-plm"})
    MATCH (workday_to_sap:ApplicationInterface {id: "interface-workday-to-sap"})
    MATCH (zendesk_to_salesforce:ApplicationInterface {id: "interface-zendesk-to-salesforce"})
    MATCH (powerbi_data_integration:ApplicationInterface {id: "interface-powerbi-data"})
    MATCH (servicenow_to_sap:ApplicationInterface {id: "interface-servicenow-to-sap"})
    MATCH (servicenow_to_powerbi:ApplicationInterface {id: "interface-servicenow-to-powerbi"})
    MATCH (concur_to_sap:ApplicationInterface {id: "interface-concur-to-sap"})
    MATCH (cornerstone_to_workday:ApplicationInterface {id: "interface-cornerstone-to-workday"})
    MATCH (hyperion_to_sap:ApplicationInterface {id: "interface-hyperion-to-sap"})
    MATCH (enterprise_architect:Person {id: "person-enterprise-architect"})
    CREATE (sap_to_oracle_scm)-[:OWNED_BY]->(enterprise_architect)
    CREATE (wms_to_sap)-[:OWNED_BY]->(enterprise_architect)
    CREATE (plm_to_mes)-[:OWNED_BY]->(enterprise_architect)
    CREATE (rd_to_plm)-[:OWNED_BY]->(enterprise_architect)
    CREATE (workday_to_sap)-[:OWNED_BY]->(enterprise_architect)
    CREATE (zendesk_to_salesforce)-[:OWNED_BY]->(enterprise_architect)
    CREATE (powerbi_data_integration)-[:OWNED_BY]->(enterprise_architect)
    CREATE (servicenow_to_sap)-[:OWNED_BY]->(enterprise_architect)
    CREATE (servicenow_to_powerbi)-[:OWNED_BY]->(enterprise_architect)
    CREATE (concur_to_sap)-[:OWNED_BY]->(enterprise_architect)
    CREATE (cornerstone_to_workday)-[:OWNED_BY]->(enterprise_architect)
    CREATE (hyperion_to_sap)-[:OWNED_BY]->(enterprise_architect)
  `)

  console.log('Interface ownership relationships created successfully.')
}
