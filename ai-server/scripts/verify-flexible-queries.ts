import { loadArtifacts } from '../artifacts/loader'
import { renderGraphqlQuery } from '../artifacts/graphql/render'
import { ASK_CLARIFICATION, enforceCoordinatorPlan } from '../policy/enforce'

const DEFAULT_PROMPTS = [
  'Which business capabilities are not supported by any application?',
  'Show me applications that support CRM capabilities.',
  'How many active applications do we have?',
  'Give me details for ERP.',
] as const

const REDACTED_COMPANY_ID = 'REDACTED-COMPANY-ID'

function redactCompanyId(query: string): string {
  return query.split(REDACTED_COMPANY_ID).join('<companyId>')
}

function printDivider(index: number, prompt: string): void {
  console.log(`\n=== Prompt ${index + 1} ===`)
  console.log(prompt)
}

function printTrajectory(lines: readonly string[]): void {
  console.log('Step trajectory:')
  for (const [index, line] of lines.entries()) {
    console.log(`${index + 1}. ${line}`)
  }
}

async function run(): Promise<void> {
  const prompts = process.argv.slice(2)
  const artifacts = loadArtifacts()
  const samples = prompts.length > 0 ? prompts : [...DEFAULT_PROMPTS]

  for (const [index, prompt] of samples.entries()) {
    printDivider(index, prompt)

    const decision = enforceCoordinatorPlan({
      text: prompt,
      locale: 'en',
      plan: {},
      artifacts,
    })

    if (decision.action === ASK_CLARIFICATION) {
      console.log('Decision: ASK_CLARIFICATION')
      console.log(`Reason: ${decision.reasons.join(' ')}`)
      console.log(`Question: ${decision.clarification.question}`)
      printTrajectory([
        `Normalized text: ${decision.normalized.canonicalText}`,
        `Intent candidates: ${decision.candidateIntents.join(', ') || 'none'}`,
        `Entity candidates: ${decision.candidateEntityTypes.join(', ') || 'none'}`,
        'Stopped before query rendering because deterministic governance required clarification.',
      ])
      continue
    }

    const selectedQuery = decision.querySelection.selected
    if (!selectedQuery) {
      console.log('Decision: ASK_CLARIFICATION')
      console.log(`Reason: ${decision.querySelection.reason ?? 'No selected query was produced.'}`)
      printTrajectory([
        `Normalized text: ${decision.normalized.canonicalText}`,
        `Resolved intent: ${decision.plan.intent}`,
        `Resolved entity type: ${decision.plan.entityHint?.entityType ?? 'unknown'}`,
        'Stopped before query rendering because deterministic query selection failed.',
      ])
      continue
    }

    const renderedQuery = renderGraphqlQuery({
      queryId: selectedQuery.queryId,
      companyId: REDACTED_COMPANY_ID,
      params: selectedQuery.args,
    })

    console.log('Decision: ALLOW')
    console.log(`Intent chosen: ${decision.plan.intent}`)
    console.log(`Entity type: ${decision.plan.entityHint?.entityType ?? 'unknown'}`)
    console.log(`Query form: ${decision.querySelection.queryForm}`)
    console.log(`Selected queryId: ${selectedQuery.queryId}`)
    console.log('Rendered GraphQL:')
    console.log(redactCompanyId(renderedQuery))
    printTrajectory([
      `Normalized text: ${decision.normalized.canonicalText}`,
      `Resolved intent: ${decision.plan.intent}`,
      `Resolved entity type: ${decision.plan.entityHint?.entityType ?? 'unknown'}`,
      `Resolved query form: ${decision.querySelection.queryForm}`,
      `Rendered queryId: ${selectedQuery.queryId}`,
    ])
  }
}

void run().catch(error => {
  console.error(error instanceof Error ? (error.stack ?? error.message) : error)
  process.exitCode = 1
})
