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
      timestamp: datetime(),
      domain: "ENTERPRISE",
      type: "CURRENT_STATE",
      tags: ["enterprise", "current", "hybrid-cloud", "legacy"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== TARGET ARCHITECTURE =====
    (target_architecture:Architecture {
      id: "arch-target-state-2027",
      name: "Future State Architecture 2027",
      description: "Target enterprise architecture with cloud-native applications, API-first integration, real-time analytics, and digital manufacturing capabilities",
      timestamp: datetime(),
      domain: "ENTERPRISE",
      type: "FUTURE_STATE",
      tags: ["enterprise", "future", "cloud-native", "api-first"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== TRANSITION ARCHITECTURE PHASE 1 =====
    (transition_phase1:Architecture {
      id: "arch-transition-phase1-2025",
      name: "Transition Architecture Phase 1 - Integration Modernization",
      description: "First phase focusing on API gateway implementation, cloud migration of non-critical systems, and real-time manufacturing integration",
      timestamp: datetime(),
      domain: "INTEGRATION",
      type: "TRANSITION",
      tags: ["transition", "integration", "api-gateway", "phase1"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== TRANSITION ARCHITECTURE PHASE 2 =====
    (transition_phase2:Architecture {
      id: "arch-transition-phase2-2026",
      name: "Transition Architecture Phase 2 - Smart Manufacturing",
      description: "Second phase implementing IoT integration, AI-driven quality control, and advanced analytics capabilities",
      timestamp: datetime(),
      domain: "TECHNOLOGY",
      type: "TRANSITION",
      tags: ["transition", "iot", "ai", "smart-manufacturing", "phase2"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== BUSINESS ARCHITECTURE =====
    (business_architecture:Architecture {
      id: "arch-business-2024",
      name: "Solar Manufacturing Business Architecture",
      description: "Business capability model and operating model for solar panel manufacturing with focus on R&D innovation and quality excellence",
      timestamp: datetime(),
      domain: "BUSINESS",
      type: "CURRENT_STATE",
      tags: ["business", "capabilities", "solar", "manufacturing"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== DATA ARCHITECTURE =====
    (data_architecture:Architecture {
      id: "arch-data-2024",
      name: "Enterprise Data Architecture",
      description: "Data architecture supporting analytics, compliance, and operational reporting across manufacturing and business processes",
      timestamp: datetime(),
      domain: "DATA",
      type: "CURRENT_STATE",
      tags: ["data", "analytics", "compliance", "reporting"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== APPLICATION ARCHITECTURE =====
    (application_architecture:Architecture {
      id: "arch-application-2024",
      name: "Application Portfolio Architecture",
      description: "Application landscape with core ERP, specialized manufacturing systems, and cloud-based customer engagement platforms",
      timestamp: datetime(),
      domain: "APPLICATION",
      type: "CURRENT_STATE",
      tags: ["application", "portfolio", "erp", "manufacturing"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== TECHNOLOGY ARCHITECTURE =====
    (technology_architecture:Architecture {
      id: "arch-technology-2024",
      name: "Technology Infrastructure Architecture",
      description: "Infrastructure architecture with AWS cloud services, on-premise manufacturing systems, and hybrid connectivity",
      timestamp: datetime(),
      domain: "TECHNOLOGY",
      type: "CURRENT_STATE",
      tags: ["technology", "infrastructure", "aws", "hybrid"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('Architectures created successfully.')
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

  // Architecture follows Architecture Principles
  await session.run(`
    MATCH (current_arch:Architecture {id: "arch-current-state-2024"})
    MATCH (target_arch:Architecture {id: "arch-target-state-2027"})
    
    MATCH (cloud_first:ArchitecturePrinciple {id: "principle-cloud-first"})
    MATCH (api_first:ArchitecturePrinciple {id: "principle-api-first"})
    MATCH (security_design:ArchitecturePrinciple {id: "principle-security-by-design"})
    MATCH (data_governance:ArchitecturePrinciple {id: "principle-data-governance"})
    MATCH (customer_centric:ArchitecturePrinciple {id: "principle-customer-centric"})
    
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(security_design)
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(data_governance)
    CREATE (current_arch)-[:APPLIES_PRINCIPLE]->(customer_centric)
    
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(cloud_first)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(api_first)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(security_design)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(data_governance)
    CREATE (target_arch)-[:APPLIES_PRINCIPLE]->(customer_centric)
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
