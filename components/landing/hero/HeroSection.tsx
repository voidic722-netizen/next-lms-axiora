"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { HeroBadge } from "./HeroBadge";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function HeroSection() {
  return (
    <section className="relative bg-neutral-950 min-h-[100svh] flex flex-col items-center justify-center px-6 pt-20 pb-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-purple-600/10 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(147,51,234,0.07),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-neutral-950 to-transparent" />

      <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <HeroBadge />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease }}
          className="flex flex-col items-center gap-5"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold text-white tracking-tight leading-[1.04]">
            Sistem Pembelajaran
            <br />
            <span className="text-purple-400">Terpadu & Modern</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl leading-relaxed font-light">
            Manajemen akademik dan pembelajaran daring dalam satu platform.
            Mudah digunakan, aman, dan terstruktur untuk seluruh civitas akademika.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className="group h-12 px-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium shadow-[0_0_0_1px_rgba(147,51,234,0.4),0_4px_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_0_1px_rgba(147,51,234,0.5),0_4px_24px_rgba(147,51,234,0.4)] transition-all duration-200 hover:scale-[1.02]"
          >
            <Link href={siteConfig.loginUrl}>
              Masuk ke Platform
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-12 px-8 text-neutral-400 hover:text-white rounded-full border border-neutral-800 hover:border-neutral-600 hover:bg-white/5 transition-all duration-200"
          >
            <Link href="#features">Jelajahi Fitur</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.28, ease }}
          className="w-full max-w-3xl"
        >
          <DashboardPreview />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
    </section>
  );
}

function DashboardPreview() {
  const navItems = ["Beranda", "Mata Kuliah", "Jadwal", "Tugas", "Ujian", "Pengguna"];
  const subjects = [
    { name: "Kalkulus II", status: "Aktif" },
    { name: "Basis Data", status: "Aktif" },
    { name: "Algoritma & Pemrograman", status: "Menunggu" },
  ];

  return (
    <div className="relative rounded-2xl border border-neutral-800/80 bg-neutral-900/70 backdrop-blur-md shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-neutral-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="h-5 w-48 rounded-md bg-neutral-800 flex items-center justify-center">
            <div className="h-1.5 w-28 rounded-full bg-neutral-700" />
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="hidden sm:flex w-44 border-r border-neutral-800/60 p-3 flex-col gap-0.5 shrink-0">
          {navItems.map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2.5 h-8 px-3 rounded-lg text-xs ${
                i === 1 ? "bg-purple-600/15 text-purple-400" : "text-neutral-600"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  i === 1 ? "bg-purple-500" : "bg-neutral-700"
                }`}
              />
              {item}
            </div>
          ))}
        </div>

        <div className="flex-1 p-5 flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-32 rounded bg-neutral-800" />
              <div className="h-2.5 w-20 rounded bg-neutral-800/60" />
            </div>
            <div className="h-7 w-24 rounded-lg bg-purple-600/20 border border-purple-600/20 flex items-center justify-center shrink-0">
              <div className="h-1.5 w-12 rounded-full bg-purple-600/40" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {subjects.map((subj) => (
              <div
                key={subj.name}
                className="flex items-center gap-3 rounded-xl border border-neutral-800/60 bg-neutral-800/30 p-3"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-800 shrink-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded bg-neutral-700" />
                </div>
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <span className="text-xs text-neutral-300 font-medium truncate">
                    {subj.name}
                  </span>
                  <div className="h-1.5 w-20 rounded-full bg-neutral-800" />
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    subj.status === "Aktif"
                      ? "text-emerald-400 bg-emerald-400/10"
                      : "text-amber-400 bg-amber-400/10"
                  }`}
                >
                  {subj.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-950/80 to-transparent pointer-events-none" />
    </div>
  );
}