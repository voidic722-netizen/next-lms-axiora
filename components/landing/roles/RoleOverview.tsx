"use client";

import type { LucideIcon } from "lucide-react";
import { ShieldCheck, BookOpen, GraduationCap } from "lucide-react";
import { RoleCard } from "./RoleCard";

interface Role {
  icon: LucideIcon;
  role: string;
  description: string;
  capabilities: readonly string[];
}

const roles: Role[] = [
  {
    icon: ShieldCheck,
    role: "Admin",
    description:
      "Mengelola seluruh infrastruktur akademik dan basis pengguna platform.",
    capabilities: [
      "Konfigurasi fakultas dan jurusan",
      "Buat dan kelola semester",
      "Daftarkan dan kelola semua pengguna",
      "Siapkan mata kuliah dan kelas",
      "Buat dan tetapkan jadwal",
    ],
  },
  {
    icon: BookOpen,
    role: "Dosen",
    description:
      "Beroperasi dalam mata kuliah yang ditugaskan untuk mengelola konten dan penilaian akademik.",
    capabilities: [
      "Lihat mata kuliah dan jadwal yang ditugaskan",
      "Buat dan kelola tugas",
      "Konfigurasikan dan selenggarakan sesi ujian",
      "Tinjau dan pantau pengumpulan mahasiswa",
    ],
  },
  {
    icon: GraduationCap,
    role: "Mahasiswa",
    description:
      "Mengakses konten akademik dan berpartisipasi dalam penilaian di mata kuliah yang diikuti.",
    capabilities: [
      "Lihat mata kuliah dan jadwal yang diikuti",
      "Kumpulkan tugas sebelum tenggat waktu",
      "Ikuti sesi ujian yang terstruktur",
      "Akses status pengumpulan dan hasil",
    ],
  },
];

export function RoleOverview() {
  return (
    <section id="roles" className="bg-white px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-600">
            Akses Berbasis Peran
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-950 leading-tight max-w-xl">
            Dirancang untuk setiap peran di institusi Anda
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-lg font-light">
            Setiap peran memiliki tanggung jawab dan izin yang jelas — tidak
            ada tumpang tindih, tidak ada ambiguitas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r, i) => (
            <RoleCard
              key={r.role}
              icon={r.icon}
              role={r.role}
              description={r.description}
              capabilities={r.capabilities}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}