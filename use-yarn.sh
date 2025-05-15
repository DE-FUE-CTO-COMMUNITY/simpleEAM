#!/bin/bash

# Alias für npm zu yarn erstellen
npm() {
  local command=$1
  shift
  
  case "$command" in
    install|i)
      echo "🔄 Umleitung: npm $command $@ → yarn add $@"
      yarn add "$@"
      ;;
    ci)
      echo "🔄 Umleitung: npm $command → yarn install --immutable"
      yarn install --immutable
      ;;
    run)
      echo "🔄 Umleitung: npm $command $@ → yarn $@"
      yarn "$@"
      ;;
    update)
      echo "🔄 Umleitung: npm $command $@ → yarn up $@"
      yarn up "$@"
      ;;
    *)
      echo "🔄 Umleitung: npm $command $@ → yarn $command $@"
      yarn "$command" "$@"
      ;;
  esac
}

# Alias für npx zu yarn dlx erstellen
npx() {
  echo "🔄 Umleitung: npx $@ → yarn dlx $@"
  yarn dlx "$@"
}

# Exportieren der Funktion, damit sie in allen Subshells verfügbar ist
export -f npm
