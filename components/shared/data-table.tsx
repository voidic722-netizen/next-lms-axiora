'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, Search, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  pageSize?: number
  emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Cari...',
  searchKeys = [],
  pageSize = 10,
  emptyMessage = 'Tidak ada data',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return data
    const q = search.toLowerCase()
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = row[key]
        return typeof val === 'string' && val.toLowerCase().includes(q)
      }),
    )
  }, [data, search, searchKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedData = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  )

  function handleSearch(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="rounded-xl border border-[#E2E8F0] shadow-premium overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F8FAFC]">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    'text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3',
                    col.className,
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3 text-[#64748B]">
                    <div className="inline-flex items-center justify-center size-12 rounded-xl bg-[#F1F5F9]">
                      <FolderOpen className="h-6 w-6 text-[#94A3B8]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{emptyMessage}</p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">Data akan muncul di sini</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pagedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={cn(
                    'border-b border-[#E2E8F0]/50 transition-colors duration-150 hover:bg-[#F8FAFC]',
                    rowIndex % 2 === 1 ? 'bg-[#FAFBFD]' : 'bg-white',
                  )}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn('py-3 text-[#0F172A]', col.className)}
                    >
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#64748B]">
          <span className="text-xs">
            {filtered.length} data · Halaman {safePage} dari {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              className="border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="inline-flex items-center justify-center h-8 min-w-[2rem] px-2 rounded-lg bg-[#F1F5F9] text-xs font-semibold text-[#0F172A]">
              {safePage}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              className="border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}