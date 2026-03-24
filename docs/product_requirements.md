# NextGen EAM: Product Requirements Document

## Document information

| Field    | Value                         |
| -------- | ----------------------------- |
| Document | Product Requirements Document |
| Date     | May 12, 2025                  |
| Version  | 1.0                           |
| Status   | Draft                         |

## 1. Introduction

### 1.1 Purpose

NextGen EAM is an Enterprise Architecture Management solution that helps organizations document, analyze, and optimize their IT landscape. This document outlines the functional and non-functional requirements for the system.

### 1.2 Project overview

NextGen EAM consists of multiple components delivered as Docker containers:

- Neo4j database to store the Enterprise Architecture Model as a graph
- GraphQL server as the API layer
- Keycloak for authentication and authorization
- Next.js frontend for the user interface

### 1.3 Target audience

- Enterprise architects
- IT managers and planners
- Business analysts
- IT governance stakeholders

## 2. Functional requirements

### 2.1 Business capabilities management

#### FR-BC-01: Capture business capabilities

**Description:** The system must support creating and managing business capabilities.  
**Priority:** High  
**Acceptance criteria:**

- Users can create new business capabilities with the following attributes:
  - Name
  - Description
  - Owner
  - Maturity level (1-5)
  - Hierarchical assignment (parent-child relationships)
  - Status (active, planned, retired)
  - Business value
  - Tags/categories
- Capabilities can be structured hierarchically (L1, L2, L3, etc.)
- Capabilities can be edited, deleted, or archived

#### FR-BC-02: Capability maps

**Description:** The system must support creating hierarchical capability maps.  
**Priority:** Medium  
**Acceptance criteria:**

- Users can create and visualize hierarchical capability maps
- Heat maps based on attributes such as maturity level or business value

#### FR-BC-03: Capability assignment

**Description:** The system must support linking business capabilities to other EAM elements.  
**Priority:** High  
**Acceptance criteria:**

- Business capabilities can be linked to business applications
- Business capabilities can be linked to business data objects
- Relationships can be classified with attributes such as "supports," "enables," or "realizes"

### 2.2 Business applications management

#### FR-APP-01: Capture business applications

**Description:** The system must support creating and managing business applications.  
**Priority:** High  
**Acceptance criteria:**

- Users can create new business applications with the following attributes:
  - Name
  - Description
  - Owner
  - Status (active, in development, retired)
  - Criticality
  - Technology stack
  - Version
  - Hosting environment
  - Supplier/manufacturer
  - Cost
  - Go-live date
  - End-of-life date
- Applications can be edited, deleted, or archived

#### FR-APP-02: Application landscape

**Description:** The system must provide an overview of the entire application landscape.  
**Priority:** Medium  
**Acceptance criteria:**

- Users can filter and group applications by various criteria
- Configurable views (e.g., by business unit, status, technology)

#### FR-APP-03: Application assignments

**Description:** The system must support linking applications to other EAM elements.  
**Priority:** High  
**Acceptance criteria:**

- Applications can be linked to business capabilities
- Applications can be linked to data objects
- Applications can be linked to other applications (interfaces)
- Relationships can be classified with attributes such as "uses," "delivers data to," or "receives data from"

### 2.3 Business data objects management

#### FR-DO-01: Capture business data objects

**Description:** The system must support creating and managing business data objects.  
**Priority:** High  
**Acceptance criteria:**

- Users can create new business data objects with the following attributes:
  - Name
  - Description
  - Owner/responsible person
  - Data classification (public, internal, confidential, strictly confidential)
  - Data sources (applications)
  - Format
  - Lifecycle information
- Data objects can be edited, deleted, or archived

#### FR-DO-02: Attribute and metadata management

**Description:** The system must support managing attributes and metadata for business data objects.  
**Priority:** Medium  
**Acceptance criteria:**

- Users can define attributes for data objects
- Users can manage metadata for data objects

#### FR-DO-03: Data object assignments

**Description:** The system must support linking data objects to other EAM elements.  
**Priority:** High  
**Acceptance criteria:**

- Data objects can be linked to business capabilities
- Data objects can be linked to applications
- Data objects can be linked to other data objects (e.g., references)
- Data objects can be linked to interfaces
- Relationships can be classified with attributes such as "create," "read," "update," or "delete"

### 2.4 Interface management

#### FR-IF-01: Capture interfaces

**Description:** The system must support creating and managing interfaces between EAM elements.  
**Priority:** High  
**Acceptance criteria:**

- Users can create new interfaces with the following attributes:
  - Name
  - Description
  - Type (API, database, file, etc.)
  - Source (applications)
  - Targets (applications)
  - Data objects
  - Protocol (REST, SOAP, GraphQL, etc.)
  - Version
  - Status (active, in development, retired)
  - Owner
  - Go-live date
  - End-of-life date
- Interfaces can be edited, deleted, or archived

#### FR-IF-02: Interface documentation

**Description:** The system must support documenting interfaces.  
**Priority:** Medium  
**Acceptance criteria:**

- Users can document technical details for interfaces (endpoints, authentication, data formats)
- Support for OpenAPI/Swagger documentation
- Ability to export interface documentation

#### FR-IF-03: Interface assignments

**Description:** The system must support linking interfaces to other EAM elements.  
**Priority:** High  
**Acceptance criteria:**

- Interfaces can be linked to applications
- Interfaces can be linked to data objects
- Interfaces can be linked to other interfaces (e.g., API chains)

### 2.5 Database integration

#### FR-DB-01: Neo4j data storage

**Description:** The system must store all EAM elements and their relationships in the Neo4j graph database.  
**Priority:** High  
**Acceptance criteria:**

- All EAM elements are stored as nodes
- All relationships are stored as edges
- The data model supports efficient queries and analysis

#### FR-DB-02: GraphQL API

**Description:** The system must provide a GraphQL API to access EAM data.  
**Priority:** High  
**Acceptance criteria:**

- CRUD operations for all EAM elements
- Complex queries across multiple element types
- Filtering, sorting, and pagination
- Efficient querying of relationships and nested data
- Use of the Neo4j GraphQL Library

### 2.6 Data import and export

#### FR-IE-01: Excel import

**Description:** The system must support importing EAM data from Excel files.  
**Priority:** High  
**Acceptance criteria:**

- Import business capabilities from Excel
- Import business applications from Excel
- Import business data objects from Excel
- Import relationships between EAM elements from Excel
- Validate imported data and provide error reports
- Support bulk import
- Mapping function for custom Excel structures
- Update existing data with overwrite/merge options

#### FR-IE-02: Excel export

**Description:** The system must support exporting EAM data to Excel.  
**Priority:** High  
**Acceptance criteria:**

- Export business capabilities to Excel
- Export business applications to Excel
- Export business data objects to Excel
- Export relationships between EAM elements to Excel
- Configurable export options (fields, filters, sorting)
- Formatting of exported Excel files (styles, conditional formatting)

#### FR-IE-03: Data import templates

**Description:** The system must provide templates for data import.  
**Priority:** Medium  
**Acceptance criteria:**

- Predefined Excel templates for different EAM element types
- Documentation and sample data in the templates
- Users can save custom import templates

### 2.7 Data visualization and lists

#### FR-VL-01: List views for EAM elements

**Description:** The system must display EAM elements in configurable lists.  
**Priority:** High  
**Acceptance criteria:**

- Tabular views for business capabilities
- Tabular views for business applications
- Tabular views for business data objects
- Filtering, sorting, and pagination
- Configurable columns and views
- Grouping and summarization
- Export of list views

#### FR-VL-02: Advanced table features

**Description:** The system must provide advanced table capabilities using TanStack Table.  
**Priority:** Medium  
**Acceptance criteria:**

- Column resizing and reordering
- Row selection and multi-select
- Inline editing
- Hierarchical data view (e.g., capability hierarchies)
- Aggregations
- Persistent user settings for table views

### 2.8 Diagram editor and visualization

#### FR-DE-01: Excalidraw integration

