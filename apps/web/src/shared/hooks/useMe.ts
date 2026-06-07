"use client";
import { useEffect, useState } from "react";
import { apiClient } from "../api-client";

interface Me {
  id: string;
  email: string;
  fullName: string;
  role: "CITIZEN" | "SECRETARY" | "ADMIN";
  departmentId: string | null;
}

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient<Me>("/auth/me")
      .then(setMe)
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  return { me, loading };
}
