"use client";

import { useParams } from "next/navigation";

import { ArtisanDetailView } from "@/components/artisans/ArtisanDetailView";

export default function ArtisanDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <ArtisanDetailView id={id} />;
}
