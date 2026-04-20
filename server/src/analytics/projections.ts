import { neo4jDriver } from '../db/neo4j-client'

import { replaceProjectionRows } from './clickhouse'

interface BusinessCapabilityProjectionRow {
  readonly id: string
  readonly company_id: string
  readonly name: string
  readonly status: string
  readonly capability_type: string
  readonly maturity_level: number
  readonly business_value: number
  readonly supported_applications: number
  readonly supporting_ai_components: number
  readonly related_data_objects: number
  readonly updated_at: string
  readonly updated_month: string
}

interface ApplicationProjectionRow {
  readonly id: string
  readonly company_id: string
  readonly name: string
  readonly status: string
  readonly criticality: string
  readonly vendor: string
  readonly time_category: string
  readonly hosting_environment: string
  readonly monthly_cost: number
  readonly supported_capabilities: number
  readonly used_data_objects: number
  readonly ai_components: number
  readonly interfaces: number
  readonly updated_at: string
  readonly updated_month: string
}

interface AiComponentProjectionRow {
  readonly id: string
  readonly company_id: string
  readonly name: string
  readonly status: string
  readonly ai_type: string
  readonly provider: string
  readonly license: string
  readonly monthly_cost: number
  readonly accuracy: number
  readonly supported_capabilities: number
  readonly training_data_objects: number
  readonly updated_at: string
  readonly updated_month: string
}

interface DataObjectProjectionRow {
  readonly id: string
  readonly company_id: string
  readonly name: string
  readonly classification: string
  readonly format: string
  readonly using_applications: number
  readonly transferring_interfaces: number
  readonly training_ai_components: number
  readonly updated_at: string
  readonly updated_month: string
}

interface ApplicationInterfaceProjectionRow {
  readonly id: string
  readonly company_id: string
  readonly name: string
  readonly status: string
  readonly interface_type: string
  readonly protocol: string
  readonly source_applications: number
  readonly target_applications: number
  readonly transferred_data_objects: number
  readonly updated_at: string
  readonly updated_month: string
}

interface InfrastructureProjectionRow {
  readonly id: string
  readonly company_id: string
  readonly name: string
  readonly status: string
  readonly infrastructure_type: string
  readonly vendor: string
  readonly location: string
  readonly operating_system: string
  readonly monthly_cost: number
  readonly hosted_applications: number
  readonly hosted_ai_components: number
  readonly updated_at: string
  readonly updated_month: string
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  if (value && typeof value === 'object' && 'toNumber' in value) {
    const maybeInteger = value as { toNumber?: () => number }
    if (typeof maybeInteger.toNumber === 'function') {
      return maybeInteger.toNumber()
    }
  }

  return 0
}

function normalizeUpdatedMonth(updatedAt: string): string {
  const date = new Date(updatedAt)
  const year = date.getUTCFullYear()
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  return `${year}-${month}-01`
}

