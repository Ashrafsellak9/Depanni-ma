"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FixedSizeList, type ListChildComponentProps } from "react-window";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageCircle, Paperclip, Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatMessages, useSendChatMessage } from "@/hooks/citizen/useChat";
import type { ChatMessage } from "@/types/citizen";

const ROW_HEIGHT = 72;

function MessageRow({ index, style, data }: ListChildComponentProps<ChatMessage[]>) {
  const msg = data[index];
  if (!msg) return null;
  const initials = msg.sender
    ? `${msg.sender.firstName[0]}${msg.sender.lastName[0]}`
    : "?";

  return (
    <div style={style} className="px-4 py-1">
      <div className="flex gap-2">
        <Avatar className="h-8 w-8 shrink-0">
          {msg.sender?.avatarUrl && <AvatarImage src={msg.sender.avatarUrl} alt="" />}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">
            {msg.sender ? `${msg.sender.firstName} ${msg.sender.lastName}` : "Utilisateur"}
            {" · "}
            {format(new Date(msg.createdAt), "HH:mm", { locale: fr })}
          </p>
          {msg.content && <p className="text-sm text-navy break-words">{msg.content}</p>}
          {msg.fileUrl && (
            <a
              href={msg.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline"
            >
              Pièce jointe
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

interface ChatPanelProps {
  missionId: string | undefined;
  disabled?: boolean;
}

export function ChatPanel({ missionId, disabled }: ChatPanelProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<FixedSizeList>(null);

  const { data, isLoading } = useChatMessages(missionId ?? "", open && !!missionId);
  const send = useSendChatMessage(missionId ?? "");

  const messages = useMemo(() => data?.items ?? [], [data?.items]);

  useEffect(() => {
    if (messages.length && listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, "end");
    }
  }, [messages.length, open]);

  const onSend = useCallback(async () => {
    if (!missionId || !text.trim()) return;
    const file = fileRef.current?.files?.[0];
    await send.mutateAsync({ content: text.trim(), file });
    setText("");
    if (fileRef.current) fileRef.current.value = "";
  }, [missionId, text, send]);

  if (!missionId) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>Messages</SheetTitle>
        </SheetHeader>

        <div className="flex-1 min-h-0">
          {isLoading ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : messages.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              Aucun message. Écrivez à votre artisan.
            </p>
          ) : (
            <FixedSizeList
              ref={listRef}
              height={Math.min(480, Math.max(200, messages.length * ROW_HEIGHT))}
              width="100%"
              itemCount={messages.length}
              itemSize={ROW_HEIGHT}
              itemData={messages}
              className="flex-1"
            >
              {MessageRow}
            </FixedSizeList>
          )}
        </div>

        <div className="border-t p-4 space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,audio/*"
            className="hidden"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileRef.current?.click()}
              disabled={send.isPending}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Votre message…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void onSend();
                }
              }}
            />
            <Button type="button" size="icon" onClick={() => void onSend()} disabled={send.isPending || !text.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
