// Architectures for Solar Panel Manufacturing Company
// Current state, future state, and transition architectures

import { Session } from 'neo4j-driver'

export async function createArchitectures(session: Session) {
  console.log('Creating Architectures for Solar Panel Manufacturing...')

  await session.run(`
    CREATE 
    // ===== CURRENT STATE ARCHITECTURE =====
    (current_architecture:Architecture {
      id: "arch-current-state-2024",
      name: "Current State Architecture 2024",
      description: "Current enterprise architecture with mix of legacy and modern systems, partial cloud adoption, and heterogeneous integration landscape",
      architectureType: "CURRENT_STATE",
      version: "3.2",
      status: "APPROVED",
      validFromDate: date("2024-01-01"),
      validToDate: date("2025-12-31"),
      maintenanceCategory: "ACTIVE_SUPPORT",
      lastAssessmentDate: date("2024-06-01"),
      architecturalStyle: "SERVICE_ORIENTED",
      integrationPattern: "POINT_TO_POINT",
      deploymentModel: "HYBRID_CLOUD",
      comments: "Legacy systems integrated through various patterns. Manual processes in quality management. File-based interfaces dominate. Limited real-time capabilities.",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== TARGET ARCHITECTURE =====
    (target_architecture:Architecture {
      id: "arch-target-state-2027",
      name: "Future State Architecture 2027",
      description: "Target enterprise architecture with cloud-native applications, API-first integration, real-time analytics, and digital manufacturing capabilities",
      architectureType: "TARGET_STATE",
      version: "1.0",
      status: "APPROVED",
      validFromDate: date("2025-01-01"),
      validToDate: date("2030-12-31"),
      maintenanceCategory: "FUTURE_RELEASE",
      architecturalStyle: "MICROSERVICES",
      integrationPattern: "API_FIRST",
      deploymentModel: "CLOUD_NATIVE",
      comments: "Full cloud-native transformation with AI-driven quality control, automated supply chain optimization, and Industry 4.0 manufacturing capabilities.",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== TRANSITION ARCHITECTURE PHASE 1 =====
    (transition_phase1:Architecture {
      id: "arch-transition-phase1-2025",
      name: "Transition Architecture Phase 1 - Integration Modernization",
      description: "First phase focusing on API gateway implementation, cloud migration of non-critical systems, and real-time manufacturing integration",
      architectureType: "TRANSITION_STATE",
      version: "1.0",
      status: "APPROVED",
      validFromDate: date("2025-01-01"),
      validToDate: date("2025-12-31"),
      maintenanceCategory: "PLANNED",
      architecturalStyle: "HYBRID",
      integrationPattern: "API_GATEWAY",
      deploymentModel: "HYBRID_CLOUD",
      comments: "Replace file-based interfaces with API connections. Implement MES real-time integration. Migrate analytics to cloud.",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== TRANSITION ARCHITECTURE PHASE 2 =====
    (transition_phase2:Architecture {
      id: "arch-transition-phase2-2026",
      name: "Transition Architecture Phase 2 - Smart Manufacturing",
      description: "Second phase implementing IoT integration, AI-driven quality control, and advanced analytics capabilities",
      architectureType: "TRANSITION_STATE",
      version: "1.0", 
      status: "DRAFT",
      validFromDate: date("2026-01-01"),
      validToDate: date("2026-12-31"),
      maintenanceCategory: "PLANNED",
      architecturalStyle: "EVENT_DRIVEN",
      integrationPattern: "EVENT_STREAMING",
      deploymentModel: "CLOUD_FIRST",
      comments: "Implement IoT sensors throughout manufacturing. Deploy AI quality prediction. Enable predictive maintenance.",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== BUSINESS ARCHITECTURE =====
    (business_architecture:Architecture {
      id: "arch-business-2024",
      name: "Solar Manufacturing Business Architecture",
      description: "Business capability model and operating model for solar panel manufacturing with focus on R&D innovation and quality excellence",
      architectureType: "BUSINESS_ARCHITECTURE",
      version: "2.1",
      status: "APPROVED",
      validFromDate: date("2024-01-01"),
      validToDate: date("2026-12-31"),
      maintenanceCategory: "ACTIVE_SUPPORT",
      lastAssessmentDate: date("2024-03-01"),
      deploymentModel: "GLOBAL",
      comments: "Decentralized R&D with centralized quality standards. Customer-centric sales approach. Sustainable supply chain focus.",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== DATA ARCHITECTURE =====
    (data_architecture:Architecture {
      id: "arch-data-2024",
      name: "Enterprise Data Architecture",
      description: "Data architecture supporting analytics, compliance, and operational reporting across manufacturing and business processes",
      architectureType: "DATA_ARCHITECTURE",
      version: "1.8",
      status: "APPROVED",
      validFromDate: date("2024-01-01"),
      validToDate: date("2025-12-31"),
      maintenanceCategory: "ACTIVE_SUPPORT",
      lastAssessmentDate: date("2024-05-01"),
      architecturalStyle: "DATA_LAKE",
      integrationPattern: "ETL",
      deploymentModel: "HYBRID_CLOUD",
      comments: "Central data lake for analytics. Master data managed in SAP. Quality data in specialized systems. Real-time streaming planned.",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== APPLICATION ARCHITECTURE =====
    (application_architecture:Architecture {
      id: "arch-application-2024",
      name: "Application Portfolio Architecture",
      description: "Application landscape with core ERP, specialized manufacturing systems, and cloud-based customer engagement platforms",
      architectureType: "APPLICATION_ARCHITECTURE",
      version: "3.0",
      status: "APPROVED",
      validFromDate: date("2024-01-01"),
      validToDate: date("2025-06-30"),
      maintenanceCategory: "ACTIVE_SUPPORT",
      lastAssessmentDate: date("2024-07-01"),
      architecturalStyle: "LAYERED",
      integrationPattern: "ESB",
      deploymentModel: "HYBRID_CLOUD",
      comments: "SAP as core system. Custom MES for manufacturing. SaaS solutions for CRM and HR. Legacy systems being phased out.",
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== TECHNOLOGY ARCHITECTURE =====
    (technology_architecture:Architecture {
      id: "arch-technology-2024",
      name: "Technology Infrastructure Architecture",
      description: "Infrastructure architecture with AWS cloud services, on-premise manufacturing systems, and hybrid connectivity",
      architectureType: "TECHNOLOGY_ARCHITECTURE",
      version: "2.5",
      status: "APPROVED",
      validFromDate: date("2024-01-01"),
      validToDate: date("2025-12-31"),
      maintenanceCategory: "ACTIVE_SUPPORT",
      lastAssessmentDate: date("2024-08-01"),
      architecturalStyle: "CLOUD_NATIVE",
      integrationPattern: "VPN_GATEWAY",
      deploymentModel: "HYBRID_CLOUD",
      comments: "AWS as primary cloud provider. On-premise datacenter for manufacturing. Kubernetes for container orchestration.",
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('Architectures created successfully.')
}

export async function createArchitectureRelationships(session: Session) {
  console.log('Creating Architecture relationships...')

  // Architecture succession relationships
  await session.run(`
    MATCH (current:Architecture {id: "arch-current-state-2024"})
    MATCH (transition1:Architecture {id: "arch-transition-phase1-2025"})
    MATCH (transition2:Architecture {id: "arch-transition-phase2-2026"})
    MATCH (target:Architecture {id: "arch-target-state-2027"})
    CREATE (current)-[:SUCCESSOR_OF {transitionReason: "Digital transformation initiative", migrationComplexity: "HIGH", riskLevel: "MEDIUM"}]->(transition1)
    CREATE (transition1)-[:SUCCESSOR_OF {transitionReason: "Smart manufacturing implementation", migrationComplexity: "HIGH", riskLevel: "HIGH"}]->(transition2)
    CREATE (transition2)-[:SUCCESSOR_OF {transitionReason: "Cloud-native completion", migrationComplexity: "MEDIUM", riskLevel: "LOW"}]->(target)
  `)

  // Architecture to Application relationships
  await session.run(`
    MATCH (current_arch:Architecture {id: "arch-current-state-2024"})
    MATCH (target_arch:Architecture {id: "arch-target-state-2027"})
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
    
    CREATE (business_arch)-[:ENABLES]->(rd)
    CREATE (business_arch)-[:ENABLES]->(manufacturing)
    CREATE (business_arch)-[:ENABLES]->(sales)
    CREATE (business_arch)-[:ENABLES]->(quality)
    CREATE (business_arch)-[:ENABLES]->(supply_chain)
    
    CREATE (current_arch)-[:ENABLES]->(rd)
    CREATE (current_arch)-[:ENABLES]->(manufacturing)
    CREATE (current_arch)-[:ENABLES]->(sales)
    CREATE (current_arch)-[:ENABLES]->(quality)
    CREATE (current_arch)-[:ENABLES]->(supply_chain)
  `)

  // Architecture follows Architecture Principles
  await session.run(`
    MATCH (current_arch:Architecture {id: "arch-current-state-2024"})
    MATCH (target_arch:Architecture {id: "arch-target-state-2027"})
    
    MATCH (cloud_first:ArchitecturePrinciple {id: "principle-cloud-first"})
    MATCH (api_first:ArchitecturePrinciple {id: "principle-api-first"})
    MATCH (security_design:ArchitecturePrinciple {id: "principle-security-by-design"})
    MATCH (data_governance:ArchitecturePrinciple {id: "principle-data-governance"})
    MATCH (customer_centric:ArchitecturePrinciple {id: "principle-customer-centric"})
    
    CREATE (current_arch)-[:FOLLOWS]->(security_design)
    CREATE (current_arch)-[:FOLLOWS]->(data_governance)
    CREATE (current_arch)-[:FOLLOWS]->(customer_centric)
    
    CREATE (target_arch)-[:FOLLOWS]->(cloud_first)
    CREATE (target_arch)-[:FOLLOWS]->(api_first)
    CREATE (target_arch)-[:FOLLOWS]->(security_design)
    CREATE (target_arch)-[:FOLLOWS]->(data_governance)
    CREATE (target_arch)-[:FOLLOWS]->(customer_centric)
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
    
    CREATE (enterprise_architect)-[:RESPONSIBLE_FOR]->(current_arch)
    CREATE (enterprise_architect)-[:RESPONSIBLE_FOR]->(target_arch)
    CREATE (enterprise_architect)-[:RESPONSIBLE_FOR]->(transition1)
    CREATE (enterprise_architect)-[:RESPONSIBLE_FOR]->(transition2)
    CREATE (enterprise_architect)-[:RESPONSIBLE_FOR]->(business_arch)
    CREATE (enterprise_architect)-[:RESPONSIBLE_FOR]->(data_arch)
    CREATE (enterprise_architect)-[:RESPONSIBLE_FOR]->(app_arch)
    CREATE (enterprise_architect)-[:RESPONSIBLE_FOR]->(tech_arch)
  `)

  // CTO also responsible for technology architecture
  await session.run(`
    MATCH (cto:Person {id: "person-cto"})
    MATCH (tech_arch:Architecture {id: "arch-technology-2024"})
    MATCH (target_arch:Architecture {id: "arch-target-state-2027"})
    CREATE (cto)-[:RESPONSIBLE_FOR]->(tech_arch)
    CREATE (cto)-[:RESPONSIBLE_FOR]->(target_arch)
  `)

  // VP Engineering responsible for application architecture
  await session.run(`
    MATCH (vp_engineering:Person {id: "person-vp-engineering"})
    MATCH (app_arch:Architecture {id: "arch-application-2024"})
    MATCH (transition1:Architecture {id: "arch-transition-phase1-2025"})
    CREATE (vp_engineering)-[:RESPONSIBLE_FOR]->(app_arch)
    CREATE (vp_engineering)-[:RESPONSIBLE_FOR]->(transition1)
  `)

  console.log('Architecture ownership relationships created successfully.')
}
