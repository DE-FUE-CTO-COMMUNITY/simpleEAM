// Test script to verify entity type mappings are working correctly

const testEntityMapping = () => {
  // Mock data to test the mapping logic

  const entityTypeMapping = {
    'Business Capabilities': 'businessCapabilities',
    Applications: 'applications',
    'Data Objects': 'dataObjects',
    Interfaces: 'interfaces',
    Persons: 'persons',
    Architectures: 'architectures',
    Diagrams: 'diagrams',
  }

  const displayNameMapping = {
    'Business Capabilities': 'Business Capabilities',
    Applications: 'Applications',
    'Data Objects': 'Data Objects',
    Interfaces: 'Interfaces',
    Persons: 'Persons',
    Architectures: 'Architectures',
    Diagrams: 'Diagrams',
  }

  const technicalToDisplayName = {
    businessCapabilities: 'Business Capabilities',
    applications: 'Applications',
    dataObjects: 'Data Objects',
    interfaces: 'Interfaces',
    persons: 'Persons',
    architectures: 'Architectures',
    diagrams: 'Diagrams',
  }

  const mutationMap = {
    'Business Capabilities': 'CREATE_CAPABILITY',
    Applications: 'CREATE_APPLICATION',
    'Data Objects': 'CREATE_DATA_OBJECT',
    Interfaces: 'CREATE_APPLICATION_INTERFACE',
    Persons: 'CREATE_PERSON',
    Architectures: 'CREATE_ARCHITECTURE',
    Diagrams: 'CREATE_DIAGRAM',
  }

  console.log('Testing entity type mappings...\n')

  // Test 1: Multi-tab import mapping
  console.log('1. Multi-tab import mapping:')
  Object.keys(entityTypeMapping).forEach(tabName => {
    const technicalName = entityTypeMapping[tabName]
    const displayName = displayNameMapping[tabName]
    const hasMutation = mutationMap[displayName]

    console.log(
      `  ${tabName} -> ${technicalName} (validation) -> ${displayName} (import) -> ${hasMutation ? '✓' : '✗'} mutation`
    )
  })

  // Test 2: Single-tab import mapping
  console.log('\n2. Single-tab import mapping:')
  Object.keys(technicalToDisplayName).forEach(technicalName => {
    const displayName = technicalToDisplayName[technicalName]
    const hasMutation = mutationMap[displayName]

    console.log(`  ${technicalName} -> ${displayName} -> ${hasMutation ? '✓' : '✗'} mutation`)
  })

  // Test 3: Check for any missing mappings
  console.log('\n3. Validation:')
  const allTechnicalNames = Object.values(entityTypeMapping)
  const allDisplayNames = Object.values(displayNameMapping)
  const allSingleDisplayNames = Object.values(technicalToDisplayName)
  const allMutationDisplayNames = Object.keys(mutationMap)

  const missingMutations = allDisplayNames.filter(name => !allMutationDisplayNames.includes(name))
  const missingSingleMutations = allSingleDisplayNames.filter(
    name => !allMutationDisplayNames.includes(name)
  )

  if (missingMutations.length === 0 && missingSingleMutations.length === 0) {
    console.log('  ✓ All mappings are complete and consistent')
  } else {
    console.log('  ✗ Missing mutations for:', [...missingMutations, ...missingSingleMutations])
  }

  console.log('\nTest completed!')
}

testEntityMapping()
