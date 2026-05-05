# GraphQL Query Library

The governed query library lives in [ai-server/artifacts/query-library.json](ai-server/artifacts/query-library.json). Inline GraphQL templates live under [ai-server/artifacts/graphql](ai-server/artifacts/graphql).

This library is intentionally small. It does not create one `queryId` per business question. Instead, it exposes a stable set of generic query forms that the policy layer parameterizes deterministically from the user request and `SCHEMA_DIGEST`.

## Hard Rules

- GraphQL only. No Cypher, no dynamic query generation, no tool-side query synthesis.
- `SCHEMA_DIGEST` is the safety contract for root collections, relations, enum values, and company scoping.
- Every template is inline-only. GraphQL `$variables` are forbidden.
- Every rendered query must include mandatory company scoping through the declared scope rule.
- Root collections and relation fields are selected by deterministic policy only, never by the LLM.

## Stable Query Forms

The current governed `queryId` set is:

- `entity.searchByName`
- `entity.detailsById`
- `entity.gap.byRelation`
- `entity.relation.someByNameContains`
- `entity.countByStatus`

Each entry in [ai-server/artifacts/query-library.json](ai-server/artifacts/query-library.json) defines:

- `queryId`
- `intents`: stable generic query forms such as `ENTITY_SEARCH` or `COUNT_ENTITIES`
- `rootField`: a concrete root query or a governed placeholder pattern such as `{{entityRoot}}`
- `entityTypes`: the supported canonical concept types
- `companyScopeRuleId`: the mandatory scope rule from `SCHEMA_DIGEST`
- `templateFile`: the inline GraphQL template
- `params`: placeholder definitions and runtime validation rules

## Placeholder Types

The renderer supports a small, explicit set of placeholder kinds:

- `id` and `string`: rendered as escaped GraphQL string literals
- `int`: rendered as a positive integer literal
- `enum`: validated against a static enum type or a governed `enumTypeParam`
- `identifier`: rendered as a bare GraphQL identifier for governed root or relation names
- `whereClause` and `selectionSet`: deterministic raw fragments produced only by policy code

These raw fragment placeholders exist so the policy layer can compose safe generic forms like relation filters or optional detail relations without introducing freeform query generation.

## Extending The Library

To support a new entity type or relation, do not add a brand-new business-specific query id first. Extend the governed capability map and only widen the library if the existing generic forms cannot express the request.

Recommended order:

1. Add or confirm the root collection, relations, and enum values in `SCHEMA_DIGEST`.
2. Update [ai-server/policy/capabilities.ts](ai-server/policy/capabilities.ts) with the new root mapping, relation allow-list, and optional status or detail selections.
3. Reuse an existing generic template whenever possible.
4. Only add a new `queryId` if the query shape itself is genuinely new.
5. Run `cd ai-server && yarn validate-query-library`.
6. Run `cd ai-server && yarn verify-flexible-queries`.

## Verification

Two checks matter after changes:

- `yarn validate-query-library`: offline validation of templates, placeholders, root-field governance, relation allow-lists, enum references, and company scoping.
- `yarn verify-flexible-queries`: deterministic prompt-to-query verification for the current generic forms.
