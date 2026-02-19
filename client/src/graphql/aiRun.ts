import { gql } from '@apollo/client/core'

export const START_AI_RUN = gql`
  mutation StartAiRun($input: StartAiRunInput!) {
    startAiRun(input: $input) {
      workflowId
      run {
        id
        status
        workflowId
        createdAt
      }
    }
  }
`

export const GET_AI_RUNS = gql`
  query GetAiRuns($companyId: ID!) {
    aiRuns(companyId: $companyId) {
      id
      companyId
      prompt
      objective
      status
      workflowId
      initiatedBy
      resultSummary
      errorMessage
      createdAt
      startedAt
      completedAt
    }
  }
`
