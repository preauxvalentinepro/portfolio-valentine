# Portfolio — Valentine Préaux

Site statique (HTML / CSS / JS, sans build, sans dépendances) : header avec nom, CV, contacts,
un hero en vidéo (showreel) avec mini-présentation, une galerie de projets, des pages projet
avec texte/photo/vidéo/gif, et un switch de langue FR / EN.

## Voir le site en local

Ouvrir simplement `index.html` dans un navigateur fonctionne dans la plupart des cas.
Si les vidéos ne se chargent pas correctement en double-cliquant sur le fichier, lance un
petit serveur local (aucune installation nécessaire si tu as déjà Python) :

```bash
python -m http.server 8000
```

puis va sur `http://localhost:8000`.

## Structure

```
index.html              → page d'accueil (header + hero + galerie LD)
project.html             → page projet LD générique (le contenu vient de projects.js)
qa.html                  → page "QA Testeuse" (le contenu vient de qa-data.js)
css/style.css            → tout le design (couleurs, polices, mise en page)
js/projects.js           → ★ à modifier pour ajouter/éditer un projet de Level Design
js/qa-data.js             → ★ à modifier pour ajouter/éditer un jeu testé chez Microids
js/i18n.js                → textes fixes du site (hors contenu projet/QA) + logique FR/EN
js/main.js                → construit la galerie sur la page d'accueil
js/project-page.js        → construit une page projet LD
js/qa-page.js              → construit la page QA
assets/video/showreel.mp4 → ta vidéo de showreel (à remplacer)
assets/img/hero-poster.*  → image affichée avant que la vidéo ne charge
assets/cv/                → ton CV en PDF (à remplacer)
assets/projects/<slug>/   → médias de chaque projet LD
assets/qa/<slug>/          → jaquette de chaque jeu testé (page QA)
```

## Couleurs

Tout se règle avec la variable `--accent` en haut de `css/style.css` (vert citron,
seule couleur d'accent du site : boutons, liens, prénom, badge). Change juste
cette valeur pour ajuster la palette de tout le site.

## Ajouter un jeu testé (page QA)

1. Mets une image dans `assets/qa/<slug>/cover.jpg` (n'importe quel format/ratio
   fonctionne, elle est automatiquement recadrée en carte portrait).
2. Ouvre `js/qa-data.js` : copie un objet existant dans `QA_CATEGORIES[...].games`,
   colle-le dans la bonne catégorie ("published" ou "indie"), et adapte `slug`,
   `name` et `genre` (en FR et EN).
3. Enregistre — le jeu apparaît automatiquement sur `qa.html`.

Les jaquettes actuelles viennent des pages Steam/Microids officielles de chaque jeu
(key art / library art). Remplace-les par tes propres visuels si tu préfères
(captures perso, presskit Microids...) : il suffit d'écraser le fichier
`assets/qa/<slug>/cover.*` en gardant le même nom.

## Ajouter un projet

1. Crée un dossier `assets/projects/<slug-du-projet>/` et mets-y tes fichiers
   (cover, images, vidéos, gifs).
2. Ouvre `js/projects.js` : copie un des objets existants dans le tableau `PROJECTS`,
   colle-le, change le `slug`, le `title`, les `tags`, le `cover`, et le contenu de
   `blocks` (texte, image, vidéo, gif, ou une rangée de 3 images). Pour les médias
   des `blocks`, indique juste le nom du fichier (ex: `"01.jpg"`) — il est cherché
   automatiquement dans `assets/projects/<slug>/`. Seul `cover` prend le chemin complet
   (ex: `"assets/projects/<slug>/cover.jpg"`).
3. Enregistre. Le projet apparaît automatiquement dans la galerie et a sa propre page
   à l'adresse `project.html?slug=<slug-du-projet>` — pas besoin de créer de fichier HTML.

Chaque texte (titre, tags, description...) se remplit en deux langues :
`{ fr: "...", en: "..." }`. Le bouton FR/EN en haut à droite du site bascule
automatiquement tous les textes, y compris ceux des projets.

## Remplacer les placeholders

Pour l'instant, les images/vidéos sont des placeholders (fonds sombres avec texte).
À remplacer :

- `assets/video/showreel.mp4` — ta vidéo de showreel (montage de plusieurs projets).
  Garde-la légère (quelques dizaines de Mo max, format .mp4, silencieuse ou avec le
  son coupé puisqu'elle joue en boucle automatiquement).
- `assets/img/hero-poster.svg` — remplace-la par une image (jpg/png) et adapte le
  `poster="..."` dans `index.html` (section `.hero-media`).
- `assets/cv/CV_Valentine_Preaux.pdf` — ton vrai CV (garde le même nom de fichier,
  ou change-le aussi dans `index.html` et `project.html`, à l'endroit `href="assets/cv/..."`).
- `assets/projects/.../cover.svg`, `01.svg`, etc. — tes vraies images/gifs, en
  mettant à jour les chemins correspondants dans `js/projects.js`.

## Coordonnées

Modifiables dans `index.html` et `project.html` (header + footer) :
- Email : `preauxvalentine.pro@gmail.com`
- Téléphone : `+33 7 82 41 55 44`
- LinkedIn : `https://www.linkedin.com/in/valentinepreaux/`

## Mettre le site en ligne (gratuit)

Le site est 100% statique, donc n'importe quel hébergement gratuit fonctionne :

- **Netlify / Vercel** : glisser-déposer le dossier du site sur leur interface.
- **GitHub Pages** : pousser le dossier dans un dépôt GitHub, activer "Pages"
  dans les réglages du dépôt.

Aucune étape de build n'est nécessaire — c'est du HTML/CSS/JS pur.
