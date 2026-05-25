"use client";

import { useParams } from "next/navigation";

import { ArtisanDetailView } from "@/components/artisans/ArtisanDetailView";

export default function AdminArtisanDetailPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <ArtisanDetailView id={id} />;
}
