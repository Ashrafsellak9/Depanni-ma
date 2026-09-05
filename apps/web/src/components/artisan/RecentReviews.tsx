"use client";

import { motion } from "framer-motion";

import { DisplayTitle } from "@/components/ui/display-title";

const REVIEWS = [
  {
    name: "Fatima Z.",
    avatar: "FZ",
    color: "#1E3A5F",
    rating: 5,
    comment: "Très professionnel, rapide et propre. Je recommande vivement !",
    date: "Aujourd'hui",
  },
  {
    name: "Youssef B.",
    avatar: "YB",
    color: "#7C3AED",
    rating: 5,
    comment: "Excellent travail sur mon chauffe-eau. Prix honnête.",
    date: "Hier",
  },
  {
    name: "Hassan A.",
    avatar: "HA",
    color: "#059669",
    rating: 4,
    comment: "Bon artisan, ponctuel. Travail soigné.",
    date: "Il y a 2j",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-[12px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "text-orange" : "text-dep-gray/30"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function RecentReviews() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="rounded-2xl border border-dep-border bg-white p-5"
    >
      <DisplayTitle as="h3" size="sm" className="mb-4 text-[14px] font-semibold">
        Derniers avis clients
      </DisplayTitle>

      {REVIEWS.length === 0 ? (
        <p className="py-6 text-center text-sm text-dep-gray">Aucune donnée</p>
      ) : (
        <div className="space-y-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="border-b border-dep-border/50 pb-4 last:border-0 last:pb-0">
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                  style={{ backgroundColor: r.color }}
                >
                  {r.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-navy">{r.name}</div>
                  <Stars rating={r.rating} />
                </div>
                <span className="text-[10px] text-dep-gray">{r.date}</span>
              </div>
              <p className="line-clamp-2 text-[13px] italic text-dep-gray">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
