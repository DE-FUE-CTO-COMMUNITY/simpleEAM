// Business Capabilities for Heat Pump Manufacturing Company
// Comprehensive capability model for heat pump manufacturing and HVAC solutions

import { Session } from 'neo4j-driver'

export async function createHeatPumpBusinessCapabilities(session: Session): Promise<void> {
  console.log('Creating Business Capabilities for Heat Pump Manufacturing...')

  const query = `
    CREATE 
    // L1 Business Capabilities - Strategic Level
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
      id: "hp-cap-manufacturing",
      name: "Heat Pump Manufacturing",
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
    (sales:BusinessCapability {
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
    (hr:BusinessCapability {
      id: "hp-cap-human-resources",
      name: "Human Resources",
      description: "Talent management and organizational development",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 3,
      level: 1,
      sequenceNumber: 6,
      tags: ["hr", "talent", "organization"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (finance:BusinessCapability {
      id: "hp-cap-finance",
      name: "Finance & Controlling",
      description: "Financial management and business controlling",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 4,
      level: 1,
      sequenceNumber: 7,
      tags: ["finance", "controlling", "accounting"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (it:BusinessCapability {
      id: "hp-cap-it",
      name: "Information Technology",
      description: "IT infrastructure and digital transformation",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 4,
      level: 1,
      sequenceNumber: 8,
      tags: ["it", "digital", "technology"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // L2 Business Capabilities - R&D
    (thermalDesign:BusinessCapability {
      id: "hp-cap-thermal-design",
      name: "Thermal System Design",
      description: "Design and optimization of thermal systems and heat exchangers",
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
      id: "hp-cap-refrigerant-tech",
      name: "Refrigerant Technology",
      description: "Development of eco-friendly refrigerant systems and cycles",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 22,
      tags: ["refrigerant", "eco-friendly", "cycles"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (smartControls:BusinessCapability {
      id: "hp-cap-smart-controls",
      name: "Smart Control Systems",
      description: "IoT-enabled control systems and energy management",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 23,
      tags: ["iot", "controls", "smart", "energy"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // L2 Business Capabilities - Manufacturing
    (compressorMfg:BusinessCapability {
      id: "hp-cap-compressor-manufacturing",
      name: "Compressor Manufacturing",
      description: "Production of high-efficiency compressors for heat pumps",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 31,
      tags: ["compressor", "manufacturing", "efficiency"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (heatExchangerMfg:BusinessCapability {
      id: "hp-cap-heat-exchanger-manufacturing",
      name: "Heat Exchanger Manufacturing",
      description: "Production of air and ground source heat exchangers",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 32,
      tags: ["heat-exchanger", "manufacturing", "air-source", "ground-source"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (systemAssembly:BusinessCapability {
      id: "hp-cap-system-assembly",
      name: "System Assembly & Testing",
      description: "Final assembly and quality testing of complete heat pump systems",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 33,
      tags: ["assembly", "testing", "quality"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // L2 Business Capabilities - Sales & Marketing
    (channelMgmt:BusinessCapability {
      id: "hp-cap-channel-management",
      name: "Channel Management",
      description: "Management of installer networks and distribution channels",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 41,
      tags: ["channel", "distribution", "installers"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (digitalMarketing:BusinessCapability {
      id: "hp-cap-digital-marketing",
      name: "Digital Marketing",
      description: "Online marketing and customer acquisition strategies",
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
      businessValue: 5,
      level: 2,
      sequenceNumber: 43,
      tags: ["product", "portfolio", "positioning"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // L2 Business Capabilities - Service & Support
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
      tags: ["installation", "commissioning", "professional"],
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
      description: "IoT-based remote monitoring and diagnostics",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 53,
      tags: ["remote", "monitoring", "iot", "diagnostics"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (customerSupport:BusinessCapability {
      id: "hp-cap-customer-support",
      name: "Customer Support",
      description: "Technical support and customer service operations",
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

    // L2 Business Capabilities - Supply Chain & Quality
    (supplyChain:BusinessCapability {
      id: "hp-cap-supply-chain",
      name: "Supply Chain Management",
      description: "Procurement and supplier relationship management",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      level: 2,
      sequenceNumber: 61,
      tags: ["supply-chain", "procurement", "suppliers"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (qualityMgmt:BusinessCapability {
      id: "hp-cap-quality-management",
      name: "Quality Management",
      description: "Quality assurance and compliance management",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 62,
      tags: ["quality", "compliance", "assurance"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // L2 Business Capabilities - Sustainability
    (sustainability:BusinessCapability {
      id: "hp-cap-sustainability",
      name: "Sustainability Management",
      description: "Environmental sustainability and carbon footprint management",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 4,
      level: 2,
      sequenceNumber: 71,
      tags: ["sustainability", "environment", "carbon"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (energyEfficiency:BusinessCapability {
      id: "hp-cap-energy-efficiency",
      name: "Energy Efficiency Optimization",
      description: "Optimization of energy efficiency across all operations",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      level: 2,
      sequenceNumber: 72,
      tags: ["energy", "efficiency", "optimization"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  try {
    await session.run(query)
    console.log('Business Capabilities created successfully.')
  } catch (error) {
    console.error('Error creating business capabilities:', error)
    throw error
  }
}
