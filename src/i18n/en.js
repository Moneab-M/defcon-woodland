/**
 * @file en.js
 * @description English Page Text for the Woodland Conservation Area website.
 * Part of the Multilingual Content Store. English is the default language and
 * the fallback for any text missing in another language.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-8 | SRS: [ID 101], [ID 201], [ID 410]
 * Architecture: Multilingual Content Store, read by "Localized Page & Tree Text Lookup"
 *
 * Notes:
 * - Keys are nested by page, e.g. "common.nav.home". Section keys match the
 *   section's existing id, because audio filenames will reuse them later.
 * - fr.js and mic.js must use the same keys.
 */

const en = {
  // Text shared by every page (header, footer, language controls)
  common: {
    nav: {
      home: "Home",
      about: "About",
      ecosystem: "Ecosystem",
      gallery: "Gallery",
      naturalBurial: "Natural Burial",
      map: "Map",
      contact: "Contact",
    },
    theme: {
      toggleLabel: "Toggle light and dark mode",
      title: "Light/Dark",
      light: "Light",
      dark: "Dark",
    },
    languageSelector: {
      label: "Language",
    },
    languageNotice: {
      // Shown in English while Mi'kmaq text waits for client verification ([ID 410])
      micNotAvailable: "Mi'kmaq text is not available yet.",
    },
  },
};

export default en;
