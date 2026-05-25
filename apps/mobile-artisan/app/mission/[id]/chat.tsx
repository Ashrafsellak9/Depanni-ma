import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

/** Chat artisan — réutiliser le module chat citoyen à terme */
export default function ArtisanMissionChatScreen() {
  const { missionId } = useLocalSearchParams<{ missionId: string }>();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Chat mission</Text>
      <Text style={styles.sub}>Mission {missionId}</Text>
      <Text style={styles.hint}>Module chat partagé à brancher (socket /chat)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700" },
  sub: { marginTop: 8, color: "#64748b" },
  hint: { marginTop: 16, textAlign: "center", color: "#94a3b8" },
});
