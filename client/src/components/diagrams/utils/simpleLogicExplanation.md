# Einfache Application Display Logik - Erklärung

## Das Problem verstehen

Bei **maxLevels = 3** haben wir die Level:
- Level 0: Top-Level Capabilities (currentLevel = 0)
- Level 1: Erste Ebene (currentLevel = 1) 
- Level 2: Zweite Ebene (currentLevel = 2) ← **Letztes sichtbares Level**

## Die neue einfache Logik

```typescript
export function collectApplicationsForDisplay(
  capability: BusinessCapability,
  allCapabilities: BusinessCapability[],
  currentLevel: number,
  maxLevels: number
): any[] {
  const applications: any[] = []

  // SCHRITT 1: IMMER eigene Applications hinzufügen
  if (capability.supportedByApplications && capability.supportedByApplications.length > 0) {
    applications.push(...capability.supportedByApplications)
  }

  // SCHRITT 2: Nur bei letztem sichtbaren Level - Rollup von versteckten Kindern
  if (currentLevel === maxLevels - 1) {
    // Wir sind am letzten sichtbaren Level
    // Alle Kinder dieser Capability werden versteckt, also deren Apps hochrollen
    const hiddenChildren = findChildCapabilities(capability.id, allCapabilities)
    
    hiddenChildren.forEach(hiddenChild => {
      // Apps vom versteckten Kind hinzufügen
      if (hiddenChild.supportedByApplications && hiddenChild.supportedByApplications.length > 0) {
        applications.push(...hiddenChild.supportedByApplications)
      }
      
      // Auch Apps von allen Nachkommen des versteckten Kinds hinzufügen
      const hiddenDescendants = findAllDescendantsUnlimited(hiddenChild.id, allCapabilities)
      hiddenDescendants.forEach(descendant => {
        if (descendant.supportedByApplications && descendant.supportedByApplications.length > 0) {
          applications.push(...descendant.supportedByApplications)
        }
      })
    })
  }

  // SCHRITT 3: Duplikate entfernen und auf 3 begrenzen
  const uniqueApplications = applications.filter((app, index, self) => 
    index === self.findIndex(a => a.id === app.id)
  )
  
  return uniqueApplications.slice(0, 3)
}
```

## Beispiel: maxLevels = 3

```
Root (Level 0) [App-Root]
├─ Child-A (Level 1) [App-A]
│  ├─ GrandChild-A1 (Level 2) [App-A1] ← Letztes sichtbares Level
│  │  └─ GreatGrand-A1a (Level 3) [App-A1a] ← VERSTECKT
│  └─ GrandChild-A2 (Level 2) [App-A2] ← Letztes sichtbares Level
│     └─ GreatGrand-A2a (Level 3) [App-A2a] ← VERSTECKT
└─ Child-B (Level 1) [App-B]
   └─ GrandChild-B1 (Level 2) [App-B1] ← Letztes sichtbares Level
      └─ GreatGrand-B1a (Level 3) [App-B1a] ← VERSTECKT
```

**Erwartetes Verhalten:**

- **Root (Level 0)**: Zeigt App-Root (eigene App)
- **Child-A (Level 1)**: Zeigt App-A (eigene App)
- **Child-B (Level 1)**: Zeigt App-B (eigene App)
- **GrandChild-A1 (Level 2)**: Zeigt App-A1 + App-A1a (eigene + von verstecktem Kind gerollt)
- **GrandChild-A2 (Level 2)**: Zeigt App-A2 + App-A2a (eigene + von verstecktem Kind gerollt)
- **GrandChild-B1 (Level 2)**: Zeigt App-B1 + App-B1a (eigene + von verstecktem Kind gerollt)

## Warum diese Logik korrekt ist

1. **currentLevel === maxLevels - 1** bedeutet "letztes sichtbares Level"
   - Bei maxLevels = 3: Level 2 ist das letzte sichtbare (2 === 3-1)
   - Bei maxLevels = 2: Level 1 ist das letzte sichtbare (1 === 2-1)
   - Bei maxLevels = 1: Level 0 ist das letzte sichtbare (0 === 1-1)

2. **Nur am letzten Level werden Apps gerollt**
   - Level 0 und 1 zeigen nur ihre eigenen Apps
   - Level 2 zeigt eigene Apps + Apps von versteckten Level 3+ Kindern

3. **Einfach und vorhersagbar**
   - Jedes sichtbare Level zeigt seine eigenen Apps
   - Nur das letzte sichtbare Level rollt zusätzlich hoch
   - Keine Duplikate durch die Unique-Filter-Logik

## Test-Szenarien

### Test 1: maxLevels = 1
- Nur Level 0 sichtbar
- Level 0 zeigt: eigene Apps + alle Apps von versteckten Kindern/Enkeln/etc.

### Test 2: maxLevels = 2  
- Level 0 und 1 sichtbar
- Level 0: nur eigene Apps
- Level 1: eigene Apps + Apps von versteckten Level 2+ Kindern

### Test 3: maxLevels = 3
- Level 0, 1 und 2 sichtbar
- Level 0: nur eigene Apps
- Level 1: nur eigene Apps  
- Level 2: eigene Apps + Apps von versteckten Level 3+ Kindern
