// Relationships for Heat Pump Manufacturing Company
// Creates all the interconnections between different enterprise architecture elements

import { Session } from 'neo4j-driver'

export async function createCapabilityHierarchy(session: Session) {
  console.log('Creating Capability Hierarchy relationships...')

  // Research & Development hierarchy
  await session.run(`
    MATCH (research:BusinessCapability {id: "hp-cap-research-development"})
    MATCH (thermal_design:BusinessCapability {id: "hp-cap-thermal-design"})
    MATCH (refrigerant_tech:BusinessCapability {id: "hp-cap-refrigerant-tech"})
    MATCH (smart_controls:BusinessCapability {id: "hp-cap-smart-controls"})
    CREATE (thermal_design)-[:HAS_PARENT]->(research)
    CREATE (refrigerant_tech)-[:HAS_PARENT]->(research)
    CREATE (smart_controls)-[:HAS_PARENT]->(research)
  `)

  // Manufacturing Operations hierarchy
  await session.run(`
    MATCH (manufacturing:BusinessCapability {id: "hp-cap-manufacturing"})
    MATCH (compressor_manufacturing:BusinessCapability {id: "hp-cap-compressor-manufacturing"})
    MATCH (heat_exchanger_manufacturing:BusinessCapability {id: "hp-cap-heat-exchanger-manufacturing"})
    MATCH (system_assembly:BusinessCapability {id: "hp-cap-system-assembly"})
    CREATE (compressor_manufacturing)-[:HAS_PARENT]->(manufacturing)
    CREATE (heat_exchanger_manufacturing)-[:HAS_PARENT]->(manufacturing)
    CREATE (system_assembly)-[:HAS_PARENT]->(manufacturing)
  `)

  // Sales & Marketing hierarchy
  await session.run(`
    MATCH (sales_marketing:BusinessCapability {id: "hp-cap-sales-marketing"})
    MATCH (channel_management:BusinessCapability {id: "hp-cap-channel-management"})
    MATCH (digital_marketing:BusinessCapability {id: "hp-cap-digital-marketing"})
    MATCH (product_management:BusinessCapability {id: "hp-cap-product-management"})
    CREATE (channel_management)-[:HAS_PARENT]->(sales_marketing)
    CREATE (digital_marketing)-[:HAS_PARENT]->(sales_marketing)
    CREATE (product_management)-[:HAS_PARENT]->(sales_marketing)
  `)

  // Service & Support hierarchy
  await session.run(`
    MATCH (service_support:BusinessCapability {id: "hp-cap-service-support"})
    MATCH (installation_services:BusinessCapability {id: "hp-cap-installation-services"})
    MATCH (maintenance_services:BusinessCapability {id: "hp-cap-maintenance-services"})
    MATCH (remote_monitoring:BusinessCapability {id: "hp-cap-remote-monitoring"})
    MATCH (customer_support:BusinessCapability {id: "hp-cap-customer-support"})
    CREATE (installation_services)-[:HAS_PARENT]->(service_support)
    CREATE (maintenance_services)-[:HAS_PARENT]->(service_support)
    CREATE (remote_monitoring)-[:HAS_PARENT]->(service_support)
    CREATE (customer_support)-[:HAS_PARENT]->(service_support)
  `)

  // Strategy & Corporate Management hierarchy
  await session.run(`
    MATCH (strategy:BusinessCapability {id: "hp-cap-strategy-management"})
    MATCH (strategicPlanning:BusinessCapability {id: "hp-cap-strategic-planning"})
    MATCH (corporateGovernance:BusinessCapability {id: "hp-cap-corporate-governance"})
    CREATE (strategicPlanning)-[:HAS_PARENT]->(strategy)
    CREATE (corporateGovernance)-[:HAS_PARENT]->(strategy)
  `)

  // Human Resources hierarchy
  await session.run(`
    MATCH (hr:BusinessCapability {id: "hp-cap-human-resources"})
    MATCH (talent_mgmt:BusinessCapability {id: "hp-cap-talent-management"})
    MATCH (payroll_benefits:BusinessCapability {id: "hp-cap-payroll-benefits"})
    CREATE (talent_mgmt)-[:HAS_PARENT]->(hr)
    CREATE (payroll_benefits)-[:HAS_PARENT]->(hr)
  `)

  // Finance & Controlling hierarchy
  await session.run(`
    MATCH (finance:BusinessCapability {id: "hp-cap-finance"})
    MATCH (financial_planning:BusinessCapability {id: "hp-cap-financial-planning"})
    MATCH (accounting_reporting:BusinessCapability {id: "hp-cap-accounting-reporting"})
    CREATE (financial_planning)-[:HAS_PARENT]->(finance)
    CREATE (accounting_reporting)-[:HAS_PARENT]->(finance)
  `)

  // IT hierarchy
  await session.run(`
    MATCH (it:BusinessCapability {id: "hp-cap-it"})
    MATCH (application_mgmt:BusinessCapability {id: "hp-cap-application-management"})
    MATCH (infrastructure_mgmt:BusinessCapability {id: "hp-cap-infrastructure-management"})
    CREATE (application_mgmt)-[:HAS_PARENT]->(it)
    CREATE (infrastructure_mgmt)-[:HAS_PARENT]->(it)
  `)

  console.log('Capability hierarchy relationships created successfully.')

  // Service & Support hierarchy
  await session.run(`
    MATCH (service_support:BusinessCapability {id: "hp-cap-service-support"})
    MATCH (installation_services:BusinessCapability {id: "hp-cap-installation-services"})
    MATCH (maintenance_repair:BusinessCapability {id: "hp-cap-maintenance-repair"})
    MATCH (remote_monitoring:BusinessCapability {id: "hp-cap-remote-monitoring"})
    CREATE (installation_services)-[:HAS_PARENT]->(service_support)
    CREATE (maintenance_repair)-[:HAS_PARENT]->(service_support)
    CREATE (remote_monitoring)-[:HAS_PARENT]->(service_support)
  `)

  // Quality Management hierarchy
  await session.run(`
    MATCH (quality_mgmt:BusinessCapability {id: "hp-cap-quality-management"})
    MATCH (quality_assurance:BusinessCapability {id: "hp-cap-quality-assurance"})
    MATCH (compliance_mgmt:BusinessCapability {id: "hp-cap-compliance-management"})
    CREATE (quality_assurance)-[:HAS_PARENT]->(quality_mgmt)
    CREATE (compliance_mgmt)-[:HAS_PARENT]->(quality_mgmt)
  `)

  // Finance & Operations hierarchy
  await session.run(`
    MATCH (finance_operations:BusinessCapability {id: "hp-cap-finance-operations"})
    MATCH (financial_planning:BusinessCapability {id: "hp-cap-financial-planning"})
    MATCH (cost_management:BusinessCapability {id: "hp-cap-cost-management"})
    CREATE (financial_planning)-[:HAS_PARENT]->(finance_operations)
    CREATE (cost_management)-[:HAS_PARENT]->(finance_operations)
  `)

  // Technology & Innovation hierarchy
  await session.run(`
    MATCH (technology_innovation:BusinessCapability {id: "hp-cap-technology-innovation"})
    MATCH (iot_platform_mgmt:BusinessCapability {id: "hp-cap-iot-platform-management"})
    MATCH (data_analytics:BusinessCapability {id: "hp-cap-data-analytics"})
    MATCH (energy_optimization:BusinessCapability {id: "hp-cap-energy-optimization"})
    CREATE (iot_platform_mgmt)-[:HAS_PARENT]->(technology_innovation)
    CREATE (data_analytics)-[:HAS_PARENT]->(technology_innovation)
    CREATE (energy_optimization)-[:HAS_PARENT]->(technology_innovation)
  `)

  console.log('Capability hierarchy relationships created successfully.')
}

