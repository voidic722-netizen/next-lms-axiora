'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { LogOut, User as UserIcon } from 'lucide-react'
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
    <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar h-screen sticky top-0 shrink-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          LMS
        </div>
        <span className="font-semibold text-sidebar-foreground">Dashboard</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-3">
        {groups.map((group) => (
          <div key={group.group}>
            <p className="px-2 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
                        'flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
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

      <Separator />

      {/* User footer */}
      <div className="p-3 space-y-1">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="text-xs">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{user.name}</span>
          <UserIcon className="h-3.5 w-3.5 ml-auto shrink-0 text-muted-foreground" />
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
      </div>
    </aside>
  )
}
