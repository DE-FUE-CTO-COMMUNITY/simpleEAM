export { startAiServer } from '../agents/http/server'

import { startAiServer } from '../agents/http/server'

if (typeof require !== 'undefined' && require.main === module) {
  startAiServer().catch(error => {
    console.error('AI server error:', error)
    process.exit(1)
  })
}
