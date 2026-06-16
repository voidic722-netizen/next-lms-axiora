"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly index: number;
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group rounded-2xl border border-slate-200/80 bg-white p-8 hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300">
        <Icon className="h-5 w-5 text-purple-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-950 mb-2.5">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}