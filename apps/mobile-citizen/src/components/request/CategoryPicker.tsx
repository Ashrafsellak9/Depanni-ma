import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SERVICE_CATEGORIES, type ServiceCategoryItem } from "@/src/lib/categories";

interface CategoryPickerProps {
  value?: string;
  onSelect: (cat: ServiceCategoryItem) => void;
  error?: string;
}

export function CategoryPicker({ value, onSelect, error }: CategoryPickerProps) {
  return (
    <View>
      <Text style={styles.title}>Quel service ?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {SERVICE_CATEGORIES.map((cat) => {
          const selected = value === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[styles.card, selected && styles.cardSelected]}
              onPress={() => onSelect(cat)}
            >
              <Text style={styles.icon}>{cat.icon}</Text>
              <Text style={[styles.name, selected && styles.nameSelected]}>{cat.nameFr}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "700", color: "#14532d", marginBottom: 12 },
  row: { gap: 10, paddingVertical: 4 },
  card: {
    width: 108,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  cardSelected: { borderColor: "#16a34a", backgroundColor: "#f0fdf4" },
  icon: { fontSize: 28, marginBottom: 8 },
  name: { fontSize: 13, fontWeight: "600", color: "#334155", textAlign: "center" },
  nameSelected: { color: "#15803d" },
  error: { marginTop: 8, color: "#dc2626", fontSize: 13 },
});
