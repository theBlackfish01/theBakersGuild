import axios from "axios";

// In production Vercel rewrites `/api/*` to server/api/**
// During local dev, set VITE_API_URL="http://localhost:8000/api" (or similar)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/api",    // default works on Vercel
    withCredentials: true,
});

export default api;