import axios from "axios";

// Set backend base URL
const api = axios.create({
  baseURL: "http://localhost:5000", // your backend port
});

// Interceptor to add auth token dynamically
api.interceptors.request.use((config) => {
  // This code will only run in the browser, preventing SSR errors.
  if (typeof window !== "undefined") {
    const userString = localStorage.getItem("hmsUser");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        // Check if the parsed user object and token exist
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
  }
  return config;
});

export default api;
