/* ============================================================================
   QA-DATA.JS — contenu de la page qa.html.

   COMMENT AJOUTER UN JEU :
   1. Mets une image dans /assets/qa/<slug>/cover.jpg (ou .png).
      N'importe quel format/dimensions fonctionne : elle est automatiquement
      recadrée en carte portrait par le site.
   2. Ajoute un objet { slug, name, genre } dans QA_CATEGORIES[...].games,
      dans la catégorie qui convient. L'ordre du tableau = ordre d'affichage.
   ============================================================================ */

const QA_INTRO = {
  company: "Microids",
  dates: { fr: "Septembre 2025 – Février 2026", en: "September 2025 – February 2026" },
  role: { fr: "QA Testeuse (stage)", en: "QA Tester (Internship)" },
  text: {
    fr: "Stage QA Testeuse chez Microids, au sein du pôle QA. Mon rôle : tester des builds, rédiger des rapports de bugs, réaliser des tests de régression et de sanity avant chaque soumission, et assurer le suivi qualité jusqu'après la sortie des jeux. C'est une expérience que je considère complémentaire à mon parcours de Level Designer : tester des jeux très différents m'aide à observer la structure des niveaux, comprendre comment les mécaniques interagissent, et affiner mon regard critique sur le game design.",
    en: "QA Tester internship at Microids, within the QA team. My role: testing builds, writing bug reports, running regression and sanity tests ahead of each submission, and following up on quality after each game's release. I see this as a skill complementary to my path as a Level Designer: testing very different games helps me read level structure, understand how mechanics interact, and sharpen my critical eye on game design."
  }
};

