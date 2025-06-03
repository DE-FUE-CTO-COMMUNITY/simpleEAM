// Erstellt eine Testperson für das Benutzerprofil
// Diese Person kann mit einer Keycloak-E-Mail-Adresse verknüpft werden

// Prüfen, ob bereits eine Person mit der Test-E-Mail existiert
MATCH (existing:Person {email: "test.user@dev-server.mf2.eu"})
WITH count(existing) as existingCount

// Nur erstellen, wenn noch keine Person mit dieser E-Mail existiert
CALL apoc.do.when(
  existingCount = 0,
  '
  CREATE (testUser:Person {
    id: randomUUID(),
    firstName: "Test",
    lastName: "User",
    email: "test.user@dev-server.mf2.eu",
    department: "IT",
    role: "Testbenutzer",
    phone: "+49 123 456789",
    createdAt: datetime(),
    updatedAt: datetime()
  })
  RETURN "Testbenutzer wurde erfolgreich erstellt." as message
  ',
  'RETURN "Testbenutzer existiert bereits." as message',
  {}
) YIELD value
RETURN value.message as Ergebnis;
