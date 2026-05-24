import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { InAppNotificationPayload } from "@/src/services/notifications";

interface InAppNotificationProps {
  notification: InAppNotificationPayload | null;
  onDismiss: () => void;
}

export function InAppNotification({ notification, onDismiss }: InAppNotificationProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (!notification) return;

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -120,
        duration: 220,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onDismiss();
      });
    }, 4500);

    return () => clearTimeout(timer);
  }, [notification, onDismiss, translateY]);

  if (!notification) return null;

  return (
    <Animated.View
      style={[styles.wrap, { paddingTop: insets.top + 8, transform: [{ translateY }] }]}
    >
      <Pressable style={styles.card} onPress={onDismiss}>
        <View style={styles.dot} />
        <View style={styles.texts}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {notification.body}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#14532d",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4ade80",
  },
  texts: { flex: 1 },
  title: { color: "#fff", fontWeight: "700", fontSize: 15 },
  body: { color: "#dcfce7", marginTop: 2, fontSize: 13 },
});
