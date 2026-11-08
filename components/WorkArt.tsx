import type { WorkArt as Kind } from "@/lib/data";

/** Gloss has no window to screenshot: it is a popup beside your cursor. So, draw that. */
function GlossArt() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] py-10">
      <div className="jp rounded-2xl border border-paper/10 bg-paper/[0.04] p-7 text-[clamp(1rem,1.5vw,1.3rem)] leading-[2.1] text-paper/45 sm:p-10">
        <p>
          <span className="rounded-[3px] bg-shu px-1 py-0.5 text-paper">吾輩は猫である。名前はまだ無い。</span>
          どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。
        </p>
      </div>

      <div
        data-parallax="-10"
        className="absolute -right-2 bottom-0 w-[min(80%,380px)] rounded-xl border border-paper/15 bg-[#221e18] p-5 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] sm:-right-8"
      >
        <div className="label mb-3 flex items-center justify-between text-paper/50">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-shu" />
            Gloss · Read
          </span>
          <span>JA → EN</span>
        </div>
        <p className="font-display text-[clamp(1.2rem,1.9vw,1.6rem)] leading-snug font-light text-paper italic">
          I am a cat. As yet I have no name
          <span className="ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] bg-shu [animation:caret_1s_steps(1)_infinite]" />
        </p>
        <div className="label mt-5 flex gap-1.5 text-paper/60">
          {["Ctrl", "Shift", "O"].map((k) => (
            <kbd key={k} className="rounded-md border border-paper/20 px-2 py-1 font-mono">
              {k}
            </kbd>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Rhythm Glow's mapping, drawn: bass is red, mids are green, treble is blue. */
function MatrixArt() {
  const cols = 16;
  const rows = 9;
  const colour = (c: number) => {
    const t = c / (cols - 1);
    if (t < 0.34) return "#ff4d3a";
    if (t < 0.67) return "#3ddc97";
    return "#4d7dff";
  };
  return (
    <div className="mx-auto w-full max-w-[680px]">
      <div className="label mb-4 flex justify-between text-current/60">
        <span>RCU · Live</span>
        <span className="flex gap-4">
          <span className="text-[#ff7566]">23 Bass</span>
          <span className="text-[#3ddc97]">24 Mid</span>
          <span className="text-[#7d9fff]">25 Treble</span>
        </span>
      </div>
      <div
        className="grid gap-[clamp(4px,0.7vw,9px)] rounded-2xl border border-white/10 bg-white/[0.03] p-[clamp(12px,2vw,28px)]"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols * rows }, (_, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          // a travelling wave, taller in the middle like a spectrum
          const delay = (c * 0.11 + Math.abs(r - rows / 2) * 0.16).toFixed(2);
          return (
            <span
              key={i}
              className="aspect-square rounded-[28%]"
              style={{
                background: colour(c),
                boxShadow: `0 0 14px ${colour(c)}66`,
                animation: `cell ${1.8 + (c % 5) * 0.14}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function WorkArt({ kind }: { kind: Kind }) {
  return kind === "gloss" ? <GlossArt /> : <MatrixArt />;
}
