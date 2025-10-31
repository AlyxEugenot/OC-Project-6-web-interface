import { getGenres } from "../api.js";
import { updateMoviePanel } from "./movie-panel.js";

/**
 * Enable the toggling of the details button and of movies showed.
 * @param {Event} event Button to add behaviour to.
 */
export function hide_movies_toggle(event) {
  const toggle_button = event.currentTarget;
  const panels_parent = toggle_button.closest(".panel").querySelector(".panel-elements-parent");
  const panels_to_toggle = panels_parent.querySelectorAll(".d-none");
  if (toggle_button.textContent == "Voir plus") {
    for (let p of panels_to_toggle) {
      p.setAttribute("style", "display:block !important");
    }
    toggle_button.textContent = "Voir moins";
  } else {
    for (let p of panels_to_toggle) {
      p.removeAttribute("style");
    }
    toggle_button.textContent = "Voir plus";
  }
}

/**
 * Create an element to handle dropdown interactivy.
 * @param {Element} dropdownMenu Menu to inject dropdwown element in.
 * @param {String} defaultGenre Genre to put by default.
 */
export async function setDropdown(dropdownMenu, defaultGenre) {
  const all_genres = await getGenres();
  for (let i = 0; i < all_genres.length; i++) {
    const genre = all_genres[i];
    const item = dropdownMenu.appendChild(document.createElement("li"));
    item.innerHTML = `
      <a class="dropdown-item ${genre == defaultGenre ? "active" : ""}" href="javascript:void(0)">
        <div class="d-flex justify-content-between">
          <p>${genre}</p>
          ${genre == defaultGenre ? '<p class="dropdown-check">✅</p>' : ""}
        </div>
      </a>
      `;
    item.addEventListener("click", selectDropdownGenre);
  }
}

/**
 * Enable dropdown panels interactivity.
 * @param {Event} event Button to add dropdown to.
 */
export function selectDropdownGenre(event) {
  const dropdownItem = event.currentTarget;
  const panelSection = dropdownItem.closest(".panel");
  const genre = dropdownItem.querySelector("p").textContent;
  panelSection.querySelector(".dropdown-toggle").textContent = dropdownItem.textContent;

  const selected = panelSection.querySelectorAll(".active");
  for (let element of selected) {
    element.classList.remove("active");
    element.querySelector(".dropdown-check").remove();
  }
  dropdownItem.classList.add("active");
  dropdownItem
    .querySelector("p")
    .insertAdjacentHTML("afterend", '<p class="dropdown-check">✅</p>');

  updateMoviePanel(panelSection.querySelector(".panel-elements-parent"), genre);
}
