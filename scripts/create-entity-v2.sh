#!/bin/bash

# Verbessertes Entity Creation Script
# Verwendet echte Templates statt String-Replacement

set -e  # Exit bei Fehlern

# Farben für bessere Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Enhanced Entity Creation Script v2.0${NC}"
echo -e "${BLUE}======================================${NC}"

# Funktionen für Display Names
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
        "categories") echo "Kategorien" ;;
        "activities") echo "Aktivitäten" ;;
        "entities") echo "Entitäten" ;;
        "facilities") echo "Einrichtungen" ;;
        "cities") echo "Städte" ;;
        *) 
            # Fallback: Erste Buchstabe groß
            echo "${entity_name^}"
            ;;
    esac
}

get_english_display_name() {
    local entity_name=$1
    case $entity_name in
        "companies") echo "Companies" ;;
        "organisations") echo "Organisations" ;;
        "projects") echo "Projects" ;;
        "contracts") echo "Contracts" ;;
        "suppliers") echo "Suppliers" ;;
        "customers") echo "Customers" ;;
        "departments") echo "Departments" ;;
        "teams") echo "Teams" ;;
        "locations") echo "Locations" ;;
        "assets") echo "Assets" ;;
        "services") echo "Services" ;;
        "processes") echo "Processes" ;;
        "categories") echo "Categories" ;;
        "activities") echo "Activities" ;;
        "entities") echo "Entities" ;;
        "facilities") echo "Facilities" ;;
        "cities") echo "Cities" ;;
        *)
            # Fallback: Erste Buchstabe groß
            echo "${entity_name^}"
            ;;
    esac
}

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

# Funktion zum Ersetzen von Template-Variablen in einer Datei
replace_template_vars() {
    local file=$1
    local entity_name=$2
    local entity_singular=$3
    local entity_upper=$4
    local entity_singular_upper=$5
    local entity_name_const=$6
    local entity_singular_const=$7
    local entity_generated_type=$8
    local entity_display_name_de=$9
    local entity_display_name_en=${10}
    
    # Template-Variablen ersetzen
    sed -i "s/{{ENTITY_NAME}}/$entity_name/g" "$file"
    sed -i "s/{{ENTITY_SINGULAR}}/$entity_singular/g" "$file"
    sed -i "s/{{ENTITY_UPPER}}/$entity_upper/g" "$file"
    sed -i "s/{{ENTITY_SINGULAR_UPPER}}/$entity_singular_upper/g" "$file"
    sed -i "s/{{ENTITY_NAME_CONST}}/$entity_name_const/g" "$file"
    sed -i "s/{{ENTITY_SINGULAR_CONST}}/$entity_singular_const/g" "$file"
    sed -i "s/{{ENTITY_GENERATED_TYPE}}/$entity_generated_type/g" "$file"
    sed -i "s/{{ENTITY_DISPLAY_NAME_DE}}/$entity_display_name_de/g" "$file"
    sed -i "s/{{ENTITY_DISPLAY_NAME_EN}}/$entity_display_name_en/g" "$file"
}

# Validierungsfunktion
validate_generated_files() {
    local entity_name=$1
    echo -e "${YELLOW}🔍 Validiere generierte Dateien...${NC}"
    
    # TypeScript Syntax Check
    echo "  📝 TypeScript Syntax Check..."
    cd client
    if ! yarn tsc --noEmit 2>/dev/null; then
        echo -e "${RED}❌ TypeScript-Fehler gefunden! Überprüfe die generierten Dateien.${NC}"
        return 1
    fi
    cd ..
    
    # ESLint Check
    echo "  📏 ESLint Check..."
    cd client
    if ! yarn lint --fix src/components/$entity_name/ 2>/dev/null; then
        echo -e "${YELLOW}⚠️  ESLint-Warnings gefunden, aber weiter...${NC}"
    fi
    cd ..
    
    echo -e "${GREEN}✅ Validierung erfolgreich!${NC}"
    return 0
}

# Backup-Funktion
create_backup() {
    echo -e "${YELLOW}💾 Erstelle Backup...${NC}"
    git add -A
    git stash push -m "Backup vor Entity-Generierung: $(date)"
    echo -e "${GREEN}✅ Backup erstellt${NC}"
}

# Rollback-Funktion
rollback_on_error() {
    echo -e "${RED}🔄 Rollback wird durchgeführt...${NC}"
    git stash pop
    echo -e "${YELLOW}⚠️  Rollback abgeschlossen. Letzte Änderungen wiederhergestellt.${NC}"
}

