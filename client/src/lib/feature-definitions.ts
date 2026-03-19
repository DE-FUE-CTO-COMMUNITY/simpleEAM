export const LENS_OPTIONS = [
  'enterpriseArchitecture',
  'businessArchitecture',
  'processArchitecture',
  'dataArchitecture',
  'aiArchitecture',
  'solutionArchitecture',
  'infrastructureArchitecture',
  'transformationArchitecture',
  'technologyManagement',
] as const

export const DEFAULT_LENS = 'enterpriseArchitecture' as const

export type LensKey = (typeof LENS_OPTIONS)[number]
export type LensFlags = Record<LensKey, boolean>

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
