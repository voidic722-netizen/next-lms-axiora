"use client";

import type { LucideIcon } from "lucide-react";
import { ClipboardList, Send, Upload, Eye, ArrowDown, Check } from "lucide-react";
import { motion } from "framer-motion";

interface LifecycleStep {
  icon: LucideIcon;
  label: string;
  detail: string;
}

const lifecycleSteps: LifecycleStep[] = [
  {
    icon: ClipboardList,
    label: "Tugas Dibuat",
    detail:
      "Dosen menentukan judul, instruksi, dan tenggat waktu pengumpulan untuk suatu mata kuliah.",
  },
  {
    icon: Send,
    label: "Diterbitkan ke Mata Kuliah",
    detail:
      "Tugas menjadi terlihat oleh semua mahasiswa yang terdaftar di mata kuliah tersebut.",
  },
  {
    icon: Upload,
    label: "Mahasiswa Mengumpulkan",
    detail:
      "Mahasiswa mengumpulkan tugas langsung dalam platform sebelum tenggat waktu berakhir.",
  },
  {
    icon: Eye,
    label: "Dosen Meninjau",
    detail:
      "Semua pengumpulan dapat diakses oleh dosen untuk dipantau dan ditinjau.",
  },
];

const highlights = [
  "Tugas dikelola per mata kuliah dan semester",
  "Jendela pengumpulan berbasis tenggat waktu",
  "Riwayat pengumpulan lengkap per mahasiswa",
] as const;

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function AssignmentOverview() {
  return (
    <section className="bg-slate-50 px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease }}
            className="lg:sticky lg:top-28"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-600">
              Tugas & Pengumpulan
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-950 leading-tight">
              Distribusi tugas terstruktur, dari pembuatan hingga tinjauan.
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed font-light">
              Dosen membuat tugas per mata kuliah, mahasiswa mengumpulkan dalam
              platform, dan semua pengumpulan terpantau di satu tempat.
            </p>
            <ul className="mt-10 flex flex-col gap-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-50 border border-purple-100">
                    <Check className="h-3 w-3 text-purple-600" />
                  </span>
                  <span className="text-base text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease }}
            className="flex flex-col gap-3"
          >
            {lifecycleSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label}>
                  <div className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <Icon className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {step.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-slate-200 tabular-nums select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {i < lifecycleSteps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="h-4 w-4 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}