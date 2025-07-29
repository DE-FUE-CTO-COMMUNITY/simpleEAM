// Architecture Principles for Solar Panel Manufacturing Company
// Extended set of principles for comprehensive enterprise architecture

import { Session } from 'neo4j-driver'

export async function createArchitecturePrinciples(session: Session) {
  console.log('Creating Architecture Principles for Solar Panel Manufacturing...')

  await session.run(`
    CREATE 
    // ===== BUSINESS PRINCIPLES =====
    (business_agility:ArchitecturePrinciple {
      id: "principle-business-agility",
      name: "Business Agility First",
      description: "Architecture must enable rapid business adaptation to market changes and customer demands",
      category: "BUSINESS",
      priority: "CRITICAL",
      rationale: "Solar industry is rapidly evolving with changing technologies and regulations",
      implications: "Choose flexible platforms, avoid vendor lock-in, design for configurability",
      tags: ["agility", "flexibility", "adaptation"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (customer_centricity:ArchitecturePrinciple {
      id: "principle-customer-centricity",
      name: "Customer-Centric Design",
      description: "All systems and processes must prioritize customer experience and satisfaction",
      category: "BUSINESS",
      priority: "HIGH",
      rationale: "Customer satisfaction drives retention and growth in competitive solar market",
      implications: "Design user-friendly interfaces, provide real-time information, enable self-service",
      tags: ["customer", "experience", "satisfaction"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (sustainability_focus:ArchitecturePrinciple {
      id: "principle-sustainability",
      name: "Sustainability by Design",
      description: "Technology choices must minimize environmental impact and support sustainability goals",
      category: "BUSINESS",
      priority: "HIGH",
      rationale: "As a solar company, environmental responsibility is core to our mission",
      implications: "Choose energy-efficient technologies, optimize resource usage, measure carbon footprint",
      tags: ["sustainability", "environment", "responsibility"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== DATA PRINCIPLES =====
    (data_as_asset:ArchitecturePrinciple {
      id: "principle-data-asset",
      name: "Data as Strategic Asset",
      description: "Data must be treated as a valuable business asset with proper governance and monetization",
      category: "DATA",
      priority: "CRITICAL",
      rationale: "Data-driven insights are crucial for R&D innovation and operational excellence",
      implications: "Implement data governance, ensure data quality, create analytics capabilities",
      tags: ["data", "governance", "analytics"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (single_source_truth:ArchitecturePrinciple {
      id: "principle-single-source-truth",
      name: "Single Source of Truth",
      description: "Each data element should have one authoritative source across the enterprise",
      category: "DATA",
      priority: "HIGH",
      rationale: "Consistent data enables reliable decision-making and reduces conflicts",
      implications: "Define data ownership, implement master data management, eliminate data silos",
      tags: ["consistency", "accuracy", "reliability"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (real_time_visibility:ArchitecturePrinciple {
      id: "principle-real-time-visibility",
      name: "Real-Time Operational Visibility",
      description: "Critical business processes must provide real-time visibility and monitoring",
      category: "DATA",
      priority: "HIGH",
      rationale: "Manufacturing efficiency and quality control require immediate feedback and response",
      implications: "Implement IoT sensors, streaming analytics, and real-time dashboards",
      tags: ["real-time", "monitoring", "visibility"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== APPLICATION PRINCIPLES =====
    (cloud_first:ArchitecturePrinciple {
      id: "principle-cloud-first",
      name: "Cloud-First Strategy",
      description: "New applications should be cloud-native, existing applications migrated to cloud when feasible",
      category: "APPLICATION",
      priority: "CRITICAL",
      rationale: "Cloud provides scalability, cost efficiency, and access to latest technologies",
      implications: "Design for cloud-native patterns, use managed services, plan migration roadmap",
      tags: ["cloud", "scalability", "efficiency"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (api_first:ArchitecturePrinciple {
      id: "principle-api-first",
      name: "API-First Design",
      description: "All applications must expose well-designed APIs for integration and ecosystem development",
      category: "APPLICATION",
      priority: "HIGH",
      rationale: "APIs enable integration, partner ecosystem, and future innovation",
      implications: "Design APIs before implementation, follow REST/GraphQL standards, provide documentation",
      tags: ["api", "integration", "ecosystem"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (microservices_adoption:ArchitecturePrinciple {
      id: "principle-microservices",
      name: "Microservices for Complex Domains",
      description: "Complex business domains should be implemented using microservices architecture",
      category: "APPLICATION",
      priority: "MEDIUM",
      rationale: "Microservices enable independent development, scaling, and deployment",
      implications: "Define service boundaries, implement service mesh, plan for distributed complexity",
      tags: ["microservices", "modularity", "scalability"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== TECHNOLOGY PRINCIPLES =====
    (automation_first:ArchitecturePrinciple {
      id: "principle-automation-first",
      name: "Automation-First Approach",
      description: "Manual processes should be automated wherever technically and economically feasible",
      category: "TECHNOLOGY",
      priority: "HIGH",
      rationale: "Automation reduces errors, improves efficiency, and enables scaling",
      implications: "Implement CI/CD, infrastructure as code, automated testing, and monitoring",
      tags: ["automation", "efficiency", "reliability"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (open_standards:ArchitecturePrinciple {
      id: "principle-open-standards",
      name: "Prefer Open Standards",
      description: "Choose open standards and avoid proprietary technologies when possible",
      category: "TECHNOLOGY",
      priority: "MEDIUM",
      rationale: "Open standards reduce vendor lock-in and improve interoperability",
      implications: "Evaluate open-source alternatives, avoid proprietary formats, plan migration strategies",
      tags: ["open-source", "standards", "interoperability"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (edge_computing:ArchitecturePrinciple {
      id: "principle-edge-computing",
      name: "Edge Computing for Manufacturing",
      description: "Processing should occur close to manufacturing equipment for real-time control",
      category: "TECHNOLOGY",
      priority: "MEDIUM",
      rationale: "Manufacturing requires low-latency processing for quality control and safety",
      implications: "Deploy edge computing infrastructure, hybrid cloud architecture, local processing capabilities",
      tags: ["edge", "manufacturing", "latency"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== SECURITY PRINCIPLES =====
    (zero_trust:ArchitecturePrinciple {
      id: "principle-zero-trust",
      name: "Zero Trust Security Model",
      description: "Never trust, always verify - implement comprehensive identity and access management",
      category: "SECURITY",
      priority: "CRITICAL",
      rationale: "Cyber threats require robust security measures to protect IP and operations",
      implications: "Implement identity management, network segmentation, continuous monitoring",
      tags: ["security", "zero-trust", "identity"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (data_protection:ArchitecturePrinciple {
      id: "principle-data-protection",
      name: "Data Protection by Design",
      description: "Data protection and privacy must be built into systems from the ground up",
      category: "SECURITY",
      priority: "CRITICAL",
      rationale: "Regulatory compliance and customer trust require strong data protection",
      implications: "Implement encryption, access controls, audit trails, and privacy controls",
      tags: ["privacy", "protection", "compliance"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== INTEGRATION PRINCIPLES =====
    (event_driven:ArchitecturePrinciple {
      id: "principle-event-driven",
      name: "Event-Driven Architecture",
      description: "Use event-driven patterns for loose coupling and real-time data processing",
      category: "INTEGRATION",
      priority: "HIGH",
      rationale: "Manufacturing and supply chain require real-time event processing",
      implications: "Implement event streaming, message queues, and event sourcing patterns",
      tags: ["events", "streaming", "real-time"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (async_communication:ArchitecturePrinciple {
      id: "principle-async-communication",
      name: "Asynchronous Communication",
      description: "Prefer asynchronous communication patterns for better resilience and scalability",
      category: "INTEGRATION",
      priority: "MEDIUM",
      rationale: "Asynchronous patterns improve system resilience and user experience",
      implications: "Use message queues, async APIs, and eventual consistency patterns",
      tags: ["async", "resilience", "scalability"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== PERFORMANCE PRINCIPLES =====
    (performance_by_design:ArchitecturePrinciple {
      id: "principle-performance-design",
      name: "Performance by Design",
      description: "Performance requirements must be considered from the initial design phase",
      category: "PERFORMANCE",
      priority: "HIGH",
      rationale: "Manufacturing systems require consistent high performance for operational efficiency",
      implications: "Define performance requirements, implement monitoring, optimize critical paths",
      tags: ["performance", "efficiency", "optimization"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== COST OPTIMIZATION PRINCIPLES =====
    (cost_transparency:ArchitecturePrinciple {
      id: "principle-cost-transparency",
      name: "Technology Cost Transparency",
      description: "Technology costs must be visible and allocated to business units for accountability",
      category: "COST_OPTIMIZATION",
      priority: "HIGH",
      rationale: "Cost visibility enables better resource allocation and optimization decisions",
      implications: "Implement cost tracking, chargeback models, and resource optimization",
      tags: ["cost", "transparency", "optimization"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('Architecture Principles created successfully.')
}

export async function createPrincipleOwnership(session: Session) {
  console.log('Creating Architecture Principle Ownership relationships...')

  // Business Principles owned by CEO and CTO
  await session.run(`
    MATCH (business_agility:ArchitecturePrinciple {id: "principle-business-agility"})
    MATCH (customer_centricity:ArchitecturePrinciple {id: "principle-customer-centricity"})
    MATCH (sustainability_focus:ArchitecturePrinciple {id: "principle-sustainability"})
    MATCH (ceo:Person {id: "person-ceo"})
    CREATE (business_agility)-[:OWNED_BY]->(ceo)
    CREATE (customer_centricity)-[:OWNED_BY]->(ceo)
    CREATE (sustainability_focus)-[:OWNED_BY]->(ceo)
  `)

  // Data Principles owned by Enterprise Architect
  await session.run(`
    MATCH (data_as_asset:ArchitecturePrinciple {id: "principle-data-asset"})
    MATCH (single_source_truth:ArchitecturePrinciple {id: "principle-single-source-truth"})
    MATCH (real_time_visibility:ArchitecturePrinciple {id: "principle-real-time-visibility"})
    MATCH (enterprise_architect:Person {id: "person-enterprise-architect"})
    CREATE (data_as_asset)-[:OWNED_BY]->(enterprise_architect)
    CREATE (single_source_truth)-[:OWNED_BY]->(enterprise_architect)
    CREATE (real_time_visibility)-[:OWNED_BY]->(enterprise_architect)
  `)

  // Technology Principles owned by CTO and CIO
  await session.run(`
    MATCH (cloud_first:ArchitecturePrinciple {id: "principle-cloud-first"})
    MATCH (api_first:ArchitecturePrinciple {id: "principle-api-first"})
    MATCH (microservices_adoption:ArchitecturePrinciple {id: "principle-microservices"})
    MATCH (automation_first:ArchitecturePrinciple {id: "principle-automation-first"})
    MATCH (cto:Person {id: "person-cto"})
    MATCH (cio:Person {id: "person-cio"})
    CREATE (cloud_first)-[:OWNED_BY]->(cto)
    CREATE (api_first)-[:OWNED_BY]->(cto)
    CREATE (microservices_adoption)-[:OWNED_BY]->(cto)
    CREATE (automation_first)-[:OWNED_BY]->(cio)
  `)

  // Other principles
  await session.run(`
    MATCH (open_standards:ArchitecturePrinciple {id: "principle-open-standards"})
    MATCH (edge_computing:ArchitecturePrinciple {id: "principle-edge-computing"})
    MATCH (zero_trust:ArchitecturePrinciple {id: "principle-zero-trust"})
    MATCH (data_protection:ArchitecturePrinciple {id: "principle-data-protection"})
    MATCH (event_driven:ArchitecturePrinciple {id: "principle-event-driven"})
    MATCH (async_communication:ArchitecturePrinciple {id: "principle-async-communication"})
    MATCH (performance_by_design:ArchitecturePrinciple {id: "principle-performance-design"})
    MATCH (cost_transparency:ArchitecturePrinciple {id: "principle-cost-transparency"})
    MATCH (enterprise_architect:Person {id: "person-enterprise-architect"})
    MATCH (cio:Person {id: "person-cio"})
    MATCH (cfo:Person {id: "person-cfo"})
    CREATE (open_standards)-[:OWNED_BY]->(enterprise_architect)
    CREATE (edge_computing)-[:OWNED_BY]->(enterprise_architect)
    CREATE (zero_trust)-[:OWNED_BY]->(cio)
    CREATE (data_protection)-[:OWNED_BY]->(cio)
    CREATE (event_driven)-[:OWNED_BY]->(enterprise_architect)
    CREATE (async_communication)-[:OWNED_BY]->(enterprise_architect)
    CREATE (performance_by_design)-[:OWNED_BY]->(enterprise_architect)
    CREATE (cost_transparency)-[:OWNED_BY]->(cfo)
  `)

  console.log('Architecture Principle ownership relationships created successfully.')
}
