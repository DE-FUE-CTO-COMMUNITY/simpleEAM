#!/usr/bin/env python3
"""
Translation script for German to English comments in Simple EAM
Systematically translates German comments and strings to English
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple

# Translation mappings from German to English
TRANSLATIONS: Dict[str, str] = {
    # Configuration
    "Konfiguration aus Umgebungsvariablen": "Configuration from environment variables",
    "Keycloak-Konfiguration": "Keycloak configuration",
    "Neo4j-Verbindungsparameter": "Neo4j connection parameters",
    "Neo4j-Konfiguration": "Neo4j configuration",
    "Allgemeine Einstellungen": "General settings",
    
    # Connection and network
    "Verwende den Container-Namen": "Use the container name",
    "für zuverlässigere Verbindung": "for more reliable connection",
    "Erstellen der Neo4j-Driver-Instanz": "Creating the Neo4j driver instance",
    "mit erweiterten Verbindungsoptionen": "with advanced connection options",
    "Erhöhte Timeouts für langsamere": "Increased timeouts for slower",
    "Netzwerke/Container-Starts": "networks/container starts",
    "Encryption explizit deaktivieren": "Explicitly disable encryption",
    "für Entwicklungsumgebung": "for development environment",
    "Funktion zum Testen der Datenbankverbindung": "Function to test database connection",
    "mit Retry-Mechanismus": "with retry mechanism",
    "Funktion zum Beenden der Datenbankverbindung": "Function to close database connection",
    
    # Authentication
    "Extrahiert das Bearer-Token aus dem Authorization-Header": "Extracts the Bearer token from the Authorization header",
    "Überprüft das JWT-Token": "Verifies the JWT token",
    "und gibt den decodierten Inhalt zurück": "and returns the decoded content",
    "In der vollständigen Implementation": "In the full implementation",
    "sollte der Public Key von Keycloak": "the public key from Keycloak should",
    "verwendet werden": "be used",
    "Für Phase 1 vereinfachen wir": "For Phase 1 we simplify",
    "die Verifizierung": "the verification",
    "Token-Verifizierungsfehler": "Token verification error",
    "Erstellt den Kontext für den GraphQL-Server": "Creates the context for the GraphQL server",
    "basierend auf der Anfrage": "based on the request",
    "Token aus Header extrahieren": "Extract token from header",
    "Token überprüfen": "Verify token",
    "Benutzer ist authentifiziert": "User is authenticated",
    
    # JWKS
    "JWKS-Client für Keycloak": "JWKS client for Keycloak",
    "Optionale zusätzliche Headers": "Optional additional headers",
    "Zeitüberschreitung in Millisekunden": "Timeout in milliseconds",
    "Cache die öffentlichen Schlüssel": "Cache the public keys",
    "Maximale Anzahl der zwischengespeicherten Schlüssel": "Maximum number of cached keys",
    "verursacht Probleme mit neueren": "causes problems with newer",
    "Holt den öffentlichen Schlüssel": "Retrieves the public key",
    "für die JWT-Verifikation von Keycloak": "for JWT verification from Keycloak",
    "enthält keine Key ID": "does not contain Key ID",
    "Fehler beim Abrufen des Signing-Keys": "Error retrieving signing key",
    "Kein Schlüssel erhalten": "No key received",
    "Die API kann unterschiedlich sein": "The API may be different",
    "versuche verschiedene Zugriffsarten": "try different access methods",
    "Versuche die verschiedenen möglichen": "Try the various possible",
    "API-Strukturen": "API structures",
    "Unbekannte Schlüssel-Struktur": "Unknown key structure",
    "Schlüssel ist kein Objekt": "Key is not an object",
    "Konnte öffentlichen Schlüssel nicht extrahieren": "Could not extract public key",
    "Überprüft die Gültigkeit eines JWT-Tokens": "Verifies the validity of a JWT token",
    "mit Keycloak JWKS": "with Keycloak JWKS",
    
    # GraphQL
    "Umgebungsvariablen laden": "Load environment variables",
    "GraphQL-Typendefinitionen aus der Schema-Datei lesen": "Read GraphQL type definitions from schema file",
    "JWKS URL konstruieren": "Construct JWKS URL",
    "Neo4j GraphQL-Instanz erstellen": "Create Neo4j GraphQL instance",
    "mit JWT-Konfiguration": "with JWT configuration",
    "Schema generieren": "Generate schema",
    "Request für Neo4j GraphQL Library weiterleiten": "Forward request for Neo4j GraphQL Library",
    "Rohes Token für Neo4j GraphQL Library": "Raw token for Neo4j GraphQL Library",
    "Angepasstes JWT für Neo4j GraphQL Library": "Adapted JWT for Neo4j GraphQL Library",
    "mit direkten Rollen": "with direct roles",
    "Rollen aus realm_access extrahieren": "Extract roles from realm_access",
    "und direkt im JWT verfügbar machen": "and make directly available in JWT",
    
    # Server/Express
    "Eigene Module importieren": "Import custom modules",
    "Server-Portnummer": "Server port number",
    "standardmäßig": "by default",
    "Neo4j-Verbindung testen": "Test Neo4j connection",
    "Express-App initialisieren": "Initialize Express app",
    "HTTP-Server erstellen": "Create HTTP server",
    "Middleware konfigurieren": "Configure middleware",
    "Erhöhe die Body-Parser-Limits": "Increase body parser limits",
    "für große Diagramm-Payloads": "for large diagram payloads",
    "GraphQL-Schema erstellen": "Create GraphQL schema",
    "Apollo-Server initialisieren": "Initialize Apollo server",
    "Token direkt aus Authorization Header": "Token directly from Authorization header",
    "an Neo4j GraphQL Library weitergeben": "forward to Neo4j GraphQL Library",
    "Für Entwicklung aktivieren": "Enable for development",
    "Apollo-Server starten": "Start Apollo server",
    "Apollo-Middleware an Express anbinden": "Connect Apollo middleware to Express",
    "mit erweiterten Body-Parser-Optionen": "with extended body parser options",
    "Gesundheitsprüfung-Endpunkt": "Health check endpoint",
    "Gesundheitsprüfung verfügbar auf": "Health check available at",
    "Server gestartet auf": "Server started at",
    "Server starten": "Start server",
    "Aufräumen bei Server-Beendigung": "Cleanup on server termination",
    "Server starten und Fehler abfangen": "Start server and catch errors",
    
    # Common words
    "entfernen": "remove",
    "Bitte verwenden Sie yarn für dieses Projekt": "Please use yarn for this project",
    "Nicht gesetzt": "Not set",
    "Deklaration zur Lösung von Typ-Inkompatibilitäten": "Declaration to resolve type incompatibilities",
    "in Middleware-Paketen": "in middleware packages",
    "Hinzufügen von leeren Deklarationen": "Add empty declarations",
    "um Typkonflikte zu beheben": "to resolve type conflicts",
    
    # Additional patterns
    "cacheMaxAge entfernt": "cacheMaxAge removed",
    
    # Theme and design
    "Farbpalette für das": "Color palette for the",
    "Corporate Design": "Corporate Design",
    "dynamisch aus Umgebungsvariablen": "dynamically from environment variables",
    "Fallback für unbekannte Farben": "Fallback for unknown colors",
    "Fallback: Verwende die ursprüngliche Farbe für alle Varianten": "Fallback: Use the original color for all variants",
    "aus Load environment variables": "from environment variables",
    "Generiert Farbvarianten aus einer Hauptfarbe": "Generates color variants from a main color",
    "Angepasst für Button-Hintergründe analog zum Original": "Adapted for button backgrounds similar to original",
    "Generiert automatisch Farbvarianten aus der Hauptfarbe": "Automatically generates color variants from the main color",
    "Sehr hell für Button-Hintergründe wie": "Very light for button backgrounds like",
    "Hell für UI-Elemente": "Light for UI elements",
    "Brand Color Familie für": "Brand color family for",
    "Container Farben für": "Container colors for",
    "Button States für": "Button states for",
    "Dark Mode": "dark mode",
    "Generiert für": "Generated for",
    
    # Component and utility comments
    "Standardzustand für Filter": "Default state for filters",
    "Filterfunktion für erweiterte Filter": "Filter function for advanced filters",
    "Setze das Ende des Tages für den Endzeitpunkt": "Set end of day for end time",
    "Nutze den generierten Typ als Basis": "Use the generated type as basis",
    "und passe ihn für unsere Komponenten an": "and adapt it for our components",
    "Wenn diagramJson verfügbar ist, direkt verwenden": "If diagramJson is available, use it directly",
    "Chips für Typ und Datum": "Chips for type and date",
    "Hilfsfunktion für": "Helper function for",
    "Interface Type Labels": "interface type labels",
    "Status Labels": "status labels",
    "Protokoll Labels": "protocol labels",
    "Hilfsfunktion zur Formatierung von Datum": "Helper function for date formatting",
    
    # Layout comments
    "Wenn Keycloak initialisiert ist, aber der Benutzer nicht authentifiziert ist": "If Keycloak is initialized but user is not authenticated",
    "Administration nur für Admins - ganz unten": "Administration only for admins - at the bottom",
    "CssBaseline wird bereits im layout.tsx verwendet": "CssBaseline is already used in layout.tsx",
    "Spacer für die AppBar": "Spacer for the AppBar",
    "Hydration-Fix: Nur rendern wenn Auth initialisiert ist": "Hydration fix: Only render when auth is initialized",
    "Emotion Cache für Server-Side Rendering": "Emotion cache for server-side rendering",
    "mit besserer Hydration-Kompatibilität": "with better hydration compatibility",
    "Stabile Konfiguration für Server und Client": "Stable configuration for server and client",
    "Interne Komponente für die automatische Benutzerregistrierung": "Internal component for automatic user registration",
    "Apollo Client mit dynamischem Token erstellen": "Create Apollo client with dynamic token",
    "einmalig": "once",
    "Token Refresh Listener": "Token refresh listener",
    "aktualisiere nur den Token, nicht den ganzen Client": "update only the token, not the entire client",
    "Der Apollo Client wird so konfiguriert, dass er das aktuelle Token": "The Apollo client is configured to use the current token",
    "Auth Error Listener": "Auth error listener",
    "erstelle Client ohne Token": "create client without token",
    
    # Excel import/export
    "Fallback für Singular-Form": "Fallback for singular form",
    "Wenn alle Daten oder nur Diagramme gelöscht werden": "If all data or only diagrams are deleted",
    "auch den Diagramm-localStorage leeren": "also clear the diagram localStorage",
    "Diagramme werden je nach Format unterschiedlich angezeigt": "Diagrams are displayed differently depending on format",
    "Hinweis für einzelne Diagramm-Exports": "Note for individual diagram exports",
    "Nur für JSON-Import verfügbar": "Only available for JSON import",
    "Nur für JSON-Export verfügbar": "Only available for JSON export",
    "Übersetzungsfunktion für Entity Types": "Translation function for entity types",
    "GraphQL Mutations für Import/Export": "GraphQL mutations for import/export",
    "GraphQL Mutations für Datenlöschung": "GraphQL mutations for data deletion",
    "Helper-Funktion: Gibt die passende DELETE Mutation für einen Entity-Type zurück": "Helper function: Returns the appropriate DELETE mutation for an entity type",
    "Exportierte Default Column Visibility für": "Exported default column visibility for",
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
        for german, english in TRANSLATIONS.items():
            if german in content:
                content = content.replace(german, english)
                changes_made += content.count(english) - original_content.count(english)
        
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
    print("🌍 Starting translation of German comments to English...\n")
    
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
    print("\n📝 Note: This script translated common German phrases.")
    print("   Please review the changes and manually translate any remaining German text.")

if __name__ == '__main__':
    main()
