cube(`ApplicationInterfaceProjection`, {
  sql_table: `application_interface_projection`,

  measures: {
    count: {
      type: `count`,
    },
    sourceApplications: {
      sql: `source_applications`,
      type: `sum`,
    },
    targetApplications: {
      sql: `target_applications`,
      type: `sum`,
    },
    transferredDataObjects: {
      sql: `transferred_data_objects`,
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
    status: {
      sql: `status`,
      type: `string`,
    },
    interfaceType: {
      sql: `interface_type`,
      type: `string`,
    },
    protocol: {
      sql: `protocol`,
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
