import { getMovies } from "../generics/api.js";
import { updateModalEvent } from "../modal/modal.js";
import { hide_movies_toggle, setDropdown } from "./interactive-elements.js";
import setPanelMovie from "./panel-movies.js";

/**
 * Inject movie panel in section "section_id" from movie genre "genre".
 * Structure depends if section is dropdown.
 * @param {String} section_id Section id in which to insert html.
 * @param {String} genre Movie genre to load best movies from.
 * @param {Boolean} isDropdown true if is dropdown (implement different html structure)
 */
export async function setPanelSection(section_id, genre, isDropdown = false) {
  const movies = await getMovies(genre);

  const section = document
    .getElementById(section_id)
    .appendChild(document.createElement("section"));

  const see_more_button =
    movies.length < 3
      ? ""
      : `<div class="row">
          <a class="details plus ${
            movies.length < 4 ? "d-md-none" : "d-lg-none"
          } w-50" href="javascript:void(0)">Voir plus</a>
        </div>`;
  if (isDropdown) {
    section.classList.add("panel", "dropdown-section");
    section.innerHTML = `
          <div class="d-flex flex-column align-items-center justify-content-md-start flex-md-row">
            <h1>Autres:</h1>
            <div class="dropdown">
              <a
                class="btn dropdown-toggle"
                href="javascript:void(0)"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                ${genre}
              </a>

              <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              </ul>
            </div>
          </div>
          <div class="container overflow-hidden">
            <div class="row gy-4 panel-elements-parent">
            </div>
            
            ${see_more_button}
          </div>
        </section>`;
  } else {
    section.classList.add("panel", "container", "overflow-hidden");
    section.innerHTML = `
        <h1>${genre == null ? "Films les mieux notés" : genre}</h1>
        <div class="row gy-4 panel-elements-parent">
        </div>
        ${see_more_button}
        `;
  }

  if (isDropdown) {
    const dropdownMenu = section.querySelector(".dropdown-menu");
    setDropdown(dropdownMenu, genre);
  }

  const movie_panel = section.querySelector(".panel-elements-parent");

  for (let i = 0; i < movies.length; i++) {
    movie_panel.appendChild(await setPanelMovie(movies[i], i));
  }

  if (movies.length > 2) {
    const hidden_movies_toggle = section.querySelector(".plus");
    hidden_movies_toggle.addEventListener("click", hide_movies_toggle);
  }

  const all_href = section.querySelectorAll("href");
  for (link of all_href) {
    link.click(function (e) {
      e.preventDefault();
    });
  }
}

/**
 * When selecting from a dropdown, update the movies from this panel to said genre.
 *
 * If number of available movies defer, recreate the section altogether.
 * @param {Element} panelElementsParent Panel element to inject movies in
 * @param {String} genre Genre of movies to inject.
 */
export async function updateMoviePanel(panelElementsParent, genre) {
  const movies = await getMovies(genre);

  if (movies.length != panelElementsParent.children.length) {
    const panel_parent_with_id = panelElementsParent.closest(".panel").parentElement;
    panel_parent_with_id.innerHTML = ""; // delete all children elements
    await setPanelSection(panel_parent_with_id.id, genre, true); // sections to be updated always are dropdowns
    panel_parent_with_id.scrollIntoView();
  } else {
    for (let i = 0; i < panelElementsParent.children.length; i++) {
      const element = panelElementsParent.children[i];
      element.querySelector("h3").textContent = movies[i].title;
      element.querySelector(".bg-image").style["background-image"] = `url(${movies[i].image_url})`;
      const details = element.querySelector(".details");
      details.movie = movies[i];
      details.removeEventListener("click", updateModalEvent);
      details.addEventListener("click", updateModalEvent);
    }
  }
}
