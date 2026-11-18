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
    // NEEDS REVIEW BY A FLUENT SPEAKER
    skipToContent: "Passer au contenu principal",
    nav: {
      home: "Accueil",
      about: "À propos",
      ecosystem: "Écosystème",
      gallery: "Galerie",
      naturalBurial: "Inhumation naturelle", // UNSURE: or "Enterrement naturel"
      map: "Carte",
      // NEEDS REVIEW BY A FLUENT SPEAKER
      trees: "Arbres parlants",
      contact: "Contact", // UNSURE: Canadian sites often use "Nous joindre"
      // NEEDS REVIEW BY A FLUENT SPEAKER
      menu: "Menu",
      closeMenu: "Fermer le menu",
    },
    siteName: "Woodland Conservation Area",
    // NEEDS REVIEW BY A FLUENT SPEAKER
    pageTitle: {
      notFound: "Page introuvable",
    },
    // NEEDS REVIEW BY A FLUENT SPEAKER
    imageAudio: {
      play: "Écouter la description de l'image",
      stop: "Arrêter la description de l'image",
      unavailable: "La description audio de cette image n'est pas encore prête.",
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
      // NEEDS REVIEW BY A FLUENT SPEAKER
      facebook: "St. Margaret's Bay Stewardship Association sur Facebook",
      instagram: "St. Margaret's Bay Stewardship Association sur Instagram",
      youtube: "St. Margaret's Bay Stewardship Association sur YouTube",
    },
    // NEEDS REVIEW BY A FLUENT SPEAKER
    accessibility: {
      title: "Paramètres d'accessibilité",
      openSettings: "Ouvrir les paramètres d'affichage",
      closeSettings: "Fermer les paramètres d'affichage",
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
    // NEEDS REVIEW BY A FLUENT SPEAKER
    slideshow: {
      pause: "Mettre les images en pause",
      play: "Relancer les images",
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
  // Ecosystem page
  // NEEDS REVIEW BY A FLUENT SPEAKER
  ecosystem: {
    heading: "Écosystème",
    readAloud: "Lire à haute voix",
    lakeAlt: "Lac",
    intro: "Ce site de conservation du boisé abrite un écosystème riche et vivant, rempli de vie et de beauté naturelle. Nos boisés comptent une grande variété de plantes et d'animaux, et chacun joue un rôle important pour garder l'équilibre de la nature.",
    heron: "Les hérons sont des oiseaux échassiers qui ont de longues pattes et un long cou. On les voit souvent près de l'eau.",
    deer: "Les cerfs sont des herbivores gracieux. On les trouve souvent dans les forêts et les prairies.",
    coyote: "Le coyote est un prédateur très adaptable. Il aide à garder l'équilibre des écosystèmes de la région en contrôlant le nombre de petits mammifères.",
    keyFeatures: {
      intro: "Les points forts de notre écosystème :",
      birch: {
        title: "Bouleaux jaunes :",
        text: "Ces arbres majestueux sont un symbole de notre boisé. Ils offrent un abri et de la nourriture à de nombreuses espèces. Leur écorce jaune et leur belle forme les font remarquer.",
      },
      wetlands: {
        title: "Milieux humides :",
        text: "Nos milieux humides sont importants pour nettoyer l'eau, limiter les inondations et abriter toutes sortes d'animaux. Ce sont des refuges pour les oiseaux, les amphibiens et les plantes aquatiques.",
      },
      artifacts: {
        title: "Objets historiques :",
        text: "Dans le boisé, on trouve des traces du passé. Elles nous montrent comment les gens vivaient il y a très longtemps.",
      },
    },
    floraHeading: "Flore",
    floraText: "Nos boisés sont ornés de nombreuses espèces de plantes, dont de grands bouleaux jaunes, de délicates fleurs sauvages et de belles fougères.",
    faunaHeading: "Faune",
    faunaText: "Parmi les animaux, on peut voir des cerfs gracieux, des renards joueurs et une foule d'espèces d'oiseaux. Tous contribuent à la vie de l'écosystème.",
    fungiHeading: "Champignons",
    fungiText: "Les champignons du boisé sont très utiles. Ils transforment la matière morte et s'associent aux arbres et aux plantes pour s'entraider.",
  },
  // NEEDS REVIEW BY A FLUENT SPEAKER
  // Page Inhumation naturelle
  naturalBurial: {
    headerAlt: "Un monticule de sépulture couvert de fleurs sauvages et de mousse dans une clairière de la forêt",
    descriptionHeading: "Qu'est-ce que l'inhumation naturelle?",
    readDescriptionLabel: "Lire la description à voix haute",
    listenToDescription: "Écouter la description",
    descriptionText: "L'inhumation naturelle est une façon respectueuse de la nature de mettre un défunt en terre. Elle protège les ressources naturelles et réduit l'effet sur l'environnement. Le corps est déposé dans un cercueil biodégradable, dans un linceul ou directement dans le sol, sans produit d'embaumement ni matériau qui ne se décompose pas.",
    // NEEDS REVIEW BY A FLUENT SPEAKER
    moreAbout: "En savoir plus sur : {title}",
    types: {
      // NEEDS REVIEW BY A FLUENT SPEAKER
      alt: "Un cercueil simple en bois, fait de matériaux naturels",
      title: "Types d'inhumation",
      summary: "Cercueils biodégradables, linceuls et autres choix d'inhumation naturelle",
      modalTitle: "Types d'inhumation naturelle",
      modalText: "L'inhumation naturelle (ou inhumation verte) cherche des façons de remettre un corps à la terre qui respectent l'environnement.\n\nI. Sites d'inhumation naturelle traditionnels\n1. Terrains de conservation - Le plus haut niveau de protection, la terre est protégée pour toujours.\n2. Terrains d'inhumation naturelle - Milieux de boisés ou de prés bien entretenus.\n3. Cimetières hybrides - Cimetières habituels qui ont une section d'inhumation naturelle.\n\nII. Autres méthodes respectueuses de la nature\n1. Réduction organique naturelle (compostage humain)\n2. Hydrolyse alcaline (crémation par l'eau)\n3. Inhumation dans une capsule d'arbre (idée à l'étude)",
    },
    markers: {
      alt: "Un marqueur de tombe en bois en forme de coeur",
      title: "Marqueurs de sépulture",
      summary: "Des marqueurs naturels comme des arbres, des pierres ou des plantes",
      modalText: "Marqueurs de sépulture traditionnels et naturels. Les marqueurs vont des plus traditionnels aux plus respectueux de l'environnement. Les pierres tombales debout sont courantes dans les cimetières habituels, mais on les évite en général dans un cadre naturel. Les marqueurs plats (plaques posées au ras du sol) servent souvent dans les cimetières hybrides pour identifier simplement une tombe. Dans les terrains d'inhumation naturelle stricts, on préfère une pierre naturelle ou un marqueur vivant, comme un arbre ou un arbuste de la région. Ainsi, le souvenir se fond dans le paysage naturel et l'appuie.",
    },
    locations: {
      alt: "Un appareil GPS portatif qui marque l'emplacement d'une sépulture",
      title: "Lieux de sépulture",
      summary: "Terrains d'inhumation naturelle et aires de conservation",
      modalText: "Les inhumations naturelles ont lieu dans des terrains d'inhumation naturelle, des aires de conservation, des boisés, des prés ou des cimetières verts.",
    },
    learnMore: "En savoir plus",
    close: "Fermer",
    footer: "\u00a9 2025 Woodland Conservation. Tous droits réservés.",
  },
  // NEEDS REVIEW BY A FLUENT SPEAKER
  // Page Contact
  contact: {
    heading: "Formulaire de contact et de demande",
    successBanner: "Ton formulaire a bien été envoyé!",
    personalHeading: "Renseignements personnels",
    detailsHeading: "Détails de la demande",
    fullName: "Nom complet",
    email: "Adresse courriel",
    inquiryType: "Type de demande",
    message: "Message (500 caractères au maximum)",
    required: "(Obligatoire)",
    optional: "(Facultatif)",
    suggestions: "Suggestions :",
    sendOtp: "Envoyer le code",
    sending: "Envoi en cours...",
    enterOtp: "Entrer le code",
    verifyOtp: "Vérifier le code",
    verifying: "Vérification en cours...",
    emailVerified: "Ton adresse courriel est vérifiée.",
    selectOption: "Choisir une option",
    types: {
      general: "Question générale",
      siteVisit: "Demande de visite du site",
      burial: "Question sur les services d'inhumation",
    },
    hints: {
      general: "Pour les questions générales sur le boisé ou sur le travail de conservation.",
      siteVisit: "Choisis cette option pour organiser une visite du site.",
      burial: "Choisis cette option pour les questions sur les services d'inhumation naturelle et leur disponibilité.",
    },
    previewHeading: "Aperçu de ton message :",
    previewEmpty: "L'aperçu de ton message va s'afficher ici pendant que tu écris.",
    submit: "Envoyer la demande",
    submitting: "Envoi en cours...",
    clear: "Effacer le formulaire",
    errors: {
      emailBeforeOtp: "Entre une adresse courriel valide avant d'envoyer le code.",
      otpRequired: "Entre le code avant de le vérifier.",
      fullNameRequired: "Le nom complet est obligatoire.",
      emailRequired: "L'adresse courriel est obligatoire.",
      emailInvalid: "Entre une adresse courriel valide.",
      inquiryTypeRequired: "Choisis un type de demande, s'il te plaît.",
      messageTooLong: "Le message dépasse 500 caractères.",
      formInvalid: "Remplis tous les champs obligatoires correctement avant d'envoyer le formulaire.",
    },
    alerts: {
      sendOtpFailed: "Le code n'a pas pu être envoyé.",
      incorrectOtp: "Le code est incorrect.",
      submitFailed: "Le formulaire n'a pas pu être envoyé.",
    },
  },
  // NEEDS REVIEW BY A FLUENT SPEAKER
  // Page Carte
  map: {
    youAreHere: "JE SUIS ICI",
    returnToSiteMap: "Revenir à la carte du site",
    north: "Nord",
    attribution: "&copy; les contributeurs d'OpenStreetMap",
    userMarker: "Tu es ici",
    playAudio: "Écouter l'audio \u2014 {name} ({distance} m)",
    footnote: "Les limites de la carte, les sentiers et les arbres parlants sont approximatifs. Ils servent à t'aider à te déplacer sur place et à apprendre.",
    status: {
      initial: "Le GPS sert seulement à placer un repère sur la carte, et ta position reste sur ton appareil. Les coordonnées ne sont jamais affichées.",
      unsupported: "Cet appareil ne peut pas partager où il se trouve.",
      denied: "Ta position n'est pas partagée.",
      unavailable: "Nous ne trouvons pas ta position pour le moment.",
      locating: "Recherche de ta position\u2026",
      found: "Position trouvée. Ton repère est sur la carte, mais les coordonnées ne sont pas affichées.",
      failed: "Impossible d'obtenir ta position GPS. Vérifie les autorisations, s'il te plaît.",
    },
    // NEEDS REVIEW BY A FLUENT SPEAKER
    locationFallback: {
      denied: "Ce n'est pas grave. Tu peux explorer sans partager où tu es.",
      unavailable: "La forêt cache ton signal pour le moment. Tu peux quand même rencontrer les arbres.",
      unsupported: "Cet appareil ne peut pas partager où il se trouve. Tu peux quand même rencontrer les arbres.",
      scan: "Scanner le panneau d'un arbre",
      list: "Choisir un arbre dans la liste",
    },
    places: {
      dock: { name: "Quai" },
      trailhead: { name: "Début du sentier", description: "L'entrée principale des sentiers du boisé." },
      farmhouse: { name: "Fondations de la ferme", description: "Ce qui reste d'une ancienne ferme." },
      well: { name: "Puits", description: "Ce vieux puits fournissait de l'eau à la région." },
      sittingArea: { name: "Coin de repos", description: "Un endroit tranquille pour se reposer et observer la nature." },
      yellowBirch: { name: "Bouleau jaune côtier", description: "Une espèce d'arbre importante pour la biodiversité." },
      labyrinth: { name: "Entrée du labyrinthe", description: "L'entrée du petit labyrinthe du boisé." },
    },
  },
  // NEEDS REVIEW BY A FLUENT SPEAKER
  // Arbres parlants
  trees: {
    page: {
      title: "Arbres parlants",
      intro: "Certains arbres de notre boisé ont une affiche. Lis l'affiche, ou choisis un arbre ci-dessous, pour entendre son histoire. Tu n'as pas besoin de partager ta position ni ta caméra.",
      listLabel: "Nos arbres parlants",
      backToList: "Retour à tous les arbres parlants",
      unknown: "Nous n'avons pas trouvé cet arbre. Retournons vers les arbres que nous connaissons.",
      factsLabel: "Ce que j'aimerais que tu saches",
    },
    // NEEDS REVIEW BY A FLUENT SPEAKER
    audio: {
      play: "Écouter cet arbre",
      stop: "Arrêter",
      unavailable: "Cet arbre n'a pas encore trouvé sa voix. Tu peux lire son histoire plus bas.",
      captionsLabel: "Ce que dit l'arbre",
      transcript: "Lire ce que dit l'arbre",
    },
    // NEEDS REVIEW BY A FLUENT SPEAKER
    scanner: {
      open: "Lire l'affiche d'un arbre",
      title: "Lire l'affiche d'un arbre",
      explain: "Pour lire l'affiche de l'arbre, cette page a besoin de regarder avec ta caméra. L'image reste sur ton appareil. Rien n'est gardé ni envoyé.",
      turnOn: "Allumer la caméra",
      notNow: "Pas maintenant",
      videoLabel: "Vue de la caméra. Tiens l'affiche de l'arbre devant la caméra.",
      looking: "Je cherche l'affiche de l'arbre. Tiens-la bien droite devant la caméra.",
      notTree: "Ce code n'est pas l'un de nos arbres. Essaie l'affiche sur l'arbre.",
      denied: "Ce n'est pas grave. Tu peux quand même rencontrer les arbres. Choisis-en un dans la liste.",
      pickFromList: "Choisir un arbre dans la liste",
      close: "Fermer",
      waiting: "J'attends ta caméra. Si ton appareil le demande, touche Autoriser.",
    },
    // NEEDS REVIEW BY A FLUENT SPEAKER
    nearby: {
      message: "Un arbre parlant est tout près : le {name}. Peux-tu trouver son affiche ?",
      scan: "Lire l'affiche de l'arbre",
      meet: "Rencontrer cet arbre sans lire l'affiche",
      dismiss: "Pas maintenant",
    },
    // NEEDS REVIEW BY A FLUENT SPEAKER
    character: {
      alt: "Un dessin amical d'un arbre : {name}",
    },
    species: {
      // NEEDS REVIEW BY A FLUENT SPEAKER
      yellowBirch: {
        name: "Bouleau jaune",
        greeting: "Bonjour ! Je suis un bouleau jaune.",
        facts: [
          "Mon écorce est luisante, d'un jaune bronze, et elle se détache en fines bandes frisées.",
          "Si on gratte une jeune brindille, elle sent la gaulthérie.",
          "Mes feuilles deviennent jaunes à l'automne.",
          "Mes petites graines nourrissent les oiseaux en hiver.",
          "Je peux vivre bien plus de cent ans.",
        ],
      },
      // NEEDS REVIEW BY A FLUENT SPEAKER
      redSpruce: {
        name: "Épinette rouge",
        greeting: "Bonjour ! Je suis une épinette rouge.",
        facts: [
          "Je suis l'arbre provincial de la Nouvelle-Écosse.",
          "Mes aiguilles sont courtes, piquantes et à quatre côtés.",
          "Mes cônes pendent de mes branches.",
          "Je peux vivre plusieurs centaines d'années.",
          "J'aime l'air frais et humide près de la côte.",
        ],
      },
      // NEEDS REVIEW BY A FLUENT SPEAKER
      redMaple: {
        name: "Érable rouge",
        greeting: "Bonjour ! Je suis un érable rouge.",
        facts: [
          "Au début du printemps, j'ai des bourgeons et des fleurs rouges.",
          "Mes feuilles ont trois à cinq pointes, et elles prennent de vives couleurs à l'automne.",
          "Mes graines ont des ailes, alors elles tournent en tombant.",
          "Je peux pousser dans un sol mouillé comme dans un sol sec.",
        ],
      },
      // NEEDS REVIEW BY A FLUENT SPEAKER
      whitePine: {
        name: "Pin blanc",
        greeting: "Bonjour ! Je suis un pin blanc.",
        facts: [
          "Mes aiguilles sont longues et douces, et elles poussent en groupes de cinq.",
          "Mes cônes sont longs et minces.",
          "Je suis l'un des plus grands arbres de l'est du Canada.",
          "Mes branches poussent en étages plats.",
        ],
      },
    },
  },
};

export default fr;
