// Beispielpersonen für Simple-EAM

// Zuerst prüfen, ob Personen bereits existieren, um Duplikate zu vermeiden
MATCH (p:Person)
WITH count(p) as personCount

// Nur einfügen, wenn wir weniger als 5 Personen haben
CALL apoc.do.when(
  personCount < 5,
  '
  // IT-Abteilung
  CREATE (p1:Person {
    id: randomUUID(),
    firstName: "Thomas",
    lastName: "Müller",
    email: "thomas.mueller@example.com",
    department: "IT",
    role: "CIO",
    phone: "+49 123 45678",
    createdAt: datetime(),
    updatedAt: datetime()
  });

  CREATE (p2:Person {
    id: randomUUID(),
    firstName: "Sabine",
    lastName: "Weber",
    email: "sabine.weber@example.com",
    department: "IT",
    role: "Enterprise Architect",
    phone: "+49 123 45679",
    createdAt: datetime(),
    updatedAt: datetime()
  });

  // Geschäftsbereiche
  CREATE (p3:Person {
    id: randomUUID(),
    firstName: "Michael",
    lastName: "Schmidt",
    email: "michael.schmidt@example.com",
    department: "Finanzen",
    role: "CFO",
    phone: "+49 123 45680",
    createdAt: datetime(),
    updatedAt: datetime()
  });

  CREATE (p4:Person {
    id: randomUUID(),
    firstName: "Julia",
    lastName: "Becker",
    email: "julia.becker@example.com",
    department: "Marketing",
    role: "CMO",
    phone: "+49 123 45681",
    createdAt: datetime(),
    updatedAt: datetime()
  });

  CREATE (p5:Person {
    id: randomUUID(),
    firstName: "Andreas",
    lastName: "Fischer",
    email: "andreas.fischer@example.com",
    department: "Vertrieb",
    role: "Vertriebsleiter",
    phone: "+49 123 45682",
    createdAt: datetime(),
    updatedAt: datetime()
  });

  CREATE (p6:Person {
    id: randomUUID(),
    firstName: "Lisa",
    lastName: "Hoffmann",
    email: "lisa.hoffmann@example.com",
    department: "Produktion",
    role: "Produktionsleiter",
    phone: "+49 123 45683",
    createdAt: datetime(),
    updatedAt: datetime()
  });

  CREATE (p7:Person {
    id: randomUUID(),
    firstName: "Stefan",
    lastName: "Wagner",
    email: "stefan.wagner@example.com",
    department: "Forschung & Entwicklung",
    role: "R&D Manager",
    phone: "+49 123 45684",
    createdAt: datetime(),
    updatedAt: datetime()
  });

  CREATE (p8:Person {
    id: randomUUID(),
    firstName: "Claudia",
    lastName: "Koch",
    email: "claudia.koch@example.com",
    department: "Personal",
    role: "HR Director",
    phone: "+49 123 45685",
    createdAt: datetime(),
    updatedAt: datetime()
  });

  RETURN "8 Beispielpersonen wurden erfolgreich erstellt." as message
  ',
  'RETURN "Es sind bereits genügend Beispielpersonen in der Datenbank vorhanden." as message',
  {}
) YIELD value
RETURN value.message as Ergebnis;
