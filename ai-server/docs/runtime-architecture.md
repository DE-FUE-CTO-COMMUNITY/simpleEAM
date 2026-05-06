# Runtime Architecture

## Current Architecture

The active runtime now has two distinct execution classes:

- Governed query workflow for factual and dependency-related questions
- Strategic workflow for enrichment and proposal generation

The governed path is the authoritative runtime for factual requests.
It resolves requests through deterministic policy and governed GraphQL templates:

- intent
- policy enforcement
- query selection
- query-library template rendering
- GraphQL execution
- explanation from query results only

This removes the former runtime dependence on YAML-based agent routing for factual lookups.

## Deprecated Architecture

The previous lookup runtime used:

- `temporal/coordinator/agent-routing-logic.v1.0.0.yaml`
- `agents/data-lookup/activities.ts`
- tool-based selection and execution inside the legacy data-lookup agent

That architecture is now deprecated for factual and dependency-related execution.
The files remain in the repository temporarily, but they are no longer part of the active `/ai-runs`
runtime path for conversational assistant questions.

## Why Routing Is Now Policy-Driven

The governed runtime is easier to review and safer to operate because:

- allowed intents are explicit
- entity resolution is validated against the concept dictionary
- relation access is constrained by the policy matrix
- GraphQL root fields and relations are validated against `SCHEMA_DIGEST`
- only governed query templates can execute
- unsupported requests return clarification instead of silently falling back

## Runtime Paths

### Governed path

Used for factual and dependency-style conversational questions.

- `/ai-runs`
- governed workflow
- `policy/enforce.ts`
- `policy/querySelect.ts`
- `agents/dataLookupAdapter.ts`
- query-library GraphQL templates

### Strategic path

Used for strategic enrichment and document/internet research flows.

- `/ai-runs`
- coordinator workflow
- fixed strategic routing without YAML lookup routing
- document research, internet research, strategy generation

## No More YAML Routing For Factual Queries

Factual lookup execution no longer depends on YAML runtime plans.
For those requests, the runtime is policy-driven and governed end to end.
