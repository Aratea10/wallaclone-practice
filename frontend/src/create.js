import { client } from "./client.js";

if (!localStorage.getItem("auth_token")) {
    alert("Debes iniciar sesión para publicar un anuncio");
    window.location.href = "/login.html";
}

const form = document.getElementById("create-form");
const errorMessage = document.getElementById("error-message");
const submitButton = document.getElementById("submit-button");
const pageTitle = document.getElementById("page-title");

const photoInput = document.getElementById("photo");
const filePlaceholder = document.getElementById("file-upload-placeholder");
const fileNameDisplay = document.getElementById("file-name-display");
const fileNameText = document.getElementById("file-name-text");

const urlParams = new URLSearchParams(window.location.search);
const adId = urlParams.get("id");
let existingGallery = [];

async function loadAdForEdit() {
    if (!adId) return;

    try {
        const { data: ad } = await client.get(`/api/adverts/${adId}`);
        const { data: currentUser } = await client.get("/auth/me");

        if (ad.owner !== currentUser.username) {
            alert("No tienes permiso para editar este anuncio");
            window.location.href = "/";
            return;
        }

        pageTitle.textContent = "Editar anuncio";
        submitButton.textContent = "Guardar cambios";

        document.getElementById("name").value = ad.name;
        document.getElementById("description").value = ad.description;
        document.getElementById("price").value = ad.price;

        const typeRadio = document.querySelector(
            `input[name="type"][value="${ad.type}"]`
        );
        if (typeRadio) typeRadio.checked = true;

        if (ad.tags) {
            ad.tags.forEach((tag) => {
                const tagCheckbox = document.querySelector(
                    `input[name="tags"][value="${tag}"]`
                );
                if (tagCheckbox) tagCheckbox.checked = true;
            });
        }

        if (ad.gallery && ad.gallery.length > 0) {
            existingGallery = ad.gallery;
        } else if (ad.photo) {
            existingGallery = [ad.photo];
        }

        if (existingGallery.length > 0) {
            renderThumbnails(existingGallery, true);
        }

    } catch (error) {
        console.error(error);
        alert("Error al cargar el anuncio para editar");
        window.location.href = "/";
    }
}

function renderThumbnails(sources, isUrl = false) {
    if (sources.length > 0) {
        filePlaceholder.classList.add("hidden");
        fileNameDisplay.classList.remove("hidden");
        fileNameDisplay.classList.add("flex");
        fileNameDisplay.innerHTML = "";

        sources.forEach(src => {
            const img = document.createElement("img");
            if (isUrl) {
                img.src = src.startsWith('http') ? src : `${client.baseUrl}${src}`;
            } else {
                img.src = URL.createObjectURL(src);
            }
            img.className = "w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm";
            fileNameDisplay.appendChild(img);
        });

    } else {
        filePlaceholder.classList.remove("hidden");
        fileNameDisplay.classList.add("hidden");
        fileNameDisplay.classList.remove("flex");
    }
}

photoInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        renderThumbnails(files, false);
    } else {
        renderThumbnails(existingGallery, true);
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = adId ? "Guardando..." : "Publicando...";
    errorMessage.classList.add("hidden");

    try {
        const photoInput = document.getElementById("photo");
        const newFiles = Array.from(photoInput.files);
        const uploadedUrls = [];

        if (newFiles.length > 0) {
            const token = localStorage.getItem("auth_token");

            const uploadPromises = newFiles.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch(`${client.baseUrl}/upload`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Error al subir imagen: ${file.name}`);
                }

                const data = await response.json();
                return data.path;
            });

            const results = await Promise.all(uploadPromises);
            uploadedUrls.push(...results);
        }

        const finalGallery = [...existingGallery, ...uploadedUrls];

        const mainPhoto = finalGallery.length > 0 ? finalGallery[0] : "";

        const selectedTags = Array.from(
            document.querySelectorAll('input[name="tags"]:checked')
        ).map((cb) => cb.value);

        const { data: currentUser } = await client.get("/auth/me");

        const adData = {
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            price: parseFloat(document.getElementById("price").value),
            type: document.querySelector('input[name="type"]:checked').value,
            photo: mainPhoto,
            gallery: finalGallery,
            tags: selectedTags,
            owner: currentUser.username
        };

        if (adId) {
            await client.put(`/api/adverts/${adId}`, adData);
            alert("¡Anuncio actualizado correctamente!");
            window.location.href = `/detail.html?id=${adId}`;
        } else {
            const { data: newAd } = await client.post("/api/adverts", adData);
            alert("¡Anuncio publicado correctamente!");
            window.location.href = `/detail.html?id=${newAd.id}`;
        }
    } catch (error) {
        console.error(error);
        errorMessage.textContent = error.message || "Error al guardar el anuncio";
        errorMessage.classList.remove("hidden");
        submitButton.disabled = false;
        submitButton.textContent = adId ? "Guardar cambios" : "Publicar anuncio";
    }
});

loadAdForEdit();