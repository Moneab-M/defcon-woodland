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
  // Home page
  home: {
    readAloud: "Read out loud",
    hero: {
      welcome: "Welcome to the",
      siteName: "Woodland Conservation Site",
      intro: "Explore the serenity of nature and contribute to preserving the delicate balance of our ecosystem.",
      imageAlt: "Woodland Conservation",
    },
    whatWeDo: {
      heading: "What We Do",
      conservation: {
        title: "Conservation Projects",
        text: "We focus on preserving natural habitats and wildlife to ensure a healthy ecosystem for future generations.",
      },
      sustainable: {
        title: "Sustainable Practices",
        text: "Learn about eco-friendly practices that help reduce our carbon footprint and contribute to a greener planet.",
      },
      wildlife: {
        title: "Wildlife Protection",
        text: "We are committed to protecting endangered species and restoring biodiversity to our natural surroundings.",
      },
    },
    articles: {
      heading: "Relevant Articles",
      readMore: "Read More",
      article1: {
        title: "Proposed Conservation Area",
        text: "Discover how the proposed conservation area will bring us closer to achieving our ecological goals.",
      },
      article2: {
        title: "A Final Footprint",
        text: "Learn more about the final footprint of conservation efforts in our local area.",
      },
      article3: {
        title: "St. Paul's Nova Scotia",
        text: "This article explores the ongoing conservation and restoration efforts at St. Paul's, Nova Scotia.",
      },
    },
    weather: {
      title: "Weather",
      localWoodland: "Local woodland",
      yourLocation: "Your location",
      useMyLocation: "Use my location",
      loading: "Loading current conditions…",
      unavailable: "Weather unavailable. Showing fallback.",
      notSupported: "Geolocation not supported; using fallback.",
      permissionDenied: "Permission denied; using fallback.",
      temperature: "Temperature",
      wind: "Wind",
      windUnit: "km/h",
      timezone: "Timezone",
    },
    featured: {
      heading: "Featured Species",
      name: "Yellow Birch",
      shortDescription: "The Yellow Birch is an important species in the area, known for its distinctive yellow bark.",
      longDescription: "The Yellow Birch is an important species in the area, known for its distinctive yellow bark and role in local biodiversity. It thrives in woodland areas, providing shelter for various wildlife.",
      learnMore: "Learn More",
    },
    modal: {
      close: "Close",
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
