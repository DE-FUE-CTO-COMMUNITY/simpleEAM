CREATE DATABASE IF NOT EXISTS nextgen_analytics;

CREATE TABLE IF NOT EXISTS nextgen_analytics.application_projection (
  id String,
  company_id String,
  name String,
  status LowCardinality(String),
  criticality LowCardinality(String),
  vendor String,
  monthly_cost Float64,
  updated_at DateTime,
  updated_month Date
) ENGINE = MergeTree
ORDER BY (company_id, status, criticality, id);

CREATE TABLE IF NOT EXISTS nextgen_analytics.capability_coverage_projection (
  capability_id String,
  company_id String,
  capability_name String,
  maturity LowCardinality(String),
  supported_applications UInt32,
  updated_at DateTime
) ENGINE = MergeTree
ORDER BY (company_id, capability_id);

CREATE TABLE IF NOT EXISTS nextgen_analytics.business_capability_projection (
  id String,
  company_id String,
  name String,
  status LowCardinality(String),
  capability_type LowCardinality(String),
  maturity_level Float64,
  business_value Float64,
  supported_applications UInt32,
  supporting_ai_components UInt32,
  related_data_objects UInt32,
  updated_at DateTime,
  updated_month Date
) ENGINE = MergeTree
ORDER BY (company_id, status, capability_type, id);

CREATE TABLE IF NOT EXISTS nextgen_analytics.application_analytics_projection (
  id String,
  company_id String,
  name String,
  status LowCardinality(String),
  criticality LowCardinality(String),
  vendor String,
  time_category LowCardinality(String),
  hosting_environment String,
  monthly_cost Float64,
  supported_capabilities UInt32,
  used_data_objects UInt32,
  ai_components UInt32,
  interfaces UInt32,
  updated_at DateTime,
  updated_month Date
) ENGINE = MergeTree
ORDER BY (company_id, status, criticality, id);

CREATE TABLE IF NOT EXISTS nextgen_analytics.ai_component_projection (
  id String,
  company_id String,
  name String,
  status LowCardinality(String),
  ai_type LowCardinality(String),
  provider String,
  license String,
  monthly_cost Float64,
  accuracy Float64,
  supported_capabilities UInt32,
  training_data_objects UInt32,
  updated_at DateTime,
  updated_month Date
) ENGINE = MergeTree
ORDER BY (company_id, status, ai_type, id);

CREATE TABLE IF NOT EXISTS nextgen_analytics.data_object_projection (
  id String,
  company_id String,
  name String,
  classification LowCardinality(String),
  format String,
  using_applications UInt32,
  transferring_interfaces UInt32,
  training_ai_components UInt32,
  updated_at DateTime,
  updated_month Date
) ENGINE = MergeTree
ORDER BY (company_id, classification, id);

CREATE TABLE IF NOT EXISTS nextgen_analytics.application_interface_projection (
  id String,
  company_id String,
  name String,
  status LowCardinality(String),
  interface_type LowCardinality(String),
  protocol LowCardinality(String),
  source_applications UInt32,
  target_applications UInt32,
  transferred_data_objects UInt32,
  updated_at DateTime,
  updated_month Date
) ENGINE = MergeTree
ORDER BY (company_id, status, interface_type, id);

CREATE TABLE IF NOT EXISTS nextgen_analytics.infrastructure_projection (
  id String,
  company_id String,
  name String,
  status LowCardinality(String),
  infrastructure_type LowCardinality(String),
  vendor String,
  location String,
  operating_system LowCardinality(String),
  monthly_cost Float64,
  hosted_applications UInt32,
  hosted_ai_components UInt32,
  updated_at DateTime,
  updated_month Date
) ENGINE = MergeTree
ORDER BY (company_id, status, infrastructure_type, id);
