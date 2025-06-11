# Logo- und Theme-Konfiguration

Diese Dokumentation beschreibt, wie Logos und Theme-Farben dynamisch über Umgebungsvariablen konfiguriert werden können.

## Logo-Konfiguration

Das Logo wird zur Laufzeit aus Umgebungsvariablen geladen und unterstützt automatische Seitenverhältnis-Erkennung.

### Umgebungsvariablen

#### Neue Variablennamen (empfohlen):

- `NEXT_PUBLIC_LOGO_PATH`: Pfad zur Logo-Datei (z.B. `/images/company-logo.png`)
- `NEXT_PUBLIC_LOGO_NAME`: Name des Logos für Alt-Text (z.B. `Company Name`)

#### Legacy-Variablennamen (weiterhin unterstützt):

- `NEXT_PUBLIC_LOGO_URL`: Alternative zu `NEXT_PUBLIC_LOGO_PATH`
- `NEXT_PUBLIC_LOGO_ALT`: Alternative zu `NEXT_PUBLIC_LOGO_NAME`

### Fallback-Verhalten:

- Wenn keine Umgebungsvariablen gesetzt sind, wird das Simple-EAM Logo verwendet
- Pfad-Fallback: `/images/Simple-EAM-Logo.png`
- Name-Fallback: `Simple-EAM`

## Theme-Konfiguration

Primary- und Secondary-Farben sowie Schriftarten werden dynamisch zur Laufzeit aus Umgebungsvariablen geladen.

### Umgebungsvariablen

#### Haupt-Variablennamen:

- `NEXT_PUBLIC_THEME_PRIMARY_COLOR`: Primärfarbe (z.B. `#0066CC`)
- `NEXT_PUBLIC_THEME_SECONDARY_COLOR`: Sekundärfarbe (z.B. `#00AEEF`)
- `NEXT_PUBLIC_THEME_FONT_FAMILY`: Schriftart-Familie (z.B. `"Roboto", "Helvetica", "Arial", sans-serif`)

#### Legacy-Variablennamen (optional):

- `NEXT_PUBLIC_PRIMARY_COLOR`: Alternative zu `NEXT_PUBLIC_THEME_PRIMARY_COLOR`
- `NEXT_PUBLIC_SECONDARY_COLOR`: Alternative zu `NEXT_PUBLIC_THEME_SECONDARY_COLOR`
- `NEXT_PUBLIC_FONT_FAMILY`: Alternative zu `NEXT_PUBLIC_THEME_FONT_FAMILY`

### Automatische Farbvarianten

Das System generiert automatisch helle und dunkle Varianten der konfigurierten Hauptfarben:

#### Vordefinierte Farbpaletten:

- **Atos**: `#0066CC` (Primary), `#00AEEF` (Secondary)
- **DIN**: `#004164` (Primary), `#821E3C` (Secondary)
- **MF2**: `#c9ece1` (Primary), `#2765c3` (Secondary)

Für jede Hauptfarbe werden folgende Varianten automatisch generiert:

- `light`: Hellere Version für Hover-Effekte
- `dark`: Dunklere Version für aktive Zustände
- `lighter`: Sehr helle Version für Hintergründe
- `darker`: Sehr dunkle Version für Akzente

### Fallback-Verhalten:

- Primary Color Fallback: `#0066CC` (Atos Blue)
- Secondary Color Fallback: `#00AEEF` (Atos Light Blue)
- Font Family Fallback: `"Roboto", "Helvetica", "Arial", sans-serif`

## Konfigurationsbeispiele

### Atos Corporate Design:

```env
NEXT_PUBLIC_LOGO_PATH=/images/Atos-Logo.png
NEXT_PUBLIC_LOGO_NAME=Atos
NEXT_PUBLIC_THEME_PRIMARY_COLOR=#0066CC
NEXT_PUBLIC_THEME_SECONDARY_COLOR=#00AEEF
NEXT_PUBLIC_THEME_FONT_FAMILY="Roboto", "Helvetica", "Arial", sans-serif
```

### DIN Corporate Design:

```env
NEXT_PUBLIC_LOGO_PATH=/images/DIN-Logo.png
NEXT_PUBLIC_LOGO_NAME=DIN
NEXT_PUBLIC_THEME_PRIMARY_COLOR=#004164
NEXT_PUBLIC_THEME_SECONDARY_COLOR=#821E3C
NEXT_PUBLIC_THEME_FONT_FAMILY="Roboto", "Helvetica", "Arial", sans-serif
```

### MF2 Corporate Design:

```env
NEXT_PUBLIC_LOGO_PATH=/images/MF2-Logo.png
NEXT_PUBLIC_LOGO_NAME=MF2
NEXT_PUBLIC_THEME_PRIMARY_COLOR=#c9ece1
NEXT_PUBLIC_THEME_SECONDARY_COLOR=#2765c3
NEXT_PUBLIC_THEME_FONT_FAMILY="Roboto", "Helvetica", "Arial", sans-serif
```

## Technische Implementation

### Logo-Komponente:

- Automatische Seitenverhältnis-Erkennung mit CSS `aspectRatio`
- Next.js Image-Optimierung mit `fill` Property für scharfe Darstellung
- `objectFit: 'contain'` für korrekte Skalierung
- Debugging-Logs für Umgebungsvariablen und Logo-Loading

### Theme-System:

- Dynamische Theme-Erstellung zur Laufzeit in `createDynamicTheme()`
- Automatische Farbvarianten-Generierung
- Integration mit Material UI ThemeProvider
- Debugging-Logs für Theme-Konfiguration

### Verfügbare Logo-Dateien:

- `Atos-Logo.png` (3.06:1 Ratio)
- `DIN-Logo.png` (1.29:1 Ratio)
- `MF2-Logo.png`
- `Simple-EAM-Logo.png` (2.5:1 Ratio)
- `Simple-EAM-Logo.svg`

## Debugging

Beide Systeme (Logo und Theme) geben umfassende Debug-Informationen in der Browser-Konsole aus:

### Logo-Debug:

```
🔍 Logo Debug Information:
NEXT_PUBLIC_LOGO_PATH: /images/DIN-Logo.png
NEXT_PUBLIC_LOGO_NAME: DIN
Resolved logoPath: /images/DIN-Logo.png
Resolved logoName: DIN
```

### Theme-Debug:

```
🎨 Dynamic Theme Debug Information:
NEXT_PUBLIC_THEME_PRIMARY_COLOR: #004164
NEXT_PUBLIC_THEME_SECONDARY_COLOR: #821E3C
Resolved Primary Color: #004164
Resolved Secondary Color: #821E3C
```

## Verwendung

### Logo-Komponente:

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

### Theme-System:

Das Theme wird automatisch zur Laufzeit generiert und in der gesamten Anwendung verwendet. Keine manuelle Konfiguration erforderlich.

## Deployment-Hinweise

1. **Environment Variables**: Stellen Sie sicher, dass alle `NEXT_PUBLIC_*` Variablen zur Build-Zeit verfügbar sind
2. **Logo-Dateien**: Platzieren Sie Logo-Dateien im `public/images/` Verzeichnis
3. **Caching**: Änderungen an Umgebungsvariablen erfordern einen Neustart der Anwendung
4. **Docker**: In Docker-Umgebungen Umgebungsvariablen über `docker-compose.yml` setzen
5. **Farb-Hex-Codes**: Verwenden Sie immer vollständige 6-stellige Hex-Codes (z.B. `#0066CC` statt `#06C`)
