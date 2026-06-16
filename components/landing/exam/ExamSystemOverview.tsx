"use client";

import type { LucideIcon } from "lucide-react";
import { FileText, Clock, CheckSquare, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface ExamPhase {
  icon: LucideIcon;
  label: string;
  description: string;
}

const phases: ExamPhase[] = [
  {
    icon: FileText,
    label: "Ujian Dikonfigurasi",
    description:
      "Dosen menentukan ujian, menetapkannya ke mata kuliah, dan mengatur waktu mulai serta berakhirnya sesi.",
  },
  {
    icon: Clock,
    label: "Sesi Berlangsung",
    description:
      "Mahasiswa mengakses ujian selama jendela sesi aktif. Integritas sesi ditegakkan sepanjang proses.",
  },
  {
    icon: CheckSquare,
    label: "Pengumpulan Tercatat",
    description:
      "Jawaban mahasiswa dikumpulkan dan disimpan. Seluruh pengumpulan dapat diakses dosen untuk ditinjau.",
  },
];

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function ExamSystemOverview() {
  return (
    <section id="exam" className="bg-neutral-950 px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-400">
            Sistem Ujian
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-tight max-w-xl">
            Sesi ujian terkontrol, dari konfigurasi hingga pengumpulan.
          </h2>
          <p className="mt-5 text-lg text-neutral-400 leading-relaxed max-w-lg font-light">
            Ujian dikonfigurasi per mata kuliah dengan jendela sesi yang
            terstruktur. Integritas sesi ditegakkan sepanjang proses
            berlangsung.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-5">
          {phases.map((phase, i) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-7 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-800 group-hover:bg-purple-600/20 transition-colors duration-300">
                    <Icon className="h-5 w-5 text-neutral-400 group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                  <span className="text-4xl font-bold text-neutral-800 select-none tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mb-2.5 text-sm font-semibold text-white">
                  {phase.label}
                </p>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {phase.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
          className="flex flex-col sm:flex-row items-start gap-6 rounded-2xl border border-purple-500/20 bg-purple-600/5 p-8"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/20">
            <ShieldCheck className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">
              Pengamanan sesi ujian secara real-time
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
              Setiap sesi ujian dilengkapi dengan kontrol integritas bawaan.
              Aktivitas mahasiswa dipantau selama sesi aktif berlangsung untuk
              menjaga konsistensi dan keadilan penilaian.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}