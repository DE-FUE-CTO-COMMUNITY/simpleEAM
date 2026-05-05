0. Core Principle (Copilot MUST strictly follow this)

Neo4j is the single source of truth.
LLMs reason over the graph; they do not guess facts.
All answers must be graph-grounded.
No free-form Cypher queries without a whitelist.
No embeddings / vector search for structured EAM objects.
If information is missing, generate a clarifying question instead of guessing.

📦 1. Artifacts to Generate FIRST (order is mandatory)
Copilot MUST generate the artifacts in this order:

Concept Dictionary (canonical node types + synonyms)
Intent Schema (which question types exist)
Entity Resolution Rules (description -> candidates)
Graph Query Library (Cypher patterns, read-only)
Agent Routing Logic (who is allowed to do what)

🧩 2. Artifact 1 - Concept Dictionary
Task for Copilot

Create a versioned concept dictionary for Enterprise Architecture.

Rules

One canonical type per graph node type.
Synonyms are localized mappings keyed by language, not separate types.
Supported synonym locales MUST match the application locales: de, en, fr.
Format: JSON, machine-readable.
Expected output format

{
"BusinessCapability": {
"description": "Business capability within Enterprise Architecture Management",
"synonyms": {
"de": ["Geschaeftsfaehigkeit", "Faehigkeit", "Business Capability"],
"en": ["Business Capability", "Capability", "Business function"],
"fr": ["Capacite metier", "Capacite", "Fonction metier"]
},
"graphLabel": "BusinessCapability"
},
"BusinessProcess": {
"description": "Business process within Enterprise Architecture Management",
"synonyms": {
"de": ["Geschaeftsprozess", "Prozess", "Ablauf"],
"en": ["Business Process", "Process", "Workflow"],
"fr": ["Processus metier", "Processus", "Workflow"]
},
"graphLabel": "BusinessProcess"
},
"GEA_Vision": {
"description": "Vision within General Enterprise Architecture",
"synonyms": {
"de": ["Vision", "GEA Vision", "Unternehmensvision"],
"en": ["Vision", "GEA Vision", "Enterprise Vision"],
"fr": ["Vision", "Vision GEA", "Vision d entreprise"]
},
"graphLabel": "GEA_Vision"
},
"GEA_Mission": {
"description": "Mission within General Enterprise Architecture",
"synonyms": {
"de": ["Mission", "GEA Mission", "Unternehmensmission"],
"en": ["Mission", "GEA Mission", "Enterprise Mission"],
"fr": ["Mission", "Mission GEA", "Mission d entreprise"]
},
"graphLabel": "GEA_Mission"
},
"GEA_Value": {
"description": "Value within General Enterprise Architecture",
"synonyms": {
"de": ["Wert", "GEA Wert", "Unternehmenswert"],
"en": ["Value", "GEA Value", "Enterprise Value"],
"fr": ["Valeur", "Valeur GEA", "Valeur d entreprise"]
},
"graphLabel": "GEA_Value"
},
"GEA_Goal": {
"description": "Goal within General Enterprise Architecture",
"synonyms": {
"de": ["Ziel", "GEA Ziel", "Unternehmensziel"],
"en": ["Goal", "GEA Goal", "Enterprise Goal"],
"fr": ["Objectif", "Objectif GEA", "Objectif d entreprise"]
},
"graphLabel": "GEA_Goal"
},
"GEA_Strategy": {
"description": "Strategy within General Enterprise Architecture",
"synonyms": {
"de": ["Strategie", "GEA Strategie", "Unternehmensstrategie"],
"en": ["Strategy", "GEA Strategy", "Enterprise Strategy"],
"fr": ["Strategie", "Strategie GEA", "Strategie d entreprise"]
},
"graphLabel": "GEA_Strategy"
},
"AiRun": {
"description": "Orchestration and review state for AI generated drafts",
"synonyms": {
"de": ["KI Lauf", "Generierungslauf", "Entwurfslauf"],
"en": ["AI Run", "Generation Run", "Draft Run"],
"fr": ["Execution IA", "Execution de generation", "Execution de brouillon"]
},
"graphLabel": "AiRun"
},
"AiRunAuditEvent": {
"description": "Immutable audit trail entry for AI run approval actions",
"synonyms": {
"de": ["KI Lauf Audit Ereignis", "Audit Ereignis", "Freigabe Ereignis"],
"en": ["AI Run Audit Event", "Audit Event", "Approval Event"],
"fr": ["Evenement d audit d execution IA", "Evenement d audit", "Evenement d approbation"]
},
"graphLabel": "AiRunAuditEvent"
},
"AgentConfig": {
"description": "Persisted configuration for backend agents",
"synonyms": {
"de": ["Agent Konfiguration", "Agenten Konfiguration", "Backend Agent Konfiguration"],
"en": ["Agent Config", "Agent Configuration", "Backend Agent Config"],
"fr": ["Configuration d agent", "Configuration des agents", "Configuration backend d agent"]
},
"graphLabel": "AgentConfig"
},
"Person": {
"description": "Individual within the organization",
"synonyms": {
"de": ["Person", "Individuum", "Kontakt"],
"en": ["Person", "Individual", "Contact"],
"fr": ["Personne", "Individu", "Contact"]
},
"graphLabel": "Person"
},
"ReportFolder": {
"description": "Folder organizing analytics reports within a company",
"synonyms": {
"de": ["Berichtsordner", "Analyseordner", "Ordner"],
"en": ["Report Folder", "Analytics Folder", "Folder"],
"fr": ["Dossier de rapports", "Dossier analytique", "Dossier"]
},
"graphLabel": "ReportFolder"
},
"AnalyticsReport": {
"description": "Saved analytics report definition",
"synonyms": {
"de": ["Analysebericht", "Gespeicherter Bericht", "Bericht"],
"en": ["Analytics Report", "Saved Report", "Report"],
"fr": ["Rapport analytique", "Rapport enregistre", "Rapport"]
},
"graphLabel": "AnalyticsReport"
},
"Supplier": {
"description": "Supplier or vendor providing products or services",
"synonyms": {
"de": ["Lieferant", "Anbieter", "Dienstleister"],
"en": ["Supplier", "Vendor", "Provider"],
"fr": ["Fournisseur", "Vendeur", "Prestataire"]
},
"graphLabel": "Supplier"
},
"Application": {
"description": "Business application within Enterprise Architecture Management",
"synonyms": {
"de": ["Anwendung", "Applikation", "IT System", "Softwaresystem"],
"en": ["Application", "App", "Software System", "IT System"],
"fr": ["Application", "Appli", "Systeme logiciel", "Systeme informatique"]
},
"graphLabel": "Application"
},
"ApplicationInterface": {
"description": "Interface between applications",
"synonyms": {
"de": ["Applikationsschnittstelle", "Schnittstelle", "Systemschnittstelle"],
"en": ["Application Interface", "Interface", "System Interface"],
"fr": ["Interface applicative", "Interface", "Interface systeme"]
},
"graphLabel": "ApplicationInterface"
},
"DataObject": {
"description": "Business data object within Enterprise Architecture Management",
"synonyms": {
"de": ["Datenobjekt", "Fachliches Datenobjekt", "Informationsobjekt"],
"en": ["Data Object", "Business Data", "Information Object"],
"fr": ["Objet de donnees", "Donnee metier", "Objet d information"]
},
"graphLabel": "DataObject"
},
"Infrastructure": {
"description": "Infrastructure component within Enterprise Architecture Management",
"synonyms": {
"de": ["Infrastruktur", "Infrastrukturkomponente", "Plattform"],
"en": ["Infrastructure", "Infrastructure Component", "Platform"],
"fr": ["Infrastructure", "Composant d infrastructure", "Plateforme"]
},
"graphLabel": "Infrastructure"
},
"SoftwareProduct": {
"description": "Normalized software product for technology lifecycle management",
"synonyms": {
"de": ["Softwareprodukt", "Software", "Technologieprodukt"],
"en": ["Software Product", "Software", "Technology Product"],
"fr": ["Produit logiciel", "Logiciel", "Produit technologique"]
},
"graphLabel": "SoftwareProduct"
},
"SoftwareVersion": {
"description": "Version metadata for a software product",
"synonyms": {
"de": ["Softwareversion", "Version", "Release"],
"en": ["Software Version", "Version", "Release"],
"fr": ["Version logicielle", "Version", "Release"]
},
"graphLabel": "SoftwareVersion"
},
"HardwareProduct": {
"description": "Normalized hardware product for technology lifecycle management",
"synonyms": {
"de": ["Hardwareprodukt", "Hardware", "Geraeteprodukt"],
"en": ["Hardware Product", "Hardware", "Device Product"],
"fr": ["Produit materiel", "Materiel", "Produit d equipement"]
},
"graphLabel": "HardwareProduct"
},
"HardwareVersion": {
"description": "Version or model metadata for a hardware product",
"synonyms": {
"de": ["Hardwareversion", "Hardwaremodell", "Modell"],
"en": ["Hardware Version", "Hardware Model", "Model"],
"fr": ["Version materielle", "Modele materiel", "Modele"]
},
"graphLabel": "HardwareVersion"
},
"ProductFamily": {
"description": "Shared family taxonomy for software and hardware products",
"synonyms": {
"de": ["Produktfamilie", "Familie", "Produktlinie"],
"en": ["Product Family", "Family", "Product Line"],
"fr": ["Famille de produits", "Famille", "Ligne de produits"]
},
"graphLabel": "ProductFamily"
},
"SbomDocument": {
"description": "Software Bill of Materials evidence document",
"synonyms": {
"de": ["SBOM Dokument", "Software Bill of Materials", "Stuecklistendokument"],
"en": ["SBOM Document", "Software Bill of Materials", "SBOM"],
"fr": ["Document SBOM", "Nomenclature logicielle", "SBOM"]
},
"graphLabel": "SbomDocument"
},
"LifecycleRecord": {
"description": "Lifecycle metadata for software or hardware versions",
"synonyms": {
"de": ["Lifecycle Eintrag", "Lebenszyklus", "Support Lebenszyklus"],
"en": ["Lifecycle Record", "Lifecycle", "Support Lifecycle"],
"fr": ["Enregistrement de cycle de vie", "Cycle de vie", "Cycle de support"]
},
"graphLabel": "LifecycleRecord"
},
"AIComponent": {
"description": "AI component within Enterprise Architecture Management",
"synonyms": {
"de": ["KI Komponente", "KI Service", "ML Komponente"],
"en": ["AI Component", "AI Service", "ML Component"],
"fr": ["Composant IA", "Service IA", "Composant ML"]
},
"graphLabel": "AIComponent"
},
"Company": {
"description": "Company within Enterprise Architecture Management",
"synonyms": {
"de": ["Unternehmen", "Firma", "Rechtseinheit"],
"en": ["Company", "Enterprise", "Legal Entity"],
"fr": ["Entreprise", "Societe", "Entite legale"]
},
"graphLabel": "Company"
},
"Organisation": {
"description": "Organizational unit within the company",
"synonyms": {
"de": ["Organisation", "Organisationseinheit", "Org Einheit"],
"en": ["Organisation", "Organizational Unit", "Org Unit"],
"fr": ["Organisation", "Unite organisationnelle", "Unite org"]
},
"graphLabel": "Organisation"
},
"Architecture": {
"description": "Architecture within Enterprise Architecture Management",
"synonyms": {
"de": ["Architektur", "Architekturmodell", "Zielarchitektur"],
"en": ["Architecture", "Architecture Model", "Target Architecture"],
"fr": ["Architecture", "Modele d architecture", "Architecture cible"]
},
"graphLabel": "Architecture"
},
"Diagram": {
"description": "Excalidraw diagram",
"synonyms": {
"de": ["Diagramm", "Architekturdiagramm", "Excalidraw Diagramm"],
"en": ["Diagram", "Architecture Diagram", "Excalidraw Diagram"],
"fr": ["Diagramme", "Diagramme d architecture", "Diagramme Excalidraw"]
},
"graphLabel": "Diagram"
},
"ArchitecturePrinciple": {
"description": "Architecture principle within Enterprise Architecture Management",
"synonyms": {
"de": ["Architekturprinzip", "Prinzip", "EA Prinzip"],
"en": ["Architecture Principle", "Principle", "EA Principle"],
"fr": ["Principe d architecture", "Principe", "Principe EA"]
},
"graphLabel": "ArchitecturePrinciple"
}
}

