import axios from "axios";

// api
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "",  // empty string = same-origin during local dev
    withCredentials: true,
});

export default api;
