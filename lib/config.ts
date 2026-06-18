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

export const AUTH_TOKEN_COOKIE_NAME = 'auth_token'