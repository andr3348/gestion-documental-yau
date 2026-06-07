"use client";
import { useState } from "react";
import { SecretaryTramiteList } from "@/features/secretary/SecretaryTramiteList";
import { useMe } from "@/shared/hooks/useMe";
import { authApi } from "@/features/auth/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SecretaryDashboard() {
  const { me, loading } = useMe();
  const [refresh] = useState(0);
  const router = useRouter();

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };

  if (loading)
    return <p className="p-8 text-sm text-muted-foreground">Cargando...</p>;
  if (!me || me.role !== "SECRETARY") {
    router.push("/login");
    return null;
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Trámites del Área</h1>
          <p className="text-sm text-muted-foreground">
            Bienvenido, {me.fullName}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Salir
        </Button>
      </div>

      <SecretaryTramiteList refresh={refresh} />
    </main>
  );
}
