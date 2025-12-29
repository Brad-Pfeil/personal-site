import type { Rng } from "@/lib/random";
import { randn } from "@/lib/random";

// Marsaglia & Tsang for Gamma(k, 1), k > 0
export function sampleGamma(shape: number, rng: Rng): number {
  if (shape <= 0) throw new Error("shape must be > 0");

  // Boost small shapes using Johnk's transformation.
  if (shape < 1) {
    const u = rng();
    return sampleGamma(shape + 1, rng) * Math.pow(u, 1 / shape);
  }

  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x = randn(rng);
    let v = 1 + c * x;
    if (v <= 0) continue;
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * (x * x) * (x * x)) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

export function sampleBeta(alpha: number, beta: number, rng: Rng): number {
  const x = sampleGamma(alpha, rng);
  const y = sampleGamma(beta, rng);
  return x / (x + y);
}

export function mean(xs: number[]): number {
  if (xs.length === 0) return NaN;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function quantile(xs: number[], q: number): number {
  if (xs.length === 0) return NaN;
  const ys = [...xs].sort((a, b) => a - b);
  const pos = (ys.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = ys[base + 1];
  return next === undefined ? ys[base]! : ys[base]! + rest * (next - ys[base]!);
}


