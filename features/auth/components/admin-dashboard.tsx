'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  Users, School, BookText, GraduationCap, University, Building2,
  LayoutList, CalendarDays, ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
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

  const stats = [
    { label: 'Admin', value: admins.length, icon: <Users className="h-5 w-5 text-[#EF4444]" />, href: '/users' },
    { label: 'Pengajar', value: teachers.length, icon: <Users className="h-5 w-5 text-[#4B5CF0]" />, href: '/users' },
    { label: 'Mahasiswa', value: students.length, icon: <Users className="h-5 w-5 text-[#22C55E]" />, href: '/users' },
    { label: 'Kelas', value: classrooms.length, icon: <School className="h-5 w-5 text-[#F59E0B]" />, href: '/classrooms' },
    { label: 'Mata Pelajaran', value: subjects.length, icon: <BookText className="h-5 w-5 text-[#0EA5E9]" />, href: '/subjects' },
    { label: 'Ujian', value: exams.length, icon: <GraduationCap className="h-5 w-5 text-[#4B5CF0]" />, href: '/exams' },
    { label: 'Tugas', value: assignments.length, icon: <LayoutList className="h-5 w-5 text-[#F59E0B]" />, href: '/assignments' },
    { label: 'Fakultas', value: faculties.length, icon: <University className="h-5 w-5 text-[#EC4899]" />, href: '/faculties' },
    { label: 'Jurusan', value: departments.length, icon: <Building2 className="h-5 w-5 text-[#6366F1]" />, href: '/departments' },
    { label: 'Jadwal', value: schedules.length, icon: <CalendarDays className="h-5 w-5 text-[#22C55E]" />, href: '/schedules' },
  ]

  const shortcuts = [
    { label: 'Tambah User', href: '/users/new' },
    { label: 'Tambah Kelas', href: '/classrooms/new' },
    { label: 'Tambah Fakultas', href: '/faculties/new' },
    { label: 'Tambah Jurusan', href: '/departments/new' },
    { label: 'Tambah Semester', href: '/semesters/new' },
    { label: 'Tambah Jadwal', href: '/schedules/new' },
  ]

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">Dashboard Admin</h1>
        <p className="text-sm text-[#64748B] mt-1">Selamat datang, {user?.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-sm hover:border-[#4B5CF0] hover:shadow transition-all duration-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF1FF]">
                {s.icon}
              </div>
              <p className="text-2xl font-bold tabular-nums text-[#0F172A] mt-2">{s.value}</p>
              <p className="text-xs text-[#64748B]">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-sm">
        <h3 className="text-base font-semibold text-[#0F172A] mb-3">Aksi Cepat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {shortcuts.map((s) => (
            <Link key={s.href} href={s.href} className="flex items-center gap-2 text-sm font-medium text-[#4B5CF0] hover:text-[#3D4DE0] transition-colors duration-200">
              <ArrowRight className="h-3.5 w-3.5" />
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function AdminSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
      <Skeleton className="h-12 w-56 bg-[#E2E8F0]" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg bg-[#E2E8F0]" />)}
      </div>
      <Skeleton className="h-40 rounded-lg bg-[#E2E8F0]" />
    </div>
  )
}