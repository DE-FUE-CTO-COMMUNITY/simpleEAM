import { Annotation, END, START, StateGraph } from '@langchain/langgraph'
import { agentRegistry } from '../registry'
import {
  StrategyGeneratorInput,
  StrategyGeneratorOutput,
  StrategicDraftPayload,
  StrategicResearchSource,
} from '../types'
import {
  callLlm,
  resolveLlmConfig,
  parseJsonObject,
  asString,
  asStringArray,
  ensureDateYearString,
  limitText,
  isLlmFallbackEnabled,
  isLlmPromptLoggingEnabled,
  getLlmPromptPreviewChars,
  getLlmTimeoutMs,
  getLlmRetryCount,
} from '../shared/llm'
import { collectWebSources } from '../shared/web-search'
import { resolveAgentRuntimeConfig } from '../shared/agent-config'
import { getAgentConfigDefault } from '../shared/default-agent-configs'

const STRATEGY_GENERATOR_DEFAULT_CONFIG = getAgentConfigDefault('strategy-generator')

// ─────────────────────────────────────────────
// Agent registration
// ─────────────────────────────────────────────

agentRegistry.register({
  id: 'strategy-generator',
  name: 'Strategy Generator Agent',
  description:
    'Generates comprehensive strategic proposals for a company including mission, vision, values, goals, strategies, and a Business Model Canvas. Results are surfaced as proposals pending user approval.',
  capabilities: [
    'Generate mission and vision statements',
    'Define strategic values, goals, and initiatives',
    'Create a Business Model Canvas',
    'Incorporate internet research context into strategy',
    'Structure proposals for review and approval',
  ],
  inputDescription:
    '{ task: "specific strategy generation task", companyId, companyName, prompt: "user request", objective: "optional", context: "optional research from previous steps" }',
  outputDescription:
    '{ summary: "executive summary", draftPayload: { mission, vision, values, goals, strategies, bmc, sources } }',
})

// ─────────────────────────────────────────────
// LLM prompt builder
// ─────────────────────────────────────────────

const buildStrategyPrompt = (input: {
  companyName: string
  prompt: string
  objective: string | null
  externalContext: string
  sources: readonly StrategicResearchSource[]
}): string => {
  const sourcesBlock = input.sources
    .map((s, i) => `Source ${i + 1}: ${s.title}\nURL: ${s.url}\nSnippet: ${s.snippet}`)
    .join('\n\n')

  return [
    'You are an enterprise strategy analyst.',
    'Return ONLY valid JSON without markdown fences.',
    'Use the provided context and web sources to create a strategic draft for the company.',
    '',
    `Company: ${input.companyName}`,
    `Objective: ${input.objective ?? 'not provided'}`,
    `User Prompt: ${input.prompt}`,
    input.externalContext
      ? `Research context from previous analysis:\n${input.externalContext}`
      : '',
    '',
    'Required JSON shape:',
    '{',
    '  "summary": "string — executive summary of the strategic draft",',
    '  "mission": {"name": "string", "purposeStatement": "string", "keywords": ["string"], "year": "YYYY"},',
    '  "vision": {"name": "string", "visionStatement": "string", "timeHorizon": "string", "year": "YYYY"},',
    '  "values": [{"name": "string", "valueStatement": "string"}],',
    '  "goals": [{"name": "string", "goalStatement": "string"}],',
    '  "strategies": [{"name": "string", "description": "string"}],',
    '  "bmc": {',
    '    "keyPartners": ["string"],',
    '    "keyActivities": ["string"],',
    '    "valuePropositions": ["string"],',
    '    "customerSegments": ["string"],',
    '    "channels": ["string"],',
    '    "revenueStreams": ["string"],',
    '    "costStructure": ["string"]',
    '  }',
    '}',
    '',
    'Array size requirements (IMPORTANT — output EXACTLY this many complete JSON objects in each array):',
    '  - values: provide 4 to 6 entries',
    '  - goals: provide 6 to 9 entries',
    '  - strategies: provide 4 to 6 entries',
    'Do NOT mention counts in the summary field that differ from the arrays you actually produce.',
    '',
    'Web sources:',
    sourcesBlock || 'No web sources were available.',
  ]
    .filter(line => line !== null)
    .join('\n')
}

