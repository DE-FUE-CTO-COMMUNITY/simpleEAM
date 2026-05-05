# Start Policy Matrix

## Why This Exists

The start policy matrix defines the allowed entity-relation combinations for the generic query intents in a deterministic, inspectable form.

It exists to keep the system flexible without allowing freeform query construction:

- the user can ask many business questions
- the runtime still resolves only to governed generic query forms
- the policy layer decides which entity-relation combinations are allowed
- `SCHEMA_DIGEST` remains the authoritative source for valid root collections, relations, and enums

This keeps graph access governed and reviewable while avoiding a large catalog of business-specific query ids.

## How It Supports Flexibility

The matrix maps:

- `Intent -> EntityType -> Allowed Relations`

This means the system can reuse the same generic query forms across multiple entity types while still enforcing a conservative allow-list.

Examples:

- `ENTITY_SEARCH` allows no relations, so searches stay on entity-owned attributes only.
- `ENTITY_DETAILS` allows a small explicit relation subset for each entity type.
- `ENTITY_RELATION_FILTER` allows only selected core dependency relations for `some` filters.
- `ENTITY_GAP_ANALYSIS` allows only selected well-known gap checks for `none` filters.
- `COUNT_ENTITIES` allows no relations.

The matrix is intentionally a start matrix, not a complete one. It should stay conservative until a new combination is clearly justified and verified against `SCHEMA_DIGEST`.

## Safe Extension Rules

When adding a new entity or relation:

1. Confirm the relation name exists exactly as written in `SCHEMA_DIGEST`.
2. Add the entity type to the matrix only if there is a governed generic query form that should support it.
3. Add only low-risk, obvious relations first.
4. Prefer smaller allow-lists over broader ones.
5. Keep empty arrays explicit for intents where no relations are allowed.
6. Re-run policy and artifact validation before wiring runtime behavior to the new matrix.

## Non-Negotiable Rule

If it’s not in the matrix, it is not allowed.

That rule is the core governance boundary. The matrix is the inspectable policy surface that constrains future implementation of relation checks and relation-based filtering.
