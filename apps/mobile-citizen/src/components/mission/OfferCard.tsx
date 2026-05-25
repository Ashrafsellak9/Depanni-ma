import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar, Button } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";

import type { CitizenOffer } from "@/src/types/job";

interface OfferCardProps {
  offer: CitizenOffer;
  index: number;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}

export function OfferCard({ offer, index, onAccept, onReject, loading }: OfferCardProps) {
  const router = useRouter();
  const name = offer.artisan
    ? `${offer.artisan.firstName} ${offer.artisan.lastName}`
    : "Artisan";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <View style={styles.card}>
        <Pressable
          style={styles.header}
          onPress={() => router.push(`/artisan/${offer.artisanId}` as never)}
        >
          <Avatar.Text size={44} label={initials} style={styles.avatar} />
          <View style={styles.meta}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.rating}>
              ★ {offer.artisan?.rating?.toFixed(1) ?? "—"} · {offer.etaMinutes ?? "?"} min
            </Text>
          </View>
          <Text style={styles.price}>{offer.price} MAD</Text>
        </Pressable>
        {offer.message ? <Text style={styles.message}>{offer.message}</Text> : null}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => onReject(offer.id)}
            disabled={loading}
            textColor="#dc2626"
            style={styles.btn}
          >
            Refuser
          </Button>
          <Button mode="contained" onPress={() => onAccept(offer.id)} disabled={loading} style={styles.btn}>
            Accepter
          </Button>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  header: { flexDirection: "row", alignItems: "center" },
  avatar: { backgroundColor: "#16a34a" },
  meta: { flex: 1, marginLeft: 12 },
  name: { fontWeight: "700", fontSize: 16, color: "#0f172a" },
  rating: { color: "#64748b", fontSize: 13, marginTop: 2 },
  price: { fontWeight: "800", fontSize: 18, color: "#15803d" },
  message: { marginTop: 8, color: "#475569", fontSize: 13 },
  actions: { flexDirection: "row", gap: 8, marginTop: 12 },
  btn: { flex: 1 },
});
