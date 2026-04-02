import { gql } from '@apollo/client/core'

export const GET_AGENT_CONFIGS = gql`
  query GetAgentConfigs {
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
      updatedAt
    }
  }
`

export const UPDATE_AGENT_CONFIG = gql`
  mutation UpdateAgentConfig($id: ID!, $input: AgentConfigUpdateInput!) {
    updateAgentConfigs(where: { id: { eq: $id } }, update: $input) {
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
        updatedAt
      }
    }
  }
`
