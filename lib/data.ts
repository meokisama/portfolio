export const SITE = {
  name: "Meoki",
  fullName: "Hoàng Đình Sáng",
  title: "Meoki · 音を見て、色を聴く",
  description:
    "Portfolio of Meoki (Hoàng Đình Sáng), a software engineer in Ho Chi Minh City working somewhere between language, light and code.",
  url: "https://meoki.vn",
  email: "hi@meoki.vn",
};

export const SOCIALS = [
  { label: "GitHub", handle: "@meokisama", href: "https://github.com/meokisama" },
  { label: "X / Twitter", handle: "@meokiiii", href: "https://twitter.com/meokiiii" },
  { label: "Instagram", handle: "@meokisama", href: "https://www.instagram.com/meokisama/" },
  { label: "Facebook", handle: "slytherinnn", href: "https://www.facebook.com/slytherinnn" },
  { label: "Discord", handle: "meoki", href: "https://discordapp.com/users/462097156455661568" },
];

export const NAV = [
  { label: "Works", jp: "作品", href: "#works" },
  { label: "About", jp: "自己紹介", href: "#about" },
  { label: "Path", jp: "道のり", href: "#path" },
  { label: "Contact", jp: "連絡", href: "#contact" },
];

export type WorkArt = "gloss" | "matrix";

export interface Work {
  slug: string;
  numeral: string;
  title: string;
  jp?: string;
  kind: string;
  year: string;
  tagline: string;
  body: string;
  stack: string[];
  links: { label: string; href: string }[];
  image?: { src: string; width: number; height: number; alt: string };
  art?: WorkArt;
  /** card ground, text, and the wash behind the picture */
  theme: { bg: string; fg: string; wash: string; dark?: boolean };
}

