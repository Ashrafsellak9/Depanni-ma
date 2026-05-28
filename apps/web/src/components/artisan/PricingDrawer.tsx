"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { PendingMission } from "@/components/artisan/PendingMissionCard";

interface PricingDrawerProps {
  open: boolean;
  mission: PendingMission | null;
  onClose: () => void;
  onSubmit?: (payload: { price: number; eta: string; message: string }) => void;
}

export function PricingDrawer({ open, mission, onClose, onSubmit }: PricingDrawerProps) {
  const [price, setPrice] = useState(150);
  const [eta, setEta] = useState("20 min");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open && mission) {
      setPrice(150);
      setEta("20 min");
      setMessage("");
    }
  }, [open, mission]);

  const handleSubmit = () => {
    onSubmit?.({ price, eta, message });
    onClose();
  };

  const net = Math.round(price * 0.85);

  return (
    <AnimatePresence>
      {open && mission && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-[0_-8px_40px_rgba(0,0,0,0.2)]"
            role="dialog"
            aria-modal
            aria-labelledby="pricing-drawer-title"
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-dep-border" />

            <div className="mb-5 rounded-2xl border border-dep-border bg-cream p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[16px]">{mission.type}</span>
                <span id="pricing-drawer-title" className="text-[14px] font-semibold text-navy">
                  {mission.service} — {mission.subtype}
                </span>
                {mission.urgency === "urgent" && (
                  <span className="ml-auto text-[11px] font-semibold text-orange">🚨 Urgent</span>
                )}
              </div>
              <p className="text-[12px] text-dep-gray">{mission.description}</p>
              <div className="mt-2 flex gap-3">
                <span className="text-[11px] text-dep-gray">📍 {mission.distance}</span>
                <span className="text-[11px] text-dep-gray">💰 Budget: {mission.budget}</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-navy">
                Votre prix (MAD)
              </label>
              <div className="mb-3 rounded-2xl border-2 border-orange bg-cream p-4 text-center">
                <div className="font-syne text-[48px] font-extrabold leading-none tracking-[-2px] text-navy">
                  {price}
                </div>
                <div className="mt-1 text-[12px] text-dep-gray">
                  Votre net : <strong className="text-green">{net} MAD</strong> (après 15 % commission)
                </div>
              </div>
              <div className="mb-3 grid grid-cols-4 gap-2">
                {[100, 150, 200, 250].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrice(p)}
                    className={`rounded-xl border py-2.5 text-[13px] font-semibold transition-all ${
                      price === p
                        ? "border-navy bg-navy text-white"
                        : "border-dep-border bg-white text-navy hover:border-navy"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-orange"
              />
              <div className="mt-1 flex justify-between text-[10px] text-dep-gray">
                <span>50 MAD</span>
                <span>500 MAD</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-navy">
                Délai d&apos;arrivée estimé
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["10 min", "20 min", "30 min"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEta(t)}
                    className={`rounded-xl border py-3 text-[13px] font-semibold transition-all ${
                      eta === t
                        ? "border-orange bg-orange text-white"
                        : "border-dep-border bg-white text-navy"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-navy">
                Message (optionnel)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Je suis disponible immédiatement et j'ai tout le matériel..."
                className="h-20 w-full resize-none rounded-xl border border-dep-border bg-cream p-3 font-dm text-[13px] focus:border-navy focus:outline-none"
              />
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange py-4 text-[15px] font-bold text-white"
            >
              Envoyer mon offre · {price} MAD →
            </motion.button>

            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full py-3 text-[13px] font-medium text-dep-gray"
            >
              Annuler
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
