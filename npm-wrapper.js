#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Prüfen, ob der Befehl yarn addst
const args = process.argv.slice(2)
const command = process.argv[1].split('/').pop()

if (command === 'npm') {
  console.log('\x1b[31m🚫 yarn addst in diesem Projekt gesperrt!\x1b[0m')
  console.log('\x1b[33mℹ️  Bitte verwenden Sie stattdessen Yarn Berry:\x1b[0m')

  if (args[0] === 'install' || args[0] === 'i') {
    console.log(`\x1b[32m$ yarn add ${args.slice(1).join(' ')}\x1b[0m`)
  } else if (args[0] === 'ci') {
    console.log(`\x1b[32m$ yarn install --immutable\x1b[0m`)
  } else if (args[0] === 'run') {
    console.log(`\x1b[32m$ yarn ${args.slice(1).join(' ')}\x1b[0m`)
  } else if (args[0] === 'update') {
    console.log(`\x1b[32m$ yarn up ${args.slice(1).join(' ')}\x1b[0m`)
  } else {
    console.log(`\x1b[32m$ yarn ${args.join(' ')}\x1b[0m`)
  }

  process.exit(1)
}

// Auch yarn dlx abfangen
if (command === 'npx') {
  console.log('\x1b[31m🚫 yarn dlx ist in diesem Projekt gesperrt!\x1b[0m')
  console.log('\x1b[33mℹ️  Bitte verwenden Sie stattdessen Yarn Berry:\x1b[0m')
  console.log(`\x1b[32m$ yarn dlx ${args.join(' ')}\x1b[0m`)
  process.exit(1)
}

// Den ursprünglichen Befehl ausführen
try {
  execSync(`${command} ${args.join(' ')}`, { stdio: 'inherit' })
} catch (error) {
  process.exit(error.status || 1)
}
