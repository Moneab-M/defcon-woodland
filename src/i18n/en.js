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
      menu: "Menu",
      closeMenu: "Close menu",
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
    footer: {
      address: "Head Of St Margarets Bay, NS B3Z 2C9",
      copyright: "© 2024 SMU, CSCI 3428 Group25G",
    },
    accessibility: {
      title: "Accessibility Settings",
      textSize: "Text Size:",
      sizeSmall: "Small",
      sizeMedium: "Medium",
      sizeLarge: "Large",
      sizeMassive: "Massive",
      contrast: "Contrast:",
      contrastDefault: "Default",
      contrastDark: "Dark Mode",
      contrastGreyscale: "Grey Scale Mode",
      contrastInverted: "Inverted",
      lineSpacing: "Line Spacing:",
      spacingDefault: "Default",
      spacing2: "2",
      spacing3: "3",
      spacing4: "4",
    },
    weather: {
      loading: "Loading...",
      iconAlt: "Weather Icon",
    },
  },
  // Gallery page
  gallery: {
    title: "Gallery",
    addImage: {
      heading: "Add Your Own Image",
      note: "Uploaded images are stored on the backend.",
      choose: "Choose Image(s)",
      uploading: "Uploading…",
    },
    grid: {
      heading: "Uploaded Images",
      empty: "No images found.",
      imageAlt: "Uploaded {index}",
    },
  },
};

export default en;
