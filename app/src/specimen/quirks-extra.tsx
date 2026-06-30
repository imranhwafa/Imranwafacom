import { useEffect } from "react";
import { fireRipple } from "./runtime";
import { REDUCED } from "./motion";
import { emitTap } from "./microtaps";

// True when the user is typing into a form field — keyword/key quirks must NOT
// hijack normal typing (e.g. writing "reset"/"end"/"dance" in the contact form).
function inField(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

// The keyword easter eggs (typed into the command palette) live in ./keyword-eggs.

function QuirksGroup1() {
  // 1. CopyPraise: Praises you when you copy text.
  useEffect(() => {
    const onCopy = () => emitTap("Nice copy!");
    document.addEventListener("copy", onCopy);
    return () => document.removeEventListener("copy", onCopy);
  }, []);

  // 2. PasteShout: Shouts when you paste text.
  useEffect(() => {
    const onPaste = () => emitTap("Pasted!");
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, []);

  // 3. SelectAllGasp: Reacts when you select all.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (inField()) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        emitTap("Whoa, that's everything!");
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // 4. PrintPanic: Panics when you try to print.
  useEffect(() => {
    const orig = document.title;
    const onBefore = () => { document.title = "Printing?!"; emitTap("Saving paper, are we?"); };
    const onAfter = () => { document.title = orig; };
    window.addEventListener("beforeprint", onBefore);
    window.addEventListener("afterprint", onAfter);
    return () => {
      window.removeEventListener("beforeprint", onBefore);
      window.removeEventListener("afterprint", onAfter);
      document.title = orig;
    };
  }, []);

  // 5. OfflineSad: Cries when internet drops.
  useEffect(() => {
    const onOff = () => emitTap("Connection lost...");
    window.addEventListener("offline", onOff);
    return () => window.removeEventListener("offline", onOff);
  }, []);

  // 6. OnlineHappy: Cheers when internet returns.
  useEffect(() => {
    const onOn = () => emitTap("We're back online!");
    window.addEventListener("online", onOn);
    return () => window.removeEventListener("online", onOn);
  }, []);

  // 7. TabRapidSwitch: Notices erratic tab switching.
  useEffect(() => {
    let count = 0;
    let last = 0;
    const onVis = () => {
      const now = Date.now();
      if (now - last < 2000) count++;
      else count = 1;
      last = now;
      if (count > 4) { emitTap("Tab surfing?"); count = 0; }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // 8. TripleClickJoy: Celebrates a triple click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.detail === 3) emitTap("Triple tap!");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // 9. KonamiSpace: Spacebar spam creates a ripple.
  useEffect(() => {
    let count = 0;
    let last = 0;
    const onKey = (e: KeyboardEvent) => {
      if (inField()) return;
      if (e.key === " ") {
        const now = Date.now();
        if (now - last < 500) count++;
        else count = 1;
        last = now;
        if (count === 5 && !REDUCED) {
          fireRipple(window.innerWidth / 2, window.innerHeight / 2);
          count = 0;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 10. SecretCodeWafa → see KEYWORD_EGGS (routed through the command palette).

  return null;
}

function QuirksGroup2() {
  // 11. MouseRestBored: Complains if mouse rests too long.
  useEffect(() => {
    let tmr: ReturnType<typeof setTimeout>;
    const onMove = () => {
      clearTimeout(tmr);
      tmr = setTimeout(() => emitTap("Mouse is sleeping..."), 30000);
    };
    window.addEventListener("mousemove", onMove);
    return () => { clearTimeout(tmr); window.removeEventListener("mousemove", onMove); };
  }, []);

  // 12. WindowResizeOops: Notices fast resizing.
  useEffect(() => {
    let count = 0;
    let tmr: ReturnType<typeof setTimeout>;
    const onResize = () => {
      count++;
      clearTimeout(tmr);
      tmr = setTimeout(() => count = 0, 1000);
      if (count > 20) { emitTap("Whoa, dizzy!"); count = 0; }
    };
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(tmr); window.removeEventListener("resize", onResize); };
  }, []);

  // 13. ScrollTopSigh: Mentions hitting the top.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (window.scrollY === 0 && lastY > 100) emitTap("Back to top!");
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 14. ScrollBottomCheer: Cheers hitting the bottom.
  useEffect(() => {
    let fired = false;
    const onScroll = () => {
      if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 10) {
        if (!fired) { emitTap("You made it to the end!"); fired = true; }
      } else fired = false;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 15. ClickMiss: Laughs if you click empty space too much.
  useEffect(() => {
    let count = 0;
    const onClick = (e: MouseEvent) => {
      if (e.target === document.body || (e.target as HTMLElement).tagName === "HTML") {
        count++;
        if (count === 5) { emitTap("Nothing there!"); count = 0; }
      } else count = 0;
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // 16. ShiftClickMagic: Shift+click gives extra ripples.
  useEffect(() => {
    if (REDUCED) return;
    const onClick = (e: MouseEvent) => {
      if (e.shiftKey) {
        setTimeout(() => fireRipple(e.clientX + 20, e.clientY + 20), 100);
        setTimeout(() => fireRipple(e.clientX - 20, e.clientY - 20), 200);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // 17. AltClickPulse: Alt+click gives a delayed ripple.
  useEffect(() => {
    if (REDUCED) return;
    const onClick = (e: MouseEvent) => {
      if (e.altKey) setTimeout(() => fireRipple(e.clientX, e.clientY), 300);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // 18. MetaClickStorm: Meta+click throws a mini storm.
  useEffect(() => {
    if (REDUCED) return;
    const onClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey) {
        for (let i = 1; i <= 3; i++) {
          setTimeout(() => fireRipple(e.clientX + Math.random() * 40 - 20, e.clientY + Math.random() * 40 - 20), i * 150);
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // 19. RightClickConfused: Reacts to context menu.
  useEffect(() => {
    const onCtx = () => emitTap("Looking for source code?");
    document.addEventListener("contextmenu", onCtx);
    return () => document.removeEventListener("contextmenu", onCtx);
  }, []);

  // 20. FastScrollFire: Detects extreme scroll speed.
  useEffect(() => {
    let last = window.scrollY;
    let tmr: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const now = window.scrollY;
      if (Math.abs(now - last) > 1000) {
        clearTimeout(tmr);
        tmr = setTimeout(() => emitTap("Speed demon!"), 100);
      }
      last = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(tmr); window.removeEventListener("scroll", onScroll); };
  }, []);

  return null;
}

function QuirksGroup3() {
  // 21. SlowScrollTurtle: Admires slow reading.
  useEffect(() => {
    let active = 0;
    let tmr: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      active++;
      clearTimeout(tmr);
      tmr = setTimeout(() => active = 0, 200);
      if (active > 150) { emitTap("Taking it all in..."); active = 0; }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(tmr); window.removeEventListener("scroll", onScroll); };
  }, []);

  // 22. HoverImageZoom: Sneakily zooms images slightly on hover.
  useEffect(() => {
    if (REDUCED) return;
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "IMG") t.style.transform = "scale(1.02)";
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "IMG") t.style.transform = "";
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => { document.removeEventListener("mouseover", onOver); document.removeEventListener("mouseout", onOut); };
  }, []);

  // 23. KonamiColor → see KEYWORD_EGGS (routed through the command palette).

  // 24. KeyMashPanic: Complains if mashing keys.
  useEffect(() => {
    let count = 0;
    let tmr: ReturnType<typeof setTimeout>;
    const onKey = () => {
      if (inField()) return;
      count++;
      clearTimeout(tmr);
      tmr = setTimeout(() => count = 0, 1000);
      if (count > 15) { emitTap("Stop mashing!"); count = 0; }
    };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(tmr); window.removeEventListener("keydown", onKey); };
  }, []);

  // 25. IdleNudge: a single gentle toast after a long idle (the page-wide DRIFT/
  // DEEP dimming is already owned by IdleSequence — don't fight it by dimming
  // <body>, which also stacks with other quirks' body styles).
  useEffect(() => {
    let tmr: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(tmr);
      tmr = setTimeout(() => emitTap("Still there?"), 120000);
    };
    window.addEventListener("mousemove", reset, { passive: true });
    window.addEventListener("keydown", reset);
    reset();
    return () => { clearTimeout(tmr); window.removeEventListener("mousemove", reset); window.removeEventListener("keydown", reset); };
  }, []);

  // 26. DragNotice: Notices you dragging things.
  useEffect(() => {
    const onDrag = () => emitTap("Taking that with you?");
    document.addEventListener("dragstart", onDrag);
    return () => document.removeEventListener("dragstart", onDrag);
  }, []);

  // 27. EscapeKeySigh: Reacts to Esc key.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") emitTap("No escape."); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 28. EnterKeyPop: Enter key fires ripple.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !REDUCED && document.activeElement === document.body) {
        fireRipple(window.innerWidth / 2, window.innerHeight / 2);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 29. BackspaceErase: Backspace panic outside inputs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        emitTap("Can't delete the page!");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 30. ScrollDirectionChange: Notices indecision.
  useEffect(() => {
    let last = window.scrollY;
    let dir = 0;
    let flips = 0;
    let tmr: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const now = window.scrollY;
      const ndir = now > last ? 1 : -1;
      if (ndir !== dir) {
        flips++;
        dir = ndir;
        clearTimeout(tmr);
        tmr = setTimeout(() => flips = 0, 2000);
        if (flips > 6) { emitTap("Make up your mind!"); flips = 0; }
      }
      last = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(tmr); window.removeEventListener("scroll", onScroll); };
  }, []);

  return null;
}

function QuirksGroup4() {
  // 31. CursorLeave: Pleads when cursor leaves window.
  useEffect(() => {
    const orig = document.title;
    const onOut = (e: MouseEvent) => { if (!e.relatedTarget && e.clientY <= 0) document.title = "Come back!"; };
    const onIn = () => { document.title = orig; };
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseover", onIn);
    return () => { document.removeEventListener("mouseout", onOut); document.removeEventListener("mouseover", onIn); document.title = orig; };
  }, []);

  // 32. FocusLost: gentle note when the window loses focus.
  // NOTE: do NOT put `filter`/`transform` on <body> — it establishes a containing
  // block and breaks every position:fixed element (crosshair, toasts, aurora).
  useEffect(() => {
    const onBlur = () => emitTap("Don't be long...");
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  // 33. ClickCountMilestone: Celebrates 100 clicks.
  useEffect(() => {
    let c = 0;
    const onClick = () => { c++; if (c === 100) emitTap("100 clicks!"); };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // 34. KeyPressMilestone: Celebrates 100 keystrokes.
  useEffect(() => {
    let c = 0;
    const onKey = () => { c++; if (c === 100) emitTap("100 keys pressed!"); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // 35. ScrollDistanceMilestone: Celebrates scrolling marathon.
  useEffect(() => {
    let dist = 0;
    let last = window.scrollY;
    const onScroll = () => {
      dist += Math.abs(window.scrollY - last);
      last = window.scrollY;
      if (dist > 50000) { emitTap("Marathon scroller!"); dist = -9999999; }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 37. KonamiReset / 38. EndReached / 39. KonamiDance → see KEYWORD_EGGS
  //     (routed through the command palette).

  // 40. TabKeyCycle: Complains about tab cycling too much.
  useEffect(() => {
    let count = 0;
    let tmr: ReturnType<typeof setTimeout>;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        count++;
        clearTimeout(tmr);
        tmr = setTimeout(() => count = 0, 2000);
        if (count > 10) { emitTap("Tabbing a lot?"); count = 0; }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(tmr); window.removeEventListener("keydown", onKey); };
  }, []);

  return null;
}

function QuirksGroup5() {
  // 41. CapsLockWarning: Warns if capslock is on.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (inField()) return;
      if (e.getModifierState && e.getModifierState("CapsLock")) {
        if (e.key.length === 1 && /[A-Z]/.test(e.key)) emitTap("NO NEED TO YELL");
      }
    };
    window.addEventListener("keyup", onKey);
    return () => window.removeEventListener("keyup", onKey);
  }, []);

  // 42. RandomConsoleJoke: Prints a joke.
  useEffect(() => {
    const jokes = ["Why do programmers prefer dark mode? Because light attracts bugs.", "I would tell you a UDP joke, but you might not get it."];
    const tmr = setTimeout(() => console.log(jokes[Math.floor(Math.random() * jokes.length)]), 15000);
    return () => clearTimeout(tmr);
  }, []);

  // 43. KonamiMatrix → see KEYWORD_EGGS (routed through the command palette).

  // 44. MouseShakeDizzy: Complains about erratic mouse shaking.
  useEffect(() => {
    let lastX = 0;
    let flips = 0;
    let dir = 0;
    let tmr: ReturnType<typeof setTimeout>;
    const onMove = (e: MouseEvent) => {
      const ndir = e.clientX > lastX ? 1 : -1;
      if (ndir !== dir) {
        flips++;
        dir = ndir;
        clearTimeout(tmr);
        tmr = setTimeout(() => flips = 0, 500);
        if (flips > 12) { emitTap("I'm getting dizzy!"); flips = 0; }
      }
      lastX = e.clientX;
    };
    window.addEventListener("mousemove", onMove);
    return () => { clearTimeout(tmr); window.removeEventListener("mousemove", onMove); };
  }, []);

  // 45. ZoomSquint: Detects zoom level change.
  useEffect(() => {
    let last = window.devicePixelRatio;
    const onResize = () => {
      const now = window.devicePixelRatio;
      if (now !== last && Math.abs(now - last) > 0.1) {
        emitTap(now > last ? "Squinting?" : "Stepping back?");
        last = now;
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 46. KonamiHello → see KEYWORD_EGGS (routed through the command palette).

  // 47. ClickHoldSwell: Warns on long mousedown.
  useEffect(() => {
    let tmr: ReturnType<typeof setTimeout>;
    const onDown = () => { tmr = setTimeout(() => emitTap("Holding on tightly?"), 2000); };
    const onUp = () => clearTimeout(tmr);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => { clearTimeout(tmr); window.removeEventListener("mousedown", onDown); window.removeEventListener("mouseup", onUp); };
  }, []);

  // 48. DoubleClickSelect: Toast when double clicking to select.
  useEffect(() => {
    const onDbl = () => {
      const s = window.getSelection()?.toString();
      if (s && s.length > 0) emitTap("Highlighting!");
    };
    document.addEventListener("dblclick", onDbl);
    return () => document.removeEventListener("dblclick", onDbl);
  }, []);

  // 49. TimeNoon: Checks if it's noon.
  useEffect(() => {
    const check = () => {
      const d = new Date();
      if (d.getHours() === 12 && d.getMinutes() === 0) emitTap("Lunch time!");
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, []);

  // 50. TimeMidnight: Checks if it's midnight.
  useEffect(() => {
    const check = () => {
      const d = new Date();
      if (d.getHours() === 0 && d.getMinutes() === 0) emitTap("Spooky hour!");
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, []);

  return null;
}

export function QuirksExtra() {
  return (
    <>
      <QuirksGroup1 />
      <QuirksGroup2 />
      <QuirksGroup3 />
      <QuirksGroup4 />
      <QuirksGroup5 />
    </>
  );
}
