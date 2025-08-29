# Standard Pattern für neue Entity-Implementierungen

## Übersicht

Dieses Dokument beschreibt das standardisierte Pattern für die Implementierung neuer Entities im Simple-EAM System. Das Pattern basiert auf den vorhandenen Generic-Komponenten und stellt sicher, dass alle Entities konsistent implementiert werden.

## Automatisierte Entity-Erstellung

**WICHTIG:** Verwende das automatisierte Script:

```bash
./scripts/create-entity.sh [entity-name]
```

Das Script erstellt automatisch alle benötigten Dateien nach dem standardisierten Pattern.

### Unterstützte Entity-Namen

- companies, organisations, projects, contracts, suppliers, customers
- departments, teams, locations, assets, services, processes
- Für andere Namen wird automatisch abgeleitet

## Template-System

Das System verwendet Template-basierte Generierung mit folgenden Platzhaltern:

- `{{ENTITY_NAME}}` = Plural lowercase (companies, capabilities)
- `{{ENTITY_SINGULAR}}` = Singular lowercase (company, capability)
- `{{ENTITY_NAME_UPPER}}` = Plural capitalized (Companies, Capabilities)
- `{{ENTITY_SINGULAR_UPPER}}` = Singular capitalized (Company, Capability)

### Dateinamen-Konvention

**WICHTIG:** Alle Komponenten-Dateien verwenden SINGULAR-Namen:

- `CompanyForm.tsx` (nicht `CompaniesForm.tsx`)
- `CompanyTable.tsx` (nicht `CompaniesTable.tsx`)
- `CompanyToolbar.tsx` (nicht `CompaniesToolbar.tsx`)

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
│   ├── useApplicationFilter.ts     # Filter-Hook (Singular!)
│   ├── ApplicationForm.tsx         # Formular-Komponente (Singular!)
│   ├── ApplicationTable.tsx        # Tabellen-Komponente (Singular!)
│   ├── ApplicationToolbar.tsx      # Toolbar-Komponente (Singular!)
│   └── ApplicationFilterDialog.tsx # Filter-Dialog (Singular!)
├── graphql/
│   └── application.ts              # GraphQL Operations
└── messages/
    ├── de.json                     # Deutsche Übersetzungen
    └── en.json                     # Englische Übersetzungen
```

## Schritt-für-Schritt Anleitung

### Phase 1: Automatisierte Generierung

#### Schritt 1.1: Script ausführen

```bash
./scripts/create-entity.sh [entity-name]
```

#### Schritt 1.2: Internationalisierung prüfen

**WICHTIG:** Das Script fügt automatisch Übersetzungen hinzu:

- **Deutsche Übersetzungen** in `client/messages/de.json`
- **Englische Übersetzungen** in `client/messages/en.json`

Prüfe die generierten Übersetzungen und passe sie bei Bedarf an.

### Phase 2: Manuelle Anpassungen

#### Schritt 2.1: GraphQL Schema prüfen

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

## CRUD-Implementierung: Bewährte Patterns

### GraphQL-Mutations: Korrekte Neo4j Syntax

**WICHTIG:** Basierend auf Applications und Companies Erfolg - verwende IMMER diese Patterns:

#### Create Mutation (Funktioniert bewiesenermaßen)

```typescript
// ✅ RICHTIG - Bewährt bei Applications & Companies
export const CREATE_ENTITIES = gql`
  mutation CreateEntities($input: [EntityCreateInput!]!) {
    createEntities(input: $input) {
      entities {
        id
        name
        description
        # ... weitere Felder
        createdAt
        updatedAt
      }
    }
  }
`

// Verwendung im Code:
await createEntityMutation({
  variables: { input: [values] }, // WICHTIG: Array für createEntities
  refetchQueries: [{ query: GET_ENTITIES }],
})
```

#### Update Mutation (Applications Pattern - bewährt)

```typescript
// ✅ RICHTIG - Applications Pattern (funktioniert)
export const UPDATE_ENTITY = gql`
  mutation UpdateEntity($id: ID!, $input: EntityUpdateInput!) {
    updateEntities(where: { id: { eq: $id } }, update: $input) {
      entities {
        id
        name
        description
        # ... weitere Felder
        createdAt
        updatedAt
      }
    }
  }
`