export async function createApplicationCapabilitySupport(session: Session) {
  console.log('Creating Application-Capability Support relationships...')

  // SAP S/4HANA supports multiple capabilities
  await session.run(`
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (financial_planning:BusinessCapability {id: "hp-cap-financial-planning"})
    MATCH (digital_marketing:BusinessCapability {id: "hp-cap-digital-marketing"})
    MATCH (channel_management:BusinessCapability {id: "hp-cap-channel-management"})
    CREATE (sap_s4hana)-[:SUPPORTS]->(financial_planning)
    CREATE (sap_s4hana)-[:SUPPORTS]->(digital_marketing)
    CREATE (sap_s4hana)-[:SUPPORTS]->(channel_management)
  `)

  // Manufacturing systems
  await session.run(`
    MATCH (mes_system:Application {id: "hp-app-hvac-mes"})
    MATCH (compressor_manufacturing:BusinessCapability {id: "hp-cap-compressor-manufacturing"})
    MATCH (heat_exchanger_manufacturing:BusinessCapability {id: "hp-cap-heat-exchanger-manufacturing"})
    MATCH (system_assembly:BusinessCapability {id: "hp-cap-system-assembly"})
    CREATE (mes_system)-[:SUPPORTS]->(compressor_manufacturing)
    CREATE (mes_system)-[:SUPPORTS]->(heat_exchanger_manufacturing)
    CREATE (mes_system)-[:SUPPORTS]->(system_assembly)
  `)

  // Quality system
  await session.run(`
    MATCH (quality_system:Application {id: "hp-app-quality-management"})
    MATCH (quality_management:BusinessCapability {id: "hp-cap-quality-management"})
    MATCH (manufacturing:BusinessCapability {id: "hp-cap-manufacturing"})
    CREATE (quality_system)-[:SUPPORTS]->(quality_management)
    CREATE (quality_system)-[:SUPPORTS]->(manufacturing)
  `)

  // IoT and analytics platform
  await session.run(`
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (remote_monitoring:BusinessCapability {id: "hp-cap-remote-monitoring"})
    MATCH (application_management:BusinessCapability {id: "hp-cap-application-management"})
    MATCH (energy_efficiency:BusinessCapability {id: "hp-cap-energy-efficiency"})
    CREATE (iot_platform)-[:SUPPORTS]->(remote_monitoring)
    CREATE (iot_platform)-[:SUPPORTS]->(application_management)
    CREATE (iot_platform)-[:SUPPORTS]->(energy_efficiency)
  `)

  // Energy optimization platform
  await session.run(`
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    MATCH (energy_efficiency:BusinessCapability {id: "hp-cap-energy-efficiency"})
    MATCH (sustainability:BusinessCapability {id: "hp-cap-sustainability"})
    MATCH (remote_monitoring:BusinessCapability {id: "hp-cap-remote-monitoring"})
    CREATE (energy_analytics)-[:SUPPORTS]->(energy_efficiency)
    CREATE (energy_analytics)-[:SUPPORTS]->(sustainability)
    CREATE (energy_analytics)-[:SUPPORTS]->(remote_monitoring)
  `)

  // CRM system capabilities
  await session.run(`
    MATCH (crm_system:Application {id: "hp-app-crm-salesforce"})
    MATCH (channel_management:BusinessCapability {id: "hp-cap-channel-management"})
    MATCH (customer_support:BusinessCapability {id: "hp-cap-customer-support"})
    MATCH (digital_marketing:BusinessCapability {id: "hp-cap-digital-marketing"})
    CREATE (crm_system)-[:SUPPORTS]->(channel_management)
    CREATE (crm_system)-[:SUPPORTS]->(customer_support)
    CREATE (crm_system)-[:SUPPORTS]->(digital_marketing)
  `)

  // SCM system capabilities - entfernt da keine entsprechende App existiert
  // Ersetzt durch Legacy PLM Support

  // R&D platform capabilities
  await session.run(`
    MATCH (rd_platform:Application {id: "hp-app-thermal-cad"})
    MATCH (thermal_design:BusinessCapability {id: "hp-cap-thermal-design"})
    MATCH (refrigerant_tech:BusinessCapability {id: "hp-cap-refrigerant-tech"})
    MATCH (smart_controls:BusinessCapability {id: "hp-cap-smart-controls"})
    CREATE (rd_platform)-[:SUPPORTS]->(thermal_design)
    CREATE (rd_platform)-[:SUPPORTS]->(refrigerant_tech)
    CREATE (rd_platform)-[:SUPPORTS]->(smart_controls)
  `)

  // Service management capabilities
  await session.run(`
    MATCH (service_mgmt:Application {id: "hp-app-service-management"})
    MATCH (installation_services:BusinessCapability {id: "hp-cap-installation-services"})
    MATCH (maintenance_services:BusinessCapability {id: "hp-cap-maintenance-services"})
    MATCH (customer_support:BusinessCapability {id: "hp-cap-customer-support"})
    CREATE (service_mgmt)-[:SUPPORTS]->(installation_services)
    CREATE (service_mgmt)-[:SUPPORTS]->(maintenance_services)
    CREATE (service_mgmt)-[:SUPPORTS]->(customer_support)
  `)

  // Analytics capabilities
  await session.run(`
    MATCH (power_bi:Application {id: "hp-app-power-bi"})
    MATCH (financial_planning:BusinessCapability {id: "hp-cap-financial-planning"})
    MATCH (accounting_reporting:BusinessCapability {id: "hp-cap-accounting-reporting"})
    CREATE (power_bi)-[:SUPPORTS]->(financial_planning)
    CREATE (power_bi)-[:SUPPORTS]->(accounting_reporting)
  `)

  // Installer portal capabilities
  await session.run(`
    MATCH (installer_portal:Application {id: "hp-app-installer-portal"})
    MATCH (channel_management:BusinessCapability {id: "hp-cap-channel-management"})
    MATCH (installation_services:BusinessCapability {id: "hp-cap-installation-services"})
    CREATE (installer_portal)-[:SUPPORTS]->(channel_management)
    CREATE (installer_portal)-[:SUPPORTS]->(installation_services)
  `)

  // Diagnostic tool capabilities
  await session.run(`
    MATCH (diagnostic_tool:Application {id: "hp-app-diagnostic-tool"})
    MATCH (remote_monitoring:BusinessCapability {id: "hp-cap-remote-monitoring"})
    MATCH (maintenance_services:BusinessCapability {id: "hp-cap-maintenance-services"})
    CREATE (diagnostic_tool)-[:SUPPORTS]->(remote_monitoring)
    CREATE (diagnostic_tool)-[:SUPPORTS]->(maintenance_services)
  `)

  // Legacy PLM capabilities
  await session.run(`
    MATCH (legacy_plm:Application {id: "hp-app-legacy-plm"})
    MATCH (product_management:BusinessCapability {id: "hp-cap-product-management"})
    MATCH (thermal_design:BusinessCapability {id: "hp-cap-thermal-design"})
    CREATE (legacy_plm)-[:SUPPORTS]->(product_management)
    CREATE (legacy_plm)-[:SUPPORTS]->(thermal_design)
  `)

  // Office 365 capabilities
  await session.run(`
    MATCH (office365:Application {id: "hp-app-office365"})
    MATCH (talent_management:BusinessCapability {id: "hp-cap-talent-management"})
    MATCH (corporate_governance:BusinessCapability {id: "hp-cap-corporate-governance"})
    CREATE (office365)-[:SUPPORTS]->(talent_management)
    CREATE (office365)-[:SUPPORTS]->(corporate_governance)
  `)

  console.log('Application-Capability support relationships created successfully.')
}

