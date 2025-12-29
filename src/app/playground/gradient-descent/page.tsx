"use client";

import * as Plot from "@observablehq/plot";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { PlotFigure } from "@/components/PlotFigure";
import { mulberry32, randn } from "@/lib/random";

type Pt = { x: number; y: number };

function toU(x: number) {
  return 2 * x - 1; // map [0,1] -> [-1,1] for better conditioning
}

function evalPoly(w: number[], u: number) {
  let y = 0;
  let xp = 1;
  for (let k = 0; k < w.length; k++) {
    y += w[k]! * xp;
    xp *= u;
  }
  return y;
}

function genRegression(degree: number, n: number, noise: number) {
  // Keep the dataset deterministic; the controllable knob is model degree.
  const rng = mulberry32(11);
  const trueDegree = Math.min(4, degree);
  // Coefficients are chosen to produce visible curvature while keeping y in a sane range.
  // Model uses u = 2x-1 so higher powers don’t vanish as quickly as x^k on [0,1].
  const wTrueBase = [0.15, 0.65, -0.85, 0.55, -0.35, 0.18, -0.08];
  const wTrue = wTrueBase.slice(0, trueDegree + 1);
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const x = rng();
    const u = toU(x);
    const y = evalPoly(wTrue, u) + randn(rng) * noise;
    pts.push({ x, y });
  }
  return { pts, wTrue };
}

function mse(points: Pt[], w: number[]) {
  let s = 0;
  for (const p of points) {
    const e = evalPoly(w, toU(p.x)) - p.y;
    s += e * e;
  }
  return s / points.length;
}

export default function GradientDescentPage() {
  const [degree, setDegree] = useState(1);
  const [n, setN] = useState(140);
  const [noise, setNoise] = useState(0.08);
  const [lr, setLr] = useState(0.35);
  const [isPlaying, setIsPlaying] = useState(false);

  const { pts } = useMemo(() => genRegression(degree, n, noise), [degree, n, noise]);

  const [w, setW] = useState<number[]>(() => Array.from({ length: 2 }, () => 0));
  const [lossHistory, setLossHistory] = useState<{ iter: number; loss: number }[]>([]);
  const iterRef = useRef(0);

  useEffect(() => {
    iterRef.current = 0;
    setW(Array.from({ length: degree + 1 }, (_, i) => (i === 0 ? 0.2 : 0)));
    setLossHistory([]);
    setIsPlaying(false);
  }, [degree, n, noise]);

  const doStep = useCallback(() => {
    const N = pts.length;
    const grad = new Array<number>(w.length).fill(0);
    for (const p of pts) {
      const u = toU(p.x);
      const yHat = evalPoly(w, u);
      const e = yHat - p.y;
      let xp = 1;
      for (let k = 0; k < w.length; k++) {
        grad[k]! += (2 / N) * e * xp;
        xp *= u;
      }
    }
    const nextW = w.map((wk, k) => wk - lr * grad[k]!);
    const nextLoss = mse(pts, nextW);
    iterRef.current += 1;
    setW(nextW);
    setLossHistory((h) => [...h, { iter: iterRef.current, loss: nextLoss }].slice(-120));
  }, [lr, pts, w]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => doStep(), 220);
    return () => window.clearInterval(id);
  }, [doStep, isPlaying]);

  const fitCurve = useMemo(() => {
    const m = 120;
    return Array.from({ length: m + 1 }, (_, i) => {
      const x = i / m;
      return { x, y: evalPoly(w, toU(x)) };
    });
  }, [w]);

  const yDomain = useMemo(() => {
    const ys = pts.map((p) => p.y);
    for (const p of fitCurve) ys.push(p.y);
    if (ys.length === 0) return [-1.2, 1.6] as const;
    let lo = ys[0]!;
    let hi = ys[0]!;
    for (const y of ys) {
      if (y < lo) lo = y;
      if (y > hi) hi = y;
    }
    const pad = Math.max(0.2, (hi - lo) * 0.15);
    return [lo - pad, hi + pad] as const;
  }, [fitCurve, pts]);

  const scatterPlot = useCallback(
    ({ width }: { width: number }) => {
      return Plot.plot({
        width,
        height: 420,
        marginLeft: 40,
        marginBottom: 40,
        x: { label: "x", domain: [0, 1] },
        y: { label: "y", domain: yDomain },
        grid: true,
        style: { background: "transparent", color: "rgba(255,255,255,0.85)", fontSize: "12px" },
        marks: [
          Plot.dot(pts, { x: "x", y: "y", r: 3.5, fill: "rgba(255,255,255,0.75)" }),
          Plot.line(fitCurve, { x: "x", y: "y", stroke: "hsl(188 86% 52%)", strokeWidth: 2.5 })
        ]
      });
    },
    [fitCurve, pts, yDomain]
  );

  const lossPlot = useCallback(
    ({ width }: { width: number }) => {
      return Plot.plot({
        width,
        height: 220,
        marginLeft: 55,
        marginBottom: 40,
        y: { label: "MSE" },
        x: { label: "iteration" },
        grid: true,
        style: { background: "transparent", color: "rgba(255,255,255,0.85)", fontSize: "12px" },
        marks: [
          Plot.line(lossHistory, { x: "iter", y: "loss", stroke: "hsl(188 86% 52%)", strokeWidth: 2 }),
          Plot.dot(lossHistory.slice(-1), { x: "iter", y: "loss", fill: "white", r: 3 })
        ]
      });
    },
    [lossHistory]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gradient descent lab"
        subtitle="Fit a polynomial by minimizing mean squared error. Increase degree to see bias/variance tradeoffs; tune learning rate to see convergence vs divergence."
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
                <span>Polynomial degree</span>
                <span className="text-white/55">{degree}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={1}
                max={4}
                value={degree}
                onChange={(e) => setDegree(parseInt(e.target.value, 10))}
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
                min={40}
                max={400}
                step={10}
                value={n}
                onChange={(e) => setN(parseInt(e.target.value, 10))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>Noise</span>
                <span className="text-white/55">{noise.toFixed(2)}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0.02}
                max={0.22}
                step={0.01}
                value={noise}
                onChange={(e) => setNoise(parseFloat(e.target.value))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>Learning rate</span>
                <span className="text-white/55">{lr.toFixed(2)}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0.02}
                max={0.9}
                step={0.01}
                value={lr}
                onChange={(e) => setLr(parseFloat(e.target.value))}
              />
            </label>

            <div className="pt-2 space-y-2">
              <div className="card p-3">
                <div className="text-xs uppercase tracking-wider text-white/45">
                  coefficients (w0..w{w.length - 1})
                </div>
                <div className="mt-2 font-mono text-xs text-white/80">
                  {w.slice(0, 5).map((x) => x.toFixed(3)).join(", ")}
                  {w.length > 5 ? ", …" : ""}
                </div>
              </div>
              <button
                className="btn w-full"
                onClick={() => {
                  iterRef.current = 0;
                  setW(Array.from({ length: degree + 1 }, (_, i) => (i === 0 ? 0.2 : 0)));
                  setLossHistory([]);
                  setIsPlaying(false);
                }}
              >
                Reset params
              </button>
            </div>
          </div>
        </div>

        <div className="card p-4 lg:col-span-2">
          <PlotFigure makePlot={scatterPlot} ariaLabel="Regression points with fitted curve" />
        </div>
      </div>

      <div className="card p-4">
        <PlotFigure makePlot={lossPlot} ariaLabel="Loss over gradient descent iterations" />
      </div>
    </div>
  );
}


