"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { GridworldCanvas } from "@/components/GridworldCanvas";
import { PageHeader } from "@/components/PageHeader";
import { mulberry32 } from "@/lib/random";
import {
  attemptMove,
  emptyWalls,
  isTerminal,
  type Action,
  type Cell,
  type Walls,
  valueIteration
} from "@/lib/mdp/gridworld";

export default function MdpGridworldPage() {
  const [gridSize, setGridSize] = useState(10);
  const [pIntended, setPIntended] = useState(0.8);
  const [stepCost, setStepCost] = useState(-0.02);
  const [terminalReward, setTerminalReward] = useState(1.0);
  const [bumpPenaltyEnabled, setBumpPenaltyEnabled] = useState(true);
  const [bumpPenalty, setBumpPenalty] = useState(-0.05);
  const [showValues, setShowValues] = useState(false);
  const [showPolicy, setShowPolicy] = useState(true);
  const [seed, setSeed] = useState(23);

  const [walls, setWalls] = useState<Walls>(() => emptyWalls(10));

  useEffect(() => {
    setWalls(emptyWalls(gridSize));
  }, [gridSize]);

  const start = useMemo(() => ({ r: 0, c: 0 }), []);
  const terminal = useMemo(
    () => ({ r: gridSize - 1, c: gridSize - 1 }),
    [gridSize]
  );

  const cfg = useMemo(
    () => ({
      n: gridSize,
      gamma: 0.99,
      start,
      terminal,
      pIntended,
      stepCost,
      terminalReward,
      bumpPenaltyEnabled,
      bumpPenalty,
      walls
    }),
    [
      bumpPenalty,
      bumpPenaltyEnabled,
      gridSize,
      pIntended,
      start,
      stepCost,
      terminal,
      terminalReward,
      walls
    ]
  );

  const solved = useMemo(() => valueIteration(cfg, { tol: 1e-7, maxIter: 2000 }), [cfg]);

  const startIdx = 0;
  const expectedReturn = solved.V[startIdx] ?? 0;

  const [agent, setAgent] = useState<Cell | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSteps, setSimSteps] = useState(0);
  const [lastTransition, setLastTransition] = useState<{
    intended: Action;
    actual: Action;
    bumped: boolean;
  } | null>(null);
  const intervalRef = useRef<number | null>(null);
  const stepsRef = useRef(0);

  useEffect(() => {
    // stop sim on config changes
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsSimulating(false);
    setAgent(null);
    setSimSteps(0);
    setLastTransition(null);
    stepsRef.current = 0;
  }, [cfg]);

  function toggleWall(kind: "v" | "h", r: number, c: number) {
    setWalls((w) => {
      const next: Walls = {
        n: w.n,
        v: w.v.map((row) => row.slice()),
        h: w.h.map((row) => row.slice())
      };
      if (kind === "v") {
        if (next.v[r]?.[c] === undefined) return w;
        next.v[r]![c] = !next.v[r]![c];
      } else {
        if (next.h[r]?.[c] === undefined) return w;
        next.h[r]![c] = !next.h[r]![c];
      }
      return next;
    });
  }

  function sampleActualAction(intended: Action, rng: () => number): Action {
    const p = pIntended;
    const slip = (1 - p) / 2;
    const u = rng();
    if (u < p) return intended;
    const perps: [Action, Action] =
      intended === "U" || intended === "D" ? ["L", "R"] : ["U", "D"];
    return u < p + slip ? perps[0] : perps[1];
  }

  function startSimulation() {
    if (isSimulating) return;
    setIsSimulating(true);
    stepsRef.current = 0;
    setSimSteps(0);
    setAgent(start);
    const rng = mulberry32(seed);
    const maxSteps = gridSize * gridSize * 4;

    intervalRef.current = window.setInterval(() => {
      setAgent((cur) => {
        const s = cur ?? start;
        if (isTerminal(cfg, s)) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsSimulating(false);
          return s;
        }
        const i = s.r * gridSize + s.c;
        const intended = solved.policy[i] ?? "R";
        const actual = sampleActualAction(intended, rng);
        const { next, bumped } = attemptMove(cfg, s, actual);
        setLastTransition({ intended, actual, bumped });
        stepsRef.current += 1;
        setSimSteps(stepsRef.current);
        if (stepsRef.current >= maxSteps) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsSimulating(false);
          return next;
        }
        if (isTerminal(cfg, next)) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsSimulating(false);
        }
        return next;
      });
    }, 220);
  }

  function stopSimulation() {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsSimulating(false);
    stepsRef.current = 0;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gridworld MDP"
        subtitle="A stochastic gridworld with editable walls. We’ll solve for the optimal policy via value iteration and then simulate rollouts under transition noise."
        right={
          <>
            <button className="btn" onClick={() => (isSimulating ? stopSimulation() : startSimulation())}>
              {isSimulating ? "Stop" : "Simulate"}
            </button>
            <button
              className="btn"
              onClick={() => {
                setGridSize(10);
                setWalls(emptyWalls(10));
                setPIntended(0.8);
                setStepCost(-0.02);
                setTerminalReward(1.0);
                setBumpPenaltyEnabled(true);
                setBumpPenalty(-0.05);
                setShowPolicy(true);
                setShowValues(false);
                setSeed(23);
                stopSimulation();
                setAgent(null);
                setSimSteps(0);
              }}
            >
              Reset
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
                <span>Grid size</span>
                <span className="text-white/55">{gridSize}×{gridSize}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={4}
                max={20}
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value, 10))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>p(intended)</span>
                <span className="text-white/55">{pIntended.toFixed(2)}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0.4}
                max={1.0}
                step={0.01}
                value={pIntended}
                onChange={(e) => setPIntended(parseFloat(e.target.value))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>Step cost</span>
                <span className="text-white/55">{stepCost.toFixed(3)}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={-0.2}
                max={0}
                step={0.005}
                value={stepCost}
                onChange={(e) => setStepCost(parseFloat(e.target.value))}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span>Terminal reward</span>
                <span className="text-white/55">{terminalReward.toFixed(2)}</span>
              </div>
              <input
                className="mt-2 w-full"
                type="range"
                min={0}
                max={5}
                step={0.05}
                value={terminalReward}
                onChange={(e) => setTerminalReward(parseFloat(e.target.value))}
              />
            </label>

            <div className="flex items-center justify-between gap-3 pt-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bumpPenaltyEnabled}
                  onChange={(e) => setBumpPenaltyEnabled(e.target.checked)}
                />
                <span>Bump penalty</span>
              </label>
              <span className="text-white/55">{bumpPenalty.toFixed(3)}</span>
            </div>
            <input
              className="w-full"
              type="range"
              min={-0.3}
              max={0}
              step={0.005}
              value={bumpPenalty}
              onChange={(e) => setBumpPenalty(parseFloat(e.target.value))}
              disabled={!bumpPenaltyEnabled}
            />

            <div className="card mt-2 p-4">
              <div className="text-xs uppercase tracking-wider text-white/45">Solve</div>
              <div className="mt-2 text-sm text-white/75">
                γ = 0.99 · iterations {solved.iterations} · Δ {solved.delta.toExponential(2)}
              </div>
              <div className="mt-2 text-sm text-white/70">
                V(start) ≈ <span className="text-white/85">{expectedReturn.toFixed(3)}</span>
              </div>
              <div className="mt-2 text-sm text-white/60">
                Sim steps: {simSteps} {agent && isTerminal(cfg, agent) ? "(reached terminal)" : ""}
              </div>
              {lastTransition ? (
                <div className="mt-2 text-xs text-white/55">
                  Intended <span className="text-white/75">{lastTransition.intended}</span> · Actual{" "}
                  <span className="text-white/75">{lastTransition.actual}</span>
                  {lastTransition.bumped ? " · bumped" : ""}
                </div>
              ) : null}
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-center justify-between gap-3">
                <span>Show policy</span>
                <input type="checkbox" checked={showPolicy} onChange={(e) => setShowPolicy(e.target.checked)} />
              </label>
              <label className="flex items-center justify-between gap-3">
                <span>Show values</span>
                <input type="checkbox" checked={showValues} onChange={(e) => setShowValues(e.target.checked)} />
              </label>
              <label className="block">
                <div className="flex items-center justify-between">
                  <span>Sim seed</span>
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

              <button className="btn w-full" onClick={() => setWalls(emptyWalls(gridSize))}>
                Clear walls
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-white/90">Grid (click edges to toggle walls)</div>
            <div className="text-xs text-white/55">
              Start (0,0) · Terminal ({terminal.r},{terminal.c})
            </div>
          </div>

          <div className="mt-4">
            <GridworldCanvas
              n={gridSize}
              walls={walls}
              onToggleWall={toggleWall}
              start={start}
              terminal={terminal}
              V={solved.V}
              policy={solved.policy}
              agent={agent ?? undefined}
              showValues={showValues}
              showPolicy={showPolicy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


