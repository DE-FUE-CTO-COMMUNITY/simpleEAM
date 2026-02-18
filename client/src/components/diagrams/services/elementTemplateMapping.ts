/**
 * Mapping von internen Elementtypen zu Archimate-Template-Namen
 */
export const getArchimateTemplateName = (elementType: string): string => {
  const mapping: Record<string, string> = {
    businessCapability: 'Capability',
    businessProcess: 'Business Process',
    application: 'Application Component',
    dataObject: 'Data Object',
    interface: 'Application Interface',
    applicationInterface: 'Application Interface',
    infrastructure: 'Infrastructure',
    aiComponent: 'AI Component',
  }
  return mapping[elementType] || elementType
}
