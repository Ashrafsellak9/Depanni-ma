import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, RadioButton, TextInput } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/src/lib/api";
import { verifyPayoutPin } from "@/src/lib/payout-pin";
import { loadSavedRibs, saveRib, type SavedRib } from "@/src/lib/saved-ribs";
import { PAYOUT_DELAY_LABEL, type SubscriptionTier } from "@/src/lib/subscription";
import { requestWalletPayout } from "@/src/services/wallet";

interface PayoutModalProps {
  visible: boolean;
  balance: number;
  tier: SubscriptionTier;
  onClose: () => void;
  onSuccess: () => void;
}

export function PayoutModal({ visible, balance, tier, onClose, onSuccess }: PayoutModalProps) {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const [pin, setPin] = useState("");
  const [ribs, setRibs] = useState<SavedRib[]>([]);
  const [selectedRibId, setSelectedRibId] = useState<string | "new">("new");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "confirm">("form");

  useEffect(() => {
    if (visible) void loadSavedRibs().then(setRibs);
  }, [visible]);

  useEffect(() => {
    if (selectedRibId === "new") return;
    const rib = ribs.find((r) => r.id === selectedRibId);
    if (rib) {
      setBankName(rib.bankName);
      setIban(rib.iban);
    }
  }, [selectedRibId, ribs]);

  const mut = useMutation({
    mutationFn: async () => {
      const ok = await verifyPayoutPin(pin);
      if (!ok) throw new Error("Code PIN incorrect");
      const num = Number(amount);
      if (num < 100) throw new Error("Minimum 100 MAD");
      if (num > balance) throw new Error("Montant supérieur au solde");
      if (selectedRibId === "new") {
        await saveRib({ label: bankName, bankName, iban });
      }
      return requestWalletPayout({
        amount: num,
        bankName: bankName.trim(),
        iban: iban.trim(),
        securityPin: pin,
      });
    },
    onSuccess: () => {
      setAmount("");
      setPin("");
      setStep("form");
      onSuccess();
      onClose();
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const delayLabel = PAYOUT_DELAY_LABEL[tier];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Virer vers banque</Text>
        <Text style={styles.sub}>
          Solde disponible : {balance.toFixed(2)} MAD · Délai estimé : {delayLabel}
        </Text>

        {step === "form" ? (
          <>
            <TextInput
              label="Montant (min 100 MAD)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
            />

            <Text style={styles.label}>RIB enregistré</Text>
            <RadioButton.Group
              onValueChange={(v) => setSelectedRibId(v)}
              value={selectedRibId}
            >
              {ribs.map((r) => (
                <View key={r.id} style={styles.ribRow}>
                  <RadioButton value={r.id} />
                  <Text style={styles.ribText}>
                    {r.label} · {r.iban.slice(-8)}
                  </Text>
                </View>
              ))}
              <View style={styles.ribRow}>
                <RadioButton value="new" />
                <Text style={styles.ribText}>Nouveau RIB</Text>
              </View>
            </RadioButton.Group>

            {selectedRibId === "new" && (
              <>
                <TextInput
                  label="Banque"
                  value={bankName}
                  onChangeText={setBankName}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="IBAN / RIB"
                  value={iban}
                  onChangeText={setIban}
                  mode="outlined"
                  style={styles.input}
                />
              </>
            )}

            <Button mode="contained" onPress={() => setStep("confirm")}>
              Continuer
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.confirmBox}>
              Virement de {amount} MAD vers {bankName}
              {"\n"}IBAN : {iban}
            </Text>
            <TextInput
              label="Code PIN sécurité (4-6 chiffres)"
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={6}
              mode="outlined"
              style={styles.input}
            />
            <Text style={styles.pinHint}>
              Le PIN est stocké sur votre appareil. À la première utilisation, il sera enregistré.
            </Text>
            <Button mode="contained" loading={mut.isPending} onPress={() => mut.mutate()}>
              Confirmer le virement
            </Button>
            <Button mode="text" onPress={() => setStep("form")}>
              Retour
            </Button>
          </>
        )}

        {error && <Text style={styles.error}>{error}</Text>}
        <Button mode="text" onPress={onClose}>
          Annuler
        </Button>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "800", color: "#14532d" },
  sub: { color: "#64748b", marginVertical: 12, lineHeight: 20 },
  label: { fontWeight: "700", color: "#334155", marginTop: 8, marginBottom: 4 },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  ribRow: { flexDirection: "row", alignItems: "center" },
  ribText: { flex: 1, color: "#0f172a" },
  confirmBox: {
    backgroundColor: "#f0fdf4",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    lineHeight: 22,
    color: "#14532d",
  },
  pinHint: { fontSize: 12, color: "#94a3b8", marginBottom: 12 },
  error: { color: "#dc2626", marginTop: 8 },
});
