cube(`CapabilityCoverageProjection`, {
  sql_table: `capability_coverage_projection`,

  measures: {
    count: {
      type: `count`,
    },
    supportedApplicationsTotal: {
      sql: `supported_applications`,
      type: `sum`,
    },
  },

  dimensions: {
    capabilityId: {
      sql: `capability_id`,
      type: `string`,
      primaryKey: true,
      public: true,
    },
    companyId: {
      sql: `company_id`,
      type: `string`,
    },
    capabilityName: {
      sql: `capability_name`,
      type: `string`,
    },
    maturity: {
      sql: `maturity`,
      type: `string`,
    },
    updatedAt: {
      sql: `updated_at`,
      type: `time`,
    },
  },
})
