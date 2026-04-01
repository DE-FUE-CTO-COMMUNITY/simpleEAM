import { agentRegistry } from '../registry'
import { DocumentResearchInput, DocumentResearchOutput } from '../types'
import {
  callLlm,
  limitText,
  isLlmPromptLoggingEnabled,
  getLlmPromptPreviewChars,
} from '../shared/llm'

// ─────────────────────────────────────────────
// Agent registration
// ─────────────────────────────────────────────

agentRegistry.register({
  id: 'document-research',
  name: 'Document Research Agent',
  description:
    'Analyzes one or more provided documents to extract and synthesize specific information in response to a research task.',
  capabilities: [
    'Read and parse text documents',
    'Extract relevant information using LLM',
    'Synthesize findings across multiple documents',
    'Cite sources by document name',
  ],
  inputDescription:
    '{ task: "what to find or analyze in the documents", documents: [{ name, content }], context: "optional background from previous steps" }',
  outputDescription:
    '{ summary: "text summary of findings", findings: [{ documentName, excerpt }] }',
})

// ─────────────────────────────────────────────
// LLM prompt builder
// ─────────────────────────────────────────────

const MAX_DOCUMENT_CHARS = 6000
const MAX_TOTAL_DOCUMENT_CHARS = 20000

const buildDocumentResearchPrompt = (
  task: string,
  context: string,
  documents: Array<{ name: string; content: string }>
): string => {
  let totalChars = 0
  const docsBlock = documents
    .map(doc => {
      const remaining = MAX_TOTAL_DOCUMENT_CHARS - totalChars
      if (remaining <= 0) return null
      const excerpt = limitText(doc.content, Math.min(MAX_DOCUMENT_CHARS, remaining))
      totalChars += excerpt.length
      return `--- Document: ${doc.name} ---\n${excerpt}\n--- End of ${doc.name} ---`
    })
    .filter((d): d is string => d !== null)
    .join('\n\n')

  return [
    'You are a document research analyst.',
    'Analyze the provided documents to answer the research task.',
    'Cite the document name when referencing specific information.',
    'If the requested information is not found in the documents, state that clearly.',
    '',
    `Research task: ${task}`,
    context ? `Background context from previous steps:\n${context}` : '',
    '',
    'Documents:',
    docsBlock || 'No documents were provided.',
    '',
    'Return your findings as plain text. Be thorough but concise.',
  ]
    .filter(line => line !== null)
    .join('\n')
}

// ─────────────────────────────────────────────
// Activity
// ─────────────────────────────────────────────

export async function performDocumentResearch(
  input: DocumentResearchInput
): Promise<DocumentResearchOutput> {
  console.info('[AI WORKER][DOCUMENT_RESEARCH][START]', {
    stepId: input.stepId,
    task: limitText(input.task, 120),
    documentCount: input.documents.length,
    documentNames: input.documents.map(d => d.name),
  })

  if (input.documents.length === 0) {
    return {
      summary: 'No documents were provided for analysis.',
      findings: [],
    }
  }

  const prompt = buildDocumentResearchPrompt(
    input.task,
    input.context ?? '',
    input.documents as Array<{ name: string; content: string }>
  )

  if (isLlmPromptLoggingEnabled()) {
    const previewChars = getLlmPromptPreviewChars()
    console.info('[AI WORKER][DOCUMENT_RESEARCH][PROMPT_PREVIEW]', {
      stepId: input.stepId,
      promptPreview: prompt.length > previewChars ? `${prompt.slice(0, previewChars)}…` : prompt,
    })
  }

  const summary = await callLlm(
    prompt,
    input.llmConfig,
    'You are a document research analyst. Return plain text summaries, not JSON.'
  )

  // Extract per-document findings by looking for document name references
  const findings: Array<{ documentName: string; excerpt: string }> = input.documents
    .map(doc => {
      const lowerSummary = summary.toLowerCase()
      const lowerName = doc.name.toLowerCase()
      if (!lowerSummary.includes(lowerName)) return null
      // Find a relevant sentence referencing this document
      const sentences = summary.split(/[.!?]+/)
      const relevantSentence = sentences.find(s => s.toLowerCase().includes(lowerName))
      return relevantSentence
        ? { documentName: doc.name, excerpt: limitText(relevantSentence.trim(), 300) }
        : null
    })
    .filter((f): f is { documentName: string; excerpt: string } => f !== null)

  console.info('[AI WORKER][DOCUMENT_RESEARCH][DONE]', {
    stepId: input.stepId,
    summaryLength: summary.length,
    findingsCount: findings.length,
  })

  return { summary: limitText(summary, 4000), findings }
}
