import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { api } from "@/src/lib/api";
import { getAccessToken } from "@/src/lib/session";

export type InAppNotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

type InAppListener = (payload: InAppNotificationPayload) => void;

let inAppListener: InAppListener | null = null;

export function setInAppNotificationListener(listener: InAppListener | null): void {
  inAppListener = listener;
}

export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  Notifications.addNotificationReceivedListener((notification) => {
    const { title, body, data } = notification.request.content;
    inAppListener?.({
      title: title ?? "DEPANNI",
      body: body ?? "",
      data: (data as Record<string, unknown>) ?? {},
    });
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function registerPushTokenWithBackend(): Promise<string | null> {
  if (!getAccessToken()) return null;

  const granted = await requestNotificationPermission();
  if (!granted) return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
  const tokenData = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );
  const token = tokenData.data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "DEPANNI",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#16a34a",
    });
  }

  await api.post("/users/push-token", {
    token,
    platform: Platform.OS === "ios" ? "ios" : "android",
  });

  return token;
}

export async function syncPushTokenIfAuthenticated(): Promise<void> {
  try {
    await registerPushTokenWithBackend();
  } catch {
    // Optionnel : simulateur, permissions refusées, etc.
  }
}
