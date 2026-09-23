/* ============================================================================
   PROJECTS.JS — la seule chose à modifier pour ajouter / modifier un projet.
   ============================================================================

   COMMENT AJOUTER UN PROJET :

   1. Crée un dossier dans /assets/projects/<slug>/  (ex: mon-nouveau-projet)
      et mets-y tes images, vidéos, gifs (cover.svg obligatoire).

   2. Copie-colle un objet ci-dessous (entre les crochets [ ]), donne-lui un
      "slug" unique (sans espace, sans accent — sert dans l'URL), et remplis
      les champs. Chaque texte a une version { fr: "...", en: "..." }.

   3. Le tableau "blocks" décrit le contenu de la page projet, dans l'ordre.
      Pour les médias, indique juste le NOM DU FICHIER (pas le chemin complet) :
      il est automatiquement cherché dans le dossier du projet /assets/projects/<slug>/.
      Types disponibles :
        - { type: "text",  fr: "...", en: "..." }
        - { type: "image", src: "xxx.jpg", caption: {fr:"",en:""} }
        - { type: "video", src: "xxx.mp4", poster: "xxx.jpg", caption:{fr:"",en:""} }
        - { type: "gif",   src: "xxx.gif", caption: {fr:"",en:""} }
        - { type: "images-row", items: [ "img1.jpg", "img2.jpg", "img3.jpg" ] }  (3 images côte à côte)
        - { type: "carousel", items: [ "img1.jpg", ... ], caption: {fr:"",en:""} }  (plusieurs images, avec flèches + points)
        - { type: "gallery",  items: [ "img1.jpg", ... ], caption: {fr:"",en:""} }  (grille d'images, autant que tu veux)
        - { type: "sketches", items: [ "img1.jpg", ... ], label: {fr:"",en:""} }    (petite galerie repliée dans un menu déroulant)
        - { type: "interactive-map", src: "map.jpg", caption: {fr:"",en:""}, spots: [...] }
            Carte de niveau cliquable : chaque point ("spot") ouvre une pop-up
            avec un slider avant/après comparant le blockout (LD) et le rendu
            final du jeu à cet endroit précis.
              spots: [
                {
                  x: 47.5, y: 46,                 // position en % sur l'image de la carte
                  title:   { fr: "...", en: "..." },
                  caption: { fr: "...", en: "..." },
                  ld:    "point-ld.jpg",           // capture blockout / grey-box
                  final: "point-final.jpg",        // capture du rendu final
                  views: [                          // optionnel — plusieurs plans sur ce point,
                    { ld: "point-a-ld.jpg", final: "point-a-final.jpg" },  // parcourus avec des flèches
                    { ld: "point-b-ld.jpg", final: "point-b-final.jpg" }   // sur le comparateur LD/final
                  ],
                  references: [                    // optionnel — petites vignettes à part
                    "ref-photo.jpg",                // (nom de fichier seul : pas de légende)
                    { src: "ref-moodboard.jpg", caption: { fr: "...", en: "..." } }
                  ]
                },
                ...
              ]
            Le chiffre affiché sur chaque point = sa position dans le
            tableau "spots" (le 1er élément du tableau = point 1 = premier
            endroit traversé par le joueur, etc.) : l'ordre des points dans
            "spots" doit donc suivre l'ordre de progression réel du joueur
            dans le niveau.

            Pour trouver x/y : ouvre la page projet avec &calibrate=1 dans
            l'URL (ex: project.html?slug=xxx&calibrate=1) — un bouton
            "Mode calibrage" apparaît sous la carte ; clique sur la carte à
            l'endroit voulu, les coordonnées s'affichent et sont copiées
            dans le presse-papier, prêtes à coller dans "spots". Ce bouton
            n'apparaît jamais pour les visiteurs normaux du site.
            Si "ld" ou "final" est vide sur un spot, un emplacement
            pointillé s'affiche à la place dans la pop-up. "references" est
            entièrement optionnel : si absent ou vide, rien ne s'affiche —
            sinon une petite rangée de vignettes apparaît sous le slider
            (cliquables pour les voir en grand), bien séparée de la
            comparaison LD/final.

            "views" est aussi entièrement optionnel et indépendant de
            "references" : si tu veux montrer plusieurs plans (angles de
            caméra différents) sur le même point, mets un tableau "views"
            avec un { ld, final } par plan — des flèches ‹ › apparaissent
            alors sur le comparateur pour passer de l'un à l'autre, chacun
            gardant son propre slider LD/final. Sans "views" (ou avec un
            seul élément dedans), aucune flèche n'apparaît et le point se
            comporte comme avant, avec juste "ld"/"final". Tu choisis donc
            spot par spot lesquels ont plusieurs plans.

            Une fine flèche courbe (Bézier) relie chaque point au suivant.
            Sa courbure est automatique ; pour la retoucher, ajoute sur le
            point de DÉPART du segment :
              curve: { c1: [x, y], c2: [x, y] }   // 2 points de contrôle, en % comme x/y
            Le plus simple : avec &calibrate=1, clique sur "Mode flèches"
            sous la carte — des poignées apparaissent sur chaque courbe — fais-les glisser, et la ligne
            "curve: {...}" à coller est copiée dans le presse-papier.

      Pour "image" / "video" / "gif" / "carousel" / "gallery" / "interactive-map",
      si tu laisses src (ou items) vide, un emplacement pointillé s'affiche à
      la place — pratique pour préparer la structure avant d'avoir tes fichiers.

   4. Le projet apparaît automatiquement dans la galerie de la page d'accueil,
      dans l'ordre du tableau (le premier de la liste = premier affiché).
      Mets featured: true sur les projets à mettre en avant en haut de la
      galerie (grande carte).

   Rien d'autre à toucher — pas besoin de créer de nouvelle page HTML.

   ----------------------------------------------------------------------------
   PAGE À MENU PERSISTANT (onglets qui scrollent vers une section) :

   Pour une page projet longue avec beaucoup à raconter, remplace "blocks" par
   "sections". Un mini-menu sticky est alors généré automatiquement, avec un
   onglet par section (et des sous-onglets pour les sections qui ont des
   "subsections"). Cliquer sur un onglet fait défiler jusqu'au bon endroit de
   la page, et l'onglet actif se surligne tout seul pendant la lecture.

     sections: [
       {
         id: "un-id-unique",                    // sert dans l'URL (#un-id-unique)
         nav: { fr: "Nom dans le menu", en: "..." },
         blocks: [ ...mêmes types que ci-dessus... ]
       },
       {
         id: "autre-section",
         nav: { fr: "...", en: "..." },
         blocks: [ ... ],                        // optionnel : texte d'intro de la section
         subsections: [
           {
             id: "sous-id-unique",
             nav: { fr: "Nom du sous-onglet", en: "..." },
             tags: { fr: ["Tag 1", "Tag 2"], en: ["Tag 1", "Tag 2"] },  // optionnel
             blocks: [ ... ]
           },
           ...
         ]
       }
     ]

   Ne mets PAS "blocks" et "sections" en même temps sur le même projet :
   "sections" prend le dessus et "blocks" est ignoré.

   ----------------------------------------------------------------------------
   CHAMPS OPTIONNELS (n'importe quel projet peut les ajouter) :

     coverVideo: "assets/projects/<slug>/cover-loop.mp4"
       Si renseigné, remplace "cover" en fond du haut de la page projet
       (comme le showreel de la page d'accueil) — sert aussi d'aperçu au
       survol de la carte dans la galerie. Silencieuse, en boucle.

     download: {
       label: { fr: "Télécharger sur itch.io", en: "Download on itch.io" },
       url: "https://xxx.itch.io/xxx"
     }
       Affiche un bouton (haut de page + bas de page) pour aller tester/
       télécharger le jeu.

     trailer: {
       url: "https://www.youtube.com/embed/XXXXXXXXXXX",   // lien EMBED, pas le lien "watch"
       caption: { fr: "Gameplay complet", en: "Full gameplay" }   // optionnel
     }
       Affiche une vidéo YouTube intégrée, en bas de page, en petit format
       (volontairement discret, pas un élément principal de la page).
   ============================================================================ */

