import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { getChatSocket } from "@/src/lib/socket";
import { fetchChatMessages, sendChatMessage } from "@/src/services/chat";
import type { ChatMessage } from "@/src/types/chat";

export function useChatMessages(missionId: string, enabled: boolean) {
  const qc = useQueryClient();
  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["chat-messages", missionId],
    queryFn: () => fetchChatMessages(missionId),
    enabled: Boolean(missionId) && enabled,
    refetchInterval: enabled ? 20_000 : false,
  });

  useEffect(() => {
    if (!missionId || !enabled) return;
    const socket = getChatSocket();
    socket.connect();
    socket.emit("chat:join", { missionId });

    const onMessage = (msg: ChatMessage) => {
      qc.setQueryData<{ items: ChatMessage[]; unreadCount: number }>(
        ["chat-messages", missionId],
        (old) => {
          if (!old) return { items: [msg], unreadCount: 0 };
          if (old.items.some((m) => m.id === msg.id)) return old;
          return { items: [...old.items, msg], unreadCount: old.unreadCount };
        },
      );
    };

    const onTyping = (payload: { missionId: string; userId: string; isTyping: boolean }) => {
      if (payload.missionId !== missionId) return;
      setTypingUserId(payload.isTyping ? payload.userId : null);
    };

    const onRead = () => {
      void qc.invalidateQueries({ queryKey: ["chat-messages", missionId] });
    };

    socket.on("chat:message:received", onMessage);
    socket.on("chat:message", onMessage);
    socket.on("chat:typing", onTyping);
    socket.on("chat:read", onRead);

    return () => {
      socket.off("chat:message:received", onMessage);
      socket.off("chat:message", onMessage);
      socket.off("chat:typing", onTyping);
      socket.off("chat:read", onRead);
    };
  }, [missionId, enabled, qc]);

  const send = useMutation({
    mutationFn: (payload: { content: string; fileUri?: string; mimeType?: string }) =>
      sendChatMessage(missionId, payload),
    onSuccess: (msg) => {
      qc.setQueryData<{ items: ChatMessage[]; unreadCount: number }>(
        ["chat-messages", missionId],
        (old) => {
          if (!old) return { items: [msg], unreadCount: 0 };
          if (old.items.some((m) => m.id === msg.id)) return old;
          return { items: [...old.items, msg], unreadCount: old.unreadCount };
        },
      );
    },
  });

  const emitTyping = (isTyping: boolean) => {
    const socket = getChatSocket();
    if (socket.connected) socket.emit("chat:typing", { missionId, isTyping });
  };

  return { ...query, send, typingUserId, emitTyping };
}
