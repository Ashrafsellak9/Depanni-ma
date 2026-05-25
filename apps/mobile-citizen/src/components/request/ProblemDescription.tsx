import * as ImagePicker from "expo-image-picker";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { VoiceRecorder } from "@/src/components/request/VoiceRecorder";
import type { WizardPhoto } from "@/src/services/jobs";

interface ProblemDescriptionProps {
  description: string;
  photos: WizardPhoto[];
  onDescriptionChange: (v: string) => void;
  onPhotosChange: (photos: WizardPhoto[]) => void;
  error?: string;
}

export function ProblemDescription({
  description,
  photos,
  onDescriptionChange,
  onPhotosChange,
  error,
}: ProblemDescriptionProps) {
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - photos.length,
      quality: 0.7,
    });
    if (result.canceled) return;
    const next = [
      ...photos,
      ...result.assets.map((a) => ({
        uri: a.uri,
        mimeType: a.mimeType ?? "image/jpeg",
        fileName: a.fileName ?? undefined,
      })),
    ].slice(0, 5);
    onPhotosChange(next);
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Décrivez le problème</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={onDescriptionChange}
        multiline
        numberOfLines={6}
        placeholder="Décrivez en détail la panne, les symptômes, l'accessibilité…"
        textAlignVertical="top"
      />
      <VoiceRecorder
        onTranscript={(t) => onDescriptionChange(`${description} ${t}`.trim())}
      />

      <Text style={styles.sub}>Photos ({photos.length}/5)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
        {photos.map((p, i) => (
          <View key={p.uri} style={styles.thumbWrap}>
            <Image source={{ uri: p.uri }} style={styles.thumb} />
            <Pressable style={styles.remove} onPress={() => removePhoto(i)}>
              <Text style={styles.removeText}>×</Text>
            </Pressable>
          </View>
        ))}
        {photos.length < 5 && (
          <Pressable style={styles.addPhoto} onPress={pickImages}>
            <Text style={styles.addText}>+</Text>
          </Pressable>
        )}
      </ScrollView>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { fontSize: 18, fontWeight: "700", color: "#14532d", marginBottom: 12 },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  sub: { marginTop: 16, fontWeight: "600", color: "#334155" },
  photoRow: { marginTop: 8 },
  thumbWrap: { marginRight: 8, position: "relative" },
  thumb: { width: 72, height: 72, borderRadius: 8 },
  remove: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#dc2626",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: { color: "#fff", fontWeight: "700" },
  addPhoto: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#16a34a",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { fontSize: 28, color: "#16a34a" },
  error: { color: "#dc2626", marginTop: 8 },
});
