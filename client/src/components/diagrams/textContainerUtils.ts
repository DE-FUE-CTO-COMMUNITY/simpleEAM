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

  // Behalte Text-Alignment bei
  if (!updatedText.textAlign) {
    updatedText.textAlign = 'center'
  }
  if (!updatedText.verticalAlign) {
    updatedText.verticalAlign = 'middle'
  }

  // KRITISCH: Berechne korrekte Text-Position relativ zum Container-Zentrum
  if (containerElement && containerElement.x !== undefined && containerElement.y !== undefined) {
    const fontSize = updatedText.fontSize || 20
    
    // Verwende die einheitliche calculateCenteredTextPosition Funktion für konsistente Zentrierung
    const centeredPosition = calculateCenteredTextPosition(newText, containerElement, fontSize)
    
    // Aktualisiere Text-Position und -Dimensionen
    updatedText.x = centeredPosition.x
    updatedText.y = centeredPosition.y
    updatedText.width = centeredPosition.width
    updatedText.height = centeredPosition.height
    
    const lineCount = (newText.match(/\n/g) || []).length + 1
    console.log(
      `Repositioned ${lineCount}-line text "${newText}" to center of container:`,
      `Container: (${containerElement.x}, ${containerElement.y}, ${containerElement.width}x${containerElement.height})`,
      `Text: (${updatedText.x}, ${updatedText.y}, ${centeredPosition.width}x${centeredPosition.height})`
    )
  }

  return updatedText
}

/**
 * Wrapping-Funktion für Text basierend auf verfügbarer Breite
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

  // Text in Wörter aufteilen (verschiedene Trennzeichen berücksichtigen)
  const words = text.split(/(\s+|-|_)/).filter(part => part.trim() || part === ' ')
  const lines: string[] = []
  let currentLine = ''

  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    // Reine Leerzeichen überspringen, außer Leerzeichen zwischen Wörtern
    if (word.trim() === '' && word !== ' ') continue

    // Prüfen, ob das Hinzufügen dieses Wortes die Zeilenlänge überschreitet
    const testLine = currentLine + word

    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine
    } else {
      // Wenn aktuelle Zeile Inhalt hat, sie hinzufügen und neue Zeile beginnen
      if (currentLine.trim()) {
        lines.push(currentLine.trim())
        currentLine = word.trim() === '' ? '' : word
      } else {
        // Wenn einzelnes Wort zu lang ist, es aufteilen
        if (word.length > maxCharsPerLine) {
          // Langes Wort in Chunks aufteilen
          let remainingWord = word
          while (remainingWord.length > maxCharsPerLine) {
            lines.push(remainingWord.substring(0, maxCharsPerLine - 1) + '-')
            remainingWord = remainingWord.substring(maxCharsPerLine - 1)
          }
          currentLine = remainingWord
        } else {
          currentLine = word
        }
      }
    }
  }

  // Letzte Zeile hinzufügen, wenn sie Inhalt hat
  if (currentLine.trim()) {
    lines.push(currentLine.trim())
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
    el => 
      el.type === 'text' && 
      el.customData?.mainElementId === containerElement.id
  )
  if (textWithMainRef) return textWithMainRef

  // Strategie 4: Text-Element mit gleicher databaseId
  if (containerElement.customData?.databaseId) {
    const textWithSameDbId = allElements.find(
      el =>
        el.type === 'text' &&
        el.customData?.databaseId === containerElement.customData.databaseId
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
        if (textContent.includes(expectedName.split(' ')[0]) || 
            expectedName.includes(textContent.split(' ')[0])) {
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
  const containerElements = elements.filter(el => 
    el.type === 'rectangle' || el.type === 'diamond' || el.type === 'ellipse'
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

        // KRITISCH: Repositioniere Text im Zentrum des Containers
        const textIndex = updatedElements.findIndex(el => el.id === textEl.id)
        if (textIndex !== -1) {
          const updatedTextElement = updateTextWithContainerBinding(
            updatedElements[textIndex],
            textEl.text || textEl.rawText || '',
            container
          )
          updatedElements[textIndex] = updatedTextElement
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
          const updatedTextElement = updateTextWithContainerBinding(
            updatedElements[textIndex],
            textEl.text || textEl.rawText || '',
            potentialContainer
          )
          updatedElements[textIndex] = updatedTextElement
          console.log(`Set containerId and repositioned text ${textEl.id} -> container ${potentialContainer.id}`)
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
    height: estimatedHeight
  }
}
