"use client";

import { motion } from "framer-motion";

interface WorkflowStepProps {
  readonly step: number;
  readonly title: string;
  readonly description: string;
  readonly isLast?: boolean;
}

export function WorkflowStep({
  step,
  title,
  description,
  isLast = false,
}: WorkflowStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: (step - 1) * 0.07,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="flex gap-6"
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm z-10">
          <span className="text-xs font-semibold text-slate-500">
            {String(step).padStart(2, "0")}
          </span>
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-12 mt-3 bg-gradient-to-b from-slate-200 to-transparent" />
        )}
      </div>
      <div className={`pt-1.5 ${isLast ? "pb-0" : "pb-12"}`}>
        <p className="text-base font-semibold text-slate-950 mb-2">{title}</p>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
    </motion.div>
  );
}