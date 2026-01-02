import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";

const demos = [
  {
    href: "/playground/kmeans",
    title: "K-means sandbox",
    blurb: "Generate points, pick k, iterate, and watch inertia fall.",
  },
  {
    href: "/playground/gradient-descent",
    title: "Gradient descent lab",
    blurb: "Tune learning rate and see convergence (or divergence) in real time.",
  },
  {
    href: "/playground/mdp-gridworld",
    title: "Gridworld MDP",
    blurb: "Draw walls, add transition noise, and compute the optimal policy via value iteration.",
  },
  {
    href: "/playground/ab-test",
    title: "A/B inference simulator",
    blurb: "Traffic, effect size, and Bayesian posterior.",
  }
] as const;

export default function PlaygroundPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Playground"
        subtitle="Small interactive labs: iterate, measure, and see how the simulation changes."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {demos.map((d) => (
          <Link key={d.href} href={d.href} className="card block p-6 transition hover:bg-white/[0.06]">
            <div className="text-lg font-semibold text-white/90">{d.title}</div>
            <p className="mt-2 text-sm text-white/70">{d.blurb}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/75">
              Open demo <span aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


