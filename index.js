//#region functions
async function callAPI(request) {
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

function formatMovieIncome(income) {
  let _income = Number(income);
  if (Number.isNaN(_income)) {
    console.log(`ERROR: income var ${income} is not number`);
    return "?";
  }

  let div = 1;
  let unit = "";
  if (_income < 1000) {
    return `${_income}`;
  } else if (_income < Math.pow(10, 6)) {
    div = 100;
    unit = "k";
  } else if (_income < Math.pow(10, 9)) {
    div = Math.pow(10, 5);
    unit = "m";
  } else if (_income < Math.pow(10, 12)) {
    div = Math.pow(10, 8);
    unit = "M";
  } else {
    div = Math.pow(10, 11);
    unit = "T";
  }

  _income = Math.round(_income / div) / 10;
  return `${_income}${unit}`;
}

async function createMovie(movie_url) {
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

async function getGenres() {
  let genres = [];
  let url = api_root + "/genres/";

  while (url) {
    const data = await callAPI(url);
    for (const genre of data.results) {
      genres.push(genre.name);
    }
    url = data.next;
  }

  return genres;
}

async function getMovies(genre) {
  const url =
    api_root + `/titles/?${genre == null ? "" : "genre=" + genre + "&"}sort_by=-imdb_score`;
  let data = await callAPI(url);
  let data2 = await callAPI(data.next);
  let movie_data = data.results;
  movie_data.push(data2.results[0]);
  let movies = [];
  for (const movie of movie_data) {
    movies.push(await createMovie(movie.url));
  }
  return movies;
}

//TODO gérer le onerror
function handleBGImageError(imageElement) {
  imageElement.onerror = ""; // Prevent infinite loop if fallback also fails
  imageElement.style["backgound-image"] = "linear-gradient(70deg, #777777, #BBBBBB)"; // Path to your fallback image
  return true; // Indicate that the error was handled
}
// function handleImageError

async function setBestMovie() {
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

  const detailsButton = movie_element.querySelector(".details");
  detailsButton.movie = bestMovie;
  detailsButton.addEventListener("click", updateModalEvent);
}

async function setPanelMovie(movie, panel_index) {
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
  // TODO gérer le onerror qui m'a pas l'air de marcher en injection de html (vu que j'injecte en même temps le code d'errur et l'image à problème)
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

async function updateModalEvent(event) {
  movie = event.currentTarget.movie;
  const modal = document.querySelector(".modal");
  modal.querySelector("h1").textContent = movie.title;
  modal.querySelector("h2").innerHTML = `${movie.year} - ${movie.genres}<br />${movie.rated} 
  - ${movie.duration} minutes (${movie.countries})<br />
  IMDB score: ${movie.imdb_score}/10<br />Recettes au box-office: $${movie.worldwide_gross_income}`;
  paragraphs = modal.querySelectorAll("p");
  paragraphs[0].textContent = movie.directors;
  paragraphs[1].textContent = movie.long_description;
  paragraphs[2].textContent = movie.actors;

  images = modal.querySelectorAll("img");
  images.forEach((img) => {
    img.src = movie.image_url;
    img.alt = `<Affiche du film ${movie.title}>`;
    img.onerror = handleBGImageError(this); //TODO gérer le onerror
  });
}

function hide_movies_toggle(event) {
  const toggle_button = event.currentTarget;
  const panels_parent = toggle_button.closest(".panel").querySelector(".panel-elements-parent");
  const panels_to_toggle = panels_parent.querySelectorAll(".d-none");
  if (toggle_button.textContent == "Voir plus") {
    for (p of panels_to_toggle) {
      p.setAttribute("style", "display:block !important");
    }
    toggle_button.textContent = "Voir moins";
  } else {
    for (p of panels_to_toggle) {
      p.removeAttribute("style");
    }
    toggle_button.textContent = "Voir plus";
  }
}

async function setPanelSection(section_id, genre, isDropdown = false) {
  const movies = await getMovies(genre);

  const section = document
    .getElementById(section_id)
    .appendChild(document.createElement("section"));
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
            
            <div class="row">
              <a class="details plus d-lg-none w-50" href="javascript:void(0)">Voir plus</a>
            </div>
          </div>
        </section>`;
  } else {
    section.classList.add("panel", "container", "overflow-hidden");
    section.innerHTML = `
        <h1>${genre == null ? "Films les mieux notés" : genre}</h1>
        <div class="row gy-4 panel-elements-parent">
        </div>
        <div class="row">
          <a class="details plus d-lg-none w-50" href="javascript:void(0)">Voir plus</a>
        </div>
        `;
  }

  if (isDropdown) {
    const dropdownMenu = section.querySelector(".dropdown-menu");
    setDropdown(dropdownMenu, genre);
  }

  const movie_panel = section.querySelector(".panel-elements-parent");

  for (i = 0; i < movies.length; i++) {
    movie_panel.appendChild(await setPanelMovie(movies[i], i));
  }

  const hidden_movies_toggle = section.querySelector(".plus");
  hidden_movies_toggle.addEventListener("click", hide_movies_toggle);

  const all_href = section.querySelectorAll("href");
  for (link of all_href) {
    link.click(function (e) {
      e.preventDefault();
    });
  }
}

async function updateMoviePanel(panelElementsParent, genre) {
  const movies = await getMovies(genre);

  for (let i = 0; i < panelElementsParent.children.length; i++) {
    const element = panelElementsParent.children[i];
    element.querySelector("h3").textContent = movies[i].title;
    element.querySelector(".bg-image").style["background-image"] = `url(${movies[i].image_url})`;
    element.movie = movies[i];
    element.removeEventListener("click", updateModalEvent);
    element.addEventListener("click", updateModalEvent);
  }
}

async function setDropdown(dropdownMenu, defaultGenre) {
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

function selectDropdownGenre(event) {
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
//#endregion

//#region execution

const api_root = "http://localhost:8000/api/v1";
const movies = getMovies("Comedy");

setBestMovie();
setPanelSection("best-overall");
setPanelSection("category1", "Animation");
setPanelSection("category2", "Sci-Fi");
setPanelSection("dropdown-category1", "Film-Noir", true);
setPanelSection("dropdown-category2", "Musical", true);

//#endregion
