import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { IconButton } from "react-native-paper";

import { MessageBubble } from "@/src/components/chat/MessageBubble";
import { TypingIndicator } from "@/src/components/chat/TypingIndicator";
import { useChatMessages } from "@/src/hooks/useChat";
import { getChatSocket } from "@/src/lib/socket";
import { useAuthStore } from "@/src/store/authStore";
import type { ChatMessage } from "@/src/types/mission";

interface ChatScreenProps {
  missionId: string;
}

export function ChatScreen({ missionId }: ChatScreenProps) {
  const userId = useAuthStore((s) => s.user?.id);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const { data, isLoading, send, typingUserId, emitTyping } = useChatMessages(missionId, true);
  const messages = useMemo(() => data?.items ?? [], [data?.items]);

  const markRead = useCallback(() => {
    const unread = messages.filter((m) => !m.isRead && m.senderId !== userId).map((m) => m.id);
    if (unread.length === 0) return;
    const socket = getChatSocket();
    if (socket.connected) {
      socket.emit("chat:read", { missionId, messageIds: unread });
    }
  }, [messages, missionId, userId]);

  useEffect(() => {
    markRead();
  }, [markRead]);

  const onChangeText = (value: string) => {
    setText(value);
    emitTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(false), 1200);
  };

  const sendText = () => {
    const content = text.trim();
    if (!content) return;
    setText("");
    emitTyping(false);
    send.mutate({ content });
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (res.canceled || !res.assets[0]) return;
    const asset = res.assets[0];
    send.mutate({
      content: "Photo",
      fileUri: asset.uri,
      mimeType: asset.mimeType ?? "image/jpeg",
    });
  };

  const toggleMic = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        send.mutate({ content: "Message vocal", fileUri: uri, mimeType: "audio/m4a" });
      }
      return;
    }
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) return;
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
  };

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble message={item} isMine={item.senderId === userId} />
    ),
    [userId],
  );

  const showTyping = typingUserId && typingUserId !== userId;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={88}
    >
      {isLoading ? (
        <ActivityIndicator style={styles.loader} color="#15803d" />
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          ListHeaderComponent={
            showTyping ? (
              <View style={styles.typingWrap}>
                <TypingIndicator />
                <Text style={styles.typingLabel}>Artisan en train d&apos;écrire…</Text>
              </View>
            ) : null
          }
        />
      )}

      <View style={styles.toolbar}>
        <IconButton icon="paperclip" size={22} onPress={() => void pickImage()} />
        <TextInput
          style={styles.input}
          placeholder="Votre message…"
          value={text}
          onChangeText={onChangeText}
          multiline
          maxLength={2000}
        />
        <Pressable onPress={() => void toggleMic()} style={styles.micBtn}>
          <Text style={styles.micIcon}>{recording ? "⏹" : "🎤"}</Text>
        </Pressable>
        <IconButton
          icon="send"
          size={22}
          iconColor="#15803d"
          onPress={sendText}
          disabled={!text.trim() || send.isPending}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  loader: { marginTop: 40 },
  list: { paddingVertical: 12 },
  typingWrap: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 8 },
  typingLabel: { fontSize: 12, color: "#64748b" },
  toolbar: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingHorizontal: 4,
    paddingBottom: Platform.OS === "ios" ? 8 : 4,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  micBtn: { padding: 8, marginBottom: 4 },
  micIcon: { fontSize: 22 },
});
