#!/bin/bash

# Script zur automatisierten Erstellung einer neuen Entity nach dem Standard-Pattern
# Verwendung: ./create-entity.sh [entity-name]
# Beispiel: ./create-entity.sh companies

set -e

# Funktion zur automatischen Ableitung des deutschen Display Names
get_german_display_name() {
    local entity_name=$1
    case $entity_name in
        "companies") echo "Unternehmen" ;;
        "organisations") echo "Organisationen" ;;
        "projects") echo "Projekte" ;;
        "contracts") echo "Verträge" ;;
        "suppliers") echo "Lieferanten" ;;
        "customers") echo "Kunden" ;;
        "departments") echo "Abteilungen" ;;
        "teams") echo "Teams" ;;
        "locations") echo "Standorte" ;;
        "assets") echo "Assets" ;;
        "services") echo "Services" ;;
        "processes") echo "Prozesse" ;;
        *) 
            # Fallback: Erste Buchstabe groß, Rest klein
            echo "$(echo ${entity_name:0:1} | tr '[:lower:]' '[:upper:]')$(echo ${entity_name:1} | tr '[:upper:]' '[:lower:]')"
            ;;
    esac
}

# Funktion zur automatischen Ableitung des englischen Display Names
get_english_display_name() {
    local entity_name=$1
    # Erste Buchstabe groß, Rest klein
    echo "$(echo ${entity_name:0:1} | tr '[:lower:]' '[:upper:]')$(echo ${entity_name:1} | tr '[:upper:]' '[:lower:]')"
}

# Funktion zur korrekten Ableitung der Singular-Form
get_singular_form() {
    local entity_name=$1
    case $entity_name in
        "companies") echo "company" ;;
        "organisations") echo "organisation" ;;
        "projects") echo "project" ;;
        "contracts") echo "contract" ;;
        "suppliers") echo "supplier" ;;
        "customers") echo "customer" ;;
        "departments") echo "department" ;;
        "teams") echo "team" ;;
        "locations") echo "location" ;;
        "assets") echo "asset" ;;
        "services") echo "service" ;;
        "processes") echo "process" ;;
        "categories") echo "category" ;;
        "activities") echo "activity" ;;
        "entities") echo "entity" ;;
        "facilities") echo "facility" ;;
        "cities") echo "city" ;;
        *) 
            # Fallback: Einfaches Entfernen des 's' am Ende
            echo "${entity_name%s}"
            ;;
    esac
}

# Funktion zur korrekten Ableitung der deutschen Singular-Form
get_german_singular_form() {
    local entity_name=$1
    case $entity_name in
        "companies") echo "Unternehmen" ;;
        "organisations") echo "Organisation" ;;
        "projects") echo "Projekt" ;;
        "contracts") echo "Vertrag" ;;
        "suppliers") echo "Lieferant" ;;
        "customers") echo "Kunde" ;;
        "departments") echo "Abteilung" ;;
        "teams") echo "Team" ;;
        "locations") echo "Standort" ;;
        "assets") echo "Asset" ;;
        "services") echo "Service" ;;
        "processes") echo "Prozess" ;;
        "categories") echo "Kategorie" ;;
        "activities") echo "Aktivität" ;;
        "entities") echo "Entität" ;;
        "facilities") echo "Einrichtung" ;;
        "cities") echo "Stadt" ;;
        *) 
            # Fallback: Deutsche Pluralform verwenden
            get_german_display_name "$entity_name"
            ;;
    esac
}

