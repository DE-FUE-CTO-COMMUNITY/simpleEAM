// Gemeinsame Hilfsfunktionen für Text-Container-Bindungen in Excalidraw-Elementen

interface ExcalidrawElement {
  id: string
  type: string
  containerId?: string | null
  boundElements?: Array<{ type: string; id: string }>
  customData?: any
  x?: number
  y?: number
  width?: number
  height?: number
  text?: string
  rawText?: string
  originalText?: string
  textAlign?: string
  verticalAlign?: string
  fontSize?: number
  [key: string]: any
}

/**
 * Normalisiert Text für Vergleiche (entfernt Zeilenumbrüche und trimmt)
 */
export const normalizeText = (text: string | undefined | null): string => {
  if (!text) return ''
  return text.replace(/\r?\n/g, ' ').trim()
}

/**
 * Aktualisiert Text-Inhalt und stellt sicher, dass Container-Bindungen erhalten bleiben
 */
export const updateTextWithContainerBinding = (
  textElement: ExcalidrawElement,
  newText: string,
  containerElement?: ExcalidrawElement
): ExcalidrawElement => {
  const updatedText = {
    ...textElement,
    text: newText,
    rawText: newText,
    originalText: newText,
  }

  // Stelle sicher, dass containerId gesetzt ist, wenn Container vorhanden
  if (containerElement && !updatedText.containerId) {
    updatedText.containerId = containerElement.id
  }

  // KRITISCH: Behalte ursprüngliches Text-Alignment bei (nicht überschreiben!)
  // Verwende ?? statt || um explizit gesetzte leere Strings zu respektieren
  if (updatedText.textAlign === undefined || updatedText.textAlign === null) {
    updatedText.textAlign = 'center'
  }
  if (updatedText.verticalAlign === undefined || updatedText.verticalAlign === null) {
    updatedText.verticalAlign = 'middle'
  }

  // KRITISCH: Nur Position neu berechnen wenn Text keine gültige Position hat
  // Dies verhindert das Überschreiben von benutzerdefinierten Positionen
  const hasValidPosition =
    updatedText.x !== undefined &&
    updatedText.y !== undefined &&
    updatedText.x !== 0 &&
    updatedText.y !== 0

  if (
    containerElement &&
    containerElement.x !== undefined &&
    containerElement.y !== undefined &&
    !hasValidPosition
  ) {
    const fontSize = updatedText.fontSize || 20

    // Verwende die einheitliche calculateCenteredTextPosition Funktion für konsistente Zentrierung
    const centeredPosition = calculateCenteredTextPosition(newText, containerElement, fontSize)

    // Aktualisiere Text-Position und -Dimensionen nur wenn keine gültige Position vorhanden
    updatedText.x = centeredPosition.x
    updatedText.y = centeredPosition.y
    updatedText.width = centeredPosition.width
    updatedText.height = centeredPosition.height

    const lineCount = (newText.match(/\n/g) || []).length + 1
    console.log(
      `Repositioned ${lineCount}-line text "${newText}" to center of container (no valid position found):`,
      `Container: (${containerElement.x}, ${containerElement.y}, ${containerElement.width}x${containerElement.height})`,
      `Text: (${updatedText.x}, ${updatedText.y}, ${centeredPosition.width}x${centeredPosition.height})`
    )
  } else if (hasValidPosition) {
    console.log(
      `Preserving existing text position for "${newText}": (${updatedText.x}, ${updatedText.y}) with alignment: ${updatedText.textAlign}/${updatedText.verticalAlign}`
    )
  }

  return updatedText
}

/**
 * Deutsche Worttrennungsregeln (erweitert und verbessert)
 */
