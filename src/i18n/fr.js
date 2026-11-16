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
  home: {
    readAloud: "Lire à haute voix",
    hero: {
      welcome: "Bienvenue sur le",
      siteName: "Site de conservation Woodland",
      intro: "Découvre le calme de la nature et aide à protéger l'équilibre fragile de notre écosystème.",
      imageAlt: "Woodland Conservation",
    },
    whatWeDo: {
      heading: "Ce que nous faisons",
      conservation: {
        title: "Projets de conservation",
        text: "Nous protégeons les habitats naturels et la faune pour garder un écosystème en santé pour les générations futures.",
      },
      sustainable: {
        title: "Pratiques durables",
        text: "Apprends des gestes écologiques qui réduisent notre empreinte carbone et aident à bâtir une planète plus verte.",
      },
      wildlife: {
        title: "Protection de la faune",
        text: "Nous nous engageons à protéger les espèces en voie de disparition et à rendre la biodiversité à notre milieu naturel.",
      },
    },
    articles: {
      heading: "Articles à lire",
      readMore: "Lire la suite",
      article1: {
        title: "Aire de conservation proposée",
        text: "Découvre comment l'aire de conservation proposée nous rapprochera de nos buts écologiques.",
      },
      article2: {
        title: "Une dernière empreinte",
        text: "Apprends-en plus sur l'empreinte finale des efforts de conservation dans notre région.",
      },
      article3: {
        title: "St. Paul's, Nouvelle-Écosse",
        text: "Cet article parle des efforts de conservation et de restauration à St. Paul's, en Nouvelle-Écosse.",
      },
    },
    weather: {
      title: "Météo",
      localWoodland: "Forêt de la région",
      yourLocation: "Ta position",
      useMyLocation: "Utiliser ma position",
      loading: "Chargement des conditions actuelles…",
      unavailable: "Météo non disponible. Affichage d'un lieu par défaut.",
      notSupported: "La géolocalisation n'est pas prise en charge. Affichage d'un lieu par défaut.",
      permissionDenied: "Permission refusée. Affichage d'un lieu par défaut.",
      temperature: "Température",
      wind: "Vent",
      windUnit: "km/h",
      timezone: "Fuseau horaire",
    },
    featured: {
      heading: "Espèce en vedette",
      name: "Bouleau jaune",
      shortDescription: "Le bouleau jaune est une espèce importante de la région, connue pour son écorce jaune bien particulière.",
      longDescription: "Le bouleau jaune est une espèce importante de la région, connue pour son écorce jaune bien particulière et son rôle dans la biodiversité locale. Il pousse dans les forêts et sert d'abri à toutes sortes d'animaux.",
      learnMore: "En savoir plus",
    },
    modal: {
      close: "Fermer",
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
  // NEEDS REVIEW BY A FLUENT SPEAKER
  about: {
    title: "À propos de la conservation des boisés de St. Margaret’s Bay",
    nav: {
      about: "À propos",
      mission: "Mission",
      vision: "Vision",
    },
    tools: {
      dyslexia: "Police pour la dyslexie",
      dyslexiaTitle: "Activer ou désactiver la police pour la dyslexie",
      contrast: "Contraste élevé",
      contrastTitle: "Activer ou désactiver le contraste élevé",
      spacing: "Interligne",
      spacingTitle: "Activer ou désactiver l'interligne",
      share: "Partager",
      soundPlay: "Écouter les sons de la forêt",
      soundStop: "Arrêter les sons de la forêt",
    },
    imageAudio: "Audio de l'image",
    readAloud: "Lire à voix haute",
    sections: {
      about: {
        title: "À propos de nous",
        text: "Nous prenons soin des boisés autour de St. Margaret’s Bay. Nous travaillons avec nos voisins pour protéger les arbres, l'eau propre et la faune. Nous partageons des gestes simples que tout le monde peut faire pour aider la nature.",
        imgAlt: "Des fougères vertes dans un boisé",
        caption: "Des fougères le long d'un sentier ombragé du boisé",
      },
      mission: {
        title: "Mission",
        text: "Notre mission est de protéger les habitats d'ici et de garder la forêt en santé. Nous plantons des arbres, nous ramassons les déchets et nous invitons les gens à se joindre à nos activités. Les petits gestes comptent quand on travaille ensemble.",
        imgAlt: "Des bénévoles qui plantent des arbres",
        caption: "Des bénévoles qui plantent de jeunes arbres le long d'un sentier",
      },
      vision: {
        title: "Vision",
        text: "Nous voyons un avenir où nos boisés sont en pleine santé. Les sentiers sont sécuritaires, les ruisseaux sont propres et les animaux ont de la place pour vivre. Les familles peuvent apprendre et profiter de la nature pendant de nombreuses années.",
        imgAlt: "Des feuilles d'érable rouge",
        caption: "Des feuilles d'érable rouge éclairées par le soleil d'automne",
      },
    },
    stats: {
      heading: "Nos résultats",
      trees: "Arbres plantés : 4 200+",
      hectares: "Hectares restaurés : 75+",
      species: "Espèces suivies : 18",
    },
    species: {
      heading: "Espèces à découvrir",
      redMaple: {
        name: "Érable rouge",
        type: "Arbre",
        note: "Un arbre robuste connu pour ses feuilles d'un rouge éclatant à l'automne.",
      },
      chickadee: {
        name: "Mésange à tête noire",
        type: "Oiseau",
        note: "Un petit oiseau chanteur qu'on trouve souvent dans les boisés mixtes.",
      },
      deer: {
        name: "Cerf de Virginie",
        type: "Mammifère",
        note: "Fréquent en bordure de forêt, où il broute les plantes.",
      },
      fern: {
        name: "Fougère aigle",
        type: "Plante",
        note: "Une fougère qui pousse dans les clairières ensoleillées et le long des sentiers.",
      },
    },
    timeline: {
      heading: "L'histoire du boisé",
      early2000s: {
        year: "Début des années 2000",
        text: "Des résidents commencent à organiser des nettoyages et à entretenir les sentiers de façon informelle.",
      },
      tens: {
        year: "Années 2010",
        text: "Des groupes de bénévoles se forment pour prendre soin du boisé et pour sensibiliser les gens.",
      },
      today: {
        year: "Aujourd'hui",
        text: "L'endroit sert à la marche, à l'apprentissage et à de petits projets de conservation.",
      },
    },
    faq: {
      heading: "Questions et réponses",
      help: {
        question: "Comment puis-je aider à protéger les boisés?",
        answer: "De petits gestes font une différence : rester sur les sentiers balisés, rapporter ses déchets, participer aux nettoyages et planter des espèces indigènes.",
      },
      purpose: {
        question: "À quoi sert ce site Web?",
        answer: "Le site présente des renseignements simples sur le boisé, met en valeur ses particularités et montre comment soutenir la conservation.",
      },
      readAloud: {
        question: "Comment fonctionne la lecture à voix haute?",
        answer: "Le bouton de lecture à voix haute utilise la synthèse vocale du navigateur pour dire le texte à voix haute. Tu peux mettre en pause ou reprendre avec la barre d'espace.",
      },
      phone: {
        question: "Puis-je utiliser ce site sur mon téléphone?",
        answer: "Oui. La mise en page s'adapte, alors les cartes, les boutons et le texte s'ajustent aux petits écrans.",
      },
    },
    learnMore: "En savoir plus",
    backToTop: "Retour en haut",
    accessibilityStrip: "Accessibilité : WCAG AA • Navigation au clavier • Boutons de lecture vocale • Zoom du texte • Options pour la dyslexie et le contraste",
  },
};

export default fr;
