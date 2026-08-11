import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { getCsrfToken } from "./csrf";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

interface CustomAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
}

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest =
      error.config as CustomAxiosRequestConfig;

    // Only handle 401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't retry the same request twice
    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    // Don't refresh if refresh endpoint itself failed
    if (originalRequest.url?.includes("/auth/refresh/")) {
      return Promise.reject(error);
    }

    // If another request is already refreshing,
    // wait for it to finish.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then(() => {
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Get CSRF token
      const csrfToken = await getCsrfToken();

      // Ask Django for a new access token
      await api.post(
        "/auth/refresh/",
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      // Tell queued requests refresh succeeded
      processQueue();

      // Retry original request
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed
      processQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;