"use client";

import * as Plot from "@observablehq/plot";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { PlotFigure } from "@/components/PlotFigure";
import { mulberry32, randn } from "@/lib/random";

type Pt = { x: number; y: number };

function dist2(a: Pt, b: Pt) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function genPoints(seed: number, n: number, spread: number): Pt[] {
  const rng = mulberry32(seed);
  // Create 3 latent blobs regardless of k; k controls how we fit.
  const blobs: Pt[] = [
    { x: 0.25, y: 0.3 },
    { x: 0.7, y: 0.28 },
    { x: 0.55, y: 0.75 }
  ];
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const c = blobs[Math.floor(rng() * blobs.length)]!;
    pts.push({
      x: clamp01(c.x + randn(rng) * spread),
      y: clamp01(c.y + randn(rng) * spread)
    });
  }
  return pts;
}

function initCenters(seed: number, points: Pt[], k: number): Pt[] {
  const rng = mulberry32(seed ^ 0x9e3779b9);
  const centers: Pt[] = [];
  const used = new Set<number>();
  while (centers.length < k && centers.length < points.length) {
    const idx = Math.floor(rng() * points.length);
    if (used.has(idx)) continue;
    used.add(idx);
    centers.push({ ...points[idx]! });
  }
  return centers;
}

function stepKMeans(points: Pt[], centers: Pt[], seed: number) {
  const assignments = points.map((p) => {
    let best = 0;
    let bestD = Infinity;
    for (let j = 0; j < centers.length; j++) {
      const d = dist2(p, centers[j]!);
      if (d < bestD) {
        bestD = d;
        best = j;
      }
    }
    return best;
  });

  const sums = centers.map(() => ({ x: 0, y: 0, n: 0 }));
  for (let i = 0; i < points.length; i++) {
    const a = assignments[i]!;
    sums[a]!.x += points[i]!.x;
    sums[a]!.y += points[i]!.y;
    sums[a]!.n += 1;
  }

  const rng = mulberry32(seed ^ 0x85ebca6b);
  const newCenters: Pt[] = centers.map((c, j) => {
    const s = sums[j]!;
    if (s.n === 0) {
      // Empty cluster: re-seed to a random point.
      return { ...points[Math.floor(rng() * points.length)]! };
    }
    return { x: s.x / s.n, y: s.y / s.n };
  });

  let inertia = 0;
  for (let i = 0; i < points.length; i++) {
    inertia += dist2(points[i]!, newCenters[assignments[i]!]!);
  }

  return { assignments, newCenters, inertia };
}

export default function KMeansPage() {
  const [seed, setSeed] = useState(7);
  const [n, setN] = useState(220);
  const [k, setK] = useState(3);
  const [spread, setSpread] = useState(0.08);
  const [isPlaying, setIsPlaying] = useState(false);

  const points = useMemo(() => genPoints(seed, n, spread), [seed, n, spread]);
  const [centers, setCenters] = useState<Pt[]>(() => initCenters(seed, points, k));
  const [assignments, setAssignments] = useState<number[]>(() => points.map(() => 0));
  const [history, setHistory] = useState<{ iter: number; inertia: number }[]>([]);
  const iterRef = useRef(0);

  // Reset centers/history when data or k changes.
  useEffect(() => {
    iterRef.current = 0;
    setCenters(initCenters(seed, points, k));
    setAssignments(points.map(() => 0));
    setHistory([]);
    setIsPlaying(false);
  }, [seed, points, k]);

  const doStep = useCallback(() => {
    const next = stepKMeans(points, centers, seed + iterRef.current);
    iterRef.current += 1;
    setCenters(next.newCenters);
    setAssignments(next.assignments);
    setHistory((h) => [...h, { iter: iterRef.current, inertia: next.inertia }].slice(-80));
  }, [centers, points, seed]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => doStep(), 450);
    return () => window.clearInterval(id);
  }, [doStep, isPlaying]);

  const coloredPoints = useMemo(() => {
    return points.map((p, i) => ({ ...p, cluster: assignments[i] ?? 0 }));
  }, [assignments, points]);

  const scatterPlot = useCallback(
    ({ width }: { width: number }) => {
      return Plot.plot({
        width,
        height: 420,
        marginLeft: 40,
        marginBottom: 40,
        x: { label: "x", domain: [0, 1] },
        y: { label: "y", domain: [0, 1] },
        grid: true,
        style: {
          background: "transparent",
          color: "rgba(255,255,255,0.85)",
          fontSize: "12px"
        },
        marks: [
          Plot.dot(coloredPoints, {
            x: "x",
            y: "y",
            r: 3.5,
            fill: "cluster",
            fillOpacity: 0.75
          }),
          Plot.dot(centers, {
            x: "x",
            y: "y",
            r: 9,
            stroke: "white",
            strokeWidth: 1.5,
            fill: "rgba(255,255,255,0.12)"
          })
        ]
      });
    },
    [centers, coloredPoints]
  );

  const inertiaPlot = useCallback(
    ({ width }: { width: number }) => {
      return Plot.plot({
        width,
        height: 220,
        marginLeft: 55,
        marginBottom: 40,
        y: { label: "inertia (Σ‖x-μ‖²)" },
        x: { label: "iteration" },
        grid: true,
        style: { background: "transparent", color: "rgba(255,255,255,0.85)", fontSize: "12px" },
        marks: [
          Plot.line(history, { x: "iter", y: "inertia", stroke: "hsl(188 86% 52%)", strokeWidth: 2 }),
          Plot.dot(history.slice(-1), { x: "iter", y: "inertia", fill: "white", r: 3 })
        ]
      });
    },
    [history]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="K-means sandbox"
        subtitle="Iterate between assignment and update steps. Watch inertia fall as the centers move."
        right={
          <>
            <button className="btn" onClick={() => doStep()}>
              Step
            </button>
            <button className="btn btnPrimary" onClick={() => setIsPlaying((p) => !p)}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          </>
        }
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
                <span>Points</span>
                <span className="text-white/55">{n}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={60}
                max={600}
                step={10}
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>k</span>
                <span className="text-white/55">{k}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={2}
                max={7}
                value={k}
                onChange={(e) => setK(parseInt(e.target.value, 10))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>Spread</span>
                <span className="text-white/55">{spread.toFixed(2)}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0.03}
                max={0.16}
                step={0.01}
                value={spread}
                onChange={(e) => setSpread(parseFloat(e.target.value))}
              />
            </label>

            <div className="pt-2">
              <button
                className="btn w-full"
                onClick={() => {
                  iterRef.current = 0;
                  setCenters(initCenters(seed, points, k));
                  setAssignments(points.map(() => 0));
                  setHistory([]);
                  setIsPlaying(false);
                }}
              >
                Reset fit
              </button>
            </div>
          </div>
        </div>

        <div className="card p-4 lg:col-span-2">
          <PlotFigure makePlot={scatterPlot} ariaLabel="K-means scatter plot" />
        </div>
      </div>

      <div className="card p-4">
        <PlotFigure makePlot={inertiaPlot} ariaLabel="K-means inertia over iterations" />
      </div>
    </div>
  );
}


