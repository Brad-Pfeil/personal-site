import Link from "next/link";

import { cn } from "@/lib/cn";

const nav = [
  { href: "/", label: "Profile" },
  { href: "/projects", label: "Projects" },
  { href: "/playground", label: "Playground" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" }
] as const;

export function SiteShell({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen", className)}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-50 focus:rounded-xl focus:bg-black/80 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:ring-2 focus:ring-[hsl(var(--accent)/0.6)]"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[hsl(var(--bg)/0.65)] backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white/90">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-[11px] text-white/80">
              DS
            </span>
            <span className="hidden sm:inline">Bradley Pfeil</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              className="btn"
              href="https://github.com/Brad-Pfeil"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="btn btnPrimary"
              href="https://linkedin.com/in/bradley-pfeil"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </header>
      <main id="main" className="container-page py-10">
        {children}
      </main>
      <footer className="border-t border-white/10 py-10">
        <div className="container-page flex flex-col gap-3 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p className="text-white/50">© {new Date().getFullYear()} Bradley Pfeil</p>
        </div>
      </footer>
    </div>
  );
}


