"use client";

export const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 40, scale: 0.96 },
  visible: { opacity: 1, x: 0, scale: 1 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

export const viewportOnce = { once: true, amount: 0.2 as const };
