import createMovie from "../create-movie.js";
import { updateModalEvent } from "../modal/modal.js";
import { handleImageError } from "../movie-utils.js";
import { api_root, callAPI } from "/src/api.js";

/**
 * Creates the "best movie" element to be inserted.
 */
export default async function setBestMovie() {
  const bestMoviesData = await callAPI(api_root + "/titles/?sort_by=-imdb_score");
  const bestMovie = await createMovie(bestMoviesData.results[0].url);

  const movie_element = document
    .getElementById("spotlight")
    .appendChild(document.createElement("section"));
  movie_element.classList.add("best-movie");
  movie_element.innerHTML = `
    <section class="best-movie">
      <h1>Meilleur film</h1>
      <div class="d-flex flex-wrap flex-md-nowrap gap-4">
        <aside>
          <img src="${bestMovie.image_url}" alt="<Affiche du film ${bestMovie.title}>" />
        </aside>
        <article>
          <h2>${bestMovie.title}</h2>
          <p class="p-lg-2">
            ${bestMovie.description}
          </p>
          <div class="d-flex justify-content-center justify-content-md-end">
            <a href="javascript:void(0)" class="details" data-bs-toggle="modal" data-bs-target="#movieModal"
              >Détails</a
            >
          </div>
        </article>
      </div>
    </section>
    `;

  const img = movie_element.querySelector("img");
  img.onerror = handleImageError(img);
  const detailsButton = movie_element.querySelector(".details");
  detailsButton.movie = bestMovie;
  detailsButton.addEventListener("click", updateModalEvent);
}
