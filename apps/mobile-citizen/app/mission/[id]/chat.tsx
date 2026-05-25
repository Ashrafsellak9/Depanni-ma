import { useLocalSearchParams } from "expo-router";
import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";

import { ChatScreen } from "@/src/components/chat/ChatScreen";

export default function MissionChatRoute(): ReactElement {
  const { missionId } = useLocalSearchParams<{ id: string; missionId: string }>();

  return (
    <View style={styles.flex}>
      {missionId ? <ChatScreen missionId={missionId} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
});
