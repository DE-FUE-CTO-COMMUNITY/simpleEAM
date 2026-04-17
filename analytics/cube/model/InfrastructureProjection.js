cube(`InfrastructureProjection`, {
  sql_table: `nextgen_analytics.infrastructure_projection`,

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
    hostedApplications: {
      sql: `hosted_applications`,
      type: `sum`,
    },
    hostedAiComponents: {
      sql: `hosted_ai_components`,
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
    infrastructureType: {
      sql: `infrastructure_type`,
      type: `string`,
    },
    vendor: {
      sql: `vendor`,
      type: `string`,
    },
    location: {
      sql: `location`,
      type: `string`,
    },
    operatingSystem: {
      sql: `operating_system`,
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
