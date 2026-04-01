import { proxyActivities } from '@temporalio/workflow'
import type {
  CoordinatorWorkflowInput,
  AgentStepResult,
  AgentPlanStep,
  DocumentInput,
  StrategicDraftPayload,
  // Activity input/output types
  PlanAgentRunInput,
  AggregateStepResultsInput,
  AggregateStepResultsOutput,
  QualityCheckInput,
  QualityCheckOutput,
  InternetResearchInput,
  InternetResearchOutput,
  DocumentResearchInput,
  DocumentResearchOutput,
  StrategyGeneratorInput,
  StrategyGeneratorOutput,
  CompleteAiRunInput,
  FailAiRunInput,
} from '../types'

// ─────────────────────────────────────────────
// Activity proxy — covers all agents' activities
// ─────────────────────────────────────────────

type CoordinatorActivities = {
  // Lifecycle
  markAiRunRunningWithToken: (input: { runId: string; accessToken: string }) => Promise<void>
  markAiRunCompletedWithToken: (
    input: CompleteAiRunInput & { accessToken: string }
  ) => Promise<void>
  markAiRunFailedWithToken: (input: FailAiRunInput & { accessToken: string }) => Promise<void>
  // Coordinator
  planAgentRun: (input: PlanAgentRunInput) => Promise<import('../types').AgentPlan>
  aggregateStepResults: (input: AggregateStepResultsInput) => Promise<AggregateStepResultsOutput>
  // Quality control
  runQualityCheck: (input: QualityCheckInput) => Promise<QualityCheckOutput>
  // Specialized agents
  performInternetResearch: (input: InternetResearchInput) => Promise<InternetResearchOutput>
  performDocumentResearch: (input: DocumentResearchInput) => Promise<DocumentResearchOutput>
  generateStrategyProposals: (input: StrategyGeneratorInput) => Promise<StrategyGeneratorOutput>
}

const {
  markAiRunRunningWithToken,
  markAiRunCompletedWithToken,
  markAiRunFailedWithToken,
  planAgentRun,
  aggregateStepResults,
  runQualityCheck,
  performInternetResearch,
  performDocumentResearch,
  generateStrategyProposals,
} = proxyActivities<CoordinatorActivities>({
  startToCloseTimeout: '10 minutes',
  retry: {
    maximumAttempts: 3,
    backoffCoefficient: 2,
    initialInterval: '5s',
    maximumInterval: '60s',
  },
})

// ─────────────────────────────────────────────
// Step dispatcher
// ─────────────────────────────────────────────

async function executeStep(
  step: AgentPlanStep,
  contextFromDeps: string,
  workflowInput: CoordinatorWorkflowInput
): Promise<AgentStepResult> {
  const { llmConfig, companyId, companyName, prompt, objective } = workflowInput

  try {
    if (step.agentId === 'internet-research') {
      const output = await performInternetResearch({
        stepId: step.stepId,
        task: step.task,
        context: contextFromDeps || undefined,
        companyName,
        llmConfig,
      })
      return {
        stepId: step.stepId,
        agentId: 'internet-research',
        summary: output.summary,
        data: output.sources,
      }
    }

    if (step.agentId === 'document-research') {
      const docs: DocumentInput[] = [
        ...(step.documents ?? []),
        ...(workflowInput.documents ?? []),
      ] as DocumentInput[]
      const output = await performDocumentResearch({
        stepId: step.stepId,
        task: step.task,
        context: contextFromDeps || undefined,
        documents: docs,
        llmConfig,
      })
      return {
        stepId: step.stepId,
        agentId: 'document-research',
        summary: output.summary,
        data: output.findings,
      }
    }

    if (step.agentId === 'strategy-generator') {
      const output = await generateStrategyProposals({
        stepId: step.stepId,
        task: step.task,
        context: contextFromDeps || undefined,
        companyId,
        companyName,
        prompt,
        objective: objective ?? null,
        llmConfig,
      })
      return {
        stepId: step.stepId,
        agentId: 'strategy-generator',
        summary: output.summary,
        data: output.draftPayload,
      }
    }

    return {
      stepId: step.stepId,
      agentId: step.agentId,
      summary: `Agent '${step.agentId}' is not registered in this version.`,
      data: null,
      error: `Unknown agentId: ${step.agentId}`,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown step error'
    return {
      stepId: step.stepId,
      agentId: step.agentId,
      summary: `Agent '${step.agentId}' failed: ${errorMessage}`,
      data: null,
      error: errorMessage,
    }
  }
}

// ─────────────────────────────────────────────
// Main coordinator workflow
// ─────────────────────────────────────────────

const MAX_QC_ITERATIONS = 2

export async function coordinatorWorkflow(input: CoordinatorWorkflowInput): Promise<void> {
  await markAiRunRunningWithToken({ runId: input.runId, accessToken: input.accessToken })

  try {
    let stepResults: AgentStepResult[] = []
    let finalDraftPayload: StrategicDraftPayload | null = null
    let finalSummary = ''
    let qcFeedback = ''

    for (let iteration = 0; iteration <= MAX_QC_ITERATIONS; iteration++) {
      // 1. Plan — LLM decides which agents to use and in what order
      const plan = await planAgentRun({
        prompt: input.prompt,
        objective: input.objective ?? null,
        companyName: input.companyName,
        llmConfig: input.llmConfig,
        previousResults: stepResults,
        qcFeedback,
        documents: (input.documents ?? []) as DocumentInput[],
      })

      stepResults = []

      // 2. Execute each step in plan order, passing outputs from dependencies
      for (const step of plan.steps) {
        const contextFromDeps = step.dependsOn
          .map(depId => {
            const dep = stepResults.find(r => r.stepId === depId)
            return dep ? `[${dep.agentId}]: ${dep.summary}` : ''
          })
          .filter(Boolean)
          .join('\n\n')

        const result = await executeStep(step, contextFromDeps, input)
        stepResults.push(result)

        // Capture strategy draft payload whenever strategy-generator produces one
        if (result.agentId === 'strategy-generator' && result.data) {
          finalDraftPayload = result.data as StrategicDraftPayload
        }
      }

      // 3. Quality check
      const qcResult = await runQualityCheck({
        originalPrompt: input.prompt,
        companyName: input.companyName,
        stepResults,
        llmConfig: input.llmConfig,
        iterationNumber: iteration,
      })

      if (qcResult.passed || iteration === MAX_QC_ITERATIONS) {
        // 4. Aggregate all step results into a final summary
        const aggregated = await aggregateStepResults({
          prompt: input.prompt,
          companyName: input.companyName,
          stepResults,
          llmConfig: input.llmConfig,
        })
        finalSummary = aggregated.summary
        break
      }

      // QC not satisfied — retry with feedback
      qcFeedback = qcResult.feedback
    }

    await markAiRunCompletedWithToken({
      runId: input.runId,
      summary: finalSummary,
      draftPayload: finalDraftPayload,
      accessToken: input.accessToken,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Coordinator workflow failed'

    try {
      await markAiRunFailedWithToken({
        runId: input.runId,
        errorMessage,
        accessToken: input.accessToken,
      })
    } catch (markFailedError) {
      const markFailedMessage =
        markFailedError instanceof Error ? markFailedError.message : 'Unknown mark-failed error'
      throw new Error(
        `${errorMessage}; additionally failed to persist FAILED state: ${markFailedMessage}`
      )
    }

    throw error
  }
}
