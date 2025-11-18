#!/bin/bash

# Translation script for German to English comments
# This script translates common German words and phrases in comments to English

set -e

echo "Starting translation of German comments to English..."

# Define translation pairs (German -> English)
declare -A translations=(
    # Common comment patterns
    ["Konfiguration aus Umgebungsvariablen"]="Configuration from environment variables"
    ["Keycloak-Konfiguration"]="Keycloak configuration"
    ["Neo4j-Verbindungsparameter"]="Neo4j connection parameters"
    ["Verwende den Container-Namen"]="Use the container name"
    ["für zuverlässigere Verbindung"]="for more reliable connection"
    ["Erstellen der Neo4j-Driver-Instanz"]="Creating the Neo4j driver instance"
    ["mit erweiterten Verbindungsoptionen"]="with advanced connection options"
    ["Erhöhte Timeouts für langsamere"]="Increased timeouts for slower"
    ["Netzwerke/Container-Starts"]="networks/container starts"
    ["Encryption explizit deaktivieren"]="Explicitly disable encryption"
    ["für Entwicklungsumgebung"]="for development environment"
    ["Funktion zum Testen der Datenbankverbindung"]="Function to test database connection"
    ["mit Retry-Mechanismus"]="with retry mechanism"
    ["Funktion zum Beenden der Datenbankverbindung"]="Function to close database connection"
    
    # Auth related
    ["Extrahiert das Bearer-Token aus dem Authorization-Header"]="Extracts the Bearer token from the Authorization header"
    ["entfernen"]="remove"
    ["Überprüft das JWT-Token"]="Verifies the JWT token"
    ["und gibt den decodierten Inhalt zurück"]="and returns the decoded content"
    ["In der vollständigen Implementation"]="In the full implementation"
    ["sollte der Public Key von Keycloak"]="the public key from Keycloak should"
    ["verwendet werden"]="be used"
    ["Für Phase 1 vereinfachen wir"]="For Phase 1 we simplify"
    ["die Verifizierung"]="the verification"
    ["Token-Verifizierungsfehler"]="Token verification error"
    ["Erstellt den Kontext für den GraphQL-Server"]="Creates the context for the GraphQL server"
    ["basierend auf der Anfrage"]="based on the request"
    ["Token aus Header extrahieren"]="Extract token from header"
    ["Token überprüfen"]="Verify token"
    ["Benutzer ist authentifiziert"]="User is authenticated"
    ["JWKS-Client für Keycloak"]="JWKS client for Keycloak"
    ["Optionale zusätzliche Headers"]="Optional additional headers"
    ["Zeitüberschreitung in Millisekunden"]="Timeout in milliseconds"
    ["Cache die öffentlichen Schlüssel"]="Cache the public keys"
    ["Maximale Anzahl der zwischengespeicherten Schlüssel"]="Maximum number of cached keys"
    ["verursacht Probleme mit neueren"]="causes problems with newer"
    ["Holt den öffentlichen Schlüssel"]="Retrieves the public key"
    ["für die JWT-Verifikation von Keycloak"]="for JWT verification from Keycloak"
    ["enthält keine Key ID"]="does not contain Key ID"
    ["Fehler beim Abrufen des Signing-Keys"]="Error retrieving signing key"
    ["Kein Schlüssel erhalten"]="No key received"
    ["Die API kann unterschiedlich sein"]="The API may be different"
    ["versuche verschiedene Zugriffsarten"]="try different access methods"
    ["Versuche die verschiedenen möglichen"]="Try the various possible"
    ["API-Strukturen"]="API structures"
    ["Unbekannte Schlüssel-Struktur"]="Unknown key structure"
    ["Schlüssel ist kein Objekt"]="Key is not an object"
    ["Konnte öffentlichen Schlüssel nicht extrahieren"]="Could not extract public key"
    ["Überprüft die Gültigkeit eines JWT-Tokens"]="Verifies the validity of a JWT token"
    ["mit Keycloak JWKS"]="with Keycloak JWKS"
    
    # GraphQL related
    ["Umgebungsvariablen laden"]="Load environment variables"
    ["GraphQL-Typendefinitionen aus der Schema-Datei lesen"]="Read GraphQL type definitions from schema file"
    ["JWKS URL konstruieren"]="Construct JWKS URL"
    ["Neo4j GraphQL-Instanz erstellen"]="Create Neo4j GraphQL instance"
    ["mit JWT-Konfiguration"]="with JWT configuration"
    ["Schema generieren"]="Generate schema"
    ["Request für Neo4j GraphQL Library weiterleiten"]="Forward request for Neo4j GraphQL Library"
    ["Rohes Token für Neo4j GraphQL Library"]="Raw token for Neo4j GraphQL Library"
    ["Angepasstes JWT für Neo4j GraphQL Library"]="Adapted JWT for Neo4j GraphQL Library"
    ["mit direkten Rollen"]="with direct roles"
    ["Rollen aus realm_access extrahieren"]="Extract roles from realm_access"
    ["und direkt im JWT verfügbar machen"]="and make directly available in JWT"
    
    # Server/Express related
    ["Eigene Module importieren"]="Import custom modules"
    ["Server-Portnummer"]="Server port number"
    ["standardmäßig"]="by default"
    ["Neo4j-Verbindung testen"]="Test Neo4j connection"
    ["Express-App initialisieren"]="Initialize Express app"
    ["HTTP-Server erstellen"]="Create HTTP server"
    ["Middleware konfigurieren"]="Configure middleware"
    ["Erhöhe die Body-Parser-Limits"]="Increase body parser limits"
    ["für große Diagramm-Payloads"]="for large diagram payloads"
    ["GraphQL-Schema erstellen"]="Create GraphQL schema"
    ["Apollo-Server initialisieren"]="Initialize Apollo server"
    ["Token direkt aus Authorization Header"]="Token directly from Authorization header"
    ["an Neo4j GraphQL Library weitergeben"]="forward to Neo4j GraphQL Library"
    ["Für Entwicklung aktivieren"]="Enable for development"
    ["Apollo-Server starten"]="Start Apollo server"
    ["Apollo-Middleware an Express anbinden"]="Connect Apollo middleware to Express"
    ["mit erweiterten Body-Parser-Optionen"]="with extended body parser options"
    ["Gesundheitsprüfung-Endpunkt"]="Health check endpoint"
    ["Gesundheitsprüfung verfügbar auf"]="Health check available at"
    ["Server gestartet auf"]="Server started at"
    ["Server starten"]="Start server"
    ["Aufräumen bei Server-Beendigung"]="Cleanup on server termination"
    ["Server starten und Fehler abfangen"]="Start server and catch errors"
    
    # TypeScript related
    ["Deklaration zur Lösung von Typ-Inkompatibilitäten"]="Declaration to resolve type incompatibilities"
    ["in Middleware-Paketen"]="in middleware packages"
    ["Hinzufügen von leeren Deklarationen"]="Add empty declarations"
    ["um Typkonflikte zu beheben"]="to resolve type conflicts"
    
    # Database init related
    ["Bitte verwenden Sie yarn für dieses Projekt"]="Please use yarn for this project"
    ["Nicht gesetzt"]="Not set"
)

