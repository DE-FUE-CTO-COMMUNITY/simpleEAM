// Relationships for Solar Panel Manufacturing Company
// Creates all the interconnections between different enterprise architecture elements

import { Session } from 'neo4j-driver'

export async function createCapabilityHierarchy(session: Session) {
  console.log('Creating Capability Hierarchy relationships...')

  // Research & Development hierarchy
  await session.run(`
    MATCH (research:BusinessCapability {id: "cap-research-development"})
    MATCH (product_innovation:BusinessCapability {id: "cap-product-innovation"})
    MATCH (materials_research:BusinessCapability {id: "cap-materials-research"})
    MATCH (prototype_testing:BusinessCapability {id: "cap-prototype-testing"})
    CREATE (product_innovation)-[:HAS_PARENT]->(research)
    CREATE (materials_research)-[:HAS_PARENT]->(research)
    CREATE (prototype_testing)-[:HAS_PARENT]->(research)
  `)

  // Manufacturing Operations hierarchy
  await session.run(`
    MATCH (manufacturing:BusinessCapability {id: "cap-manufacturing"})
    MATCH (cell_production:BusinessCapability {id: "cap-cell-production"})
    MATCH (module_assembly:BusinessCapability {id: "cap-module-assembly"})
    MATCH (packaging_shipping:BusinessCapability {id: "cap-packaging-shipping"})
    CREATE (cell_production)-[:HAS_PARENT]->(manufacturing)
    CREATE (module_assembly)-[:HAS_PARENT]->(manufacturing)
    CREATE (packaging_shipping)-[:HAS_PARENT]->(manufacturing)
  `)

  // Supply Chain Management hierarchy
  await session.run(`
    MATCH (supply_chain:BusinessCapability {id: "cap-supply-chain"})
    MATCH (supplier_mgmt:BusinessCapability {id: "cap-supplier-management"})
    MATCH (procurement:BusinessCapability {id: "cap-procurement"})
    MATCH (inventory_mgmt:BusinessCapability {id: "cap-inventory-management"})
    CREATE (supplier_mgmt)-[:HAS_PARENT]->(supply_chain)
    CREATE (procurement)-[:HAS_PARENT]->(supply_chain)
    CREATE (inventory_mgmt)-[:HAS_PARENT]->(supply_chain)
  `)

  // Sales & Marketing hierarchy
  await session.run(`
    MATCH (sales_marketing:BusinessCapability {id: "cap-sales-marketing"})
    MATCH (lead_generation:BusinessCapability {id: "cap-lead-generation"})
    MATCH (sales_execution:BusinessCapability {id: "cap-sales-execution"})
    MATCH (channel_mgmt:BusinessCapability {id: "cap-channel-management"})
    CREATE (lead_generation)-[:HAS_PARENT]->(sales_marketing)
    CREATE (sales_execution)-[:HAS_PARENT]->(sales_marketing)
    CREATE (channel_mgmt)-[:HAS_PARENT]->(sales_marketing)
  `)

  // Quality Management hierarchy
  await session.run(`
    MATCH (quality_mgmt:BusinessCapability {id: "cap-quality-management"})
    MATCH (incoming_inspection:BusinessCapability {id: "cap-incoming-inspection"})
    MATCH (production_testing:BusinessCapability {id: "cap-production-testing"})
    MATCH (certification_compliance:BusinessCapability {id: "cap-certification-compliance"})
    CREATE (incoming_inspection)-[:HAS_PARENT]->(quality_mgmt)
    CREATE (production_testing)-[:HAS_PARENT]->(quality_mgmt)
    CREATE (certification_compliance)-[:HAS_PARENT]->(quality_mgmt)
  `)

  // Finance & Accounting hierarchy
  await session.run(`
    MATCH (finance_accounting:BusinessCapability {id: "cap-finance-accounting"})
    MATCH (financial_planning:BusinessCapability {id: "cap-financial-planning"})
    MATCH (accounts_payable:BusinessCapability {id: "cap-accounts-payable"})
    MATCH (financial_reporting:BusinessCapability {id: "cap-financial-reporting"})
    CREATE (financial_planning)-[:HAS_PARENT]->(finance_accounting)
    CREATE (accounts_payable)-[:HAS_PARENT]->(finance_accounting)
    CREATE (financial_reporting)-[:HAS_PARENT]->(finance_accounting)
  `)

  // HR Management hierarchy
  await session.run(`
    MATCH (hr_management:BusinessCapability {id: "cap-hr-management"})
    MATCH (talent_acquisition:BusinessCapability {id: "cap-talent-acquisition"})
    MATCH (performance_management:BusinessCapability {id: "cap-performance-management"})
    MATCH (payroll_benefits:BusinessCapability {id: "cap-payroll-benefits"})
    CREATE (talent_acquisition)-[:HAS_PARENT]->(hr_management)
    CREATE (performance_management)-[:HAS_PARENT]->(hr_management)
    CREATE (payroll_benefits)-[:HAS_PARENT]->(hr_management)
  `)

  // IT Management hierarchy
  await session.run(`
    MATCH (it_management:BusinessCapability {id: "cap-it-management"})
    MATCH (it_service_management:BusinessCapability {id: "cap-it-service-management"})
    MATCH (infrastructure_management:BusinessCapability {id: "cap-infrastructure-management"})
    MATCH (application_management:BusinessCapability {id: "cap-application-management"})
    CREATE (it_service_management)-[:HAS_PARENT]->(it_management)
    CREATE (infrastructure_management)-[:HAS_PARENT]->(it_management)
    CREATE (application_management)-[:HAS_PARENT]->(it_management)
  `)

  // Customer Service hierarchy
  await session.run(`
    MATCH (customer_service:BusinessCapability {id: "cap-customer-service"})
    MATCH (technical_support:BusinessCapability {id: "cap-technical-support"})
    MATCH (warranty_management:BusinessCapability {id: "cap-warranty-management"})
    MATCH (customer_training:BusinessCapability {id: "cap-customer-training"})
    CREATE (technical_support)-[:HAS_PARENT]->(customer_service)
    CREATE (warranty_management)-[:HAS_PARENT]->(customer_service)
    CREATE (customer_training)-[:HAS_PARENT]->(customer_service)
  `)

  console.log('Capability hierarchy relationships created successfully.')
}