**Description:** The system must provide a diagram editor based on Excalidraw.  
**Priority:** High  
**Acceptance criteria:**

- Users can create and edit diagrams
- Support for multiple diagram types (architecture diagrams, capability maps, etc.)
- Save and load diagrams
- Collaborative editing

#### FR-DE-02: Linking to database elements

**Description:** The system must support linking diagram elements to EAM elements in the database.  
**Priority:** High  
**Acceptance criteria:**

- Diagram elements can be linked to business capabilities
- Diagram elements can be linked to business applications
- Diagram elements can be linked to business data objects
- Metadata from the database is shown on diagram elements
- Database updates are reflected in diagrams
- Visual indication for linked elements

#### FR-DE-03: Automatic diagram generation

**Description:** The system must support automatic diagram generation based on database contents.  
**Priority:** Medium  
**Acceptance criteria:**

- Generate capability maps from the database
- Generate application landscape diagrams
- Generate data flow diagrams
- Configurable layout algorithms
- Customize and save generated diagrams

#### FR-DE-04: Database-backed ArchiMate library

**Description:** The system must provide an extended ArchiMate library that shows existing architecture elements from the database and allows drag-and-drop into diagrams.  
**Priority:** High  
**Acceptance criteria:**

- Display existing architecture elements from the database within the Excalidraw library
- Dropdown filter for element types (business capability, application, data object, interface)
- Visual representation using the corresponding ArchiMate symbols
- Use the ArchiMate color palette from the existing archimate-symbols.excalidrawlib
- Drag-and-drop to add database elements to diagrams
- Preserve the database ID when dragging elements into a diagram (e.g., via customData)
- Real-time sync between database changes and the library view
- Search within the library
- Hierarchical view for business capabilities (parent-child)
- Tooltips with element metadata (name, description, status, etc.)

#### FR-DE-05: Diagram export

**Description:** The system must support exporting diagrams in multiple formats.  
**Priority:** Low  
**Acceptance criteria:**

- Export as PNG, SVG, and PDF
- Configurable export quality and size
- Integration into reports and dashboards

#### FR-DE-06: Add neighboring elements

**Description:** The diagram editor must provide a function to add all elements connected to a selected architecture element.  
**Priority:** Medium  
**Acceptance criteria:**

- Dialog to select which neighboring elements to add, positioning (left, right, top, bottom), number of hops, and formatting (arrow type, gap, distance, spacing).
- Default parameters: position = right, hops = 1, arrow type = sharp, gap = medium (8px), distance = width of the selected element, spacing = 20px.
- Selection lists the available architecture element types (business capability, application, data object, interface, infrastructure) and shows how many of each type exist. For interfaces, inbound vs outbound must be distinguishable.
- Fetch neighboring elements from the database (iterate for multiple hops) and add them to the diagram according to position, distance, and spacing settings.
- The selected element must stay centered relative to its neighbors.
- If hops > 1, positioning is based on the last hop; elements of the previous hop stay centered relative to the current hop.
- Connect the selected element to neighbors with arrows using the specified type and gap. Follow the EXCALIDRAW-ARROW-FUNCTIONALITY.md guidance.
- Arrow start point is on the specified side of the selected element and ends on the opposite side of the neighbor; apply the gap when computing coordinates.
- If the relationship is marked as reverse, start from the neighbor and end at the selected element (see relationshipValidation.ts).
- Arrows must bind to the primary elements, respecting EXCALIDRAW-ARROW-FUNCTIONALITY.md and arrow-samples.excalidraw.

### 2.9 User authentication and management

#### FR-AU-01: User login

**Description:** The system must support secure user login via Keycloak.  
**Priority:** High  
**Acceptance criteria:**

- Login with username and password
- Single Sign-On (SSO) support
- Multi-factor authentication
- Password policies (complexity, validity, etc.)
- Password reset functionality

#### FR-AU-02: User management

**Description:** The system must support managing users.  
**Priority:** High  
**Acceptance criteria:**

- Create, edit, and deactivate user accounts
- Manage user profiles with contact data and roles
- Group assignment for users
- Self-service functions (profile updates, password changes)

#### FR-AU-03: Role and permission management

**Description:** The system must support managing roles and permissions.  
**Priority:** High  
**Acceptance criteria:**

- Predefined roles (admin, architect, viewer, etc.)
- Custom roles with granular permissions
- Permissions on both functional and data levels
- Permission inheritance
- Temporary permissions and access

#### FR-AU-04: Enterprise directory integration

**Description:** The system must support integration with LDAP/Active Directory.  
**Priority:** Medium  
**Acceptance criteria:**

- Synchronization of users and groups
- SSO via SAML, OpenID Connect, or LDAP
- Automatic role assignment based on AD groups

### 2.10 Lenses and features

#### FR-LF-01: Lens switching

**Description:** The system must support switching between architecture lenses to reduce UI complexity and focus on relevant elements.  
**Priority:** High  
**Acceptance criteria:**

- Provide a lens selector with the following default lenses:
  - Enterprise Architecture
  - Business Architecture
  - Process Architecture
  - Solution Architecture
  - Infrastructure Architecture
- The selected lens is persisted per user **and per company** and restored on next login.
- If a user switches company, the lens selection updates to that company’s saved lens.
- Switching lenses updates the UI without a full page reload.

#### FR-LF-02: Lens-driven navigation

**Description:** Menu items for architecture elements must be shown or hidden based on the selected lens.  
**Priority:** High  
**Acceptance criteria:**

- Each navigation item can be linked to one or more lenses.
- Only items linked to the active lens are visible in the menu.
- A fallback lens (Enterprise Architecture) shows all default items.
- Lens-to-menu mappings are configurable **per company**.

#### FR-LF-03: Lens-specific import and export

**Description:** Import/export options must adapt to the selected lens.  
**Priority:** High  
**Acceptance criteria:**

- Import/export screens show only element types linked to the active lens.
- Template availability and mapping options are filtered by lens.
- Exports exclude element types not linked to the active lens.
- Lens-based import/export configuration is managed **per company**.

#### FR-LF-04: Lens-driven diagram editor configuration

**Description:** Diagram editor element types and automated diagram generation options must depend on the selected lens.  
**Priority:** High  
**Acceptance criteria:**

- Diagram element type palettes are filtered by lens.
- Automated diagram generation menu items (e.g., capability map generation) are filtered by lens.
- Each diagram element type and generation action can be linked to one or more lenses.
- Lens-to-diagram configuration is managed **per company**.

#### FR-LF-05: Feature management in administration

**Description:** Administrators must be able to enable or disable features via the admin UI.  
**Priority:** High  
**Acceptance criteria:**

- Features can be toggled on/off without redeploying the application.
- Features may represent:
  - Complete lenses
  - Architecture element types
  - Attributes of architecture elements
  - Diagram editor menu items and generation actions
- Disabled features are hidden or disabled across navigation, import/export, and the diagram editor.
- Feature changes are audited with timestamp and user.
- Feature toggles are stored and applied **per company**.

#### FR-LF-06: Feature naming convention for data model

**Description:** All feature-related element types and attributes must be prefixed for easy management in the data model.  
**Priority:** Medium  
**Acceptance criteria:**

- Feature-specific element types and attributes use the format: `<FEATURE_NAME>_<ItemName>`.
- Example: `GEA_CapabilityMaturity` or `GEA_SolutionDomain`.
- The prefix is enforced on creation and validated on import.

### 2.11 Process modeling

#### FR-PM-01: Process element management

**Description:** The system must support creating and managing business processes as first-class EAM elements.  
**Priority:** High  
**Acceptance criteria:**

- Users can create new business processes with the following attributes:
  - Name
  - Description
  - Owner
  - Process type (core, support, management)
  - Status (active, planned, retired)
  - Maturity level
  - Process category/domain
  - Tags/categories
  - BPMN Diagram
- Processes can be edited, deleted, or archived
- Processes are stored in the Neo4j database as nodes with type "Process"