const germanHyphenationRules = {
  // Häufige Zusammensetzungsmuster (erweitert)
  compounds: [
    'heit',
    'keit',
    'ung',
    'ing',
    'lich',
    'isch',
    'bar',
    'los',
    'voll',
    'arm',
    'reich',
    'frei',
    'wert',
    'würdig',
    'schaft',
    'tum',
    'sam',
    'haft',
    'mäßig',
    'weise',
    'falls',
  ],
  // Vorsilben (erweitert)
  prefixes: [
    'ab',
    'an',
    'auf',
    'aus',
    'be',
    'bei',
    'durch',
    'ein',
    'ent',
    'er',
    'ge',
    'mit',
    'nach',
    'über',
    'um',
    'un',
    'unter',
    'ver',
    'vor',
    'zu',
    'zurück',
    'zwischen',
    'wieder',
    'weiter',
  ],
  // Wortteile die nicht getrennt werden sollen (erweitert)
  dontBreak: [
    'sch',
    'ch',
    'th',
    'ph',
    'qu',
    'ck',
    'tz',
    'st',
    'sp',
    'schr',
    'spr',
    'str',
    'thr',
    'phr',
    'bl',
    'br',
    'cl',
    'cr',
    'dr',
    'fl',
    'fr',
    'gl',
    'gr',
    'kl',
    'kr',
    'pl',
    'pr',
    'tr',
  ],
  // Bevorzugte Trennstellen (neue Kategorie)
  preferredBreaks: ['tion', 'sion', 'ität', 'ieren', 'ierung', 'lich', 'isch'],
}

/**
 * Intelligente deutsche Worttrennung (verbessert)
 */
const hyphenateGermanWord = (word: string, maxLength: number): string[] => {
  if (word.length <= maxLength) {
    return [word]
  }

  const lowerWord = word.toLowerCase()

  // 1. Priorität: Versuche Trennung an bevorzugten Stellen
  for (const preferredBreak of germanHyphenationRules.preferredBreaks) {
    const index = lowerWord.lastIndexOf(preferredBreak)
    if (index > 2 && index < word.length - 2) {
      const firstPart = word.substring(0, index)
      const secondPart = word.substring(index)

      if (firstPart.length <= maxLength && secondPart.length <= maxLength) {
        return [firstPart, secondPart]
      } else if (firstPart.length <= maxLength) {
        return [firstPart, ...hyphenateGermanWord(secondPart, maxLength)]
      }
    }
  }

  // 2. Priorität: Versuche Trennung an Zusammensetzungsmustern
  for (const suffix of germanHyphenationRules.compounds) {
    const index = lowerWord.lastIndexOf(suffix)
    if (index > 2 && index < word.length - 2) {
      const firstPart = word.substring(0, index)
      const secondPart = word.substring(index)

      if (firstPart.length <= maxLength && secondPart.length <= maxLength) {
        return [firstPart, secondPart]
      } else if (firstPart.length <= maxLength) {
        return [firstPart, ...hyphenateGermanWord(secondPart, maxLength)]
      }
    }
  }

  // 3. Priorität: Versuche Trennung nach Vorsilben
  for (const prefix of germanHyphenationRules.prefixes) {
    if (lowerWord.startsWith(prefix) && word.length > prefix.length + 2) {
      const firstPart = word.substring(0, prefix.length)
      const secondPart = word.substring(prefix.length)

      if (firstPart.length <= maxLength && secondPart.length <= maxLength) {
        return [firstPart, secondPart]
      } else if (secondPart.length <= maxLength) {
        return [...hyphenateGermanWord(firstPart, maxLength), secondPart]
      }
    }
  }

  // 4. Priorität: Intelligente Vokal-Konsonant-Trennung
  for (let i = Math.min(maxLength - 1, word.length - 3); i >= 3; i--) {
    const char = word[i].toLowerCase()
    const nextChar = word[i + 1]?.toLowerCase() || ''
    const prevChar = word[i - 1]?.toLowerCase() || ''

    // Prüfe Kombinationen die nicht getrennt werden sollen
    const beforeBreak = prevChar + char
    const afterBreak = char + nextChar
    const tripleBreak = prevChar + char + nextChar

    // Erweiterte Überprüfung für bessere Trennqualität
    const isValidBreakPoint =
      !germanHyphenationRules.dontBreak.includes(beforeBreak) &&
      !germanHyphenationRules.dontBreak.includes(afterBreak) &&
      !germanHyphenationRules.dontBreak.includes(tripleBreak) &&
      // Vokal vor Konsonant ist eine natürliche Trennstelle
      'aeiouäöü'.includes(prevChar) &&
      !'aeiouäöü'.includes(char) &&
      // Vermeide Trennung von Doppelkonsonanten
      !(char === nextChar) &&
      // Vermeide Trennung direkt vor oder nach 'h'
      !(char === 'h' || nextChar === 'h' || prevChar === 'h')

    if (isValidBreakPoint) {
      const firstPart = word.substring(0, i)
      const secondPart = word.substring(i)

      if (firstPart.length >= 3 && secondPart.length >= 3) {
        return [firstPart, ...hyphenateGermanWord(secondPart, maxLength)]
      }
    }
  }

  // 5. Letzter Ausweg: Intelligente harte Trennung
  // Versuche an besseren Stellen zu trennen als mitten im Wort
  const breakPoint = Math.min(maxLength - 1, word.length - 2)
  return [
    word.substring(0, breakPoint),
    ...hyphenateGermanWord(word.substring(breakPoint), maxLength),
  ]
}

