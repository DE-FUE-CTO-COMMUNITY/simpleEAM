# Standard Pattern for New Entity Implementations

## Overview

This document describes the standardized pattern for implementing new entities in the Simple-EAM system. The pattern builds on the existing generic components to ensure consistent implementations.

## Automated Entity Creation

**IMPORTANT:** Use the automation script:

```bash
./scripts/create-entity.sh [entity-name]
```

The script generates all required files following the standard pattern.

### Supported entity names

- companies, organisations, projects, contracts, suppliers, customers
- departments, teams, locations, assets, services, processes
- Other names are derived automatically

## Template System

The generator uses templates with these placeholders:

- `{{ENTITY_NAME}}` = plural lowercase (companies, capabilities)
- `{{ENTITY_SINGULAR}}` = singular lowercase (company, capability)
- `{{ENTITY_NAME_UPPER}}` = plural capitalized (Companies, Capabilities)
- `{{ENTITY_SINGULAR_UPPER}}` = singular capitalized (Company, Capability)

### File name convention

**IMPORTANT:** All component files use singular names:

- CompanyForm.tsx (not CompaniesForm.tsx)
- CompanyTable.tsx (not CompaniesTable.tsx)
- CompanyToolbar.tsx (not CompaniesToolbar.tsx)

## Reference implementation: applications

The applications feature is the **reference pattern**. Every new entity should follow it.

### Reference directory layout

```
src/
├── app/[lang]/applications/
│   └── page.tsx                    # Main page
├── components/applications/
│   ├── types.ts                    # TypeScript definitions
│   ├── utils.ts                    # Helper functions
│   ├── useApplicationFilter.ts     # Filter hook (singular!)
│   ├── ApplicationForm.tsx         # Form component (singular!)
│   ├── ApplicationTable.tsx        # Table component (singular!)
│   ├── ApplicationToolbar.tsx      # Toolbar component (singular!)
│   └── ApplicationFilterDialog.tsx # Filter dialog (singular!)
├── graphql/
│   └── application.ts              # GraphQL operations
└── messages/
    ├── de.json                     # German translations
    └── en.json                     # English translations
```

## Step-by-step guide

### Phase 1: Automated generation

#### Step 1.1: Run the script

```bash
./scripts/create-entity.sh [entity-name]
```

#### Step 1.2: Verify internationalization

**IMPORTANT:** The script adds translations automatically:

- German strings in client/messages/de.json
- English strings in client/messages/en.json

Review and adjust the generated translations as needed.

### Phase 2: Manual adjustments

#### Step 2.1: Check the GraphQL schema

Ensure the server schema is updated for the new entity.

#### Step 2.2: GraphQL operations (src/graphql/[entity].ts)

