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
    MATCH (sales_execution:BusinessCapability {id: "cap-sales-execution"})
    CREATE (sap_s4hana)-[:SUPPORTS]->(finance_accounting)
    CREATE (sap_s4hana)-[:SUPPORTS]->(procurement)
    CREATE (sap_s4hana)-[:SUPPORTS]->(sales_execution)
  `)

  // Salesforce CRM supports sales and marketing
  await session.run(`
    MATCH (salesforce_crm:Application {id: "app-salesforce-crm"})
    MATCH (sales_execution:BusinessCapability {id: "cap-sales-execution"})
    MATCH (channel_mgmt:BusinessCapability {id: "cap-channel-management"})
    CREATE (salesforce_crm)-[:SUPPORTS]->(sales_execution)
    CREATE (salesforce_crm)-[:SUPPORTS]->(channel_mgmt)
  `)

  // Manufacturing systems
  await session.run(`
    MATCH (mes_system:Application {id: "app-mes-solar"})
    MATCH (cell_production:BusinessCapability {id: "cap-cell-production"})
    MATCH (module_assembly:BusinessCapability {id: "cap-module-assembly"})
    MATCH (packaging_shipping:BusinessCapability {id: "cap-packaging-shipping"})
    CREATE (mes_system)-[:SUPPORTS]->(cell_production)
    CREATE (mes_system)-[:SUPPORTS]->(module_assembly)
    CREATE (mes_system)-[:SUPPORTS]->(packaging_shipping)
  `)

  // Quality system
  await session.run(`
    MATCH (quality_system:Application {id: "app-quality-solar"})
    MATCH (incoming_inspection:BusinessCapability {id: "cap-incoming-inspection"})
    MATCH (production_testing:BusinessCapability {id: "cap-production-testing"})
    MATCH (certification_compliance:BusinessCapability {id: "cap-certification-compliance"})
    CREATE (quality_system)-[:SUPPORTS]->(incoming_inspection)
    CREATE (quality_system)-[:SUPPORTS]->(production_testing)
    CREATE (quality_system)-[:SUPPORTS]->(certification_compliance)
  `)

  // Other application-capability relationships
  await session.run(`
    MATCH (oracle_scm:Application {id: "app-oracle-scm"})
    MATCH (supplier_mgmt:BusinessCapability {id: "cap-supplier-management"})
    MATCH (procurement:BusinessCapability {id: "cap-procurement"})
    MATCH (inventory_mgmt:BusinessCapability {id: "cap-inventory-management"})
    CREATE (oracle_scm)-[:SUPPORTS]->(supplier_mgmt)
    CREATE (oracle_scm)-[:SUPPORTS]->(procurement)
    CREATE (oracle_scm)-[:SUPPORTS]->(inventory_mgmt)
  `)

  await session.run(`
    MATCH (rd_platform:Application {id: "app-rd-platform"})
    MATCH (product_innovation:BusinessCapability {id: "cap-product-innovation"})
    MATCH (materials_research:BusinessCapability {id: "cap-materials-research"})
    MATCH (prototype_testing:BusinessCapability {id: "cap-prototype-testing"})
    CREATE (rd_platform)-[:SUPPORTS]->(product_innovation)
    CREATE (rd_platform)-[:SUPPORTS]->(materials_research)
    CREATE (rd_platform)-[:SUPPORTS]->(prototype_testing)
  `)

  await session.run(`
    MATCH (hubspot_marketing:Application {id: "app-hubspot-marketing"})
    MATCH (lead_generation:BusinessCapability {id: "cap-lead-generation"})
    CREATE (hubspot_marketing)-[:SUPPORTS]->(lead_generation)
  `)

  await session.run(`
    MATCH (zendesk_service:Application {id: "app-zendesk-service"})
    MATCH (technical_support:BusinessCapability {id: "cap-technical-support"})
    MATCH (warranty_management:BusinessCapability {id: "cap-warranty-management"})
    CREATE (zendesk_service)-[:SUPPORTS]->(technical_support)
    CREATE (zendesk_service)-[:SUPPORTS]->(warranty_management)
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
    MATCH (product_innovation:BusinessCapability {id: "cap-product-innovation"})
    CREATE (siemens_plm)-[:SUPPORTS]->(product_innovation)
  `)

  // ServiceNow supports IT Management capabilities
  await session.run(`
    MATCH (servicenow:Application {id: "app-servicenow"})
    MATCH (it_service_management:BusinessCapability {id: "cap-it-service-management"})
    MATCH (infrastructure_management:BusinessCapability {id: "cap-infrastructure-management"})
    MATCH (application_management:BusinessCapability {id: "cap-application-management"})
    CREATE (servicenow)-[:SUPPORTS]->(it_service_management)
    CREATE (servicenow)-[:SUPPORTS]->(infrastructure_management)
    CREATE (servicenow)-[:SUPPORTS]->(application_management)
  `)

  // SAP Concur supports financial management
  await session.run(`
    MATCH (concur:Application {id: "app-concur"})
    MATCH (financial_planning:BusinessCapability {id: "cap-financial-planning"})
    MATCH (accounts_payable:BusinessCapability {id: "cap-accounts-payable"})
    CREATE (concur)-[:SUPPORTS]->(financial_planning)
    CREATE (concur)-[:SUPPORTS]->(accounts_payable)
  `)

  // Cornerstone supports HR and customer training
  await session.run(`
    MATCH (cornerstone:Application {id: "app-cornerstone-lms"})
    MATCH (performance_management:BusinessCapability {id: "cap-performance-management"})
    MATCH (customer_training:BusinessCapability {id: "cap-customer-training"})
    CREATE (cornerstone)-[:SUPPORTS]->(performance_management)
    CREATE (cornerstone)-[:SUPPORTS]->(customer_training)
  `)

  // Oracle Hyperion supports financial planning and reporting
  await session.run(`
    MATCH (hyperion:Application {id: "app-oracle-hyperion"})
    MATCH (financial_planning:BusinessCapability {id: "cap-financial-planning"})
    MATCH (financial_reporting:BusinessCapability {id: "cap-financial-reporting"})
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

