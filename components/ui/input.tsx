import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 text-sm text-[#0F172A] transition-all duration-200 outline-none",
        "placeholder:text-[#64748B]",
        "selection:bg-[#4B5CF0] selection:text-white",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#0F172A]",
        "focus-visible:border-[#4B5CF0] focus-visible:ring-2 focus-visible:ring-[#4B5CF0]/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[#EF4444] aria-invalid:ring-[#EF4444]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }