// Text utilities for Excalidraw elements with container bindings

// Standard padding for text in containers
export const TEXT_PADDING = 20

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
 *
 * @param text - Der zu normalisierende Text
 * @param originalDatabaseName - Optionaler Original-Datenbankname zum Prüfen auf legitime Bindestriche
 */
export const prepareTextForDatabase = (
  text: string | undefined | null,
  originalDatabaseName?: string | null
): string => {
  if (!text) return ''

  // Erste Normalisierung
  let normalized = normalizeText(text)

  // Wenn wir den Original-Datenbanknamen haben, prüfen wir auf legitime Bindestriche
  if (originalDatabaseName) {
    // Finde alle Bindestriche in original database name
    const hyphenPositions: number[] = []
    for (let i = 0; i < originalDatabaseName.length; i++) {
      if (originalDatabaseName[i] === '-') {
        hyphenPositions.push(i)
      }
    }

    // Wenn es Bindestriche im Original gibt, sind diese legitim und sollten erhalten bleiben
    // Entferne nur Trennstriche, die durch Zeilenumbruch entstanden sind
    if (hyphenPositions.length === 0) {
      // Keine legitimen Bindestriche - entferne alle Silbentrennungsstriche
      normalized = normalized
        .replace(/([a-zA-ZäöüÄÖÜß])-\s+([a-zA-ZäöüÄÖÜß])/g, '$1$2')
        .replace(/\u00AD/g, '')
    } else {
      // Es gibt legitime Bindestriche - nur Silbentrennungsstriche entfernen
      // (weiche Trennstriche und Trennstriche mit Leerzeichen danach)
      normalized = normalized
        .replace(/([a-zA-ZäöüÄÖÜß])-\s+([a-zA-ZäöüÄÖÜß])/g, (match, p1, p2) => {
          // Prüfe ob dies ein legitimer Bindestrich sein könnte
          // Wenn der Text insgesamt Bindestriche enthält, könnte dies legitim sein
          return `${p1}-${p2}` // Behalte Bindestrich, entferne nur Leerzeichen
        })
        .replace(/\u00AD/g, '') // Entferne weiche Trennstriche (soft hyphens)
    }
  } else {
    // Kein Original-Name vorhanden - entferne alle Trennstriche vorsichtig
    normalized = normalized
      .replace(/([a-zA-ZäöüÄÖÜß])-\s+([a-zA-ZäöüÄÖÜß])/g, '$1$2')
      .replace(/\u00AD/g, '')
  }

  normalized = normalized
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
    // CRITICAL: Excalidraw wraps originalText automatically
    // Set all to unwrapped normalized text
    text: normalizedText,
    rawText: normalizedText,
    originalText: normalizedText, // Unwrapped - Excalidraw will wrap this
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
 * Creates a virtual canvas element for precise text measurement
 */
const createTextMeasureCanvas = (): CanvasRenderingContext2D => {
  const canvas = document.createElement('canvas')
  return canvas.getContext('2d')!
}

/**
 * Simple text wrapping function that wraps text to fit within a specified width
 * Uses canvas measurement for accurate width calculation
 */
export const wrapTextToFitWidth = (
  text: string,
  maxWidth: number,
  fontSize: number = 20,
  fontFamily: string = 'Arial'
): string => {
  // Empty text handling
  if (!text || text.trim() === '') {
    return text
  }

  const ctx = createTextMeasureCanvas()
  ctx.font = `${fontSize}px ${fontFamily}`

  // Check if text fits in one line
  if (ctx.measureText(text).width <= maxWidth) {
    return text
  }

  // Split into words and wrap
  const words = text.split(/\s+/).filter(word => word.trim())
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const testWidth = ctx.measureText(testLine).width

    if (testWidth <= maxWidth) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
      }

      // Check if single word is too long
      if (ctx.measureText(word).width > maxWidth) {
        // Break word by characters
        let chars = ''
        for (const char of word) {
          const testChars = chars + char
          if (ctx.measureText(testChars).width <= maxWidth) {
            chars = testChars
          } else {
            if (chars) {
              lines.push(chars)
            }
            chars = char
          }
        }
        currentLine = chars
      } else {
        currentLine = word
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines.join('\n')
}

/**
 * Measures the dimensions of already-wrapped text
 */
export const measureWrappedTextDimensions = (
  wrappedText: string,
  fontSize: number = 20,
  fontFamily: string = 'Arial'
): { width: number; height: number } => {
  const lines = wrappedText.split('\n')
  const ctx = createTextMeasureCanvas()
  ctx.font = `${fontSize}px ${fontFamily}`

  // Find the widest line
  const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width))

  // Calculate height based on line count
  const lineHeight = fontSize * 1.2
  const totalHeight = lines.length * lineHeight

  return {
    width: maxLineWidth,
    height: totalHeight,
  }
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
  // Calculate available width and wrap text
  const containerWidth = containerElement.width || 200
  // Use proportional padding: min 10px, max 20px, scaled by width
  const padding = Math.min(TEXT_PADDING, Math.max(10, containerWidth * 0.1))
  const availableWidth = Math.max(50, containerWidth - padding)
  const wrappedText = wrapTextToFitWidth(text, availableWidth, fontSize, fontFamily)

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
 * Calculates centered text position within a container
 */
export const calculateCenteredTextPosition = (
  text: string,
  containerElement: ExcalidrawElement,
  fontSize: number = 20,
  fontFamily: string = 'Arial'
): { x: number; y: number; width: number; height: number } => {
  const { width, height } = measureWrappedTextDimensions(text, fontSize, fontFamily)

  const containerCenterX = (containerElement.x || 0) + (containerElement.width || 0) / 2
  const containerCenterY = (containerElement.y || 0) + (containerElement.height || 0) / 2

  const x = containerCenterX - width / 2
  const y = containerCenterY - height / 2

  return { x, y, width, height }
}

/**
 * Calculates top-centered text position within a container
 */
export const calculateTopCenteredTextPosition = (
  text: string,
  containerElement: ExcalidrawElement,
  fontSize: number = 20,
  topPadding: number = 10,
  fontFamily: string = 'Arial'
): { x: number; y: number; width: number; height: number } => {
  const { width, height } = measureWrappedTextDimensions(text, fontSize, fontFamily)

  const containerCenterX = (containerElement.x || 0) + (containerElement.width || 0) / 2
  const containerTop = containerElement.y || 0

  const x = containerCenterX - width / 2
  const y = containerTop + topPadding

  return { x, y, width, height }
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
  _allElements?: ExcalidrawElement[]
): ExcalidrawElement => {
  // Verwende normalisierten Text für die Datenbank-Speicherung
  const normalizedText = prepareTextForDatabase(newText)

  // CRITICAL: Excalidraw wraps originalText automatically based on container
  // We should NOT pre-wrap it ourselves
  return {
    ...textElement,
    text: normalizedText, // Unwrapped
    rawText: normalizedText, // Unwrapped
    originalText: normalizedText, // Unwrapped - Excalidraw will wrap this
  }
}
