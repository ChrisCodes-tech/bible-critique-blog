import apiClient from "./client";
import type { Comment } from "../types";

export const commentsApi = {
  list: (postId: number) =>
    apiClient.get<Comment[]>(`/comments/posts/${postId}/`),

  create: (postId: number, body: string, parentId?: number) =>
    apiClient.post<Comment>(`/comments/posts/${postId}/`, {
      post: postId,
      body,
      parent: parentId ?? null,
    }),

  update: (commentId: number, body: string) =>
    apiClient.patch<Comment>(`/comments/${commentId}/`, { body }),

  remove: (commentId: number) =>
    apiClient.delete(`/comments/${commentId}/`),
};
