import { apiClient } from "@/shared/api-client";
import { Tramite } from "../tramite/api";

export const secretaryApi = {
  getTramites: () => apiClient<Tramite[]>("/tramites/department"),

  updateStatus: (id: string, status: string, comment?: string) =>
    apiClient(`/tramites/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, comment }),
    }),
};
