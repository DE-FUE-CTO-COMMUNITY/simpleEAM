# Yarn Berry als Paketmanager verwenden

In diesem Projekt verwenden wir **Yarn Berry (4.x)** als modernen Paketmanager anstelle von npm oder klassischem Yarn (1.x).

## Befehle-Übersicht

| npm Befehl           | Yarn Berry Äquivalent | Beschreibung                        |
| -------------------- | --------------------- | ----------------------------------- |
| `yarn install`        | `yarn install`        | Alle Abhängigkeiten installieren    |
| `yarn install pkg`    | `yarn add pkg`        | Neue Abhängigkeit hinzufügen        |
| `yarn install -D pkg` | `yarn add -D pkg`     | Dev-Abhängigkeit hinzufügen         |
| `npm uninstall pkg`  | `yarn remove pkg`     | Abhängigkeit entfernen              |
| `yarn up`         | `yarn up`             | Abhängigkeiten aktualisieren        |
| `yarn script`     | `yarn script`         | Skript ausführen (aus package.json) |
| N/A                  | `yarn dlx`            | Paket ausführen ohne Installation   |
| N/A                  | `yarn why`            | Abhängigkeitsgründe anzeigen        |

## Vorteile von Yarn Berry

- Deutlich bessere Performanz als npm oder Yarn Classic
- Konsistente Abhängigkeitsversionen mit verbessertem Lockfile
- Verbesserte Sicherheit und Zuverlässigkeit
- Zero-Installs für schnellere CI/CD-Pipelines
- Workspace-Support für Monorepos
- Plug'n'Play für effizientere Node_Modules Verwaltung

## Projektspezifische Konfiguration

In diesem Projekt verwenden wir folgende Yarn Berry Konfiguration:

- **Node-Module Linker**: Wir nutzen den `node-modules` Linker für maximale Kompatibilität
- **Workspace-Definition**: Wir verwenden Workspaces für die Verwaltung von client und server
- **Globaler Cache**: Wir nutzen den globalen Cache für effizientere Abhängigkeitsverwaltung

## Neue Features in Yarn Berry

- **Yarn Constraints**: Definiert Regeln für Abhängigkeiten (`yarn constraints`)
- **Yarn Resolutions**: Erlaubt das Override problematischer Abhängigkeiten
- **Plugin-System**: Erweiterbar durch Plugins für zusätzliche Funktionalität

## IDE-Integration

Für bessere TypeScript-Unterstützung mit Yarn Berry können Sie folgendes einrichten:

```bash
# VSCode Unterstützung
yarn dlx @yarnpkg/sdks vscode
```

## Installation

Falls Sie yarn noch nicht installiert haben:

```bash
yarn install -g yarn
```

## Erinnerung

⚠️ Bitte verwenden Sie keine npm-Befehle in diesem Projekt, um Konsistenz zu gewährleisten.
