export const siteConfig = {
  name: "Axiora",
  description:
    "Platform akademik terstruktur untuk mengelola fakultas, jurusan, semester, mata kuliah, kelas, tugas, dan ujian.",
  loginUrl: "/login",
  nav: [
    { label: "Fitur", href: "#features" },
    { label: "Alur Kerja", href: "#workflow" },
    { label: "Peran", href: "#roles" },
    { label: "Ujian", href: "#exam" },
    { label: "FAQ", href: "#faq" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
