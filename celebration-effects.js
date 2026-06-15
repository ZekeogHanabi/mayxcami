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

  // --- Easter Egg: Super Clic Explosivo ---
  let magicClicks = 0;
  let lastMagicClickTime = 0;
  let magicTimer = null;
  let isMagicActive = false;

  const styleId = "magic-cursor-styles";

  const isMagicTarget = (el) => {
    if (!el) return false;
    if (el.classList.contains("cat") || el.closest(".cat")) return false;
    if (el.tagName === "H1" || el.closest("h1")) return true;
    if (el.classList.contains("padoru-wrapper") || el.closest(".padoru-wrapper")) return true;
    if (el.classList.contains("decor") || el.closest(".decor")) return true;
    return false;
  };

  const injectMagicStyles = () => {
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .magic-cursor-active, .magic-cursor-active * {
        cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size:24px;filter:drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'><text y='26'>🪄</text></svg>") 0 24, auto !important;
      }
    `;
    document.head.appendChild(style);
  };

  const deactivateMagic = () => {
    isMagicActive = false;
    document.documentElement.classList.remove("magic-cursor-active");
    window.removeEventListener("mousemove", handleMouseMove);
  };

  const activateMagic = () => {
    if (isMagicActive) {
      clearTimeout(magicTimer);
    } else {
      isMagicActive = true;
      injectMagicStyles();
      document.documentElement.classList.add("magic-cursor-active");
      window.addEventListener("mousemove", handleMouseMove);
    }

    spawnHearts(15);
    magicTimer = setTimeout(deactivateMagic, 10000);
  };

  let lastSpawn = 0;
  const handleMouseMove = (e) => {
    const now = Date.now();
    if (now - lastSpawn < 30) return;
    lastSpawn = now;

    const host = getLayer();
    const el = document.createElement("span");
    el.className = "magic-sparkle";
    
    const isStar = Math.random() > 0.4;
    if (isStar) {
      const stars = ["✨", "✦", "✧", "🌟"];
      el.textContent = stars[Math.floor(Math.random() * stars.length)];
      el.style.color = "#ffd700";
      el.style.textShadow = "0 0 5px rgba(255, 215, 0, 0.8)";
    } else {
      el.style.width = `${6 + Math.random() * 6}px`;
      el.style.height = `${6 + Math.random() * 6}px`;
      const colors = ["#ff6b8b", "#ffd700", "#ffccd5", "#b5e2fa", "#c5a3ff", "#99e2b4"];
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      el.style.display = "inline-block";
    }

    el.style.position = "absolute";
    el.style.pointerEvents = "none";
    el.style.left = `${e.pageX}px`;
    el.style.top = `${e.pageY}px`;
    el.style.fontSize = `${10 + Math.random() * 12}px`;
    el.style.transform = "translate(-50%, -50%) scale(1)";
    el.style.transition = "transform 1s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1s ease";
    el.style.zIndex = "10000";
    
    host.appendChild(el);
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 35;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + 40;
    const rot = Math.random() * 360;

    setTimeout(() => {
      el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2) rotate(${rot}deg)`;
      el.style.opacity = "0";
    }, 10);

    setTimeout(() => el.remove(), 1050);
  };

  document.addEventListener("click", (e) => {
    if (!isMagicTarget(e.target)) return;

    const now = Date.now();
    if (now - lastMagicClickTime < 1000) {
      magicClicks++;
    } else {
      magicClicks = 1;
    }
    lastMagicClickTime = now;

    if (magicClicks >= 10) {
      magicClicks = 0;
      activateMagic();
    }
  });

  // --- Easter Egg: Modo Gatito ---
  let catClicks = 0;
  let lastCatClickTime = 0;
  let kittyMode = false;

  const transformToKittyText = (text) => {
    let newText = text;
    newText = newText.replace(/(\.|\?|!)\s*$/g, "$1 miau :3 ");
    newText = newText.replace(/([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)\s*$/g, "$1 meow 🐾");
    return newText;
  };

  const showPopupFeedback = (message) => {
    const badge = document.createElement("div");
    badge.textContent = message;
    badge.style.position = "fixed";
    badge.style.top = "20px";
    badge.style.left = "50%";
    badge.style.transform = "translateX(-50%) translateY(-20px)";
    badge.style.background = "rgba(43, 29, 48, 0.95)";
    badge.style.color = "#ebd5ff";
    badge.style.padding = "10px 20px";
    badge.style.fontSize = "13.5px";
    badge.style.fontFamily = "var(--sans), sans-serif";
    badge.style.zIndex = "210000";
    badge.style.border = "1px solid #d84b7f";
    badge.style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)";
    badge.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    badge.style.opacity = "0";
    
    document.body.appendChild(badge);
    
    requestAnimationFrame(() => {
      badge.style.transform = "translateX(-50%) translateY(0)";
      badge.style.opacity = "1";
    });
    
    setTimeout(() => {
      badge.style.transform = "translateX(-50%) translateY(-20px)";
      badge.style.opacity = "0";
      setTimeout(() => badge.remove(), 300);
    }, 1800);
  };

  const toggleKittyMode = () => {
    kittyMode = !kittyMode;
    document.documentElement.classList.toggle("kitty-mode-active", kittyMode);
    showPopupFeedback(kittyMode ? "¡Modo miau activado! :3 🐾" : "Modo normal activado c:");

    const wrap = document.querySelector(".wrap");
    if (!wrap) return;

    const walkTextNodes = (node, callback) => {
      if (node.nodeType === Node.TEXT_NODE) {
        callback(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const skipTags = ["SCRIPT", "STYLE", "BUTTON", "A", "TEXTAREA", "INPUT", "SELECT"];
        if (!skipTags.includes(node.tagName)) {
          node.childNodes.forEach(child => walkTextNodes(child, callback));
        }
      }
    };

    walkTextNodes(wrap, (textNode) => {
      if (kittyMode) {
        if (!textNode.parentElement.dataset.origText) {
          textNode.parentElement.dataset.origText = textNode.nodeValue;
        }
        if (textNode.nodeValue.trim().length > 2) {
          textNode.nodeValue = transformToKittyText(textNode.parentElement.dataset.origText);
        }
      } else {
        if (textNode.parentElement.dataset.origText !== undefined) {
          textNode.nodeValue = textNode.parentElement.dataset.origText;
        }
      }
    });
  };

  document.addEventListener("click", (e) => {
    if (!document.getElementById("star-1")) return;

    if (e.target.classList.contains("cat") || e.target.closest(".cat")) {
      const now = Date.now();
      if (now - lastCatClickTime < 1000) {
        catClicks++;
      } else {
        catClicks = 1;
      }
      lastCatClickTime = now;

      if (catClicks >= 3) {
        catClicks = 0;
        toggleKittyMode();
      }
    }
  });
})();
