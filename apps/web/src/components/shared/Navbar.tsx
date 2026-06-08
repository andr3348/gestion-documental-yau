"use client";
import { useMe } from "@/shared/hooks/useMe";
import { authApi } from "@/features/auth/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { me, loading } = useMe();
  const router = useRouter();

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-6 max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="font-semibold text-sm tracking-tight"
        >
          Gestión Documental
        </button>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-5 w-32 rounded bg-muted animate-pulse" />
          ) : me ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {me.fullName}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Iniciar sesión
              </Button>
              <Button size="sm" onClick={() => router.push("/register")}>
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
