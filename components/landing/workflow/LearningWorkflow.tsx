import { WorkflowStep } from "./WorkflowStep";

const steps = [
  {
    title: "Konfigurasi Struktur Akademik",
    description:
      "Admin menyiapkan fakultas dan jurusan, lalu membuat semester untuk mendefinisikan kalender akademik.",
  },
  {
    title: "Daftarkan Mata Kuliah & Kelas",
    description:
      "Mata kuliah ditambahkan berdasarkan jurusan dan semester yang sesuai. Kelas dibuat dan dihubungkan ke sesi perkuliahan.",
  },
  {
    title: "Susun Jadwal",
    description:
      "Jadwal dibangun dengan mengaitkan mata kuliah, kelas, dan dosen ke dalam sesi perkuliahan yang terstruktur.",
  },
  {
    title: "Daftarkan Pengguna",
    description:
      "Admin mendaftarkan dosen dan mahasiswa, lalu menetapkan masing-masing ke mata kuliah yang relevan sesuai perannya.",
  },
  {
    title: "Buat Tugas & Ujian",
    description:
      "Dosen membuat tugas beserta tenggat waktu dan mengonfigurasi sesi ujian dengan waktu mulai dan berakhir yang jelas.",
  },
  {
    title: "Kumpulkan & Pantau",
    description:
      "Mahasiswa mengumpulkan tugas dan menyelesaikan sesi ujian. Semua pengumpulan tercatat dan tersedia untuk ditinjau.",
  },
] as const;

const leftSteps = steps.slice(0, 3);
const rightSteps = steps.slice(3);

export function LearningWorkflow() {
  return (
    <section id="workflow" className="bg-slate-50 px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-600">
            Cara Kerja
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-950 leading-tight max-w-xl">
            Dari konfigurasi hingga pengumpulan
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-lg font-light">
            Alur operasional yang mencakup siklus akademik penuh — dari
            pengaturan awal hingga pengumpulan mahasiswa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-24">
          <div>
            {leftSteps.map((step, i) => (
              <WorkflowStep
                key={step.title}
                step={i + 1}
                title={step.title}
                description={step.description}
                isLast={i === leftSteps.length - 1}
              />
            ))}
          </div>
          <div>
            {rightSteps.map((step, i) => (
              <WorkflowStep
                key={step.title}
                step={i + 4}
                title={step.title}
                description={step.description}
                isLast={i === rightSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}