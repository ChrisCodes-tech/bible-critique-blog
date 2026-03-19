// ─── User ───────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
  avatar: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface PublicUser {
  id: number;
  username: string;
  avatar: string | null;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export type PostStatus = "draft" | "published";

export interface PostSummary {
  id: number;
  author: PublicUser;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  tags: Tag[];
  status: PostStatus;
  views: number;
  reading_time: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostDetail extends PostSummary {
  body: string;
}

export interface PostFormData {
  title: string;
  body: string;
  excerpt?: string;
  status: PostStatus;
  tag_ids: number[];
  cover_image?: File | null;
}

// ─── Comments ────────────────────────────────────────────────────────────────

export interface Reply {
  id: number;
  author: PublicUser;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post: number;
  author: PublicUser;
  parent: number | null;
  body: string;
  replies: Reply[];
  reply_count: number;
  is_flagged: boolean;
  created_at: string;
  updated_at: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
