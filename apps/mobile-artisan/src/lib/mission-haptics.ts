import * as Haptics from "expo-haptics";
import { Vibration } from "react-native";

import type { ApiJobUrgency } from "@/src/types/job-alert";

export async function hapticNewJobAlert(urgency: ApiJobUrgency): Promise<void> {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  if (urgency === "NOW") {
    Vibration.vibrate([0, 400, 200, 400, 200, 600]);
  } else {
    Vibration.vibrate([0, 250, 150, 250]);
  }
}

export async function hapticOfferAccepted(): Promise<void> {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  Vibration.vibrate([0, 100, 80, 100, 80, 200]);
}
