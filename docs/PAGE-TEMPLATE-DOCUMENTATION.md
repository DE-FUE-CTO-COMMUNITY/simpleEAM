# Page Template Dokumentation

## Übersicht

Das page.tsx Template folgt jetzt vollständig dem **Applications Pattern** und erstellt eine vollständig funktionsfähige Entity-Seite mit minimalem Anpassungsaufwand.

## Template-Struktur

### ✅ Vollständig implementiert (keine Änderungen nötig)

- **Apollo Client Integration**: Query, Mutations mit Error Handling
- **Dialog Management**: Filter, Form, Delete Confirmation Dialogs
- **State Management**: React State für UI, Filter Hook für Datenfilterung
- **Event Handlers**: Create, Update, Delete mit Snackbar Notifications
- **Layout**: Responsive Flex-Layout nach Applications Pattern
- **Error Handling**: Comprehensive Error UI und Logging

### 🔧 Anpassungen erforderlich

#### 1. Available Values für Filter (Zeile 47-54)

```tsx
// TODO: Add specific filter values based on entity fields
// Example for common fields:
const availableValues = useMemo(() => {
  const {{ENTITY_NAME}} = data?.{{ENTITY_NAME}} || []

  return {
    // Beispiel für Company Entity:
    industry: Array.from(new Set(companies.map(c => c.industry).filter(Boolean))).sort(),
    size: Object.values(CompanySize),
    createdAt: {{ENTITY_NAME}}.map((item: any) => item.createdAt).filter(Boolean),
    updatedAt: {{ENTITY_NAME}}.map((item: any) => item.updatedAt).filter(Boolean),
  }
}, [data?.{{ENTITY_NAME}}])
```

#### 2. Import-Pfade (falls nötig)

Das Template verwendet relative Imports (`@/`). Wenn andere Pfade benötigt werden:

```tsx
// Aktuell:
import { CompanySize } from '@/gql/generated'

// Bei Bedarf anpassen an spezifische Enums/Types
```

#### 3. Entity-spezifische Filter-Props

In der FilterDialog-Komponente müssen die Props an die verfügbaren Filter angepasst werden:

```tsx
<{{ENTITY_SINGULAR_UPPER}}FilterDialog
  // Diese Props an Entity anpassen:
  availableValues={availableValues}
  // Beispiel für Company:
  // availableIndustries={availableValues.industry}
  // availableSizes={availableValues.size}
/>
```

## Vorteile des neuen Templates

### 🚀 Deutlich weniger Anpassungsaufwand

- **Vor der Verbesserung**: ~80% der page.tsx musste manuell umgeschrieben werden
- **Nach der Verbesserung**: ~5-10% müssen angepasst werden (nur availableValues und spezifische Filter-Props)

### 📏 Pattern-Konformität

- Folgt exakt dem Applications Pattern
- Konsistente Dialog-Verwaltung
- Standardisierte Event-Handler
- Einheitliche Error-Behandlung

### 🔧 Modular und erweiterbar

- Saubere Trennung von Concerns
- Alle Komponenten bereits korrekt integriert
- Snackbar-Notifications vorkonfiguriert
- Responsive Layout out-of-the-box

## Verwendung

### Für neue Entities:

1. Template generieren lassen
2. `availableValues` an Entity-Felder anpassen (3-5 Zeilen)
3. FilterDialog Props bei Bedarf anpassen (1-2 Zeilen)
4. Fertig! 🎉

### Migration bestehender Entities:

Das neue Template kann als Referenz für die Umstellung auf Pattern 2 verwendet werden.

## Beispiel-Anpassung

Für eine "Products" Entity:

```tsx
// Nur diese Zeilen anpassen:
const availableValues = useMemo(() => {
  const products = data?.products || []

  return {
    category: Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort(),
    status: Object.values(ProductStatus),
    price: products.map(p => p.price).filter(Boolean),
    createdAt: products.map(p => p.createdAt).filter(Boolean),
  }
}, [data?.products])

// Und FilterDialog Props:
<ProductFilterDialog
  availableCategories={availableValues.category}
  availableStatuses={availableValues.status}
  // ... rest bleibt gleich
/>
```

Das war's! Der Rest funktioniert automatisch.
