import Link from "next/link";

import { cn } from "@/lib/cn";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="md:py-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white/95 md:text-5xl">
          Bradley Pfeil
        </h1>
        <p className="mt-3 max-w-2xl text-white/75 md:text-lg">
          I’m a data scientist who likes decision-making under uncertainty, and then building systems to make those decisions. Most of my work sits at the intersection of dynamic pricing, optimisation, and cloud infrastructure.
          <br />
          <br />
          I enjoy problems where the model is only half the battle; the rest is understanding how it behaves in the real world. I care a lot about clean abstractions, reproducibility, and knowing why something works.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects" className={cn("btn btnPrimary")}>
            Explore projects
          </Link>
          <Link href="/playground" className="btn">
            Try the playground
          </Link>
          <Link href="/resume" className="btn">
            View resume
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white/90">Strengths</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>End-to-end ML/DS work: data → modelling → deployment → monitoring</li>
            <li>Systems thinking: bottlenecks, profiling, and cost/perf tradeoffs</li>
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white/90">What you’ll find here</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <span className="text-white/90">Projects</span>: A few of my recent personal projects with summaries. Checkout my GitHub for more.
            </li>
            <li>
              <span className="text-white/90">Playground</span>: interactive Data Science mini-labs.
            </li>
            <li>
              <span className="text-white/90">Resume</span>: quick scan plus download link.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}


