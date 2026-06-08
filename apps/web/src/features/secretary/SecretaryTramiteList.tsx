"use client";
import { useEffect, useState } from "react";
import { secretaryApi } from "./api";
import { Tramite } from "../tramite/api";
import { TramiteStatusBadge } from "../tramite/TramiteStatusBadge";
import { UpdateStatusModal } from "./UpdateStatusModal";
import { Button } from "@/components/ui/button";
import { FileText, Brain } from "lucide-react";

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border p-4 space-y-2 animate-pulse"
        >
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/4 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function SecretaryTramiteList({ refresh }: { refresh: number }) {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Tramite | null>(null);
  const [localRefresh, setLocalRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    secretaryApi
      .getTramites()
      .then(setTramites)
      .finally(() => setLoading(false));
  }, [refresh, localRefresh]);

  if (loading) return <Skeleton />;

  if (!tramites.length)
    return (
      <div className="rounded-xl border border-dashed p-8 text-center">
        <FileText className="size-8 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          No hay trámites asignados a tu área.
        </p>
      </div>
    );

  return (
    <>
      <div className="space-y-2">
        {tramites.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{t.title}</p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                  <span>
                    {new Date(t.createdAt).toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  {t.aiConfidence != null && (
                    <span className="inline-flex items-center gap-1">
                      <Brain className="size-3" />
                      {(t.aiConfidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <TramiteStatusBadge status={t.status} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelected(t)}
                >
                  Gestionar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <UpdateStatusModal
          tramiteId={selected.id}
          tramiteTitle={selected.title}
          open={!!selected}
          onClose={() => setSelected(null)}
          onSuccess={() => setLocalRefresh((n) => n + 1)}
        />
      )}
    </>
  );
}
