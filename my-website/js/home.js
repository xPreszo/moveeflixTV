const API_KEY = "a2dc8b297ab3753eabd3d66413fa4db3";
const BASE_URL = "https://api.themoviedb.org/3";

// Categories (like Netflix rows)
const requests = [
  { title: "Trending Now", url: `/trending/all/week?api_key=${API_KEY}` },
  { title: "Top Rated", url: `/movie/top_rated?api_key=${API_KEY}` },
  { title: "Action Movies", url: `/discover/movie?api_key=${API_KEY}&with_genres=28` },
  { title: "Comedy Movies", url: `/discover/movie?api_key=${API_KEY}&with_genres=35` }
];

// Fetch and build rows
async function loadRows() {
  const rowsContainer = document.getElementById("rows");

  for (let req of requests) {
    const res = await fetch(BASE_URL + req.url);
    const data = await res.json();

    const row = document.createElement("div");
    row.className = "row";

    const title = document.createElement("h2");
    title.textContent = req.title;

    const posters = document.createElement("div");
    posters.className = "row-posters";

    data.results.forEach(movie => {
      const img = document.createElement("img");
      img.className = "poster";
      img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
      posters.appendChild(img);
    });

    row.appendChild(title);
    row.appendChild(posters);
    rowsContainer.appendChild(row);
  }
}

// Hero banner
async function loadHero() {
  const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
  const data = await res.json();
  const movie = data.results[0];

  document.getElementById("hero").style.backgroundImage =
    `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

  document.getElementById("hero-title").textContent =
    movie.title || movie.name;

  document.getElementById("hero-desc").textContent =
    movie.overview;
}

// Scroll effect
document.addEventListener("wheel", (e) => {
  document.querySelectorAll(".row-posters").forEach(row => {
    row.scrollLeft += e.deltaY;
  });
});

// Init
loadHero();
loadRows();
