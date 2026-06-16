// Semua data dummy untuk development preview
// Tidak ada data ini yang masuk ke production

import type { User } from '@/types/user'
import type { Faculty } from '@/types/faculty'
import type { Department } from '@/types/department'
import type { Semester } from '@/types/semester'
import type { Subject } from '@/types/subject'
import type { Classroom } from '@/types/classroom'
import type { Schedule } from '@/types/schedule'
import type { Assignment } from '@/types/assignment'
import type { Exam } from '@/types/exam'

export const MOCK_USERS: User[] = [
  {
    id: 1, name: 'Admin Utama', email: 'admin@lms.id', role: '1',
    image: null, position: null, nidn: null, nim: null,
    facultyId: null, departmentId: null, classroomId: null, subjectId: null,
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', deletedAt: null,
  },
  {
    id: 2, name: 'Dr. Budi Santoso', email: 'budi@lms.id', role: '2',
    image: null, position: 'dosen', nidn: '0012345678', nim: null,
    facultyId: 1, departmentId: 1, classroomId: null, subjectId: 1,
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', deletedAt: null,
    faculty: { id: 1, name: 'Fakultas Teknik' },
    department: { id: 1, name: 'Teknik Informatika' },
    subject: { id: 1, name: 'Algoritma & Pemrograman' },
  },
  {
    id: 3, name: 'Siti Rahayu', email: 'siti@lms.id', role: '3',
    image: null, position: null, nidn: null, nim: '2024001001',
    facultyId: 1, departmentId: 1, classroomId: 1, subjectId: null,
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', deletedAt: null,
    faculty: { id: 1, name: 'Fakultas Teknik' },
    department: { id: 1, name: 'Teknik Informatika' },
    classroom: { id: 1, name: 'Kelas A' },
  },
  {
    id: 4, name: 'Ahmad Fauzi', email: 'ahmad@lms.id', role: '3',
    image: null, position: null, nidn: null, nim: '2024001002',
    facultyId: 1, departmentId: 1, classroomId: 1, subjectId: null,
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', deletedAt: null,
    faculty: { id: 1, name: 'Fakultas Teknik' },
    department: { id: 1, name: 'Teknik Informatika' },
    classroom: { id: 1, name: 'Kelas A' },
  },
  {
    id: 5, name: 'Prof. Rina Wijaya', email: 'rina@lms.id', role: '2',
    image: null, position: 'kaprodi', nidn: '0098765432', nim: null,
    facultyId: 1, departmentId: 1, classroomId: null, subjectId: 2,
    createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', deletedAt: null,
    faculty: { id: 1, name: 'Fakultas Teknik' },
    department: { id: 1, name: 'Teknik Informatika' },
    subject: { id: 2, name: 'Basis Data' },
  },
]

export const MOCK_FACULTIES: Faculty[] = [
  {
    id: 1, name: 'Fakultas Teknik', description: 'Fakultas yang berfokus pada ilmu teknik dan teknologi.',
    dean: 'Dr. Hendra Kusuma', thumbnail: null, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2, name: 'Fakultas Ekonomi', description: 'Fakultas yang berfokus pada ilmu ekonomi dan bisnis.',
    dean: 'Dr. Maya Sari', thumbnail: null, createdAt: '2024-01-01T00:00:00Z',
  },
]

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 1, name: 'Teknik Informatika', description: 'Program studi ilmu komputer dan rekayasa perangkat lunak.',
    facultyId: 1, thumbnail: null, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2, name: 'Teknik Elektro', description: 'Program studi kelistrikan dan elektronika.',
    facultyId: 1, thumbnail: null, createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3, name: 'Manajemen', description: 'Program studi manajemen bisnis dan organisasi.',
    facultyId: 2, thumbnail: null, createdAt: '2024-01-01T00:00:00Z',
  },
]

export const MOCK_SEMESTERS: Semester[] = [
  { id: 1, name: 'Semester Ganjil', academicYear: '2024/2025', createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'Semester Genap', academicYear: '2024/2025', createdAt: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'Semester Ganjil', academicYear: '2025/2026', createdAt: '2024-08-01T00:00:00Z' },
]

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1, name: 'Algoritma & Pemrograman', type: 'wajib', departmentId: 1,
    description: 'Dasar-dasar algoritma dan pemrograman komputer.', thumbnail: null,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2, name: 'Basis Data', type: 'wajib', departmentId: 1,
    description: 'Desain dan implementasi sistem basis data relasional.', thumbnail: null,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3, name: 'Kalkulus', type: 'umum', departmentId: null,
    description: 'Matematika dasar kalkulus diferensial dan integral.', thumbnail: null,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4, name: 'Pemrograman Web', type: 'wajib', departmentId: 1,
    description: 'Pengembangan aplikasi web frontend dan backend.', thumbnail: null,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

