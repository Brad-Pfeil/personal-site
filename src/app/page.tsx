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
      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div className="card p-7 md:p-8">
          <div className="chip">Profile</div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white/95 md:text-5xl">
            Bradley Pfeil
          </h1>
          <p className="mt-3 max-w-2xl text-white/75 md:text-lg">
            Heyo.
            <br />
            <br />
            I’m a data scientist who likes decision-making under uncertainty—and then building the systems that make those decisions. Most of my work sits at the intersection of dynamic pricing, optimisation, and cloud infrastructure.
            <br />
            <br />
            I enjoy problems where the model is only half the battle; the rest is understanding how it behaves in the real world. I care a lot about clean abstractions, reproducibility, and knowing why something works.
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

        <div className="card p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/55">Snapshot</div>
          <div className="mt-4 space-y-3">
            <Stat label="Current role" value="Data Scientist for Streamline" />
            <Stat label="Impact focus" value="Dynamic solving + inference speed" />
            <Stat label="Style" value="Pragmatic research → production" />
          </div>
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


