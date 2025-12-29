import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { listProjects } from "@/lib/content";

export default async function ProjectsPage() {
  const projects = await listProjects();
  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        subtitle="High-signal deep dives. Each page focuses on decisions, tradeoffs, and measurable outcomes—not fluff."
        right={
          <a className="btn" href="https://github.com/Brad-Pfeil" target="_blank" rel="noreferrer">
            View GitHub
          </a>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <div key={p.slug} className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-white/90">{p.frontmatter.title}</h2>
              <span className="chip">{p.frontmatter.year}</span>
            </div>
            <div className="mt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/55">README</div>
              <p className="mt-2 text-sm text-white/75">{p.frontmatter.summary}</p>
              <p className="mt-2 text-xs text-white/55">
                <a
                  className="link"
                  href={`https://github.com/Brad-Pfeil?tab=repositories&q=${encodeURIComponent(
                    p.frontmatter.title
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub link
                </a>
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.frontmatter.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/projects/${p.slug}`} className="btn btnPrimary">
                More Info
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


