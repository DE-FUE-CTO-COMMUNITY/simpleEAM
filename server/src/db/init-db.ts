import { neo4jDriver, closeDriver } from './neo4j-client'

/**
 * Löscht alle Daten aus der Datenbank
 */
async function clearDatabase(session: any) {
  console.log('Lösche alle vorhandenen Daten aus der Datenbank...')
  try {
    // Alle Knoten und Beziehungen löschen
    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `)
    console.log('Alle Daten wurden erfolgreich gelöscht.')
  } catch (error) {
    console.error('Fehler beim Löschen der Daten:', error)
    throw error
  }
}

/**
 * Initialisiert die Neo4j-Datenbank mit Constraints und Indizes
 */
async function initDatabase(reset: boolean = false) {
  console.log('Initialisiere Datenbank...')

  const session = neo4jDriver.session()
  try {
    // Wenn reset=true, dann zuerst alle Daten löschen
    if (reset) {
      await clearDatabase(session)
    }

    // Constraints für Business Capabilities
    await session.run(`
      CREATE CONSTRAINT business_capability_id_unique IF NOT EXISTS
      FOR (c:BusinessCapability) REQUIRE c.id IS UNIQUE
    `)

    // Constraints für Applications
    await session.run(`
      CREATE CONSTRAINT application_id_unique IF NOT EXISTS
      FOR (a:Application) REQUIRE a.id IS UNIQUE
    `)

    // Constraints für Data Objects
    await session.run(`
      CREATE CONSTRAINT data_object_id_unique IF NOT EXISTS
      FOR (d:DataObject) REQUIRE d.id IS UNIQUE
    `)

    // Constraints für Application Interfaces
    await session.run(`
      CREATE CONSTRAINT application_interface_id_unique IF NOT EXISTS
      FOR (i:ApplicationInterface) REQUIRE i.id IS UNIQUE
    `)

    // Indizes für die Suche
    await session.run(`
      CREATE INDEX business_capability_name_index IF NOT EXISTS
      FOR (c:BusinessCapability) ON (c.name)
    `)

    await session.run(`
      CREATE INDEX application_name_index IF NOT EXISTS
      FOR (a:Application) ON (a.name)
    `)

    await session.run(`
      CREATE INDEX data_object_name_index IF NOT EXISTS
      FOR (d:DataObject) ON (d.name)
    `)

    console.log('Datenbank-Constraints und -Indizes erfolgreich erstellt.')

    // Optional: Testdaten einfügen, falls die Datenbank leer ist
    const result = await session.run('MATCH (n) RETURN count(n) AS nodeCount')
    const nodeCount = result.records[0].get('nodeCount').toNumber()

    if (nodeCount === 0 && process.env.NODE_ENV !== 'production') {
      console.log('Keine Daten gefunden. Erstelle Testdaten...')
      await createSampleData(session)
      console.log('Testdaten erfolgreich erstellt.')
    } else {
      console.log(`Datenbank enthält bereits ${nodeCount} Knoten. Überspringe Testdatenerstellung.`)
    }
  } catch (error) {
    console.error('Fehler bei der Datenbank-Initialisierung:', error)
    throw error
  } finally {
    await session.close()
  }
}

/**
 * Erstellt Testdaten in der Datenbank
 */
async function createSampleData(session: any) {
  try {
    // Business Capabilities erstellen
    await session.run(`
      CREATE (c1:BusinessCapability {
        id: "bc-001",
        name: "Kundenbeziehung",
        description: "Management der Kundenbeziehungen",
        owner: "Vertriebsleitung",
        maturityLevel: 4,
        status: "ACTIVE",
        businessValue: 9,
        tags: ["Kunde", "CRM", "Vertrieb"],
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (c2:BusinessCapability {
        id: "bc-002",
        name: "Produktentwicklung",
        description: "Entwicklung neuer Produkte und Services",
        owner: "Produktmanagement",
        maturityLevel: 3,
        status: "ACTIVE",
        businessValue: 8,
        tags: ["Produkt", "Innovation"],
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (c3:BusinessCapability {
        id: "bc-003",
        name: "Marketing",
        description: "Vermarktung von Produkten und Dienstleistungen",
        owner: "Marketingleitung",
        maturityLevel: 3,
        status: "ACTIVE",
        businessValue: 7,
        tags: ["Marketing", "Kommunikation"],
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (c1_1:BusinessCapability {
        id: "bc-004",
        name: "Kundensupport",
        description: "Unterstützung von Kunden bei Problemen",
        owner: "Support Manager",
        maturityLevel: 4,
        status: "ACTIVE",
        businessValue: 8,
        tags: ["Kunde", "Support"],
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (c1_2:BusinessCapability {
        id: "bc-005",
        name: "Vertrieb",
        description: "Vertrieb von Produkten und Dienstleistungen",
        owner: "Vertriebsleitung",
        maturityLevel: 5,
        status: "ACTIVE",
        businessValue: 10,
        tags: ["Vertrieb", "Sales"],
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    // Hierarchiebeziehungen herstellen
    await session.run(`
      MATCH (c1:BusinessCapability {id: "bc-001"}), (c1_1:BusinessCapability {id: "bc-004"})
      CREATE (c1_1)-[:HAS_PARENT]->(c1)
    `)

    await session.run(`
      MATCH (c1:BusinessCapability {id: "bc-001"}), (c1_2:BusinessCapability {id: "bc-005"})
      CREATE (c1_2)-[:HAS_PARENT]->(c1)
    `)

    // Applikationen erstellen
    await session.run(`
      CREATE (a1:Application {
        id: "app-001",
        name: "CRM-System",
        description: "Customer Relationship Management System",
        owner: "IT-Abteilung",
        status: "ACTIVE",
        criticality: "HIGH",
        technologyStack: ["Java", "Spring", "Oracle"],
        version: "3.5.1",
        hostingEnvironment: "On-Premises",
        vendor: "Salesforce",
        costs: 125000.00,
        introductionDate: date("2020-06-15"),
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (a2:Application {
        id: "app-002",
        name: "Marketing-Automatisierung",
        description: "System zur Automatisierung von Marketing-Kampagnen",
        owner: "Marketing",
        status: "ACTIVE",
        criticality: "MEDIUM",
        technologyStack: ["Python", "Django", "PostgreSQL"],
        version: "2.1.0",
        hostingEnvironment: "Cloud",
        vendor: "HubSpot",
        costs: 75000.00,
        introductionDate: date("2021-03-10"),
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (a3:Application {
        id: "app-003",
        name: "Produkt-Datenbank",
        description: "Zentrale Datenbank für alle Produktinformationen",
        owner: "Produktmanagement",
        status: "ACTIVE",
        criticality: "CRITICAL",
        technologyStack: ["MS SQL Server", ".NET"],
        version: "4.0.2",
        hostingEnvironment: "On-Premises",
        vendor: "Microsoft",
        costs: 90000.00,
        introductionDate: date("2019-11-01"),
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (a4:Application {
        id: "app-004",
        name: "Ticket-System",
        description: "Helpdesk und Ticket-Management",
        owner: "IT-Support",
        status: "ACTIVE",
        criticality: "HIGH",
        technologyStack: ["PHP", "Laravel", "MySQL"],
        version: "5.2.3",
        hostingEnvironment: "Cloud",
        vendor: "Zendesk",
        costs: 45000.00,
        introductionDate: date("2022-01-15"),
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    // Datenobjekte erstellen
    await session.run(`
      CREATE (d1:DataObject {
        id: "do-001",
        name: "Kundendaten",
        description: "Zentrale Kundeninformationen",
        owner: "Datenschutzbeauftragter",
        classification: "CONFIDENTIAL",
        source: "CRM-System",
        format: "SQL-Datenbank",
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (d2:DataObject {
        id: "do-002",
        name: "Produktkatalog",
        description: "Vollständiger Katalog aller Produkte",
        owner: "Produktmanagement",
        classification: "INTERNAL",
        source: "Produkt-Datenbank",
        format: "SQL-Datenbank",
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (d3:DataObject {
        id: "do-003",
        name: "Marketing-Kampagnen",
        description: "Daten zu Marketing-Kampagnen",
        owner: "Marketing",
        classification: "INTERNAL",
        source: "Marketing-Automatisierung",
        format: "JSON",
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (d4:DataObject {
        id: "do-004",
        name: "Support-Tickets",
        description: "Kundenanfragen und Problemberichte",
        owner: "Support",
        classification: "CONFIDENTIAL",
        source: "Ticket-System",
        format: "SQL-Datenbank",
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    // Schnittstellendefinitionen erstellen
    await session.run(`
      CREATE (i1:ApplicationInterface {
        id: "int-001",
        name: "CRM-to-Marketing",
        description: "Kundendaten für Marketing-Kampagnen",
        interfaceType: "API",
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    await session.run(`
      CREATE (i2:ApplicationInterface {
        id: "int-002",
        name: "Produkte-to-CRM",
        description: "Produktdaten für Vertrieb",
        interfaceType: "API",
        createdAt: datetime(),
        updatedAt: datetime()
      })
    `)

    // Application-to-Capability Beziehungen
    await session.run(`
      MATCH (a1:Application {id: "app-001"}), (c1:BusinessCapability {id: "bc-001"})
      CREATE (a1)-[:SUPPORTS]->(c1)
    `)

    await session.run(`
      MATCH (a1:Application {id: "app-001"}), (c1_2:BusinessCapability {id: "bc-005"})
      CREATE (a1)-[:SUPPORTS]->(c1_2)
    `)

    await session.run(`
      MATCH (a2:Application {id: "app-002"}), (c3:BusinessCapability {id: "bc-003"})
      CREATE (a2)-[:SUPPORTS]->(c3)
    `)

    await session.run(`
      MATCH (a3:Application {id: "app-003"}), (c2:BusinessCapability {id: "bc-002"})
      CREATE (a3)-[:SUPPORTS]->(c2)
    `)

    await session.run(`
      MATCH (a4:Application {id: "app-004"}), (c1_1:BusinessCapability {id: "bc-004"})
      CREATE (a4)-[:SUPPORTS]->(c1_1)
    `)

    // Application-to-DataObject Beziehungen
    await session.run(`
      MATCH (a1:Application {id: "app-001"}), (d1:DataObject {id: "do-001"})
      CREATE (a1)-[:USES]->(d1)
    `)

    await session.run(`
      MATCH (a2:Application {id: "app-002"}), (d3:DataObject {id: "do-003"})
      CREATE (a2)-[:USES]->(d3)
    `)

    await session.run(`
      MATCH (a3:Application {id: "app-003"}), (d2:DataObject {id: "do-002"})
      CREATE (a3)-[:USES]->(d2)
    `)

    await session.run(`
      MATCH (a4:Application {id: "app-004"}), (d4:DataObject {id: "do-004"})
      CREATE (a4)-[:USES]->(d4)
    `)

    // Capability-to-DataObject Beziehungen
    await session.run(`
      MATCH (c1:BusinessCapability {id: "bc-001"}), (d1:DataObject {id: "do-001"})
      CREATE (c1)-[:RELATED_TO]->(d1)
    `)

    await session.run(`
      MATCH (c2:BusinessCapability {id: "bc-002"}), (d2:DataObject {id: "do-002"})
      CREATE (c2)-[:RELATED_TO]->(d2)
    `)

    await session.run(`
      MATCH (c3:BusinessCapability {id: "bc-003"}), (d3:DataObject {id: "do-003"})
      CREATE (c3)-[:RELATED_TO]->(d3)
    `)

    await session.run(`
      MATCH (c1_1:BusinessCapability {id: "bc-004"}), (d4:DataObject {id: "do-004"})
      CREATE (c1_1)-[:RELATED_TO]->(d4)
    `)

    // Interface-Beziehungen
    // Hier müssen wir die Beziehungen einzeln erstellen, da Neo4j keine mehrfachen Beziehungen in einer Abfrage unterstützt
    await session.run(`
      MATCH (a1:Application {id: "app-001"}), (i1:ApplicationInterface {id: "int-001"})
      CREATE (a1)-[:HAS_INTERFACE]->(i1)
    `)

    await session.run(`
      MATCH (i1:ApplicationInterface {id: "int-001"}), (a2:Application {id: "app-002"})
      CREATE (i1)-[:INTERFACE_TO]->(a2)
    `)

    await session.run(`
      MATCH (a3:Application {id: "app-003"}), (i2:ApplicationInterface {id: "int-002"})
      CREATE (a3)-[:HAS_INTERFACE]->(i2)
    `)

    await session.run(`
      MATCH (i2:ApplicationInterface {id: "int-002"}), (a1:Application {id: "app-001"})
      CREATE (i2)-[:INTERFACE_TO]->(a1)
    `)

    // Datenübertragung über Interfaces
    await session.run(`
      MATCH (i1:ApplicationInterface {id: "int-001"}), (d1:DataObject {id: "do-001"})
      CREATE (i1)-[:TRANSFERS]->(d1)
    `)

    await session.run(`
      MATCH (i2:ApplicationInterface {id: "int-002"}), (d2:DataObject {id: "do-002"})
      CREATE (i2)-[:TRANSFERS]->(d2)
    `)

    console.log('Testdaten erfolgreich erstellt.')
  } catch (error) {
    console.error('Fehler beim Erstellen der Testdaten:', error)
    throw error
  }
}

// Überprüfen, ob ein Reset-Parameter übergeben wurde
const resetArg = process.argv.includes('--reset')

// Skript ausführen
initDatabase(resetArg)
  .then(() => {
    console.log('Datenbank-Initialisierung erfolgreich.')
    return closeDriver()
  })
  .catch(error => {
    console.error('Fehler bei der Datenbank-Initialisierung:', error)
    process.exit(1)
  })
