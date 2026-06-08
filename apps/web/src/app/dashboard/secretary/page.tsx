"use client";
import { useState } from "react";
import { SecretaryTramiteList } from "@/features/secretary/SecretaryTramiteList";
import { useMe } from "@/shared/hooks/useMe";
import { useRouter } from "next/navigation";

export default function SecretaryDashboard() {
  const { me, loading } = useMe();
  const [refresh] = useState(0);
  const router = useRouter();

  if (loading)
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );

  if (!me || me.role !== "SECRETARY") {
    router.push("/login");
    return null;
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Trámites del Área
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Bienvenido, {me.fullName}
        </p>
      </div>

      <SecretaryTramiteList refresh={refresh} />
    </main>
  );
}
