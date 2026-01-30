// Applications for Heat Pump Manufacturing Company
// Core business applications supporting HVAC manufacturing operations

import { Session } from 'neo4j-driver'

export async function createHeatPumpApplications(session: Session): Promise<void> {
  console.log('Creating Applications for Heat Pump Manufacturing...')

  const query = `
    CREATE 
    // ERP & Core Business Systems
    (sapS4:Application {
      id: "hp-app-sap-s4hana",
      name: "SAP S/4HANA",
      description: "Enterprise Resource Planning system for financial management, procurement, and operations",
      status: "ACTIVE",
      criticality: "CRITICAL",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["SAP HANA", "ABAP", "SAP Fiori"],
      version: "2023",
      hostingEnvironment: "On-Premise",
      vendor: "SAP",
      costs: 850000.0,
      introductionDate: date("2022-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Manufacturing Systems
    (hvacMES:Application {
      id: "hp-app-hvac-mes",
      name: "HVAC Manufacturing Execution System",
      description: "Manufacturing execution system specifically designed for HVAC equipment production",
      status: "ACTIVE",
      criticality: "CRITICAL",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Java", "Spring Boot", "PostgreSQL", "REST APIs"],
      version: "3.2",
      hostingEnvironment: "Private Cloud",
      vendor: "HVAC Solutions Inc",
      costs: 420000.0,
      introductionDate: date("2021-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (thermalCAD:Application {
      id: "hp-app-thermal-cad",
      name: "ThermalCAD Pro",
      description: "Specialized CAD system for thermal system design and heat exchanger modeling",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["C++", "OpenGL", "CAD Engine"],
      version: "2024.1",
      hostingEnvironment: "On-Premise",
      vendor: "ThermalSoft",
      costs: 180000.0,
      introductionDate: date("2020-03-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (qualityMgmtSys:Application {
      id: "hp-app-quality-management",
      name: "Quality Management System",
      description: "Integrated quality management and compliance tracking system",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: [".NET Core", "SQL Server", "Angular"],
      version: "5.1",
      hostingEnvironment: "Azure Cloud",
      vendor: "QualityFirst Solutions",
      costs: 95000.0,
      introductionDate: date("2021-09-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // IoT & Monitoring
    (iotPlatform:Application {
      id: "hp-app-iot-platform",
      name: "ThermoDynamics IoT Platform",
      description: "IoT platform for remote monitoring and control of heat pump systems",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "REPLATFORM",
      technologyStack: ["Node.js", "MongoDB", "MQTT", "InfluxDB", "Grafana"],
      version: "2.3",
      hostingEnvironment: "AWS Cloud",
      vendor: "Custom Development",
      costs: 320000.0,
      introductionDate: date("2022-11-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (energyAnalytics:Application {
      id: "hp-app-energy-analytics",
      name: "Energy Analytics Suite",
      description: "Advanced analytics for energy efficiency optimization and performance monitoring",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "REPLATFORM",
      technologyStack: ["Python", "Apache Spark", "TensorFlow", "Elasticsearch"],
      version: "1.8",
      hostingEnvironment: "AWS Cloud",
      vendor: "Custom Development",
      costs: 220000.0,
      introductionDate: date("2023-02-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // CRM & Sales
    (crmSystem:Application {
      id: "hp-app-crm-salesforce",
      name: "Salesforce CRM",
      description: "Customer relationship management for sales and customer service",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Salesforce Platform", "Apex", "Lightning Web Components"],
      version: "Summer '24",
      hostingEnvironment: "Salesforce Cloud",
      vendor: "Salesforce",
      costs: 150000.0,
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (channelPortal:Application {
      id: "hp-app-installer-portal",
      name: "Installer Channel Portal",
      description: "Web portal for certified installers and distribution partners",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "REFACTOR",
      technologyStack: ["React", "Node.js", "PostgreSQL", "Docker"],
      version: "3.0",
      hostingEnvironment: "Azure Cloud",
      vendor: "Custom Development",
      costs: 180000.0,
      introductionDate: date("2021-04-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Service & Support
    (serviceManagement:Application {
      id: "hp-app-service-management",
      name: "Field Service Management",
      description: "Mobile-enabled field service management for installation and maintenance",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["ServiceNow", "Mobile Apps", "GPS Integration"],
      version: "Vancouver",
      hostingEnvironment: "ServiceNow Cloud",
      vendor: "ServiceNow",
      costs: 200000.0,
      introductionDate: date("2022-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (diagnosticTool:Application {
      id: "hp-app-diagnostic-tool",
      name: "Heat Pump Diagnostic Tool",
      description: "Mobile diagnostic application for technicians and service engineers",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Flutter", "Firebase", "Bluetooth", "REST APIs"],
      version: "2.1",
      hostingEnvironment: "Firebase",
      vendor: "Custom Development",
      costs: 85000.0,
      introductionDate: date("2023-01-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Analytics & Business Intelligence
    (powerBI:Application {
      id: "hp-app-power-bi",
      name: "Microsoft Power BI",
      description: "Business intelligence and analytics platform for operational dashboards",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Power BI", "DAX", "Power Query"],
      version: "2024",
      hostingEnvironment: "Microsoft Cloud",
      vendor: "Microsoft",
      costs: 45000.0,
      introductionDate: date("2021-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Infrastructure & IT
    (office365:Application {
      id: "hp-app-office365",
      name: "Microsoft 365",
      description: "Office productivity suite and collaboration platform",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Office 365", "SharePoint", "Teams", "Exchange"],
      version: "2024",
      hostingEnvironment: "Microsoft Cloud",
      vendor: "Microsoft",
      costs: 120000.0,
      introductionDate: date("2019-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Legacy Systems
    (legacyPLM:Application {
      id: "hp-app-legacy-plm",
      name: "Legacy PLM System",
      description: "Older product lifecycle management system for R&D documentation",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "MIGRATE",
      sevenRStrategy: "REPLACE",
      technologyStack: ["Oracle", "Java EE", "Legacy Framework"],
      version: "8.2",
      hostingEnvironment: "On-Premise",
      vendor: "Legacy Vendor",
      costs: 75000.0,
      introductionDate: date("2015-01-01"),
      endOfLifeDate: date("2025-12-31"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Additional Strategic & Innovation Applications
    (strategyPortfolio:Application {
      id: "hp-app-strategy-portfolio",
      name: "Strategic Portfolio Management",
      description: "Strategic portfolio and project management platform",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Microsoft Project Server", "SharePoint", "Power Apps"],
      version: "2024",
      hostingEnvironment: "Microsoft Cloud",
      vendor: "Microsoft",
      costs: 85000.0,
      introductionDate: date("2022-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (riskManagement:Application {
      id: "hp-app-risk-management",
      name: "Enterprise Risk Management",
      description: "Comprehensive risk assessment and compliance management system",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["GRC Platform", "Python", "Risk Analytics"],
      version: "3.5",
      hostingEnvironment: "Private Cloud",
      vendor: "RiskSoft Solutions",
      costs: 145000.0,
      introductionDate: date("2021-09-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (sustainabilityTracker:Application {
      id: "hp-app-sustainability-tracker",
      name: "Sustainability Management Platform",
      description: "Carbon footprint tracking and environmental compliance management",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["React", "Node.js", "TimescaleDB", "D3.js"],
      version: "2.1",
      hostingEnvironment: "AWS Cloud",
      vendor: "GreenTech Solutions",
      costs: 95000.0,
      introductionDate: date("2023-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (marketIntelligence:Application {
      id: "hp-app-market-intelligence",
      name: "Market Intelligence Platform",
      description: "Competitive analysis and market research platform",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Tableau", "Python", "Web Scraping", "NLP"],
      version: "1.4",
      hostingEnvironment: "Tableau Cloud",
      vendor: "MarketScope Analytics",
      costs: 120000.0,
      introductionDate: date("2022-10-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // R&D and Engineering Applications
    (plmSystem:Application {
      id: "hp-app-modern-plm",
      name: "Modern PLM System",
      description: "Next-generation product lifecycle management for R&D and engineering",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      technologyStack: ["PTC Windchill", "Creo", "Thingworx"],
      version: "13.0",
      hostingEnvironment: "Private Cloud",
      vendor: "PTC",
      costs: 380000.0,
      introductionDate: date("2024-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (cfdSimulation:Application {
      id: "hp-app-cfd-simulation",
      name: "CFD Simulation Suite",
      description: "Computational Fluid Dynamics for thermal system optimization",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["ANSYS Fluent", "High Performance Computing", "Linux"],
      version: "2024 R1",
      hostingEnvironment: "HPC Cluster",
      vendor: "ANSYS",
      costs: 250000.0,
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (testDataMgmt:Application {
      id: "hp-app-test-data-mgmt",
      name: "Test Data Management System",
      description: "Laboratory and field test data management and analysis",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["LIMS", "Python", "Jupyter", "PostgreSQL"],
      version: "4.2",
      hostingEnvironment: "On-Premise",
      vendor: "LabTech Systems",
      costs: 165000.0,
      introductionDate: date("2022-04-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (innovationPortal:Application {
      id: "hp-app-innovation-portal",
      name: "Innovation Management Portal",
      description: "Idea management and innovation tracking platform",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Drupal", "PHP", "MySQL", "Elasticsearch"],
      version: "2.8",
      hostingEnvironment: "Azure Cloud",
      vendor: "InnovateNow",
      costs: 75000.0,
      introductionDate: date("2021-11-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (intellectualProperty:Application {
      id: "hp-app-ip-management",
      name: "Intellectual Property Management",
      description: "Patent and IP portfolio management system",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["IP Management Platform", "Document Management", "Workflow"],
      version: "5.1",
      hostingEnvironment: "Private Cloud",
      vendor: "IPTracker Pro",
      costs: 110000.0,
      introductionDate: date("2020-08-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Manufacturing and Supply Chain Applications
    (mrpSystem:Application {
      id: "hp-app-advanced-mrp",
      name: "Advanced MRP System",
      description: "Material requirements planning with AI-powered demand forecasting",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Oracle SCM", "Machine Learning", "Advanced Analytics"],
      version: "22C",
      hostingEnvironment: "Oracle Cloud",
      vendor: "Oracle",
      costs: 320000.0,
      introductionDate: date("2023-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (supplierPortal:Application {
      id: "hp-app-supplier-portal",
      name: "Supplier Collaboration Portal",
      description: "Supplier onboarding, collaboration, and performance management",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["SAP Ariba", "B2B Integration", "API Gateway"],
      version: "2024.Q1",
      hostingEnvironment: "SAP Cloud",
      vendor: "SAP",
      costs: 185000.0,
      introductionDate: date("2022-08-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (warehouseMgmt:Application {
      id: "hp-app-warehouse-mgmt",
      name: "Warehouse Management System",
      description: "Automated warehouse operations and inventory management",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Manhattan WMS", "RFID", "Barcode Scanning", "Robotics"],
      version: "2024.1",
      hostingEnvironment: "Private Cloud",
      vendor: "Manhattan Associates",
      costs: 280000.0,
      introductionDate: date("2023-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (predictiveMaintenance:Application {
      id: "hp-app-predictive-maintenance",
      name: "Predictive Maintenance Platform",
      description: "AI-powered predictive maintenance for manufacturing equipment",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Azure IoT", "Machine Learning", "Digital Twins", "Power BI"],
      version: "3.0",
      hostingEnvironment: "Azure Cloud",
      vendor: "Microsoft",
      costs: 195000.0,
      introductionDate: date("2023-09-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (energyMgmtSystem:Application {
      id: "hp-app-energy-mgmt",
      name: "Energy Management System",
      description: "Factory energy consumption monitoring and optimization",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Schneider EcoStruxure", "SCADA", "Energy Analytics"],
      version: "4.3",
      hostingEnvironment: "Edge Computing",
      vendor: "Schneider Electric",
      costs: 155000.0,
      introductionDate: date("2022-12-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Sales, Marketing & Customer Applications
    (ecommercePlatform:Application {
      id: "hp-app-ecommerce-platform",
      name: "B2B E-Commerce Platform",
      description: "Online ordering platform for installers and distributors",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Magento Commerce", "PHP", "Elasticsearch", "Redis"],
      version: "2.4.6",
      hostingEnvironment: "AWS Cloud",
      vendor: "Adobe",
      costs: 165000.0,
      introductionDate: date("2021-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (digitalMarketing:Application {
      id: "hp-app-digital-marketing",
      name: "Digital Marketing Automation",
      description: "Marketing automation and lead nurturing platform",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["HubSpot", "Marketing Automation", "Email Marketing"],
      version: "Enterprise",
      hostingEnvironment: "HubSpot Cloud",
      vendor: "HubSpot",
      costs: 125000.0,
      introductionDate: date("2020-09-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (configurator:Application {
      id: "hp-app-product-configurator",
      name: "Heat Pump Configurator",
      description: "Online product configuration tool for custom heat pump systems",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Vue.js", "Node.js", "Configuration Engine", "3D Visualization"],
      version: "2.5",
      hostingEnvironment: "Azure Cloud",
      vendor: "Custom Development",
      costs: 240000.0,
      introductionDate: date("2022-05-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (partnerApp:Application {
      id: "hp-app-partner-mobile",
      name: "Partner Mobile App",
      description: "Mobile app for installers with product info and support tools",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["React Native", "Firebase", "Push Notifications", "Offline Sync"],
      version: "3.1",
      hostingEnvironment: "Firebase",
      vendor: "Custom Development",
      costs: 95000.0,
      introductionDate: date("2023-04-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (socialListening:Application {
      id: "hp-app-social-listening",
      name: "Social Media Listening Platform",
      description: "Brand monitoring and social media sentiment analysis",
      status: "ACTIVE",
      criticality: "LOW",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Brandwatch", "NLP", "Social Analytics"],
      version: "2024",
      hostingEnvironment: "Brandwatch Cloud",
      vendor: "Brandwatch",
      costs: 65000.0,
      introductionDate: date("2023-07-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Service and Support Applications
    (knowledgeBase:Application {
      id: "hp-app-knowledge-base",
      name: "Technical Knowledge Base",
      description: "Comprehensive technical documentation and troubleshooting guide",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Confluence", "Elasticsearch", "AI Search"],
      version: "8.5",
      hostingEnvironment: "Atlassian Cloud",
      vendor: "Atlassian",
      costs: 75000.0,
      introductionDate: date("2021-07-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (warrantyMgmt:Application {
      id: "hp-app-warranty-mgmt",
      name: "Warranty Management System",
      description: "Warranty registration, tracking, and claims processing",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Custom Platform", "Workflow Engine", "Document Management"],
      version: "4.1",
      hostingEnvironment: "Private Cloud",
      vendor: "WarrantyTech Solutions",
      costs: 135000.0,
      introductionDate: date("2022-02-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (serviceMobile:Application {
      id: "hp-app-service-mobile",
      name: "Service Technician Mobile App",
      description: "Mobile app for service technicians with work orders and diagnostics",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["iOS", "Android", "Native Development", "Bluetooth", "AR"],
      version: "4.2",
      hostingEnvironment: "Mobile",
      vendor: "Custom Development",
      costs: 175000.0,
      introductionDate: date("2023-08-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (spareParts:Application {
      id: "hp-app-spare-parts",
      name: "Spare Parts Management",
      description: "Spare parts inventory and ordering system for service operations",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["SAP Integrated", "Barcode Scanning", "Mobile Interface"],
      version: "2.3",
      hostingEnvironment: "SAP Cloud",
      vendor: "SAP",
      costs: 115000.0,
      introductionDate: date("2022-11-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Business Support Applications
    (hrms:Application {
      id: "hp-app-hrms",
      name: "Human Resources Management System",
      description: "Comprehensive HR management including payroll and talent management",
      status: "ACTIVE",
      criticality: "HIGH",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Workday", "HR Analytics", "Mobile Apps"],
      version: "2024.R1",
      hostingEnvironment: "Workday Cloud",
      vendor: "Workday",
      costs: 285000.0,
      introductionDate: date("2023-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (learningMgmt:Application {
      id: "hp-app-learning-mgmt",
      name: "Learning Management System",
      description: "Employee training and certification management platform",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Cornerstone OnDemand", "SCORM", "Video Learning"],
      version: "2024",
      hostingEnvironment: "Cornerstone Cloud",
      vendor: "Cornerstone OnDemand",
      costs: 95000.0,
      introductionDate: date("2021-10-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (expenseMgmt:Application {
      id: "hp-app-expense-mgmt",
      name: "Expense Management System",
      description: "Travel and expense management with automated approval workflows",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Concur", "Mobile Apps", "OCR", "Workflow"],
      version: "Professional",
      hostingEnvironment: "SAP Cloud",
      vendor: "SAP Concur",
      costs: 85000.0,
      introductionDate: date("2020-05-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (documentMgmt:Application {
      id: "hp-app-document-mgmt",
      name: "Enterprise Document Management",
      description: "Centralized document management and collaboration platform",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["SharePoint", "Office 365", "Power Automate"],
      version: "2024",
      hostingEnvironment: "Microsoft Cloud",
      vendor: "Microsoft",
      costs: 125000.0,
      introductionDate: date("2020-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (legalTech:Application {
      id: "hp-app-legal-tech",
      name: "Legal Technology Platform",
      description: "Contract management and legal compliance tracking",
      status: "ACTIVE",
      criticality: "MEDIUM",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Contract Management", "Legal Analytics", "Compliance Dashboard"],
      version: "3.4",
      hostingEnvironment: "Private Cloud",
      vendor: "LegalTech Solutions",
      costs: 155000.0,
      introductionDate: date("2022-07-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (cybersecurity:Application {
      id: "hp-app-cybersecurity",
      name: "Cybersecurity Platform",
      description: "Enterprise cybersecurity monitoring and threat detection",
      status: "ACTIVE",
      criticality: "CRITICAL",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["SIEM", "Threat Intelligence", "Zero Trust", "EDR"],
      version: "2024.2",
      hostingEnvironment: "Hybrid Cloud",
      vendor: "CrowdStrike",
      costs: 225000.0,
      introductionDate: date("2023-02-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (backupRecovery:Application {
      id: "hp-app-backup-recovery",
      name: "Backup & Disaster Recovery",
      description: "Enterprise backup and disaster recovery solution",
      status: "ACTIVE",
      criticality: "CRITICAL",
      timeCategory: "INVEST",
      sevenRStrategy: "RETAIN",
      technologyStack: ["Veeam", "Cloud Backup", "Disaster Recovery"],
      version: "12",
      hostingEnvironment: "Hybrid Cloud",
      vendor: "Veeam",
      costs: 145000.0,
      introductionDate: date("2021-12-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `

  try {
    await session.run(query)
    console.log('Applications created successfully.')
  } catch (error) {
    console.error('Error creating applications:', error)
    throw error
  }
}

