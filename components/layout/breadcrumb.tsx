'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ChevronRight, Home, LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth-store'
import { logoutService } from '@/services/auth-service'
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
  const user = useAuthStore((s) => s.user)
  const clearUser = useAuthStore((s) => s.clearUser)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showLogoutAlert, setShowLogoutAlert] = useState(false)

  async function handleLogout() {
    try {
      await logoutService()
      clearUser()
      queryClient.clear()
      setShowLogoutAlert(false)
      router.push('/login')
    } catch {
      toast.error('Gagal keluar. Silakan coba lagi.')
    }
  }

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
    <header className="sticky top-0 z-10 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-6 text-[13px]">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Link
            href="/"
            className="inline-flex items-center justify-center size-7 rounded-md text-[#94A3B8] hover:text-[#4B5CF0] hover:bg-[#EEF1FF] transition-all duration-200 shrink-0"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>

          {crumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-1.5 overflow-hidden">
              <ChevronRight className="h-3 w-3 text-[#CBD5E1] shrink-0" />
              {index === crumbs.length - 1 ? (
                <span className="font-semibold text-[#0F172A] truncate max-w-[200px]">
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

        {user && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 outline-none hover:bg-[#F8FAFC] p-1 pr-2 rounded-full transition-colors duration-200 shrink-0 ml-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback className="text-xs bg-[#EEF1FF] text-[#4B5CF0] font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-[#64748B] hidden sm:block max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-1">
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all duration-200"
              >
                <UserIcon className="h-4 w-4 shrink-0" />
                Profil Saya
              </Link>
              <button
                onClick={() => setShowLogoutAlert(true)}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-all duration-200 text-left"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Keluar
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari aplikasi? Anda harus login kembali untuk masuk.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-[#EF4444] text-white hover:bg-[#EF4444]/90">
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}