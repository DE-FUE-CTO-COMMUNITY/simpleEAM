// ─────────────────────────────────────────────────────────────────────────────
// AUTO-GENERATED — do not edit manually.
// Run `yarn generate-schema-digest` after schema changes.
// Source: http://localhost:4500/graphql
// Generated: 2026-04-01T15:17:24.171Z
// ─────────────────────────────────────────────────────────────────────────────

export const SCHEMA_DIGEST = `
QUERYABLE ENTITY COLLECTIONS:
IMPORTANT: Every query MUST include company: { some: { id: { eq: "<companyId>" } } } in the where clause to scope results to the current company.

businessCapabilities(where: BusinessCapabilityWhere, limit: Int, offset: Int, sort: [BusinessCapabilitySort!])
  FIELDS: id name description maturityLevel status(CapabilityStatus) type(CapabilityType) businessValue sequenceNumber tags introductionDate endDate
  RELATIONS: usedByOrganisations[Organisation]  parents[BusinessCapability]  children[BusinessCapability]  supportedByApplications[Application]  supportedByAIComponents[AIComponent]  supportedByBusinessProcesses[BusinessProcess]  relatedDataObjects[DataObject]

businessProcesses(where: BusinessProcessWhere, limit: Int, offset: Int, sort: [BusinessProcessSort!])
  FIELDS: id name description processType(ProcessType) status(ProcessStatus) maturityLevel category tags
  RELATIONS: usedByOrganisations[Organisation]  parentProcess[BusinessProcess]  childProcesses[BusinessProcess]  supportsCapabilities[BusinessCapability]  supportedByApplications[Application]

geaVisions(where: GEA_VisionWhere, limit: Int, offset: Int, sort: [GEA_VisionSort!])
  FIELDS: id name visionStatement timeHorizon year
  RELATIONS: supportsMissions[GEA_Mission]  supportedByGoals[GEA_Goal]  supportedByValues[GEA_Value]

geaMissions(where: GEA_MissionWhere, limit: Int, offset: Int, sort: [GEA_MissionSort!])
  FIELDS: id name purposeStatement keywords year
  RELATIONS: supportedByVisions[GEA_Vision]  supportedByValues[GEA_Value]  supportedByGoals[GEA_Goal]

geaValues(where: GEA_ValueWhere, limit: Int, offset: Int, sort: [GEA_ValueSort!])
  FIELDS: id name valueStatement
  RELATIONS: supportsMissions[GEA_Mission]  supportsVisions[GEA_Vision]

geaGoals(where: GEA_GoalWhere, limit: Int, offset: Int, sort: [GEA_GoalSort!])
  FIELDS: id name goalStatement
  RELATIONS: operationalizesVisions[GEA_Vision]  supportsMissions[GEA_Mission]  supportsValues[GEA_Value]  achievedByStrategies[GEA_Strategy]

geaStrategies(where: GEA_StrategyWhere, limit: Int, offset: Int, sort: [GEA_StrategySort!])
  FIELDS: id name description
  RELATIONS: achievesGoals[GEA_Goal]

people(where: PersonWhere, limit: Int, offset: Int, sort: [PersonSort!])
  FIELDS: id firstName lastName email department role phone avatarUrl
  RELATIONS: companies[Company]  ownedCapabilities[BusinessCapability]  ownedApplications[Application]  ownedDataObjects[DataObject]  ownedArchitectures[Architecture]  ownedInfrastructure[Infrastructure]  ownedInterfaces[ApplicationInterface]  ownedAIComponents[AIComponent]  ownedBusinessProcesses[BusinessProcess]  ownedGEAVisions[GEA_Vision]  ownedGEAMissions[GEA_Mission]  ownedGEAValues[GEA_Value]  ownedGEAGoals[GEA_Goal]  ownedGEAStrategies[GEA_Strategy]

suppliers(where: SupplierWhere, limit: Int, offset: Int, sort: [SupplierSort!])
  FIELDS: id name description supplierType(SupplierType) status(SupplierStatus) address phone email website primaryContactPerson contractStartDate contractEndDate annualSpend riskClassification(RiskClassification) strategicImportance(StrategicImportance) performanceRating complianceCertifications tags
  RELATIONS: providesApplications[Application]  supportsApplications[Application]  maintainsApplications[Application]  providesAIComponents[AIComponent]  supportsAIComponents[AIComponent]  maintainsAIComponents[AIComponent]  providesInfrastructure[Infrastructure]  hostsInfrastructure[Infrastructure]  maintainsInfrastructure[Infrastructure]  developsSoftwareProducts[SoftwareProduct]  providesSoftwareProducts[SoftwareProduct]  maintainsSoftwareProducts[SoftwareProduct]  manufacturesHardwareProducts[HardwareProduct]  providesHardwareProducts[HardwareProduct]  maintainsHardwareProducts[HardwareProduct]

applications(where: ApplicationWhere, limit: Int, offset: Int, sort: [ApplicationSort!])
  FIELDS: id name description status(ApplicationStatus) criticality(CriticalityLevel) timeCategory(TimeCategory) sevenRStrategy(SevenRStrategy) technologyStack version hostingEnvironment vendor costs introductionDate endOfLifeDate planningDate endOfUseDate
  RELATIONS: usedByOrganisations[Organisation]  parents[Application]  components[Application]  predecessors[Application]  successors[Application]  supportsCapabilities[BusinessCapability]  supportsBusinessProcesses[BusinessProcess]  usesDataObjects[DataObject]  isDataSourceFor[DataObject]  sourceOfInterfaces[ApplicationInterface]  targetOfInterfaces[ApplicationInterface]  hostedOn[Infrastructure]  usesSoftwareProducts[SoftwareProduct]  softwareVersions[SoftwareVersion]  usesAIComponents[AIComponent]  providedBy[Supplier]  supportedBy[Supplier]  maintainedBy[Supplier]

applicationInterfaces(where: ApplicationInterfaceWhere, limit: Int, offset: Int, sort: [ApplicationInterfaceSort!])
  FIELDS: id name description interfaceType(InterfaceType) protocol(InterfaceProtocol) version status(InterfaceStatus) introductionDate endOfLifeDate planningDate endOfUseDate
  RELATIONS: usedByOrganisations[Organisation]  predecessors[ApplicationInterface]  successors[ApplicationInterface]  sourceApplications[Application]  targetApplications[Application]  dataObjects[DataObject]

dataObjects(where: DataObjectWhere, limit: Int, offset: Int, sort: [DataObjectSort!])
  FIELDS: id name description classification(DataClassification) format introductionDate endOfLifeDate planningDate endOfUseDate
  RELATIONS: usedByOrganisations[Organisation]  dataSources[Application]  usedByApplications[Application]  relatedToCapabilities[BusinessCapability]  transferredInInterfaces[ApplicationInterface]  usedForTrainingAI[AIComponent]  relatedDataObjects[DataObject]  inverseRelatedDataObjects[DataObject]

infrastructures(where: InfrastructureWhere, limit: Int, offset: Int, sort: [InfrastructureSort!])
  FIELDS: id name description infrastructureType(InfrastructureType) status(InfrastructureStatus) vendor version capacity location ipAddress operatingSystem specifications maintenanceWindow costs introductionDate endOfLifeDate planningDate endOfUseDate
  RELATIONS: usedByOrganisations[Organisation]  parentInfrastructure[Infrastructure]  childInfrastructures[Infrastructure]  hostsApplications[Application]  hostsAIComponents[AIComponent]  usesSoftwareProducts[SoftwareProduct]  usesHardwareProducts[HardwareProduct]  softwareVersions[SoftwareVersion]  providedBy[Supplier]  hostedBy[Supplier]  maintainedBy[Supplier]

softwareProducts(where: SoftwareProductWhere, limit: Int, offset: Int, sort: [SoftwareProductSort!])
  FIELDS: id name lifecycleStatus(LifecycleStatus) isActive
  RELATIONS: usedByApplications[Application]  usedByInfrastructure[Infrastructure]  versions[SoftwareVersion]  developedBy[Supplier]  providedBy[Supplier]  maintainedBy[Supplier]

softwareVersions(where: SoftwareVersionWhere, limit: Int, offset: Int, sort: [SoftwareVersionSort!])
  FIELDS: id name version releaseChannel isLts supportTier
  RELATIONS: softwareProduct[SoftwareProduct]  usedByApplications[Application]  usedByInfrastructure[Infrastructure]

hardwareProducts(where: HardwareProductWhere, limit: Int, offset: Int, sort: [HardwareProductSort!])
  FIELDS: id name lifecycleStatus(LifecycleStatus) isActive
  RELATIONS: usedByInfrastructure[Infrastructure]  manufacturedBy[Supplier]  providedBy[Supplier]  maintainedBy[Supplier]

aiComponents(where: AIComponentWhere, limit: Int, offset: Int, sort: [AIComponentSort!])
  FIELDS: id name description aiType(AIComponentType) model version status(AIComponentStatus) accuracy trainingDate lastUpdated provider license costs tags
  RELATIONS: usedByOrganisations[Organisation]  trainedWithDataObjects[DataObject]  usedByApplications[Application]  supportsCapabilities[BusinessCapability]  hostedOn[Infrastructure]  providedBy[Supplier]  supportedBy[Supplier]  maintainedBy[Supplier]

companies(where: CompanyWhere, limit: Int, offset: Int, sort: [CompanySort!])
  FIELDS: id name description address website industry size(CompanySize) primaryColor secondaryColor font diagramFont logo features llmUrl llmModel llmKey strategicAutonomyPriority resiliencePriority securityPriority controlPriority expectedSovereigntyScore achievedSovereigntyScore sovereigntyGap sovereigntyScorePercent sovereigntyScoreStatus
  RELATIONS: organisations[Organisation]  ownedCapabilities[BusinessCapability]  ownedApplications[Application]  ownedDataObjects[DataObject]  ownedInterfaces[ApplicationInterface]  ownedInfrastructure[Infrastructure]  ownedAIComponents[AIComponent]  ownedBusinessProcesses[BusinessProcess]  ownedGEAVisions[GEA_Vision]  ownedGEAMissions[GEA_Mission]  ownedGEAValues[GEA_Value]  ownedGEAGoals[GEA_Goal]  ownedGEAStrategies[GEA_Strategy]  employees[Person]  ownedArchitectures[Architecture]  ownedArchitecturePrinciples[ArchitecturePrinciple]  ownedSuppliers[Supplier]

organisations(where: OrganisationWhere, limit: Int, offset: Int, sort: [OrganisationSort!])
  FIELDS: id name description type(OrganisationType) level
  RELATIONS: parentOrganisation[Organisation]  childOrganisations[Organisation]  usedCapabilities[BusinessCapability]  usedApplications[Application]  usedDataObjects[DataObject]  usedInterfaces[ApplicationInterface]  usedInfrastructure[Infrastructure]  usedAIComponents[AIComponent]  usedBusinessProcesses[BusinessProcess]

architectures(where: ArchitectureWhere, limit: Int, offset: Int, sort: [ArchitectureSort!])
  FIELDS: id name description timestamp domain(ArchitectureDomain) type(ArchitectureType) tags expectedSovereigntyScore achievedSovereigntyScore sovereigntyGap sovereigntyScorePercent
  RELATIONS: containsCapabilities[BusinessCapability]  containsBusinessProcesses[BusinessProcess]  containsApplications[Application]  containsDataObjects[DataObject]  containsInterfaces[ApplicationInterface]  containsInfrastructure[Infrastructure]  containsAIComponents[AIComponent]  containsGEAVisions[GEA_Vision]  containsGEAMissions[GEA_Mission]  containsGEAValues[GEA_Value]  containsGEAGoals[GEA_Goal]  containsGEAStrategies[GEA_Strategy]  parentArchitecture[Architecture]  childArchitectures[Architecture]  appliedPrinciples[ArchitecturePrinciple]

architecturePrinciples(where: ArchitecturePrincipleWhere, limit: Int, offset: Int, sort: [ArchitecturePrincipleSort!])
  FIELDS: id name description category(PrincipleCategory) priority(PrinciplePriority) rationale implications tags isActive
  RELATIONS: appliedInArchitectures[Architecture]  implementedByApplications[Application]  implementedByAIComponents[AIComponent]

COUNT QUERIES (returns integer totals, no data):
  businessCapabilitiesConnection(where: ...) { aggregate { count { nodes } } }
  businessProcessesConnection(where: ...) { aggregate { count { nodes } } }
  geaVisionsConnection(where: ...) { aggregate { count { nodes } } }
  geaMissionsConnection(where: ...) { aggregate { count { nodes } } }
  geaValuesConnection(where: ...) { aggregate { count { nodes } } }
  geaGoalsConnection(where: ...) { aggregate { count { nodes } } }
  geaStrategiesConnection(where: ...) { aggregate { count { nodes } } }
  peopleConnection(where: ...) { aggregate { count { nodes } } }
  suppliersConnection(where: ...) { aggregate { count { nodes } } }
  applicationsConnection(where: ...) { aggregate { count { nodes } } }
  applicationInterfacesConnection(where: ...) { aggregate { count { nodes } } }
  dataObjectsConnection(where: ...) { aggregate { count { nodes } } }
  infrastructuresConnection(where: ...) { aggregate { count { nodes } } }
  softwareProductsConnection(where: ...) { aggregate { count { nodes } } }
  softwareVersionsConnection(where: ...) { aggregate { count { nodes } } }
  hardwareProductsConnection(where: ...) { aggregate { count { nodes } } }
  aiComponentsConnection(where: ...) { aggregate { count { nodes } } }
  companiesConnection(where: ...) { aggregate { count { nodes } } }
  organisationsConnection(where: ...) { aggregate { count { nodes } } }
  architecturesConnection(where: ...) { aggregate { count { nodes } } }
  architecturePrinciplesConnection(where: ...) { aggregate { count { nodes } } }

FILTER SYNTAX (all values inline — do NOT use $variables):
  String:    { name: { contains: "CRM" } }  or  { name: { eq: "ExactName" } }  or  { name: { startsWith: "A" } }
  Enum eq:   { status: { eq: ACTIVE } }                   ← no quotes around enum values
  Enum in:   { status: { in: [ACTIVE, PLANNED] } }
  Null:      { description: { isNull: false } }
  Relation:  { supportsCapabilities: { some: { name: { contains: "CRM" } } } }
             { supportedByApplications: { none: {} } }    ← gap/absence queries
             { dataObjects: { some: { classification: { eq: CONFIDENTIAL } } } }
  AND / OR:  { AND: [{ status: { eq: ACTIVE } }, { criticality: { eq: HIGH } }] }
             { OR:  [{ name: { contains: "ERP" } }, { name: { contains: "SAP" } }] }

PAGINATION AND SORT:
  limit: 50                          ← set a limit to avoid huge responses (default: 50)
  sort: [{ fieldName: ASC }]         ← sort by any scalar field; direction: ASC or DESC
  offset: 0                          ← for pagination

ENUM VALUES:
  AIComponentStatus: IN_DEVELOPMENT | TRAINING | TESTING | DEPLOYED | ACTIVE | DEPRECATED | RETIRED
  AIComponentType: MACHINE_LEARNING_MODEL | DEEP_LEARNING_MODEL | NATURAL_LANGUAGE_PROCESSING | COMPUTER_VISION | RECOMMENDATION_ENGINE | PREDICTIVE_ANALYTICS | CHATBOT | VOICE_ASSISTANT | DECISION_SUPPORT_SYSTEM | AUTOMATION_ENGINE | GENERATIVE_AI | AGENTIC_AI | RAG | OTHER
  ApplicationStatus: ACTIVE | IN_DEVELOPMENT | RETIRED
  ArchitectureDomain: BUSINESS | DATA | APPLICATION | TECHNOLOGY | SECURITY | INTEGRATION | ENTERPRISE
  ArchitectureType: CURRENT_STATE | FUTURE_STATE | TRANSITION | CONCEPTUAL
  CapabilityStatus: ACTIVE | PLANNED | RETIRED
  CapabilityType: STRATEGIC | OPERATIONAL | SUPPORT
  CompanySize: STARTUP | SMALL | MEDIUM | LARGE | ENTERPRISE | MULTINATIONAL
  CriticalityLevel: LOW | MEDIUM | HIGH | CRITICAL
  DataClassification: PUBLIC | INTERNAL | CONFIDENTIAL | STRICTLY_CONFIDENTIAL
  DiagramType: ARCHITECTURE | APPLICATION_LANDSCAPE | CAPABILITY_MAP | DATA_FLOW | PROCESS | NETWORK | INTEGRATION_ARCHITECTURE | SECURITY_ARCHITECTURE | CONCEPTUAL | OTHER
  InfrastructureStatus: ACTIVE | INACTIVE | MAINTENANCE | PLANNED | DECOMMISSIONED | UNDER_CONSTRUCTION
  InfrastructureType: CLOUD_DATACENTER | ON_PREMISE_DATACENTER | KUBERNETES_CLUSTER | VIRTUALIZATION_CLUSTER | VIRTUAL_MACHINE | CONTAINER_HOST | PHYSICAL_SERVER | IOT_GATEWAY | IOT_PLATFORM
  InterfaceProtocol: REST | SOAP | GRAPHQL | HTTP | HTTPS | FTP | SFTP | TCP | UDP | SMTP | LDAP | JDBC | ODBC | ORACLE | MQTT | OTHER
  InterfaceStatus: ACTIVE | IN_DEVELOPMENT | OUT_OF_SERVICE | PLANNED | DEPRECATED
  InterfaceType: API | FILE | DATABASE | MESSAGE_QUEUE | OTHER
  LifecycleStatus: SUPPORTED | APPROACHING_EOS | APPROACHING_EOL | EOS | EOL | UNSUPPORTED
  OrganisationType: DIVISION | DEPARTMENT | TEAM | PROJECT | FUNCTION | SUBSIDIARY | BRANCH | UNIT
  PrincipleCategory: BUSINESS | DATA | APPLICATION | TECHNOLOGY | SECURITY | INTEGRATION | GOVERNANCE | COMPLIANCE | PERFORMANCE | SCALABILITY | RELIABILITY | MAINTAINABILITY | INTEROPERABILITY | REUSABILITY | FLEXIBILITY | COST_OPTIMIZATION
  PrinciplePriority: LOW | MEDIUM | HIGH | CRITICAL
  ProcessStatus: ACTIVE | PLANNED | RETIRED
  ProcessType: CORE | SUPPORT | MANAGEMENT
  ProductFamilyCategory: COMPUTE_END_USER_DEVICES | NETWORK_DEVICES | STORAGE_DATA_INFRASTRUCTURE | SECURITY_HARDWARE | PERIPHERALS_OUTPUT_DEVICES | DATA_CENTER_INFRASTRUCTURE | OPERATING_PLATFORM_SOFTWARE | INFRASTRUCTURE_PLATFORM_SOFTWARE | CLOUD_PLATFORM_SERVICES | SECURITY_SOFTWARE | MANAGEMENT_OPERATIONS_SOFTWARE | END_USER_COLLABORATION_SOFTWARE | DEVELOPMENT_ENGINEERING_SOFTWARE | BUSINESS_ENTERPRISE_APPLICATIONS
  ProductFamilyType: HARDWARE | SOFTWARE
  RiskClassification: LOW | MEDIUM | HIGH | CRITICAL
  SevenRStrategy: RETIRE | RETAIN | REHOST | REPLATFORM | REFACTOR | REARCHITECT | REPLACE
  SovereigntyMaturity: NONE | LOW | MEDIUM | HIGH | VERY_HIGH
  StrategicImportance: LOW | MEDIUM | HIGH | STRATEGIC
  SupplierStatus: ACTIVE | POTENTIAL | INACTIVE | BLOCKED
  SupplierType: SOFTWARE_VENDOR | SERVICE_PROVIDER | CONSULTANT | HARDWARE_VENDOR | CLOUD_PROVIDER
  TimeCategory: TOLERATE | INVEST | MIGRATE | ELIMINATE

EXAMPLE QUERIES:

# List all business capabilities:
query {
  businessCapabilities(limit: 50, sort: [{ name: ASC }]) {
    id name description status maturityLevel
    supportedByApplications { id name status }
  }
}

# Applications supporting a specific capability and hosted on a specific infrastructure:
query {
  applications(where: {
    supportsCapabilities: { some: { name: { contains: "Customer Management" } } }
    hostedOn: { some: { name: { contains: "AWS" } } }
  }, limit: 50) {
    id name status criticality
    supportsCapabilities { id name }
    hostedOn { id name infrastructureType }
  }
}

# Interfaces transferring CONFIDENTIAL data with source and target applications:
query {
  applicationInterfaces(where: {
    dataObjects: { some: { classification: { eq: CONFIDENTIAL } } }
  }, limit: 50) {
    id name interfaceType status
    sourceApplications { id name }
    targetApplications { id name }
    dataObjects { id name classification }
  }
}

# Capabilities not supported by any application (gap analysis):
query {
  businessCapabilities(where: {
    supportedByApplications: { none: {} }
    status: { eq: ACTIVE }
  }, limit: 50) {
    id name description maturityLevel
  }
}

# Count active applications:
query {
  applicationsConnection(where: { status: { eq: ACTIVE } }) {
    aggregate { count { nodes } }
  }
}
`.trim()
