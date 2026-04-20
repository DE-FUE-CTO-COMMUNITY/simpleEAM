cube(`DataObjectProjection`, {
  sql_table: `data_object_projection`,

  measures: {
    count: {
      type: `count`,
    },
    usingApplications: {
      sql: `using_applications`,
      type: `sum`,
    },
    transferringInterfaces: {
      sql: `transferring_interfaces`,
      type: `sum`,
    },
    trainingAiComponents: {
      sql: `training_ai_components`,
      type: `sum`,
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
      public: true,
    },
    companyId: {
      sql: `company_id`,
      type: `string`,
    },
    name: {
      sql: `name`,
      type: `string`,
    },
    classification: {
      sql: `classification`,
      type: `string`,
    },
    format: {
      sql: `format`,
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
