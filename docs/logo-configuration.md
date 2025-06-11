# Logo-Konfiguration

Die Logo-Komponente wurde überarbeitet, um eine dynamische Logo-Auswahl zur Laufzeit zu ermöglichen.

## Umgebungsvariablen

Die folgenden Umgebungsvariablen können in der `.env.local` Datei oder als Systemumgebungsvariablen gesetzt werden. Die Komponente unterstützt sowohl neue als auch legacy Variablennamen:

### Logo-Pfad (Neue Variante)

**NEXT_PUBLIC_LOGO_PATH**

- **Beschreibung**: Pfad zum Logo-Bild relativ zum `public` Verzeichnis
- **Standard**: `/images/Simple-EAM-Logo.png`
- **Beispiele**:
  - `/images/Atos-Logo.png`
  - `/images/Simple-EAM-Logo.png`
  - `/images/custom-logo.png`

### Logo-Pfad (Legacy-Variante)

**NEXT_PUBLIC_LOGO_URL**

- **Beschreibung**: Alternative zu NEXT_PUBLIC_LOGO_PATH (für Abwärtskompatibilität)
- **Wird verwendet wenn**: NEXT_PUBLIC_LOGO_PATH nicht gesetzt ist

### Logo-Name (Neue Variante)

**NEXT_PUBLIC_LOGO_NAME**

- **Beschreibung**: Name des Logos für den Alt-Text
- **Standard**: `Simple-EAM`
- **Beispiele**:
  - `Atos`
  - `Simple-EAM`
  - `DIN`

### Logo-Name (Legacy-Variante)

**NEXT_PUBLIC_LOGO_ALT**

- **Beschreibung**: Alternative zu NEXT_PUBLIC_LOGO_NAME (für Abwärtskompatibilität)
- **Wird verwendet wenn**: NEXT_PUBLIC_LOGO_NAME nicht gesetzt ist

## Verwendung

```tsx
import Logo from '@/components/common/Logo'

// Standard-Verwendung
<Logo height={40} />

// Mit benutzerdefinierten Eigenschaften
<Logo
  height={30}
  sx={{ margin: 2 }}
/>
```

## Verfügbare Logos

- **Simple-EAM Logo**: `/images/Simple-EAM-Logo.png` (75x30, SVG-basiert)
- **Atos Logo**: `/images/Atos-Logo.png`
- **DIN Logo**: `/images/DIN-Logo.png`
- **MF2 Logo**: `/images/MF2-Logo.png`

## Automatische Größenanpassung

Die Logo-Komponente passt die Breite automatisch basierend auf dem erkannten Logo-Typ an:

- **Simple-EAM Logo**: Verhältnis 2.5:1 (Breite:Höhe)
- **Atos Logo**: Verhältnis 2.5:1
- **Andere Logos**: Standard-Verhältnis 2.5:1

## Konfigurationsbeispiel

```bash
# .env.local
NEXT_PUBLIC_LOGO_PATH=/images/Atos-Logo.png
NEXT_PUBLIC_LOGO_NAME=Atos
```
