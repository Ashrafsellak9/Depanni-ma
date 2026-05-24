import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.badge}>DEPANNI.ma</Text>
      <Text style={styles.title}>Dépannage à domicile, en quelques minutes</Text>
      <Text style={styles.subtitle}>
        Trouvez un artisan vérifié près de chez vous. Suivez l&apos;intervention en temps réel.
      </Text>

      <View style={styles.actions}>
        <Link href="/(auth)/register" asChild>
          <Button mode="contained" style={styles.btn}>
            Créer un compte
          </Button>
        </Link>
        <Link href="/(auth)/login" asChild>
          <Button mode="outlined" style={styles.btn}>
            Se connecter
          </Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f0fdf4",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "700",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#14532d",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#64748b",
    marginBottom: 32,
  },
  actions: { gap: 12 },
  btn: { borderRadius: 10 },
});
