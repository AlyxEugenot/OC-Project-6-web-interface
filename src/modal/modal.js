import { handleImageError } from "../generics/movie-utils.js";

/**
 *Update all elements related to movie.
 * @param {Event} event Event to trigger this function. (details buttons)
 */
export async function updateModalEvent(event) {
  const movie = event.currentTarget.movie;
  const modal = document.querySelector(".modal");
  modal.querySelector("h1").textContent = movie.title;
  modal.querySelector("h2").innerHTML = `${movie.year} - ${movie.genres}<br />${movie.rated} 
  - ${movie.duration} minutes (${movie.countries})<br />
  IMDB score: ${movie.imdb_score}/10<br />Recettes au box-office: $${movie.worldwide_gross_income}`;
  const paragraphs = modal.querySelectorAll("p");
  paragraphs[0].textContent = movie.directors;
  paragraphs[1].textContent = movie.long_description;
  paragraphs[2].textContent = movie.actors;

  const images = modal.querySelectorAll("img");
  images.forEach((img) => {
    img.src = movie.image_url;
    img.alt = `<Affiche du film ${movie.title}>`;
    img.onerror = handleImageError(img);
  });
}
