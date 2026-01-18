const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const client = {
    baseUrl: apiBaseUrl,

    async request(path, method = "GET", body = null) {
        const token = localStorage.getItem("auth_token");
        const headers = {};

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        let requestBody = body;

        if (body && !(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
            requestBody = JSON.stringify(body);
        }

        const options = {
            method,
            headers,
        };

        if (body) {
            options.body = requestBody;
        }

        const response = await fetch(`${this.baseUrl}${path}`, options);

        let data = {};
        if (response.status !== 204) {
            try {
                data = await response.json();
            } catch (error) {
            }
        }

        if (!response.ok) {
            throw new Error(data.message || response.statusText);
        }

        const links = {};
        const linkHeader = response.headers.get("Link");
        if (linkHeader) {
            linkHeader.split(",").forEach((part) => {
                const section = part.split(";");
                const url = section[0].replace(/</g, "").replace(/>/g, "").trim();
                const name = section[1].match(/rel="(.+?)"/)[1];
                links[name] = new URL(url).pathname + new URL(url).search;
            });
        }

        return { data, links };
    },

    get(path) {
        return this.request(path, "GET");
    },

    post(path, body) {
        return this.request(path, "POST", body);
    },

    delete(path) {
        return this.request(path, "DELETE");
    },

    put(path, body) {
        return this.request(path, "PUT", body);
    },
};