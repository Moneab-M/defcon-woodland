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
  // About page
  about: {
    title: "About St. Margaret’s Bay Woodland Conservation",
    nav: {
      about: "About",
      mission: "Mission",
      vision: "Vision",
    },
    tools: {
      dyslexia: "Dyslexia Font",
      dyslexiaTitle: "Toggle Dyslexia-Friendly Font",
      contrast: "High Contrast",
      contrastTitle: "Toggle High Contrast",
      spacing: "Line Spacing",
      spacingTitle: "Toggle Line Spacing",
      share: "Share",
      soundPlay: "Play Forest Sound",
      soundStop: "Stop Forest Sound",
    },
    imageAudio: "Image Audio",
    readAloud: "Read Aloud",
    sections: {
      about: {
        title: "About Us",
        text: "We care for the woodlands around St. Margaret’s Bay. We work with neighbours to protect trees, clean water, and wildlife. We share simple steps that anyone can take to help nature.",
        imgAlt: "Green ferns in a woodland",
        caption: "Ferns along a shaded woodland trail",
      },
      mission: {
        title: "Mission",
        text: "Our mission is to protect local habitats and support a healthy forest. We plant trees, remove waste, and invite people to join events. Small actions add up when we work together.",
        imgAlt: "Volunteers planting trees",
        caption: "Volunteers planting small trees along a trail",
      },
      vision: {
        title: "Vision",
        text: "We see a future where our woodlands thrive. Trails are safe, streams run clean, and animals have space to live. Families can learn and enjoy nature for many years.",
        imgAlt: "Red maple leaves",
        caption: "Red maple leaves lit by autumn sunlight",
      },
    },
    stats: {
      heading: "Impact Stats",
      trees: "Trees Planted: 4,200+",
      hectares: "Hectares Restored: 75+",
      species: "Species Monitored: 18",
    },
    species: {
      heading: "Species Spotlight",
      redMaple: {
        name: "Red Maple",
        type: "Tree",
        note: "A hardy tree known for bright red leaves in autumn.",
      },
      chickadee: {
        name: "Black-Capped Chickadee",
        type: "Bird",
        note: "A small songbird often found in mixed woodlands.",
      },
      deer: {
        name: "White-Tailed Deer",
        type: "Mammal",
        note: "Common in forest edges where they browse on plants.",
      },
      fern: {
        name: "Bracken Fern",
        type: "Plant",
        note: "A fern that grows in sunny clearings and paths.",
      },
    },
    timeline: {
      heading: "Woodland Timeline",
      early2000s: {
        year: "Early 2000s",
        text: "Local residents begin organizing clean-ups and informal trail care.",
      },
      tens: {
        year: "2010s",
        text: "Formal volunteer groups form to support woodland stewardship and education.",
      },
      today: {
        year: "Today",
        text: "The area is used for walking, learning, and small conservation projects.",
      },
    },
    faq: {
      heading: "Questions & Answers",
      help: {
        question: "How can I help protect woodlands?",
        answer: "Small actions like staying on marked trails, taking litter home, joining clean-ups, and planting native species all make a difference.",
      },
      purpose: {
        question: "What is the purpose of this website?",
        answer: "The site shares simple information about the woodland, highlights key features, and shows ways people can support conservation.",
      },
      readAloud: {
        question: "How does the Read Aloud feature work?",
        answer: "The Read Aloud button uses the browser’s Text-to-Speech engine to speak the text out loud. You can pause or resume using the spacebar.",
      },
      phone: {
        question: "Can I use this site on my phone?",
        answer: "Yes. The layout is responsive, so the cards, buttons, and text all adjust to smaller screens.",
      },
    },
    learnMore: "Learn More",
    backToTop: "Back to Top",
    accessibilityStrip: "Accessibility: WCAG AA • Keyboard navigation • TTS buttons • Text zoom • Dyslexia & contrast options",
  },
  // Ecosystem page
  ecosystem: {
    heading: "Ecosystem",
    readAloud: "Read out loud",
    lakeAlt: "Lake",
    intro: "This woodland conservation site is home to a diverse and vibrant ecosystem, teeming with life and natural beauty. Our woodlands are characterized by a rich variety of flora and fauna, each playing a crucial role in maintaining the ecological balance.",
    heron: "Herons are wading birds known for their long legs and necks, often found near water bodies.",
    deer: "Deer are graceful herbivores, commonly found in forests and grasslands.",
    coyote: "The coyote is a highly adaptable, opportunistic predator, playing a key role in maintaining the balance of local ecosystems by controlling populations of small mammals.",
    keyFeatures: {
      intro: "Key features of our ecosystem:",
      birch: {
        title: "Yellow Birch Trees:",
        text: "These majestic trees are a hallmark of our woodland, providing habitat and food for numerous species. Their distinctive yellow bark and graceful form make them a standout feature.",
      },
      wetlands: {
        title: "Wetlands:",
        text: "Our wetlands are vital for water purification, flood control, and providing a habitat for a wide range of wildlife. They are a haven for birds, amphibians, and aquatic plants.",
      },
      artifacts: {
        title: "Historical Artifacts:",
        text: "Scattered throughout the woodland are remnants of the past, providing insight into how people lived in a time long forgotten.",
      },
    },
    floraHeading: "Flora",
    floraText: "Our woodlands are adorned with a variety of plant species, including towering Yellow Birch Trees, delicate wildflowers, and lush ferns.",
    faunaHeading: "Fauna",
    faunaText: "Among the fauna, you can find graceful deer, playful foxes, and a myriad of bird species, each contributing to the vibrant ecosystem.",
    fungiHeading: "Fungi",
    fungiText: "Woodland fungi play a vital role in the ecosystem, breaking down organic matter and forming symbiotic relationships with trees and plants.",
  },
};

export default en;
