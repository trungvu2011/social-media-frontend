// Shared API utilities and types

export type User = {
  id: string;
  email: string;
  userName: string;
  fullName: string;
};

export type LoginSuccessResponse = {
  message: string;
  user: User;
  accessToken: string;
};

export type ApiErrorResponse = {
  message: string;
};

export type SignUpSuccessResponse = {
  user: User;
};

export const API_BASE: string =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8080/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function api<T = unknown>(
  path: string,
  options: {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    token?: string | null;
  } = {}
): Promise<T> {
  const { method = "GET", headers = {}, body, token } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const data = (await res.json().catch(() => ({}))) as
    | Partial<T & ApiErrorResponse>
    | {};

  if (!res.ok) {
    const message = (data as ApiErrorResponse)?.message || "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export async function login(
  email: string,
  password: string
): Promise<LoginSuccessResponse> {
  return api<LoginSuccessResponse>(`/users/login`, {
    method: "POST",
    body: { email, password },
  });
}

export async function signUp(
  userName: string,
  fullName: string,
  email: string,
  password: string
): Promise<SignUpSuccessResponse> {
  return api<SignUpSuccessResponse>(`/users/sign-up`, {
    method: "POST",
    body: { userName, fullName, email, password },
  });
}

export async function signOut(): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  try {
    await api(`/users/sign-out`, {
      method: "POST",
      token: token || undefined,
    });
  } catch (e) {
    console.warn("Sign out API failed:", e);
  }
}
