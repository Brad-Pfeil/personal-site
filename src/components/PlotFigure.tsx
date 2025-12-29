"use client";

import { useEffect, useRef, useState } from "react";

type PlotFactory = (opts: { width: number }) => Element;

export function PlotFigure({
  makePlot,
  className,
  ariaLabel
}: {
  makePlot: PlotFactory;
  className?: string;
  ariaLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(720);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    // Ensure Plot doesn't try to render at width 0 during first paint.
    const safeWidth = Math.max(320, Math.floor(width));
    const plot = makePlot({ width: safeWidth });
    el.innerHTML = "";
    el.append(plot);
    return () => {
      plot.remove();
    };
  }, [makePlot, mounted, width]);

  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mounted]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
      style={{ width: "100%" }}
    />
  );
}


