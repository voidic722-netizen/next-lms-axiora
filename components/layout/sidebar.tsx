'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getSidebarMenusByRole } from '@/constants/sidebar-navigation'
import type { User } from '@/types/user'

interface SidebarProps {
  user: User
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const groups = useMemo(
    () => getSidebarMenusByRole(user.role),
    [user.role],
  )

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
    </aside>
  )
}