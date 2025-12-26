import axios from "axios";

export default defineNuxtPlugin(() => {
  const api = axios.create({
    baseURL: "http://localhost:8888", // API base
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Example interceptor
  api.interceptors.request.use((config) => {
    const token = useCookie("token").value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    provide: {
      api,
    },
  };
});
