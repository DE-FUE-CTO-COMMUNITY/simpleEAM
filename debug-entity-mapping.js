#!/usr/bin/env node

/**
 * Debug script to understand why entity IDs are not being mapped correctly in Phase 2
 */

// Mock the mapping process to identify the issue
const mockTabData = [{ id: 'bc-019', name: 'Test Capability', owners: 'person-006' }]

const mockEntityMappings = {
  'Business Capabilities': {
    'bc-019': '123e4567-e89b-12d3-a456-426614174019',
  },
  Persons: {
    'person-006': '123e4567-e89b-12d3-a456-426614174006',
  },
}

// Simulate what should happen in Phase 2
console.log('=== Phase 2 Entity ID Mapping Debug ===\n')

console.log('Original tabData:')
console.log(mockTabData)

// Create comprehensive mapping
const allEntityMappings = {}
Object.values(mockEntityMappings).forEach(entityTypeMapping => {
  Object.assign(allEntityMappings, entityTypeMapping)
})

console.log('\nAll available mappings:')
console.log(allEntityMappings)

// Simulate the mapping process
const updatedTabData = mockTabData.map(row => {
  const originalId = String(row.id || '')
  const actualDbId = mockEntityMappings['Business Capabilities']?.[originalId]

  console.log(`\nProcessing row with originalId: ${originalId}`)
  console.log(`Found actualDbId: ${actualDbId}`)

  // Update the main entity ID
  const updatedRow = actualDbId ? { ...row, id: actualDbId } : { ...row }

  // Map relationship field values
  if (updatedRow.owners) {
    const originalIds = [updatedRow.owners] // parseRelationshipIds would split by comma
    const mappedIds = originalIds
      .map(originalId => allEntityMappings[originalId] || originalId)
      .filter(id => id)

    if (mappedIds.length > 0) {
      updatedRow.owners = mappedIds.join(',')
      console.log(`Mapped owners: ${originalIds.join(',')} -> ${mappedIds.join(',')}`)
    }
  }

  console.log(`Updated row:`, updatedRow)
  return updatedRow
})

console.log('\nFinal updatedTabData that should be passed to updateEntityRelationships:')
console.log(updatedTabData)

console.log('\n=== Expected vs Actual ===')
console.log('Expected entity ID in mutation:', updatedTabData[0].id)
console.log('Expected owners in mutation:', updatedTabData[0].owners)
console.log('Actual entity ID from error: bc-019 (WRONG!)')
console.log('Actual owners from error: person-006 (WRONG!)')

console.log('\n=== Conclusion ===')
console.log(
  '❌ The entity ID mapping is working in our code, but not being applied in the actual mutation'
)
console.log(
  '❌ The relationship field mapping is working in our code, but not being applied in the actual mutation'
)
console.log(
  '🔍 Need to check if updatedTabData is correctly passed to updateEntityRelationships function'
)
