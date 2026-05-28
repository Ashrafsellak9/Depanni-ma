"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reply, Send } from "lucide-react";

const QUICK_REPLIES = [
  "Merci pour votre confiance ! Ce fut un plaisir.",
  "Merci ! N'hésitez pas à faire appel à moi.",
  "Je prends note et ferai mieux la prochaine fois.",
];

const MAX_LENGTH = 300;

type ReplyInputProps = {
  reviewId: number;
  onReply: (id: number, text: string) => void;
};

export function ReplyInput({ reviewId, onReply }: ReplyInputProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handlePublish = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    onReply(reviewId, trimmed);
    setSending(false);
    setOpen(false);
    setText("");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[12px] text-[#6B7280] transition-colors hover:text-[#0F1E35]"
      >
        <Reply size={13} />
        Répondre à cet avis
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mt-3 border-t border-[#E5E0D8] pt-3"
    >
      <div className="mb-2 flex flex-wrap gap-2">
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr}
            type="button"
            onClick={() => setText(qr)}
            className="rounded-full border border-[#E5E0D8] bg-[#FAF7F2] px-2.5 py-1 text-left text-[10px] text-[#6B7280] transition-all hover:border-[#0F1E35] hover:text-[#0F1E35]"
          >
            {qr.length > 36 ? `${qr.slice(0, 36)}…` : qr}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="Répondez publiquement à cet avis..."
        className="mb-2 h-20 w-full resize-none rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-3 font-['DM_Sans'] text-[13px] transition-all focus:border-[#0F1E35] focus:bg-white focus:outline-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#6B7280]">
          {text.length}/{MAX_LENGTH} · Visible publiquement par les clients
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setText("");
            }}
            className="rounded-lg px-3 py-1.5 text-[12px] text-[#6B7280] transition-colors hover:bg-[#FAF7F2]"
          >
            Annuler
          </button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handlePublish}
            disabled={!text.trim() || sending}
            className="flex items-center gap-1.5 rounded-lg bg-[#0F1E35] px-4 py-1.5 text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Envoi...
              </>
            ) : (
              <>
                <Send size={12} />
                Publier
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
