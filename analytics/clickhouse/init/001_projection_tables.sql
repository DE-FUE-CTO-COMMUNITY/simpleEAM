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