// Verwendung im Code:
await updateEntityMutation({
  variables: {
    id: entity.id, // WICHTIG: separate id Parameter
    input: {
      // WICHTIG: { field: { set: value } } Struktur für Neo4j
      name: { set: values.name },
      description: { set: values.description },
      // ... weitere Felder mit { set: value }
    },
  },
  refetchQueries: [{ query: GET_ENTITIES }],
})
```

### Page-Implementation: Create und Update Patterns

#### Create-Handling (Header Button + Separates Dialog)

```typescript
const EntitiesPage = () => {
  // Dialog-States
  const [showNewEntityForm, setShowNewEntityForm] = useState(false)

  // Create-Handler für Header Button
  const handleCreateEntity = () => {
    if (loading || !data?.entities) {
      enqueueSnackbar('Bitte warten Sie, bis die Daten geladen sind.', { variant: 'info' })
      return
    }
    setShowNewEntityForm(true)
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      {/* Header mit Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {t('title')}
        </Typography>
        {isArchitect() && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateEntity}
          >
            {t('addNew')}
          </Button>
        )}
      </Box>

      {/* EntityTable OHNE onCreate Prop */}
      <EntityTable
        entities={filteredEntities}
        loading={loading}
        globalFilter={globalFilter}
        sorting={sorting}
        onSortingChange={setSorting}
        onUpdateEntity={async (entityId, data) => {
          await handleUpdateEntity({ id: entityId } as EntityType, data)
        }}
        onDeleteEntity={async id => {
          const entity = filteredEntities.find((e: any) => e.id === id)
          if (entity) {
            setCurrentEntity(entity)
            setShowDeleteConfirm(true)
          }
        }}
      />

      {/* Separates Create Form Dialog */}
      {showNewEntityForm && (
        <EntityForm
          isOpen={showNewEntityForm}
          onClose={() => setShowNewEntityForm(false)}
          mode="create"
          onSubmit={async (values: EntityFormValues) => {
            try {
              await createEntityMutation({
                variables: { input: [values] }, // WICHTIG: Array
                refetchQueries: [{ query: GET_ENTITIES }],
              })
              enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
              setShowNewEntityForm(false)
            } catch (error) {
              console.error('Fehler beim Erstellen der Entity:', error)
              enqueueSnackbar(t('messages.createError'), { variant: 'error' })
            }
          }}
        />
      )}
    </Box>
  )
}
```

#### Update-Handling (über GenericTable)

```typescript
const handleUpdateEntity = async (entity: EntityType, values: EntityFormValues) => {
  console.log('🔄 handleUpdateEntity called with:', { entity: entity.id, values })
  try {
    const result = await updateEntityMutation({
      variables: {
        id: entity.id, // WICHTIG: separate id Parameter wie Applications
        input: {
          // WICHTIG: { field: { set: value } } für Neo4j GraphQL
          name: { set: values.name },
          description: { set: values.description },
          // ... weitere Felder mit { set: value }
        },
      },
      refetchQueries: [{ query: GET_ENTITIES }],
    })
    console.log('✅ Update successful:', result)
    enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren der Entity:', error)
    enqueueSnackbar(t('messages.updateError'), { variant: 'error' })
  }
}
```

#### Delete-Handling (über GenericTable)

```typescript
// Delete-Handler in Page Component
const handleDeleteEntity = async (id: string) => {
  try {
    await deleteEntityMutation({
      variables: { id }, // WICHTIG: Applications Pattern mit id Parameter
      refetchQueries: [{ query: GET_ENTITIES }],
    })
    enqueueSnackbar(t('messages.deleteSuccess'), { variant: 'success' })
  } catch (error) {
    console.error('❌ Fehler beim Löschen der Entity:', error)
    enqueueSnackbar(t('messages.deleteError'), { variant: 'error' })
  }
}

// JSX: EntityTable mit Delete-Handler
<EntityTable
  entities={filteredEntities}
  loading={loading}
  globalFilter={globalFilter}
  sorting={sorting}
  onSortingChange={setSorting}
  onUpdateEntity={async (entityId, data) => {
    await handleUpdateEntity({ id: entityId } as EntityType, data)
  }}
  onDeleteEntity={handleDeleteEntity} // WICHTIG: Direkte Weiterleitung
/>
```

### Häufige Fehler und Lösungen

#### ❌ Problem: "Variable '$where' got invalid value"

```typescript
// ❌ FALSCH - führt zu IDScalarFilters Fehlern
mutation UpdateEntities($where: EntityWhere!, $update: EntityUpdateInput!) {
  updateEntities(where: $where, update: $update)
}

// ❌ FALSCH - Delete mit where-Objekt
mutation DeleteEntities($where: EntityWhere!) {
  deleteEntities(where: $where) {
    nodesDeleted
  }
}

// ✅ RICHTIG - Applications Pattern verwenden
mutation UpdateEntity($id: ID!, $input: EntityUpdateInput!) {
  updateEntities(where: { id: { eq: $id } }, update: $input)
}

// ✅ RICHTIG - Delete mit direkter ID
mutation DeleteEntity($id: ID!) {
  deleteEntities(where: { id: { eq: $id } }) {
    nodesDeleted
  }
}
```

#### ❌ Problem: "Expected type 'StringScalarMutations' to be an object"

```typescript
// ❌ FALSCH - direkte Werte
input: {
  name: values.name,
  description: values.description
}

