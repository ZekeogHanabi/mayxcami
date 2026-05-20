(() => {
  const TZ = "America/Chicago";
  const list = window.COUNTDOWNS || (window.TRIP_COUNTDOWN ? [window.TRIP_COUNTDOWN] : []);
  const host = document.getElementById("countdowns");
  if (!host || !list.length) return;

  const getToday = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(new Date());
    const pick = (type) => Number(parts.find((p) => p.type === type)?.value);
    return new Date(pick("year"), pick("month") - 1, pick("day"));
  };

  const params = new URLSearchParams(window.location.search);
  const dateOverride = params.get("date");
  const today =
    dateOverride && /^\d{4}-\d{2}-\d{2}$/.test(dateOverride)
      ? (() => {
          const [y, m, d] = dateOverride.split("-").map(Number);
          return new Date(y, m - 1, d);
        })()
      : getToday();

  const msPerDay = 24 * 60 * 60 * 1000;

  for (const cfg of list) {
    if (!cfg?.date) continue;

    const [targetY, targetM, targetD] = cfg.date.split("-").map(Number);
    const target = new Date(targetY, targetM - 1, targetD);
    const daysLeft = Math.round((target - today) / msPerDay);

    const block = document.createElement("div");
    block.className = "day-countdown";

    const title = document.createElement("p");
    title.className = "day-countdown-title";
    title.textContent = cfg.title || "Días que faltan";

    const value = document.createElement("p");
    value.className = "day-countdown-value";

    const label = document.createElement("p");
    label.className = "day-countdown-label";

    if (daysLeft > 1) {
      value.textContent = String(daysLeft);
      label.textContent = "días";
    } else if (daysLeft === 1) {
      value.textContent = "1";
      label.textContent = "día";
    } else if (daysLeft === 0) {
      value.textContent = "♥ ¡es hoy! ♥";
      value.classList.add("day-countdown-value--today");
      label.textContent = "";
    } else {
      value.textContent = "♥";
      value.classList.add("day-countdown-value--today");
      label.textContent = cfg.pastLabel || "ya pasó";
    }

    block.appendChild(title);

    if (cfg.id === "navidad") {
      block.classList.add("day-countdown--navidad");
      
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.justifyContent = "center";
      row.style.gap = "14px";
      row.style.marginTop = "4px";

      const valWrapper = document.createElement("div");
      valWrapper.style.display = "flex";
      valWrapper.style.flexDirection = "column";
      valWrapper.style.alignItems = "center";
      
      // Eliminar márgenes extras para alineación perfecta
      value.style.margin = "0";
      valWrapper.appendChild(value);
      
      if (label.textContent) {
        label.style.margin = "4px 0 0 0";
        valWrapper.appendChild(label);
      }
      
      const padoruWrapper = document.createElement("div");
      padoruWrapper.className = "padoru-wrapper";
      padoruWrapper.style.width = "48px";
      padoruWrapper.style.height = "48px";
      padoruWrapper.style.opacity = "0.9";
      padoruWrapper.style.animation = "padoru-shake 2.5s ease-in-out infinite";
      padoruWrapper.style.transformOrigin = "bottom center";

      const padoruImg = document.createElement("img");
      padoruImg.src = "./padoru.png";
      padoruImg.alt = "Padoru";
      padoruImg.style.width = "100%";
      padoruImg.style.height = "100%";
      padoruImg.style.display = "block";
      padoruImg.style.objectFit = "contain";

      padoruWrapper.appendChild(padoruImg);

      row.appendChild(valWrapper);
      row.appendChild(padoruWrapper);
      block.appendChild(row);
    } else {
      block.appendChild(value);
      if (label.textContent) block.appendChild(label);
    }

    host.appendChild(block);
  }
})();
