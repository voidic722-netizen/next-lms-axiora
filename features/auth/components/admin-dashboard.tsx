'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  Users, School, BookText, GraduationCap, University, Building2,
  LayoutList, CalendarDays, ArrowRight,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
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

  // 7 query paralel — TanStack Query men-cache dan mencegah flash UI saat refetch
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
    { label: 'Admin', value: admins.length, icon: <Users className="h-5 w-5 text-red-500" />, href: '/users' },
    { label: 'Pengajar', value: teachers.length, icon: <Users className="h-5 w-5 text-blue-500" />, href: '/users' },
    { label: 'Mahasiswa', value: students.length, icon: <Users className="h-5 w-5 text-green-500" />, href: '/users' },
    { label: 'Kelas', value: classrooms.length, icon: <School className="h-5 w-5 text-orange-500" />, href: '/classrooms' },
    { label: 'Mata Pelajaran', value: subjects.length, icon: <BookText className="h-5 w-5 text-teal-500" />, href: '/subjects' },
    { label: 'Ujian', value: exams.length, icon: <GraduationCap className="h-5 w-5 text-purple-500" />, href: '/exams' },
    { label: 'Tugas', value: assignments.length, icon: <LayoutList className="h-5 w-5 text-yellow-500" />, href: '/assignments' },
    { label: 'Fakultas', value: faculties.length, icon: <University className="h-5 w-5 text-pink-500" />, href: '/faculties' },
    { label: 'Jurusan', value: departments.length, icon: <Building2 className="h-5 w-5 text-indigo-500" />, href: '/departments' },
    { label: 'Jadwal', value: schedules.length, icon: <CalendarDays className="h-5 w-5 text-cyan-500" />, href: '/schedules' },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard Admin</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Selamat datang, {user?.name}</p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:bg-muted/30 transition-colors cursor-pointer h-full">
              <CardContent className="pt-4 pb-3">
                {s.icon}
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Aksi Cepat */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {shortcuts.map((s) => (
            <Button key={s.href} asChild variant="outline" size="sm" className="justify-start">
              <Link href={s.href}>
                <ArrowRight className="mr-2 h-3.5 w-3.5" />
                {s.label}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function AdminSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-56" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
      </div>
      <Skeleton className="h-40 rounded-lg" />
    </div>
  )
}
