import Link from "next/link";
import { siteConfig } from "@/lib/config";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <p className="text-base font-semibold text-white mb-3">
              {siteConfig.name}
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed font-light">
              Platform manajemen akademik terstruktur untuk universitas modern.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-20">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                Navigasi
              </p>
              <ul className="flex flex-col gap-3.5">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-500 hover:text-white transition-colors duration-150"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
                Akses
              </p>
              <ul className="flex flex-col gap-3.5">
                <li>
                  <Link
                    href={siteConfig.loginUrl}
                    className="text-sm text-neutral-500 hover:text-white transition-colors duration-150"
                  >
                    Masuk
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-700">
            © {currentYear} {siteConfig.name}. Seluruh hak dilindungi.
          </p>
          <p className="text-xs text-neutral-800">
            Platform Manajemen Akademik
          </p>
        </div>
      </div>
    </footer>
  );
}