import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export const http = axios.create({
  baseURL: API_BASE,
});

http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("hmsUser");
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch {}
  }
  return config;
});

export default http;