export const MOCK_CLASSROOMS: Classroom[] = [
  {
    id: 1, name: 'TI-A 2024', departmentId: 1, semesterId: 1, subjectId: 1,
    createdAt: '2024-01-01T00:00:00Z',
    department: { id: 1, name: 'Teknik Informatika' },
    semester: { id: 1, name: 'Semester Ganjil', academicYear: '2024/2025' },
    subject: { id: 1, name: 'Algoritma & Pemrograman' },
  },
  {
    id: 2, name: 'TI-B 2024', departmentId: 1, semesterId: 1, subjectId: 2,
    createdAt: '2024-01-01T00:00:00Z',
    department: { id: 1, name: 'Teknik Informatika' },
    semester: { id: 1, name: 'Semester Ganjil', academicYear: '2024/2025' },
    subject: { id: 2, name: 'Basis Data' },
  },
  {
    id: 3, name: 'MNJ-A 2024', departmentId: 3, semesterId: 1, subjectId: 3,
    createdAt: '2024-01-01T00:00:00Z',
    department: { id: 3, name: 'Manajemen' },
    semester: { id: 1, name: 'Semester Ganjil', academicYear: '2024/2025' },
    subject: { id: 3, name: 'Kalkulus' },
  },
]

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const nextWeek = new Date()
nextWeek.setDate(nextWeek.getDate() + 7)
const yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const lastWeek = new Date()
lastWeek.setDate(lastWeek.getDate() - 7)

export const MOCK_SCHEDULES: Schedule[] = [
  {
    id: 1, date: tomorrow.toISOString(), classroomId: 1, topic: 'Pengenalan Algoritma Rekursif',
    createdAt: '2024-01-01T00:00:00Z',
    classroom: { id: 1, name: 'TI-A 2024' },
  },
  {
    id: 2, date: nextWeek.toISOString(), classroomId: 1, topic: 'Sorting Algorithm: QuickSort & MergeSort',
    createdAt: '2024-01-01T00:00:00Z',
    classroom: { id: 1, name: 'TI-A 2024' },
  },
  {
    id: 3, date: yesterday.toISOString(), classroomId: 2, topic: 'Normalisasi Database (1NF, 2NF, 3NF)',
    createdAt: '2024-01-01T00:00:00Z',
    classroom: { id: 2, name: 'TI-B 2024' },
  },
]

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 1, title: 'Laporan Praktikum Sorting',
    description: 'Implementasikan algoritma bubble sort, selection sort, dan insertion sort dalam Python.',
    types: ['individu', 'praktek'], classroomIds: [1], dueDate: nextWeek.toISOString(),
    maxFileSize: 10, subjectId: 1, subject: { id: 1, name: 'Algoritma & Pemrograman' },
    modules: [], createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2, title: 'Tugas Kelompok ERD',
    description: 'Buat Entity Relationship Diagram untuk sistem manajemen perpustakaan.',
    types: ['kelompok', 'teori'], classroomIds: [1, 2], dueDate: tomorrow.toISOString(),
    maxFileSize: 5, subjectId: 2, subject: { id: 2, name: 'Basis Data' },
    modules: [], createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3, title: 'Tugas Algoritma Rekursif',
    description: 'Selesaikan 10 soal algoritma rekursif berikut menggunakan bahasa pemrograman pilihanmu.',
    types: ['individu', 'teori'], classroomIds: [1], dueDate: lastWeek.toISOString(),
    maxFileSize: 2, subjectId: 1, subject: { id: 1, name: 'Algoritma & Pemrograman' },
    modules: [], createdAt: '2024-01-01T00:00:00Z',
  },
]

export const MOCK_EXAMS: Exam[] = [
  {
    id: 1, title: 'UTS Algoritma & Pemrograman',
    description: 'Ujian Tengah Semester materi algoritma dasar.',
    examTypes: ['UTS'], classroomIds: [1],
    availableDate: new Date(Date.now() - 3600000).toISOString(),
    deadlineDate: nextWeek.toISOString(),
    durationMinutes: 90,
    questions: [
      {
        id: 'q1', text: 'Manakah kompleksitas waktu dari algoritma Bubble Sort dalam kasus terburuk?',
        type: 'multiple-choice', image: null,
        options: [
          { id: 'a', label: 'O(n)', isCorrect: false },
          { id: 'b', label: 'O(n log n)', isCorrect: false },
          { id: 'c', label: 'O(n²)', isCorrect: true },
          { id: 'd', label: 'O(log n)', isCorrect: false },
        ],
      },
      {
        id: 'q2', text: 'Struktur data LIFO (Last In, First Out) diimplementasikan oleh?',
        type: 'multiple-choice', image: null,
        options: [
          { id: 'a', label: 'Queue', isCorrect: false },
          { id: 'b', label: 'Stack', isCorrect: true },
          { id: 'c', label: 'Linked List', isCorrect: false },
          { id: 'd', label: 'Tree', isCorrect: false },
        ],
      },
      {
        id: 'q3', text: 'Algoritma pencarian yang memerlukan data terurut adalah?',
        type: 'multiple-choice', image: null,
        options: [
          { id: 'a', label: 'Linear Search', isCorrect: false },
          { id: 'b', label: 'Binary Search', isCorrect: true },
          { id: 'c', label: 'Sequential Search', isCorrect: false },
          { id: 'd', label: 'Brute Force Search', isCorrect: false },
        ],
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2, title: 'Quiz Basis Data',
    description: 'Quiz mingguan materi normalisasi dan SQL.',
    examTypes: ['Quiz'], classroomIds: [1, 2],
    availableDate: nextWeek.toISOString(),
    deadlineDate: new Date(nextWeek.getTime() + 7 * 86400000).toISOString(),
    durationMinutes: 45,
    questions: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
]

// Mock user yang bisa dipilih saat dev bypass
export const DEV_USERS = {
  admin: MOCK_USERS[0]!,
  teacher: MOCK_USERS[1]!,
  student: MOCK_USERS[2]!,
}