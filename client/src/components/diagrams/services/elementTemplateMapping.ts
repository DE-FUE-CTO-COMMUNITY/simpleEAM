/**
 * Mapping von internen Elementtypen zu Archimate-Template-Namen
 */
export const getArchimateTemplateName = (elementType: string): string => {
  const mapping: Record<string, string> = {
    businessCapability: 'Capability',
    application: 'Application Component',
    dataObject: 'Business Object',
    interface: 'Application Interface',
    applicationInterface: 'Application Interface',
    infrastructure: 'Infrastruktur', // Deutsch statt 'Node'
    aiComponent: 'AI Component',
  }
  return mapping[elementType] || elementType
}
