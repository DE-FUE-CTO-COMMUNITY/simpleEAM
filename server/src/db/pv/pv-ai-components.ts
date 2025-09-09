// AI Components for Solar Panel Manufacturing Company
// Intelligent systems supporting various business capabilities and operations

import { Session } from 'neo4j-driver'

export async function createAIComponents(session: Session) {
  console.log('Creating AI Components for Solar Panel Manufacturing...')

  await session.run(`
    CREATE 
    // ===== PREDICTIVE ANALYTICS FOR MANUFACTURING =====
    (quality_prediction:AIComponent {
      id: "ai-quality-prediction",
      name: "Solar Panel Quality Prediction System",
      description: "Machine learning model predicting solar panel defects and quality issues during production",
      aiType: "MACHINE_LEARNING_MODEL",
      model: "Random Forest Classifier",
      version: "v2.1.0",
      status: "ACTIVE",
      accuracy: 94.2,
      trainingDate: date("2024-07-15"),
      lastUpdated: date("2024-08-20"),
      provider: "Internal Development",
      license: "Proprietary",
      costs: 180000.00,
      tags: ["quality-control", "manufacturing", "predictive-analytics"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== COMPUTER VISION FOR INSPECTION =====
    (defect_detection:AIComponent {
      id: "ai-defect-detection",
      name: "Automated Visual Defect Detection",
      description: "Computer vision system for automated detection of surface defects and anomalies in solar panels",
      aiType: "COMPUTER_VISION",
      model: "YOLOv8 Custom",
      version: "v1.3.2",
      status: "ACTIVE",
      accuracy: 96.8,
      trainingDate: date("2024-06-10"),
      lastUpdated: date("2024-09-05"),
      provider: "Internal Development",
      license: "Proprietary",
      costs: 220000.00,
      tags: ["computer-vision", "defect-detection", "quality-assurance"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== PREDICTIVE MAINTENANCE =====
    (maintenance_predictor:AIComponent {
      id: "ai-maintenance-predictor",
      name: "Equipment Maintenance Predictor",
      description: "Predictive analytics system forecasting equipment maintenance needs and potential failures",
      aiType: "PREDICTIVE_ANALYTICS",
      model: "LSTM Neural Network",
      version: "v1.8.1",
      status: "ACTIVE",
      accuracy: 89.5,
      trainingDate: date("2024-05-20"),
      lastUpdated: date("2024-08-30"),
      provider: "Internal Development",
      license: "Proprietary",
      costs: 150000.00,
      tags: ["predictive-maintenance", "equipment", "iot"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== DEMAND FORECASTING =====
    (demand_forecaster:AIComponent {
      id: "ai-demand-forecaster",
      name: "Solar Market Demand Forecaster",
      description: "Advanced analytics system predicting solar panel demand based on market trends and weather patterns",
      aiType: "PREDICTIVE_ANALYTICS",
      model: "Prophet Time Series",
      version: "v2.0.3",
      status: "ACTIVE",
      accuracy: 87.3,
      trainingDate: date("2024-04-15"),
      lastUpdated: date("2024-09-01"),
      provider: "Internal Development",
      license: "Proprietary",
      costs: 125000.00,
      tags: ["demand-forecasting", "market-analysis", "time-series"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== CUSTOMER SERVICE CHATBOT =====
    (customer_chatbot:AIComponent {
      id: "ai-customer-chatbot",
      name: "SolarBot Customer Assistant",
      description: "AI-powered chatbot providing 24/7 customer support and technical assistance for solar panel customers",
      aiType: "CHATBOT",
      model: "GPT-4 Fine-tuned",
      version: "v1.5.0",
      status: "ACTIVE",
      accuracy: 92.1,
      trainingDate: date("2024-08-01"),
      lastUpdated: date("2024-09-06"),
      provider: "OpenAI + Internal",
      license: "Commercial + Proprietary",
      costs: 85000.00,
      tags: ["customer-service", "nlp", "automation"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== SUPPLY CHAIN OPTIMIZATION =====
    (supply_optimizer:AIComponent {
      id: "ai-supply-optimizer",
      name: "Supply Chain Optimization Engine",
      description: "AI system optimizing supply chain logistics, inventory levels, and supplier selection",
      aiType: "DECISION_SUPPORT_SYSTEM",
      model: "Multi-objective Optimization",
      version: "v1.2.4",
      status: "ACTIVE",
      accuracy: 91.7,
      trainingDate: date("2024-03-10"),
      lastUpdated: date("2024-08-25"),
      provider: "Internal Development",
      license: "Proprietary",
      costs: 195000.00,
      tags: ["supply-chain", "optimization", "logistics"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== ENERGY PRODUCTION FORECASTING =====
    (energy_forecaster:AIComponent {
      id: "ai-energy-forecaster",
      name: "Solar Energy Production Forecaster",
      description: "Deep learning model predicting solar energy output based on weather data and panel performance",
      aiType: "DEEP_LEARNING_MODEL",
      model: "Transformer Neural Network",
      version: "v1.4.1",
      status: "ACTIVE",
      accuracy: 93.6,
      trainingDate: date("2024-07-01"),
      lastUpdated: date("2024-09-03"),
      provider: "Internal Development",
      license: "Proprietary",
      costs: 165000.00,
      tags: ["energy-forecasting", "weather-data", "performance"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== RECOMMENDATION ENGINE =====
    (product_recommender:AIComponent {
      id: "ai-product-recommender",
      name: "Solar Solution Recommendation Engine",
      description: "AI system recommending optimal solar panel configurations based on customer requirements and conditions",
      aiType: "RECOMMENDATION_ENGINE",
      model: "Collaborative Filtering + Content-Based",
      version: "v2.2.0",
      status: "ACTIVE",
      accuracy: 88.9,
      trainingDate: date("2024-06-05"),
      lastUpdated: date("2024-08-28"),
      provider: "Internal Development",
      license: "Proprietary",
      costs: 110000.00,
      tags: ["recommendations", "customer-experience", "sales"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== AUTOMATED PRICING =====
    (pricing_engine:AIComponent {
      id: "ai-pricing-engine",
      name: "Dynamic Pricing Optimization System",
      description: "AI-driven pricing engine optimizing solar panel prices based on market conditions and competition",
      aiType: "DECISION_SUPPORT_SYSTEM",
      model: "Reinforcement Learning",
      version: "v1.1.2",
      status: "TESTING",
      accuracy: 85.4,
      trainingDate: date("2024-08-10"),
      lastUpdated: date("2024-09-07"),
      provider: "Internal Development",
      license: "Proprietary",
      costs: 140000.00,
      tags: ["pricing", "optimization", "market-intelligence"],
      createdAt: datetime(),
      updatedAt: datetime()
    }),
    
    // ===== SUSTAINABILITY ANALYTICS =====
    (sustainability_analyzer:AIComponent {
      id: "ai-sustainability-analyzer",
      name: "Carbon Footprint Analytics System",
      description: "AI system analyzing and optimizing the environmental impact and sustainability metrics of operations",
      aiType: "PREDICTIVE_ANALYTICS",
      model: "Ensemble Machine Learning",
      version: "v1.0.5",
      status: "DEPLOYED",
      accuracy: 90.2,
      trainingDate: date("2024-05-15"),
      lastUpdated: date("2024-08-22"),
      provider: "Internal Development",
      license: "Proprietary",
      costs: 95000.00,
      tags: ["sustainability", "carbon-footprint", "environmental"],
      createdAt: datetime(),
      updatedAt: datetime()
    })
  `)

  console.log('✅ AI Components created successfully')
}