export const WORKS: Work[] = [
  {
    slug: "aozora",
    numeral: "壱",
    title: "Aozora",
    jp: "青空",
    kind: "Desktop app",
    year: "2026",
    tagline: "An EPUB reader made for people learning Japanese.",
    body: "Hover a word and a Yomitan dictionary opens. One click sends it to Anki. VOICEVOX reads the page aloud while a karaoke highlight follows along, in vertical text if you like it the way it was printed.",
    stack: ["Electron", "React", "TypeScript", "SQLite"],
    links: [
      { label: "Source", href: "https://github.com/meokisama/aozora" },
      { label: "Web edition", href: "https://hub.lightnovel.vn/reader" },
    ],
    image: { src: "/works/aozora.webp", width: 1600, height: 918, alt: "Aozora library view with a shelf of Japanese light novels" },
    theme: { bg: "#dbe7f1", fg: "#12202e", wash: "#8fb9de" },
  },
  {
    slug: "moe2d",
    numeral: "弐",
    title: "moe2d",
    kind: "Open-source library",
    year: "2026",
    tagline: "Live2D characters that live on your web pages.",
    body: "One install and a model file. The Cubism core and shaders ship inside the package, so there is no PixiJS and nothing to copy. Characters idle, follow the pointer, react to taps and lip-sync to any audio.",
    stack: ["TypeScript", "WebGL", "React", "npm"],
    links: [
      { label: "Playground", href: "https://moe.meoki.vn" },
      { label: "Source", href: "https://github.com/meokisama/moe2d" },
    ],
    image: { src: "/works/moe2d.webp", width: 1600, height: 900, alt: "The moe2d playground showing a Live2D character and its controls" },
    theme: { bg: "#f1e1ee", fg: "#2d1436", wash: "#d79bd6" },
  },
  {
    slug: "gloss",
    numeral: "参",
    title: "Gloss",
    kind: "Tray app",
    year: "2026",
    tagline: "Select text anywhere. Press a hotkey. Read it in your language.",
    body: "A tiny tray app with three shortcuts: read a translation beside your cursor, write in a language you are still learning, or have a term explained. It works in any app and with any AI provider, cloud or local.",
    stack: ["Tauri 2", "Rust", "React"],
    links: [{ label: "Source", href: "https://github.com/meokisama/gloss" }],
    art: "gloss",
    theme: { bg: "#17140f", fg: "#f3efe6", wash: "#e2421f", dark: true },
  },
  {
    slug: "ranobe-giveaway",
    numeral: "肆",
    title: "Giveaway Booster",
    kind: "Event site",
    year: "2026",
    tagline: "A light novel quiz, dealt out of a booster pack.",
    body: "A light novel trivia contest whose whole site is a pack of trading cards. Scroll to tear the foil open, then flip through the rules, the prizes and a playable sample quiz.",
    stack: ["Next.js", "Three.js", "GSAP", "Lenis", "Tailwind"],
    links: [{ label: "Visit", href: "https://ga.ranobe.vn" }],
    image: { src: "/works/ranobe-giveaway.webp", width: 1600, height: 900, alt: "Ranobe Giveaway Booster home page: the title in chunky cyan, yellow and pink letters beside a holographic booster pack on a pastel sunburst" },
    theme: { bg: "#fbdde9", fg: "#35101f", wash: "#ff5fa8" },
  },
  {
    slug: "bxh-lnvn",
    numeral: "伍",
    title: "Light Novel Ranking",
    kind: "Community ranking",
    year: "2026",
    tagline: "Vietnam's light novel readers, and every ballot is a page.",
    body: "A reader-voted ranking running since 2018, built with Zennomi and set as a bound book: paper, ink and one vermilion. A linen hardback lies beside the title; scroll and it opens on the table, turning one leaf per place, each spread a cover plate and its entry. The full results turn on a wheel of covers above a podium.",
    stack: ["Next.js", "Three.js", "Motion", "Lenis", "Tailwind"],
    links: [{ label: "Visit", href: "https://bxh.lightnovel.vn" }],
    image: { src: "/works/bxh-lnvn.webp", width: 1600, height: 900, alt: "Bảng Xếp Hạng Light Novel Việt Nam home page: the title on warm paper beside a linen hardback with a vermilion spine label, and pale light novel covers drifting behind" },
    theme: { bg: "#f1ebde", fg: "#16120e", wash: "#d6361b" },
  },
  {
    slug: "tmw-archive",
    numeral: "陸",
    title: "TMW Archive",
    jp: "書庫",
    kind: "Community library",
    year: "2026",
    tagline: "The books are on the shelf. The key is on Discord.",
    body: "A members-only library of Japanese light novels and manga for the TMW community. There is no account to make: ring the bell in Discord, a bot hands you a one-hour key, and a Live2D librarian keeps the desk while you search.",
    stack: ["Next.js", "Express", "PostgreSQL", "Meilisearch", "discord.js"],
    links: [{ label: "Members only", href: "https://books.tmw.moe" }],
    image: { src: "/works/tmw-archive-library.webp", width: 1600, height: 900, alt: "TMW Archive library page: a grid of Japanese light novel covers with the Live2D librarian in the corner" },
    theme: { bg: "#e3ead9", fg: "#16240f", wash: "#8fb36a" },
  },
  {
    slug: "ranobe-hub",
    numeral: "漆",
    title: "Ranobe Hub",
    kind: "Web platform",
    year: "2025",
    tagline: "One tidy shelf for every light novel I get asked to share.",
    body: "People kept asking for books and passing files around one by one got tiring. Now there is a shelf to browse, set like a Japanese paperback: paper, ink and one vermilion seal. The newest arrivals float in a WebGL ring over marbled suminagashi ink, and every title opens straight in the browser through the web port of Aozora.",
    stack: ["Next.js", "Three.js", "Express", "MongoDB"],
    links: [
      { label: "Visit", href: "https://hub.ranobe.vn" },
      { label: "Source", href: "https://github.com/meokisama/ranobe-hub" },
    ],
    image: { src: "/works/ranobe-hub.webp", width: 1600, height: 904, alt: "Ranobe Hub home page: light novel covers floating as 3D books over marbled paper, beside the Ranobe Hub wordmark" },
    theme: { bg: "#f6e3d0", fg: "#2e1a0b", wash: "#f0a560" },
  },
  {
    slug: "ranobe-blog",
    numeral: "捌",
    title: "Ranobe Blog",
    kind: "Publication",
    year: "2024",
    tagline: "A quiet corner of the internet for light-novel thoughts.",
    body: "Long-form reviews, essays and interviews in Vietnamese, laid out like a small magazine. Statically generated from MDX written in an in-browser CMS. The home page opens on a ring of covers you can spin, drawn in WebGL, and Ctrl+K searches every word of every post.",
    stack: ["Next.js", "MDX", "Keystatic", "Three.js", "Tailwind"],
    links: [
      { label: "Read", href: "https://ranobe.vn" },
      { label: "Source", href: "https://github.com/meokisama/ranobe-blog" },
    ],
    image: { src: "/works/ranobe-blog-light.webp", width: 1600, height: 908, alt: "Ranobe Blog home page: a ring of light novel covers orbiting the Ranobe wordmark" },
    theme: { bg: "#efe9d3", fg: "#26220f", wash: "#d9c26a" },
  },
  {
    slug: "toolkit-engine",
    numeral: "玖",
    title: "Toolkit Engine",
    kind: "Industrial software",
    year: "2025",
    tagline: "The control desk for buildings that think.",
    body: "A souvenir from a previous job: a desktop app for commissioning GNT room-control units, where lighting, air-conditioning, curtains, scenes and schedules are configured and monitored live. Its sibling, Rhythm Glow, turns music into colour and sends it down the same wire.",
    stack: ["Electron", "React", "UDP", "Microsoft Store"],
    links: [
      { label: "Source", href: "https://github.com/meokisama/toolkit-engine" },
      { label: "Rhythm Glow", href: "https://github.com/meokisama/rhythm-glow" },
    ],
    art: "matrix",
    theme: { bg: "#131b33", fg: "#e9edf7", wash: "#3d6bff", dark: true },
  },
];

