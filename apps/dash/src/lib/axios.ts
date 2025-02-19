import axios from "axios";

import { getToken } from "~/store/auth";

const apiClient = axios.create({ baseURL: import.meta.env.VITE_URL });

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  else {
    const contentType = config.headers["Content-Type"];
    config.headers["Content-Type"] = contentType ?? "application/json";
  }

  config.headers.Accept = config.headers.Accept ?? "application/json";
  return config;
});

export default apiClient;
