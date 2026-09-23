/* ============================================================================
   PROJECT-PAGE.JS — construit project.html à partir du paramètre ?slug=
   et des données de js/projects.js.
   ============================================================================ */

function getSlug() {
  return new URLSearchParams(window.location.search).get("slug");
}

/* Texte affiché quand un bloc média n'a pas encore de fichier (src/items
   vide) : un emplacement pointillé plutôt que rien du tout, pour préparer
   la mise en page avant d'avoir les vrais fichiers. */
const SLOT_LABELS = {
  image:    { fr: "Emplacement image",    en: "Image slot" },
  video:    { fr: "Emplacement vidéo",    en: "Video slot" },
  gif:      { fr: "Emplacement gif",      en: "Gif slot" },
  carousel: { fr: "Emplacement carrousel — plusieurs images", en: "Carousel slot — several images" },
  gallery:  { fr: "Emplacement galerie",  en: "Gallery slot" },
  sketches: { fr: "Croquis papier",       en: "Paper sketches" },
  ld:       { fr: "Emplacement LD",       en: "LD slot" },
  final:    { fr: "Emplacement rendu final", en: "Final render slot" }
};

/* Registre des cartes interactives ("interactive-map") de la page courante :
   rempli pendant le rendu des blocs (blockHTML), lu ensuite par
   setupInteractiveMaps() une fois le HTML inséré dans le DOM. Réinitialisé
   à chaque appel de renderProject() (voir plus bas). */
let mapRegistry = {};
let mapCounter = 0;

/* Références de la zone actuellement ouverte dans la pop-up, pour que les
   flèches du visualiseur (voir ensureMapModal) puissent naviguer entre
   elles comme un petit carrousel. */
let mapRefsCache = [];

/* Plans (paires LD/final) du point actuellement ouvert dans la pop-up — un
   point normal n'en a qu'un seul ; "views" dans projects.js en ajoute
   d'autres, parcourus avec les flèches du comparateur (voir showMapView). */
let mapViewsCache = [];
let mapViewIndex = 0;

/* Points de la carte dont la pop-up est ouverte + index du point affiché,
   pour passer d'un point à l'autre avec les grandes flèches placées sur
   les côtés de la fenêtre (en dehors de la pop-up). */
let mapSpotsCache = [];
let mapSpotIndex = 0;

function emptySlotHTML(text) {
  return `<div class="block-slot"><span>${text}</span></div>`;
}

/* block.src / block.poster / items : toujours de simples noms de fichiers,
   résolus dans le dossier du projet (assets/projects/<slug>/). Laisser src
   (ou items) vide affiche un emplacement pointillé à la place du média. */
