#!/bin/bash

# Prüfe ob npm versucht wird zu verwenden
if [[ "$0" == *"npm"* ]] || [[ "$1" == "npm" ]]; then
  echo "❌ FEHLER: npm ist in diesem Projekt nicht erlaubt!"
  echo "📦 Verwende stattdessen yarn:"
  echo ""
  echo "   npm install  →  yarn install"
  echo "   npm run      →  yarn run"
  echo "   npm build    →  yarn build"
  echo "   npm start    →  yarn start"
  echo ""
  echo "🔧 Siehe Projektrichtlinien: yarn ist der einzige erlaubte Paketmanager"
  exit 1
fi

# Ansonsten normal weiterleiten
exec "$@"