// ─────────────────────────────────────────────
// Draft builders
// ─────────────────────────────────────────────

const createFallbackDraft = (input: {
  companyName: string
  prompt: string
  objective: string | null
  sources: readonly StrategicResearchSource[]
}): StrategicDraftPayload => {
  const year = `${new Date().getUTCFullYear()}-01-01`
  const compactPrompt = limitText(input.prompt, 160)
  const objectivePrefix = input.objective ? limitText(input.objective, 160) : 'Strategic alignment'
  return {
    companyName: input.companyName,
    generatedAt: new Date().toISOString(),
    mission: {
      name: `${input.companyName} Mission`,
      purposeStatement: `Deliver business value through ${objectivePrefix.toLowerCase()} with focus on ${compactPrompt.toLowerCase()}.`,
      keywords: ['Value delivery', 'Customer focus', 'Execution excellence'],
      year,
    },
    vision: {
      name: `${input.companyName} Vision`,
      visionStatement: `Become a strategically resilient and digitally enabled enterprise driven by ${compactPrompt.toLowerCase()}.`,
      timeHorizon: '3-5 years',
      year,
    },
    values: [
      { name: 'Customer Focus', valueStatement: 'We prioritize measurable customer outcomes.' },
      {
        name: 'Innovation',
        valueStatement: 'We continuously modernize capabilities and services.',
      },
      { name: 'Accountability', valueStatement: 'We take ownership for strategic execution.' },
    ],
    goals: [
      {
        name: 'Increase Strategic Alignment',
        goalStatement: 'Align business and IT initiatives around shared strategic priorities.',
      },
      {
        name: 'Improve Operational Efficiency',
        goalStatement: 'Reduce process and system friction across core value streams.',
      },
      {
        name: 'Strengthen Governance',
        goalStatement: 'Establish transparent decision-making and architecture standards.',
      },
    ],
    strategies: [
      {
        name: 'Capability-led Planning',
        description: 'Prioritize investments by business capabilities.',
      },
      {
        name: 'Platform Consolidation',
        description: 'Reduce complexity through standard platforms.',
      },
      {
        name: 'Data Quality Program',
        description: 'Improve trust and usability of enterprise data.',
      },
    ],
    sources: input.sources,
    bmc: {
      keyPartners: ['Technology partners', 'Implementation partners'],
      keyActivities: ['Architecture governance', 'Capability roadmapping'],
      valuePropositions: ['Faster strategic execution', 'Improved transparency'],
      customerSegments: ['Executive stakeholders', 'Business domain owners'],
      channels: ['Portfolio reviews', 'Architecture boards'],
      revenueStreams: ['Cost reduction', 'Productivity gains'],
      costStructure: ['Transformation programs', 'Platform operations'],
    },
  }
}