function formatClickHouseDateTime(value: string): string {
  const date = new Date(value)

  const year = date.getUTCFullYear()
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  const day = `${date.getUTCDate()}`.padStart(2, '0')
  const hours = `${date.getUTCHours()}`.padStart(2, '0')
  const minutes = `${date.getUTCMinutes()}`.padStart(2, '0')
  const seconds = `${date.getUTCSeconds()}`.padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

async function loadApplicationProjectionRows(
  companyId: string | null
): Promise<ApplicationProjectionRow[]> {
  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (application:Application)-[:OWNED_BY]->(company:Company)
        OPTIONAL MATCH (application)-[:PROVIDED_BY]->(provider:Supplier)
        WITH application, company, head(collect(provider.name)) AS providerName
        WHERE $companyId IS NULL OR company.id = $companyId
        CALL {
          WITH application
          OPTIONAL MATCH (application)-[:SUPPORTS]->(capability:BusinessCapability)
          RETURN count(DISTINCT capability) AS supportedCapabilities
        }
        CALL {
          WITH application
          OPTIONAL MATCH (application)-[:USES]->(dataObject:DataObject)
          RETURN count(DISTINCT dataObject) AS usedDataObjects
        }
        CALL {
          WITH application
          OPTIONAL MATCH (application)<-[:USED_BY]-(aiComponent:AIComponent)
          RETURN count(DISTINCT aiComponent) AS aiComponents
        }
        CALL {
          WITH application
          OPTIONAL MATCH (application)-[:INTERFACE_SOURCE|INTERFACE_TARGET]->(appInterface:ApplicationInterface)
          RETURN count(DISTINCT appInterface) AS interfaces
        }
        RETURN
          application.id AS id,
          company.id AS companyId,
          application.name AS name,
          toString(application.status) AS status,
          toString(application.criticality) AS criticality,
          coalesce(providerName, application.vendor, '') AS vendor,
          coalesce(toString(application.timeCategory), 'UNKNOWN') AS timeCategory,
          coalesce(application.hostingEnvironment, '') AS hostingEnvironment,
          coalesce(application.costs, 0.0) AS monthlyCost,
          supportedCapabilities AS supportedCapabilities,
          usedDataObjects AS usedDataObjects,
          aiComponents AS aiComponents,
          interfaces AS interfaces,
          toString(coalesce(application.updatedAt, application.createdAt, datetime())) AS updatedAt
        ORDER BY company.id, application.name
      `,
      { companyId }
    )

    return result.records.map(record => {
      const updatedAt = String(record.get('updatedAt'))

      return {
        id: String(record.get('id')),
        company_id: String(record.get('companyId')),
        name: String(record.get('name')),
        status: String(record.get('status')),
        criticality: String(record.get('criticality')),
        vendor: String(record.get('vendor')),
        time_category: String(record.get('timeCategory')),
        hosting_environment: String(record.get('hostingEnvironment')),
        monthly_cost: toNumber(record.get('monthlyCost')),
        supported_capabilities: toNumber(record.get('supportedCapabilities')),
        used_data_objects: toNumber(record.get('usedDataObjects')),
        ai_components: toNumber(record.get('aiComponents')),
        interfaces: toNumber(record.get('interfaces')),
        updated_at: formatClickHouseDateTime(updatedAt),
        updated_month: normalizeUpdatedMonth(updatedAt),
      }
    })
  } finally {
    await session.close()
  }
}

async function loadBusinessCapabilityProjectionRows(
  companyId: string | null
): Promise<BusinessCapabilityProjectionRow[]> {
  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (capability:BusinessCapability)-[:OWNED_BY]->(company:Company)
        WHERE $companyId IS NULL OR company.id = $companyId
        CALL {
          WITH capability
          OPTIONAL MATCH (application:Application)-[:SUPPORTS]->(capability)
          RETURN count(DISTINCT application) AS supportedApplications
        }
        CALL {
          WITH capability
          OPTIONAL MATCH (aiComponent:AIComponent)-[:SUPPORTS]->(capability)
          RETURN count(DISTINCT aiComponent) AS supportingAiComponents
        }
        CALL {
          WITH capability
          OPTIONAL MATCH (capability)-[:RELATED_TO]->(dataObject:DataObject)
          RETURN count(DISTINCT dataObject) AS relatedDataObjects
        }
        RETURN
          capability.id AS id,
          company.id AS companyId,
          capability.name AS name,
          toString(capability.status) AS status,
          coalesce(toString(capability.type), 'UNKNOWN') AS capabilityType,
          coalesce(capability.maturityLevel, 0) AS maturityLevel,
          coalesce(capability.businessValue, 0) AS businessValue,
          supportedApplications AS supportedApplications,
          supportingAiComponents AS supportingAiComponents,
          relatedDataObjects AS relatedDataObjects,
          toString(coalesce(capability.updatedAt, capability.createdAt, datetime())) AS updatedAt
        ORDER BY company.id, capability.name
      `,
      { companyId }
    )

    return result.records.map(record => ({
      id: String(record.get('id')),
      company_id: String(record.get('companyId')),
      name: String(record.get('name')),
      status: String(record.get('status')),
      capability_type: String(record.get('capabilityType')),
      maturity_level: toNumber(record.get('maturityLevel')),
      business_value: toNumber(record.get('businessValue')),
      supported_applications: toNumber(record.get('supportedApplications')),
      supporting_ai_components: toNumber(record.get('supportingAiComponents')),
      related_data_objects: toNumber(record.get('relatedDataObjects')),
      updated_at: formatClickHouseDateTime(String(record.get('updatedAt'))),
      updated_month: normalizeUpdatedMonth(String(record.get('updatedAt'))),
    }))
  } finally {
    await session.close()
  }
}

