// Architecture Principles for Heat Pump Manufacturing Company
// Guiding principles for enterprise architecture decisions

import { Session } from 'neo4j-driver'

export async function createHeatPumpArchitecturePrinciples(session: Session): Promise<void> {
  console.log('Creating Architecture Principles for Heat Pump Manufacturing...')

  const query = `
    CREATE 
    // Digital-First Strategy Principles
    (digitalFirst:ArchitecturePrinciple {
      id: "hp-principle-digital-first",
      name: "Digital-First Product Strategy",
      description: "All heat pump products must be designed with digital connectivity and smart capabilities as core features",
      category: "BUSINESS",
      priority: "CRITICAL",
      rationale: "The future of HVAC systems is smart and connected. Digital capabilities enable energy optimization, predictive maintenance, and superior customer experience.",
      implications: "All product development must include IoT sensors, connectivity modules, and cloud integration. Legacy products without digital capabilities will be phased out.",
      tags: ["digital", "iot", "smart-products"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (apiFirst:ArchitecturePrinciple {
      id: "hp-principle-api-first",
      name: "API-First Integration",
      description: "All systems and applications must provide well-documented APIs for seamless integration",
      category: "TECHNOLOGY",
      priority: "HIGH",
      rationale: "API-first approach enables rapid integration with partners, customer systems, and internal applications while maintaining flexibility and scalability.",
      implications: "Every new system must expose its functionality through RESTful APIs or GraphQL. Legacy systems must be retrofitted with API layers.",
      tags: ["api", "integration", "interoperability"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Data & Analytics Principles
    (dataUnification:ArchitecturePrinciple {
      id: "hp-principle-data-unification",
      name: "Unified Data Platform",
      description: "All business data must be accessible through a single, unified data platform with consistent schemas and APIs",
      category: "DATA",
      priority: "HIGH",
      rationale: "Unified data access enables advanced analytics, AI/ML applications, and real-time decision making across all business functions.",
      implications: "Data silos must be eliminated. All applications must conform to enterprise data models. Master data management is mandatory.",
      tags: ["data", "analytics", "unification"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (realTimeAnalytics:ArchitecturePrinciple {
      id: "hp-principle-real-time-analytics",
      name: "Real-Time Analytics First",
      description: "Analytics and insights must be available in real-time to enable immediate decision making",
      category: "DATA",
      priority: "HIGH",
      rationale: "Energy efficiency optimization and predictive maintenance require real-time data processing and immediate response capabilities.",
      implications: "Streaming data architectures, edge computing for IoT data, and real-time dashboards are required.",
      tags: ["real-time", "analytics", "streaming"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Cloud & Technology Principles
    (cloudFirst:ArchitecturePrinciple {
      id: "hp-principle-cloud-first",
      name: "Cloud-First Architecture",
      description: "New applications must be designed for cloud deployment with cloud-native patterns and capabilities",
      category: "TECHNOLOGY",
      priority: "HIGH",
      rationale: "Cloud platforms provide scalability, resilience, and cost efficiency required for IoT and analytics workloads.",
      implications: "Applications must be containerized, stateless, and designed for horizontal scaling. Cloud services are preferred over on-premises solutions.",
      tags: ["cloud", "scalability", "cloud-native"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (microservicesArchitecture:ArchitecturePrinciple {
      id: "hp-principle-microservices",
      name: "Microservices Architecture",
      description: "Applications should be decomposed into loosely coupled, independently deployable microservices",
      category: "TECHNOLOGY",
      priority: "MEDIUM",
      rationale: "Microservices enable independent development teams, technology diversity, and granular scaling of application components.",
      implications: "Monolithic applications must be gradually decomposed. Service mesh and API gateways are required for service communication.",
      tags: ["microservices", "modularity", "independence"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Security Principles
    (zeroTrustSecurity:ArchitecturePrinciple {
      id: "hp-principle-zero-trust",
      name: "Zero Trust Security Model",
      description: "Security must be built into every component with continuous verification and least privilege access",
      category: "SECURITY",
      priority: "CRITICAL",
      rationale: "IoT devices and cloud connectivity expand the attack surface requiring comprehensive security measures.",
      implications: "Identity verification for all users and devices, encrypted communication, network segmentation, and continuous monitoring are mandatory.",
      tags: ["zero-trust", "security", "verification"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (dataProtection:ArchitecturePrinciple {
      id: "hp-principle-data-protection",
      name: "Data Protection by Design",
      description: "Personal and business data must be protected through encryption, access controls, and privacy measures",
      category: "SECURITY",
      priority: "CRITICAL",
      rationale: "GDPR compliance and customer trust require comprehensive data protection throughout the data lifecycle.",
      implications: "Data encryption at rest and in transit, role-based access controls, data anonymization, and audit trails are required.",
      tags: ["data-protection", "privacy", "gdpr"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Operational Excellence Principles
    (automationFirst:ArchitecturePrinciple {
      id: "hp-principle-automation-first",
      name: "Automation First",
      description: "Manual processes must be automated to improve efficiency, reduce errors, and enable scaling",
      category: "TECHNOLOGY",
      priority: "HIGH",
      rationale: "Automation reduces operational costs, improves consistency, and enables teams to focus on value-added activities.",
      implications: "Infrastructure as code, CI/CD pipelines, automated testing, and self-healing systems are mandatory.",
      tags: ["automation", "efficiency", "devops"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (observabilityFirst:ArchitecturePrinciple {
      id: "hp-principle-observability",
      name: "Observability by Design",
      description: "All systems must provide comprehensive monitoring, logging, and tracing capabilities",
      category: "TECHNOLOGY",
      priority: "HIGH",
      rationale: "Observability enables proactive issue detection, performance optimization, and effective troubleshooting.",
      implications: "Structured logging, distributed tracing, metrics collection, and alerting must be built into all applications.",
      tags: ["observability", "monitoring", "troubleshooting"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Business Continuity Principles
    (resilienceFirst:ArchitecturePrinciple {
      id: "hp-principle-resilience",
      name: "Resilience by Design",
      description: "Systems must be designed to handle failures gracefully and recover automatically",
      category: "TECHNOLOGY",
      priority: "HIGH",
      rationale: "High availability is critical for IoT services, manufacturing operations, and customer satisfaction.",
      implications: "Circuit breakers, bulkhead patterns, graceful degradation, and automated failover are required.",
      tags: ["resilience", "high-availability", "fault-tolerance"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (sustainabilityFirst:ArchitecturePrinciple {
      id: "hp-principle-sustainability",
      name: "Sustainability by Design",
      description: "Technology choices must minimize environmental impact and support sustainability goals",
      category: "BUSINESS",
      priority: "HIGH",
      rationale: "Environmental responsibility is core to our heat pump business and customer expectations.",
      implications: "Energy-efficient technologies, optimized resource usage, and carbon footprint measurement are required.",
      tags: ["sustainability", "environment", "efficiency"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Innovation Principles
    (openStandards:ArchitecturePrinciple {
      id: "hp-principle-open-standards",
      name: "Open Standards and Interoperability",
      description: "Technology choices must favor open standards and industry protocols over proprietary solutions",
      category: "TECHNOLOGY",
      priority: "MEDIUM",
      rationale: "Open standards ensure long-term compatibility, vendor independence, and easier integration with partner systems.",
      implications: "Prefer open-source solutions, standard protocols (MQTT, HTTP, etc.), and avoid vendor lock-in scenarios.",
      tags: ["open-standards", "interoperability", "vendor-independence"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (continuousImprovement:ArchitecturePrinciple {
      id: "hp-principle-continuous-improvement",
      name: "Continuous Innovation and Improvement",
      description: "Architecture must evolve continuously based on technological advances and business needs",
      category: "GOVERNANCE",
      priority: "MEDIUM",
      rationale: "Rapid technological change requires continuous architectural evolution to maintain competitive advantage.",
      implications: "Regular architecture reviews, technology radar, proof of concepts, and gradual migration strategies are required.",
      tags: ["innovation", "improvement", "evolution"],
      isActive: true,
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  await session.run(query)
  console.log('✅ Architecture Principles created successfully!')
}

export async function createHeatPumpArchitecturePrincipleOwnership(
  session: Session
): Promise<void> {
  console.log('Creating Architecture Principle ownership relationships...')

  const query = `
    // Connect Architecture Principles to Owners and Company
    MATCH (company:Company {id: "company-thermo-dynamics-ag"})
    MATCH (ceo:Person {id: "hp-person-ceo"})
    MATCH (cto:Person {id: "hp-person-cto"})
    MATCH (cio:Person {id: "hp-person-cio"})
    MATCH (rdDirector:Person {id: "hp-person-rd-director"})
    MATCH (sustainabilityManager:Person {id: "hp-person-sustainability-manager"})

    // Business Principles - CEO ownership
    MATCH (digitalFirst:ArchitecturePrinciple {id: "hp-principle-digital-first"})
    MATCH (continuousImprovement:ArchitecturePrinciple {id: "hp-principle-continuous-improvement"})
    MATCH (sustainabilityFirst:ArchitecturePrinciple {id: "hp-principle-sustainability"})
    
    CREATE (digitalFirst)-[:OWNED_BY]->(ceo),
           (digitalFirst)-[:OWNED_BY]->(company),
           (continuousImprovement)-[:OWNED_BY]->(ceo),
           (continuousImprovement)-[:OWNED_BY]->(company),
           (sustainabilityFirst)-[:OWNED_BY]->(sustainabilityManager),
           (sustainabilityFirst)-[:OWNED_BY]->(company)

    // Technical Principles - CTO ownership
    WITH company, ceo, cto, cio, rdDirector, sustainabilityManager
    MATCH (apiFirst:ArchitecturePrinciple {id: "hp-principle-api-first"})
    MATCH (cloudFirst:ArchitecturePrinciple {id: "hp-principle-cloud-first"})
    MATCH (microservicesArchitecture:ArchitecturePrinciple {id: "hp-principle-microservices"})
    MATCH (automationFirst:ArchitecturePrinciple {id: "hp-principle-automation-first"})
    MATCH (observabilityFirst:ArchitecturePrinciple {id: "hp-principle-observability"})
    MATCH (resilienceFirst:ArchitecturePrinciple {id: "hp-principle-resilience"})
    MATCH (openStandards:ArchitecturePrinciple {id: "hp-principle-open-standards"})
    
    CREATE (apiFirst)-[:OWNED_BY]->(cto),
           (apiFirst)-[:OWNED_BY]->(company),
           (cloudFirst)-[:OWNED_BY]->(cto),
           (cloudFirst)-[:OWNED_BY]->(company),
           (microservicesArchitecture)-[:OWNED_BY]->(cto),
           (microservicesArchitecture)-[:OWNED_BY]->(company),
           (automationFirst)-[:OWNED_BY]->(cto),
           (automationFirst)-[:OWNED_BY]->(company),
           (observabilityFirst)-[:OWNED_BY]->(cto),
           (observabilityFirst)-[:OWNED_BY]->(company),
           (resilienceFirst)-[:OWNED_BY]->(cto),
           (resilienceFirst)-[:OWNED_BY]->(company),
           (openStandards)-[:OWNED_BY]->(cto),
           (openStandards)-[:OWNED_BY]->(company)

    // Data Principles - R&D Director ownership (as data innovation lead)
    WITH company, ceo, cto, cio, rdDirector, sustainabilityManager
    MATCH (dataUnification:ArchitecturePrinciple {id: "hp-principle-data-unification"})
    MATCH (realTimeAnalytics:ArchitecturePrinciple {id: "hp-principle-real-time-analytics"})
    
    CREATE (dataUnification)-[:OWNED_BY]->(rdDirector),
           (dataUnification)-[:OWNED_BY]->(company),
           (realTimeAnalytics)-[:OWNED_BY]->(rdDirector),
           (realTimeAnalytics)-[:OWNED_BY]->(company)

    // Security Principles - CIO ownership (as IT security lead)
    WITH company, ceo, cto, cio, rdDirector, sustainabilityManager
    MATCH (zeroTrustSecurity:ArchitecturePrinciple {id: "hp-principle-zero-trust"})
    MATCH (dataProtection:ArchitecturePrinciple {id: "hp-principle-data-protection"})
    
    CREATE (zeroTrustSecurity)-[:OWNED_BY]->(cio),
           (zeroTrustSecurity)-[:OWNED_BY]->(company),
           (dataProtection)-[:OWNED_BY]->(cio),
           (dataProtection)-[:OWNED_BY]->(company)
  `

  await session.run(query)
  console.log('✅ Architecture Principle ownership relationships created successfully!')
}
