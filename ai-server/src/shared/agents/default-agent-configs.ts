export interface AgentConfigDefault {
  readonly agentKey: string
  readonly displayName: string
  readonly description: string
  readonly systemPrompt: string
  readonly temperature?: number
  readonly topP?: number
  readonly maxTokens?: number
  readonly isEnabled?: boolean
  readonly configVersion?: number
  readonly metadataJson?: string
}

export const AGENT_CONFIG_DEFAULTS: readonly AgentConfigDefault[] = [
  {
    agentKey: 'internet-research',
    displayName: 'Internet Research Agent',
    description:
      'Searches web sources and synthesizes findings tailored to enterprise architecture questions.',
    systemPrompt: 'You are a professional research analyst. Return plain text summaries, not JSON.',
    temperature: 0.2,
    topP: 0.9,
    isEnabled: true,
    configVersion: 1,
  },
  {
    agentKey: 'document-research',
    displayName: 'Document Research Agent',
    description:
      'Analyzes provided documents and extracts relevant findings for enterprise architecture tasks.',
    systemPrompt: 'You are a document research analyst. Return plain text summaries, not JSON.',
    temperature: 0.2,
    topP: 0.9,
    isEnabled: true,
    configVersion: 1,
  },
  {
    agentKey: 'data-lookup',
    displayName: 'Architecture Data Lookup Agent',
    description:
      'Queries live enterprise architecture data through GraphQL and explains results in plain text.',
    systemPrompt:
      'You are an enterprise architecture assistant. Use tools precisely and return output in the requested format.',
    temperature: 0.2,
    topP: 0.9,
    isEnabled: true,
    configVersion: 1,
  },
  {
    agentKey: 'quality-control',
    displayName: 'Quality Control Agent',
    description:
      'Validates whether combined agent outputs sufficiently address the original user request.',
    systemPrompt: 'You are a quality control reviewer. Return only JSON.',
    temperature: 0.1,
    topP: 0.9,
    isEnabled: true,
    configVersion: 1,
  },
  {
    agentKey: 'strategy-generator',
    displayName: 'Strategy Generator Agent',
    description:
      'Generates strategic drafts including mission, vision, values, goals, strategies, and business model canvas.',
    systemPrompt: 'You generate enterprise strategic drafts. Return only JSON.',
    temperature: 0.2,
    topP: 0.9,
    isEnabled: true,
    configVersion: 1,
  },
  {
    agentKey: 'coordinator-planner',
    displayName: 'Coordinator Planner Agent',
    description:
      'Creates execution plans by selecting and sequencing specialized agents for user requests.',
    systemPrompt: 'You are an enterprise AI coordinator. Return only JSON plans.',
    temperature: 0.1,
    topP: 0.9,
    isEnabled: true,
    configVersion: 1,
  },
  {
    agentKey: 'coordinator-aggregator',
    displayName: 'Coordinator Aggregation Agent',
    description: 'Synthesizes outputs from multiple agents into a concise executive summary.',
    systemPrompt: 'You are an enterprise analyst. Return plain text summaries.',
    temperature: 0.2,
    topP: 0.9,
    isEnabled: true,
    configVersion: 1,
  },
]

export const getAgentConfigDefault = (agentKey: string): AgentConfigDefault => {
  const config = AGENT_CONFIG_DEFAULTS.find(entry => entry.agentKey === agentKey)
  if (!config) {
    throw new Error(`Missing default AgentConfig for ${agentKey}`)
  }
  return config
}
