"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { NAV } from "@/lib/data";
import { sound } from "@/lib/sound";

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" className={className} fill="currentColor" aria-hidden>
      <path d="M11.0575 0.636853C11.0575 0.62238 11.0575 0.615143 11.0575 0.615143C11.0575 0.615143 11.0575 0.629616 11.0431 0.629616C11.0431 0.629616 11.0431 0.615143 11.0288 0.615143C11.0288 0.615143 11.0288 0.629617 11.0288 0.636853C10.5974 1.4908 0.0718926 21.3487 0.438559 21.3342C0.934638 21.3198 1.4451 21.3342 1.94117 21.3704C2.13529 21.3849 2.20719 21.2763 2.28627 21.1388C2.80392 20.1619 10.2523 6.15857 11.0431 4.74014C11.8196 6.15857 19.2105 20.1619 19.7137 21.1388C19.7928 21.2763 19.8647 21.3849 20.0588 21.3704C20.5549 21.3487 21.051 21.327 21.5471 21.3342C21.9281 21.3487 11.4961 1.49804 11.0575 0.636853Z" />
      <path d="M18.1608 21.3849C17.9883 21.0158 17.7294 20.5599 17.4778 20.104C17.3412 19.8579 17.3053 19.8 16.8092 19.8C15.5726 19.8 13.2791 19.7783 11.0647 19.7638H11.0504H11.036C8.83598 19.7855 6.57127 19.8 5.34905 19.8C4.85297 19.8 4.81702 19.8579 4.68761 20.104C4.43598 20.5599 4.19153 21.0013 4.01898 21.3849C4.27062 21.3849 7.68565 21.3849 11.0719 21.3632C14.4582 21.3849 17.8948 21.3849 18.1608 21.3849Z" />
    </svg>
  );
}

function SoundToggle() {
  const on = useSyncExternalStore(
    sound.subscribe,
    () => sound.enabled,
    () => false,
  );
  return (
    <button
      type="button"
      onClick={() => sound.toggle()}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className="label flex cursor-pointer items-center gap-2"
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0.5, 1, 0.7, 0.35].map((h, i) => (
          <span
            key={i}
            className="w-[2px] origin-bottom bg-current transition-transform duration-500"
            style={{
              height: "100%",
              transform: `scaleY(${on ? h : 0.18})`,
              animation: on ? `bob ${0.7 + i * 0.17}s ease-in-out ${i * 0.08}s infinite` : "none",
            }}
          />
        ))}
      </span>
      <span>
        <span className="jp mr-1 text-[0.8rem] tracking-normal">音</span>
        {on ? "On" : "Off"}
      </span>
    </button>
  );
}

export function Clock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`label tabular-nums ${className}`} suppressHydrationWarning>
      Saigon {time || "--:--"}
    </span>
  );
}

export function Nav() {
  return (
    <header className="wrap pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between py-5 text-white mix-blend-difference">
      <a href="#top" className="pointer-events-auto flex items-center gap-2.5" aria-label="Meoki, back to top">
        <Mark className="h-5 w-5" />
        <span className="hidden font-display text-lg tracking-tight sm:inline">Meoki</span>
      </a>
      <nav className="pointer-events-auto flex items-center gap-4 sm:gap-7" aria-label="Sections">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} className="label link-line">
            {item.label}
          </a>
        ))}
      </nav>
      <div className="pointer-events-auto hidden items-center gap-7 md:flex">
        <Clock />
        <SoundToggle />
      </div>
    </header>
  );
}

/** A drop of ink that follows the pointer and opens up over things you can act on. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = dot.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { opacity: 1, duration: 0.3 });
      }
      x(e.clientX);
      y(e.clientY);
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const label = target?.dataset.cursor ?? "";
      el.dataset.state = label ? "label" : target ? "link" : "";
      if (text.current && label) text.current.textContent = label;
    };
    const leave = () => {
      shown = false;
      gsap.to(el, { opacity: 0, duration: 0.3 });
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="group pointer-events-none fixed top-0 left-0 z-[70] hidden opacity-0 fine:block"
    >
      <div className="grid h-3 w-3 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-shu transition-[width,height,background-color] duration-500 ease-out-expo group-data-[state=label]:h-20 group-data-[state=label]:w-20 group-data-[state=link]:h-9 group-data-[state=link]:w-9 group-data-[state=link]:bg-shu/25">
        <span
          ref={text}
          className="label scale-0 text-paper transition-transform duration-500 ease-out-expo group-data-[state=label]:scale-100"
        />
      </div>
    </div>
  );
}

export function Preloader() {
  return (
    <div
      id="preloader"
      className="fixed inset-0 z-[80] hidden bg-ink text-paper [html.js_&]:block"
      aria-hidden
    >
      <div id="pre-inner" className="wrap flex h-full flex-col justify-between py-8">
        <div className="label flex justify-between opacity-60">
          <span>Meoki / Portfolio</span>
          <span>第三版</span>
        </div>
        <div id="pre-chars" className="jp flex justify-center overflow-hidden text-[clamp(1.6rem,4.5vw,3.6rem)] tracking-[0.2em]">
          {"音を見て、色を聴く。".split("").map((c, i) => (
            <span key={i} className={`inline-block ${c === "音" || c === "色" ? "text-shu" : ""}`}>
              {c}
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between">
          <span className="label opacity-60">Grinding the ink</span>
          <span id="pre-count" className="display text-[clamp(3rem,9vw,7rem)] tabular-nums">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
