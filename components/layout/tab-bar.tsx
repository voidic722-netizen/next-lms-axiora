'use client'

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

  // Memoised — only recomputes when role changes
  const groups = useMemo(
    () => getSidebarMenusByRole(user.role),
    [user.role],
  )

  const allItems = useMemo(
    () => groups.flatMap((g) => g.items),
    [groups],
  )

  // Show the first 4 most-used items in the fixed bar; rest go into the sheet
  const pinnedItems = allItems.slice(0, 4)

  async function handleLogout() {
    try {
      await logoutService()
      clearUser()
      router.push('/login')
      setOpen(false)
    } catch {
      toast.error('Gagal keluar. Silakan coba lagi.')
    }
  }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-background flex items-center">
      {pinnedItems.map((item) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate max-w-[60px] text-center leading-none">
              {item.label}
            </span>
          </Link>
        )
      })}

      {/* Menu sheet for remaining items */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span>Menu</span>
          </button>
        </SheetTrigger>

        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl">
          <div className="py-2 space-y-4">
            {groups.map((group) => (
              <div key={group.group}>
                <p className="px-1 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
                          'flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground',
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
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                Profil Saya
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-2 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
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
