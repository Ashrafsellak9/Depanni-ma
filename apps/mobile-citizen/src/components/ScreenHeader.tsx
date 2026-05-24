import { StyleSheet, Text, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#14532d" },
  subtitle: { marginTop: 4, fontSize: 14, color: "#64748b" },
});
