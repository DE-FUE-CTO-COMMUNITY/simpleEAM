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
