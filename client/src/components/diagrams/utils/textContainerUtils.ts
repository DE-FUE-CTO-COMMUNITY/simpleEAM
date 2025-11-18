// Gemeinsame Hilfsfunktionen für Text-Container-Bindungen in Excalidraw-Elementen
import Hypher from 'hypher'
import german from 'hyphenation.de'
import english from 'hyphenation.en-us'

// Initialisiere Hypher-Instanzen für verschiedene Sprachen
const hypherDE = new Hypher(german)
const hypherEN = new Hypher(english)

// Sprachenerkennung basierend auf häufigen deutschen Wörtern
const germanWords = new Set([
  'und',
  'der',
  'die',
  'das',
  'ist',
  'in',
  'zu',
  'den',
  'von',
  'mit',
  'für',
  'auf',
  'ein',
  'eine',
  'sich',
  'nicht',
  'werden',
  'haben',
  'sein',
  'können',
  'werden',
  'oder',
  'auch',
  'nach',
  'über',
  'durch',
  'wenn',
  'nur',
  'um',
  'aus',
  'an',
  'bei',
  'noch',
  'wie',
  'einem',
  'einer',
  'sein',
  'management',
  'unternehmen',
  'geschäft',
  'prozess',
  'system',
  'anwendung',
  'daten',
  'information',
  'architektur',
  'infrastruktur',
  'schnittstelle',
  'fähigkeit',
  'applikation',
])

/**
 * Erkennt die Sprache eines Textes basierend auf häufigen Wörtern
 */
const detectLanguage = (text: string): 'de' | 'en' => {
  const words = text.toLowerCase().split(/\s+/)
  const germanWordsFound = words.filter(word => germanWords.has(word)).length
  const threshold = Math.max(1, Math.floor(words.length * 0.1)) // 10% der Wörter

  return germanWordsFound >= threshold ? 'de' : 'en'
}

/**
 * Holt die passende Hypher-Instanz für die erkannte Sprache
 */
const getHypherForLanguage = (language: 'de' | 'en'): Hypher => {
  return language === 'de' ? hypherDE : hypherEN
}

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
 * Normalisiert Text für Vergleiche (entfernt Zeilenumbrüche, Silbentrennstriche und trimmt)
 * WICHTIG: Entfernt nur Silbentrennungsstriche, die durch Hypher-Integration hinzugefügt wurden
 * Legitime Bindestriche in Namen (z.B. "Backup-Rechenzentrum") bleiben erhalten
 */
export const normalizeText = (text: string | undefined | null): string => {
  if (!text) return ''

  return text
    .replace(/\r?\n/g, ' ') // Zeilenumbrüche durch Leerzeichen ersetzen
    .replace(/-\s*\n\s*/g, '') // Trennstriche vor Zeilenumbrüchen remove
    .replace(/\n\s*-\s*/g, '') // Trennstriche nach Zeilenumbrüchen remove
    .replace(/\u00AD/g, '') // Entferne weiche Trennstriche (soft hyphens) für Synchronisation
    .replace(/([a-zA-ZäöüÄÖÜß])-\s+([a-zA-ZäöüÄÖÜß])/g, '$1$2') // WICHTIG: Entferne Hypher-Trennungen wie "Hauptrechenzentr- um"
    .replace(/\s+/g, ' ') // Mehrfache Leerzeichen durch einzelne ersetzen
    .trim()
}

/**
 * Bereitet Text für die Datenbank-Speicherung vor
 * Entfernt alle Formatierungen, die durch die Hypher-Integration hinzugefügt wurden
 * Legitime Bindestriche in Namen (z.B. "Backup-Rechenzentrum") bleiben erhalten
 */
export const prepareTextForDatabase = (text: string | undefined | null): string => {
  if (!text) return ''

  // Erste Normalisierung
  let normalized = normalizeText(text)

  // Entferne alle Trennstriche, die durch Textumbruch entstanden sind
  // aber nur solche, die Teil der Silbentrennung sind
  normalized = normalized
    .replace(/([a-zA-ZäöüÄÖÜß])-\s+([a-zA-ZäöüÄÖÜß])/g, '$1$2') // Trennstriche zwischen Wortteilen
    .replace(/\u00AD/g, '') // Entferne weiche Trennstriche (soft hyphens)
    .replace(/\.{3,}/g, '...') // Normalisiere Ellipsen
    .replace(/\s+/g, ' ') // Mehrfache Leerzeichen durch einzelne ersetzen
    .trim()

  return normalized
}