async function loadAiComponentProjectionRows(
  companyId: string | null
): Promise<AiComponentProjectionRow[]> {
  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (aiComponent:AIComponent)-[:OWNED_BY]->(company:Company)
        OPTIONAL MATCH (aiComponent)-[:PROVIDED_BY]->(providerSupplier:Supplier)
        WITH aiComponent, company, head(collect(providerSupplier.name)) AS providerSupplierName
        WHERE $companyId IS NULL OR company.id = $companyId
        CALL {
          WITH aiComponent
          OPTIONAL MATCH (aiComponent)-[:SUPPORTS]->(capability:BusinessCapability)
          RETURN count(DISTINCT capability) AS supportedCapabilities
        }
        CALL {
          WITH aiComponent
          OPTIONAL MATCH (aiComponent)-[:TRAINED_WITH]->(dataObject:DataObject)
          RETURN count(DISTINCT dataObject) AS trainingDataObjects
        }
        RETURN
          aiComponent.id AS id,
          company.id AS companyId,
          aiComponent.name AS name,
          toString(aiComponent.status) AS status,
          toString(aiComponent.aiType) AS aiType,
          coalesce(aiComponent.provider, providerSupplierName, '') AS provider,
          coalesce(aiComponent.license, '') AS license,
          coalesce(aiComponent.costs, 0.0) AS monthlyCost,
          coalesce(aiComponent.accuracy, 0.0) AS accuracy,
          supportedCapabilities AS supportedCapabilities,
          trainingDataObjects AS trainingDataObjects,
          toString(coalesce(aiComponent.updatedAt, aiComponent.createdAt, datetime())) AS updatedAt
        ORDER BY company.id, aiComponent.name
      `,
      { companyId }
    )

    return result.records.map(record => {
      const updatedAt = String(record.get('updatedAt'))

      return {
        id: String(record.get('id')),
        company_id: String(record.get('companyId')),
        name: String(record.get('name')),
        status: String(record.get('status')),
        ai_type: String(record.get('aiType')),
        provider: String(record.get('provider')),
        license: String(record.get('license')),
        monthly_cost: toNumber(record.get('monthlyCost')),
        accuracy: toNumber(record.get('accuracy')),
        supported_capabilities: toNumber(record.get('supportedCapabilities')),
        training_data_objects: toNumber(record.get('trainingDataObjects')),
        updated_at: formatClickHouseDateTime(updatedAt),
        updated_month: normalizeUpdatedMonth(updatedAt),
      }
    })
  } finally {
    await session.close()
  }
}

async function loadDataObjectProjectionRows(
  companyId: string | null
): Promise<DataObjectProjectionRow[]> {
  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (dataObject:DataObject)-[:OWNED_BY]->(company:Company)
        WHERE $companyId IS NULL OR company.id = $companyId
        CALL {
          WITH dataObject
          OPTIONAL MATCH (application:Application)-[:USES]->(dataObject)
          RETURN count(DISTINCT application) AS usingApplications
        }
        CALL {
          WITH dataObject
          OPTIONAL MATCH (appInterface:ApplicationInterface)-[:TRANSFERS]->(dataObject)
          RETURN count(DISTINCT appInterface) AS transferringInterfaces
        }
        CALL {
          WITH dataObject
          OPTIONAL MATCH (aiComponent:AIComponent)-[:TRAINED_WITH]->(dataObject)
          RETURN count(DISTINCT aiComponent) AS trainingAiComponents
        }
        RETURN
          dataObject.id AS id,
          company.id AS companyId,
          dataObject.name AS name,
          toString(dataObject.classification) AS classification,
          coalesce(dataObject.format, '') AS format,
          usingApplications AS usingApplications,
          transferringInterfaces AS transferringInterfaces,
          trainingAiComponents AS trainingAiComponents,
          toString(coalesce(dataObject.updatedAt, dataObject.createdAt, datetime())) AS updatedAt
        ORDER BY company.id, dataObject.name
      `,
      { companyId }
    )

    return result.records.map(record => {
      const updatedAt = String(record.get('updatedAt'))

      return {
        id: String(record.get('id')),
        company_id: String(record.get('companyId')),
        name: String(record.get('name')),
        classification: String(record.get('classification')),
        format: String(record.get('format')),
        using_applications: toNumber(record.get('usingApplications')),
        transferring_interfaces: toNumber(record.get('transferringInterfaces')),
        training_ai_components: toNumber(record.get('trainingAiComponents')),
        updated_at: formatClickHouseDateTime(updatedAt),
        updated_month: normalizeUpdatedMonth(updatedAt),
      }
    })
  } finally {
    await session.close()
  }
}

