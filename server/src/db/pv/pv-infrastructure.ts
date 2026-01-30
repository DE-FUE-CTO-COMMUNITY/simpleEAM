// Infrastructure for Solar Panel Manufacturing Company
// Cloud-first approach with AWS as primary cloud provider

import { Session } from 'neo4j-driver'

export async function createInfrastructure(session: Session) {
  console.log('Creating Infrastructure for Solar Panel Manufacturing...')

  await session.run(`
    CREATE 
    // ===== CLOUD DATACENTERS =====
    (aws_us_east:Infrastructure {
      id: "infra-aws-us-east-1",
      name: "AWS US East 1 (Virginia)",
      description: "Primary AWS region for production workloads",
      infrastructureType: "CLOUD_DATACENTER",
      status: "ACTIVE",
      vendor: "Amazon Web Services",
      version: "Current",
      capacity: "Unlimited (Cloud)",
      location: "US East (N. Virginia)",
      specifications: "AWS Region with multiple Availability Zones",
      costs: 0.00,
      introductionDate: date("2021-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (aws_eu_west:Infrastructure {
      id: "infra-aws-eu-west-1",
      name: "AWS EU West 1 (Ireland)",
      description: "Secondary AWS region for disaster recovery and European data residency",
      infrastructureType: "CLOUD_DATACENTER",
      status: "ACTIVE",
      vendor: "Amazon Web Services",
      version: "Current",
      capacity: "Unlimited (Cloud)",
      location: "EU West (Ireland)",
      specifications: "AWS Region for European operations",
      costs: 0.00,
      introductionDate: date("2021-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== KUBERNETES CLUSTERS =====
    (eks_production:Infrastructure {
      id: "infra-eks-production",
      name: "EKS Production Cluster",
      description: "Amazon EKS cluster for production containerized applications",
      infrastructureType: "KUBERNETES_CLUSTER",
      status: "ACTIVE",
      vendor: "Amazon Web Services",
      version: "1.28",
      capacity: "Auto-scaling: 10-100 nodes",
      location: "AWS US East 1",
      specifications: "m5.large to m5.4xlarge instances, managed node groups",
      costs: 15000.00,
      introductionDate: date("2022-01-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (eks_development:Infrastructure {
      id: "infra-eks-development",
      name: "EKS Development Cluster",
      description: "Amazon EKS cluster for development and testing",
      infrastructureType: "KUBERNETES_CLUSTER",
      status: "ACTIVE",
      vendor: "Amazon Web Services",
      version: "1.28",
      capacity: "Auto-scaling: 2-10 nodes",
      location: "AWS US East 1",
      specifications: "t3.medium to m5.large instances, spot instances enabled",
      costs: 3000.00,
      introductionDate: date("2022-01-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== CONTAINER HOSTS =====
    (ecs_cluster:Infrastructure {
      id: "infra-ecs-cluster",
      name: "ECS Fargate Cluster",
      description: "Amazon ECS cluster using Fargate for serverless containers",
      infrastructureType: "CONTAINER_HOST",
      status: "ACTIVE",
      vendor: "Amazon Web Services",
      version: "Fargate 1.4",
      capacity: "Serverless - Auto-scaling",
      location: "AWS US East 1",
      specifications: "Fargate tasks, 0.25-4 vCPU, 0.5-30 GB RAM",
      costs: 8000.00,
      introductionDate: date("2021-08-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== VIRTUAL MACHINES =====
    (sap_vm_cluster:Infrastructure {
      id: "infra-sap-vm-cluster",
      name: "SAP S/4HANA VM Cluster",
      description: "High-performance virtual machines for SAP S/4HANA",
      infrastructureType: "VIRTUAL_MACHINE",
      status: "ACTIVE",
      vendor: "Amazon Web Services",
      version: "EC2 R5",
      capacity: "4x r5.4xlarge instances",
      location: "AWS US East 1",
      ipAddress: "10.0.1.10-13",
      operatingSystem: "SUSE Linux Enterprise Server 15",
      specifications: "16 vCPU, 128 GB RAM, 1000 GB SSD each",
      costs: 25000.00,
      introductionDate: date("2021-12-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (oracle_vm_cluster:Infrastructure {
      id: "infra-oracle-vm-cluster",
      name: "Oracle SCM VM Cluster",
      description: "Virtual machines for Oracle Supply Chain Management",
      infrastructureType: "VIRTUAL_MACHINE",
      status: "ACTIVE",
      vendor: "Oracle Cloud",
      version: "OCI Compute",
      capacity: "2x VM.Standard.E4.Flex",
      location: "Oracle Cloud US East",
      ipAddress: "10.1.1.10-11",
      operatingSystem: "Oracle Linux 8",
      specifications: "8 vCPU, 64 GB RAM, 500 GB SSD each",
      costs: 12000.00,
      introductionDate: date("2020-07-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== ON-PREMISE DATACENTER (Manufacturing) =====
    (onprem_datacenter:Infrastructure {
      id: "infra-onprem-datacenter",
      name: "Manufacturing Datacenter",
      description: "On-premise datacenter at manufacturing facility for local systems",
      infrastructureType: "ON_PREMISE_DATACENTER",
      status: "ACTIVE",
      vendor: "Internal",
      capacity: "42U rack space, 100kW power",
      location: "Solar Panel Manufacturing Facility, Phoenix, AZ",
      specifications: "Redundant power, climate control, 1Gbps connectivity",
      costs: 5000.00,
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== ON-PREMISE SERVERS =====
    (plm_servers:Infrastructure {
      id: "infra-plm-servers",
      name: "Siemens PLM Servers",
      description: "Physical servers for Siemens Teamcenter PLM system",
      infrastructureType: "PHYSICAL_SERVER",
      status: "ACTIVE",
      vendor: "Dell Technologies",
      version: "PowerEdge R750",
      capacity: "2x physical servers",
      location: "Manufacturing Datacenter",
      ipAddress: "192.168.1.10-11",
      operatingSystem: "Windows Server 2022",
      specifications: "2x Intel Xeon Silver 4314, 128 GB RAM, 2TB SSD RAID",
      costs: 18000.00,
      introductionDate: date("2021-01-15"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (wms_servers:Infrastructure {
      id: "infra-wms-servers",
      name: "Manhattan WMS Servers",
      description: "Physical servers for warehouse management system",
      infrastructureType: "PHYSICAL_SERVER",
      status: "ACTIVE",
      vendor: "HPE",
      version: "ProLiant DL380 Gen10",
      capacity: "2x physical servers",
      location: "Manufacturing Datacenter",
      ipAddress: "192.168.1.20-21",
      operatingSystem: "Windows Server 2019",
      specifications: "2x Intel Xeon Gold 5218, 64 GB RAM, 1TB SSD RAID",
      costs: 12000.00,
      introductionDate: date("2019-03-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== PLANNED INFRASTRUCTURE =====
    (eks_europe:Infrastructure {
      id: "infra-eks-europe",
      name: "EKS Europe Cluster",
      description: "Planned Amazon EKS cluster in EU region for data residency compliance",
      infrastructureType: "KUBERNETES_CLUSTER",
      status: "PLANNED",
      vendor: "Amazon Web Services",
      version: "1.29",
      capacity: "Auto-scaling: 5-50 nodes",
      location: "AWS EU West 1",
      specifications: "m5.large to m5.2xlarge instances, planned for Q2 2025",
      costs: 8000.00,
      planningDate: date("2024-10-01"),
      introductionDate: date("2025-06-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('Infrastructure created successfully.')
}

export async function createInfrastructureRelationships(session: Session) {
  console.log('Creating Infrastructure relationships...')

  // Cloud datacenter relationships
  await session.run(`
    MATCH (eks_production:Infrastructure {id: "infra-eks-production"})
    MATCH (eks_development:Infrastructure {id: "infra-eks-development"})
    MATCH (ecs_cluster:Infrastructure {id: "infra-ecs-cluster"})
    MATCH (sap_vm_cluster:Infrastructure {id: "infra-sap-vm-cluster"})
    MATCH (aws_us_east:Infrastructure {id: "infra-aws-us-east-1"})
    CREATE (eks_production)-[:HAS_PARENT_INFRASTRUCTURE]->(aws_us_east)
    CREATE (eks_development)-[:HAS_PARENT_INFRASTRUCTURE]->(aws_us_east)
    CREATE (ecs_cluster)-[:HAS_PARENT_INFRASTRUCTURE]->(aws_us_east)
    CREATE (sap_vm_cluster)-[:HAS_PARENT_INFRASTRUCTURE]->(aws_us_east)
  `)

  await session.run(`
    MATCH (eks_europe:Infrastructure {id: "infra-eks-europe"})
    MATCH (aws_eu_west:Infrastructure {id: "infra-aws-eu-west-1"})
    CREATE (eks_europe)-[:HAS_PARENT_INFRASTRUCTURE]->(aws_eu_west)
  `)

  // On-premise relationships
  await session.run(`
    MATCH (plm_servers:Infrastructure {id: "infra-plm-servers"})
    MATCH (wms_servers:Infrastructure {id: "infra-wms-servers"})
    MATCH (onprem_datacenter:Infrastructure {id: "infra-onprem-datacenter"})
    CREATE (plm_servers)-[:HAS_PARENT_INFRASTRUCTURE]->(onprem_datacenter)
    CREATE (wms_servers)-[:HAS_PARENT_INFRASTRUCTURE]->(onprem_datacenter)
  `)

  console.log('Infrastructure relationships created successfully.')
}

export async function createInfrastructureOwnership(session: Session) {
  console.log('Creating Infrastructure Ownership relationships...')

  await session.run(`
    MATCH (aws_us_east:Infrastructure {id: "infra-aws-us-east-1"})
    MATCH (aws_eu_west:Infrastructure {id: "infra-aws-eu-west-1"})
    MATCH (sap_vm_cluster:Infrastructure {id: "infra-sap-vm-cluster"})
    MATCH (oracle_vm_cluster:Infrastructure {id: "infra-oracle-vm-cluster"})
    MATCH (cio:Person {id: "person-cio"})
    CREATE (aws_us_east)-[:OWNED_BY]->(cio)
    CREATE (aws_eu_west)-[:OWNED_BY]->(cio)
    CREATE (sap_vm_cluster)-[:OWNED_BY]->(cio)
    CREATE (oracle_vm_cluster)-[:OWNED_BY]->(cio)
  `)

  await session.run(`
    MATCH (eks_production:Infrastructure {id: "infra-eks-production"})
    MATCH (eks_development:Infrastructure {id: "infra-eks-development"})
    MATCH (eks_europe:Infrastructure {id: "infra-eks-europe"})
    MATCH (ecs_cluster:Infrastructure {id: "infra-ecs-cluster"})
    MATCH (onprem_datacenter:Infrastructure {id: "infra-onprem-datacenter"})
    MATCH (plm_servers:Infrastructure {id: "infra-plm-servers"})
    MATCH (wms_servers:Infrastructure {id: "infra-wms-servers"})
    MATCH (it_manager:Person {id: "person-it-manager"})
    CREATE (eks_production)-[:OWNED_BY]->(it_manager)
    CREATE (eks_development)-[:OWNED_BY]->(it_manager)
    CREATE (eks_europe)-[:OWNED_BY]->(it_manager)
    CREATE (ecs_cluster)-[:OWNED_BY]->(it_manager)
    CREATE (onprem_datacenter)-[:OWNED_BY]->(it_manager)
    CREATE (plm_servers)-[:OWNED_BY]->(it_manager)
    CREATE (wms_servers)-[:OWNED_BY]->(it_manager)
  `)

  console.log('Infrastructure ownership relationships created successfully.')
}
