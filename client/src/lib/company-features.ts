import {
  DEFAULT_LENS,
  FEATURE_FLAGS,
  LENS_OPTIONS,
  type FeatureFlags,
  type LensFlags,
} from './feature-definitions'

export type CompanyFeaturesPayload = {
  lenses?: Partial<LensFlags>
  features?: Partial<FeatureFlags>
}

export const buildDefaultLensFlags = (): LensFlags => {
  return LENS_OPTIONS.reduce((acc, lens) => {
    acc[lens] = lens === DEFAULT_LENS
    return acc
  }, {} as LensFlags)
}

export const buildDefaultFeatureFlags = (): FeatureFlags => {
  return FEATURE_FLAGS.reduce((acc, feature) => {
    acc[feature] = false
    return acc
  }, {} as FeatureFlags)
}

export const parseCompanyFeatures = (featuresJson?: string | null) => {
  const defaultLensFlags = buildDefaultLensFlags()
  const defaultFeatureFlags = buildDefaultFeatureFlags()

  if (!featuresJson || featuresJson.trim().length === 0) {
    return { lensFlags: defaultLensFlags, featureFlags: defaultFeatureFlags }
  }

  try {
    const parsed = JSON.parse(featuresJson) as CompanyFeaturesPayload
    const lensFlags: LensFlags = {
      ...defaultLensFlags,
      ...(parsed?.lenses || {}),
    }
    lensFlags[DEFAULT_LENS] = true

    const featureFlags: FeatureFlags = {
      ...defaultFeatureFlags,
      ...(parsed?.features || {}),
    }

    return { lensFlags, featureFlags }
  } catch {
    return { lensFlags: defaultLensFlags, featureFlags: defaultFeatureFlags }
  }
}

export const serializeCompanyFeatures = (lensFlags: LensFlags, featureFlags: FeatureFlags) => {
  return JSON.stringify({ lenses: lensFlags, features: featureFlags })
}
