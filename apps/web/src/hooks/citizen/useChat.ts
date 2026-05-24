"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import { getChatSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types/citizen";

export function useChatMessages(missionId: string, open: boolean) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["chat-messages", missionId],
    queryFn: async () => {
      const res = await api.get(`/chat/missions/${missionId}/messages`, {
        params: { limit: 100 },
      });
      return unwrapApi<{ items: ChatMessage[]; unreadCount: number }>(res);
    },
    enabled: !!missionId && open,
    refetchInterval: open ? 15_000 : false,
  });

  useEffect(() => {
    if (!missionId || !open) return;
    const socket = getChatSocket();
    socket.connect();
    socket.emit("chat:join", { missionId });

    const onMessage = (msg: ChatMessage) => {
      qc.setQueryData(["chat-messages", missionId], (old: { items: ChatMessage[]; unreadCount: number } | undefined) => {
        if (!old) return { items: [msg], unreadCount: 0 };
        if (old.items.some((m) => m.id === msg.id)) return old;
        return { items: [...old.items, msg], unreadCount: old.unreadCount };
      });
    };

    socket.on("chat:message:received", onMessage);
    return () => {
      socket.off("chat:message:received", onMessage);
    };
  }, [missionId, open, qc]);

  return query;
}

export function useSendChatMessage(missionId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { content: string; file?: File }) => {
      const form = new FormData();
      form.append("content", payload.content);
      if (payload.file) form.append("media", payload.file);

      const res = await api.post(`/chat/missions/${missionId}/messages`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return unwrapApi<ChatMessage>(res);
    },
    onSuccess: (msg) => {
      qc.setQueryData(["chat-messages", missionId], (old: { items: ChatMessage[]; unreadCount: number } | undefined) => {
        if (!old) return { items: [msg], unreadCount: 0 };
        if (old.items.some((m) => m.id === msg.id)) return old;
        return { items: [...old.items, msg], unreadCount: old.unreadCount };
      });
    },
  });
}
