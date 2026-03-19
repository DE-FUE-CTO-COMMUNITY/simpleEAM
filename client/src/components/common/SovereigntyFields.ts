import { SovereigntyMaturity } from '@/gql/generated'
import type { FieldConfig } from './GenericForm'

const MATURITY_ORDER: readonly SovereigntyMaturity[] = [
  SovereigntyMaturity.VERY_HIGH,
  SovereigntyMaturity.HIGH,
  SovereigntyMaturity.MEDIUM,
  SovereigntyMaturity.LOW,
  SovereigntyMaturity.NONE,
]

const buildMaturityOptions = (tCommon: (key: string) => string) =>
  MATURITY_ORDER.map(value => ({
    value,
    label: tCommon(`sovereignty.maturity.${value}`),
  }))

export const buildSovereigntyRequirementFields = (
  tCommon: (key: string) => string,
  tabId = 'sovereignty'
): FieldConfig[] => {
  const options = buildMaturityOptions(tCommon)

  return [
    {
      name: 'sovereigntyReqDataResidency',
      label: tCommon('sovereignty.fields.reqDataResidency'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyReqJurisdictionControl',
      label: tCommon('sovereignty.fields.reqJurisdictionControl'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyReqOperationalControl',
      label: tCommon('sovereignty.fields.reqOperationalControl'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyReqInteroperability',
      label: tCommon('sovereignty.fields.reqInteroperability'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyReqPortability',
      label: tCommon('sovereignty.fields.reqPortability'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyReqSupplyChainTransparency',
      label: tCommon('sovereignty.fields.reqSupplyChainTransparency'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyReqWeight',
      label: tCommon('sovereignty.fields.reqWeight'),
      type: 'number',
      tabId,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyReqRationale',
      label: tCommon('sovereignty.fields.reqRationale'),
      type: 'textarea',
      tabId,
      rows: 3,
      size: 12,
    },
  ]
}

export const buildSovereigntyAchievedFields = (
  tCommon: (key: string) => string,
  tabId = 'sovereignty'
): FieldConfig[] => {
  const options = buildMaturityOptions(tCommon)

  return [
    {
      name: 'sovereigntyAchDataResidency',
      label: tCommon('sovereignty.fields.achDataResidency'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyAchJurisdictionControl',
      label: tCommon('sovereignty.fields.achJurisdictionControl'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyAchOperationalControl',
      label: tCommon('sovereignty.fields.achOperationalControl'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyAchInteroperability',
      label: tCommon('sovereignty.fields.achInteroperability'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyAchPortability',
      label: tCommon('sovereignty.fields.achPortability'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyAchSupplyChainTransparency',
      label: tCommon('sovereignty.fields.achSupplyChainTransparency'),
      type: 'select',
      tabId,
      options,
      size: { xs: 12, md: 6 },
    },
    {
      name: 'sovereigntyEvidence',
      label: tCommon('sovereignty.fields.evidence'),
      type: 'textarea',
      tabId,
      rows: 3,
      size: 12,
    },
    {
      name: 'lastSovereigntyAssessmentAt',
      label: tCommon('sovereignty.fields.lastAssessmentAt'),
      type: 'date',
      tabId,
      size: { xs: 12, md: 6 },
    },
  ]
}