/**
 * Wrapping-Funktion für Text basierend auf verfügbarer Breite
 *
 * ⚠️  KRITISCH: Diese Funktion ist AUSSCHLIESSLICH für die ANZEIGE gedacht! ⚠️
 *
 * Der ursprüngliche, ungetrennte Text MUSS für alle Datenbank-Operationen verwendet werden.
 * Diese Funktion dient nur dazu, Text für die visuelle Darstellung in Containern zu umbrechen.
 *
 * Verwendung:
 * - ✅ Für Anzeige und Layout-Berechnungen
 * - ❌ NIEMALS für Speicherung in Datenbank oder Element.text
 *
 * Beispiel:
 * - Original: "Qualitätssicherung"
 * - Anzeige: "Qualitäts-\nsicherung"
 * - Datenbank: "Qualitätssicherung" (Original bleibt unverändert!)
 */
export const wrapTextToFitWidth = (
  text: string,
  maxWidth: number,
  fontSize: number = 20
): string => {
  // Durchschnittliche Zeichenbreite basierend auf Schriftgröße
  const avgCharWidth = fontSize * 0.55

  // Maximale Zeichen pro Zeile berechnen
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth)

  // Wenn Text in eine Zeile passt, direkt zurückgeben
  if (text.length <= maxCharsPerLine) {
    return text
  }

  // Text in Wörter aufteilen (nur an echten Wortgrenzen)
  const words = text.split(/(\s+)/).filter(part => part.length > 0)
  const lines: string[] = []
  let currentLine = ''

  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    // Leerzeichen beibehalten
    if (/^\s+$/.test(word)) {
      if (currentLine.length + word.length <= maxCharsPerLine) {
        currentLine += word
      }
      continue
    }

    // Prüfen, ob das Hinzufügen dieses Wortes die Zeilenlänge überschreitet
    const testLine = currentLine + word

    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine
    } else {
      // Wenn aktuelle Zeile Inhalt hat, sie hinzufügen und neue Zeile beginnen
      if (currentLine.trim()) {
        lines.push(currentLine.trimEnd()) // Entferne nur nachfolgende Leerzeichen
        currentLine = ''
      }

      // Wenn einzelnes Wort zu lang ist, verwende intelligente deutsche Trennung
      if (word.length > maxCharsPerLine) {
        const hyphenatedParts = hyphenateGermanWord(word, maxCharsPerLine)

        // Füge alle Teile außer dem letzten zu den Zeilen hinzu
        for (let j = 0; j < hyphenatedParts.length - 1; j++) {
          lines.push(hyphenatedParts[j] + '-')
        }

        // Der letzte Teil wird zur aktuellen Zeile
        currentLine = hyphenatedParts[hyphenatedParts.length - 1]
      } else {
        currentLine = word
      }
    }
  }

  // Letzte Zeile hinzufügen, wenn sie Inhalt hat
  if (currentLine.trim()) {
    lines.push(currentLine.trimEnd())
  }

  // Auf maximal 2 Zeilen begrenzen für bessere Formatierung in Library-Elementen
  if (lines.length > 2) {
    const lastLine = lines[1]
    const maxLastLineLength = Math.max(0, maxCharsPerLine - 3)
    lines[1] =
      lastLine.length > maxLastLineLength
        ? lastLine.substring(0, maxLastLineLength) + '...'
        : lastLine
    return lines.slice(0, 2).join('\n')
  }

  return lines.join('\n')
}

/**
 * Findet das zugehörige Text-Element für ein Container-Element
 * Verwendet verschiedene Strategien für robuste Verknüpfung
 */
