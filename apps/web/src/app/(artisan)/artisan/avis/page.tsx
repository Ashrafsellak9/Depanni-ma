"use client";

import { RecentReviews } from "@/components/artisan/RecentReviews";

export default function ArtisanAvisPage() {
  return (
    <div className="max-w-xl">
      <RecentReviews />
      <p className="mt-4 text-center text-[13px] text-dep-gray">
        200 avis au total · Note moyenne 4.9/5
      </p>
    </div>
  );
}
