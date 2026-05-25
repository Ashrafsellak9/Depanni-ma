import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [active, setActive] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.25, duration: 500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulse]);

  const start = async () => {
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) return;
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
    setActive(true);
  };

  const stop = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const status = await recording.getStatusAsync();
    const durationSec =
      "durationMillis" in status && typeof status.durationMillis === "number"
        ? Math.round(status.durationMillis / 1000)
        : 0;
    setRecording(null);
    setActive(false);
    onTranscript(`[Note vocale ${durationSec}s — transcription à venir]`);
  };

  const toggle = () => {
    if (active) void stop();
    else void start();
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={toggle}>
        <Animated.View style={[styles.mic, active && styles.micActive, { transform: [{ scale: pulse }] }]}>
          <Text style={styles.micIcon}>{active ? "⏹" : "🎤"}</Text>
        </Animated.View>
      </Pressable>
      <Text style={styles.hint}>
        {active ? "Enregistrement… Appuyez pour arrêter" : "Dicter le problème (audio)"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 },
  mic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  micActive: { backgroundColor: "#fecaca" },
  micIcon: { fontSize: 22 },
  hint: { flex: 1, fontSize: 13, color: "#64748b" },
});
