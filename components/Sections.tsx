import Image from "next/image";
import { ARCHIVE, MARQUEE, PATH, SITE, SOCIALS, TOOLBOX, WORKS, type Work } from "@/lib/data";
import { Clock } from "./Chrome";
import { FluidCanvas } from "./FluidCanvas";
import { WorkArt } from "./WorkArt";

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 12 12" className={`arrow h-[0.7em] w-[0.7em] ${className}`} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
    <path d="M2 10 10 2M3.5 2H10v6.5" />
  </svg>
);

function SectionHead({ index, jp, title, note }: { index: string; jp: string; title: string; note?: string }) {
  return (
    <div data-rise className="label flex items-baseline gap-4 border-t border-current/15 pt-4">
      <span className="text-shu">{index}</span>
      <span className="jp text-[0.85rem] tracking-[0.2em]">{jp}</span>
      <span>{title}</span>
      {note && <span className="ml-auto opacity-55">{note}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ hero */

function HeroLine({ children }: { children: React.ReactNode }) {
  return (
    <span data-hero="line" className="-mb-[0.14em] block overflow-hidden pr-[0.12em] pb-[0.14em]">
      <span className="block will-change-transform">{children}</span>
    </span>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative h-svh min-h-[620px] overflow-hidden">
      <FluidCanvas mode="paper" waitForIntro />

      <div data-hero-content className="wrap relative z-10 flex h-full flex-col justify-between pt-24 pb-7 sm:pt-28">
        <div data-hero="fade" className="label flex justify-between text-ink-soft">
          <span>Portfolio · 第三版 / 2026</span>
          <span className="hidden sm:inline">10.7769° N, 106.7009° E</span>
        </div>

        <div className="relative">
          <h1 className="display text-[clamp(3.6rem,17.5vw,7rem)] sm:text-[clamp(4rem,11.4vw,13rem)]">
            <HeroLine>I see sound</HeroLine>
            <HeroLine>
              <span className="text-shu">&amp;</span> hear <br className="sm:hidden" />
              <em>colour.</em>
            </HeroLine>
          </h1>

          <div className="absolute top-0 right-0 hidden h-full items-start gap-5 lg:flex">
            <p data-hero="fade" className="tate text-[clamp(1rem,1.25vw,1.3rem)] text-ink">
              音を見て、色を聴く。
            </p>
            <div data-hero="stamp" className="hanko mt-1" aria-label="Meoki seal">
              <span className="text-center">
                メオ
                <br />
                キ印
              </span>
            </div>
          </div>
          <p data-hero="fade" className="jp mt-5 text-base tracking-[0.2em] lg:hidden">
            音を見て、色を聴く。
          </p>
        </div>

        <div className="grid grid-cols-2 items-end gap-6 md:grid-cols-3">
          <p data-hero="fade" className="col-span-2 max-w-[26rem] text-[0.95rem] leading-relaxed text-ink md:col-span-1">
            <strong className="font-medium">{SITE.fullName}</strong>, known online as Meoki. A software engineer in
            Ho Chi Minh City, working somewhere between language, light and code. I like software that stays quiet
            until the moment you need it.
          </p>
          <a data-hero="fade" href="#about" className="label flex items-center gap-3 md:justify-self-center">
            <span className="relative block h-9 w-px overflow-hidden bg-ink/20">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-ink [animation:bob_1.6s_ease-in-out_infinite]" />
            </span>
            Scroll
          </a>
          <p data-hero="fade" className="label justify-self-end text-right text-ink-soft">
            <span className="hidden fine:inline">
              Move the cursor. It&rsquo;s ink.
              <br />
              Click to let a drop fall.
            </span>
            <span className="fine:hidden">
              Touch the paper.
              <br />
              It&rsquo;s wet.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- about */

const FACTS = [
  { value: "2016", label: "Designing and building since" },
  { value: "33", label: "Public repositories, and counting" },
  { value: "積読", label: "Tsundoku: the pile of unread light novels", jp: true },
];

export function About() {
  return (
    <section id="about" className="wrap pt-[clamp(5rem,12vw,11rem)] pb-[clamp(5rem,12vw,10rem)]">
      <SectionHead index="01" jp="自己紹介" title="About" note="Ho Chi Minh City, Vietnam" />

      <p data-words className="display mt-[clamp(2.5rem,6vw,6rem)] max-w-[22ch] text-[clamp(2.1rem,5.6vw,6.2rem)] leading-[1.02] lg:max-w-[20ch]">
        I build quiet, useful software for the things I <em>love</em>: Japanese, light novels, and interfaces that
        feel <em>alive.</em>
      </p>

      <div className="mt-[clamp(3rem,7vw,7rem)] grid gap-x-10 gap-y-12 lg:grid-cols-12">
        <p data-rise className="tate hidden h-[15em] text-[1.05rem] text-ink-soft lg:col-span-2 lg:col-start-3 lg:block" lang="ja" title="What you love, you get good at.">
          好きこそ物の上手なれ。
        </p>
        <div className="space-y-5 text-[1.05rem] leading-relaxed text-ink lg:col-span-5 lg:col-start-6">
          <p data-rise>
            I started out in 2016 as a freelance graphic designer, studied information security at university, and
            ended up somewhere in between: a full-stack engineer who cares how a thing looks as much as how it holds
            up.
          </p>
          <p data-rise>
            By day I am a full-stack engineer, faithfully converting coffee into shareholder value. By night I am an unapologetic otaku learning Japanese, and most of what I open-source exists because I
            wanted it for my own reading.
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-6 lg:col-span-12 lg:mt-6">
          {FACTS.map((f) => (
            <li key={f.label} data-rise className="border-t border-line pt-4">
              <div className={`text-[clamp(2rem,5vw,4.6rem)] leading-none ${f.jp ? "jp font-medium" : "display"}`}>
                {f.value}
              </div>
              <div className="label mt-3 max-w-[22ch] leading-relaxed text-ink-soft">{f.label}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- works */

function WorkCard({ work, index }: { work: Work; index: number }) {
  const { theme } = work;
  const tilt = index % 2 ? "lg:rotate-[1.4deg]" : "lg:-rotate-[1.4deg]";
  return (
    <article
      data-stack-card
      className="relative overflow-hidden rounded-t-[1.75rem] will-change-transform stack:sticky stack:top-0 stack:h-svh"
      style={{ background: theme.bg, color: theme.fg, ["--pill-fill" as string]: theme.fg, ["--pill-text" as string]: theme.bg }}
    >
      {/* the wash this project leaves behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-12%] h-[120%] w-[75%] -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${theme.wash}, transparent)`, opacity: theme.dark ? 0.28 : 0.6 }}
      />

      <div className="wrap relative grid h-full gap-10 pt-[clamp(2rem,4vw,3.5rem)] pb-[clamp(2.5rem,4vw,3.5rem)] lg:grid-cols-12 lg:gap-8 stack:pt-24">
        <div className="flex flex-col justify-between gap-8 lg:col-span-5">
          <div className="label flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="jp text-[1.6rem] leading-none tracking-normal">{work.numeral}</span>
              <span className="opacity-60">
                {String(index + 1).padStart(2, "0")} / {String(WORKS.length).padStart(2, "0")}
              </span>
            </span>
            <span className="opacity-60">
              {work.kind} · {work.year}
            </span>
          </div>

          <div>
            <h3 data-lines className="display text-[clamp(3.2rem,7.2vw,8rem)]">
              {work.title}
              {work.jp && <span className="jp ml-[0.25em] align-[0.35em] text-[0.3em] tracking-[0.1em] opacity-70">{work.jp}</span>}
            </h3>
            <p data-rise className="mt-5 max-w-[24ch] font-display text-[clamp(1.3rem,2vw,1.9rem)] leading-[1.15] font-light italic">
              {work.tagline}
            </p>
            <p data-rise className="mt-5 max-w-[46ch] text-[0.98rem] leading-relaxed opacity-80">
              {work.body}
            </p>
          </div>

          <div data-rise className="flex flex-col gap-5">
            <ul className="label flex flex-wrap gap-x-4 gap-y-1 opacity-60">
              {work.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2.5">
              {work.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="pill">
                  {l.label} <Arrow />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center lg:col-span-7">
          {work.image ? (
            <a
              href={work.links[0].href}
              target="_blank"
              rel="noreferrer"
              data-media
              data-cursor="Open"
              aria-label={`Open ${work.title}`}
              className={`group block w-full overflow-hidden rounded-xl shadow-[0_40px_90px_-30px_rgb(0_0_0/0.45)] ring-1 ring-black/10 ${tilt}`}
            >
              <Image
                src={work.image.src}
                width={work.image.width}
                height={work.image.height}
                alt={work.image.alt}
                sizes="(min-width: 1024px) 56vw, 92vw"
                priority={index === 0}
                className="h-auto w-full transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.035]"
              />
            </a>
          ) : (
            <div data-media className="w-full">
              <WorkArt kind={work.art!} />
            </div>
          )}
        </div>
      </div>

      <div data-stack-shade aria-hidden className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
    </article>
  );
}

export function Works() {
  return (
    <section id="works" className="relative scroll-mt-24">
      <div className="wrap pb-[clamp(2.5rem,5vw,4.5rem)]">
        <SectionHead index="02" jp="作品" title="Selected works" note={`${WORKS.length} projects, 2024 to 2026`} />
        <h2 data-lines className="display mt-[clamp(2rem,5vw,4.5rem)] text-[clamp(3rem,10vw,11rem)]">
          Things I <em>made</em>
        </h2>
      </div>
      {WORKS.map((work, i) => (
        <WorkCard key={work.slug} work={work} index={i} />
      ))}
    </section>
  );
}

/* --------------------------------------------------------------- archive */

export function Archive() {
  return (
    <section id="archive" className="relative z-10 -mt-7 rounded-t-[1.75rem] bg-paper pt-[clamp(4rem,9vw,8rem)] pb-[clamp(4rem,9vw,8rem)]">
      <div className="wrap">
        <SectionHead index="03" jp="書庫" title="Archive" note="Smaller things, older things" />
        <div className="mt-[clamp(2rem,5vw,4.5rem)] grid gap-10 lg:grid-cols-12">
          <h2 data-lines className="display text-[clamp(2.4rem,5vw,5rem)] lg:col-span-4">
            The back <em>shelf</em>
          </h2>
          <ul className="lg:col-span-8">
            {ARCHIVE.map((item) => (
              <li key={item.name} data-rise className="border-t border-line last:border-b">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative grid grid-cols-[3.2rem_1fr_auto] items-baseline gap-x-4 px-1 py-5 transition-colors duration-500 hover:text-paper sm:grid-cols-[4rem_minmax(0,1.1fr)_minmax(0,1.5fr)_6.5rem_3rem_1.2rem] sm:px-3"
                >
                  <span aria-hidden className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
                  <span className="label opacity-60">{item.year}</span>
                  <span className="font-display text-[1.45rem] leading-tight font-light tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                    {item.name}
                    <span className="mt-1 block font-sans text-sm tracking-normal opacity-65 sm:hidden">{item.note}</span>
                  </span>
                  <span className="hidden text-[0.92rem] opacity-70 sm:block">{item.note}</span>
                  <span className="label hidden opacity-60 sm:block">{item.lang}</span>
                  <span className="label hidden tabular-nums opacity-60 sm:block">{item.stars ? `★ ${item.stars}` : ""}</span>
                  <Arrow className="justify-self-end transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- toolbox */

function MarqueeRow({ words, reverse }: { words: string[]; reverse?: boolean }) {
  const run = [...words, ...words];
  return (
    <div className="flex overflow-hidden select-none" aria-hidden>
      <div
        className="display flex shrink-0 animate-marquee items-center whitespace-nowrap text-[clamp(3.5rem,11vw,11rem)] leading-[1.08]"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[0, 1].map((copy) =>
          run.map((w, i) => (
            <span key={`${copy}-${i}`} className="flex items-center">
              <span className={i % 2 ? "italic [font-variation-settings:'SOFT'_100,'WONK'_1]" : ""}>{w}</span>
              <span className="mx-[0.35em] inline-block h-[0.16em] w-[0.16em] rounded-full bg-shu" />
            </span>
          )),
        )}
      </div>
    </div>
  );
}

export function Toolbox() {
  return (
    <section id="toolbox" className="relative z-10 scroll-mt-24 bg-paper pb-[clamp(5rem,11vw,10rem)]">
      <div className="wrap">
        <SectionHead index="04" jp="道具" title="Toolbox" note="What is usually on the desk" />
      </div>
      <div className="mt-[clamp(2rem,5vw,4rem)] space-y-1">
        <MarqueeRow words={MARQUEE[0]} />
        <MarqueeRow words={MARQUEE[1]} reverse />
      </div>
      <div className="wrap mt-[clamp(3rem,6vw,6rem)] grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
        {TOOLBOX.map((group) => (
          <div key={group.title} data-rise>
            <h3 className="label flex items-baseline gap-3 border-t border-line pt-4">
              <span className="jp text-[0.85rem] tracking-[0.15em] text-shu">{group.jp}</span>
              {group.title}
            </h3>
            <ul className="mt-5 space-y-1.5 font-display text-[clamp(1.15rem,1.6vw,1.5rem)] font-light tracking-tight">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ path */

export function Path() {
  return (
    <section id="path" className="wrap relative z-10 scroll-mt-24 bg-paper pb-[clamp(5rem,12vw,11rem)]">
      <SectionHead index="05" jp="道のり" title="Path" note="2016 to today" />
      <h2 data-lines className="display mt-[clamp(2rem,5vw,4.5rem)] max-w-[14ch] text-[clamp(2.6rem,7vw,7.5rem)]">
        From pixels to <em>payslips</em> to books
      </h2>
      <ol className="mt-[clamp(2.5rem,6vw,5.5rem)]">
        {PATH.map((step) => (
          <li
            key={step.year}
            data-rise
            className="group grid gap-x-8 gap-y-2 border-t border-line py-7 last:border-b md:grid-cols-12 md:py-9"
          >
            <span className="display text-[clamp(2.4rem,5vw,4.8rem)] transition-colors duration-500 group-hover:text-shu md:col-span-3">
              {step.year}
            </span>
            <h3 className="self-center font-display text-[clamp(1.3rem,2.1vw,2rem)] leading-tight font-light tracking-tight md:col-span-4">
              {step.title}
            </h3>
            <p className="max-w-[44ch] self-center text-[0.98rem] leading-relaxed text-ink-soft md:col-span-5">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* --------------------------------------------------------------- contact */

export function Contact() {
  return (
    <footer id="contact" className="relative z-10 overflow-hidden rounded-t-[1.75rem] bg-ink text-paper">
      <FluidCanvas mode="night" />
      <div className="wrap relative flex min-h-svh flex-col justify-between gap-16 pt-[clamp(3rem,6vw,5rem)] pb-7">
        <SectionHead index="06" jp="連絡" title="Contact" note="Open to collaboration" />

        <div>
          <h2 data-lines className="display text-[clamp(3.2rem,12vw,13.5rem)]">
            Have an idea? Let&rsquo;s give it <em>colour.</em>
          </h2>
          <div data-rise className="mt-[clamp(2rem,4vw,3.5rem)] flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={`mailto:${SITE.email}`}
              className="link-line font-display text-[clamp(1.6rem,3.6vw,3.4rem)] leading-tight font-light tracking-tight"
            >
              {SITE.email} <Arrow className="ml-1 inline-block text-shu" />
            </a>
            <p className="jp text-sm tracking-[0.25em] opacity-60">お気軽にどうぞ。</p>
          </div>
        </div>

        <div>
          <ul data-rise className="grid grid-cols-2 gap-x-6 border-t border-paper/15 sm:grid-cols-3 lg:grid-cols-5">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="group block py-5" style={{ ["--pill-fill" as string]: "#f3efe6" }}>
                  <span className="label block opacity-55">{s.label}</span>
                  <span className="mt-1.5 flex items-center gap-2 font-display text-xl font-light tracking-tight">
                    <span className="link-line">{s.handle}</span>
                    <Arrow className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="label flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-paper/15 pt-5 opacity-70">
            <span>© 2026 {SITE.fullName}</span>
            <span className="hidden md:inline">Set in Fraunces &amp; Shippori Mincho. Ink simulated in WebGL.</span>
            <Clock />
            <a href="#top" className="link-line">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
