"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginAdmin } from "@/services/adminApi";
import { useAuthStore } from "@/store/authStore";

const STATS = [
  { value: "280+", label: "Artisans actifs" },
  { value: "4.8★", label: "Note moyenne" },
  { value: "<8min", label: "Tps réponse" },
];

const fadeLeft = (delay: number) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration: 0.5, ease: "easeOut" as const },
});

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState("admin@depanni.ma");
  const [password, setPassword] = useState("Depanni@2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const session = await loginAdmin(email.trim(), password);
      if (session.user.role !== "ADMIN") {
        setError("Accès réservé aux administrateurs");
        setIsLoading(false);
        return;
      }
      setSession(
        {
          id: session.user.id,
          email: session.user.email,
          phone: session.user.phone,
          role: session.user.role,
        },
        session.accessToken,
      );
      router.replace("/admin");
    } catch {
      setError("Email ou mot de passe incorrect");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-navy lg:bg-transparent">
      {/* Left — branding (desktop) */}
      <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-navy p-12 lg:flex">
        <div
          className="pointer-events-none absolute right-[-100px] top-[-100px] h-[400px] w-[400px]"
          style={{
            background:
              "radial-gradient(circle, rgba(240,90,26,0.08) 0%, transparent 65%)",
          }}
        />
        <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-[400px] w-[400px] rounded-full border border-white/[0.04]" />
        <div className="pointer-events-none absolute right-[-60px] top-[30%] h-[200px] w-[200px] rounded-full border border-orange/10" />

        <motion.div {...fadeLeft(0)} className="relative z-10 flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[12px] bg-orange">
            <Wrench size={20} className="text-white" />
            <div className="absolute bottom-0 left-0 right-0 h-[10px] bg-black/25" />
          </div>
          <div>
            <span className="font-syne text-xl font-extrabold tracking-[-0.5px] text-white">
              DEPANNI<span className="text-orange">.ma</span>
            </span>
            <div className="font-dm text-[10px] uppercase tracking-[1.5px] text-white/35">
              Admin Dashboard
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeLeft(0.15)} className="relative z-10">
          <h1 className="mb-4 font-syne text-[42px] font-extrabold leading-[1.05] tracking-[-2px] text-white">
            Gérez votre
            <br />
            plateforme
            <br />
            <span className="text-orange">en temps réel</span>
          </h1>
          <p className="max-w-[320px] font-dm text-[15px] font-light leading-[1.7] text-white/50">
            Tableau de bord centralisé pour piloter les missions, artisans, paiements et la
            satisfaction client sur DEPANNI.ma.
          </p>
        </motion.div>

        <motion.div {...fadeLeft(0.3)} className="relative z-10 grid grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.08] bg-white/[0.05] p-4"
            >
              <div className="font-syne text-xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 text-[11px] text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right — form */}
      <div className="flex min-h-screen w-full flex-1 items-center justify-center bg-navy p-4 lg:w-[45%] lg:bg-page lg:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[400px] rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-[0_8px_40px_rgba(15,30,53,0.08)] lg:p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-navy lg:hidden">
              <Wrench size={22} className="text-orange" />
            </div>
            <h2 className="mb-1 font-syne text-[24px] font-extrabold tracking-[-0.5px] text-navy">
              Connexion Admin
            </h2>
            <p className="font-dm text-[13px] text-dep-gray">
              Accès réservé à l&apos;équipe DEPANNI.ma
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2 rounded-xl border border-dep-red/15 bg-dep-red/[0.06] px-3 py-2.5"
              >
                <AlertCircle size={14} className="shrink-0 text-dep-red" />
                <span className="font-dm text-[12px] text-dep-red">{error}</span>
              </motion.div>
            )}

            <div className="mb-4">
              <label className="mb-2 block font-dm text-[12px] font-semibold uppercase tracking-[0.4px] text-navy">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dep-gray"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#E5E0D8] bg-cream py-3 pl-10 pr-4 font-dm text-[14px] text-navy outline-none transition-all placeholder:text-dep-gray focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/[0.06]"
                  placeholder="admin@depanni.ma"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="font-dm text-[12px] font-semibold uppercase tracking-[0.4px] text-navy">
                  Mot de passe
                </label>
                <a
                  href="#"
                  className="font-dm text-[12px] text-orange hover:text-orange-2"
                  onClick={(e) => e.preventDefault()}
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dep-gray"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#E5E0D8] bg-cream py-3 pl-10 pr-12 font-dm text-[14px] text-navy outline-none transition-all focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/[0.06]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dep-gray hover:text-navy"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3.5 font-dm text-[15px] font-semibold text-white transition-colors hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>

            <div className="flex items-center gap-2 rounded-xl border border-orange/15 bg-orange/[0.06] px-4 py-3">
              <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green" />
              <span className="font-dm text-[12px] text-navy">
                <span className="font-semibold">Accès démo :</span> admin@depanni.ma / Depanni@2026!
              </span>
            </div>
          </form>

          <div className="mt-6 border-t border-[#E5E0D8] pt-5 text-center">
            <p className="font-dm text-[11px] text-dep-gray">
              🔒 Connexion sécurisée SSL · DEPANNI.ma © 2026
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
