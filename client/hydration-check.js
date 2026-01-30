#!/usr/bin/env node

/**
 * Hydration-Fehler Check Script für Simple-EAM Client
 * Dieses Script überprüft häufige Hydration-Problemquellen
 */

const fs = require('fs')
const path = require('path')

const srcDir = path.join(__dirname, 'src')

// Hydration-Problempatterns
const hydrationIssues = [
  {
    name: 'Direct Date.now() oder new Date() ohne SSR-Schutz',
    pattern: /(?:Date\.now\(\)|new Date\(\))(?![^{]*suppressHydrationWarning)/g,
    severity: 'HIGH',
  },
  {
    name: 'Math.random() ohne SSR-Schutz',
    pattern: /Math\.random\(\)(?![^{]*suppressHydrationWarning)/g,
    severity: 'HIGH',
  },
  {
    name: 'window/document Zugriff ohne typeof window check',
    pattern: /(?:window\.|document\.)(?![^{]*typeof window)/g,
    severity: 'MEDIUM',
  },
  {
    name: 'localStorage/sessionStorage ohne SSR-Schutz',
    pattern: /(?:localStorage|sessionStorage)\.(?![^{]*typeof window)/g,
    severity: 'HIGH',
  },
  {
    name: 'useEffect ohne Dependency Array',
    pattern: /useEffect\([^}]*\}\s*\)(?!\s*,\s*\[)/g,
    severity: 'MEDIUM',
  },
  {
    name: 'Inline styles mit dynamischen Werten',
    pattern: /style=\{\{[^}]*\${[^}]*\}[^}]*\}\}/g,
    severity: 'MEDIUM',
  },
  {
    name: 'Conditional rendering basierend auf client-only state',
    pattern: /\{(?:window|document|localStorage).*?\?/g,
    severity: 'HIGH',
  },
]

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const issues = []

  hydrationIssues.forEach(issue => {
    const matches = content.match(issue.pattern)
    if (matches) {
      matches.forEach(match => {
        const lines = content.substring(0, content.indexOf(match)).split('\n')
        issues.push({
          file: filePath,
          line: lines.length,
          issue: issue.name,
          severity: issue.severity,
          code: match.trim(),
        })
      })
    }
  })

  return issues
}

function scanDirectory(dir) {
  const allIssues = []

  function scan(currentDir) {
    const items = fs.readdirSync(currentDir)

    items.forEach(item => {
      const itemPath = path.join(currentDir, item)
      const stat = fs.statSync(itemPath)

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(itemPath)
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        const issues = scanFile(itemPath)
        allIssues.push(...issues)
      }
    })
  }

  scan(dir)
  return allIssues
}

console.log('🔍 Scanning for potential hydration issues...\n')

const issues = scanDirectory(srcDir)

if (issues.length === 0) {
  console.log('✅ No obvious hydration issues found!')
} else {
  console.log(`⚠️  Found ${issues.length} potential hydration issues:\n`)

  // Gruppiere nach Severity
  const grouped = issues.reduce((acc, issue) => {
    if (!acc[issue.severity]) acc[issue.severity] = []
    acc[issue.severity].push(issue)
    return acc
  }, {})

  ;['HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
    if (grouped[severity]) {
      console.log(`\n🚨 ${severity} PRIORITY (${grouped[severity].length} issues):`)
      grouped[severity].forEach(issue => {
        console.log(`  📍 ${issue.file}:${issue.line}`)
        console.log(`     ${issue.issue}`)
        console.log(`     Code: ${issue.code}`)
        console.log('')
      })
    }
  })
}

console.log('\n🔧 Hydration Best Practices:')
console.log('1. Use useEffect for client-only code')
console.log('2. Add suppressHydrationWarning for unavoidable differences')
console.log('3. Use typeof window !== "undefined" checks')
console.log('4. Initialize state consistently on server and client')
console.log('5. Avoid conditional rendering based on client-only APIs')