export async function createApplicationDataRelationships(session: Session) {
  console.log('Creating Application-Data relationships...')

  // SAP S/4HANA data relationships
  await session.run(`
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (financial_data:DataObject {id: "hp-data-financial-reports"})
    MATCH (sales_data:DataObject {id: "hp-data-sales-transactions"})
    MATCH (bom_data:DataObject {id: "hp-data-bill-of-materials"})
    CREATE (financial_data)-[:DATA_SOURCE]->(sap_s4hana)
    CREATE (sales_data)-[:DATA_SOURCE]->(sap_s4hana)
    CREATE (bom_data)-[:DATA_SOURCE]->(sap_s4hana)
    CREATE (sap_s4hana)-[:USES]->(financial_data)
    CREATE (sap_s4hana)-[:USES]->(sales_data)
    CREATE (sap_s4hana)-[:USES]->(bom_data)
  `)

  // MES system data relationships
  await session.run(`
    MATCH (mes_system:Application {id: "hp-app-hvac-mes"})
    MATCH (production_data:DataObject {id: "hp-data-production-metrics"})
    MATCH (bom_data:DataObject {id: "hp-data-bill-of-materials"})
    MATCH (diagnostic_logs:DataObject {id: "hp-data-diagnostic-logs"})
    MATCH (quality_records:DataObject {id: "hp-data-quality-records"})
    CREATE (production_data)-[:DATA_SOURCE]->(mes_system)
    CREATE (diagnostic_logs)-[:DATA_SOURCE]->(mes_system)
    CREATE (mes_system)-[:USES]->(production_data)
    CREATE (mes_system)-[:USES]->(bom_data)
    CREATE (mes_system)-[:USES]->(diagnostic_logs)
    CREATE (mes_system)-[:USES]->(quality_records)
  `)

  // Quality system data relationships
  await session.run(`
    MATCH (quality_system:Application {id: "hp-app-quality-management"})
    MATCH (quality_records:DataObject {id: "hp-data-quality-records"})
    MATCH (compliance_records:DataObject {id: "hp-data-compliance-records"})
    MATCH (test_results:DataObject {id: "hp-data-test-results"})
    MATCH (product_specs:DataObject {id: "hp-data-product-specifications"})
    CREATE (quality_records)-[:DATA_SOURCE]->(quality_system)
    CREATE (compliance_records)-[:DATA_SOURCE]->(quality_system)
    CREATE (test_results)-[:DATA_SOURCE]->(quality_system)
    CREATE (quality_system)-[:USES]->(quality_records)
    CREATE (quality_system)-[:USES]->(compliance_records)
    CREATE (quality_system)-[:USES]->(test_results)
    CREATE (quality_system)-[:USES]->(product_specs)
  `)

  // IoT platform data relationships
  await session.run(`
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (sensor_data:DataObject {id: "hp-data-sensor-telemetry"})
    MATCH (diagnostic_logs:DataObject {id: "hp-data-diagnostic-logs"})
    MATCH (maintenance_schedules:DataObject {id: "hp-data-maintenance-schedules"})
    CREATE (sensor_data)-[:DATA_SOURCE]->(iot_platform)
    CREATE (diagnostic_logs)-[:DATA_SOURCE]->(iot_platform)
    CREATE (iot_platform)-[:USES]->(sensor_data)
    CREATE (iot_platform)-[:USES]->(diagnostic_logs)
    CREATE (iot_platform)-[:USES]->(maintenance_schedules)
  `)

  // Energy analytics data relationships
  await session.run(`
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    MATCH (energy_consumption:DataObject {id: "hp-data-energy-consumption"})
    MATCH (weather_data:DataObject {id: "hp-data-weather-conditions"})
    MATCH (sustainability_metrics:DataObject {id: "hp-data-sustainability-metrics"})
    CREATE (energy_analytics)-[:USES]->(energy_consumption)
    CREATE (energy_analytics)-[:USES]->(weather_data)
    CREATE (energy_analytics)-[:USES]->(sustainability_metrics)
    CREATE (sustainability_metrics)-[:DATA_SOURCE]->(energy_analytics)
  `)

  // R&D platform data relationships
  await session.run(`
    MATCH (rd_platform:Application {id: "hp-app-thermal-cad"})
    MATCH (thermal_models:DataObject {id: "hp-data-thermal-models"})
    MATCH (product_specs:DataObject {id: "hp-data-product-specifications"})
    MATCH (refrigerant_properties:DataObject {id: "hp-data-refrigerant-properties"})
    CREATE (thermal_models)-[:DATA_SOURCE]->(rd_platform)
    CREATE (rd_platform)-[:USES]->(thermal_models)
    CREATE (rd_platform)-[:USES]->(product_specs)
    CREATE (rd_platform)-[:USES]->(refrigerant_properties)
  `)

  // Other application-data relationships
  await session.run(`
    MATCH (crm_system:Application {id: "hp-app-crm-salesforce"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    MATCH (sales_data:DataObject {id: "hp-data-sales-transactions"})
    CREATE (crm_system)-[:USES]->(customer_data)
    CREATE (crm_system)-[:USES]->(sales_data)
  `)

  await session.run(`
    MATCH (legacy_plm:Application {id: "hp-app-legacy-plm"})
    MATCH (bom_data:DataObject {id: "hp-data-bill-of-materials"})
    MATCH (supplier_data:DataObject {id: "hp-data-supplier-information"})
    CREATE (legacy_plm)-[:USES]->(bom_data)
    CREATE (legacy_plm)-[:USES]->(supplier_data)
    CREATE (supplier_data)-[:DATA_SOURCE]->(legacy_plm)
  `)

  await session.run(`
    MATCH (service_mgmt:Application {id: "hp-app-service-management"})
    MATCH (installation_records:DataObject {id: "hp-data-installation-records"})
    MATCH (maintenance_schedules:DataObject {id: "hp-data-maintenance-schedules"})
    MATCH (service_tickets:DataObject {id: "hp-data-service-tickets"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    CREATE (service_mgmt)-[:USES]->(installation_records)
    CREATE (service_mgmt)-[:USES]->(maintenance_schedules)
    CREATE (service_mgmt)-[:USES]->(service_tickets)
    CREATE (service_mgmt)-[:USES]->(customer_data)
    CREATE (installation_records)-[:DATA_SOURCE]->(service_mgmt)
    CREATE (maintenance_schedules)-[:DATA_SOURCE]->(service_mgmt)
    CREATE (service_tickets)-[:DATA_SOURCE]->(service_mgmt)
  `)

  await session.run(`
    MATCH (power_bi:Application {id: "hp-app-power-bi"})
    MATCH (financial_data:DataObject {id: "hp-data-financial-reports"})
    MATCH (cost_data:DataObject {id: "hp-data-cost-analysis"})
    MATCH (production_data:DataObject {id: "hp-data-production-metrics"})
    CREATE (power_bi)-[:USES]->(financial_data)
    CREATE (power_bi)-[:USES]->(cost_data)
    CREATE (power_bi)-[:USES]->(production_data)
    CREATE (cost_data)-[:DATA_SOURCE]->(power_bi)
  `)

  await session.run(`
    MATCH (office365:Application {id: "hp-app-office365"})
    MATCH (training_materials:DataObject {id: "hp-data-training-materials"})
    MATCH (knowledge_base:DataObject {id: "hp-data-knowledge-base"})
    CREATE (office365)-[:USES]->(training_materials)
    CREATE (office365)-[:USES]->(knowledge_base)
    CREATE (training_materials)-[:DATA_SOURCE]->(office365)
    CREATE (knowledge_base)-[:DATA_SOURCE]->(office365)
  `)

  await session.run(`
    MATCH (diagnostic_tool:Application {id: "hp-app-diagnostic-tool"})
    MATCH (sensor_data:DataObject {id: "hp-data-sensor-telemetry"})
    MATCH (diagnostic_logs:DataObject {id: "hp-data-diagnostic-logs"})
    MATCH (test_results:DataObject {id: "hp-data-test-results"})
    CREATE (diagnostic_tool)-[:USES]->(sensor_data)
    CREATE (diagnostic_tool)-[:USES]->(diagnostic_logs)
    CREATE (diagnostic_tool)-[:USES]->(test_results)
  `)

  await session.run(`
    MATCH (installer_portal:Application {id: "hp-app-installer-portal"})
    MATCH (installation_records:DataObject {id: "hp-data-installation-records"})
    MATCH (product_specs:DataObject {id: "hp-data-product-specifications"})
    MATCH (training_materials:DataObject {id: "hp-data-training-materials"})
    CREATE (installer_portal)-[:USES]->(installation_records)
    CREATE (installer_portal)-[:USES]->(product_specs)
    CREATE (installer_portal)-[:USES]->(training_materials)
  `)

  console.log('Application-Data relationships created successfully.')
}

