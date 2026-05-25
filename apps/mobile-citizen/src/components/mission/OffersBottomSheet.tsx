import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { OfferCard } from "@/src/components/mission/OfferCard";
import { getApiErrorMessage } from "@/src/lib/api";
import { acceptOffer, rejectOffer } from "@/src/services/jobs";
import type { CitizenOffer } from "@/src/types/job";

type SortKey = "price" | "rating" | "eta";

interface OffersBottomSheetProps {
  jobId: string;
  offers: CitizenOffer[];
}

export function OffersBottomSheet({ jobId, offers }: OffersBottomSheetProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["35%", "75%"], []);
  const [sort, setSort] = useState<SortKey>("price");
  const qc = useQueryClient();

  const pending = useMemo(() => offers.filter((o) => o.status === "PENDING"), [offers]);

  const sorted = useMemo(() => {
    const list = [...pending];
    list.sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "eta") return (a.etaMinutes ?? 999) - (b.etaMinutes ?? 999);
      return (b.artisan?.rating ?? 0) - (a.artisan?.rating ?? 0);
    });
    return list;
  }, [pending, sort]);

  const acceptMut = useMutation({
    mutationFn: (offerId: string) => acceptOffer(jobId, offerId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["mission-detail", jobId] }),
    onError: (e) => console.warn(getApiErrorMessage(e)),
  });

  const rejectMut = useMutation({
    mutationFn: (offerId: string) => rejectOffer(jobId, offerId),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["mission-detail", jobId] }),
  });

  const renderItem = useCallback(
    ({ item, index }: { item: CitizenOffer; index: number }) => (
      <OfferCard
        offer={item}
        index={index}
        loading={acceptMut.isPending || rejectMut.isPending}
        onAccept={(id) => acceptMut.mutate(id)}
        onReject={(id) => rejectMut.mutate(id)}
      />
    ),
    [acceptMut, rejectMut],
  );

  return (
    <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints} enablePanDownToClose={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Offres ({pending.length})</Text>
        <View style={styles.sortRow}>
          {(
            [
              ["price", "Prix"],
              ["rating", "Note"],
              ["eta", "Délai"],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              compact
              mode={sort === key ? "contained" : "outlined"}
              onPress={() => setSort(key)}
            >
              {label}
            </Button>
          ))}
        </View>
      </View>
      <BottomSheetFlatList
        data={sorted}
        keyExtractor={(item: CitizenOffer) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>En attente d&apos;offres d&apos;artisans…</Text>
        }
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", color: "#14532d" },
  sortRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 24 },
});
