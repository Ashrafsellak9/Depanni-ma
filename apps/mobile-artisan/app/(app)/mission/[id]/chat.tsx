import { useLocalSearchParams } from "expo-router";
import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";

import { ChatScreen } from "@/src/components/chat/ChatScreen";

export default function MissionChatRoute(): ReactElement {
  const { id, missionId } = useLocalSearchParams<{ id: string; missionId?: string }>();
  const mid = missionId ?? id;

  return <View style={styles.flex}>{mid ? <ChatScreen missionId={mid} /> : null}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
});