/**
 * Aktualisiert Text-Inhalt und stellt sicher, dass Container-Bindungen erhalten bleiben
 * WICHTIG: Verwendet normalisierten Text für die Datenbank-Speicherung
 */
export const updateTextWithContainerBinding = (
  textElement: ExcalidrawElement,
  newText: string,
  containerElement?: ExcalidrawElement
): ExcalidrawElement => {
  // Verwende normalisierten Text für die Datenbank-Speicherung
  // aber behalte den ursprünglichen Text für die Anzeige
  const normalizedText = prepareTextForDatabase(newText)

  const updatedText = {
    ...textElement,
    text: normalizedText, // Normalisierter Text für Datenbank
    rawText: normalizedText, // Normalisierter Text für Datenbank
    originalText: normalizedText, // Normalisierter Text für Datenbank
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
    // Aber verwende den ursprünglichen Text für die Positionsberechnung (bessere Darstellung)
    const centeredPosition = calculateCenteredTextPosition(newText, containerElement, fontSize)

    // Aktualisiere Text-Position und -Dimensionen nur wenn keine gültige Position vorhanden
    updatedText.x = centeredPosition.x
    updatedText.y = centeredPosition.y
    updatedText.width = centeredPosition.width
    updatedText.height = centeredPosition.height
  }

  return updatedText
}

/**
 * Erstellt ein virtuelles Canvas-Element für präzise Textmessung
 */
const createTextMeasureCanvas = (): CanvasRenderingContext2D => {
  const canvas = document.createElement('canvas')
  return canvas.getContext('2d')!
}

/**
 * Misst die tatsächliche Breite eines Textes basierend auf Canvas-Rendering
 */
const measureTextWidth = (text: string, fontSize: number, fontFamily: string = 'Arial'): number => {
  const ctx = createTextMeasureCanvas()
  ctx.font = `${fontSize}px ${fontFamily}`
  return ctx.measureText(text).width
}

/**
 * Erweiterte Wrapping-Funktion für Text mit intelligenter Silbentrennung
 * Verwendet Hypher für optimale Silbentrennung in verschiedenen Sprachen
 */
