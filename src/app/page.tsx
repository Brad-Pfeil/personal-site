import Link from "next/link";

import { cn } from "@/lib/cn";

const chips = [
  "Python",
  "SQL",
  "PyTorch",
  "Spark",
  "AWS",
  "MLOps",
  "Optimization",
  "LLMs",
];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wider text-white/45">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white/90">{value}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="card relative overflow-hidden p-8">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[hsl(var(--accent)/0.35)] blur-3xl" />
          <div className="absolute -right-48 -bottom-48 h-[520px] w-[520px] rounded-full bg-[hsl(270_86%_60%/0.28)] blur-3xl" />
        </div>
        <div className="relative">
          <div className="chip">Profile</div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Bradley Pfeil
          </h1>
          <p className="mt-3 max-w-2xl text-white/75 md:text-lg">
          Heyo, I’m Bradley, a data scientist who likes thinking about decision-making under uncertainty and then building the systems that make those decisions. Most of my work lives at the intersection of dynamic pricing, optimization, and cloud infrastructure.

          I enjoy difficult problems where the model is only half the battle and the rest is figuring out how it behaves in the real world. I care a lot about clean abstractions, reproducibility, and understanding why something works, not just that it does.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
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
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Stat label="Current role" value="Data Scientist @ Streamline" />
        <Stat label="Impact focus" value="Revenue uplift + inference speed" />
        <Stat label="Style" value="Pragmatic research → production" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white/90">Strengths</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>End-to-end ML/DS work: data → modelling → deployment → monitoring</li>
            <li>Systems thinking: bottlenecks, profiling, and cost/perf tradeoffs</li>
            <li>Explaining decisions clearly to non-technical stakeholders</li>
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white/90">What you’ll find here</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>
              <span className="text-white/90">Projects</span>: deep dives with screenshots, design
              tradeoffs, and “next improvements”.
            </li>
            <li>
              <span className="text-white/90">Playground</span>: interactive DS mini-labs (k-means,
              gradient descent, A/B inference).
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