export async function createApplicationCapabilitySupport(session: Session) {
  console.log('Creating Application-Capability Support relationships...')

  // SAP S/4HANA supports multiple capabilities
  await session.run(`
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (finance_accounting:BusinessCapability {id: "cap-finance-accounting"})
    MATCH (procurement:BusinessCapability {id: "cap-procurement"})
    MATCH (supply_chain:BusinessCapability {id: "cap-supply-chain"})
    MATCH (sales_execution:BusinessCapability {id: "cap-sales-execution"})
    CREATE (sap_s4hana)-[:SUPPORTS]->(finance_accounting)
    CREATE (sap_s4hana)-[:SUPPORTS]->(procurement)
    CREATE (sap_s4hana)-[:SUPPORTS]->(supply_chain)
    CREATE (sap_s4hana)-[:SUPPORTS]->(sales_execution)
  `)

  // Salesforce CRM supports sales and marketing
  await session.run(`
    MATCH (salesforce_crm:Application {id: "app-salesforce-crm"})
    MATCH (sales_marketing:BusinessCapability {id: "cap-sales-marketing"})
    MATCH (sales_execution:BusinessCapability {id: "cap-sales-execution"})
    MATCH (channel_mgmt:BusinessCapability {id: "cap-channel-management"})
    MATCH (customer_service:BusinessCapability {id: "cap-customer-service"})
    CREATE (salesforce_crm)-[:SUPPORTS]->(sales_marketing)
    CREATE (salesforce_crm)-[:SUPPORTS]->(sales_execution)
    CREATE (salesforce_crm)-[:SUPPORTS]->(channel_mgmt)
    CREATE (salesforce_crm)-[:SUPPORTS]->(customer_service)
  `)

  // Manufacturing systems
  await session.run(`
    MATCH (mes_system:Application {id: "app-mes-solar"})
    MATCH (manufacturing:BusinessCapability {id: "cap-manufacturing"})
    MATCH (cell_production:BusinessCapability {id: "cap-cell-production"})
    MATCH (module_assembly:BusinessCapability {id: "cap-module-assembly"})
    MATCH (packaging_shipping:BusinessCapability {id: "cap-packaging-shipping"})
    CREATE (mes_system)-[:SUPPORTS]->(manufacturing)
    CREATE (mes_system)-[:SUPPORTS]->(cell_production)
    CREATE (mes_system)-[:SUPPORTS]->(module_assembly)
    CREATE (mes_system)-[:SUPPORTS]->(packaging_shipping)
  `)

  // Quality system
  await session.run(`
    MATCH (quality_system:Application {id: "app-quality-solar"})
    MATCH (quality_mgmt:BusinessCapability {id: "cap-quality-management"})
    MATCH (incoming_inspection:BusinessCapability {id: "cap-incoming-inspection"})
    MATCH (production_testing:BusinessCapability {id: "cap-production-testing"})
    MATCH (certification_compliance:BusinessCapability {id: "cap-certification-compliance"})
    CREATE (quality_system)-[:SUPPORTS]->(quality_mgmt)
    CREATE (quality_system)-[:SUPPORTS]->(incoming_inspection)
    CREATE (quality_system)-[:SUPPORTS]->(production_testing)
    CREATE (quality_system)-[:SUPPORTS]->(certification_compliance)
  `)

  // Other application-capability relationships
  await session.run(`
    MATCH (oracle_scm:Application {id: "app-oracle-scm"})
    MATCH (supply_chain:BusinessCapability {id: "cap-supply-chain"})
    MATCH (supplier_mgmt:BusinessCapability {id: "cap-supplier-management"})
    MATCH (procurement:BusinessCapability {id: "cap-procurement"})
    MATCH (inventory_mgmt:BusinessCapability {id: "cap-inventory-management"})
    CREATE (oracle_scm)-[:SUPPORTS]->(supply_chain)
    CREATE (oracle_scm)-[:SUPPORTS]->(supplier_mgmt)
    CREATE (oracle_scm)-[:SUPPORTS]->(procurement)
    CREATE (oracle_scm)-[:SUPPORTS]->(inventory_mgmt)
  `)

  await session.run(`
    MATCH (rd_platform:Application {id: "app-rd-platform"})
    MATCH (research:BusinessCapability {id: "cap-research-development"})
    MATCH (product_innovation:BusinessCapability {id: "cap-product-innovation"})
    MATCH (materials_research:BusinessCapability {id: "cap-materials-research"})
    MATCH (prototype_testing:BusinessCapability {id: "cap-prototype-testing"})
    CREATE (rd_platform)-[:SUPPORTS]->(research)
    CREATE (rd_platform)-[:SUPPORTS]->(product_innovation)
    CREATE (rd_platform)-[:SUPPORTS]->(materials_research)
    CREATE (rd_platform)-[:SUPPORTS]->(prototype_testing)
  `)

  await session.run(`
    MATCH (workday_hr:Application {id: "app-workday-hr"})
    MATCH (hr_management:BusinessCapability {id: "cap-hr-management"})
    CREATE (workday_hr)-[:SUPPORTS]->(hr_management)
  `)

  await session.run(`
    MATCH (hubspot_marketing:Application {id: "app-hubspot-marketing"})
    MATCH (sales_marketing:BusinessCapability {id: "cap-sales-marketing"})
    MATCH (lead_generation:BusinessCapability {id: "cap-lead-generation"})
    CREATE (hubspot_marketing)-[:SUPPORTS]->(sales_marketing)
    CREATE (hubspot_marketing)-[:SUPPORTS]->(lead_generation)
  `)

  await session.run(`
    MATCH (zendesk_service:Application {id: "app-zendesk-service"})
    MATCH (customer_service:BusinessCapability {id: "cap-customer-service"})
    CREATE (zendesk_service)-[:SUPPORTS]->(customer_service)
  `)

  await session.run(`
    MATCH (wms_system:Application {id: "app-wms-manhattan"})
    MATCH (inventory_mgmt:BusinessCapability {id: "cap-inventory-management"})
    MATCH (packaging_shipping:BusinessCapability {id: "cap-packaging-shipping"})
    CREATE (wms_system)-[:SUPPORTS]->(inventory_mgmt)
    CREATE (wms_system)-[:SUPPORTS]->(packaging_shipping)
  `)

  await session.run(`
    MATCH (siemens_plm:Application {id: "app-siemens-plm"})
    MATCH (research:BusinessCapability {id: "cap-research-development"})
    MATCH (product_innovation:BusinessCapability {id: "cap-product-innovation"})
    CREATE (siemens_plm)-[:SUPPORTS]->(research)
    CREATE (siemens_plm)-[:SUPPORTS]->(product_innovation)
  `)

  // ServiceNow supports IT Management capabilities
  await session.run(`
    MATCH (servicenow:Application {id: "app-servicenow"})
    MATCH (it_management:BusinessCapability {id: "cap-it-management"})
    MATCH (it_service_management:BusinessCapability {id: "cap-it-service-management"})
    MATCH (infrastructure_management:BusinessCapability {id: "cap-infrastructure-management"})
    MATCH (application_management:BusinessCapability {id: "cap-application-management"})
    CREATE (servicenow)-[:SUPPORTS]->(it_management)
    CREATE (servicenow)-[:SUPPORTS]->(it_service_management)
    CREATE (servicenow)-[:SUPPORTS]->(infrastructure_management)
    CREATE (servicenow)-[:SUPPORTS]->(application_management)
  `)

  // SAP Concur supports financial management
  await session.run(`
    MATCH (concur:Application {id: "app-concur"})
    MATCH (finance_accounting:BusinessCapability {id: "cap-finance-accounting"})
    MATCH (financial_planning:BusinessCapability {id: "cap-financial-planning"})
    MATCH (accounts_payable:BusinessCapability {id: "cap-accounts-payable"})
    CREATE (concur)-[:SUPPORTS]->(finance_accounting)
    CREATE (concur)-[:SUPPORTS]->(financial_planning)
    CREATE (concur)-[:SUPPORTS]->(accounts_payable)
  `)

  // Cornerstone supports HR and customer training
  await session.run(`
    MATCH (cornerstone:Application {id: "app-cornerstone-lms"})
    MATCH (hr_management:BusinessCapability {id: "cap-hr-management"})
    MATCH (performance_management:BusinessCapability {id: "cap-performance-management"})
    MATCH (customer_service:BusinessCapability {id: "cap-customer-service"})
    MATCH (customer_training:BusinessCapability {id: "cap-customer-training"})
    CREATE (cornerstone)-[:SUPPORTS]->(hr_management)
    CREATE (cornerstone)-[:SUPPORTS]->(performance_management)
    CREATE (cornerstone)-[:SUPPORTS]->(customer_service)
    CREATE (cornerstone)-[:SUPPORTS]->(customer_training)
  `)

  // Oracle Hyperion supports financial planning and reporting
  await session.run(`
    MATCH (hyperion:Application {id: "app-oracle-hyperion"})
    MATCH (finance_accounting:BusinessCapability {id: "cap-finance-accounting"})
    MATCH (financial_planning:BusinessCapability {id: "cap-financial-planning"})
    MATCH (financial_reporting:BusinessCapability {id: "cap-financial-reporting"})
    CREATE (hyperion)-[:SUPPORTS]->(finance_accounting)
    CREATE (hyperion)-[:SUPPORTS]->(financial_planning)
    CREATE (hyperion)-[:SUPPORTS]->(financial_reporting)
  `)

  // Update existing Workday to support new HR capabilities
  await session.run(`
    MATCH (workday_hr:Application {id: "app-workday-hr"})
    MATCH (talent_acquisition:BusinessCapability {id: "cap-talent-acquisition"})
    MATCH (performance_management:BusinessCapability {id: "cap-performance-management"})
    MATCH (payroll_benefits:BusinessCapability {id: "cap-payroll-benefits"})
    CREATE (workday_hr)-[:SUPPORTS]->(talent_acquisition)
    CREATE (workday_hr)-[:SUPPORTS]->(performance_management)
    CREATE (workday_hr)-[:SUPPORTS]->(payroll_benefits)
  `)

  // Update existing Zendesk to support new customer service capabilities
  await session.run(`
    MATCH (zendesk_service:Application {id: "app-zendesk-service"})
    MATCH (technical_support:BusinessCapability {id: "cap-technical-support"})
    MATCH (warranty_management:BusinessCapability {id: "cap-warranty-management"})
    CREATE (zendesk_service)-[:SUPPORTS]->(technical_support)
    CREATE (zendesk_service)-[:SUPPORTS]->(warranty_management)
  `)

  console.log('Application-Capability support relationships created successfully.')
}

