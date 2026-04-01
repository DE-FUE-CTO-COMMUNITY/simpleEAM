import { agentRegistry } from '../registry'
import { InternetResearchInput, InternetResearchOutput, LlmConfig } from '../types'
import {
  callLlm,
  isLlmPromptLoggingEnabled,
  getLlmPromptPreviewChars,
  limitText,
} from '../shared/llm'
import { collectWebSources, getWebSourceCount } from '../shared/web-search'

// ─────────────────────────────────────────────
// Agent registration
// ─────────────────────────────────────────────

agentRegistry.register({
  id: 'internet-research',
  name: 'Internet Research Agent',
  description:
    'Searches the internet for specific information using multiple search engines, fetches web pages, and returns a structured summary of findings.',
  capabilities: [
    'Search DuckDuckGo, Wikipedia, and SearXNG',
    'Fetch and parse web page content',
    'Summarize research findings using LLM',
    'Score and rank results by relevance',
  ],
  inputDescription:
    '{ task: "what to research", companyName: "optional company context for relevance scoring", context: "optional background from previous steps" }',
  outputDescription: '{ summary: "text summary of findings", sources: [{ title, url, snippet }] }',
})

// ─────────────────────────────────────────────
// LLM prompt builder
// ─────────────────────────────────────────────

const buildResearchPrompt = (
  task: string,
  companyName: string,
  context: string,
  sources: Array<{ title: string; url: string; snippet: string }>
): string => {
  const sourcesBlock = sources
    .map((s, i) => `Source ${i + 1}: ${s.title}\nURL: ${s.url}\nContent excerpt: ${s.snippet}`)
    .join('\n\n')

  return [
    'You are a professional research analyst.',
    'Based on the web sources provided, write a comprehensive summary that addresses the research task.',
    'Focus on facts, key insights, and relevant information. Be concise but thorough.',
    '',
    `Research task: ${task}`,
    `Company context: ${companyName || 'not specified'}`,
    context ? `Background context from previous steps:\n${context}` : '',
    '',
    'Web sources found:',
    sourcesBlock || 'No web sources were available.',
    '',
    'Return your findings as plain text (not JSON).',
  ]
    .filter(line => line !== null)
    .join('\n')
}

// ─────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────

export async function performInternetResearch(
  input: InternetResearchInput
): Promise<InternetResearchOutput> {
  const companyName = input.companyName || input.task
  const context = input.context || ''

  console.info('[AI WORKER][INTERNET_RESEARCH][START]', {
    stepId: input.stepId,
    task: limitText(input.task, 120),
    companyName,
  })

  const sources = await collectWebSources(companyName, input.task)

  const prompt = buildResearchPrompt(input.task, companyName, context, sources)

  if (isLlmPromptLoggingEnabled()) {
    const previewChars = getLlmPromptPreviewChars()
    console.info('[AI WORKER][INTERNET_RESEARCH][PROMPT_PREVIEW]', {
      stepId: input.stepId,
      promptPreview: prompt.length > previewChars ? `${prompt.slice(0, previewChars)}…` : prompt,
    })
  }

  const summary = await callLlm(
    prompt,
    input.llmConfig,
    'You are a professional research analyst. Return plain text summaries, not JSON.'
  )

  console.info('[AI WORKER][INTERNET_RESEARCH][DONE]', {
    stepId: input.stepId,
    sourcesCount: sources.length,
    summaryLength: summary.length,
  })

  return { summary: limitText(summary, 4000), sources }
}