const PROJECTS = [

  {
    slug: "the-light-above",
    featured: true,
    cover: "assets/projects/the-light-above/cover-tla.webp",
    coverVideo: "", // optionnel : ex "assets/projects/the-light-above/cover-loop.mp4" (fond du haut de page + aperçu au survol)
    download: {
      label: { fr: "Tester le jeu sur itch.io", en: "Play it on itch.io" },
      url: "https://REMPLACE-MOI.itch.io/the-light-above" // ← ton vrai lien itch.io
    },
    trailer: {
      url: "https://www.youtube.com/embed/REMPLACE_PAR_ID_VIDEO", // ← lien EMBED YouTube (pas "watch?v=")
      caption: { fr: "Gameplay complet", en: "Full gameplay" }
    },
    year: "2025",
    engine: "Unreal Engine 5",
    role: { fr: "Level Designer and Lead", en: "Level Designer and Lead" },
    title: { fr: "The Light Above", en: "The Light Above" },
    tags: {
      fr: ["Solo", "Narratif", "Contemplatif", "Simulateur de marche", "First Person"],
      en: ["Solo", "Narrative", "Contemplative", "Walking Simulator", "First Person"]
    },
    summary: {
      fr: "Projet de fin d'études — exploration narrative et contemplative dans un village italien.",
      en: "Graduation project — a narrative, contemplative exploration through an Italian village."
    },
    links: [
      { label: "ArtStation", url: "https://www.artstation.com/valentinepreaux" }
    ],
    sections: [

      /* -------------------------------------------------------------- */
      {
        id: "contexte",
        nav: { fr: "Contexte du jeu", en: "Game context" },
        blocks: [
          {
            type: "text",
            fr: "The Light Above est un simulateur de marche narratif et contemplatif en vue première personne, se déroulant dans un village italien baigné de lumière. Le joueur explore librement l'espace, à son rythme, à la découverte de son histoire.",
            en: "The Light Above is a narrative, contemplative first-person walking simulator set in a sunlit Italian village. The player explores the space freely, at their own pace, uncovering its story."
          },
          { type: "image", src: "01.svg", caption: { fr: "", en: "" } },
          {
            type: "text",
            fr: "Cléo, une jeune femme lasse de son quotidien urbain et morose, décide de tout quitter pour devenir gardienne de phare sur la petite île isolée de Soloni en Méditerranée. Attirée par la promesse d'une vie paisible, elle sera pourtant vite confrontée à une série d'événements étranges dont elle seule sera témoin et devra en trouver la source.",
            en: "[Lore / world: tell the game's story here, its setting, and what the player uncovers and why.]"
          },
          {
            type: "text",
            fr: "[Préproduction : recherches, moodboards, prototypes, choix de direction pris en amont de la production.]",
            en: "[Preproduction: research, moodboards, prototypes, direction choices made ahead of production.]"
          },
          {
            type: "text",
            fr: "[Références : jeux, films, photos ou lieux réels qui ont inspiré l'ambiance et la composition du jeu.]",
            en: "[References: games, films, photos or real places that inspired the game's mood and composition.]"
          }
        ]
      },

      /* -------------------------------------------------------------- */
      {
        id: "level-design",
        nav: { fr: "Level Design", en: "Level Design" },
        blocks: [
          {
            type: "text",
            fr: "Objectifs de level design : guider le regard du joueur par la composition et la lumière, créer des respirations contemplatives, et distiller la narration environnementale sans texte ni HUD.",
            en: "Level design goals: guide the player's eye through composition and lighting, create contemplative breathing room, and deliver environmental storytelling without text or HUD."
          },
          { type: "video", src: "", poster: "02.svg", caption: { fr: "Extrait de gameplay", en: "Gameplay excerpt" } }
        ],
        subsections: [
          {
            id: "ld-ile-village",
            nav: { fr: "Île et Village", en: "Island & Village" },
            tags: {
              fr: ["Exploration libre", "Composition de silhouettes", "Repères de navigation"],
              en: ["Free exploration", "Silhouette composition", "Navigation landmarks"]
            },
            blocks: [
              {
                type: "text",
                fr: "[Décris ici la map Île et Village : intentions de composition, gestion du rythme d'exploration, repères visuels, points forts et difficultés rencontrées.]",
                en: "[Describe the Island & Village map here: composition intent, exploration pacing, visual landmarks, highlights and challenges.]"
              },
              { type: "image", src: "", caption: { fr: "Carte du niveau", en: "Level map" } },
              { type: "carousel", items: [], caption: { fr: "Images de level design", en: "Level design images" } },
              { type: "video", src: "", caption: { fr: "Vidéo de level design", en: "Level design video" } },
              { type: "gif", src: "", caption: { fr: "Gif du process", en: "Process gif" } },
              { type: "gallery", items: [], caption: { fr: "Images finales in-game", en: "Final in-game images" } },
              { type: "sketches", items: [], label: { fr: "Croquis papier", en: "Paper sketches" } }
            ]
          },
          {
            id: "ld-villa",
            nav: { fr: "Villa", en: "Villa" },
            tags: {
              fr: ["Déni et récompense", "Verticalité", "Lumière dirigée"],
              en: ["Denial and reward", "Verticality", "Pacing through strong atmosphere"]
            },
            blocks: [
              {
                type: "text",
                fr: "Ce niveau se déroule dans un coin reculé d'une île italienne. L'objectif du joueur est d'atteindre une villa abandonnée depuis des années. Autrefois, la propriété abritait un musée retraçant l'histoire de l'île et la vie de la femme qui l'a fait construire — une célèbre cantatrice, disparue tragiquement à un jeune âge. À mesure que le joueur progresse, une tempête s'intensifie à l'approche de l'entrée, renforçant la tension et l'atmosphère du lieu.",
                en: "This level takes place in a secluded corner of an Italian island. The player's objective is to reach an abandoned villa that has stood empty for years. The estate once served as a museum retracing the island's history and the life of the woman who built it — a renowned opera singer who died tragically at a young age. As the player progresses, an intensifying storm builds tension the closer they get to the entrance, reinforcing the atmosphere."
              },
              {
                type: "text",
                fr: "Rythme : Dans un walking sim, le joueur peut vite se lasser lorsqu'il ne se passe rien, j'ai donc dû trouver des solutions pour que l'exploration reste plaisante et interactive. J'ai abordé ce problème en réfléchissant à la façon dont l'environnement pouvait capter l'attention du joueur, éveiller sa curiosité et entretenir son intérêt, à travers plusieurs événements déclenchés :",
                en: "Pacing: In a walking sim, the player can easily lose interest when nothing happens, so I had to find ways to keep exploration engaging and interactive. I approached this by thinking about how the environment itself could capture the player's attention, spark curiosity, and sustain engagement through a set of triggered events, including:"
              },
              {
                type: "interactive-map",
                src: "villa-map.webp",
                caption: {
                  fr: "Carte du niveau — cliquez sur un point pour comparer le blockout et le rendu final à cet endroit.",
                  en: "Level map — click a point to compare the blockout and the final render at that spot."
                },
                // Images des points : préfixées par le numéro du point (01-, 02-...).
                // Références : dans le sous-dossier references/.
                spots: [
                  {
                    x: 88.4, y: 13.3,
                    title: { fr: "Sortie du tunnel - 1re récompense", en: "Tunnel exit - 1st reward" },
                    caption: {
                      fr: "Début du niveau, avec un élément narratif diffusant un dialogue, et la tour du domaine visible en arrière-plan à travers les arbres qui est le point de repère principal et la destination du niveau.",
                      en: "Beginning of the level, with a narrative beat delivered through dialogue, and the estate's tower visible in the background through the trees, which is the main landmark and the destination of the level."
                    },
                    ld: "01-tunnel-exit-ld.webp",
                    final: "01-tunnel-exit-final.webp",
                    references: [
                      { src: "references/tower-ref1.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/road-ref1.webp", caption: { fr: "Référence 2", en: "Reference 2" } },
                      { src: "references/path-ref5.webp", caption: { fr: "Référence 3", en: "Reference 3" } }
                    ]
                  },
                  {
                    x: 81.7, y: 40.0,
                    title: { fr: "Statue", en: "Statue" },
                    caption: {
                      fr: "Décoration scénaristique pour maintenir l'intérêt du joueur",
                      en: "Narrative set dressing used to hold the player's interest."
                    },
                    ld: "02-statue-ld.webp",
                    final: "02-statue-final.webp",
                    references: [
                      { src: "references/statue-ref1.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/statue-ref2.webp", caption: { fr: "Référence 2", en: "Reference 2" } }
                    ]
                    curve: { c1: [92.5, 28.7], c2: [81.2, 29] },
                  },
                  {
                    x: 62.8, y: 24.3,
                    title: { fr: "Vue de la cascade", en: "View of the waterfall" },
                    caption: {
                      fr: "Récompense l'exploration du joueur et diffuse un élément narratif de dialogue.",
                      en: "Rewards the player's exploration and delivers a narrative dialogue beat."
                    },
                    ld: "03-waterfall-ld.webp",
                    final: "03-waterfall-final.webp",
                    references: [
                      { src: "references/waterfall-ref1.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/cliffs-ref1.webp", caption: { fr: "Référence 2", en: "Reference 2" } }
                    ]
                  },
                  {
                    x: 56.3, y: 27.8,
                    title: { fr: "Éboulement - 2e récompense", en: "Landslide - 2nd reward" },
                    caption: {
                      fr: "Offre une deuxième vue plus proche sur la destination finale, montrant la route principale bloquée, forçant le joueur à chercher un autre passage.",
                      en: "Offers a second, closer view of the final destination, showing the main road blocked and forcing the player to look for another way through."
                    },
                    ld: "04-rockfall-ld.webp",
                    final: "04-rockfall-final.webp",
                    references: [
                      { src: "references/tower-ref1.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/tower-ref2.webp", caption: { fr: "Référence 2", en: "Reference 2" } },
                      { src: "references/domaine-ref7.webp", caption: { fr: "Référence 3", en: "Reference 3" } }
                    ]
                  },
                  {
                    x: 51.0, y: 31.4,
                    title: { fr: "Hareng rouge", en: "Red herring" },
                    caption: {
                      fr: "Hareng rouge, pour attirer le joueur sur une fausse piste en cachant le chemin.",
                      en: "Red herring, to lure the player onto a false trail to conceal the real path."
                    },
                    ld: "05-red-herring-ld.webp",
                    final: "05-red-herring-final.webp",
                    references: [
                      { src: "references/road-ref1.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/path-ref1.webp", caption: { fr: "Référence 2", en: "Reference 2" } }
                    ]
                  },
                  {
                    x: 61.1, y: 42.4,
                    title: { fr: "Passage", en: "Passage" },
                    caption: {
                      fr: "Nous avons cherché à alterner entre espaces ouverts et fermés pour dynamiser l'exploration du joueur.",
                      en: "We aimed to alternate between open and enclosed spaces to make the player's exploration more dynamic."
                    },
                    views: [
                      { ld: "06-passage-ld1.webp", final: "06-passage-final1.webp" },
                      { ld: "06-passage-ld2.webp", final: "06-passage-final2.webp" }
                    ],
                    references: [
                      { src: "references/path-ref2.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/path-ref1.webp", caption: { fr: "Référence 2", en: "Reference 2" } }
                    ]
                  },
                  {
                    x: 74.0, y: 75.4,
                    title: { fr: "Zone touristique", en: "Tourist area" },
                    caption: {
                      fr: "J'ai cherché un moyen d'ajouter de la narration dans cette zone secondaire sans trop alourdir notre charge de travail. Le domaine étant isolé du village de l'île, nous ne voulions pas d'habitations ici. J'ai donc ajouté une zone touristique près de la villa abandonnée, avec des habitations troglodytes.",
                      en: "I searched for a way to add storytelling in this secondary area without bringing us too much more work. The property is secluded from the village of the island, we didn’t want dwellings here. So I added a touristic area near the abandoned villa with troglodytes."
                    },
                    views: [
                      { ld: "07-tourist-area-ld1.webp", final: "07-tourist-area-final1.webp" },
                      { ld: "07-tourist-area-ld2.webp", final: "07-tourist-area-final2.webp" }
                    ],
                    references: [
                      { src: "references/tourist-area-ref1.webp", caption: { fr: "Référence 1", en: "Reference 1" } }
                    ]
                  },
                  {
                    x: 67.2, y: 69.8,
                    title: { fr: "Landmark - 3e récompense", en: "Landmark - 3rd reward" },
                    caption: {
                      fr: "Troisième point de vue, encadré par l'environnement pour mettre en valeur la destination et permettre au joueur de se repérer dans le niveau.",
                      en: "A third viewpoint, framed by the environment to highlight the destination and help the player find their bearings in the level."
                    },
                    ld: "08-landmark-ld.webp",
                    final: "08-landmark-final.webp",
                    references: [
                      { src: "references/path-ref4.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/domaine-ref4.webp", caption: { fr: "Référence 2", en: "Reference 2" } }
                    ]
                  },
                  {
                    x: 59.4, y: 71.1,
                    title: { fr: "Panorama", en: "Panoramic view" },
                    caption: {
                      fr: "Vue dégagée sur le domaine de la villa pour récompenser le joueur.",
                      en: "An open view over the villa's estate to reward the player."
                    },
                    views: [
                      { ld: "09-panoramic-view-ld1.webp", final: "09-panoramic-view-final1.webp" },
                      { ld: "09-panoramic-view-ld2.webp", final: "09-panoramic-view-final2.webp" }
                    ],
                    references: [
                      { src: "references/domaine-ref3.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/domaine-ref5.webp", caption: { fr: "Référence 2", en: "Reference 2" } },
                      { src: "references/view-ref1.webp", caption: { fr: "Référence 3", en: "Reference 3" } },
                      { src: "references/cliffs-ref2.webp", caption: { fr: "Référence 4", en: "Reference 4" } }
                    ]
                  },
                  {
                    x: 60.0, y: 52.1,
                    title: { fr: "Grotte", en: "Cave" },
                    caption: {
                      fr: "Vue dégagée sur le domaine de la villa pour récompenser le joueur.",
                      en: "I searched for a way to add storytelling in this secondary area without bringing us too much more work. The property is secluded from the village of the island, we didn’t want dwellings here. So I added a touristic area near the abandonned villa with troglodytes."
                    },
                    views: [
                      { ld: "10-cave-ld1.webp", final: "10-cave-final1.webp" },
                      { ld: "10-cave-ld2.webp", final: "10-cave-final2.webp" },
                      { ld: "10-cave-ld3.webp", final: "10-cave-final3.webp" }
                    ],
                    references: [
                      { src: "references/path-ref3.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/path-ref4.webp", caption: { fr: "Référence 2", en: "Reference 2" } }
                    ]
                  },
                  {
                    x: 49.8, y: 49.0,
                    title: { fr: "Atelier", en: "Shed" },
                    caption: {
                      fr: "Vue dégagée sur le domaine de la villa pour récompenser le joueur.",
                      en: "I searched for a way to add storytelling in this secondary area without bringing us too much more work. The property is secluded from the village of the island, we didn’t want dwellings here. So I added a touristic area near the abandonned villa with troglodytes."
                    },
                    views: [
                      { ld: "11-shed-ld1.webp", final: "11-shed-final1.webp" },
                      { ld: "11-shed-ld2.webp", final: "11-shed-final2.webp" },
                      { ld: "11-shed-ld3.webp", final: "11-shed-final3.webp" }
                    ],
                    references: [
                      { src: "references/domaine-ref3.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/domaine-ref5.webp", caption: { fr: "Référence 2", en: "Reference 2" } },
                      { src: "references/view-ref1.webp", caption: { fr: "Référence 3", en: "Reference 3" } },
                      { src: "references/cliffs-ref2.webp", caption: { fr: "Référence 4", en: "Reference 4" } }
                    ]
                  },
                  {
                    x: 43.5, y: 52.5,
                    title: { fr: "Pergola", en: "Pergola" },
                    caption: {
                      fr: "Vue dégagée sur le domaine de la villa pour récompenser le joueur.",
                      en: "I searched for a way to add storytelling in this secondary area without bringing us too much more work. The property is secluded from the village of the island, we didn’t want dwellings here. So I added a touristic area near the abandonned villa with troglodytes."
                    },
                    views: [
                      { ld: "12-pergola-ld1.webp", final: "12-pergola-final1.webp" },
                      { ld: "12-pergola-ld2.webp", final: "12-pergola-final2.webp" }
                    ],
                    references: [
                      { src: "references/vegetation-tunnel-ref1.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/vegetation-tunnel-ref2.webp", caption: { fr: "Référence 2", en: "Reference 2" } },
                      { src: "references/vegetation-tunnel-ref3.webp", caption: { fr: "Référence 3", en: "Reference 3" } }
                    ]
                  },
                  {
                    x: 39.1, y: 36.6,
                    title: { fr: "Cour principale", en: "Main courtyard" },
                    caption: {
                      fr: "Vue dégagée sur le domaine de la villa pour récompenser le joueur.",
                      en: "I searched for a way to add storytelling in this secondary area without bringing us too much more work. The property is secluded from the village of the island, we didn’t want dwellings here. So I added a touristic area near the abandonned villa with troglodytes."
                    },
                    views: [
                      { ld: "13-main-courtyard-ld1.webp", final: "13-main-courtyard-final1.webp" },
                      { ld: "13-main-courtyard-ld2.webp", final: "13-main-courtyard-final2.webp" },
                      { ld: "13-main-courtyard-ld3.webp", final: "13-main-courtyard-final3.webp" }
                    ],
                    references: [
                      { src: "references/domaine-ref3.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/domaine-ref2.webp", caption: { fr: "Référence 2", en: "Reference 2" } },
                      { src: "references/tower-ref1.webp", caption: { fr: "Référence 3", en: "Reference 3" } },
                      { src: "references/tower-ref2.webp", caption: { fr: "Référence 4", en: "Reference 4" } }
                    ]
                  },
                  {
                    x: 25.9, y: 52.7,
                    title: { fr: "Jardin des statues", en: "Statue garden" },
                    caption: {
                      fr: "Vue dégagée sur le domaine de la villa pour récompenser le joueur.",
                      en: "I searched for a way to add storytelling in this secondary area without bringing us too much more work. The property is secluded from the village of the island, we didn’t want dwellings here. So I added a touristic area near the abandonned villa with troglodytes."
                    },
                    views: [
                      { ld: "14-statue-garden-ld1.webp", final: "14-statue-garden-final1.webp" },
                      { ld: "14-statue-garden-ld2.webp", final: "14-statue-garden-final2.webp" },
                      { ld: "14-statue-garden-ld3.webp", final: "14-statue-garden-final3.webp" }
                    ],
                    references: [
                      { src: "references/garden-ref2.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/domaine-ref6.webp", caption: { fr: "Référence 2", en: "Reference 2" } },
                      { src: "references/garden-ref4.webp", caption: { fr: "Référence 3", en: "Reference 3" } }
                    ]
                  },
                  {
                    x: 14.7, y: 55.5,
                    title: { fr: "Pavillon", en: "Pavilion" },
                    caption: {
                      fr: "Vue dégagée sur le domaine de la villa pour récompenser le joueur.",
                      en: "I searched for a way to add storytelling in this secondary area without bringing us too much more work. The property is secluded from the village of the island, we didn’t want dwellings here. So I added a touristic area near the abandonned villa with troglodytes."
                    },
                    views: [
                      { ld: "15-pavilion-ld1.webp", final: "15-pavilion-final1.webp" }
                    ],
                    references: [
                      { src: "references/domaine-ref3.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/domaine-ref5.webp", caption: { fr: "Référence 2", en: "Reference 2" } }
                    ]
                  },
                  {
                    x: 10.7, y: 34.4,
                    title: { fr: "Piscine et jardin", en: "Pool and garden" },
                    caption: {
                      fr: "Vue dégagée sur le domaine de la villa pour récompenser le joueur.",
                      en: "I searched for a way to add storytelling in this secondary area without bringing us too much more work. The property is secluded from the village of the island, we didn’t want dwellings here. So I added a touristic area near the abandonned villa with troglodytes."
                    },
                    views: [
                      { ld: "16-pool-garden-ld1.webp", final: "16-pool-garden-final1.webp" },
                      { ld: "16-pool-garden-ld2.webp", final: "16-pool-garden-final2.webp" },
                      { ld: "16-pool-garden-ld3.webp", final: "16-pool-garden-final3.webp" },
                      { ld: "16-pool-garden-ld4.webp", final: "16-pool-garden-final4.webp" }
                    ],
                    references: [
                      { src: "references/domaine-ref2.webp", caption: { fr: "Référence 1", en: "Reference 1" } },
                      { src: "references/domaine-ref5.webp", caption: { fr: "Référence 2", en: "Reference 2" } },
                      { src: "references/pool-ref.webp", caption: { fr: "Référence 3", en: "Reference 3" } },
                      { src: "references/garden-ref3.webp", caption: { fr: "Référence 4", en: "Reference 4" } }
                    ]
                  }
                ]
              },
              {
                type: "text",
                fr: "Landmark : Sur l'ensemble du niveau, j'ai voulu teaser la destination finale en jouant sur une alternance de frustration et de récompense tout au long du parcours, grâce à la tour qui sert de landmark pour indiquer la destination au joueur, en utilisant le principe de déni et de récompense tout le long du chemin. J'ai également exploité la verticalité de l'environnement rendre la marche plus dynamique et pour renforcer la composition, encadrer la tour avec les environnements et lumières pour influencer et diriger le joueur.",
                en: "Pacing: In a walking sim, the player can easily lose interest when nothing happens, so I had to find ways to keep exploration engaging and interactive. I approached this by thinking about how the environment itself could capture the player's attention, spark curiosity, and sustain engagement through a set of triggered events, including:"
              },
              { type: "carousel", items: [], caption: { fr: "Images de level design", en: "Level design images" } },
              { type: "video", src: "", caption: { fr: "Vidéo de level design", en: "Level design video" } },
              { type: "gif", src: "", caption: { fr: "Gif du process", en: "Process gif" } },
              { type: "gallery", items: [], caption: { fr: "Images finales in-game", en: "Final in-game images" } },
              { type: "sketches", items: [], label: { fr: "Croquis papier", en: "Paper sketches" } }
            ]
          },
          {
            id: "ld-interieur-villa",
            nav: { fr: "Intérieur de la villa", en: "Villa interior" },
            tags: {
              fr: ["Non aboutie", "Prototype", "Abandonnée en cours de production"],
              en: ["Unfinished", "Prototype", "Cut during production"]
            },
            blocks: [
              {
                type: "text",
                fr: "[Explique ici ce qui était prévu pour l'intérieur de la villa, où le travail s'est arrêté, et pourquoi (contraintes de temps, choix de production, etc.).]",
                en: "[Explain here what was planned for the villa interior, where the work stopped, and why (time constraints, production choices, etc.).]"
              },
              { type: "image", src: "05.svg", caption: { fr: "", en: "" } }
            ]
          }
        ]
      },

      /* -------------------------------------------------------------- */
      {
        id: "lead",
        nav: { fr: "Lead", en: "Lead" },
        blocks: [
          {
            type: "text",
            fr: "[Rôle de lead : décris tes responsabilités (organisation, suivi, arbitrages, communication avec l'équipe), les outils utilisés et un exemple concret de décision que tu as prise.]",
            en: "[Lead role: describe your responsibilities (organisation, tracking, decisions, communication with the team), the tools you used, and a concrete example of a decision you made.]"
          }
        ]
      },

      /* -------------------------------------------------------------- */
      {
        id: "autres",
        nav: { fr: "Autres", en: "Other" },
        blocks: [
          {
            type: "text",
            fr: "[Autres tâches : liste ici les autres casquettes portées sur le projet (narration, son, intégration, tests, etc.) en dehors du level design et du lead.]",
            en: "[Other tasks: list here any other roles you took on the project (narrative, sound, integration, testing, etc.) besides level design and lead.]"
          }
        ]
      }

    ]
  },

  {
    slug: "horror-game",
    featured: false,
    cover: "assets/projects/horror-game/cover.svg",
    coverVideo: "",
    year: "2025",
    engine: "Unreal Engine 5",
    role: { fr: "Level Designer", en: "Level Designer" },
    title: { fr: "Horror Game", en: "Horror Game" },
    tags: {
      fr: ["Solo", "Horreur", "Level Design"],
      en: ["Solo", "Horror", "Level Design"]
    },
    summary: {
      fr: "Niveau solo d'horreur : gestion du rythme, de la tension et de la peur par l'espace.",
      en: "Solo horror level: pacing, tension and fear crafted through space."
    },
    links: [
      { label: "ArtStation", url: "https://www.artstation.com/artwork/RKeywe" }
    ],
    blocks: [
      {
        type: "text",
        fr: "Conception d'un niveau de jeu d'horreur pensé pour installer une tension progressive : lignes de vue restreintes, éclairage dramatique et rythme de découverte contrôlé.",
        en: "Design of a horror game level built to create rising tension: restricted sightlines, dramatic lighting and a controlled pace of discovery."
      },
      { type: "image", src: "01.svg", caption: { fr: "", en: "" } }
    ]
  }

];
