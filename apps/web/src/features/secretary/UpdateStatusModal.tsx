"use client";
import { useState } from "react";
import { secretaryApi } from "./api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { TramiteStatusBadge } from "../tramite/TramiteStatusBadge";

interface Props {
  tramiteId: string;
  tramiteTitle: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateStatusModal({
  tramiteId,
  tramiteTitle,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [status, setStatus] = useState("IN_REVIEW");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (status === "REJECTED" && !comment.trim()) {
      return setError("El motivo es obligatorio al rechazar");
    }
    setLoading(true);
    setError("");
    try {
      await secretaryApi.updateStatus(tramiteId, status, comment || undefined);
      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base font-medium">
            Actualizar estado
          </DialogTitle>
          <DialogDescription className="line-clamp-1">
            {tramiteTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-center gap-3 py-2">
            <TramiteStatusBadge status="CLASSIFIED" />
            <ArrowRight className="size-4 text-muted-foreground" />
            <TramiteStatusBadge status={status} />
          </div>

          <div className="space-y-1.5">
            <Label>Nuevo estado</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v ?? "IN_REVIEW")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_REVIEW">En revisión</SelectItem>
                <SelectItem value="RESOLVED">Resuelto</SelectItem>
                <SelectItem value="REJECTED">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>
              {status === "REJECTED"
                ? "Motivo (obligatorio)"
                : "Comentario (opcional)"}
            </Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder={
                status === "REJECTED"
                  ? "Indica el motivo del rechazo..."
                  : "Agrega un comentario (opcional)..."
              }
            />
          </div>

          {error && (
            <p className="text-sm text-destructive flex items-center gap-1.5">
              <AlertTriangle className="size-3.5" />
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Guardando..."
              : status === "REJECTED"
                ? "Rechazar trámite"
                : "Confirmar cambio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
