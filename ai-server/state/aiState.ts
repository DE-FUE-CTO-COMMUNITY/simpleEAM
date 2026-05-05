import type { Clarification, Plan, SupportedLocale } from './plan'
import type { StepEvent } from './trajectory'

export interface UserInputState {
  readonly text: string
  readonly locale?: SupportedLocale | null
  readonly companyId?: string | null
}

export interface NormalizedState {
  readonly text: string
  readonly locale?: SupportedLocale | null
  readonly requestedEntityDescription?: string | null
  readonly tokens?: readonly string[]
}

export interface SelectedQueryState {
  readonly queryId: string
  readonly args?: Readonly<Record<string, unknown>>
}

export interface AnswerState {
  readonly text: string
  readonly confidence?: number
  readonly citations?: readonly Readonly<Record<string, unknown>>[]
}

export interface AiState {
  readonly userInput: UserInputState
  readonly plan: Plan | null
  readonly normalized: NormalizedState | null
  readonly selectedQuery: SelectedQueryState | null
  readonly data: unknown
  readonly answer: AnswerState | null
  readonly clarification: Clarification | null
  readonly steps: readonly StepEvent[]
}
