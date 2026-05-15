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
    block.appendChild(value);
    if (label.textContent) block.appendChild(label);
    host.appendChild(block);
  }
})();
