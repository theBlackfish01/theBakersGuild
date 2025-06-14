import axios from "axios";

/* One instance everywhere */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "",   // "/api" in prod, "" in dev
    withCredentials: true,
});

export default api;
