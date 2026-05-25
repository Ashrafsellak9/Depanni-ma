import { StyleSheet, Text, View } from "react-native";

import type { CitizenJob } from "@/src/types/job";

function formatElapsed(createdAt: string): string {
  const ms = Date.now() - new Date(createdAt).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  return `Il y a ${h}h`;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente d'offres",
  ACTIVE: "Offre acceptée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  EXPIRED: "Expirée",
};

interface MissionHeaderProps {
  job: CitizenJob;
}

export function MissionHeader({ job }: MissionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{job.title}</Text>
      <View style={styles.row}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{STATUS_LABELS[job.status] ?? job.status}</Text>
        </View>
        <Text style={styles.elapsed}>{formatElapsed(job.createdAt)}</Text>
      </View>
      <Text style={styles.meta}>
        {job.city} · {job.urgency} · {job.offerCount} offre(s)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  title: { fontSize: 20, fontWeight: "800", color: "#14532d" },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  badge: { backgroundColor: "#dcfce7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: "#15803d", fontWeight: "700", fontSize: 12 },
  elapsed: { color: "#64748b", fontSize: 13 },
  meta: { marginTop: 6, color: "#64748b", fontSize: 13 },
});
