# Excalidraw Collaboration Setup

Dieses Dokument beschreibt die Implementierung und Konfiguration der Excalidraw Collaboration-Funktionalität in Simple EAM.

## Übersicht

Die Collaboration-Lösung besteht aus:

1. **Eigenständiger excalidraw-room Docker Container** - Für WebSocket-basierte Echtzeit-Kommunikation
2. **useExcalidrawCollaboration Hook** - React Hook für Collaboration-Logik
3. **CollaborationDialog Komponente** - UI für das Starten/Verwalten von Sessions
4. **Erweiterte ExcalidrawWrapper** - Integration der Collaboration-Features

## Architektur

```
┌─────────────────┐    WebSocket    ┌──────────────────┐
│   Excalidraw    │◄──────────────►│ excalidraw-room  │
│   Client 1      │                 │   Docker         │
└─────────────────┘                 │   Container      │
                                    │                  │
┌─────────────────┐    WebSocket    │                  │
│   Excalidraw    │◄──────────────►│                  │
│   Client 2      │                 └──────────────────┘
└─────────────────┘
```

## Docker-Setup

### Services

#### excalidraw-room Container

```yaml
excalidraw-room:
  image: excalidraw/excalidraw-room:sha-03ff435
  ports:
    - '${EXCALIDRAW_ROOM_EXTERNAL_PORT}:80'
  networks:
    - eam-network
    - ${TRAEFIK_NETWORK}
  labels:
    - 'traefik.enable=true'
    - 'traefik.http.routers.${COMPOSE_PROJECT_NAME:-simple-eam}-excalidraw-room.rule=Host(`${EXCALIDRAW_ROOM_SUBDOMAIN}.${BASE_DOMAIN}`)'
    # ... weitere Traefik-Labels
```

### Umgebungsvariablen

In `env.sample`:

```bash
# Excalidraw Collaboration
EXCALIDRAW_ROOM_SUBDOMAIN=excalidraw-room
EXCALIDRAW_ROOM_EXTERNAL_PORT=8890
```

In `docker-compose.yml` Client-Service:

```yaml
environment:
  - NEXT_PUBLIC_EXCALIDRAW_WS_SERVER_URL=https://${EXCALIDRAW_ROOM_SUBDOMAIN}.${BASE_DOMAIN}
```

## Collaboration Hook (useExcalidrawCollaboration)

### Features

- **WebSocket-Verbindung** zum excalidraw-room Server
- **Automatische Reconnection** bei Verbindungsabbruch
- **Scene-Update Broadcasting** für Echtzeit-Synchronisation
- **Collaborator-Management** (Join/Leave Events)
- **Mauszeiger-Synchronisation** zwischen Clients
- **Room-Management** mit eindeutigen Room-IDs

### API

```typescript
const { startCollaboration, stopCollaboration, isCollaborating, collaborators, roomId } =
  useExcalidrawCollaboration({
    excalidrawAPI: apiRef.current,
    username: 'User Name',
    userAvatarUrl: 'https://...',
    onCollaboratorJoin: collaborator => {
      /* ... */
    },
    onCollaboratorLeave: collaborator => {
      /* ... */
    },
  })
```

## Collaboration Dialog

### Features

- **Room-ID Generation** - Automatische Generierung von eindeutigen Room-IDs
- **Room-Beitritt** - Eingabe existierender Room-IDs
- **Session-Management** - Anzeige aktiver Sessions mit Teilnehmern
- **Link-Sharing** - Generierung und Kopieren von Collaboration-Links
- **Live-Status** - Echtzeit-Anzeige von Collaboratoren

### UI-Komponenten

- Room-ID Eingabefeld mit Generator
- Teilnehmer-Liste mit Avataren
- Kopier-Buttons für Room-ID und Link
- Status-Anzeigen für aktive Sessions

## ExcalidrawWrapper Integration

### Neue Features

- **Collaboration-Menü-Item** in MainMenu mit `Ctrl+L` Shortcut
- **Automatischer Room-Beitritt** via URL-Parameter `?room=<roomId>`
- **Enhanced onChange Handler** für Broadcasting von Änderungen
- **Dialog-Management** für Collaboration-UI

### Menu-Integration

```typescript
<MainMenuTyped.Item
  onSelect={() => setIsCollaborationDialogOpen(true)}
  icon={<PeopleIcon />}
  shortcut="Ctrl+L"
>
  {isCollaborating ? 'Live Collaboration (Aktiv)' : 'Live Collaboration'}
</MainMenuTyped.Item>
```

