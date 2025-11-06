import createMovie from "./create-movie.js";

export const api_root = "http://localhost:8000/api/v1";

/**
 * Call API and get response's JSON.
 * @param {Request} request Request to query API with.
 * @returns Response in JSON format.
 */
export async function callAPI(request) {
  const response = await fetch(request);
  try {
    if (!response.ok) {
      throw new Error("API request failed");
    }
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

/**
 * Get full list of genre names.
 * @returns List of genre names.
 */
export async function getGenres() {
  let genres = [];
  let url = api_root + "/genres/?page_size=50";

  while (url) {
    const data = await callAPI(url);
    for (const genre of data.results) {
      genres.push(genre.name);
    }
    url = data.next;
  }

  return genres;
}

/**
 * Get the best rated movies from get-Movies.
 * @param {String} genre Genre to get the Movies from.
 * @returns List[Movie] Movies from said genre.
 */
export async function getMovies(genre) {
  const url =
    api_root +
    `/titles/?${genre == null ? "" : "genre=" + genre + "&"}sort_by=-imdb_score&page_size=6`;
  // 6 is the max number of elements we want to display in each panel
  let data = await callAPI(url);
  let movies = [];
  for (const movie of data.results) {
    movies.push(await createMovie(movie.url));
  }
  return movies;
}

/**
 * Call API and get image or gray fade for missing images.
 * @param {Request} request Request to query API with.
 * @returns Response in JSON format.
 */
// export async function getImage(request) {
//   try {
//     const response = await fetch(request);
//     if (!response.ok) {
//       // Ici on a une 404, 500, etc.
//       // console.warn(`Image non trouvée (code ${response.status})`);
//       return "linear-gradient(70deg, #BBBBBB, #777777, #BBBBBB)";
//     }

//     return `url('${response.url}')`;
//   } catch (e) {
//     return "linear-gradient(70deg, #BBBBBB, #777777, #BBBBBB)";
//   }
// }

// Je pourrais gérer les erreurs d'images non existantes en chargeant une balise img
// et selon les résultats des balises onload et onerror de cet img,
// je peux savoir si l'image est existante ou non PUIS gérer ça dans mon bg-image
// mais j'ai préféré ne pas ajouter cette charge réseau