export interface ArchiveItem {
  name: string;
  note: string;
  lang: string;
  year: string;
  stars?: number;
  href: string;
}

export const ARCHIVE: ArchiveItem[] = [
  { name: "Meoki Toolkit", note: "Ten small utilities in one Chrome popup", lang: "TypeScript", year: "2026", href: "https://github.com/meokisama/meoki-toolkit" },
  { name: "Rhythm Glow", note: "Sound spectrum to RGB light strips, in real time", lang: "JavaScript", year: "2025", href: "https://github.com/meokisama/rhythm-glow" },
  { name: "SmartThings Drivers", note: "Edge drivers for the devices at home", lang: "Lua", year: "2025", href: "https://github.com/meokisama/SmartThings" },
  { name: "Reinforcement Learning", note: "Q-learning and Sarsa for robot path planning", lang: "Python", year: "2023", stars: 3, href: "https://github.com/meokisama/Reinforcement-Learning" },
  { name: "Django CTF", note: "A capture-the-flag platform with a clean face", lang: "Django", year: "2022", stars: 4, href: "https://github.com/meokisama/DjangoCTF" },
  { name: "Butterfly Effect", note: "A double pendulum from Lagrangian mechanics", lang: "Python", year: "2021", stars: 3, href: "https://github.com/meokisama/butterflyeffect" },
  { name: "Flappy AI", note: "NEAT neuroevolution learns to fly", lang: "Python", year: "2021", stars: 1, href: "https://github.com/meokisama/flappyAI" },
  { name: "VS Code Menu", note: "Open-in-Code for the Nautilus context menu", lang: "Python", year: "2021", stars: 5, href: "https://github.com/meokisama/vscodemenu" },
  { name: "Login Forms", note: "A collection of sign-in screens", lang: "HTML", year: "2020", stars: 25, href: "https://github.com/meokisama/login-form" },
  { name: "GitHub Profile", note: "Self-updating with music, anime and code stats", lang: "Actions", year: "2020", stars: 26, href: "https://github.com/meokisama/meokisama" },
];

export const TOOLBOX = [
  { title: "Languages", jp: "言語", items: ["TypeScript", "JavaScript", "Rust", "Python", "C / C++", "Lua"] },
  { title: "Interface", jp: "画面", items: ["React", "Next.js", "Tailwind", "GSAP", "WebGL", "shadcn/ui"] },
  { title: "Desktop & systems", jp: "基盤", items: ["Electron", "Tauri", "Node.js", "PostgreSQL", "Prisma", "Docker"] },
  { title: "Design", jp: "意匠", items: ["Figma", "Photoshop", "Illustrator", "Lightroom", "After Effects"] },
];

export const MARQUEE = [
  ["TypeScript", "Electron", "React", "Rust", "Next.js", "WebGL"],
  ["Figma", "Tauri", "Node.js", "GSAP", "Python", "Tailwind"],
];

export const PATH = [
  {
    year: "2016",
    title: "Freelance graphic designer",
    body: "The first creations turned into the first cash. Every stumble since has been paving the same road.",
  },
  {
    year: "2019",
    title: "University of Information Technology, VNU-HCM",
    body: "Four years of security, malware and networks. Web development crept in on the side and never left.",
  },
  {
    year: "2023",
    title: "Cybersecurity engineering intern, then graduate",
    body: "Theory met production. Left with a degree and a preference for building things over breaking them.",
  },
  {
    year: "2024",
    title: "Software engineer, full-stack",
    body: "A real job, with real deadlines. Desktop apps that talked to actual hardware, and shipping taught me what lectures could not.",
  },
  {
    year: "Now",
    title: "Full-stack web, and open source after hours",
    body: "Shareholder value by day. By night Aozora, moe2d, Gloss: tools for the things I love, Japanese, light novels, and software that feels alive.",
  },
];