# Parameter prüfen
if [ $# -lt 1 ]; then
    echo -e "${RED}Verwendung: $0 [entity-name] [optional: generated-type-name]${NC}"
    echo ""
    echo "Beispiel: $0 companies Company"
    echo "         $0 departments Department"
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
    echo ""
    echo "Der zweite Parameter ist der Name des GraphQL-generierten Typs."
    echo "Falls nicht angegeben, wird der Entity-Name verwendet (erste Buchstabe groß)."
    exit 1
fi

# Parameter extrahieren
ENTITY_NAME=$1
ENTITY_GENERATED_TYPE=${2:-$(echo ${ENTITY_NAME%s} | sed 's/^./\U&/')}
ENTITY_DISPLAY_NAME_DE=$(get_german_display_name $ENTITY_NAME)
ENTITY_DISPLAY_NAME_EN=$(get_english_display_name $ENTITY_NAME)
ENTITY_NAME_UPPER=$(echo $ENTITY_NAME | sed 's/^./\U&/')
ENTITY_SINGULAR=$(get_singular_form $ENTITY_NAME)
ENTITY_SINGULAR_UPPER=$(echo $ENTITY_SINGULAR | sed 's/^./\U&/')
ENTITY_NAME_CONST=$(echo $ENTITY_NAME | tr '[:lower:]' '[:upper:]')
ENTITY_SINGULAR_CONST=$(echo $ENTITY_SINGULAR | tr '[:lower:]' '[:upper:]')

echo -e "${GREEN}📋 Entity Configuration:${NC}"
echo "  📁 Entity Name: $ENTITY_NAME"
echo "  🔤 Singular: $ENTITY_SINGULAR"
echo "  🏷️  Generated Type: $ENTITY_GENERATED_TYPE"
echo "  🇩🇪 Display Name (DE): $ENTITY_DISPLAY_NAME_DE"
echo "  🇬🇧 Display Name (EN): $ENTITY_DISPLAY_NAME_EN"
echo ""

# Prüfe ob Templates existieren
if [ ! -d "templates/entity" ]; then
    echo -e "${RED}❌ Template-Verzeichnis nicht gefunden: templates/entity${NC}"
    echo "Bitte erstelle zunächst die Template-Struktur."
    exit 1
fi

# Backup erstellen
create_backup

# Error-Handler registrieren
trap 'rollback_on_error' ERR

# Basis-Verzeichnisse erstellen
echo -e "${BLUE}📂 Erstelle Verzeichnisstruktur...${NC}"
mkdir -p "client/src/app/[lang]/$ENTITY_NAME"
mkdir -p "client/src/components/$ENTITY_NAME"

# Phase 1: Template-Dateien kopieren und verarbeiten
echo -e "${BLUE}📋 Generiere aus Templates...${NC}"

# GraphQL-Datei
echo "  📄 GraphQL Operations..."
cp "templates/entity/graphql/{{ENTITY_SINGULAR}}.ts.template" "client/src/graphql/$ENTITY_SINGULAR.ts"
replace_template_vars "client/src/graphql/$ENTITY_SINGULAR.ts" \
    "$ENTITY_NAME" "$ENTITY_SINGULAR" "$ENTITY_NAME_UPPER" "$ENTITY_SINGULAR_UPPER" \
    "$ENTITY_NAME_CONST" "$ENTITY_SINGULAR_CONST" "$ENTITY_GENERATED_TYPE" \
    "$ENTITY_DISPLAY_NAME_DE" "$ENTITY_DISPLAY_NAME_EN"

# Komponenten-Dateien
echo "  🧩 Komponenten..."
for template in "types.ts" "utils.ts" "use{{ENTITY_UPPER}}Filter.ts" "{{ENTITY_UPPER}}Form.tsx" "{{ENTITY_UPPER}}Table.tsx" "{{ENTITY_UPPER}}Toolbar.tsx" "{{ENTITY_UPPER}}FilterDialog.tsx"; do
    # Template-Variablen im Dateinamen ersetzen
    target_file=$(echo "$template" | sed "s/{{ENTITY_UPPER}}/$ENTITY_NAME_UPPER/g")
    
    echo "    📝 $target_file"
    cp "templates/entity/components/$template.template" "client/src/components/$ENTITY_NAME/$target_file"
    replace_template_vars "client/src/components/$ENTITY_NAME/$target_file" \
        "$ENTITY_NAME" "$ENTITY_SINGULAR" "$ENTITY_NAME_UPPER" "$ENTITY_SINGULAR_UPPER" \
        "$ENTITY_NAME_CONST" "$ENTITY_SINGULAR_CONST" "$ENTITY_GENERATED_TYPE" \
        "$ENTITY_DISPLAY_NAME_DE" "$ENTITY_DISPLAY_NAME_EN"
done

# Hauptseite
echo "  📃 Hauptseite..."
cp "templates/entity/page/page.tsx.template" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"
replace_template_vars "client/src/app/[lang]/$ENTITY_NAME/page.tsx" \
    "$ENTITY_NAME" "$ENTITY_SINGULAR" "$ENTITY_NAME_UPPER" "$ENTITY_SINGULAR_UPPER" \
    "$ENTITY_NAME_CONST" "$ENTITY_SINGULAR_CONST" "$ENTITY_GENERATED_TYPE" \
    "$ENTITY_DISPLAY_NAME_DE" "$ENTITY_DISPLAY_NAME_EN"

# Phase 2: Übersetzungen hinzufügen
echo -e "${BLUE}📖 Erstelle Übersetzungen...${NC}"

# Deutsche Übersetzungen
echo "  🇩🇪 Deutsche Übersetzungen..."
if ! grep -q "\"$ENTITY_NAME\":" "client/messages/de.json"; then
    # Erstelle temporäre Datei für korrekte JSON-Formatierung
    temp_file=$(mktemp)
    
    # Entferne die letzte schließende Klammer
    head -n -1 "client/messages/de.json" > "$temp_file"
    
    # Füge Komma hinzu, falls nötig
    if ! tail -1 "$temp_file" | grep -q ','; then
        sed -i '$ s/$/,/' "$temp_file"
    fi
    
    # Füge die neuen Übersetzungen hinzu
    cat >> "$temp_file" << EOF
  "$ENTITY_NAME": {
    "title": "$ENTITY_DISPLAY_NAME_DE",
    "description": "Verwalten Sie $ENTITY_DISPLAY_NAME_DE und deren Informationen",
    "loading": "Lade $ENTITY_DISPLAY_NAME_DE...",
    "addNew": "Neue(n) $ENTITY_SINGULAR_UPPER erstellen",
    "editTitle": "$ENTITY_SINGULAR_UPPER bearbeiten",
    "createTitle": "Neue(n) $ENTITY_SINGULAR_UPPER erstellen",
    "viewTitle": "$ENTITY_SINGULAR_UPPER Details",
    "deleteConfirmation": "Sind Sie sicher, dass Sie diese(n) $ENTITY_SINGULAR_UPPER löschen möchten?",
    "searchPlaceholder": "$ENTITY_DISPLAY_NAME_DE durchsuchen...",
    "messages": {
      "loadError": "Fehler beim Laden der $ENTITY_DISPLAY_NAME_DE",
      "createSuccess": "$ENTITY_SINGULAR_UPPER erfolgreich erstellt",
      "createError": "Fehler beim Erstellen des $ENTITY_SINGULAR_UPPER",
      "updateSuccess": "$ENTITY_SINGULAR_UPPER erfolgreich aktualisiert",
      "updateError": "Fehler beim Aktualisieren des $ENTITY_SINGULAR_UPPER",
      "deleteSuccess": "$ENTITY_SINGULAR_UPPER erfolgreich gelöscht",
      "deleteError": "Fehler beim Löschen des $ENTITY_SINGULAR_UPPER"
    },
    "actions": {
      "add": "Hinzufügen",
      "edit": "Bearbeiten",
      "delete": "Löschen",
      "view": "Anzeigen",
      "save": "Speichern",
      "cancel": "Abbrechen"
    },
    "form": {
      "name": "Name",
      "namePlaceholder": "Name eingeben",
      "description": "Beschreibung",
      "descriptionPlaceholder": "Beschreibung eingeben",
      "tabs": {
        "basic": "Grunddaten"
      }
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
      "addNew": "Neue(n) $ENTITY_SINGULAR_UPPER hinzufügen"
    },
    "filter": {
      "title": "$ENTITY_DISPLAY_NAME_DE filtern",
      "basic": "Grundfilter",
      "search": "Suchen",
      "reset": "Zurücksetzen"
    }
  }
}
EOF
    
    # Ersetze die originale Datei
    mv "$temp_file" "client/messages/de.json"