async function loadApplicationInterfaceProjectionRows(
  companyId: string | null
): Promise<ApplicationInterfaceProjectionRow[]> {
  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (appInterface:ApplicationInterface)-[:OWNED_BY]->(company:Company)
        WHERE $companyId IS NULL OR company.id = $companyId
        CALL {
          WITH appInterface
          OPTIONAL MATCH (appInterface)<-[:INTERFACE_SOURCE]-(application:Application)
          RETURN count(DISTINCT application) AS sourceApplications
        }
        CALL {
          WITH appInterface
          OPTIONAL MATCH (appInterface)<-[:INTERFACE_TARGET]-(application:Application)
          RETURN count(DISTINCT application) AS targetApplications
        }
        CALL {
          WITH appInterface
          OPTIONAL MATCH (appInterface)-[:TRANSFERS]->(dataObject:DataObject)
          RETURN count(DISTINCT dataObject) AS transferredDataObjects
        }
        RETURN
          appInterface.id AS id,
          company.id AS companyId,
          appInterface.name AS name,
          toString(appInterface.status) AS status,
          toString(appInterface.interfaceType) AS interfaceType,
          coalesce(toString(appInterface.protocol), 'UNKNOWN') AS protocol,
          sourceApplications AS sourceApplications,
          targetApplications AS targetApplications,
          transferredDataObjects AS transferredDataObjects,
          toString(coalesce(appInterface.updatedAt, appInterface.createdAt, datetime())) AS updatedAt
        ORDER BY company.id, appInterface.name
      `,
      { companyId }
    )

    return result.records.map(record => {
      const updatedAt = String(record.get('updatedAt'))

      return {
        id: String(record.get('id')),
        company_id: String(record.get('companyId')),
        name: String(record.get('name')),
        status: String(record.get('status')),
        interface_type: String(record.get('interfaceType')),
        protocol: String(record.get('protocol')),
        source_applications: toNumber(record.get('sourceApplications')),
        target_applications: toNumber(record.get('targetApplications')),
        transferred_data_objects: toNumber(record.get('transferredDataObjects')),
        updated_at: formatClickHouseDateTime(updatedAt),
        updated_month: normalizeUpdatedMonth(updatedAt),
      }
    })
  } finally {
    await session.close()
  }
}

async function loadInfrastructureProjectionRows(
  companyId: string | null
): Promise<InfrastructureProjectionRow[]> {
  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (infrastructure:Infrastructure)-[:OWNED_BY]->(company:Company)
        WHERE $companyId IS NULL OR company.id = $companyId
        CALL {
          WITH infrastructure
          OPTIONAL MATCH (application:Application)-[:HOSTED_ON]->(infrastructure)
          RETURN count(DISTINCT application) AS hostedApplications
        }
        CALL {
          WITH infrastructure
          OPTIONAL MATCH (aiComponent:AIComponent)-[:HOSTED_ON]->(infrastructure)
          RETURN count(DISTINCT aiComponent) AS hostedAiComponents
        }
        RETURN
          infrastructure.id AS id,
          company.id AS companyId,
          infrastructure.name AS name,
          toString(infrastructure.status) AS status,
          toString(infrastructure.infrastructureType) AS infrastructureType,
          coalesce(infrastructure.vendor, '') AS vendor,
          coalesce(infrastructure.location, '') AS location,
          coalesce(infrastructure.operatingSystem, '') AS operatingSystem,
          coalesce(infrastructure.costs, 0.0) AS monthlyCost,
          hostedApplications AS hostedApplications,
          hostedAiComponents AS hostedAiComponents,
          toString(coalesce(infrastructure.updatedAt, infrastructure.createdAt, datetime())) AS updatedAt
        ORDER BY company.id, infrastructure.name
      `,
      { companyId }
    )

    return result.records.map(record => {
      const updatedAt = String(record.get('updatedAt'))

      return {
        id: String(record.get('id')),
        company_id: String(record.get('companyId')),
        name: String(record.get('name')),
        status: String(record.get('status')),
        infrastructure_type: String(record.get('infrastructureType')),
        vendor: String(record.get('vendor')),
        location: String(record.get('location')),
        operating_system: String(record.get('operatingSystem')),
        monthly_cost: toNumber(record.get('monthlyCost')),
        hosted_applications: toNumber(record.get('hostedApplications')),
        hosted_ai_components: toNumber(record.get('hostedAiComponents')),
        updated_at: formatClickHouseDateTime(updatedAt),
        updated_month: normalizeUpdatedMonth(updatedAt),
      }
    })
  } finally {
    await session.close()
  }
}