const QA_CATEGORIES = [
  {
    id: "published",
    title: { fr: "Jeux édités et publiés", en: "Published Microids titles" },
    subtitle: {
      fr: "Sur ces titres, je travaillais en lien direct avec le producer Microids et les équipes du studio de développement partenaire : tests de builds, rapports de bugs, régression, suivi jusqu'après la sortie.",
      en: "On these titles I worked in direct contact with the in-house Microids producer and the partner development studio: build testing, bug reports, regression testing, and follow-up after release."
    },
    games: [
      {
        slug: "agatha-christie-mort-sur-le-nil",
        cover: "assets/qa/agatha-christie-mort-sur-le-nil/cover.jpg",
        name: { fr: "Agatha Christie : Mort sur le Nil", en: "Agatha Christie: Death on the Nile" },
        genre: { fr: "Aventure & enquête narrative, aux côtés d'Hercule Poirot.", en: "Narrative detective adventure, alongside Hercule Poirot." }
      },
      {
        slug: "syberia-remastered-vr",
        cover: "assets/qa/syberia-remastered-vr/cover.jpg",
        name: { fr: "Syberia – Remastered & VR", en: "Syberia – Remastered & VR" },
        genre: { fr: "Aventure point & click culte, remasterisée et déclinée en VR.", en: "Cult point & click adventure, remastered and available in VR." }
      },
      {
        slug: "garfield-kart-2",
        cover: "assets/qa/garfield-kart-2/cover.jpg",
        name: { fr: "Garfield Kart 2 : All You Can Drift", en: "Garfield Kart 2: All You Can Drift" },
        genre: { fr: "Kart racing / party game déjanté avec Garfield et ses amis.", en: "Wacky kart racing party game with Garfield and friends." }
      },
      {
        slug: "garfield-escape-from-monday",
        cover: "assets/qa/garfield-escape-from-monday/cover.jpg",
        name: { fr: "Garfield : Escape from Monday", en: "Garfield: Escape from Monday" },
        genre: { fr: "Plateforme 3D dans les cauchemars de Garfield.", en: "3D platformer through Garfield's nightmares." }
      },
      {
        slug: "asterix-obelix-mission-babylone",
        cover: "assets/qa/asterix-obelix-mission-babylone/cover.jpg",
        name: { fr: "Astérix et Obélix : Mission Babylone", en: "Asterix & Obelix: Mission Babylon" },
        genre: { fr: "Platformer d'action en coopération, direction Babylone.", en: "Co-op action-platformer, destination Babylon." }
      },
      {
        slug: "marsupilami-2-salsa-palombia",
        cover: "assets/qa/marsupilami-2-salsa-palombia/cover.jpg",
        name: { fr: "Marsupilami 2 – Salsa Palombia", en: "Marsupilami 2 – Salsa Palombia" },
        genre: { fr: "Plateforme 2D coopératif, à travers la Palombie.", en: "2D co-op platformer, across Palombia." }
      },
      {
        slug: "corsairs-bataille-caraibes",
        cover: "assets/qa/corsairs-bataille-caraibes/cover.jpg",
        name: { fr: "Corsairs – La Bataille des Caraïbes", en: "Corsairs – Battle of the Caribbean" },
        genre: { fr: "Stratégie temps réel & abordages, dans le monde des flibustiers.", en: "Real-time strategy & boarding battles, in the world of pirates." }
      },
      {
        slug: "les-fourmis",
        cover: "assets/qa/les-fourmis/cover.jpg",
        name: { fr: "Les Fourmis", en: "Empire of the Ants" },
        genre: { fr: "Stratégie temps réel & aventure, dans un monde miniature inspiré de Bernard Werber.", en: "Real-time strategy & adventure, in a miniature world inspired by Bernard Werber." }
      },
      {
        slug: "space-adventure-cobra",
        cover: "assets/qa/space-adventure-cobra/cover.jpg",
        name: { fr: "Space Adventure Cobra : The Awakening", en: "Space Adventure Cobra: The Awakening" },
        genre: { fr: "Action-plateforme, adaptation de l'anime culte Cobra.", en: "Action-platformer adapted from the cult Cobra anime." }
      },
      {
        slug: "smurfs-flower-defense",
        cover: "assets/qa/smurfs-flower-defense/cover.jpg",
        name: { fr: "The Smurfs – Flower Defense", en: "The Smurfs – Flower Defense" },
        genre: { fr: "Tower defense en réalité virtuelle et mixte, dans le village des Schtroumpfs.", en: "Tower defense in VR/MR, set in the Smurfs' village." }
      },
      {
        slug: "king-of-tokyo",
        cover: "assets/qa/king-of-tokyo/cover.jpg",
        name: { fr: "King of Tokyo", en: "King of Tokyo" },
        genre: { fr: "Jeu de plateau numérique — stratégie et dés, en pleine bataille de kaijus.", en: "Digital board game — dice and strategy, kaiju-battle style." }
      }
    ]
  },
  {
    id: "indie",
    title: { fr: "En toute autonomie", en: "Flying solo" },
    subtitle: {
      fr: "Titres du label Microids Indie, testés en totale autonomie et sans contact direct avec les studios de développement.",
      en: "Microids Indie label titles, tested fully independently, with no direct contact with the development studios."
    },
    games: [
      {
        slug: "kaku-ancient-seal",
        cover: "assets/qa/kaku-ancient-seal/cover.jpg",
        name: { fr: "Kaku : Ancient Seal", en: "Kaku: Ancient Seal" },
        genre: { fr: "Action-aventure en monde ouvert, exploration et combat dynamique.", en: "Open-world action-adventure, exploration and dynamic combat." }
      },
      {
        slug: "bus-bound",
        cover: "assets/qa/bus-bound/cover.jpg",
        name: { fr: "Bus Bound", en: "Bus Bound" },
        genre: { fr: "Simulation de conduite urbaine, au volant d'un bus.", en: "Urban driving simulation, behind the wheel of a bus." }
      },
      {
        slug: "grime-2",
        cover: "assets/qa/grime-2/cover.jpg",
        name: { fr: "Grime II", en: "Grime II" },
        genre: { fr: "Action-aventure metroidvania, exigeant et stylisé.", en: "Stylized, challenging action-adventure metroidvania." }
      }
    ]
  }
];
