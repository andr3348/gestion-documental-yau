import { apiClient } from "@/shared/api-client";

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export const departmentsApi = {
  getAll: () => apiClient<Department[]>("/departments"),
};
