import type { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RequestWizard } from "@/src/components/request/RequestWizard";

export default function NewRequestScreen(): ReactElement {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <RequestWizard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
});