export const findLinkedTextElement = (
  containerElement: ExcalidrawElement,
  allElements: ExcalidrawElement[]
): ExcalidrawElement | null => {
  if (!containerElement.customData?.isFromDatabase) return null

  // Strategie 1: Direct boundElements Verknüpfung
  if (containerElement.boundElements) {
    const textBound = containerElement.boundElements.find(bound => bound.type === 'text')
    if (textBound) {
      const textElement = allElements.find(el => el.id === textBound.id)
      if (textElement) return textElement
    }
  }

  // Strategie 2: Text-Element mit containerId
  const textWithContainer = allElements.find(
    el => el.type === 'text' && el.containerId === containerElement.id
  )
  if (textWithContainer) return textWithContainer

  // Strategie 3: Text-Element mit mainElementId Verweis
  const textWithMainRef = allElements.find(
    el => el.type === 'text' && el.customData?.mainElementId === containerElement.id
  )
  if (textWithMainRef) return textWithMainRef

  // Strategie 4: Text-Element mit gleicher databaseId
  if (containerElement.customData?.databaseId) {
    const textWithSameDbId = allElements.find(
      el =>
        el.type === 'text' && el.customData?.databaseId === containerElement.customData.databaseId
    )
    if (textWithSameDbId) return textWithSameDbId
  }

  // Strategie 5: Proximity-basierte Suche
  if (containerElement.x !== undefined && containerElement.y !== undefined) {
    const tolerance = 100
    const nearbyTexts = allElements.filter(
      el =>
        el.type === 'text' &&
        el.x !== undefined &&
        el.y !== undefined &&
        Math.abs(el.x - containerElement.x!) < tolerance &&
        Math.abs(el.y - containerElement.y!) < tolerance
    )

    // Von den nahen Texten, finde den mit passendem Inhalt
    if (containerElement.customData?.originalElement?.name) {
      const expectedName = normalizeText(containerElement.customData.originalElement.name)
      for (const textEl of nearbyTexts) {
        const textContent = normalizeText(textEl.text || textEl.rawText)
        if (
          textContent.includes(expectedName.split(' ')[0]) ||
          expectedName.includes(textContent.split(' ')[0])
        ) {
          return textEl
        }
      }
    }

    // Fallback: Nächster Text-Element
    if (nearbyTexts.length > 0) {
      return nearbyTexts[0]
    }
  }

  return null
}

/**
 * Stellt sicher, dass Text-Container-Bindungen korrekt sind
 * Dies ist kritisch für korrekte Textdarstellung in Excalidraw
 */
