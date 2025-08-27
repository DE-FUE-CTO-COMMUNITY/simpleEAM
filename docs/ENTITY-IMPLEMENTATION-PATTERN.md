# Standard Pattern für neue Entity-Implementierungen

## Übersicht

Dieses Dokument beschreibt das standardisierte Pattern für die Implementierung neuer Entities im Simple-EAM System. Das Pattern basiert auf den vorhandenen Generic-Komponenten und stellt sicher, dass alle Entities konsistent implementiert werden.

## Referenz-Implementation: Applications

Die `applications`-Implementation dient als **Referenz-Pattern** für alle neuen Entities. Alle neuen Implementierungen sollen diesem Pattern folgen.

### Verzeichnisstruktur (Referenz)

```
src/
├── app/[lang]/applications/
│   └── page.tsx                    # Hauptseite
├── components/applications/
│   ├── types.ts                    # TypeScript Definitionen
│   ├── utils.ts                    # Hilfsfunktionen
│   ├── useApplicationFilter.ts     # Filter-Hook
│   ├── ApplicationForm.tsx         # Formular-Komponente
│   ├── ApplicationTable.tsx        # Tabellen-Komponente
│   ├── ApplicationToolbar.tsx      # Toolbar-Komponente
│   └── ApplicationFilterDialog.tsx # Filter-Dialog
├── graphql/
│   └── application.ts              # GraphQL Operations
└── messages/
    ├── de.json                     # Deutsche Übersetzungen
    └── en.json                     # Englische Übersetzungen
```

## Schritt-für-Schritt Anleitung

### Phase 1: Vorbereitung und Analyse

#### Schritt 1.1: GraphQL Schema analysieren

```bash
# Prüfen ob Entity bereits im Schema existiert
grep -r "type.*Entity" server/src/graphql/schema.graphql
```

#### Schritt 1.2: Bestehende Applications-Struktur kopieren

```bash
# Kopiere die gesamte Applications-Struktur
cp -r src/components/applications src/components/[new-entity]
cp -r src/app/[lang]/applications src/app/[lang]/[new-entity]
cp src/graphql/application.ts src/graphql/[new-entity].ts
```

### Phase 2: Systematische Anpassung

#### Schritt 2.1: GraphQL Operations (src/graphql/[entity].ts)

```typescript
// Template basierend auf application.ts
import { gql } from '@apollo/client'

export const GET_ENTITIES = gql`
  query GetEntities {
    entities {
      id
      name
      # Weitere Entity-spezifische Felder
    }
  }
`

export const CREATE_ENTITY = gql`
  mutation CreateEntity($input: EntityInput!) {
    createEntity(input: $input) {
      id
      name
    }
  }
`

export const UPDATE_ENTITY = gql`
  mutation UpdateEntity($id: ID!, $input: EntityInput!) {
    updateEntity(id: $id, input: $input) {
      id
      name
    }
  }
`

export const DELETE_ENTITY = gql`
  mutation DeleteEntity($id: ID!) {
    deleteEntity(id: $id) {
      id
    }
  }
`
```

#### Schritt 2.2: TypeScript Definitionen (src/components/[entity]/types.ts)

```typescript
// Template basierend auf applications/types.ts
import { Entity } from '../../gql/generated'

export type EntityType = Entity

export interface FilterState {
  // Entity-spezifische Filter
  fieldFilter: string[]
  descriptionFilter: string
  updatedDateRange: [string, string]
}

export interface EntityFormValues {
  name: string
  description: string
  // Weitere Entity-spezifische Felder
}
```

#### Schritt 2.3: Hilfsfunktionen (src/components/[entity]/utils.ts)

```typescript
// Template basierend auf applications/utils.ts
import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { FilterState } from './types'

export const formatDate = (dateString: string, locale: string = 'de'): string => {
  // Standardimplementierung übernehmen
}

export const getEntityLabel = (value: any): string => {
  // Entity-spezifische Label-Funktionen
}

export const getActiveFilterCount = (filterState: FilterState): number => {
  // Filter-Zählung implementieren
}
```

#### Schritt 2.4: Filter-Hook (src/components/[entity]/use[Entity]Filter.ts)

```typescript
// Template basierend auf applications/useApplicationFilter.ts
import { useMemo } from 'react'
import { EntityType, FilterState } from './types'

interface UseEntityFilterProps {
  entities: EntityType[]
  filterState: FilterState
}

export const useEntityFilter = ({ entities, filterState }: UseEntityFilterProps) => {
  // Filter-Logik implementieren
  return useMemo(() => {
    // Filtering implementierung
  }, [entities, filterState])
}
```

### Phase 3: Komponenten-Implementierung

#### Schritt 3.1: Tabellen-Komponente (src/components/[entity]/[Entity]Table.tsx)

**Wichtig: GenericTable verwenden!**

```typescript
// Template basierend auf applications/ApplicationTable.tsx
import { GenericTable } from '../common/GenericTable'
import { EntityType } from './types'

export const ENTITY_DEFAULT_COLUMN_VISIBILITY = {
  // Entity-spezifische Standard-Spalten
} as const

const EntityTable: React.FC<EntityTableProps> = ({
  // Props von GenericTable übernehmen
}) => {
  const columns = useMemo(() => [
    // Entity-spezifische Spalten definieren
  ], [])

  return (
    <GenericTable<EntityType>
      // Alle Props an GenericTable weiterleiten
      entityName="entity"
    />
  )
}
```

#### Schritt 3.2: Toolbar-Komponente (src/components/[entity]/[Entity]Toolbar.tsx)

