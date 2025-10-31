import setBestMovie from "./src/best-movie/best-movie.js";
import { setPanelSection } from "./src/movie-panel/movie-panel.js";

setBestMovie();
setPanelSection("best-overall");
setPanelSection("category1", "Animation");
setPanelSection("category2", "Sci-Fi");
setPanelSection("dropdown-category1", "Film-Noir", true);
setPanelSection("dropdown-category2", "Musical", true);
