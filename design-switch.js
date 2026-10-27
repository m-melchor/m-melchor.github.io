// The design switch: Desktop, Classic and Paper are one site in three designs.
// Each design renders its own <a data-design="..."> links; this points each one at the same page in that design.
(() => {
  const ROOTS = { desktop: "/", classic: "/preview/", paper: "/paper/" };
  // The pages each design gives their own address inside a section
  const JOBS = ["halliburton", "halliburton-2025", "national-glass", "monarch", "amar", "hacienda"];
  const LEAD = ["shpe", "deans-committee", "scouting", "own-two-feet"];
  const ENG = ["research", "coursework", "junior-design", "gear-train"];
  const SVC = ["sites", "apps", "ai", "care"];
  const SUBS = {
    classic: {
      apollo: ["product", "engineering", "privacy", "shops", "business", "constraints"],
      services: ["start", ...SVC, "hourly", "terms"],
      about: ["now", "story", "off-the-clock"],
      engineering: ENG,
      experience: JOBS,
      leadership: LEAD,
      hobbies: ["automotive", "hiking", "skiing", "and-the-rest"],
    },
    paper: { experience: JOBS, leadership: LEAD, engineering: ENG, services: SVC },
  };
  // Old names for a part, and the part that holds them now
  const SAME = { path: "story", roots: "story", like: "story", running: "and-the-rest", orchestra: "and-the-rest" };

  const where = () => {
    const path = location.pathname;
    const from = path.startsWith("/preview/") ? "classic" : path.startsWith("/paper/") ? "paper" : "desktop";
    let [top, sub] = path.slice(ROOTS[from].length).split("/").filter(Boolean);
    if (location.hash && (from === "desktop" || top === "apollo" || (from === "classic" && !(top in SUBS.classic)))) sub = location.hash.slice(1);
    // Same place, different names
    if (top === "about" && sub === "hobbies") [top, sub] = ["hobbies", undefined];
    if (top === "own-two-feet") [top, sub] = ["leadership", "own-two-feet"];
    return { from, top, sub };
  };

  const to = (d, { top, sub }) => {
    if (!top) return ROOTS[d];
    if (d === "paper" && top === "hobbies") return "/paper/about/hobbies/";
    if (!sub) return `${ROOTS[d]}${top}/`;
    if (d === "desktop") return `/${top}/#${sub}`;
    if (d === "paper" && top === "apollo") return `/paper/apollo/#${sub}`;
    // A part this design has no page for lands on its section
    const list = SUBS[d][top];
    if (!list) return `${ROOTS[d]}${top}/${d === "classic" ? `#${sub}` : ""}`;
    const s = SAME[sub] ?? sub;
    return list.includes(s) ? `${ROOTS[d]}${top}/${s}/` : `${ROOTS[d]}${top}/`;
  };

  // Recomputed on every look, so pages that change without reloading (Desktop, Apollo tabs) stay right
  const set = () => {
    const w = where();
    document.querySelectorAll("a[data-design]").forEach((a) => {
      a.href = to(a.dataset.design, w);
      if (a.dataset.design === w.from) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };
  set();
  ["pointerover", "focusin", "pointerdown"].forEach((t) => addEventListener(t, (e) => e.target.closest?.("a[data-design]") && set(), true));

  // First visit only: a small card under the switch that shows the three designs
  const KEY = "mm-designs-seen";
  const seen = () => {
    try {
      return localStorage.getItem(KEY) === "1";
    } catch {
      return true;
    }
  };
  const remember = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };
  addEventListener("pointerdown", (e) => e.target.closest?.("a[data-design]") && remember(), true);
  if (seen()) return;

  const LOOKS = [
    ["desktop", "Desktop", "Windows you can move around"],
    ["classic", "Classic", "Clean pages, one story each"],
    ["paper", "Paper", "A newspaper front page"],
  ];
  const CSS = `
.ds-tour{--bg:#000;--fg:#fff;--rim:rgb(255 255 255/.22);position:fixed;z-index:9999;width:min(460px,calc(100vw - 32px));padding:20px;border:1px solid var(--rim);border-radius:18px;background:var(--bg);color:var(--fg);box-shadow:0 24px 70px rgb(0 0 0/.55);font-family:inherit;font-size:15px;line-height:1.45;text-align:left;opacity:0;translate:0 8px;transition:opacity .22s ease-out,translate .3s cubic-bezier(.2,.8,.2,1)}
.ds-tour[data-in]{opacity:1;translate:0 0}
.ds-tour[data-look=paper]{--bg:#fbf9f4;--fg:#111;--rim:rgb(0 0 0/.25);box-shadow:0 20px 60px rgb(0 0 0/.22)}
.ds-tour::before{content:"";position:absolute;top:-7px;left:var(--caret,50%);width:12px;height:12px;margin-left:-6px;border:1px solid var(--rim);border-right:0;border-bottom:0;background:var(--bg);rotate:45deg}
.ds-tour[data-at=bottom]::before{display:none}
.ds-tour h2{margin:0;font-size:20px;font-weight:700;line-height:1.2;letter-spacing:-.01em;color:var(--fg)}
.ds-tour>p{margin:6px 0 0;color:var(--fg)}
.ds-tour ul{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:16px 0 0;padding:0;list-style:none}
.ds-tour li a{display:grid;gap:6px;color:var(--fg);text-decoration:none}
.ds-tour img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;object-position:top;border:1px solid var(--rim);border-radius:10px;transition:border-color .2s}
.ds-tour a:hover img,.ds-tour a:focus-visible img,.ds-tour a[aria-current] img{border-color:var(--fg)}
.ds-tour a[aria-current] img{outline:2px solid var(--fg);outline-offset:2px}
.ds-tour b{font-size:14px;font-weight:700}
.ds-tour small{display:block;font-size:12px;line-height:1.3}
.ds-tour .ds-ok{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:16px}
.ds-tour .ds-ok span{font-size:13px}
.ds-tour button{flex:none;min-height:40px;padding:0 20px;border:1px solid var(--fg);border-radius:999px;background:var(--fg);color:var(--bg);font:inherit;font-weight:700;font-size:14px;cursor:pointer}
@media (max-width:420px){.ds-tour small{display:none}.ds-tour{padding:16px}}
@media (prefers-reduced-motion:reduce){.ds-tour{transition:opacity .2s;translate:none}}`;

  const show = () => {
    const here = where().from;
    const box = document.createElement("aside");
    box.className = "ds-tour";
    box.dataset.look = here;
    box.setAttribute("aria-labelledby", "ds-tour-h");
    box.innerHTML = `<style>${CSS}</style><h2 id="ds-tour-h">Check out my site in 3 styles</h2><p>Same pages, same story. Pick the one you like.</p><ul>${LOOKS.map(
      ([id, name, line]) =>
        `<li><a data-design="${id}" href="${ROOTS[id]}"><img src="/images/designs/${id}.jpg" alt="" width="640" height="400"><span><b>${name}</b><small>${id === here ? "You're here" : line}</small></span></a></li>`,
    ).join("")}</ul><div class="ds-ok"><span></span><button type="button">Got it</button></div>`;
    document.body.append(box);
    set();
    remember();

    // Sit under the switch you can see, pointing at it; with none in view, sit at the bottom
    const place = () => {
      const sw = [...document.querySelectorAll(".design-switch")]
        .map((n) => n.getBoundingClientRect())
        .find((r) => r.width && r.top >= 0 && r.bottom < innerHeight * 0.5);
      const w = box.offsetWidth;
      const fits = sw && sw.bottom + 14 + box.offsetHeight < innerHeight - 16;
      box.dataset.at = fits ? "switch" : "bottom";
      box.querySelector(".ds-ok span").textContent = fits ? "Switch anytime up here." : "Switch anytime at the top of any page.";
      const left = fits ? Math.min(Math.max(sw.right - w, 16), innerWidth - 16 - w) : (innerWidth - w) / 2;
      box.style.left = left + "px";
      box.style.top = fits ? sw.bottom + 14 + "px" : "";
      box.style.bottom = fits ? "" : "16px";
      if (fits) box.style.setProperty("--caret", Math.min(Math.max(sw.left + sw.width / 2 - left, 24), w - 24) + "px");
    };
    place();
    requestAnimationFrame(() => (box.dataset.in = ""));

    const close = () => {
      removeEventListener("resize", place);
      removeEventListener("keydown", esc);
      removeEventListener("pointerdown", outside, true);
      box.remove();
    };
    const esc = (e) => e.key === "Escape" && close();
    const outside = (e) => !box.contains(e.target) && close();
    addEventListener("resize", place);
    addEventListener("keydown", esc);
    addEventListener("pointerdown", outside, true);
    box.querySelector("button").addEventListener("click", close);
    box.querySelector(`a[data-design="${here}"]`).addEventListener("click", (e) => (e.preventDefault(), close()));
  };
  setTimeout(show, 900);
})();
