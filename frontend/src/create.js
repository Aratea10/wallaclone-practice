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
let existingPhotoUrl = "";

async function loadAdForEdit() {
    if (!adId) return;

    try {
        const { data: ad } = await client.get(`/api/adverts/${adId}`);

        const token = localStorage.getItem("auth_token");
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentUsername = payload.username || payload.sub;

        if (ad.owner !== currentUsername) {
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

        if (ad.photo) {
            existingPhotoUrl = ad.photo;
            fileNameText.textContent = "Imagen actual cargada";
            filePlaceholder.classList.add("hidden");
            fileNameDisplay.classList.remove("hidden");
            fileNameDisplay.classList.add("flex");
        }
    } catch (error) {
        console.error(error);
        alert("Error al cargar el anuncio para editar");
        window.location.href = "/";
    }
}

photoInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        fileNameText.textContent = file.name;
        filePlaceholder.classList.add("hidden");
        fileNameDisplay.classList.remove("hidden");
        fileNameDisplay.classList.add("flex");
    } else {
        if (existingPhotoUrl) {
            fileNameText.textContent = "Imagen actual cargada";
        } else {
            filePlaceholder.classList.remove("hidden");
            fileNameDisplay.classList.add("hidden");
            fileNameDisplay.classList.remove("flex");
        }
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = adId ? "Guardando..." : "Publicando...";
    errorMessage.classList.add("hidden");

    try {
        let photoUrl = existingPhotoUrl;

        const photoInput = document.getElementById("photo");
        if (photoInput.files.length > 0) {
            const formData = new FormData();
            formData.append("file", photoInput.files[0]);

            const token = localStorage.getItem("auth_token");
            const uploadResponse = await fetch(`${client.baseUrl}/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Error al subir la imagen");
            }

            const uploadData = await uploadResponse.json();
            photoUrl = uploadData.path;
        }

        const selectedTags = Array.from(
            document.querySelectorAll('input[name="tags"]:checked')
        ).map((cb) => cb.value);

        const adData = {
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            price: parseFloat(document.getElementById("price").value),
            type: document.querySelector('input[name="type"]:checked').value,
            photo: photoUrl,
            tags: selectedTags,
        };

        if (adId) {
            await client.put(`/api/adverts/${adId}`, adData);
            alert("¡Anuncio actualizado correctamente!");
        } else {
            await client.post("/api/adverts", adData);
            alert("¡Anuncio publicado correctamente!");
        }

        window.location.href = "/";
    } catch (error) {
        errorMessage.textContent = error.message || "Error al guardar el anuncio";
        errorMessage.classList.remove("hidden");
        submitButton.disabled = false;
        submitButton.textContent = adId ? "Guardar cambios" : "Publicar anuncio";
    }
});

loadAdForEdit();