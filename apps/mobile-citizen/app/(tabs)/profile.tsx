import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useAuthStore } from "@/src/store/authStore";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const onLogout = async () => {
    await logout();
    router.replace("/(auth)/welcome");
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profil" />
      <View style={styles.card}>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.meta}>{user?.email}</Text>
        <Text style={styles.meta}>{user?.phone}</Text>
      </View>

      <Button mode="outlined" onPress={onLogout} style={styles.logout}>
        Se déconnecter
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  name: { fontSize: 20, fontWeight: "700", color: "#14532d" },
  meta: { marginTop: 6, color: "#64748b" },
  logout: { borderColor: "#dc2626" },
});