export async function createHeatPumpApplicationOwnership(session: Session): Promise<void> {
  console.log('Creating Application Ownership relationships...')

  await session.run(`
    MATCH 
      (cfo:Person {id: "hp-person-cfo"}),
      (cto:Person {id: "hp-person-cto"}),
      (cio:Person {id: "hp-person-cio"}),
      (mfgDirector:Person {id: "hp-person-manufacturing-director"}),
      (qualityManager:Person {id: "hp-person-quality-manager"}),
      (salesDirector:Person {id: "hp-person-sales-director"}),
      (serviceDirector:Person {id: "hp-person-service-director"}),
      (itManager:Person {id: "hp-person-it-manager"}),
      (rdDirector:Person {id: "hp-person-rd-director"}),
      (hrDirector:Person {id: "hp-person-hr-director"}),
      (procurementManager:Person {id: "hp-person-procurement-manager"}),
      (marketingManager:Person {id: "hp-person-marketing-manager"}),

      // Core Applications
      (sapS4:Application {id: "hp-app-sap-s4hana"}),
      (hvacMES:Application {id: "hp-app-hvac-mes"}),
      (thermalCAD:Application {id: "hp-app-thermal-cad"}),
      (qualityMgmtSys:Application {id: "hp-app-quality-management"}),
      (iotPlatform:Application {id: "hp-app-iot-platform"}),
      (energyAnalytics:Application {id: "hp-app-energy-analytics"}),
      (crmSystem:Application {id: "hp-app-crm-salesforce"}),
      (channelPortal:Application {id: "hp-app-installer-portal"}),
      (serviceManagement:Application {id: "hp-app-service-management"}),
      (diagnosticTool:Application {id: "hp-app-diagnostic-tool"}),
      (powerBI:Application {id: "hp-app-power-bi"}),
      (office365:Application {id: "hp-app-office365"}),
      (legacyPLM:Application {id: "hp-app-legacy-plm"}),

      // Strategic Applications
      (strategyPortfolio:Application {id: "hp-app-strategy-portfolio"}),
      (riskManagement:Application {id: "hp-app-risk-management"}),
      (sustainabilityTracker:Application {id: "hp-app-sustainability-tracker"}),
      (marketIntelligence:Application {id: "hp-app-market-intelligence"}),

      // R&D Applications
      (plmSystem:Application {id: "hp-app-modern-plm"}),
      (cfdSimulation:Application {id: "hp-app-cfd-simulation"}),
      (testDataMgmt:Application {id: "hp-app-test-data-mgmt"}),
      (innovationPortal:Application {id: "hp-app-innovation-portal"}),
      (intellectualProperty:Application {id: "hp-app-ip-management"}),

      // Manufacturing Applications
      (mrpSystem:Application {id: "hp-app-advanced-mrp"}),
      (supplierPortal:Application {id: "hp-app-supplier-portal"}),
      (warehouseMgmt:Application {id: "hp-app-warehouse-mgmt"}),
      (predictiveMaintenance:Application {id: "hp-app-predictive-maintenance"}),
      (energyMgmtSystem:Application {id: "hp-app-energy-mgmt"}),

      // Sales & Marketing Applications
      (ecommercePlatform:Application {id: "hp-app-ecommerce-platform"}),
      (digitalMarketing:Application {id: "hp-app-digital-marketing"}),
      (configurator:Application {id: "hp-app-product-configurator"}),
      (partnerApp:Application {id: "hp-app-partner-mobile"}),
      (socialListening:Application {id: "hp-app-social-listening"}),

      // Service Applications
      (knowledgeBase:Application {id: "hp-app-knowledge-base"}),
      (warrantyMgmt:Application {id: "hp-app-warranty-mgmt"}),
      (serviceMobile:Application {id: "hp-app-service-mobile"}),
      (spareParts:Application {id: "hp-app-spare-parts"}),

      // Business Support Applications
      (hrms:Application {id: "hp-app-hrms"}),
      (learningMgmt:Application {id: "hp-app-learning-mgmt"}),
      (expenseMgmt:Application {id: "hp-app-expense-mgmt"}),
      (documentMgmt:Application {id: "hp-app-document-mgmt"}),
      (legalTech:Application {id: "hp-app-legal-tech"}),
      (cybersecurity:Application {id: "hp-app-cybersecurity"}),
      (backupRecovery:Application {id: "hp-app-backup-recovery"})

    CREATE
      // CFO ownership - Finance & Strategic Applications
      (sapS4)-[:OWNED_BY]->(cfo),
      (powerBI)-[:OWNED_BY]->(cfo),
      (strategyPortfolio)-[:OWNED_BY]->(cfo),
      (riskManagement)-[:OWNED_BY]->(cfo),
      (expenseMgmt)-[:OWNED_BY]->(cfo),
      
      // CTO ownership - Technology & Innovation
      (thermalCAD)-[:OWNED_BY]->(cto),
      (iotPlatform)-[:OWNED_BY]->(cto),
      (energyAnalytics)-[:OWNED_BY]->(cto),
      (legacyPLM)-[:OWNED_BY]->(cto),
      (plmSystem)-[:OWNED_BY]->(cto),
      (cfdSimulation)-[:OWNED_BY]->(cto),
      (testDataMgmt)-[:OWNED_BY]->(cto),
      (innovationPortal)-[:OWNED_BY]->(cto),
      (intellectualProperty)-[:OWNED_BY]->(cto),
      (sustainabilityTracker)-[:OWNED_BY]->(cto),
      
      // CIO ownership - IT Infrastructure & Enterprise Systems
      (office365)-[:OWNED_BY]->(cio),
      (documentMgmt)-[:OWNED_BY]->(cio),
      (cybersecurity)-[:OWNED_BY]->(cio),
      (backupRecovery)-[:OWNED_BY]->(cio),
      
      // Manufacturing Director ownership - Production & Operations
      (hvacMES)-[:OWNED_BY]->(mfgDirector),
      (mrpSystem)-[:OWNED_BY]->(mfgDirector),
      (warehouseMgmt)-[:OWNED_BY]->(mfgDirector),
      (predictiveMaintenance)-[:OWNED_BY]->(mfgDirector),
      (energyMgmtSystem)-[:OWNED_BY]->(mfgDirector),
      
      // Quality Manager ownership
      (qualityMgmtSys)-[:OWNED_BY]->(qualityManager),
      
      // Sales Director ownership - Sales & Customer Applications
      (crmSystem)-[:OWNED_BY]->(salesDirector),
      (channelPortal)-[:OWNED_BY]->(salesDirector),
      (ecommercePlatform)-[:OWNED_BY]->(salesDirector),
      (configurator)-[:OWNED_BY]->(salesDirector),
      (partnerApp)-[:OWNED_BY]->(salesDirector),
      
      // Service Director ownership - Service & Support
      (serviceManagement)-[:OWNED_BY]->(serviceDirector),
      (diagnosticTool)-[:OWNED_BY]->(serviceDirector),
      (knowledgeBase)-[:OWNED_BY]->(serviceDirector),
      (warrantyMgmt)-[:OWNED_BY]->(serviceDirector),
      (serviceMobile)-[:OWNED_BY]->(serviceDirector),
      (spareParts)-[:OWNED_BY]->(serviceDirector),
      
      // IT Manager additional ownership - Technical Applications
      (iotPlatform)-[:OWNED_BY]->(itManager),
      (energyAnalytics)-[:OWNED_BY]->(itManager),
      
      // HR Director ownership - Human Resources
      (hrms)-[:OWNED_BY]->(hrDirector),
      (learningMgmt)-[:OWNED_BY]->(hrDirector),
      
      // Procurement Manager ownership - Supply Chain
      (supplierPortal)-[:OWNED_BY]->(procurementManager),
      
      // Marketing Manager ownership - Marketing Applications
      (digitalMarketing)-[:OWNED_BY]->(marketingManager),
      (marketIntelligence)-[:OWNED_BY]->(marketingManager),
      (socialListening)-[:OWNED_BY]->(marketingManager),
      
      // R&D Director additional ownership
      (plmSystem)-[:OWNED_BY]->(rdDirector),
      (cfdSimulation)-[:OWNED_BY]->(rdDirector),
      
      // Legal ownership (shared with CIO for legal tech)
      (legalTech)-[:OWNED_BY]->(cio)
  `)

  console.log('Application ownership relationships created successfully.')
}
