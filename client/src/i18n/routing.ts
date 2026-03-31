import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // Supported languages
  locales: ['de', 'en', 'fr'],

  // Standardsprache
  defaultLocale: 'de',

  // Locale-Präfixe konfigurieren - immer anzeigen für Klarheit
  localePrefix: 'always',

  // Cookie-Konfiguration für GDPR-Konformität
  localeCookie: {
    // Session cookie (expires when browser is closed)
    // maxAge can be set for longer validity
    name: 'NEXT_LOCALE',
  },
})
