"use client";
import { useRef, useState } from "react";
import { tramiteApi } from "./api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubmitTramiteForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Debes adjuntar un PDF");
    setLoading(true);
    setError("");
    try {
      await tramiteApi.submit(title, file);
      setSuccess(true);
      setTitle("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Nuevo trámite</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Asunto</Label>
            <Input
              placeholder="Ej: Solicitud de licencia de funcionamiento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label>Documento PDF</Label>
            <Input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && (
            <p className="text-sm text-green-600">
              Trámite enviado y clasificado correctamente.
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enviando y clasificando..." : "Enviar trámite"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
