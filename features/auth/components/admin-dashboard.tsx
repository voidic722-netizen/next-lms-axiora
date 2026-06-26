'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  Users, School, BookText, GraduationCap, University, Building2,
  LayoutList, CalendarDays, Plus, Activity, ArrowUpRight
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { getUsersService } from '@/services/user-service'
import { getClassroomsService } from '@/services/classroom-service'
import { getSubjectsService } from '@/services/subject-service'
import { getExamsService } from '@/services/exam-service'
import { getAssignmentsService } from '@/services/assignment-service'
import { getFacultiesService } from '@/services/faculty-service'
import { getDepartmentsService } from '@/services/department-service'
import { getSchedulesService } from '@/services/schedule-service'
import { USER_ROLE } from '@/types/roles'

const REFETCH = { staleTime: 30_000, refetchInterval: 30_000, refetchOnWindowFocus: true } as const

export function AdminDashboard() {
  const { user } = useAuth()
  const enabled = !!user

  const { data: admins = [], isLoading: l1 } = useQuery({ queryKey: ['users', USER_ROLE.Admin], queryFn: () => getUsersService(USER_ROLE.Admin), enabled, ...REFETCH })
  const { data: teachers = [], isLoading: l2 } = useQuery({ queryKey: ['users', USER_ROLE.Teacher], queryFn: () => getUsersService(USER_ROLE.Teacher), enabled, ...REFETCH })
  const { data: students = [], isLoading: l3 } = useQuery({ queryKey: ['users', USER_ROLE.Student], queryFn: () => getUsersService(USER_ROLE.Student), enabled, ...REFETCH })
  const { data: classrooms = [], isLoading: l4 } = useQuery({ queryKey: ['classrooms'], queryFn: getClassroomsService, enabled, ...REFETCH })
  const { data: subjects = [], isLoading: l5 } = useQuery({ queryKey: ['subjects'], queryFn: getSubjectsService, enabled, ...REFETCH })
  const { data: exams = [], isLoading: l6 } = useQuery({ queryKey: ['exams'], queryFn: getExamsService, enabled, ...REFETCH })
  const { data: assignments = [], isLoading: l7 } = useQuery({ queryKey: ['assignments'], queryFn: getAssignmentsService, enabled, ...REFETCH })
  const { data: faculties = [] } = useQuery({ queryKey: ['faculties'], queryFn: getFacultiesService, enabled, ...REFETCH })
  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: getDepartmentsService, enabled, ...REFETCH })
  const { data: schedules = [] } = useQuery({ queryKey: ['schedules'], queryFn: getSchedulesService, enabled, ...REFETCH })

  const isLoading = l1 || l2 || l3 || l4 || l5 || l6 || l7

  if (isLoading) return <AdminSkeleton />

  const totalUsers = admins.length + teachers.length + students.length

  const primaryStats = [
    { label: 'Mahasiswa', value: students.length, icon: <Users className="h-5 w-5 text-[#4B5CF0]" />, href: '/users' },
    { label: 'Pengajar', value: teachers.length, icon: <Users className="h-5 w-5 text-[#4B5CF0]" />, href: '/users' },
    { label: 'Admin', value: admins.length, icon: <Users className="h-5 w-5 text-[#4B5CF0]" />, href: '/users' },
  ]

  const secondaryStats = [
    { label: 'Kelas', value: classrooms.length, icon: <School className="h-5 w-5 text-[#F59E0B]" />, href: '/classrooms', bg: 'bg-[#FFFBEB]' },
    { label: 'Mata Pelajaran', value: subjects.length, icon: <BookText className="h-5 w-5 text-[#0EA5E9]" />, href: '/subjects', bg: 'bg-[#F0F9FF]' },
    { label: 'Ujian', value: exams.length, icon: <GraduationCap className="h-5 w-5 text-[#4B5CF0]" />, href: '/exams', bg: 'bg-[#EEF1FF]' },
    { label: 'Tugas', value: assignments.length, icon: <LayoutList className="h-5 w-5 text-[#F59E0B]" />, href: '/assignments', bg: 'bg-[#FFFBEB]' },
    { label: 'Fakultas', value: faculties.length, icon: <University className="h-5 w-5 text-[#EC4899]" />, href: '/faculties', bg: 'bg-[#FDF2F8]' },
    { label: 'Jurusan', value: departments.length, icon: <Building2 className="h-5 w-5 text-[#6366F1]" />, href: '/departments', bg: 'bg-[#EEF2FF]' },
    { label: 'Jadwal', value: schedules.length, icon: <CalendarDays className="h-5 w-5 text-[#22C55E]" />, href: '/schedules', bg: 'bg-[#F0FDF4]' },
  ]

  const shortcuts = [
    { label: 'Tambah User', href: '/users/new', desc: 'Daftarkan admin, pengajar, atau mahasiswa baru' },
    { label: 'Tambah Kelas', href: '/classrooms/new', desc: 'Buat kelas baru untuk mata pelajaran' },
    { label: 'Tambah Fakultas', href: '/faculties/new', desc: 'Kelola data fakultas universitas' },
    { label: 'Tambah Jurusan', href: '/departments/new', desc: 'Tambahkan program studi baru' },
    { label: 'Tambah Semester', href: '/semesters/new', desc: 'Mulai tahun ajaran baru' },
    { label: 'Tambah Jadwal', href: '/schedules/new', desc: 'Atur jadwal pertemuan kelas' },
  ]

  return (
    <div className="space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">Command Center</h1>
          <p className="text-sm text-[#64748B] mt-1">Sistem Informasi Manajemen Axiora</p>
        </div>
        <Badge variant="outline" className="w-fit bg-white border-[#E2E8F0] text-[#0F172A] px-3 py-1.5 shadow-sm font-medium flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-[#22C55E]" />
          System Online
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Users Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-medium text-[#64748B] mb-1">Total Pengguna Terdaftar</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#0F172A] mb-6">{totalUsers}</h2>
            
            <div className="space-y-3">
              {primaryStats.map(s => (
                <Link key={s.label} href={s.href} className="block group">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:border-[#4B5CF0] hover:shadow-premium transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F8FAFC] group-hover:bg-[#EEF1FF] transition-colors">
                        {s.icon}
                      </div>
                      <span className="font-medium text-sm text-[#0F172A]">{s.label}</span>
                    </div>
                    <span className="font-bold text-lg text-[#0F172A]">{s.value}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Bento Grid Stats */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {secondaryStats.map((s) => (
              <Link key={s.label} href={s.href} className="group block h-full">
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-premium hover:border-[#CBD5E1] transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} group-hover:scale-110 transition-transform duration-300`}>
                      {s.icon}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#CBD5E1] group-hover:text-[#4B5CF0] transition-colors" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-[#0F172A] tracking-tight">{s.value}</p>
                    <p className="text-sm font-medium text-[#64748B] mt-0.5">{s.label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-[#0F172A] mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortcuts.map((s) => (
            <Link key={s.href} href={s.href} className="group block h-full">
              <div className="h-full bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm hover:shadow-premium hover:border-[#4B5CF0] transition-all duration-300 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] group-hover:bg-[#EEF1FF] group-hover:text-[#4B5CF0] transition-colors duration-300">
                  <Plus className="h-5 w-5 text-[#64748B] group-hover:text-[#4B5CF0] transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0F172A] text-sm mb-1 group-hover:text-[#4B5CF0] transition-colors">{s.label}</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function AdminSkeleton() {
  return (
    <div className="space-y-6 lg:space-y-8 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen max-w-7xl mx-auto">
      <Skeleton className="h-12 w-64 bg-[#E2E8F0]" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Skeleton className="h-[400px] rounded-2xl bg-[#E2E8F0]" />
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl bg-[#E2E8F0]" />)}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-32 bg-[#E2E8F0]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl bg-[#E2E8F0]" />)}
        </div>
      </div>
    </div>
  )
}