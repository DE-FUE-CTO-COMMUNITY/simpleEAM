#!/bin/bash

# Script zur automatisierten Erstellung einer neuen Entity nach dem Standard-Pattern
# Verwendung: ./create-entity.sh [entity-name] [Entity-Display-Name]
# Beispiel: ./create-entity.sh companies "Unternehmen"

set -e

# Parameter prüfen
if [ $# -lt 2 ]; then
    echo "Verwendung: $0 [entity-name] [Entity-Display-Name]"
    echo "Beispiel: $0 companies \"Unternehmen\""
    exit 1
fi

ENTITY_NAME=$1
ENTITY_DISPLAY_NAME=$2
ENTITY_NAME_UPPER=$(echo $ENTITY_NAME | sed 's/^./\U&/')
ENTITY_NAME_SINGULAR=$(echo $ENTITY_NAME | sed 's/s$//')
ENTITY_NAME_SINGULAR_UPPER=$(echo $ENTITY_NAME_SINGULAR | sed 's/^./\U&/')

echo "🚀 Erstelle neue Entity: $ENTITY_NAME ($ENTITY_DISPLAY_NAME)"
echo "📁 Entity Name: $ENTITY_NAME"
echo "📄 Display Name: $ENTITY_DISPLAY_NAME"
echo "🔤 Singular: $ENTITY_NAME_SINGULAR"
echo ""

# Basis-Verzeichnisse erstellen
echo "📂 Erstelle Verzeichnisstruktur..."
mkdir -p "client/src/app/[lang]/$ENTITY_NAME"
mkdir -p "client/src/components/$ENTITY_NAME"

# Phase 1: Applications-Struktur kopieren
echo "📋 Kopiere Applications-Pattern..."

# GraphQL Operations kopieren
echo "  📄 GraphQL Operations..."
cp "client/src/graphql/application.ts" "client/src/graphql/$ENTITY_NAME_SINGULAR.ts"

# Komponenten kopieren
echo "  🧩 Komponenten..."
cp "client/src/components/applications/types.ts" "client/src/components/$ENTITY_NAME/types.ts"
cp "client/src/components/applications/utils.ts" "client/src/components/$ENTITY_NAME/utils.ts"
cp "client/src/components/applications/useApplicationFilter.ts" "client/src/components/$ENTITY_NAME/use${ENTITY_NAME_UPPER}Filter.ts"
cp "client/src/components/applications/ApplicationForm.tsx" "client/src/components/$ENTITY_NAME/${ENTITY_NAME_UPPER}Form.tsx"
cp "client/src/components/applications/ApplicationTable.tsx" "client/src/components/$ENTITY_NAME/${ENTITY_NAME_UPPER}Table.tsx"
cp "client/src/components/applications/ApplicationToolbar.tsx" "client/src/components/$ENTITY_NAME/${ENTITY_NAME_UPPER}Toolbar.tsx"
cp "client/src/components/applications/ApplicationFilterDialog.tsx" "client/src/components/$ENTITY_NAME/${ENTITY_NAME_UPPER}FilterDialog.tsx"

# Hauptseite kopieren
echo "  📃 Hauptseite..."
cp "client/src/app/[lang]/applications/page.tsx" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"

# Phase 2: Systematische String-Ersetzung
echo "🔄 Passe Dateien an..."

# GraphQL Operations anpassen
echo "  🔧 GraphQL Operations..."
sed -i "s/application/$ENTITY_NAME_SINGULAR/g" "client/src/graphql/$ENTITY_NAME_SINGULAR.ts"
sed -i "s/Application/${ENTITY_NAME_SINGULAR_UPPER}/g" "client/src/graphql/$ENTITY_NAME_SINGULAR.ts"
sed -i "s/applications/$ENTITY_NAME/g" "client/src/graphql/$ENTITY_NAME_SINGULAR.ts"

# Types anpassen
echo "  🏷️  Types..."
sed -i "s/Application/${ENTITY_NAME_SINGULAR_UPPER}/g" "client/src/components/$ENTITY_NAME/types.ts"
sed -i "s/application/$ENTITY_NAME_SINGULAR/g" "client/src/components/$ENTITY_NAME/types.ts"

# Utils anpassen
echo "  🛠️  Utils..."
sed -i "s/Application/${ENTITY_NAME_SINGULAR_UPPER}/g" "client/src/components/$ENTITY_NAME/utils.ts"
sed -i "s/application/$ENTITY_NAME_SINGULAR/g" "client/src/components/$ENTITY_NAME/utils.ts"

# Filter Hook anpassen
echo "  🔍 Filter Hook..."
sed -i "s/Application/${ENTITY_NAME_SINGULAR_UPPER}/g" "client/src/components/$ENTITY_NAME/use${ENTITY_NAME_UPPER}Filter.ts"
sed -i "s/application/$ENTITY_NAME_SINGULAR/g" "client/src/components/$ENTITY_NAME/use${ENTITY_NAME_UPPER}Filter.ts"
sed -i "s/applications/$ENTITY_NAME/g" "client/src/components/$ENTITY_NAME/use${ENTITY_NAME_UPPER}Filter.ts"

# Komponenten anpassen
echo "  🧩 Komponenten..."
for component in "Form" "Table" "Toolbar" "FilterDialog"; do
    file="client/src/components/$ENTITY_NAME/${ENTITY_NAME_UPPER}${component}.tsx"
    sed -i "s/Application/${ENTITY_NAME_SINGULAR_UPPER}/g" "$file"
    sed -i "s/application/$ENTITY_NAME_SINGULAR/g" "$file"
    sed -i "s/applications/$ENTITY_NAME/g" "$file"
done

# Hauptseite anpassen
echo "  📃 Hauptseite..."
sed -i "s/Application/${ENTITY_NAME_SINGULAR_UPPER}/g" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"
sed -i "s/application/$ENTITY_NAME_SINGULAR/g" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"
sed -i "s/applications/$ENTITY_NAME/g" "client/src/app/[lang]/$ENTITY_NAME/page.tsx"

# Phase 3: Übersetzungen erstellen
echo "📖 Erstelle Übersetzungen..."

# Prüfe ob Übersetzungen bereits existieren
if ! grep -q "\"$ENTITY_NAME\":" "client/messages/de.json"; then
    echo "  🇩🇪 Deutsche Übersetzungen..."
    
    # JSON-Block für Übersetzungen erstellen
    translation_block="\
  \"$ENTITY_NAME\": {\
    \"title\": \"$ENTITY_DISPLAY_NAME\",\
    \"description\": \"Verwalten Sie $ENTITY_DISPLAY_NAME und deren Informationen\",\
    \"loading\": \"Lade $ENTITY_DISPLAY_NAME...\",\
    \"addNew\": \"Neue(n) $ENTITY_NAME_SINGULAR erstellen\",\
    \"editTitle\": \"$ENTITY_NAME_SINGULAR bearbeiten\",\
    \"createTitle\": \"Neue(n) $ENTITY_NAME_SINGULAR erstellen\",\
    \"viewTitle\": \"$ENTITY_NAME_SINGULAR Details\",\
    \"deleteConfirmation\": \"Sind Sie sicher, dass Sie diese(n) $ENTITY_NAME_SINGULAR löschen möchten?\",\
    \"searchPlaceholder\": \"$ENTITY_DISPLAY_NAME durchsuchen...\",\
    \"messages\": {\
      \"loadError\": \"Fehler beim Laden der $ENTITY_DISPLAY_NAME\",\
      \"createSuccess\": \"$ENTITY_NAME_SINGULAR erfolgreich erstellt\",\
      \"createError\": \"Fehler beim Erstellen des $ENTITY_NAME_SINGULAR\",\
      \"updateSuccess\": \"$ENTITY_NAME_SINGULAR erfolgreich aktualisiert\",\
      \"updateError\": \"Fehler beim Aktualisieren des $ENTITY_NAME_SINGULAR\",\
      \"deleteSuccess\": \"$ENTITY_NAME_SINGULAR erfolgreich gelöscht\",\
      \"deleteError\": \"Fehler beim Löschen des $ENTITY_NAME_SINGULAR\"\
    },\
    \"actions\": {\
      \"add\": \"Hinzufügen\",\
      \"edit\": \"Bearbeiten\",\
      \"delete\": \"Löschen\",\
      \"view\": \"Anzeigen\"\
    },\
    \"form\": {\
      \"name\": \"Name\",\
      \"description\": \"Beschreibung\"\
    },\
    \"table\": {\
      \"headers\": {\
        \"id\": \"ID\",\
        \"name\": \"Name\",\
        \"description\": \"Beschreibung\",\
        \"createdAt\": \"Erstellt am\",\
        \"updatedAt\": \"Aktualisiert am\",\
        \"actions\": \"Aktionen\"\
      },\
      \"noData\": \"Keine $ENTITY_DISPLAY_NAME gefunden\",\
      \"loading\": \"Lade $ENTITY_DISPLAY_NAME...\",\
      \"search\": \"Suchen...\"\
    }\
  },"
    
    # Füge Block vor dem letzten } ein
    sed -i "$ s/}/  $translation_block\n}/" "client/messages/de.json"
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
