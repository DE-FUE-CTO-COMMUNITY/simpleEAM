// AI Component Relationships for Solar Panel Manufacturing Company
// Connecting AI Components with Capabilities, Applications, Data, Infrastructure, and Principles

import { Session } from 'neo4j-driver'

export async function createAIComponentRelationships(session: Session) {
  console.log('Creating AI Component relationships...')

  // ===== AI COMPONENTS SUPPORTING BUSINESS CAPABILITIES =====
  await session.run(`
    MATCH 
      // AI Components
      (quality_prediction:AIComponent {id: "ai-quality-prediction"}),
      (defect_detection:AIComponent {id: "ai-defect-detection"}),
      (maintenance_predictor:AIComponent {id: "ai-maintenance-predictor"}),
      (demand_forecaster:AIComponent {id: "ai-demand-forecaster"}),
      (customer_chatbot:AIComponent {id: "ai-customer-chatbot"}),
      (supply_optimizer:AIComponent {id: "ai-supply-optimizer"}),
      (energy_forecaster:AIComponent {id: "ai-energy-forecaster"}),
      (product_recommender:AIComponent {id: "ai-product-recommender"}),
      (pricing_engine:AIComponent {id: "ai-pricing-engine"}),
      (sustainability_analyzer:AIComponent {id: "ai-sustainability-analyzer"}),
      
      // Business Capabilities (corrected IDs)
      (quality_management:BusinessCapability {id: "cap-quality-management"}),
      (manufacturing:BusinessCapability {id: "cap-manufacturing"}),
      (customer_service:BusinessCapability {id: "cap-customer-service"}),
      (supplier_mgmt:BusinessCapability {id: "cap-supplier-management"}),
      (supply_chain:BusinessCapability {id: "cap-supply-chain"}),
      (sales_marketing:BusinessCapability {id: "cap-sales-marketing"}),
      (lead_generation:BusinessCapability {id: "cap-lead-generation"}),
      (sales_execution:BusinessCapability {id: "cap-sales-execution"}),
      (research_development:BusinessCapability {id: "cap-research-development"}),
      (financial_planning:BusinessCapability {id: "cap-financial-planning"})
      
    CREATE 
      // Quality Prediction supports Quality Management
      (quality_prediction)-[:SUPPORTS]->(quality_management),
      
      // Defect Detection supports Quality Management
      (defect_detection)-[:SUPPORTS]->(quality_management),
      
      // Maintenance Predictor supports Manufacturing Operations
      (maintenance_predictor)-[:SUPPORTS]->(manufacturing),
      
      // Demand Forecaster supports Sales & Marketing
      (demand_forecaster)-[:SUPPORTS]->(sales_marketing),
      
      // Customer Chatbot supports Customer Service
      (customer_chatbot)-[:SUPPORTS]->(customer_service),
      
      // Supply Optimizer supports Supply Chain Management  
      (supply_optimizer)-[:SUPPORTS]->(supply_chain),
      
      // Energy Forecaster supports Research & Development
      (energy_forecaster)-[:SUPPORTS]->(research_development),
      
      // Product Recommender supports Sales Execution
      (product_recommender)-[:SUPPORTS]->(sales_execution),
      
      // Pricing Engine supports Financial Planning
      (pricing_engine)-[:SUPPORTS]->(financial_planning),
      
      // Sustainability Analyzer supports Research & Development
      (sustainability_analyzer)-[:SUPPORTS]->(research_development)
  `)

  // ===== AI COMPONENTS USED BY APPLICATIONS =====
  await session.run(`
    MATCH 
      // AI Components
      (quality_prediction:AIComponent {id: "ai-quality-prediction"}),
      (defect_detection:AIComponent {id: "ai-defect-detection"}),
      (maintenance_predictor:AIComponent {id: "ai-maintenance-predictor"}),
      (demand_forecaster:AIComponent {id: "ai-demand-forecaster"}),
      (customer_chatbot:AIComponent {id: "ai-customer-chatbot"}),
      (supply_optimizer:AIComponent {id: "ai-supply-optimizer"}),
      (energy_forecaster:AIComponent {id: "ai-energy-forecaster"}),
      (product_recommender:AIComponent {id: "ai-product-recommender"}),
      (pricing_engine:AIComponent {id: "ai-pricing-engine"}),
      (sustainability_analyzer:AIComponent {id: "ai-sustainability-analyzer"}),
      
      // Applications (corrected IDs)
      (mes_solar:Application {id: "app-mes-solar"}),
      (quality_solar:Application {id: "app-quality-solar"}),
      (servicenow:Application {id: "app-servicenow"}),
      (sap_s4hana:Application {id: "app-sap-s4hana"}),
      (salesforce_crm:Application {id: "app-salesforce-crm"}),
      (oracle_scm:Application {id: "app-oracle-scm"}),
      (power_bi:Application {id: "app-power-bi"}),
      (hubspot_marketing:Application {id: "app-hubspot-marketing"}),
      (zendesk_service:Application {id: "app-zendesk-service"}),
      (rd_platform:Application {id: "app-rd-platform"})
      
    CREATE 
      // Quality Prediction used by MES and Quality Systems
      (mes_solar)-[:USED_BY]->(quality_prediction),
      (quality_solar)-[:USED_BY]->(quality_prediction),
      
      // Defect Detection used by Quality System
      (quality_solar)-[:USED_BY]->(defect_detection),
      
      // Maintenance Predictor used by ServiceNow
      (servicenow)-[:USED_BY]->(maintenance_predictor),
      
      // Demand Forecaster used by SAP S/4HANA and Salesforce
      (sap_s4hana)-[:USED_BY]->(demand_forecaster),
      (salesforce_crm)-[:USED_BY]->(demand_forecaster),
      
      // Customer Chatbot used by Zendesk Support
      (zendesk_service)-[:USED_BY]->(customer_chatbot),
      
      // Supply Optimizer used by Oracle SCM
      (oracle_scm)-[:USED_BY]->(supply_optimizer),
      
      // Energy Forecaster used by Power BI and R&D Platform
      (power_bi)-[:USED_BY]->(energy_forecaster),
      (rd_platform)-[:USED_BY]->(energy_forecaster),
      
      // Product Recommender used by HubSpot Marketing and Salesforce
      (hubspot_marketing)-[:USED_BY]->(product_recommender),
      (salesforce_crm)-[:USED_BY]->(product_recommender),
      
      // Pricing Engine used by SAP S/4HANA
      (sap_s4hana)-[:USED_BY]->(pricing_engine),
      
      // Sustainability Analyzer used by R&D Platform and Power BI
      (rd_platform)-[:USED_BY]->(sustainability_analyzer),
      (power_bi)-[:USED_BY]->(sustainability_analyzer)
  `)

  // ===== AI COMPONENTS TRAINED WITH DATA OBJECTS =====
  await session.run(`
    MATCH 
      // AI Components
      (quality_prediction:AIComponent {id: "ai-quality-prediction"}),
      (defect_detection:AIComponent {id: "ai-defect-detection"}),
      (maintenance_predictor:AIComponent {id: "ai-maintenance-predictor"}),
      (demand_forecaster:AIComponent {id: "ai-demand-forecaster"}),
      (customer_chatbot:AIComponent {id: "ai-customer-chatbot"}),
      (supply_optimizer:AIComponent {id: "ai-supply-optimizer"}),
      (energy_forecaster:AIComponent {id: "ai-energy-forecaster"}),
      (product_recommender:AIComponent {id: "ai-product-recommender"}),
      (pricing_engine:AIComponent {id: "ai-pricing-engine"}),
      (sustainability_analyzer:AIComponent {id: "ai-sustainability-analyzer"}),
      
      // Data Objects (corrected IDs)
      (quality_tests:DataObject {id: "data-quality-tests"}),
      (production_metrics:DataObject {id: "data-production-metrics"}),
      (equipment_status:DataObject {id: "data-equipment-status"}),
      (sales_orders:DataObject {id: "data-sales-orders"}),
      (customer_master:DataObject {id: "data-customer-master"}),
      (supplier_master:DataObject {id: "data-supplier-master"}),
      (material_specs:DataObject {id: "data-material-specs"}),
      (leads_prospects:DataObject {id: "data-leads-prospects"}),
      (defect_tracking:DataObject {id: "data-defect-tracking"}),
      (research_experimental:DataObject {id: "data-research-experimental"})
      
    CREATE 
      // Quality Prediction trained with Quality and Production Data
      (quality_prediction)-[:TRAINED_WITH]->(quality_tests),
      (quality_prediction)-[:TRAINED_WITH]->(production_metrics),
      
      // Defect Detection trained with Quality and Defect Data
      (defect_detection)-[:TRAINED_WITH]->(quality_tests),
      (defect_detection)-[:TRAINED_WITH]->(defect_tracking),
      
      // Maintenance Predictor trained with Equipment Data
      (maintenance_predictor)-[:TRAINED_WITH]->(equipment_status),
      
      // Demand Forecaster trained with Sales and Leads Data
      (demand_forecaster)-[:TRAINED_WITH]->(sales_orders),
      (demand_forecaster)-[:TRAINED_WITH]->(leads_prospects),
      
      // Customer Chatbot trained with Customer Data
      (customer_chatbot)-[:TRAINED_WITH]->(customer_master),
      
      // Supply Optimizer trained with Supplier and Material Data
      (supply_optimizer)-[:TRAINED_WITH]->(supplier_master),
      (supply_optimizer)-[:TRAINED_WITH]->(material_specs),
      
      // Energy Forecaster trained with Research and Production Data
      (energy_forecaster)-[:TRAINED_WITH]->(research_experimental),
      (energy_forecaster)-[:TRAINED_WITH]->(production_metrics),
      
      // Product Recommender trained with Customer and Sales Data
      (product_recommender)-[:TRAINED_WITH]->(customer_master),
      (product_recommender)-[:TRAINED_WITH]->(sales_orders),
      
      // Pricing Engine trained with Sales Data
      (pricing_engine)-[:TRAINED_WITH]->(sales_orders),
      
      // Sustainability Analyzer trained with Research Data
      (sustainability_analyzer)-[:TRAINED_WITH]->(research_experimental)
  `)

  // ===== AI COMPONENTS HOSTED ON INFRASTRUCTURE =====
  await session.run(`
    MATCH 
      // AI Components
      (quality_prediction:AIComponent {id: "ai-quality-prediction"}),
      (defect_detection:AIComponent {id: "ai-defect-detection"}),
      (maintenance_predictor:AIComponent {id: "ai-maintenance-predictor"}),
      (demand_forecaster:AIComponent {id: "ai-demand-forecaster"}),
      (customer_chatbot:AIComponent {id: "ai-customer-chatbot"}),
      (supply_optimizer:AIComponent {id: "ai-supply-optimizer"}),
      (energy_forecaster:AIComponent {id: "ai-energy-forecaster"}),
      (product_recommender:AIComponent {id: "ai-product-recommender"}),
      (pricing_engine:AIComponent {id: "ai-pricing-engine"}),
      (sustainability_analyzer:AIComponent {id: "ai-sustainability-analyzer"}),
      
      // Infrastructure (corrected IDs)
      (eks_production:Infrastructure {id: "infra-eks-production"}),
      (eks_europe:Infrastructure {id: "infra-eks-europe"}),
      (ecs_cluster:Infrastructure {id: "infra-ecs-cluster"}),
      (onprem_datacenter:Infrastructure {id: "infra-onprem-datacenter"})
      
    CREATE 
      // High-performance AI models hosted on Production EKS
      (quality_prediction)-[:HOSTED_ON]->(eks_production),
      (defect_detection)-[:HOSTED_ON]->(eks_production),
      (energy_forecaster)-[:HOSTED_ON]->(eks_production),
      
      // Real-time AI services hosted on Europe EKS
      (customer_chatbot)-[:HOSTED_ON]->(eks_europe),
      (product_recommender)-[:HOSTED_ON]->(eks_europe),
      (pricing_engine)-[:HOSTED_ON]->(eks_europe),
      
      // Analytics AI components hosted on ECS Cluster
      (demand_forecaster)-[:HOSTED_ON]->(ecs_cluster),
      (supply_optimizer)-[:HOSTED_ON]->(ecs_cluster),
      (sustainability_analyzer)-[:HOSTED_ON]->(ecs_cluster),
      
      // Edge AI for manufacturing hosted on On-Premise Datacenter
      (maintenance_predictor)-[:HOSTED_ON]->(onprem_datacenter)
  `)

  // ===== AI COMPONENTS IMPLEMENTING ARCHITECTURE PRINCIPLES =====
  await session.run(`
    MATCH 
      // AI Components
      (quality_prediction:AIComponent {id: "ai-quality-prediction"}),
      (defect_detection:AIComponent {id: "ai-defect-detection"}),
      (maintenance_predictor:AIComponent {id: "ai-maintenance-predictor"}),
      (demand_forecaster:AIComponent {id: "ai-demand-forecaster"}),
      (customer_chatbot:AIComponent {id: "ai-customer-chatbot"}),
      (supply_optimizer:AIComponent {id: "ai-supply-optimizer"}),
      (energy_forecaster:AIComponent {id: "ai-energy-forecaster"}),
      (product_recommender:AIComponent {id: "ai-product-recommender"}),
      (pricing_engine:AIComponent {id: "ai-pricing-engine"}),
      (sustainability_analyzer:AIComponent {id: "ai-sustainability-analyzer"}),
      
      // Architecture Principles (corrected IDs)
      (cloud_first:ArchitecturePrinciple {id: "principle-cloud-first"}),
      (data_asset:ArchitecturePrinciple {id: "principle-data-asset"}),
      (data_protection:ArchitecturePrinciple {id: "principle-data-protection"}),
      (automation_first:ArchitecturePrinciple {id: "principle-automation-first"}),
      (api_first:ArchitecturePrinciple {id: "principle-api-first"}),
      (customer_centricity:ArchitecturePrinciple {id: "principle-customer-centricity"})
      
    CREATE 
      // All AI Components implement Data as Strategic Asset
      (quality_prediction)-[:IMPLEMENTS_PRINCIPLE]->(data_asset),
      (defect_detection)-[:IMPLEMENTS_PRINCIPLE]->(data_asset),
      (maintenance_predictor)-[:IMPLEMENTS_PRINCIPLE]->(data_asset),
      (demand_forecaster)-[:IMPLEMENTS_PRINCIPLE]->(data_asset),
      (customer_chatbot)-[:IMPLEMENTS_PRINCIPLE]->(data_asset),
      (supply_optimizer)-[:IMPLEMENTS_PRINCIPLE]->(data_asset),
      (energy_forecaster)-[:IMPLEMENTS_PRINCIPLE]->(data_asset),
      (product_recommender)-[:IMPLEMENTS_PRINCIPLE]->(data_asset),
      (pricing_engine)-[:IMPLEMENTS_PRINCIPLE]->(data_asset),
      (sustainability_analyzer)-[:IMPLEMENTS_PRINCIPLE]->(data_asset),
      
      // Cloud-based AI Components implement Cloud-First
      (customer_chatbot)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first),
      (product_recommender)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first),
      (pricing_engine)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first),
      (demand_forecaster)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first),
      (supply_optimizer)-[:IMPLEMENTS_PRINCIPLE]->(cloud_first),
      
      // All AI Components implement Data Protection by Design
      (quality_prediction)-[:IMPLEMENTS_PRINCIPLE]->(data_protection),
      (defect_detection)-[:IMPLEMENTS_PRINCIPLE]->(data_protection),
      (maintenance_predictor)-[:IMPLEMENTS_PRINCIPLE]->(data_protection),
      (demand_forecaster)-[:IMPLEMENTS_PRINCIPLE]->(data_protection),
      (customer_chatbot)-[:IMPLEMENTS_PRINCIPLE]->(data_protection),
      (supply_optimizer)-[:IMPLEMENTS_PRINCIPLE]->(data_protection),
      (energy_forecaster)-[:IMPLEMENTS_PRINCIPLE]->(data_protection),
      (product_recommender)-[:IMPLEMENTS_PRINCIPLE]->(data_protection),
      (pricing_engine)-[:IMPLEMENTS_PRINCIPLE]->(data_protection),
      (sustainability_analyzer)-[:IMPLEMENTS_PRINCIPLE]->(data_protection),
      
      // API-based AI Components implement API-First Design
      (customer_chatbot)-[:IMPLEMENTS_PRINCIPLE]->(api_first),
      (product_recommender)-[:IMPLEMENTS_PRINCIPLE]->(api_first),
      (demand_forecaster)-[:IMPLEMENTS_PRINCIPLE]->(api_first),
      (supply_optimizer)-[:IMPLEMENTS_PRINCIPLE]->(api_first),
      
      // Automation-focused AI Components implement Automation-First
      (quality_prediction)-[:IMPLEMENTS_PRINCIPLE]->(automation_first),
      (defect_detection)-[:IMPLEMENTS_PRINCIPLE]->(automation_first),
      (maintenance_predictor)-[:IMPLEMENTS_PRINCIPLE]->(automation_first),
      (pricing_engine)-[:IMPLEMENTS_PRINCIPLE]->(automation_first),
      
      // Customer-centric AI Components implement Customer-Centric Design
      (customer_chatbot)-[:IMPLEMENTS_PRINCIPLE]->(customer_centricity),
      (product_recommender)-[:IMPLEMENTS_PRINCIPLE]->(customer_centricity),
      (sustainability_analyzer)-[:IMPLEMENTS_PRINCIPLE]->(customer_centricity)
  `)

  console.log('✅ AI Component relationships created successfully')
}
