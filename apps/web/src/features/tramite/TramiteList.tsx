"use client";
import { useEffect, useState } from "react";
import { tramiteApi, Tramite } from "./api";
import { TramiteStatusBadge } from "./TramiteStatusBadge";
import { Card, CardContent } from "@/components/ui/card";

export function TramiteList({ refresh }: { refresh: number }) {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tramiteApi
      .getMine()
      .then(setTramites)
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading)
    return (
      <p className="text-sm text-muted-foreground">Cargando trámites...</p>
    );
  if (!tramites.length)
    return (
      <p className="text-sm text-muted-foreground">No tienes trámites aún.</p>
    );

  return (
    <div className="space-y-3">
      {tramites.map((t) => (
        <Card key={t.id}>
          <CardContent className="pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{t.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(t.createdAt).toLocaleDateString("es-PE")}
                {t.aiConfidence != null && (
                  <span className="ml-2">
                    · IA: {(t.aiConfidence * 100).toFixed(0)}% confianza
                  </span>
                )}
              </p>
            </div>
            <TramiteStatusBadge status={t.status} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
