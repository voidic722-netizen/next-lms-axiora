'use client'

import { useQueryClient } from '@tanstack/react-query'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { getSidebarMenusByRole } from '@/constants/sidebar-navigation'
import { logoutService } from '@/services/auth-service'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { User } from '@/types/user'

interface TabBarProps {
  user: User
}

export function TabBar({ user }: TabBarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const clearUser = useAuthStore((s) => s.clearUser)
  const [open, setOpen] = useState(false)

  const groups = useMemo(
    () => getSidebarMenusByRole(user.role),
    [user.role],
  )

  const allItems = useMemo(
    () => groups.flatMap((g) => g.items),
    [groups],
  )

  const pinnedItems = allItems.slice(0, 4)

  const queryClient = useQueryClient()

  async function handleLogout() {
    try {
      await logoutService()
      clearUser()
      queryClient.clear()
      router.push('/login')
      setOpen(false)
    } catch {
      toast.error('Gagal keluar. Silakan coba lagi.')
    }
  }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[#E2E8F0] bg-white/95 backdrop-blur-sm flex items-center pb-[env(safe-area-inset-bottom)]">
      {pinnedItems.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors duration-200',
              isActive
                ? 'text-[#4B5CF0] font-bold after:absolute after:-top-[1px] after:w-8 after:h-0.5 after:bg-[#4B5CF0] after:rounded-b-full'
                : 'text-[#94A3B8] font-medium',
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate max-w-[60px] text-center leading-none">
              {item.label}
            </span>
          </Link>
        )
      })}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium text-[#94A3B8] transition-colors duration-200">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span>Menu</span>
          </button>
        </SheetTrigger>

        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)]">
          <div className="py-4 space-y-5">
            {groups.map((group) => (
              <div key={group.group}>
                <p className="px-2 mb-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.08em]">
                  {group.group}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {group.items.map((item) => {
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href)
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200',
                          isActive
                            ? 'bg-[#EEF1FF] text-[#4B5CF0] font-semibold before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:bg-[#4B5CF0] before:rounded-r-full'
                            : 'font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]',
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-1">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all duration-200"
              >
                Profil Saya
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-2.5 px-3 text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/8"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}