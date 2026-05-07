import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const url = "http://localhost:8000/api/v1/";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const axiosInstance = axios.create({
  baseURL: url,
  timeout: 5000,
  headers: { "X-Custom-Header": "foobar" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error?: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

    if (!isUnauthorized || isRefreshRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: async () => {
            try {
              resolve(axiosInstance(originalRequest));
            } catch (e) {
              reject(e);
            }
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      await axios.post(`${url}auth/refresh`, {}, { withCredentials: true });

      processQueue();

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
