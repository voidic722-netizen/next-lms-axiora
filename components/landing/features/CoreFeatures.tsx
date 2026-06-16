"use client";

import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarDays,
  LayoutGrid,
  Users,
  ClipboardList,
  FileCheck2,
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Building2,
    title: "Fakultas & Jurusan",
    description:
      "Susun struktur institusi ke dalam fakultas dan jurusan. Tetapkan hierarki akademik dan kepemilikan administratif.",
  },
  {
    icon: CalendarDays,
    title: "Semester & Mata Kuliah",
    description:
      "Konfigurasikan semester akademik dan kelola mata kuliah berdasarkan jurusan dan konteks semester yang sesuai.",
  },
  {
    icon: LayoutGrid,
    title: "Kelas & Jadwal",
    description:
      "Tetapkan kelas untuk mata kuliah dan buat jadwal terstruktur yang dapat diakses dosen dan mahasiswa.",
  },
  {
    icon: Users,
    title: "Manajemen Pengguna",
    description:
      "Kelola seluruh pengguna platform dengan peran Admin, Dosen, dan Mahasiswa secara terkontrol dan terstruktur.",
  },
  {
    icon: ClipboardList,
    title: "Tugas & Pengumpulan",
    description:
      "Buat dan distribusikan tugas per mata kuliah. Mahasiswa mengumpulkan pekerjaan langsung dalam platform.",
  },
  {
    icon: FileCheck2,
    title: "Sistem Ujian",
    description:
      "Selenggarakan ujian terstruktur dengan pengamanan sesi, pelacakan pengumpulan, dan manajemen hasil.",
  },
];

export function CoreFeatures() {
  return (
    <section id="features" className="bg-white px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-600">
            Modul Platform
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-950 leading-tight max-w-xl">
            Semua yang dibutuhkan universitas Anda
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-lg font-light">
            Dari konfigurasi fakultas hingga pengumpulan ujian — setiap modul
            dirancang khusus untuk operasional akademik.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}