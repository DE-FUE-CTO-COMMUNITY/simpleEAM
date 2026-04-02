import { QualityCheckInput, QualityCheckOutput } from '../types'
import { callLlm, parseJsonObject, limitText } from '../shared/llm'
import { resolveAgentRuntimeConfig } from '../shared/agent-config'
import { getAgentConfigDefault } from '../shared/default-agent-configs'

const QUALITY_CONTROL_DEFAULT_CONFIG = getAgentConfigDefault('quality-control')

// ─────────────────────────────────────────────
// LLM prompt builder
// ─────────────────────────────────────────────

const buildQualityCheckPrompt = (input: QualityCheckInput): string => {
  const stepResultsBlock = input.stepResults
    .map(r => {
      const status = r.error ? `⚠ Error: ${r.error}` : ''
      return [`--- ${r.agentId} (step ${r.stepId}) ---`, status, r.summary || '(no summary)', '---']
        .filter(Boolean)
        .join('\n')
    })
    .join('\n\n')

  const leniencyNote =
    input.iterationNumber >= 1
      ? 'Note: This is a retry iteration. Be more lenient — approve unless results are critically wrong or completely off-topic.'
      : ''

  return [
    'You are a quality control reviewer for enterprise AI outputs.',
    'Evaluate whether the combined agent results adequately address the original user request.',
    '',
    `Original user request: ${input.originalPrompt}`,
    `Company: ${input.companyName}`,
    `Review iteration: ${input.iterationNumber + 1}`,
    leniencyNote,
    '',
    'Agent results:',
    stepResultsBlock || '(no results available)',
    '',
    'Evaluation criteria:',
    '1. Does the combined output answer the complete question?',
    '2. Is the information consistent and not contradictory?',
    '3. Is the quality sufficient for enterprise decision-making?',
    '4. Are there critical gaps that would prevent the user from acting on these results?',
    '',
    'Return ONLY valid JSON (no markdown fences):',
    '{',
    '  "passed": boolean,',
    '  "score": 0.0-1.0,',
    '  "feedback": "specific actionable feedback if not passed, empty string if passed"',
    '}',
  ]
    .filter(line => line !== null)
    .join('\n')
}

// ─────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────

const MAX_QC_RETRIES = 2

export async function runQualityCheck(input: QualityCheckInput): Promise<QualityCheckOutput> {
  console.info('[AI WORKER][QUALITY_CONTROL][START]', {
    originalPromptLength: input.originalPrompt.length,
    stepCount: input.stepResults.length,
    iterationNumber: input.iterationNumber,
    companyName: input.companyName,
  })

  // On the final iteration, auto-pass to avoid infinite loops
  if (input.iterationNumber >= MAX_QC_RETRIES) {
    console.info('[AI WORKER][QUALITY_CONTROL][AUTO_PASS] Max iterations reached — passing result.')
    return { passed: true, score: 0.6, feedback: '' }
  }

  const prompt = buildQualityCheckPrompt(input)

  try {
    const runtimeConfig = await resolveAgentRuntimeConfig({
      accessToken: input.accessToken,
      llmConfig: input.llmConfig,
      defaults: QUALITY_CONTROL_DEFAULT_CONFIG,
    })
    const llmResponse = await callLlm(prompt, runtimeConfig.llmConfig, runtimeConfig.systemPrompt)

    const parsed = parseJsonObject(llmResponse)
    if (!parsed) {
      console.warn(
        '[AI WORKER][QUALITY_CONTROL][PARSE_FAILED] Could not parse QC response — auto-passing.'
      )
      return { passed: true, score: 0.5, feedback: '' }
    }

    const passed = parsed.passed === true
    const score = typeof parsed.score === 'number' ? Math.max(0, Math.min(1, parsed.score)) : 0.5
    const feedback = typeof parsed.feedback === 'string' ? limitText(parsed.feedback, 800) : ''

    console.info('[AI WORKER][QUALITY_CONTROL][DONE]', {
      passed,
      score,
      feedbackLength: feedback.length,
    })

    return { passed, score, feedback }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown QC error'
    console.warn('[AI WORKER][QUALITY_CONTROL][LLM_ERROR]', { error: message, autoPass: true })
    // If QC agent itself fails, don't block the result
    return { passed: true, score: 0.5, feedback: '' }
  }
}