fi

# Englische Übersetzungen
echo "  🇬🇧 Englische Übersetzungen..."
if ! grep -q "\"$ENTITY_NAME\":" "client/messages/en.json"; then
    # Erstelle temporäre Datei für korrekte JSON-Formatierung
    temp_file=$(mktemp)
    
    # Entferne die letzte schließende Klammer
    head -n -1 "client/messages/en.json" > "$temp_file"
    
    # Füge Komma hinzu, falls nötig
    if ! tail -1 "$temp_file" | grep -q ','; then
        sed -i '$ s/$/,/' "$temp_file"
    fi
    
    # Füge die neuen Übersetzungen hinzu
    cat >> "$temp_file" << EOF
  "$ENTITY_NAME": {
    "title": "$ENTITY_DISPLAY_NAME_EN",
    "description": "Manage $ENTITY_DISPLAY_NAME_EN and their information",
    "loading": "Loading $ENTITY_DISPLAY_NAME_EN...",
    "addNew": "Create new $ENTITY_SINGULAR",
    "editTitle": "Edit $ENTITY_SINGULAR",
    "createTitle": "Create new $ENTITY_SINGULAR",
    "viewTitle": "$ENTITY_SINGULAR_UPPER Details",
    "deleteConfirmation": "Are you sure you want to delete this $ENTITY_SINGULAR?",
    "searchPlaceholder": "Search $ENTITY_DISPLAY_NAME_EN...",
    "messages": {
      "loadError": "Error loading $ENTITY_DISPLAY_NAME_EN",
      "createSuccess": "$ENTITY_SINGULAR_UPPER created successfully",
      "createError": "Error creating $ENTITY_SINGULAR",
      "updateSuccess": "$ENTITY_SINGULAR_UPPER updated successfully",
      "updateError": "Error updating $ENTITY_SINGULAR",
      "deleteSuccess": "$ENTITY_SINGULAR_UPPER deleted successfully",
      "deleteError": "Error deleting $ENTITY_SINGULAR"
    },
    "actions": {
      "add": "Add",
      "edit": "Edit",
      "delete": "Delete",
      "view": "View",
      "save": "Save",
      "cancel": "Cancel"
    },
    "form": {
      "name": "Name",
      "namePlaceholder": "Enter name",
      "description": "Description",
      "descriptionPlaceholder": "Enter description",
      "tabs": {
        "basic": "Basic Information"
      }
    },
    "table": {
      "headers": {
        "id": "ID",
        "name": "Name",
        "description": "Description",
        "createdAt": "Created",
        "updatedAt": "Updated",
        "actions": "Actions"
      },
      "noData": "No $ENTITY_DISPLAY_NAME_EN found",
      "loading": "Loading $ENTITY_DISPLAY_NAME_EN...",
      "addNew": "Add new $ENTITY_SINGULAR"
    },
    "filter": {
      "title": "Filter $ENTITY_DISPLAY_NAME_EN",
      "basic": "Basic Filters",
      "search": "Search",
      "reset": "Reset"
    }
  }
}
EOF
    
    # Ersetze die originale Datei
    mv "$temp_file" "client/messages/en.json"