```typescript
// Template based on application.ts
import { gql } from '@apollo/client'

export const GET_ENTITIES = gql`
  query GetEntities {
    entities {
      id
      name
      # Additional entity-specific fields
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

#### Step 2.3: TypeScript definitions (src/components/[entity]/types.ts)

```typescript
// Template based on applications/types.ts
import { Entity } from '../../gql/generated'

export type EntityType = Entity

export interface FilterState {
  // Entity-specific filters
  fieldFilter: string[]
  descriptionFilter: string
  updatedDateRange: [string, string]
}

export interface EntityFormValues {
  name: string
  description: string
  // Additional entity-specific fields
}
```

#### Step 2.4: Helpers (src/components/[entity]/utils.ts)

```typescript
// Template based on applications/utils.ts
import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { FilterState } from './types'

export const formatDate = (dateString: string, locale: string = 'de'): string => {
  // Reuse the standard implementation
}

export const getEntityLabel = (value: any): string => {
  // Entity-specific label helpers
}

export const getActiveFilterCount = (filterState: FilterState): number => {
  // Implement active filter counting
}
```

#### Step 2.5: Filter hook (src/components/[entity]/use[Entity]Filter.ts)

```typescript
// Template based on applications/useApplicationFilter.ts
import { useMemo } from 'react'
import { EntityType, FilterState } from './types'

interface UseEntityFilterProps {
  entities: EntityType[]
  filterState: FilterState
}

export const useEntityFilter = ({ entities, filterState }: UseEntityFilterProps) => {
  return useMemo(() => {
    // Implement filtering
  }, [entities, filterState])
}
```

### Phase 3: Component implementation

#### Step 3.1: Table component (src/components/[entity]/[Entity]Table.tsx)

**Important: use GenericTable!**

```typescript
// Template based on applications/ApplicationTable.tsx
import { GenericTable } from '../common/GenericTable'
import { EntityType } from './types'

export const ENTITY_DEFAULT_COLUMN_VISIBILITY = {
  // Entity-specific default columns
} as const

const EntityTable: React.FC<EntityTableProps> = ({
  // Inherit props from GenericTable
}) => {
  const columns = useMemo(
    () => [
      // Define entity-specific columns
    ],
    [],
  )

  return (
    <GenericTable<EntityType>
      // Pass through all props to GenericTable
      entityName="entity"
    />
  )
}
```

#### Step 3.2: Toolbar component (src/components/[entity]/[Entity]Toolbar.tsx)

**Important: use GenericToolbar!**

```typescript
// Template based on applications/ApplicationToolbar.tsx
import GenericToolbar from '../common/GenericToolbar'

const EntityToolbar: React.FC<EntityToolbarProps> = ({
  // Define props
}) => {
  const t = useTranslations('entities')

  return (
    <GenericToolbar
      searchPlaceholder={t('searchPlaceholder')}
      tableKey="entities"
      // Forward all other props
    />
  )
}
```

#### Step 3.3: Filter dialog (src/components/[entity]/[Entity]FilterDialog.tsx)

**Important: use GenericFilterDialog!**

```typescript
// Template based on applications/ApplicationFilterDialog.tsx
import GenericFilterDialog, { FilterField } from '../common/GenericFilterDialog'

const EntityFilterDialog: React.FC<EntityFilterDialogProps> = ({
  // Define props
}) => {
  const filterFields: FilterField[] = [
    // Entity-specific filter fields
  ]

  return (
    <GenericFilterDialog
      filterFields={filterFields}
      // Forward all other props
    />
  )
}
```

#### Step 3.4: Form component (src/components/[entity]/[Entity]Form.tsx)

**Important: follow the Tanstack Form pattern!**

```typescript
// Template based on applications/ApplicationForm.tsx
import { useForm } from '@tanstack/react-form'

const EntityForm: React.FC<EntityFormProps> = ({
  // Define props
}) => {
  const form = useForm({
    // Tanstack Form configuration
  })

  return (
    // Form implementation
  )
}
```

### Phase 4: Main page (src/app/[lang]/[entity]/page.tsx)

**Important: copy the structure of applications/page.tsx exactly.**

```typescript
// Template based on applications/page.tsx
const EntitiesPage = () => {
  // Same structure as ApplicationsPage
  // Only entity-specific adjustments
}
```

### Phase 5: Translations

#### Step 5.1: German translations (messages/de.json)

```json
{
  "entities": {
    "title": "Entities",
    "description": "Entity description",
    "messages": {
      "loadError": "Error loading entities",
      "createSuccess": "Entity created successfully"
      // Full translation structure identical to applications
    },
    "form": {
      // Form translations
    },
    "table": {
      "headers": {
        // Table headers
      }
    }
  }
}
```

## Checklist for a new entity implementation

### ✅ Preparation

- [ ] GraphQL schema reviewed
- [ ] Applications structure copied as a template
- [ ] Entity-specific fields identified

### ✅ Backend/GraphQL

- [ ] GraphQL operations implemented (GET, CREATE, UPDATE, DELETE)
- [ ] TypeScript types taken from generated.ts

### ✅ Frontend structure

- [ ] types.ts with correct TypeScript definitions
- [ ] utils.ts with entity-specific helpers
- [ ] use[Entity]Filter.ts hook implemented

### ✅ Components (generic pattern)

- [ ] [Entity]Table.tsx with GenericTable
- [ ] [Entity]Toolbar.tsx with GenericToolbar
- [ ] [Entity]FilterDialog.tsx with GenericFilterDialog
- [ ] [Entity]Form.tsx with Tanstack Form pattern

### ✅ Integration

- [ ] page.tsx follows the ApplicationsPage pattern
- [ ] Translations complete (de.json, en.json)
- [ ] Menu integration (if needed)

### ✅ Testing

- [ ] Page loads without errors
- [ ] CRUD operations work
- [ ] Filters and search work
- [ ] Responsive design verified

## Quality assurance

### Code review points

1. **Generic components**: Are all generic components used correctly?
2. **Pattern consistency**: Does the implementation follow the Applications pattern?
3. **TypeScript**: Are all types correct and sourced from generated.ts?
4. **Translations**: Are all strings internationalized?
5. **Performance**: Are useMemo/useCallback used correctly?

### Automated checks

```bash
# TypeScript compilation
```

# Linting

# Build test

### VS Code Snippets

````

## Tools and automation

### Automation

```bash
# Script for creating a new entity
./scripts/create-entity.sh [entity-name]
````

- Snippet für Entity-Tabelle
- Snippet für Entity-Form
- Snippet für Entity-Page

## CRUD implementation: proven patterns

### GraphQL mutations: correct Neo4j syntax

**IMPORTANT:** Based on the successful Applications and Companies implementations, always use these patterns.

#### Create mutation (proven)

```typescript
// ✅ CORRECT - Proven in Applications & Companies
export const CREATE_ENTITIES = gql`
  mutation CreateEntities($input: [EntityCreateInput!]!) {
    createEntities(input: $input) {
      entities {
        id
        name
        description
        # ... more fields
        createdAt
        updatedAt
      }
    }
  }
`

// Usage in code:
await createEntityMutation({
  variables: { input: [values] }, // IMPORTANT: array for createEntities
  refetchQueries: [{ query: GET_ENTITIES }],
})
```

#### Update mutation (Applications pattern - proven)

```typescript
// ✅ CORRECT - Applications pattern (works)
export const UPDATE_ENTITY = gql`
  mutation UpdateEntity($id: ID!, $input: EntityUpdateInput!) {
    updateEntities(where: { id: { eq: $id } }, update: $input) {
      entities {
        id
        name
        description
        # ... more fields
        createdAt
        updatedAt
      }
    }
  }
`

// Usage in code:
await updateEntityMutation({
  variables: {
    id: entity.id, // IMPORTANT: separate id parameter
    input: {
      // IMPORTANT: { field: { set: value } } structure for Neo4j
      name: { set: values.name },
      description: { set: values.description },
      // ... additional fields using { set: value }
    },
  },
  refetchQueries: [{ query: GET_ENTITIES }],
})
```

### Page implementation: create and update patterns

#### Create handling (header button + dedicated dialog)

```typescript
const EntitiesPage = () => {
  // Dialog state
  const [showNewEntityForm, setShowNewEntityForm] = useState(false)

  // Create handler for header button
  const handleCreateEntity = () => {
    if (loading || !data?.entities) {
      enqueueSnackbar('Please wait until the data has loaded.', { variant: 'info' })
      return
    }
    setShowNewEntityForm(true)
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      {/* Header with create button */}
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

      {/* EntityTable WITHOUT onCreate prop */}
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

      {/* Dedicated create form dialog */}
      {showNewEntityForm && (
        <EntityForm
          isOpen={showNewEntityForm}
          onClose={() => setShowNewEntityForm(false)}
          mode="create"
          onSubmit={async (values: EntityFormValues) => {
            try {
              await createEntityMutation({
                variables: { input: [values] }, // IMPORTANT: array
                refetchQueries: [{ query: GET_ENTITIES }],
              })
              enqueueSnackbar(t('messages.createSuccess'), { variant: 'success' })
              setShowNewEntityForm(false)
            } catch (error) {
              console.error('Error while creating the entity:', error)
              enqueueSnackbar(t('messages.createError'), { variant: 'error' })
            }
          }}
        />
      )}
    </Box>
  )
}
```

#### Update handling (via GenericTable)

```typescript
const handleUpdateEntity = async (entity: EntityType, values: EntityFormValues) => {
  console.log('🔄 handleUpdateEntity called with:', { entity: entity.id, values })
  try {
    const result = await updateEntityMutation({
      variables: {
        id: entity.id, // IMPORTANT: separate id parameter, same as Applications
        input: {
          // IMPORTANT: { field: { set: value } } for Neo4j GraphQL
          name: { set: values.name },
          description: { set: values.description },
          // ... additional fields using { set: value }
        },
      },
      refetchQueries: [{ query: GET_ENTITIES }],
    })
    console.log('✅ Update successful:', result)
    enqueueSnackbar(t('messages.updateSuccess'), { variant: 'success' })
  } catch (error) {
    console.error('❌ Error while updating the entity:', error)
    enqueueSnackbar(t('messages.updateError'), { variant: 'error' })
  }
}
```

#### Delete handling (via GenericTable)

```typescript
// Delete handler in the page component
const handleDeleteEntity = async (id: string) => {
  try {
    await deleteEntityMutation({
      variables: { id }, // IMPORTANT: Applications pattern with id parameter
      refetchQueries: [{ query: GET_ENTITIES }],
    })
    enqueueSnackbar(t('messages.deleteSuccess'), { variant: 'success' })
  } catch (error) {
    console.error('❌ Error while deleting the entity:', error)
    enqueueSnackbar(t('messages.deleteError'), { variant: 'error' })
  }
}

// JSX: EntityTable with delete handler
<EntityTable
  entities={filteredEntities}
  loading={loading}
  globalFilter={globalFilter}
  sorting={sorting}
  onSortingChange={setSorting}
  onUpdateEntity={async (entityId, data) => {
    await handleUpdateEntity({ id: entityId } as EntityType, data)
  }}
  onDeleteEntity={handleDeleteEntity} // IMPORTANT: forward directly
/>
```

### Common mistakes and fixes

#### ❌ Problem: "Variable '$where' got invalid value"

```typescript
// ❌ WRONG - causes IDScalarFilters errors
mutation UpdateEntities($where: EntityWhere!, $update: EntityUpdateInput!) {
  updateEntities(where: $where, update: $update)
}

// ❌ WRONG - delete with a where object
mutation DeleteEntities($where: EntityWhere!) {
  deleteEntities(where: $where) {
    nodesDeleted
  }
}

// ✅ CORRECT - use the Applications pattern
mutation UpdateEntity($id: ID!, $input: EntityUpdateInput!) {
  updateEntities(where: { id: { eq: $id } }, update: $input)
}

// ✅ CORRECT - delete by direct ID
mutation DeleteEntity($id: ID!) {
  deleteEntities(where: { id: { eq: $id } }) {
    nodesDeleted
  }
}
```

#### ❌ Problem: "Expected type 'StringScalarMutations' to be an object"

```typescript
// ❌ WRONG - direct values
input: {
  name: values.name,
  description: values.description,
}

// ✅ CORRECT - { set: value } structure for Neo4j GraphQL
input: {
  name: { set: values.name },
  description: { set: values.description },
}
```

#### ❌ Problem: "Create button does not work"

```typescript
// ❌ WRONG - Create via GenericTable (causes onSubmit issues)
<GenericTable
  onCreate={...}  // Leads to onSubmit problems
/>

// ✅ CORRECT - separate create dialog like Applications
{/* Header button */}
<Button onClick={handleCreateEntity}>Create</Button>

{/* Dedicated dialog */}
{showNewEntityForm && (
  <EntityForm
    mode="create"
    onSubmit={async values => {
      await createEntityMutation({ variables: { input: [values] } })
    }}
  />
)}
```

#### ❌ Problem: "Delete dialogs are duplicated or not localized"

```typescript
// ❌ WRONG - Manual delete dialog in page + GenericForm delete
{showDeleteConfirm && (
  <Paper>
    <Typography>Confirm deletion</Typography>
    <Button onClick={handleDelete}>Delete</Button>
  </Paper>
)}

// ✅ CORRECT - use only GenericTable delete
<EntityTable
  onDeleteEntity={handleDeleteEntity}
  // No manual delete dialog needed!
/>

// ✅ Delete handler in page
const handleDeleteEntity = async (id: string) => {
  await deleteEntityMutation({
    variables: { id }, // Applications pattern
    refetchQueries: [{ query: GET_ENTITIES }],
  })
}
```

### CRUD implementation checklist

#### GraphQL mutations

- [ ] CREATE_ENTITIES uses plural name (createEntities)
- [ ] UPDATE_ENTITY uses Applications pattern ($id: ID!, { id: { eq: $id } })
- [ ] DELETE_ENTITY uses Applications pattern ($id: ID!, { id: { eq: $id } })
- [ ] Array input for create: { input: [values] }
- [ ] { set: value } structure for update input

#### Page component

- [ ] Header with create button (architects only)
- [ ] handleCreateEntity opens the dialog
- [ ] handleUpdateEntity uses { field: { set: value } }
- [ ] handleDeleteEntity forwards the ID directly
- [ ] Dedicated create form dialog
- [ ] EntityTable without onCreate prop
- [ ] EntityTable with onDeleteEntity prop

#### Functional tests

- [ ] Create: header button → dialog → submit works
- [ ] Update: table edit → dialog → submit works
- [ ] Delete: table delete → GenericForm confirmation → submit works
- [ ] Console logs show correct GraphQL variables
- [ ] No "StringScalarMutations" errors
- [ ] No "IDScalarFilters" errors
- [ ] Only one delete dialog (GenericForm), not two

### Reference implementations

- Applications: fully working create/update pattern
- Companies: corrected to Applications pattern, now working
- Both use: dedicated create dialog + Applications GraphQL syntax

## Conclusion

For future entity implementations:

1. **Always use the Applications pattern**—it is proven to work.
2. **Dedicated create dialog**—do not wire create through GenericTable onCreate.
3. **Follow Neo4j GraphQL syntax**—use { set: value } for updates.
4. **Copy Applications GraphQL mutations**—reuse the parameter structure.
5. **Follow this documentation**—it prevents recurring onSubmit issues.

Consistently applying this pattern ensures:

1. **Consistency**: all entities follow the same functional structure.
2. **Maintainability**: changes to generic components propagate to every entity.
3. **Development speed**: new entities are added quickly and with fewer errors.
4. **Quality**: proven, tested patterns are reused.
5. **Documentation**: each new entity is self-explanatory thanks to the known pattern.
6. **Less debugging**: CRUD issues are minimized.
