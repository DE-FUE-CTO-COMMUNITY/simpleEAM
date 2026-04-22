# Branding and Theming

Customize NextGen EAM branding (logo, app name, and theme) without rebuilding. Client settings are loaded at runtime via `/api/runtime-config`.

## Runtime branding variables

Set these environment variables (e.g., in `.env` or `compose.yml`) and restart the client container:

- `BRAND_NAME_LONG` - Full application name shown in runtime configuration and longer UI labels
- `BRAND_NAME_SHORT` - Short application name used in compact UI contexts
- `LOGO_URL` - Path to the default logo asset served by Next.js (for example `/images/NextGen-EAM-Logo.svg`)
- `LOGO_ALT` - Accessible alt text for the logo
- `LOGO_DARK_URL` - Optional dark-mode logo variant; falls back to `LOGO_URL` when empty
- `LOGO_LENGTH` - Logo width in pixels
- `FAVICON_URL` - Runtime favicon asset path
- `THEME_PRIMARY_COLOR` - Primary brand color in hex (e.g., `#0B5FFF`)
- `THEME_SECONDARY_COLOR` - Secondary brand color in hex
- `THEME_FONT_FAMILY` - Font family used across the UI (falls back to defaults if missing)

> Runtime config means no rebuild is required—just restart the client to pick up new values.

## Brand assets

Store branding images in [client/public/brand-images](client/public/brand-images). Files placed here are served from `/brand-images/...` at runtime. Recommendations:

- Prefer SVG for logos when possible; PNG is also supported.
- Keep filenames stable and update `LOGO_URL` or `LOGO_DARK_URL` accordingly.
- Maintain a light/dark friendly variant if needed by supplying both `LOGO_URL` and `LOGO_DARK_URL`.

## Update checklist

1. Add or replace logo files in [client/public/brand-images](client/public/brand-images).
2. Set `BRAND_NAME_LONG`, `BRAND_NAME_SHORT`, `LOGO_URL`, and `LOGO_ALT`; optionally adjust `LOGO_DARK_URL`, `LOGO_LENGTH`, `FAVICON_URL`, `THEME_PRIMARY_COLOR`, `THEME_SECONDARY_COLOR`, and `THEME_FONT_FAMILY`.
3. Restart the client container (`docker compose restart client` or redeploy) to load the new branding.
