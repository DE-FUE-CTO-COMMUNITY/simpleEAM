export { startAiServer } from './agents/http/server'
export { loadArtifacts } from './artifacts/loader'
export { buildGraph, runGraph } from './graph/buildGraph'
export {
  startAiQueryWorkflow,
  startCoordinatorWorkflow,
  startSovereigntyScoreWorkflow,
  getWorkflowStatus,
} from './temporal/client/temporal-client'

import { startAiServer } from './agents/http/server'

if (typeof require !== 'undefined' && require.main === module) {
  startAiServer().catch(error => {
    console.error('AI server error:', error)
    process.exit(1)
  })
}
