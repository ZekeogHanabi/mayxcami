(() => {
  const prefersReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  let layer = null;

  const getLayer = () => {
    if (layer) return layer;
    layer = document.createElement("div");
    layer.id = "celebration-layer";
    layer.className = "celebration-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
    return layer;
  };

  const spawnHearts = (count = 20) => {
    if (prefersReduced) return;
    const host = getLayer();
    const symbols = ["♥", "♡", "❤"];

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "celebration-heart";
      el.textContent = symbols[i % symbols.length];
      const x = 8 + Math.random() * 84;
      const delay = Math.random() * 0.35;
      const duration = 1.1 + Math.random() * 0.9;
      const size = 12 + Math.random() * 14;
      el.style.left = `${x}vw`;
      el.style.bottom = "-24px";
      el.style.fontSize = `${size}px`;
      el.style.animationDuration = `${duration}s`;
      el.style.animationDelay = `${delay}s`;
      host.appendChild(el);
      window.setTimeout(() => el.remove(), (duration + delay) * 1000 + 80);
    }
  };

  window.spawnCelebrationHearts = spawnHearts;
})();
