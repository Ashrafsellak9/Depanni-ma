import { useRouter } from "expo-router";
import { useEffect, useMemo, type ReactElement } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { KpiCards } from "@/src/components/dashboard/KpiCards";
import { MissionListItem } from "@/src/components/dashboard/MissionListItem";
import { useArtisanEarnings } from "@/src/hooks/useArtisanEarnings";
import { useArtisanMissions } from "@/src/hooks/useArtisanMissions";
import { useArtisanProfile } from "@/src/hooks/useArtisanProfile";
import { useAvailability } from "@/src/hooks/useAvailability";
import { useJobsFeedStore } from "@/src/store/jobsFeedStore";

export default function DashboardScreen(): ReactElement {
  const router = useRouter();
  const clearNewJobs = useJobsFeedStore((s) => s.clearNewJobs);
  const newJobsCount = useJobsFeedStore((s) => s.newJobsCount);
  const lastJobId = useJobsFeedStore((s) => s.lastJobId);

  const { data: profile, refetch: refetchProfile, isRefetching: profileRefetching } =
    useArtisanProfile();
  const { data: earnings, refetch: refetchEarnings } = useArtisanEarnings();
  const {
    data: missionsData,
    refetch: refetchMissions,
    isRefetching: missionsRefetching,
  } = useArtisanMissions({ limit: 8 });

  const { isOnline, busy, toggle, resumeIfOnline } = useAvailability(profile);

  useEffect(() => {
    resumeIfOnline();
  }, [resumeIfOnline]);

  const activeMissions = useMemo(
    () =>
      (missionsData?.items ?? []).filter((m) =>
        ["ACCEPTED", "IN_PROGRESS"].includes(m.status),
      ),
    [missionsData?.items],
  );

  const missionsThisMonth = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return (missionsData?.items ?? []).filter((m) => new Date(m.createdAt) >= start).length;
  }, [missionsData?.items]);

  const responseRate = useMemo(() => {
    if (!profile) return 0;
    const total = profile.totalMissions + profile.stats.pendingOffers;
    if (total === 0) return 0;
    return Math.round((profile.totalMissions / total) * 100);
  }, [profile]);

  const refreshing = profileRefetching || missionsRefetching;

  const onRefresh = () => {
    void refetchProfile();
    void refetchEarnings();
    void refetchMissions();
    clearNewJobs();
  };

  return (
    <View style={styles.flex}>
      <DashboardHeader
        profile={profile}
        isOnline={isOnline}
        toggleBusy={busy || toggle.isPending}
        kycApproved={profile?.kycStatus === "APPROVED"}
        onToggle={(next) => toggle.mutate(next)}
      />

      {newJobsCount > 0 && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            {newJobsCount} nouvelle(s) demande(s) dans votre zone
          </Text>
          {lastJobId && (
            <Button
              compact
              mode="text"
              textColor="#fff"
              onPress={() => {
                router.push({
                  pathname: "/(app)/offer/[jobId]",
                  params: { jobId: lastJobId },
                } as never);
              }}
            >
              Voir
            </Button>
          )}
          <Button compact mode="text" textColor="#fff" onPress={clearNewJobs}>
            OK
          </Button>
        </View>
      )}

      <FlatList
        data={activeMissions}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MissionListItem mission={item} />}
        ListHeaderComponent={
          <>
            <KpiCards
              revenueToday={earnings?.summary.revenueToday ?? 0}
              missionsMonth={missionsThisMonth}
              rating={earnings?.summary.rating ?? profile?.rating ?? 0}
              responseRate={responseRate}
            />
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Missions en cours</Text>
              <Button
                compact
                onPress={() => router.push("/(app)/(tabs)/missions" as never)}
              >
                Tout voir
              </Button>
            </View>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune mission active pour le moment</Text>
        }
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f8fafc" },
  alert: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  alertText: { color: "#fff", fontWeight: "600", flex: 1 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#14532d" },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 24 },
});
