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
      {/* Mobile top bar */}
      <header className="border-b border-white/10 md:hidden">
        <div className="container-page flex h-14 items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-white/90">
            Bradley Pfeil
          </Link>
          <nav className="flex items-center gap-2 text-sm text-white/70">
            <Link className="hover:text-white" href="/projects">
              Projects
            </Link>
            <Link className="hover:text-white" href="/playground">
              Playground
            </Link>
          </nav>
        </div>
      </header>

      <div className="container-page grid gap-10 py-10 md:grid-cols-[240px_1fr] md:gap-12">
        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-10 space-y-8">
            <div>
              <Link href="/" className="text-sm font-semibold text-white/90">
                Bradley Pfeil
              </Link>
              <div className="mt-2 text-xs text-white/55">Data Scientist · Systems + ML</div>
            </div>

            <nav className="space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="space-y-2">
              <a className="btn w-full" href="https://github.com/Brad-Pfeil" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a
                className="btn btnPrimary w-full"
                href="https://linkedin.com/in/bradley-pfeil"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </aside>

        <main id="main" className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}


