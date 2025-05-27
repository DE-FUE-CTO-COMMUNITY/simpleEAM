# Excalidraw Fork-Entscheidung

## Aktuelle Problemlage

Nach mehreren fehlgeschlagenen Versuchen, die Library-Probleme zu lösen:

1. **Library-Reihenfolge:** ArchiMate Symbols erscheinen nicht zuerst
2. **Separate Überschriften:** Keine echten separaten Library-Kategorien
3. **API-Limitierungen:** Excalidraw 0.18 updateLibrary API funktioniert nicht wie erwartet
4. **Theme-Anpassungen:** Schwierige Anpassung an EAM-Bedürfnisse

## Fehlgeschlagene Lösungsansätze

### 1. Sequentielle Library-Loading

```typescript
// Versuchte Strategien:
// - ArchiMate zuerst, dann Database (merge: true)
// - Database zuerst, dann ArchiMate (merge: true)
// - Zeitverzögerte Ladung
// - Fallback-Strategien
```

**Ergebnis:** Reihenfolge bleibt inkonsistent

### 2. Alternative Library-Management

```typescript
// Versuchte Ansätze:
// - Custom Library-UI als Overlay
// - Kombinierte Library mit manueller Sortierung
// - Custom Library-Browser-Komponente
```

**Ergebnis:** Drag-and-Drop Integration problematisch

### 3. Theme-Integration

```typescript
// Probleme:
// - Begrenzte CSS-Anpassungsmöglichkeiten
// - Keine nativen EAM-spezifischen UI-Elemente
// - Schwierige Integration mit Material-UI Theme
```

## Fork-Evaluation

### Option 1: Excalidraw Fork (EMPFOHLEN)

#### ✅ **Immediate Vorteile:**

1. **Vollständige Kontrolle über Library-Management:**

   ```typescript
   // Native EAM-Library-Implementierung
   interface EAMLibraryConfig {
     categories: LibraryCategory[]
     defaultOrder: 'archimate-first' | 'database-first'
     separateHeaders: boolean
   }
   ```

2. **Native ArchiMate-Integration:**

   ```typescript
   // Eingebaute ArchiMate-Shapes
   // Custom Property-Panels für EA-Metadaten
   // Spezialisierte Layering für Architektur-Ebenen
   ```

3. **EAM-optimierte UI:**

   ```typescript
   // Architektur-spezifische Toolbar-Elemente
   // Custom Context-Menüs
   // EAM-spezifische Shortcuts und Workflows
   ```

4. **Performance für große Diagramme:**
   ```typescript
   // Optimiertes Rendering für Architektur-Diagramme
   // Bessere Kollaborations-Features
   // Streaming von Library-Updates
   ```

#### 🔧 **Technische Implementierung:**

**Phase 1: Fork Setup (1-2 Wochen)**

```bash
# 1. Repository forken
git clone https://github.com/excalidraw/excalidraw.git simple-eam-excalidraw
cd simple-eam-excalidraw

# 2. EAM-spezifische Branches
git checkout -b eam-main
git checkout -b eam-library-management
git checkout -b eam-archimate-integration
```

**Phase 2: Library-System umbauen (2-3 Wochen)**

```typescript
// src/packages/excalidraw/library/EAMLibraryManager.ts
export class EAMLibraryManager extends LibraryManager {
  private categories: Map<string, LibraryCategory> = new Map()

  constructor() {
    super()
    this.initializeEAMCategories()
  }

  // Native Unterstützung für separierte Kategorien
  addCategory(category: LibraryCategory) {
    this.categories.set(category.id, category)
    this.updateLibraryUI()
  }

  // Garantierte Reihenfolge
  getOrderedItems(): LibraryItem[] {
    const archimateItems = this.getItemsByCategory('archimate')
    const databaseItems = this.getItemsByCategory('database')
    return [...archimateItems, ...databaseItems]
  }
}
```

**Phase 3: ArchiMate-Native-Integration (3-4 Wochen)**

