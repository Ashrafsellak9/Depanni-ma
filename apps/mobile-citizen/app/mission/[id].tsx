import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { api, unwrapApi } from "@/src/lib/api";

interface JobDetail {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["mission", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await api.get(`/jobs/${id}`);
      return unwrapApi<JobDetail>(res);
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Mission introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.status}>Statut : {data.status}</Text>
      <Text style={styles.description}>{data.description}</Text>
      <Text style={styles.hint}>
        Suivi GPS temps réel et offres artisans — prochaine itération (socket + carte).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", color: "#14532d" },
  status: { marginTop: 8, color: "#16a34a", fontWeight: "600" },
  description: { marginTop: 16, color: "#334155", lineHeight: 22 },
  hint: { marginTop: 24, color: "#94a3b8", fontSize: 13 },
  error: { color: "#dc2626" },
});
