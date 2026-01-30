#!/bin/bash

# Funktion zur Prüfung und Umwandlung von npm-Befehlen in yarn-Befehle
convert_npm_to_yarn() {
  local input_file="$1"
  local output_file="${input_file}.converted"
  
  # Erstelle eine Kopie der Datei
  cp "$input_file" "$output_file"
  
  # Ersetze npm-Befehle durch yarn-Befehle (Yarn Berry Syntax)
  sed -i 's/yarn install/yarn install/g' "$output_file"
  sed -i 's/yarn add/yarn add/g' "$output_file"
  sed -i 's/yarn install --immutable/yarn install --immutable/g' "$output_file"
  sed -i 's/yarn/yarn/g' "$output_file"
  sed -i 's/yarn up/yarn up/g' "$output_file"
  sed -i 's/yarn outdated/yarn outdated/g' "$output_file"
  sed -i 's/yarn dlx /yarn dlx /g' "$output_file"
  
  # Vergleiche Dateien
  if diff -q "$input_file" "$output_file" > /dev/null; then
    # Dateien sind identisch, keine Änderungen
    rm "$output_file"
    return 0
  else
    # Unterschiede gefunden
    echo "ℹ️ npm-Befehle gefunden in $input_file"
    echo "🔄 Ersetze durch yarn-Befehle..."
    mv "$output_file" "$input_file"
    return 1
  fi
}

# Finde alle Dateien, die npm-Befehle enthalten könnten
find_and_convert() {
  local directory="$1"
  local changes=0
  
  echo "🔍 Suche nach Dateien mit npm-Befehlen in $directory..."
  
  # Suche in Skripten und Konfigurationsdateien
  find "$directory" -type f \( -name "*.sh" -o -name "*.js" -o -name "*.md" -o -name "*.json" \) -not -path "*/node_modules/*" -not -path "*/.git/*" | while read file; do
    if grep -q "npm " "$file"; then
      convert_npm_to_yarn "$file"
      if [ $? -eq 1 ]; then
        changes=$((changes+1))
      fi
    fi
  done
  
  if [ $changes -eq 0 ]; then
    echo "✅ Keine npm-Befehle gefunden."
  else
    echo "✅ $changes Dateien aktualisiert."
  fi
}

# Hauptprogramm
echo "🔄 NPM-zu-YARN Konverter"
echo "=======================" 

if [ -z "$1" ]; then
  # Standardmäßig das aktuelle Projektverzeichnis scannen
  find_and_convert "/home/mf2admin/simple-eam-try2"
else
  # Oder das angegebene Verzeichnis
  find_and_convert "$1"
fi

echo "✨ Fertig! Alle npm-Befehle wurden durch yarn-Befehle ersetzt."
