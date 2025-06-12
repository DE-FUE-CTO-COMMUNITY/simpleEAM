# Anleitung: Automatische Beziehungserstellung bei Diagramm-Speicherung

## Wie es funktioniert

Die automatische Beziehungserstellung wurde erfolgreich implementiert und ist ab sofort aktiv. Beim Speichern eines Diagramms werden automatisch Beziehungen zu allen verwendeten Datenbankelementen erstellt.

## Für Entwickler

### Tests ausführen

Um die Utils-Funktionen zu testen:

1. Öffne die Browser-Konsole in der Diagramm-Editor-Seite
2. Führe aus: `testDiagramRelationshipUtils()`
3. Sieh dir die Ausgabe in der Konsole an

### Debugging

Die SaveDiagramDialog-Komponente loggt jetzt Fehler beim Speichern mit:

```javascript
console.error('Fehler beim Speichern des Diagramms:', error)
```

### Beziehungsarten

Das System erstellt automatisch Beziehungen für:

- **Capabilities** → `diagram.capabilities`
- **Applications** → `diagram.applications`
- **Data Objects** → `diagram.dataObjects`
- **Interfaces** → `diagram.interfaces`

## Für Benutzer

### Normale Nutzung

1. **Diagramm erstellen**: Öffne den Diagramm-Editor
2. **Elemente hinzufügen**: Ziehe Datenbank-Elemente aus der Library
3. **Speichern**: Klicke auf "Speichern" - Beziehungen werden automatisch erstellt
4. **Aktualisieren**: Bei Änderungen und erneutem Speichern werden Beziehungen automatisch aktualisiert

### Was passiert automatisch

- ✅ Neue Beziehungen werden erstellt für alle DB-Elemente im Diagramm
- ✅ Alte Beziehungen werden entfernt wenn Elemente aus dem Diagramm entfernt werden
- ✅ Duplikate werden verhindert
- ✅ Sowohl Haupt- als auch Unterelemente werden korrekt behandelt

### Erkennbare Elemente

Das System erkennt automatisch:

- ArchiMate-Symbole aus der Datenbank-Library
- Capabilities, Applications, Data Objects, Interfaces
- Sowohl Haupt-Shapes als auch Text-Labels

### Fehlerbehebung

Falls Beziehungen nicht korrekt erstellt werden:

1. **Überprüfe die Konsole** auf Fehlermeldungen
2. **Stelle sicher**, dass Elemente aus der Datenbank-Library stammen
3. **Überprüfe**, dass Elemente `customData.isFromDatabase = true` haben
4. **Teste mit einfachen Diagrammen** zuerst

## GraphQL-Queries erweitert

Die folgenden Queries geben jetzt auch Beziehungen zurück:

```graphql
query GetDiagram($id: ID!) {
  diagrams(where: { id: { eq: $id } }) {
    id
    title
    # ... andere Felder
    capabilities {
      id
      name
    }
    applications {
      id
      name
    }
    dataObjects {
      id
      name
    }
    interfaces {
      id
      name
    }
  }
}
```

## Vorteile der automatischen Beziehungserstellung

1. **Keine manuelle Arbeit** - Beziehungen werden automatisch verwaltet
2. **Immer aktuell** - Beziehungen bleiben synchron mit Diagramm-Inhalten
3. **Konsistent** - Keine vergessenen oder falschen Beziehungen
4. **Performant** - Effiziente Batch-Updates
5. **Robust** - Behandelt alle Edge Cases und Fehlerszenarien

Die Implementierung ist vollständig und betriebsbereit! 🎉
