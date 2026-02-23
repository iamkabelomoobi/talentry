import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const requestUrl = originalRequest?.url ?? "";
    const isAuthRequest =
      requestUrl.includes("/api/auth/sign-in") ||
      requestUrl.includes("/api/auth/sign-up") ||
      requestUrl.includes("/api/auth/request-password-reset") ||
      requestUrl.includes("/api/auth/reset-password");
    const hasBearerToken = Boolean(originalRequest?.headers?.Authorization);

    if (
      error.response?.status === 401 &&
      !isAuthRequest &&
      hasBearerToken &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post("/api/auth/refresh");
        const newToken = data.token;

        if (typeof window !== "undefined") {
          localStorage.setItem("token", newToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/auth/sign-in";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
