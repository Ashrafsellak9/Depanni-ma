import { ActionSheetIOS, Alert, Linking, Platform } from "react-native";

export interface NavDestination {
  lat: number;
  lng: number;
  label?: string;
}

function googleMapsUrl({ lat, lng }: NavDestination): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function wazeUrl({ lat, lng }: NavDestination): string {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

function appleMapsUrl({ lat, lng, label }: NavDestination): string {
  const q = label ? encodeURIComponent(label) : `${lat},${lng}`;
  return `https://maps.apple.com/?daddr=${q}&ll=${lat},${lng}`;
}

export async function openNavigationChooser(dest: NavDestination): Promise<void> {
  const options: { name: string; url: string }[] = [
    { name: "Google Maps", url: googleMapsUrl(dest) },
    { name: "Waze", url: wazeUrl(dest) },
  ];
  if (Platform.OS === "ios") {
    options.push({ name: "Plans (Apple)", url: appleMapsUrl(dest) });
  }

  const open = (url: string) => {
    void Linking.openURL(url);
  };

  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...options.map((o) => o.name), "Annuler"],
        cancelButtonIndex: options.length,
        title: "Ouvrir la navigation",
      },
      (index) => {
        const picked = index != null ? options[index] : undefined;
        if (picked) open(picked.url);
      },
    );
    return;
  }

  Alert.alert(
    "Navigation GPS",
    "Choisissez une application",
    [
      ...options.map((o) => ({ text: o.name, onPress: () => open(o.url) })),
      { text: "Annuler", style: "cancel" },
    ],
  );
}
