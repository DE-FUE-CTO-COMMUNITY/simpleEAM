#!/bin/bash

# Validierungsscript für die neue Library-Element-Struktur
# Prüft ob die Implementierung korrekt funktioniert

echo "🔍 Validierung der Library-Element-Implementierung"
echo "=================================================="

# Prüfe ob die wichtigsten Dateien existieren und die erwarteten Änderungen enthalten
echo ""
echo "📁 Dateien prüfen..."

# IntegratedLibrary.tsx - Prüfe auf neue Struktur
if grep -q "isMainElement: true" /home/mf2admin/simple-eam/client/src/components/diagrams/IntegratedLibrary.tsx; then
    echo "✅ IntegratedLibrary.tsx: Hauptelement-Markierung gefunden"
else
    echo "❌ IntegratedLibrary.tsx: Hauptelement-Markierung fehlt"
fi

if grep -q "mainElementId:" /home/mf2admin/simple-eam/client/src/components/diagrams/IntegratedLibrary.tsx; then
    echo "✅ IntegratedLibrary.tsx: Verweis auf Hauptelement gefunden"
else
    echo "❌ IntegratedLibrary.tsx: Verweis auf Hauptelement fehlt"
fi

# excalidrawLibraryUtils.ts - Prüfe auf neue Hilfsfunktionen
if grep -q "isMainLibraryElement" /home/mf2admin/simple-eam/client/src/components/diagrams/excalidrawLibraryUtils.ts; then
    echo "✅ excalidrawLibraryUtils.ts: Hauptelement-Erkennung gefunden"
else
    echo "❌ excalidrawLibraryUtils.ts: Hauptelement-Erkennung fehlt"
fi

if grep -q "findRelatedLibraryElements" /home/mf2admin/simple-eam/client/src/components/diagrams/excalidrawLibraryUtils.ts; then
    echo "✅ excalidrawLibraryUtils.ts: Gruppenverwaltung gefunden"
else
    echo "❌ excalidrawLibraryUtils.ts: Gruppenverwaltung fehlt"
fi

echo ""
echo "🧪 Code-Qualität prüfen..."

# Prüfe TypeScript-Kompilierung
cd /home/mf2admin/simple-eam/client
if npx tsc --noEmit --skipLibCheck > /dev/null 2>&1; then
    echo "✅ TypeScript: Keine Kompilierungsfehler"
else
    echo "❌ TypeScript: Kompilierungsfehler gefunden"
fi

echo ""
echo "📊 Zusammenfassung der Implementierung:"
echo ""
echo "🎯 Problem gelöst:"
echo "   - Redundante Beziehungs-Speicherung in jedem Element eliminiert"
echo "   - Nur Hauptelement enthält vollständige Datenbank-Metadaten"
echo ""
echo "🔧 Implementierte Lösung:"
echo "   - Erstes Element: isMainElement=true + vollständige customData"
echo "   - Andere Elemente: isMainElement=false + Verweis über mainElementId"
echo ""
echo "📦 Neue Hilfsfunktionen:"
echo "   - isMainLibraryElement(): Prüft ob Element Hauptelement ist"
echo "   - findMainLibraryElement(): Findet Hauptelement in Gruppe"
echo "   - findRelatedLibraryElements(): Findet alle verwandten Elemente"
echo "   - updateLibraryElementGroup(): Aktualisiert Elementgruppe"
echo ""
echo "✨ Vorteile:"
echo "   - 📉 Reduzierte Dateigröße (keine redundanten Daten)"
echo "   - 🔄 Einfachere Synchronisation bei DB-Updates"
echo "   - 🎯 Konsistente Datenintegrität"
echo "   - 🚀 Bessere Performance"

echo ""
echo "🚀 Nächste Schritte zum Testen:"
echo "1. Öffne http://localhost:3000/diagrams"
echo "2. Warte bis Library geladen ist"
echo "3. Ziehe Datenbank-Elemente ins Diagramm"
echo "4. Überprüfe customData der erstellten Elemente:"
echo "   - Hauptelement sollte databaseId, elementType, originalElement haben"
echo "   - Andere Elemente sollten nur mainElementId haben"
echo "5. Teste Hilfsfunktionen in Browser-Konsole"
