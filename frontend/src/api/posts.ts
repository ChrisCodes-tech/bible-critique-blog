import apiClient from "./client";
import type { PaginatedResponse, PostSummary, PostDetail, Tag } from "../types";

export const postsApi = {
  list: (params?: {
    page?: number;
    search?: string;
    status?: string;
    tags__slug?: string;
    ordering?: string;
  }) => apiClient.get<PaginatedResponse<PostSummary>>("/blog/posts/", { params }),

  get: (slug: string) =>
    apiClient.get<PostDetail>(`/blog/posts/${slug}/`),

  create: (data: FormData) =>
    apiClient.post<PostDetail>("/blog/posts/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (slug: string, data: FormData) =>
    apiClient.patch<PostDetail>(`/blog/posts/${slug}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  remove: (slug: string) =>
    apiClient.delete(`/blog/posts/${slug}/`),

  tags: () => apiClient.get<Tag[]>("/blog/tags/"),

  createTag: (name: string) =>
    apiClient.post<Tag>("/blog/tags/", { name }),
};
