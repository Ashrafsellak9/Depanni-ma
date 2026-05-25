"use client";

import { useParams } from "next/navigation";

import { DisputeDetail } from "@/components/disputes/DisputeDetail";

export default function LitigeDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <DisputeDetail id={id} />;
}
