"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface RoleCardProps {
  readonly icon: LucideIcon;
  readonly role: string;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly index: number;
}

export function RoleCard({
  icon: Icon,
  role,
  description,
  capabilities,
  index,
}: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.09,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-8 hover:border-purple-200/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 group-hover:bg-purple-50 transition-colors duration-300">
        <Icon className="h-5 w-5 text-slate-600 group-hover:text-purple-600 transition-colors duration-300" />
      </div>
      <p className="text-lg font-semibold text-slate-950 mb-2">{role}</p>
      <p className="text-sm text-slate-500 leading-relaxed mb-8">
        {description}
      </p>
      <ul className="flex flex-col gap-3.5 mt-auto border-t border-slate-100 pt-6">
        {capabilities.map((cap) => (
          <li key={cap} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-50 border border-purple-100">
              <Check className="h-2.5 w-2.5 text-purple-600" />
            </span>
            <span className="text-sm text-slate-600">{cap}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}