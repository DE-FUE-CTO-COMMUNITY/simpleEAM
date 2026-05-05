# Query Selection Policy

## Purpose

`querySelect.ts` is the deterministic selector that chooses exactly one governed generic `QueryId`, or returns clarification.

It does not generate queries. It does not guess entities. It does not infer allowed relations from the LLM.

Its job is limited to:

- resolve one generic query form from the detected planner intent and request shape
- validate the chosen entity type against the Policy Matrix
- validate relation usage against the Policy Matrix and `SCHEMA_DIGEST`
- map the entity type to the governed root field
- return one generic `QueryId` only when the request is fully allowed

## Policy Matrix Driven Selection

The Policy Matrix is the authority for relation permissions:

- `Intent -> EntityType -> Allowed Relations`

`querySelect.ts` uses that matrix to decide whether a relation-based query may be used.

Current fixed generic query mapping:

- `ENTITY_SEARCH` -> `entity.searchByName`
- `ENTITY_DETAILS` -> `entity.detailsById`
- `ENTITY_RELATION_FILTER` -> `entity.relation.someByNameContains`
- `ENTITY_GAP_ANALYSIS` -> `entity.gap.byRelation`
- `COUNT_ENTITIES` -> `entity.countByStatus`

The selector never scans the query library for a "best" match and never falls through to a different entity or query id.

## No Defaults By Design

Defaults and heuristics are intentionally restricted.

`querySelect.ts` must not:

- default to `applications`
- default to `Application`
- silently switch from one generic query form to another
- silently ignore disallowed relation usage for search or count requests
- return a query id that is not explicitly declared in `query-library.json`

If the request is missing a required entity id, relation, or status cue, the selector returns clarification instead of guessing.

## Validation Path

Before a selected query is returned, the selector verifies:

1. the generic query form is supported for the detected planner intent
2. the entity type is covered by the Policy Matrix
3. the relation is allowed by the Policy Matrix when the query form requires one
4. the chosen `QueryId` exists in both `query-library-metadata` and `query-library.json`
5. the resolved root query exists in `SCHEMA_DIGEST`
6. the selected relation exists on that root query in `SCHEMA_DIGEST`

If any of those checks fail, the outcome is clarification, not fallback.

## Parameter Rules

`querySelect.ts` only constructs deterministic structured args.

It may pass through or derive:

- `entityRoot`
- `nameContains`
- `entityId`
- `relatedNameContains`
- `relationField`
- `statusEnum`
- `statusEnumType` when required by the governed count query schema
- `limit`

Arguments are filtered against the declared parameter schema for the selected query before they are returned.

## Safe Extension

To extend behavior safely:

1. update [ai-server/policy/policy-matrix.ts](/home/mf2admin/nextgenEAM/ai-server/policy/policy-matrix.ts)
2. update governed query-library artifacts if a new entity or intent combination must become executable
3. update deterministic relation detection only if the new relation needs explicit text cues
4. re-run `yarn verify-flexible-queries` and `yarn build`

Do not widen behavior by adding fallback branches in `querySelect.ts`.

If it is not allowed by the matrix and declared by the artifacts, it must not be selected.
