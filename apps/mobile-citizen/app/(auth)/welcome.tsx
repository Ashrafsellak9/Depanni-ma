import { Link } from "expo-router";
import { useState, type ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import { Button } from "react-native-paper";

const slides = [
  {
    backgroundColor: "#f0fdf4",
    title: "Dépannage rapide",
    subtitle: "Plomberie, électricité, serrurerie… un artisan vérifié en quelques minutes.",
    emoji: "🔧",
  },
  {
    backgroundColor: "#ecfdf5",
    title: "Suivi en direct",
    subtitle: "Carte temps réel, chat et notifications à chaque étape de la mission.",
    emoji: "📍",
  },
  {
    backgroundColor: "#dcfce7",
    title: "Paiement sécurisé",
    subtitle: "Devis clairs, escrow et artisans notés par la communauté.",
    emoji: "✅",
  },
];

function SlideArt({ emoji }: { emoji: string }) {
  return (
    <View style={styles.art}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

export default function WelcomeScreen(): ReactElement {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <View style={styles.doneScreen}>
        <Text style={styles.badge}>DEPANNI.ma</Text>
        <Text style={styles.doneTitle}>Prêt à démarrer ?</Text>
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

  return (
    <Onboarding
      pages={slides.map((s) => ({
        backgroundColor: s.backgroundColor,
        image: <SlideArt emoji={s.emoji} />,
        title: s.title,
        subtitle: s.subtitle,
        titleStyles: styles.slideTitle,
        subTitleStyles: styles.slideSubtitle,
      }))}
      onDone={() => setDone(true)}
      onSkip={() => setDone(true)}
      showSkip
      bottomBarHighlight={false}
      skipLabel="Passer"
      nextLabel="Suivant"
      doneLabel="Commencer"
    />
  );
}

const styles = StyleSheet.create({
  doneScreen: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
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
  doneTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#14532d",
    marginBottom: 28,
  },
  actions: { gap: 10 },
  btn: { borderRadius: 10 },
  art: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emoji: { fontSize: 64 },
  slideTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#14532d",
    paddingHorizontal: 24,
  },
  slideSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
    paddingHorizontal: 32,
    textAlign: "center",
  },
});
