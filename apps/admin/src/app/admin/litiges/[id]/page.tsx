"use client";

import { useParams } from "next/navigation";

import { DisputeDetail } from "@/components/disputes/DisputeDetail";

export default function AdminLitigeDetailPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <DisputeDetail id={id} />;
}
