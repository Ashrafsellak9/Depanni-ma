"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { api, getApiErrorMessage } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";

export function useAcceptOffer(jobId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: string) => {
      const res = await api.post(`/jobs/${jobId}/offers/${offerId}/accept`);
      return unwrapApi(res);
    },
    onMutate: async (offerId) => {
      await qc.cancelQueries({ queryKey: ["mission-detail", jobId] });
      const prev = qc.getQueryData(["mission-detail", jobId]);
      qc.setQueryData(["mission-detail", jobId], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const job = old as { offers?: { id: string; status: string }[] };
        return {
          ...job,
          status: "ACTIVE",
          offers: job.offers?.map((o) =>
            o.id === offerId
              ? { ...o, status: "ACCEPTED" }
              : { ...o, status: o.status === "PENDING" ? "REJECTED" : o.status },
          ),
        };
      });
      return { prev };
    },
    onError: (err, _offerId, ctx) => {
      if (ctx?.prev) qc.setQueryData(["mission-detail", jobId], ctx.prev);
      toast.error(getApiErrorMessage(err));
    },
    onSuccess: () => {
      toast.success("Offre acceptée — mission démarrée");
      void qc.invalidateQueries({ queryKey: ["mission-detail", jobId] });
      void qc.invalidateQueries({ queryKey: ["my-missions"] });
    },
  });
}

export function useRejectOffer(jobId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: string) => {
      const res = await api.post(`/jobs/${jobId}/offers/${offerId}/reject`);
      return unwrapApi(res);
    },
    onMutate: async (offerId) => {
      await qc.cancelQueries({ queryKey: ["mission-detail", jobId] });
      const prev = qc.getQueryData(["mission-detail", jobId]);
      qc.setQueryData(["mission-detail", jobId], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const job = old as { offers?: { id: string; status: string }[] };
        return {
          ...job,
          offers: job.offers?.map((o) =>
            o.id === offerId ? { ...o, status: "REJECTED" } : o,
          ),
        };
      });
      return { prev };
    },
    onError: (err, _offerId, ctx) => {
      if (ctx?.prev) qc.setQueryData(["mission-detail", jobId], ctx.prev);
      toast.error(getApiErrorMessage(err));
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["mission-detail", jobId] });
    },
  });
}
