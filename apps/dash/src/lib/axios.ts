import axios from "axios";

const workersClient = axios.create({
  baseURL: import.meta.env.VITE_WORKERS_URL,
});

export interface BaseResponse {
  code: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error: boolean;
  message: string;
  success: boolean;
}

export interface SuccessResponse<T> extends BaseResponse {
  data: T;
  error: false;
  success: true;
}

export interface ErrorResponse extends BaseResponse {
  data: null;
  error: true;
  success: false;
}

workersClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  else {
    const contentType = config.headers["Content-Type"];
    config.headers["Content-Type"] = contentType ?? "application/json";
  }

  config.headers.Accept = config.headers.Accept ?? "application/json";
  return config;
});

export default workersClient;
