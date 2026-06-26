import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm text-[#0F172A] shadow-sm transition-all duration-200 outline-none",
        "placeholder:text-[#94A3B8]",
        "selection:bg-[#4B5CF0]/20 selection:text-[#4B5CF0]",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#0F172A]",
        "hover:border-[#CBD5E1]",
        "focus-visible:border-[#4B5CF0] focus-visible:ring-[3px] focus-visible:ring-[#4B5CF0]/10 focus-visible:shadow-none",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[#EF4444] aria-invalid:ring-[#EF4444]/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }