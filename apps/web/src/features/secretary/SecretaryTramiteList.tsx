"use client";
import { useEffect, useState } from "react";
import { secretaryApi } from "./api";
import { Tramite } from "../tramite/api";
import { TramiteStatusBadge } from "../tramite/TramiteStatusBadge";
import { UpdateStatusModal } from "./UpdateStatusModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

  if (loading)
    return (
      <p className="text-sm text-muted-foreground">Cargando trámites...</p>
    );
  if (!tramites.length)
    return (
      <p className="text-sm text-muted-foreground">
        No hay trámites asignados a tu área.
      </p>
    );

  return (
    <>
      <div className="space-y-3">
        {tramites.map((t) => (
          <Card key={t.id}>
            <CardContent className="pt-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{t.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(t.createdAt).toLocaleDateString("es-PE")}
                  {t.aiConfidence != null && (
                    <span className="ml-2">
                      · IA: {(t.aiConfidence * 100).toFixed(0)}%
                    </span>
                  )}
                </p>
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
            </CardContent>
          </Card>
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
