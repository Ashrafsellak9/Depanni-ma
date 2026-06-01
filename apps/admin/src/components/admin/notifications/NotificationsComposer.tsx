"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useMemo, useState } from "react";

import {
  AUDIENCE_COUNTS,
  AUDIENCE_OPTIONS,
  QUICK_TEMPLATES,
} from "@/components/admin/notifications/adminNotificationsMock";
import {
  FIELD_INPUT,
  FIELD_LABEL,
} from "@/components/admin/parametres/settingsUi";

type ChannelId = "push" | "sms" | "email";

type NotificationsComposerProps = {
  onSend: (payload: {
    title: string;
    message: string;
    audience: string;
    channels: ChannelId[];
    schedule: string;
  }) => Promise<void>;
};

export function NotificationsComposer({ onSend }: NotificationsComposerProps) {
  const [audience, setAudience] = useState("");
  const [channels, setChannels] = useState<ChannelId[]>(["push"]);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [schedule, setSchedule] = useState<"now" | "scheduled">("now");
  const [sending, setSending] = useState(false);

  const audienceCount = AUDIENCE_COUNTS[audience] ?? 0;

  const smsCost = useMemo(() => {
    if (!channels.includes("sms") || audienceCount === 0) return "—";
    return `${Math.round(audienceCount * 0.08)} MAD`;
  }, [channels, audienceCount]);

  const toggleChannel = (id: ChannelId) => {
    setChannels((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await onSend({
        title: notifTitle,
        message: notifMessage,
        audience,
        channels,
        schedule,
      });
      setNotifTitle("");
      setNotifMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6">
          <h3 className="mb-5 text-[14px] font-semibold text-[#0F1E35]">
            Nouvelle notification
          </h3>

          <div className="mb-4">
            <label className={FIELD_LABEL}>Destinataires</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {AUDIENCE_OPTIONS.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setAudience(a.id)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 transition-all ${
                    audience === a.id
                      ? "border-[#F05A1A] bg-[rgba(240,90,26,0.04)]"
                      : "border-[#E5E0D8] bg-[#FAF7F2] hover:border-[#0F1E35]"
                  }`}
                >
                  <span className="text-[16px]">{a.icon}</span>
                  <div>
                    <div className="text-[12px] font-medium text-[#0F1E35]">{a.label}</div>
                    {a.count && (
                      <div className="text-[10px] text-[#6B7280]">
                        {a.count} destinataires
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className={FIELD_LABEL}>Canal d&apos;envoi</label>
            <div className="flex gap-2">
              {(
                [
                  { id: "push" as const, label: "📱 Push", desc: "Notification app" },
                  { id: "sms" as const, label: "💬 SMS", desc: "+coût opérateur" },
                  { id: "email" as const, label: "📧 Email", desc: "Gratuit" },
                ] as const
              ).map((c) => (
                <div
                  key={c.id}
                  onClick={() => toggleChannel(c.id)}
                  className={`flex-1 cursor-pointer rounded-xl border p-3 text-center transition-all ${
                    channels.includes(c.id)
                      ? "border-[#0F1E35] bg-[rgba(15,30,53,0.04)]"
                      : "border-[#E5E0D8] bg-[#FAF7F2]"
                  }`}
                >
                  <div className="text-[13px] font-semibold text-[#0F1E35]">{c.label}</div>
                  <div className="text-[10px] text-[#6B7280]">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className={FIELD_LABEL}>Titre</label>
            <input
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              maxLength={60}
              placeholder="Ex: Nouvelle fonctionnalité disponible !"
              className={FIELD_INPUT}
            />
            <div className="mt-1 text-right text-[10px] text-[#9CA3AF]">
              {notifTitle.length}/60
            </div>
          </div>

          <div className="mb-4">
            <label className={FIELD_LABEL}>Message</label>
            <textarea
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              maxLength={160}
              placeholder="Votre message ici..."
              className={`${FIELD_INPUT} h-24 resize-none`}
            />
            <div className="mt-1 text-right text-[10px] text-[#9CA3AF]">
              {notifMessage.length}/160
            </div>
          </div>

          <div className="mb-5">
            <label className={FIELD_LABEL}>Lien d&apos;action (optionnel)</label>
            <select className={`${FIELD_INPUT} cursor-pointer`}>
              <option value="">Aucun lien</option>
              <option>Ouvrir l&apos;app</option>
              <option>Page services</option>
              <option>Faire une demande</option>
              <option>Mon profil artisan</option>
              <option>Mes missions</option>
            </select>
          </div>

          <div className="mb-5">
            <label className={FIELD_LABEL}>Programmation</label>
            <div className="mb-2 flex gap-2">
              {(
                [
                  { id: "now" as const, label: "Maintenant" },
                  { id: "scheduled" as const, label: "Programmer" },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSchedule(s.id)}
                  className={`flex-1 rounded-xl border py-2.5 text-[12px] font-medium transition-all ${
                    schedule === s.id
                      ? "border-[#0F1E35] bg-[#0F1E35] text-white"
                      : "border-[#E5E0D8] bg-[#FAF7F2] text-[#6B7280]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {schedule === "scheduled" && (
              <input type="datetime-local" className={FIELD_INPUT} />
            )}
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSend}
            disabled={!notifTitle || !notifMessage || !audience || sending || channels.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F05A1A] py-4 text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={16} />
            {sending
              ? "Envoi en cours…"
              : schedule === "now"
                ? `Envoyer maintenant · ${audienceCount.toLocaleString("fr-FR")} destinataires`
                : "Programmer l'envoi"}
          </motion.button>
        </div>
      </div>

      <div>
        <div className="sticky top-[80px] rounded-2xl border border-[#E5E0D8] bg-white p-5">
          <h3 className="mb-4 text-[13px] font-semibold text-[#0F1E35]">
            Aperçu de la notification
          </h3>

          <div className="mx-auto mb-5 w-[200px]">
            <div className="rounded-[30px] bg-[#1c1c1e] p-3 shadow-xl">
              <div className="min-h-[300px] rounded-[22px] bg-[#FAF7F2] p-4">
                <div
                  style={{
                    height: 24,
                    background: "#1c1c1e",
                    borderRadius: 12,
                    width: 80,
                    margin: "0 auto 12px",
                  }}
                />
                <div className="mb-4 text-center text-[8px] font-semibold text-[#0F1E35] opacity-40">
                  9:41
                </div>

                {channels.includes("push") && (
                  <div className="mb-3 rounded-xl border border-[#E5E0D8] bg-white p-3 shadow-sm">
                    <div className="mb-1.5 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0F1E35] text-[8px] font-bold text-white">
                        D
                      </div>
                      <span className="text-[9px] font-bold text-[#0F1E35]">DEPANNI.ma</span>
                      <span className="ml-auto text-[8px] text-[#9CA3AF]">Maintenant</span>
                    </div>
                    <div className="mb-0.5 text-[10px] font-semibold text-[#0F1E35]">
                      {notifTitle || "Titre de la notification"}
                    </div>
                    <div className="text-[9px] leading-tight text-[#6B7280]">
                      {notifMessage || "Votre message apparaîtra ici..."}
                    </div>
                  </div>
                )}

                {channels.includes("sms") && (
                  <div className="mb-3 rounded-xl bg-[rgba(15,30,53,0.06)] p-3">
                    <div className="mb-1 text-[8px] text-[#9CA3AF]">DEPANNI.ma via SMS</div>
                    <div className="text-[9px] leading-tight text-[#0F1E35]">
                      {notifTitle && notifMessage
                        ? `${notifTitle}: ${notifMessage}`
                        : "Aperçu SMS..."}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="mb-2 text-[11px] font-semibold text-[#0F1E35]">
              Estimation de l&apos;envoi
            </div>
            {[
              {
                label: "Destinataires",
                value: audienceCount > 0 ? audienceCount.toLocaleString("fr-FR") : "—",
              },
              { label: "Taux ouverture estimé", value: "68%" },
              { label: "Coût SMS estimé", value: smsCost },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between border-b border-[rgba(229,224,216,0.5)] py-2 last:border-0"
              >
                <span className="text-[11px] text-[#6B7280]">{s.label}</span>
                <span className="text-[12px] font-semibold text-[#0F1E35]">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-[#E5E0D8] pt-4">
            <div className="mb-2 text-[11px] font-semibold text-[#0F1E35]">Templates rapides</div>
            {QUICK_TEMPLATES.map((t) => (
              <button
                key={t.title}
                type="button"
                onClick={() => {
                  setNotifTitle(t.title);
                  setNotifMessage(t.message);
                }}
                className="mb-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-2.5 text-left transition-all hover:border-[#F05A1A] hover:bg-[rgba(240,90,26,0.03)]"
              >
                <div className="text-[11px] font-semibold text-[#0F1E35]">{t.title}</div>
                <div className="mt-0.5 truncate text-[10px] text-[#6B7280]">{t.message}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
