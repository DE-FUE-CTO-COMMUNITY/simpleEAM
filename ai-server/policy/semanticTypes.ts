import type { CanonicalConceptType } from '../artifacts/types'

export type SemanticOperator = 'eq' | 'contains'

export interface SemanticConstraint {
  readonly entityType: string
  readonly path: string
  readonly operator: SemanticOperator
  readonly value: string
}

export interface SemanticAmbiguity {
  readonly entityType: string
  readonly value: string
  readonly candidatePaths: readonly string[]
}

export interface SemanticCandidateField {
  readonly entityType: CanonicalConceptType
  readonly path: string
  readonly relationPath: readonly string[]
  readonly leafField: string
  readonly fieldKind: 'string' | 'enum'
  readonly enumType?: string
  readonly enumValues?: readonly string[]
}

export interface SemanticExtractionResult {
  readonly constraints: readonly SemanticConstraint[]
  readonly ambiguities: readonly SemanticAmbiguity[]
}
