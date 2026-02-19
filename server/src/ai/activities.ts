import neo4jDriver from '../db/neo4j-client'
import { CompleteAiRunInput, FailAiRunInput, GenerateSummaryInput } from './types'

export const markAiRunRunning = async (runId: string) => {
  const session = neo4jDriver.session()
  try {
    const timestamp = new Date().toISOString()
    console.info('[AI RUN][WORKER][RUNNING]', { runId, timestamp })
    await session.run(
      `
      MATCH (r:AiRun {id: $runId})
      SET r.status = 'RUNNING',
          r.startedAt = datetime($timestamp),
          r.updatedAt = datetime($timestamp)
      `,
      {
        runId,
        timestamp,
      }
    )
  } finally {
    await session.close()
  }
}

export const generateAiRunSummary = async (input: GenerateSummaryInput) => {
  console.info('[AI RUN][WORKER][SUMMARY_GENERATION]', {
    promptLength: input.prompt.trim().length,
    hasObjective: Boolean(input.objective?.trim()),
  })

  const objectivePrefix = input.objective?.trim()
    ? `Objective: ${input.objective.trim()}. `
    : 'Objective: not provided. '
  const normalizedPrompt = input.prompt.trim()
  const compactPrompt = normalizedPrompt.length > 240 ? `${normalizedPrompt.slice(0, 240)}…` : normalizedPrompt

  return `${objectivePrefix}Initial recommendation draft based on input: ${compactPrompt}`
}

export const markAiRunCompleted = async ({ runId, summary }: CompleteAiRunInput) => {
  const session = neo4jDriver.session()
  try {
    const timestamp = new Date().toISOString()
    console.info('[AI RUN][WORKER][COMPLETED]', {
      runId,
      timestamp,
      summaryLength: summary.length,
    })
    await session.run(
      `
      MATCH (r:AiRun {id: $runId})
      SET r.status = 'COMPLETED',
          r.resultSummary = $summary,
          r.updatedAt = datetime($timestamp),
          r.completedAt = datetime($timestamp)
      `,
      {
        runId,
        summary,
        timestamp,
      }
    )
  } finally {
    await session.close()
  }
}

export const markAiRunFailed = async ({ runId, errorMessage }: FailAiRunInput) => {
  const session = neo4jDriver.session()
  try {
    const timestamp = new Date().toISOString()
    console.error('[AI RUN][WORKER][FAILED]', {
      runId,
      timestamp,
      errorMessage,
    })
    await session.run(
      `
      MATCH (r:AiRun {id: $runId})
      SET r.status = 'FAILED',
          r.errorMessage = $errorMessage,
          r.updatedAt = datetime($timestamp),
          r.completedAt = datetime($timestamp)
      `,
      {
        runId,
        errorMessage,
        timestamp,
      }
    )
  } finally {
    await session.close()
  }
}
