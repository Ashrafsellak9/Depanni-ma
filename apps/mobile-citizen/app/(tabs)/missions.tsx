import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import {
  FLATLIST_PERF_DEFAULTS,
  missionGetItemLayout,
} from "@/src/lib/flatListPerf";
import { ActivityIndicator } from "react-native-paper";

import { api, unwrapApi } from "@/src/lib/api";
import { ScreenHeader } from "@/src/components/ScreenHeader";

interface CitizenJob {
  id: string;
  title: string;
  status: string;
  category?: { nameFr?: string };
  createdAt: string;
}

export default function MissionsScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["my-missions"],
    queryFn: async () => {
      const res = await api.get("/jobs/my", { params: { limit: 30 } });
      return unwrapApi<{ items: CitizenJob[] }>(res);
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const items = data?.items ?? [];
  const keyExtractor = useCallback((item: CitizenJob) => item.id, []);
  const renderItem = useCallback(
    ({ item }: { item: CitizenJob }) => (
      <Pressable style={styles.card} onPress={() => router.push(`/mission/${item.id}`)}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMeta}>
          {item.category?.nameFr ?? "Service"} · {item.status}
        </Text>
      </Pressable>
    ),
    [router],
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Mes missions" subtitle={`${items.length} demande(s)`} />

      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={missionGetItemLayout}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune mission pour le moment.</Text>
        }
        {...FLATLIST_PERF_DEFAULTS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 32 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  cardMeta: { marginTop: 4, color: "#64748b", fontSize: 13 },
});
