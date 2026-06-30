// Keyword easter eggs — triggered by typing the word into the command palette and
// hitting Enter. A global keydown listener can't catch these: the palette opens on
// the very first letter and grabs keyboard focus, so it always owns the rest of the
// word. The palette (features.tsx) runs these on an exact-match query.
import { emitTap } from "./microtaps";
import { REDUCED } from "./motion";

export const KEYWORD_EGGS: Record<string, () => void> = {
  wafa: () => emitTap("You found my name!"),
  color: () => {
    document.documentElement.style.setProperty("--accent", `oklch(0.6 0.2 ${Math.floor(Math.random() * 360)})`);
    emitTap("Color shifted!");
  },
  reset: () => emitTap("Nothing to reset here."),
  end: () => emitTap("The End."),
  hello: () => emitTap("Hi there!"),
  matrix: () => { console.log("Follow the white rabbit."); emitTap("Check console."); },
  dance: () => {
    emitTap("Dance break!");
    if (REDUCED) return;
    // A brief, self-restoring jiggle. `transform` on <body> establishes a
    // containing block (shifts fixed elements) but only for 400ms, then clears.
    document.body.style.transition = "transform 0.2s";
    document.body.style.transform = "rotate(1deg)";
    setTimeout(() => { document.body.style.transform = "rotate(-1deg)"; }, 200);
    setTimeout(() => { document.body.style.transform = "none"; document.body.style.transition = ""; }, 400);
  },
};
