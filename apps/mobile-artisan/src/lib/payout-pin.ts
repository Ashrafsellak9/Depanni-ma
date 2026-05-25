import * as SecureStore from "expo-secure-store";

const PIN_KEY = "depanni_artisan_payout_pin";

export async function hasPayoutPin(): Promise<boolean> {
  const v = await SecureStore.getItemAsync(PIN_KEY);
  return Boolean(v);
}

export async function setPayoutPin(pin: string): Promise<void> {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function verifyPayoutPin(pin: string): Promise<boolean> {
  const stored = await SecureStore.getItemAsync(PIN_KEY);
  if (!stored) {
    if (pin.length >= 4) {
      await setPayoutPin(pin);
      return true;
    }
    return false;
  }
  return stored === pin;
}
