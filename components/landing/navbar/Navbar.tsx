"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { NavMobileMenu } from "./NavMobileMenu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = siteConfig.nav.map((item) => item.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <Link
          href="/"
          className="shrink-0"
        >
          <Image
            src={scrolled ? "/assets/img/lhitam.png" : "/assets/img/lputih.png"}
            alt={siteConfig.name}
            width={100}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {siteConfig.nav.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm rounded-full transition-colors duration-150 ${
                  isActive
                    ? scrolled
                      ? "text-slate-950 font-medium"
                      : "text-white font-medium"
                    : scrolled
                    ? "text-slate-500 hover:text-slate-900"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            asChild
            size="sm"
            className={`hidden md:inline-flex h-9 px-5 rounded-full text-sm font-medium shadow-sm transition-all duration-200 hover:scale-[1.02] ${
              scrolled
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
            }`}
          >
            <Link href={siteConfig.loginUrl}>Masuk</Link>
          </Button>
          <NavMobileMenu activeSection={activeSection} scrolled={scrolled} />
        </div>
      </div>
    </header>
  );
}