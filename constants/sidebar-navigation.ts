import {
  BookText,
  Building2,
  Calendar,
  CalendarDays,
  GraduationCap,
  Home,
  LayoutDashboard,
  LayoutList,
  School,
  Settings,
  ShieldCheck,
  University,
  Users,
  BookMarked,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { USER_ROLE, type UserRole } from '@/types/roles'

export interface SidebarMenuItem {
  label: string
  href: string
  icon: LucideIcon
  roles: UserRole[]
}

export interface SidebarMenuGroup {
  group: string
  icon: LucideIcon
  items: SidebarMenuItem[]
}

export const SIDEBAR_NAVIGATION_GROUPS: SidebarMenuGroup[] = [
  {
    group: 'Umum',
    icon: LayoutDashboard,
    items: [
      {
        label: 'Beranda',
        href: '/dashboard',
        icon: Home,
        roles: [USER_ROLE.Student],
      },
      {
        label: 'Admin',
        href: '/admin',
        icon: ShieldCheck,
        roles: [USER_ROLE.Admin],
      },
      {
        label: 'Pengajar',
        href: '/teacher',
        icon: GraduationCap,
        roles: [USER_ROLE.Teacher],
      },
    ],
  },
  {
    group: 'Akademik',
    icon: BookMarked,
    items: [
      {
        label: 'Mata Pelajaran',
        href: '/subjects',
        icon: BookText,
        roles: [USER_ROLE.Admin, USER_ROLE.Teacher, USER_ROLE.Student],
      },
      {
        label: 'Ujian',
        href: '/exams',
        icon: GraduationCap,
        roles: [USER_ROLE.Admin, USER_ROLE.Teacher, USER_ROLE.Student],
      },
      {
        label: 'Tugas',
        href: '/assignments',
        icon: LayoutList,
        roles: [USER_ROLE.Admin, USER_ROLE.Teacher, USER_ROLE.Student],
      },
      {
        label: 'Jadwal',
        href: '/schedules',
        icon: CalendarDays,
        roles: [USER_ROLE.Admin, USER_ROLE.Teacher, USER_ROLE.Student],
      },
    ],
  },
  {
    group: 'Manajemen',
    icon: Settings,
    items: [
      {
        label: 'Fakultas',
        href: '/faculties',
        icon: University,
        roles: [USER_ROLE.Admin, USER_ROLE.Teacher],
      },
      {
        label: 'Jurusan',
        href: '/departments',
        icon: Building2,
        roles: [USER_ROLE.Admin, USER_ROLE.Teacher],
      },
      {
        label: 'Kelas',
        href: '/classrooms',
        icon: School,
        roles: [USER_ROLE.Admin, USER_ROLE.Teacher, USER_ROLE.Student],
      },
      {
        label: 'Semester',
        href: '/semesters',
        icon: Calendar,
        roles: [USER_ROLE.Admin, USER_ROLE.Teacher],
      },
      {
        label: 'User',
        href: '/users',
        icon: Users,
        roles: [USER_ROLE.Admin],
      },
    ],
  },
]

export function getSidebarMenusByRole(role: UserRole | undefined | null): SidebarMenuGroup[] {
  if (!role) return []
  return SIDEBAR_NAVIGATION_GROUPS
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0)
}
