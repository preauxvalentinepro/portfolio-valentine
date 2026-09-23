/* ============================================================================
   QA-PAGE.JS — construit qa.html à partir de js/qa-data.js.
   ============================================================================ */

function gameCardHTML(game) {
  return `
    <div class="game-card">
      <img src="${game.cover}" alt="${tr(game.name)}" loading="lazy">
      <div class="game-info">
        <div class="game-name">${tr(game.name)}</div>
        <div class="game-genre">${tr(game.genre)}</div>
      </div>
    </div>
  `;
}

function categoryHTML(cat) {
  return `
    <section class="gallery wrap qa-category">
      <div class="section-head">
        <h2>${tr(cat.title)}</h2>
        <p>${tr(cat.subtitle)}</p>
      </div>
      <div class="game-grid">
        ${cat.games.map(gameCardHTML).join("")}
      </div>
    </section>
  `;
}

function renderQAPage() {
  document.getElementById("qa-role").textContent = tr(QA_INTRO.role);
  document.getElementById("qa-company").textContent = QA_INTRO.company;
  document.getElementById("qa-dates").textContent = tr(QA_INTRO.dates);
  document.getElementById("qa-text").textContent = tr(QA_INTRO.text);

  document.getElementById("qa-categories").innerHTML = QA_CATEGORIES.map(categoryHTML).join("");

  const footerLinks = document.getElementById("footer-project-links");
  if (footerLinks && typeof PROJECTS !== "undefined") {
    footerLinks.innerHTML = PROJECTS.map(
      (p) => `<a href="project.html?slug=${encodeURIComponent(p.slug)}">${tr(p.title)}</a>`
    ).join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderQAPage();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

window.onLanguageChange = function () {
  renderQAPage();
};
