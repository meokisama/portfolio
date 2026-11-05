"use client";

import { useEffect, useRef, useState } from "react";
import { Fluid, type FluidMode } from "@/lib/fluid";
import { sound } from "@/lib/sound";

const GROUND: Record<FluidMode, [number, number, number]> = {
  paper: [243 / 255, 239 / 255, 230 / 255],
  night: [23 / 255, 20 / 255, 15 / 255],
};

interface Props {
  mode: FluidMode;
  /** Wait for the intro before the first strokes. */
  waitForIntro?: boolean;
  className?: string;
}

export function FluidCanvas({ mode, waitForIntro = false, className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fluid = new Fluid(canvas, {
      mode,
      ground: GROUND[mode],
      reducedMotion,
      onColour: (i) => sound.pluck(i, 0.8),
    });
    if (!fluid.ok) {
      setFailed(true);
      return;
    }

    let visible = false;
    let opened = false;
    let introDone = !waitForIntro;
    const open = () => {
      if (opened || !visible || !introDone) return;
      opened = true;
      fluid.flourish();
    };
    const sync = () => {
      if (visible && !document.hidden) fluid.start();
      else fluid.stop();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
        open();
      },
      { threshold: 0.02 },
    );
    io.observe(canvas);

    const onIntro = () => {
      introDone = true;
      open();
    };
    const locate = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      return x >= 0 && x <= 1 && y >= 0 && y <= 1 ? { x, y } : null;
    };
    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const p = locate(e);
      if (p) fluid.pointerMove(p.x, p.y);
      else fluid.pointerLeave();
    };
    const onDown = (e: PointerEvent) => {
      if (!visible || (e.target as HTMLElement).closest("a, button")) return;
      const p = locate(e);
      if (!p) return;
      const colour = Math.floor(Math.random() * 6);
      fluid.blot(p.x, p.y, colour);
      sound.pluck(colour, 1);
    };

    window.addEventListener("meoki:ready", onIntro);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") fluid.pointerLeave();
    };
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("visibilitychange", sync);

    return () => {
      io.disconnect();
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("meoki:ready", onIntro);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", sync);
      fluid.destroy();
    };
  }, [mode, waitForIntro]);

  if (failed) {
    // No float render targets: a still wash stands in for the simulation.
    return (
      <div
        aria-hidden
        className={`absolute inset-0 ${className}`}
        style={{
          background:
            mode === "paper"
              ? "radial-gradient(40% 50% at 72% 38%, rgb(33 64 127 / .28), transparent 70%), radial-gradient(35% 45% at 30% 62%, rgb(217 56 30 / .22), transparent 70%), radial-gradient(30% 40% at 55% 75%, rgb(242 173 26 / .25), transparent 70%)"
              : "radial-gradient(40% 50% at 70% 60%, rgb(61 107 255 / .35), transparent 70%), radial-gradient(35% 45% at 28% 70%, rgb(255 77 36 / .3), transparent 70%)",
        }}
      />
    );
  }

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />;
}