const buildDraftFromModelOutput = (input: {
  companyName: string
  modelOutput: Record<string, unknown>
  sources: readonly StrategicResearchSource[]
}): StrategicDraftPayload => {
  const year = `${new Date().getUTCFullYear()}-01-01`
  const mission = (input.modelOutput.mission as Record<string, unknown> | undefined) ?? {}
  const vision = (input.modelOutput.vision as Record<string, unknown> | undefined) ?? {}
  const bmc = (input.modelOutput.bmc as Record<string, unknown> | undefined) ?? {}

  const valuesRaw = Array.isArray(input.modelOutput.values)
    ? (input.modelOutput.values as unknown[])
    : []
  const goalsRaw = Array.isArray(input.modelOutput.goals)
    ? (input.modelOutput.goals as unknown[])
    : []
  const strategiesRaw = Array.isArray(input.modelOutput.strategies)
    ? (input.modelOutput.strategies as unknown[])
    : []

  const values = valuesRaw
    .map(item => {
      const v = (item as Record<string, unknown>) ?? {}
      return {
        name: asString(v.name, 'Strategic Value', 120),
        valueStatement: asString(v.valueStatement, 'This value supports strategic execution.', 280),
      }
    })
    .slice(0, 12)

  const goals = goalsRaw
    .map(item => {
      const g = (item as Record<string, unknown>) ?? {}
      return {
        name: asString(g.name, 'Strategic Goal', 120),
        goalStatement: asString(g.goalStatement, 'This goal guides strategic priorities.', 280),
      }
    })
    .slice(0, 12)

  const strategies = strategiesRaw
    .map(item => {
      const s = (item as Record<string, unknown>) ?? {}
      return {
        name: asString(s.name, 'Strategic Initiative', 120),
        description: asString(s.description, 'This strategy supports target goals.', 280),
      }
    })
    .slice(0, 12)

  return {
    companyName: input.companyName,
    generatedAt: new Date().toISOString(),
    mission: {
      name: asString(mission.name, `${input.companyName} Mission`, 120),
      purposeStatement: asString(
        mission.purposeStatement,
        'Deliver measurable strategic value.',
        320
      ),
      keywords: asStringArray(mission.keywords, ['Strategy', 'Execution', 'Value'], 60),
      year: ensureDateYearString(mission.year, year),
    },
    vision: {
      name: asString(vision.name, `${input.companyName} Vision`, 120),
      visionStatement: asString(
        vision.visionStatement,
        'Build a resilient and future-ready enterprise architecture.',
        320
      ),
      timeHorizon: asString(vision.timeHorizon, '3-5 years', 80),
      year: ensureDateYearString(vision.year, year),
    },
    values:
      values.length > 0
        ? values
        : [{ name: 'Customer Focus', valueStatement: 'We prioritize customer value.' }],
    goals:
      goals.length > 0
        ? goals
        : [
            {
              name: 'Improve Strategic Alignment',
              goalStatement: 'Align architecture and business priorities.',
            },
          ],
    strategies:
      strategies.length > 0
        ? strategies
        : [
            {
              name: 'Capability-led Transformation',
              description: 'Prioritize initiatives by strategic capabilities.',
            },
          ],
    sources: input.sources,
    bmc: {
      keyPartners: asStringArray(bmc.keyPartners, ['Strategic technology partners']),
      keyActivities: asStringArray(bmc.keyActivities, ['Architecture governance']),
      valuePropositions: asStringArray(bmc.valuePropositions, [
        'Transparent strategic decision support',
      ]),
      customerSegments: asStringArray(bmc.customerSegments, ['Business and IT leadership']),
      channels: asStringArray(bmc.channels, ['Architecture board', 'Portfolio review']),
      revenueStreams: asStringArray(bmc.revenueStreams, ['Efficiency gains']),
      costStructure: asStringArray(bmc.costStructure, ['Transformation investments']),
    },
  }
}

// ─────────────────────────────────────────────
// Summary builder from parsed draft
// ─────────────────────────────────────────────

const buildSummaryFromDraft = (draft: StrategicDraftPayload, sourceCount: number): string => {
  const valueNames = draft.values.map(v => v.name).join(', ')
  const goalNames = draft.goals.map(g => g.name).join(', ')
  const strategyNames = draft.strategies.map(s => s.name).join(', ')
  const parts = [
    `Strategic draft generated for ${draft.companyName}.`,
    `Mission: "${limitText(draft.mission.name, 80)}".`,
    `Vision: "${limitText(draft.vision.name, 80)}".`,
    `${draft.values.length} value(s): ${valueNames}.`,
    `${draft.goals.length} goal(s): ${goalNames}.`,
    `${draft.strategies.length} strateg(y/ies): ${strategyNames}.`,
  ]
  if (sourceCount > 0) parts.push(`Informed by ${sourceCount} web source(s).`)
  return limitText(parts.join(' '), 1200)
}

