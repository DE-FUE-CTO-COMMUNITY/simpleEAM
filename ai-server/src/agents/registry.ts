import { AgentDescriptor } from './types'

class AgentRegistry {
  private readonly agents = new Map<string, AgentDescriptor>()

  register(descriptor: AgentDescriptor): void {
    if (this.agents.has(descriptor.id)) {
      console.warn(`[AGENT REGISTRY] Agent '${descriptor.id}' already registered — overwriting.`)
    }
    this.agents.set(descriptor.id, descriptor)
    console.info(`[AGENT REGISTRY] Registered: ${descriptor.id} — ${descriptor.name}`)
  }

  getAll(): readonly AgentDescriptor[] {
    return Array.from(this.agents.values())
  }

  getById(id: string): AgentDescriptor | undefined {
    return this.agents.get(id)
  }

  formatForLlm(): string {
    const list = this.getAll()
    if (list.length === 0) return 'No agents registered.'
    return list
      .map(
        (a, i) =>
          `${i + 1}. Agent ID: "${a.id}"\n` +
          `   Name: ${a.name}\n` +
          `   Description: ${a.description}\n` +
          `   Input: ${a.inputDescription}\n` +
          `   Output: ${a.outputDescription}`
      )
      .join('\n\n')
  }
}

export const agentRegistry = new AgentRegistry()
