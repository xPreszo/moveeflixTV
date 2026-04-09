const API_KEY = 'a2dc8b297ab3753eabd3d66413fa4db3';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

let currentItem;

// 🎬 FETCH FUNCTIONS
async function fetchData(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

async function fetchTrending(type) {
  return fetchData(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
}

async function fetchAnime() {
  let all = [];

  for (let page = 1; page <= 2; page++) {
    const data = await fetchData(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const filtered = data.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    all = [...all, ...filtered];
  }

  return all;
}

// 🎥 BANNER
function setBanner(item) {
  document.getElementById('banner').style.backgroundImage =
    `url(${IMG_URL}${item.backdrop_path})`;

  document.getElementById('banner-title').textContent =
    item.title || item.name;
}

// 🎬 CREATE NETFLIX ROW
function createRow(title, items) {
  const container = document.getElementById('rows');

  const row = document.createElement('div');
  row.className = 'row';

  row.innerHTML = `
    <h2>${title}</h2>
    <div class="list"></div>
  `;

  const list = row.querySelector('.list');

  items.forEach(item => {
    if (!item.poster_path) return;

    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;

    img.onclick = () => openModal(item);
    img.onmouseover = () => setBanner(item);

    list.appendChild(img);
  });

  container.appendChild(row);
}

// 🎬 MODAL
function openModal(item) {
  currentItem = item;

  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modal-image').src =
    `${IMG_URL}${item.poster_path}`;

  document.getElementById('modal-title').textContent =
    item.title || item.name;

  document.getElementById('modal-description').textContent =
    item.overview;

  document.getElementById('modal-rating').innerHTML =
    '★'.repeat(Math.round(item.vote_average / 2));

  changeServer();
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

// 🎥 STREAM SERVERS
function changeServer() {
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === "movie" ? "movie" : "tv";

  let url = "";

  if (server === "vidsrc.cc") {
    url = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
  } else if (server === "vidsrc.me") {
    url = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
  } else {
    url = `https://player.videasy.net/${type}/${currentItem.id}`;
  }

  document.getElementById('modal-video').src = url;
}

// 🔍 SEARCH
async function searchTMDB() {
  const query = document.getElementById('search-input').value;

  if (!query.trim()) return;

  const results = await fetchData(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`
  );

  const container = document.getElementById('search-results');
  container.innerHTML = '';

  results.forEach(item => {
    if (!item.poster_path) return;

    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;

    img.onclick = () => {
      closeSearchModal();
      openModal(item);
    };

    container.appendChild(img);
  });
}

// 🔍 SEARCH MODAL
function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
}

// 🚀 INIT (REAL NETFLIX STRUCTURE)
async function init() {
  const movies = await fetchTrending('movie');
  const tv = await fetchTrending('tv');
  const anime = await fetchAnime();

  setBanner(movies[Math.floor(Math.random() * movies.length)]);

  createRow("Trending Movies", movies);
  createRow("Popular TV Shows", tv);
  createRow("Anime Picks", anime);
}

init();
