import { apiClient } from "@/shared/api-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const tramiteApi = {
  submit: async (title: string, file: File) => {
    const form = new FormData();
    form.append("title", title);
    form.append("file", file);
    const res = await fetch(`${BASE_URL}/tramites`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message);
    }
    return res.json();
  },

  getMine: () => apiClient<Tramite[]>("/tramites/my"),
};

export interface Tramite {
  id: string;
  title: string;
  status: string;
  departmentId: string | null;
  aiConfidence: number | null;
  createdAt: string;
}
