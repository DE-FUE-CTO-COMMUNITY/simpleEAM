import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Unterstützte Sprachen
  locales: ['de', 'en'],

  // Standardsprache
  defaultLocale: 'de',

  // Locale-Präfixe konfigurieren - immer anzeigen für Klarheit
  localePrefix: 'always',

  // Cookie-Konfiguration für GDPR-Konformität
  localeCookie: {
    // Session-Cookie (läuft ab wenn Browser geschlossen wird)
    // maxAge kann gesetzt werden für längere Gültigkeit
    name: 'NEXT_LOCALE',
  },
})
