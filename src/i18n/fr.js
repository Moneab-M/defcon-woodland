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
  // NEEDS REVIEW BY A FLUENT SPEAKER
  common: {
    nav: {
      home: "Accueil",
      about: "À propos",
      ecosystem: "Écosystème",
      gallery: "Galerie",
      naturalBurial: "Inhumation naturelle", // UNSURE: or "Enterrement naturel"
      map: "Carte",
      contact: "Contact", // UNSURE: Canadian sites often use "Nous joindre"
      // NEEDS REVIEW BY A FLUENT SPEAKER
      menu: "Menu",
      closeMenu: "Fermer le menu",
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
    // NEEDS REVIEW BY A FLUENT SPEAKER
    footer: {
      address: "Head Of St Margarets Bay, N.-É. B3Z 2C9",
      copyright: "© 2024 SMU, CSCI 3428 Group25G",
    },
    // NEEDS REVIEW BY A FLUENT SPEAKER
    accessibility: {
      title: "Paramètres d'accessibilité",
      textSize: "Taille du texte :",
      sizeSmall: "Petite",
      sizeMedium: "Moyenne",
      sizeLarge: "Grande",
      sizeMassive: "Très grande",
      contrast: "Contraste :",
      contrastDefault: "Par défaut",
      contrastDark: "Mode sombre",
      contrastGreyscale: "Mode niveaux de gris",
      contrastInverted: "Inversé",
      lineSpacing: "Interligne :",
      spacingDefault: "Par défaut",
      spacing2: "2",
      spacing3: "3",
      spacing4: "4",
    },
    // NEEDS REVIEW BY A FLUENT SPEAKER
    weather: {
      loading: "Chargement...",
      iconAlt: "Icône météo",
    },
  },
  // NEEDS REVIEW BY A FLUENT SPEAKER
  gallery: {
    title: "Galerie",
    addImage: {
      heading: "Ajoute ta propre image",
      note: "Les images envoyées sont gardées sur le serveur.",
      choose: "Choisir une ou des images",
      uploading: "Envoi en cours…",
    },
    grid: {
      heading: "Images envoyées",
      empty: "Aucune image trouvée.",
      imageAlt: "Image envoyée {index}",
    },
  },
};

export default fr;