Copilot MUST NOT invent any additional types.

🧠 3. Artifact 2 - Intent Schema
Task for Copilot

Define all allowed question types.

Allowed intents (initial set)

FACT_LOOKUP
IMPACT_ANALYSIS
DEPENDENCY_EXPLORATION
STRATEGIC_ENRICHMENT
ENTITY_IDENTIFICATION
Expected output format

{
"FACT_LOOKUP": {
"description": "Direct query of structured facts",
"requiresTraversal": false
},
"IMPACT_ANALYSIS": {
"description": "What happens if X fails or changes",
"requiresTraversal": true
},
"DEPENDENCY_EXPLORATION": {
"description": "Explore dependencies and relationships between entities",
"requiresTraversal": true
},
"STRATEGIC_ENRICHMENT": {
"description": "Create a strategic enrichment draft based on company information and supporting research",
"requiresTraversal": false
},
"ENTITY_IDENTIFICATION": {
"description": "Which entity the user is describing",
"requiresTraversal": true
}
}

Copilot MUST NOT invent new intents without explicit instruction.

🔍 4. Artifact 3 - Entity Resolution Rules
Task for Copilot

Create rules for how described entities that are not known by name are found in the graph.

Principle

Do not search by name.
Use relationships, capabilities, and interfaces.
The output is a candidate list, not "the one truth".
Template (generic)

