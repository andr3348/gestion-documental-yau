import { Navbar } from "@/components/shared/Navbar";
import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <LoginForm />
      </main>
    </>
  );
}