export async function createApplicationInfrastructureHosting(session: Session) {
  console.log('Creating Application-Infrastructure hosting relationships...')

  // Cloud-hosted applications
  await session.run(`
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (crm_system:Application {id: "hp-app-crm-salesforce"})
    MATCH (office365:Application {id: "hp-app-office365"})
    MATCH (thermal_cad:Application {id: "hp-app-thermal-cad"})
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    MATCH (installer_portal:Application {id: "hp-app-installer-portal"})
    MATCH (power_bi:Application {id: "hp-app-power-bi"})
    MATCH (diagnostic_tool:Application {id: "hp-app-diagnostic-tool"})
    MATCH (awsCloud:Infrastructure {id: "hp-infra-aws-cloud"})
    CREATE (sap_s4hana)-[:HOSTED_ON]->(awsCloud)
    CREATE (crm_system)-[:HOSTED_ON]->(awsCloud)
    CREATE (office365)-[:HOSTED_ON]->(awsCloud)
    CREATE (thermal_cad)-[:HOSTED_ON]->(awsCloud)
    CREATE (iot_platform)-[:HOSTED_ON]->(awsCloud)
    CREATE (energy_analytics)-[:HOSTED_ON]->(awsCloud)
    CREATE (installer_portal)-[:HOSTED_ON]->(awsCloud)
    CREATE (power_bi)-[:HOSTED_ON]->(awsCloud)
    CREATE (diagnostic_tool)-[:HOSTED_ON]->(awsCloud)
  `)

  // On-premise applications - MES and Quality on dedicated servers
  await session.run(`
    MATCH (mes_system:Application {id: "hp-app-hvac-mes"})
    MATCH (mesServers:Infrastructure {id: "hp-infra-mes-servers"})
    CREATE (mes_system)-[:HOSTED_ON]->(mesServers)
  `)

  await session.run(`
    MATCH (quality_system:Application {id: "hp-app-quality-management"})
    MATCH (qualityServers:Infrastructure {id: "hp-infra-quality-servers"})
    CREATE (quality_system)-[:HOSTED_ON]->(qualityServers)
  `)

  // Service management and Legacy PLM on primary datacenter
  await session.run(`
    MATCH (service_mgmt:Application {id: "hp-app-service-management"})
    MATCH (legacy_plm:Application {id: "hp-app-legacy-plm"})
    MATCH (primaryDatacenter:Infrastructure {id: "hp-infra-datacenter-primary"})
    CREATE (service_mgmt)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (legacy_plm)-[:HOSTED_ON]->(primaryDatacenter)
  `)

  console.log('Application-Infrastructure hosting relationships created successfully.')
}

