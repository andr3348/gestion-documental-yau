"use client";
import { useEffect, useState } from "react";
import { tramiteApi, Tramite } from "./api";
import { TramiteStatusBadge } from "./TramiteStatusBadge";
import { FileText, Brain } from "lucide-react";

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-xl border p-4 space-y-2 animate-pulse"
        >
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function TramiteList({ refresh }: { refresh: number }) {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    tramiteApi
      .getMine()
      .then(setTramites)
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) return <Skeleton />;

  if (!tramites.length)
    return (
      <div className="rounded-xl border border-dashed p-8 text-center">
        <FileText className="size-8 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          No tienes trámites aún.
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Usa el formulario de arriba para enviar tu primer trámite.
        </p>
      </div>
    );

  return (
    <div className="space-y-2">
      {tramites.map((t) => (
        <div
          key={t.id}
          className="rounded-xl border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{t.title}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                <span>
                  {new Date(t.createdAt).toLocaleDateString("es-PE", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {t.aiConfidence != null && (
                  <span className="inline-flex items-center gap-1">
                    <Brain className="size-3" />
                    {(t.aiConfidence * 100).toFixed(0)}% confianza
                  </span>
                )}
              </div>
            </div>
            <TramiteStatusBadge status={t.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
