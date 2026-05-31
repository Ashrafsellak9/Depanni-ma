import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export function TypingIndicator() {
  const d1 = useRef(new Animated.Value(0.3)).current;
  const d2 = useRef(new Animated.Value(0.3)).current;
  const d3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        ]),
      );

    const a1 = pulse(d1, 0);
    const a2 = pulse(d2, 150);
    const a3 = pulse(d3, 300);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [d1, d2, d3]);

  return (
    <View style={styles.wrap}>
      {[d1, d2, d3].map((opacity, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", gap: 5, paddingVertical: 8, paddingHorizontal: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#94a3b8" },
});
