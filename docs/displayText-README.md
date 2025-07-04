# displayText-Feldtyp in GenericForm

## Überblick

Der `displayText`-Feldtyp wurde in der GenericForm-Komponente implementiert, um einfachen, nicht editierbaren Text anzuzeigen. Dies ist besonders nützlich für:

- Anzeige von statischen Informationen (IDs, Zeitstempel, etc.)
- Kennzeichnung von Status-Informationen mit verschiedenen Stilen
- Darstellung von Informationen im "view"-Modus eines Formulars
- Bereitstellung von Kontext- oder Hilfetexten direkt im Formular

## Funktionen

Der Feldtyp bietet folgende Funktionen:

- Konfigurierbare Typography-Variante (body1, h1, subtitle1, etc.)
- Erhaltung von Zeilenumbrüchen und Leerzeichen
- Anpassbare Farbe und Stil über die sx-Eigenschaft
- Fallback-Text für leere Werte
- Unterstützung für Label und Hilfetext

## Dokumentation

Eine detaillierte Dokumentation mit Beispielen finden Sie unter:

- `/docs/displayText-usage.md`

## Beispiel-Komponente

Eine vollständige Beispiel-Implementierung ist verfügbar unter:

- `/client/src/app/examples/displayTextExample/page.tsx`

## Verwendung

```tsx
// Beispiel für ein Feld mit displayText
{
  name: 'status',
  label: 'Status',
  type: 'displayText',
  defaultValue: 'Aktiv',
  variant: 'body1',
  sx: { color: 'success.main', fontWeight: 'bold' },
  preserveWhitespace: false,
  emptyText: 'Kein Status verfügbar'
}
```
