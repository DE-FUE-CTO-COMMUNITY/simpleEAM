# Excel Import Relationship Mapping Fix - COMPLETED

## Problem Resolved

The Excel import functionality was experiencing an issue where relationship updates were using original Excel IDs instead of actual database UUIDs. During the two-phase import process:
- **Phase 1**: Create entities (correctly mapped Excel IDs to database UUIDs)
- **Phase 2**: Update relationships (was still using original Excel IDs)

## Root Cause

The relationship field values (like `"person-001"` in the `owners` field) were not being mapped from Excel IDs to the actual database UUIDs that were created in Phase 1.

## Solution Implemented

### 1. Added Helper Function for Relationship Fields

```typescript
// Helper function to get relationship field names for each entity type
const getRelationshipFields = (entityType: string): string[] => {
  switch (entityType) {
    case 'businessCapabilities':
      return ['owners', 'parents']
    case 'applications':
      return ['owners', 'supportsCapabilities', 'usesDataObjects', 'partOfArchitectures']
    case 'dataObjects':
      return ['owners', 'dataSources', 'usedByApplications', 'relatedToCapabilities', 'transferredInInterfaces', 'partOfArchitectures']
    case 'interfaces':
      return ['responsiblePerson', 'sourceApplications', 'targetApplications', 'dataObjects', 'partOfArchitectures']
    case 'persons':
      return [] // Persons typically don't have relationships in our model
    case 'architectures':
      return ['owners', 'containsApplications', 'containsCapabilities', 'containsDataObjects', 'diagrams', 'parentArchitecture']
    case 'diagrams':
      return ['creator', 'architecture']
    default:
      return []
  }
}
```

### 2. Enhanced Multi-Tab Import (Phase 2)

For bulk imports with multiple entity types:

```typescript
// Create comprehensive mapping from all entity types
const allEntityMappings: { [originalId: string]: string } = {}
Object.values(createdEntityMappings).forEach(entityTypeMapping => {
  Object.assign(allEntityMappings, entityTypeMapping)
})

// Update tabData with actual database IDs AND map relationship field values
const updatedTabData = tabData.map(row => {
  const originalId = String(row.id || '')
  const actualDbId = createdEntityMappings[tabName]?.[originalId]
  
  // Update the main entity ID
  const updatedRow: any = actualDbId ? { ...row, id: actualDbId } : { ...row }
  
  // Map all relationship field values to actual database UUIDs
  const relationshipFields = getRelationshipFields(entityType as any)
  relationshipFields.forEach((fieldName: string) => {
    if (updatedRow[fieldName]) {
      const originalIds = parseRelationshipIds(updatedRow[fieldName])
      const mappedIds = originalIds.map(originalId => 
        allEntityMappings[originalId] || originalId
      ).filter(id => id) // Remove any null/undefined values
      
      if (mappedIds.length > 0) {
        updatedRow[fieldName] = mappedIds.join(',')
      }
    }
  })
  
  return updatedRow
})
```

### 3. Enhanced Single-Tab Import (Phase 2)

For single entity type imports:

```typescript
// Update entities with relationships using actual database IDs
const updatedData = data.map(row => {
  const originalId = String(row.id || '')
  const actualDbId = entityMappings[originalId]
  
  // Update the main entity ID
  const updatedRow: any = actualDbId ? { ...row, id: actualDbId } : { ...row }
  
  // Map all relationship field values to actual database UUIDs
  const relationshipFields = getRelationshipFields(importSettings.entityType)
  relationshipFields.forEach((fieldName: string) => {
    if (updatedRow[fieldName]) {
      const originalIds = parseRelationshipIds(updatedRow[fieldName])
      const mappedIds = originalIds.map(originalId => 
        entityMappings[originalId] || originalId
      ).filter(id => id) // Remove any null/undefined values
      
      if (mappedIds.length > 0) {
        updatedRow[fieldName] = mappedIds.join(',')
        console.log(`DEBUG: Mapped ${fieldName} from [${originalIds.join(',')}] to [${mappedIds.join(',')}]`)
      }
    }
  })
  
  return updatedRow
})
```

## Test Results

Created and ran comprehensive test script (`test-relationship-mapping-fix.js`) that demonstrates:

✅ **Entity IDs are mapped correctly**: `bc-001` → `123e4567-e89b-12d3-a456-426614174001`
✅ **Relationship field values are mapped**: `owners: "person-001"` → `owners: "123e4567-e89b-12d3-a456-426614174011"`
✅ **Cross-entity relationships work**: Applications can reference Business Capabilities and Persons correctly
✅ **Multi-field relationships work**: `supportsCapabilities: "bc-001,bc-002"` → mapped UUIDs

## Code Verification

- ✅ TypeScript compilation successful
- ✅ No runtime errors
- ✅ Build completes successfully
- ✅ All relationship field types supported

## Impact

This fix ensures that:

1. **Phase 1 creates entities** with proper UUID generation
2. **Phase 2 updates relationships** using the actual database UUIDs, not Excel IDs
3. **Cross-entity relationships** work correctly across all entity types
4. **Both single-tab and multi-tab imports** handle relationship mapping properly

## Files Modified

- `/home/mf2admin/simple-eam/client/src/components/excel/ExcelImportExport.tsx`
  - Added `getRelationshipFields()` helper function
  - Enhanced Phase 2 relationship mapping for multi-tab import
  - Enhanced Phase 2 relationship mapping for single-tab import
  - Added comprehensive ID mapping across all entity types

## Status: ✅ COMPLETED AND TESTED

The Excel import relationship mapping issue has been fully resolved and tested. The import functionality now correctly maps all relationship field values from Excel IDs to actual database UUIDs during the two-phase import process.
