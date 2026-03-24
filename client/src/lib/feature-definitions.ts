export const LENS_OPTIONS = [
  'enterpriseArchitecture',
  'businessArchitecture',
  'processArchitecture',
  'dataArchitecture',
  'aiArchitecture',
  'solutionArchitecture',
  'cybersecurityArchitecture',
  'infrastructureArchitecture',
  'transformationArchitecture',
  'technologyManagement',
] as const

export const DEFAULT_LENS = 'enterpriseArchitecture' as const

export type LensKey = (typeof LENS_OPTIONS)[number]
export type LensFlags = Record<LensKey, boolean>

export const NOT_IMPLEMENTED_LENSES: readonly LensKey[] = [
  'dataArchitecture',
  'aiArchitecture',
  'solutionArchitecture',
  'cybersecurityArchitecture',
  'infrastructureArchitecture',
  'transformationArchitecture',
] as const

export const FEATURE_FLAGS = [
  'GEA',
  'BMC',
  'BCA',
  'AAS',
  'ABH',
  'APS',
  'AMO',
  'SUP',
  'Sovereignty',
] as const

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[number]
export type FeatureFlags = Record<FeatureFlagKey, boolean>

export const NOT_IMPLEMENTED_FEATURE_FLAGS: readonly FeatureFlagKey[] = [
  'BMC',
  'BCA',
  'AAS',
  'ABH',
  'APS',
  'AMO',
] as const
