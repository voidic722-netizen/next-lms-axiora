"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export function CTASection() {
  return (
    <section className="bg-neutral-950 px-6 py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(147,51,234,0.14),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-700/60 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative max-w-2xl mx-auto text-center"
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight mb-6">
          Siap memulai pembelajaran digital?
        </h2>
        <p className="text-lg text-neutral-400 leading-relaxed mb-12 max-w-lg mx-auto font-light">
          Akses platform sekarang dan rasakan kemudahan manajemen akademik
          untuk seluruh civitas akademika.
        </p>
        <Button
          asChild
          size="lg"
          className="group h-12 px-10 bg-white hover:bg-slate-50 text-slate-950 font-semibold rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
        >
          <Link href={siteConfig.loginUrl}>
            Masuk ke Platform
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}