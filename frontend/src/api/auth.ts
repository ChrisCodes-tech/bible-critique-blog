import apiClient from "./client";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "../types";

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login/", payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<User>("/auth/register/", payload),

  logout: (refresh: string) =>
    apiClient.post("/auth/logout/", { refresh }),

  getProfile: () =>
    apiClient.get<User>("/auth/profile/"),

  updateProfile: (data: Partial<User>) =>
    apiClient.patch<User>("/auth/profile/", data),
};
