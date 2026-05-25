import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

interface AvailabilitySwitchProps {
  value: boolean;
  disabled?: boolean;
  onValueChange: (next: boolean) => void;
}

const TRACK_W = 56;
const THUMB = 26;
const PADDING = 3;

export function AvailabilitySwitch({ value, disabled, onValueChange }: AvailabilitySwitchProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
    }).start();
  }, [value, anim]);

  const thumbLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PADDING, TRACK_W - THUMB - PADDING],
  });

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#cbd5e1", "#22c55e"],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, { left: thumbLeft }]} />
      </Animated.View>
      <Text style={styles.label}>{value ? "Disponible" : "Pause"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: THUMB + PADDING * 2,
    borderRadius: 999,
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  label: { marginTop: 6, fontSize: 12, fontWeight: "600", color: "#475569", textAlign: "center" },
});
