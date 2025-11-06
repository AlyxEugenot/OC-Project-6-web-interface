import setBestMovie from "./best-movie/best-movie.js";
import { setPanelSection } from "./movie-panel/movie-panel.js";

setBestMovie();
setPanelSection("best-overall");
setPanelSection("category1", "Animation");
setPanelSection("category2", "Sci-Fi");
setPanelSection("dropdown-category", "Film-Noir", true);
