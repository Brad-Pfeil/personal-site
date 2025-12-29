export type Action = "U" | "D" | "L" | "R";
export const Actions: readonly Action[] = ["U", "D", "L", "R"] as const;

export type Cell = { r: number; c: number };

export type GridworldConfig = {
  n: number;
  gamma: number; // fixed 0.99 in UI, but keep general
  start: Cell; // fixed (0,0)
  terminal: Cell; // fixed (n-1,n-1)
  pIntended: number; // slip model
  stepCost: number;
  terminalReward: number; // reward upon entering terminal
  bumpPenaltyEnabled: boolean;
  bumpPenalty: number;
  walls: Walls;
};

// Walls are represented as two boolean grids:
// - v[r][c] is wall between (r,c) and (r,c+1) for c in [0..n-2]
// - h[r][c] is wall between (r,c) and (r+1,c) for r in [0..n-2]
export type Walls = {
  n: number;
  v: boolean[][]; // n rows, n-1 cols
  h: boolean[][]; // n-1 rows, n cols
};

export function emptyWalls(n: number): Walls {
  const v = Array.from({ length: n }, () => Array.from({ length: Math.max(0, n - 1) }, () => false));
  const h = Array.from({ length: Math.max(0, n - 1) }, () => Array.from({ length: n }, () => false));
  return { n, v, h };
}

export function isTerminal(cfg: GridworldConfig, s: Cell): boolean {
  return s.r === cfg.terminal.r && s.c === cfg.terminal.c;
}

export function clampCell(n: number, s: Cell): Cell {
  return { r: Math.max(0, Math.min(n - 1, s.r)), c: Math.max(0, Math.min(n - 1, s.c)) };
}

function delta(a: Action): Cell {
  switch (a) {
    case "U":
      return { r: -1, c: 0 };
    case "D":
      return { r: 1, c: 0 };
    case "L":
      return { r: 0, c: -1 };
    case "R":
      return { r: 0, c: 1 };
  }
}

function perpendicular(a: Action): [Action, Action] {
  if (a === "U" || a === "D") return ["L", "R"];
  return ["U", "D"];
}

export function blockedByWall(walls: Walls, from: Cell, to: Cell): boolean {
  const { n } = walls;
  if (to.r < 0 || to.r >= n || to.c < 0 || to.c >= n) return true;

  // Horizontal move
  if (from.r === to.r && Math.abs(from.c - to.c) === 1) {
    const r = from.r;
    const cMin = Math.min(from.c, to.c);
    return walls.v[r]?.[cMin] ?? false;
  }

  // Vertical move
  if (from.c === to.c && Math.abs(from.r - to.r) === 1) {
    const rMin = Math.min(from.r, to.r);
    const c = from.c;
    return walls.h[rMin]?.[c] ?? false;
  }

  return true;
}

export function attemptMove(cfg: GridworldConfig, s: Cell, a: Action): { next: Cell; bumped: boolean } {
  const d = delta(a);
  const to = { r: s.r + d.r, c: s.c + d.c };
  const bumped = blockedByWall(cfg.walls, s, to);
  return { next: bumped ? s : to, bumped };
}

export type Transition = { s1: Cell; p: number; r: number };

// Reward convention:
// - Always include stepCost for any action taken (including staying)
// - If movement attempt is blocked and bumpPenaltyEnabled, add bumpPenalty
// - If you enter terminal, add terminalReward (once, on entering)
export function transitions(cfg: GridworldConfig, s: Cell, a: Action): Transition[] {
  if (isTerminal(cfg, s)) {
    // absorbing terminal with zero reward (episode ends; keeping it absorbing makes value iteration stable)
    return [{ s1: s, p: 1, r: 0 }];
  }

  const pMain = cfg.pIntended;
  const pSlip = (1 - pMain) / 2;
  const [p1, p2] = perpendicular(a);
  const candidates: Array<{ a2: Action; p: number }> = [
    { a2: a, p: pMain },
    { a2: p1, p: pSlip },
    { a2: p2, p: pSlip }
  ];

  const map = new Map<string, { s1: Cell; p: number; r: number }>();

  for (const c of candidates) {
    if (c.p <= 0) continue;
    const { next, bumped } = attemptMove(cfg, s, c.a2);
    let r = cfg.stepCost;
    if (bumped && cfg.bumpPenaltyEnabled) r += cfg.bumpPenalty;
    if (!isTerminal(cfg, s) && isTerminal(cfg, next)) r += cfg.terminalReward;

    const key = `${next.r},${next.c},${r}`; // group by state+reward
    const prev = map.get(key);
    if (prev) prev.p += c.p;
    else map.set(key, { s1: next, p: c.p, r });
  }

  return Array.from(map.values());
}

export type SolveResult = {
  V: Float64Array; // length n*n
  policy: Action[]; // length n*n (best action; terminal arbitrary)
  iterations: number;
  delta: number;
};

export function idx(n: number, s: Cell): number {
  return s.r * n + s.c;
}

export function cellFromIdx(n: number, i: number): Cell {
  return { r: Math.floor(i / n), c: i % n };
}

export function valueIteration(
  cfg: GridworldConfig,
  opts?: { maxIter?: number; tol?: number }
): SolveResult {
  const n = cfg.n;
  const maxIter = opts?.maxIter ?? 5000;
  const tol = opts?.tol ?? 1e-7;

  const V = new Float64Array(n * n);
  const nextV = new Float64Array(n * n);
  const policy: Action[] = Array.from({ length: n * n }, () => "R");

  let iter = 0;
  let maxDelta = Infinity;

  while (iter < maxIter && maxDelta > tol) {
    maxDelta = 0;

    for (let i = 0; i < n * n; i++) {
      const s = cellFromIdx(n, i);
      if (isTerminal(cfg, s)) {
        nextV[i] = 0;
        policy[i] = "R";
        continue;
      }

      let bestQ = -Infinity;
      let bestA: Action = "R";
      for (const a of Actions) {
        const ts = transitions(cfg, s, a);
        let q = 0;
        for (const t of ts) {
          q += t.p * (t.r + cfg.gamma * V[idx(n, t.s1)]);
        }
        if (q > bestQ) {
          bestQ = q;
          bestA = a;
        }
      }

      nextV[i] = bestQ;
      policy[i] = bestA;
      const d = Math.abs(nextV[i] - V[i]);
      if (d > maxDelta) maxDelta = d;
    }

    V.set(nextV);
    iter += 1;
  }

  return { V, policy, iterations: iter, delta: maxDelta };
}


