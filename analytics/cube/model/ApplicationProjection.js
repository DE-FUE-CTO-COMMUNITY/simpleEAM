cube(`ApplicationProjection`, {
  sql_table: `nextgen_analytics.application_projection`,

  measures: {
    count: {
      type: `count`,
    },
    totalMonthlyCost: {
      sql: `monthly_cost`,
      type: `sum`,
      format: `currency`,
    },
    averageMonthlyCost: {
      sql: `monthly_cost`,
      type: `avg`,
      format: `currency`,
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
