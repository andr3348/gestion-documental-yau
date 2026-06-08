import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Shield, Users } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: FileText,
    title: "Trámites digitales",
    desc: "Sube tus documentos PDF y da seguimiento a tus solicitudes desde cualquier lugar.",
  },
  {
    icon: Sparkles,
    title: "Clasificación con IA",
    desc: "Cada trámite se clasifica automáticamente al área municipal correspondiente.",
  },
  {
    icon: Shield,
    title: "Gestión segura",
    desc: "Autenticación segura y roles diferenciados para ciudadanos y secretarios.",
  },
  {
    icon: Users,
    title: "Roles y áreas",
    desc: "Los secretarios municipales gestionan los trámites de su área en tiempo real.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="size-3.5" />
            Clasificación inteligente de trámites
          </div>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Gestión documental
            <span className="block text-muted-foreground mt-1">
              municipal simplificada
            </span>
          </h1>
          <p className="max-w-lg mt-4 text-base text-muted-foreground">
            Presenta y da seguimiento a tus trámites municipales. La inteligencia
            artificial los clasifica automáticamente al área correcta.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <Link href="/register">
              <Button size="lg">Comenzar</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border p-5 transition-colors hover:bg-muted/50"
              >
                <div className="mb-3 flex size-9 items-center justify-center rounded-lg border bg-background">
                  <f.icon className="size-4 text-foreground" />
                </div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Gestión Documental Municipal
      </footer>
    </>
  );
}
