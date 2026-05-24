import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function NewRequestScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nouvelle demande</Text>
      <Text style={styles.subtitle}>
        Wizard complet (catégorie, photos, localisation, urgence) — aligné sur le web.
      </Text>

      <TextInput label="Titre" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button mode="contained" onPress={() => router.back()} style={styles.btn}>
        Continuer (étapes à venir)
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "700", color: "#14532d" },
  subtitle: { marginTop: 8, marginBottom: 16, color: "#64748b", lineHeight: 20 },
  input: { marginBottom: 12, backgroundColor: "#fff" },
  btn: { marginTop: 8 },
});
