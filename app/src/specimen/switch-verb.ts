import { emitTap } from "./microtaps";

// The hero wordmark verb is swappable: "I build things." → "I design things." …
// Advanced via the command palette (/switch, or typing :switch:). The hero
// listens on SWITCH_EVENT and re-types the new verb.
export const SWITCH_VERBS = ["build", "design", "craft", "ship", "fix", "break"];
export const SWITCH_EVENT = "iw-switch";

let idx = 0;

export function currentVerb(): string {
  return SWITCH_VERBS[idx];
}

export function advanceVerb(): string {
  idx = (idx + 1) % SWITCH_VERBS.length;
  const verb = SWITCH_VERBS[idx];
  window.dispatchEvent(new CustomEvent(SWITCH_EVENT, { detail: verb }));
  emitTap(`verb switched to '${verb}'`);
  return verb;
}
