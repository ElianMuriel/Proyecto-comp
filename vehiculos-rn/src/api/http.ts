import axios from "axios";
import { API_BASE_URL } from "../config";

type GlobalAuthStore = { accessToken?: string };

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const store = global as unknown as GlobalAuthStore;
  const token = store.accessToken;

  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});