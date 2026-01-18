import { client } from "./client.js";

const adsContainer = document.getElementById("ads-grid");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const emptyState = document.getElementById("empty-state");
const errorText = document.getElementById("error-text");
const authButtons = document.getElementById("auth-buttons");

let currentPage = 1;
const limit = 10;
let searchQuery = "";
let activeTag = null;

const searchInput = document.getElementById("search-input");
const tagsFilterContainer = document.getElementById("tags-filter");
const paginationContainer = document.getElementById("pagination");
const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const currentPageSpan = document.getElementById("current-page");

function isUserLoggedIn() {
  return !!localStorage.getItem("auth_token");
}

function renderAuthButtons() {
  if (isUserLoggedIn()) {
    authButtons.innerHTML = `
      <button id="my-ads-btn" class="cursor-pointer px-6 py-2 text-gray-600 hover:text-wallaclone font-semibold transition-colors mr-2">
        Mis anuncios
      </button>
      <a href="/create.html" class="px-6 py-2 text-white rounded-full font-semibold" style="background-color: #13C1AC;">
        Publicar anuncio
      </a>
      <button id="logout-btn" class="cursor-pointer px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 ml-2">
        Cerrar sesión
      </button>
    `;

    document.getElementById("my-ads-btn").addEventListener("click", () => {
      if (currentUsername) {
        activeOwner = currentUsername;
        currentPage = 1;
        loadAds();
      }
    });

    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("auth_token");
      location.reload();
    });
  } else {
    authButtons.innerHTML = `
      <a href="/login.html" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300">
        Iniciar sesión
      </a>
      <a href="/register.html" class="px-6 py-2 text-white rounded-full font-semibold" style="background-color: #13C1AC;">
        Registrarse
      </a>
    `;
  }
}

function showState(state) {
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  emptyState.classList.add("hidden");
  adsContainer.classList.add("hidden");
  paginationContainer.classList.add("hidden");

  if (state === "loading") loadingState.classList.remove("hidden");
  if (state === "error") errorState.classList.remove("hidden");
  if (state === "empty") emptyState.classList.remove("hidden");
  if (state === "success") {
    adsContainer.classList.remove("hidden");
    paginationContainer.classList.remove("hidden");
    paginationContainer.classList.add("flex");
  }
}

function renderAds(ads) {
  adsContainer.innerHTML = ads
    .map(
      (ad) => `
    <div class="ad-card relative group" onclick="window.location.href='/detail.html?id=${ad.id}'">
      ${ad.owner === currentUsername
          ? `<button 
            onclick="event.stopPropagation(); window.location.href='/create.html?id=${ad.id}'"
            class="cursor-pointer absolute top-2 right-2 z-10 bg-white/90 p-2 rounded-full shadow-sm hover:text-wallaclone transition-colors"
            title="Editar anuncio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>`
          : ''
        }
      ${ad.photo
          ? `<img src="${ad.photo.startsWith('http') ? ad.photo : client.baseUrl + ad.photo}" alt="${ad.name}" class="ad-image" />`
          : `<div class="ad-image flex items-center justify-center text-gray-400">Sin imagen</div>`
        }
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-gray-800 line-clamp-1">${ad.name
        }</h3>
          <span class="${ad.type === "sell" ? "badge-sell" : "badge-buy"}">
            ${ad.type === "sell" ? "Venta" : "Compra"}
          </span>
        </div>
        <p class="text-gray-600 text-sm line-clamp-2 mb-3">${ad.description}</p>
        <p class="text-2xl font-bold" style="color: #13C1AC;">${ad.price}€</p>
        ${ad.tags
          ? `<div class="mt-2 flex gap-1 flex-wrap">${ad.tags
            .map(
              (tag) =>
                `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">#${tag}</span>`
            )
            .join("")}</div>`
          : ""
        }
      </div>
    </div>
  `
    )
    .join("");
}

async function loadAds() {
  showState("loading");

  try {
    let query = `/api/adverts?_page=${currentPage}&_limit=${limit}`;
    if (searchQuery) {
      query += `&name_like=${searchQuery}`;
    }
    if (activeTag) {
      query += `&q=${activeTag}`;
    }
    if (activeOwner) {
      query += `&owner=${activeOwner}`;
    }

    const { data: ads, links } = await client.get(query);

    if (ads.length === 0 && currentPage === 1) {
      showState("empty");
      paginationContainer.classList.add("hidden");
    } else {
      renderAds(ads);
      showState("success");

      currentPageSpan.textContent = `Página ${currentPage}`;
      prevPageBtn.disabled = !links.prev;
      nextPageBtn.disabled = !links.next;

      if (ads.length === 0 && currentPage > 1) {
        currentPage--;
        loadAds();
      }
    }
  } catch (error) {
    console.error(error);
    errorText.textContent = error.message || "Error al cargar los anuncios";
    showState("error");
  }
}

async function renderDynamicTags() {
  try {
    const { data: allAds } = await client.get("/api/adverts");
    const allTags = allAds.flatMap((ad) => ad.tags || []);
    const uniqueTags = [...new Set(allTags)];

    tagsFilterContainer.innerHTML = uniqueTags
      .map(
        (tag) => `
      <label class="cursor-pointer">
        <input
          type="checkbox"
          value="${tag}"
          class="peer sr-only tag-filter"
        />
        <span
          class="px-4 py-2 rounded-full bg-gray-100 text-gray-600 peer-checked:bg-teal-500 peer-checked:text-white transition-colors text-sm font-medium whitespace-nowrap"
        >${tag.charAt(0).toUpperCase() + tag.slice(1)}</span
        >
      </label>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading dynamic tags:", error);
    tagsFilterContainer.innerHTML =
      '<p class="text-sm text-red-500">Error al cargar los tags</p>';
  }
}

let debounceTimer;
let activeOwner = null;
let currentUsername = null;

async function initUser() {
  if (isUserLoggedIn()) {
    try {
      const { data: user } = await client.get("/auth/me");
      currentUsername = user.username;
      renderAuthButtons();
    } catch (error) {
      console.error("Error fetching user", error);
    }
  }
}

searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchQuery = e.target.value;
    currentPage = 1;
    loadAds();
  }, 300);
});

tagsFilterContainer.addEventListener("change", (e) => {
  if (e.target.classList.contains("tag-filter")) {
    const checkboxes = tagsFilterContainer.querySelectorAll(".tag-filter");
    checkboxes.forEach((cb) => {
      if (cb !== e.target) cb.checked = false;
    });

    if (e.target.checked) {
      activeTag = e.target.value;
    } else {
      activeTag = null;
    }
    currentPage = 1;
    loadAds();
  }
});

prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadAds();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

nextPageBtn.addEventListener("click", () => {
  if (!nextPageBtn.disabled) {
    currentPage++;
    loadAds();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

document.querySelector(".logo-title").addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";
  searchQuery = "";

  activeTag = null;
  activeOwner = null;
  const checkboxes = tagsFilterContainer.querySelectorAll(".tag-filter");
  checkboxes.forEach((cb) => (cb.checked = false));

  currentPage = 1;

  loadAds();

  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderAuthButtons();
renderDynamicTags();
loadAds();
initUser();