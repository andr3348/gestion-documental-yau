"use client";
import { useState } from "react";
import { SubmitTramiteForm } from "@/features/tramite/SubmitTramiteForm";
import { TramiteList } from "@/features/tramite/TramiteList";
import { useMe } from "@/shared/hooks/useMe";
import { useRouter } from "next/navigation";

export default function CitizenDashboard() {
  const { me, loading } = useMe();
  const [refresh, setRefresh] = useState(0);
  const router = useRouter();

  if (loading)
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-48 rounded-xl bg-muted animate-pulse" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );

  if (!me || me.role !== "CITIZEN") {
    router.push("/login");
    return null;
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Mis Trámites</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Bienvenido, {me.fullName}
        </p>
      </div>

      <SubmitTramiteForm onSuccess={() => setRefresh((n) => n + 1)} />

      <section>
        <h2 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
          Historial
        </h2>
        <TramiteList refresh={refresh} />
      </section>
    </main>
  );
}
