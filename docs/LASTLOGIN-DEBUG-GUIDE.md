# Debug-Anleitung: LastLogin Problem

## Problem

Der `api/auth/update-last-login` API-Call wird nicht ausgeführt und erscheint nicht im Network-Log.

## Debug-Schritte

### 1. Browser-Konsole öffnen

- Öffnen Sie die Entwicklertools (F12)
- Gehen Sie zur Konsole
- **Wichtig**: Öffnen Sie die Konsole BEVOR Sie sich einloggen

### 2. Debug-Funktionen nutzen

#### Aktuellen Status prüfen:

```javascript
checkLoginStatus()
```

#### Manuell LastLogin-Update auslösen:

```javascript
debugLastLogin()
```

### 3. Login-Prozess beobachten

1. **Logout** (falls eingeloggt)
2. **Browser-Konsole leeren**
3. **Login durchführen**
4. **Debug-Meldungen in der Konsole beobachten**

### 4. Erwartete Debug-Ausgaben

#### Bei erfolgreichem neuen Login:

```
🔍 DEBUG: Keycloak initialisiert - authenticated: true
🔑 DEBUG: Benutzer ist authentifiziert
🔍 DEBUG: checkForNewLogin() aufgerufen
📱 DEBUG: localStorage Check:
  - LOGIN_STATUS_KEY: user_logged_in
  - localStorage Wert: null
  - wasLoggedIn: false
✅ DEBUG: Neuer Login erkannt!
🔍 DEBUG: isNewLogin Ergebnis: true
🚀 DEBUG: Neuer Login verarbeitung startet...
📱 DEBUG: Login-Status gesetzt
⏰ DEBUG: updateLastLoginDate() aufgerufen
🔍 DEBUG: updateLastLoginDate() aufgerufen
📅 DEBUG: Sende lastLogin Update: 2025-01-XX...
📡 DEBUG: API Response Status: 200
✅ DEBUG: API Response Success: {...}
```

#### Bei bereits eingeloggtem Benutzer:

```
🔍 DEBUG: Keycloak initialisiert - authenticated: true
🔑 DEBUG: Benutzer ist authentifiziert
🔍 DEBUG: checkForNewLogin() aufgerufen
📱 DEBUG: localStorage Check:
  - LOGIN_STATUS_KEY: user_logged_in
  - localStorage Wert: true
  - wasLoggedIn: true
ℹ️ DEBUG: Bereits eingeloggt (kein neuer Login)
🔍 DEBUG: isNewLogin Ergebnis: false
ℹ️ DEBUG: Kein neuer Login - updateLastLoginDate wird NICHT aufgerufen
```

### 5. Häufige Probleme und Lösungen

#### Problem: "Bereits eingeloggt" obwohl frisch eingeloggt

**Ursache**: localStorage enthält noch `user_logged_in: true`
**Lösung**:

```javascript
// In Browser-Konsole ausführen:
localStorage.removeItem('user_logged_in')
// Dann neu einloggen
```

#### Problem: API-Call wird nicht gesendet

**Mögliche Ursachen**:

1. `isNewLogin` gibt `false` zurück
2. Keycloak nicht authentifiziert
3. Kein Token verfügbar

#### Problem: API-Call fehlschlägt

**Debug-Schritte**:

1. Network-Tab prüfen für 401/500 Fehler
2. Server-Logs prüfen (siehe unten)

### 6. Server-Side Debugging

#### Docker-Logs prüfen:

```bash
# Client-Logs (Next.js)
docker-compose logs -f client

# Server-Logs (falls API über Server läuft)
docker-compose logs -f server
```

#### Keycloak-Logs prüfen:

```bash
docker-compose logs -f auth
```

### 7. Manueller Test

Falls automatischer Login nicht funktioniert, können Sie manuell testen:

```javascript
// In Browser-Konsole:
debugLastLogin()
```

Dies simuliert einen neuen Login und sollte den API-Call auslösen.

### 8. Environment-Variablen prüfen

Stellen Sie sicher, dass folgende Umgebungsvariablen gesetzt sind:

```bash
# In .env.local oder docker-compose.yml:
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=ihr_password
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.dev-server.mf2.eu
NEXT_PUBLIC_KEYCLOAK_REALM=simple-eam
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=eam-client
```

### 9. Netzwerk-Debugging

Wenn der API-Call gesendet wird aber fehlschlägt:

1. **Network-Tab** öffnen
2. **Filter auf "update-last-login"** setzen
3. **Request Details** prüfen:
   - Headers (Authorization)
   - Request Body
   - Response Status/Body

### 10. Produktions-Setup

Für die Produktion sollten die Debug-Logs entfernt werden. Die Debug-Funktionen sind nur in `NODE_ENV=development` verfügbar.

## Checklist für Debugging

- [ ] Browser-Konsole vor Login geöffnet
- [ ] `checkLoginStatus()` aufgerufen und Werte geprüft
- [ ] Logout → Login → Debug-Meldungen beobachtet
- [ ] localStorage auf `user_logged_in` geprüft
- [ ] Network-Tab auf `update-last-login` geprüft
- [ ] Bei Bedarf `debugLastLogin()` manuell aufgerufen
- [ ] Server-Logs auf Fehler geprüft
- [ ] Environment-Variablen validiert

Mit diesen Debug-Tools sollten Sie das LastLogin-Problem schnell identifizieren können.
