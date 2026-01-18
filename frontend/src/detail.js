import { client } from "./client.js";

const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const emptyState = document.getElementById("empty-state");
const adDetail = document.getElementById("ad-detail");
const errorText = document.getElementById("error-text");

const urlParams = new URLSearchParams(window.location.search);
const adId = urlParams.get("id");

function showState(state) {
    loadingState.classList.add("hidden");
    errorState.classList.add("hidden");
    emptyState.classList.add("hidden");
    adDetail.classList.add("hidden");

    if (state === "loading") loadingState.classList.remove("hidden");
    if (state === "error") errorState.classList.remove("hidden");
    if (state === "empty") emptyState.classList.remove("hidden");
    if (state === "success") adDetail.classList.remove("hidden");
}

async function renderAd(ad) {
    const imageContainer = document.getElementById("ad-image-container");
    if (ad.photo) {
        imageContainer.innerHTML = `<img src="${client.baseUrl}${ad.photo}" alt="${ad.name}" class="w-full h-96 object-cover" />`;
    } else {
        imageContainer.innerHTML = `<div class="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400 text-xl">Sin imagen</div>`;
    }

    document.getElementById("ad-name").textContent = ad.name;
    document.getElementById("ad-description").textContent = ad.description;
    document.getElementById("ad-price").textContent = `${ad.price}€`;

    const typeBadge = document.getElementById("ad-type-badge");
    typeBadge.className = ad.type === "sell" ? "badge-sell" : "badge-buy";
    typeBadge.textContent = ad.type === "sell" ? "Venta" : "Compra";

    const token = localStorage.getItem("auth_token");
    if (token) {
        try {
            const { data: currentUser } = await client.get("/auth/me");

            if (currentUser.username === ad.owner) {
                const ownerActions = document.getElementById("owner-actions");
                ownerActions.classList.remove("hidden");
                ownerActions.classList.add("flex");

                document.getElementById("edit-btn").addEventListener("click", () => {
                    window.location.href = `/create.html?id=${ad.id}`;
                });

                document
                    .getElementById("delete-btn")
                    .addEventListener("click", async () => {
                        if (
                            confirm("¿Estás seguro de que quieres eliminar este anuncio?")
                        ) {
                            try {
                                await client.delete(`/api/adverts/${ad.id}`);
                                alert("Anuncio eliminado correctamente");
                                window.location.href = "/";
                            } catch (error) {
                                alert("Error al eliminar el anuncio: " + error.message);
                            }
                        }
                    });
            }
        } catch (error) {
            console.error("Error al obtener usuario actual:", error);
        }
    }
}

async function loadAd() {
    if (!adId) {
        showState("empty");
        return;
    }

    showState("loading");

    try {
        const { data: ad } = await client.get(`/api/adverts/${adId}`);
        await renderAd(ad);
        showState("success");
    } catch (error) {
        if (error.message.includes("404")) {
            showState("empty");
        } else {
            errorText.textContent = error.message || "Error al cargar el anuncio";
            showState("error");
        }
    }
}

loadAd();