export async function createApplicationDataRelationships(session: Session) {
  console.log('Creating Application-Data relationships...')

  // SAP S/4HANA data relationships
  await session.run(`
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (customer_data:DataObject {id: "data-customer-master"})
    MATCH (sales_orders:DataObject {id: "data-sales-orders"})
    MATCH (purchase_orders:DataObject {id: "data-purchase-orders"})
    MATCH (supplier_data:DataObject {id: "data-supplier-master"})
    MATCH (financial_transactions:DataObject {id: "data-financial-transactions"})
    MATCH (cost_accounting:DataObject {id: "data-cost-accounting"})
    CREATE (customer_data)-[:DATA_SOURCE]->(sap_s4hana)
    CREATE (sales_orders)-[:DATA_SOURCE]->(sap_s4hana)
    CREATE (purchase_orders)-[:DATA_SOURCE]->(sap_s4hana)
    CREATE (supplier_data)-[:DATA_SOURCE]->(sap_s4hana)
    CREATE (financial_transactions)-[:DATA_SOURCE]->(sap_s4hana)
    CREATE (cost_accounting)-[:DATA_SOURCE]->(sap_s4hana)
    CREATE (sap_s4hana)-[:USES]->(customer_data)
    CREATE (sap_s4hana)-[:USES]->(sales_orders)
    CREATE (sap_s4hana)-[:USES]->(purchase_orders)
    CREATE (sap_s4hana)-[:USES]->(supplier_data)
    CREATE (sap_s4hana)-[:USES]->(financial_transactions)
    CREATE (sap_s4hana)-[:USES]->(cost_accounting)
  `)

  // Salesforce CRM data relationships
  await session.run(`
    MATCH (salesforce_crm:Application {id: "app-salesforce-crm"})
    MATCH (customer_data:DataObject {id: "data-customer-master"})
    MATCH (leads_prospects:DataObject {id: "data-leads-prospects"})
    MATCH (sales_orders:DataObject {id: "data-sales-orders"})
    CREATE (leads_prospects)-[:DATA_SOURCE]->(salesforce_crm)
    CREATE (salesforce_crm)-[:USES]->(customer_data)
    CREATE (salesforce_crm)-[:USES]->(leads_prospects)
    CREATE (salesforce_crm)-[:USES]->(sales_orders)
  `)

  // Manufacturing system data relationships
  await session.run(`
    MATCH (mes_system:Application {id: "app-mes-solar"})
    MATCH (production_data:DataObject {id: "data-production-metrics"})
    MATCH (work_orders:DataObject {id: "data-work-orders"})
    MATCH (equipment_data:DataObject {id: "data-equipment-status"})
    MATCH (quality_test_results:DataObject {id: "data-quality-tests"})
    CREATE (production_data)-[:DATA_SOURCE]->(mes_system)
    CREATE (work_orders)-[:DATA_SOURCE]->(mes_system)
    CREATE (equipment_data)-[:DATA_SOURCE]->(mes_system)
    CREATE (mes_system)-[:USES]->(production_data)
    CREATE (mes_system)-[:USES]->(work_orders)
    CREATE (mes_system)-[:USES]->(equipment_data)
    CREATE (mes_system)-[:USES]->(quality_test_results)
  `)

  // Quality system data relationships
  await session.run(`
    MATCH (quality_system:Application {id: "app-quality-solar"})
    MATCH (quality_test_results:DataObject {id: "data-quality-tests"})
    MATCH (compliance_certificates:DataObject {id: "data-compliance-certs"})
    MATCH (defect_tracking:DataObject {id: "data-defect-tracking"})
    MATCH (material_specifications:DataObject {id: "data-material-specs"})
    CREATE (quality_test_results)-[:DATA_SOURCE]->(quality_system)
    CREATE (compliance_certificates)-[:DATA_SOURCE]->(quality_system)
    CREATE (defect_tracking)-[:DATA_SOURCE]->(quality_system)
    CREATE (quality_system)-[:USES]->(quality_test_results)
    CREATE (quality_system)-[:USES]->(compliance_certificates)
    CREATE (quality_system)-[:USES]->(defect_tracking)
    CREATE (quality_system)-[:USES]->(material_specifications)
  `)

  // R&D platform data relationships
  await session.run(`
    MATCH (rd_platform:Application {id: "app-rd-platform"})
    MATCH (research_data:DataObject {id: "data-research-experimental"})
    MATCH (product_designs:DataObject {id: "data-product-designs"})
    MATCH (material_specifications:DataObject {id: "data-material-specs"})
    CREATE (research_data)-[:DATA_SOURCE]->(rd_platform)
    CREATE (rd_platform)-[:USES]->(research_data)
    CREATE (rd_platform)-[:USES]->(product_designs)
    CREATE (rd_platform)-[:USES]->(material_specifications)
  `)

  // Other application-data relationships
  await session.run(`
    MATCH (oracle_scm:Application {id: "app-oracle-scm"})
    MATCH (supplier_data:DataObject {id: "data-supplier-master"})
    MATCH (purchase_orders:DataObject {id: "data-purchase-orders"})
    MATCH (inventory_data:DataObject {id: "data-inventory-levels"})
    CREATE (oracle_scm)-[:USES]->(supplier_data)
    CREATE (oracle_scm)-[:USES]->(purchase_orders)
    CREATE (oracle_scm)-[:USES]->(inventory_data)
  `)

  await session.run(`
    MATCH (workday_hr:Application {id: "app-workday-hr"})
    MATCH (employee_data:DataObject {id: "data-employee-master"})
    MATCH (training_records:DataObject {id: "data-training-records"})
    CREATE (employee_data)-[:DATA_SOURCE]->(workday_hr)
    CREATE (training_records)-[:DATA_SOURCE]->(workday_hr)
    CREATE (workday_hr)-[:USES]->(employee_data)
    CREATE (workday_hr)-[:USES]->(training_records)
  `)

  await session.run(`
    MATCH (hubspot_marketing:Application {id: "app-hubspot-marketing"})
    MATCH (leads_prospects:DataObject {id: "data-leads-prospects"})
    CREATE (hubspot_marketing)-[:USES]->(leads_prospects)
  `)

  await session.run(`
    MATCH (zendesk_service:Application {id: "app-zendesk-service"})
    MATCH (service_tickets:DataObject {id: "data-service-tickets"})
    MATCH (warranty_claims:DataObject {id: "data-warranty-claims"})
    CREATE (service_tickets)-[:DATA_SOURCE]->(zendesk_service)
    CREATE (warranty_claims)-[:DATA_SOURCE]->(zendesk_service)
    CREATE (zendesk_service)-[:USES]->(service_tickets)
    CREATE (zendesk_service)-[:USES]->(warranty_claims)
  `)

  await session.run(`
    MATCH (wms_system:Application {id: "app-wms-manhattan"})
    MATCH (inventory_data:DataObject {id: "data-inventory-levels"})
    CREATE (inventory_data)-[:DATA_SOURCE]->(wms_system)
    CREATE (wms_system)-[:USES]->(inventory_data)
  `)

  await session.run(`
    MATCH (siemens_plm:Application {id: "app-siemens-plm"})
    MATCH (product_designs:DataObject {id: "data-product-designs"})
    MATCH (material_specifications:DataObject {id: "data-material-specs"})
    CREATE (product_designs)-[:DATA_SOURCE]->(siemens_plm)
    CREATE (siemens_plm)-[:USES]->(product_designs)
    CREATE (siemens_plm)-[:USES]->(material_specifications)
  `)

  console.log('Application-Data relationships created successfully.')
}

