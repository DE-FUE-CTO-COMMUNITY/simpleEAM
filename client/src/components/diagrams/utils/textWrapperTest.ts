/**
 * Test-Datei für die Hypher-basierte Textumbruch-Funktionalität
 * Kann in der Entwicklung verwendet werden, um die Textumbruch-Logik zu testen
 */

import {
  wrapTextToFitWidth,
  calculateOptimalTextDimensions,
  normalizeText,
  prepareTextForDatabase,
} from './textContainerUtils'

// Mock Container-Element für Tests
const mockContainer = {
  id: 'test-container',
  type: 'rectangle' as const,
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  angle: 0,
  strokeColor: '#000000',
  backgroundColor: 'transparent',
  fillStyle: 'solid' as const,
  strokeWidth: 2,
  strokeStyle: 'solid' as const,
  roughness: 1,
  opacity: 100,
  groupIds: [],
  frameId: null,
  index: 'a0',
  roundness: null,
  seed: 123456,
  versionNonce: 123456,
  isDeleted: false,
  boundElements: undefined,
  updated: 1,
  link: null,
  locked: false,
  version: 1,
  customData: {
    isFromDatabase: true,
    databaseId: 'test-id',
  },
}

/**
 * Test-Funktion für deutsche Silbentrennung
 */
export const testGermanHyphenation = () => {
  const testTexts = [
    'Geschäftsprozessmanagement',
    'Informationsverarbeitung',
    'Datenverarbeitungsanlage',
    'Softwareentwicklung',
    'Kommunikationsschnittstelle',
    'Automatisierungsverfahren',
    'Qualitätssicherung',
    'Unternehmensarchitektur',
  ]

  console.log('=== Test: Deutsche Silbentrennung ===')
  testTexts.forEach(text => {
    const wrapped = wrapTextToFitWidth(text, 150, 16, 'Arial')
    console.log(`Original: "${text}"`)
    console.log(`Umgebrochen: "${wrapped}"`)
    console.log('---')
  })
}

/**
 * Test-Funktion für englische Silbentrennung
 */
export const testEnglishHyphenation = () => {
  const testTexts = [
    'Business Process Management',
    'Information Processing',
    'Data Processing System',
    'Software Development',
    'Communication Interface',
    'Automation Procedures',
    'Quality Assurance',
    'Enterprise Architecture',
  ]

  console.log('=== Test: Englische Silbentrennung ===')
  testTexts.forEach(text => {
    const wrapped = wrapTextToFitWidth(text, 150, 16, 'Arial')
    console.log(`Original: "${text}"`)
    console.log(`Wrapped: "${wrapped}"`)
    console.log('---')
  })
}

/**
 * Test-Funktion für Textdimensionsberechnung
 */
export const testTextDimensions = () => {
  const testTexts = [
    'Kurz',
    'Mittlerer Text',
    'Sehr langer Text mit vielen Wörtern',
    'Geschäftsprozessmanagement\nund Informationsverarbeitung',
  ]

  console.log('=== Test: Textdimensionsberechnung ===')
  testTexts.forEach(text => {
    const dimensions = calculateOptimalTextDimensions(text, mockContainer, 16, 'Arial')
    console.log(`Text: "${text.replace(/\n/g, '\\n')}"`)
    console.log(`Dimensionen: ${dimensions.width}x${dimensions.height}`)
    console.log(`Umgebrochener Text: "${dimensions.wrappedText.replace(/\n/g, '\\n')}"`)
    console.log('---')
  })
}

/**
 * Test-Funktion für verschiedene Container-Größen
 */
export const testDifferentContainerSizes = () => {
  const testText = 'Geschäftsprozessmanagement und Informationsverarbeitung'
  const containerSizes = [
    { width: 100, height: 60 },
    { width: 150, height: 80 },
    { width: 200, height: 100 },
    { width: 300, height: 120 },
  ]

  console.log('=== Test: Verschiedene Container-Größen ===')
  containerSizes.forEach(size => {
    const testContainer = { ...mockContainer, width: size.width, height: size.height }
    const dimensions = calculateOptimalTextDimensions(testText, testContainer, 16, 'Arial')
    console.log(`Container: ${size.width}x${size.height}`)
    console.log(`Text-Dimensionen: ${dimensions.width}x${dimensions.height}`)
    console.log(`Umgebrochener Text: "${dimensions.wrappedText.replace(/\n/g, '\\n')}"`)
    console.log('---')
  })
}

/**
 * Test-Funktion für die Textnormalisierung
 * Prüft, ob nur Silbentrennungsstriche entfernt werden, legitime Bindestriche aber erhalten bleiben
 */
export const testTextNormalization = () => {
  const testCases = [
    {
      input: 'Hauptrechenzentr-\num München',
      expected: 'Hauptrechenzentrum München',
      description: 'Silbentrennstrich vor Zeilenumbruch mit Leerzeichen',
    },
    {
      input: 'Geschäfts-\nprozess',
      expected: 'Geschäftsprozess',
      description: 'Silbentrennstrich vor Zeilenumbruch',
    },
    {
      input: 'Backup-Rechenzentrum',
      expected: 'Backup-Rechenzentrum',
      description: 'Legitimer Bindestrich in Namen (sollte erhalten bleiben)',
    },
    {
      input: 'Informa-\ntionsverarbeitung',
      expected: 'Informationsverarbeitung',
      description: 'Silbentrennstrich in zusammengesetztem Wort',
    },
    {
      input: 'Software-\nentwicklung und Quality-\nAssurance',
      expected: 'Softwareentwicklung und QualityAssurance',
      description: 'Mehrere Silbentrennstriche vor Zeilenumbrüchen',
    },
    {
      input: 'End-to-End-System',
      expected: 'End-to-End-System',
      description: 'Mehrere legitime Bindestriche (sollten erhalten bleiben)',
    },
    {
      input: 'Client-Server-\nArchitektur',
      expected: 'Client-Server-Architektur',
      description: 'Kombination aus legitimen und Silbentrennstrichen',
    },
    {
      input: 'Haupt- rechenzentrum',
      expected: 'Hauptrechenzentrum',
      description: 'Silbentrennstrich mit Leerzeichen (sollte entfernt werden)',
    },
    {
      input: 'Normaler Text ohne Trennung',
      expected: 'Normaler Text ohne Trennung',
      description: 'Text ohne Trennstriche',
    },
  ]

  console.log('=== Test: Textnormalisierung (Erweitert) ===')
  testCases.forEach(({ input, expected, description }) => {
    const normalizedResult = normalizeText(input)
    const databaseResult = prepareTextForDatabase(input)

    console.log(`Test: ${description}`)
    console.log(`  Input: "${input.replace(/\n/g, '\\n')}"`)
    console.log(`  Expected: "${expected}"`)
    console.log(`  Normalized: "${normalizedResult}"`)
    console.log(`  Database: "${databaseResult}"`)
    console.log(`  ✓ Normalize OK: ${normalizedResult === expected}`)
    console.log(`  ✓ Database OK: ${databaseResult === expected}`)
    console.log('---')
  })
}

/**
 * Führt alle Tests aus
 */
export const runAllTests = () => {
  testGermanHyphenation()
  testEnglishHyphenation()
  testTextDimensions()
  testDifferentContainerSizes()
  testTextNormalization()
}

// Beispiel für die Verwendung in der Entwicklung:
// import { runAllTests } from './textWrapperTest'
// runAllTests()