# Parameter prüfen
if [ $# -lt 1 ]; then
    echo "Verwendung: $0 [entity-name]"
    echo "Beispiel: $0 companies"
    echo ""
    echo "Unterstützte Entity Names mit automatischen Display Names:"
    echo "  companies     → Unternehmen (DE), Companies (EN)"
    echo "  organisations → Organisationen (DE), Organisations (EN)"
    echo "  projects      → Projekte (DE), Projects (EN)"
    echo "  contracts     → Verträge (DE), Contracts (EN)"
    echo "  suppliers     → Lieferanten (DE), Suppliers (EN)"
    echo "  customers     → Kunden (DE), Customers (EN)"
    echo "  departments   → Abteilungen (DE), Departments (EN)"
    echo "  teams         → Teams (DE), Teams (EN)"
    echo "  locations     → Standorte (DE), Locations (EN)"
    echo "  assets        → Assets (DE), Assets (EN)"
    echo "  services      → Services (DE), Services (EN)"
    echo "  processes     → Prozesse (DE), Processes (EN)"
    echo ""
    echo "Für andere Namen wird automatisch abgeleitet (erste Buchstabe groß)."
    exit 1
fi

ENTITY_NAME=$1
ENTITY_DISPLAY_NAME_DE=$(get_german_display_name $ENTITY_NAME)
ENTITY_DISPLAY_NAME_EN=$(get_english_display_name $ENTITY_NAME)
ENTITY_NAME_UPPER=$(echo $ENTITY_NAME | sed 's/^./\U&/')
ENTITY_NAME_LOWER=$ENTITY_NAME
ENTITY_NAME_SINGULAR=$(get_singular_form $ENTITY_NAME)
ENTITY_NAME_SINGULAR_UPPER=$(echo $ENTITY_NAME_SINGULAR | sed 's/^./\U&/')
ENTITY_NAME_SINGULAR_LOWER=$ENTITY_NAME_SINGULAR
ENTITY_SINGULAR_DE=$(get_german_singular_form $ENTITY_NAME)

echo "🚀 Erstelle neue Entity: $ENTITY_NAME"
echo "📁 Entity Name: $ENTITY_NAME"
echo "🇩🇪 Display Name (DE): $ENTITY_DISPLAY_NAME_DE"
echo "🇬🇧 Display Name (EN): $ENTITY_DISPLAY_NAME_EN"
echo "🔤 Singular: $ENTITY_NAME_SINGULAR"
echo ""

# Basis-Verzeichnisse erstellen
echo "📂 Erstelle Verzeichnisstruktur..."
mkdir -p "client/src/app/[lang]/$ENTITY_NAME"
mkdir -p "client/src/components/$ENTITY_NAME"

# Phase 1: Template-Struktur kopieren und anpassen
echo "📋 Kopiere Template-Struktur..."

# GraphQL Operations aus Template kopieren
echo "  📄 GraphQL Operations..."
cp "templates/entity/graphql/{{ENTITY_SINGULAR}}.ts.template" "client/src/graphql/$ENTITY_NAME_SINGULAR.ts"

# Komponenten aus Templates kopieren
echo "  🧩 Komponenten..."
cp "templates/entity/components/types.ts.template" "client/src/components/$ENTITY_NAME/types.ts"
cp "templates/entity/components/utils.ts.template" "client/src/components/$ENTITY_NAME/utils.ts"
cp "templates/entity/components/use{{ENTITY_SINGULAR_UPPER}}Filter.ts.template" "client/src/components/$ENTITY_NAME/use${ENTITY_NAME_SINGULAR_UPPER}Filter.ts"
cp "templates/entity/components/{{ENTITY_SINGULAR_UPPER}}Form.tsx.template" "client/src/components/$ENTITY_NAME/${ENTITY_NAME_SINGULAR_UPPER}Form.tsx"
cp "templates/entity/components/{{ENTITY_SINGULAR_UPPER}}Table.tsx.template" "client/src/components/$ENTITY_NAME/${ENTITY_NAME_SINGULAR_UPPER}Table.tsx"
cp "templates/entity/components/{{ENTITY_SINGULAR_UPPER}}Toolbar.tsx.template" "client/src/components/$ENTITY_NAME/${ENTITY_NAME_SINGULAR_UPPER}Toolbar.tsx"
cp "templates/entity/components/{{ENTITY_SINGULAR_UPPER}}FilterDialog.tsx.template" "client/src/components/$ENTITY_NAME/${ENTITY_NAME_SINGULAR_UPPER}FilterDialog.tsx"

# Hauptseite aus Template kopieren
echo "  📃 Hauptseite..."
cp "templates/entity/page/page.tsx.template" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"

# Phase 2: Template-Platzhalter ersetzen
echo "🔄 Passe Template-Platzhalter an..."

# Alle erstellten Dateien durchgehen und Platzhalter ersetzen
echo "  🔧 GraphQL Operations..."
sed -i "s/{{ENTITY_NAME}}/$ENTITY_NAME/g" "client/src/graphql/$ENTITY_NAME_SINGULAR.ts"
sed -i "s/{{ENTITY_SINGULAR}}/$ENTITY_NAME_SINGULAR/g" "client/src/graphql/$ENTITY_NAME_SINGULAR.ts"
sed -i "s/{{ENTITY_SINGULAR_UPPER}}/$ENTITY_NAME_SINGULAR_UPPER/g" "client/src/graphql/$ENTITY_NAME_SINGULAR.ts"
sed -i "s/{{ENTITY_NAME_UPPER}}/$ENTITY_NAME_UPPER/g" "client/src/graphql/$ENTITY_NAME_SINGULAR.ts"

echo "  🏷️  Types..."
sed -i "s/{{ENTITY_NAME}}/$ENTITY_NAME/g" "client/src/components/$ENTITY_NAME/types.ts"
sed -i "s/{{ENTITY_SINGULAR}}/$ENTITY_NAME_SINGULAR/g" "client/src/components/$ENTITY_NAME/types.ts"
sed -i "s/{{ENTITY_SINGULAR_UPPER}}/$ENTITY_NAME_SINGULAR_UPPER/g" "client/src/components/$ENTITY_NAME/types.ts"
sed -i "s/{{ENTITY_NAME_UPPER}}/$ENTITY_NAME_UPPER/g" "client/src/components/$ENTITY_NAME/types.ts"

echo "  🛠️  Utils..."
sed -i "s/{{ENTITY_NAME}}/$ENTITY_NAME/g" "client/src/components/$ENTITY_NAME/utils.ts"
sed -i "s/{{ENTITY_SINGULAR}}/$ENTITY_NAME_SINGULAR/g" "client/src/components/$ENTITY_NAME/utils.ts"
sed -i "s/{{ENTITY_SINGULAR_UPPER}}/$ENTITY_NAME_SINGULAR_UPPER/g" "client/src/components/$ENTITY_NAME/utils.ts"
sed -i "s/{{ENTITY_NAME_UPPER}}/$ENTITY_NAME_UPPER/g" "client/src/components/$ENTITY_NAME/utils.ts"

echo "  🔍 Filter Hook..."
sed -i "s/{{ENTITY_NAME}}/$ENTITY_NAME/g" "client/src/components/$ENTITY_NAME/use${ENTITY_NAME_SINGULAR_UPPER}Filter.ts"
sed -i "s/{{ENTITY_SINGULAR}}/$ENTITY_NAME_SINGULAR/g" "client/src/components/$ENTITY_NAME/use${ENTITY_NAME_SINGULAR_UPPER}Filter.ts"
sed -i "s/{{ENTITY_SINGULAR_UPPER}}/$ENTITY_NAME_SINGULAR_UPPER/g" "client/src/components/$ENTITY_NAME/use${ENTITY_NAME_SINGULAR_UPPER}Filter.ts"
sed -i "s/{{ENTITY_NAME_UPPER}}/$ENTITY_NAME_UPPER/g" "client/src/components/$ENTITY_NAME/use${ENTITY_NAME_SINGULAR_UPPER}Filter.ts"

echo "  🧩 Komponenten..."
for component in "Form" "Table" "Toolbar" "FilterDialog"; do
    file="client/src/components/$ENTITY_NAME/${ENTITY_NAME_SINGULAR_UPPER}${component}.tsx"
    sed -i "s/{{ENTITY_NAME}}/$ENTITY_NAME/g" "$file"
    sed -i "s/{{ENTITY_NAME_LOWER}}/$ENTITY_NAME_LOWER/g" "$file"
    sed -i "s/{{ENTITY_SINGULAR}}/$ENTITY_NAME_SINGULAR/g" "$file"
    sed -i "s/{{ENTITY_SINGULAR_LOWER}}/$ENTITY_NAME_SINGULAR_LOWER/g" "$file"
    sed -i "s/{{ENTITY_SINGULAR_UPPER}}/$ENTITY_NAME_SINGULAR_UPPER/g" "$file"
    sed -i "s/{{ENTITY_NAME_UPPER}}/$ENTITY_NAME_UPPER/g" "$file"
done

echo "  📃 Hauptseite..."
sed -i "s/{{ENTITY_NAME}}/$ENTITY_NAME/g" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"
sed -i "s/{{ENTITY_NAME_LOWER}}/$ENTITY_NAME_LOWER/g" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"
sed -i "s/{{ENTITY_SINGULAR}}/$ENTITY_NAME_SINGULAR/g" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"
sed -i "s/{{ENTITY_SINGULAR_LOWER}}/$ENTITY_NAME_SINGULAR_LOWER/g" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"
sed -i "s/{{ENTITY_SINGULAR_UPPER}}/$ENTITY_NAME_SINGULAR_UPPER/g" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"
sed -i "s/{{ENTITY_NAME_UPPER}}/$ENTITY_NAME_UPPER/g" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"

# Phase 3: Übersetzungen erstellen
echo "📖 Erstelle Übersetzungen..."

# Deutsche Übersetzungen
if ! grep -q "\"$ENTITY_NAME\":" "client/messages/de.json"; then
    echo "  🇩🇪 Deutsche Übersetzungen..."
    
    # Temporäre Datei für korrekte JSON-Formatierung
    temp_file=$(mktemp)
    
    # Entferne die letzte schließende Klammer
    head -n -1 "client/messages/de.json" > "$temp_file"
    
    # Füge Komma hinzu, falls noch kein Element vorhanden
    if ! tail -1 "$temp_file" | grep -q ','; then
        sed -i '$ s/$/,/' "$temp_file"
    fi
    
    # Füge die neuen Übersetzungen hinzu
    cat >> "$temp_file" << EOF
  "$ENTITY_NAME": {
    "title": "$ENTITY_DISPLAY_NAME_DE",
    "description": "Verwalten Sie $ENTITY_DISPLAY_NAME_DE und deren Informationen",
    "loading": "Lade $ENTITY_DISPLAY_NAME_DE...",
    "addNew": "Neue(n) $ENTITY_SINGULAR_DE erstellen",
    "editTitle": "$ENTITY_SINGULAR_DE bearbeiten",
    "createTitle": "Neue(n) $ENTITY_SINGULAR_DE erstellen",
    "viewTitle": "$ENTITY_SINGULAR_DE Details",
    "deleteConfirmation": "Sind Sie sicher, dass Sie diese(n) $ENTITY_SINGULAR_DE löschen möchten?",
    "searchPlaceholder": "$ENTITY_DISPLAY_NAME_DE durchsuchen...",
    "messages": {
      "loadError": "Fehler beim Laden der $ENTITY_DISPLAY_NAME_DE",
      "createSuccess": "$ENTITY_SINGULAR_DE erfolgreich erstellt",
      "createError": "Fehler beim Erstellen des $ENTITY_SINGULAR_DE",
      "updateSuccess": "$ENTITY_SINGULAR_DE erfolgreich aktualisiert",
      "updateError": "Fehler beim Aktualisieren des $ENTITY_SINGULAR_DE",
      "deleteSuccess": "$ENTITY_SINGULAR_DE erfolgreich gelöscht",
      "deleteError": "Fehler beim Löschen des $ENTITY_SINGULAR_DE"
    },
    "actions": {
      "add": "Hinzufügen",
      "edit": "Bearbeiten",
      "delete": "Löschen",
      "view": "Anzeigen"
    },
    "form": {
      "name": "Name",
      "description": "Beschreibung"
    },
    "tabs": {
      "general": "Allgemein"
    },
    "table": {
      "headers": {
        "id": "ID",
        "name": "Name",
        "description": "Beschreibung",
        "createdAt": "Erstellt am",
        "updatedAt": "Aktualisiert am",
        "actions": "Aktionen"
      },
      "noData": "Keine $ENTITY_DISPLAY_NAME_DE gefunden",
      "loading": "Lade $ENTITY_DISPLAY_NAME_DE...",
      "search": "Suchen..."
    },
    "states": {
      "active": "Aktiv",
      "inactive": "Inaktiv"
    }
  }
}
EOF
    
    # Ersetze die originale Datei
    mv "$temp_file" "client/messages/de.json"
