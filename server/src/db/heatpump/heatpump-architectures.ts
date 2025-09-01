// Architecture Landscapes for Heat Pump Manufacturing Company
// Complete enterprise architecture views for HVAC manufacturing

import { Session } from 'neo4j-driver'

export async function createHeatPumpArchitectures(session: Session): Promise<void> {
  console.log('Creating Architectures for Heat Pump Manufacturing...')

  const query = `
    CREATE 
    // Business Architecture Layer
    (businessArchitecture:Architecture {
      id: "hp-arch-business",
      name: "Business Architecture",
      description: "Strategic business model and capabilities for heat pump manufacturing and service delivery",
      timestamp: datetime(),
      domain: "BUSINESS",
      type: "CONCEPTUAL",
      tags: ["business", "strategy", "capabilities"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Data Architecture Layer
    (dataArchitecture:Architecture {
      id: "hp-arch-data",
      name: "Data Architecture",
      description: "Comprehensive data strategy covering product data, IoT telemetry, and customer analytics",
      timestamp: datetime(),
      domain: "DATA",
      type: "CONCEPTUAL",
      tags: ["data", "analytics", "iot"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Application Architecture Layer
    (applicationArchitecture:Architecture {
      id: "hp-arch-application",
      name: "Application Architecture",
      description: "Integrated application landscape supporting manufacturing, IoT platform, and customer services",
      timestamp: datetime(),
      domain: "APPLICATION",
      type: "CONCEPTUAL",
      tags: ["applications", "integration", "microservices"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Technology Architecture Layer
    (technologyArchitecture:Architecture {
      id: "hp-arch-technology",
      name: "Technology Architecture",
      description: "Technology infrastructure including cloud platforms, IoT networks, and manufacturing systems",
      timestamp: datetime(),
      domain: "TECHNOLOGY",
      type: "CONCEPTUAL",
      tags: ["technology", "infrastructure", "cloud"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Current State Architecture
    (currentStateArchitecture:Architecture {
      id: "hp-arch-current-state",
      name: "Current State Architecture 2024",
      description: "Present enterprise architecture with hybrid cloud, legacy ERP, and emerging IoT capabilities",
      timestamp: datetime(),
      domain: "ENTERPRISE",
      type: "CURRENT_STATE",
      tags: ["current", "enterprise", "hybrid"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Target State Architecture
    (targetStateArchitecture:Architecture {
      id: "hp-arch-target-state",
      name: "Target State Architecture 2027",
      description: "Future enterprise architecture with cloud-native applications, AI-driven operations, and full IoT integration",
      timestamp: datetime(),
      domain: "ENTERPRISE",
      type: "FUTURE_STATE",
      tags: ["target", "enterprise", "cloud-native", "ai"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // IoT Platform Architecture
    (iotPlatformArchitecture:Architecture {
      id: "hp-arch-iot-platform",
      name: "IoT Platform Architecture",
      description: "Comprehensive IoT architecture for heat pump connectivity, edge computing, and analytics",
      timestamp: datetime(),
      domain: "TECHNOLOGY",
      type: "CURRENT_STATE",
      tags: ["iot", "edge", "connectivity", "analytics"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Manufacturing Integration Architecture
    (manufacturingArchitecture:Architecture {
      id: "hp-arch-manufacturing",
      name: "Smart Manufacturing Architecture",
      description: "Industry 4.0 architecture for automated production, quality control, and supply chain integration",
      timestamp: datetime(),
      domain: "APPLICATION",
      type: "CURRENT_STATE",
      tags: ["manufacturing", "industry40", "automation"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Customer Experience Architecture
    (customerArchitecture:Architecture {
      id: "hp-arch-customer-experience",
      name: "Digital Customer Experience Architecture",
      description: "Omnichannel customer experience platform with self-service, mobile apps, and AI support",
      timestamp: datetime(),
      domain: "APPLICATION",
      type: "CURRENT_STATE",
      tags: ["customer", "digital", "omnichannel"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Security Architecture
    (securityArchitecture:Architecture {
      id: "hp-arch-security",
      name: "Enterprise Security Architecture",
      description: "Zero-trust security model with identity management, threat protection, and compliance frameworks",
      timestamp: datetime(),
      domain: "TECHNOLOGY",
      type: "CONCEPTUAL",
      tags: ["security", "zero-trust", "compliance"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  await session.run(query)
  console.log('✅ Architectures created successfully!')
}

export async function createHeatPumpArchitectureOwnership(session: Session): Promise<void> {
  console.log('Creating Architecture ownership relationships...')

  const query = `
    // Connect Architectures to Owners and Company
    MATCH (company:Company {id: "thermo-dynamics-ag"})
    MATCH (enterpriseArchitect:Person {id: "hp-person-enterprise-architect"})
    MATCH (cto:Person {id: "hp-person-cto"})
    MATCH (iotArchitect:Person {id: "hp-person-iot-architect"})
    MATCH (dataArchitect:Person {id: "hp-person-data-architect"})
    MATCH (securityManager:Person {id: "hp-person-security-manager"})

    // Domain Architectures - Enterprise Architect ownership
    MATCH (businessArchitecture:Architecture {id: "hp-arch-business"})
    MATCH (applicationArchitecture:Architecture {id: "hp-arch-application"})
    MATCH (currentStateArchitecture:Architecture {id: "hp-arch-current-state"})
    MATCH (targetStateArchitecture:Architecture {id: "hp-arch-target-state"})
    MATCH (manufacturingArchitecture:Architecture {id: "hp-arch-manufacturing"})
    MATCH (customerArchitecture:Architecture {id: "hp-arch-customer-experience"})
    
    CREATE (businessArchitecture)-[:OWNED_BY]->(enterpriseArchitect),
           (businessArchitecture)-[:OWNED_BY]->(company),
           (applicationArchitecture)-[:OWNED_BY]->(enterpriseArchitect),
           (applicationArchitecture)-[:OWNED_BY]->(company),
           (currentStateArchitecture)-[:OWNED_BY]->(enterpriseArchitect),
           (currentStateArchitecture)-[:OWNED_BY]->(company),
           (targetStateArchitecture)-[:OWNED_BY]->(enterpriseArchitect),
           (targetStateArchitecture)-[:OWNED_BY]->(company),
           (manufacturingArchitecture)-[:OWNED_BY]->(enterpriseArchitect),
           (manufacturingArchitecture)-[:OWNED_BY]->(company),
           (customerArchitecture)-[:OWNED_BY]->(enterpriseArchitect),
           (customerArchitecture)-[:OWNED_BY]->(company)

    // Data Architecture - Data Architect ownership
    WITH company, enterpriseArchitect, cto, iotArchitect, dataArchitect, securityManager
    MATCH (dataArchitecture:Architecture {id: "hp-arch-data"})
    
    CREATE (dataArchitecture)-[:OWNED_BY]->(dataArchitect),
           (dataArchitecture)-[:OWNED_BY]->(company)

    // Technology Architecture - CTO ownership
    WITH company, enterpriseArchitect, cto, iotArchitect, dataArchitect, securityManager
    MATCH (technologyArchitecture:Architecture {id: "hp-arch-technology"})
    
    CREATE (technologyArchitecture)-[:OWNED_BY]->(cto),
           (technologyArchitecture)-[:OWNED_BY]->(company)

    // IoT Platform Architecture - IoT Architect ownership
    WITH company, enterpriseArchitect, cto, iotArchitect, dataArchitect, securityManager
    MATCH (iotPlatformArchitecture:Architecture {id: "hp-arch-iot-platform"})
    
    CREATE (iotPlatformArchitecture)-[:OWNED_BY]->(iotArchitect),
           (iotPlatformArchitecture)-[:OWNED_BY]->(company)

    // Security Architecture - Security Manager ownership
    WITH company, enterpriseArchitect, cto, iotArchitect, dataArchitect, securityManager
    MATCH (securityArchitecture:Architecture {id: "hp-arch-security"})
    
    CREATE (securityArchitecture)-[:OWNED_BY]->(securityManager),
           (securityArchitecture)-[:OWNED_BY]->(company)
  `

  await session.run(query)
  console.log('✅ Architecture ownership relationships created successfully!')
}
