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
  likes: string[];
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

export async function googleLogin(
  credential: string
): Promise<LoginSuccessResponse> {
  return api<LoginSuccessResponse>(`/users/google-login`, {
    method: "POST",
    body: { credential },
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

export async function getPostById(id: string): Promise<BackendPostListItem> {
  return api<BackendPostListItem>(`/posts/${id}`, { method: "GET" });
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
  likes: string[];
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

export async function deletePost(id: string): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/posts/${id}`, {
    method: "DELETE",
    token: token || undefined,
  });
}

export type AdminStats = {
  totalUsers: number;
  totalPosts: number;
  userGrowth: { _id: string; count: number }[];
  postGrowth: { _id: string; count: number }[];
};

export async function getAdminStats(): Promise<AdminStats> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  return api<AdminStats>(`/users/stats`, {
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
  postCount?: number;
  role?: "user" | "admin";
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

export async function getProfileByUserName(
  username: string
): Promise<UserProfile> {
  return api<UserProfile>(`/users/username/${username}`, { method: "GET" });
}

// Update user profile
export type UpdateProfileData = {
  userName?: string;
  fullName?: string;
  email?: string;
  bio?: string;
  genre?: string;
  birthday?: string;
  avatar?: File;
  backgroundImage?: File;
};

export async function updateProfile(
  data: UpdateProfileData
): Promise<UserProfile> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  // Use FormData for file upload
  const fd = new FormData();
  if (data.userName) fd.append("userName", data.userName);
  if (data.fullName) fd.append("fullName", data.fullName);
  if (data.email) fd.append("email", data.email);
  if (data.bio) fd.append("bio", data.bio);
  if (data.genre) fd.append("genre", data.genre);
  if (data.birthday) fd.append("birthday", data.birthday);
  if (data.avatar) fd.append("avatar", data.avatar);
  if (data.backgroundImage) fd.append("backgroundImage", data.backgroundImage);

  return api<UserProfile>(`/users/profile`, {
    method: "PUT",
    body: fd,
    token: token || undefined,
  });
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  return api<UserProfile[]>(`/users`, {
    method: "GET",
    token: token || undefined,
  });
}

export async function deleteUser(userId: string): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/users/${userId}`, {
    method: "DELETE",
    token: token || undefined,
  });
}

// ---------- Follow API ----------
// Because controller maps to followerId/followingId which are populated User objects
export type FollowUser = {
  followingId: any;
  _id: string;
  userName: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  backgroundImage?: string;
  birthday?: string;
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

export async function unfollowUser(userId: string): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/follows/${userId}`, {
    method: "DELETE",
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

// Get posts liked by user
export async function getLikedPosts(
  userId: string
): Promise<GetAllPostsResponse> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  return api<GetAllPostsResponse>(`/likes/user/${userId}/posts`, {
    method: "GET",
    token: token || undefined,
  });
}

// ---------- Comment API ----------
export type Comment = {
  _id: string;
  authorId: {
    _id: string;
    userName: string;
    fullName: string;
    avatar?: string;
  };
  content: string; // Backend uses 'content', not 'text'
  image?: string;
  createdAt: string;
};

export type GetCommentsResponse = {
  data: Comment[];
  meta: { total: number; page: number; limit: number; pages: number };
};

export type GetSuggestionsResponse = {
  success: boolean;
  data: UserProfile[];
  debug?: any;
};

export async function getPostComments(
  postId: string,
  params: { page?: number; limit?: number } = {}
): Promise<GetCommentsResponse> {
  const query = new URLSearchParams();
  query.set("postId", postId);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return api<GetCommentsResponse>(`/comments?${query.toString()}`, {
    method: "GET",
  });
}

export async function addComment(
  postId: string,
  content: string,
  image?: File
): Promise<{ success: true; data: Comment }> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  if (image) {
    const fd = new FormData();
    fd.append("postId", postId);
    fd.append("content", content);
    fd.append("image", image);

    return api<{ success: true; data: Comment }>(`/comments`, {
      method: "POST",
      body: fd,
      token: token || undefined,
    });
  }

  return api<{ success: true; data: Comment }>(`/comments`, {
    method: "POST",
    body: { postId, content },
    token: token || undefined,
  });
}

export async function deleteComment(commentId: string): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/comments/${commentId}`, {
    method: "DELETE",
    token: token || undefined,
  });
}

export async function getFriendSuggestions(): Promise<GetSuggestionsResponse> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  return api<GetSuggestionsResponse>(`/follows/suggestions`, {
    method: "GET",
    token: token || undefined,
  });
}

// ---------- Notification API ----------
export type Notification = {
  _id: string;
  type: "like" | "comment" | "follow";
  senderId: {
    userName: string;
    fullName?: string;
    avatar?: string;
  };
  receiverId: string;
  isRead: boolean;
  content: string;
  referenceId?: string;
  createdAt: string;
};

export async function getNotifications(): Promise<Notification[]> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  return api<Notification[]>(`/notifications/`, {
    method: "GET",
    token: token || undefined,
  });
}

export async function markNotificationRead(id: string): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/notifications/${id}/read`, {
    method: "PUT",
    token: token || undefined,
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/notifications/read-all`, {
    method: "PUT",
    token: token || undefined,
  });
}

// ---------- Report API ----------
export async function createReport(
  postId: string,
  reason: string,
  details?: string
): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/reports`, {
    method: "POST",
    body: { postId, reason, details },
    token: token || undefined,
  });
}

export type Report = {
  _id: string;
  reporterId: {
    _id: string;
    userName: string;
    fullName: string;
    avatar?: string;
  };
  postId: {
    _id: string;
    text?: string;
    content?: string;
    images?: string[];
    authorId: {
      fullName: string;
      userName: string;
      avatar?: string;
    };
    createdAt: string;
  };
  reason: string;
  details?: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
};

export type GetReportsResponse = {
  reports: Report[];
  currentPage: number;
  totalPages: number;
  totalReports: number;
};

export async function getReports(
  page: number = 1,
  limit: number = 10,
  status?: string
): Promise<GetReportsResponse> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (status) query.set("status", status);

  return api<GetReportsResponse>(`/reports?${query.toString()}`, {
    method: "GET",
    token: token || undefined,
  });
}

export async function updateReportStatus(
  reportId: string,
  status: "resolved" | "dismissed"
): Promise<void> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  await api(`/reports/${reportId}`, {
    method: "PATCH",
    body: { status },
    token: token || undefined,
  });
}

// ---------- Chat API ----------
export type ChatUser = {
  _id: string;
  userName: string;
  fullName?: string;
  avatar?: string;
};
export type ChatMessage = {
  _id: string;
  senderId: string;
  content: string;
  createdAt: string;
  conversationId: string;
  isDelivered?: boolean;
  isSeen?: boolean;
};
export type ChatConversation = {
  _id: string;
  members: ChatUser[];
  lastMessage?: ChatMessage;
  isDraft?: boolean;
};

export async function getUserConversations(): Promise<ChatConversation[]> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  return api<ChatConversation[]>(`/conversations`, {
    method: "GET",
    token: token || undefined,
  });
}
export async function getConversationMessages(
  conversationId: string,
  params: { page?: number; limit?: number } = {}
): Promise<{
  data: ChatMessage[];
  meta: { total: number; page: number; limit: number; pages: number };
}> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  return api<{
    data: ChatMessage[];
    meta: { total: number; page: number; limit: number; pages: number };
  }>(`/messages/${conversationId}?${query.toString()}`, {
    method: "GET",
    token: token || undefined,
  });
}
