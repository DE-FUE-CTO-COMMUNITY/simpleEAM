// Beispieldaten für Simple-EAM
// Definiert Beispiel-Capabilities, Applications und DataObjects

// Business Capabilities - Oberste Ebene
CREATE (c1:Capability {
  id: "cap-1",
  name: "Vertrieb",
  description: "Vertriebsprozesse und -aktivitäten",
  maturityLevel: 4,
  status: "aktiv",
  businessValue: "hoch",
  owner: "Max Mustermann",
  level: 1,
  tags: ["verkauf", "vertrieb"],
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (c2:Capability {
  id: "cap-2",
  name: "Marketing",
  description: "Marketingprozesse und -kampagnen",
  maturityLevel: 3,
  status: "aktiv",
  businessValue: "mittel",
  owner: "Anna Schmidt",
  level: 1,
  tags: ["werbung", "marketing"],
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (c3:Capability {
  id: "cap-3",
  name: "Produktion",
  description: "Herstellung von Produkten",
  maturityLevel: 5,
  status: "aktiv",
  businessValue: "hoch",
  owner: "Thomas Weber",
  level: 1,
  tags: ["fertigung", "produktion"],
  createdAt: datetime(),
  updatedAt: datetime()
});

// Business Capabilities - Zweite Ebene
CREATE (c11:Capability {
  id: "cap-1-1",
  name: "Auftragsmanagement",
  description: "Verwaltung von Kundenaufträgen",
  maturityLevel: 4,
  status: "aktiv",
  businessValue: "hoch",
  owner: "Max Mustermann",
  level: 2,
  tags: ["aufträge", "bestellungen"],
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (c12:Capability {
  id: "cap-1-2",
  name: "Kundenbetreuung",
  description: "Betreuung von Bestandskunden",
  maturityLevel: 3,
  status: "in Entwicklung",
  businessValue: "mittel",
  owner: "Lisa Fischer",
  level: 2,
  tags: ["kunden", "service"],
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (c21:Capability {
  id: "cap-2-1",
  name: "Digitales Marketing",
  description: "Online Marketing und Social Media",
  maturityLevel: 2,
  status: "aktiv",
  businessValue: "mittel",
  owner: "Anna Schmidt",
  level: 2,
  tags: ["digital", "online", "social media"],
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (c31:Capability {
  id: "cap-3-1",
  name: "Qualitätssicherung",
  description: "Sicherstellung der Produktqualität",
  maturityLevel: 4,
  status: "aktiv",
  businessValue: "hoch",
  owner: "Klaus Müller",
  level: 2,
  tags: ["qualität", "tests"],
  createdAt: datetime(),
  updatedAt: datetime()
});

// Verbinde Capabilities in der Hierarchie
CREATE (c11)-[:CHILD_OF]->(c1);
CREATE (c12)-[:CHILD_OF]->(c1);
CREATE (c21)-[:CHILD_OF]->(c2);
CREATE (c31)-[:CHILD_OF]->(c3);

// Applikationen
CREATE (a1:Application {
  id: "app-1",
  name: "CRM-System",
  description: "Customer Relationship Management System",
  owner: "Vertriebsabteilung",
  status: "produktiv",
  criticality: "hoch",
  technologyStack: "Java, Oracle",
  version: "3.5.2",
  hostingEnvironment: "On-Premise",
  vendor: "SAP",
  cost: 150000.00,
  implementationDate: date("2020-05-15"),
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (a2:Application {
  id: "app-2",
  name: "Marketing-Automation",
  description: "Tool für automatisiertes Marketing",
  owner: "Marketingabteilung",
  status: "produktiv",
  criticality: "mittel",
  technologyStack: "SaaS",
  version: "2.0",
  hostingEnvironment: "Cloud",
  vendor: "Hubspot",
  cost: 60000.00,
  implementationDate: date("2021-02-10"),
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (a3:Application {
  id: "app-3",
  name: "ERP-System",
  description: "Enterprise Resource Planning",
  owner: "IT-Abteilung",
  status: "produktiv",
  criticality: "kritisch",
  technologyStack: ".NET, SQL Server",
  version: "5.1.0",
  hostingEnvironment: "On-Premise",
  vendor: "Microsoft",
  cost: 250000.00,
  implementationDate: date("2019-08-20"),
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (a4:Application {
  id: "app-4",
  name: "Produktionssystem",
  description: "Manufacturing Execution System",
  owner: "Produktionsabteilung",
  status: "produktiv",
  criticality: "kritisch",
  technologyStack: "Java, PostgreSQL",
  version: "2.3.7",
  hostingEnvironment: "On-Premise",
  vendor: "Siemens",
  cost: 180000.00,
  implementationDate: date("2020-11-05"),
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (a5:Application {
  id: "app-5",
  name: "Legacy CRM",
  description: "Altes CRM-System",
  owner: "Vertriebsabteilung",
  status: "wird abgeschaltet",
  criticality: "niedrig",
  technologyStack: "PHP, MySQL",
  version: "1.8.0",
  hostingEnvironment: "On-Premise",
  vendor: "Intern",
  cost: 0.00,
  implementationDate: date("2015-03-12"),
  endOfLifeDate: date("2023-12-31"),
  createdAt: datetime(),
  updatedAt: datetime()
});

// Datenobjekte
CREATE (d1:DataObject {
  id: "data-1",
  name: "Kundendaten",
  description: "Stammdaten der Kunden",
  owner: "Vertriebsabteilung",
  classification: "vertraulich",
  source: "CRM-System",
  format: "relationale Daten",
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (d2:DataObject {
  id: "data-2",
  name: "Bestelldaten",
  description: "Informationen zu Kundenbestellungen",
  owner: "Vertriebsabteilung",
  classification: "intern",
  source: "ERP-System",
  format: "relationale Daten",
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (d3:DataObject {
  id: "data-3",
  name: "Marketingkontakte",
  description: "Kontaktdaten für Marketing-Kampagnen",
  owner: "Marketingabteilung",
  classification: "intern",
  source: "Marketing-Automation",
  format: "NoSQL",
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (d4:DataObject {
  id: "data-4",
  name: "Produktionsdaten",
  description: "Daten aus der Produktion",
  owner: "Produktionsabteilung",
  classification: "intern",
  source: "Produktionssystem",
  format: "Zeitreihen",
  createdAt: datetime(),
  updatedAt: datetime()
});

CREATE (d5:DataObject {
  id: "data-5",
  name: "Qualitätsdaten",
  description: "Daten zur Produktqualität",
  owner: "Qualitätssicherung",
  classification: "intern",
  source: "Produktionssystem",
  format: "relationaler Export",
  createdAt: datetime(),
  updatedAt: datetime()
});

// Verknüpfungen zwischen Applications und Capabilities
CREATE (a1)-[:SUPPORTS {strength: "stark"}]->(c1);
CREATE (a1)-[:SUPPORTS {strength: "stark"}]->(c11);
CREATE (a1)-[:SUPPORTS {strength: "stark"}]->(c12);
CREATE (a2)-[:SUPPORTS {strength: "stark"}]->(c2);
CREATE (a2)-[:SUPPORTS {strength: "stark"}]->(c21);
CREATE (a3)-[:SUPPORTS {strength: "mittel"}]->(c1);
CREATE (a3)-[:SUPPORTS {strength: "stark"}]->(c3);
CREATE (a4)-[:SUPPORTS {strength: "stark"}]->(c3);
CREATE (a4)-[:SUPPORTS {strength: "stark"}]->(c31);
CREATE (a5)-[:SUPPORTS {strength: "schwach"}]->(c1);

// Verknüpfungen zwischen Applications und DataObjects
CREATE (a1)-[:MANAGES]->(d1);
CREATE (a1)-[:READS]->(d2);
CREATE (a2)-[:MANAGES]->(d3);
CREATE (a3)-[:MANAGES]->(d2);
CREATE (a4)-[:MANAGES]->(d4);
CREATE (a4)-[:MANAGES]->(d5);
CREATE (a5)-[:READS]->(d1);

// Verknüpfungen zwischen Applications (Schnittstellen)
CREATE (a1)-[:INTERFACES_WITH {protocol: "REST API", dataFrequency: "täglich"}]->(a3);
CREATE (a2)-[:INTERFACES_WITH {protocol: "REST API", dataFrequency: "stündlich"}]->(a1);
CREATE (a3)-[:INTERFACES_WITH {protocol: "SOAP", dataFrequency: "täglich"}]->(a4);
CREATE (a5)-[:INTERFACES_WITH {protocol: "Dateiaustausch", dataFrequency: "wöchentlich"}]->(a1);