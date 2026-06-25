// ════════════════════════════════════════════════════════════
// COPY — every user-facing string on the Specimen Sheet, in one
// place. Edit wording here without touching component logic.
//
//   • Plain strings render as-is.
//   • `Seg[]` arrays drive the typewriter / split-italic bits; set
//     `it: true` on a segment to italicise it, `br: true` for a
//     line break (see TypeOnView / renderSegs).
//   • `*Taps` arrays are the rotating quips fired when you tap an
//     otherwise-inert element (see microtaps.tsx).
//
// Structured records (projects, timeline, skills, contacts) live in
// data.ts; feature/easter-egg strings live in site-config.ts.
// ════════════════════════════════════════════════════════════
import type { Seg } from "./motion";

export interface MetaBlock { k: string; v: string; copy?: string; taps?: string[] }
export interface DosierRow { k: string; v: string; copy?: string; taps?: string[]; scrollTo?: string }
export interface KpiStat { label: string; value: string | number; unit: string }
export interface PanelText { title: Seg[]; meta: string }

export const COPY = {
  // ── Startup loader ────────────────────────────────────────
  startup: {
    topLeft: "IMRAN WAFA",
    topRight: "SPECIMEN SHEET · v3",
    wordPre: "I build ",
    wordEm: "things.",
    loading: "LOADING ASSETS",
  },

  // ── Masthead ──────────────────────────────────────────────
  masthead: {
    volume: "Vol. 03 / Iss. 01",
    volumeTaps: ["Vol. 03 — the good one.", "every issue is the first issue.", "no back-issues. sorry."],
    location: "Seattle · 47.6° N",
    locationTaps: ["47.6088° N, 122.3303° W. roughly.", "it's probably raining.", "say hi if you're nearby."],
    greetings: {
      late: ["up late?", "burning the midnight oil?", "go to sleep (jk, stay)"],
      morning: ["good morning", "morning, you", "coffee first?"],
      afternoon: ["good afternoon", "afternoon, friend", "how's the day?"],
      evening: ["good evening", "evening, you", "winding down?"],
    },
    greetTitle: "(tap to re-greet)",
    center: "A SPECIMEN SHEET — IMRAN WAFA",
    centerTaps: ["a type-specimen sheet, but it's a person.", "press / anywhere for the command palette.", "yes, almost everything here is tappable."],
    liveLabel: "Live",
    liveTaps: ["live & deployed. hi from production.", "no, really, this is the live build."],
    time12Msg: "12-hour time",
    time24Msg: "24-hour time",
    timeTitle: "(tap: 12/24h)",
    dateTitle: "(tap to copy)",
  },

  // ── Hero ──────────────────────────────────────────────────
  hero: {
    metaLeft: [
      { k: "SUBJECT", v: "Imran H. Wafa", copy: "Imran H. Wafa" },
      { k: "DISCIPLINE", v: "Software · Data · Design", taps: ["software · data · design — in that order, sometimes.", "i wear all three hats. badly photographed."] },
      { k: "EST.", v: "MMXX", taps: ["MMXX = 2020. been a minute.", "established mid-pandemic. as one does."] },
    ] as MetaBlock[],
    metaRight: [
      { k: "FOLIO N°", v: "001 / 006", taps: ["folio one of six. keep scrolling.", "you are here. roughly."] },
      { k: "EDITION", v: "v0.0.1 · MMXXVI", taps: ["v0.0.1 — still very much zero-point-zero.", "MMXXVI = 2026. yes, already."] },
      { k: "FORMAT", v: "Specimen sheet", taps: ["a type-specimen, but for a person.", "format: printed-page energy, on the web."] },
    ] as MetaBlock[],
    wordmark: [{ text: "I build" }, { br: true }, { text: "things.", className: "it" }] as Seg[],
    wordmarkSub: "— Sometimes I design them too —",
    tagline: [
      { text: "Developer & data analyst. I build software, ship dashboards, and care a lot about the details — " },
      { text: "numbers, pixels, all of it.", className: "tag-em" },
    ] as Seg[],
    dosierLeft: [
      { k: "Currently", v: "Comp Sci, B.S.", taps: ["finishing the degree. slowly but surely.", "B.S. — the science kind, mostly."] },
      { k: "Stack", v: "TS · Python · React", copy: "TypeScript · Python · React" },
      { k: "Lately", v: "AI · automation · craft", taps: ["AI, automation, and sweating the details.", "craft is just caring out loud."] },
      { k: "Homelab", v: "mail · NAS · AI rig", taps: ["self-hosted: a box for SMTP + a couple of APIs, a NAS for storage, and a dedicated AI rig.", "yes, I run my own mail server. on purpose."] },
    ] as DosierRow[],
    dosierRight: [
      { k: "Status", v: "Open to work", taps: ["open to work — let's talk.", "yes, that means you, recruiter."], scrollTo: "contact" },
      { k: "Replies", v: "Within 48h", taps: ["usually faster than 48h, honestly.", "weekends included. it's fine."] },
    ] as DosierRow[],
    coffee: {
      k: "Coffee",
      v: "Black, no sugar",
      title: "(tap for a refill)",
      // {n} is replaced with the current count
      first: "☕ one for you.",
      few: "☕ ×{n} — refilled.",
      many: "☕ ×{n}. easy, tiger.",
      problem: "☕ ×{n}. you have a problem (relatable).",
    },
    kpis: [
      { label: "Projects shipped", value: "", unit: "repos" }, // value filled from data
      { label: "Lines of code", value: "", unit: "k LoC" },
      { label: "Total commits", value: "", unit: "all-time" },
      { label: "GitHub stars", value: "", unit: "★" },
      { label: "Years building", value: "5", unit: "yrs" },
    ] as KpiStat[],
  },

  // ── Scroller (marquee strip) ──────────────────────────────
  scroller: [
    "Now shipping — miLoader v0.4",
    "Reading — The Pragmatic Engineer",
    "Listening — lo-fi & jazz",
    "Currently learning — Rust",
    "Open to collaborations",
    "Based in Seattle, WA",
    "imran@imranwafa.com",
  ],

  // ── Section headers (resume order, top to bottom) ─────────
  sections: {
    about: { num: "§ 01 / DOSSIER", hint: "(it's worth it, I promise)", title: [{ text: "A quick " }, { text: "introduction.", className: "it" }] as Seg[], meta: "SUBJECT FILE" },
    education: { num: "§ 02 / EDUCATION", hint: "(still enrolled, still curious)", title: [{ text: "Where I " }, { text: "studied.", className: "it" }] as Seg[], meta: "ACADEMIC" },
    certs: { num: "§ 03 / CERTS", hint: "(some useful, some framed)", title: [{ text: "Paper " }, { text: "trail.", className: "it" }] as Seg[], meta: "CREDENTIALS" },
    work: { num: "§ 04 / PERSONAL", hint: "(the part where I sell myself)", title: [{ text: "Personal " }, { text: "projects.", className: "it" }] as Seg[] },
    experience: { num: "§ 05 / EXPERIENCE", hint: "(where the rent came from)", title: [{ text: "Where I've " }, { text: "worked.", className: "it" }] as Seg[], meta: "WORK HISTORY" },
    workprojects: { num: "§ 06 / WORK", hint: "(shipped on someone's dime)", title: [{ text: "On the " }, { text: "clock.", className: "it" }] as Seg[], meta: "AVAILABLE ON REQUEST" },
    dash: { num: "§ 07 / METRICS", hint: "(numbers don't lie. mostly.)", title: [{ text: "By the " }, { text: "numbers.", className: "it" }] as Seg[], meta: "DATA · 2020 — 2025" },
    contact: { num: "§ 08 / CORRESPOND", hint: "(i actually reply)", title: [{ text: "Drop a " }, { text: "line.", className: "it" }] as Seg[], meta: "04 CHANNELS · <48H REPLY" },
  },

  // ── Dashboard panels ──────────────────────────────────────
  dash: {
    cadence: { title: [{ text: "Shipping " }, { text: "cadence", className: "it" }] as Seg[], meta: "PROJECTS / YEAR", footShipped: "● shipped", footStarted: "○ started" },
    languages: { title: [{ text: "Languages", className: "it" }, { text: " by share" }] as Seg[], meta: "% OF LoC", foot: "SAMPLED ACROSS 6 ACTIVE REPOS" },
    stack: { title: [{ text: "Stack " }, { text: "usage", className: "it" }] as Seg[], meta: "% OF PROJECTS" },
    activity: { title: [{ text: "Activity", className: "it" }, { text: " · 26 wks" }] as Seg[], meta: "COMMITS", less: "less", more: "more" },
    topics: { title: [{ text: "Topic " }, { text: "cloud", className: "it" }] as Seg[], meta: "WEIGHTED", footIdle: "CLICK A TAG TO FILTER THE PROJECTS ABOVE", footActivePrefix: "filtering projects by ", footActiveSuffix: " · click again to clear" },
    subhead: "§ 01.5 · DEEPER CUTS",
    landscape: { title: [{ text: "Project " }, { text: "landscape", className: "it" }] as Seg[], meta: "LoC × STARS × COMMITS", foot: "BUBBLE SIZE = COMMIT VOLUME · HOVER FOR DETAIL" },
    capability: { title: [{ text: "Capability " }, { text: "profile", className: "it" }] as Seg[], meta: "SELF-ASSESSED", foot: "SIX AXES · NORMALISED 0—100" },
    timeAlloc: { title: [{ text: "Time " }, { text: "allocation", className: "it" }] as Seg[], meta: "TYPICAL WEEK", foot: "EACH CELL = 1% OF FOCUSED HOURS" },
    targets: { title: [{ text: "Annual " }, { text: "targets", className: "it" }] as Seg[], meta: "YTD · MMXXVI", foot: "FOUR METRICS · LIVE-ISH" },
  },

  // ── Work / projects ───────────────────────────────────────
  work: {
    metaTemplate: "{shown} OF {total} ENTRIES · {commits} COMMITS",
    summary: [
      { text: "Six projects, " },
      { text: "{loc}k lines", className: "tag-em" },
      { text: ", " },
      { text: "{commits} commits", className: "tag-em" },
      { text: ". Click a row to expand, a column header to sort, a tag in the cloud above to filter." },
    ] as Seg[],
    filteringPrefix: "filtering by ",
    clearLabel: "clear ×",
    barsLabel: "Stars · click to focus",
    headers: { num: "N°", title: "Title", desc: "Description", loc: "LoC", commits: "Commits", stars: "Stars" },
    emptyPrefix: "No projects match \"",
    emptySuffix: "\". ",
    emptyClear: "clear filter",
    detail: { year: "Year", type: "Type", status: "Status", stack: "Stack", loc: "LoC", commits: "Commits", files: "Files", stars: "Stars", link: "View source ↗" },
  },

  // ── Work projects (placeholder) ───────────────────────────
  workProjects: {
    title: [{ text: "Client & " }, { text: "team work.", className: "it" }] as Seg[],
    body: "Most of my professional work lives behind NDAs and private repos — dashboards, internal tooling, and data pipelines built on the clock. Case studies are available on request.",
    note: "Coming soon",
    cta: "Request the details ↗",
    ctaHref: "mailto:contact@imranwafa.com?subject=Work%20projects",
  },

  // ── About / dossier ───────────────────────────────────────
  about: {
    bio1: [
      { text: "I build things and analyze data, usually at the same time. I care a lot about software that " },
      { text: "actually feels good to use", className: "tag-em" },
      { text: ", not just works. There's a difference and most people skip it." },
    ] as Seg[],
    bio2: [
      { text: "When I'm not at a computer I'm probably tearing down an engine, or automating something that didn't really need automating. Worth it though. I also run a homelab — a server for my own mail and a couple of APIs, a NAS for storage, and an AI rig for local models." },
    ] as Seg[],
    stats: [
      { label: "Years coding", value: "5", unit: "active" },
      { label: "Languages", value: "8", unit: "prod" },
      { label: "Projects", value: "", unit: "public" }, // value filled from data
      { label: "Coffee / day", value: "3.2", unit: "cups" },
    ] as KpiStat[],
    skillCopyTitle: "(tap to copy)",
  },

  // ── Contact ───────────────────────────────────────────────
  contact: {
    display: [{ text: "Send me" }, { br: true }, { text: "something " }, { text: "interesting.", className: "it" }] as Seg[],
    sub: "Open to work · collaborations · long emails about typography",
    numPrefix: "N° ",
  },

  // ── Colophon ──────────────────────────────────────────────
  colophon: {
    name: { v: "Imran Wafa", taps: ["that's me. hi.", "you've reached the bottom. respect."] },
    email: { v: "imran@imranwafa.com", copy: "imran@imranwafa.com", title: "(tap to copy)" },
    github: { v: "github.com/imranhwafa", copy: "github.com/imranhwafa", title: "(tap to copy)" },
    colophonTitle: { v: "Colophon", taps: ["the fine print, lovingly set.", "every site deserves a colophon."] },
    font1: { v: "Set in Space Grotesk", taps: ["Space Grotesk — for the big, confident bits.", "yes, the type is part of the point."] },
    font2: { v: "& JetBrains Mono", taps: ["JetBrains Mono — for the numbers & code.", "monospace makes data feel honest."] },
    copyright: { v: "© MMXXVI", taps: ["MMXXVI. © and all that.", "no rights reserved against curiosity."] },
    visitFirst: ["first time? welcome aboard."],
    visitReturn: ["visit N° {n}. you keep coming back.", "the counter lives in your browser, just so you know."],
    visitPrefix: "Your visit N° ",
    updatedPrefix: "Last updated ",
  },

  // ── Quirks / personality layer ────────────────────────────
  quirks: {
    tabAway: ["← still here.", "← the dots miss you", "← come back"],
    selection: [
      "copying my bio? flattering.",
      "yes, you can quote me on that.",
      "highlighted for emphasis. nice.",
      "that part's my favourite too.",
    ],
    overdriveOn: "overdrive engaged",
    overdriveOff: "overdrive disengaged",
    overdriveBadge: "OVERDRIVE",
    clickCounter: {
      3: "you noticed it's clickable. nice.",
      5: "still clicking? respect.",
      8: "this isn't going to do anything dramatic.",
      12: "okay you're committed now.",
      20: "alright. master clicker. take a badge.",
    } as Record<number, string>,
  },

  // ── Data-viz tap reactions ({…} filled from the datum) ────
  viz: {
    donut: "{label} — {value}% of the code.",
    gauge: "{label}: {value}{unit}. on track.",
    waffle: "{label} — a real slice of the week.",
    heatmap: "{date}: {commits} commits that day.",
    heatmapEmpty: "{date}: a rare day off.",
    radar: "{axis}: {value}/100, self-assessed.",
    bubble: "{label} — {loc}k LoC · {stars}★ · {commits} commits.",
    stat: "{label}: {value}{unit}",
    line: "{label} — {value} that year.",
  },

  // ── Idle screensaver — escalates the longer you sit still ──
  idle: {
    driftHint: "still there? I'll keep the dots warm…",
    deepTitle: "you've gone quiet.",
    deepLines: [
      "so the page kept itself busy.",
      "the dots are pacing without you.",
      "no rush — I'll be right here.",
      "move anything and I'll snap back.",
    ],
    wakeHint: "move to wake",
  },
};
