import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { Script } from 'node:vm'

import ts from 'typescript'

import type {
  ArtifactKind,
  ConceptDictionaryArtifact,
  IntentSchemaArtifact,
  LoadedArtifacts,
  QueryLibraryArtifact,
  QueryLibraryMetadataArtifact,
  SchemaDigestArtifact,
} from './types'
import {
  validateConceptDictionaryArtifact,
  validateIntentSchemaArtifact,
  validateLoadedArtifacts,
  validateQueryLibraryArtifact,
  validateQueryLibraryMetadataArtifact,
  validateSchemaDigestArtifact,
} from './validate'

export const ARTIFACT_FILE_NAMES = {
  intentSchema: 'intent-schema.v1.0.0.json',
  conceptDictionary: 'concept-dictionary.v1.0.0.json',
  queryLibrary: 'query-library.json',
  queryLibraryMetadata: 'query-library-metadata.v1.0.0.yaml',
  schemaDigest: 'schema-digest.v1.0.0.ts',
} as const

const REQUIRED_ARTIFACT_FILES = [
  ARTIFACT_FILE_NAMES.intentSchema,
  ARTIFACT_FILE_NAMES.conceptDictionary,
  ARTIFACT_FILE_NAMES.queryLibrary,
  ARTIFACT_FILE_NAMES.queryLibraryMetadata,
  ARTIFACT_FILE_NAMES.schemaDigest,
] as const

export interface ArtifactPaths {
  readonly intentSchema: string
  readonly conceptDictionary: string
  readonly queryLibrary: string
  readonly queryLibraryMetadata: string
  readonly schemaDigest: string
}

export interface LoadArtifactsOptions {
  readonly artifactsDir?: string
}

const YAML_INDENT = 2

function parseScalar(value: string): unknown {
  const trimmed = value.trim()

  if (trimmed === '') {
    return ''
  }

  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null') return null
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed)
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return JSON.parse(trimmed)

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }

  return trimmed
}

function splitKeyValue(line: string): { key: string; value?: string } {
  const separatorIndex = line.indexOf(':')
  if (separatorIndex <= 0) {
    throw new Error(`Invalid YAML line: ${line}`)
  }

  const key = line.slice(0, separatorIndex).trim()
  const value = line.slice(separatorIndex + 1).trim()
  return { key, value: value === '' ? undefined : value }
}

function countIndent(rawLine: string): number {
  const indent = rawLine.match(/^\s*/)?.[0].length ?? 0
  if (indent % YAML_INDENT !== 0) {
    throw new Error(`Invalid YAML indentation: "${rawLine}"`)
  }
  return indent
}

function parseYaml(raw: string): unknown {
  const trimmed = raw.trim()
  if (!trimmed) {
    throw new Error('YAML artifact is empty')
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    // Fall back to a strict YAML subset parser.
  }

  const lines = raw
    .split(/\r?\n/)
    .map(line => line.replace(/\t/g, '  '))
    .filter(line => line.trim() && !line.trim().startsWith('#'))

  let index = 0

  const parseBlock = (expectedIndent: number): unknown => {
    if (index >= lines.length) {
      throw new Error('Unexpected end of YAML input')
    }

    const currentIndent = countIndent(lines[index])
    if (currentIndent < expectedIndent) {
      throw new Error('YAML block terminated unexpectedly')
    }

    if (lines[index].trim().startsWith('- ')) {
      return parseSequence(expectedIndent)
    }

    return parseMapping(expectedIndent)
  }

  const parseSequence = (expectedIndent: number): unknown[] => {
    const items: unknown[] = []

    while (index < lines.length) {
      const rawLine = lines[index]
      const indent = countIndent(rawLine)
      if (indent < expectedIndent) {
        break
      }
      if (indent > expectedIndent) {
        throw new Error(`Unexpected indentation in YAML sequence: ${rawLine}`)
      }

      const trimmedLine = rawLine.trim()
      if (!trimmedLine.startsWith('- ')) {
        break
      }

      const itemValue = trimmedLine.slice(2).trim()
      index += 1

      if (itemValue === '') {
        items.push(parseBlock(expectedIndent + YAML_INDENT))
        continue
      }

      if (itemValue.includes(':')) {
        const firstEntry = splitKeyValue(itemValue)
        const objectValue: Record<string, unknown> = {
          [firstEntry.key]:
            firstEntry.value === undefined
              ? parseBlock(expectedIndent + YAML_INDENT)
              : parseScalar(firstEntry.value),
        }

        while (index < lines.length) {
          const nextLine = lines[index]
          const nextIndent = countIndent(nextLine)
          if (nextIndent < expectedIndent + YAML_INDENT) {
            break
          }
          if (nextIndent > expectedIndent + YAML_INDENT) {
            throw new Error(`Unexpected nested indentation in YAML object item: ${nextLine}`)
          }

          const nextEntry = splitKeyValue(nextLine.trim())
          index += 1
          objectValue[nextEntry.key] =
            nextEntry.value === undefined
              ? parseBlock(expectedIndent + YAML_INDENT * 2)
              : parseScalar(nextEntry.value)
        }

        items.push(objectValue)
        continue
      }

      items.push(parseScalar(itemValue))
    }

    return items
  }

  const parseMapping = (expectedIndent: number): Record<string, unknown> => {
    const objectValue: Record<string, unknown> = {}

    while (index < lines.length) {
      const rawLine = lines[index]
      const indent = countIndent(rawLine)
      if (indent < expectedIndent) {
        break
      }
      if (indent > expectedIndent) {
        throw new Error(`Unexpected indentation in YAML mapping: ${rawLine}`)
      }

      const { key, value } = splitKeyValue(rawLine.trim())
      index += 1
      objectValue[key] =
        value === undefined ? parseBlock(expectedIndent + YAML_INDENT) : parseScalar(value)
    }

    return objectValue
  }

  const parsed = parseBlock(0)

  if (index !== lines.length) {
    throw new Error('YAML parser did not consume the full document')
  }

  return parsed
}

