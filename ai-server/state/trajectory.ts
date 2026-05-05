export type StepEventKind =
  | 'USER_INPUT_CAPTURED'
  | 'INPUT_NORMALIZED'
  | 'PLAN_CREATED'
  | 'QUERY_SELECTED'
  | 'DATA_ATTACHED'
  | 'ANSWER_PREPARED'
  | 'CLARIFICATION_REQUESTED'
  | 'STATE_UPDATED'

export interface StepEvent {
  readonly step: number
  readonly at: string
  readonly kind: StepEventKind
  readonly detail: string
  readonly payload?: Readonly<Record<string, unknown>>
}

export interface StepEventInput {
  readonly kind: StepEventKind
  readonly detail: string
  readonly payload?: Readonly<Record<string, unknown>>
  readonly at?: string
}

export const createStepEvent = (
  existingSteps: readonly StepEvent[],
  input: StepEventInput
): StepEvent => ({
  step: existingSteps.length + 1,
  at: input.at ?? new Date().toISOString(),
  kind: input.kind,
  detail: input.detail,
  payload: input.payload,
})

export const appendStep = (
  existingSteps: readonly StepEvent[],
  input: StepEventInput
): readonly StepEvent[] => [...existingSteps, createStepEvent(existingSteps, input)]

export const appendSteps = (
  existingSteps: readonly StepEvent[],
  inputs: readonly StepEventInput[]
): readonly StepEvent[] => inputs.reduce<readonly StepEvent[]>(appendStep, existingSteps)

export const appendStateStep = (
  existingSteps: readonly StepEvent[],
  kind: StepEventKind,
  detail: string,
  payload?: Readonly<Record<string, unknown>>
): readonly StepEvent[] => appendStep(existingSteps, { kind, detail, payload })
