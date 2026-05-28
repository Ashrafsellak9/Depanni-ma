"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Send, Shield } from "lucide-react";

export function HelpContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    setMessage("");
  };

  return (
    <div id="help-contact-form" className="rounded-2xl border border-[#E5E0D8] bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(240,90,26,0.1)]">
          <Send size={16} className="text-[#F05A1A]" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-[#0F1E35]">
            Vous n&apos;avez pas trouvé la réponse ?
          </h3>
          <p className="text-[12px] text-[#6B7280]">Envoyez-nous un message, réponse sous 2h</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#0F1E35]">
            Sujet
          </label>
          <select className="w-full cursor-pointer rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] px-3.5 py-2.5 text-[13px] text-[#0F1E35] outline-none focus:border-[#0F1E35]">
            <option>Problème de paiement</option>
            <option>Question sur ma mission</option>
            <option>Problème technique</option>
            <option>KYC et vérification</option>
            <option>Litige avec un client</option>
            <option>Autre</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#0F1E35]">
            Urgence
          </label>
          <select className="w-full cursor-pointer rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] px-3.5 py-2.5 text-[13px] text-[#0F1E35] outline-none focus:border-[#0F1E35]">
            <option>Normal (réponse sous 24h)</option>
            <option>Urgent (réponse sous 2h)</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#0F1E35]">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Décrivez votre problème en détail..."
          className="h-28 w-full resize-none rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-3.5 font-['DM_Sans'] text-[13px] outline-none transition-all focus:border-[#0F1E35] focus:bg-white"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
          <Shield size={12} />
          Votre numéro artisan sera joint automatiquement
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSubmit}
          disabled={submitting || !message.trim()}
          className="flex items-center gap-2 rounded-xl bg-[#F05A1A] px-6 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
        >
          {submitting ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Envoi...
            </>
          ) : (
            <>
              <Send size={14} />
              Envoyer le message
            </>
          )}
        </motion.button>
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3 rounded-xl border border-[rgba(27,138,78,0.2)] bg-[rgba(27,138,78,0.08)] p-4"
        >
          <CheckCircle size={18} className="flex-shrink-0 text-[#1B8A4E]" />
          <div>
            <div className="text-[13px] font-semibold text-[#1B8A4E]">Message envoyé !</div>
            <div className="mt-0.5 text-[12px] text-[#6B7280]">
              Notre équipe vous répondra par SMS ou email sous 2h.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