export async function createArchitecturePrincipleRelationships(session: Session) {
  console.log('Creating Architecture Principle relationships...')

  // Architecture to Architecture Principle relationships
  await session.run(`
    MATCH (current_arch:Architecture {id: "arch-current-state-2024"})
    MATCH (target_arch:Architecture {id: "arch-target-state-2027"})
    MATCH (business_arch:Architecture {id: "arch-business-2024"})
    MATCH (data_arch:Architecture {id: "arch-data-2024"})
    MATCH (app_arch:Architecture {id: "arch-application-2024"})
    MATCH (tech_arch:Architecture {id: "arch-technology-2024"})
    
    MATCH (cloud_first:ArchitecturePrinciple {id: "principle-cloud-first"})
    MATCH (api_first:ArchitecturePrinciple {id: "principle-api-first"})
    MATCH (zero_trust:ArchitecturePrinciple {id: "principle-zero-trust"})
    MATCH (data_protection:ArchitecturePrinciple {id: "principle-data-protection"})
    MATCH (customer_centricity:ArchitecturePrinciple {id: "principle-customer-centricity"})
    MATCH (automation:ArchitecturePrinciple {id: "principle-automation-first"})
    MATCH (business_agility:ArchitecturePrinciple {id: "principle-business-agility"})
    MATCH (sustainability:ArchitecturePrinciple {id: "principle-sustainability"})
    MATCH (data_asset:ArchitecturePrinciple {id: "principle-data-asset"})
    MATCH (microservices:ArchitecturePrinciple {id: "principle-microservices"})
    MATCH (open_standards:ArchitecturePrinciple {id: "principle-open-standards"})
    MATCH (edge_computing:ArchitecturePrinciple {id: "principle-edge-computing"})
    MATCH (event_driven:ArchitecturePrinciple {id: "principle-event-driven"})
    MATCH (performance_design:ArchitecturePrinciple {id: "principle-performance-design"})
    MATCH (cost_transparency:ArchitecturePrinciple {id: "principle-cost-transparency"})
    MATCH (single_source_truth:ArchitecturePrinciple {id: "principle-single-source-truth"})
    MATCH (real_time_visibility:ArchitecturePrinciple {id: "principle-real-time-visibility"})
    
    // Current Architecture applies basic principles
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(zero_trust)
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(data_protection)
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(customer_centricity)
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(open_standards)
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(cost_transparency)
    
    // Target Architecture applies all modern principles
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(cloud_first)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(api_first)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(zero_trust)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(data_protection)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(customer_centricity)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(automation)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(business_agility)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(sustainability)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(real_time_visibility)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(event_driven)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(edge_computing)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(performance_design)
    
    // Business Architecture
    CREATE (business_arch)-[:APPLIES_PRINCIPLE]->(business_agility)
    CREATE (business_arch)-[:APPLIES_PRINCIPLE]->(customer_centricity)
    CREATE (business_arch)-[:APPLIES_PRINCIPLE]->(sustainability)
    
    // Data Architecture
    CREATE (data_arch)-[:APPLIES_PRINCIPLE]->(data_asset)
    CREATE (data_arch)-[:APPLIES_PRINCIPLE]->(single_source_truth)
    CREATE (data_arch)-[:APPLIES_PRINCIPLE]->(real_time_visibility)
    CREATE (data_arch)-[:APPLIES_PRINCIPLE]->(data_protection)
    
    // Application Architecture
    CREATE (app_arch)-[:APPLIES_PRINCIPLE]->(api_first)
    CREATE (app_arch)-[:APPLIES_PRINCIPLE]->(microservices)
    CREATE (app_arch)-[:APPLIES_PRINCIPLE]->(open_standards)
    CREATE (app_arch)-[:APPLIES_PRINCIPLE]->(performance_design)
    
    // Technology Architecture
    CREATE (tech_arch)-[:APPLIES_PRINCIPLE]->(cloud_first)
    CREATE (tech_arch)-[:APPLIES_PRINCIPLE]->(automation)
    CREATE (tech_arch)-[:APPLIES_PRINCIPLE]->(edge_computing)
    CREATE (tech_arch)-[:APPLIES_PRINCIPLE]->(zero_trust)
  `)

  // Application to Architecture Principle relationships
  await session.run(`
    MATCH (sap_s4hana:Application {id: "app-sap-s4hana"})
    MATCH (salesforce_crm:Application {id: "app-salesforce-crm"})
    MATCH (mes_system:Application {id: "app-mes-solar"})
    MATCH (quality_system:Application {id: "app-quality-solar"})
    MATCH (oracle_scm:Application {id: "app-oracle-scm"})
    MATCH (rd_platform:Application {id: "app-rd-platform"})
    MATCH (workday_hr:Application {id: "app-workday-hr"})
    MATCH (hubspot_marketing:Application {id: "app-hubspot-marketing"})
    MATCH (zendesk_service:Application {id: "app-zendesk-service"})
    MATCH (wms_system:Application {id: "app-wms-manhattan"})
    MATCH (power_bi:Application {id: "app-power-bi"})
    MATCH (siemens_plm:Application {id: "app-siemens-plm"})
    MATCH (servicenow:Application {id: "app-servicenow"})
    MATCH (concur:Application {id: "app-concur"})
    MATCH (cornerstone:Application {id: "app-cornerstone-lms"})
    MATCH (hyperion:Application {id: "app-oracle-hyperion"})
    
    MATCH (cloud_first:ArchitecturePrinciple {id: "principle-cloud-first"})
    MATCH (api_first:ArchitecturePrinciple {id: "principle-api-first"})
    MATCH (zero_trust:ArchitecturePrinciple {id: "principle-zero-trust"})
    MATCH (data_protection:ArchitecturePrinciple {id: "principle-data-protection"})
    MATCH (customer_centricity:ArchitecturePrinciple {id: "principle-customer-centricity"})
    MATCH (automation:ArchitecturePrinciple {id: "principle-automation-first"})
    MATCH (business_agility:ArchitecturePrinciple {id: "principle-business-agility"})
    MATCH (sustainability:ArchitecturePrinciple {id: "principle-sustainability"})
    MATCH (data_asset:ArchitecturePrinciple {id: "principle-data-asset"})
    MATCH (microservices:ArchitecturePrinciple {id: "principle-microservices"})
    MATCH (open_standards:ArchitecturePrinciple {id: "principle-open-standards"})
    MATCH (performance_design:ArchitecturePrinciple {id: "principle-performance-design"})
    MATCH (cost_transparency:ArchitecturePrinciple {id: "principle-cost-transparency"})
    MATCH (single_source_truth:ArchitecturePrinciple {id: "principle-single-source-truth"})
    MATCH (real_time_visibility:ArchitecturePrinciple {id: "principle-real-time-visibility"})
    
    // Cloud-native applications implement cloud-first principle
    CREATE (sap_s4hana)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (salesforce_crm)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (mes_system)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (quality_system)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (rd_platform)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (workday_hr)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (hubspot_marketing)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (zendesk_service)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (power_bi)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (servicenow)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (concur)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (cornerstone)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    
    // API-based applications implement API-first principle
    CREATE (salesforce_crm)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (mes_system)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (rd_platform)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (hubspot_marketing)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (zendesk_service)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (servicenow)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (concur)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (cornerstone)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    
    // All active applications implement zero trust security
    CREATE (sap_s4hana)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (salesforce_crm)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (mes_system)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (quality_system)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (oracle_scm)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (rd_platform)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (workday_hr)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (hubspot_marketing)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (zendesk_service)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (wms_system)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (power_bi)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (siemens_plm)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (servicenow)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (concur)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (cornerstone)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (hyperion)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    
    // Data-intensive applications implement data protection
    CREATE (sap_s4hana)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    CREATE (mes_system)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    CREATE (quality_system)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    CREATE (oracle_scm)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    CREATE (rd_platform)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    CREATE (workday_hr)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    CREATE (power_bi)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    CREATE (siemens_plm)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    CREATE (hyperion)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    
    // Customer-facing applications implement customer centricity
    CREATE (salesforce_crm)-[:IMPLEMENTS_PRINCIPLE]->(customer_centricity)
    CREATE (hubspot_marketing)-[:IMPLEMENTS_PRINCIPLE]->(customer_centricity)
    CREATE (zendesk_service)-[:IMPLEMENTS_PRINCIPLE]->(customer_centricity)
    CREATE (cornerstone)-[:IMPLEMENTS_PRINCIPLE]->(customer_centricity)
    
    // Manufacturing applications implement automation-first
    CREATE (mes_system)-[:IMPLEMENTS_PRINCIPLE]->(automation)
    CREATE (quality_system)-[:IMPLEMENTS_PRINCIPLE]->(automation)
    CREATE (wms_system)-[:IMPLEMENTS_PRINCIPLE]->(automation)
    CREATE (servicenow)-[:IMPLEMENTS_PRINCIPLE]->(automation)
    
    // Engineering applications implement sustainability and performance
    CREATE (siemens_plm)-[:IMPLEMENTS_PRINCIPLE]->(sustainability)
    CREATE (siemens_plm)-[:IMPLEMENTS_PRINCIPLE]->(open_standards)
    CREATE (siemens_plm)-[:IMPLEMENTS_PRINCIPLE]->(performance_design)
    
    CREATE (oracle_scm)-[:IMPLEMENTS_PRINCIPLE]->(sustainability)
    CREATE (oracle_scm)-[:IMPLEMENTS_PRINCIPLE]->(performance_design)
    
    CREATE (wms_system)-[:IMPLEMENTS_PRINCIPLE]->(performance_design)
    CREATE (wms_system)-[:IMPLEMENTS_PRINCIPLE]->(open_standards)
    
    // Business applications implement business agility
    CREATE (salesforce_crm)-[:IMPLEMENTS_PRINCIPLE]->(business_agility)
    CREATE (servicenow)-[:IMPLEMENTS_PRINCIPLE]->(business_agility)
    
    // Financial applications implement cost transparency
    CREATE (concur)-[:IMPLEMENTS_PRINCIPLE]->(cost_transparency)
    CREATE (hyperion)-[:IMPLEMENTS_PRINCIPLE]->(cost_transparency)
    
    // Analytics applications implement data principles
    CREATE (power_bi)-[:IMPLEMENTS_PRINCIPLE]->(data_asset)
    CREATE (power_bi)-[:IMPLEMENTS_PRINCIPLE]->(real_time_visibility)
    CREATE (power_bi)-[:IMPLEMENTS_PRINCIPLE]->(single_source_truth)
    
    // Custom applications implement microservices
    CREATE (mes_system)-[:IMPLEMENTS_PRINCIPLE]->(microservices)
    CREATE (quality_system)-[:IMPLEMENTS_PRINCIPLE]->(microservices)
    CREATE (rd_platform)-[:IMPLEMENTS_PRINCIPLE]->(microservices)
  `)

  console.log('Architecture Principle relationships created successfully.')
}