function loadTsModule(filePath: string): unknown {
  const source = readFileSync(filePath, 'utf8')
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: filePath,
  }).outputText

  const module = { exports: {} as Record<string, unknown> }
  const script = new Script(transpiled, { filename: filePath })

  script.runInNewContext({
    module,
    exports: module.exports,
    require: (specifier: string) => {
      throw new Error(
        `Artifact TS modules must be self-contained. Unsupported import: ${specifier}`
      )
    },
    __dirname: dirname(filePath),
    __filename: filePath,
  })

  const exported = module.exports as Record<string, unknown>
  if ('default' in exported) {
    return exported.default
  }

  if ('schemaDigestArtifact' in exported) {
    return exported.schemaDigestArtifact
  }

  const values = Object.values(exported)
  if (values.length === 1) {
    return values[0]
  }

  throw new Error(`Unable to determine exported artifact payload from ${filePath}`)
}

function isArtifactDirectory(dirPath: string): boolean {
  return REQUIRED_ARTIFACT_FILES.every(fileName => existsSync(resolve(dirPath, fileName)))
}

export function resolveArtifactsDirectory(preferredDir?: string): string {
  const candidates = preferredDir
    ? [resolve(preferredDir)]
    : [resolve(__dirname), resolve(__dirname, '../../artifacts')]

  for (const candidate of candidates) {
    if (isArtifactDirectory(candidate)) {
      return candidate
    }
  }

  throw new Error(
    `Unable to locate ai-server artifacts directory from candidates: ${candidates.join(', ')}`
  )
}

export function resolveArtifactPaths(artifactsDir = resolveArtifactsDirectory()): ArtifactPaths {
  return {
    intentSchema: resolve(artifactsDir, ARTIFACT_FILE_NAMES.intentSchema),
    conceptDictionary: resolve(artifactsDir, ARTIFACT_FILE_NAMES.conceptDictionary),
    queryLibrary: resolve(artifactsDir, ARTIFACT_FILE_NAMES.queryLibrary),
    queryLibraryMetadata: resolve(artifactsDir, ARTIFACT_FILE_NAMES.queryLibraryMetadata),
    schemaDigest: resolve(artifactsDir, ARTIFACT_FILE_NAMES.schemaDigest),
  }
}

export function loadArtifactFile(filePath: string): unknown {
  if (filePath.endsWith('.json')) {
    return JSON.parse(readFileSync(filePath, 'utf8'))
  }

  if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    return parseYaml(readFileSync(filePath, 'utf8'))
  }

  if (filePath.endsWith('.ts')) {
    return loadTsModule(filePath)
  }

  throw new Error(`Unsupported artifact extension for ${filePath}`)
}

export function loadArtifactByKind(
  kind: ArtifactKind,
  filePath: string
):
  | IntentSchemaArtifact
  | ConceptDictionaryArtifact
  | QueryLibraryArtifact
  | QueryLibraryMetadataArtifact
  | SchemaDigestArtifact {
  const rawArtifact = loadArtifactFile(filePath)

  switch (kind) {
    case 'intent-schema':
      return validateIntentSchemaArtifact(rawArtifact)
    case 'concept-dictionary':
      return validateConceptDictionaryArtifact(rawArtifact)
    case 'query-library':
      return validateQueryLibraryArtifact(rawArtifact)
    case 'query-library-metadata':
      return validateQueryLibraryMetadataArtifact(rawArtifact)
    case 'schema-digest':
      return validateSchemaDigestArtifact(rawArtifact)
    default: {
      const exhaustiveCheck: never = kind
      throw new Error(`Unsupported artifact kind: ${exhaustiveCheck}`)
    }
  }
}

export function loadArtifacts(options: LoadArtifactsOptions = {}): LoadedArtifacts {
  const paths = resolveArtifactPaths(resolveArtifactsDirectory(options.artifactsDir))

  const loadedArtifacts: LoadedArtifacts = {
    intentSchema: loadArtifactByKind('intent-schema', paths.intentSchema) as IntentSchemaArtifact,
    conceptDictionary: loadArtifactByKind(
      'concept-dictionary',
      paths.conceptDictionary
    ) as ConceptDictionaryArtifact,
    queryLibrary: loadArtifactByKind('query-library', paths.queryLibrary) as QueryLibraryArtifact,
    queryLibraryMetadata: loadArtifactByKind(
      'query-library-metadata',
      paths.queryLibraryMetadata
    ) as QueryLibraryMetadataArtifact,
    schemaDigest: loadArtifactByKind('schema-digest', paths.schemaDigest) as SchemaDigestArtifact,
  }

  return validateLoadedArtifacts(loadedArtifacts)
}
