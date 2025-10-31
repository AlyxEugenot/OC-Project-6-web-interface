// import { getImage } from "../api.js";
import { updateModalEvent } from "../modal/modal.js";

/**
 * Creates a movie element to be inserted in a movie panel of 6.
 * @param {Movie} movie Movie to set panel to.
 * @param {Number} panel_index Index representing which element of the panel it is. Useful for responsive displays.
 * @returns The html element to be inserted in movie panels.
 */
export default async function setPanelMovie(movie, panel_index) {
  const element = document.createElement("div");
  element.classList.add("panel-element", "col", "col-12", "col-md-6", "col-lg-4");
  if (panel_index >= 2) {
    element.classList.add("d-none");
    if (panel_index >= 4) {
      element.classList.add("d-lg-block");
    } else {
      element.classList.add("d-md-block");
    }
  }
  // const image_style = await getImage(movie.image_url);
  element.innerHTML = `
    <div class="bg-image" style="background-image: url('${movie.image_url}')" onerror="this.style.display='none'" >
      <div class="overlay">
        <h3>${movie.title}</h3>
        <a href="javascript:void(0)" class="details" data-bs-toggle="modal" data-bs-target="#movieModal"
          >Détails</a
        >
      </div>
    </div>
    `;
  const detailsButton = element.querySelector(".details");
  detailsButton.movie = movie;
  detailsButton.addEventListener("click", updateModalEvent);
  return element;
}
