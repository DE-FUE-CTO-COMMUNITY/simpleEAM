cube(`ApplicationProjection`, {
  sql_table: `nextgen_analytics.application_analytics_projection`,

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
    supportedCapabilities: {
      sql: `supported_capabilities`,
      type: `sum`,
    },
    usedDataObjects: {
      sql: `used_data_objects`,
      type: `sum`,
    },
    aiComponents: {
      sql: `ai_components`,
      type: `sum`,
    },
    interfaces: {
      sql: `interfaces`,
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
    criticality: {
      sql: `criticality`,
      type: `string`,
    },
    vendor: {
      sql: `vendor`,
      type: `string`,
    },
    timeCategory: {
      sql: `time_category`,
      type: `string`,
    },
    hostingEnvironment: {
      sql: `hosting_environment`,
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
