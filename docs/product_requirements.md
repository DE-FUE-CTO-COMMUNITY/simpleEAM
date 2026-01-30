# Simple-EAM: Product Requirements Document

## Document information

| Field    | Value                         |
| -------- | ----------------------------- |
| Document | Product Requirements Document |
| Date     | May 12, 2025                  |
| Version  | 1.0                           |
| Status   | Draft                         |

## 1. Introduction

### 1.1 Purpose

Simple-EAM is an Enterprise Architecture Management solution that helps organizations document, analyze, and optimize their IT landscape. This document outlines the functional and non-functional requirements for the system.

### 1.2 Project overview

Simple-EAM consists of multiple components delivered as Docker containers:

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
  - Vendor/manufacturer
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

### 5.2 Milestones

1. **M1: Project start** - May 12, 2025
2. **M2: Finish Phase 1** - June 9, 2025
3. **M3: Finish Phase 2** - June 30, 2025
4. **M4: Finish Phase 3** - July 21, 2025
5. **M5: Project completion** - August 4, 2025

## 6. Assumptions and constraints

### 6.1 Assumptions

- Sufficient development capacity is available
- Users have basic knowledge of Enterprise Architecture Management
- Neo4j and Keycloak are sized appropriately for the planned data volume and user count

### 6.2 Constraints

- The first version supports only Excel for import/export (no CSV, XML, etc.)
- Diagram editing is limited to Excalidraw capabilities
- No direct integration with external EA tools in the first version
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
