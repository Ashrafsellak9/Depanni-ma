"use client";

import { useForm } from "react-hook-form";
import { KYC_REJECT_REASONS } from "@/types/moderation";

interface RejectForm {
  predefinedReason: string;
  reason: string;
  sendEmail: boolean;
}

export function RejectKycModal({
  open,
  artisanName,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  artisanName: string;
  onClose: () => void;
  onConfirm: (data: RejectForm) => void;
  loading?: boolean;
}) {
  const { register, handleSubmit, watch } = useForm<RejectForm>({
    defaultValues: { sendEmail: true, predefinedReason: KYC_REJECT_REASONS[0] },
  });

  if (!open) return null;

  const predefined = watch("predefinedReason");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold">Refuser le KYC — {artisanName}</h3>
        <form onSubmit={handleSubmit(onConfirm)} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Motif prédéfini</label>
            <select {...register("predefinedReason")} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
              {KYC_REJECT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Détails (obligatoire)</label>
            <textarea
              {...register("reason", { required: true, minLength: 5 })}
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Précisions pour l'artisan…"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("sendEmail")} />
            Envoyer un email automatique à l&apos;artisan
          </label>
          {predefined === "Autre" && (
            <p className="text-xs text-amber-600">Pensez à détailler le motif dans le champ libre.</p>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Envoi…" : "Confirmer le refus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
