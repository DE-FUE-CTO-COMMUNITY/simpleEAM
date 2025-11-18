#!/usr/bin/env python3
"""
Improved translation script for complete German comment lines
Translates entire comment lines instead of partial replacements
"""

import os
import re
from pathlib import Path
from typing import List, Tuple

# Complete comment line translations (more comprehensive)
COMMENT_TRANSLATIONS = {
    # Capabilities page
    "// Liste der verfügbaren Status und Tags aus den Daten extrahieren": "// Extract list of available statuses and tags from the data",
    "// State für das neue Capability-Formular": "// State for the new capability form",
    "// Verfügbare Status und Tags aus den geladenen Daten extrahieren": "// Extract available statuses and tags from loaded data",
    "// Alle Status extrahieren und Duplikate remove": "// Extract all statuses and remove duplicates",
    "// Alle Tags sammeln und Duplikate remove": "// Collect all tags and remove duplicates",
    "// Mutation zum Erstellen einer neuen Capability": "// Mutation for creating a new capability",
    "// Mutation zum Aktualisieren einer bestehenden Capability": "// Mutation for updating an existing capability",
    "// Mutation zum Löschen einer Capability": "// Mutation for deleting a capability",
    "// Handler für das Erstellen einer neuen Business Capability": "// Handler for creating a new business capability",
    "// Bei CREATE wird kein spezielles Mutation-Objekt benötigt, da direkte Werte erlaubt sind": "// For CREATE, no special mutation object is needed as direct values are allowed",
    "// Handler für das Aktualisieren einer bestehenden Business Capability": "// Handler for updating an existing business capability",
    "// Hier fügen wir direkt die Logik für das Erstellen einer neuen Capability ein,": "// Here we directly add the logic for creating a new capability,",
    "// anstatt einen versteckten Button zu verwenden": "// instead of using a hidden button",
    "// Business Capability löschen": "// Delete business capability",
    "// Formular nach dem Erstellen schließen": "// Close form after creating",
    "// Formular nach dem Löschen schließen": "// Close form after deleting",
    "// Automatisches Schließen erfolgt durch die CapabilityForm selbst": "// Automatic closing is handled by the CapabilityForm itself",
    
    # Theme
    "// Einfache Farb-Manipulation für bessere Browser-Kompatibilität": "// Simple color manipulation for better browser compatibility",
    "// Für häufige Hex-Farben manuelle Varianten definieren": "// Define manual variants for common hex colors",
    "// Entferne das Standard-24px Margin von Material UI 7": "// Remove the default 24px margin from Material UI 7",
    "// Entferne das Standard-Margin von CardContent": "// Remove the default margin from CardContent",
    "// Entferne das Standard-Margin von CardHeader": "// Remove the default margin from CardHeader",
    "// Entferne das Standard-Margin von CardActions": "// Remove the default margin from CardActions",
    
    # Dashboard
    "let limit = 6 // Standard für xl und größer": "let limit = 6 // Default for xl and larger",
    "// Zeige Loading während Authentifizierung oder Query lädt": "// Show loading while authenticating or query is loading",
    "// Diagramm-Daten mit allen verfügbaren Metadaten vorbereiten": "// Prepare diagram data with all available metadata",
    "// Navigiere ohne URL-Parameter zum Diagram Editor": "// Navigate to diagram editor without URL parameters",
    "// Skeleton-Version für Ladezeiten": "// Skeleton version for loading times",
    
    # Context
    "// Erstelle einen Mock AuthContext für die Diagramm-Komponenten": "// Create a mock AuthContext for diagram components",
    "// Einfacher Mock Provider für Entwicklungszwecke": "// Simple mock provider for development purposes",
    "// Mock-Benutzer für Entwicklung": "// Mock user for development",
    "// Initialisiere mit light mode als Standard": "// Initialize with light mode as default",
    "// LocalStorage Integration mit Hydration-Schutz": "// LocalStorage integration with hydration protection",
    "// Lade gespeicherte Theme-Präferenz aus localStorage": "// Load saved theme preference from localStorage",
    "// Während Server-Side Rendering oder vor Client-Hydration": "// During server-side rendering or before client hydration",
    "// Initial aus LocalStorage setzen": "// Set initial value from localStorage",
    "// Cross-Tab Sync: auf Änderungen aus anderen Tabs reagieren": "// Cross-tab sync: react to changes from other tabs",
    "// Beim Tab-Fokus/Visibility-Change ebenfalls mit LocalStorage abgleichen": "// Also sync with localStorage on tab focus/visibility change",
    "// Wenn Companies geladen sind, sinnvolle Vorauswahl treffen und ungültige Auswahl bereinigen": "// When companies are loaded, make sensible preselection and clean up invalid selection",
    "// Warten bis localStorage initialisiert ist und Companies geladen sind": "// Wait until localStorage is initialized and companies are loaded",
    "// Wenn Companies noch laden, warten (wichtig für Race Condition)": "// If companies are still loading, wait (important for race condition)",
    "// Wenn keine Companies verfügbar sind und das Laden abgeschlossen ist": "// If no companies are available and loading is complete",
    "// Wenn eine ungültige Company-ID aus localStorage kommt (z.B. Company wurde gelöscht),": "// If an invalid company ID comes from localStorage (e.g. company was deleted),",
    "// bereinige die Auswahl": "// clean up the selection",
    
    # Excalidraw
    "// Theme-Farben aus Umgebungsvariablen lesen": "// Read theme colors from environment variables",
    "// CSS-Variablen für Excalidraw Light Theme generieren": "// Generate CSS variables for Excalidraw light theme",
    "// Brand Color Familie (für spezielle UI-Elemente)": "// Brand color family (for special UI elements)",
    "'--button-hover-bg': primaryVariants.lighter, // = #e6f2ff äquivalent (sehr hell für Hover)": "'--button-hover-bg': primaryVariants.lighter, // = #e6f2ff equivalent (very light for hover)",
    "'--button-active-bg': primaryVariants.lighter, // = #e6f2ff äquivalent (sehr hell für Active)": "'--button-active-bg': primaryVariants.lighter, // = #e6f2ff equivalent (very light for active)",
    "'--button-active-border': primaryVariants.darker, // = #2761a8 äquivalent (dunkler für Active Border)": "'--button-active-border': primaryVariants.darker, // = #2761a8 equivalent (darker for active border)",
    "'--button-selected-bg': primaryVariants.lighter, // = #e6f2ff äquivalent (sehr hell für Selected)": "'--button-selected-bg': primaryVariants.lighter, // = #e6f2ff equivalent (very light for selected)",
    "'--button-selected-border': primaryVariants.main, // = #4d94e0 äquivalent (primär für Selected Border)": "'--button-selected-border': primaryVariants.main, // = #4d94e0 equivalent (primary for selected border)",
    "// Border-Radius (falls aus ENV definiert)": "// Border radius (if defined in ENV)",
    "// CSS-Variablen für Excalidraw Dark Theme generieren": "// Generate CSS variables for Excalidraw dark theme",
    "// Primary Color Familie (angepasst für dark mode)": "// Primary color family (adapted for dark mode)",
    "// UI-Element Farben für dark mode": "// UI element colors for dark mode",
    "// Debug-Export für Entwicklung": "// Debug export for development",
    
    # Components
    "tableKey=\"interfaces\" // Eindeutiger Schlüssel für die Interfaces-Tabelle": "tableKey=\"interfaces\" // Unique key for the interfaces table",
    "tableKey=\"architectures\" // Eindeutiger Schlüssel für die Architectures-Tabelle": "tableKey=\"architectures\" // Unique key for the architectures table",
    "tableKey=\"infrastructure\" // Eindeutiger Schlüssel für die Infrastructure-Tabelle": "tableKey=\"infrastructure\" // Unique key for the infrastructure table",
    "tableKey=\"dataobjects\" // Eindeutiger Schlüssel für die DataObjects-Tabelle": "tableKey=\"dataobjects\" // Unique key for the dataobjects table",
    "// Reset-Funktion für Filter": "// Reset function for filters",
    "// Kombiniere externe und persistente onTableReady Callbacks": "// Combine external and persistent onTableReady callbacks",
    "// Spalten-Definition für die Architecture-Tabelle": "// Column definition for the architecture table",
    "// Spalten-Definition für die Company-Tabelle": "// Column definition for the company table",
    "// Spalten-Definition für die Infrastructure-Tabelle": "// Column definition for the infrastructure table",
    "// Spalten-Definition für die Schnittstellen-Tabelle": "// Column definition for the interfaces table",
    "// Mapping von ArchitectureType zu den erwarteten FormValues für das Formular": "// Mapping from ArchitectureType to expected FormValues for the form",
    "// Mapping von CompanyType zu den erwarteten FormValues für das Formular": "// Mapping from CompanyType to expected FormValues for the form",
    "// Mapping von ApplicationInterface zu den erwarteten FormValues für das Formular": "// Mapping from ApplicationInterface to expected FormValues for the form",
    
    # Utils and helpers
    "// Hook für Domain-Labels mit Übersetzungen": "// Hook for domain labels with translations",
    "// Hook für Type-Labels mit Übersetzungen": "// Hook for type labels with translations",
    "// Fallback-Funktionen für Kompatibilität (deprecated - verwenden Sie die Hooks)": "// Fallback functions for compatibility (deprecated - use the hooks)",
    "// Gibt ein menschenlesbares Label für einen Type-Wert zurück": "// Returns a human-readable label for a type value",
    "// Hook für internationalisierte Datumsformatierung": "// Hook for internationalized date formatting",
    "// Template für Entity Types": "// Template for entity types",
    "// Exportierte Standard-Spaltenvisibilität für die Company-Tabelle": "// Exported default column visibility for the company table",
    "// Schema für die Formularvalidierung (Export für externe Verwendung)": "// Schema for form validation (export for external use)",
    "// Für die Company-Form laden wir alle verfügbaren Personen": "// For the company form we load all available persons",
    "// Formulardaten mit useMemo initialisieren": "// Initialize form data with useMemo",
    "// Formulardaten mit useMemo initialisieren, um unnötige Re-Renders zu vermeiden": "// Initialize form data with useMemo to avoid unnecessary re-renders",
    
    # Filter dialogs
    "// Definiere Filterfelder für den generischen Dialog": "// Define filter fields for the generic dialog",
    "// Teil von Architekturen Filter": "// Part of architectures filter",
    "// Handler für Änderungen der Filter": "// Handler for filter changes",
    
    # Forms
    "// Basis-Schema für die Formularvalidierung": "// Base schema for form validation",
    "// Erweiterte Schema-Validierung mit Lifecycle-Logik": "// Extended schema validation with lifecycle logic",
    "// Schema für die Formularvalidierung mit erweiterten Validierungen": "// Schema for form validation with extended validations",
    "// Lifecycle-Datums-Validierung mit individuellen Fehlermeldungen": "// Lifecycle date validation with individual error messages",
    "// Füge Fehlermeldung zum späteren Datum hinzu": "// Add error message to the later date",
    "// IN_DEVELOPMENT/PLANNED: Einführungsdatum muss in der Zukunft liegen (oder nicht gesetzt sein)": "// IN_DEVELOPMENT/PLANNED: Introduction date must be in the future (or not set)",
    "// UND End-of-Use muss in der Zukunft liegen (oder nicht gesetzt sein)": "// AND end-of-use must be in the future (or not set)",
    "// Tab-Konfiguration mit Übersetzungen": "// Tab configuration with translations",
    "// Daten laden mit cache-and-network Policy für frische Daten": "// Load data with cache-and-network policy for fresh data",
    "// Validierung beim Absenden": "// Validation on submit",
    "// Nicht-reaktives Flag für unerwartete Zustandsbehandlung": "// Non-reactive flag for unexpected state handling",
    "// Im CREATE-Modus mit leeren Standardwerten initialisieren": "// Initialize with empty default values in CREATE mode",
    "// Im edit/view Mode mit Werten aus applicationInterface initialisieren": "// Initialize with values from applicationInterface in edit/view mode",
    "// Formular mit den Werten aus der vorhandenen Schnittstelle zurücksetzen": "// Reset form with values from existing interface",
    "// Immer mit Standardwerten zurücksetzen": "// Always reset with default values",
    "// Feldkonfiguration für das generische Formular": "// Field configuration for the generic form",
    
    # Table specific
    "// resetColumnVisibility wird für zukünftige Reset-Funktionalität benötigt": "// resetColumnVisibility is needed for future reset functionality",
    "tableKey: 'interfaces', // Korrigiert: stimmt jetzt mit ApplicationInterfaceToolbar überein": "tableKey: 'interfaces', // Fixed: now matches ApplicationInterfaceToolbar",
    "tableKey: 'infrastructure', // Korrigiert: stimmt jetzt mit InfrastructureToolbar überein": "tableKey: 'infrastructure', // Fixed: now matches InfrastructureToolbar",
    "// Helper function for die Anzeige des Infrastruktur-Typs mit farblichem Chip": "// Helper function for displaying infrastructure type with colored chip",
    "// Helper function for die Anzeige des Status mit farblichem Chip": "// Helper function for displaying status with colored chip",
    "// mapDataToFormValues entfernt - die InfrastructureForm arbeitet direkt mit der infrastructure Prop": "// mapDataToFormValues removed - InfrastructureForm works directly with infrastructure prop",
    
    # Type declarations
    "// TypeScript-Deklarationen für Hypher-Bibliothek": "// TypeScript declarations for Hypher library",
    
    # Fehlerbehandlung
    "// Fehlerbehandlung": "// Error handling",
    "Fehler beim Laden der Business Capabilities": "Error loading business capabilities",
    "Business Capability erfolgreich erstellt": "Business capability created successfully",
    "Fehler beim Erstellen der Business Capability": "Error creating business capability",
    "Business Capability erfolgreich aktualisiert": "Business capability updated successfully",
    "Fehler beim Aktualisieren der Business Capability": "Error updating business capability",
    "Business Capability erfolgreich gelöscht": "Business capability deleted successfully",
    "Fehler beim Löschen der Business Capability": "Error deleting business capability",
    "Bitte zuerst ein Unternehmen auswählen.": "Please select a company first.",
}

