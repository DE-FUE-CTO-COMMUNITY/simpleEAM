// Neo4j-Datenmodell für Simple-EAM
// Erstellt Constraints und Indizes für Entitätstypen

// Constraint für Capability
CREATE CONSTRAINT capability_id_unique IF NOT EXISTS
FOR (c:Capability) REQUIRE c.id IS UNIQUE;

// Index für Capability
CREATE INDEX capability_name_idx IF NOT EXISTS
FOR (c:Capability) ON (c.name);

// Index für Capability-Level
CREATE INDEX capability_level_idx IF NOT EXISTS
FOR (c:Capability) ON (c.level);

// Constraint für Application
CREATE CONSTRAINT application_id_unique IF NOT EXISTS
FOR (a:Application) REQUIRE a.id IS UNIQUE;

// Index für Application
CREATE INDEX application_name_idx IF NOT EXISTS
FOR (a:Application) ON (a.name);

// Index für Application-Status
CREATE INDEX application_status_idx IF NOT EXISTS
FOR (a:Application) ON (a.status);

// Constraint für DataObject
CREATE CONSTRAINT dataobject_id_unique IF NOT EXISTS
FOR (d:DataObject) REQUIRE d.id IS UNIQUE;

// Index für DataObject
CREATE INDEX dataobject_name_idx IF NOT EXISTS
FOR (d:DataObject) ON (d.name);

// Index für DataObject-Classification
CREATE INDEX dataobject_classification_idx IF NOT EXISTS
FOR (d:DataObject) ON (d.classification);

// Schema für Business Capabilities
CREATE CONSTRAINT IF NOT EXISTS FOR (c:Capability) REQUIRE c.createdAt IS NOT NULL;
CREATE CONSTRAINT IF NOT EXISTS FOR (c:Capability) REQUIRE c.updatedAt IS NOT NULL;
CREATE CONSTRAINT IF NOT EXISTS FOR (c:Capability) REQUIRE c.name IS NOT NULL;

// Schema für Business Applications
CREATE CONSTRAINT IF NOT EXISTS FOR (a:Application) REQUIRE a.createdAt IS NOT NULL;
CREATE CONSTRAINT IF NOT EXISTS FOR (a:Application) REQUIRE a.updatedAt IS NOT NULL;
CREATE CONSTRAINT IF NOT EXISTS FOR (a:Application) REQUIRE a.name IS NOT NULL;

// Schema für Business Data Objects
CREATE CONSTRAINT IF NOT EXISTS FOR (d:DataObject) REQUIRE d.createdAt IS NOT NULL;
CREATE CONSTRAINT IF NOT EXISTS FOR (d:DataObject) REQUIRE d.updatedAt IS NOT NULL;
CREATE CONSTRAINT IF NOT EXISTS FOR (d:DataObject) REQUIRE d.name IS NOT NULL;

// Schema für Diagramme
CREATE CONSTRAINT IF NOT EXISTS FOR (d:Diagram) REQUIRE d.createdAt IS NOT NULL;
CREATE CONSTRAINT IF NOT EXISTS FOR (d:Diagram) REQUIRE d.updatedAt IS NOT NULL;
CREATE CONSTRAINT IF NOT EXISTS FOR (d:Diagram) REQUIRE d.name IS NOT NULL;