function blockHTML(block, dir) {
  const slotLabel = (type) => (block.caption && tr(block.caption)) || tr(SLOT_LABELS[type]);

  switch (block.type) {
    case "text":
      return `<p class="block-text">${tr({ fr: block.fr, en: block.en })}</p>`;

    case "heading":
      return `<h3 class="block-heading">${tr({ fr: block.fr, en: block.en })}</h3>`;

    case "image":
      if (!block.src) return emptySlotHTML(slotLabel("image"));
      return `
        <figure class="block-media">
          <img src="${dir}${block.src}" alt="">
        </figure>
        ${block.caption && tr(block.caption) ? `<div class="block-caption">${tr(block.caption)}</div>` : ""}
      `;

    case "gif":
      if (!block.src) return emptySlotHTML(slotLabel("gif"));
      return `
        <figure class="block-media">
          <img src="${dir}${block.src}" alt="">
        </figure>
        ${block.caption && tr(block.caption) ? `<div class="block-caption">${tr(block.caption)}</div>` : ""}
      `;

    case "video":
      if (!block.src) return emptySlotHTML(slotLabel("video"));
      return `
        <figure class="block-media">
          <video src="${dir}${block.src}" ${block.poster ? `poster="${dir}${block.poster}"` : ""} controls playsinline></video>
        </figure>
        ${block.caption && tr(block.caption) ? `<div class="block-caption">${tr(block.caption)}</div>` : ""}
      `;

    case "images-row":
      return `
        <div class="block-row">
          ${(block.items || []).map((src) => `<div class="block-media"><img src="${dir}${src}" alt=""></div>`).join("")}
        </div>
      `;

    case "carousel": {
      const items = block.items || [];
      if (!items.length) return emptySlotHTML(slotLabel("carousel"));
      return `
        <div class="block-carousel" data-carousel>
          <div class="carousel-track">
            ${items.map((src) => `<div class="carousel-item"><img src="${dir}${src}" alt=""></div>`).join("")}
          </div>
          ${items.length > 1 ? `
            <button type="button" class="carousel-btn carousel-prev" aria-label="Précédent">‹</button>
            <button type="button" class="carousel-btn carousel-next" aria-label="Suivant">›</button>
            <div class="carousel-dots">
              ${items.map((_, i) => `<span class="carousel-dot${i === 0 ? " is-active" : ""}"></span>`).join("")}
            </div>
          ` : ""}
        </div>
        ${block.caption && tr(block.caption) ? `<div class="block-caption">${tr(block.caption)}</div>` : ""}
      `;
    }

    case "gallery": {
      const items = block.items || [];
      if (!items.length) return emptySlotHTML(slotLabel("gallery"));
      return `
        <div class="block-gallery">
          ${items.map((src) => `<div class="gallery-item"><img src="${dir}${src}" alt=""></div>`).join("")}
        </div>
        ${block.caption && tr(block.caption) ? `<div class="block-caption">${tr(block.caption)}</div>` : ""}
      `;
    }

    /* Petite galerie à survoler : chaque image révèle un titre (et une
       description optionnelle) au survol — utilisée pour les concepts/key
       art et les références. items: [{ src, title:{fr,en}, desc:{fr,en} }] */
    case "hover-gallery": {
      const items = block.items || [];
      if (!items.length) return emptySlotHTML(slotLabel("gallery"));
      return `
        <div class="hover-gallery">
          ${items.map((it) => {
            const title = it.title ? tr(it.title) : "";
            const desc = it.desc ? tr(it.desc) : "";
            if (!it.src) {
              return `<div class="hover-gallery-item">${emptySlotHTML(title || tr(SLOT_LABELS.gallery))}</div>`;
            }
            return `
              <div class="hover-gallery-item" tabindex="0">
                <img src="${dir}${it.src}" alt="${title}">
                <div class="hover-gallery-caption">
                  ${title ? `<div class="hover-gallery-title">${title}</div>` : ""}
                  ${desc ? `<div class="hover-gallery-desc">${desc}</div>` : ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>
        ${block.caption && tr(block.caption) ? `<div class="block-caption">${tr(block.caption)}</div>` : ""}
      `;
    }

    case "sketches": {
      const items = block.items || [];
      const label = (block.label && tr(block.label)) || tr(SLOT_LABELS.sketches);
      return `
        <details class="block-sketches">
          <summary>${label}</summary>
          <div class="block-gallery block-gallery--sm">
            ${items.length
              ? items.map((src) => `<div class="gallery-item"><img src="${dir}${src}" alt=""></div>`).join("")
              : emptySlotHTML(tr({ fr: "Emplacement croquis", en: "Sketches slot" }))}
          </div>
        </details>
      `;
    }

    /* Carte de niveau cliquable : chaque point ouvre une pop-up avec un
       slider avant/après (blockout LD ↔ rendu final). Voir le commentaire
       en tête de js/projects.js pour le format de "spots". */
    case "interactive-map": {
      if (!block.src) return emptySlotHTML(slotLabel("image"));
      const spots = block.spots || [];
      const id = `map-${++mapCounter}`;

      mapRegistry[id] = spots.map((s, i) => {
        /* "views" (optionnel) : plusieurs plans LD/final pour le même point,
           parcourus avec des flèches. Sans "views", on retombe sur le
           couple ld/final unique posé directement sur le spot (comme
           avant) — un point sans "views" n'affiche donc aucune flèche. */
        const rawViews = (s.views && s.views.length) ? s.views : [{ ld: s.ld, final: s.final }];
        return {
          num: i + 1,
          x: s.x,
          y: s.y,
          curve: s.curve || null,
          title: tr(s.title) || "",
          caption: tr(s.caption) || "",
          views: rawViews.map((v) => ({
            ld: v.ld ? `${dir}${v.ld}` : "",
            final: v.final ? `${dir}${v.final}` : ""
          })),
          references: (s.references || []).map((r) => {
            const ref = typeof r === "string" ? { src: r } : r;
            return { src: `${dir}${ref.src}`, caption: (ref.caption && tr(ref.caption)) || "" };
          })
        };
      });

      /* Le chiffre du pin = position dans le tableau "spots" = ordre de
         progression du joueur dans le niveau (le 1er point traversé = 1). */
      const pinsHTML = spots.map((s, i) => `
        <button type="button" class="map-pin" style="left:${s.x}%;top:${s.y}%"
          data-map-id="${id}" data-spot-index="${i}" aria-label="${(tr(s.title) || "").replace(/"/g, "&quot;")}">
          <span class="map-pin-ring"></span>
          <span class="map-pin-dot">${i + 1}</span>
          <span class="map-pin-label">${i + 1}. ${tr(s.title) || ""}</span>
        </button>
      `).join("");

      return `
        <div class="block-interactive-map">
          <div class="map-frame" data-map-frame data-map-id="${id}">
            <img src="${dir}${block.src}" alt="">
            ${pinsHTML}
          </div>
          ${block.caption && tr(block.caption) ? `<div class="block-caption">${tr(block.caption)}</div>` : ""}
          <div class="map-toolbar" data-map-toolbar hidden>
            <button type="button" class="map-calib-btn" data-map-calib>◎ Mode calibrage</button>
            <button type="button" class="map-calib-btn" data-map-routes>⤳ Mode flèches</button>
            <span class="map-calib-hint" data-map-hint></span>
          </div>
        </div>
      `;
    }

    default:
      return "";
  }
}

/* Tags d'une sous-section (ex: caractéristiques d'une map de Level Design). */
function subTagsHTML(tagsObj) {
  const tags = tagsObj && tr(tagsObj);
  if (!Array.isArray(tags) || !tags.length) return "";
  return `<div class="subsection-tags">${tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>`;
}

function sectionBlocksHTML(blocks, dir) {
  if (!blocks || !blocks.length) return "";
  return `<div class="section-blocks">${blocks.map((b) => blockHTML(b, dir)).join("")}</div>`;
}

/* Construit le mini-menu persistant + le contenu, pour les projets qui
   utilisent "sections" (voir js/projects.js) au lieu de "blocks". */
function buildSectionsMarkup(project, dir) {
  const sections = project.sections || [];

  const navHTML = sections.map((sec) => {
    const subnav = (sec.subsections && sec.subsections.length)
      ? `<div class="subnav-sub">${sec.subsections.map((sub) => `
          <a class="subnav-sublink" href="#${sub.id}" data-navtarget="${sub.id}">${tr(sub.nav)}</a>
        `).join("")}</div>`
      : "";
    return `
      <div class="subnav-group">
        <a class="subnav-link" href="#${sec.id}" data-navtarget="${sec.id}">${tr(sec.nav)}</a>
        ${subnav}
      </div>
    `;
  }).join("");

  const bodyHTML = sections.map((sec) => {
    const subsHTML = (sec.subsections && sec.subsections.length)
      ? sec.subsections.map((sub) => `
          <div class="project-subsection" id="${sub.id}">
            <h3>${tr(sub.nav)}</h3>
            ${subTagsHTML(sub.tags)}
            ${sectionBlocksHTML(sub.blocks, dir)}
          </div>
        `).join("")
      : "";
    return `
      <section class="project-section" id="${sec.id}">
        <h2>${tr(sec.nav)}</h2>
        ${sectionBlocksHTML(sec.blocks, dir)}
        ${subsHTML}
      </section>
    `;
  }).join("");

  return { navHTML, bodyHTML };
}

/* Bas de page : bande-annonce/gameplay YouTube (discret, optionnel) + bouton
   de téléchargement (itch.io...) + liens externes (ArtStation...) + vidéo
   complète en fichier local (optionnelle). Ces champs sont optionnels sur un
   projet : voir "download" / "trailer" / "fullVideo" / "links" dans
   js/projects.js. */
function extrasHTML(project) {
  const parts = [];

  if (project.trailer && project.trailer.url) {
    parts.push(`
      <div class="project-extra">
        <div class="footer-title">${(project.trailer.caption && tr(project.trailer.caption)) || tr(STRINGS["project.trailer"])}</div>
        <div class="project-video">
          <iframe src="${project.trailer.url}" title="${tr(project.title)}" loading="lazy" allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
        </div>
      </div>
    `);
  }

  const ctas = [];
  if (project.download && project.download.url) {
    ctas.push(`<a class="btn btn-accent" href="${project.download.url}" target="_blank" rel="noopener">${tr(project.download.label)}</a>`);
  }
  (project.links || []).forEach((l) => {
    ctas.push(`<a class="btn" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`);
  });
  if (ctas.length) {
    parts.push(`
      <div>
        <div class="footer-title">${tr(STRINGS["project.links"])}</div>
        <div class="project-links">${ctas.join("")}</div>
      </div>
    `);
  }

  if (project.fullVideo && project.fullVideo.src) {
    const dir = `assets/projects/${project.slug}/`;
    const fv = project.fullVideo;
    parts.push(`
      <div class="project-extra project-extra--fullvideo" id="full-video">
        <div class="footer-title">${(fv.caption && tr(fv.caption)) || tr(STRINGS["project.watchFull"])}</div>
        <figure class="block-media">
          <video src="${dir}${fv.src}" ${fv.poster ? `poster="${dir}${fv.poster}"` : ""} controls playsinline></video>
        </figure>
      </div>
    `);
  }

  return parts.join("");
}

/* Bouton en haut de page qui renvoie vers la vidéo complète en bas (si
   "fullVideo" est renseigné sur le projet — voir js/projects.js). */
function jumpToVideoHTML(project) {
  if (!project.fullVideo || !project.fullVideo.src) return "";
  return `<a class="btn" href="#full-video">${tr(STRINGS["project.watchFull"])}</a>`;
}

/* Fond du hero (haut de page) : vidéo si "coverVideo" est renseigné, sinon
   l'image "cover" — même logique que le showreel de la page d'accueil. */
function heroMediaHTML(project) {
  if (project.coverVideo) {
    return `<video src="${project.coverVideo}" muted loop playsinline autoplay poster="${project.cover}"></video>`;
  }
  return `<img src="${project.cover}" alt="${tr(project.title)}">`;
}

/* Surligne l'onglet correspondant à la section actuellement lue. */
let scrollSpyObserver = null;
function setupScrollSpy() {
  if (scrollSpyObserver) scrollSpyObserver.disconnect();

  const links = Array.from(document.querySelectorAll("#p-subnav [data-navtarget]"));
  const targets = links
    .map((link) => document.getElementById(link.dataset.navtarget))
    .filter(Boolean);
  if (!links.length || !targets.length) return;

  const setActive = (id) => {
    links.forEach((l) => l.classList.toggle("is-active", l.dataset.navtarget === id));
  };

  scrollSpyObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting);
    if (!visible.length) return;
    visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    setActive(visible[0].target.id);
  }, { rootMargin: "-150px 0px -65% 0px", threshold: 0 });

  targets.forEach((t) => scrollSpyObserver.observe(t));
  setActive(targets[0].id);
}

/* Branche les flèches et les points de tous les blocs "carousel" présents
   sur la page (une map peut en avoir un, il peut y en avoir plusieurs). */
function setupCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
    const prev = carousel.querySelector(".carousel-prev");
    const next = carousel.querySelector(".carousel-next");
    if (!track) return;

    const setActiveDot = () => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    };

    if (prev) prev.addEventListener("click", () => track.scrollBy({ left: -track.clientWidth, behavior: "smooth" }));
    if (next) next.addEventListener("click", () => track.scrollBy({ left: track.clientWidth, behavior: "smooth" }));
    dots.forEach((dot, i) => dot.addEventListener("click", () => track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" })));

    let scrollTimeout;
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(setActiveDot, 80);
    });
  });
}

/* Construit (une seule fois) la pop-up partagée par toutes les cartes
   interactives de la page, avec son slider avant/après LD ↔ rendu final. */
function ensureMapModal() {
  let modal = document.getElementById("map-modal-backdrop");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "map-modal-backdrop";
  modal.className = "map-modal-backdrop";
  modal.hidden = true;
  modal.innerHTML = `
    <button type="button" class="map-spot-nav map-spot-prev" id="map-spot-prev" aria-label="${tr(STRINGS["project.prevSpot"])}">‹</button>
    <button type="button" class="map-spot-nav map-spot-next" id="map-spot-next" aria-label="${tr(STRINGS["project.nextSpot"])}">›</button>
    <div class="map-modal" role="dialog" aria-modal="true" aria-labelledby="map-modal-title">
      <div class="map-modal-top">
        <h3 class="map-modal-title" id="map-modal-title"></h3>
        <button type="button" class="map-modal-close" aria-label="${tr(STRINGS["project.close"])}">✕</button>
      </div>
      <p class="map-modal-caption" id="map-modal-caption"></p>
      <div class="map-compare" id="map-compare">
        <img class="map-compare-after" id="map-after" alt="">
        <div class="map-compare-slot map-compare-slot--after" id="map-after-slot" hidden></div>
        <div class="map-compare-before-wrap" id="map-before-wrap">
          <img id="map-before" alt="">
          <div class="map-compare-slot map-compare-slot--before" id="map-before-slot" hidden></div>
        </div>
        <div class="map-compare-handle"></div>
        <span class="map-compare-tag map-compare-tag--left">LD</span>
        <span class="map-compare-tag map-compare-tag--right">${tr(STRINGS["project.finalRender"])}</span>
        <input type="range" class="map-compare-range" id="map-slider" min="0" max="100" value="50" aria-label="${tr(STRINGS["project.finalRender"])}">
        <button type="button" class="map-view-nav map-view-prev" id="map-view-prev" aria-label="${tr(STRINGS["project.prevView"])}" hidden>‹</button>
        <button type="button" class="map-view-nav map-view-next" id="map-view-next" aria-label="${tr(STRINGS["project.nextView"])}" hidden>›</button>
        <span class="map-view-counter" id="map-view-counter" hidden></span>
      </div>
      <div class="map-refs" id="map-refs" hidden>
        <div class="map-refs-label">${tr(STRINGS["project.references"])}</div>
        <div class="map-refs-row" id="map-refs-row"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const refLightbox = document.createElement("div");
  refLightbox.id = "map-ref-lightbox";
  refLightbox.className = "map-ref-lightbox";
  refLightbox.hidden = true;
  refLightbox.innerHTML = `
    <button type="button" class="map-ref-nav map-ref-prev" aria-label="Précédent">‹</button>
    <div class="map-ref-lightbox-stage">
      <img id="map-ref-lightbox-img" alt="">
      <div class="map-ref-lightbox-caption" id="map-ref-lightbox-caption"></div>
    </div>
    <button type="button" class="map-ref-nav map-ref-next" aria-label="Suivant">›</button>
  `;
  document.body.appendChild(refLightbox);

  const closeLightbox = () => { refLightbox.hidden = true; };
  refLightbox.addEventListener("click", (e) => { if (e.target === refLightbox) closeLightbox(); });

  /* Affiche la référence à cet index (boucle sur le début/la fin), et
     montre/cache les flèches selon qu'il y a plus d'une référence. */
  const showRef = (index) => {
    const n = mapRefsCache.length;
    if (!n) return;
    const i = ((index % n) + n) % n;
    const item = mapRefsCache[i];
    refLightbox.querySelector("#map-ref-lightbox-img").src = item.src;
    refLightbox.querySelector("#map-ref-lightbox-caption").textContent = item.caption || "";
    refLightbox.dataset.index = i;
    const multi = n > 1;
    refLightbox.querySelector(".map-ref-prev").hidden = !multi;
    refLightbox.querySelector(".map-ref-next").hidden = !multi;
  };
  refLightbox.querySelector(".map-ref-prev").addEventListener("click", (e) => {
    e.stopPropagation();
    showRef(Number(refLightbox.dataset.index || 0) - 1);
  });
  refLightbox.querySelector(".map-ref-next").addEventListener("click", (e) => {
    e.stopPropagation();
    showRef(Number(refLightbox.dataset.index || 0) + 1);
  });

  const closeModal = () => { modal.hidden = true; };
  modal.querySelector(".map-modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (!refLightbox.hidden) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showRef(Number(refLightbox.dataset.index || 0) + 1);
      if (e.key === "ArrowLeft") showRef(Number(refLightbox.dataset.index || 0) - 1);
      return;
    }
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    /* Flèches clavier = point précédent/suivant, sauf quand le slider
       LD/final a le focus (elles servent alors à le déplacer). */
    if (e.target.closest && e.target.closest(".map-compare-range")) return;
    if (e.key === "ArrowRight") showMapSpot(modal, mapSpotIndex + 1);
    if (e.key === "ArrowLeft") showMapSpot(modal, mapSpotIndex - 1);
  });

  modal.querySelector("#map-spot-prev").addEventListener("click", () => showMapSpot(modal, mapSpotIndex - 1));
  modal.querySelector("#map-spot-next").addEventListener("click", () => showMapSpot(modal, mapSpotIndex + 1));

  modal.querySelector("#map-refs-row").addEventListener("click", (e) => {
    const thumb = e.target.closest(".map-ref-thumb");
    if (!thumb) return;
    showRef(Number(thumb.dataset.index));
    refLightbox.hidden = false;
  });

  const slider = modal.querySelector("#map-slider");
  const beforeWrap = modal.querySelector("#map-before-wrap");
  const handle = modal.querySelector(".map-compare-handle");
  slider.addEventListener("input", (e) => {
    beforeWrap.style.width = e.target.value + "%";
    handle.style.left = e.target.value + "%";
  });

  modal.querySelector("#map-view-prev").addEventListener("click", () => showMapView(modal, mapViewIndex - 1));
  modal.querySelector("#map-view-next").addEventListener("click", () => showMapView(modal, mapViewIndex + 1));

  window.addEventListener("resize", () => { if (!modal.hidden) syncMapCompareWidth(modal); });

  return modal;
}

