#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Pfad zur Library-Datei
const libraryPath = path.join(__dirname, 'client/public/libraries/archimate-symbols.excalidrawlib')

function normalizeTemplate(elements) {
  if (!elements || elements.length === 0) {
    return elements
  }

  // Finde die minimalen x- und y-Koordinaten
  let minX = Infinity
  let minY = Infinity

  elements.forEach(element => {
    if (typeof element.x === 'number' && typeof element.y === 'number') {
      minX = Math.min(minX, element.x)
      minY = Math.min(minY, element.y)
    }
  })

  // Falls keine gültigen Koordinaten gefunden wurden, keine Änderung
  if (minX === Infinity || minY === Infinity) {
    return elements
  }

  // Verschiebe alle Elemente so, dass das Template bei (0,0) beginnt
  const offsetX = -minX
  const offsetY = -minY

  return elements.map(element => {
    const normalizedElement = { ...element }

    if (typeof element.x === 'number') {
      normalizedElement.x = element.x + offsetX
    }

    if (typeof element.y === 'number') {
      normalizedElement.y = element.y + offsetY
    }

    // Für Linien auch die Points normalisieren
    if (element.type === 'line' && element.points) {
      // Points sind relative Koordinaten, bleiben unverändert
      // da sie bereits relativ zum Start-Punkt sind
    }

    return normalizedElement
  })
}

function normalizeLibrary() {
  try {
    console.log('Lese Library-Datei...')
    const libraryContent = fs.readFileSync(libraryPath, 'utf8')
    const library = JSON.parse(libraryContent)

    console.log(`Gefunden: ${library.libraryItems.length} Library Items`)

    // Normalisiere jedes Template
    library.libraryItems = library.libraryItems.map((item, index) => {
      console.log(`Normalisiere Template ${index + 1}: "${item.name}"`)

      const originalElements = item.elements
      const normalizedElements = normalizeTemplate(originalElements)

      // Zeige die Verschiebung an
      if (originalElements.length > 0) {
        const originalMinX = Math.min(...originalElements.map(e => e.x || 0))
        const originalMinY = Math.min(...originalElements.map(e => e.y || 0))
        const newMinX = Math.min(...normalizedElements.map(e => e.x || 0))
        const newMinY = Math.min(...normalizedElements.map(e => e.y || 0))

        console.log(`  Vorher: min x=${originalMinX.toFixed(2)}, y=${originalMinY.toFixed(2)}`)
        console.log(`  Nachher: min x=${newMinX.toFixed(2)}, y=${newMinY.toFixed(2)}`)
        console.log(
          `  Verschiebung: dx=${(newMinX - originalMinX).toFixed(2)}, dy=${(newMinY - originalMinY).toFixed(2)}`
        )
      }

      return {
        ...item,
        elements: normalizedElements,
      }
    })

    // Erstelle Backup der ursprünglichen Datei
    const backupPath = libraryPath + '.backup.' + Date.now()
    console.log(`Erstelle Backup: ${backupPath}`)
    fs.copyFileSync(libraryPath, backupPath)

    // Schreibe normalisierte Library zurück
    console.log('Schreibe normalisierte Library...')
    fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2))

    console.log('✅ Normalisierung erfolgreich abgeschlossen!')
    console.log('📁 Backup erstellt unter:', backupPath)
  } catch (error) {
    console.error('❌ Fehler bei der Normalisierung:', error.message)
    process.exit(1)
  }
}

// Führe die Normalisierung aus
normalizeLibrary()
