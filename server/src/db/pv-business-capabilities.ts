// Business Capabilities for Solar Panel Manufacturing Company
// First and Second Level Capabilities for a Photovoltaic Module Manufacturer

import { Session } from 'neo4j-driver'

export async function createBusinessCapabilities(session: Session) {
  console.log('Creating Business Capabilities for Solar Panel Manufacturing...')

  // ===== LEVEL 1 CAPABILITIES =====
  await session.run(`
    CREATE 
    (research:BusinessCapability {
      id: "cap-research-development",
      name: "Research & Development",
      description: "Innovation and development of solar technology solutions",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 5,
      sequenceNumber: 1,
      tags: ["innovation", "r&d", "technology"],
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (manufacturing:BusinessCapability {
      id: "cap-manufacturing",
      name: "Manufacturing Operations",
      description: "Production of solar panels and related components",
      maturityLevel: 5,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      sequenceNumber: 2,
      tags: ["production", "manufacturing", "operations"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (supply_chain:BusinessCapability {
      id: "cap-supply-chain",
      name: "Supply Chain Management",
      description: "Sourcing, procurement, and supplier relationship management",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      sequenceNumber: 3,
      tags: ["procurement", "suppliers", "logistics"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (sales_marketing:BusinessCapability {
      id: "cap-sales-marketing",
      name: "Sales & Marketing",
      description: "Customer acquisition, relationship management, and market development",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 4,
      sequenceNumber: 4,
      tags: ["sales", "marketing", "customers"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (customer_service:BusinessCapability {
      id: "cap-customer-service",
      name: "Customer Service & Support",
      description: "Post-sales support, warranty management, and customer satisfaction",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 3,
      sequenceNumber: 5,
      tags: ["support", "warranty", "service"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (quality_mgmt:BusinessCapability {
      id: "cap-quality-management",
      name: "Quality Management",
      description: "Quality assurance, testing, and compliance management",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      sequenceNumber: 6,
      tags: ["quality", "testing", "compliance"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (finance_accounting:BusinessCapability {
      id: "cap-finance-accounting",
      name: "Finance & Accounting",
      description: "Financial management, accounting, and reporting",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 3,
      sequenceNumber: 7,
      tags: ["finance", "accounting", "reporting"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (hr_management:BusinessCapability {
      id: "cap-hr-management",
      name: "Human Resources Management",
      description: "Talent acquisition, development, and workforce management",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 3,
      sequenceNumber: 8,
      tags: ["hr", "talent", "workforce"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (it_management:BusinessCapability {
      id: "cap-it-management",
      name: "IT Management",
      description: "Information technology infrastructure and application management",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "SUPPORT",
      businessValue: 3,
      sequenceNumber: 9,
      tags: ["it", "technology", "infrastructure"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  // ===== LEVEL 2 CAPABILITIES =====
  await session.run(`
    CREATE 
    // Research & Development Sub-capabilities
    (product_innovation:BusinessCapability {
      id: "cap-product-innovation",
      name: "Product Innovation",
      description: "Development of new solar panel technologies and efficiency improvements",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 5,
      sequenceNumber: 11,
      tags: ["innovation", "product", "technology"],
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (materials_research:BusinessCapability {
      id: "cap-materials-research",
      name: "Materials Research",
      description: "Research and development of new materials for solar cells",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 4,
      sequenceNumber: 12,
      tags: ["materials", "research", "cells"],
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (prototype_testing:BusinessCapability {
      id: "cap-prototype-testing",
      name: "Prototype Development & Testing",
      description: "Building and testing prototypes of new solar panel designs",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      sequenceNumber: 13,
      tags: ["prototype", "testing", "development"],
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // Manufacturing Operations Sub-capabilities
    (cell_production:BusinessCapability {
      id: "cap-cell-production",
      name: "Solar Cell Production",
      description: "Manufacturing of photovoltaic cells",
      maturityLevel: 5,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      sequenceNumber: 21,
      tags: ["cells", "production", "manufacturing"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (module_assembly:BusinessCapability {
      id: "cap-module-assembly",
      name: "Module Assembly",
      description: "Assembly of solar cells into complete solar modules",
      maturityLevel: 5,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      sequenceNumber: 22,
      tags: ["assembly", "modules", "manufacturing"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (packaging_shipping:BusinessCapability {
      id: "cap-packaging-shipping",
      name: "Packaging & Shipping",
      description: "Packaging finished products and shipping to customers",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 3,
      sequenceNumber: 23,
      tags: ["packaging", "shipping", "logistics"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // Supply Chain Management Sub-capabilities
    (supplier_mgmt:BusinessCapability {
      id: "cap-supplier-management",
      name: "Supplier Management",
      description: "Management of supplier relationships and performance",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      sequenceNumber: 31,
      tags: ["suppliers", "relationships", "performance"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (procurement:BusinessCapability {
      id: "cap-procurement",
      name: "Procurement",
      description: "Sourcing and purchasing of raw materials and components",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      sequenceNumber: 32,
      tags: ["procurement", "sourcing", "purchasing"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (inventory_mgmt:BusinessCapability {
      id: "cap-inventory-management",
      name: "Inventory Management",
      description: "Management of raw materials, work-in-progress, and finished goods inventory",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 3,
      sequenceNumber: 33,
      tags: ["inventory", "warehousing", "stock"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // Sales & Marketing Sub-capabilities
    (lead_generation:BusinessCapability {
      id: "cap-lead-generation",
      name: "Lead Generation",
      description: "Generation of sales leads through various marketing channels",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 4,
      sequenceNumber: 41,
      tags: ["leads", "marketing", "generation"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (sales_execution:BusinessCapability {
      id: "cap-sales-execution",
      name: "Sales Execution",
      description: "Sales process execution and order management",
      maturityLevel: 3,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      sequenceNumber: 42,
      tags: ["sales", "orders", "execution"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (channel_mgmt:BusinessCapability {
      id: "cap-channel-management",
      name: "Channel Management",
      description: "Management of distribution channels and partner relationships",
      maturityLevel: 2,
      status: "ACTIVE",
      type: "STRATEGIC",
      businessValue: 3,
      sequenceNumber: 43,
      tags: ["channels", "partners", "distribution"],
      introductionDate: date("2019-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // Quality Management Sub-capabilities
    (incoming_inspection:BusinessCapability {
      id: "cap-incoming-inspection",
      name: "Incoming Material Inspection",
      description: "Quality control of incoming raw materials and components",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 4,
      sequenceNumber: 61,
      tags: ["inspection", "quality", "materials"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (production_testing:BusinessCapability {
      id: "cap-production-testing",
      name: "Production Testing",
      description: "Testing of solar panels during and after production",
      maturityLevel: 5,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      sequenceNumber: 62,
      tags: ["testing", "production", "quality"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (certification_compliance:BusinessCapability {
      id: "cap-certification-compliance",
      name: "Certification & Compliance",
      description: "Ensuring products meet industry standards and certifications",
      maturityLevel: 4,
      status: "ACTIVE",
      type: "OPERATIONAL",
      businessValue: 5,
      sequenceNumber: 63,
      tags: ["certification", "compliance", "standards"],
      introductionDate: date("2018-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('Business Capabilities created successfully.')
}
