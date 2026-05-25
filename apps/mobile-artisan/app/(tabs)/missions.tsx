import { useMemo, useState, type ReactElement } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Button, Chip } from "react-native-paper";

import { MissionListItem } from "@/src/components/dashboard/MissionListItem";
import { useArtisanMissions } from "@/src/hooks/useArtisanMissions";
import { useJobsFeedStore } from "@/src/store/jobsFeedStore";

const FILTERS = [
  { key: "", label: "Toutes" },
  { key: "IN_PROGRESS", label: "En cours" },
  { key: "ACCEPTED", label: "Acceptées" },
  { key: "COMPLETED", label: "Terminées" },
] as const;

export default function MissionsScreen(): ReactElement {
  const [status, setStatus] = useState<string>("");
  const newJobsCount = useJobsFeedStore((s) => s.newJobsCount);
  const clearNewJobs = useJobsFeedStore((s) => s.clearNewJobs);

  const { data, refetch, isRefetching } = useArtisanMissions({
    status: status || undefined,
    limit: 50,
  });

  const items = useMemo(() => data?.items ?? [], [data?.items]);

  return (
    <View style={styles.flex}>
      {newJobsCount > 0 && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>{newJobsCount} nouvelle(s) demande(s) à proximité</Text>
          <Button mode="contained-tonal" compact onPress={clearNewJobs}>
            OK
          </Button>
        </View>
      )}

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Chip
            key={f.key || "all"}
            selected={status === f.key}
            onPress={() => setStatus(f.key)}
            style={styles.chip}
          >
            {f.label}
          </Chip>
        ))}
      </View>

      <FlatList
        data={items}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MissionListItem mission={item} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
        ListEmptyComponent={<Text style={styles.empty}>Aucune mission</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f8fafc" },
  alert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#fecaca",
    padding: 12,
  },
  alertText: { flex: 1, color: "#b91c1c", fontWeight: "600" },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 12 },
  chip: { marginBottom: 4 },
  list: { padding: 16, paddingBottom: 32 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 40 },
});
