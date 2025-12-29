"use client";

import * as Plot from "@observablehq/plot";
import { useCallback, useMemo, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { PlotFigure } from "@/components/PlotFigure";
import { mulberry32 } from "@/lib/random";
import { quantile, sampleBeta } from "@/lib/stats";

function simulatePosterior(opts: {
  seed: number;
  nA: number;
  nB: number;
  truePA: number;
  truePB: number;
}) {
  const rng = mulberry32(opts.seed);
  const sA = binomial(opts.nA, opts.truePA, rng);
  const sB = binomial(opts.nB, opts.truePB, rng);

  // Beta(1,1) uniform prior.
  const alphaA = 1 + sA;
  const betaA = 1 + (opts.nA - sA);
  const alphaB = 1 + sB;
  const betaB = 1 + (opts.nB - sB);

  const draws = 6000;
  const pA: number[] = [];
  const pB: number[] = [];
  let winsB = 0;
  for (let i = 0; i < draws; i++) {
    const a = sampleBeta(alphaA, betaA, rng);
    const b = sampleBeta(alphaB, betaB, rng);
    pA.push(a);
    pB.push(b);
    if (b > a) winsB += 1;
  }
  const probBBeatsA = winsB / draws;

  return {
    sA,
    sB,
    alphaA,
    betaA,
    alphaB,
    betaB,
    probBBeatsA,
    pA,
    pB
  };
}

function binomial(n: number, p: number, rng: () => number) {
  let s = 0;
  for (let i = 0; i < n; i++) if (rng() < p) s += 1;
  return s;
}

function densityFromSamples(samples: number[], bins = 60) {
  const lo = 0;
  const hi = 1;
  const w = (hi - lo) / bins;
  const counts = new Array<number>(bins).fill(0);
  for (const x of samples) {
    const idx = Math.min(bins - 1, Math.max(0, Math.floor((x - lo) / w)));
    counts[idx]! += 1;
  }
  const n = samples.length;
  return counts.map((c, i) => ({
    x: lo + (i + 0.5) * w,
    y: c / n / w
  }));
}

export default function ABTestPage() {
  const [seed, setSeed] = useState(19);
  const [nA, setNA] = useState(2000);
  const [nB, setNB] = useState(2000);
  const [truePA, setTruePA] = useState(0.08);
  const [truePB, setTruePB] = useState(0.088);

  const sim = useMemo(
    () => simulatePosterior({ seed, nA, nB, truePA, truePB }),
    [nA, nB, seed, truePA, truePB]
  );

  const densA = useMemo(() => densityFromSamples(sim.pA), [sim.pA]);
  const densB = useMemo(() => densityFromSamples(sim.pB), [sim.pB]);

  const ciA = useMemo(() => [quantile(sim.pA, 0.05), quantile(sim.pA, 0.95)] as const, [sim.pA]);
  const ciB = useMemo(() => [quantile(sim.pB, 0.05), quantile(sim.pB, 0.95)] as const, [sim.pB]);

  const plot = useCallback(
    ({ width }: { width: number }) => {
      const combined = [
        ...densA.map((d) => ({ ...d, variant: "A" as const })),
        ...densB.map((d) => ({ ...d, variant: "B" as const }))
      ];
      return Plot.plot({
        width,
        height: 360,
        marginLeft: 55,
        marginBottom: 40,
        x: { label: "conversion rate", domain: [0, 0.22] },
        y: { label: "density" },
        grid: true,
        style: { background: "transparent", color: "rgba(255,255,255,0.85)", fontSize: "12px" },
        color: {
          domain: ["A", "B"],
          range: ["rgba(255,255,255,0.75)", "hsl(188 86% 52%)"]
        },
        marks: [
          Plot.line(combined, {
            x: "x",
            y: "y",
            stroke: "variant",
            strokeWidth: 2,
            curve: "catmull-rom"
          }),
          Plot.ruleX([truePA], { stroke: "rgba(255,255,255,0.35)" }),
          Plot.ruleX([truePB], { stroke: "hsl(188 86% 52% / 0.45)" })
        ]
      });
    },
    [densA, densB, truePA, truePB]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="A/B inference simulator"
        subtitle="Simulate an experiment, then compare Bayesian posteriors. This is what decision-making under uncertainty looks like."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <div className="text-sm font-semibold text-white/90">Controls</div>

          <div className="mt-5 space-y-4 text-sm text-white/75">
            <label className="block">
              <div className="flex items-center justify-between">
                <span>Seed</span>
                <span className="text-white/55">{seed}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={1}
                max={99}
                value={seed}
                onChange={(e) => setSeed(parseInt(e.target.value, 10))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>Traffic A</span>
                <span className="text-white/55">{nA}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={200}
                max={20000}
                step={200}
                value={nA}
                onChange={(e) => setNA(parseInt(e.target.value, 10))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>Traffic B</span>
                <span className="text-white/55">{nB}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={200}
                max={20000}
                step={200}
                value={nB}
                onChange={(e) => setNB(parseInt(e.target.value, 10))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>True p(A)</span>
                <span className="text-white/55">{truePA.toFixed(3)}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0.01}
                max={0.18}
                step={0.001}
                value={truePA}
                onChange={(e) => setTruePA(parseFloat(e.target.value))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>True p(B)</span>
                <span className="text-white/55">{truePB.toFixed(3)}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0.01}
                max={0.18}
                step={0.001}
                value={truePB}
                onChange={(e) => setTruePB(parseFloat(e.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="card p-4 lg:col-span-2">
          <PlotFigure makePlot={plot} ariaLabel="Posterior densities for A and B conversion rate" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-6">
          <div className="text-xs uppercase tracking-wider text-white/45">Observed A</div>
          <div className="mt-2 text-lg font-semibold text-white/90">
            {sim.sA} / {nA}
          </div>
          <div className="mt-2 text-sm text-white/65">
            90% CI: {ciA[0].toFixed(3)} – {ciA[1].toFixed(3)}
          </div>
        </div>
        <div className="card p-6">
          <div className="text-xs uppercase tracking-wider text-white/45">Observed B</div>
          <div className="mt-2 text-lg font-semibold text-white/90">
            {sim.sB} / {nB}
          </div>
          <div className="mt-2 text-sm text-white/65">
            90% CI: {ciB[0].toFixed(3)} – {ciB[1].toFixed(3)}
          </div>
        </div>
        <div className="card p-6">
          <div className="text-xs uppercase tracking-wider text-white/45">Decision signal</div>
          <div className="mt-2 text-lg font-semibold text-white/90">
            P(B &gt; A) = {(sim.probBBeatsA * 100).toFixed(1)}%
          </div>
          <div className="mt-2 text-sm text-white/65">
            With a uniform prior. Increase traffic to shrink uncertainty.
          </div>
        </div>
      </div>
    </div>
  );
}


