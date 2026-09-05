import { AdminLoginBranding } from "@/components/login/AdminLoginBranding";
import { AdminLoginForm } from "@/components/login/AdminLoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { reset?: string };
}) {
  return (
    <main className="flex min-h-screen flex-col bg-navy lg:flex-row lg:bg-transparent">
      <AdminLoginBranding />
      <AdminLoginForm resetSuccess={searchParams?.reset === "1"} />
    </main>
  );
}
