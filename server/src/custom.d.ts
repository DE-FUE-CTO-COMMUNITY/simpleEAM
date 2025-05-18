// Deklaration zur Lösung von Typ-Inkompatibilitäten in Middleware-Paketen
declare namespace Express {
  // Hinzufügen von leeren Deklarationen, um Typkonflikte zu beheben
  interface Request {}
  interface Response {}
  interface Application {}
}
