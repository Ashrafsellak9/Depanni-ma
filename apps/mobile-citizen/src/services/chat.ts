import { api, unwrapApi } from "@/src/lib/api";
import type { ChatMessage } from "@/src/types/mission";

export async function fetchChatMessages(missionId: string): Promise<{
  items: ChatMessage[];
  unreadCount: number;
}> {
  const res = await api.get(`/chat/missions/${missionId}/messages`, { params: { limit: 100 } });
  return unwrapApi(res);
}

export async function sendChatMessage(
  missionId: string,
  payload: { content: string; fileUri?: string; mimeType?: string },
): Promise<ChatMessage> {
  const form = new FormData();
  form.append("content", payload.content);
  if (payload.fileUri) {
    form.append("media", {
      uri: payload.fileUri,
      type: payload.mimeType ?? "image/jpeg",
      name: "attachment.jpg",
    } as unknown as Blob);
  }
  const res = await api.post(`/chat/missions/${missionId}/messages`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapApi<ChatMessage>(res);
}