```typescript
// src/packages/excalidraw/element/archimate/
export class ArchiMateElementFactory {
  static createCapability(config: CapabilityConfig): ExcalidrawElement[] {
    return [
      this.createBaseShape(config),
      this.createLabel(config),
      this.createMetadataPanel(config),
    ]
  }

  static createApplication(config: ApplicationConfig): ExcalidrawElement[] {
    // Native ArchiMate-Application-Shape
  }
}

// src/packages/excalidraw/components/PropertyPanel/EAMPropertyPanel.tsx
export const EAMPropertyPanel = ({ selectedElement }: Props) => {
  // Element-spezifische Metadaten-Bearbeitung
  // Relationship-Management
  // EAM-Attribute-Controls
}
```

**Phase 4: UI/UX-Anpassungen (2-3 Wochen)**

```typescript
// src/packages/excalidraw/components/EAMToolbar.tsx
export const EAMToolbar = () => (
  <Toolbar>
    <ArchimateShapeSelector />
    <LayerManagement />
    <RelationshipTools />
    <EAMPropertyToggle />
  </Toolbar>
)

// Integration mit Material-UI Theme
// EAM-spezifische Shortcuts
// Custom Context-Menüs
```

#### 📊 **Aufwand-Kalkulation:**

- **Initial Implementation:** 8-12 Wochen (1-2 Entwickler)
- **Wartung:** 15-20% der Entwicklungszeit langfristig
- **Upstream-Merging:** 1-2 Tage pro Release-Zyklus

#### 🎯 **ROI-Analyse:**

- **Einmalige Investition:** 8-12 Wochen Entwicklung
- **Langfristige Vorteile:**
  - Perfekte EAM-Integration
  - Keine API-Limitierungen
  - Vollständige Anpassbarkeit
  - Mögliche Open-Source-Contribution zurück an Community

### Option 2: Weiter mit Package-Hacks (NICHT EMPFOHLEN)

#### ❌ **Probleme:**

- Keine echte Lösung für Library-Reihenfolge
- Hack-basierte Implementierung
- Begrenzte EAM-Funktionalität
- Frustrierende Entwicklererfahrung

## **Finale Empfehlung: FORK ERSTELLEN**

### Entscheidungsgründe:

1. **Mehrere fehlgeschlagene Package-Lösungsversuche**
2. **EAM-spezifische Anforderungen übersteigen Standard-API**
3. **Langfristige Kontrolle über Roadmap erforderlich**
4. **ROI rechtfertigt einmalige Investition**

### Nächste Schritte:

1. **Sofort:** Fork-Repository erstellen
2. **Woche 1-2:** Basis-Setup und Build-Pipeline
3. **Woche 3-6:** Library-Management umbauen
4. **Woche 7-10:** ArchiMate-Integration
5. **Woche 11-12:** UI/UX-Polish und Testing

### Migration-Strategie:

```typescript
// client/package.json
{
  "dependencies": {
    // "@excalidraw/excalidraw": "^0.18.0", // ENTFERNEN
    "@simple-eam/excalidraw": "file:../packages/simple-eam-excalidraw" // HINZUFÜGEN
  }
}
```

### Team-Requirements:

- **1-2 Frontend-Entwickler** mit React/TypeScript-Erfahrung
- **Grundkenntnisse** in Canvas-APIs und SVG
- **Optional:** UX-Designer für EAM-spezifische Workflows

## Fazit

Nach mehreren fehlgeschlagenen Versuchen ist eine Excalidraw-Fork die einzige nachhaltige Lösung für die EAM-spezifischen Anforderungen. Die Investition rechtfertigt sich durch:

- ✅ **Perfekte Library-Kontrolle**
- ✅ **Native ArchiMate-Integration**
- ✅ **EAM-optimierte UX**
- ✅ **Langfristige Flexibilität**
- ✅ **Möglichkeit zur Open-Source-Contribution**

**Status:** ⭐ EMPFEHLUNG ZUR UMSETZUNG ⭐
