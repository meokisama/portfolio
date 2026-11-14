# Meoki · Portfolio, third edition

> 音を見て、色を聴く。 I see sound and hear colour.

The site at [meoki.vn](https://meoki.vn). A single page set like a Japanese book: washi paper, mincho type, a vermilion seal, and ink that moves when you do.

## What is in it

- **Ink you can touch.** The hero and the footer run a small stable-fluids solver on WebGL2 (`lib/fluid.ts`). On paper the dye is pigment: it absorbs light, pools at its edges and catches on the paper's tooth. In the footer the same solver renders the dye as light on black.
- **Colour you can hear.** Turn on 音 in the header and every ink colour plays a note of the miyako-bushi scale (`lib/sound.ts`).
- **Works as stacked sheets.** Each project is a full-height sheet that settles back as the next is laid on top.
- **Content in one file.** Projects, archive, toolbox and timeline live in `lib/data.ts`.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText) · Lenis · raw WebGL2

## Run it

```bash
npm install
npm run dev
```

Pushing to `master` deploys on Vercel.
