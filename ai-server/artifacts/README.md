# AI Server Artifacts

This directory contains deterministic, versioned artifacts for the target `ai-server` contract surface.

These artifacts are now loaded and validated deterministically. Query-library validation is offline, uses no network calls, and checks the GraphQL query library against `SCHEMA_DIGEST` before server startup.

## Files

- `intent-schema.v1.0.0.json`
  - Machine-readable list of allowed intents.
  - Hard rule: only the approved initial intent set is allowed.

- `concept-dictionary.v1.0.0.json`
  - Canonical graph-backed concept types.
  - Synonyms are localized under `de`, `en`, and `fr` only.
  - Canonical keys and `graphLabel` values must match the GraphQL schema node type names exactly.

- `query-library-metadata.v1.0.0.yaml`
  - Metadata only.
  - Describes query IDs, supported root queries, entity coverage, allowed intents, and required company scoping rules.
  - Does not store executable query text.
  - The current file uses a strict YAML subset that the local loader supports.

- `query-library.json`
  - Canonical GraphQL query-library artifact.
  - Maps each `queryId` to a template file, root field, allowed intents, entity types, and parameter definitions.
  - Templates are plain `.graphql` files with inline values only and no GraphQL `$variables`.

- `graphql/`
  - Inline GraphQL query templates referenced by `query-library.json`.

- `validation/`
  - Deterministic offline validators for the query library.
  - Includes SCHEMA_DIGEST indexing, template parsing, and query-library validation/reporting.

- `schema-digest.v1.0.0.ts`
  - Read-only governance contract for GraphQL access.
  - Describes allowed root queries, fields, relations, filter syntax, and mandatory company scoping rules.
  - Must not be used to dynamically generate GraphQL queries.
  - Allowed uses are limited to validation, capability awareness, and policy constraints.

- `types.ts`
  - Shared TypeScript contracts for all artifact payloads.

- `validate.ts`
  - Hard validations for individual artifacts and cross-artifact consistency.
  - Throws immediately on invalid shapes, extra intents, unknown root queries, missing scope rules, or concept drift.

- `loader.ts`
  - Loads JSON, YAML, and TS artifacts from disk.
  - Validates each artifact on load.
  - Fails fast on parse or validation errors.

## Query-Library Validation

Validation entrypoint:

- `yarn validate-query-library`

Validation checks:

- unique `queryId` values
- root fields declared by `SCHEMA_DIGEST`
- template root field matches metadata
- top-level selected fields and relations are allowed by the digest
- required `companyId` param exists and is used in the mandatory company-scope pattern
- no GraphQL `$variables`
- template placeholders match declared params
- unused params are reported as warnings
- inline enum literals are checked against digest enum values with a deterministic best-effort scan

## Format Rules

### Intent Schema

Required shape:

```json
{
  "artifact": "intent-schema",
  "version": "1.0.0",
  "intents": {
    "FACT_LOOKUP": {
      "description": "Direct query of structured facts",
      "requiresTraversal": false
    }
  }
}
```

Constraints:

- `artifact` must equal `intent-schema`
- `version` must be semantic-version-like `x.y.z`
- keys under `intents` must match the allowed intent set exactly
- no extra intents are permitted

### Concept Dictionary

Required shape:

```json
{
  "artifact": "concept-dictionary",
  "version": "1.0.0",
  "concepts": {
    "BusinessCapability": {
      "description": "...",
      "graphLabel": "BusinessCapability",
      "synonyms": {
        "de": ["..."],
        "en": ["..."],
        "fr": ["..."]
      }
    }
  }
}
```

Constraints:

- concept keys must match the canonical schema-backed entity set exactly
- `graphLabel` must equal the concept key
- locales must be exactly `de`, `en`, and `fr`
- every locale array must be non-empty and duplicate-free

### Query Library Metadata

Required shape:

```yaml
artifact: query-library-metadata
version: 1.0.0
selectionMode: query-id-only
dynamicQueryGenerationAllowed: false
queries:
  - queryId: listApplications
    kind: list
    description: List applications through the predefined GraphQL tool.
    rootQueries: [applications]
    entityTypes: [Application]
    allowedIntents: [FACT_LOOKUP]
    parameterMode: structured-args
    companyScopeRuleIds: [company-scope-company]
    sourceModules: [agents/data-lookup/tools.ts]
```

Constraints:

- metadata only; no executable query text
- `selectionMode` must be `query-id-only`
- `dynamicQueryGenerationAllowed` must be `false`
- query IDs must be unique
- count families must use `parameterMode: enumerated-config`
- all referenced root queries and scope rules must exist in `schema-digest`

### SCHEMA_DIGEST

Required shape:

```ts
const schemaDigestArtifact = {
  artifact: 'schema-digest',
  version: '1.0.0',
  governance: {
    readOnly: true,
    dynamicQueryGenerationAllowed: false,
    permittedUses: {
      validation: true,
      capabilityAwareness: true,
      policyConstraints: true,
    },
  },
}

export default schemaDigestArtifact
```

Constraints:

- the TS artifact must be self-contained
- it must export a single artifact payload
- `readOnly` must be `true`
- `dynamicQueryGenerationAllowed` must be `false`
- it must describe:
  - allowed collection root queries
  - allowed count queries
  - allowed fields and relations per collection root
  - filter syntax surface
  - mandatory company scoping rules

## Loader Behavior

`loadArtifacts()` resolves the five artifact files in this directory and validates them immediately.

Validation order:

1. Parse file by extension
2. Validate artifact-specific shape
3. Cross-check references across artifacts
4. Throw on the first invalid condition

This is intentionally fail-fast. Silent fallback and partial loading are not allowed.
