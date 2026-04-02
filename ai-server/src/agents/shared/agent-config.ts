import { graphqlRequest } from '../../graphql/client'
import { LlmConfig } from '../types'
import { AGENT_CONFIG_DEFAULTS, AgentConfigDefault } from './default-agent-configs'

interface PersistedAgentConfig {
  readonly id: string
  readonly agentKey: string
  readonly displayName: string
  readonly description?: string | null
  readonly systemPrompt: string
  readonly temperature?: number | null
  readonly topP?: number | null
  readonly maxTokens?: number | null
  readonly isEnabled: boolean
  readonly configVersion: number
  readonly metadataJson?: string | null
}

type AgentDefaultConfig = AgentConfigDefault

interface ResolveAgentConfigInput {
  readonly accessToken: string
  readonly llmConfig: LlmConfig
  readonly defaults: AgentDefaultConfig
}

interface ResolveAgentConfigOutput {
  readonly persisted: PersistedAgentConfig
  readonly llmConfig: LlmConfig
  readonly systemPrompt: string
}

const configCache = new Map<string, PersistedAgentConfig>()

const normalizeOptionalNumber = (value: number | null | undefined): number | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined
  return value
}

const buildCreateInput = (defaults: AgentDefaultConfig): Record<string, unknown> => ({
  agentKey: defaults.agentKey,
  displayName: defaults.displayName,
  description: defaults.description,
  systemPrompt: defaults.systemPrompt,
  temperature: defaults.temperature ?? null,
  topP: defaults.topP ?? null,
  maxTokens: defaults.maxTokens ?? null,
  isEnabled: defaults.isEnabled ?? true,
  configVersion: defaults.configVersion ?? 1,
  metadataJson: defaults.metadataJson ?? null,
})

const loadAgentConfig = async (
  accessToken: string,
  agentKey: string
): Promise<PersistedAgentConfig | null> => {
  const data = await graphqlRequest<{ agentConfigs: PersistedAgentConfig[] }>({
    query: `
      query GetAgentConfig($agentKey: String!) {
        agentConfigs(where: { agentKey: { eq: $agentKey } }) {
          id
          agentKey
          displayName
          description
          systemPrompt
          temperature
          topP
          maxTokens
          isEnabled
          configVersion
          metadataJson
        }
      }
    `,
    variables: { agentKey },
    accessToken,
  })

  return data.agentConfigs[0] ?? null
}

const createAgentConfig = async (
  accessToken: string,
  defaults: AgentDefaultConfig
): Promise<PersistedAgentConfig> => {
  const data = await graphqlRequest<{
    createAgentConfigs: { agentConfigs: PersistedAgentConfig[] }
  }>({
    query: `
        mutation CreateAgentConfig($input: [AgentConfigCreateInput!]!) {
          createAgentConfigs(input: $input) {
            agentConfigs {
              id
              agentKey
              displayName
              description
              systemPrompt
              temperature
              topP
              maxTokens
              isEnabled
              configVersion
              metadataJson
            }
          }
        }
      `,
    variables: { input: [buildCreateInput(defaults)] },
    accessToken,
  })

  const created = data.createAgentConfigs.agentConfigs[0]
  if (!created) {
    throw new Error(`Failed to create AgentConfig for agentKey '${defaults.agentKey}'`)
  }
  return created
}

export const resolveAgentRuntimeConfig = async (
  input: ResolveAgentConfigInput
): Promise<ResolveAgentConfigOutput> => {
  const cacheKey = input.defaults.agentKey
  let persisted = configCache.get(cacheKey) ?? null

  if (!persisted) {
    persisted = await loadAgentConfig(input.accessToken, input.defaults.agentKey)
    if (!persisted) {
      persisted = await createAgentConfig(input.accessToken, input.defaults)
      console.info('[AI WORKER][AGENT_CONFIG][CREATED]', {
        agentKey: input.defaults.agentKey,
        configVersion: persisted.configVersion,
      })
    }
    configCache.set(cacheKey, persisted)
  }

  const mergedLlmConfig: LlmConfig = {
    ...input.llmConfig,
    llmModel: input.llmConfig.llmModel,
    temperature:
      normalizeOptionalNumber(persisted.temperature) ??
      normalizeOptionalNumber(input.llmConfig.temperature),
    topP: normalizeOptionalNumber(persisted.topP) ?? normalizeOptionalNumber(input.llmConfig.topP),
    maxTokens:
      normalizeOptionalNumber(persisted.maxTokens) ??
      normalizeOptionalNumber(input.llmConfig.maxTokens),
  }

  return {
    persisted,
    llmConfig: mergedLlmConfig,
    systemPrompt: persisted.systemPrompt,
  }
}

export const ensureAgentConfigExists = async (input: {
  readonly accessToken: string
  readonly defaults: AgentDefaultConfig
}): Promise<PersistedAgentConfig> => {
  const cached = configCache.get(input.defaults.agentKey)
  if (cached) return cached

  let persisted = await loadAgentConfig(input.accessToken, input.defaults.agentKey)
  if (!persisted) {
    persisted = await createAgentConfig(input.accessToken, input.defaults)
    console.info('[AI WORKER][AGENT_CONFIG][CREATED]', {
      agentKey: input.defaults.agentKey,
      configVersion: persisted.configVersion,
    })
  }

  configCache.set(input.defaults.agentKey, persisted)
  return persisted
}

export const seedAgentConfigsAtStartup = async (accessToken: string): Promise<void> => {
  for (const defaults of AGENT_CONFIG_DEFAULTS) {
    await ensureAgentConfigExists({ accessToken, defaults })
  }
}
