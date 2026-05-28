"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { StepVisual } from "@/components/how-it-works/StepVisual";
import type { HowItWorksStep } from "@/components/how-it-works/howItWorksData";
import { cn } from "@/lib/utils";

function StepBlock({ step, index }: { step: HowItWorksStep; index: number }) {
  const TimeIcon = step.timeIcon;
  const reversed = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "mx-auto mb-20 grid max-w-[1000px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20",
        reversed && "lg:grid-flow-dense",
      )}
    >
      <div className={cn(reversed && "lg:col-start-2")}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl font-syne text-[18px] font-extrabold text-white",
              step.color === "orange" ? "bg-orange" : "bg-navy",
            )}
          >
            {step.num}
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-green/15 bg-green/[0.08] px-3 py-1.5">
            <TimeIcon size={12} className="text-green" />
            <span className="text-[11px] font-semibold text-green">{step.time}</span>
          </div>
        </div>

        <h2 className="mb-4 font-syne text-[32px] font-extrabold leading-[1.1] tracking-[-1px] text-navy">
          {step.title}
        </h2>

        <p className="mb-5 text-[16px] font-light leading-[1.7] text-dep-gray">{step.desc}</p>

        <ul className="space-y-2.5">
          {step.details.map((detail) => (
            <li key={detail} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange/10">
                <Check size={11} className="text-orange" strokeWidth={3} />
              </div>
              <span className="text-[14px] text-navy">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("flex justify-center", reversed && "lg:col-start-1 lg:row-start-1")}>
        <StepVisual stepId={step.visual} stepNum={index + 1} />
      </div>
    </motion.div>
  );
}

export function HowItWorksSteps({ steps }: { steps: HowItWorksStep[] }) {
  return (
    <div className="bg-[#EDE8DF] pb-8 pt-2">
      {steps.map((step, i) => (
        <StepBlock key={step.num} step={step} index={i} />
      ))}
    </div>
  );
}
