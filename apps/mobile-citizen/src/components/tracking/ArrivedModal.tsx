import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

interface ArrivedModalProps {
  visible: boolean;
  loading?: boolean;
  onValidate: () => void;
  onDismiss?: () => void;
}

export function ArrivedModal({ visible, loading, onValidate, onDismiss }: ArrivedModalProps) {
  useEffect(() => {
    if (visible) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.emoji}>✓</Text>
          <Text style={styles.title}>Votre artisan est arrivé !</Text>
          <Text style={styles.sub}>
            Validez l&apos;intervention une fois le travail terminé pour libérer le paiement et noter
            l&apos;artisan.
          </Text>
          <Button
            mode="contained"
            onPress={onValidate}
            loading={loading}
            disabled={loading}
            style={styles.btn}
            buttonColor="#15803d"
          >
            Valider l&apos;intervention
          </Button>
          {onDismiss && (
            <Button mode="text" onPress={onDismiss} disabled={loading}>
              Plus tard
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
    color: "#16a34a",
  },
  title: { fontSize: 22, fontWeight: "800", color: "#14532d", textAlign: "center" },
  sub: { marginTop: 12, fontSize: 15, color: "#64748b", textAlign: "center", lineHeight: 22 },
  btn: { marginTop: 24, width: "100%" },
});
