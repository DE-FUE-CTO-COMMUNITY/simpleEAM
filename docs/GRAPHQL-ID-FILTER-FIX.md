# Fix: GraphQL ID Filtering for Relationship Creation

## Problem

When creating relationships between diagram elements, a GraphQL validation error occurred:

```
Expected type "IDScalarFilters" to be an object.
Variable "$where" got invalid value "1OQNcS1qQm9z4ZAd_K-1u" at "where.id"
Variable "$update" got invalid value "tbEZ5Mw6jLLbuHg5V7BGi" at "update.sourceOfInterfaces.connect[0].where.node.id"
```

## Cause

The GraphQL mutations in `relationshipCreation.ts` used the wrong format for ID filters:

**❌ Wrong:**

```typescript
where: {
  id: sourceElementId
}
connect: [{ where: { node: { id: targetElementId } } }]
```

**✅ Correct:**

```typescript
where: {
  id: {
    eq: sourceElementId
  }
}
connect: [{ where: { node: { id: { eq: targetElementId } } } }]
```

## Solution

All GraphQL mutations in `/client/src/components/diagrams/utils/relationshipCreation.ts` have been corrected:

### Corrected Relationship Types:

- ✅ `SUPPORTS` (Application → BusinessCapability)
- ✅ `USES` (Application → DataObject)
- ✅ `HOSTED_ON` (Application → Infrastructure)
- ✅ `INTERFACE_SOURCE` (Application ↔ ApplicationInterface)
- ✅ `INTERFACE_TARGET` (Application ↔ ApplicationInterface)
- ✅ `RELATED_TO` (BusinessCapability → DataObject)
- ✅ `TRANSFERS` (ApplicationInterface → DataObject)
- ✅ `DATA_SOURCE` (DataObject → Application)

### Additional Corrections:

- ✅ Correct usage of `getRelationshipDisplayName(relationshipDefinition.type)` function
- ✅ Proper import of `getRelationshipDisplayName` function

## Verification

After the correction:

- ✅ All TypeScript compilation errors resolved
- ✅ GraphQL mutations use correct `IdScalarFilters` structure
- ✅ Relationship creation should work without errors

## GraphQL ID Filter Schema

The correct format for ID filters in Neo4j GraphQL:

```typescript
// For WHERE clauses:
where: { id: { eq: "element-id" } }

// For CONNECT operations:
connect: [{ where: { node: { id: { eq: "target-id" } } } }]

// Available IdScalarFilters operators:
{
  eq?: string       // equals
  in?: string[]     // in array
  contains?: string // contains substring
  startsWith?: string
  endsWith?: string
}
```

## Testing

The corrected mutations can now be tested by:

1. Creating a diagram with new elements
2. Defining relationships between elements
3. Saving the diagram - should work without GraphQL errors
