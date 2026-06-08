import { Navbar } from "@/components/shared/Navbar";
import { RegisterForm } from "@/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <RegisterForm />
      </main>
    </>
  );
}
