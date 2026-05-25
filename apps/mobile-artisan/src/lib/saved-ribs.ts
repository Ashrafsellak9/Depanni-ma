import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "depanni_artisan_ribs";

export interface SavedRib {
  id: string;
  label: string;
  bankName: string;
  iban: string;
}

export async function loadSavedRibs(): Promise<SavedRib[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedRib[];
  } catch {
    return [];
  }
}

export async function saveRib(rib: Omit<SavedRib, "id">): Promise<SavedRib> {
  const list = await loadSavedRibs();
  const entry: SavedRib = { ...rib, id: `rib_${Date.now()}` };
  const next = [entry, ...list.filter((r) => r.iban !== entry.iban)].slice(0, 5);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return entry;
}
