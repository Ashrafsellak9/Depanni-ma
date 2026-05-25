import { Audio } from "expo-av";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { ChatMessage } from "@/src/types/mission";

type DeliveryStatus = "sent" | "delivered" | "read";

function statusIcon(status: DeliveryStatus): string {
  if (status === "read") return "✓✓";
  if (status === "delivered") return "✓✓";
  return "✓";
}

function statusColor(status: DeliveryStatus, mine: boolean): string {
  if (status === "read") return mine ? "#bbf7d0" : "#16a34a";
  return mine ? "#86efac" : "#94a3b8";
}

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

function AudioPlayer({ uri }: { uri: string }) {
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const toggle = async () => {
    if (playing && sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setPlaying(false);
      return;
    }
    const { sound: s } = await Audio.Sound.createAsync({ uri });
    setSound(s);
    setPlaying(true);
    s.setOnPlaybackStatusUpdate((st) => {
      if (st.isLoaded && st.didJustFinish) {
        setPlaying(false);
        void s.unloadAsync();
        setSound(null);
      }
    });
    await s.playAsync();
  };

  return (
    <Pressable onPress={() => void toggle()} style={styles.audio}>
      <Text style={styles.audioIcon}>{playing ? "⏸" : "▶"}</Text>
      <Text style={styles.audioLabel}>Message vocal</Text>
    </Pressable>
  );
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const status: DeliveryStatus = message.isRead ? "read" : isMine ? "delivered" : "sent";
  const time = new Date(message.createdAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.row, isMine && styles.rowMine]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
        {message.type === "IMAGE" && message.fileUrl ? (
          <Image source={{ uri: message.fileUrl }} style={styles.thumb} resizeMode="cover" />
        ) : null}
        {message.type === "AUDIO" && message.fileUrl ? (
          <AudioPlayer uri={message.fileUrl} />
        ) : null}
        {message.content ? (
          <Text style={[styles.text, isMine && styles.textMine]}>{message.content}</Text>
        ) : null}
        <View style={styles.meta}>
          <Text style={[styles.time, isMine && styles.timeMine]}>{time}</Text>
          {isMine && (
            <Text style={[styles.checks, { color: statusColor(status, isMine) }]}>
              {statusIcon(status)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginVertical: 4, paddingHorizontal: 12 },
  rowMine: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "82%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#f1f5f9",
  },
  bubbleMine: { backgroundColor: "#15803d" },
  bubbleOther: { backgroundColor: "#f1f5f9" },
  text: { fontSize: 15, color: "#0f172a", lineHeight: 21 },
  textMine: { color: "#fff" },
  thumb: { width: 200, height: 140, borderRadius: 10, marginBottom: 6 },
  audio: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  audioIcon: { fontSize: 18, color: "#fff" },
  audioLabel: { color: "#fff", fontWeight: "600" },
  meta: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 6, marginTop: 4 },
  time: { fontSize: 11, color: "#64748b" },
  timeMine: { color: "#dcfce7" },
  checks: { fontSize: 12, fontWeight: "700" },
});