export async function createArchitectureRelationships(session: Session) {
  console.log('Creating Architecture relationships...')

  // Architecture hierarchical relationships
  await session.run(`
    MATCH (current:Architecture {id: "arch-current-state-2024"})
    MATCH (transition1:Architecture {id: "arch-transition-phase1-2025"})
    MATCH (transition2:Architecture {id: "arch-transition-phase2-2026"})
    MATCH (target:Architecture {id: "arch-target-state-2027"})
    CREATE (transition1)-[:PART_OF]->(current)
    CREATE (transition2)-[:PART_OF]->(transition1)
    CREATE (target)-[:PART_OF]->(transition2)
  `)

  // Architecture to Application relationships
  await session.run(`
    MATCH (current_arch:Architecture {id: "arch-current-state-2024"})
    MATCH (app_arch:Architecture {id: "arch-application-2024"})
    
    // Current architecture contains current applications
    MATCH (sap:Application {id: "app-sap-s4hana"})
    MATCH (mes:Application {id: "app-mes-solar"})
    MATCH (quality:Application {id: "app-quality-solar"})
    MATCH (salesforce:Application {id: "app-salesforce-crm"})
    MATCH (oracle_scm:Application {id: "app-oracle-scm"})
    MATCH (wms:Application {id: "app-wms-manhattan"})
    MATCH (plm:Application {id: "app-siemens-plm"})
    
    CREATE (current_arch)-[:CONTAINS]->(sap)
    CREATE (current_arch)-[:CONTAINS]->(mes)
    CREATE (current_arch)-[:CONTAINS]->(quality)
    CREATE (current_arch)-[:CONTAINS]->(salesforce)
    CREATE (current_arch)-[:CONTAINS]->(oracle_scm)
    CREATE (current_arch)-[:CONTAINS]->(wms)
    CREATE (current_arch)-[:CONTAINS]->(plm)
    
    CREATE (app_arch)-[:CONTAINS]->(sap)
    CREATE (app_arch)-[:CONTAINS]->(mes)
    CREATE (app_arch)-[:CONTAINS]->(quality)
    CREATE (app_arch)-[:CONTAINS]->(salesforce)
    CREATE (app_arch)-[:CONTAINS]->(oracle_scm)
    CREATE (app_arch)-[:CONTAINS]->(wms)
    CREATE (app_arch)-[:CONTAINS]->(plm)
  `)

  // Architecture to Infrastructure relationships
  await session.run(`
    MATCH (tech_arch:Architecture {id: "arch-technology-2024"})
    MATCH (current_arch:Architecture {id: "arch-current-state-2024"})
    
    MATCH (aws_eu:Infrastructure {id: "infra-aws-eu-west-1"})
    MATCH (aws_us:Infrastructure {id: "infra-aws-us-east-1"})
    MATCH (eks_prod:Infrastructure {id: "infra-eks-production"})
    MATCH (ecs_staging:Infrastructure {id: "infra-ecs-staging"})
    MATCH (on_premise:Infrastructure {id: "infra-datacenter-munich"})
    
    CREATE (tech_arch)-[:CONTAINS]->(aws_eu)
    CREATE (tech_arch)-[:CONTAINS]->(aws_us)
    CREATE (tech_arch)-[:CONTAINS]->(eks_prod)
    CREATE (tech_arch)-[:CONTAINS]->(ecs_staging)
    CREATE (tech_arch)-[:CONTAINS]->(on_premise)
    
    CREATE (current_arch)-[:CONTAINS]->(aws_eu)
    CREATE (current_arch)-[:CONTAINS]->(on_premise)
  `)

  // Architecture to Business Capability relationships
  await session.run(`
    MATCH (business_arch:Architecture {id: "arch-business-2024"})
    MATCH (current_arch:Architecture {id: "arch-current-state-2024"})
    
    MATCH (rd:BusinessCapability {id: "cap-research-development"})
    MATCH (manufacturing:BusinessCapability {id: "cap-manufacturing-operations"})
    MATCH (sales:BusinessCapability {id: "cap-sales-marketing"})
    MATCH (quality:BusinessCapability {id: "cap-quality-management"})
    MATCH (supply_chain:BusinessCapability {id: "cap-supply-chain"})
    
    CREATE (business_arch)-[:CONTAINS]->(rd)
    CREATE (business_arch)-[:CONTAINS]->(manufacturing)
    CREATE (business_arch)-[:CONTAINS]->(sales)
    CREATE (business_arch)-[:CONTAINS]->(quality)
    CREATE (business_arch)-[:CONTAINS]->(supply_chain)
    
    CREATE (current_arch)-[:CONTAINS]->(rd)
    CREATE (current_arch)-[:CONTAINS]->(manufacturing)
    CREATE (current_arch)-[:CONTAINS]->(sales)
    CREATE (current_arch)-[:CONTAINS]->(quality)
    CREATE (current_arch)-[:CONTAINS]->(supply_chain)
  `)

  console.log('Architecture relationships created successfully.')
}

export async function createArchitectureOwnership(session: Session) {
  console.log('Creating Architecture Ownership relationships...')

  // Enterprise Architect owns all architectures
  await session.run(`
    MATCH (enterprise_architect:Person {id: "person-enterprise-architect"})
    MATCH (current_arch:Architecture {id: "arch-current-state-2024"})
    MATCH (target_arch:Architecture {id: "arch-target-state-2027"})
    MATCH (transition1:Architecture {id: "arch-transition-phase1-2025"})
    MATCH (transition2:Architecture {id: "arch-transition-phase2-2026"})
    MATCH (business_arch:Architecture {id: "arch-business-2024"})
    MATCH (data_arch:Architecture {id: "arch-data-2024"})
    MATCH (app_arch:Architecture {id: "arch-application-2024"})
    MATCH (tech_arch:Architecture {id: "arch-technology-2024"})
    
    CREATE (current_arch)-[:OWNED_BY]->(enterprise_architect)
    CREATE (target_arch)-[:OWNED_BY]->(enterprise_architect)
    CREATE (transition1)-[:OWNED_BY]->(enterprise_architect)
    CREATE (transition2)-[:OWNED_BY]->(enterprise_architect)
    CREATE (business_arch)-[:OWNED_BY]->(enterprise_architect)
    CREATE (data_arch)-[:OWNED_BY]->(enterprise_architect)
    CREATE (app_arch)-[:OWNED_BY]->(enterprise_architect)
    CREATE (tech_arch)-[:OWNED_BY]->(enterprise_architect)
  `)

  // CTO also owns technology architectures
  await session.run(`
    MATCH (cto:Person {id: "person-cto"})
    MATCH (tech_arch:Architecture {id: "arch-technology-2024"})
    MATCH (target_arch:Architecture {id: "arch-target-state-2027"})
    CREATE (tech_arch)-[:OWNED_BY]->(cto)
    CREATE (target_arch)-[:OWNED_BY]->(cto)
  `)

  // VP Engineering owns application architecture
  await session.run(`
    MATCH (vp_engineering:Person {id: "person-vp-engineering"})
    MATCH (app_arch:Architecture {id: "arch-application-2024"})
    MATCH (transition1:Architecture {id: "arch-transition-phase1-2025"})
    CREATE (app_arch)-[:OWNED_BY]->(vp_engineering)
    CREATE (transition1)-[:OWNED_BY]->(vp_engineering)
  `)

  console.log('Architecture ownership relationships created successfully.')
}
