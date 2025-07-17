// Test der normalizeText Funktion
const normalizeText = text => {
  if (!text) return ''

  return text
    .replace(/\r?\n/g, ' ') // Zeilenumbrüche durch Leerzeichen ersetzen
    .replace(/-\s*\n\s*/g, '') // Trennstriche vor Zeilenumbrüchen entfernen
    .replace(/\n\s*-\s*/g, '') // Trennstriche nach Zeilenumbrüchen entfernen
    .replace(/\u00AD/g, '') // Entferne weiche Trennstriche (soft hyphens) für Synchronisation
    .replace(/([a-zA-ZäöüÄÖÜß])-\s+([a-zA-ZäöüÄÖÜß])/g, '$1$2') // WICHTIG: Entferne Hypher-Trennungen wie "Hauptrechenzentr- um"
    .replace(/\s+/g, ' ') // Mehrfache Leerzeichen durch einzelne ersetzen
    .trim()
}

// Test cases
const testCases = [
  'Hauptrechenzentr- um München',
  'Hauptrechenzentrum München',
  'Test- text mit Trennung',
  'Backup-Rechenzentrum', // Legitimer Bindestrich soll bleiben
  'Haupt- rechenzentr- um', // Multiple Trennungen
]

console.log('Testing normalizeText function:')
testCases.forEach(test => {
  const result = normalizeText(test)
  console.log(`"${test}" -> "${result}"`)
})
