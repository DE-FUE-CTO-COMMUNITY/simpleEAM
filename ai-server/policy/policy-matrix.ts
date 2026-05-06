import type { QueryForm } from '../artifacts/types'

export const START_POLICY_MATRIX_ENTITY_TYPES = [
  'BusinessCapability',
  'Application',
  'ApplicationInterface',
  'DataObject',
  'Infrastructure',
  'SoftwareProduct',
  'SoftwareVersion',
  'HardwareProduct',
] as const

export type StartPolicyMatrixEntityType = (typeof START_POLICY_MATRIX_ENTITY_TYPES)[number]

export type StartPolicyMatrix = Readonly<
  Record<QueryForm, Readonly<Record<StartPolicyMatrixEntityType, readonly string[]>>>
>

export const START_POLICY_MATRIX = {
  ENTITY_SEARCH: {
    BusinessCapability: [],
    Application: [],
    ApplicationInterface: [],
    DataObject: [],
    Infrastructure: [],
    SoftwareProduct: [],
    SoftwareVersion: [],
    HardwareProduct: [],
  },
  ENTITY_DETAILS: {
    BusinessCapability: ['supportedByApplications', 'supportedByBusinessProcesses'],
    Application: ['supportsCapabilities', 'sourceOfInterfaces', 'targetOfInterfaces'],
    ApplicationInterface: ['sourceApplications', 'targetApplications', 'dataObjects'],
    DataObject: ['usedByApplications', 'transferredInInterfaces'],
    Infrastructure: ['hostsApplications', 'usesSoftwareProducts', 'usesHardwareProducts'],
    SoftwareProduct: ['usedByApplications', 'versions'],
    SoftwareVersion: ['softwareProduct'],
    HardwareProduct: ['usedByInfrastructure', 'providedBy'],
  },
  ENTITY_RELATION_FILTER: {
    BusinessCapability: ['supportedByApplications'],
    Application: [
      'supportsCapabilities',
      'usesDataObjects',
      'usesSoftwareProducts',
      'sourceOfInterfaces',
      'targetOfInterfaces',
    ],
    ApplicationInterface: ['sourceApplications', 'targetApplications', 'dataObjects'],
    DataObject: ['usedByApplications', 'transferredInInterfaces'],
    Infrastructure: ['hostsApplications', 'usesSoftwareProducts', 'usesHardwareProducts'],
    SoftwareProduct: ['usedByApplications', 'usedByInfrastructure'],
    SoftwareVersion: ['usedByApplications', 'usedByInfrastructure'],
    HardwareProduct: ['usedByInfrastructure'],
  },
  ENTITY_GAP_ANALYSIS: {
    BusinessCapability: ['supportedByApplications'],
    Application: ['supportsCapabilities'],
    ApplicationInterface: ['dataObjects'],
    DataObject: ['usedByApplications'],
    Infrastructure: ['hostsApplications'],
    SoftwareProduct: ['usedByApplications'],
    SoftwareVersion: ['usedByApplications'],
    HardwareProduct: ['usedByInfrastructure'],
  },
  COUNT_ENTITIES: {
    BusinessCapability: [],
    Application: [],
    ApplicationInterface: [],
    DataObject: [],
    Infrastructure: [],
    SoftwareProduct: [],
    SoftwareVersion: [],
    HardwareProduct: [],
  },
} as const satisfies StartPolicyMatrix

export declare function isRelationAllowed(
  intent: QueryForm,
  entityType: StartPolicyMatrixEntityType,
  relationName: string
): boolean
