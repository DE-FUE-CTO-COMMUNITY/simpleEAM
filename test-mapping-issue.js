#!/usr/bin/env node

/**
 * Test script to reproduce the exact mapping issue from the error message
 */

console.log('=== Reproducing Entity Mapping Issue ===\n')

// Simulate the exact scenario from the error
const mockCreatedEntityMappings = {
  'Business Capabilities': {
    'bc-019': '123e4567-e89b-12d3-a456-426614174019'
  },
  'Persons': {
    'person-006': '123e4567-e89b-12d3-a456-426614174006'
  }
}

const mockTabData = [
  { id: 'bc-019', name: 'Test Capability', owners: 'person-006' }
]

console.log('Mock data setup:')
console.log('createdEntityMappings:', mockCreatedEntityMappings)
console.log('tabData:', mockTabData)
console.log()

// Simulate the Phase 2 mapping process exactly as in the code
const tabName = 'Business Capabilities'
const tabData = mockTabData

console.log('=== Phase 2 Simulation ===')

// Create comprehensive mapping from all entity types
const allEntityMappings = {}
Object.values(mockCreatedEntityMappings).forEach(entityTypeMapping => {
  Object.assign(allEntityMappings, entityTypeMapping)
})
console.log('allEntityMappings:', allEntityMappings)
console.log()

// Update tabData with actual database IDs from Phase 1
const updatedTabData = tabData.map(row => {
  const originalId = String(row.id || '')
  const actualDbId = mockCreatedEntityMappings[tabName]?.[originalId]
  
  console.log(`Processing entity:`)
  console.log(`  originalId: ${originalId}`)
  console.log(`  tabName: ${tabName}`)
  console.log(`  mockCreatedEntityMappings[tabName]: ${JSON.stringify(mockCreatedEntityMappings[tabName])}`)
  console.log(`  actualDbId from lookup: ${actualDbId}`)
  
  // Update the main entity ID
  const updatedRow = actualDbId ? { ...row, id: actualDbId } : { ...row }
  
  console.log(`  Updated row ID: ${updatedRow.id}`)
  console.log(`  ID mapping successful: ${updatedRow.id !== originalId}`)
  
  return updatedRow
})

console.log('\nFinal updatedTabData:', updatedTabData)

console.log('\n=== Analysis ===')
if (updatedTabData[0].id === 'bc-019') {
  console.log('❌ PROBLEM: Entity ID was NOT mapped - still using original Excel ID')
  console.log('❌ This means the lookup mockCreatedEntityMappings[tabName]?.[originalId] failed')
} else {
  console.log('✅ SUCCESS: Entity ID was mapped correctly')
}

console.log('\n=== Potential Issues ===')
console.log('1. Check if tabName exactly matches the key in createdEntityMappings')
console.log('2. Check if originalId exactly matches the key in the mapping')
console.log('3. Check if createdEntityMappings was populated correctly in Phase 1')
