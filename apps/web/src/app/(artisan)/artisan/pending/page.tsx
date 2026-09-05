"use client";

import { motion } from "framer-motion";
import { Check, Clock, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";

import { useArtisanAuthStore } from "@/store/artisanAuthStore";
import { DisplayTitle } from "@/components/ui/display-title";

const PROGRESS_STEPS = [
  { label: "Compte créé", done: true },
  { label: "Documents soumis", done: true },
  { label: "Vérification en cours", done: false, active: true },
  { label: "Accès au dashboard", done: false },
];

export default function ArtisanPendingPage() {
  const router = useRouter();
  const clear = useArtisanAuthStore((s) => s.clear);

  const handleLogoutHome = () => {
    clear();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDE8DF] p-6">
      <div className="w-full max-w-[520px]">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-orange">
            <Wrench size={18} className="text-white" />
          </div>
          <span className="font-display text-[20px] font-extrabold text-navy">
            DEPANNI<span className="text-orange">.ma</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-2xl border border-dep-border bg-white p-8 text-center shadow-[0_8px_40px_rgba(15,30,53,0.08)]"
        >
          <div className="relative mx-auto mb-6 h-20 w-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-orange/15 border-t-orange"
            />
            <div className="absolute inset-3 flex items-center justify-center rounded-full bg-orange/[0.08]">
              <Clock size={24} className="text-orange" />
            </div>
          </div>

          <DisplayTitle as="h1" size="display-3" className="mb-2">
            Demande en cours
            <br />
            de validation
          </DisplayTitle>
          <p className="mb-6 text-[14px] leading-[1.7] text-dep-gray">
            Notre équipe examine votre profil et vos documents. Vous recevrez une notification par SMS
            dans les <strong className="text-navy">24 à 48 heures</strong>.
          </p>

          <div className="mb-6 space-y-3 text-left">
            {PROGRESS_STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    step.done
                      ? "bg-green"
                      : step.active
                        ? "border-2 border-orange"
                        : "border-2 border-dep-border"
                  }`}
                >
                  {step.done && <Check size={12} className="text-white" />}
                  {step.active && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-orange"
                    />
                  )}
                </div>
                <span
                  className={`text-[13px] ${
                    step.done
                      ? "font-medium text-green"
                      : step.active
                        ? "font-semibold text-orange"
                        : "text-dep-gray"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-navy/[0.08] bg-navy/[0.04] p-4 text-left">
            <div className="text-[12px] leading-[1.7] text-dep-gray">
              📱 <strong className="text-navy">SMS de confirmation</strong> envoyé au numéro enregistré
              <br />
              📧 <strong className="text-navy">Email</strong> de suivi envoyé si fourni
              <br />
              ❓ Questions ?{" "}
              <a href="mailto:support@depanni.ma" className="text-orange">
                support@depanni.ma
              </a>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleLogoutHome}
            className="flex-1 rounded-xl border border-dep-border bg-white py-3 text-[13px] font-medium text-dep-gray transition-colors hover:bg-[#F0EBE1]"
          >
            Retour à l&apos;accueil
          </button>
          <button
            type="button"
            onClick={() => router.push("/artisan/login")}
            className="flex-1 rounded-xl bg-navy py-3 text-[13px] font-semibold text-white transition-colors hover:bg-navy-2"
          >
            Vérifier mon statut
          </button>
        </div>
      </div>
    </div>
  );
}
