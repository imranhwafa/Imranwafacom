// Site configuration for the Specimen Sheet portfolio.
// Ported verbatim from the Claude Design handoff (site-config.js).

export interface SiteConfig {
  personal: {
    name: string;
    firstName: string;
    logo: string;
    tagline: string;
    email: string;
    github: string;
    githubHandle: string;
  };
  socialLinks: { platform: string; url: string }[];
  idleMessages: string[];
  scrollQuirks: {
    speedWarnings: string[];
    bottomMessages: string[];
  };
  tldr: {
    title: string;
    unlockMessage: string;
    summaryText: string;
    items: { label: string; value: string }[];
    backText: string;
    footerHint: string;
  };
  commandPalette: {
    placeholder: string;
    hintTyping: string;
    hintKeys: string;
    phone: string;
    statsHeading: string;
    secretHeading: string;
    secretFoundText: string;
    txtHeading: string;
    txtChatLink: string;
    backText: string;
    commandDescriptions: Record<string, string>;
    secretSections: {
      commands: string;
      shortcuts: string;
      hidden: string;
      shortcutItems: { key: string; desc: string }[];
      hiddenItems: { key: string; desc: string }[];
    };
  };
  easterEgg: {
    consoleGreeting: string;
    consoleMessage: string;
    consoleTech: string;
    consoleRecruiter: string;
    overlayTitle: string;
    overlayMessage: string;
    overlayButtonText: string;
  };
}

export const SITE: SiteConfig = {
  personal: {
    name: "Imran Wafa",
    firstName: "Imran",
    logo: "IW",
    tagline: "i build things. sometimes i design them too.",
    email: "contact@imranwafa.com",
    github: "https://github.com/imranhwafa",
    githubHandle: "imranhwafa",
  },
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/imranhwafa" },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/imran-w-9741082a3" },
    { platform: "Email", url: "mailto:contact@imranwafa.com" },
  ],
  idleMessages: [
    "still here? i appreciate the company.",
    "you've been staring at this page for a while… everything okay?",
    "i'm flattered you're still here, but maybe go outside?",
    "fun fact: you've now spent more time here than i spent on some of these features.",
    "if you're waiting for something to happen… this is it.",
    "you know, most people leave by now. you're built different.",
    "at this point we're basically friends.",
    "the longer you stay, the more easter eggs you might find…",
    "plot twist: the real portfolio was the idle time we spent together.",
    "i'm running out of things to say. but i won't leave if you won't.",
  ],
  scrollQuirks: {
    speedWarnings: [
      "slow down, you're missing the good stuff.",
      "this isn't a race.",
      "speedrun any% portfolio reading?",
    ],
    bottomMessages: [
      "you made it to the bottom. completionist energy.",
      "that's everything. or is it?",
      "100% scroll completion unlocked.",
    ],
  },
  tldr: {
    title: "/tldr",
    unlockMessage: "you unlocked this by skipping everything. impressive.",
    summaryText: "here's the whole site in 30 seconds since you're clearly in a rush.",
    items: [
      { label: "what", value: "builds web apps, automates things, analyzes data." },
      { label: "stack", value: "typescript, react, python, node, tailwind, figma." },
      { label: "vibe", value: "pixel-perfect UIs, clean code, automates things that don't need automating." },
      { label: "status", value: "comp sci student. building things. always shipping." },
    ],
    backText: "back to the full site",
    footerHint: "maybe read the real thing next time?",
  },
  commandPalette: {
    placeholder: "type a command...",
    hintTyping: "just start typing anywhere",
    hintKeys: "enter to run · esc to close",
    phone: "+1 (253) 292-4570",
    statsHeading: "your stats",
    secretHeading: "all secrets",
    secretFoundText: "you found the master list. nice.",
    txtHeading: "get in touch",
    txtChatLink: "or jump to the contact section →",
    backText: "← back",
    commandDescriptions: {
      stats: "your browsing stats for this site",
      tldr: "the whole site in 30 seconds",
      txt: "send me a message + phone number",
      email: "open email directly",
      secret: "all hidden commands & shortcuts",
      home: "go back to home",
      about: "learn about me",
      projects: "see what i've built",
      github: "view my github",
      linkedin: "connect on linkedin",
      clear: "close this prompt",
    },
    secretSections: {
      commands: "type commands",
      shortcuts: "keyboard shortcuts",
      hidden: "hidden behaviors",
      shortcutItems: [
        { key: "ctrl/cmd + u", desc: "view source easter egg" },
        { key: "ctrl/cmd + i", desc: "view source easter egg" },
      ],
      hiddenItems: [
        { key: "skip 3 sections", desc: "unlocks /tldr page" },
        { key: "scroll too fast", desc: "speed reader warning" },
        { key: "idle 2 minutes", desc: "idle messages appear" },
        { key: "reach bottom", desc: "completionist message" },
        { key: "click name 3x+", desc: "click counter easter egg" },
        { key: "↑↑↓↓←→←→BA", desc: "disco mode" },
        { key: "toggle theme 2x+", desc: "theme commitment issues" },
        { key: "filter 5x+", desc: "indecision detector" },
        { key: "leave the tab", desc: "the title gets lonely" },
      ],
    },
  },
  easterEgg: {
    consoleGreeting: "Hey there, curious dev!",
    consoleMessage: "Looking at my code? No worries — it's all open source.",
    consoleTech: "Built with React + Vite + a lot of coffee.",
    consoleRecruiter: "If you're a recruiter… yes, I wrote this myself.",
    overlayTitle: "Peeking at my code?",
    overlayMessage: "No worries — it's all open source. Check out the full repo below.",
    overlayButtonText: "View on GitHub",
  },
};
