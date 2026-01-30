// Relationships for Heat Pump Manufacturing Company
// Creates all the interconnections between different enterprise architecture elements

import { Session } from 'neo4j-driver'
import { createHeatPumpCapabilityHierarchy } from './heatpump-business-capabilities'

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
    MATCH (manufacturing:BusinessCapability {id: "hp-cap-manufacturing-operations"})
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

  // Core Business Applications

  // SAP S/4HANA - ERP System
  await session.run(`
    MATCH (sap:Application {id: "hp-app-sap-s4hana"})
    MATCH (finance:BusinessCapability {id: "hp-cap-finance"})
    MATCH (accounting:BusinessCapability {id: "hp-cap-accounting-reporting"})
    MATCH (financialPlanning:BusinessCapability {id: "hp-cap-financial-planning"})
    MATCH (hr:BusinessCapability {id: "hp-cap-human-resources"})
    CREATE (sap)-[:SUPPORTS]->(finance)
    CREATE (sap)-[:SUPPORTS]->(accounting)
    CREATE (sap)-[:SUPPORTS]->(financialPlanning)
    CREATE (sap)-[:SUPPORTS]->(hr)
  `)

  // Strategy & Portfolio Management System
  await session.run(`
    MATCH (strategy:Application {id: "hp-app-strategy-portfolio"})
    MATCH (strategicPlanning:BusinessCapability {id: "hp-cap-strategic-planning"})
    MATCH (marketAnalysis:BusinessCapability {id: "hp-cap-market-analysis"})
    MATCH (corporateGovernance:BusinessCapability {id: "hp-cap-corporate-governance"})
    CREATE (strategy)-[:SUPPORTS]->(strategicPlanning)
    CREATE (strategy)-[:SUPPORTS]->(marketAnalysis)
    CREATE (strategy)-[:SUPPORTS]->(corporateGovernance)
  `)

  // Risk Management Platform
  await session.run(`
    MATCH (risk:Application {id: "hp-app-risk-management"})
    MATCH (corporateGovernance:BusinessCapability {id: "hp-cap-corporate-governance"})
    MATCH (legal:BusinessCapability {id: "hp-cap-legal-compliance"})
    CREATE (risk)-[:SUPPORTS]->(corporateGovernance)
    CREATE (risk)-[:SUPPORTS]->(legal)
  `)

  // Sustainability Tracker
  await session.run(`
    MATCH (sustainability:Application {id: "hp-app-sustainability-tracker"})
    MATCH (sustainabilityMgmt:BusinessCapability {id: "hp-cap-sustainability"})
    MATCH (energyEfficiency:BusinessCapability {id: "hp-cap-energy-efficiency"})
    CREATE (sustainability)-[:SUPPORTS]->(sustainabilityMgmt)
    CREATE (sustainability)-[:SUPPORTS]->(energyEfficiency)
  `)

  // Market Intelligence Platform
  await session.run(`
    MATCH (market:Application {id: "hp-app-market-intelligence"})
    MATCH (marketAnalysis:BusinessCapability {id: "hp-cap-market-analysis"})
    MATCH (customerAnalytics:BusinessCapability {id: "hp-cap-customer-analytics"})
    CREATE (market)-[:SUPPORTS]->(marketAnalysis)
    CREATE (market)-[:SUPPORTS]->(customerAnalytics)
  `)

  // Modern PLM System
  await session.run(`
    MATCH (plm:Application {id: "hp-app-modern-plm"})
    MATCH (productDevelopment:BusinessCapability {id: "hp-cap-product-development"})
    MATCH (thermalDesign:BusinessCapability {id: "hp-cap-thermal-design"})
    MATCH (productMgmt:BusinessCapability {id: "hp-cap-product-management"})
    CREATE (plm)-[:SUPPORTS]->(productDevelopment)
    CREATE (plm)-[:SUPPORTS]->(thermalDesign)
    CREATE (plm)-[:SUPPORTS]->(productMgmt)
  `)

  // Thermal CAD System
  await session.run(`
    MATCH (cad:Application {id: "hp-app-thermal-cad"})
    MATCH (thermalDesign:BusinessCapability {id: "hp-cap-thermal-design"})
    MATCH (refrigerantTech:BusinessCapability {id: "hp-cap-refrigerant-technology"})
    CREATE (cad)-[:SUPPORTS]->(thermalDesign)
    CREATE (cad)-[:SUPPORTS]->(refrigerantTech)
  `)

  // CFD Simulation Platform
  await session.run(`
    MATCH (cfd:Application {id: "hp-app-cfd-simulation"})
    MATCH (thermalDesign:BusinessCapability {id: "hp-cap-thermal-design"})
    MATCH (energyEfficiency:BusinessCapability {id: "hp-cap-energy-efficiency"})
    CREATE (cfd)-[:SUPPORTS]->(thermalDesign)
    CREATE (cfd)-[:SUPPORTS]->(energyEfficiency)
  `)

  // Testing Lab Management
  await session.run(`
    MATCH (testing:Application {id: "hp-app-testing-lab"})
    MATCH (testingValidation:BusinessCapability {id: "hp-cap-testing-validation"})
    MATCH (qualityMgmt:BusinessCapability {id: "hp-cap-quality-management"})
    CREATE (testing)-[:SUPPORTS]->(testingValidation)
    CREATE (testing)-[:SUPPORTS]->(qualityMgmt)
  `)

  // Smart Controls Development
  await session.run(`
    MATCH (controls:Application {id: "hp-app-smart-controls-dev"})
    MATCH (smartControls:BusinessCapability {id: "hp-cap-smart-controls"})
    MATCH (energyEfficiency:BusinessCapability {id: "hp-cap-energy-efficiency"})
    CREATE (controls)-[:SUPPORTS]->(smartControls)
    CREATE (controls)-[:SUPPORTS]->(energyEfficiency)
  `)

  // Innovation Management Platform
  await session.run(`
    MATCH (innovation:Application {id: "hp-app-innovation-platform"})
    MATCH (productDevelopment:BusinessCapability {id: "hp-cap-product-development"})
    MATCH (energyEfficiency:BusinessCapability {id: "hp-cap-energy-efficiency"})
    CREATE (innovation)-[:SUPPORTS]->(productDevelopment)
    CREATE (innovation)-[:SUPPORTS]->(energyEfficiency)
  `)

  // Advanced MRP System
  await session.run(`
    MATCH (mrp:Application {id: "hp-app-advanced-mrp"})
    MATCH (productionPlanning:BusinessCapability {id: "hp-cap-production-planning"})
    MATCH (supplyChain:BusinessCapability {id: "hp-cap-supply-chain"})
    CREATE (mrp)-[:SUPPORTS]->(productionPlanning)
    CREATE (mrp)-[:SUPPORTS]->(supplyChain)
  `)

  // HVAC MES
  await session.run(`
    MATCH (mes:Application {id: "hp-app-hvac-mes"})
    MATCH (compressorMfg:BusinessCapability {id: "hp-cap-compressor-manufacturing"})
    MATCH (heatExchangerMfg:BusinessCapability {id: "hp-cap-heat-exchanger-manufacturing"})
    MATCH (systemAssembly:BusinessCapability {id: "hp-cap-system-assembly"})
    CREATE (mes)-[:SUPPORTS]->(compressorMfg)
    CREATE (mes)-[:SUPPORTS]->(heatExchangerMfg)
    CREATE (mes)-[:SUPPORTS]->(systemAssembly)
  `)

  // Quality Management System
  await session.run(`
    MATCH (qms:Application {id: "hp-app-quality-management"})
    MATCH (qualityMgmt:BusinessCapability {id: "hp-cap-quality-management"})
    MATCH (testingValidation:BusinessCapability {id: "hp-cap-testing-validation"})
    CREATE (qms)-[:SUPPORTS]->(qualityMgmt)
    CREATE (qms)-[:SUPPORTS]->(testingValidation)
  `)

  // Warehouse Management System
  await session.run(`
    MATCH (wms:Application {id: "hp-app-warehouse-management"})
    MATCH (warehouseMgmt:BusinessCapability {id: "hp-cap-warehouse-management"})
    MATCH (supplyChain:BusinessCapability {id: "hp-cap-supply-chain"})
    CREATE (wms)-[:SUPPORTS]->(warehouseMgmt)
    CREATE (wms)-[:SUPPORTS]->(supplyChain)
  `)

  // Procurement Platform
  await session.run(`
    MATCH (procurement:Application {id: "hp-app-procurement-platform"})
    MATCH (supplyChain:BusinessCapability {id: "hp-cap-supply-chain"})
    CREATE (procurement)-[:SUPPORTS]->(supplyChain)
  `)

  // Production Analytics
  await session.run(`
    MATCH (prodAnalytics:Application {id: "hp-app-production-analytics"})
    MATCH (productionPlanning:BusinessCapability {id: "hp-cap-production-planning"})
    MATCH (qualityMgmt:BusinessCapability {id: "hp-cap-quality-management"})
    CREATE (prodAnalytics)-[:SUPPORTS]->(productionPlanning)
    CREATE (prodAnalytics)-[:SUPPORTS]->(qualityMgmt)
  `)

  // E-Commerce Platform
  await session.run(`
    MATCH (ecommerce:Application {id: "hp-app-ecommerce-platform"})
    MATCH (salesOps:BusinessCapability {id: "hp-cap-sales-operations"})
    MATCH (channelMgmt:BusinessCapability {id: "hp-cap-channel-management"})
    MATCH (digitalMarketing:BusinessCapability {id: "hp-cap-digital-marketing"})
    CREATE (ecommerce)-[:SUPPORTS]->(salesOps)
    CREATE (ecommerce)-[:SUPPORTS]->(channelMgmt)
    CREATE (ecommerce)-[:SUPPORTS]->(digitalMarketing)
  `)

  // CRM Salesforce
  await session.run(`
    MATCH (crm:Application {id: "hp-app-crm-salesforce"})
    MATCH (salesOps:BusinessCapability {id: "hp-cap-sales-operations"})
    MATCH (customerSupport:BusinessCapability {id: "hp-cap-customer-support"})
    MATCH (channelMgmt:BusinessCapability {id: "hp-cap-channel-management"})
    CREATE (crm)-[:SUPPORTS]->(salesOps)
    CREATE (crm)-[:SUPPORTS]->(customerSupport)
    CREATE (crm)-[:SUPPORTS]->(channelMgmt)
  `)

  // Product Configurator
  await session.run(`
    MATCH (configurator:Application {id: "hp-app-product-configurator"})
    MATCH (salesOps:BusinessCapability {id: "hp-cap-sales-operations"})
    MATCH (productMgmt:BusinessCapability {id: "hp-cap-product-management"})
    CREATE (configurator)-[:SUPPORTS]->(salesOps)
    CREATE (configurator)-[:SUPPORTS]->(productMgmt)
  `)

  // Marketing Automation
  await session.run(`
    MATCH (marketing:Application {id: "hp-app-marketing-automation"})
    MATCH (digitalMarketing:BusinessCapability {id: "hp-cap-digital-marketing"})
    MATCH (customerAnalytics:BusinessCapability {id: "hp-cap-customer-analytics"})
    CREATE (marketing)-[:SUPPORTS]->(digitalMarketing)
    CREATE (marketing)-[:SUPPORTS]->(customerAnalytics)
  `)

  // Channel Management Portal
  await session.run(`
    MATCH (channel:Application {id: "hp-app-channel-portal"})
    MATCH (channelMgmt:BusinessCapability {id: "hp-cap-channel-management"})
    MATCH (salesOps:BusinessCapability {id: "hp-cap-sales-operations"})
    CREATE (channel)-[:SUPPORTS]->(channelMgmt)
    CREATE (channel)-[:SUPPORTS]->(salesOps)
  `)

  // Customer Analytics Platform
  await session.run(`
    MATCH (analytics:Application {id: "hp-app-customer-analytics"})
    MATCH (customerAnalytics:BusinessCapability {id: "hp-cap-customer-analytics"})
    MATCH (marketAnalysis:BusinessCapability {id: "hp-cap-market-analysis"})
    CREATE (analytics)-[:SUPPORTS]->(customerAnalytics)
    CREATE (analytics)-[:SUPPORTS]->(marketAnalysis)
  `)

  // Service Management System
  await session.run(`
    MATCH (serviceMgmt:Application {id: "hp-app-service-management"})
    MATCH (installation:BusinessCapability {id: "hp-cap-installation-services"})
    MATCH (maintenance:BusinessCapability {id: "hp-cap-maintenance-services"})
    MATCH (customerSupport:BusinessCapability {id: "hp-cap-customer-support"})
    CREATE (serviceMgmt)-[:SUPPORTS]->(installation)
    CREATE (serviceMgmt)-[:SUPPORTS]->(maintenance)
    CREATE (serviceMgmt)-[:SUPPORTS]->(customerSupport)
  `)

  // Knowledge Base System
  await session.run(`
    MATCH (knowledge:Application {id: "hp-app-knowledge-base"})
    MATCH (customerSupport:BusinessCapability {id: "hp-cap-customer-support"})
    MATCH (installation:BusinessCapability {id: "hp-cap-installation-services"})
    CREATE (knowledge)-[:SUPPORTS]->(customerSupport)
    CREATE (knowledge)-[:SUPPORTS]->(installation)
  `)

  // IoT Monitoring Platform
  await session.run(`
    MATCH (iot:Application {id: "hp-app-iot-platform"})
    MATCH (remoteMonitoring:BusinessCapability {id: "hp-cap-remote-monitoring"})
    MATCH (smartControls:BusinessCapability {id: "hp-cap-smart-controls"})
    CREATE (iot)-[:SUPPORTS]->(remoteMonitoring)
    CREATE (iot)-[:SUPPORTS]->(smartControls)
  `)

  // Warranty Management
  await session.run(`
    MATCH (warranty:Application {id: "hp-app-warranty-management"})
    MATCH (warrantyMgmt:BusinessCapability {id: "hp-cap-warranty-management"})
    MATCH (customerSupport:BusinessCapability {id: "hp-cap-customer-support"})
    CREATE (warranty)-[:SUPPORTS]->(warrantyMgmt)
    CREATE (warranty)-[:SUPPORTS]->(customerSupport)
  `)

  // Installer Portal
  await session.run(`
    MATCH (installer:Application {id: "hp-app-installer-portal"})
    MATCH (installation:BusinessCapability {id: "hp-cap-installation-services"})
    MATCH (channelMgmt:BusinessCapability {id: "hp-cap-channel-management"})
    CREATE (installer)-[:SUPPORTS]->(installation)
    CREATE (installer)-[:SUPPORTS]->(channelMgmt)
  `)

  // Diagnostic Tool
  await session.run(`
    MATCH (diagnostic:Application {id: "hp-app-diagnostic-tool"})
    MATCH (remoteMonitoring:BusinessCapability {id: "hp-cap-remote-monitoring"})
    MATCH (maintenance:BusinessCapability {id: "hp-cap-maintenance-services"})
    CREATE (diagnostic)-[:SUPPORTS]->(remoteMonitoring)
    CREATE (diagnostic)-[:SUPPORTS]->(maintenance)
  `)

  // Energy Analytics Platform
  await session.run(`
    MATCH (energy:Application {id: "hp-app-energy-analytics"})
    MATCH (energyEfficiency:BusinessCapability {id: "hp-cap-energy-efficiency"})
    MATCH (sustainabilityMgmt:BusinessCapability {id: "hp-cap-sustainability"})
    MATCH (remoteMonitoring:BusinessCapability {id: "hp-cap-remote-monitoring"})
    CREATE (energy)-[:SUPPORTS]->(energyEfficiency)
    CREATE (energy)-[:SUPPORTS]->(sustainabilityMgmt)
    CREATE (energy)-[:SUPPORTS]->(remoteMonitoring)
  `)

  // HRMS System
  await session.run(`
    MATCH (hrms:Application {id: "hp-app-hrms"})
    MATCH (hr:BusinessCapability {id: "hp-cap-human-resources"})
    MATCH (talentMgmt:BusinessCapability {id: "hp-cap-talent-management"})
    CREATE (hrms)-[:SUPPORTS]->(hr)
    CREATE (hrms)-[:SUPPORTS]->(talentMgmt)
  `)

  // Learning Management System
  await session.run(`
    MATCH (lms:Application {id: "hp-app-learning-management"})
    MATCH (talentMgmt:BusinessCapability {id: "hp-cap-talent-management"})
    MATCH (hr:BusinessCapability {id: "hp-cap-human-resources"})
    CREATE (lms)-[:SUPPORTS]->(talentMgmt)
    CREATE (lms)-[:SUPPORTS]->(hr)
  `)

  // Financial Planning System
  await session.run(`
    MATCH (finPlan:Application {id: "hp-app-financial-planning"})
    MATCH (financialPlanning:BusinessCapability {id: "hp-cap-financial-planning"})
    MATCH (strategicPlanning:BusinessCapability {id: "hp-cap-strategic-planning"})
    CREATE (finPlan)-[:SUPPORTS]->(financialPlanning)
    CREATE (finPlan)-[:SUPPORTS]->(strategicPlanning)
  `)

  // BI & Analytics Platform
  await session.run(`
    MATCH (bi:Application {id: "hp-app-bi-analytics"})
    MATCH (marketAnalysis:BusinessCapability {id: "hp-cap-market-analysis"})
    MATCH (customerAnalytics:BusinessCapability {id: "hp-cap-customer-analytics"})
    MATCH (financialPlanning:BusinessCapability {id: "hp-cap-financial-planning"})
    CREATE (bi)-[:SUPPORTS]->(marketAnalysis)
    CREATE (bi)-[:SUPPORTS]->(customerAnalytics)
    CREATE (bi)-[:SUPPORTS]->(financialPlanning)
  `)

  // IT Service Management
  await session.run(`
    MATCH (itsm:Application {id: "hp-app-it-service-management"})
    MATCH (it:BusinessCapability {id: "hp-cap-information-technology"})
    MATCH (applicationMgmt:BusinessCapability {id: "hp-cap-application-management"})
    CREATE (itsm)-[:SUPPORTS]->(it)
    CREATE (itsm)-[:SUPPORTS]->(applicationMgmt)
  `)

  // Infrastructure Monitoring
  await session.run(`
    MATCH (infra:Application {id: "hp-app-infrastructure-monitoring"})
    MATCH (infrastructureMgmt:BusinessCapability {id: "hp-cap-infrastructure-management"})
    MATCH (it:BusinessCapability {id: "hp-cap-information-technology"})
    CREATE (infra)-[:SUPPORTS]->(infrastructureMgmt)
    CREATE (infra)-[:SUPPORTS]->(it)
  `)

  // Cybersecurity Platform
  await session.run(`
    MATCH (cyber:Application {id: "hp-app-cybersecurity"})
    MATCH (it:BusinessCapability {id: "hp-cap-information-technology"})
    MATCH (infrastructureMgmt:BusinessCapability {id: "hp-cap-infrastructure-management"})
    MATCH (corporateGovernance:BusinessCapability {id: "hp-cap-corporate-governance"})
    CREATE (cyber)-[:SUPPORTS]->(it)
    CREATE (cyber)-[:SUPPORTS]->(infrastructureMgmt)
    CREATE (cyber)-[:SUPPORTS]->(corporateGovernance)
  `)

  // Application Lifecycle Management
  await session.run(`
    MATCH (alm:Application {id: "hp-app-application-lifecycle"})
    MATCH (applicationMgmt:BusinessCapability {id: "hp-cap-application-management"})
    MATCH (it:BusinessCapability {id: "hp-cap-information-technology"})
    CREATE (alm)-[:SUPPORTS]->(applicationMgmt)
    CREATE (alm)-[:SUPPORTS]->(it)
  `)

  // Legal Document Management
  await session.run(`
    MATCH (legal:Application {id: "hp-app-legal-document-mgmt"})
    MATCH (legalCompliance:BusinessCapability {id: "hp-cap-legal-compliance"})
    MATCH (corporateGovernance:BusinessCapability {id: "hp-cap-corporate-governance"})
    CREATE (legal)-[:SUPPORTS]->(legalCompliance)
    CREATE (legal)-[:SUPPORTS]->(corporateGovernance)
  `)

  // Contract Management
  await session.run(`
    MATCH (contract:Application {id: "hp-app-contract-management"})
    MATCH (legalCompliance:BusinessCapability {id: "hp-cap-legal-compliance"})
    MATCH (supplyChain:BusinessCapability {id: "hp-cap-supply-chain"})
    CREATE (contract)-[:SUPPORTS]->(legalCompliance)
    CREATE (contract)-[:SUPPORTS]->(supplyChain)
  `)

  // Compliance Management
  await session.run(`
    MATCH (compliance:Application {id: "hp-app-compliance-management"})
    MATCH (legalCompliance:BusinessCapability {id: "hp-cap-legal-compliance"})
    MATCH (corporateGovernance:BusinessCapability {id: "hp-cap-corporate-governance"})
    MATCH (qualityMgmt:BusinessCapability {id: "hp-cap-quality-management"})
    CREATE (compliance)-[:SUPPORTS]->(legalCompliance)
    CREATE (compliance)-[:SUPPORTS]->(corporateGovernance)
    CREATE (compliance)-[:SUPPORTS]->(qualityMgmt)
  `)

  // Power BI
  await session.run(`
    MATCH (powerbi:Application {id: "hp-app-power-bi"})
    MATCH (financialPlanning:BusinessCapability {id: "hp-cap-financial-planning"})
    MATCH (accounting:BusinessCapability {id: "hp-cap-accounting-reporting"})
    MATCH (productionPlanning:BusinessCapability {id: "hp-cap-production-planning"})
    CREATE (powerbi)-[:SUPPORTS]->(financialPlanning)
    CREATE (powerbi)-[:SUPPORTS]->(accounting)
    CREATE (powerbi)-[:SUPPORTS]->(productionPlanning)
  `)

  // Office 365
  await session.run(`
    MATCH (office:Application {id: "hp-app-office365"})
    MATCH (hr:BusinessCapability {id: "hp-cap-human-resources"})
    MATCH (corporateGovernance:BusinessCapability {id: "hp-cap-corporate-governance"})
    MATCH (strategicPlanning:BusinessCapability {id: "hp-cap-strategic-planning"})
    CREATE (office)-[:SUPPORTS]->(hr)
    CREATE (office)-[:SUPPORTS]->(corporateGovernance)
    CREATE (office)-[:SUPPORTS]->(strategicPlanning)
  `)

  // Digital Marketing Automation
  await session.run(`
    MATCH (digitalMarketing:Application {id: "hp-app-digital-marketing"})
    MATCH (digitalMarketingCap:BusinessCapability {id: "hp-cap-digital-marketing"})
    MATCH (customerAnalytics:BusinessCapability {id: "hp-cap-customer-analytics"})
    CREATE (digitalMarketing)-[:SUPPORTS]->(digitalMarketingCap)
    CREATE (digitalMarketing)-[:SUPPORTS]->(customerAnalytics)
  `)

  // Energy Management System
  await session.run(`
    MATCH (energyMgmt:Application {id: "hp-app-energy-mgmt"})
    MATCH (energyEfficiency:BusinessCapability {id: "hp-cap-energy-efficiency"})
    MATCH (sustainability:BusinessCapability {id: "hp-cap-sustainability"})
    CREATE (energyMgmt)-[:SUPPORTS]->(energyEfficiency)
    CREATE (energyMgmt)-[:SUPPORTS]->(sustainability)
  `)

  // Predictive Maintenance Platform
  await session.run(`
    MATCH (predictiveMaint:Application {id: "hp-app-predictive-maintenance"})
    MATCH (maintenance:BusinessCapability {id: "hp-cap-maintenance-services"})
    MATCH (remoteMonitoring:BusinessCapability {id: "hp-cap-remote-monitoring"})
    CREATE (predictiveMaint)-[:SUPPORTS]->(maintenance)
    CREATE (predictiveMaint)-[:SUPPORTS]->(remoteMonitoring)
  `)

  // Service Technician Mobile App
  await session.run(`
    MATCH (serviceMobile:Application {id: "hp-app-service-mobile"})
    MATCH (maintenance:BusinessCapability {id: "hp-cap-maintenance-services"})
    MATCH (installation:BusinessCapability {id: "hp-cap-installation-services"})
    MATCH (customerSupport:BusinessCapability {id: "hp-cap-customer-support"})
    CREATE (serviceMobile)-[:SUPPORTS]->(maintenance)
    CREATE (serviceMobile)-[:SUPPORTS]->(installation)
    CREATE (serviceMobile)-[:SUPPORTS]->(customerSupport)
  `)

  // Partner Mobile App
  await session.run(`
    MATCH (partnerMobile:Application {id: "hp-app-partner-mobile"})
    MATCH (channelMgmt:BusinessCapability {id: "hp-cap-channel-management"})
    MATCH (salesOps:BusinessCapability {id: "hp-cap-sales-operations"})
    CREATE (partnerMobile)-[:SUPPORTS]->(channelMgmt)
    CREATE (partnerMobile)-[:SUPPORTS]->(salesOps)
  `)

  // Warehouse Management System
  await session.run(`
    MATCH (warehouseMgmt:Application {id: "hp-app-warehouse-mgmt"})
    MATCH (warehouseMgmtCap:BusinessCapability {id: "hp-cap-warehouse-management"})
    MATCH (supplyChain:BusinessCapability {id: "hp-cap-supply-chain"})
    CREATE (warehouseMgmt)-[:SUPPORTS]->(warehouseMgmtCap)
    CREATE (warehouseMgmt)-[:SUPPORTS]->(supplyChain)
  `)

  // Warranty Management System
  await session.run(`
    MATCH (warrantyMgmt:Application {id: "hp-app-warranty-mgmt"})
    MATCH (warranty:BusinessCapability {id: "hp-cap-warranty-management"})
    MATCH (customerSupport:BusinessCapability {id: "hp-cap-customer-support"})
    CREATE (warrantyMgmt)-[:SUPPORTS]->(warranty)
    CREATE (warrantyMgmt)-[:SUPPORTS]->(customerSupport)
  `)

  // Spare Parts Management
  await session.run(`
    MATCH (spareParts:Application {id: "hp-app-spare-parts"})
    MATCH (maintenance:BusinessCapability {id: "hp-cap-maintenance-services"})
    MATCH (warehouseMgmt:BusinessCapability {id: "hp-cap-warehouse-management"})
    MATCH (supplyChain:BusinessCapability {id: "hp-cap-supply-chain"})
    CREATE (spareParts)-[:SUPPORTS]->(maintenance)
    CREATE (spareParts)-[:SUPPORTS]->(warehouseMgmt)
    CREATE (spareParts)-[:SUPPORTS]->(supplyChain)
  `)

  // Supplier Collaboration Portal
  await session.run(`
    MATCH (supplierPortal:Application {id: "hp-app-supplier-portal"})
    MATCH (supplyChain:BusinessCapability {id: "hp-cap-supply-chain"})
    MATCH (qualityMgmt:BusinessCapability {id: "hp-cap-quality-management"})
    CREATE (supplierPortal)-[:SUPPORTS]->(supplyChain)
    CREATE (supplierPortal)-[:SUPPORTS]->(qualityMgmt)
  `)

  // Enterprise Document Management
  await session.run(`
    MATCH (documentMgmt:Application {id: "hp-app-document-mgmt"})
    MATCH (it:BusinessCapability {id: "hp-cap-information-technology"})
    MATCH (legalCompliance:BusinessCapability {id: "hp-cap-legal-compliance"})
    MATCH (qualityMgmt:BusinessCapability {id: "hp-cap-quality-management"})
    CREATE (documentMgmt)-[:SUPPORTS]->(it)
    CREATE (documentMgmt)-[:SUPPORTS]->(legalCompliance)
    CREATE (documentMgmt)-[:SUPPORTS]->(qualityMgmt)
  `)

  // Backup & Disaster Recovery
  await session.run(`
    MATCH (backup:Application {id: "hp-app-backup-recovery"})
    MATCH (infrastructureMgmt:BusinessCapability {id: "hp-cap-infrastructure-management"})
    MATCH (it:BusinessCapability {id: "hp-cap-information-technology"})
    CREATE (backup)-[:SUPPORTS]->(infrastructureMgmt)
    CREATE (backup)-[:SUPPORTS]->(it)
  `)

  // Learning Management System
  await session.run(`
    MATCH (learningMgmt:Application {id: "hp-app-learning-mgmt"})
    MATCH (talentMgmt:BusinessCapability {id: "hp-cap-talent-management"})
    MATCH (hr:BusinessCapability {id: "hp-cap-human-resources"})
    CREATE (learningMgmt)-[:SUPPORTS]->(talentMgmt)
    CREATE (learningMgmt)-[:SUPPORTS]->(hr)
  `)

  // Expense Management System
  await session.run(`
    MATCH (expenseMgmt:Application {id: "hp-app-expense-mgmt"})
    MATCH (accounting:BusinessCapability {id: "hp-cap-accounting-reporting"})
    MATCH (finance:BusinessCapability {id: "hp-cap-finance"})
    CREATE (expenseMgmt)-[:SUPPORTS]->(accounting)
    CREATE (expenseMgmt)-[:SUPPORTS]->(finance)
  `)

  // Innovation Management Portal
  await session.run(`
    MATCH (innovationPortal:Application {id: "hp-app-innovation-portal"})
    MATCH (productDevelopment:BusinessCapability {id: "hp-cap-product-development"})
    MATCH (strategicPlanning:BusinessCapability {id: "hp-cap-strategic-planning"})
    CREATE (innovationPortal)-[:SUPPORTS]->(productDevelopment)
    CREATE (innovationPortal)-[:SUPPORTS]->(strategicPlanning)
  `)

  // Intellectual Property Management
  await session.run(`
    MATCH (ipMgmt:Application {id: "hp-app-ip-management"})
    MATCH (productDevelopment:BusinessCapability {id: "hp-cap-product-development"})
    MATCH (legalCompliance:BusinessCapability {id: "hp-cap-legal-compliance"})
    CREATE (ipMgmt)-[:SUPPORTS]->(productDevelopment)
    CREATE (ipMgmt)-[:SUPPORTS]->(legalCompliance)
  `)

  // Legal Technology Platform
  await session.run(`
    MATCH (legalTech:Application {id: "hp-app-legal-tech"})
    MATCH (legalCompliance:BusinessCapability {id: "hp-cap-legal-compliance"})
    MATCH (corporateGovernance:BusinessCapability {id: "hp-cap-corporate-governance"})
    CREATE (legalTech)-[:SUPPORTS]->(legalCompliance)
    CREATE (legalTech)-[:SUPPORTS]->(corporateGovernance)
  `)

  // Social Media Listening Platform
  await session.run(`
    MATCH (socialListening:Application {id: "hp-app-social-listening"})
    MATCH (digitalMarketing:BusinessCapability {id: "hp-cap-digital-marketing"})
    MATCH (customerAnalytics:BusinessCapability {id: "hp-cap-customer-analytics"})
    MATCH (marketAnalysis:BusinessCapability {id: "hp-cap-market-analysis"})
    CREATE (socialListening)-[:SUPPORTS]->(digitalMarketing)
    CREATE (socialListening)-[:SUPPORTS]->(customerAnalytics)
    CREATE (socialListening)-[:SUPPORTS]->(marketAnalysis)
  `)

  // Test Data Management System
  await session.run(`
    MATCH (testDataMgmt:Application {id: "hp-app-test-data-mgmt"})
    MATCH (testing:BusinessCapability {id: "hp-cap-testing-validation"})
    MATCH (qualityMgmt:BusinessCapability {id: "hp-cap-quality-management"})
    CREATE (testDataMgmt)-[:SUPPORTS]->(testing)
    CREATE (testDataMgmt)-[:SUPPORTS]->(qualityMgmt)
  `)

  // Legacy PLM System (being phased out)
  await session.run(`
    MATCH (legacyPLM:Application {id: "hp-app-legacy-plm"})
    MATCH (productDevelopment:BusinessCapability {id: "hp-cap-product-development"})
    CREATE (legacyPLM)-[:SUPPORTS]->(productDevelopment)
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

  // Digital Marketing Automation
  await session.run(`
    MATCH (digitalMarketing:Application {id: "hp-app-digital-marketing"})
    MATCH (customerProfiles:DataObject {id: "hp-data-customer-profiles"})
    MATCH (marketIntelligence:DataObject {id: "hp-data-market-intelligence"})
    CREATE (digitalMarketing)-[:USES]->(customerProfiles)
    CREATE (digitalMarketing)-[:USES]->(marketIntelligence)
  `)

  // Energy Management System
  await session.run(`
    MATCH (energyMgmt:Application {id: "hp-app-energy-mgmt"})
    MATCH (energyConsumption:DataObject {id: "hp-data-energy-consumption"})
    MATCH (sustainabilityMetrics:DataObject {id: "hp-data-sustainability-metrics"})
    MATCH (sensorTelemetry:DataObject {id: "hp-data-sensor-telemetry"})
    CREATE (energyMgmt)-[:USES]->(energyConsumption)
    CREATE (energyMgmt)-[:USES]->(sustainabilityMetrics)
    CREATE (energyMgmt)-[:USES]->(sensorTelemetry)
  `)

  // Predictive Maintenance Platform
  await session.run(`
    MATCH (predictiveMaint:Application {id: "hp-app-predictive-maintenance"})
    MATCH (sensorTelemetry:DataObject {id: "hp-data-sensor-telemetry"})
    MATCH (diagnosticLogs:DataObject {id: "hp-data-diagnostic-logs"})
    MATCH (maintenanceSchedules:DataObject {id: "hp-data-maintenance-schedules"})
    CREATE (predictiveMaint)-[:USES]->(sensorTelemetry)
    CREATE (predictiveMaint)-[:USES]->(diagnosticLogs)
    CREATE (maintenanceSchedules)-[:DATA_SOURCE]->(predictiveMaint)
  `)

  // Service Technician Mobile App
  await session.run(`
    MATCH (serviceMobile:Application {id: "hp-app-service-mobile"})
    MATCH (serviceTickets:DataObject {id: "hp-data-service-tickets"})
    MATCH (installationRecords:DataObject {id: "hp-data-installation-records"})
    MATCH (productSpecs:DataObject {id: "hp-data-product-specifications"})
    CREATE (serviceMobile)-[:USES]->(serviceTickets)
    CREATE (serviceMobile)-[:USES]->(installationRecords)
    CREATE (serviceMobile)-[:USES]->(productSpecs)
  `)

  // Partner Mobile App
  await session.run(`
    MATCH (partnerMobile:Application {id: "hp-app-partner-mobile"})
    MATCH (productSpecs:DataObject {id: "hp-data-product-specifications"})
    MATCH (salesTransactions:DataObject {id: "hp-data-sales-transactions"})
    CREATE (partnerMobile)-[:USES]->(productSpecs)
    CREATE (partnerMobile)-[:USES]->(salesTransactions)
  `)

  // Warehouse Management System
  await session.run(`
    MATCH (warehouseMgmt:Application {id: "hp-app-warehouse-mgmt"})
    MATCH (bom:DataObject {id: "hp-data-bill-of-materials"})
    MATCH (supplierInfo:DataObject {id: "hp-data-supplier-information"})
    MATCH (productionMetrics:DataObject {id: "hp-data-production-metrics"})
    CREATE (warehouseMgmt)-[:USES]->(bom)
    CREATE (warehouseMgmt)-[:USES]->(supplierInfo)
    CREATE (warehouseMgmt)-[:USES]->(productionMetrics)
  `)

  // Warranty Management System
  await session.run(`
    MATCH (warrantyMgmt:Application {id: "hp-app-warranty-mgmt"})
    MATCH (installationRecords:DataObject {id: "hp-data-installation-records"})
    MATCH (serviceTickets:DataObject {id: "hp-data-service-tickets"})
    MATCH (customerProfiles:DataObject {id: "hp-data-customer-profiles"})
    CREATE (warrantyMgmt)-[:USES]->(installationRecords)
    CREATE (warrantyMgmt)-[:USES]->(serviceTickets)
    CREATE (warrantyMgmt)-[:USES]->(customerProfiles)
  `)

  // Spare Parts Management
  await session.run(`
    MATCH (spareParts:Application {id: "hp-app-spare-parts"})
    MATCH (bom:DataObject {id: "hp-data-bill-of-materials"})
    MATCH (supplierInfo:DataObject {id: "hp-data-supplier-information"})
    MATCH (serviceTickets:DataObject {id: "hp-data-service-tickets"})
    CREATE (spareParts)-[:USES]->(bom)
    CREATE (spareParts)-[:USES]->(supplierInfo)
    CREATE (spareParts)-[:USES]->(serviceTickets)
  `)

  // Supplier Collaboration Portal
  await session.run(`
    MATCH (supplierPortal:Application {id: "hp-app-supplier-portal"})
    MATCH (supplierInfo:DataObject {id: "hp-data-supplier-information"})
    MATCH (qualityRecords:DataObject {id: "hp-data-quality-records"})
    MATCH (bom:DataObject {id: "hp-data-bill-of-materials"})
    CREATE (supplierPortal)-[:USES]->(supplierInfo)
    CREATE (supplierPortal)-[:USES]->(qualityRecords)
    CREATE (supplierPortal)-[:USES]->(bom)
  `)

  // Enterprise Document Management
  await session.run(`
    MATCH (documentMgmt:Application {id: "hp-app-document-mgmt"})
    MATCH (complianceRecords:DataObject {id: "hp-data-compliance-records"})
    MATCH (knowledgeBase:DataObject {id: "hp-data-knowledge-base"})
    MATCH (trainingMaterials:DataObject {id: "hp-data-training-materials"})
    CREATE (documentMgmt)-[:USES]->(complianceRecords)
    CREATE (documentMgmt)-[:USES]->(knowledgeBase)
    CREATE (documentMgmt)-[:USES]->(trainingMaterials)
  `)

  // Backup & Disaster Recovery
  await session.run(`
    MATCH (backup:Application {id: "hp-app-backup-recovery"})
    MATCH (financialReports:DataObject {id: "hp-data-financial-reports"})
    MATCH (customerProfiles:DataObject {id: "hp-data-customer-profiles"})
    CREATE (backup)-[:USES]->(financialReports)
    CREATE (backup)-[:USES]->(customerProfiles)
  `)

  // Learning Management System
  await session.run(`
    MATCH (learningMgmt:Application {id: "hp-app-learning-mgmt"})
    MATCH (trainingMaterials:DataObject {id: "hp-data-training-materials"})
    MATCH (knowledgeBase:DataObject {id: "hp-data-knowledge-base"})
    CREATE (learningMgmt)-[:USES]->(trainingMaterials)
    CREATE (learningMgmt)-[:USES]->(knowledgeBase)
  `)

  // Expense Management System
  await session.run(`
    MATCH (expenseMgmt:Application {id: "hp-app-expense-mgmt"})
    MATCH (financialReports:DataObject {id: "hp-data-financial-reports"})
    MATCH (costAnalysis:DataObject {id: "hp-data-cost-analysis"})
    CREATE (expenseMgmt)-[:USES]->(financialReports)
    CREATE (expenseMgmt)-[:USES]->(costAnalysis)
  `)

  // Innovation Management Portal
  await session.run(`
    MATCH (innovationPortal:Application {id: "hp-app-innovation-portal"})
    MATCH (thermalModels:DataObject {id: "hp-data-thermal-models"})
    MATCH (testResults:DataObject {id: "hp-data-test-results"})
    MATCH (productSpecs:DataObject {id: "hp-data-product-specifications"})
    CREATE (innovationPortal)-[:USES]->(thermalModels)
    CREATE (innovationPortal)-[:USES]->(testResults)
    CREATE (innovationPortal)-[:USES]->(productSpecs)
  `)

  // Intellectual Property Management
  await session.run(`
    MATCH (ipMgmt:Application {id: "hp-app-ip-management"})
    MATCH (thermalModels:DataObject {id: "hp-data-thermal-models"})
    MATCH (productSpecs:DataObject {id: "hp-data-product-specifications"})
    MATCH (complianceRecords:DataObject {id: "hp-data-compliance-records"})
    CREATE (ipMgmt)-[:USES]->(thermalModels)
    CREATE (ipMgmt)-[:USES]->(productSpecs)
    CREATE (ipMgmt)-[:USES]->(complianceRecords)
  `)

  // Legal Technology Platform
  await session.run(`
    MATCH (legalTech:Application {id: "hp-app-legal-tech"})
    MATCH (complianceRecords:DataObject {id: "hp-data-compliance-records"})
    MATCH (supplierInfo:DataObject {id: "hp-data-supplier-information"})
    CREATE (legalTech)-[:USES]->(complianceRecords)
    CREATE (legalTech)-[:USES]->(supplierInfo)
  `)

  // Social Media Listening Platform
  await session.run(`
    MATCH (socialListening:Application {id: "hp-app-social-listening"})
    MATCH (marketIntelligence:DataObject {id: "hp-data-market-intelligence"})
    MATCH (customerProfiles:DataObject {id: "hp-data-customer-profiles"})
    CREATE (socialListening)-[:USES]->(marketIntelligence)
    CREATE (marketIntelligence)-[:DATA_SOURCE]->(socialListening)
    CREATE (socialListening)-[:USES]->(customerProfiles)
  `)

  // Test Data Management System
  await session.run(`
    MATCH (testDataMgmt:Application {id: "hp-app-test-data-mgmt"})
    MATCH (testResults:DataObject {id: "hp-data-test-results"})
    MATCH (qualityRecords:DataObject {id: "hp-data-quality-records"})
    MATCH (thermalModels:DataObject {id: "hp-data-thermal-models"})
    CREATE (testDataMgmt)-[:USES]->(testResults)
    CREATE (testDataMgmt)-[:USES]->(qualityRecords)
    CREATE (testDataMgmt)-[:USES]->(thermalModels)
  `)

  // CFD Simulation Suite
  await session.run(`
    MATCH (cfdSimulation:Application {id: "hp-app-cfd-simulation"})
    MATCH (thermalModels:DataObject {id: "hp-data-thermal-models"})
    MATCH (refrigerantProperties:DataObject {id: "hp-data-refrigerant-properties"})
    MATCH (weatherConditions:DataObject {id: "hp-data-weather-conditions"})
    CREATE (cfdSimulation)-[:USES]->(thermalModels)
    CREATE (cfdSimulation)-[:USES]->(refrigerantProperties)
    CREATE (cfdSimulation)-[:USES]->(weatherConditions)
  `)

  // HRMS
  await session.run(`
    MATCH (hrms:Application {id: "hp-app-hrms"})
    MATCH (trainingMaterials:DataObject {id: "hp-data-training-materials"})
    MATCH (complianceRecords:DataObject {id: "hp-data-compliance-records"})
    CREATE (hrms)-[:USES]->(trainingMaterials)
    CREATE (hrms)-[:USES]->(complianceRecords)
  `)

  // Advanced MRP System
  await session.run(`
    MATCH (advancedMRP:Application {id: "hp-app-advanced-mrp"})
    MATCH (bom:DataObject {id: "hp-data-bill-of-materials"})
    MATCH (productionMetrics:DataObject {id: "hp-data-production-metrics"})
    MATCH (supplierInfo:DataObject {id: "hp-data-supplier-information"})
    CREATE (advancedMRP)-[:USES]->(bom)
    CREATE (advancedMRP)-[:USES]->(productionMetrics)
    CREATE (advancedMRP)-[:USES]->(supplierInfo)
  `)

  // Cybersecurity Platform
  await session.run(`
    MATCH (cybersecurity:Application {id: "hp-app-cybersecurity"})
    MATCH (diagnosticLogs:DataObject {id: "hp-data-diagnostic-logs"})
    MATCH (complianceRecords:DataObject {id: "hp-data-compliance-records"})
    CREATE (cybersecurity)-[:USES]->(diagnosticLogs)
    CREATE (cybersecurity)-[:USES]->(complianceRecords)
  `)

  // B2B E-Commerce Platform
  await session.run(`
    MATCH (ecommerce:Application {id: "hp-app-ecommerce-platform"})
    MATCH (productSpecs:DataObject {id: "hp-data-product-specifications"})
    MATCH (customerProfiles:DataObject {id: "hp-data-customer-profiles"})
    MATCH (salesTransactions:DataObject {id: "hp-data-sales-transactions"})
    CREATE (ecommerce)-[:USES]->(productSpecs)
    CREATE (ecommerce)-[:USES]->(customerProfiles)
    CREATE (salesTransactions)-[:DATA_SOURCE]->(ecommerce)
  `)

  // Strategic Portfolio Management
  await session.run(`
    MATCH (strategyPortfolio:Application {id: "hp-app-strategy-portfolio"})
    MATCH (marketIntelligence:DataObject {id: "hp-data-market-intelligence"})
    MATCH (financialReports:DataObject {id: "hp-data-financial-reports"})
    MATCH (costAnalysis:DataObject {id: "hp-data-cost-analysis"})
    CREATE (strategyPortfolio)-[:USES]->(marketIntelligence)
    CREATE (strategyPortfolio)-[:USES]->(financialReports)
    CREATE (strategyPortfolio)-[:USES]->(costAnalysis)
  `)

  // Risk Management
  await session.run(`
    MATCH (riskMgmt:Application {id: "hp-app-risk-management"})
    MATCH (complianceRecords:DataObject {id: "hp-data-compliance-records"})
    MATCH (financialReports:DataObject {id: "hp-data-financial-reports"})
    MATCH (supplierInfo:DataObject {id: "hp-data-supplier-information"})
    CREATE (riskMgmt)-[:USES]->(complianceRecords)
    CREATE (riskMgmt)-[:USES]->(financialReports)
    CREATE (riskMgmt)-[:USES]->(supplierInfo)
  `)

  // Market Intelligence Platform
  await session.run(`
    MATCH (marketIntel:Application {id: "hp-app-market-intelligence"})
    MATCH (marketIntelligence:DataObject {id: "hp-data-market-intelligence"})
    MATCH (customerProfiles:DataObject {id: "hp-data-customer-profiles"})
    MATCH (salesTransactions:DataObject {id: "hp-data-sales-transactions"})
    CREATE (marketIntelligence)-[:DATA_SOURCE]->(marketIntel)
    CREATE (marketIntel)-[:USES]->(customerProfiles)
    CREATE (marketIntel)-[:USES]->(salesTransactions)
  `)

  // Modern PLM System
  await session.run(`
    MATCH (modernPLM:Application {id: "hp-app-modern-plm"})
    MATCH (productSpecs:DataObject {id: "hp-data-product-specifications"})
    MATCH (thermalModels:DataObject {id: "hp-data-thermal-models"})
    MATCH (bom:DataObject {id: "hp-data-bill-of-materials"})
    MATCH (testResults:DataObject {id: "hp-data-test-results"})
    CREATE (productSpecs)-[:DATA_SOURCE]->(modernPLM)
    CREATE (modernPLM)-[:USES]->(thermalModels)
    CREATE (modernPLM)-[:USES]->(bom)
    CREATE (modernPLM)-[:USES]->(testResults)
  `)

  // Heat Pump Configurator
  await session.run(`
    MATCH (configurator:Application {id: "hp-app-product-configurator"})
    MATCH (productSpecs:DataObject {id: "hp-data-product-specifications"})
    MATCH (thermalModels:DataObject {id: "hp-data-thermal-models"})
    MATCH (refrigerantProperties:DataObject {id: "hp-data-refrigerant-properties"})
    CREATE (configurator)-[:USES]->(productSpecs)
    CREATE (configurator)-[:USES]->(thermalModels)
    CREATE (configurator)-[:USES]->(refrigerantProperties)
  `)

  // Sustainability Tracker
  await session.run(`
    MATCH (sustainabilityTracker:Application {id: "hp-app-sustainability-tracker"})
    MATCH (sustainabilityMetrics:DataObject {id: "hp-data-sustainability-metrics"})
    MATCH (energyConsumption:DataObject {id: "hp-data-energy-consumption"})
    MATCH (complianceRecords:DataObject {id: "hp-data-compliance-records"})
    CREATE (sustainabilityMetrics)-[:DATA_SOURCE]->(sustainabilityTracker)
    CREATE (sustainabilityTracker)-[:USES]->(energyConsumption)
    CREATE (sustainabilityTracker)-[:USES]->(complianceRecords)
  `)

  // Technical Knowledge Base
  await session.run(`
    MATCH (knowledgeBaseApp:Application {id: "hp-app-knowledge-base"})
    MATCH (knowledgeBase:DataObject {id: "hp-data-knowledge-base"})
    MATCH (trainingMaterials:DataObject {id: "hp-data-training-materials"})
    MATCH (productSpecs:DataObject {id: "hp-data-product-specifications"})
    CREATE (knowledgeBase)-[:DATA_SOURCE]->(knowledgeBaseApp)
    CREATE (knowledgeBaseApp)-[:USES]->(trainingMaterials)
    CREATE (knowledgeBaseApp)-[:USES]->(productSpecs)
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

  // Additional cloud-hosted applications
  await session.run(`
    MATCH (digitalMarketing:Application {id: "hp-app-digital-marketing"})
    MATCH (socialListening:Application {id: "hp-app-social-listening"})
    MATCH (marketIntelligence:Application {id: "hp-app-market-intelligence"})
    MATCH (ecommerce:Application {id: "hp-app-ecommerce-platform"})
    MATCH (partnerMobile:Application {id: "hp-app-partner-mobile"})
    MATCH (serviceMobile:Application {id: "hp-app-service-mobile"})
    MATCH (awsCloud:Infrastructure {id: "hp-infra-aws-cloud"})
    CREATE (digitalMarketing)-[:HOSTED_ON]->(awsCloud)
    CREATE (socialListening)-[:HOSTED_ON]->(awsCloud)
    CREATE (marketIntelligence)-[:HOSTED_ON]->(awsCloud)
    CREATE (ecommerce)-[:HOSTED_ON]->(awsCloud)
    CREATE (partnerMobile)-[:HOSTED_ON]->(awsCloud)
    CREATE (serviceMobile)-[:HOSTED_ON]->(awsCloud)
  `)

  // Engineering and PLM applications - Primary datacenter
  await session.run(`
    MATCH (modernPLM:Application {id: "hp-app-modern-plm"})
    MATCH (cfdSimulation:Application {id: "hp-app-cfd-simulation"})
    MATCH (testDataMgmt:Application {id: "hp-app-test-data-mgmt"})
    MATCH (innovationPortal:Application {id: "hp-app-innovation-portal"})
    MATCH (ipMgmt:Application {id: "hp-app-ip-management"})
    MATCH (primaryDatacenter:Infrastructure {id: "hp-infra-datacenter-primary"})
    CREATE (modernPLM)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (cfdSimulation)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (testDataMgmt)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (innovationPortal)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (ipMgmt)-[:HOSTED_ON]->(primaryDatacenter)
  `)

  // IoT and Edge applications - IoT Platform
  await session.run(`
    MATCH (energyMgmt:Application {id: "hp-app-energy-mgmt"})
    MATCH (predictiveMaint:Application {id: "hp-app-predictive-maintenance"})
    MATCH (configurator:Application {id: "hp-app-product-configurator"})
    MATCH (iotPlatform:Infrastructure {id: "hp-infra-iot-platform"})
    CREATE (energyMgmt)-[:HOSTED_ON]->(iotPlatform)
    CREATE (predictiveMaint)-[:HOSTED_ON]->(iotPlatform)
    CREATE (configurator)-[:HOSTED_ON]->(iotPlatform)
  `)

  // Manufacturing and operational applications - MES Servers
  await session.run(`
    MATCH (advancedMRP:Application {id: "hp-app-advanced-mrp"})
    MATCH (warehouseMgmt:Application {id: "hp-app-warehouse-mgmt"})
    MATCH (spareParts:Application {id: "hp-app-spare-parts"})
    MATCH (supplierPortal:Application {id: "hp-app-supplier-portal"})
    MATCH (mesServers:Infrastructure {id: "hp-infra-mes-servers"})
    CREATE (advancedMRP)-[:HOSTED_ON]->(mesServers)
    CREATE (warehouseMgmt)-[:HOSTED_ON]->(mesServers)
    CREATE (spareParts)-[:HOSTED_ON]->(mesServers)
    CREATE (supplierPortal)-[:HOSTED_ON]->(mesServers)
  `)

  // Business and HR applications - Primary datacenter
  await session.run(`
    MATCH (hrms:Application {id: "hp-app-hrms"})
    MATCH (learningMgmt:Application {id: "hp-app-learning-mgmt"})
    MATCH (expenseMgmt:Application {id: "hp-app-expense-mgmt"})
    MATCH (knowledgeBase:Application {id: "hp-app-knowledge-base"})
    MATCH (strategyPortfolio:Application {id: "hp-app-strategy-portfolio"})
    MATCH (sustainabilityTracker:Application {id: "hp-app-sustainability-tracker"})
    MATCH (primaryDatacenter:Infrastructure {id: "hp-infra-datacenter-primary"})
    CREATE (hrms)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (learningMgmt)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (expenseMgmt)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (knowledgeBase)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (strategyPortfolio)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (sustainabilityTracker)-[:HOSTED_ON]->(primaryDatacenter)
  `)

  // Legal and compliance applications - Primary datacenter
  await session.run(`
    MATCH (legalTech:Application {id: "hp-app-legal-tech"})
    MATCH (riskMgmt:Application {id: "hp-app-risk-management"})
    MATCH (documentMgmt:Application {id: "hp-app-document-mgmt"})
    MATCH (warrantyMgmt:Application {id: "hp-app-warranty-mgmt"})
    MATCH (primaryDatacenter:Infrastructure {id: "hp-infra-datacenter-primary"})
    CREATE (legalTech)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (riskMgmt)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (documentMgmt)-[:HOSTED_ON]->(primaryDatacenter)
    CREATE (warrantyMgmt)-[:HOSTED_ON]->(primaryDatacenter)
  `)

  // Security and infrastructure applications - Infrastructure specific
  await session.run(`
    MATCH (cybersecurity:Application {id: "hp-app-cybersecurity"})
    MATCH (firewall:Infrastructure {id: "hp-infra-firewall"})
    CREATE (cybersecurity)-[:HOSTED_ON]->(firewall)
  `)

  await session.run(`
    MATCH (backupRecovery:Application {id: "hp-app-backup-recovery"})
    MATCH (azureBackup:Infrastructure {id: "hp-infra-azure-backup"})
    CREATE (backupRecovery)-[:HOSTED_ON]->(azureBackup)
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
    MATCH (manufacturing:BusinessCapability {id: "hp-cap-manufacturing-operations"})
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
    MATCH (manufacturing:BusinessCapability {id: "hp-cap-manufacturing-operations"})
    MATCH (service:BusinessCapability {id: "hp-cap-service-support"})
    CREATE (customer_arch)-[:CONTAINS]->(research)
    CREATE (customer_arch)-[:CONTAINS]->(manufacturing)
    CREATE (customer_arch)-[:CONTAINS]->(service)
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

  // First, create ownership relationships for all interfaces that don't already have person owners
  await session.run(`
    MATCH (ai:ApplicationInterface)
    WHERE NOT (ai)-[:OWNED_BY]->(:Person)
    MATCH (owners:Person) WHERE owners.id IN ['hp-person-cio', 'hp-person-cto', 'hp-person-it-manager', 'hp-person-product-manager', 'hp-person-quality-manager', 'hp-person-rd-director', 'hp-person-manufacturing-director']
    WITH ai, collect(owners) as ownerList
    WITH ai, ownerList[toInteger(rand() * size(ownerList))] as selected_owner
    CREATE (ai)-[:OWNED_BY]->(selected_owner)
  `)

  // Create interface relationships systematically for all 45 interfaces
  // Using a robust approach that assigns available applications and data objects

  // Group 1: IoT and Energy Management APIs
  await session.run(`
    MATCH (ai:ApplicationInterface) WHERE ai.id IN [
      'hp-interface-iot-device-api', 'hp-interface-iot-telemetry-api', 
      'hp-interface-energy-analytics-api', 'hp-interface-energy-mgmt-api',
      'hp-interface-smart-grid-api', 'hp-interface-predictive-maintenance-api'
    ]
    MATCH (iot_platform:Application {id: "hp-app-iot-platform"})
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    MATCH (sensor_data:DataObject {id: "hp-data-sensor-telemetry"})
    MATCH (energy_data:DataObject {id: "hp-data-energy-consumption"})
    WITH ai, iot_platform, energy_analytics, sensor_data, energy_data
    CREATE (iot_platform)-[:INTERFACE_SOURCE]->(ai)
    CREATE (ai)<-[:INTERFACE_TARGET]-(energy_analytics)
    CREATE (ai)-[:TRANSFERS]->(sensor_data)
    CREATE (ai)-[:TRANSFERS]->(energy_data)
  `)

  // Group 2: ERP and Business APIs
  await session.run(`
    MATCH (ai:ApplicationInterface) WHERE ai.id IN [
      'hp-interface-erp-customer-api', 'hp-interface-erp-order-api', 
      'hp-interface-erp-product-api', 'hp-interface-data-export-api',
      'hp-interface-hrms-api', 'hp-interface-expense-api'
    ]
    MATCH (sap:Application {id: "hp-app-sap-s4hana"})
    MATCH (crm:Application {id: "hp-app-crm-salesforce"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    MATCH (financial_data:DataObject {id: "hp-data-financial-reports"})
    WITH ai, sap, crm, customer_data, financial_data
    CREATE (sap)-[:INTERFACE_SOURCE]->(ai)
    CREATE (ai)<-[:INTERFACE_TARGET]-(crm)
    CREATE (ai)-[:TRANSFERS]->(customer_data)
    CREATE (ai)-[:TRANSFERS]->(financial_data)
  `)

  // Group 3: CRM and Customer Service APIs
  await session.run(`
    MATCH (ai:ApplicationInterface) WHERE ai.id IN [
      'hp-interface-crm-service-api', 'hp-interface-crm-installer-api',
      'hp-interface-mobile-customer-api', 'hp-interface-technical-support-api',
      'hp-interface-service-mobile-api', 'hp-interface-warranty-api'
    ]
    MATCH (crm:Application {id: "hp-app-crm-salesforce"})
    MATCH (service_mgmt:Application {id: "hp-app-service-management"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    MATCH (service_tickets:DataObject {id: "hp-data-service-tickets"})
    WITH ai, crm, service_mgmt, customer_data, service_tickets
    CREATE (crm)-[:INTERFACE_SOURCE]->(ai)
    CREATE (ai)<-[:INTERFACE_TARGET]-(service_mgmt)
    CREATE (ai)-[:TRANSFERS]->(customer_data)
    CREATE (ai)-[:TRANSFERS]->(service_tickets)
  `)

  // Group 4: Manufacturing and Quality APIs
  await session.run(`
    MATCH (ai:ApplicationInterface) WHERE ai.id IN [
      'hp-interface-mes-production-api', 'hp-interface-quality-test-api',
      'hp-interface-mrp-api', 'hp-interface-plm-api',
      'hp-interface-supplier-portal-api', 'hp-interface-warehouse-api'
    ]
    MATCH (mes:Application {id: "hp-app-hvac-mes"})
    MATCH (quality:Application {id: "hp-app-quality-management"})
    MATCH (production_data:DataObject {id: "hp-data-production-metrics"})
    MATCH (quality_data:DataObject {id: "hp-data-quality-records"})
    WITH ai, mes, quality, production_data, quality_data
    CREATE (mes)-[:INTERFACE_SOURCE]->(ai)
    CREATE (ai)<-[:INTERFACE_TARGET]-(quality)
    CREATE (ai)-[:TRANSFERS]->(production_data)
    CREATE (ai)-[:TRANSFERS]->(quality_data)
  `)

  // Group 5: Analytics and Reporting APIs
  await session.run(`
    MATCH (ai:ApplicationInterface) WHERE ai.id IN [
      'hp-interface-bi-reporting-api', 'hp-interface-market-intel-api',
      'hp-interface-strategy-api', 'hp-interface-sustainability-api',
      'hp-interface-social-listening-api'
    ]
    MATCH (power_bi:Application {id: "hp-app-power-bi"})
    MATCH (market_intel:Application {id: "hp-app-market-intelligence"})
    MATCH (financial_data:DataObject {id: "hp-data-financial-reports"})
    MATCH (market_data:DataObject {id: "hp-data-market-intelligence"})
    WITH ai, power_bi, market_intel, financial_data, market_data
    CREATE (power_bi)-[:INTERFACE_SOURCE]->(ai)
    CREATE (ai)<-[:INTERFACE_TARGET]-(market_intel)
    CREATE (ai)-[:TRANSFERS]->(financial_data)
    CREATE (ai)-[:TRANSFERS]->(market_data)
  `)

  // Group 6: Product and Engineering APIs
  await session.run(`
    MATCH (ai:ApplicationInterface) WHERE ai.id IN [
      'hp-interface-cfd-api', 'hp-interface-configurator-api',
      'hp-interface-innovation-api', 'hp-interface-test-data-api',
      'hp-interface-spare-parts-api'
    ]
    MATCH (thermal_cad:Application {id: "hp-app-thermal-cad"})
    MATCH (product_config:Application {id: "hp-app-product-configurator"})
    MATCH (product_specs:DataObject {id: "hp-data-product-specifications"})
    MATCH (test_results:DataObject {id: "hp-data-test-results"})
    WITH ai, thermal_cad, product_config, product_specs, test_results
    CREATE (thermal_cad)-[:INTERFACE_SOURCE]->(ai)
    CREATE (ai)<-[:INTERFACE_TARGET]-(product_config)
    CREATE (ai)-[:TRANSFERS]->(product_specs)
    CREATE (ai)-[:TRANSFERS]->(test_results)
  `)

  // Group 7: Digital and Collaboration APIs
  await session.run(`
    MATCH (ai:ApplicationInterface) WHERE ai.id IN [
      'hp-interface-document-api', 'hp-interface-knowledge-base-api',
      'hp-interface-learning-api', 'hp-interface-digital-marketing-api',
      'hp-interface-ecommerce-api', 'hp-interface-partner-mobile-api'
    ]
    MATCH (office365:Application {id: "hp-app-office365"})
    MATCH (knowledge_base:Application {id: "hp-app-knowledge-base"})
    MATCH (knowledge_data:DataObject {id: "hp-data-knowledge-base"})
    MATCH (training_data:DataObject {id: "hp-data-training-materials"})
    WITH ai, office365, knowledge_base, knowledge_data, training_data
    CREATE (office365)-[:INTERFACE_SOURCE]->(ai)
    CREATE (ai)<-[:INTERFACE_TARGET]-(knowledge_base)
    CREATE (ai)-[:TRANSFERS]->(knowledge_data)
    CREATE (ai)-[:TRANSFERS]->(training_data)
  `)

  // Group 8: Security and Compliance APIs
  await session.run(`
    MATCH (ai:ApplicationInterface) WHERE ai.id IN [
      'hp-interface-cybersecurity-api', 'hp-interface-backup-api',
      'hp-interface-risk-mgmt-api', 'hp-interface-legal-tech-api',
      'hp-interface-ip-mgmt-api'
    ]
    MATCH (cybersecurity:Application {id: "hp-app-cybersecurity"})
    MATCH (backup:Application {id: "hp-app-backup-recovery"})
    MATCH (compliance_data:DataObject {id: "hp-data-compliance-records"})
    MATCH (diagnostic_logs:DataObject {id: "hp-data-diagnostic-logs"})
    WITH ai, cybersecurity, backup, compliance_data, diagnostic_logs
    CREATE (cybersecurity)-[:INTERFACE_SOURCE]->(ai)
    CREATE (ai)<-[:INTERFACE_TARGET]-(backup)
    CREATE (ai)-[:TRANSFERS]->(compliance_data)
    CREATE (ai)-[:TRANSFERS]->(diagnostic_logs)
  `)

  console.log(
    'All 45 Interface relationships created successfully with owners, sources, targets and data transfers.'
  )

  // Ensure every application has meaningful interface relationships based on semantic matching

  // MRP System connections
  await session.run(`
    MATCH (mrp:Application {id: "hp-app-advanced-mrp"})
    MATCH (mrp_api:ApplicationInterface {id: "hp-interface-mrp-api"})
    MATCH (production_data:DataObject {id: "hp-data-production-metrics"})
    MERGE (mrp)-[:INTERFACE_SOURCE]->(mrp_api)
    MERGE (mrp_api)-[:TRANSFERS]->(production_data)
  `)

  // Backup System connections
  await session.run(`
    MATCH (backup:Application {id: "hp-app-backup-recovery"})
    MATCH (backup_api:ApplicationInterface {id: "hp-interface-backup-api"})
    MATCH (diagnostic_logs:DataObject {id: "hp-data-diagnostic-logs"})
    MERGE (backup)-[:INTERFACE_SOURCE]->(backup_api)
    MERGE (backup_api)-[:TRANSFERS]->(diagnostic_logs)
  `)

  // CFD Simulation connections
  await session.run(`
    MATCH (cfd:Application {id: "hp-app-cfd-simulation"})
    MATCH (cfd_api:ApplicationInterface {id: "hp-interface-cfd-api"})
    MATCH (thermal_models:DataObject {id: "hp-data-thermal-models"})
    MERGE (cfd)-[:INTERFACE_SOURCE]->(cfd_api)
    MERGE (cfd_api)-[:TRANSFERS]->(thermal_models)
  `)

  // Digital Marketing connections
  await session.run(`
    MATCH (marketing:Application {id: "hp-app-digital-marketing"})
    MATCH (marketing_api:ApplicationInterface {id: "hp-interface-digital-marketing-api"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    MERGE (marketing)-[:INTERFACE_SOURCE]->(marketing_api)
    MERGE (marketing_api)-[:TRANSFERS]->(customer_data)
  `)

  // Document Management connections
  await session.run(`
    MATCH (doc_mgmt:Application {id: "hp-app-document-mgmt"})
    MATCH (doc_api:ApplicationInterface {id: "hp-interface-document-api"})
    MATCH (training_materials:DataObject {id: "hp-data-training-materials"})
    MERGE (doc_mgmt)-[:INTERFACE_SOURCE]->(doc_api)
    MERGE (doc_api)-[:TRANSFERS]->(training_materials)
  `)

  // E-commerce Platform connections
  await session.run(`
    MATCH (ecommerce:Application {id: "hp-app-ecommerce-platform"})
    MATCH (ecommerce_api:ApplicationInterface {id: "hp-interface-ecommerce-api"})
    MATCH (sales_data:DataObject {id: "hp-data-sales-transactions"})
    MERGE (ecommerce)-[:INTERFACE_SOURCE]->(ecommerce_api)
    MERGE (ecommerce_api)-[:TRANSFERS]->(sales_data)
  `)

  // Energy Management connections
  await session.run(`
    MATCH (energy_mgmt:Application {id: "hp-app-energy-mgmt"})
    MATCH (energy_api:ApplicationInterface {id: "hp-interface-energy-mgmt-api"})
    MATCH (energy_data:DataObject {id: "hp-data-energy-consumption"})
    MERGE (energy_mgmt)-[:INTERFACE_SOURCE]->(energy_api)
    MERGE (energy_api)-[:TRANSFERS]->(energy_data)
  `)

  // Expense Management connections
  await session.run(`
    MATCH (expense:Application {id: "hp-app-expense-mgmt"})
    MATCH (expense_api:ApplicationInterface {id: "hp-interface-expense-api"})
    MATCH (financial_data:DataObject {id: "hp-data-financial-reports"})
    MERGE (expense)-[:INTERFACE_SOURCE]->(expense_api)
    MERGE (expense_api)-[:TRANSFERS]->(financial_data)
  `)

  // HRMS connections
  await session.run(`
    MATCH (hrms:Application {id: "hp-app-hrms"})
    MATCH (hrms_api:ApplicationInterface {id: "hp-interface-hrms-api"})
    MATCH (training_materials:DataObject {id: "hp-data-training-materials"})
    MERGE (hrms)-[:INTERFACE_SOURCE]->(hrms_api)
    MERGE (hrms_api)-[:TRANSFERS]->(training_materials)
  `)

  // Innovation Portal connections
  await session.run(`
    MATCH (innovation:Application {id: "hp-app-innovation-portal"})
    MATCH (innovation_api:ApplicationInterface {id: "hp-interface-innovation-api"})
    MATCH (product_specs:DataObject {id: "hp-data-product-specifications"})
    MERGE (innovation)-[:INTERFACE_SOURCE]->(innovation_api)
    MERGE (innovation_api)-[:TRANSFERS]->(product_specs)
  `)

  // Installer Portal connections
  await session.run(`
    MATCH (installer:Application {id: "hp-app-installer-portal"})
    MATCH (installer_api:ApplicationInterface {id: "hp-interface-crm-installer-api"})
    MATCH (installation_data:DataObject {id: "hp-data-installation-records"})
    MERGE (installer)-[:INTERFACE_TARGET]->(installer_api)
    MERGE (installer_api)-[:TRANSFERS]->(installation_data)
  `)

  // IP Management connections
  await session.run(`
    MATCH (ip_mgmt:Application {id: "hp-app-ip-management"})
    MATCH (ip_api:ApplicationInterface {id: "hp-interface-ip-mgmt-api"})
    MATCH (product_specs:DataObject {id: "hp-data-product-specifications"})
    MERGE (ip_mgmt)-[:INTERFACE_SOURCE]->(ip_api)
    MERGE (ip_api)-[:TRANSFERS]->(product_specs)
  `)

  // Knowledge Base connections
  await session.run(`
    MATCH (kb:Application {id: "hp-app-knowledge-base"})
    MATCH (kb_api:ApplicationInterface {id: "hp-interface-knowledge-base-api"})
    MATCH (knowledge_data:DataObject {id: "hp-data-knowledge-base"})
    MERGE (kb)-[:INTERFACE_SOURCE]->(kb_api)
    MERGE (kb_api)-[:TRANSFERS]->(knowledge_data)
  `)

  // Learning Management connections
  await session.run(`
    MATCH (lms:Application {id: "hp-app-learning-mgmt"})
    MATCH (learning_api:ApplicationInterface {id: "hp-interface-learning-api"})
    MATCH (training_materials:DataObject {id: "hp-data-training-materials"})
    MERGE (lms)-[:INTERFACE_SOURCE]->(learning_api)
    MERGE (learning_api)-[:TRANSFERS]->(training_materials)
  `)

  // Legacy PLM connections
  await session.run(`
    MATCH (legacy_plm:Application {id: "hp-app-legacy-plm"})
    MATCH (plm_api:ApplicationInterface {id: "hp-interface-plm-api"})
    MATCH (bom_data:DataObject {id: "hp-data-bill-of-materials"})
    MERGE (legacy_plm)-[:INTERFACE_SOURCE]->(plm_api)
    MERGE (plm_api)-[:TRANSFERS]->(bom_data)
  `)

  // Legal Tech connections
  await session.run(`
    MATCH (legal:Application {id: "hp-app-legal-tech"})
    MATCH (legal_api:ApplicationInterface {id: "hp-interface-legal-tech-api"})
    MATCH (compliance_data:DataObject {id: "hp-data-compliance-records"})
    MERGE (legal)-[:INTERFACE_SOURCE]->(legal_api)
    MERGE (legal_api)-[:TRANSFERS]->(compliance_data)
  `)

  // Market Intelligence connections
  await session.run(`
    MATCH (market:Application {id: "hp-app-market-intelligence"})
    MATCH (market_api:ApplicationInterface {id: "hp-interface-market-intel-api"})
    MATCH (market_data:DataObject {id: "hp-data-market-intelligence"})
    MERGE (market)-[:INTERFACE_SOURCE]->(market_api)
    MERGE (market_api)-[:TRANSFERS]->(market_data)
  `)

  // Modern PLM connections
  await session.run(`
    MATCH (modern_plm:Application {id: "hp-app-modern-plm"})
    MATCH (plm_api:ApplicationInterface {id: "hp-interface-plm-api"})
    MATCH (product_specs:DataObject {id: "hp-data-product-specifications"})
    MERGE (modern_plm)-[:INTERFACE_TARGET]->(plm_api)
    MERGE (plm_api)-[:TRANSFERS]->(product_specs)
  `)

  // Partner Mobile connections
  await session.run(`
    MATCH (partner:Application {id: "hp-app-partner-mobile"})
    MATCH (partner_api:ApplicationInterface {id: "hp-interface-partner-mobile-api"})
    MATCH (training_materials:DataObject {id: "hp-data-training-materials"})
    MERGE (partner)-[:INTERFACE_SOURCE]->(partner_api)
    MERGE (partner_api)-[:TRANSFERS]->(training_materials)
  `)

  // Predictive Maintenance connections
  await session.run(`
    MATCH (pred_maint:Application {id: "hp-app-predictive-maintenance"})
    MATCH (pred_api:ApplicationInterface {id: "hp-interface-predictive-maintenance-api"})
    MATCH (maintenance_data:DataObject {id: "hp-data-maintenance-schedules"})
    MERGE (pred_maint)-[:INTERFACE_SOURCE]->(pred_api)
    MERGE (pred_api)-[:TRANSFERS]->(maintenance_data)
  `)

  // Product Configurator connections
  await session.run(`
    MATCH (config:Application {id: "hp-app-product-configurator"})
    MATCH (config_api:ApplicationInterface {id: "hp-interface-configurator-api"})
    MATCH (product_specs:DataObject {id: "hp-data-product-specifications"})
    MERGE (config)-[:INTERFACE_SOURCE]->(config_api)
    MERGE (config_api)-[:TRANSFERS]->(product_specs)
  `)

  // Quality Management connections
  await session.run(`
    MATCH (quality:Application {id: "hp-app-quality-management"})
    MATCH (quality_api:ApplicationInterface {id: "hp-interface-quality-test-api"})
    MATCH (quality_data:DataObject {id: "hp-data-quality-records"})
    MERGE (quality)-[:INTERFACE_SOURCE]->(quality_api)
    MERGE (quality_api)-[:TRANSFERS]->(quality_data)
  `)

  // Risk Management connections
  await session.run(`
    MATCH (risk:Application {id: "hp-app-risk-management"})
    MATCH (risk_api:ApplicationInterface {id: "hp-interface-risk-mgmt-api"})
    MATCH (compliance_data:DataObject {id: "hp-data-compliance-records"})
    MERGE (risk)-[:INTERFACE_SOURCE]->(risk_api)
    MERGE (risk_api)-[:TRANSFERS]->(compliance_data)
  `)

  // Service Management connections
  await session.run(`
    MATCH (service:Application {id: "hp-app-service-management"})
    MATCH (service_api:ApplicationInterface {id: "hp-interface-service-mobile-api"})
    MATCH (service_tickets:DataObject {id: "hp-data-service-tickets"})
    MERGE (service)-[:INTERFACE_SOURCE]->(service_api)
    MERGE (service_api)-[:TRANSFERS]->(service_tickets)
  `)

  // Service Mobile connections
  await session.run(`
    MATCH (service_mobile:Application {id: "hp-app-service-mobile"})
    MATCH (service_api:ApplicationInterface {id: "hp-interface-service-mobile-api"})
    MATCH (maintenance_data:DataObject {id: "hp-data-maintenance-schedules"})
    MERGE (service_mobile)-[:INTERFACE_TARGET]->(service_api)
    MERGE (service_api)-[:TRANSFERS]->(maintenance_data)
  `)

  // Social Listening connections
  await session.run(`
    MATCH (social:Application {id: "hp-app-social-listening"})
    MATCH (social_api:ApplicationInterface {id: "hp-interface-social-listening-api"})
    MATCH (customer_data:DataObject {id: "hp-data-customer-profiles"})
    MERGE (social)-[:INTERFACE_SOURCE]->(social_api)
    MERGE (social_api)-[:TRANSFERS]->(customer_data)
  `)

  // Spare Parts connections
  await session.run(`
    MATCH (spare:Application {id: "hp-app-spare-parts"})
    MATCH (spare_api:ApplicationInterface {id: "hp-interface-spare-parts-api"})
    MATCH (maintenance_data:DataObject {id: "hp-data-maintenance-schedules"})
    MERGE (spare)-[:INTERFACE_SOURCE]->(spare_api)
    MERGE (spare_api)-[:TRANSFERS]->(maintenance_data)
  `)

  // Strategic Portfolio connections
  await session.run(`
    MATCH (strategy:Application {id: "hp-app-strategy-portfolio"})
    MATCH (strategy_api:ApplicationInterface {id: "hp-interface-strategy-api"})
    MATCH (market_data:DataObject {id: "hp-data-market-intelligence"})
    MERGE (strategy)-[:INTERFACE_SOURCE]->(strategy_api)
    MERGE (strategy_api)-[:TRANSFERS]->(market_data)
  `)

  // Supplier Portal connections
  await session.run(`
    MATCH (supplier:Application {id: "hp-app-supplier-portal"})
    MATCH (supplier_api:ApplicationInterface {id: "hp-interface-supplier-portal-api"})
    MATCH (supplier_data:DataObject {id: "hp-data-supplier-information"})
    MERGE (supplier)-[:INTERFACE_TARGET]->(supplier_api)
    MERGE (supplier_api)-[:TRANSFERS]->(supplier_data)
  `)

  // Sustainability Tracker connections
  await session.run(`
    MATCH (sustainability:Application {id: "hp-app-sustainability-tracker"})
    MATCH (sustainability_api:ApplicationInterface {id: "hp-interface-sustainability-api"})
    MATCH (sustainability_data:DataObject {id: "hp-data-sustainability-metrics"})
    MERGE (sustainability)-[:INTERFACE_SOURCE]->(sustainability_api)
    MERGE (sustainability_api)-[:TRANSFERS]->(sustainability_data)
  `)

  // Test Data Management connections
  await session.run(`
    MATCH (test_data:Application {id: "hp-app-test-data-mgmt"})
    MATCH (test_api:ApplicationInterface {id: "hp-interface-test-data-api"})
    MATCH (test_results:DataObject {id: "hp-data-test-results"})
    MERGE (test_data)-[:INTERFACE_SOURCE]->(test_api)
    MERGE (test_api)-[:TRANSFERS]->(test_results)
  `)

  // Warehouse Management connections
  await session.run(`
    MATCH (warehouse:Application {id: "hp-app-warehouse-mgmt"})
    MATCH (warehouse_api:ApplicationInterface {id: "hp-interface-warehouse-api"})
    MATCH (maintenance_data:DataObject {id: "hp-data-maintenance-schedules"})
    MERGE (warehouse)-[:INTERFACE_SOURCE]->(warehouse_api)
    MERGE (warehouse_api)-[:TRANSFERS]->(maintenance_data)
  `)

  // Warranty Management connections
  await session.run(`
    MATCH (warranty:Application {id: "hp-app-warranty-mgmt"})
    MATCH (warranty_api:ApplicationInterface {id: "hp-interface-warranty-api"})
    MATCH (service_tickets:DataObject {id: "hp-data-service-tickets"})
    MERGE (warranty)-[:INTERFACE_SOURCE]->(warranty_api)
    MERGE (warranty_api)-[:TRANSFERS]->(service_tickets)
  `)

  // Energy Analytics connections
  await session.run(`
    MATCH (energy_analytics:Application {id: "hp-app-energy-analytics"})
    MATCH (energy_api:ApplicationInterface {id: "hp-interface-energy-analytics-api"})
    MATCH (energy_data:DataObject {id: "hp-data-energy-consumption"})
    MERGE (energy_analytics)-[:INTERFACE_SOURCE]->(energy_api)
    MERGE (energy_api)-[:TRANSFERS]->(energy_data)
  `)

  // Diagnostic Tool connections
  await session.run(`
    MATCH (diagnostic_tool:Application {id: "hp-app-diagnostic-tool"})
    MATCH (predictive_api:ApplicationInterface {id: "hp-interface-predictive-maintenance-api"})
    MATCH (diagnostic_logs:DataObject {id: "hp-data-diagnostic-logs"})
    MERGE (diagnostic_tool)-[:INTERFACE_TARGET]->(predictive_api)
    MERGE (predictive_api)-[:TRANSFERS]->(diagnostic_logs)
  `)

  console.log(
    'Semantic interface relationships created to ensure every application has meaningful interface connections.'
  )
}

export async function createAllHeatPumpRelationships(session: Session) {
  console.log('Creating all Heat Pump Manufacturing relationships...')

  await createHeatPumpCapabilityHierarchy(session)
  await createApplicationCapabilitySupport(session)
  await createApplicationDataRelationships(session)
  await createApplicationInfrastructureHosting(session)
  await createInterfaceRelationships(session)
  await createArchitectureContainmentRelationships(session)
  await createArchitecturePrincipleRelationships(session)

  console.log('✅ All Heat Pump Manufacturing relationships created successfully!')
}