export async function syncAnalyticsProjections(companyId: string | null) {
  const [
    businessCapabilityRows,
    applicationRows,
    aiComponentRows,
    dataObjectRows,
    applicationInterfaceRows,
    infrastructureRows,
  ] = await Promise.all([
    loadBusinessCapabilityProjectionRows(companyId),
    loadApplicationProjectionRows(companyId),
    loadAiComponentProjectionRows(companyId),
    loadDataObjectProjectionRows(companyId),
    loadApplicationInterfaceProjectionRows(companyId),
    loadInfrastructureProjectionRows(companyId),
  ])

  await replaceProjectionRows('business_capability_projection', businessCapabilityRows, companyId)
  await replaceProjectionRows('application_analytics_projection', applicationRows, companyId)
  await replaceProjectionRows('ai_component_projection', aiComponentRows, companyId)
  await replaceProjectionRows('data_object_projection', dataObjectRows, companyId)
  await replaceProjectionRows(
    'application_interface_projection',
    applicationInterfaceRows,
    companyId
  )
  await replaceProjectionRows('infrastructure_projection', infrastructureRows, companyId)

  return {
    companyId,
    syncedAt: new Date().toISOString(),
    applications: applicationRows.length,
    capabilities: businessCapabilityRows.length,
    aiComponents: aiComponentRows.length,
    dataObjects: dataObjectRows.length,
    interfaces: applicationInterfaceRows.length,
    infrastructure: infrastructureRows.length,
  }
}
