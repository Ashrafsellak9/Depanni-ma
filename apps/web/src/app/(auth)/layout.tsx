import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">
      <Link href="/" className="mb-8 text-2xl font-bold text-navy">
        DEPANNI<span className="text-primary">.ma</span>
      </Link>
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">{children}</div>
    </div>
  );
}