export async function createAIComponentOwnership(session: Session) {
  console.log('Creating AI Component Ownership relationships...')

  await session.run(`
    MATCH 
      // AI Component owners
      (quality_prediction:AIComponent {id: "ai-quality-prediction"}),
      (defect_detection:AIComponent {id: "ai-defect-detection"}),
      (maintenance_predictor:AIComponent {id: "ai-maintenance-predictor"}),
      (demand_forecaster:AIComponent {id: "ai-demand-forecaster"}),
      (customer_chatbot:AIComponent {id: "ai-customer-chatbot"}),
      (supply_optimizer:AIComponent {id: "ai-supply-optimizer"}),
      (energy_forecaster:AIComponent {id: "ai-energy-forecaster"}),
      (product_recommender:AIComponent {id: "ai-product-recommender"}),
      (pricing_engine:AIComponent {id: "ai-pricing-engine"}),
      (sustainability_analyzer:AIComponent {id: "ai-sustainability-analyzer"}),
      
      // Persons
      (cto:Person {id: "person-cto"}),
      (data_scientist:Person {id: "person-data-scientist"}),
      (ai_architect:Person {id: "person-ai-architect"}),
      (ml_engineer:Person {id: "person-ml-engineer"}),
      (qa_manager:Person {id: "person-qa-manager"}),
      (operations_manager:Person {id: "person-operations-manager"}),
      (customer_service_manager:Person {id: "person-customer-service-manager"}),
      (supply_chain_manager:Person {id: "person-supply-chain-manager"}),
      (sales_manager:Person {id: "person-sales-manager"}),
      (sustainability_manager:Person {id: "person-sustainability-manager"})
      
    CREATE 
      // Quality Prediction - owned by Data Scientist
      (quality_prediction)-[:OWNED_BY]->(data_scientist),
      
      // Defect Detection - owned by QA Manager
      (defect_detection)-[:OWNED_BY]->(qa_manager),
      
      // Maintenance Predictor - owned by Operations Manager
      (maintenance_predictor)-[:OWNED_BY]->(operations_manager),
      
      // Demand Forecaster - owned by Data Scientist
      (demand_forecaster)-[:OWNED_BY]->(data_scientist),
      
      // Customer Chatbot - owned by Customer Service Manager
      (customer_chatbot)-[:OWNED_BY]->(customer_service_manager),
      
      // Supply Optimizer - owned by Supply Chain Manager
      (supply_optimizer)-[:OWNED_BY]->(supply_chain_manager),
      
      // Energy Forecaster - owned by AI Architect
      (energy_forecaster)-[:OWNED_BY]->(ai_architect),
      
      // Product Recommender - owned by Sales Manager
      (product_recommender)-[:OWNED_BY]->(sales_manager),
      
      // Pricing Engine - owned by ML Engineer
      (pricing_engine)-[:OWNED_BY]->(ml_engineer),
      
      // Sustainability Analyzer - owned by Sustainability Manager
      (sustainability_analyzer)-[:OWNED_BY]->(sustainability_manager)
  `)

  console.log('✅ AI Component ownership relationships created successfully')
}
