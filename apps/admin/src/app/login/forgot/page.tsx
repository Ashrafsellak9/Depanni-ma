import { AdminForgotPasswordForm } from "@/components/login/AdminForgotPasswordForm";
import { AdminLoginBranding } from "@/components/login/AdminLoginBranding";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col bg-navy lg:flex-row lg:bg-transparent">
      <AdminLoginBranding />
      <AdminForgotPasswordForm />
    </main>
  );
}
