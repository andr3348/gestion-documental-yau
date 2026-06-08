import { apiClient } from "@/shared/api-client";

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    dni: string;
    phone?: string;
    role?: "CITIZEN" | "SECRETARY";
    departmentId?: string;
  }) =>
    apiClient("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiClient("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  logout: () => apiClient("/auth/logout", { method: "POST" }),
};
