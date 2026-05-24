import { StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/src/components/ScreenHeader";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Conversations"
        subtitle="Messagerie temps réel — bientôt connectée au socket"
      />
      <Text style={styles.placeholder}>
        Les conversations de mission apparaîtront ici une fois une offre acceptée.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  placeholder: { color: "#64748b", lineHeight: 22 },
});
