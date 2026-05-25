import { StyleSheet, Text, View } from "react-native";
import { Avatar, Badge } from "react-native-paper";

import { AvailabilitySwitch } from "@/src/components/dashboard/AvailabilitySwitch";
import type { ArtisanProfile } from "@/src/types/artisan";

interface DashboardHeaderProps {
  profile: ArtisanProfile | undefined;
  isOnline: boolean;
  toggleBusy?: boolean;
  kycApproved: boolean;
  onToggle: (next: boolean) => void;
}

export function DashboardHeader({
  profile,
  isOnline,
  toggleBusy,
  kycApproved,
  onToggle,
}: DashboardHeaderProps) {
  const name = profile ? `${profile.firstName} ${profile.lastName}` : "Artisan";

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {profile?.avatar ? (
          <Avatar.Image size={64} source={{ uri: profile.avatar }} />
        ) : (
          <Avatar.Text size={64} label={name.slice(0, 2).toUpperCase()} />
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          {profile?.badgeVerified && (
            <Badge style={styles.badge}>Vérifié</Badge>
          )}
          <Text style={styles.status}>
            {isOnline ? "● En ligne — réception des demandes" : "○ En pause"}
          </Text>
        </View>
        <AvailabilitySwitch
          value={isOnline}
          disabled={toggleBusy || !kycApproved}
          onValueChange={onToggle}
        />
      </View>
      {!kycApproved && (
        <Text style={styles.kycWarn}>KYC en attente — disponibilité bloquée</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: "800", color: "#14532d" },
  badge: { alignSelf: "flex-start", marginTop: 4, backgroundColor: "#15803d" },
  status: { marginTop: 6, fontSize: 13, color: "#64748b" },
  kycWarn: { marginTop: 10, color: "#b45309", fontSize: 13, fontWeight: "600" },
});
