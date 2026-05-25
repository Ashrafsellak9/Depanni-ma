import { useLocalSearchParams } from "expo-router";
import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";

import { ReviewScreen } from "@/src/components/review/ReviewScreen";

export default function MissionReviewRoute(): ReactElement {
  const { id, missionId } = useLocalSearchParams<{ id: string; missionId: string }>();

  if (!id || !missionId) {
    return <View style={styles.flex} />;
  }

  return (
    <View style={styles.flex}>
      <ReviewScreen jobId={id} missionId={missionId} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f8fafc" },
});
