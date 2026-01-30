import { Session } from 'neo4j-driver'

export async function createHeatPumpInfrastructure(session: Session): Promise<void> {
  console.log('Creating Infrastructure for Heat Pump Manufacturing...')

  // Create Infrastructure entities
  await session.run(`
    CREATE 
    // Cloud Infrastructure
    (awsCloud:Infrastructure {
      id: "hp-infra-aws-cloud",
      name: "AWS Cloud Platform",
      description: "Primary cloud infrastructure for IoT platform, analytics, and enterprise applications",
      infrastructureType: "CLOUD_DATACENTER",
      status: "ACTIVE",
      vendor: "Amazon Web Services",
      version: "Latest",
      location: "eu-central-1",
      capacity: "Auto-scaling",
      specifications: "Multi-AZ deployment with auto-scaling",
      costs: 125000.00,
      introductionDate: date("2022-01-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (azureCloud:Infrastructure {
      id: "hp-infra-azure-backup",
      name: "Azure Backup Infrastructure",
      description: "Secondary cloud infrastructure for disaster recovery and backup services",
      infrastructureType: "CLOUD_DATACENTER",
      status: "ACTIVE",
      vendor: "Microsoft Azure",
      version: "Latest",
      location: "West Europe",
      capacity: "100TB backup",
      specifications: "Geo-redundant storage with automatic failover",
      costs: 45000.00,
      introductionDate: date("2022-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // On-Premise Data Centers
    (primaryDatacenter:Infrastructure {
      id: "hp-infra-datacenter-primary",
      name: "Primary Data Center Munich",
      description: "Main on-premise data center for core business applications and manufacturing systems",
      infrastructureType: "ON_PREMISE_DATACENTER",
      status: "ACTIVE",
      vendor: "Dell Technologies",
      version: "PowerEdge R750",
      location: "Munich, Germany",
      capacity: "500 servers",
      specifications: "High-availability configuration with redundant power and cooling",
      costs: 2500000.00,
      introductionDate: date("2020-06-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (drDatacenter:Infrastructure {
      id: "hp-infra-datacenter-dr",
      name: "DR Data Center Berlin",
      description: "Disaster recovery data center with real-time replication capabilities",
      infrastructureType: "ON_PREMISE_DATACENTER",
      status: "ACTIVE",
      vendor: "HPE",
      version: "ProLiant DL380",
      location: "Berlin, Germany",
      capacity: "200 servers",
      specifications: "Mirror configuration of primary datacenter",
      costs: 1200000.00,
      introductionDate: date("2021-01-10"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Network Infrastructure
    (coreNetwork:Infrastructure {
      id: "hp-infra-network-core",
      name: "Core Network Infrastructure",
      description: "High-speed core network connecting all manufacturing facilities and offices",
      infrastructureType: "PHYSICAL_SERVER",
      status: "ACTIVE",
      vendor: "Cisco Systems",
      version: "Catalyst 9600",
      location: "Multi-site",
      capacity: "100 Gbps",
      specifications: "Redundant fiber optic connections with MPLS backbone",
      costs: 350000.00,
      introductionDate: date("2021-09-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (wifiInfrastructure:Infrastructure {
      id: "hp-infra-wifi",
      name: "Enterprise WiFi Infrastructure",
      description: "Comprehensive WiFi coverage for all facilities including manufacturing floors",
      infrastructureType: "PHYSICAL_SERVER",
      status: "ACTIVE",
      vendor: "Aruba Networks",
      version: "WiFi 6E",
      location: "All facilities",
      capacity: "10000 concurrent devices",
      specifications: "Enterprise-grade WiFi 6E with advanced security",
      costs: 180000.00,
      introductionDate: date("2022-11-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // IoT Infrastructure
    (iotGateway:Infrastructure {
      id: "hp-infra-iot-gateway",
      name: "IoT Gateway Infrastructure",
      description: "Edge computing gateways for real-time IoT data processing and local analytics",
      infrastructureType: "IOT_GATEWAY",
      status: "ACTIVE",
      vendor: "Intel",
      version: "NUC 12 Pro",
      location: "Manufacturing floors",
      capacity: "50 gateways",
      specifications: "Edge computing with local AI inference capabilities",
      costs: 125000.00,
      introductionDate: date("2022-05-20"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (iotPlatform:Infrastructure {
      id: "hp-infra-iot-platform",
      name: "Enterprise IoT Platform",
      description: "Centralized IoT platform for device management, data collection, and analytics",
      infrastructureType: "IOT_PLATFORM",
      status: "ACTIVE",
      vendor: "AWS IoT Core",
      version: "Enterprise",
      location: "AWS eu-central-1",
      capacity: "100000 devices",
      specifications: "Scalable IoT platform with real-time stream processing",
      costs: 95000.00,
      introductionDate: date("2022-02-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Manufacturing Infrastructure
    (mesServers:Infrastructure {
      id: "hp-infra-mes-servers",
      name: "MES Server Infrastructure",
      description: "Manufacturing Execution System servers for production line management and quality control",
      infrastructureType: "PHYSICAL_SERVER",
      status: "ACTIVE",
      vendor: "Siemens",
      version: "SIMATIC IT",
      location: "Primary datacenter",
      capacity: "20 servers",
      specifications: "High-availability MES servers with real-time processing",
      costs: 450000.00,
      introductionDate: date("2021-04-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (qualityServers:Infrastructure {
      id: "hp-infra-quality-servers",
      name: "Quality Management Servers",
      description: "Dedicated servers for quality management systems and compliance tracking",
      infrastructureType: "PHYSICAL_SERVER",
      status: "ACTIVE",
      vendor: "IBM",
      version: "Power Systems",
      location: "Primary datacenter",
      capacity: "8 servers",
      specifications: "Enterprise-grade servers for quality management applications",
      costs: 280000.00,
      introductionDate: date("2021-07-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Storage Infrastructure
    (primaryStorage:Infrastructure {
      id: "hp-infra-storage-primary",
      name: "Primary Storage Array",
      description: "High-performance storage array for all business-critical applications and databases",
      infrastructureType: "PHYSICAL_SERVER",
      status: "ACTIVE",
      vendor: "NetApp",
      version: "FAS9500",
      location: "Primary datacenter",
      capacity: "2 PB",
      specifications: "All-flash storage with deduplication and compression",
      costs: 800000.00,
      introductionDate: date("2020-12-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (backupStorage:Infrastructure {
      id: "hp-infra-storage-backup",
      name: "Backup Storage System",
      description: "Dedicated backup storage for disaster recovery and long-term data retention",
      infrastructureType: "PHYSICAL_SERVER",
      status: "ACTIVE",
      vendor: "Veeam",
      version: "Backup & Replication v12",
      location: "DR datacenter",
      capacity: "5 PB",
      specifications: "Hybrid backup solution with cloud integration",
      costs: 320000.00,
      introductionDate: date("2021-02-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Security Infrastructure
    (firewallSystem:Infrastructure {
      id: "hp-infra-firewall",
      name: "Enterprise Firewall System",
      description: "Next-generation firewall system providing comprehensive network security",
      infrastructureType: "PHYSICAL_SERVER",
      status: "ACTIVE",
      vendor: "Palo Alto Networks",
      version: "PA-5250",
      location: "Network perimeter",
      capacity: "100 Gbps throughput",
      specifications: "Next-gen firewall with threat prevention and SSL inspection",
      costs: 220000.00,
      introductionDate: date("2021-10-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (identitySystem:Infrastructure {
      id: "hp-infra-identity",
      name: "Identity Management System",
      description: "Centralized identity and access management for all enterprise applications",
      infrastructureType: "PHYSICAL_SERVER",
      status: "ACTIVE",
      vendor: "Microsoft",
      version: "Active Directory Enterprise",
      location: "Primary datacenter",
      capacity: "10000 users",
      specifications: "Enterprise identity management with SSO and MFA",
      costs: 150000.00,
      introductionDate: date("2020-08-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    // Development Infrastructure
    (devopsInfrastructure:Infrastructure {
      id: "hp-infra-devops",
      name: "DevOps Platform Infrastructure",
      description: "Comprehensive DevOps platform for CI/CD, version control, and deployment automation",
      infrastructureType: "CLOUD_DATACENTER",
      status: "ACTIVE",
      vendor: "GitLab",
      version: "Ultimate SaaS",
      location: "Cloud",
      capacity: "500 developers",
      specifications: "Full DevOps lifecycle management with integrated security scanning",
      costs: 75000.00,
      introductionDate: date("2022-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),

    (testingInfrastructure:Infrastructure {
      id: "hp-infra-testing",
      name: "Testing Environment Infrastructure",
      description: "Dedicated infrastructure for automated testing, performance testing, and quality assurance",
      infrastructureType: "VIRTUALIZATION_CLUSTER",
      status: "ACTIVE",
      vendor: "VMware",
      version: "vSphere 8.0",
      location: "Primary datacenter",
      capacity: "100 VMs",
      specifications: "Virtualized testing environment with automated provisioning",
      costs: 180000.00,
      introductionDate: date("2021-11-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  // Create Infrastructure relationships in separate queries
  await session.run(`
    MATCH (awsCloud:Infrastructure {id: "hp-infra-aws-cloud"})
    MATCH (azureCloud:Infrastructure {id: "hp-infra-azure-backup"})
    CREATE (awsCloud)-[:REPLICATES_TO]->(azureCloud)
  `)

  await session.run(`
    MATCH (primaryDatacenter:Infrastructure {id: "hp-infra-datacenter-primary"})
    MATCH (drDatacenter:Infrastructure {id: "hp-infra-datacenter-dr"})
    MATCH (primaryStorage:Infrastructure {id: "hp-infra-storage-primary"})
    MATCH (backupStorage:Infrastructure {id: "hp-infra-storage-backup"})
    CREATE (primaryDatacenter)-[:HOSTS]->(primaryStorage)
    CREATE (drDatacenter)-[:HOSTS]->(backupStorage)
    CREATE (primaryStorage)-[:REPLICATES_TO]->(backupStorage)
  `)

  await session.run(`
    MATCH (coreNetwork:Infrastructure {id: "hp-infra-network-core"})
    MATCH (wifiInfrastructure:Infrastructure {id: "hp-infra-wifi"})
    MATCH (iotGateway:Infrastructure {id: "hp-infra-iot-gateway"})
    CREATE (coreNetwork)-[:CONNECTS]->(wifiInfrastructure)
    CREATE (wifiInfrastructure)-[:CONNECTS]->(iotGateway)
  `)

  await session.run(`
    MATCH (iotGateway:Infrastructure {id: "hp-infra-iot-gateway"})
    MATCH (iotPlatform:Infrastructure {id: "hp-infra-iot-platform"})
    MATCH (awsCloud:Infrastructure {id: "hp-infra-aws-cloud"})
    CREATE (iotGateway)-[:FEEDS_DATA_TO]->(iotPlatform)
    CREATE (iotPlatform)-[:HOSTED_ON]->(awsCloud)
  `)

  await session.run(`
    MATCH (mesServers:Infrastructure {id: "hp-infra-mes-servers"})
    MATCH (qualityServers:Infrastructure {id: "hp-infra-quality-servers"})
    MATCH (primaryDatacenter:Infrastructure {id: "hp-infra-datacenter-primary"})
    CREATE (primaryDatacenter)-[:HOSTS]->(mesServers)
    CREATE (primaryDatacenter)-[:HOSTS]->(qualityServers)
  `)

  await session.run(`
    MATCH (firewallSystem:Infrastructure {id: "hp-infra-firewall"})
    MATCH (identitySystem:Infrastructure {id: "hp-infra-identity"})
    MATCH (coreNetwork:Infrastructure {id: "hp-infra-network-core"})
    CREATE (firewallSystem)-[:PROTECTS]->(coreNetwork)
    CREATE (identitySystem)-[:SECURES]->(coreNetwork)
  `)

  await session.run(`
    MATCH (devopsInfrastructure:Infrastructure {id: "hp-infra-devops"})
    MATCH (testingInfrastructure:Infrastructure {id: "hp-infra-testing"})
    MATCH (primaryDatacenter:Infrastructure {id: "hp-infra-datacenter-primary"})
    CREATE (primaryDatacenter)-[:HOSTS]->(testingInfrastructure)
    CREATE (devopsInfrastructure)-[:DEPLOYS_TO]->(testingInfrastructure)
  `)

  console.log('Infrastructure entities and relationships created successfully!')
}

export async function createHeatPumpInfrastructureOwnership(session: Session): Promise<void> {
  console.log('Creating Infrastructure Ownership relationships for Heat Pump Manufacturing...')

  const query = `
    MATCH (awsCloud:Infrastructure {id: "hp-infra-aws-cloud"})
    MATCH (azureCloud:Infrastructure {id: "hp-infra-azure-backup"})
    MATCH (primaryDatacenter:Infrastructure {id: "hp-infra-datacenter-primary"})
    MATCH (drDatacenter:Infrastructure {id: "hp-infra-datacenter-dr"})
    MATCH (coreNetwork:Infrastructure {id: "hp-infra-network-core"})
    MATCH (wifiInfrastructure:Infrastructure {id: "hp-infra-wifi"})
    MATCH (iotGateway:Infrastructure {id: "hp-infra-iot-gateway"})
    MATCH (iotPlatform:Infrastructure {id: "hp-infra-iot-platform"})
    MATCH (mesServers:Infrastructure {id: "hp-infra-mes-servers"})
    MATCH (qualityServers:Infrastructure {id: "hp-infra-quality-servers"})
    MATCH (primaryStorage:Infrastructure {id: "hp-infra-storage-primary"})
    MATCH (backupStorage:Infrastructure {id: "hp-infra-storage-backup"})
    MATCH (firewallSystem:Infrastructure {id: "hp-infra-firewall"})
    MATCH (identitySystem:Infrastructure {id: "hp-infra-identity"})
    MATCH (devopsInfrastructure:Infrastructure {id: "hp-infra-devops"})
    MATCH (testingInfrastructure:Infrastructure {id: "hp-infra-testing"})
    MATCH (cio:Person {id: "hp-person-cio"})
    MATCH (itManager:Person {id: "hp-person-it-manager"})
    
    // CIO owns strategic infrastructure
    CREATE (awsCloud)-[:OWNED_BY]->(cio)
    CREATE (azureCloud)-[:OWNED_BY]->(cio)
    CREATE (primaryDatacenter)-[:OWNED_BY]->(cio)
    CREATE (drDatacenter)-[:OWNED_BY]->(cio)
    
    // IT Manager owns operational infrastructure
    CREATE (coreNetwork)-[:OWNED_BY]->(itManager)
    CREATE (wifiInfrastructure)-[:OWNED_BY]->(itManager)
    CREATE (iotGateway)-[:OWNED_BY]->(itManager)
    CREATE (iotPlatform)-[:OWNED_BY]->(itManager)
    CREATE (mesServers)-[:OWNED_BY]->(itManager)
    CREATE (qualityServers)-[:OWNED_BY]->(itManager)
    CREATE (primaryStorage)-[:OWNED_BY]->(itManager)
    CREATE (backupStorage)-[:OWNED_BY]->(itManager)
    CREATE (firewallSystem)-[:OWNED_BY]->(itManager)
    CREATE (identitySystem)-[:OWNED_BY]->(itManager)
    CREATE (devopsInfrastructure)-[:OWNED_BY]->(itManager)
    CREATE (testingInfrastructure)-[:OWNED_BY]->(itManager)
  `

  await session.run(query)
  console.log('Infrastructure ownership relationships created successfully!')
}
