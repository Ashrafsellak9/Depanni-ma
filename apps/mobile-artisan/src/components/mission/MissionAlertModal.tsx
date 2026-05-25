import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

import { OfferCountdown } from "@/src/components/mission/OfferCountdown";
import { getCategoryIcon, getCategoryLabel } from "@/src/lib/categories";
import { fetchJob } from "@/src/services/jobs";
import { useMissionAlertStore } from "@/src/store/missionAlertStore";
import type { IncomingJobPayload } from "@/src/types/job-alert";

interface MissionAlertModalProps {
  job: IncomingJobPayload;
  visible: boolean;
  onDismiss: () => void;
}

export function MissionAlertModal({ job, visible, onDismiss }: MissionAlertModalProps) {
  const router = useRouter();

  const handleTimeout = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  const goToOffer = async () => {
    try {
      const detail = await fetchJob(job.id);
      if (detail.status !== "PENDING" || detail.mission) {
        onDismiss();
        return;
      }
      if (!detail.acceptsOffers && (detail.offerCount ?? 0) >= 3) {
        onDismiss();
        return;
      }
      onDismiss();
      router.push({ pathname: "/offer/[jobId]", params: { jobId: job.id } } as never);
    } catch {
      onDismiss();
    }
  };

  const pass = () => onDismiss();

  const distance =
    job.distanceKm != null ? `${job.distanceKm.toFixed(1)} km` : "— km";
  const budget =
    job.budgetMin != null || job.budgetMax != null
      ? `${job.budgetMin ?? "?"} – ${job.budgetMax ?? "?"} MAD`
      : "Budget non précisé";

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.screen}>
        <Text style={styles.urgent}>NOUVELLE MISSION</Text>
        <Text style={styles.icon}>{getCategoryIcon(job.category)}</Text>
        <Text style={styles.category}>{getCategoryLabel(job.category)}</Text>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.meta}>
          {job.urgency === "NOW" ? "🔴 Urgent" : job.urgency} · {distance}
        </Text>
        <Text style={styles.budget}>Budget client : {budget}</Text>

        <OfferCountdown createdAt={job.createdAt} size={140} onComplete={handleTimeout} />

        <View style={styles.actions}>
          <Button mode="outlined" textColor="#fff" onPress={pass} style={styles.passBtn}>
            Passer
          </Button>
          <Button
            mode="contained"
            buttonColor="#fff"
            textColor="#b91c1c"
            onPress={() => void goToOffer()}
            style={styles.offerBtn}
          >
            Proposer mon prix →
          </Button>
        </View>
      </View>
    </Modal>
  );
}

/** Provider wrapper that reads zustand store */
export function MissionAlertHost() {
  const job = useMissionAlertStore((s) => s.activeJob);
  const visible = useMissionAlertStore((s) => s.showAlert);
  const dismiss = useMissionAlertStore((s) => s.dismissAlert);

  if (!job) return null;

  return <MissionAlertModal job={job} visible={visible} onDismiss={dismiss} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#b91c1c",
    padding: 24,
    paddingTop: 56,
    alignItems: "center",
  },
  urgent: {
    color: "#fecaca",
    fontWeight: "800",
    letterSpacing: 2,
    fontSize: 13,
  },
  icon: { fontSize: 56, marginTop: 16 },
  category: { color: "#fff", fontSize: 16, fontWeight: "700", marginTop: 8 },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },
  meta: { color: "#fecaca", marginTop: 10, fontSize: 15 },
  budget: { color: "#fff", fontWeight: "600", marginTop: 8, fontSize: 16 },
  actions: { marginTop: "auto", width: "100%", gap: 12, paddingBottom: 32 },
  passBtn: { borderColor: "#fff" },
  offerBtn: { marginTop: 4 },
});