// ─────────────────────────────────────────────
// LangGraph state + pipeline
// ─────────────────────────────────────────────

interface StrategyGraphState {
  companyName: string
  prompt: string
  objective: string | null
  externalContext: string
  sources: StrategicResearchSource[]
  llmPrompt: string
  summary: string
  draftPayload: StrategicDraftPayload | null
  llmErrorMessage: string | null
  fallbackEnabled: boolean
  llmConfig: {
    llmUrl: string
    llmModel: string
    llmKey: string
    temperature?: number
    topP?: number
    maxTokens?: number
  }
  systemPrompt: string
}

const strategyGraphAnnotation = Annotation.Root({
  companyName: Annotation<string>({ reducer: (_, u) => u }),
  prompt: Annotation<string>({ reducer: (_, u) => u, default: () => '' }),
  objective: Annotation<string | null>({ reducer: (_, u) => u }),
  externalContext: Annotation<string>({ reducer: (_, u) => u, default: () => '' }),
  sources: Annotation<StrategicResearchSource[]>({ reducer: (_, u) => u, default: () => [] }),
  llmPrompt: Annotation<string>({ reducer: (_, u) => u, default: () => '' }),
  summary: Annotation<string>({ reducer: (_, u) => u, default: () => '' }),
  draftPayload: Annotation<StrategicDraftPayload | null>({
    reducer: (_, u) => u,
    default: () => null,
  }),
  llmErrorMessage: Annotation<string | null>({ reducer: (_, u) => u, default: () => null }),
  fallbackEnabled: Annotation<boolean>({ reducer: (_, u) => u }),
  llmConfig: Annotation<{
    llmUrl: string
    llmModel: string
    llmKey: string
    temperature?: number
    topP?: number
    maxTokens?: number
  }>({
    reducer: (_, u) => u,
  }),
  systemPrompt: Annotation<string>({ reducer: (_, u) => u, default: () => '' }),
})

