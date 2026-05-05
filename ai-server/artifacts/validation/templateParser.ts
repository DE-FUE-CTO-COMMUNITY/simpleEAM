import { readFileSync } from 'node:fs'

export interface ParsedTemplate {
  readonly filePath: string
  readonly template: string
  readonly rootField: string | null
  readonly selections: readonly string[]
  readonly placeholders: readonly string[]
  readonly enumLiterals: readonly string[]
}

const PLACEHOLDER_PATTERN = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g
const IGNORED_LITERAL_TOKENS = new Set(['ASC', 'DESC', 'AND', 'OR', 'TRUE', 'FALSE', 'NULL'])

type GraphqlAstNode = {
  readonly kind?: string
  readonly name?: { readonly value?: string }
  readonly selectionSet?: { readonly selections?: readonly GraphqlAstNode[] }
  readonly definitions?: readonly GraphqlAstNode[]
}

type GraphqlParseFunction = (source: string) => GraphqlAstNode

function assertNoVariables(template: string, filePath: string): void {
  if (/\$[A-Za-z_][A-Za-z0-9_]*/.test(template)) {
    throw new Error(`GraphQL template "${filePath}" must not use $variables.`)
  }
}

function extractPlaceholders(template: string): readonly string[] {
  return Array.from(template.matchAll(PLACEHOLDER_PATTERN), match => match[1]?.trim() ?? '').filter(
    Boolean
  )
}

function sanitizeForParsing(template: string): string {
  return template.replace(PLACEHOLDER_PATTERN, 'PLACEHOLDER')
}

function loadGraphqlParse(): GraphqlParseFunction | null {
  try {
    const graphqlModule = require('graphql') as { parse?: GraphqlParseFunction }
    return typeof graphqlModule.parse === 'function' ? graphqlModule.parse : null
  } catch {
    return null
  }
}

function parseWithGraphql(
  template: string
): { rootField: string | null; selections: readonly string[] } | null {
  const parse = loadGraphqlParse()
  if (!parse) {
    return null
  }

  const documentNode = parse(sanitizeForParsing(template))
  const operationDefinition = documentNode.definitions?.find(
    definition => definition.kind === 'OperationDefinition'
  )
  const rootSelection = operationDefinition?.selectionSet?.selections?.find(
    selection => selection.kind === 'Field'
  )

  const rootField = rootSelection?.name?.value ?? null
  const selections =
    rootSelection?.selectionSet?.selections
      ?.filter(selection => selection.kind === 'Field')
      .map(selection => selection.name?.value ?? '')
      .filter(Boolean) ?? []

  return { rootField, selections }
}

function findMatchingBrace(source: string, startIndex: number): number {
  let depth = 0
  let inString = false
  let escaped = false

  for (let index = startIndex; index < source.length; index += 1) {
    const character = source[index]

    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }

      if (character === '\\') {
        escaped = true
        continue
      }

      if (character === '"') {
        inString = false
      }

      continue
    }

    if (character === '"') {
      inString = true
      continue
    }

    if (character === '{') {
      depth += 1
      continue
    }

    if (character === '}') {
      depth -= 1
      if (depth === 0) {
        return index
      }
    }
  }

  return -1
}

function parseSelectionsFallback(selectionBlock: string): readonly string[] {
  const selections: string[] = []
  let index = 0
  let depth = 0
  let inString = false
  let escaped = false

  while (index < selectionBlock.length) {
    const character = selectionBlock[index]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (character === '\\') {
        escaped = true
      } else if (character === '"') {
        inString = false
      }
      index += 1
      continue
    }

    if (character === '"') {
      inString = true
      index += 1
      continue
    }

    if (character === '{') {
      depth += 1
      index += 1
      continue
    }

    if (character === '}') {
      depth = Math.max(0, depth - 1)
      index += 1
      continue
    }

    if (depth === 0 && /[A-Za-z_]/.test(character)) {
      const startIndex = index
      index += 1
      while (index < selectionBlock.length && /[A-Za-z0-9_]/.test(selectionBlock[index] ?? '')) {
        index += 1
      }
      selections.push(selectionBlock.slice(startIndex, index))
      continue
    }

    index += 1
  }

  return Array.from(new Set(selections))
}

function parseTemplateFallback(template: string): {
  rootField: string | null
  selections: readonly string[]
} {
  const sanitized = sanitizeForParsing(template)
  const queryMatch = sanitized.match(/query\s*\{\s*([A-Za-z_][A-Za-z0-9_]*)/)
  const rootField = queryMatch?.[1] ?? null

  if (!rootField) {
    return { rootField: null, selections: [] }
  }

  const rootFieldIndex = sanitized.indexOf(rootField)
  const rootSelectionStart = sanitized.indexOf('{', rootFieldIndex)
  if (rootSelectionStart === -1) {
    return { rootField, selections: [] }
  }

  const rootSelectionEnd = findMatchingBrace(sanitized, rootSelectionStart)
  if (rootSelectionEnd === -1) {
    return { rootField, selections: [] }
  }

  const selectionBlock = sanitized.slice(rootSelectionStart + 1, rootSelectionEnd)
  return {
    rootField,
    selections: parseSelectionsFallback(selectionBlock),
  }
}

function extractEnumLiterals(template: string): readonly string[] {
  const strippedTemplate = template.replace(/"(?:\\.|[^"\\])*"/g, '""')
  const matches = strippedTemplate.match(/\b[A-Z][A-Z0-9_]+\b/g) ?? []

  return Array.from(new Set(matches.filter(match => !IGNORED_LITERAL_TOKENS.has(match))))
}

export function parseTemplateFile(filePath: string): ParsedTemplate {
  const template = readFileSync(filePath, 'utf8')
  assertNoVariables(template, filePath)

  const parsedWithGraphql = parseWithGraphql(template)
  const parsedFallback = parsedWithGraphql ?? parseTemplateFallback(template)

  return {
    filePath,
    template,
    rootField: parsedFallback.rootField,
    selections: parsedFallback.selections,
    placeholders: Array.from(new Set(extractPlaceholders(template))),
    enumLiterals: extractEnumLiterals(template),
  }
}
