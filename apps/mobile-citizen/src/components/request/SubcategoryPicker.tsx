import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import type { SubcategoryItem } from "@/src/lib/categories";

interface SubcategoryPickerProps {
  items: SubcategoryItem[];
  value?: string;
  onSelect: (sub: SubcategoryItem) => void;
  error?: string;
}

export function SubcategoryPicker({ items, value, onSelect, error }: SubcategoryPickerProps) {
  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Type d&apos;intervention</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const selected = value === item.id;
          return (
            <Pressable
              style={[styles.row, selected && styles.rowSelected]}
              onPress={() => onSelect(item)}
            >
              <Text style={[styles.label, selected && styles.labelSelected]}>{item.label}</Text>
            </Pressable>
          );
        }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { fontSize: 18, fontWeight: "700", color: "#14532d", marginBottom: 12 },
  list: { gap: 8, paddingBottom: 16 },
  row: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  rowSelected: { borderColor: "#16a34a", backgroundColor: "#f0fdf4" },
  label: { fontSize: 15, color: "#334155", fontWeight: "500" },
  labelSelected: { color: "#15803d", fontWeight: "700" },
  error: { color: "#dc2626", marginTop: 8 },
});