// ✅ RICHTIG - { set: value } Struktur für Neo4j GraphQL
input: {
  name: { set: values.name },
  description: { set: values.description }
}
```

#### ❌ Problem: "Create Button funktioniert nicht"

```typescript
// ❌ FALSCH - Create über GenericTable (macht Probleme)
<GenericTable
  onCreate={...}  // Führt zu onSubmit-Problemen
/>

// ✅ RICHTIG - Separates Create Dialog wie Applications
{/* Header Button */}
<Button onClick={handleCreateEntity}>Create</Button>

{/* Separates Dialog */}
{showNewEntityForm && (
  <EntityForm
    mode="create"
    onSubmit={async (values) => {
      await createEntityMutation({ variables: { input: [values] } })
    }}
  />
)}
```

#### ❌ Problem: "Delete-Dialoge doppelt oder nicht internationalisiert"

```typescript
// ❌ FALSCH - Manueller Delete-Dialog in Page + GenericForm Delete
{showDeleteConfirm && (
  <Paper>
    <Typography>Löschen bestätigen</Typography> {/* Nicht internationalisiert */}
    <Button onClick={handleDelete}>Löschen</Button>
  </Paper>
)}

// ✅ RICHTIG - Nur GenericTable Delete verwenden
<EntityTable
  onDeleteEntity={handleDeleteEntity} // Einfache Weiterleitung
  // Kein manueller Delete-Dialog nötig!
/>

// ✅ Delete-Handler in Page
const handleDeleteEntity = async (id: string) => {
  await deleteEntityMutation({
    variables: { id }, // Applications Pattern
    refetchQueries: [{ query: GET_ENTITIES }],
  })
}
```

### Checkliste für CRUD-Implementation

#### GraphQL Mutations

- [ ] CREATE_ENTITIES mit PLURAL name (`createEntities`)
- [ ] UPDATE_ENTITY mit Applications Pattern (`$id: ID!`, `{ id: { eq: $id } }`)
- [ ] DELETE_ENTITY mit Applications Pattern (`$id: ID!`, `{ id: { eq: $id } }`)
- [ ] Array-Input für Create: `{ input: [values] }`
- [ ] `{ set: value }` Struktur für Update-Input

#### Page Component

- [ ] Header mit Create Button (nur für Architects)
- [ ] `handleCreateEntity` für Dialog-Öffnung
- [ ] `handleUpdateEntity` mit `{ field: { set: value } }` Struktur
- [ ] `handleDeleteEntity` mit direkter ID-Weiterleitung
- [ ] Separates Create Form Dialog
- [ ] EntityTable OHNE `onCreate` Prop
- [ ] EntityTable MIT `onDeleteEntity` Prop

#### Funktions-Tests

- [ ] Create: Header Button → Dialog → Submit funktioniert
- [ ] Update: Table Edit → Dialog → Submit funktioniert
- [ ] Delete: Table Delete → GenericForm Confirmation → Submit funktioniert
- [ ] Console-Logs zeigen korrekte GraphQL Variablen
- [ ] Keine "StringScalarMutations" Fehler
- [ ] Keine "IDScalarFilters" Fehler
- [ ] Nur ein Delete-Dialog (GenericForm), nicht zwei

### Referenz-Implementierungen

- **Applications:** Vollständig funktionierendes Create/Update Pattern
- **Companies:** Nach Applications-Pattern korrigiert, funktioniert jetzt
- **Beide verwenden:** Separates Create Dialog + Applications GraphQL Syntax

## Fazit

**Für zukünftige Entity-Implementierungen:**

1. **IMMER Applications Pattern verwenden** - es ist bewiesenermaßen funktional
2. **Separates Create Dialog** - nicht über GenericTable onCreate
3. **Neo4j GraphQL Syntax beachten** - `{ set: value }` für Updates
4. **Applications GraphQL Mutations kopieren** - Parameter-Struktur übernehmen
5. **Diese Dokumentation befolgen** - verhindert wiederkehrende onSubmit-Probleme

Durch die konsequente Verwendung dieses Patterns wird sichergestellt, dass:

1. **Konsistenz**: Alle Entities folgen demselben funktionalen Aufbau
2. **Wartbarkeit**: Änderungen an Generic-Komponenten wirken sich auf alle Entities aus
3. **Entwicklungsgeschwindigkeit**: Neue Entities können schnell und fehlerfrei implementiert werden
4. **Qualität**: Bewährte, getestete Patterns werden wiederverwendet
5. **Dokumentation**: Jede neue Entity ist selbsterklärend durch das bekannte Pattern
6. **Weniger Debugging**: CRUD-Probleme gehören der Vergangenheit an
