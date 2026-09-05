"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { artisanAuth } from "@/lib/artisanAuth";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { useArtisanAuthStore } from "@/store/artisanAuthStore";

export default function ArtisanLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const syncFromCookies = useArtisanAuthStore((s) => s.syncFromCookies);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const result = await artisanAuth.login({ phone, password });
    if (result.success) {
      syncFromCookies();
      const callback = searchParams.get("callbackUrl");
      if (result.status === "pending") {
        router.push("/artisan/pending");
      } else if (callback?.startsWith("/artisan")) {
        router.push(callback);
      } else {
        router.push("/artisan");
      }
    } else {
      setError(result.error ?? "Erreur de connexion");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-navy lg:bg-transparent">
      <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-navy p-12 lg:flex">
        <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-[400px] w-[400px] rounded-full border border-white/[0.04]" />
        <div className="pointer-events-none absolute right-[-60px] top-[35%] h-[180px] w-[180px] rounded-full border border-orange/10" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-orange">
            <Wrench size={18} className="text-white" />
          </div>
          <div>
            <div className="font-display text-[20px] font-extrabold text-white">
              DEPANNI<span className="text-orange">.ma</span>
            </div>
            <div className="text-[9px] uppercase tracking-[1.5px] text-white/30">Espace artisan</div>
          </div>
        </div>

        <div className="relative z-10">
          <DisplayTitle as="h1" size="display-2" className="mb-4 text-white">
            Recevez des
            <br />
            missions près
            <br />
            de chez <Accent>vous</Accent>
          </DisplayTitle>
          <p className="max-w-[300px] text-[14px] leading-[1.7] text-white/50">
            Rejoignez 280+ artisans qui développent leur activité avec DEPANNI.ma à El Jadida.
          </p>
        </div>

        <div className="relative z-10 rounded-2xl border border-white/[0.08] bg-white/[0.05] p-5">
          <div className="mb-3 flex items-center gap-1 text-orange">
            {"★★★★★".split("").map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
          <p className="mb-3 text-[13px] italic leading-[1.6] text-white/70">
            &quot;Depuis que je suis sur DEPANNI.ma, j&apos;ai doublé mes missions. L&apos;app est simple et
            les paiements sont toujours à temps.&quot;
          </p>
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[12px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #F05A1A, #FF7A3D)" }}
            >
              KA
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white">Khalid Amrani</div>
              <div className="text-[10px] text-white/40">Plombier · El Jadida · 200+ missions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 items-center justify-center bg-[#EDE8DF] p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[400px] rounded-2xl border border-dep-border bg-white p-8 shadow-[0_8px_40px_rgba(15,30,53,0.08)]"
        >
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-navy lg:hidden">
              <Wrench size={20} className="text-orange" />
            </div>
            <DisplayTitle as="h2" size="sm" className="mb-1 text-[22px]">
              Connexion Artisan
            </DisplayTitle>
            <p className="text-[13px] text-dep-gray">Accédez à votre espace professionnel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.4px] text-navy">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                  <span className="text-[13px]">🇲🇦</span>
                  <span className="border-r border-dep-border pr-2 text-[13px] text-dep-gray">+212</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 00 00 00 00"
                  className="w-full rounded-xl border border-dep-border bg-cream py-3 pl-[72px] pr-4 text-[14px] text-navy outline-none transition-all focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/[0.06]"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-[0.4px] text-navy">
                  Mot de passe
                </label>
                <Link href="/forgot-password" className="text-[12px] text-orange hover:text-orange-2">
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dep-gray" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-dep-border bg-cream py-3 pl-10 pr-10 text-[14px] text-navy outline-none transition-all focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/[0.06]"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dep-gray hover:text-navy"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-dep-red/15 bg-dep-red/[0.06] px-3 py-2.5"
              >
                <AlertCircle size={13} className="shrink-0 text-dep-red" />
                <span className="text-[12px] text-dep-red">{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-orange-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-5 border-t border-dep-border pt-4 text-center">
            <span className="text-[13px] text-dep-gray">Pas encore artisan ? </span>
            <Link href="/artisan/register" className="text-[13px] font-semibold text-orange hover:text-orange-2">
              Créer mon compte →
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
