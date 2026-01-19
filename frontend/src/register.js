import { client } from "./client.js";

const form = document.getElementById("register-form");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");
const submitButton = document.getElementById("submit-button");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    if (password !== passwordConfirm) {
        errorMessage.textContent = "Las contraseñas no coinciden";
        errorMessage.classList.remove("hidden");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Creando cuenta...";
    errorMessage.classList.add("hidden");
    successMessage.classList.add("hidden");

    try {
        await client.post("/auth/register", { username, password });

        const { data } = await client.post("/auth/login", { username, password });

        localStorage.setItem("auth_token", data.accessToken);

        successMessage.textContent = "¡Cuenta creada! Entrando...";
        successMessage.classList.remove("hidden");

        setTimeout(() => {
            window.location.href = "/";
        }, 1500);
    } catch (error) {
        errorMessage.textContent = error.message || "Error al registrarse";
        errorMessage.classList.remove("hidden");
        submitButton.disabled = false;
        submitButton.textContent = "Registrarse";
    }
});