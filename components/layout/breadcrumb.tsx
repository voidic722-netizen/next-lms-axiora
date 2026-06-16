'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useMemo } from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getSubjectByIdService } from '@/services/subject-service'
import { getClassroomByIdService } from '@/services/classroom-service'
import { getFacultyDetailService } from '@/services/faculty-service'
import { getDepartmentDetailService } from '@/services/department-service'
import { getAssignmentByIdService } from '@/services/assignment-service'
import { getExamByIdService } from '@/services/exam-service'

const DETAIL_ROUTES = [
  'subjects',
  'classrooms',
  'faculties',
  'departments',
  'assignments',
  'exams',
] as const
type DetailRoute = (typeof DETAIL_ROUTES)[number]

const ROUTE_LABELS: Record<string, string> = {
  subjects: 'Mata Pelajaran',
  classrooms: 'Kelas',
  faculties: 'Fakultas',
  departments: 'Jurusan',
  assignments: 'Tugas',
  exams: 'Ujian',
  semesters: 'Semester',
  schedules: 'Jadwal',
  users: 'User',
  admin: 'Dashboard Admin',
  teacher: 'Dashboard Pengajar',
  profile: 'Profil',
  new: 'Tambah Baru',
  edit: 'Edit',
  submitted: 'Hasil Ujian',
  submissions: 'Pengumpulan',
  classes: 'Kelas',
  exams: 'Ujian',
}

function useEntityName(
  route: string | undefined,
  id: string | undefined,
): string | undefined {
  const isDetailRoute = route !== undefined && (DETAIL_ROUTES as readonly string[]).includes(route)
  const numericId = id ? parseInt(id, 10) : NaN
  const enabled = isDetailRoute && !isNaN(numericId)

  const { data: subject } = useQuery({
    queryKey: ['subjects', numericId],
    queryFn: () => getSubjectByIdService(numericId),
    enabled: enabled && route === 'subjects',
    staleTime: 5 * 60 * 1000,
  })

  const { data: classroom } = useQuery({
    queryKey: ['classrooms', numericId],
    queryFn: () => getClassroomByIdService(numericId),
    enabled: enabled && route === 'classrooms',
    staleTime: 5 * 60 * 1000,
  })

  const { data: faculty } = useQuery({
    queryKey: ['faculties', numericId],
    queryFn: () => getFacultyDetailService(numericId),
    enabled: enabled && route === 'faculties',
    staleTime: 5 * 60 * 1000,
  })

  const { data: department } = useQuery({
    queryKey: ['departments', numericId],
    queryFn: () => getDepartmentDetailService(numericId),
    enabled: enabled && route === 'departments',
    staleTime: 5 * 60 * 1000,
  })

  const { data: assignment } = useQuery({
    queryKey: ['assignments', numericId],
    queryFn: () => getAssignmentByIdService(numericId),
    enabled: enabled && route === 'assignments',
    staleTime: 5 * 60 * 1000,
  })

  const { data: exam } = useQuery({
    queryKey: ['exams', numericId],
    queryFn: () => getExamByIdService(numericId),
    enabled: enabled && route === 'exams',
    staleTime: 5 * 60 * 1000,
  })

  if (!enabled) return undefined
  if (route === 'subjects') return subject?.name
  if (route === 'classrooms') return classroom?.name
  if (route === 'faculties') return faculty?.name
  if (route === 'departments') return department?.name
  if (route === 'assignments') return assignment?.title
  if (route === 'exams') return exam?.title
  return undefined
}

interface Crumb {
  label: string
  href: string
}

export function Breadcrumb() {
  const pathname = usePathname()

  const segments = useMemo(
    () => pathname.split('/').filter(Boolean),
    [pathname],
  )

  const rootRoute = segments[0]
  const maybeId = segments[1]
  const isNumericId = maybeId !== undefined && /^\d+$/.test(maybeId)

  const entityName = useEntityName(
    isNumericId ? rootRoute : undefined,
    isNumericId ? maybeId : undefined,
  )

  const crumbs = useMemo<Crumb[]>(() => {
    if (segments.length === 0) return []

    const result: Crumb[] = []
    let currentPath = ''

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      if (!segment) continue
      currentPath += `/${segment}`

      const isId = /^\d+$/.test(segment)
      let label: string

      if (isId && entityName) {
        label = entityName
      } else if (isId) {
        label = `#${segment}`
      } else {
        label = ROUTE_LABELS[segment] ?? segment
      }

      result.push({ label, href: currentPath })
    }

    return result
  }, [segments, entityName])

  if (crumbs.length === 0) return null

  return (
    <header className="sticky top-0 z-10 border-b border-[#E2E8F0] bg-white/80 backdrop-blur">
      <div className="flex h-12 items-center gap-1 px-4 md:px-6 text-sm">
        <Link
          href="/"
          className="text-[#64748B] hover:text-[#4B5CF0] transition-colors duration-200 flex items-center"
        >
          <Home className="h-3.5 w-3.5" />
        </Link>

        {crumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-[#64748B] shrink-0" />
            {index === crumbs.length - 1 ? (
              <span className="font-medium text-[#0F172A] truncate max-w-[200px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-[#64748B] hover:text-[#0F172A] transition-colors duration-200 truncate max-w-[200px]"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </header>
  )
}