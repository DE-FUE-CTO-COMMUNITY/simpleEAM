# Migration zu Yarn Berry (4.x)

Dieses Dokument beschreibt die Änderungen, die vorgenommen wurden, um das Projekt von Yarn Classic (1.x) auf Yarn Berry (4.x) zu aktualisieren.

## Durchgeführte Änderungen

1. **Update der Yarn Version**

   - Installation von Yarn Berry 4.9.1 via `yarn set version berry`
   - Konfigurierte `.yarnrc.yml` für die neue Yarn Version

2. **Aktualisierte Dateien**

   - `package.json` in Root-, Client- und Server-Verzeichnissen:
     - Hinzufügen der `packageManager: "yarn@4.9.1"` Eigenschaft
     - Aktualisierung der `engines.yarn` auf `>=4.0.0`
     - Verbesserte `preinstall` Skripte in Client/Server für strengere Yarn-Prüfung

3. **Konfiguration und Umgebung**

   - Optimierte `.yarnrc.yml` mit folgenden Einstellungen:
     ```yaml
     enableGlobalCache: true
     nodeLinker: node-modules
     yarnPath: .yarn/releases/yarn-4.9.1.cjs
     ```
   - Aktualisierte `.gitignore` für Yarn Berry spezifische Dateien

4. **Hilfsskripte**
   - `npm-to-yarn.sh`: Aktualisiert für Yarn Berry Befehle
   - `use-yarn.sh`: Aktualisiert für Yarn Berry Befehle
   - `npm-wrapper.js`: Angepasst für die neue Yarn-Version

## Vorteile der Migration

- **Verbesserte Leistung**: Schnellere Installation und Build-Zeiten
- **Bessere Zuverlässigkeit**: Genauere Abhängigkeitsauflösung
- **Moderne Features**: Zugriff auf neue Features von Yarn 4.x
- **Zukunftssicherheit**: Support für aktuelle und zukünftige Node.js-Versionen

## Hinweise für Entwickler

- Befehle wie `yarn install`, `yarn add`, etc. funktionieren wie bisher
- Die Projektstruktur bleibt größtenteils unverändert
- Die Verwendung des `node-modules`-Linkers wurde beibehalten, um Kompatibilität zu gewährleisten

## Bekannte Einschränkungen

- Der Plug'n'Play (PnP) Modus wird derzeit nicht verwendet
  - Könnte in Zukunft aktiviert werden für noch bessere Performance
  - Erfordert möglicherweise weitere Anpassungen in Tooling und Konfiguration

## Nächste Schritte

- Monitoring der Projektleistung nach der Migration
- Prüfen der Kompatibilität mit CI/CD Pipelines
- Erwägen des Übergangs zu Plug'n'Play-Modus in der Zukunft

## Weitere Informationen

Detaillierte Informationen zu Yarn Berry finden sich in der [offiziellen Yarn-Dokumentation](https://yarnpkg.com/getting-started) oder in der [YARN.md](./YARN.md) Datei dieses Projekts.
