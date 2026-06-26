'use client'

import { useQueryClient } from '@tanstack/react-query'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { LogOut, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { getSidebarMenusByRole } from '@/constants/sidebar-navigation'
import { logoutService } from '@/services/auth-service'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import type { User } from '@/types/user'

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const clearUser = useAuthStore((s) => s.clearUser)

  const groups = useMemo(
    () => getSidebarMenusByRole(user.role),
    [user.role],
  )

  const queryClient = useQueryClient()

  async function handleLogout() {
    try {
      await logoutService()
      clearUser()
      queryClient.clear()
      router.push('/login')
    } catch {
      toast.error('Gagal keluar. Silakan coba lagi.')
    }
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-[#E2E8F0] bg-white h-screen sticky top-0 shrink-0">
      <div className="flex items-center px-5 h-14 border-b border-[#E2E8F0]">
        <Image
          src="/assets/img/lhitam.png"
          alt="Axiora Logo"
          width={100}
          height={32}
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
        {groups.map((group) => (
          <div key={group.group}>
            <p className="px-3 mb-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.08em]">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-all duration-200',
                        isActive
                          ? 'bg-[#EEF1FF] text-[#4B5CF0] font-semibold before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:bg-[#4B5CF0] before:rounded-r-full'
                          : 'font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]',
                      )}
                    >
                      <div className={cn(
                        'inline-flex items-center justify-center size-7 rounded-md shrink-0 transition-colors duration-200',
                        isActive ? 'bg-[#4B5CF0]/10' : 'bg-transparent'
                      )}>
                        <Icon className="h-4 w-4 shrink-0" />
                      </div>
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <Separator />

      <div className="p-3 space-y-1">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all duration-200"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="text-xs bg-[#EEF1FF] text-[#4B5CF0] font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{user.name}</span>
          <UserIcon className="h-3.5 w-3.5 ml-auto shrink-0 text-[#94A3B8]" />
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-3 text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/8 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </aside>
  )
}