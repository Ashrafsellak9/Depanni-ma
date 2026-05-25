"use client";

import { motion } from "framer-motion";

export function AdminPageCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-dep-border bg-white p-5 md:p-6"
    >
      {children}
    </motion.div>
  );
}
