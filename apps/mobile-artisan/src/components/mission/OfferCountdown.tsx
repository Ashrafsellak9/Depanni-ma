import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

import { offerWindowRemainingSeconds } from "@/src/lib/job-offer-window";

interface OfferCountdownProps {
  createdAt: string;
  size?: number;
  onComplete?: () => void;
}

function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function OfferCountdown({ createdAt, size = 120, onComplete }: OfferCountdownProps) {
  const initialDuration = useMemo(
    () => offerWindowRemainingSeconds(createdAt),
    [createdAt],
  );
  const [remaining, setRemaining] = useState(initialDuration);

  useEffect(() => {
    const tick = () => {
      const next = offerWindowRemainingSeconds(createdAt);
      setRemaining(next);
      if (next <= 0) onComplete?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [createdAt, onComplete]);

  if (remaining <= 0) {
    return (
      <View style={styles.expired}>
        <Text style={styles.expiredText}>Fenêtre d&apos;offres expirée</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <CountdownCircleTimer
        key={createdAt}
        isPlaying
        duration={initialDuration}
        colors={["#22c55e", "#eab308", "#dc2626"]}
        colorsTime={[
          Math.max(1, Math.floor(initialDuration * 0.6)),
          Math.max(1, Math.floor(initialDuration * 0.3)),
          0,
        ]}
        size={size}
        strokeWidth={8}
        trailColor="#fecaca"
        onComplete={() => {
          onComplete?.();
          return { shouldRepeat: false };
        }}
      >
        {() => <Text style={styles.timerText}>{formatMmSs(remaining)}</Text>}
      </CountdownCircleTimer>
      <Text style={styles.caption}>Temps restant (depuis création de la demande)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  timerText: { fontSize: 22, fontWeight: "800", color: "#fff" },
  caption: { marginTop: 10, fontSize: 13, color: "#fecaca", fontWeight: "600", textAlign: "center" },
  expired: { padding: 16, backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 12 },
  expiredText: { color: "#fff", fontWeight: "700" },
});