fi

# Englische Übersetzungen
if ! grep -q "\"$ENTITY_NAME\":" "client/messages/en.json"; then
    echo "  🇬🇧 Englische Übersetzungen..."
    
    # Temporäre Datei für korrekte JSON-Formatierung
    temp_file=$(mktemp)
    
    # Entferne die letzte schließende Klammer
    head -n -1 "client/messages/en.json" > "$temp_file"
    
    # Füge Komma hinzu, falls noch kein Element vorhanden
    if ! tail -1 "$temp_file" | grep -q ','; then
        sed -i '$ s/$/,/' "$temp_file"
    fi
    
    # Füge die neuen Übersetzungen hinzu
    cat >> "$temp_file" << EOF
  "$ENTITY_NAME": {
    "title": "$ENTITY_DISPLAY_NAME_EN",
    "description": "Manage $ENTITY_DISPLAY_NAME_EN and their information",
    "loading": "Loading $ENTITY_DISPLAY_NAME_EN...",
    "addNew": "Create new $ENTITY_NAME_SINGULAR",
    "editTitle": "Edit $ENTITY_NAME_SINGULAR",
    "createTitle": "Create new $ENTITY_NAME_SINGULAR",
    "viewTitle": "$ENTITY_NAME_SINGULAR Details",
    "deleteConfirmation": "Are you sure you want to delete this $ENTITY_NAME_SINGULAR?",
    "searchPlaceholder": "Search $ENTITY_DISPLAY_NAME_EN...",
    "messages": {
      "loadError": "Error loading $ENTITY_DISPLAY_NAME_EN",
      "createSuccess": "$ENTITY_NAME_SINGULAR created successfully",
      "createError": "Error creating $ENTITY_NAME_SINGULAR",
      "updateSuccess": "$ENTITY_NAME_SINGULAR updated successfully",
      "updateError": "Error updating $ENTITY_NAME_SINGULAR",
      "deleteSuccess": "$ENTITY_NAME_SINGULAR deleted successfully",
      "deleteError": "Error deleting $ENTITY_NAME_SINGULAR"
    },
    "actions": {
      "add": "Add",
      "edit": "Edit",
      "delete": "Delete",
      "view": "View"
    },
    "form": {
      "name": "Name",
      "description": "Description"
    },
    "tabs": {
      "general": "General"
    },
    "table": {
      "headers": {
        "id": "ID",
        "name": "Name",
        "description": "Description",
        "createdAt": "Created at",
        "updatedAt": "Updated at",
        "actions": "Actions"
      },
      "noData": "No $ENTITY_DISPLAY_NAME_EN found",
      "loading": "Loading $ENTITY_DISPLAY_NAME_EN...",
      "search": "Search..."
    },
    "states": {
      "active": "Active",
      "inactive": "Inactive"
    }
  }
}
EOF
    
    # Ersetze die originale Datei
    mv "$temp_file" "client/messages/en.json"
fi

echo ""
echo "✅ Entity '$ENTITY_NAME' erfolgreich erstellt!"
echo ""
echo "📋 Nächste Schritte:"
echo "1. 🔍 GraphQL Schema prüfen/anpassen (server/src/graphql/schema.graphql)"
echo "2. 🏷️  Generated Types aktualisieren (yarn codegen)"
echo "3. 📝 Entity-spezifische Felder in types.ts anpassen"
echo "4. 🧩 Komponenten nach Bedarf anpassen"
echo "5. 🔗 Menu-Integration (optional)"
echo "6. 🧪 Testen: http://localhost:3000/de/$ENTITY_NAME"
echo ""
echo "📖 Dokumentation: docs/ENTITY-IMPLEMENTATION-PATTERN.md"