**Wichtig: GenericToolbar verwenden!**

```typescript
// Template basierend auf applications/ApplicationToolbar.tsx
import GenericToolbar from '../common/GenericToolbar'

const EntityToolbar: React.FC<EntityToolbarProps> = ({
  // Props definieren
}) => {
  const t = useTranslations('entities')

  return (
    <GenericToolbar
      // Alle Props an GenericToolbar weiterleiten
      searchPlaceholder={t('searchPlaceholder')}
      tableKey="entities"
    />
  )
}
```

#### Schritt 3.3: Filter-Dialog (src/components/[entity]/[Entity]FilterDialog.tsx)

**Wichtig: GenericFilterDialog verwenden!**

```typescript
// Template basierend auf applications/ApplicationFilterDialog.tsx
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'

const EntityFilterDialog: React.FC<EntityFilterDialogProps> = ({
  // Props definieren
}) => {
  const filterFields: FilterField[] = [
    // Entity-spezifische Filter-Felder definieren
  ]

  return (
    <GenericFilterDialog
      // Alle Props an GenericFilterDialog weiterleiten
      filterFields={filterFields}
    />
  )
}
```

#### Schritt 3.4: Formular-Komponente (src/components/[entity]/[Entity]Form.tsx)

**Wichtig: Tanstack Form Pattern verwenden!**

```typescript
// Template basierend auf applications/ApplicationForm.tsx
import { useForm } from '@tanstack/react-form'

const EntityForm: React.FC<EntityFormProps> = ({
  // Props definieren
}) => {
  const form = useForm({
    // Form-Konfiguration nach Tanstack Pattern
  })

  return (
    // Form-Implementation nach Tanstack Pattern
  )
}
```

### Phase 4: Hauptseite (src/app/[lang]/[entity]/page.tsx)

**Wichtig: Exakte Struktur von applications/page.tsx übernehmen!**

```typescript
// Template basierend auf applications/page.tsx
const EntitiesPage = () => {
  // Exakt dieselbe Struktur wie ApplicationsPage
  // Nur Entity-spezifische Anpassungen
}
```

### Phase 5: Übersetzungen

#### Schritt 5.1: Deutsche Übersetzungen (messages/de.json)

```json
{
  "entities": {
    "title": "Entities",
    "description": "Entity-Beschreibung",
    "messages": {
      "loadError": "Fehler beim Laden der Entities",
      "createSuccess": "Entity erfolgreich erstellt"
      // Vollständige Übersetzungsstruktur wie bei applications
    },
    "form": {
      // Formular-Übersetzungen
    },
    "table": {
      "headers": {
        // Tabellen-Header
      }
    }
  }
}
```

## Checkliste für neue Entity-Implementierung

### ✅ Vorbereitung

- [ ] GraphQL Schema analysiert
- [ ] Applications-Struktur als Vorlage kopiert
- [ ] Entity-spezifische Felder identifiziert

### ✅ Backend/GraphQL

- [ ] GraphQL Operations implementiert (GET, CREATE, UPDATE, DELETE)
- [ ] TypeScript Typen aus generated.ts verwendet

### ✅ Frontend-Struktur

- [ ] types.ts mit korrekten TypeScript Definitionen
- [ ] utils.ts mit Entity-spezifischen Hilfsfunktionen
- [ ] use[Entity]Filter.ts Hook implementiert

### ✅ Komponenten (Generic-Pattern)

- [ ] [Entity]Table.tsx mit GenericTable
- [ ] [Entity]Toolbar.tsx mit GenericToolbar
- [ ] [Entity]FilterDialog.tsx mit GenericFilterDialog
- [ ] [Entity]Form.tsx mit Tanstack Form Pattern

### ✅ Integration

- [ ] page.tsx nach ApplicationsPage Pattern
- [ ] Übersetzungen vollständig (de.json, en.json)
- [ ] Menu-Integration (falls gewünscht)

### ✅ Testing

- [ ] Page lädt ohne Fehler
- [ ] CRUD-Operationen funktional
- [ ] Filter und Suche funktional
- [ ] Responsive Design geprüft

## Qualitätssicherung

### Code-Review Punkte

1. **Generic-Komponenten**: Werden alle Generic-Komponenten korrekt verwendet?
2. **Pattern-Konsistenz**: Folgt die Implementierung exakt dem Applications-Pattern?
3. **TypeScript**: Sind alle Typen korrekt und aus generated.ts?
4. **Übersetzungen**: Sind alle Strings internationalisiert?
5. **Performance**: Werden useMemo/useCallback korrekt verwendet?

### Automatisierte Prüfungen

```bash
# TypeScript Kompilierung
yarn type-check

# Linting
yarn lint

# Build-Test
yarn build
```

## Tools und Hilfsmittel

### Automatisierung

```bash
# Script für neue Entity-Erstellung
./scripts/create-entity.sh [entity-name]
```

### VS Code Snippets

- Snippet für Entity-Tabelle
- Snippet für Entity-Form
- Snippet für Entity-Page

## Fazit

Durch die konsequente Verwendung dieses Patterns wird sichergestellt, dass:

1. **Konsistenz**: Alle Entities folgen demselben Aufbau
2. **Wartbarkeit**: Änderungen an Generic-Komponenten wirken sich auf alle Entities aus
3. **Entwicklungsgeschwindigkeit**: Neue Entities können schnell implementiert werden
4. **Qualität**: Bewährte Patterns werden wiederverwendet
5. **Dokumentation**: Jede neue Entity ist selbsterklärend durch das bekannte Pattern
