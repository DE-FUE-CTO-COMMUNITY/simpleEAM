# GraphQL Query Library

The initial GraphQL Query Library lives in [ai-server/artifacts/query-library.json](ai-server/artifacts/query-library.json) and its inline templates live under [ai-server/artifacts/graphql](ai-server/artifacts/graphql).

Rules for this library:

- Every query must map to a stable `queryId`.
- Every template must stay GraphQL-only and read-only.
- Do not use GraphQL `$variables`; all values are rendered inline.
- Do not generate or store Cypher here.
- Every template must include `__COMPANY_SCOPE__` so the renderer can enforce tenant scoping from `SCHEMA_DIGEST`.
- Every enum parameter must declare `enumType`, and the value must exist in `schema-digest.v1.0.0.ts`.

## Add A New QueryId

1. Confirm the target root field, relation filters, and company scope rule already exist in `SCHEMA_DIGEST`.
2. If the query needs enum filters, add the enum values to `schema-digest.v1.0.0.ts` first.
3. Create a new `.graphql` template under `ai-server/artifacts/graphql/`.
4. Use inline placeholders such as `__SEARCH_TEXT__`, `__LIMIT__`, and always include `__COMPANY_SCOPE__`.
5. Add a new entry to `ai-server/artifacts/query-library.json` with `queryId`, `intents`, `rootField`, `entityType`, `companyScopeRuleId`, `templateFile`, and `params`.
6. Keep placeholders deterministic: strings must be quoted in the template, enums must not be quoted, and integers must render as bare numbers.
7. Run `cd ai-server && yarn build` after the change.

## Renderer

Use `renderGraphqlQuery(...)` from [ai-server/artifacts/graphql/render.ts](ai-server/artifacts/graphql/render.ts) to render inline GraphQL safely.

It guarantees:

- escaped inline GraphQL strings
- enum validation against `SCHEMA_DIGEST`
- enforced company scoping from the declared scope rule
- rejection of any template that tries to use GraphQL variables
