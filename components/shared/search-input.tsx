'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  totalResults?: number
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Cari...',
  totalResults,
  className,
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
          onClick={() => onChange('')}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
      {totalResults !== undefined && value && (
        <p className="text-xs text-[#64748B] mt-1">
          {totalResults} hasil ditemukan
        </p>
      )}
    </div>
  )
}