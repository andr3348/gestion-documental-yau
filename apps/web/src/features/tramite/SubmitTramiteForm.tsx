"use client";
import { useRef, useState } from "react";
import { tramiteApi } from "./api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2 } from "lucide-react";

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
      setTimeout(() => setSuccess(false), 4000);
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
          <div className="space-y-1.5">
            <Label htmlFor="title">Asunto</Label>
            <Input
              id="title"
              placeholder="Ej: Solicitud de licencia de funcionamiento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Documento PDF</Label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dropped = e.dataTransfer.files?.[0];
                if (dropped?.type === "application/pdf") {
                  setFile(dropped);
                  setError("");
                } else {
                  setError("Solo se aceptan archivos PDF");
                }
              }}
              className="relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:border-muted-foreground/30 has-[input:focus]:border-ring"
            >
              <Input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f && f.type !== "application/pdf") {
                    setError("Solo se aceptan archivos PDF");
                    return;
                  }
                  setFile(f);
                  setError("");
                }}
                required
              />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <FileText className="size-4 text-primary" />
                  <span className="font-medium truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                  <Upload className="size-5" />
                  <span>Haz clic o arrastra un PDF aquí</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-destructive" />
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 flex items-center gap-1.5">
              <CheckCircle2 className="size-4" />
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
