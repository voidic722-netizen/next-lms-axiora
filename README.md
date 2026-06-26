# 🎓 LMS Frontend - Next.js App Router

> **Antarmuka pengguna LMS modern dengan arsitektur UI berbasis Modal (Dialog), State Management tersentralisasi, dan performa tinggi menggunakan Next.js 16 (Turbopack) & React 19.**

Repositori ini berisi kode frontend untuk sistem manajemen akademik Axiora. Dirancang dengan fokus mendalam pada **User Experience (UX)** dan pengalaman pengembang (*Developer Experience*), menggunakan stack ekosistem React terbaru.

---

## 🚀 Fitur Unggulan

- **💯 Arsitektur UI Berbasis Modal:** Seluruh operasi entitas CRUD (Create & Update) dilakukan melalui *Shadcn Dialog Modals*. Tanpa pemindahan/pengalihan halaman secara utuh, menghasilkan *flow* kerja pengguna yang jauh lebih cepat, mulus, dan terfokus.
- **🛡️ Validasi & Penanganan Error Terpusat:** Menggunakan `react-hook-form` + `Zod` yang dipadukan dengan abstraksi utilitas `handleApiError` untuk memetakan error *422 Unprocessable Entity* dari Laravel langsung ke *field-field* form secara reaktif.
- **🔒 Akses & Navigasi Terproteksi:** Tata letak dan rute (Sidebar, Menu) dirender secara dinamis menyesuaikan *Role* dari pengguna yang masuk (*Admin*, *Lecturer*, *Student*).
- **⚡ Super Cepat:** Dibangun di atas Next.js 16 dengan kompilator **Turbopack** dan integrasi React 19 untuk pengalaman navigasi SPA *client-side* secepat kilat.
- **🎨 UI Modern & Konsisten:** Memanfaatkan kekuatan **Tailwind CSS v4** bersama dengan komponen aksesibel dari **Radix UI** (*Shadcn*). Animasi halus dengan efek *backdrop-blur* pada semua dialog.
- **📡 Manajemen State & Cache Kuat:** Kombinasi **Zustand** untuk *state* global tersinkronisasi (seperti sesi autentikasi) dan **TanStack React Query v5** untuk menangani *caching*, validasi, dan sinkronisasi *server state* (API data).

---

## 🛠️ Tech Stack

| Kategori | Teknologi Utama |
|---|---|
| **Core Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4 |
| **Komponen UI** | Radix UI Primitives, Shadcn UI, Lucide Icons |
| **Manajemen Form** | React Hook Form, Zod (Validasi Skema) |
| **HTTP & API Cache** | Axios, TanStack React Query v5 |
| **State Global** | Zustand |
| **Lain-lain** | Sonner (Toasts/Notifikasi), MSW (Mocking, opsional) |

---

## 📂 Struktur Proyek

Aplikasi terorganisir dengan rapi mengikuti praktik terbaik *feature-based folder structure*:

```text
├── app/                   # Root Next.js App Router
│   ├── (auth)/            # Grup layout untuk Login
│   ├── (protected)/       # Grup layout terproteksi (Dashboard, Modul Utama)
│   └── layout.tsx         # Struktur HTML utama
├── components/            
│   ├── layout/            # Sidebar, Navbar, Profile Dropdown
│   └── ui/                # Base Reusable Components (Button, Input, Form, Dialog)
├── features/              # ⬅️ KODE DOMAIN/MODUL UTAMA BERADA DI SINI
│   ├── assignments/       # Modul Tugas
│   ├── auth/              # Modul Login & Profil
│   ├── classrooms/        # Modul Kelas
│   ├── departments/       # Modul Departemen
│   ├── exams/             # Modul Ujian
│   ├── faculties/         # Modul Fakultas
│   ├── schedules/         # Modul Jadwal
│   ├── semesters/         # Modul Semester
│   ├── subjects/          # Modul Mata Kuliah
│   └── users/             # Modul Manajemen Pengguna (Admin)
├── hooks/                 # Custom React hooks generik
├── lib/                   # Utilitas inti (Konfigurasi Axios, Error Handlers)
├── services/              # Integrasi langsung dengan backend API (Axios callers)
├── stores/                # Zustand global stores (useAuthStore)
└── types/                 # Definisi Tipe dan Interface TypeScript
```

---

## 💻 Panduan Instalasi & Setup

### Prasyarat
- Node.js >= 20.x
- npm / yarn / pnpm
- [Backend Laravel Axiora](https://github.com/...) harus sudah berjalan di lokal (biasanya di `http://127.0.0.1:8000`).

### Langkah-langkah

1. **Clone Repositori**
   ```bash
   git clone <repo-url>
   cd lms-nextjs
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Pengaturan Environment**
   Salin *template environment* ke dalam file lokal:
   ```bash
   cp .env.local.example .env.local
   ```
   Pastikan variabel `NEXT_PUBLIC_API_URL` mengarah ke URL backend Anda yang berjalan:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Jalankan Server Development (Turbopack)**
   ```bash
   npm run dev
   ```
   Aplikasi akan dapat diakses pada browser di alamat `http://localhost:3000`.

---

## 📜 Skrip NPM Utama

- `npm run dev` : Menjalankan server pengembangan dengan Turbopack untuk HMR super cepat.
- `npm run build` : Melakukan validasi tipe, linting, dan kompilasi (*bundle*) aplikasi untuk *production*.
- `npm start` : Menjalankan server produksi dari hasil *build* sebelumnya.
- `npm run lint` : Memeriksa standar kode dan potensi *bug* dengan ESLint.

---

## 🔐 Akun Demo Akses

Silakan gunakan daftar akun berikut di halaman `/login` untuk menguji fungsionalitas antarmuka dari berbagai peran (*Role*):

| Role | Email | Password |
|---|---|---|
| **Admin** (Akses Penuh) | `admin@axiora.com` | `password123` |
| **Dosen** (Lecturer) | `teacher@axiora.com` | `password` |
| **Kaprodi** (Lecturer) | `teacher2@axiora.com` | `password` |
| **Dekan** (Lecturer) | `teacher3@axiora.com` | `password` |
| **Mahasiswa** (Student) | `student@axiora.com` | `password` |

*(Catatan: Pastikan database backend telah di-seed dengan `php artisan migrate:fresh --seed` sebelum mencoba login).*