export async function createArchitectureContainmentRelationships(session: Session) {
  console.log('Creating Architecture containment relationships...')

  // Current State Architecture contains operational elements
  await session.run(`
    MATCH (current_arch:Architecture {id: "hp-arch-current-state"})
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (mes_system:Application {id: "hp-app-hvac-mes"})
    MATCH (quality_system:Application {id: "hp-app-quality-management"})
    MATCH (crm_system:Application {id: "hp-app-crm-salesforce"})
    MATCH (legacy_plm:Application {id: "hp-app-legacy-plm"})
    MATCH (primaryDatacenter:Infrastructure {id: "hp-infra-datacenter-primary"})
    MATCH (awsCloud:Infrastructure {id: "hp-infra-aws-cloud"})
    CREATE (current_arch)-[:CONTAINS]->(sap_s4hana)
    CREATE (current_arch)-[:CONTAINS]->(mes_system)
    CREATE (current_arch)-[:CONTAINS]->(quality_system)
    CREATE (current_arch)-[:CONTAINS]->(crm_system)
    CREATE (current_arch)-[:CONTAINS]->(legacy_plm)
    CREATE (current_arch)-[:CONTAINS]->(primaryDatacenter)
    CREATE (current_arch)-[:CONTAINS]->(awsCloud)
  `)

  // Target State Architecture contains innovative elements
  await session.run(`
    MATCH (target_arch:Architecture {id: "hp-arch-target-state"})
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    MATCH (thermal_cad:Application {id: "hp-app-thermal-cad"})
    MATCH (diagnostic_tool:Application {id: "hp-app-diagnostic-tool"})
    MATCH (iotGateway:Infrastructure {id: "hp-infra-iot-gateway"})
    MATCH (iotPlatform:Infrastructure {id: "hp-infra-iot-platform"})
    CREATE (target_arch)-[:CONTAINS]->(iot_platform)
    CREATE (target_arch)-[:CONTAINS]->(energy_analytics)
    CREATE (target_arch)-[:CONTAINS]->(thermal_cad)
    CREATE (target_arch)-[:CONTAINS]->(diagnostic_tool)
    CREATE (target_arch)-[:CONTAINS]->(iotGateway)
    CREATE (target_arch)-[:CONTAINS]->(iotPlatform)
  `)

  // Business Architecture contains capabilities
  await session.run(`
    MATCH (business_arch:Architecture {id: "hp-arch-business"})
    MATCH (manufacturing:BusinessCapability {id: "hp-cap-manufacturing"})
    MATCH (sales_marketing:BusinessCapability {id: "hp-cap-sales-marketing"})
    MATCH (service_support:BusinessCapability {id: "hp-cap-service-support"})
    MATCH (quality_mgmt:BusinessCapability {id: "hp-cap-quality-management"})
    CREATE (business_arch)-[:CONTAINS]->(manufacturing)
    CREATE (business_arch)-[:CONTAINS]->(sales_marketing)
    CREATE (business_arch)-[:CONTAINS]->(service_support)
    CREATE (business_arch)-[:CONTAINS]->(quality_mgmt)
  `)

  // Data Architecture contains data objects
  await session.run(`
    MATCH (data_arch:Architecture {id: "hp-arch-data"})
    MATCH (sensor_data:DataObject {id: "hp-data-sensor-telemetry"})
    MATCH (production_data:DataObject {id: "hp-data-production-metrics"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    MATCH (energy_consumption:DataObject {id: "hp-data-energy-consumption"})
    CREATE (data_arch)-[:CONTAINS]->(sensor_data)
    CREATE (data_arch)-[:CONTAINS]->(production_data)
    CREATE (data_arch)-[:CONTAINS]->(customer_data)
    CREATE (data_arch)-[:CONTAINS]->(energy_consumption)
  `)

  // Application Architecture contains all applications
  await session.run(`
    MATCH (app_arch:Architecture {id: "hp-arch-application"})
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (mes_system:Application {id: "hp-app-hvac-mes"})
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    CREATE (app_arch)-[:CONTAINS]->(sap_s4hana)
    CREATE (app_arch)-[:CONTAINS]->(mes_system)
    CREATE (app_arch)-[:CONTAINS]->(iot_platform)
    CREATE (app_arch)-[:CONTAINS]->(energy_analytics)
  `)

  // Technology Architecture contains infrastructure
  await session.run(`
    MATCH (tech_arch:Architecture {id: "hp-arch-technology"})
    MATCH (primaryDatacenter:Infrastructure {id: "hp-infra-datacenter-primary"})
    MATCH (awsCloud:Infrastructure {id: "hp-infra-aws-cloud"})
    MATCH (iotGateway:Infrastructure {id: "hp-infra-iot-gateway"})
    MATCH (coreNetwork:Infrastructure {id: "hp-infra-network-core"})
    CREATE (tech_arch)-[:CONTAINS]->(primaryDatacenter)
    CREATE (tech_arch)-[:CONTAINS]->(awsCloud)
    CREATE (tech_arch)-[:CONTAINS]->(iotGateway)
    CREATE (tech_arch)-[:CONTAINS]->(coreNetwork)
  `)

  // IoT Platform Architecture contains IoT-specific elements
  await session.run(`
    MATCH (iot_arch:Architecture {id: "hp-arch-iot-platform"})
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (iotGateway:Infrastructure {id: "hp-infra-iot-gateway"})
    MATCH (iotPlatform:Infrastructure {id: "hp-infra-iot-platform"})
    MATCH (sensor_data:DataObject {id: "hp-data-sensor-telemetry"})
    MATCH (diagnostic_logs:DataObject {id: "hp-data-diagnostic-logs"})
    CREATE (iot_arch)-[:CONTAINS]->(iot_platform)
    CREATE (iot_arch)-[:CONTAINS]->(iotGateway)
    CREATE (iot_arch)-[:CONTAINS]->(iotPlatform)
    CREATE (iot_arch)-[:CONTAINS]->(sensor_data)
    CREATE (iot_arch)-[:CONTAINS]->(diagnostic_logs)
  `)

  // Security Architecture contains security infrastructure
  await session.run(`
    MATCH (security_arch:Architecture {id: "hp-arch-security"})
    MATCH (firewallSystem:Infrastructure {id: "hp-infra-firewall"})
    MATCH (identitySystem:Infrastructure {id: "hp-infra-identity"})
    CREATE (security_arch)-[:CONTAINS]->(firewallSystem)
    CREATE (security_arch)-[:CONTAINS]->(identitySystem)
  `)

  // Manufacturing Architecture contains interfaces
  await session.run(`
    MATCH (manufacturing_arch:Architecture {id: "hp-arch-manufacturing"})
    MATCH (erp_customer_api:ApplicationInterface {id: "hp-interface-erp-customer-api"})
    MATCH (iot_telemetry_api:ApplicationInterface {id: "hp-interface-iot-telemetry-api"})
    MATCH (energy_analytics_api:ApplicationInterface {id: "hp-interface-energy-analytics-api"})
    CREATE (manufacturing_arch)-[:CONTAINS]->(erp_customer_api)
    CREATE (manufacturing_arch)-[:CONTAINS]->(iot_telemetry_api)
    CREATE (manufacturing_arch)-[:CONTAINS]->(energy_analytics_api)
  `)

  // Customer Experience Architecture contains high-level capabilities
  await session.run(`
    MATCH (customer_arch:Architecture {id: "hp-arch-customer-experience"})
    MATCH (research:BusinessCapability {id: "hp-cap-research-development"})
    MATCH (manufacturing:BusinessCapability {id: "hp-cap-manufacturing"})
    MATCH (technology_innovation:BusinessCapability {id: "hp-cap-technology-innovation"})
    CREATE (customer_arch)-[:CONTAINS]->(research)
    CREATE (customer_arch)-[:CONTAINS]->(manufacturing)
    CREATE (customer_arch)-[:CONTAINS]->(technology_innovation)
  `)

  console.log('Architecture containment relationships created successfully.')
}

