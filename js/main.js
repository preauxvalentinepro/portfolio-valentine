/* ============================================================================
   MAIN.JS — page d'accueil : construit la galerie à partir de PROJECTS
   (voir js/projects.js) et la reconstruit quand la langue change.
   ============================================================================ */

function projectCardHTML(project) {
  const title = tr(project.title);
  const tags = tr(project.tags) || [];
  const media = project.coverVideo
    ? `<video src="${project.coverVideo}" muted loop playsinline autoplay poster="${project.cover}"></video>`
    : `<img src="${project.cover}" alt="${title}">`;

  return `
    <a class="project-card ${project.featured ? "is-featured" : ""}" href="project.html?slug=${encodeURIComponent(project.slug)}">
      <div class="card-media">
        ${media}
        <div class="card-caption">
          <div>
            <h3>${title}</h3>
            <div class="card-tags">${Array.isArray(tags) ? tags.join(" · ") : tags}</div>
          </div>
          <div class="card-year">${project.year || ""}</div>
        </div>
      </div>
    </a>
  `;
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  grid.innerHTML = PROJECTS.map(projectCardHTML).join("");

  const footerLinks = document.getElementById("footer-project-links");
  if (footerLinks) {
    footerLinks.innerHTML = PROJECTS.map(
      (p) => `<a href="project.html?slug=${encodeURIComponent(p.slug)}">${tr(p.title)}</a>`
    ).join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderGallery();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* appelé par i18n.js à chaque changement de langue */
window.onLanguageChange = function () {
  renderGallery();
};
