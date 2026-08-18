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

//let isRefreshing = false;
let isRedirectingToLogin = false;

const redirectToLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  // Prevent repeated redirects
  if (isRedirectingToLogin) {
    return;
  }

  // Don't redirect if already on login
  if (window.location.pathname === "/login") {
    return;
  }

  isRedirectingToLogin = true;

  window.location.replace("/login");
};

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

    // No request config
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Don't retry the same request twice
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Refresh endpoint itself failed
    if (originalRequest.url?.includes("/auth/refresh/")) {
      redirectToLogin();

      return Promise.reject(error);
    }

    // Another request is already refreshing
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
      const csrfToken = await getCsrfToken();

      await api.post(
        "/auth/refresh/",
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      // Refresh succeeded
      processQueue();

      // Retry original request
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed
      processQueue(refreshError);

      // User is no longer authenticated
      redirectToLogin();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;