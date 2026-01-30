// Data Objects for Solar Panel Manufacturing Company
// Key data entities used across the enterprise

import { Session } from 'neo4j-driver'

export async function createDataObjects(session: Session) {
  console.log('Creating Data Objects for Solar Panel Manufacturing...')

  await session.run(`
    CREATE 
    // ===== CUSTOMER & SALES DATA =====
    (customer_data:DataObject {
      id: "data-customer-master",
      name: "Customer Master Data",
      description: "Customer information including contact details, contracts, and preferences",
      classification: "CONFIDENTIAL",
      format: "Relational Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (sales_orders:DataObject {
      id: "data-sales-orders",
      name: "Sales Orders",
      description: "Customer orders, specifications, pricing, and delivery information",
      classification: "CONFIDENTIAL",
      format: "Relational Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (leads_prospects:DataObject {
      id: "data-leads-prospects",
      name: "Leads and Prospects",
      description: "Marketing qualified leads and sales prospects data",
      classification: "INTERNAL",
      format: "CRM Platform",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== PRODUCT & RESEARCH DATA =====
    (product_designs:DataObject {
      id: "data-product-designs",
      name: "Solar Panel Designs",
      description: "CAD files, specifications, and technical drawings for solar panels",
      classification: "STRICTLY_CONFIDENTIAL",
      format: "CAD Files",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (research_data:DataObject {
      id: "data-research-experimental",
      name: "Research and Experimental Data",
      description: "R&D test results, material research data, and prototype performance",
      classification: "STRICTLY_CONFIDENTIAL",
      format: "Scientific Data Files",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (material_specifications:DataObject {
      id: "data-material-specs",
      name: "Material Specifications",
      description: "Technical specifications for raw materials and components",
      classification: "CONFIDENTIAL",
      format: "Structured Documents",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== MANUFACTURING DATA =====
    (production_data:DataObject {
      id: "data-production-metrics",
      name: "Production Metrics",
      description: "Real-time production data, efficiency metrics, and throughput statistics",
      classification: "INTERNAL",
      format: "Time Series Data",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (work_orders:DataObject {
      id: "data-work-orders",
      name: "Manufacturing Work Orders",
      description: "Production orders, schedules, and manufacturing instructions",
      classification: "INTERNAL",
      format: "Relational Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (equipment_data:DataObject {
      id: "data-equipment-status",
      name: "Equipment Status and Maintenance",
      description: "Manufacturing equipment status, maintenance schedules, and performance data",
      classification: "INTERNAL",
      format: "IoT Sensor Data",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== QUALITY DATA =====
    (quality_test_results:DataObject {
      id: "data-quality-tests",
      name: "Quality Test Results",
      description: "Test results for solar panels including efficiency, durability, and certification data",
      classification: "CONFIDENTIAL",
      format: "Structured Test Data",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (compliance_certificates:DataObject {
      id: "data-compliance-certs",
      name: "Compliance Certificates",
      description: "Industry certifications, compliance documents, and audit results",
      classification: "CONFIDENTIAL",
      format: "Digital Documents",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (defect_tracking:DataObject {
      id: "data-defect-tracking",
      name: "Defect and Non-Conformance Data",
      description: "Product defects, non-conformances, and corrective actions",
      classification: "INTERNAL",
      format: "Issue Tracking Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== SUPPLY CHAIN DATA =====
    (supplier_data:DataObject {
      id: "data-supplier-master",
      name: "Supplier Master Data",
      description: "Supplier information, contracts, performance metrics, and certifications",
      classification: "CONFIDENTIAL",
      format: "Relational Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (purchase_orders:DataObject {
      id: "data-purchase-orders",
      name: "Purchase Orders",
      description: "Procurement orders, delivery schedules, and supplier agreements",
      classification: "INTERNAL",
      format: "Relational Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (inventory_data:DataObject {
      id: "data-inventory-levels",
      name: "Inventory Levels",
      description: "Real-time inventory levels, stock movements, and warehouse locations",
      classification: "INTERNAL",
      format: "Real-time Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== FINANCIAL DATA =====
    (financial_transactions:DataObject {
      id: "data-financial-transactions",
      name: "Financial Transactions",
      description: "General ledger, accounts payable, accounts receivable, and cost center data",
      classification: "STRICTLY_CONFIDENTIAL",
      format: "ERP Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (cost_accounting:DataObject {
      id: "data-cost-accounting",
      name: "Cost Accounting Data",
      description: "Product costing, manufacturing overhead, and profitability analysis",
      classification: "CONFIDENTIAL",
      format: "Financial Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== HUMAN RESOURCES DATA =====
    (employee_data:DataObject {
      id: "data-employee-master",
      name: "Employee Master Data",
      description: "Employee personal information, organizational structure, and employment details",
      classification: "STRICTLY_CONFIDENTIAL",
      format: "HR Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (training_records:DataObject {
      id: "data-training-records",
      name: "Training and Certification Records",
      description: "Employee training history, certifications, and skill assessments",
      classification: "CONFIDENTIAL",
      format: "Learning Management System",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== CUSTOMER SERVICE DATA =====
    (service_tickets:DataObject {
      id: "data-service-tickets",
      name: "Customer Service Tickets",
      description: "Customer support requests, issues, and resolution tracking",
      classification: "INTERNAL",
      format: "Ticketing System Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (warranty_claims:DataObject {
      id: "data-warranty-claims",
      name: "Warranty Claims",
      description: "Product warranty information, claims, and resolution data",
      classification: "CONFIDENTIAL",
      format: "Warranty Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== IT SERVICE MANAGEMENT DATA =====
    (incident_tickets:DataObject {
      id: "data-incident-tickets",
      name: "IT Incident Tickets",
      description: "IT service desk incidents, problems, and resolution data",
      classification: "INTERNAL",
      format: "Service Management Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (change_requests:DataObject {
      id: "data-change-requests",
      name: "IT Change Requests",
      description: "IT infrastructure and application change management data",
      classification: "INTERNAL",
      format: "Service Management Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (asset_inventory:DataObject {
      id: "data-asset-inventory",
      name: "IT Asset Inventory",
      description: "Hardware and software asset tracking and configuration data",
      classification: "INTERNAL",
      format: "Configuration Management Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== LEARNING MATERIALS DATA =====
    (course_materials:DataObject {
      id: "data-course-materials",
      name: "Training Course Materials",
      description: "Learning content, courses, and educational resources",
      classification: "INTERNAL",
      format: "Learning Content Repository",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    // ===== EXPENSE AND BUDGET DATA =====
    (expense_reports:DataObject {
      id: "data-expense-reports",
      name: "Employee Expense Reports",
      description: "Travel expenses, business expenses, and reimbursement data",
      classification: "CONFIDENTIAL",
      format: "Expense Management Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    (budget_forecasts:DataObject {
      id: "data-budget-forecasts",
      name: "Budget and Financial Forecasts",
      description: "Financial planning data, budgets, and forecast models",
      classification: "CONFIDENTIAL",
      format: "Financial Planning Database",
      introductionDate: date("2020-01-01"),
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('Data Objects created successfully.')
}

export async function createDataObjectOwnership(session: Session) {
  console.log('Creating Data Object Ownership relationships...')

  // Customer & Sales Data
  await session.run(`
    MATCH (customer_data:DataObject {id: "data-customer-master"})
    MATCH (sales_orders:DataObject {id: "data-sales-orders"})
    MATCH (dir_sales:Person {id: "person-dir-sales"})
    CREATE (customer_data)-[:OWNED_BY]->(dir_sales)
    CREATE (sales_orders)-[:OWNED_BY]->(dir_sales)
  `)

  await session.run(`
    MATCH (leads_prospects:DataObject {id: "data-leads-prospects"})
    MATCH (dir_marketing:Person {id: "person-dir-marketing"})
    CREATE (leads_prospects)-[:OWNED_BY]->(dir_marketing)
  `)

  // Product & Research Data
  await session.run(`
    MATCH (product_designs:DataObject {id: "data-product-designs"})
    MATCH (research_data:DataObject {id: "data-research-experimental"})
    MATCH (material_specifications:DataObject {id: "data-material-specs"})
    MATCH (vp_rd:Person {id: "person-vp-rd"})
    CREATE (product_designs)-[:OWNED_BY]->(vp_rd)
    CREATE (research_data)-[:OWNED_BY]->(vp_rd)
    CREATE (material_specifications)-[:OWNED_BY]->(vp_rd)
  `)

  // Manufacturing Data
  await session.run(`
    MATCH (production_data:DataObject {id: "data-production-metrics"})
    MATCH (work_orders:DataObject {id: "data-work-orders"})
    MATCH (equipment_data:DataObject {id: "data-equipment-status"})
    MATCH (dir_manufacturing:Person {id: "person-dir-manufacturing"})
    CREATE (production_data)-[:OWNED_BY]->(dir_manufacturing)
    CREATE (work_orders)-[:OWNED_BY]->(dir_manufacturing)
    CREATE (equipment_data)-[:OWNED_BY]->(dir_manufacturing)
  `)

  // Quality Data
  await session.run(`
    MATCH (quality_test_results:DataObject {id: "data-quality-tests"})
    MATCH (compliance_certificates:DataObject {id: "data-compliance-certs"})
    MATCH (defect_tracking:DataObject {id: "data-defect-tracking"})
    MATCH (dir_quality:Person {id: "person-dir-quality"})
    CREATE (quality_test_results)-[:OWNED_BY]->(dir_quality)
    CREATE (compliance_certificates)-[:OWNED_BY]->(dir_quality)
    CREATE (defect_tracking)-[:OWNED_BY]->(dir_quality)
  `)

  // Supply Chain Data
  await session.run(`
    MATCH (supplier_data:DataObject {id: "data-supplier-master"})
    MATCH (purchase_orders:DataObject {id: "data-purchase-orders"})
    MATCH (inventory_data:DataObject {id: "data-inventory-levels"})
    MATCH (vp_supply_chain:Person {id: "person-vp-supply-chain"})
    CREATE (supplier_data)-[:OWNED_BY]->(vp_supply_chain)
    CREATE (purchase_orders)-[:OWNED_BY]->(vp_supply_chain)
    CREATE (inventory_data)-[:OWNED_BY]->(vp_supply_chain)
  `)

  // Financial Data
  await session.run(`
    MATCH (financial_transactions:DataObject {id: "data-financial-transactions"})
    MATCH (cost_accounting:DataObject {id: "data-cost-accounting"})
    MATCH (cfo:Person {id: "person-cfo"})
    CREATE (financial_transactions)-[:OWNED_BY]->(cfo)
    CREATE (cost_accounting)-[:OWNED_BY]->(cfo)
  `)

  // HR Data
  await session.run(`
    MATCH (employee_data:DataObject {id: "data-employee-master"})
    MATCH (training_records:DataObject {id: "data-training-records"})
    MATCH (course_materials:DataObject {id: "data-course-materials"})
    MATCH (dir_hr:Person {id: "person-dir-hr"})
    CREATE (employee_data)-[:OWNED_BY]->(dir_hr)
    CREATE (training_records)-[:OWNED_BY]->(dir_hr)
    CREATE (course_materials)-[:OWNED_BY]->(dir_hr)
  `)

  // Customer Service Data
  await session.run(`
    MATCH (service_tickets:DataObject {id: "data-service-tickets"})
    MATCH (warranty_claims:DataObject {id: "data-warranty-claims"})
    MATCH (dir_cs:Person {id: "person-dir-cs"})
    CREATE (service_tickets)-[:OWNED_BY]->(dir_cs)
    CREATE (warranty_claims)-[:OWNED_BY]->(dir_cs)
  `)

  // IT Service Management Data
  await session.run(`
    MATCH (incident_tickets:DataObject {id: "data-incident-tickets"})
    MATCH (change_requests:DataObject {id: "data-change-requests"})
    MATCH (asset_inventory:DataObject {id: "data-asset-inventory"})
    MATCH (cio:Person {id: "person-cio"})
    CREATE (incident_tickets)-[:OWNED_BY]->(cio)
    CREATE (change_requests)-[:OWNED_BY]->(cio)
    CREATE (asset_inventory)-[:OWNED_BY]->(cio)
  `)

  // Financial Planning Data
  await session.run(`
    MATCH (expense_reports:DataObject {id: "data-expense-reports"})
    MATCH (budget_forecasts:DataObject {id: "data-budget-forecasts"})
    MATCH (cfo:Person {id: "person-cfo"})
    CREATE (expense_reports)-[:OWNED_BY]->(cfo)
    CREATE (budget_forecasts)-[:OWNED_BY]->(cfo)
  `)

  console.log('Data Object ownership relationships created successfully.')
}
