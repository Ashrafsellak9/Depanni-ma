import type { FlatListProps } from "react-native";

export const FLATLIST_PERF_DEFAULTS = {
  removeClippedSubviews: true,
  windowSize: 7,
  maxToRenderPerBatch: 10,
  initialNumToRender: 8,
  updateCellsBatchingPeriod: 50,
} as const satisfies Partial<FlatListProps<unknown>>;

export function missionRowHeight(): number {
  return 112;
}

export function missionGetItemLayout(_: unknown, index: number) {
  const h = missionRowHeight();
  return { length: h, offset: h * index, index };
}
