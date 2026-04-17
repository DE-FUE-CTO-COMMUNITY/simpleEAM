cube(`BusinessCapabilityProjection`, {
  sql_table: `nextgen_analytics.business_capability_projection`,

  measures: {
    count: {
      type: `count`,
    },
    averageMaturityLevel: {
      sql: `maturity_level`,
      type: `avg`,
    },
    totalBusinessValue: {
      sql: `business_value`,
      type: `sum`,
    },
    averageBusinessValue: {
      sql: `business_value`,
      type: `avg`,
    },
    supportedApplications: {
      sql: `supported_applications`,
      type: `sum`,
    },
    supportingAiComponents: {
      sql: `supporting_ai_components`,
      type: `sum`,
    },
    relatedDataObjects: {
      sql: `related_data_objects`,
      type: `sum`,
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
    },
    companyId: {
      sql: `company_id`,
      type: `string`,
    },
    name: {
      sql: `name`,
      type: `string`,
    },
    status: {
      sql: `status`,
      type: `string`,
    },
    capabilityType: {
      sql: `capability_type`,
      type: `string`,
    },
    updatedAt: {
      sql: `updated_at`,
      type: `time`,
    },
    updatedMonth: {
      sql: `updated_month`,
      type: `time`,
    },
  },
})
