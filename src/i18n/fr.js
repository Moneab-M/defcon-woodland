/**
 * @file fr.js
 * @description French Page Text for the Woodland Conservation Area website.
 * Part of the Multilingual Content Store.
 *
 * DRAFT: AI-assisted translation, needs review by a French speaker before release.
 *
 * Author: Moneab Milad (DEFCON)
 * Jira: SCRUM-8 | SRS: [ID 101], [ID 201]
 * Architecture: Multilingual Content Store, read by "Localized Page & Tree Text Lookup"
 *
 * Notes:
 * - Same keys as en.js. A key missing here falls back to English.
 * - Written at about a Grade 7 reading level, matching the English.
 * - Proper names (St. Margaret's Bay, Woodland Conservation Area, species'
 *   proper names) stay unchanged unless a well-known French name exists.
 */

const fr = {
  common: {
    nav: {
      home: "Accueil",
      about: "À propos",
      ecosystem: "Écosystème",
      gallery: "Galerie",
      naturalBurial: "Inhumation naturelle", // UNSURE: or "Enterrement naturel"
      map: "Carte",
      contact: "Contact", // UNSURE: Canadian sites often use "Nous joindre"
    },
    theme: {
      toggleLabel: "Passer du mode clair au mode sombre",
      title: "Clair/Sombre",
      light: "Clair",
      dark: "Sombre",
    },
    languageSelector: {
      label: "Langue",
    },
    // languageNotice is not needed: it is only shown in English (see en.js)
  },
};

export default fr;
