cube(`AiComponentProjection`, {
  sql_table: `nextgen_analytics.ai_component_projection`,

  measures: {
    count: {
      type: `count`,
    },
    totalCost: {
      sql: `monthly_cost`,
      type: `sum`,
      format: `currency`,
    },
    averageCost: {
      sql: `monthly_cost`,
      type: `avg`,
      format: `currency`,
    },
    averageAccuracy: {
      sql: `accuracy`,
      type: `avg`,
    },
    supportedCapabilities: {
      sql: `supported_capabilities`,
      type: `sum`,
    },
    trainingDataObjects: {
      sql: `training_data_objects`,
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
    aiType: {
      sql: `ai_type`,
      type: `string`,
    },
    provider: {
      sql: `provider`,
      type: `string`,
    },
    license: {
      sql: `license`,
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
