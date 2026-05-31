import { useLocalSearchParams } from "expo-router";

import { OfferForm } from "@/src/components/mission/OfferForm";

export default function SubmitOfferScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  return <OfferForm jobId={jobId ?? ""} />;
}
