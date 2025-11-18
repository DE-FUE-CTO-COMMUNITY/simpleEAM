# Debug Guide: LastLogin Problem

## Problem

The `api/auth/update-last-login` API call is not being executed and doesn't appear in the network log.

## Debug Steps

### 1. Open Browser Console

- Open developer tools (F12)
- Go to console
- **Important**: Open console BEFORE you log in

### 2. Use Debug Functions

#### Check current status:

```javascript
checkLoginStatus()
```

#### Manually trigger LastLogin update:

```javascript
debugLastLogin()
```

### 3. Observe Login Process

1. **Logout** (if logged in)
2. **Clear browser console**
3. **Perform login**
4. **Watch debug messages in console**

### 4. Expected Debug Output

#### On successful new login:

```
🔍 DEBUG: Keycloak initialized - authenticated: true
🔑 DEBUG: User is authenticated
🔍 DEBUG: checkForNewLogin() called
📱 DEBUG: localStorage Check:
  - LOGIN_STATUS_KEY: user_logged_in
  - localStorage Value: null
  - wasLoggedIn: false
✅ DEBUG: New login detected!
🔍 DEBUG: isNewLogin result: true
🚀 DEBUG: New login processing starts...
📱 DEBUG: Login status set
⏰ DEBUG: updateLastLoginDate() called
🔍 DEBUG: updateLastLoginDate() called
📅 DEBUG: Sending lastLogin update: 2025-01-XX...
📡 DEBUG: API Response Status: 200
✅ DEBUG: API Response Success: {...}
```

#### On already logged in user:

```
🔍 DEBUG: Keycloak initialized - authenticated: true
🔑 DEBUG: User is authenticated
🔍 DEBUG: checkForNewLogin() called
📱 DEBUG: localStorage Check:
  - LOGIN_STATUS_KEY: user_logged_in
  - localStorage Value: true
  - wasLoggedIn: true
ℹ️ DEBUG: Already logged in (no new login)
🔍 DEBUG: isNewLogin result: false
ℹ️ DEBUG: No new login - updateLastLoginDate will NOT be called
```

### 5. Common Problems and Solutions

#### Problem: "Already logged in" even though freshly logged in

**Cause**: localStorage still contains `user_logged_in: true`
**Solution**:

```javascript
// Execute in browser console:
localStorage.removeItem('user_logged_in')
// Then log in again
```

#### Problem: API call is not sent

**Possible causes**:

1. `isNewLogin` returns `false`
2. Keycloak not authenticated
3. No token available

#### Problem: API call fails

**Debug steps**:

1. Check network tab for 401/500 errors
2. Check server logs (see below)

### 6. Server-Side Debugging

#### Check Docker logs:

```bash
# Client logs (Next.js)
docker-compose logs -f client

# Server logs (if API runs through server)
docker-compose logs -f server
```

#### Check Keycloak logs:

```bash
docker-compose logs -f auth
```

### 7. Manual Test

If automatic login doesn't work, you can test manually:

```javascript
// In browser console:
debugLastLogin()
```

This simulates a new login and should trigger the API call.

### 8. Verify Environment Variables

Ensure the following environment variables are set:

```bash
# In .env.local or docker-compose.yml:
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=your_password
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.dev-server.mf2.eu
NEXT_PUBLIC_KEYCLOAK_REALM=simple-eam
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=eam-client
```

### 9. Network Debugging

When the API call is sent but fails:

1. **Open Network tab**
2. **Filter on "update-last-login"**
3. **Check Request Details**:
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