fi

# Phase 3: Validierung
if validate_generated_files "$ENTITY_NAME"; then
    echo -e "${GREEN}🎉 Entity '$ENTITY_NAME' erfolgreich generiert!${NC}"
    echo ""
    echo -e "${BLUE}📁 Generierte Dateien:${NC}"
    echo "  📄 client/src/graphql/$ENTITY_SINGULAR.ts"
    echo "  📂 client/src/components/$ENTITY_NAME/"
    echo "    📝 types.ts"
    echo "    🔧 utils.ts" 
    echo "    🎣 use${ENTITY_NAME_UPPER}Filter.ts"
    echo "    📝 ${ENTITY_NAME_UPPER}Form.tsx"
    echo "    📊 ${ENTITY_NAME_UPPER}Table.tsx"
    echo "    🔧 ${ENTITY_NAME_UPPER}Toolbar.tsx"
    echo "    🔍 ${ENTITY_NAME_UPPER}FilterDialog.tsx"
    echo "  📃 client/src/app/[lang]/$ENTITY_NAME/page.tsx"
    echo "  🌐 Übersetzungen in client/messages/"
    echo ""
    echo -e "${YELLOW}📋 Nächste Schritte:${NC}"
    echo "  1. GraphQL-Schema erweitern (falls nötig)"
    echo "  2. Zusätzliche Felder in types.ts definieren"
    echo "  3. Entity-spezifische Validierungen hinzufügen"
    echo "  4. Filter-Logik erweitern"
    echo "  5. Formular-Felder anpassen"
    echo "  6. Navigation aktualisieren"
else
    echo -e "${RED}❌ Validierung fehlgeschlagen! Rollback wird durchgeführt...${NC}"
    rollback_on_error
    exit 1
fi

# Cleanup: Trap entfernen
trap - ERR

echo -e "${GREEN}✅ Erfolgreich abgeschlossen!${NC}"
