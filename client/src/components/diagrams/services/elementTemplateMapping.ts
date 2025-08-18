/**
 * Mapping von internen Elementtypen zu Archimate-Template-Namen
 */
export const getArchimateTemplateName = (elementType: string): string => {
  const mapping: Record<string, string> = {
    capability: 'Capability',
    application: 'Application Component',
    dataObject: 'Business Object',
    interface: 'Application Interface',
    applicationInterface: 'Application Interface',
    infrastructure: 'Infrastruktur', // Deutsch statt 'Node'
  }
  return mapping[elementType] || elementType
}
