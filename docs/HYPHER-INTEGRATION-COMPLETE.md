# Hypher-basierte Textumbruch-Implementierung

## Übersicht

Diese Implementierung erweitert das Simple-EAM-System um eine fortgeschrittene Textumbruch-Funktionalität mit intelligenter Silbentrennung unter Verwendung der Hypher-Bibliothek.

## Wichtige Funktionen

### 1. `wrapTextToFitWidth` - Intelligenter Textumbruch

- **Zweck**: Umbricht Text mit optimaler Silbentrennung für deutsche und englische Texte
- **Funktionen**:
  - Automatische Spracherkennung (deutsch/englisch)
  - Pixel-genaue Breitenmessung mit Canvas API
  - Intelligente Silbentrennung mit Hypher-Bibliothek
  - Notfall-Trennung bei überlangen Wörtern
  - Maximale Zeilenbegrenzung für bessere Formatierung

### 2. `calculateOptimalTextDimensions` - Präzise Dimensionsberechnung

- **Zweck**: Berechnet optimale Textdimensionen basierend auf Container-Größe
- **Funktionen**:
  - Canvas-basierte Textmessung
  - Hypher-basierter Textumbruch
  - Automatische Anpassung an Container-Grenzen
  - Rückgabe von Breite, Höhe und umgebrochenem Text

### 3. `measureTextWidth` - Pixel-genaue Textmessung

- **Zweck**: Misst exakte Textbreite mit Canvas API
- **Funktionen**:
  - Font-Family- und Font-Size-Unterstützung
  - Pixel-genaue Messung
  - Cached Canvas-Kontext für Performance

## Sprachunterstützung

### Deutsche Silbentrennung

- Verwendet `hyphenation.de` Patterns
- Korrekte Behandlung von Umlauten
- Zusammengesetzte Wörter werden korrekt getrennt

### Englische Silbentrennung

- Verwendet `hyphenation.en-us` Patterns
- Standard-englische Trennungsregeln
- Optimiert für technische Begriffe

## Verwendung

### Grundlegende Integration

```typescript
import { wrapTextToFitWidth, calculateOptimalTextDimensions } from './textContainerUtils'

// Einfacher Textumbruch
const wrappedText = wrapTextToFitWidth('Geschäftsprozessmanagement', 150, 16, 'Arial')

// Vollständige Dimensionsberechnung
const dimensions = calculateOptimalTextDimensions(
  'Längerer Text mit mehreren Wörtern',
  containerElement,
  16,
  'Arial'
)
```

### Integration in bestehende Funktionen

Die folgenden Funktionen wurden bereits aktualisiert:

- `calculateTopCenteredTextPosition`
- `calculateCenteredTextPosition`
- `updateTextWithContainerBinding`

## Technische Details

### Abhängigkeiten

- `hypher`: Basis-Bibliothek für Silbentrennung
- `hyphenation.de`: Deutsche Trennungsmuster
- `hyphenation.en-us`: Englische Trennungsmuster

### Performance-Optimierungen

- Cached Canvas-Kontext für Textmessung
- Lazy Loading der Hypher-Instanzen
- Effiziente Spracherkennung

### Fallback-Mechanismen

- Bei Hypher-Fehlern: Basis-Wort-Trennung
- Bei Canvas-Fehlern: Approximation mit Zeichenanzahl
- Bei Sprach-Erkennungsfehlern: Englisch als Standard

## Spracherkennung

### Automatische Erkennung

```typescript
function detectLanguage(text: string): 'de' | 'en' {
  const germanIndicators = ['ä', 'ö', 'ü', 'ß', 'ung', 'keit', 'schaft', 'lich']
  const foundGermanIndicators = germanIndicators.some(indicator =>
    text.toLowerCase().includes(indicator)
  )
  return foundGermanIndicators ? 'de' : 'en'
}
```

### Unterstützte Indikatoren

- **Deutsch**: Umlaute (ä, ö, ü), Eszett (ß), Endungen (-ung, -keit, -schaft, -lich)
- **Englisch**: Standard-Fallback für alle anderen Texte

## Konfiguration

### Anpassbare Parameter

- `maxWidth`: Maximale Textbreite in Pixeln
- `fontSize`: Schriftgröße für Berechnungen
- `fontFamily`: Schriftart für Messungen
- `maxLines`: Maximale Anzahl der Zeilen (Standard: 2)

### Container-Integration

Die Funktionen arbeiten nahtlos mit ExcalidrawElement-Containern und berücksichtigen:

- Container-Dimensionen
- Padding und Abstände
- Zentrierung und Ausrichtung

## Testing

### Automatisierte Tests

Die Datei `textWrapperTest.ts` enthält umfassende Tests für:

- Deutsche Silbentrennung
- Englische Silbentrennung
- Dimensionsberechnung
- Verschiedene Container-Größen

### Manuelle Tests

```bash
# Hypher-Bibliothek testen
node test-hypher.js

# TypeScript-Kompilierung prüfen
yarn tsc --noEmit
```

## Kompatibilität

### Bestehende Funktionen

Alle bestehenden Textpositionierungs- und Bindungsfunktionen wurden aktualisiert, um die neue Hypher-basierte Logik zu verwenden, ohne Breaking Changes zu verursachen.

### Rückwärtskompatibilität

- Alle bestehenden API-Signaturen bleiben unverändert
- Bestehende Aufrufe funktionieren ohne Änderungen
- Verbesserte Ausgabe bei gleicher Eingabe

## Fehlerbehandlung

### Robuste Implementierung

- Graceful Degradation bei Hypher-Fehlern
- Fallback auf manuelle Trennung
- Kontinuierliche Funktionalität auch bei Bibliotheksfehlern

### Logging und Debugging

- Detaillierte Fehlerbehandlung
- Debugging-Funktionen für Entwicklung
- Performance-Monitoring-Integration

## Zukünftige Erweiterungen

### Geplante Verbesserungen

- Zusätzliche Sprachunterstützung (französisch, spanisch)
- Erweiterte Textformatierung (fett, kursiv)
- Optimierte Performance für große Texte
- Intelligente Zeilenhöhen-Anpassung

### Erweiterbarkeit

Die Architektur ist darauf ausgelegt, einfach erweitert zu werden:

- Neue Sprachen können durch zusätzliche Hypher-Pattern hinzugefügt werden
- Erweiterte Textformatierung kann in die Canvas-Messung integriert werden
- Zusätzliche Umbruch-Strategien können als Plugins implementiert werden
