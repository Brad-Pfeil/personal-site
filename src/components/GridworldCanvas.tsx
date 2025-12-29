"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Action, Cell, Walls } from "@/lib/mdp/gridworld";
import { cellFromIdx, idx } from "@/lib/mdp/gridworld";

type Vec2 = { x: number; y: number };

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

function dirVec(a: Action): Vec2 {
  switch (a) {
    case "U":
      return { x: 0, y: -1 };
    case "D":
      return { x: 0, y: 1 };
    case "L":
      return { x: -1, y: 0 };
    case "R":
      return { x: 1, y: 0 };
  }
}

export function GridworldCanvas({
  n,
  walls,
  onToggleWall,
  start,
  terminal,
  V,
  policy,
  agent,
  showValues,
  showPolicy
}: {
  n: number;
  walls: Walls;
  onToggleWall: (kind: "v" | "h", r: number, c: number) => void;
  start: Cell;
  terminal: Cell;
  V: Float64Array;
  policy: Action[];
  agent?: Cell;
  showValues: boolean;
  showPolicy: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 720, h: 720 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      if (!e) return;
      const w = Math.floor(e.contentRect.width);
      setSize({ w, h: w });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cell = useMemo(() => {
    const padding = 8;
    const w = Math.max(320, size.w);
    const inner = w - padding * 2;
    return { padding, w, inner, s: inner / n };
  }, [n, size.w]);

  const heat = useMemo(() => {
    // Robust range: ignore terminal (0) and clamp extremes to avoid one cell dominating.
    const values: number[] = [];
    for (let i = 0; i < n * n; i++) {
      const s = cellFromIdx(n, i);
      if (s.r === terminal.r && s.c === terminal.c) continue;
      values.push(V[i]!);
    }
    values.sort((a, b) => a - b);
    const lo = values.length ? values[Math.floor(values.length * 0.05)]! : 0;
    const hi = values.length ? values[Math.floor(values.length * 0.95)]! : 1;
    return { lo, hi };
  }, [V, n, terminal.c, terminal.r]);

  function colorForValue(v: number) {
    if (!Number.isFinite(v)) return "rgba(255,255,255,0.04)";
    const t = (v - heat.lo) / (heat.hi - heat.lo + 1e-9);
    const u = clamp(t, 0, 1);
    // teal-ish ramp
    const a = 0.06 + 0.24 * u;
    return `hsl(188 86% 52% / ${a.toFixed(3)})`;
  }

  function toSvgPoint(clientX: number, clientY: number) {
    const el = containerRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return { x, y };
  }

  function handleClick(e: React.MouseEvent) {
    const p = toSvgPoint(e.clientX, e.clientY);
    if (!p) return;

    const x = p.x - cell.padding;
    const y = p.y - cell.padding;
    if (x < 0 || y < 0 || x > cell.inner || y > cell.inner) return;

    const cIdx = clamp(Math.floor(x / cell.s), 0, n - 1);
    const rIdx = clamp(Math.floor(y / cell.s), 0, n - 1);
    const localX = x - cIdx * cell.s;
    const localY = y - rIdx * cell.s;
    const edgeTol = cell.s * 0.18;

    // Decide if click is near a vertical or horizontal edge inside the cell.
    const nearLeft = localX < edgeTol;
    const nearRight = localX > cell.s - edgeTol;
    const nearTop = localY < edgeTol;
    const nearBottom = localY > cell.s - edgeTol;

    // Prefer the closest edge if multiple.
    const candidates: Array<{ d: number; kind: "v" | "h"; r: number; c: number }> = [];

    if (nearLeft && cIdx > 0) candidates.push({ d: localX, kind: "v", r: rIdx, c: cIdx - 1 });
    if (nearRight && cIdx < n - 1)
      candidates.push({ d: cell.s - localX, kind: "v", r: rIdx, c: cIdx });

    if (nearTop && rIdx > 0) candidates.push({ d: localY, kind: "h", r: rIdx - 1, c: cIdx });
    if (nearBottom && rIdx < n - 1)
      candidates.push({ d: cell.s - localY, kind: "h", r: rIdx, c: cIdx });

    if (candidates.length === 0) return;
    candidates.sort((a, b) => a.d - b.d);
    const best = candidates[0]!;
    onToggleWall(best.kind, best.r, best.c);
  }

  const outerStroke = "rgba(255,255,255,0.25)";
  const wallStroke = "rgba(255,255,255,0.70)";

  return (
    <div ref={containerRef} className="w-full">
      <svg
        width={cell.w}
        height={cell.w}
        viewBox={`0 0 ${cell.w} ${cell.w}`}
        className="block w-full select-none"
        onClick={handleClick}
        role="img"
        aria-label="Gridworld editor. Click edges to toggle walls."
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.85)" />
          </marker>
        </defs>

        {/* Cells */}
        {Array.from({ length: n * n }).map((_, i) => {
          const s = cellFromIdx(n, i);
          const x = cell.padding + s.c * cell.s;
          const y = cell.padding + s.r * cell.s;

          const isStart = s.r === start.r && s.c === start.c;
          const isTerm = s.r === terminal.r && s.c === terminal.c;
          const isAgent = agent ? s.r === agent.r && s.c === agent.c : false;

          const fill = isTerm ? "hsl(270 86% 60% / 0.18)" : colorForValue(V[i]!);
          const stroke = isStart ? "hsl(188 86% 52% / 0.9)" : "rgba(255,255,255,0.08)";

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={cell.s}
                height={cell.s}
                fill={fill}
                stroke={stroke}
                strokeWidth={isStart ? 2 : 1}
              />

              {showValues ? (
                <text
                  x={x + cell.s * 0.08}
                  y={y + cell.s * 0.22}
                  fill="rgba(255,255,255,0.65)"
                  fontSize={Math.max(9, Math.min(14, cell.s * 0.18))}
                  fontFamily="ui-sans-serif, system-ui"
                >
                  {V[i]!.toFixed(2)}
                </text>
              ) : null}

              {/* Start/terminal labels */}
              {isStart ? (
                <text
                  x={x + cell.s * 0.08}
                  y={y + cell.s * 0.86}
                  fill="rgba(255,255,255,0.85)"
                  fontSize={Math.max(10, Math.min(16, cell.s * 0.22))}
                  fontFamily="ui-sans-serif, system-ui"
                >
                  S
                </text>
              ) : null}
              {isTerm ? (
                <text
                  x={x + cell.s * 0.08}
                  y={y + cell.s * 0.86}
                  fill="rgba(255,255,255,0.85)"
                  fontSize={Math.max(10, Math.min(16, cell.s * 0.22))}
                  fontFamily="ui-sans-serif, system-ui"
                >
                  T
                </text>
              ) : null}

              {/* Policy arrow */}
              {showPolicy && !isTerm ? (
                (() => {
                  const a = policy[idx(n, s)];
                  const d = dirVec(a);
                  const cx = x + cell.s / 2;
                  const cy = y + cell.s / 2;
                  const len = cell.s * 0.26;
                  const x2 = cx + d.x * len;
                  const y2 = cy + d.y * len;
                  return (
                    <line
                      x1={cx}
                      y1={cy}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(255,255,255,0.78)"
                      strokeWidth={Math.max(1.5, cell.s * 0.05)}
                      markerEnd="url(#arrow)"
                      opacity={0.85}
                    />
                  );
                })()
              ) : null}

              {/* Agent marker */}
              {isAgent ? (
                <circle
                  cx={x + cell.s / 2}
                  cy={y + cell.s / 2}
                  r={Math.max(4, cell.s * 0.12)}
                  fill="hsl(35 92% 60% / 0.95)"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={2}
                />
              ) : null}
            </g>
          );
        })}

        {/* Grid lines */}
        {Array.from({ length: n + 1 }).map((_, i) => {
          const x = cell.padding + i * cell.s;
          const y = cell.padding + i * cell.s;
          return (
            <g key={`grid-${i}`}>
              <line
                x1={x}
                y1={cell.padding}
                x2={x}
                y2={cell.padding + cell.inner}
                stroke="rgba(255,255,255,0.06)"
              />
              <line
                x1={cell.padding}
                y1={y}
                x2={cell.padding + cell.inner}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
              />
            </g>
          );
        })}

        {/* Outer border */}
        <rect
          x={cell.padding}
          y={cell.padding}
          width={cell.inner}
          height={cell.inner}
          fill="none"
          stroke={outerStroke}
          strokeWidth={2}
        />

        {/* Walls */}
        {/* Vertical walls */}
        {walls.v.map((row, r) =>
          row.map((on, c) => {
            if (!on) return null;
            const x = cell.padding + (c + 1) * cell.s;
            const y1 = cell.padding + r * cell.s;
            const y2 = y1 + cell.s;
            return (
              <line
                key={`v-${r}-${c}`}
                x1={x}
                y1={y1}
                x2={x}
                y2={y2}
                stroke={wallStroke}
                strokeWidth={Math.max(2, cell.s * 0.12)}
                strokeLinecap="round"
              />
            );
          })
        )}
        {/* Horizontal walls */}
        {walls.h.map((row, r) =>
          row.map((on, c) => {
            if (!on) return null;
            const y = cell.padding + (r + 1) * cell.s;
            const x1 = cell.padding + c * cell.s;
            const x2 = x1 + cell.s;
            return (
              <line
                key={`h-${r}-${c}`}
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                stroke={wallStroke}
                strokeWidth={Math.max(2, cell.s * 0.12)}
                strokeLinecap="round"
              />
            );
          })
        )}

        {/* Legend */}
        <g>
          <rect
            x={cell.padding}
            y={cell.padding - 2}
            width={cell.inner}
            height={cell.s * 0.42}
            fill="transparent"
          />
        </g>
      </svg>

      <div className="mt-2 text-xs text-white/55">
        Tip: click near an edge inside a cell to toggle a wall. Start is <span className="text-white/70">S</span>, terminal is{" "}
        <span className="text-white/70">T</span>.
      </div>
    </div>
  );
}


