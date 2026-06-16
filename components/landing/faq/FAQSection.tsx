"use client";

import { motion } from "framer-motion";
import { Accordion } from "@/components/ui/accordion";
import { FAQItem } from "./FAQItem";

const faqs = [
  {
    question: "Siapa yang bertanggung jawab menyiapkan struktur akademik?",
    answer:
      "Admin mengonfigurasi seluruh infrastruktur akademik — termasuk fakultas, jurusan, semester, mata kuliah, kelas, dan jadwal. Dosen dan mahasiswa beroperasi dalam struktur yang telah ditetapkan Admin.",
  },
  {
    question: "Bagaimana mata kuliah diorganisasi dalam platform?",
    answer:
      "Mata kuliah didaftarkan di bawah jurusan dan semester tertentu, memastikan cakupan yang tepat dalam kalender akademik dan dapat diakses oleh pengguna yang sesuai.",
  },
  {
    question: "Apakah dosen dapat mengelola tugas di beberapa mata kuliah?",
    answer:
      "Ya. Dosen dapat membuat dan mengelola tugas secara mandiri untuk setiap mata kuliah yang ditugaskan. Setiap tugas memiliki cakupan khusus dalam mata kuliahnya masing-masing.",
  },
  {
    question: "Bagaimana sesi ujian diselenggarakan?",
    answer:
      "Dosen mengonfigurasi ujian dengan waktu mulai dan berakhir yang ditentukan per mata kuliah. Mahasiswa mengakses dan mengumpulkan ujian dalam jendela sesi tersebut. Kontrol integritas sesi aktif sepanjang proses berlangsung.",
  },
  {
    question: "Apa yang dimaksud dengan pengamanan sesi ujian?",
    answer:
      "Platform memiliki kontrol integritas bawaan yang memantau aktivitas mahasiswa selama sesi ujian aktif berlangsung, guna menjaga konsistensi dan keadilan penilaian.",
  },
  {
    question: "Apakah mahasiswa dapat melihat riwayat pengumpulan mereka?",
    answer:
      "Catatan pengumpulan tersimpan dalam platform. Mahasiswa dan dosen dapat mengakses data pengumpulan melalui modul tugas atau ujian yang bersangkutan.",
  },
  {
    question: "Bagaimana jadwal perkuliahan tersedia untuk pengguna?",
    answer:
      "Admin membangun jadwal dengan mengaitkan mata kuliah, kelas, dan dosen ke dalam sesi terstruktur. Dosen dan mahasiswa dapat melihat jadwal berdasarkan mata kuliah yang ditugaskan atau diikuti.",
  },
] as const;

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function FAQSection() {
  return (
    <section id="faq" className="bg-white px-6 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-[1fr_1.5fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-600">
              Pertanyaan Umum
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-slate-950 leading-tight">
              Pertanyaan yang sering diajukan
            </h2>
            <p className="mt-5 text-lg text-slate-500 leading-relaxed font-light">
              Jawaban atas pertanyaan umum tentang cara kerja platform di
              berbagai peran dan modul.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={faq.question}
                  value={`faq-${i}`}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}