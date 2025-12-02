import axios, { type AxiosError, type AxiosResponse } from "axios";
import { AUTH_TOKEN_KEY } from "@/constants";

export interface ApiError {
  message: string[];
  status: number;
  error: AxiosError;
  response?: AxiosResponse;
}

function resolveBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (envUrl && envUrl.length > 0) return envUrl;
  // Fallback to current origin in dev if not provided
  return window.location.origin;
}

export const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params: Record<string, unknown>) => {
    return Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value) && value.length === 0) return "";
        if (typeof value === "object" && value !== null) {
          return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
        }
        return `${key}=${encodeURIComponent(String(value))}`;
      })
      .filter(Boolean)
      .join("&");
  },
});

// Attach auth token from localStorage if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError): Promise<ApiError> => {
    const errorResponse = error.response?.data as
      | {
          error?: string;
          message?: string | string[];
          status?: number;
        }
      | undefined;

    let message: string[] = [error.message || "Request failed"];
    if (errorResponse?.error) {
      message = [errorResponse.error];
    } else if (errorResponse?.message) {
      message = Array.isArray(errorResponse.message)
        ? errorResponse.message
        : [errorResponse.message];
    }

    const apiError: ApiError = {
      error,
      response: error.response,
      status: error.response?.status || errorResponse?.status || 500,
      message,
    };

    // If unauthorized, clear token and redirect to login
    if (apiError.status === 401) {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(AUTH_TOKEN_KEY);
          const pathname = window.location.pathname;
          const isAuthRoute = pathname.startsWith("/auth");
          if (!isAuthRoute) {
            // Use replace to avoid polluting history
            window.location.replace("/auth/login");
          }
        } else {
          // Fallback for non-browser environments
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      } catch (_) {
        // no-op: best effort cleanup
      }
    }

    return Promise.reject(apiError);
  },
);
