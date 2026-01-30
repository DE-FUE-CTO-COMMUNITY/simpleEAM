// Business Capabilities for Heat Pump Manufacturing Company
// Comprehensive capability model for heat pump manufacturing and HVAC solutions

import { Session } from 'neo4j-driver'

export async function createHeatPumpBusinessCapabilities(session: Session): Promise<void> {
  console.log('Creating Business Capabilities for Heat Pump Manufacturing...')

  // Create L1 Capabilities first
  const l1Query = `
    CREATE 
    // L1 Business Capabilities - Strategic Level (Only 6 Core L1 Capabilities)
    (strategy:BusinessCapability {
      id: "hp-cap-strategy-management",
      name: "Strategy & Corporate Management",
      description: "Strategic planning and corporate governance for heat pump manufacturing",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 5,
      level: 1,
      sequenceNumber: 1,
      tags: ["strategy", "governance", "leadership"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (rd:BusinessCapability {
      id: "hp-cap-research-development",
      name: "Research & Development",
      description: "Innovation and development of next-generation heat pump technologies",
      maturityLevel: 5,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 5,
      level: 1,
      sequenceNumber: 2,
      tags: ["innovation", "r&d", "technology"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (manufacturing:BusinessCapability {
      id: "hp-cap-manufacturing-operations",
      name: "Manufacturing Operations",
      description: "Core manufacturing operations for heat pump systems and components",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 1,
      sequenceNumber: 3,
      tags: ["manufacturing", "production", "operations"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (salesMarketing:BusinessCapability {
      id: "hp-cap-sales-marketing",
      name: "Sales & Marketing",
      description: "Customer acquisition and market development for HVAC solutions",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 1,
      sequenceNumber: 4,
      tags: ["sales", "marketing", "customer"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (service:BusinessCapability {
      id: "hp-cap-service-support",
      name: "Service & Customer Support",
      description: "Installation, maintenance, and customer support services",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 1,
      sequenceNumber: 5,
      tags: ["service", "support", "maintenance"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (businessSupport:BusinessCapability {
      id: "hp-cap-business-support",
      name: "Business Support",
      description: "Support functions including HR, Finance, IT, Legal, and Operations",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 4,
      level: 1,
      sequenceNumber: 6,
      tags: ["support", "enabling", "infrastructure"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  await session.run(l1Query)

  // Create L2 Capabilities - Strategy & Corporate Management
  const strategyL2Query = `
    CREATE 
    (strategicPlanning:BusinessCapability {
      id: "hp-cap-strategic-planning",
      name: "Strategic Planning",
      description: "Long-term strategic planning and roadmap development",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 5,
      level: 2,
      sequenceNumber: 11,
      tags: ["strategy", "planning", "roadmap"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (corporateGovernance:BusinessCapability {
      id: "hp-cap-corporate-governance",
      name: "Corporate Governance",
      description: "Board governance, compliance, and risk management",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 4,
      level: 2,
      sequenceNumber: 12,
      tags: ["governance", "compliance", "risk"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (marketAnalysis:BusinessCapability {
      id: "hp-cap-market-analysis",
      name: "Market Analysis & Intelligence",
      description: "Market research, competitive analysis, and business intelligence",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 4,
      level: 2,
      sequenceNumber: 13,
      tags: ["market", "intelligence", "analysis"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (sustainability:BusinessCapability {
      id: "hp-cap-sustainability",
      name: "Sustainability Management",
      description: "Environmental sustainability and carbon footprint management",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 4,
      level: 2,
      sequenceNumber: 14,
      tags: ["sustainability", "environment", "carbon"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  await session.run(strategyL2Query)

  // Create L2 Capabilities - Research & Development
  const rdL2Query = `
    CREATE 
    (thermalDesign:BusinessCapability {
      id: "hp-cap-thermal-design",
      name: "Thermal System Design",
      description: "Design and optimization of thermal systems and heat transfer solutions",
      maturityLevel: 5,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 21,
      tags: ["thermal", "design", "engineering"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (refrigerantTech:BusinessCapability {
      id: "hp-cap-refrigerant-technology",
      name: "Refrigerant Technology",
      description: "Development and optimization of refrigerant systems and eco-friendly alternatives",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 22,
      tags: ["refrigerant", "technology", "eco-friendly"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (smartControls:BusinessCapability {
      id: "hp-cap-smart-controls",
      name: "Smart Controls & IoT",
      description: "Development of intelligent control systems and IoT integration",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 23,
      tags: ["iot", "controls", "smart"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (productDevelopment:BusinessCapability {
      id: "hp-cap-product-development",
      name: "Product Development",
      description: "New product development and product lifecycle management",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 24,
      tags: ["product", "development", "lifecycle"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (testing:BusinessCapability {
      id: "hp-cap-testing-validation",
      name: "Testing & Validation",
      description: "Product testing, validation, and certification processes",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 25,
      tags: ["testing", "validation", "certification"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (energyEfficiency:BusinessCapability {
      id: "hp-cap-energy-efficiency",
      name: "Energy Efficiency Optimization",
      description: "Research and development of energy-efficient technologies",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 26,
      tags: ["energy", "efficiency", "optimization"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  await session.run(rdL2Query)

  // Create L2 Capabilities - Manufacturing Operations
  const manufacturingL2Query = `
    CREATE 
    (compressorMfg:BusinessCapability {
      id: "hp-cap-compressor-manufacturing",
      name: "Compressor Manufacturing",
      description: "Production of high-efficiency compressors for heat pump systems",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 31,
      tags: ["compressor", "manufacturing", "production"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (heatExchangerMfg:BusinessCapability {
      id: "hp-cap-heat-exchanger-manufacturing",
      name: "Heat Exchanger Manufacturing",
      description: "Production of heat exchangers and thermal components",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 32,
      tags: ["heat-exchanger", "manufacturing", "thermal"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (systemAssembly:BusinessCapability {
      id: "hp-cap-system-assembly",
      name: "System Assembly",
      description: "Final assembly and integration of complete heat pump systems",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 33,
      tags: ["assembly", "integration", "systems"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (productionPlanning:BusinessCapability {
      id: "hp-cap-production-planning",
      name: "Production Planning & Scheduling",
      description: "Advanced production planning and manufacturing scheduling",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 34,
      tags: ["planning", "scheduling", "production"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (qualityMgmt:BusinessCapability {
      id: "hp-cap-quality-management",
      name: "Quality Management",
      description: "Quality control, assurance, and continuous improvement processes",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 35,
      tags: ["quality", "control", "assurance"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (supplyChain:BusinessCapability {
      id: "hp-cap-supply-chain",
      name: "Supply Chain Management",
      description: "End-to-end supply chain management and vendor relationships",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 36,
      tags: ["supply-chain", "procurement", "vendors"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (warehouseMgmt:BusinessCapability {
      id: "hp-cap-warehouse-management",
      name: "Warehouse Management",
      description: "Warehouse operations, inventory management, and logistics",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 37,
      tags: ["warehouse", "inventory", "logistics"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  await session.run(manufacturingL2Query)

  // Create L2 Capabilities - Sales & Marketing
  const salesL2Query = `
    CREATE 
    (channelMgmt:BusinessCapability {
      id: "hp-cap-channel-management",
      name: "Channel Management",
      description: "Management of sales channels and partner relationships",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 41,
      tags: ["channels", "partners", "sales"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (digitalMarketing:BusinessCapability {
      id: "hp-cap-digital-marketing",
      name: "Digital Marketing",
      description: "Digital marketing campaigns and online presence management",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 42,
      tags: ["digital", "marketing", "online"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (productMgmt:BusinessCapability {
      id: "hp-cap-product-management",
      name: "Product Management",
      description: "Product portfolio management and market positioning",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 43,
      tags: ["product", "portfolio", "positioning"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (salesOps:BusinessCapability {
      id: "hp-cap-sales-operations",
      name: "Sales Operations",
      description: "Sales process management and customer relationship management",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 44,
      tags: ["sales", "operations", "crm"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (customerAnalytics:BusinessCapability {
      id: "hp-cap-customer-analytics",
      name: "Customer Analytics",
      description: "Customer behavior analysis and market intelligence",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 45,
      tags: ["analytics", "customer", "intelligence"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  await session.run(salesL2Query)

  // Create L2 Capabilities - Service & Customer Support
  const serviceL2Query = `
    CREATE 
    (installation:BusinessCapability {
      id: "hp-cap-installation-services",
      name: "Installation Services",
      description: "Professional installation and commissioning of heat pump systems",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 51,
      tags: ["installation", "commissioning", "service"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (maintenance:BusinessCapability {
      id: "hp-cap-maintenance-services",
      name: "Maintenance Services",
      description: "Preventive and corrective maintenance services",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 52,
      tags: ["maintenance", "preventive", "corrective"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (remoteMonitoring:BusinessCapability {
      id: "hp-cap-remote-monitoring",
      name: "Remote Monitoring",
      description: "Remote monitoring and predictive maintenance capabilities",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 53,
      tags: ["remote", "monitoring", "predictive"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (customerSupport:BusinessCapability {
      id: "hp-cap-customer-support",
      name: "Customer Support",
      description: "Customer service and technical support operations",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 54,
      tags: ["support", "service", "technical"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (warranty:BusinessCapability {
      id: "hp-cap-warranty-management",
      name: "Warranty Management",
      description: "Warranty claim processing and product lifecycle support",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 3,
      level: 2,
      sequenceNumber: 55,
      tags: ["warranty", "claims", "lifecycle"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  await session.run(serviceL2Query)

  // Create L2 Capabilities - Business Support
  const businessSupportL2Query = `
    CREATE 
    (hr:BusinessCapability {
      id: "hp-cap-human-resources",
      name: "Human Resources",
      description: "HR management, recruitment, and employee development",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 4,
      level: 2,
      sequenceNumber: 61,
      tags: ["hr", "recruitment", "development"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (talentManagement:BusinessCapability {
      id: "hp-cap-talent-management",
      name: "Talent Management",
      description: "Talent acquisition, performance management, and succession planning",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 3,
      level: 2,
      sequenceNumber: 62,
      tags: ["talent", "performance", "succession"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (finance:BusinessCapability {
      id: "hp-cap-finance",
      name: "Finance",
      description: "Financial management, accounting, and reporting",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 4,
      level: 2,
      sequenceNumber: 63,
      tags: ["finance", "accounting", "reporting"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (financialPlanning:BusinessCapability {
      id: "hp-cap-financial-planning",
      name: "Financial Planning",
      description: "Financial planning, budgeting, and forecasting",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 4,
      level: 2,
      sequenceNumber: 64,
      tags: ["planning", "budgeting", "forecasting"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (accounting:BusinessCapability {
      id: "hp-cap-accounting-reporting",
      name: "Accounting & Reporting",
      description: "Financial accounting, reporting, and compliance",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 4,
      level: 2,
      sequenceNumber: 65,
      tags: ["accounting", "reporting", "compliance"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (it:BusinessCapability {
      id: "hp-cap-information-technology",
      name: "Information Technology",
      description: "IT infrastructure, systems, and technology management",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 4,
      level: 2,
      sequenceNumber: 66,
      tags: ["it", "infrastructure", "technology"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (applicationMgmt:BusinessCapability {
      id: "hp-cap-application-management",
      name: "Application Management",
      description: "Business application management and maintenance",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 3,
      level: 2,
      sequenceNumber: 67,
      tags: ["applications", "management", "maintenance"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (infrastructureMgmt:BusinessCapability {
      id: "hp-cap-infrastructure-management",
      name: "Infrastructure Management",
      description: "IT infrastructure management and operations",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 3,
      level: 2,
      sequenceNumber: 68,
      tags: ["infrastructure", "operations", "management"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (legal:BusinessCapability {
      id: "hp-cap-legal-compliance",
      name: "Legal & Compliance",
      description: "Legal affairs, regulatory compliance, and risk management",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 3,
      level: 2,
      sequenceNumber: 69,
      tags: ["legal", "compliance", "risk"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  await session.run(businessSupportL2Query)

  console.log('Business Capabilities created successfully.')
}

export async function createHeatPumpCapabilityHierarchy(session: Session): Promise<void> {
  console.log('Creating Capability Hierarchy relationships...')

  const hierarchyQuery = `
    MATCH (strategy:BusinessCapability {id: "hp-cap-strategy-management"})
    MATCH (rd:BusinessCapability {id: "hp-cap-research-development"})
    MATCH (manufacturing:BusinessCapability {id: "hp-cap-manufacturing-operations"})
    MATCH (salesMarketing:BusinessCapability {id: "hp-cap-sales-marketing"})
    MATCH (service:BusinessCapability {id: "hp-cap-service-support"})
    MATCH (businessSupport:BusinessCapability {id: "hp-cap-business-support"})
    
    // Strategy L2 capabilities
    MATCH (strategicPlanning:BusinessCapability {id: "hp-cap-strategic-planning"})
    MATCH (corporateGovernance:BusinessCapability {id: "hp-cap-corporate-governance"})
    MATCH (marketAnalysis:BusinessCapability {id: "hp-cap-market-analysis"})
    MATCH (sustainability:BusinessCapability {id: "hp-cap-sustainability"})
    
    // R&D L2 capabilities
    MATCH (thermalDesign:BusinessCapability {id: "hp-cap-thermal-design"})
    MATCH (refrigerantTech:BusinessCapability {id: "hp-cap-refrigerant-technology"})
    MATCH (smartControls:BusinessCapability {id: "hp-cap-smart-controls"})
    MATCH (productDevelopment:BusinessCapability {id: "hp-cap-product-development"})
    MATCH (testing:BusinessCapability {id: "hp-cap-testing-validation"})
    MATCH (energyEfficiency:BusinessCapability {id: "hp-cap-energy-efficiency"})
    
    // Manufacturing L2 capabilities
    MATCH (compressorMfg:BusinessCapability {id: "hp-cap-compressor-manufacturing"})
    MATCH (heatExchangerMfg:BusinessCapability {id: "hp-cap-heat-exchanger-manufacturing"})
    MATCH (systemAssembly:BusinessCapability {id: "hp-cap-system-assembly"})
    MATCH (productionPlanning:BusinessCapability {id: "hp-cap-production-planning"})
    MATCH (qualityMgmt:BusinessCapability {id: "hp-cap-quality-management"})
    MATCH (supplyChain:BusinessCapability {id: "hp-cap-supply-chain"})
    MATCH (warehouseMgmt:BusinessCapability {id: "hp-cap-warehouse-management"})
    
    // Sales & Marketing L2 capabilities
    MATCH (channelMgmt:BusinessCapability {id: "hp-cap-channel-management"})
    MATCH (digitalMarketing:BusinessCapability {id: "hp-cap-digital-marketing"})
    MATCH (productMgmt:BusinessCapability {id: "hp-cap-product-management"})
    MATCH (salesOps:BusinessCapability {id: "hp-cap-sales-operations"})
    MATCH (customerAnalytics:BusinessCapability {id: "hp-cap-customer-analytics"})
    
    // Service L2 capabilities
    MATCH (installation:BusinessCapability {id: "hp-cap-installation-services"})
    MATCH (maintenance:BusinessCapability {id: "hp-cap-maintenance-services"})
    MATCH (remoteMonitoring:BusinessCapability {id: "hp-cap-remote-monitoring"})
    MATCH (customerSupport:BusinessCapability {id: "hp-cap-customer-support"})
    MATCH (warranty:BusinessCapability {id: "hp-cap-warranty-management"})
    
    // Business Support L2 capabilities
    MATCH (hr:BusinessCapability {id: "hp-cap-human-resources"})
    MATCH (talentManagement:BusinessCapability {id: "hp-cap-talent-management"})
    MATCH (finance:BusinessCapability {id: "hp-cap-finance"})
    MATCH (financialPlanning:BusinessCapability {id: "hp-cap-financial-planning"})
    MATCH (accounting:BusinessCapability {id: "hp-cap-accounting-reporting"})
    MATCH (it:BusinessCapability {id: "hp-cap-information-technology"})
    MATCH (applicationMgmt:BusinessCapability {id: "hp-cap-application-management"})
    MATCH (infrastructureMgmt:BusinessCapability {id: "hp-cap-infrastructure-management"})
    MATCH (legal:BusinessCapability {id: "hp-cap-legal-compliance"})

    CREATE
      // Strategy & Corporate Management hierarchy
      (strategicPlanning)-[:HAS_PARENT]->(strategy),
      (corporateGovernance)-[:HAS_PARENT]->(strategy),
      (marketAnalysis)-[:HAS_PARENT]->(strategy),
      (sustainability)-[:HAS_PARENT]->(strategy),

      // Research & Development hierarchy
      (thermalDesign)-[:HAS_PARENT]->(rd),
      (refrigerantTech)-[:HAS_PARENT]->(rd),
      (smartControls)-[:HAS_PARENT]->(rd),
      (productDevelopment)-[:HAS_PARENT]->(rd),
      (testing)-[:HAS_PARENT]->(rd),
      (energyEfficiency)-[:HAS_PARENT]->(rd),

      // Manufacturing Operations hierarchy
      (compressorMfg)-[:HAS_PARENT]->(manufacturing),
      (heatExchangerMfg)-[:HAS_PARENT]->(manufacturing),
      (systemAssembly)-[:HAS_PARENT]->(manufacturing),
      (productionPlanning)-[:HAS_PARENT]->(manufacturing),
      (qualityMgmt)-[:HAS_PARENT]->(manufacturing),
      (supplyChain)-[:HAS_PARENT]->(manufacturing),
      (warehouseMgmt)-[:HAS_PARENT]->(manufacturing),

      // Sales & Marketing hierarchy
      (channelMgmt)-[:HAS_PARENT]->(salesMarketing),
      (digitalMarketing)-[:HAS_PARENT]->(salesMarketing),
      (productMgmt)-[:HAS_PARENT]->(salesMarketing),
      (salesOps)-[:HAS_PARENT]->(salesMarketing),
      (customerAnalytics)-[:HAS_PARENT]->(salesMarketing),

      // Service & Customer Support hierarchy
      (installation)-[:HAS_PARENT]->(service),
      (maintenance)-[:HAS_PARENT]->(service),
      (remoteMonitoring)-[:HAS_PARENT]->(service),
      (customerSupport)-[:HAS_PARENT]->(service),
      (warranty)-[:HAS_PARENT]->(service),

      // Business Support hierarchy
      (hr)-[:HAS_PARENT]->(businessSupport),
      (talentManagement)-[:HAS_PARENT]->(businessSupport),
      (finance)-[:HAS_PARENT]->(businessSupport),
      (financialPlanning)-[:HAS_PARENT]->(businessSupport),
      (accounting)-[:HAS_PARENT]->(businessSupport),
      (it)-[:HAS_PARENT]->(businessSupport),
      (applicationMgmt)-[:HAS_PARENT]->(businessSupport),
      (infrastructureMgmt)-[:HAS_PARENT]->(businessSupport),
      (legal)-[:HAS_PARENT]->(businessSupport)
  `

  await session.run(hierarchyQuery)
  console.log('Capability hierarchy relationships created successfully.')
}
