import { client } from "./client.js";

const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const submitButton = document.getElementById("submit-button");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    submitButton.disabled = true;
    submitButton.textContent = "Iniciando sesión...";
    errorMessage.classList.add("hidden");

    try {
        const { data } = await client.post("/auth/login", { username, password });

        localStorage.setItem("auth_token", data.accessToken);

        window.location.href = "/";
    } catch (error) {
        errorMessage.textContent = error.message || "Error al iniciar sesión";
        errorMessage.classList.remove("hidden");
        submitButton.disabled = false;
        submitButton.textContent = "Iniciar sesión";
    }
});