const executeStrategyGraph = async (
  input: StrategyGeneratorInput,
  companyName: string,
  objective: string | null
): Promise<StrategyGeneratorOutput> => {
  const runtimeConfig = await resolveAgentRuntimeConfig({
    accessToken: input.accessToken,
    llmConfig: input.llmConfig,
    defaults: STRATEGY_GENERATOR_DEFAULT_CONFIG,
  })
  const llmConfig = runtimeConfig.llmConfig

  const workflow = new StateGraph(strategyGraphAnnotation)
    .addNode('research', async state => {
      try {
        const sources = await collectWebSources(state.companyName, state.objective)
        console.info('[AI WORKER][STRATEGY_GENERATOR][WEB_RESEARCH]', {
          companyName: state.companyName,
          sourceCount: sources.length,
        })
        return { sources }
      } catch (error) {
        console.warn('[AI WORKER][STRATEGY_GENERATOR][WEB_RESEARCH][FAILED]', {
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        return { sources: [] }
      }
    })
    .addNode('preparePrompt', async state => {
      const llmPrompt = buildStrategyPrompt({
        companyName: state.companyName,
        prompt: state.prompt,
        objective: state.objective,
        externalContext: state.externalContext,
        sources: state.sources,
      })

      const resolved = resolveLlmConfig(state.llmConfig)
      console.info('[AI WORKER][STRATEGY_GENERATOR][LLM][REQUEST]', {
        llmUrl: resolved.endpointUrl,
        llmModel: resolved.model,
        llmTimeoutMs: getLlmTimeoutMs(),
        llmRetryCount: getLlmRetryCount(),
        sourcesCount: state.sources.length,
        promptLength: llmPrompt.length,
      })

      if (isLlmPromptLoggingEnabled()) {
        const previewChars = getLlmPromptPreviewChars()
        console.info('[AI WORKER][STRATEGY_GENERATOR][LLM][PROMPT_PREVIEW]', {
          promptPreview:
            llmPrompt.length > previewChars ? `${llmPrompt.slice(0, previewChars)}…` : llmPrompt,
        })
      }

      return { llmPrompt }
    })
    .addNode('generateDraft', async state => {
      try {
        const llmRawText = await callLlm(state.llmPrompt, state.llmConfig, state.systemPrompt)
        const parsedOutput = parseJsonObject(llmRawText)
        if (!parsedOutput) throw new Error('LLM output was not valid JSON')

        const draftPayload = buildDraftFromModelOutput({
          companyName: state.companyName,
          modelOutput: parsedOutput,
          sources: state.sources,
        })
        // Build summary from the actual parsed data, not from the LLM-written
        // summary field, to guarantee the chat reflects the real draftPayload.
        const summary = buildSummaryFromDraft(draftPayload, state.sources.length)
        return { draftPayload, summary, llmErrorMessage: null }
      } catch (error) {
        const llmErrorMessage = error instanceof Error ? error.message : 'Unknown LLM error'
        console.warn('[AI WORKER][STRATEGY_GENERATOR][LLM][FAILED]', {
          fallbackEnabled: state.fallbackEnabled,
          error: llmErrorMessage,
        })
        return { llmErrorMessage }
      }
    })
    .addNode('fallbackDraft', async state => {
      console.warn('[AI WORKER][STRATEGY_GENERATOR][FALLBACK_ENABLED]')
      const draftPayload = createFallbackDraft({
        companyName: state.companyName,
        prompt: state.prompt,
        objective: state.objective,
        sources: state.sources,
      })
      const summary = buildSummaryFromDraft(draftPayload, state.sources.length)
      return { draftPayload, summary }
    })
    .addNode('failDraftGeneration', async state => {
      throw new Error(state.llmErrorMessage ?? 'Strategy generation failed')
    })
    .addNode('completeDraft', async () => ({}))
    .addEdge(START, 'research')
    .addEdge('research', 'preparePrompt')
    .addEdge('preparePrompt', 'generateDraft')
    .addConditionalEdges(
      'generateDraft',
      state => {
        if (!state.llmErrorMessage) return 'completeDraft'
        return state.fallbackEnabled ? 'fallbackDraft' : 'failDraftGeneration'
      },
      {
        completeDraft: 'completeDraft',
        fallbackDraft: 'fallbackDraft',
        failDraftGeneration: 'failDraftGeneration',
      }
    )
    .addEdge('fallbackDraft', END)
    .addEdge('completeDraft', END)
    .addEdge('failDraftGeneration', END)

  const graph = workflow.compile()
  const result = await graph.invoke({
    companyName,
    prompt: input.prompt,
    objective,
    externalContext: input.context ?? '',
    sources: [],
    llmPrompt: '',
    summary: '',
    draftPayload: null,
    llmErrorMessage: null,
    fallbackEnabled: isLlmFallbackEnabled(),
    llmConfig,
    systemPrompt: runtimeConfig.systemPrompt,
  })

  if (!result.draftPayload) {
    throw new Error('Strategy graph completed without draft payload')
  }

  return {
    summary: result.summary as string,
    draftPayload: result.draftPayload as StrategicDraftPayload,
  }
}

// ─────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────

export async function generateStrategyProposals(
  input: StrategyGeneratorInput
): Promise<StrategyGeneratorOutput> {
  console.info('[AI WORKER][STRATEGY_GENERATOR][START]', {
    stepId: input.stepId,
    companyId: input.companyId,
    promptLength: input.prompt.length,
    hasContext: Boolean(input.context),
  })

  const companyName = input.companyName || 'Selected Company'
  const objective = input.objective?.trim() || null

  return executeStrategyGraph(input, companyName, objective)
}
