import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/src/lib/api";
import { SUBSCRIPTION_PLANS } from "@/src/lib/subscription";
import { upgradeSubscription } from "@/src/services/wallet";

interface SubscriptionCompareModalProps {
  visible: boolean;
  balance: number;
  onClose: () => void;
}

export function SubscriptionCompareModal({
  visible,
  balance,
  onClose,
}: SubscriptionCompareModalProps) {
  const [method, setMethod] = useState<"WALLET" | "CMI">("WALLET");
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: (tier: "PREMIUM" | "PRO") => upgradeSubscription({ tier, method }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["artisan-earnings"] });
      void qc.invalidateQueries({ queryKey: ["artisan-profile"] });
      onClose();
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Choisir un abonnement</Text>
        <SegmentedButtons
          value={method}
          onValueChange={(v) => setMethod(v as "WALLET" | "CMI")}
          buttons={[
            { value: "WALLET", label: "Wallet" },
            { value: "CMI", label: "CMI" },
          ]}
          style={styles.segment}
        />

        {SUBSCRIPTION_PLANS.filter((p) => p.tier !== "STANDARD").map((plan) => (
          <View key={plan.tier} style={styles.card}>
            <Text style={styles.planName}>{plan.label}</Text>
            <Text style={styles.price}>{plan.priceMad} MAD / mois</Text>
            {plan.perks.map((perk) => (
              <Text key={perk} style={styles.perk}>
                • {perk}
              </Text>
            ))}
            <Button
              mode="contained"
              onPress={() => mut.mutate(plan.tier as "PREMIUM" | "PRO")}
              loading={mut.isPending}
              disabled={method === "WALLET" && balance < plan.priceMad}
            >
              Souscrire {plan.label}
            </Button>
            {method === "WALLET" && balance < plan.priceMad && (
              <Text style={styles.warn}>Solde insuffisant</Text>
            )}
          </View>
        ))}

        {error && <Text style={styles.error}>{error}</Text>}
        <Button mode="text" onPress={onClose}>
          Fermer
        </Button>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "800", color: "#14532d", marginBottom: 16 },
  segment: { marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  planName: { fontSize: 18, fontWeight: "800", color: "#14532d" },
  price: { fontSize: 16, color: "#15803d", marginVertical: 8, fontWeight: "700" },
  perk: { color: "#64748b", marginBottom: 4 },
  warn: { color: "#b45309", marginTop: 8, fontSize: 12 },
  error: { color: "#dc2626", marginTop: 12 },
});
