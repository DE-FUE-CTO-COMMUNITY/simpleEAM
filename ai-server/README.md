## Architecture Rule

The directory `ai-server/agents` contains all domain-level agent adapters.

The directory `ai-server/src/agents` MUST NOT exist.
Infrastructure-related helpers belong to `ai-server/src/runtime` or `ai-server/src/shared`.

Any new agent-related code must be placed under `ai-server/agents`.
