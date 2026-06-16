# LMS Frontend

Migrasi dari Vite + React 19 SPA ke **Next.js 16 + TypeScript + Tailwind CSS + App Router**.

## Stack

| Concern | Teknologi |
|---|---|
| Framework | Next.js 16, App Router |
| Bahasa | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| HTTP Client | Axios (instance + 401 interceptor) |
| Server State | TanStack Query v5 |
| Client State | Zustand |
| Forms | React Hook Form + Zod |
| Notifikasi | Sonner (toast) |

## Instalasi

```bash
# 1. Install dependencies
npm install

# 2. Setup shadcn/ui (mengisi components/ui/)
npx shadcn@latest init
npx shadcn@latest add button input label card badge skeleton tabs dialog \
  alert-dialog select checkbox textarea avatar separator sheet scroll-area \
  progress radio-group tooltip popover calendar

# 3. Copy env file
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL dan NEXT_PUBLIC_STORAGE_URL

# 4. Jalankan dev server
npm run dev
```

## Variabel Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STORAGE_URL=http://localhost:8000/storage/
API_URL=http://localhost:8000/api
SESSION_COOKIE_NAME=laravel_session
```

## Struktur Folder

```
app/                    Next.js App Router
  (auth)/               Route group: halaman publik (login)
  (protected)/          Route group: halaman yang butuh autentikasi
components/
  layout/               Sidebar, TabBar, Breadcrumb
  shared/               Komponen reusable (DataTable, Cards, dll)
  ui/                   shadcn/ui primitives
features/               Fitur per domain
  auth/                 Login, Dashboard, Profil
  users/                Manajemen user
  faculties/            Fakultas
  departments/          Jurusan
  semesters/            Semester
  subjects/             Mata Pelajaran
  classrooms/           Kelas
  schedules/            Jadwal
  assignments/          Tugas
  assignment-submissions/ Pengumpulan Tugas
  exams/                Ujian
  exam-submissions/     Pengumpulan Ujian
hooks/                  Global hooks
lib/                    Axios, QueryClient, utilities
providers/              React providers
services/               Service layer (mapping backend → English types)
stores/                 Zustand stores
types/                  Domain types (English naming)
utils/                  Helper functions
```

## Perbedaan Utama dari Versi Lama

| Masalah Lama | Solusi Baru |
|---|---|
| `useLogin` redirect ke `/home` (tidak ada) | Redirect benar: Admin→`/admin`, Teacher→`/teacher`, Student→`/` |
| `AuthContext` login() double fetch `getMeApi()` | Hapus call redundan, trust login response |
| `useHomeData` stale closure (`user` hilang dari deps) | TanStack Query dengan `queryKey: ['home', user.id]` |
| N+1 requests di student home | Satu combined query untuk semua submission status |
| 30-second polling manual tanpa cache | `refetchInterval: 30_000` + TanStack Query cache |
| `alert()` di 5 tempat | Sonner `toast.error()` |
| Nama Indonesia di types & functions | Semua nama English, mapping hanya di `services/` |
| `LABEL_MAP` duplikat di 4 file | `features/assignments/constants/assignment-type-labels.ts` |
| `formatDate` duplikat 8+ file | `lib/format-date.ts` |
| `STORAGE_URL` prefix duplikat 4 file | `lib/storage.ts` `withStorageUrl()` |
| `role === "1"` magic strings (34×) | `USER_ROLE.Admin`, `USER_ROLE.Teacher`, `USER_ROLE.Student` |
| `TaskDetail.tsx` 473 baris God Component | Split: `StudentSubmissionPanel` + `TeacherSubmissionsPanel` |
| `useExamDetail.ts` 2 hook tidak terkait | Split: `use-exam-session.ts` + `use-exam-list.ts` |
| File progress upload palsu | Staging langsung, progress nyata via Axios `onUploadProgress` |
| `BreadcrumbGlobal` API call duplikat | TanStack Query cache (breadcrumb + detail page share cache) |
| Mock data 3 file tidak dipakai | Dihapus |