export const ensureTextContainerBindings = (elements: ExcalidrawElement[]): ExcalidrawElement[] => {
  const textElements = elements.filter(el => el.type === 'text')
  const containerElements = elements.filter(
    el => el.type === 'rectangle' || el.type === 'diamond' || el.type === 'ellipse'
  )

  // Map für ID-Updates
  const updatedElements = [...elements]

  textElements.forEach(textEl => {
    if (textEl.containerId) {
      // Text hat einen Container - stelle sicher, dass die Bindung bidirektional ist
      const containerIndex = updatedElements.findIndex(el => el.id === textEl.containerId)

      if (containerIndex !== -1) {
        const container = updatedElements[containerIndex]

        // Stelle sicher, dass der Container boundElements hat
        if (!container.boundElements) {
          container.boundElements = []
        }

        // Prüfe, ob die Text-Bindung bereits vorhanden ist
        const hasTextBinding = container.boundElements.some(bound => bound.id === textEl.id)

        if (!hasTextBinding) {
          container.boundElements.push({
            type: 'text',
            id: textEl.id,
          })
          console.log(`Added text binding for container ${container.id} -> text ${textEl.id}`)
        }

        // Nur Bindungen sicherstellen, Position NICHT ändern während Sync
        // Die Repositionierung sollte nur bei neu erstellten Elementen erfolgen
        const textIndex = updatedElements.findIndex(el => el.id === textEl.id)
        if (textIndex !== -1) {
          const currentText = updatedElements[textIndex]
          const hasValidPosition =
            currentText.x !== undefined &&
            currentText.y !== undefined &&
            currentText.x !== 0 &&
            currentText.y !== 0

          if (!hasValidPosition) {
            // Nur repositionieren wenn keine gültige Position vorhanden (neues Element)
            const updatedTextElement = updateTextWithContainerBinding(
              currentText,
              textEl.text || textEl.rawText || '',
              container
            )
            updatedElements[textIndex] = updatedTextElement
            console.log(`Repositioned new text element ${textEl.id} in container ${container.id}`)
          } else {
            // Nur containerId setzen, Position beibehalten
            if (!currentText.containerId) {
              updatedElements[textIndex] = {
                ...currentText,
                containerId: container.id,
              }
              console.log(
                `Set containerId for existing text ${textEl.id} -> container ${container.id} (position preserved)`
              )
            }
          }
        }
      }
    } else {
      // Text hat keinen Container - versuche einen zu finden basierend auf boundElements
      const potentialContainer = containerElements.find(container =>
        container.boundElements?.some(bound => bound.type === 'text' && bound.id === textEl.id)
      )

      if (potentialContainer) {
        const textIndex = updatedElements.findIndex(el => el.id === textEl.id)
        if (textIndex !== -1) {
          const currentText = updatedElements[textIndex]
          const hasValidPosition =
            currentText.x !== undefined &&
            currentText.y !== undefined &&
            currentText.x !== 0 &&
            currentText.y !== 0

          if (!hasValidPosition) {
            // Nur repositionieren wenn keine gültige Position vorhanden (neues Element)
            const updatedTextElement = updateTextWithContainerBinding(
              currentText,
              textEl.text || textEl.rawText || '',
              potentialContainer
            )
            updatedElements[textIndex] = updatedTextElement
            console.log(
              `Set containerId and repositioned new text ${textEl.id} -> container ${potentialContainer.id}`
            )
          } else {
            // Nur containerId setzen, Position beibehalten
            updatedElements[textIndex] = {
              ...currentText,
              containerId: potentialContainer.id,
            }
            console.log(
              `Set containerId for existing text ${textEl.id} -> container ${potentialContainer.id} (position preserved)`
            )
          }
        }
      }
    }
  })

  return updatedElements
}

/**
 * Berechnet die optimale Text-Position und -Dimensionen für die Zentrierung
 * Diese Funktion wird sowohl in IntegratedLibrary als auch beim Synchronisieren verwendet
 */
export const calculateCenteredTextPosition = (
  text: string,
  containerElement: ExcalidrawElement,
  fontSize: number = 20
): { x: number; y: number; width: number; height: number } => {
  const lineCount = (text.match(/\n/g) || []).length + 1

  // Berechne Text-Dimensionen entsprechend der IntegratedLibrary-Logik
  let estimatedWidth: number
  let estimatedHeight: number

  if (lineCount === 1) {
    // Einzeilige Texte: Präzisere Berechnung basierend auf Zeichenanzahl
    estimatedWidth = Math.min(text.length * fontSize * 0.6, (containerElement.width || 200) - 20)
    estimatedHeight = fontSize * 1.2
  } else {
    // Mehrzeilige Texte: Verwende die längste Zeile
    const maxLineLength = Math.max(...text.split('\n').map(line => line.length))
    estimatedWidth = Math.min(maxLineLength * fontSize * 0.6, (containerElement.width || 200) - 20)
    estimatedHeight = lineCount * fontSize * 1.2
  }

  // Berechne Container-Zentrum
  const containerCenterX = (containerElement.x || 0) + (containerElement.width || 0) / 2
  const containerCenterY = (containerElement.y || 0) + (containerElement.height || 0) / 2

  // Positioniere Text genau im Zentrum
  const x = containerCenterX - estimatedWidth / 2
  const y = containerCenterY - estimatedHeight / 2

  return {
    x,
    y,
    width: estimatedWidth,
    height: estimatedHeight,
  }
}

/**
 * Aktualisiert nur den Text-Inhalt ohne Position oder Alignment zu verändern
 * Diese Funktion wird für Datenbank-Synchronisation verwendet, um bestehende Positionen zu erhalten
 */
export const updateTextContentOnly = (
  textElement: ExcalidrawElement,
  newText: string
): ExcalidrawElement => {
  return {
    ...textElement,
    text: newText,
    rawText: newText,
    originalText: newText,
  }
}
