// Live 3D models for Classic and Paper: each stage loads the viewer and its model as it nears the screen.
(() => {
  const VIEWER = "/vendor/model-viewer-4.0.0.min.js";
  let viewer;
  const load = () =>
    (viewer ??= new Promise((ok, no) => {
      const s = document.createElement("script");
      s.type = "module";
      s.src = VIEWER;
      s.onload = ok;
      s.onerror = () => ((viewer = undefined), s.remove(), no());
      document.head.append(s);
    }));

  const open = async (stage) => {
    const wait = stage.querySelector(".m3d-wait");
    try {
      await load();
    } catch {
      return (wait.textContent = "The model could not load.");
    }
    const d = stage.dataset;
    const mv = document.createElement("model-viewer");
    const at = { src: d.model, alt: d.alt, "camera-orbit": d.orbit, "camera-controls": "", "touch-action": "pan-y", "interaction-prompt": "none", "shadow-intensity": "0.8", exposure: d.light ? "1" : "0.8" };
    if (d.light) at["environment-image"] = d.light;
    for (const [k, v] of Object.entries(at)) mv.setAttribute(k, v);
    mv.addEventListener("load", () => wait.remove(), { once: true });
    mv.addEventListener("error", () => (wait.textContent = "The model could not load."), { once: true });
    stage.append(mv);
  };

  const io = new IntersectionObserver(
    (list) => {
      for (const e of list) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        open(e.target);
      }
    },
    { rootMargin: "300px" },
  );
  document.querySelectorAll(".m3d-stage[data-model]").forEach((s) => io.observe(s));
})();
