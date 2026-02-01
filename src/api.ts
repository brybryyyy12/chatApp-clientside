import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Use type-safe assignment
      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
