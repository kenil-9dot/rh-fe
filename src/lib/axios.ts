import axios from "axios";

const DEFAULT_API_URL = "http://localhost:5000";

/** Backend API base URL — resolved at call time so server actions use the correct origin. */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use public env var
    return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  }
  // Server-side: prefer internal API_URL, fallback to public URL
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_API_URL
  );
}

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Dynamically set baseURL on every request
api.interceptors.request.use((config) => {
  // Always resolve the base URL at request time
  config.baseURL = getApiBaseUrl();

  // Add Authorization header if token exists in localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

/** Request config with Bearer token for authenticated API calls */
export function getAuthConfig(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}