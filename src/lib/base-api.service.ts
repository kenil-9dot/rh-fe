import { api } from "@/lib/axios";
import type { AxiosRequestConfig, Method } from "axios";

/**
 * Base API service with CRUD-style HTTP methods.
 * Extend this class and set `basePath` to build entity-specific services.
 */
export abstract class BaseApiService {
  protected abstract readonly basePath: string;

  /** Build full URL for a path segment (e.g. '' -> basePath, '1' or '/1' -> basePath/1) */
  protected url(path = ""): string {
    if (!path) return this.basePath;
    const segment = path.startsWith("/") ? path : `/${path}`;
    return `${this.basePath}${segment}`;
  }

  /** Low-level request - override in subclasses if you need custom behavior */
  protected async request<T>(
    method: Method,
    path: string,
    config?: AxiosRequestConfig & { data?: unknown; params?: Record<string, unknown> }
  ): Promise<T> {
    const { data, params, ...rest } = config ?? {};
    const response = await api.request<T>({
      method,
      url: this.url(path),
      data,
      params,
      ...rest,
    });
    return response.data;
  }

  protected get<T>(path = "", params?: Record<string, unknown>): Promise<T> {
    return this.request<T>("GET", path, { params });
  }

  protected post<T, D = unknown>(path = "", data?: D): Promise<T> {
    return this.request<T>("POST", path, { data });
  }

  protected put<T, D = unknown>(path = "", data?: D): Promise<T> {
    return this.request<T>("PUT", path, { data });
  }

  protected patch<T, D = unknown>(path = "", data?: D): Promise<T> {
    return this.request<T>("PATCH", path, { data });
  }

  protected delete<T = void>(path = ""): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}