export const wrapTextToFitWidth = (
  text: string,
  maxWidth: number,
  fontSize: number = 20,
  fontFamily: string = 'Arial'
): string => {
  // Leer-Text handling
  if (!text || text.trim() === '') {
    return text
  }

  // Sprache erkennen und passende Hypher-Instanz wählen
  const language = detectLanguage(text)
  const hypher = getHypherForLanguage(language)

  // Prüfe ob Text bereits in eine Zeile passt
  if (measureTextWidth(text, fontSize, fontFamily) <= maxWidth) {
    return text
  }

  // Text in Wörter aufteilen
  const words = text.split(/\s+/).filter(word => word.trim())
  const lines: string[] = []
  let currentLine = ''

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const testLine = currentLine + (currentLine ? ' ' : '') + word

    // Prüfe ob das Wort in die aktuelle Zeile passt
    if (measureTextWidth(testLine, fontSize, fontFamily) <= maxWidth) {
      currentLine = testLine
    } else {
      // Aktuelle Zeile ist voll - füge sie zu den Zeilen hinzu
      if (currentLine) {
        lines.push(currentLine)
      }

      // Prüfe ob das einzelne Wort zu lang ist und getrennt werden muss
      if (measureTextWidth(word, fontSize, fontFamily) > maxWidth) {
        // Verwende Hypher für intelligente Silbentrennung
        const hyphenatedParts = hypher.hyphenate(word)
        let syllableIndex = 0

        // Verarbeite Silben und suche nach der ersten gültigen Trennstelle
        while (syllableIndex < hyphenatedParts.length) {
          let candidateLine = ''
          let bestSyllableIndex = syllableIndex

          // Sammle Silben und finde die beste Trennstelle
          for (let j = syllableIndex; j < hyphenatedParts.length; j++) {
            const syllable = hyphenatedParts[j]
            const testLine = candidateLine + syllable
            const isLastSyllable = j === hyphenatedParts.length - 1
            const lineWithHyphen = isLastSyllable ? testLine : testLine + '-'

            // Prüfe ob diese Silbenkombination noch in die Zeile passt
            if (measureTextWidth(lineWithHyphen, fontSize, fontFamily) <= maxWidth) {
              candidateLine = testLine
              bestSyllableIndex = j

              // Für bessere Lesbarkeit: Verwende die erste mögliche Trennstelle
              // wenn sie mindestens 3 Zeichen lang ist
              if (candidateLine.length >= 3 && j < hyphenatedParts.length - 1) {
                // Prüfe ob die nächste Silbe noch passt
                const nextSyllable = hyphenatedParts[j + 1]
                const nextTestLine = candidateLine + nextSyllable
                const nextLineWithHyphen =
                  j + 1 === hyphenatedParts.length - 1 ? nextTestLine : nextTestLine + '-'

                // Wenn die nächste Silbe nicht mehr passt, verwende die aktuelle als Trennstelle
                if (measureTextWidth(nextLineWithHyphen, fontSize, fontFamily) > maxWidth) {
                  break
                }
              }
            } else {
              // Diese Silbe passt nicht mehr
              break
            }
          }

          // Verarbeite die gefundene Trennstelle
          if (bestSyllableIndex >= syllableIndex) {
            const isLastLineOfWord = bestSyllableIndex === hyphenatedParts.length - 1

            if (isLastLineOfWord) {
              // Letzte Silbe(n) des Wortes - setze als currentLine für weitere Wörter
              currentLine = candidateLine
            } else {
              // Nicht die letzte Silbe - füge Zeile hinzu und fahre mit nächsten Silben fort
              lines.push(candidateLine + '-')
            }

            syllableIndex = bestSyllableIndex + 1
          } else {
            // Selbst eine einzelne Silbe ist zu lang - harte Trennung
            const syllable = hyphenatedParts[syllableIndex]
            const maxChars = Math.floor(maxWidth / (fontSize * 0.6))
            let remainingSyllable = syllable

            while (remainingSyllable.length > maxChars) {
              const chunk = remainingSyllable.substring(0, maxChars - 1)
              lines.push(chunk + '-')
              remainingSyllable = remainingSyllable.substring(maxChars - 1)
            }

            const isLastSyllable = syllableIndex === hyphenatedParts.length - 1
            if (isLastSyllable) {
              currentLine = remainingSyllable
            } else {
              lines.push(remainingSyllable + '-')
            }

            syllableIndex++
          }
        }
      } else {
        // Wort passt alleine in eine Zeile
        currentLine = word
      }
    }
  }

  // Letzte Zeile hinzufügen
  if (currentLine) {
    lines.push(currentLine)
  }

  // Auf maximal 2 Zeilen begrenzen für bessere Formatierung in Library-Elementen
  if (lines.length > 2) {
    const secondLine = lines[1]
    // Prüfe ob die zweite Zeile gekürzt werden muss
    const ellipsisWidth = measureTextWidth('...', fontSize, fontFamily)
    const availableWidth = maxWidth - ellipsisWidth

    // Finde die maximale Anzahl von Zeichen, die in die verfügbare Breite passen
    let truncated = secondLine
    while (
      truncated.length > 0 &&
      measureTextWidth(truncated, fontSize, fontFamily) > availableWidth
    ) {
      truncated = truncated.substring(0, truncated.length - 1)
    }

    lines[1] = truncated + '...'
    return lines.slice(0, 2).join('\n')
  }

  return lines.join('\n')
}

/**
 * Wrapping-Funktion speziell für Excalidraw-Elemente mit Container-Bindung
 * Berücksichtigt Container-Dimensionen und optimiert für Excalidraw-Rendering
 */
export const wrapTextForExcalidraw = (
  text: string,
  containerElement: ExcalidrawElement,
  fontSize: number = 20,
  fontFamily: string = 'Arial',
  padding: number = 10
): string => {
  // Berechne verfügbare Breite innerhalb des Containers
  const containerWidth = containerElement.width || 200
  const availableWidth = Math.max(50, containerWidth - padding * 2)

  // Verwende die erweiterte Wrapping-Funktion
  return wrapTextToFitWidth(text, availableWidth, fontSize, fontFamily)
}

/**
 * Optimierte Funktion für die Berechnung der Text-Dimensionen mit Hypher-Unterstützung
 */
