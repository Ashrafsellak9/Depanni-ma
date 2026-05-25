import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

import { estimatedMonthlySavings } from "@/src/lib/subscription";
import type { SubscriptionTier } from "@/src/types/artisan";

interface SubscriptionBannerProps {
  tier: SubscriptionTier;
  monthlyGross: number;
  onUpgrade: () => void;
}

export function SubscriptionBanner({ tier, monthlyGross, onUpgrade }: SubscriptionBannerProps) {
  if (tier !== "STANDARD") return null;

  const savings = estimatedMonthlySavings("PREMIUM", monthlyGross);

  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Passez Premium</Text>
      <Text style={styles.sub}>
        Économisez ~{savings} MAD/mois sur les commissions (10% au lieu de 15%)
      </Text>
      <Button mode="contained" buttonColor="#fff" textColor="#7c2d12" onPress={onUpgrade}>
        Comparer les offres
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#ea580c",
  },
  title: { color: "#fff", fontSize: 17, fontWeight: "800" },
  sub: { color: "#ffedd5", marginVertical: 10, lineHeight: 20 },
});