export async function createArchitecturePrincipleRelationships(session: Session) {
  console.log('Creating Architecture-Principle relationships...')

  // Architecture to Principle relationships
  await session.run(`
    MATCH (current_arch:Architecture {id: "hp-arch-current-state"})
    MATCH (target_arch:Architecture {id: "hp-arch-target-state"})
    MATCH (business_arch:Architecture {id: "hp-arch-business"})
    MATCH (data_arch:Architecture {id: "hp-arch-data"})
    MATCH (app_arch:Architecture {id: "hp-arch-application"})
    MATCH (tech_arch:Architecture {id: "hp-arch-technology"})
    MATCH (iot_arch:Architecture {id: "hp-arch-iot-platform"})
    MATCH (security_arch:Architecture {id: "hp-arch-security"})
    MATCH (manufacturing_arch:Architecture {id: "hp-arch-manufacturing"})
    MATCH (customer_arch:Architecture {id: "hp-arch-customer-experience"})
    
    MATCH (sustainability:ArchitecturePrinciple {id: "hp-principle-sustainability"})
    MATCH (digital_first:ArchitecturePrinciple {id: "hp-principle-digital-first"})
    MATCH (real_time_analytics:ArchitecturePrinciple {id: "hp-principle-real-time-analytics"})
    MATCH (data_unification:ArchitecturePrinciple {id: "hp-principle-data-unification"})
    MATCH (cloud_first:ArchitecturePrinciple {id: "hp-principle-cloud-first"})
    MATCH (api_first:ArchitecturePrinciple {id: "hp-principle-api-first"})
    MATCH (zero_trust:ArchitecturePrinciple {id: "hp-principle-zero-trust"})
    MATCH (microservices:ArchitecturePrinciple {id: "hp-principle-microservices"})
    MATCH (data_protection:ArchitecturePrinciple {id: "hp-principle-data-protection"})
    MATCH (automation_first:ArchitecturePrinciple {id: "hp-principle-automation-first"})
    MATCH (observability:ArchitecturePrinciple {id: "hp-principle-observability"})
    MATCH (resilience:ArchitecturePrinciple {id: "hp-principle-resilience"})
    MATCH (open_standards:ArchitecturePrinciple {id: "hp-principle-open-standards"})
    MATCH (continuous_improvement:ArchitecturePrinciple {id: "hp-principle-continuous-improvement"})
    
    // Current State Architecture
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(sustainability)
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(data_protection)
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(open_standards)
    
    // Target State Architecture
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(digital_first)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(real_time_analytics)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(automation_first)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(cloud_first)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(continuous_improvement)
    
    // Business Architecture
    CREATE (business_arch)-[:APPLIES_PRINCIPLE]->(digital_first)
    CREATE (business_arch)-[:APPLIES_PRINCIPLE]->(sustainability)
    CREATE (business_arch)-[:APPLIES_PRINCIPLE]->(continuous_improvement)
    
    // Data Architecture
    CREATE (data_arch)-[:APPLIES_PRINCIPLE]->(data_unification)
    CREATE (data_arch)-[:APPLIES_PRINCIPLE]->(real_time_analytics)
    CREATE (data_arch)-[:APPLIES_PRINCIPLE]->(data_protection)
    
    // Application Architecture
    CREATE (app_arch)-[:APPLIES_PRINCIPLE]->(api_first)
    CREATE (app_arch)-[:APPLIES_PRINCIPLE]->(cloud_first)
    CREATE (app_arch)-[:APPLIES_PRINCIPLE]->(microservices)
    CREATE (app_arch)-[:APPLIES_PRINCIPLE]->(observability)
    
    // Technology Architecture
    CREATE (tech_arch)-[:APPLIES_PRINCIPLE]->(cloud_first)
    CREATE (tech_arch)-[:APPLIES_PRINCIPLE]->(resilience)
    CREATE (tech_arch)-[:APPLIES_PRINCIPLE]->(automation_first)
    CREATE (tech_arch)-[:APPLIES_PRINCIPLE]->(zero_trust)
    
    // IoT Platform Architecture
    CREATE (iot_arch)-[:APPLIES_PRINCIPLE]->(digital_first)
    CREATE (iot_arch)-[:APPLIES_PRINCIPLE]->(real_time_analytics)
    CREATE (iot_arch)-[:APPLIES_PRINCIPLE]->(open_standards)
    CREATE (iot_arch)-[:APPLIES_PRINCIPLE]->(automation_first)
    
    // Security Architecture
    CREATE (security_arch)-[:APPLIES_PRINCIPLE]->(zero_trust)
    CREATE (security_arch)-[:APPLIES_PRINCIPLE]->(data_protection)
    
    // Manufacturing Architecture
    CREATE (manufacturing_arch)-[:APPLIES_PRINCIPLE]->(api_first)
    CREATE (manufacturing_arch)-[:APPLIES_PRINCIPLE]->(automation_first)
    
    // Customer Experience Architecture
    CREATE (customer_arch)-[:APPLIES_PRINCIPLE]->(digital_first)
    CREATE (customer_arch)-[:APPLIES_PRINCIPLE]->(continuous_improvement)
    CREATE (customer_arch)-[:APPLIES_PRINCIPLE]->(sustainability)
  `)

  // Application to Architecture Principle relationships
  await session.run(`
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (mes_system:Application {id: "hp-app-hvac-mes"})
    MATCH (quality_system:Application {id: "hp-app-quality-management"})
    MATCH (crm_system:Application {id: "hp-app-crm-salesforce"})
    MATCH (legacy_plm:Application {id: "hp-app-legacy-plm"})
    MATCH (thermal_cad:Application {id: "hp-app-thermal-cad"})
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    MATCH (service_mgmt:Application {id: "hp-app-service-management"})
    MATCH (power_bi:Application {id: "hp-app-power-bi"})
    MATCH (office365:Application {id: "hp-app-office365"})
    MATCH (diagnostic_tool:Application {id: "hp-app-diagnostic-tool"})
    MATCH (installer_portal:Application {id: "hp-app-installer-portal"})
    
    MATCH (cloud_first:ArchitecturePrinciple {id: "hp-principle-cloud-first"})
    MATCH (api_first:ArchitecturePrinciple {id: "hp-principle-api-first"})
    MATCH (zero_trust:ArchitecturePrinciple {id: "hp-principle-zero-trust"})
    MATCH (digital_first:ArchitecturePrinciple {id: "hp-principle-digital-first"})
    MATCH (data_unification:ArchitecturePrinciple {id: "hp-principle-data-unification"})
    MATCH (sustainability:ArchitecturePrinciple {id: "hp-principle-sustainability"})
    MATCH (automation_first:ArchitecturePrinciple {id: "hp-principle-automation-first"})
    MATCH (real_time_analytics:ArchitecturePrinciple {id: "hp-principle-real-time-analytics"})
    MATCH (data_protection:ArchitecturePrinciple {id: "hp-principle-data-protection"})
    MATCH (open_standards:ArchitecturePrinciple {id: "hp-principle-open-standards"})
    MATCH (observability:ArchitecturePrinciple {id: "hp-principle-observability"})
    MATCH (resilience:ArchitecturePrinciple {id: "hp-principle-resilience"})
    
    // Cloud-native applications implement cloud-first principle
    CREATE (sap_s4hana)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (crm_system)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (thermal_cad)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (iot_platform)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (energy_analytics)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (power_bi)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (office365)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (diagnostic_tool)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    CREATE (installer_portal)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first)
    
    // API-based applications implement API-first principle
    CREATE (crm_system)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (iot_platform)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (energy_analytics)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (service_mgmt)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    CREATE (diagnostic_tool)-[:IMPLEMENTS_PRINCIPLE]->(api_first)
    
    // All applications implement zero trust security
    CREATE (sap_s4hana)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (mes_system)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (quality_system)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (crm_system)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (legacy_plm)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (thermal_cad)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (iot_platform)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (energy_analytics)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (service_mgmt)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (power_bi)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (office365)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (diagnostic_tool)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    CREATE (installer_portal)-[:IMPLEMENTS_PRINCIPLE]->(zero_trust)
    
    // Digital-first applications
    CREATE (crm_system)-[:IMPLEMENTS_PRINCIPLE]->(digital_first)
    CREATE (service_mgmt)-[:IMPLEMENTS_PRINCIPLE]->(digital_first)
    CREATE (iot_platform)-[:IMPLEMENTS_PRINCIPLE]->(digital_first)
    CREATE (energy_analytics)-[:IMPLEMENTS_PRINCIPLE]->(digital_first)
    
    // Data unification applications
    CREATE (energy_analytics)-[:IMPLEMENTS_PRINCIPLE]->(data_unification)
    CREATE (power_bi)-[:IMPLEMENTS_PRINCIPLE]->(data_unification)
    CREATE (sap_s4hana)-[:IMPLEMENTS_PRINCIPLE]->(data_unification)
    
    // Sustainability-focused applications
    CREATE (energy_analytics)-[:IMPLEMENTS_PRINCIPLE]->(sustainability)
    CREATE (iot_platform)-[:IMPLEMENTS_PRINCIPLE]->(sustainability)
    CREATE (thermal_cad)-[:IMPLEMENTS_PRINCIPLE]->(sustainability)
    
    // Automation applications
    CREATE (mes_system)-[:IMPLEMENTS_PRINCIPLE]->(automation_first)
    CREATE (quality_system)-[:IMPLEMENTS_PRINCIPLE]->(automation_first)
    CREATE (iot_platform)-[:IMPLEMENTS_PRINCIPLE]->(automation_first)
    
    // Real-time analytics applications
    CREATE (iot_platform)-[:IMPLEMENTS_PRINCIPLE]->(real_time_analytics)
    CREATE (energy_analytics)-[:IMPLEMENTS_PRINCIPLE]->(real_time_analytics)
    CREATE (diagnostic_tool)-[:IMPLEMENTS_PRINCIPLE]->(real_time_analytics)
    
    // Data protection applications
    CREATE (crm_system)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    CREATE (sap_s4hana)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    CREATE (legacy_plm)-[:IMPLEMENTS_PRINCIPLE]->(data_protection)
    
    // Open standards applications
    CREATE (iot_platform)-[:IMPLEMENTS_PRINCIPLE]->(open_standards)
    CREATE (energy_analytics)-[:IMPLEMENTS_PRINCIPLE]->(open_standards)
    CREATE (thermal_cad)-[:IMPLEMENTS_PRINCIPLE]->(open_standards)
    
    // Observability applications
    CREATE (iot_platform)-[:IMPLEMENTS_PRINCIPLE]->(observability)
    CREATE (energy_analytics)-[:IMPLEMENTS_PRINCIPLE]->(observability)
    CREATE (diagnostic_tool)-[:IMPLEMENTS_PRINCIPLE]->(observability)
    
    // Resilience applications
    CREATE (sap_s4hana)-[:IMPLEMENTS_PRINCIPLE]->(resilience)
    CREATE (mes_system)-[:IMPLEMENTS_PRINCIPLE]->(resilience)
    CREATE (iot_platform)-[:IMPLEMENTS_PRINCIPLE]->(resilience)
  `)

  console.log('Architecture-Principle relationships created successfully.')
}

