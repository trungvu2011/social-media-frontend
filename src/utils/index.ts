// Shared API utilities and types

export type User = {
  id: string;
  email: string;
  userName?: string;
  fullName?: string;
  avatar?: string;
  backgroundImage?: string;
};

export type Post = {
  _id: string;
  authorId: string;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  visibility: string;
  createdAt: string;
  updatedAt: string;
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

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      body == null
        ? undefined
        : isFormData
        ? (body as FormData)
        : JSON.stringify(body),
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

export async function createPost(
  content: string,
  images: File[] = []
): Promise<Post> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  if (images.length > 0) {
    const fd = new FormData();
    fd.append("content", content);
    images.forEach((f) => fd.append("images", f));
    return api<Post>(`/posts/`, {
      method: "POST",
      body: fd,
      token: token || undefined,
    });
  }

  return api<Post>(`/posts/`, {
    method: "POST",
    body: { content, images: [] },
    token: token || undefined,
  });
}

// ---------- Posts (GET list) ----------
export type BackendAuthor = {
  _id: string;
  userName: string;
  fullName?: string;
  avatar?: string;
};

export type BackendPostListItem = {
  _id: string;
  authorId: BackendAuthor;
  content?: string;
  text?: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  visibility: string;
  createdAt: string;
  updatedAt: string;
};

export type GetAllPostsResponse = {
  data: BackendPostListItem[];
  meta: { total: number; page: number; limit: number; pages: number };
};

export async function getAllPosts(
  params: {
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "updatedAt" | "likeCount" | "commentCount";
    order?: "asc" | "desc";
    search?: string;
    authorId?: string;
  } = {}
): Promise<GetAllPostsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.order) query.set("order", params.order);
  if (params.search) query.set("search", params.search);
  if (params.authorId) query.set("authorId", params.authorId);

  const qs = query.toString();
  const path = `/posts${qs ? `?${qs}` : ""}`;
  return api<GetAllPostsResponse>(path, { method: "GET" });
}

// Get posts from users that current user follows
export async function getFollowedPosts(): Promise<GetAllPostsResponse> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  return api<GetAllPostsResponse>(`/posts/followed`, {
    method: "GET",
    token: token || undefined,
  });
}

// ---------- User Profile API ----------
export type UserProfile = {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
  avatar?: string;
  backgroundImage?: string;
  bio?: string;
  genre?: string;
  birthday?: string;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getProfile(): Promise<UserProfile> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  return api<UserProfile>(`/users/profile`, {
    method: "GET",
    token: token || undefined,
  });
}

export async function getProfileById(userId: string): Promise<UserProfile> {
  return api<UserProfile>(`/users/${userId}/profile`, { method: "GET" });
}

// ---------- Follow API ----------
export type FollowUser = {
  _id: string;
  followerId: string;
  followingId: {
    _id: string;
    userName: string;
    fullName?: string;
    avatar?: string;
  };
  createdAt: string;
};

export async function getFollowing(userId: string): Promise<FollowUser[]> {
  return api<FollowUser[]>(`/follows/following/${userId}`, { method: "GET" });
}

export async function getFollowers(userId: string): Promise<FollowUser[]> {
  return api<FollowUser[]>(`/follows/followers/${userId}`, { method: "GET" });
}

export async function followUser(userId: string): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/follows/`, {
    method: "POST",
    body: { followingId: userId },
    token: token || undefined,
  });
}

// ---------- Like API ----------
export async function likePost(postId: string): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/posts/${postId}/like`, {
    method: "POST",
    token: token || undefined,
  });
}

export async function unlikePost(postId: string): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/posts/${postId}/like`, {
    method: "DELETE",
    token: token || undefined,
  });
}