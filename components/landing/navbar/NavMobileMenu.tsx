"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { siteConfig } from "@/lib/config";

interface NavMobileMenuProps {
  readonly activeSection: string;
  readonly scrolled: boolean;
}

export function NavMobileMenu({ activeSection, scrolled }: NavMobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden rounded-full w-9 h-9 transition-colors ${
            scrolled
              ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              : "text-white hover:text-white hover:bg-white/10"
          }`}
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-72 p-0 border-l border-slate-800 bg-neutral-950" showCloseButton={false}>
        <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
        <SheetClose className="absolute top-3 right-3 text-white hover:bg-white/10 rounded-full p-1" aria-label="Tutup menu">
          <X className="h-5 w-5" />
        </SheetClose>
        <div className="flex flex-col h-full px-6 pt-8 pb-10 gap-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="shrink-0"
          >
            <Image
              src="/assets/img/lputih.png"
              alt={siteConfig.name}
              width={100}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <nav className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 rounded-full text-sm transition-colors ${
                    isActive
                      ? "bg-purple-600/20 text-purple-400 font-medium"
                      : "text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <Button
              asChild
              className="w-full h-11 bg-white hover:bg-slate-200 text-slate-950 rounded-full font-medium"
            >
              <Link href={siteConfig.loginUrl} onClick={() => setOpen(false)}>
                Masuk ke Platform
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}