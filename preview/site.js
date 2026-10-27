// Preview behavior: the phone menu, the M2 build pins, and gentle entrances.
document.documentElement.classList.add("js");

const menuBtn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
if (menuBtn && menu) {
  const set = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelector("span").textContent = open ? "Close" : "Menu";
    document.body.classList.toggle("menu-open", open);
  };
  menuBtn.addEventListener("click", () => set(menu.hidden));
  addEventListener("keydown", (e) => e.key === "Escape" && !menu.hidden && set(false));
  matchMedia("(min-width: 1100px)").addEventListener("change", (e) => e.matches && set(false));
}

const tagBtn = document.querySelector("[data-pins]");
if (tagBtn) {
  const fig = document.querySelector(".tagged");
  const legend = document.querySelector(".legend");
  tagBtn.addEventListener("click", () => {
    const on = !fig.classList.contains("on");
    fig.classList.toggle("on", on);
    legend?.classList.toggle("show", on);
    tagBtn.setAttribute("aria-pressed", String(on));
    tagBtn.textContent = on ? "Hide the parts" : "Show the parts";
  });
}

// Carousels: swipe on a phone, or Previous and Next, with the count kept in step
const still = matchMedia("(prefers-reduced-motion: reduce)");
document.querySelectorAll("[data-car]").forEach((car) => {
  const track = car.querySelector(".car-track");
  const slides = [...track.children];
  const [prev, next] = car.querySelectorAll(".car-btn");
  const count = car.querySelector(".car-count");
  const mid = (s) => s.offsetLeft + s.clientWidth / 2;
  let i = 0;
  const go = (n) => {
    const s = slides[Math.max(0, Math.min(slides.length - 1, n))];
    track.scrollTo({ left: mid(s) - track.clientWidth / 2, behavior: still.matches ? "auto" : "smooth" });
  };
  const sync = () => {
    const c = track.scrollLeft + track.clientWidth / 2;
    i = slides.reduce((b, s, k) => (Math.abs(mid(s) - c) < Math.abs(mid(slides[b]) - c) ? k : b), 0);
    count.textContent = `${i + 1} / ${slides.length}`;
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
  };
  prev.addEventListener("click", () => go(i - 1));
  next.addEventListener("click", () => go(i + 1));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(i + (e.key === "ArrowRight" ? 1 : -1));
    }
  });
  let raf = 0;
  track.addEventListener("scroll", () => (cancelAnimationFrame(raf), (raf = requestAnimationFrame(sync))), { passive: true });
  sync();
});

const rise = document.querySelectorAll(".rise");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { rootMargin: "0px 0px -8% 0px" },
  );
  rise.forEach((el) => io.observe(el));
} else rise.forEach((el) => el.classList.add("in"));