{
"entityType": "Application",
"resolutionStrategy": "graph-filter",
"allowedCriteria": [
"supportsCapability",
"integratesWith",
"usedByProcess",
"ownedBy"
]
}

Example
User says:

"the application that processes invoices and is connected to SAP"

Copilot MUST produce:

{
"entityType": "Application",
"filters": {
"supportsCapability": "Invoice Processing",
"integratesWith": "SAP"
}
}

Copilot MUST NOT decide which application is meant.

🧮 5. Artifact 4 - Graph Query Library (Cypher)
Task for Copilot

Create read-only Cypher query templates.

Rules

Only MATCH / WHERE / RETURN.
No CREATE / MERGE / DELETE.
Parameterized.
Example - Impact Analysis

MATCH (a:Application {id: $applicationId})
MATCH (a)-[:DEPENDS_ON*1..3]->(dep)
RETURN DISTINCT dep

Copilot MUST NOT generate any Cypher that does not exist in this library.

🤖 6. Artifact 5 - Agent Routing Logic
Task for Copilot

Define agents with clear responsibilities.

Minimal set

agents:
intent-classifier:
responsibility: classify user question
entity-resolver:
responsibility: find candidate entities
graph-query-agent:
responsibility: execute whitelisted Cypher
explanation-agent:
responsibility: explain graph result

IMPORTANT

The explanation-agent never sees the entire graph.
The explanation-agent only receives query results.

🛑 7. Security & Quality Rules (NON-NEGOTIABLE)
Copilot MUST:

Generate clarifying questions when ambiguity exists.
Never invent facts.
Never assume new relationships.
Never guess default values.
If there is no graph match:

"I could not find an entity that uniquely matches this description."

✅ 8. Definition of Done (DoD)
An artifact is only considered complete if:

it is versioned
it is machine-readable
it does not hide implicit logic in the prompt
it is fully deterministic
