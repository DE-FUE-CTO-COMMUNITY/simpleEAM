// Eine sehr einfache Person erstellen zum Testen
CREATE (p:Person {
  id: "test-id-1",
  firstName: "Test",
  lastName: "Person",
  email: "test@example.com",
  createdAt: datetime()
});
