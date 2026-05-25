import { api, unwrapApi } from "@/src/lib/api";

export async function startMissionTracking(missionId: string): Promise<void> {
  await api.post(`/tracking/missions/${missionId}/start`);
}

export async function postMissionPosition(
  missionId: string,
  coords: { lat: number; lng: number },
): Promise<unknown> {
  const res = await api.post(`/tracking/missions/${missionId}/position`, coords);
  return unwrapApi(res);
}

export async function confirmArrived(missionId: string): Promise<unknown> {
  const res = await api.post(`/tracking/missions/${missionId}/arrived`);
  return unwrapApi(res);
}