# Function to translate a file
translate_file() {
    local file="$1"
    echo "Translating: $file"
    
    # Create temporary file
    local temp_file=$(mktemp)
    
    # Copy original file
    cp "$file" "$temp_file"
    
    # Apply all translations
    for german in "${!translations[@]}"; do
        english="${translations[$german]}"
        # Escape special characters for sed
        german_escaped=$(echo "$german" | sed 's/[[\.*^$/]/\\&/g')
        english_escaped=$(echo "$english" | sed 's/[\/&]/\\&/g')
        sed -i "s/$german_escaped/$english_escaped/g" "$temp_file"
    done
    
    # Replace file if changes were made
    if ! cmp -s "$file" "$temp_file"; then
        mv "$temp_file" "$file"
        echo "  ✓ Translated"
    else
        rm "$temp_file"
        echo "  - No changes"
    fi
}

# Find and translate all TypeScript files in server/src
echo "Translating server source files..."
find server/src -type f -name "*.ts" | while read -r file; do
    translate_file "$file"
done

# Find and translate all TypeScript files in client/src
echo "Translating client source files..."
find client/src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    translate_file "$file"
done

echo "Translation complete!"
echo ""
echo "Note: This script translated common German phrases."
echo "Please review the changes and manually translate any remaining German text."
