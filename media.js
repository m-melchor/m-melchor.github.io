// Growing up media for the Classic and Paper designs: photos that cross-fade every few seconds, and a muted video with a sound button.
// Both rest while off screen; with reduced motion the photos only change from the dots and the video waits for the button.
(() => {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = (el, on) => new IntersectionObserver(([e]) => on(e.isIntersecting), { threshold: 0.25 }).observe(el);

  document.querySelectorAll("[data-slides]").forEach((box) => {
    const imgs = [...box.querySelectorAll("img")];
    const dots = [...box.querySelectorAll(".slide-dots button")];
    let i = 0;
    let t = null;
    const show = (n) => {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach((im, k) => im.classList.toggle("on", k === i));
      dots.forEach((d, k) => d.setAttribute("aria-current", k === i ? "true" : "false"));
    };
    const stop = () => {
      clearInterval(t);
      t = null;
    };
    const start = () => {
      if (!still && !t) t = setInterval(() => show(i + 1), 4000);
    };
    dots.forEach((d, k) =>
      d.addEventListener("click", () => {
        stop();
        show(k);
        start();
      }),
    );
    seen(box, (on) => (on ? start() : stop()));
  });

  document.querySelectorAll("[data-vid]").forEach((box) => {
    const v = box.querySelector("video");
    const b = box.querySelector("button");
    const label = () => {
      b.setAttribute("aria-label", v.muted ? "Turn sound on" : "Turn sound off");
      b.classList.toggle("is-on", !v.muted);
    };
    b.addEventListener("click", () => {
      v.muted = !v.muted;
      if (!v.muted) v.play().catch(() => {});
      label();
    });
    seen(box, (on) => {
      if (!on) v.pause();
      else if (!still || !v.muted) v.play().catch(() => {});
    });
    label();
  });
})();
