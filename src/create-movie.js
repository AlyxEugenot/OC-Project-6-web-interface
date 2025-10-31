import { callAPI } from "./api.js";
import { formatMovieIncome } from "./movie-utils.js";

/**
 * Create the "Movie" data element with all related data from here.
 * @param {URL} movie_url Movie URL to load data from.
 * @returns Movie "object" with all necessary info.
 */
export default async function createMovie(movie_url) {
  const data = await callAPI(movie_url);

  return {
    title: data.title,
    description: data.description,
    image_url: data.image_url,

    year: data.year,
    genres: data.genres.join(","),
    rated: data.rated == "Not rated or unkown rating" ? "Not rated" : data.rated,
    duration: data.duration,
    countries: data.countries.join(" / "),
    imdb_score: data.imdb_score,
    worldwide_gross_income: formatMovieIncome(data.worldwide_gross_income),
    directors: data.directors.join(","),
    long_description: data.long_description,
    actors: data.actors.join(","),
  };
}