## Verwendung

### 1. Collaboration starten

1. Öffne ein Excalidraw-Diagramm
2. Drücke `Ctrl+L` oder wähle "Live Collaboration" aus dem Menü
3. Gib eine Room-ID ein oder generiere eine neue
4. Klicke "Collaboration starten"

### 2. Session beitreten

**Option A: Über Room-ID**

1. Öffne "Live Collaboration" Dialog
2. Gib die existierende Room-ID ein
3. Klicke "Collaboration starten"

**Option B: Über Link**

1. Kopiere den Collaboration-Link aus einer aktiven Session
2. Öffne den Link in einem neuen Browser/Tab
3. Automatischer Room-Beitritt

### 3. Session verwalten

- **Teilnehmer anzeigen** - Siehe aktive Collaboratoren in Echtzeit
- **Room-ID kopieren** - Teile die Room-ID mit anderen
- **Link kopieren** - Teile den direkten Collaboration-Link
- **Session beenden** - Stoppe die Collaboration

## Technische Details

### WebSocket-Protokoll

Das System verwendet folgende Message-Types:

- `join-room` - Beitritt zu einer Room
- `scene-update` - Synchronisation von Diagram-Änderungen
- `collaborator-join` - Neuer Teilnehmer
- `collaborator-leave` - Teilnehmer verlässt Session
- `mouse-pointer` - Mauszeiger-Synchronisation
- `ping` - Heartbeat für Verbindungserhaltung

### Sicherheit

- **Room-basierte Isolation** - Jede Session ist durch eindeutige Room-ID getrennt
- **Keine Persistierung** - Collaboration-Daten werden nicht dauerhaft gespeichert
- **Automatische Cleanup** - Sessions werden bei Inaktivität automatisch beendet

### Performance

- **Optimierte Updates** - Nur relevante AppState-Teile werden übertragen
- **Debounced Broadcasting** - Verhindert excessive WebSocket-Messages
- **Efficient Reconnection** - Automatische Wiederverbindung bei Netzwerkproblemen

## Fehlerbehandlung

### Häufige Probleme

1. **WebSocket-Verbindung fehlgeschlagen**

   - Prüfe excalidraw-room Container Status
   - Verrifiziere Traefik-Konfiguration
   - Checke Netzwerk-Verbindung

2. **Room nicht gefunden**

   - Room-ID könnte abgelaufen sein
   - Erstelle neue Session

3. **Synchronisation funktioniert nicht**
   - Prüfe Browser-Konsole auf WebSocket-Fehler
   - Restart der Collaboration-Session

### Monitoring

- Container-Logs: `docker logs simple-eam-excalidraw-room-1`
- WebSocket-Status: Browser Developer Tools → Network → WS
- Client-Side-Logs: Browser Developer Tools → Console

## Deployment

### Produktionsumgebung

1. **SSL/TLS**: Stelle sicher, dass WebSocket-Verbindungen über WSS laufen
2. **Firewall**: Öffne den konfigurierten Port für excalidraw-room
3. **Load Balancing**: Bei mehreren Instanzen sticky sessions verwenden
4. **Monitoring**: Überwache WebSocket-Verbindungen und Container-Health

### Development

```bash
# Container starten
docker-compose up excalidraw-room

# Logs verfolgen
docker logs -f simple-eam-excalidraw-room-1

# Port-Test
curl -I http://localhost:8890
```

## Erweiterungen

### Mögliche zukünftige Features

- **Benutzer-Authentifizierung** - Integration mit Keycloak
- **Permissions-System** - Read-only vs. Edit-Zugriff
- **Session-Persistierung** - Wiederherstellung nach Disconnect
- **Voice/Video-Chat** - Integration von WebRTC
- **Version-History** - Collaboration-basierte Versionierung
- **Advanced Cursors** - Element-spezifische Pointer-Anzeige

### API-Erweiterungen

- Broadcast custom events
- Room-Moderator-Funktionen
- Collaboration-Analytics
- Session-Recording

## Support

Bei Problemen oder Fragen zur Collaboration-Implementierung:

1. Prüfe Container-Logs
2. Teste WebSocket-Verbindung
3. Verifiziere Netzwerk-Konfiguration
4. Konsultiere Browser Developer Tools

Die Collaboration-Funktionalität ist vollständig kompatibel mit der bestehenden Simple EAM-Architektur und erfordert keine Änderungen an der Datenbank oder GraphQL-API.
