'use client'

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

  async function handleLogout() {
    try {
      await logoutService()
      clearUser()
      router.push('/login')
    } catch {
      toast.error('Gagal keluar. Silakan coba lagi.')
    }
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-[#E2E8F0] bg-white h-screen sticky top-0 shrink-0">
      <div className="flex items-center px-5 py-4 border-b border-[#E2E8F0]">
        <Image
          src="/assets/img/lhitam.png"
          alt="Axiora Logo"
          width={100}
          height={32}
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {groups.map((group) => (
          <div key={group.group}>
            <p className="px-2 mb-2 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
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
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-[#EEF1FF] text-[#4B5CF0]'
                          : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <Separator className="bg-[#E2E8F0]" />

      <div className="p-3 space-y-1">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all duration-200"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="text-xs bg-[#EEF1FF] text-[#4B5CF0] font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{user.name}</span>
          <UserIcon className="h-3.5 w-3.5 ml-auto shrink-0 text-[#64748B]" />
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-3 text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </aside>
  )
}