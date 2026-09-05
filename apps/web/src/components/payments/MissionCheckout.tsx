"use client";

import axios from "axios";
import { CreditCard, Banknote } from "lucide-react";
import { useState } from "react";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import { DisplayTitle } from "@/components/ui/display-title";

type CmiForm = { gatewayUrl: string; fields: Record<string, string> };

function submitCmiForm(cmi: CmiForm) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = cmi.gatewayUrl;
  for (const [name, value] of Object.entries(cmi.fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export function MissionCheckout({
  jobId,
  amount,
  enabled,
}: {
  jobId: string;
  amount: number;
  enabled: boolean;
}) {
  const [loading, setLoading] = useState<"CARD" | "CASH" | null>(null);
  const [error, setError] = useState("");
  const [cashOk, setCashOk] = useState(false);

  const pay = async (method: "CARD" | "CASH") => {
    setError("");
    setLoading(method);
    try {
      const data = unwrapApi<{ payment?: unknown; cmi?: CmiForm }>(
        await api.post("/payments/initiate", { jobId, method, amount }),
      );
      if (method === "CARD" && data.cmi) {
        submitCmiForm(data.cmi);
        return;
      }
      if (method === "CASH") {
        setCashOk(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 503) {
        setError("Paiement carte indisponible pour le moment. Choisissez le paiement en espèces.");
      } else {
        setError("Impossible d'initier le paiement. Réessayez.");
      }
    } finally {
      setLoading(null);
    }
  };

  if (!enabled) return null;

  return (
    <div className="rounded-2xl border border-dep-border bg-white p-5">
      <DisplayTitle as="h2" size="sm" className="text-base font-semibold">
        Paiement
      </DisplayTitle>
      <p className="mt-1 text-sm text-dep-gray">
        Montant : <strong className="text-navy">{amount.toLocaleString("fr-FR")} MAD</strong>
      </p>
      {error && <p className="mt-3 text-sm text-dep-red">{error}</p>}
      {cashOk && (
        <p className="mt-3 text-sm text-green">Paiement espèces enregistré — à régler sur place.</p>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => void pay("CARD")}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-white disabled:opacity-60"
        >
          <CreditCard className="h-4 w-4" />
          {loading === "CARD" ? "Redirection CMI…" : "Payer par carte"}
        </button>
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => void pay("CASH")}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-dep-border bg-cream text-sm font-semibold text-navy disabled:opacity-60"
        >
          <Banknote className="h-4 w-4" />
          {loading === "CASH" ? "Enregistrement…" : "Payer en espèces"}
        </button>
      </div>
    </div>
  );
}
