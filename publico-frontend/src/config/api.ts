// src/config/api.ts
import { getAuthToken } from '../utils/auth';

/** Base URL (Vite) */
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/** Extra options for the client */
export type ApiClientOptions = {
  baseURL?: string;
  /** Called on 401/403 if you want to force logout/redirect */
  onUnauthorized?: () => void;
  /** Default headers to send on every request */
  defaultHeaders?: Record<string, string>;
  /** Abort & fail after N ms (per request). 0/undefined = no timeout */
  timeoutMs?: number;
  /** Max automatic retries on network failures (not HTTP errors) */
  maxNetworkRetries?: number;
};

/** Allowed response types */
export type ResponseType = 'auto' | 'json' | 'text' | 'blob';

export type RequestOptions = Omit<RequestInit, 'body' | 'headers' | 'method'> & {
  method?: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
  /** Query params appended to the URL */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** If you pass FormData we won’t set Content-Type */
  body?: Record<string, unknown> | string | FormData | null | undefined;
  /** Merge with auto headers (auth, json) */
  headers?: Record<string, string>;
  /** How to parse the response. 'auto' inspects Content-Type. */
  responseType?: ResponseType;
  /** Override default timeout */
  timeoutMs?: number;
};

function buildURL(base: string, endpoint: string, params?: RequestOptions['params']): string {
  const url = new URL(endpoint.startsWith('http') ? endpoint : `${base}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function parseResponse<T>(res: Response, responseType: ResponseType = 'auto'): Promise<T> {
  if (res.status === 204) return undefined as unknown as T; // No Content

  // Determine parser
  let type = responseType;
  if (type === 'auto') {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) type = 'json';
    else if (ct.startsWith('text/')) type = 'text';
    else type = 'blob';
  }

  if (type === 'json') return (await res.json()) as T;
  if (type === 'text') return (await res.text()) as unknown as T;
  return (await res.blob()) as unknown as T;
}

function toErrorMessage(res: Response, fallback: string) {
  return `${fallback} (HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ''})`;
}

export class ApiClient {
  private baseURL: string;
  private onUnauthorized?: ApiClientOptions['onUnauthorized'];
  private defaultHeaders: Record<string, string>;
  private timeoutMs?: number;
  private maxNetworkRetries: number;

  constructor(opts: ApiClientOptions = {}) {
    this.baseURL = opts.baseURL ?? API_BASE_URL;
    this.onUnauthorized = opts.onUnauthorized;
    this.defaultHeaders = opts.defaultHeaders ?? {};
    this.timeoutMs = opts.timeoutMs;
    this.maxNetworkRetries = Math.max(0, opts.maxNetworkRetries ?? 1);
  }

  setBaseURL(url: string) { this.baseURL = url; }
  getBaseURL() { return this.baseURL; }

  private makeAbortSignal(timeoutMs?: number): AbortSignal | undefined {
    const ms = timeoutMs ?? this.timeoutMs;
    if (!ms || ms <= 0) return undefined;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    // @ts-expect-error patch signal to clear timeout when consumed
    controller.signal._clearTimeout = () => clearTimeout(id);
    return controller.signal;
  }

  private async doFetch<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const {
      method = 'GET',
      params,
      body,
      headers = {},
      responseType = 'auto',
      timeoutMs,
      signal,
      ...rest
    } = options;

    const url = buildURL(this.baseURL, endpoint, params);
    const token = getAuthToken();

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const isStringBody = typeof body === 'string';

    const finalHeaders: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...this.defaultHeaders,
      ...headers,
    };

    const reqInit: RequestInit = {
      method,
      headers: finalHeaders,
      body: isFormData ? body as FormData : isStringBody ? (body as string) : body ? JSON.stringify(body) : undefined,
      // Prefer provided signal; else create one from timeout
      signal: signal ?? this.makeAbortSignal(timeoutMs),
      ...rest,
    };

    let attempt = 0;
    // simple retry loop for network errors (fetch throws)
    while (true) {
      try {
        const res = await fetch(url, reqInit);

        if (!res.ok) {
          // Unauthorized hooks
          if (res.status === 401 || res.status === 403) {
            try { this.onUnauthorized?.(); } catch {}
          }

          // Try to extract error message
          let msg = toErrorMessage(res, 'Request failed');
          try {
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
              const j = await res.json();
              msg = (j?.message || j?.error || msg);
            } else {
              const t = await res.text();
              if (t) msg = t;
            }
          } catch {}
          throw new Error(msg);
        }

        // Success
        const data = await parseResponse<T>(res, responseType);
        // Clear timeout if we created one
        // @ts-expect-error see makeAbortSignal
        reqInit.signal?._clearTimeout?.();
        return data;
      } catch (err: any) {
        const isAbort = err?.name === 'AbortError';
        const isNetwork = !isAbort && (err instanceof TypeError || err?.message === 'Failed to fetch');

        if (isNetwork && attempt < this.maxNetworkRetries) {
          attempt += 1;
          continue; // retry
        }

        // @ts-expect-error see makeAbortSignal
        reqInit.signal?._clearTimeout?.();
        throw err;
      }
    }
  }

  get<T>(endpoint: string, opts: Omit<RequestOptions, 'method'|'body'> = {}) {
    return this.doFetch<T>(endpoint, { ...opts, method: 'GET' });
  }
  delete<T>(endpoint: string, opts: Omit<RequestOptions, 'method'|'body'> = {}) {
    return this.doFetch<T>(endpoint, { ...opts, method: 'DELETE' });
  }
  post<T>(endpoint: string, body?: RequestOptions['body'], opts: Omit<RequestOptions, 'method'|'body'> = {}) {
    return this.doFetch<T>(endpoint, { ...opts, method: 'POST', body });
  }
  put<T>(endpoint: string, body?: RequestOptions['body'], opts: Omit<RequestOptions, 'method'|'body'> = {}) {
    return this.doFetch<T>(endpoint, { ...opts, method: 'PUT', body });
  }
  patch<T>(endpoint: string, body?: RequestOptions['body'], opts: Omit<RequestOptions, 'method'|'body'> = {}) {
    return this.doFetch<T>(endpoint, { ...opts, method: 'PATCH', body });
  }

  /** Convenience for file uploads */
  upload<T>(endpoint: string, form: FormData, opts: Omit<RequestOptions, 'method'|'body'|'headers'> = {}) {
    return this.doFetch<T>(endpoint, { ...opts, method: 'POST', body: form, headers: {} });
  }

  /** Convenience for downloads (get as Blob) */
  async download(endpoint: string, opts: Omit<RequestOptions, 'method'|'responseType'> = {}) {
    return this.doFetch<Blob>(endpoint, { ...opts, method: 'GET', responseType: 'blob' });
  }
}

/** Singleton instance */
export const apiClient = new ApiClient({
  baseURL: API_BASE_URL,
  timeoutMs: 20_000,          // 20s default timeout
  maxNetworkRetries: 1,       // retry once on network error
  onUnauthorized: () => {
    // optional: wipe tokens or redirect
    // localStorage.removeItem('publico_auth_token');
    // window.location.href = '/login';
  },
});