/* Les images "LD" et "finale" doivent être affichées à la largeur PLEINE du
   cadre de comparaison (pas juste celle, plus étroite, de leur wrapper
   masqué) pour que le slider glisse sur une seule et même image continue. */
function syncMapCompareWidth(modal) {
  const compare = modal.querySelector("#map-compare");
  const w = compare.getBoundingClientRect().width + "px";
  modal.querySelector("#map-after").style.width = w;
  modal.querySelector("#map-before").style.width = w;
}

/* Affiche le plan à cet index (boucle sur le début/la fin) : remplit LD +
   final, remet le slider à 50/50, et montre/cache les flèches + le
   compteur selon qu'il y a plus d'un plan pour ce point (voir "views"
   dans js/projects.js). */
function showMapView(modal, index) {
  const n = mapViewsCache.length;
  if (!n) return;
  mapViewIndex = ((index % n) + n) % n;
  const view = mapViewsCache[mapViewIndex];

  const afterImg = modal.querySelector("#map-after");
  const afterSlot = modal.querySelector("#map-after-slot");
  const beforeImg = modal.querySelector("#map-before");
  const beforeSlot = modal.querySelector("#map-before-slot");

  if (view.final) {
    afterImg.src = view.final; afterImg.hidden = false; afterSlot.hidden = true;
  } else {
    afterImg.hidden = true; afterSlot.hidden = false; afterSlot.textContent = tr(SLOT_LABELS.final);
  }
  if (view.ld) {
    beforeImg.src = view.ld; beforeImg.hidden = false; beforeSlot.hidden = true;
  } else {
    beforeImg.hidden = true; beforeSlot.hidden = false; beforeSlot.textContent = tr(SLOT_LABELS.ld);
  }

  const slider = modal.querySelector("#map-slider");
  const beforeWrap = modal.querySelector("#map-before-wrap");
  const handle = modal.querySelector(".map-compare-handle");
  slider.value = 50;
  beforeWrap.style.width = "50%";
  handle.style.left = "50%";

  const multi = n > 1;
  const prevBtn = modal.querySelector("#map-view-prev");
  const nextBtn = modal.querySelector("#map-view-next");
  const counter = modal.querySelector("#map-view-counter");
  prevBtn.hidden = !multi;
  nextBtn.hidden = !multi;
  counter.hidden = !multi;
  if (multi) counter.textContent = (mapViewIndex + 1) + " / " + n;

  requestAnimationFrame(() => syncMapCompareWidth(modal));
}