export const calculateOptimalTextDimensions = (
  text: string,
  containerElement: ExcalidrawElement,
  fontSize: number = 20,
  fontFamily: string = 'Arial'
): { width: number; height: number; wrappedText: string } => {
  // Verwende die neue Wrapping-Funktion
  const wrappedText = wrapTextForExcalidraw(text, containerElement, fontSize, fontFamily)

  // Berechne tatsächliche Dimensionen basierend auf Canvas-Messung
  const lines = wrappedText.split('\n')
  const ctx = createTextMeasureCanvas()
  ctx.font = `${fontSize}px ${fontFamily}`

  // Finde die breiteste Zeile
  const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width))

  // Berechne Höhe basierend auf Zeilenanzahl
  const lineHeight = fontSize * 1.2
  const totalHeight = lines.length * lineHeight

  return {
    width: maxLineWidth,
    height: totalHeight,
    wrappedText,
  }
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
    if (
      containerElement.customData?.elementName ||
      containerElement.customData?.originalElement?.name
    ) {
      const expectedName = normalizeText(
        containerElement.customData.elementName || containerElement.customData.originalElement?.name
      )
      for (const textEl of nearbyTexts) {
        const textContent = normalizeText(textEl.text || textEl.rawText)
        if (
          textContent &&
          expectedName &&
          (textContent.includes(expectedName.split(' ')[0]) ||
            expectedName.includes(textContent.split(' ')[0]))
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
          } else {
            // Nur containerId setzen, Position beibehalten
            if (!currentText.containerId) {
              updatedElements[textIndex] = {
                ...currentText,
                containerId: container.id,
              }
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
          } else {
            // Nur containerId setzen, Position beibehalten
            updatedElements[textIndex] = {
              ...currentText,
              containerId: potentialContainer.id,
            }
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
 * Nutzt jetzt die verbesserte Hypher-basierte Textumbruch-Logik
 */
export const calculateCenteredTextPosition = (
  text: string,
  containerElement: ExcalidrawElement,
  fontSize: number = 20,
  fontFamily: string = 'Arial'
): { x: number; y: number; width: number; height: number } => {
  // Verwende die neue optimierte Dimensionsberechnung
  const { width: estimatedWidth, height: estimatedHeight } = calculateOptimalTextDimensions(
    text,
    containerElement,
    fontSize,
    fontFamily
  )

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
 * Berechnet die Position für Text, der oben mittig im Container positioniert werden soll
 * Verwendet für Top-Level Capabilities in der Capability Map
 * Nutzt jetzt die verbesserte Hypher-basierte Textumbruch-Logik
 */
export const calculateTopCenteredTextPosition = (
  text: string,
  containerElement: ExcalidrawElement,
  fontSize: number = 20,
  topPadding: number = 10,
  fontFamily: string = 'Arial'
): { x: number; y: number; width: number; height: number } => {
  // Verwende die neue optimierte Dimensionsberechnung
  const { width: estimatedWidth, height: estimatedHeight } = calculateOptimalTextDimensions(
    text,
    containerElement,
    fontSize,
    fontFamily
  )

  // Berechne horizontale Zentrierung und vertikale Top-Position
  const containerCenterX = (containerElement.x || 0) + (containerElement.width || 0) / 2
  const containerTop = containerElement.y || 0

  // Positioniere Text horizontal zentriert und vertikal oben mit Abstand
  const x = containerCenterX - estimatedWidth / 2
  const y = containerTop + topPadding

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
 * WICHTIG: Verwendet normalisierten Text für die Datenbank-Speicherung aber wendet Hypher-basierte
 * Textumbruchlogik für die Anzeige an
 */
export const updateTextContentOnly = (
  textElement: ExcalidrawElement,
  newText: string,
  allElements?: ExcalidrawElement[]
): ExcalidrawElement => {
  // Verwende normalisierten Text für die Datenbank-Speicherung
  const normalizedText = prepareTextForDatabase(newText)

  // Für die Anzeige: Wenn ein Container vorhanden ist, verwende Hypher-basierte Textumbruchlogik
  let displayText = normalizedText

  // Versuche Container-Element zu finden
  let containerElement: ExcalidrawElement | undefined

  if (textElement.containerId && allElements) {
    // Direkte Container-Suche über containerId
    containerElement = allElements.find(el => el.id === textElement.containerId)
  } else if (allElements) {
    // Fallback: Suche Container über boundElements
    containerElement = allElements.find(
      el =>
        (el.type === 'rectangle' || el.type === 'diamond' || el.type === 'ellipse') &&
        el.boundElements?.some(bound => bound.id === textElement.id)
    )
  }

  if (containerElement) {
    // Berechne die Container-Breite für Textumbruch
    const containerWidth = containerElement.width || 200
    const fontSize = textElement.fontSize || 20
    const padding = 10
    const availableWidth = Math.max(50, containerWidth - padding * 2)

    // Wende Hypher-basierte Textumbruchlogik an
    displayText = wrapTextToFitWidth(normalizedText, availableWidth, fontSize)
  }

  return {
    ...textElement,
    text: displayText, // Anzeige-Text mit Hypher-basierter Trennung
    rawText: normalizedText, // Originaler Text für Datenbank
    originalText: normalizedText, // Originaler Text für Datenbank
  }
}
