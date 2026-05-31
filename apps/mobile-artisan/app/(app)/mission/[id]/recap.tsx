import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function MissionRecapScreen() {
  const { netAmount, jobTitle } = useLocalSearchParams<{
    netAmount?: string;
    jobTitle?: string;
  }>();
  const router = useRouter();

  const net = netAmount ? Number(netAmount) : 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>✓</Text>
      <Text style={styles.title}>Mission terminée</Text>
      {jobTitle ? <Text style={styles.sub}>{jobTitle}</Text> : null}
      <View style={styles.amountBox}>
        <Text style={styles.amountLabel}>Montant net crédité</Text>
        <Text style={styles.amount}>{net.toFixed(2)} MAD</Text>
      </View>
      <Text style={styles.hint}>Le paiement sera visible dans votre wallet sous peu.</Text>
      <Button
        mode="contained"
        buttonColor="#15803d"
        style={styles.btn}
        onPress={() => router.replace("/(app)/(tabs)" as never)}
      >
        Retour à l&apos;accueil
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
  },
  emoji: { fontSize: 56, color: "#16a34a" },
  title: { fontSize: 26, fontWeight: "800", color: "#14532d", marginTop: 16 },
  sub: { marginTop: 8, color: "#64748b", textAlign: "center" },
  amountBox: {
    marginTop: 28,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  amountLabel: { color: "#64748b", fontSize: 14 },
  amount: { fontSize: 36, fontWeight: "800", color: "#15803d", marginTop: 8 },
  hint: { marginTop: 20, textAlign: "center", color: "#64748b", lineHeight: 22 },
  btn: { marginTop: 32, width: "100%" },
});