function openMapModal(spots, index) {
  const modal = ensureMapModal();
  mapSpotsCache = spots;
  const multi = spots.length > 1;
  modal.querySelector("#map-spot-prev").hidden = !multi;
  modal.querySelector("#map-spot-next").hidden = !multi;
  modal.hidden = false;
  showMapSpot(modal, index);
}

/* Affiche le point à cet index dans la pop-up (boucle du dernier au
   premier), avec son numéro devant le titre — même numéro que le pin. */
function showMapSpot(modal, index) {
  const n = mapSpotsCache.length;
  if (!n) return;
  mapSpotIndex = ((index % n) + n) % n;
  const spot = mapSpotsCache[mapSpotIndex];

  modal.querySelector("#map-modal-title").textContent = `${spot.num}. ${spot.title}`;
  modal.querySelector("#map-modal-caption").textContent = spot.caption;

  const refsBlock = modal.querySelector("#map-refs");
  const refsRow = modal.querySelector("#map-refs-row");
  mapRefsCache = spot.references || [];
  if (mapRefsCache.length) {
    refsRow.innerHTML = mapRefsCache.map((r, i) => `
      <button type="button" class="map-ref-thumb" data-index="${i}" ${r.caption ? `title="${r.caption.replace(/"/g, "&quot;")}"` : ""}>
        <img src="${r.src}" alt="${(r.caption || "").replace(/"/g, "&quot;")}">
      </button>
    `).join("");
    refsBlock.hidden = false;
  } else {
    refsRow.innerHTML = "";
    refsBlock.hidden = true;
  }

  mapViewsCache = (spot.views && spot.views.length) ? spot.views : [{ ld: "", final: "" }];
  showMapView(modal, 0);
  modal.querySelector(".map-modal").scrollTop = 0;
}

/* Copie dans le presse-papier (outils de calibrage). La promesse échoue si
   le presse-papier est indisponible : la valeur reste alors juste affichée. */
function copyToClipboard(text) {
  try {
    return navigator.clipboard.writeText(text);
  } catch (err) {
    return Promise.reject(err);
  }
}

/* Trace une fine flèche courbe (Bézier cubique) entre chaque point et le
   suivant, dans l'ordre du tableau "spots". Sans "curve" sur le point de
   départ, la courbure est calculée automatiquement (légère courbe du même
   côté) ; avec curve: { c1: [x, y], c2: [x, y] } (en % de la carte, comme
   x/y) on impose les deux points de contrôle. En mode calibrage, des
   poignées déplaçables apparaissent sur chaque courbe et la ligne "curve"
   à coller dans js/projects.js est copiée au relâchement. */
function setupMapRoute(frame, spots) {
  if (spots.length < 2) return;
  const NS = "http://www.w3.org/2000/svg";
  const PIN_GAP = 16;   // px laissés libres autour de chaque pin
  const HEAD_LEN = 7;   // longueur de la pointe de flèche (px)
  const HEAD_HALF = 3.5;
  const BEND = 0.18;    // courbure auto, en fraction de la longueur du segment

  const make = (tag, cls) => {
    const el = document.createElementNS(NS, tag);
    if (cls) el.setAttribute("class", cls);
    return el;
  };

  const svg = make("svg", "map-route");
  svg.setAttribute("aria-hidden", "true");
  frame.insertBefore(svg, frame.querySelector(".map-pin"));

  const segs = [];
  for (let i = 0; i < spots.length - 1; i++) {
    const seg = {
      from: spots[i],
      to: spots[i + 1],
      line: make("path", "map-route-line"),
      head: make("path", "map-route-head"),
      guide: make("path", "map-route-guide"),
      h1: make("circle", "map-route-handle"),
      h2: make("circle", "map-route-handle")
    };
    seg.h1.setAttribute("r", 6);
    seg.h2.setAttribute("r", 6);
    svg.append(seg.line, seg.head, seg.guide, seg.h1, seg.h2);
    segs.push(seg);
  }

  let W = 0, H = 0;
  const toPx = ([x, y]) => [x * W / 100, y * H / 100];
  const toPct = ([x, y]) => [+(x / W * 100).toFixed(1), +(y / H * 100).toFixed(1)];

  /* Points de contrôle en px : ceux de "curve" s'il y en a, sinon une
     courbe auto décalée perpendiculairement au segment. */
  const controls = (seg) => {
    if (seg.from.curve) return [toPx(seg.from.curve.c1), toPx(seg.from.curve.c2)];
    const [x0, y0] = toPx([seg.from.x, seg.from.y]);
    const [x3, y3] = toPx([seg.to.x, seg.to.y]);
    const dx = x3 - x0, dy = y3 - y0;
    const nx = -dy * BEND, ny = dx * BEND;
    return [[x0 + dx / 3 + nx, y0 + dy / 3 + ny], [x0 + 2 * dx / 3 + nx, y0 + 2 * dy / 3 + ny]];
  };

  const drawSeg = (seg) => {
    const p0 = toPx([seg.from.x, seg.from.y]);
    const p3 = toPx([seg.to.x, seg.to.y]);
    const [c1, c2] = controls(seg);
    const d = `M${p0} C${c1} ${c2} ${p3}`;
    seg.line.setAttribute("d", d);
    seg.guide.setAttribute("d", `M${p0} L${c1} M${p3} L${c2}`);
    seg.h1.setAttribute("cx", c1[0]); seg.h1.setAttribute("cy", c1[1]);
    seg.h2.setAttribute("cx", c2[0]); seg.h2.setAttribute("cy", c2[1]);

    /* On masque le début et la fin de la courbe (sous les pins) avec un
       pointillé "vide / trait / vide", puis on pose la pointe juste avant
       le pin d'arrivée, orientée selon la tangente de la courbe. */
    const L = seg.line.getTotalLength();
    const visible = L - 2 * PIN_GAP - HEAD_LEN + 1;
    if (visible <= 0) {
      seg.line.style.strokeDasharray = "0 " + L;
      seg.head.setAttribute("d", "");
      return;
    }
    seg.line.style.strokeDasharray = `0 ${PIN_GAP} ${visible} ${L}`;
    const tip = seg.line.getPointAtLength(L - PIN_GAP);
    const back = seg.line.getPointAtLength(L - PIN_GAP - 1);
    const len = Math.hypot(tip.x - back.x, tip.y - back.y) || 1;
    const ux = (tip.x - back.x) / len, uy = (tip.y - back.y) / len;
    const bx = tip.x - ux * HEAD_LEN, by = tip.y - uy * HEAD_LEN;
    seg.head.setAttribute("d",
      `M${tip.x},${tip.y} L${bx - uy * HEAD_HALF},${by + ux * HEAD_HALF} L${bx + uy * HEAD_HALF},${by - ux * HEAD_HALF} Z`);
  };

  const draw = () => {
    W = frame.clientWidth;
    H = frame.clientHeight;
    if (!W || !H) return;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    segs.forEach(drawSeg);
  };
  new ResizeObserver(draw).observe(frame);
  frame.querySelector("img").addEventListener("load", draw);
  draw();

  /* Poignées ("Mode flèches" uniquement, voir CSS .is-editing-routes). */
  segs.forEach((seg) => {
    [seg.h1, seg.h2].forEach((handle, which) => {
      handle.addEventListener("pointerdown", (e) => {
        if (!frame.classList.contains("is-editing-routes")) return;
        e.preventDefault();
        e.stopPropagation();
        handle.setPointerCapture(e.pointerId);
        if (!W || !H) draw();
        if (!seg.from.curve) {
          const [c1, c2] = controls(seg);
          seg.from.curve = { c1: toPct(c1), c2: toPct(c2) };
        }
        const rect = frame.getBoundingClientRect();
        const move = (ev) => {
          const pt = toPct([ev.clientX - rect.left, ev.clientY - rect.top]);
          seg.from.curve[which ? "c2" : "c1"] = pt;
          drawSeg(seg);
        };
        const up = () => {
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", up);
          const c = seg.from.curve;
          const text = `curve: { c1: [${c.c1.join(", ")}], c2: [${c.c2.join(", ")}] },`;
          frame.querySelectorAll(".map-calib-mark, .map-calib-badge").forEach((el) => el.remove());
          const badge = document.createElement("div");
          badge.className = "map-calib-badge";
          const [hx, hy] = c[which ? "c2" : "c1"];
          badge.style.left = hx + "%";
          badge.style.top = hy + "%";
          badge.textContent = `Point ${seg.from.num} → ${seg.to.num} : ${text}`;
          frame.appendChild(badge);
          copyToClipboard(text).then(() => { badge.textContent += " (copié)"; }, () => {});
        };
        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", up);
      });
    });
  });
}

/* Branche les points de toutes les cartes interactives présentes sur la
   page, et active le mode calibrage (jamais visible des visiteurs) quand
   l'URL contient "&calibrate=1" — pratique pour trouver les coordonnées
   x/y % d'un nouveau point à ajouter dans js/projects.js. */
function setupInteractiveMaps() {
  const calibrateOn = new URLSearchParams(window.location.search).get("calibrate") === "1";

  document.querySelectorAll("[data-map-frame]").forEach((frame) => {
    const mapId = frame.dataset.mapId;
    const spots = mapRegistry[mapId] || [];

    frame.querySelectorAll(".map-pin").forEach((pin) => {
      pin.addEventListener("click", () => {
        const index = Number(pin.dataset.spotIndex);
        if (spots[index]) openMapModal(spots, index);
      });
    });

    setupMapRoute(frame, spots);

    const toolbar = frame.parentElement.querySelector("[data-map-toolbar]");
    if (!calibrateOn || !toolbar) return;

    toolbar.hidden = false;
    const calibBtn = toolbar.querySelector("[data-map-calib]");
    const routesBtn = toolbar.querySelector("[data-map-routes]");
    const hint = toolbar.querySelector("[data-map-hint]");
    let calibrating = false;

    const clearMarks = () => frame.querySelectorAll(".map-calib-mark, .map-calib-badge").forEach((el) => el.remove());

    /* Deux modes séparés, jamais actifs en même temps : "calibrage" pour
       placer les points (x/y), "flèches" pour retoucher les courbes — dans
       ce dernier, les points ne captent plus les clics, pour pouvoir
       attraper une poignée même quand elle est posée sur un point. */
    const HINTS = {
      calib: "Cliquez sur la carte pour obtenir x / y (copiés dans le presse-papier)",
      routes: "Faites glisser les poignées ; la ligne curve: {...} est copiée au relâchement — à coller sur le point de départ",
      none: ""
    };
    const setMode = (mode) => {
      calibrating = mode === "calib";
      frame.classList.toggle("is-calibrating", calibrating);
      frame.classList.toggle("is-editing-routes", mode === "routes");
      calibBtn.classList.toggle("is-active", calibrating);
      routesBtn.classList.toggle("is-active", mode === "routes");
      hint.textContent = HINTS[mode];
      clearMarks();
    };
    calibBtn.addEventListener("click", () => setMode(calibrating ? "none" : "calib"));
    routesBtn.addEventListener("click", () => setMode(frame.classList.contains("is-editing-routes") ? "none" : "routes"));

    frame.addEventListener("click", (e) => {
      if (!calibrating || e.target.closest(".map-pin, .map-route-handle")) return;
      const rect = frame.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);

      clearMarks();

      const mark = document.createElement("div");
      mark.className = "map-calib-mark";
      mark.style.left = x + "%";
      mark.style.top = y + "%";
      frame.appendChild(mark);

      const badge = document.createElement("div");
      badge.className = "map-calib-badge";
      badge.style.left = x + "%";
      badge.style.top = y + "%";
      const text = `x: ${x}, y: ${y}`;
      badge.textContent = text;
      frame.appendChild(badge);

      copyToClipboard(`x: ${x}, y: ${y},`).then(() => { badge.textContent = text + " (copié)"; }, () => {});
    });
  });
}

function renderProject() {
  mapRegistry = {};
  mapCounter = 0;

  const slug = getSlug();
  const project = PROJECTS.find((p) => p.slug === slug) || PROJECTS[0];
  if (!project) return;

  const dir = `assets/projects/${project.slug}/`;

  document.getElementById("page-title").textContent = `${tr(project.title)} — Valentine Préaux`;
  document.getElementById("p-title").textContent = tr(project.title);
  document.getElementById("p-role").textContent = tr(project.role);
  document.getElementById("p-year").textContent = project.year || "—";
  document.getElementById("p-engine").textContent = project.engine || "—";

  const tags = tr(project.tags) || [];
  document.getElementById("p-tags").innerHTML = (Array.isArray(tags) ? tags : []).map(
    (t) => `<span class="tag">${t}</span>`
  ).join("");

  document.getElementById("p-hero-media").innerHTML = heroMediaHTML(project);

  const ctaEl = document.getElementById("p-cta");
  if (ctaEl) {
    const downloadBtn = (project.download && project.download.url)
      ? `<a class="btn btn-accent" href="${project.download.url}" target="_blank" rel="noopener">${tr(project.download.label)}</a>`
      : "";
    ctaEl.innerHTML = downloadBtn + jumpToVideoHTML(project);
  }

  const extras = extrasHTML(project);

  const subnavEl = document.getElementById("p-subnav");
  const subnavInner = subnavEl ? subnavEl.querySelector(".subnav-inner") : null;

  if (project.sections && project.sections.length) {
    const { navHTML, bodyHTML } = buildSectionsMarkup(project, dir);
    if (subnavInner) subnavInner.innerHTML = navHTML;
    if (subnavEl) subnavEl.hidden = false;
    document.getElementById("p-body").innerHTML = bodyHTML + extras;
    setupScrollSpy();
  } else {
    if (scrollSpyObserver) { scrollSpyObserver.disconnect(); scrollSpyObserver = null; }
    if (subnavEl) subnavEl.hidden = true;
    if (subnavInner) subnavInner.innerHTML = "";
    const bodyParts = (project.blocks || []).map((b) => blockHTML(b, dir)).join("");
    document.getElementById("p-body").innerHTML = `<div class="block-stack">${bodyParts}</div>` + extras;
  }

  setupCarousels();
  setupInteractiveMaps();

  const footerLinks = document.getElementById("footer-project-links");
  if (footerLinks) {
    footerLinks.innerHTML = PROJECTS.map(
      (p) => `<a href="project.html?slug=${encodeURIComponent(p.slug)}">${tr(p.title)}</a>`
    ).join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProject();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

window.onLanguageChange = function () {
  renderProject();
};
