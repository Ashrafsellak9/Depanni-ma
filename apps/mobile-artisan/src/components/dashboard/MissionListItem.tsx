import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ArtisanMission } from "@/src/types/artisan";

const STATUS_LABELS: Record<string, string> = {
  ACCEPTED: "Acceptée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  DISPUTED: "Litige",
};

interface MissionListItemProps {
  mission: ArtisanMission;
}

export function MissionListItem({ mission }: MissionListItemProps) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(app)/mission/[id]",
          params: { id: mission.id },
        } as never)
      }
    >
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>
          {mission.job.title}
        </Text>
        <View style={[styles.badge, mission.status === "IN_PROGRESS" && styles.badgeActive]}>
          <Text style={styles.badgeText}>{STATUS_LABELS[mission.status] ?? mission.status}</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        {mission.job.city} · {mission.citizen.firstName} {mission.citizen.lastName}
      </Text>
      <Text style={styles.price}>{mission.offer.price} MAD</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title: { flex: 1, fontSize: 16, fontWeight: "700", color: "#0f172a" },
  badge: { backgroundColor: "#f1f5f9", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeActive: { backgroundColor: "#dcfce7" },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#15803d" },
  meta: { marginTop: 6, fontSize: 13, color: "#64748b" },
  price: { marginTop: 8, fontSize: 15, fontWeight: "700", color: "#14532d" },
});
