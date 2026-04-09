const API_KEY = 'a2dc8b297ab3753eabd3d66413fa4db3';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMG_URL = 'https://image.tmdb.org/t/p/original';
    let currentItem;
const movies = [
  {
    title: "Avengers",
    image: "movie1.jpg",
    banner: "banner1.jpg",
    desc: "Earth's mightiest heroes unite.",
    rating: 5,
    category: "Trending"
  },
  {
    title: "Batman",
    image: "movie2.jpg",
    banner: "banner2.jpg",
    desc: "Dark knight rises.",
    rating: 4,
    category: "Trending"
  },
  {
    title: "Inception",
    image: "movie3.jpg",
    banner: "banner3.jpg",
    desc: "Dream within a dream.",
    rating: 5,
    category: "Popular"
  }
];

// 🎬 HERO BANNER AUTO LOAD
const banner = document.getElementById("banner");
const bannerTitle = document.getElementById("banner-title");

const featured = movies[Math.floor(Math.random() * movies.length)];
banner.style.backgroundImage = `url(${featured.banner})`;
bannerTitle.innerText = featured.title;

// 🎥 GENERATE ROWS
const rowsContainer = document.getElementById("rows");

const categories = [...new Set(movies.map(m => m.category))];

categories.forEach(cat => {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <h2>${cat}</h2>
    <div class="list">
      ${movies
        .filter(m => m.category === cat)
        .map(m => `
          <img src="${m.image}" 
               onclick="openModal('${m.title}')"
               onmouseover="previewBanner('${m.banner}', '${m.title}')">
        `).join("")}
    </div>
  `;

  rowsContainer.appendChild(row);
});

// 🎬 MODAL
function openModal(title) {
  const movie = movies.find(m => m.title === title);

  document.getElementById("modal").style.display = "flex";
  document.getElementById("modal-img").src = movie.image;
  document.getElementById("modal-title").innerText = movie.title;
  document.getElementById("modal-desc").innerText = movie.desc;

  document.getElementById("modal-rating").innerText =
    "★".repeat(movie.rating);
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// 🎥 HOVER PREVIEW (REAL NETFLIX FEEL)
function previewBanner(img, title) {
  banner.style.backgroundImage = `url(${img})`;
  bannerTitle.innerText = title;
}

// 🔍 REAL SEARCH
document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  document.querySelectorAll(".list img").forEach(img => {
    const movie = movies.find(m => m.image === img.getAttribute("src"));
    img.style.display = movie.title.toLowerCase().includes(value)
      ? "block"
      : "none";
  });
});
    async function fetchTrending(type) {
      const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
      const data = await res.json();
      return data.results;
    }

    async function fetchTrendingAnime() {
  let allResults = [];

  // Fetch from multiple pages to get more anime (max 3 pages for demo)
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }

  return allResults;
}


    function displayBanner(item) {
      document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
      document.getElementById('banner-title').textContent = item.title || item.name;
    }

    function displayList(items, containerId) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      items.forEach(item => {
        const img = document.createElement('img');
        img.src = `${IMG_URL}${item.poster_path}`;
        img.alt = item.title || item.name;
        img.onclick = () => showDetails(item);
        container.appendChild(img);
      });
    }

    function showDetails(item) {
      currentItem = item;
      document.getElementById('modal-title').textContent = item.title || item.name;
      document.getElementById('modal-description').textContent = item.overview;
      document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
      document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
      changeServer();
      document.getElementById('modal').style.display = 'flex';
    }

    function changeServer() {
      const server = document.getElementById('server').value;
      const type = currentItem.media_type === "movie" ? "movie" : "tv";
      let embedURL = "";

      if (server === "vidsrc.cc") {
        embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
      } else if (server === "vidsrc.me") {
        embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
      } else if (server === "player.videasy.net") {
        embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
      }

      document.getElementById('modal-video').src = embedURL;
    }

    function closeModal() {
      document.getElementById('modal').style.display = 'none';
      document.getElementById('modal-video').src = '';
    }

    function openSearchModal() {
      document.getElementById('search-modal').style.display = 'flex';
      document.getElementById('search-input').focus();
    }

    function closeSearchModal() {
      document.getElementById('search-modal').style.display = 'none';
      document.getElementById('search-results').innerHTML = '';
    }

    async function searchTMDB() {
      const query = document.getElementById('search-input').value;
      if (!query.trim()) {
        document.getElementById('search-results').innerHTML = '';
        return;
      }

      const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
      const data = await res.json();

      const container = document.getElementById('search-results');
      container.innerHTML = '';
      data.results.forEach(item => {
        if (!item.poster_path) return;
        const img = document.createElement('img');
        img.src = `${IMG_URL}${item.poster_path}`;
        img.alt = item.title || item.name;
        img.onclick = () => {
          closeSearchModal();
          showDetails(item);
        };
        container.appendChild(img);
      });
    }

    async function init() {
      const movies = await fetchTrending('movie');
      const tvShows = await fetchTrending('tv');
      const anime = await fetchTrendingAnime();

      displayBanner(movies[Math.floor(Math.random() * movies.length)]);
      displayList(movies, 'movies-list');
      displayList(tvShows, 'tvshows-list');
      displayList(anime, 'anime-list');
    }



    init();
