import { analyzeArrows } from './utils/arrowAnalysis'
import { ExcalidrawElement } from './types/relationshipTypes'

// Test-Funktion für die Pfeilanalyse
export function debugArrowAnalysis(elements: readonly ExcalidrawElement[]) {
  console.log('=== Debugging Arrow Analysis ===')

  // Alle Elemente anzeigen
  console.log(
    'Alle Elemente:',
    elements.map(el => ({
      id: el.id,
      type: el.type,
      startBinding: 'startBinding' in el ? el.startBinding : undefined,
      endBinding: 'endBinding' in el ? el.endBinding : undefined,
    }))
  )

  // Pfeile identifizieren
  const arrows = elements.filter(el => el.type === 'arrow')
  console.log('Gefundene Pfeile:', arrows.length)

  arrows.forEach((arrow, index) => {
    if ('startBinding' in arrow && 'endBinding' in arrow) {
      console.log(`Pfeil ${index + 1}:`, {
        id: arrow.id,
        startBinding: arrow.startBinding,
        endBinding: arrow.endBinding,
        hasStartBinding: !!arrow.startBinding,
        hasEndBinding: !!arrow.endBinding,
      })
    }
  })

  // Analyse ausführen
  const result = analyzeArrows(elements as ExcalidrawElement[])

  console.log('Analyseergebnis:')
  console.log('- Gültige Beziehungen:', result.validRelationships.length)
  console.log('- Unvollständige Beziehungen:', result.incompleteRelationships.length)
  console.log('- Ungültige Beziehungen:', result.invalidRelationships.length)
  console.log('- Binding-Probleme:', result.bindingIssues.length)
  console.log('- Korrigierte Elemente:', result.correctedElements?.length || 0)

  // Details zu korrigierten Elementen
  if (result.correctedElements && result.correctedElements.length > 0) {
    console.log('Korrigierte Elemente Details:')
    result.correctedElements.forEach((el, index) => {
      console.log(`  ${index + 1}. Element ${el.id}:`, {
        type: el.type,
        startBinding: 'startBinding' in el ? el.startBinding : undefined,
        endBinding: 'endBinding' in el ? el.endBinding : undefined,
      })
    })
  }

  // Details zu unvollständigen Beziehungen
  if (result.incompleteRelationships.length > 0) {
    console.log('Unvollständige Beziehungen Details:')
    result.incompleteRelationships.forEach((rel, index) => {
      console.log(`  ${index + 1}.`, {
        status: rel.status,
        sourceElementName: rel.sourceElementName,
        targetElementName: rel.targetElementName,
        missingElement: rel.missingElement,
        invalidReason: rel.invalidReason,
      })
    })
  }

  // Details zu Binding-Problemen
  if (result.bindingIssues.length > 0) {
    console.log('Binding-Probleme Details:')
    result.bindingIssues.forEach((issue, index) => {
      console.log(`  ${index + 1}.`, {
        status: issue.status,
        issues: issue.issues.map(i => i.description),
        hasStartBinding: !!issue.arrow.startBinding,
        hasEndBinding: !!issue.arrow.endBinding,
      })
    })
  }

  return result
}
