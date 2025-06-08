/**
 * Test für die neue Library-Element-Struktur ohne redundante Beziehungs-Speicherung
 *
 * Diese Datei testet, ob die Implementierung korrekt funktioniert:
 * - Nur das Hauptelement enthält vollständige Datenbank-Metadaten
 * - Andere Elemente verweisen nur auf das Hauptelement
 * - Hilfsfunktionen arbeiten korrekt mit der neuen Struktur
 */

import {
  isLibraryBasedElement,
  isMainLibraryElement,
  findMainLibraryElement,
  getLibraryElementId,
  getLibraryElementType,
  getOriginalDatabaseElement,
  findRelatedLibraryElements,
  updateLibraryElementGroup,
} from './excalidrawLibraryUtils'

// Mock-Daten für Tests
const mockDatabaseElement = {
  id: 'test-db-id-123',
  name: 'Test Application',
  description: 'Test application description',
  status: 'active',
}

const mockMainElement = {
  id: 'main-element-id',
  type: 'rectangle',
  customData: {
    databaseId: 'test-db-id-123',
    elementType: 'application',
    originalElement: mockDatabaseElement,
    isFromDatabase: true,
    isMainElement: true,
  },
}

const mockTextElement = {
  id: 'text-element-id',
  type: 'text',
  customData: {
    isFromDatabase: true,
    isMainElement: false,
    mainElementId: 'main-element-id',
  },
}

const mockIconElement = {
  id: 'icon-element-id',
  type: 'diamond',
  customData: {
    isFromDatabase: true,
    isMainElement: false,
    mainElementId: 'main-element-id',
  },
}

const mockElements = [mockMainElement, mockTextElement, mockIconElement]

/**
 * Test-Funktionen - Diese können in der Browser-Konsole ausgeführt werden
 *
 * Um zu testen:
 * 1. Öffne die Diagramm-Seite
 * 2. Öffne die Browser-Entwicklertools
 * 3. Füge Library-Elemente zum Diagramm hinzu
 * 4. Führe diese Tests in der Konsole aus
 */

console.group('🧪 Tests für neue Library-Element-Struktur')

// Test 1: Hauptelement-Erkennung
console.log('Test 1: Hauptelement-Erkennung')
console.log('Hauptelement erkannt:', isMainLibraryElement(mockMainElement)) // sollte true sein
console.log('Text-Element ist Hauptelement:', isMainLibraryElement(mockTextElement)) // sollte false sein

// Test 2: Library-Element-Erkennung
console.log('\nTest 2: Library-Element-Erkennung')
console.log('Hauptelement ist Library-basiert:', isLibraryBasedElement(mockMainElement)) // sollte true sein
console.log('Text-Element ist Library-basiert:', isLibraryBasedElement(mockTextElement)) // sollte true sein

// Test 3: Datenbank-ID-Extraktion
console.log('\nTest 3: Datenbank-ID-Extraktion')
console.log('DB-ID vom Hauptelement:', getLibraryElementId(mockMainElement)) // sollte 'test-db-id-123' sein
console.log('DB-ID vom Text-Element:', getLibraryElementId(mockTextElement)) // sollte null sein

// Test 4: Element-Typ-Extraktion
console.log('\nTest 4: Element-Typ-Extraktion')
console.log('Element-Typ vom Hauptelement:', getLibraryElementType(mockMainElement)) // sollte 'application' sein
console.log('Element-Typ vom Text-Element:', getLibraryElementType(mockTextElement)) // sollte null sein

// Test 5: Hauptelement-Suche
console.log('\nTest 5: Hauptelement-Suche')
const foundMainElement = findMainLibraryElement(mockElements)
console.log('Gefundenes Hauptelement:', foundMainElement?.id) // sollte 'main-element-id' sein

// Test 6: Verwandte Elemente finden
console.log('\nTest 6: Verwandte Elemente finden')
const relatedElements = findRelatedLibraryElements(mockElements, mockMainElement)
console.log('Anzahl verwandter Elemente:', relatedElements.length) // sollte 3 sein (alle)
console.log(
  'Verwandte Element-IDs:',
  relatedElements.map(el => el.id)
)

console.groupEnd()

console.log(`
✅ Implementierung abgeschlossen!

📋 Zusammenfassung der Änderungen:

1. **IntegratedLibrary.tsx**: 
   - createLibraryItemFromDatabaseElement() überarbeitet
   - Nur erstes Element erhält vollständige customData
   - Andere Elemente erhalten nur Verweis auf Hauptelement

2. **excalidrawLibraryUtils.ts**:
   - Hilfsfunktionen für neue Struktur angepasst
   - Neue Funktionen für Gruppenverwaltung hinzugefügt
   - Dokumentation der neuen Struktur

3. **Vorteile der neuen Implementierung**:
   - ❌ Keine redundante Speicherung mehr
   - 📦 Kleinere Diagrammdateien
   - 🔄 Einfachere Synchronisation
   - 🎯 Konsistente Datenintegrität

4. **Nächste Schritte**:
   - Teste die Funktionalität im DiagramEditor
   - Füge Library-Elemente zum Diagramm hinzu
   - Überprüfe customData-Struktur der erstellten Elemente
   - Verifiziere, dass nur Hauptelemente vollständige Metadaten haben
`)

export {}