#### FR-PM-02: BPMN diagram editor

**Description:** The system must provide a BPMN editor for modeling process flows using the bpmn-js library.  
**Priority:** High  
**Acceptance criteria:**

- Integration of bpmn-js (https://github.com/bpmn-io/bpmn-js) library for process modeling
- Support for standard BPMN 2.0 elements:
  - Start/End events
  - Tasks (User Task, Service Task, etc.)
  - Gateways (Exclusive, Parallel, Inclusive)
  - Sequence flows
  - Data objects
  - Pools and lanes
- BPMN diagrams are saved as XML (BPMN 2.0 format) in the database within the BPMN Diagram attribute of the Process element
- Visual representation of BPMN diagrams in read-only mode for viewing
- Export capability for BPMN XML files
- Import capability for existing BPMN XML files

#### FR-PM-03: Process hierarchy

**Description:** The system must support hierarchical process structures.  
**Priority:** High  
**Acceptance criteria:**

- Processes can have parent-child relationships (sub-processes)
- Multiple levels of process decomposition are supported
- A process can have multiple sub-processes
- A sub-process can only have one parent process
- Hierarchical process views show the full process tree
- Navigation between parent and child processes is intuitive

#### FR-PM-04: Process to capability relationships

**Description:** The system must support linking processes to business capabilities.  
**Priority:** High  
**Acceptance criteria:**

- Processes can be linked to one or more business capabilities
- Relationship type is "realizes" or "supports"
- Users can view all processes linked to a capability
- Users can view all capabilities supported by a process
- Relationships can be created via the process form or capability form
- Relationships are visualized in diagrams

#### FR-PM-05: Process to application relationships

**Description:** The system must support linking processes to business applications.  
**Priority:** High  
**Acceptance criteria:**

- Processes can be linked to one or more applications
- Relationship type indicates "supported by" or "executed by"
- Users can view all applications supporting a process
- Users can view all processes supported by an application
- Relationships can be created via the process form or application form
- Relationships are visualized in diagrams

#### FR-PM-06: Process to data relationships

**Description:** The system must support linking processes to data objects.  
**Priority:** High  
**Acceptance criteria:**

- Processes can be linked to data objects they create, read, update, or delete
- Relationship types: "creates," "reads," "updates," "deletes" (CRUD)
- Users can view all data objects used by a process
- Users can view all processes that use a data object
- Relationships can be created via the process form or data object form
- CRUD matrix visualization showing processes and their data interactions

#### FR-PM-07: Process visualization in diagrams

**Description:** Processes must be available as elements in the general diagram editor.  
**Priority:** Medium  
**Acceptance criteria:**

- Process elements can be added to architecture diagrams
- Process symbols follow standard notation (e.g., rounded rectangles)
- Process properties are displayed when hovering or selecting
- Connections between processes and other elements (capabilities, applications, data) can be drawn
- Process hierarchy is visualizable in diagrams

#### FR-PM-08: Process list and filtering

**Description:** The system must provide list views with filtering and sorting for processes.  
**Priority:** Medium  
**Acceptance criteria:**

- Processes can be listed in a table view
- Table displays key attributes: name, owner, type, status, maturity
- Filtering by process type, status, owner, and maturity level
- Sorting by any column
- Search by process name or description
- Quick access to process details and BPMN editor from the list

#### FR-PM-09: Process import and export

**Description:** The system must support importing and exporting process information.  
**Priority:** Medium  
**Acceptance criteria:**

- Export processes to Excel with all attributes and relationships
- Import processes from Excel templates
- Export BPMN diagrams as XML files
- Import BPMN diagrams from XML files
- Batch operations for multiple processes
- Validation of imported data

### 2.12 Supplier management

#### FR-SM-01: Supplier element management

**Description:** The system must support creating and managing suppliers as first-class EAM elements.  
**Priority:** High  
**Acceptance criteria:**

- Users can create new suppliers with the following attributes:
  - Name
  - Description
  - Supplier type (software vendor, service provider, consultant, hardware vendor, cloud provider)
  - Status (active, potential, inactive, blocked)
  - Contact information (address, phone, email, website)
  - Primary contact person
  - Contract start date
  - Contract end date
  - Annual spend/budget
  - Risk classification (low, medium, high, critical)
  - Strategic importance (low, medium, high, strategic)
  - Performance rating
  - Compliance certifications (ISO, SOC2, etc.)
  - Tags/categories
- Suppliers can be edited, deleted, or archived
- Suppliers are stored in the Neo4j database as nodes with type "Supplier"

#### FR-SM-02: Feature-controlled menu integration

**Description:** When the supplier management feature is enabled, a "Suppliers" menu entry must appear in the navigation.  
**Priority:** High  
**Acceptance criteria:**

- "Suppliers" menu entry is positioned between "Companies" and "Persons" in the navigation menu
- Menu entry is visible for all user roles (admin, architect, viewer)
- Menu entry only appears when the supplier management feature is enabled
- Feature can be toggled on/off per company in the feature management settings
- When feature is disabled, the menu entry is hidden but existing supplier data is preserved
- Clicking the menu entry navigates to the supplier list view

#### FR-SM-03: Supplier to application relationships

**Description:** The system must support linking suppliers to applications they provide or support.  
**Priority:** High  
**Acceptance criteria:**

- Suppliers can be linked to one or more applications
- Relationship types: "provides," "supports," "maintains"
- Users can view all applications provided by a supplier
- Users can view the supplier(s) for each application
- Relationships can be created via the supplier form or application form
- Application forms show supplier selection field

#### FR-SM-04: Supplier to infrastructure relationships

**Description:** The system must support linking suppliers to infrastructure components.  
**Priority:** Medium  
**Acceptance criteria:**

- Suppliers can be linked to infrastructure components they provide or support
- Relationship types: "provides," "hosts," "maintains"
- Users can view all infrastructure components from a supplier
- Users can view suppliers for infrastructure components
- Useful for tracking cloud providers, hardware vendors, etc.

#### FR-SM-05: Supplier list and filtering

**Description:** The system must provide list views with filtering and sorting for suppliers.  
**Priority:** High  
**Acceptance criteria:**

- Suppliers can be listed in a table view
- Table displays key attributes: name, type, status, strategic importance, performance rating
- Filtering by supplier type, status, strategic importance, and risk classification
- Sorting by any column
- Search by supplier name or description
- Quick access to supplier details from the list
- Export supplier list to Excel

#### FR-SM-06: Supplier assessment tracking

**Description:** The system must support tracking supplier assessments and reviews.  
**Priority:** Medium  
**Acceptance criteria:**

- Suppliers can have assessment records with date, score, and notes
- Assessment categories: performance, compliance, financial stability, innovation
- Historical assessment data is preserved
- Trend visualization of supplier performance over time
- Alerts for suppliers with declining performance

#### FR-SM-07: Supplier visualization in diagrams

**Description:** Suppliers must be available as elements in the general diagram editor.  
**Priority:** Low  
**Acceptance criteria:**

- Supplier elements can be added to architecture diagrams
- Supplier symbols follow standard notation
- Connections between suppliers and applications/infrastructure can be drawn
- Supplier properties are displayed when hovering or selecting

#### FR-SM-08: Supplier import and export

**Description:** The system must support importing and exporting supplier information.  
**Priority:** Medium  
**Acceptance criteria:**

- Export suppliers to Excel with all attributes and relationships
- Import suppliers from Excel templates
- Batch operations for multiple suppliers
- Validation of imported data (contact information, dates, enum values)
- Support for updating existing suppliers via import

### 2.13 Business model canvas and value proposition canvas

#### FR-BMC-01: Business model canvas management

**Description:** The system must support creating and managing Business Model Canvases as strategic planning tools.  
**Priority:** High  
**Acceptance criteria:**

- Users can create Business Model Canvases with the following nine building blocks:
  - Customer Segments: Target groups and personas
  - Value Propositions: Products and services offered
  - Channels: How value propositions reach customers
  - Customer Relationships: Type of relationships with customer segments
  - Revenue Streams: How the business generates income
  - Key Resources: Assets required to deliver value
  - Key Activities: Critical actions to operate the business model
  - Key Partnerships: Network of suppliers and partners
  - Cost Structure: Main costs to operate the business model
- Each building block supports rich text input with multiple entries
- Canvas metadata: name, description, owner, company, version, status (draft, active, archived)
- Multiple canvases can be created per company
- Canvases can be versioned to track evolution over time
- Canvases are stored in the Neo4j database

#### FR-BMC-02: Visual business model canvas editor

**Description:** The system must provide an interactive visual editor for Business Model Canvases.  
**Priority:** High  
**Acceptance criteria:**

- Visual representation following the standard Business Model Canvas layout
- Nine building blocks arranged in the standard configuration
- Click-to-edit functionality for each building block
- Drag-and-drop to reorder items within building blocks
- Color coding options for different categories or priorities
- Sticky note style for individual entries within blocks
- Export canvas as PDF or image (PNG/SVG)
- Print-friendly layout
- Responsive design for various screen sizes

#### FR-BMC-03: Value proposition canvas management

**Description:** The system must support creating and managing Value Proposition Canvases.  
**Priority:** High  
**Acceptance criteria:**

- Users can create Value Proposition Canvases with two main sections:
  - Customer Profile:
    - Customer Jobs: Tasks customers want to accomplish
    - Pains: Negative experiences and obstacles
    - Gains: Desired positive outcomes and benefits
  - Value Map:
    - Products & Services: What is being offered
    - Pain Relievers: How offerings alleviate pains
    - Gain Creators: How offerings create gains
- Each section supports multiple entries with rich text
- Canvas metadata: name, description, owner, customer segment, status
- Link to specific customer segments in Business Model Canvas
- Multiple value proposition canvases can be created per customer segment
- Canvases are stored in the Neo4j database

#### FR-BMC-04: Visual value proposition canvas editor

**Description:** The system must provide an interactive visual editor for Value Proposition Canvases.  
**Priority:** High  
**Acceptance criteria:**

- Visual representation following the standard Value Proposition Canvas layout
- Customer Profile on the right side (circle with three sections)
- Value Map on the left side (square with three sections)
- Click-to-edit functionality for each section
- Visual connections showing how pain relievers address pains
- Visual connections showing how gain creators address gains
- Color coding for matched/unmatched items
- Export canvas as PDF or image (PNG/SVG)
- Fit analysis visualization showing alignment between customer profile and value map

#### FR-BMC-05: Canvas to architecture element relationships

**Description:** The system must support linking canvases to architecture elements.  
**Priority:** High  
**Acceptance criteria:**

- Business Model Canvases can be linked to:
  - Business capabilities (for key activities and resources)
  - Applications (for channels and key activities)
  - Data objects (for key resources)
  - Suppliers (for key partnerships)
  - Processes (for key activities)
- Value Proposition Canvases can be linked to:
  - Business capabilities (for products & services)
  - Applications (for pain relievers and gain creators)
  - Customer segments (in Business Model Canvas)
- Bidirectional navigation between canvases and architecture elements
- Visual indicators in canvas editor showing linked elements
- Relationship types are semantically meaningful (e.g., "supports," "delivers," "enables")

#### FR-BMC-06: Canvas collaboration and comments

**Description:** The system must support collaborative work on canvases.  
**Priority:** Medium  
**Acceptance criteria:**

- Multiple users can view the same canvas simultaneously
- Comment functionality on each building block or section
- @mentions to tag specific users for feedback
- Comment threads with replies
- Comment resolution status
- Activity log showing canvas changes and who made them
- Notifications for comments and mentions

#### FR-BMC-07: Canvas templates and duplication

**Description:** The system must support canvas templates and duplication.  
**Priority:** Medium  
**Acceptance criteria:**

- Predefined canvas templates for common business models (e.g., SaaS, Marketplace, Freemium)
- Create custom templates from existing canvases
- Duplicate existing canvases to create variations
- Template library accessible from canvas creation dialog
- Templates include placeholder text and guidance
- Company-specific template repository

#### FR-BMC-08: Canvas versioning and comparison

**Description:** The system must support version control and comparison for canvases.  
**Priority:** Medium  
**Acceptance criteria:**

- Automatic versioning when significant changes are made
- Manual version snapshots with version notes
- View history of all canvas versions
- Compare two versions side-by-side
- Highlight changes between versions
- Restore previous versions
- Version metadata: timestamp, author, change description

#### FR-BMC-09: Canvas analytics and insights

**Description:** The system must provide analytics for Business Model and Value Proposition Canvases.  
**Priority:** Low  
**Acceptance criteria:**

- Dashboard showing canvas overview and statistics
- Completeness indicators for each building block
- Gap analysis identifying empty or weak building blocks
- Alignment score between Value Proposition Canvas and Business Model Canvas
- List of architecture elements not yet linked to canvases
- Recommendations for missing links to architecture elements

#### FR-BMC-10: Canvas import and export

**Description:** The system must support importing and exporting canvas data.  
**Priority:** Medium  
**Acceptance criteria:**

- Export Business Model Canvas to Excel format
- Export Value Proposition Canvas to Excel format
- Export canvases as JSON for integration with other tools
- Import canvases from Excel templates
- Import canvases from JSON format
- Export canvas as PDF with all building blocks and metadata
- Batch export of multiple canvases

### 2.14 Technology management

#### FR-TM-01: Technology portfolio and lifecycle inventory

**Description:** The system must provide a dedicated technology management view for applications, infrastructure, and supplier relationships with lifecycle context.  
**Priority:** High  
**Acceptance criteria:**

- Users can view technology portfolio entries including SoftwareProduct/SoftwareVersion and HardwareProduct/HardwareVersion, deployment context, owner, and linked suppliers.
- Each entry supports lifecycle milestones such as GA, mainstream support end, EOS, and EOL when available.
- Users can mark lifecycle confidence and source quality per record.
- Users can filter by lifecycle state (supported, approaching EOS/EOL, unsupported).
- Users can group portfolio entries by supplier, product family, and criticality.

#### FR-TM-02: Manual lifecycle data governance

**Description:** The system must support manual maintenance of technology lifecycle data independent from AI enrichment.  
**Priority:** High  
**Acceptance criteria:**

- Authorized users can create, update, and archive lifecycle records.
- Manual changes are timestamped and include actor and optional change rationale.
- Records support structured status values and effective dates.
- Validation prevents invalid chronology (e.g., EOS before GA).
- Role-based permissions define who can edit lifecycle governance data.

#### FR-TM-03: Supplier and product normalization workspace

**Description:** The system must provide normalization capabilities for supplier aliases, product names, and version naming across sources.  
**Priority:** Medium  
**Acceptance criteria:**

- Users can merge source aliases into canonical supplier and product names.
- Version normalization rules can be configured and previewed.
- Duplicate detection flags likely equivalent supplier/product/version entries.
- Persisted supplier and product entities store normalized names only.
- Source-specific raw names may be retained only in synchronization logs/audit trails.
- Normalized entities can be linked to supplier objects in the architecture model.

#### FR-TM-04: Lifecycle risk scoring and thresholds

**Description:** The system must calculate technology lifecycle risks using configurable scoring rules.  
**Priority:** High  
**Acceptance criteria:**

- Risk scores are computed per portfolio entry using lifecycle state and proximity thresholds.
- Thresholds are configurable per company (e.g., warning at 180 days before EOS).
- Risk levels are visible as categorical indicators (low, medium, high, critical).
- Risk computation inputs are explainable for each score.
- Historical score changes are retained for trend analysis.

#### FR-TM-05: Recommendation and decision tracking

**Description:** The system must support structured technology decisions based on lifecycle risks and recommendations.  
**Priority:** High  
**Acceptance criteria:**

- Recommendations support at least upgrade, replace, consolidate, retain, and monitor.
- Users can assign recommendation owners and target dates.
- Decision status can be tracked (proposed, approved, in progress, completed, rejected).
- Decision records include rationale, expected impact, and dependency notes.
- Recommendation outcomes are linked back to the originating portfolio entries.

#### FR-TM-06: SBOM and component evidence management

**Description:** The system must support Software Bill of Materials (SBOM) references for technology assets.  
**Priority:** Medium  
**Acceptance criteria:**

- Applications can be linked to dedicated SBOM objects.
- SBOM metadata includes source, generation timestamp, and format.
- SBOM records are versioned or historically retained.
- Users can filter technology entries by SBOM availability.
- Missing SBOM coverage is visible in technology management dashboards.

#### FR-TM-07: Technology dashboards, alerts, and reporting

**Description:** The system must provide technology management dashboards and alerting capabilities.  
**Priority:** Medium  
**Acceptance criteria:**

- Dashboard shows lifecycle distribution, top risk items, and upcoming EOS/EOL events.
- Alerts can be configured for lifecycle threshold breaches.
- Reports can be exported by company, domain, supplier, and risk level.
- Dashboard supports drill-down from aggregate metrics to affected entries.
- KPI trends are available over selectable time ranges.

#### FR-TM-08: Integration and synchronization operations

**Description:** The system must support controlled ingestion and synchronization of lifecycle and supplier data from external sources.  
**Priority:** Medium  
**Acceptance criteria:**

- Connectors support scheduled and on-demand synchronization.
- Sync jobs produce run logs with success/failure metrics.
- Conflict handling rules are configurable (source priority, manual override, merge).
- Failed imports can be retried with partial recovery.
- Ingestion and synchronization actions are fully auditable.

#### TM-DM-01: Required objects, attributes, and relationships (Technology Management)

**Description:** The technology management domain must define required data objects, required attributes, and explicit relationships to support lifecycle governance, risk scoring, recommendations, and SBOM evidence.  
**Priority:** High  
**Acceptance criteria:**

- The required objects listed in this section exist in the canonical data model.
- Each required object includes the mandatory attributes listed in this section.
- Each required relationship listed in this section is queryable and writable according to permissions.
- Technology management dashboards and workflows can be implemented without additional undefined core entities.

**Required objects and mandatory attributes:**

- The system must support the following technology management objects.
- Users can create and manage technology records with the following attributes:

##### Application (extended for Technology Management)

- Name
- Version
- Criticality
- Hosting environment
- Created at
- Updated at

##### Infrastructure (extended for Technology Management)

- Name
- Version
- Infrastructure type
- Status
- Location
- Criticality
- Created at
- Updated at

##### Supplier (canonical supplier anchor)

- Name
- Supplier type
- Status
- Risk classification
- Strategic importance
- Website
- Created at
- Updated at

##### SoftwareProduct (new)

- Name
- Product family
- Lifecycle status
- Is active
- Created at
- Updated at

##### SoftwareVersion (new)

- Version string
- Normalized version
- Release channel
- Is LTS
- Support tier
- Created at
- Updated at

##### HardwareProduct (new)

- Name
- Product family
- Lifecycle status
- Is active
- Created at
- Updated at

##### SbomDocument (new)

- SBOM ID
- Format
- Version
- Source
- Source URL
- Generated at
- Tool
- Digest
- Storage reference
- Created at
- Updated at

##### HardwareVersion (new)

- Version/model string
- Release channel
- Support tier
- Created at
- Updated at

##### LifecycleRecord (new)

- GA date
- Mainstream support end date
- Extended support end date
- EOS date
- EOL date
- Lifecycle status
- Source
- Source URL
- Source confidence
- Last validated at
- Created at
- Updated at

##### TechnologyRiskAssessment (new)

- Risk level
- Risk score
- Urgency
- Assessment reason
- Threshold profile
- Assessed at
- Created at
- Updated at

##### TechnologyRecommendation (new)

- Action type (upgrade, replace, consolidate, retain, monitor)
- Priority
- Target date
- Status
- Rationale
- Business impact
- Risk impact
- Effort
- Dependency notes
- Created at
- Updated at

##### SyncJobRun (new)

- Job type
- Source system
- Started at
- Finished at
- Status
- Records read
- Records created
- Records updated
- Records failed
- Error summary

**Required relationships:**

- `Application` -> `Supplier`: provided/supported/maintained by supplier.
- `Infrastructure` -> `Supplier`: provided/hosted/maintained by supplier.
- `SoftwareProduct` -> `Supplier`: developed/provided/maintained by supplier.
- `HardwareProduct` -> `Supplier`: manufactured/provided/maintained by supplier.
- `Application` -> `SoftwareProduct`: implements/uses software product.
- `Infrastructure` -> `SoftwareProduct`: runs/uses infrastructure software products (e.g., OS, hypervisor, platform software).
- `Infrastructure` -> `HardwareProduct`: runs on/uses hardware products.
- `Application` -> `SbomDocument`: has SBOM evidence.
- `SoftwareProduct` -> `SoftwareVersion`: has software versions.
- `HardwareProduct` -> `HardwareVersion`: has hardware versions/models.
- `SoftwareVersion` -> `LifecycleRecord`: lifecycle metadata for a specific software version.
- `HardwareVersion` -> `LifecycleRecord`: lifecycle metadata for a specific hardware version/model.
- `SoftwareProduct` -> `LifecycleRecord`: lifecycle metadata for product-level support when version detail is unavailable.
- `HardwareProduct` -> `LifecycleRecord`: lifecycle metadata for product-level support when version detail is unavailable.
- `TechnologyRiskAssessment` -> `Application` and/or `Infrastructure`: risk assessed for asset.
- `TechnologyRiskAssessment` -> `LifecycleRecord`: risk is derived from lifecycle state.
- `TechnologyRecommendation` -> `Application` and/or `Infrastructure`: recommendation target.
- `TechnologyRecommendation` -> `TechnologyRiskAssessment`: recommendation justified by assessment.
- `SyncJobRun` -> affected `SoftwareProduct`/`SoftwareVersion`/`HardwareProduct`/`HardwareVersion`/`LifecycleRecord`: provenance of imported updates.

**Relationship governance requirements:**

- All technology-management relationships are company-scoped and must respect role-based authorization.
- Relationship changes must be auditable (actor, timestamp, operation, before/after where applicable).
- Relationship provenance from synchronization jobs and AI enrichment must be distinguishable from manual edits.
- Supplier assignment must always be represented as a relationship to `Supplier` and never as a denormalized text attribute on technology entities.
- Supplier relationships must point to supplier records in supplier categories (e.g., software vendor, hardware vendor, cloud provider).

### 2.15 Agentic AI functionality

#### FR-AI-01: Company research and strategic enrichment agent

**Description:** The system must provide an agent that researches public internet sources and drafts company-specific strategic content for GEA and BMC domains.  
**Priority:** High  
**Acceptance criteria:**

- Users can trigger an agent run for a selected company and country/region context.
- The agent produces draft entries for Mission, Vision, Values, Goals, Strategies, and Business Model Canvas blocks.
- Each generated statement includes source links, extraction date, confidence score, and rationale.
- Generated content is stored as **draft** and requires human approval before becoming active.
- Contradictory findings are explicitly flagged for user decision.

#### FR-AI-02: Technology lifecycle and supplier intelligence agent

**Description:** The system must provide an agent for software and hardware lifecycle intelligence to support technology management and supplier lifecycle decisions.  
**Priority:** High  
**Acceptance criteria:**

- The agent enriches applications and infrastructure with lifecycle data (GA, EOL, EOS, support status, version maturity where available).
- Supplier information is normalized and mapped to supplier elements.
- Risk indicators are calculated (e.g., unsupported version risk, end-of-support proximity).
- Users receive recommendations such as upgrade, replace, consolidate, or monitor.
- Scheduled scans and on-demand scans are supported per company.

#### FR-AI-03: As-is to to-be architecture recommendation agent

**Description:** The system must provide an agent that analyzes as-is architecture with strategic inputs (Vision, Goals, Strategies, BMC) and proposes to-be improvements.  
**Priority:** High  
**Acceptance criteria:**

- The agent identifies capability gaps, application rationalization opportunities, and technology modernization actions.
- Recommendations include impact dimensions (business value, risk, complexity, time horizon, dependency notes).
- A proposed target-state option can be generated as structured recommendations and optional diagram suggestions.
- Recommendations are traceable to source evidence and model inputs.
- Users can accept/reject individual recommendations and track decision status.

#### FR-AI-04: Relationship discovery and model quality agent

**Description:** The system must provide an agent that suggests missing relationships and improves data quality across the EAM graph.  
**Priority:** Medium  
**Acceptance criteria:**

- Agent suggests candidate relationships (e.g., process ↔ application, capability ↔ application, data object ↔ interface).
- Agent detects duplicates, stale entries, and inconsistent statuses across linked elements.
- Suggestions are presented with confidence and explainability metadata.
- No automatic hard-write to productive architecture data without explicit user approval.

#### FR-AI-05: Human-in-the-loop governance

**Description:** AI-driven changes must be governed through approval workflows and role-based permissions.  
**Priority:** High  
**Acceptance criteria:**

- Roles define who can run agents, review, approve, and publish AI drafts.
- Every AI output stores audit metadata (prompt version, model, tools used, sources, timestamps).
- Approval workflows support approve, reject, request revision, and partial acceptance.
- Full decision history is queryable per company and artifact.

#### FR-AI-06: Conversational architecture assistant and controlled change agent

**Description:** The system must provide an AI assistant that can answer architecture questions in natural language and propose/apply architecture changes through controlled workflows.  
**Priority:** High  
**Acceptance criteria:**

- Users can ask free-text questions about their company architecture (elements, relationships, ownership, lifecycle, risks, dependencies).
- Answers include traceability (referenced entities, relationships, and evidence links) and confidence indicators.
- The assistant can generate change proposals (create, update, connect, disconnect) as explicit structured actions before execution.
- For write actions, the system supports preview/dry-run, impact summary, and role-based approval before applying to productive data.
- Applied changes are persisted with full audit metadata (who, when, why, prompt/context, before/after snapshot, run ID).
- Changes can only be executed for companies the user is authorized to access; unauthorized actions are blocked and logged.

## 3. Non-functional requirements

### 3.1 Performance and scalability

#### NFR-PS-01: Response time

**Description:** The system must provide acceptable response times.  
**Priority:** High  
**Acceptance criteria:**

- Page loads under 2 seconds
- API responses under 1 second for typical requests
- Visualizations load in under 3 seconds for up to 500 elements

#### NFR-PS-02: Scalability

**Description:** The system must scale with growing data volumes.  
**Priority:** Medium  
**Acceptance criteria:**

- Support at least 10,000 EAM elements
- Support at least 50,000 relationships
- Support at least 50 concurrent users

### 3.2 Security

#### NFR-SE-01: Data protection

**Description:** The system must ensure confidentiality and integrity of EAM data.  
**Priority:** High  
**Acceptance criteria:**

- Encryption of sensitive data
- Data-level access control
- Audit trail for changes to EAM data

#### NFR-SE-02: Compliance

**Description:** The system must meet relevant compliance requirements.  
**Priority:** Medium  
**Acceptance criteria:**

- GDPR-compliant data management
- Export controls for sensitive architecture information
- Adherence to the organization's IT security policies

### 3.3 User experience

#### NFR-UX-01: Usability

**Description:** The system must be user-friendly and intuitive.  
**Priority:** High  
**Acceptance criteria:**

- Consistent and intuitive UI
- Responsive design for different screen sizes
- Accessibility per WCAG 2.1 AA

#### NFR-UX-02: Internationalization

**Description:** The system must support multiple languages.  
**Priority:** Low  
**Acceptance criteria:**

- Support at least German and English
- Extensible to additional languages
- Localization of date, time, and number formats

### 3.4 Maintainability and operations

#### NFR-MO-01: Containerization

**Description:** The system must run entirely in Docker containers.  
**Priority:** High  
**Acceptance criteria:**

- Docker containers for all components
- Docker Compose for easy deployment
- Configuration via environment variables

#### NFR-MO-02: Backup and restore

**Description:** The system must support regular backups and restore.  
**Priority:** Medium  
**Acceptance criteria:**

- Automated backups of the Neo4j database
- Documented restore process
- Export/import of the full EAM configuration

### 3.5 AI reliability, safety, and governance

#### NFR-AI-01: Explainability and evidence

**Description:** AI outputs must be explainable and backed by evidence.  
**Priority:** High  
**Acceptance criteria:**

- All externally researched statements include at least one source reference.
- Source provenance stores URL, retrieval timestamp, and extraction summary.
- Recommendations include confidence values and uncertainty indicators.

#### NFR-AI-02: Determinism and reproducibility

**Description:** Agent runs must be reproducible for audit and troubleshooting.  
**Priority:** High  
**Acceptance criteria:**

- Workflow input snapshot and configuration version are persisted per run.
- Model and prompt versions are persisted and visible in run details.
- Re-run capability exists for the same input with comparable settings.

#### NFR-AI-03: Cost and performance controls

**Description:** AI execution must have bounded cost and predictable runtime.  
**Priority:** Medium  
**Acceptance criteria:**

- Per-run and per-company token/cost budget limits are enforceable.
- Caching is used for repeated retrieval and summarization steps.
- Long-running jobs are resumable and observable.

#### NFR-AI-04: Security and tenancy

**Description:** AI workflows must respect enterprise security requirements and strict company isolation.  
**Priority:** High  
**Acceptance criteria:**

- Company data is isolated in retrieval, prompts, and storage.
- Secrets are managed securely and never exposed in logs/UI.
- Access control is enforced for run execution and result visibility.

## 4. Technical requirements

### 4.1 Frontend

#### TR-FE-01: Next.js 15

**Description:** The frontend must be built with Next.js 15.  
**Priority:** High  
**Acceptance criteria:**

- Use the App Router
- Leverage Server Components for performance
- Optimized images and assets

#### TR-FE-02: Material UI 7

**Description:** The frontend must use Material UI 7 for the UI.  
**Priority:** High  
**Acceptance criteria:**

- Consistent design using Material UI components
- Customizable theme for corporate branding
- Responsive layout components

#### TR-FE-03: TanStack libraries

**Description:** The frontend must integrate TanStack Table and TanStack Form.  
**Priority:** High  
**Acceptance criteria:**

- TanStack Table for advanced table functionality
- TanStack Form for form management
- Integration with React Server Components

### 4.2 Backend

#### TR-BE-01: GraphQL API

**Description:** The backend must expose a GraphQL API.  
**Priority:** High  
**Acceptance criteria:**

- Schema-first development
- Resolvers for all EAM elements
- Query optimization for complex relationships

#### TR-BE-02: Neo4j integration

**Description:** The backend must integrate with Neo4j.  
**Priority:** High  
**Acceptance criteria:**

- Use the Neo4j driver
- Optimized Cypher queries
- Transaction management

#### TR-BE-03: Keycloak integration

**Description:** The backend must integrate with Keycloak for authentication and authorization.  
**Priority:** High  
**Acceptance criteria:**

- Token-based authentication
- Role-based access control
- Secure GraphQL endpoints

### 4.3 Agentic AI platform

#### TR-AI-01: Agent orchestration with LangGraph

**Description:** Agent workflows must be implemented with LangGraph for explicit stateful orchestration.  
**Priority:** High  
**Acceptance criteria:**

- Agent state graph includes retrieval, reasoning, synthesis, validation, and approval-ready output nodes.
- Tool calling is restricted to approved tools (web research, internal GraphQL retrieval, vector retrieval).
- Checkpointing is enabled to resume interrupted runs.

#### TR-AI-02: Durable workflow execution with Temporal

**Description:** Long-running and scheduled agent workflows must be executed through **self-hosted Temporal (open source)**.  
**Priority:** High  
**Acceptance criteria:**

- Temporal workflows handle retries, backoff, timeout, idempotency, and compensation steps.
- Scheduled jobs support per-company periodic enrichment.
- Workflow history is queryable for operational audit.
- Temporal is deployed and operated in customer-managed infrastructure.
- No dependency on Temporal Cloud or any managed/SaaS Temporal offering.

#### TR-AI-03: Retrieval and knowledge services

**Description:** The platform must support hybrid retrieval for both internal EAM context and external evidence.  
**Priority:** High  
**Acceptance criteria:**

- Internal retrieval from GraphQL scoped by company.
- External retrieval via approved search providers and domain allowlists.
- Optional vector index for evidence chunks with metadata filters.

#### TR-AI-04: AI service integration architecture

**Description:** AI capabilities must be provided via a dedicated AI service integrated with existing GraphQL APIs.  
**Priority:** High  
**Acceptance criteria:**

- AI service exposes internal APIs for run start, status, results, approval actions.
- Existing backend remains source of truth; AI writes draft artifacts via controlled API mutations.
- Feature toggles allow staged rollout per company.

#### TR-AI-05: Agent data access pattern (GraphQL/REST governed access)

**Description:** Agent access to EAM data and mutations must use controlled service APIs through the existing backend.  
**Priority:** High  
**Acceptance criteria:**

- Default pattern: agent reads and writes through internal backend APIs (GraphQL/REST) with Keycloak-based authorization and company scoping.
- Agents must never access Neo4j directly (read or write) from model runtime; all data access must pass through governed backend APIs.
- All write operations must pass backend validation, authorization, and governance checks before persistence.

## 5. Deliverables and timeline

### 5.1 Project phases

1. **Phase 1: Core EAM functionality (4 weeks)**
   - Data model for business capabilities, applications, and data objects
   - GraphQL API for basic CRUD operations
   - Simple list views in the frontend
   - Basic user authentication
   - Basic Excalidraw integration

2. **Phase 2: Data import/export and visualization (3 weeks)**
   - Excel import and export
   - Advanced table features

3. **Phase 3: Advanced functionality (3 weeks)**
   - Link diagram elements to database items
   - Automatic diagram generation
   - Advanced user management
   - Extended permissions

4. **Phase 4: Refinement and completion (2 weeks)**
   - Performance optimization
   - UI/UX improvements
   - Documentation and user guides
   - Acceptance testing

5. **Phase 5: Agentic AI foundation and first use cases (6 weeks)**

- AI service bootstrap with LangGraph and self-hosted Temporal (OSS)
- Company strategic enrichment agent (Mission/Vision/Values/Goals/Strategies/BMC drafts)
- Human-in-the-loop approval workflow and audit trail

6. **Phase 6: Technology lifecycle intelligence (4 weeks)**

- SoftwareProduct/SoftwareVersion and HardwareProduct/HardwareVersion lifecycle ingestion and normalization
- Supplier relationship mapping for supplier assignment
- Lifecycle risk scoring and recommendation generation
- Scheduled scan operations and alerting

7. **Phase 7: As-is to to-be recommendations (5 weeks)**

- Architecture analysis agent and improvement proposals
- Recommendation scoring and roadmap candidate generation
- Diagram suggestion integration

### 5.2 Milestones

1. **M1: Project start** - May 12, 2025
2. **M2: Finish Phase 1** - June 9, 2025
3. **M3: Finish Phase 2** - June 30, 2025
4. **M4: Finish Phase 3** - July 21, 2025
5. **M5: Project completion** - August 4, 2025

6. **M6: AI Foundation Complete** - planned
7. **M7: Lifecycle Intelligence Complete** - planned
8. **M8: To-be Recommendation Agent Complete** - planned

## 6. Assumptions and constraints

### 6.1 Assumptions

- Sufficient development capacity is available
- Users have basic knowledge of Enterprise Architecture Management
- Neo4j and Keycloak are sized appropriately for the planned data volume and user count

### 6.2 Constraints

- The first version supports only Excel for import/export (no CSV, XML, etc.)
- Diagram editing is limited to Excalidraw capabilities
- No direct integration with external EA tools in the first version
- Agent workflow orchestration must use self-hosted open-source components only (no managed SaaS dependency for orchestration).

## 7. Concrete implementation blueprint (LangGraph + self-hosted Temporal)

### 7.1 Target architecture

- **AI Service (new):** Dedicated service for agent execution and orchestration.
- **LangGraph Runtime:** Defines deterministic agent state graphs for each use case.
- **Self-hosted Temporal Cluster/Service:** Executes durable workflows and schedules in customer-managed infrastructure.
- **NextGen EAM GraphQL API:** Remains canonical write/read API for business entities.
- **Neo4j:** System of record for architecture graph and approved AI outputs.
- **Evidence Store:** Persist source snippets, retrieval metadata, and confidence records.
- **Vector Index (optional):** For semantic retrieval over evidence and internal artifacts.

### 7.2 Workflow blueprint by use case

#### Blueprint A: Strategic enrichment (FR-AI-01)

1. Trigger (manual or scheduled) with company context.
2. Temporal workflow starts and creates run snapshot.
3. LangGraph retrieves internal context (existing GEA/BMC data) and external evidence.
4. Agent drafts Mission/Vision/Values/Goals/Strategies/BMC blocks with citations.
5. Validation node checks contradictions and schema compliance.
6. Draft artifacts stored via GraphQL mutations with `status = DRAFT`.
7. Reviewer approves/rejects in UI; approved items are published.

#### Blueprint B: Lifecycle intelligence (FR-AI-02)

1. Collect portfolio inventory (applications, infrastructure, supplier relationships, software versions, hardware versions, SBOM links).
2. Enrich SoftwareProduct/SoftwareVersion and HardwareProduct/HardwareVersion from lifecycle sources.
3. Normalize product/version naming and map supplier assignment via Supplier relationships.
4. Compute risk score and urgency classification.
5. Generate recommendations (upgrade/replace/monitor).
6. Persist findings and open review tasks for architects.

#### Blueprint C: As-is to to-be recommendations (FR-AI-03)

1. Pull as-is graph submodel + strategic artifacts.
2. Run gap analysis nodes (capability, process, application, technology).
3. Generate candidate changes and dependency notes.
4. Score candidates by value/risk/effort/time horizon.
5. Produce to-be recommendation package and optional diagram suggestions.
6. Route through approval and planning workflow.

#### Blueprint D: Conversational assistant and controlled architecture changes (FR-AI-06)

1. User asks a natural-language architecture question or requests a change.
2. Agent retrieves company-scoped graph context through backend APIs.
3. For Q&A: agent returns answer with entity-level citations and confidence.
4. For changes: agent produces structured mutation plan and impact analysis.
5. System runs dry-run validation (schema, permissions, conflicts, integrity checks).
6. Authorized user reviews and approves/rejects proposed changes.
7. Approved plan is executed via governed API mutations and fully audited.

### 7.3 Data model and API additions (implementation-level)

- Add AI domain entities (example names):
  - `AiRun` (run metadata, status, model, cost, duration, company)
  - `AiEvidence` (source URL, snippet, timestamp, confidence)
  - `AiRecommendation` (type, target entities, rationale, score, status)
  - `AiDraftArtifact` (proposed content for Mission/Vision/Goals/etc.)
  - `AiApprovalTask` (assignee, decision, comments, timestamps)
- Add GraphQL operations:
  - `startAiRun`, `cancelAiRun`, `retryAiRun`
  - `getAiRunStatus`, `listAiRuns`
  - `approveAiArtifact`, `rejectAiArtifact`, `publishAiArtifact`
  - `listAiRecommendations`, `applyAiRecommendation`

### 7.4 Security, governance, and operations blueprint

- Enforce company-scoped retrieval and writes in every workflow step.
- Maintain immutable audit logs of prompts/tools/sources/decisions.
- Add policy guardrails (disallowed domains, max-cost, max-runtime, retry limits).
- Introduce observability dashboard (run status, failures, latency, cost by company).

### 7.5 Rollout blueprint

- **Wave 1 (MVP):** FR-AI-01 + approval workflow + citation traceability.
- **Wave 2:** FR-AI-02 lifecycle intelligence for SoftwareProduct/HardwareProduct + scheduled jobs + alerts.
- **Wave 3:** FR-AI-03 target-architecture recommendations + roadmap scoring.
- **Wave 4:** FR-AI-04 quality and relationship discovery agent.
- **Wave 5:** FR-AI-06 conversational assistant + controlled architecture change execution.
  **Priorität:** Hoch  
  **Akzeptanzkriterien:**

- Vordefinierte Rollen (Admin, Architekt, Viewer, etc.)
- Benutzerdefinierte Rollen mit granularen Berechtigungen
- Berechtigungen auf Funktions- und Datenebene
- Vererbung von Berechtigungen
- Temporäre Berechtigungen und Zugriff

#### FR-AU-04: Integration mit Unternehmensverzeichnissen

**Beschreibung:** Das System muss die Integration mit LDAP/Active Directory unterstützen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Synchronisierung von Benutzern und Gruppen
- Single Sign-On über SAML, OpenID Connect oder LDAP
- Automatische Rollenzuweisung basierend auf AD-Gruppen

## 3. Nicht-funktionale Anforderungen

### 3.1 Leistung und Skalierbarkeit

#### NFR-PS-01: Reaktionszeit

**Beschreibung:** Das System muss angemessene Reaktionszeiten bieten.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Seitenladungen unter 2 Sekunden
- API-Antworten unter 1 Sekunde für typische Anfragen
- Visualisierungen laden unter 3 Sekunden für bis zu 500 Elemente

#### NFR-PS-02: Skalierbarkeit

**Beschreibung:** Das System muss mit wachsenden Datenmengen skalieren.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Unterstützung für mindestens 10.000 EAM-Elemente
- Unterstützung für mindestens 50.000 Beziehungen
- Unterstützung für mindestens 50 gleichzeitige Benutzer

### 3.2 Sicherheit

#### NFR-SE-01: Datenschutz

**Beschreibung:** Das System muss die Vertraulichkeit und Integrität der EAM-Daten gewährleisten.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Verschlüsselung sensibler Daten
- Zugriffskontrolle auf Datenebene
- Audit-Trail für Änderungen an EAM-Daten

#### NFR-SE-02: Compliance

**Beschreibung:** Das System muss relevante Compliance-Anforderungen erfüllen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- DSGVO-konformes Datenmanagement
- Exportkontrolle für sensitive Architekturinformationen
- Einhaltung der IT-Sicherheitsrichtlinien des Unternehmens

### 3.3 Benutzererlebnis

#### NFR-UX-01: Benutzerfreundlichkeit

**Beschreibung:** Das System muss benutzerfreundlich und intuitiv bedienbar sein.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Konsistente und intuitive Benutzeroberfläche
- Responsive Design für verschiedene Bildschirmgrößen
- Barrierefreiheit nach WCAG 2.1 AA-Standard

#### NFR-UX-02: Internationalisierung

**Beschreibung:** Das System muss mehrere Sprachen unterstützen.  
**Priorität:** Niedrig  
**Akzeptanzkriterien:**

- Unterstützung für mindestens Deutsch und Englisch
- Erweiterbarkeit für weitere Sprachen
- Lokalisierung von Datum, Uhrzeit und Zahlenformaten

### 3.4 Wartbarkeit und Betrieb

#### NFR-MO-01: Containerisierung

**Beschreibung:** Das System muss vollständig in Docker-Containern laufen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Docker-Container für alle Komponenten
- Docker Compose für einfache Bereitstellung
- Konfigurierbarkeit über Umgebungsvariablen

#### NFR-MO-02: Backup und Wiederherstellung

**Beschreibung:** Das System muss regelmäßige Backups und Wiederherstellung unterstützen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Automatisierte Backups der Neo4j-Datenbank
- Wiederherstellungsprozess für Datenbanken
- Export und Import der gesamten EAM-Konfiguration

## 4. Technische Anforderungen

### 4.1 Frontend

#### TR-FE-01: Next.js 15

**Beschreibung:** Das Frontend muss mit Next.js 15 entwickelt werden.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Verwendung des App-Routers
- Server Components für bessere Performance
- Optimierte Bilder und Assets

#### TR-FE-02: Material UI 7

**Beschreibung:** Das Frontend muss Material UI 7 für die Benutzeroberfläche verwenden.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Konsistentes Design mit Material UI-Komponenten
- Anpassbares Theme für Corporate Design
- Responsive Layout-Komponenten

#### TR-FE-03: TanStack Bibliotheken

**Beschreibung:** Das Frontend muss TanStack Table und TanStack Form integrieren.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- TanStack Table für erweiterte Tabellenfunktionalität
- TanStack Form für Formularverwaltung
- Integration mit React Server Components

### 4.2 Backend

#### TR-BE-01: GraphQL API

**Beschreibung:** Das Backend muss eine GraphQL-API bereitstellen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Schema-First-Entwicklung
- Resolver-Implementierung für alle EAM-Elemente
- Abfrage-Optimierung für komplexe Beziehungen

#### TR-BE-02: Neo4j Integration

**Beschreibung:** Das Backend muss mit Neo4j integriert sein.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Verwendung des Neo4j-Treibers
- Optimierte Cypher-Abfragen
- Transaktionsmanagement

#### TR-BE-03: Keycloak Integration

**Beschreibung:** Das Backend muss mit Keycloak für Authentifizierung und Autorisierung integriert sein.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Token-basierte Authentifizierung
- Rollenbasierte Zugriffssteuerung
- Sicherung von GraphQL-Endpunkten

## 5. Lieferumfang und Zeitplan

### 5.1 Projektphasen

1. **Phase 1: Grundlegende EAM-Funktionalität (4 Wochen)**
   - Datenmodell für Business Capabilities, Applikationen und Datenobjekte
   - GraphQL-API für grundlegende CRUD-Operationen
   - Einfache Listendarstellung im Frontend
   - Basis-Benutzerauthentifizierung
   - Grundlegende Excalidraw-Integration

2. **Phase 2: Datenimport/-export und Visualisierung (3 Wochen)**
   - Excel-Import und -Export
   - Erweiterte Tabellenfunktionen

3. **Phase 3: Erweiterte Funktionalität (3 Wochen)**
   - Verknüpfung von Diagrammelementen mit Datenbank
   - Automatische Diagrammgenerierung
   - Erweiterte Benutzerverwaltung
   - Erweiterte Berechtigungen

4. **Phase 4: Verfeinerung und Abschluss (2 Wochen)**
   - Leistungsoptimierung
   - UI/UX-Verbesserungen
   - Dokumentation und Benutzerhandbücher
   - Abnahmetests

### 5.2 Meilensteine

1. **M1: Projektstart** - 12. Mai 2025
2. **M2: Abschluss Phase 1** - 9. Juni 2025
3. **M3: Abschluss Phase 2** - 30. Juni 2025
4. **M4: Abschluss Phase 3** - 21. Juli 2025
5. **M5: Projektabschluss** - 4. August 2025

## 6. Annahmen und Einschränkungen

### 6.1 Annahmen

- Ausreichende Entwicklungsressourcen sind verfügbar
- Benutzer haben grundlegende Kenntnisse in Enterprise Architecture Management
- Neo4j und Keycloak sind für die geplante Datenmenge und Benutzeranzahl ausreichend dimensioniert

### 6.2 Einschränkungen

- Die erste Version unterstützt nur Excel als Import-/Exportformat (keine CSV, XML, etc.)
- Die Diagramm-Bearbeitung ist auf die Funktionalität von Excalidraw beschränkt
- Keine direkte Integration mit externen EA-Tools in der ersten Version
