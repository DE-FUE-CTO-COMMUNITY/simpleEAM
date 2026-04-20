# Analytics Change Checklist

Use this checklist whenever a GraphQL or Neo4j model change might affect the analytics pipeline.

## What Changes Affect Analytics

Analytics does not update automatically when the GraphQL schema changes.

The analytics pipeline is application-managed:

1. Neo4j data is read in `server/src/analytics/projections.ts`
2. Projection rows are written into ClickHouse tables
3. Cube models expose those tables as analytics dimensions and measures
4. The client uses the server analytics schema to decide what can be queried

If a GraphQL schema change only affects API exposure, analytics may be unaffected.

If the change affects Neo4j properties, relationships, labels, or the meaning of analytics fields, analytics must be reviewed.

## Safe Change Process

1. Check whether analytics reads the changed field or relationship.

   Review `server/src/analytics/projections.ts` first.

2. Update the projection extraction logic.

   Adjust the Cypher queries and row mapping in `server/src/analytics/projections.ts` so the projection still matches the source model.

3. Decide whether the ClickHouse table shape changes.

   If projected columns are added, removed, renamed, or their types change, update `analytics/clickhouse/init/001_projection_tables.sql` and plan a real ClickHouse migration.

4. Update the Cube semantic model.

   Adjust the relevant files under `analytics/cube/model/` so Cube reads the correct table and exposes the correct measures and dimensions.

5. Update the server analytics contract.

   If dimensions or measures changed, update `server/src/analytics/schema.ts`.

6. Update the client if analytics options changed.

   If selectable dimensions, measures, or element types changed, update:
   - `client/src/components/analytics/types.ts`
   - `client/src/components/analytics/AnalyticsWorkspace.tsx`
   - `client/messages/en.json`
   - `client/messages/de.json`
   - `client/messages/fr.json`

7. Review saved report compatibility.

   Saved reports persist dimension and measure keys. If a key is removed or renamed, old reports may stop working. For breaking changes, either migrate existing reports or keep backward-compatible aliases temporarily.

8. Build before syncing.

   ```bash
   cd server && yarn build
   cd client && yarn build
   ```

9. Apply ClickHouse schema changes before syncing.

   `CREATE TABLE IF NOT EXISTS` only creates missing tables. It does not alter existing tables. For column changes, use `ALTER TABLE` or rebuild the table.

10. Re-sync projections.

    After deploying the code and schema updates, run projection sync again so ClickHouse is repopulated from Neo4j.

11. Validate real analytics queries.

    Test at least one preview query and one saved report for each affected element type.

## Practical Rules

- If only API exposure changed, analytics usually does not need changes.
- If the underlying Neo4j model changed, analytics usually does need changes.
- If projection columns changed, ClickHouse migration is required.
- If dimension or measure keys changed, saved report compatibility must be checked.

## Current Key Files

- `server/src/analytics/projections.ts`
- `server/src/analytics/schema.ts`
- `server/src/analytics/routes.ts`
- `server/src/analytics/clickhouse.ts`
- `analytics/clickhouse/init/001_projection_tables.sql`
- `analytics/cube/model/ApplicationProjection.js`
- `analytics/cube/model/BusinessCapabilityProjection.js`
- `analytics/cube/model/AiComponentProjection.js`
- `analytics/cube/model/DataObjectProjection.js`
- `analytics/cube/model/ApplicationInterfaceProjection.js`
- `analytics/cube/model/InfrastructureProjection.js`
