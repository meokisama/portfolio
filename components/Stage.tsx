"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const STACK_QUERY = "(min-width: 1024px) and (min-height: 680px)";

/** Owns smooth scrolling, the intro, and every scroll-driven motion on the page. */
export function Stage({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ready = () => window.dispatchEvent(new Event("meoki:ready"));

      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-lines], [data-words], [data-hero]", { visibility: "visible" });
        gsap.set("[data-rise]", { opacity: 1, y: 0 });
        gsap.set("#preloader", { display: "none" });
        ready();
        return;
      }

      /* smooth scroll, driven by the same clock as the animations */
      const lenis = new Lenis({ anchors: true, lerp: 0.11 });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenis.stop();

      /* intro */
      gsap.set("[data-hero='line'] > span", { yPercent: 118 });
      gsap.set("[data-hero='line']", { visibility: "visible" });
      const counter = { v: 0 };
      const counterEl = document.querySelector("#pre-count");
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from("#pre-chars > span", { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.055 }, 0.1)
        .to(
          counter,
          {
            v: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterEl) counterEl.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0,
        )
        .to("#pre-inner", { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, 1.55)
        .to("#preloader", { yPercent: -100, duration: 1.15, ease: "expo.inOut" }, 1.75)
        .add(() => {
          ready();
          lenis.start();
        }, 2.2)
        .to("[data-hero='line'] > span", { yPercent: 0, duration: 1.5, stagger: 0.11 }, 2.25)
        .fromTo(
          "[data-hero='fade']",
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.08 },
          2.7,
        )
        .fromTo(
          "[data-hero='stamp']",
          { autoAlpha: 0, scale: 2.1, rotate: -24 },
          { autoAlpha: 1, scale: 1, rotate: -7, duration: 0.55, ease: "back.out(2.2)" },
          3.25,
        )
        .set("#preloader", { display: "none" });

      gsap.to("[data-hero-content]", {
        yPercent: -14,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: "#top", start: "top top", end: "bottom 25%", scrub: true },
      });

      /* headings: lines rise out of a mask */
      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            return gsap.from(self.lines, {
              yPercent: 112,
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          },
        });
      });

      /* statement: words take ink as you read */
      gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            return gsap.fromTo(
              self.words,
              { opacity: 0.1 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: 0.4 },
              },
            );
          },
        });
      });

      ScrollTrigger.batch("[data-rise]", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.07 }),
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax) || 8;
        gsap.fromTo(
          el,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger: el.parentElement, scrub: true } },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-media]").forEach((el) => {
        gsap.from(el, {
          y: 90,
          opacity: 0,
          rotate: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        });
      });

      /* works: each sheet settles back as the next is laid on top */
      const mm = gsap.matchMedia();
      mm.add(STACK_QUERY, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const scrollTrigger = { trigger: next, start: "top bottom", end: "top top", scrub: true };
          gsap.to(card, { scale: 0.92, transformOrigin: "50% 0%", ease: "none", scrollTrigger });
          gsap.to(card.querySelector("[data-stack-shade]"), { opacity: 0.55, ease: "none", scrollTrigger });
        });
      });

      document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
