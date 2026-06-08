"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "./api";
import { departmentsApi, type Department } from "../departments/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    dni: "",
    phone: "",
    role: "CITIZEN",
    departmentId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  useEffect(() => {
    if (form.role !== "SECRETARY") return;
    setDepartmentsLoading(true);
    departmentsApi
      .getAll()
      .then(setDepartments)
      .catch(() => {})
      .finally(() => setDepartmentsLoading(false));
  }, [form.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.role === "SECRETARY" && !form.departmentId) {
      setError("Debes seleccionar un área municipal");
      setLoading(false);
      return;
    }

    try {
      await authApi.register({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        dni: form.dni,
        phone: form.phone || undefined,
        role: form.role as "CITIZEN" | "SECRETARY",
        departmentId: form.departmentId || undefined,
      });
      router.push("/login");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              value={form.dni}
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono (opcional)</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role">Tipo de cuenta</Label>
            <Select
              value={form.role}
              onValueChange={(v) =>
                setForm({ ...form, role: v ?? "CITIZEN", departmentId: "" })
              }
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CITIZEN">Ciudadano</SelectItem>
                <SelectItem value="SECRETARY">Secretario Municipal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.role === "SECRETARY" && (
            <div className="space-y-1.5">
              <Label htmlFor="department">Área municipal</Label>
              {departmentsLoading ? (
                <div className="h-10 rounded-lg border bg-muted animate-pulse" />
              ) : (
                <Select
                  value={form.departmentId}
                  onValueChange={(v) =>
                    setForm({ ...form, departmentId: v ?? "" })
                  }
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Selecciona un área" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="size-3.5 text-muted-foreground" />
                          {d.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-destructive" />
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Inicia sesión
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