def translate_file(file_path: Path) -> Tuple[bool, int]:
    """
    Translate German comments in a file to English
    Returns: (was_modified, number_of_changes)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = 0
        
        # Apply each translation
        for german, english in COMMENT_TRANSLATIONS.items():
            if german in content:
                count_before = content.count(german)
                content = content.replace(german, english)
                count_after = content.count(german)
                changes_made += (count_before - count_after)
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, changes_made
        
        return False, 0
    
    except Exception as e:
        print(f"  ⚠️  Error processing {file_path}: {e}")
        return False, 0

def find_and_translate(directory: Path, extensions: List[str]) -> Tuple[int, int]:
    """
    Find and translate all files with given extensions in directory
    Returns: (files_modified, total_changes)
    """
    files_modified = 0
    total_changes = 0
    
    for ext in extensions:
        for file_path in directory.rglob(f'*{ext}'):
            was_modified, changes = translate_file(file_path)
            if was_modified:
                print(f"  ✓ {file_path.relative_to(directory.parent)}: {changes} changes")
                files_modified += 1
                total_changes += changes
            
    return files_modified, total_changes

def main():
    """Main translation process"""
    print("🌍 Translating complete German comment lines to English...\n")
    
    base_dir = Path(__file__).parent.parent
    
    # Translate server files
    print("📁 Translating server source files...")
    server_dir = base_dir / 'server' / 'src'
    if server_dir.exists():
        server_files, server_changes = find_and_translate(server_dir, ['.ts'])
        print(f"   Server: {server_files} files modified, {server_changes} total changes\n")
    else:
        print("   ⚠️  Server directory not found\n")
    
    # Translate client files
    print("📁 Translating client source files...")
    client_dir = base_dir / 'client' / 'src'
    if client_dir.exists():
        client_files, client_changes = find_and_translate(client_dir, ['.ts', '.tsx'])
        print(f"   Client: {client_files} files modified, {client_changes} total changes\n")
    else:
        print("   ⚠️  Client directory not found\n")
    
    print("✅ Translation complete!")

if __name__ == '__main__':
    main()
