# Branding and Theming

Customize Simple-EAM branding (logo, app name, and theme) without rebuilding. Client settings are loaded at runtime via `/api/config`.

## Runtime branding variables

Set these environment variables (e.g., in `.env` or `docker-compose.yml`) and restart the client container:

- `LOGO_PATH` - Path to the logo asset served by Next.js (e.g., `/brand-images/logo.svg`)
- `LOGO_NAME` - Application display name shown beside the logo
- `THEME_PRIMARY_COLOR` - Primary brand color in hex (e.g., `#0B5FFF`)
- `THEME_SECONDARY_COLOR` - Secondary brand color in hex
- `THEME_FONT_FAMILY` - Font family used across the UI (falls back to defaults if missing)

> Runtime config means no rebuild is required—just restart the client to pick up new values.

## Brand assets

Store branding images in [client/public/brand-images](client/public/brand-images). Files placed here are served from `/brand-images/...` at runtime. Recommendations:

- Prefer SVG for logos when possible; PNG is also supported.
- Keep filenames stable and update `LOGO_PATH` accordingly.
- Maintain a light/dark friendly variant if needed; switch via `LOGO_PATH` per environment.

## Update checklist

1. Add or replace logo files in [client/public/brand-images](client/public/brand-images).
2. Set `LOGO_PATH` and `LOGO_NAME`; optionally adjust `THEME_PRIMARY_COLOR`, `THEME_SECONDARY_COLOR`, and `THEME_FONT_FAMILY`.
3. Restart the client container (`docker-compose restart client` or redeploy) to load the new branding.