export async function createInterfaceRelationships(session: Session) {
  console.log('Creating Interface relationships...')

  // IoT Device Management API relationships
  await session.run(`
    MATCH (iot_device_api:ApplicationInterface {id: "hp-interface-iot-device-api"})
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (mes_system:Application {id: "hp-app-hvac-mes"})
    MATCH (sensor_data:DataObject {id: "hp-data-sensor-telemetry"})
    MATCH (diagnostic_logs:DataObject {id: "hp-data-diagnostic-logs"})
    CREATE (iot_platform)-[:INTERFACE_SOURCE]->(iot_device_api)
    CREATE (mes_system)-[:INTERFACE_TARGET]->(iot_device_api)
    CREATE (iot_device_api)-[:TRANSFERS]->(sensor_data)
    CREATE (iot_device_api)-[:TRANSFERS]->(diagnostic_logs)
  `)

  // IoT Telemetry Ingestion API relationships
  await session.run(`
    MATCH (iot_telemetry_api:ApplicationInterface {id: "hp-interface-iot-telemetry-api"})
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    MATCH (sensor_data:DataObject {id: "hp-data-sensor-telemetry"})
    MATCH (energy_consumption:DataObject {id: "hp-data-energy-consumption"})
    CREATE (iot_platform)-[:INTERFACE_SOURCE]->(iot_telemetry_api)
    CREATE (energy_analytics)-[:INTERFACE_TARGET]->(iot_telemetry_api)
    CREATE (iot_telemetry_api)-[:TRANSFERS]->(sensor_data)
    CREATE (iot_telemetry_api)-[:TRANSFERS]->(energy_consumption)
  `)

  // Energy Analytics API relationships
  await session.run(`
    MATCH (energy_analytics_api:ApplicationInterface {id: "hp-interface-energy-analytics-api"})
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    MATCH (power_bi:Application {id: "hp-app-power-bi"})
    MATCH (energy_consumption:DataObject {id: "hp-data-energy-consumption"})
    MATCH (sustainability_metrics:DataObject {id: "hp-data-sustainability-metrics"})
    CREATE (energy_analytics)-[:INTERFACE_SOURCE]->(energy_analytics_api)
    CREATE (power_bi)-[:INTERFACE_TARGET]->(energy_analytics_api)
    CREATE (energy_analytics_api)-[:TRANSFERS]->(energy_consumption)
    CREATE (energy_analytics_api)-[:TRANSFERS]->(sustainability_metrics)
  `)

  // ERP Customer API relationships
  await session.run(`
    MATCH (erp_customer_api:ApplicationInterface {id: "hp-interface-erp-customer-api"})
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (crm_system:Application {id: "hp-app-crm-salesforce"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    MATCH (financial_data:DataObject {id: "hp-data-financial-reports"})
    CREATE (sap_s4hana)-[:INTERFACE_SOURCE]->(erp_customer_api)
    CREATE (crm_system)-[:INTERFACE_TARGET]->(erp_customer_api)
    CREATE (erp_customer_api)-[:TRANSFERS]->(customer_data)
    CREATE (erp_customer_api)-[:TRANSFERS]->(financial_data)
  `)

  // ERP Order API relationships
  await session.run(`
    MATCH (erp_order_api:ApplicationInterface {id: "hp-interface-erp-order-api"})
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (legacy_plm:Application {id: "hp-app-legacy-plm"})
    MATCH (sales_data:DataObject {id: "hp-data-sales-transactions"})
    MATCH (bom_data:DataObject {id: "hp-data-bill-of-materials"})
    CREATE (sap_s4hana)-[:INTERFACE_SOURCE]->(erp_order_api)
    CREATE (legacy_plm)-[:INTERFACE_TARGET]->(erp_order_api)
    CREATE (erp_order_api)-[:TRANSFERS]->(sales_data)
    CREATE (erp_order_api)-[:TRANSFERS]->(bom_data)
  `)

  // ERP Product API relationships
  await session.run(`
    MATCH (erp_product_api:ApplicationInterface {id: "hp-interface-erp-product-api"})
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (thermal_cad:Application {id: "hp-app-thermal-cad"})
    MATCH (product_specs:DataObject {id: "hp-data-product-specifications"})
    MATCH (bom_data:DataObject {id: "hp-data-bill-of-materials"})
    CREATE (sap_s4hana)-[:INTERFACE_SOURCE]->(erp_product_api)
    CREATE (thermal_cad)-[:INTERFACE_TARGET]->(erp_product_api)
    CREATE (erp_product_api)-[:TRANSFERS]->(product_specs)
    CREATE (erp_product_api)-[:TRANSFERS]->(bom_data)
  `)

  // CRM Service API relationships
  await session.run(`
    MATCH (crm_service_api:ApplicationInterface {id: "hp-interface-crm-service-api"})
    MATCH (crm_system:Application {id: "hp-app-crm-salesforce"})
    MATCH (service_mgmt:Application {id: "hp-app-service-management"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    MATCH (installation_records:DataObject {id: "hp-data-installation-records"})
    CREATE (crm_system)-[:INTERFACE_SOURCE]->(crm_service_api)
    CREATE (service_mgmt)-[:INTERFACE_TARGET]->(crm_service_api)
    CREATE (crm_service_api)-[:TRANSFERS]->(customer_data)
    CREATE (crm_service_api)-[:TRANSFERS]->(installation_records)
  `)

  // MES Production API relationships
  await session.run(`
    MATCH (mes_production_api:ApplicationInterface {id: "hp-interface-mes-production-api"})
    MATCH (mes_system:Application {id: "hp-app-hvac-mes"})
    MATCH (quality_system:Application {id: "hp-app-quality-management"})
    MATCH (production_data:DataObject {id: "hp-data-production-metrics"})
    MATCH (quality_records:DataObject {id: "hp-data-quality-records"})
    CREATE (mes_system)-[:INTERFACE_SOURCE]->(mes_production_api)
    CREATE (quality_system)-[:INTERFACE_TARGET]->(mes_production_api)
    CREATE (mes_production_api)-[:TRANSFERS]->(production_data)
    CREATE (mes_production_api)-[:TRANSFERS]->(quality_records)
  `)

  // Quality Test API relationships
  await session.run(`
    MATCH (quality_test_api:ApplicationInterface {id: "hp-interface-quality-test-api"})
    MATCH (quality_system:Application {id: "hp-app-quality-management"})
    MATCH (thermal_cad:Application {id: "hp-app-thermal-cad"})
    MATCH (quality_records:DataObject {id: "hp-data-quality-records"})
    MATCH (test_results:DataObject {id: "hp-data-test-results"})
    MATCH (product_specs:DataObject {id: "hp-data-product-specifications"})
    CREATE (quality_system)-[:INTERFACE_SOURCE]->(quality_test_api)
    CREATE (thermal_cad)-[:INTERFACE_TARGET]->(quality_test_api)
    CREATE (quality_test_api)-[:TRANSFERS]->(quality_records)
    CREATE (quality_test_api)-[:TRANSFERS]->(test_results)
    CREATE (quality_test_api)-[:TRANSFERS]->(product_specs)
  `)

  // CRM Installer API relationships
  await session.run(`
    MATCH (crm_installer_api:ApplicationInterface {id: "hp-interface-crm-installer-api"})
    MATCH (crm_system:Application {id: "hp-app-crm-salesforce"})
    MATCH (installer_portal:Application {id: "hp-app-installer-portal"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    MATCH (installation_records:DataObject {id: "hp-data-installation-records"})
    CREATE (crm_system)-[:INTERFACE_SOURCE]->(crm_installer_api)
    CREATE (installer_portal)-[:INTERFACE_TARGET]->(crm_installer_api)
    CREATE (crm_installer_api)-[:TRANSFERS]->(customer_data)
    CREATE (crm_installer_api)-[:TRANSFERS]->(installation_records)
  `)

  // BI Reporting API relationships
  await session.run(`
    MATCH (bi_reporting_api:ApplicationInterface {id: "hp-interface-bi-reporting-api"})
    MATCH (power_bi:Application {id: "hp-app-power-bi"})
    MATCH (office365:Application {id: "hp-app-office365"})
    MATCH (financial_data:DataObject {id: "hp-data-financial-reports"})
    MATCH (cost_data:DataObject {id: "hp-data-cost-analysis"})
    CREATE (power_bi)-[:INTERFACE_SOURCE]->(bi_reporting_api)
    CREATE (office365)-[:INTERFACE_TARGET]->(bi_reporting_api)
    CREATE (bi_reporting_api)-[:TRANSFERS]->(financial_data)
    CREATE (bi_reporting_api)-[:TRANSFERS]->(cost_data)
  `)

  // Technical Support API relationships
  await session.run(`
    MATCH (tech_support_api:ApplicationInterface {id: "hp-interface-technical-support-api"})
    MATCH (diagnostic_tool:Application {id: "hp-app-diagnostic-tool"})
    MATCH (service_mgmt:Application {id: "hp-app-service-management"})
    MATCH (diagnostic_logs:DataObject {id: "hp-data-diagnostic-logs"})
    MATCH (service_tickets:DataObject {id: "hp-data-service-tickets"})
    CREATE (diagnostic_tool)-[:INTERFACE_SOURCE]->(tech_support_api)
    CREATE (service_mgmt)-[:INTERFACE_TARGET]->(tech_support_api)
    CREATE (tech_support_api)-[:TRANSFERS]->(diagnostic_logs)
    CREATE (tech_support_api)-[:TRANSFERS]->(service_tickets)
  `)

  // Data Export API relationships
  await session.run(`
    MATCH (data_export_api:ApplicationInterface {id: "hp-interface-data-export-api"})
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (power_bi:Application {id: "hp-app-power-bi"})
    MATCH (financial_data:DataObject {id: "hp-data-financial-reports"})
    MATCH (sales_data:DataObject {id: "hp-data-sales-transactions"})
    CREATE (sap_s4hana)-[:INTERFACE_SOURCE]->(data_export_api)
    CREATE (power_bi)-[:INTERFACE_TARGET]->(data_export_api)
    CREATE (data_export_api)-[:TRANSFERS]->(financial_data)
    CREATE (data_export_api)-[:TRANSFERS]->(sales_data)
  `)

  // Mobile Customer API relationships
  await session.run(`
    MATCH (mobile_customer_api:ApplicationInterface {id: "hp-interface-mobile-customer-api"})
    MATCH (crm_system:Application {id: "hp-app-crm-salesforce"})
    MATCH (installer_portal:Application {id: "hp-app-installer-portal"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    MATCH (service_tickets:DataObject {id: "hp-data-service-tickets"})
    CREATE (crm_system)-[:INTERFACE_SOURCE]->(mobile_customer_api)
    CREATE (installer_portal)-[:INTERFACE_TARGET]->(mobile_customer_api)
    CREATE (mobile_customer_api)-[:TRANSFERS]->(customer_data)
    CREATE (mobile_customer_api)-[:TRANSFERS]->(service_tickets)
  `)

  // Smart Grid API relationships
  await session.run(`
    MATCH (smart_grid_api:ApplicationInterface {id: "hp-interface-smart-grid-api"})
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    MATCH (energy_consumption:DataObject {id: "hp-data-energy-consumption"})
    MATCH (weather_data:DataObject {id: "hp-data-weather-conditions"})
    CREATE (iot_platform)-[:INTERFACE_SOURCE]->(smart_grid_api)
    CREATE (energy_analytics)-[:INTERFACE_TARGET]->(smart_grid_api)
    CREATE (smart_grid_api)-[:TRANSFERS]->(energy_consumption)
    CREATE (smart_grid_api)-[:TRANSFERS]->(weather_data)
  `)

  // Supplier Portal API relationships
  await session.run(`
    MATCH (supplier_portal_api:ApplicationInterface {id: "hp-interface-supplier-portal-api"})
    MATCH (legacy_plm:Application {id: "hp-app-legacy-plm"})
    MATCH (sap_s4hana:Application {id: "hp-app-sap-s4hana"})
    MATCH (supplier_data:DataObject {id: "hp-data-supplier-information"})
    MATCH (bom_data:DataObject {id: "hp-data-bill-of-materials"})
    CREATE (legacy_plm)-[:INTERFACE_SOURCE]->(supplier_portal_api)
    CREATE (sap_s4hana)-[:INTERFACE_TARGET]->(supplier_portal_api)
    CREATE (supplier_portal_api)-[:TRANSFERS]->(supplier_data)
    CREATE (supplier_portal_api)-[:TRANSFERS]->(bom_data)
  `)

  console.log('Interface relationships created successfully.')
}

export async function createAllHeatPumpRelationships(session: Session) {
  console.log('Creating all Heat Pump Manufacturing relationships...')

  await createCapabilityHierarchy(session)
  await createApplicationCapabilitySupport(session)
  await createApplicationDataRelationships(session)
  await createApplicationInfrastructureHosting(session)
  await createInterfaceRelationships(session)
  await createArchitectureContainmentRelationships(session)
  await createArchitecturePrincipleRelationships(session)

  console.log('✅ All Heat Pump Manufacturing relationships created successfully!')
}
