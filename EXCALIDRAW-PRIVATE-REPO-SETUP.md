# Excalidraw Private Repository Setup

## Übersicht

Dieses Dokument beschreibt die Einrichtung eines privaten GitHub-Repositories für den Excalidraw-Fork des Simple EAM-Projekts.

## Aktueller Status

✅ **Abgeschlossen:**

- Excalidraw-Fork erfolgreich erstellt und angepasst
- Paket gebaut und in Simple EAM integriert
- Lokale Git-Konfiguration vorbereitet (origin → upstream umbenannt)

✅ **Abgeschlossen:**

- Privates GitHub-Repository erstellt: https://github.com/marcus-friedrich/simple-eam-excalidraw
- Git-Remote-Konfiguration erfolgreich eingerichtet

## Schritt-für-Schritt Anleitung

### 1. Privates GitHub-Repository erstellen

1. Gehen Sie zu https://github.com/new
2. **Repository Name:** `simple-eam-excalidraw`
3. **Beschreibung:** `Private fork of Excalidraw for Simple EAM project`
4. **Sichtbarkeit:** ✅ Private
5. **NICHT ankreuzen:** "Initialize this repository with a README"
6. Klicken Sie auf **"Create repository"**

### 2. Setup-Skript konfigurieren ✅

~~Bearbeiten Sie die Datei `/home/mf2admin/simple-eam/setup-private-excalidraw-repo.sh` und aktualisieren Sie:~~

```bash
GITHUB_USERNAME="marcus-friedrich"  # ✅ Konfiguriert
```

### 3. Setup-Skript ausführen ✅

```bash
cd /home/mf2admin/simple-eam
./setup-private-excalidraw-repo.sh  # ✅ Erfolgreich ausgeführt
```

## Git-Remote-Struktur (nach Setup)

```
upstream → https://github.com/excalidraw/excalidraw.git (original Excalidraw)
origin   → https://github.com/marcus-friedrich/simple-eam-excalidraw.git (privater Fork)
```

## Entwicklungsworkflow

### Normale Entwicklung

```bash
# Änderungen committen
git add .
git commit -m "Beschreibung der Änderungen"

# Zu privatem Repository pushen
git push origin eam-main
```

### Updates vom Original-Excalidraw holen

```bash
# Updates vom ursprünglichen Excalidraw-Repository holen
git fetch upstream
git merge upstream/master

# Konflikte lösen falls nötig, dann pushen
git push origin eam-main
```

### Branch-Verwaltung

- **`eam-main`**: Hauptentwicklungsbranch für Simple EAM Anpassungen
- **`main`**: Stabiler Branch für Releases (synchron mit eam-main)

## Sicherheitsaspekte

- Das Repository ist **privat** und nur für autorisierte Benutzer zugänglich
- Enthält nur notwendige Anpassungen für Simple EAM
- Regelmäßige Updates vom upstream Excalidraw-Repository
- Klare Trennung zwischen upstream (original) und origin (private fork)

## Dateien und Verzeichnisse

```
/home/mf2admin/simple-eam/packages/simple-eam-excalidraw/
├── packages/excalidraw/          # Hauptfork-Verzeichnis
│   ├── .git/                     # Git-Repository (zeigt auf privates Repo)
│   ├── package.json              # @simple-eam/excalidraw v0.18.0-eam.1
│   ├── dist/                     # Gebaute Distribution
│   └── ...                       # Rest der Excalidraw-Dateien
└── build-fork.sh                 # Build-Skript für den Fork
```

## Integration in Simple EAM

Der Fork ist bereits vollständig in das Simple EAM-Projekt integriert:

1. **Paket:** `@simple-eam/excalidraw` (Version 0.18.0-eam.1)
2. **Client-Integration:** Alle DiagramEditor-Komponenten verwenden den Fork
3. **TypeScript-Unterstützung:** Type-Definitionen erstellt
4. **Build-Pipeline:** Funktioniert mit yarn build

## Nächste Schritte ✅

~~Nach der Repository-Erstellung:~~

1. ✅ Repository auf GitHub erstellt
2. ✅ Setup-Skript mit GitHub-Username konfiguriert
3. ✅ Setup-Skript ausgeführt
4. ✅ Git-Remote-Konfiguration verifiziert
5. ✅ Dokumentation finalisiert

**🎉 Die Excalidraw-Fork-Integration ist vollständig abgeschlossen!**