export async function createApplicationInfrastructureHosting(session: Session) {
  console.log('Creating Application-Infrastructure hosting relationships...')

  // Cloud-hosted applications
  await session.run(`
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (sap_vm_cluster:Infrastructure {id: "infra-sap-vm-cluster"})
    CREATE (sap_s4hana)-[:HOSTED_ON]->(sap_vm_cluster)
  `)

  await session.run(`
    MATCH (mes_system:Application {id: "app-mes-solar"})
    MATCH (rd_platform:Application {id: "app-rd-platform"})
    MATCH (eks_production:Infrastructure {id: "infra-eks-production"})
    CREATE (mes_system)-[:HOSTED_ON]->(eks_production)
    CREATE (rd_platform)-[:HOSTED_ON]->(eks_production)
  `)

  await session.run(`
    MATCH (quality_system:Application {id: "app-quality-solar"})
    MATCH (ecs_cluster:Infrastructure {id: "infra-ecs-cluster"})
    CREATE (quality_system)-[:HOSTED_ON]->(ecs_cluster)
  `)

  await session.run(`
    MATCH (oracle_scm:Application {id: "app-oracle-scm"})
    MATCH (oracle_vm_cluster:Infrastructure {id: "infra-oracle-vm-cluster"})
    CREATE (oracle_scm)-[:HOSTED_ON]->(oracle_vm_cluster)
  `)

  // On-premise applications
  await session.run(`
    MATCH (siemens_plm:Application {id: "app-siemens-plm"})
    MATCH (plm_servers:Infrastructure {id: "infra-plm-servers"})
    CREATE (siemens_plm)-[:HOSTED_ON]->(plm_servers)
  `)

  await session.run(`
    MATCH (wms_system:Application {id: "app-wms-manhattan"})
    MATCH (wms_servers:Infrastructure {id: "infra-wms-servers"})
    CREATE (wms_system)-[:HOSTED_ON]->(wms_servers)
  `)

  console.log('Application-Infrastructure hosting relationships created successfully.')
}

export async function createApplicationSuccessorRelationships(session: Session) {
  console.log('Creating Application Successor relationships...')

  // Legacy ERP to SAP S/4HANA succession
  await session.run(`
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (legacy_erp:Application {id: "app-legacy-erp"})
    CREATE (sap_s4hana)-[:SUCCESSOR_OF]->(legacy_erp)
  `)

  console.log('Application successor relationships created successfully.')
}
