/* ============================================================================
   I18N.JS — textes fixes du site (hors contenu des projets, qui est dans
   projects.js) + logique du switch FR/EN.
   ============================================================================ */

const STRINGS = {
  "nav.work":        { fr: "Projets",        en: "Work" },
  "nav.qa":           { fr: "QA",    en: "QA" },
  "nav.contact":      { fr: "Contact",        en: "Contact" },
  "header.cv":        { fr: "Télécharger le CV", en: "Download Resume" },
  "footer.qaLink":    { fr: "Jeux testés chez Microids", en: "Games tested at Microids" },

  "hero.role":        { fr: "Junior Level Designer", en: "Junior Level Designer" },
  "hero.role2":        { fr: "QA Testeuse", en: "QA Tester" },
  "hero.text": {
    fr: "Après une expérience enrichissante en tant que QA Testeuse chez l'éditeur de jeu Microids, je suis aujourd'hui à la recherche d'un poste en Level Design, et je reste ouverte à d'autres opportunités si mon profil vous semble pertinent.",
    en: "After a rewarding experience as a QA Tester at game publisher Microids, I'm now looking for a Level Design position, and I remain open to other opportunities if my profile fits your needs."
  },
  "hero.showreel":     { fr: "Showreel", en: "Showreel" },
  "hero.scroll":       { fr: "Voir les projets", en: "See the work" },

  "gallery.title":     { fr: "Projets", en: "Projects" },
  "gallery.intro":     { fr: "Une sélection de mes travaux de level design.", en: "A selection of my level design work." },

  "footer.contact":    { fr: "Contact", en: "Contact" },
  "footer.rights":     { fr: "Tous droits réservés.", en: "All rights reserved." },

  "qa.title":          { fr: "Expérience QA", en: "QA Experience" },
  "qa.company":        { fr: "Entreprise", en: "Company" },
  "qa.dates":          { fr: "Période", en: "Period" },

  "project.back":      { fr: "← Tous les projets", en: "← All projects" },
  "project.role":      { fr: "Rôle", en: "Role" },
  "project.year":      { fr: "Année", en: "Year" },
  "project.engine":    { fr: "Moteur", en: "Engine" },
  "project.links":     { fr: "Voir aussi", en: "See also" },
  "project.trailer":   { fr: "Gameplay complet", en: "Full gameplay" },
  "project.watchFull": { fr: "Voir la vidéo complète", en: "Watch the full video" },
  "project.close":     { fr: "Fermer", en: "Close" },
  "project.finalRender": { fr: "Jeu final", en: "Final render" },
  "project.references": { fr: "Références", en: "References" },
  "project.prevView":  { fr: "Plan précédent", en: "Previous view" },
  "project.nextView":  { fr: "Plan suivant", en: "Next view" },
  "project.prevSpot":  { fr: "Point précédent", en: "Previous point" },
  "project.nextSpot":  { fr: "Point suivant", en: "Next point" },

  "lang.switch":       { fr: "EN", en: "FR" }
};

/* Langue courante, mémorisée dans le navigateur */
function getLang() {
  return localStorage.getItem("lang") || "fr";
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
  applyLanguage();
}

function toggleLang() {
  setLang(getLang() === "fr" ? "en" : "fr");
}

/* Traduit une entrée { fr: "...", en: "..." } selon la langue courante */
function tr(entry) {
  if (!entry) return "";
  const lang = getLang();
  return entry[lang] || entry.fr || entry.en || "";
}

/* Applique la langue courante à tous les éléments [data-i18n] du DOM,
   puis appelle window.onLanguageChange() si elle existe (pour re-render
   le contenu dynamique : galerie, page projet...). */
function applyLanguage() {
  const lang = getLang();
  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (STRINGS[key]) {
      el.textContent = tr(STRINGS[key]);
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (STRINGS[key]) {
      el.innerHTML = tr(STRINGS[key]);
    }
  });

  document.querySelectorAll("[data-lang-label]").forEach((el) => {
    el.textContent = tr(STRINGS["lang.switch"]);
  });

  if (typeof window.onLanguageChange === "function") {
    window.onLanguageChange(lang);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage();
  document.querySelectorAll("[data-lang-toggle]").forEach((btn) => {
    btn.addEventListener("click", toggleLang);
  });
});
