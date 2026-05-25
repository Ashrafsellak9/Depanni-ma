import { api, unwrapApi } from "@/src/lib/api";
import type { TrackingView } from "@/src/types/mission";

export async function fetchMissionTracking(missionId: string): Promise<TrackingView> {
  const res = await api.get(`/tracking/missions/${missionId}`);
  return unwrapApi<TrackingView>(res);
}
