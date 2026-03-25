import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

interface CliOptions {
  user?: string
  password?: string
  tokenUrl?: string
  realm?: string
  clientId?: string
  help: boolean
}

const printHelp = (): void => {
  console.log(`Usage: yarn set:token --user <username> --passwort <password> [options]

Required:
  --user <username>          Keycloak username
  --passwort <password>      Keycloak password

Options:
  --token-url <url>          Full token endpoint URL
  --realm <name>             Keycloak realm (default: KEYCLOAK_REALM or nextgen-eam)
  --client-id <id>           OAuth client id (default: KEYCLOAK_CLIENT_ID_CLIENT or eam-client)
  --help, -h                 Show this help message

Examples:
  yarn set:token --user alice --passwort 'secret'
  yarn set:token --user alice --passwort 'secret' --client-id eam-client
  yarn set:token --user alice --passwort 'secret' --token-url http://localhost:8280/realms/nextgen-eam/protocol/openid-connect/token
`)
}

const loadEnvironment = (): void => {
  const envCandidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../.env'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '../.env.local'),
  ]

  for (const envPath of envCandidates) {
    if (!fs.existsSync(envPath)) {
      continue
    }

    const result = dotenv.config({ path: envPath, override: false })
    dotenvExpand.expand(result)
  }
}

const parseArgs = (): CliOptions => {
  loadEnvironment()

  const args = process.argv.slice(2)
  const options: CliOptions = { help: false }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const next = args[i + 1]

    if ((arg === '--help' || arg === '-h') && !next) {
      options.help = true
      continue
    }

    if (arg === '--help' || arg === '-h') {
      options.help = true
      continue
    }

    if (arg === '--user' && next) {
      options.user = next
      i++
      continue
    }

    if ((arg === '--passwort' || arg === '--password') && next) {
      options.password = next
      i++
      continue
    }

    if (arg === '--token-url' && next) {
      options.tokenUrl = next
      i++
      continue
    }

    if (arg === '--realm' && next) {
      options.realm = next
      i++
      continue
    }

    if (arg === '--client-id' && next) {
      options.clientId = next
      i++
      continue
    }
  }

  return options
}

const buildDefaultTokenUrl = (realm: string): string => {
  const externalPort = process.env.KEYCLOAK_EXTERNAL_PORT?.trim()
  if (externalPort) {
    return `http://localhost:${externalPort}/realms/${realm}/protocol/openid-connect/token`
  }

  return `http://localhost:8280/realms/${realm}/protocol/openid-connect/token`
}

const requestToken = async (tokenUrl: string, clientId: string, user: string, password: string) => {
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: clientId,
    username: user,
    password,
  })

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const payload = (await response.json()) as {
    access_token?: string
    error?: string
    error_description?: string
  }

  if (!response.ok || !payload.access_token) {
    const message = payload.error_description || payload.error || `HTTP ${response.status}`
    throw new Error(`Token request failed: ${message}`)
  }

  return payload.access_token
}

const main = async (): Promise<void> => {
  const options = parseArgs()

  if (options.help) {
    printHelp()
    return
  }

  if (!options.user || !options.password) {
    console.error('Error: Missing required arguments --user and --passwort')
    console.error('Run with --help to see usage.')
    process.exit(1)
  }

  const realm = options.realm || process.env.KEYCLOAK_REALM || 'nextgen-eam'
  const clientId = options.clientId || process.env.KEYCLOAK_CLIENT_ID_CLIENT || 'eam-client'
  const tokenUrl = options.tokenUrl || buildDefaultTokenUrl(realm)

  const token = await requestToken(tokenUrl, clientId, options.user, options.password)

  console.log('Token created successfully.')
  console.log('Run this in your shell to use it for imports:')
  console.log(`export IMPORT_AUTH_TOKEN="Bearer ${token}"`)
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
