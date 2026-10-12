/**
 * fetch 封装：统一解包 {code, message, data}，失败抛 ApiError（message 为后端中文提示，可直接 toast）。
 * 401 时广播 onUnauthorized，由 auth 模块清理登录态。
 */
const TOKEN_KEY = 'sample-mall.token';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

let unauthorizedHandler: (() => void) | null = null;

export function onUnauthorized(handler: () => void) {
  unauthorizedHandler = handler;
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', '网络异常，请检查后端服务是否启动');
  }
  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload || payload.code !== 'OK') {
    if (res.status === 401) unauthorizedHandler?.();
    throw new ApiError(res.status, payload?.code ?? 'HTTP_' + res.status, payload?.message ?? '请求失败');
  }
  return payload.data as T;
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body ?? {}),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body ?? {}),
  del: <T>(path: string) => request<T>('DELETE', path),
};
