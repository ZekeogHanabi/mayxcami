(() => {
  const TZ = "America/Chicago";
  const cfg = window.MAY15_EXTRAS;
  if (!cfg) return;

  const getTodayParts = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(new Date());
    const pick = (type) => Number(parts.find((p) => p.type === type)?.value);
    return { year: pick("year"), month: pick("month"), day: pick("day") };
  };

  const getTodayDate = () => {
    const params = new URLSearchParams(window.location.search);
    const dateOverride = params.get("date");
    if (dateOverride && /^\d{4}-\d{2}-\d{2}$/.test(dateOverride)) {
      const [y, m, d] = dateOverride.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    const t = getTodayParts();
    return new Date(t.year, t.month - 1, t.day);
  };

  const isMay15 = () => {
    const params = new URLSearchParams(window.location.search);
    const dateOverride = params.get("date");
    if (dateOverride && /^\d{4}-\d{2}-\d{2}$/.test(dateOverride)) {
      const [, m, d] = dateOverride.split("-").map(Number);
      return m === cfg.month && d === cfg.day;
    }
    const today = getTodayParts();
    return today.month === cfg.month && today.day === cfg.day;
  };

  const secretModal = document.getElementById("secret-heart-modal");
  const secretText = document.getElementById("secret-heart-modal-text");
  const secretClose = document.getElementById("secret-heart-modal-close");
  const couponModal = document.getElementById("coupon-modal");
  const couponClose = document.getElementById("coupon-modal-close");
  const couponList = document.getElementById("coupon-modal-list");
  const couponTitle = document.getElementById("coupon-modal-title");
  const couponSubtitle = document.getElementById("coupon-modal-subtitle");

  if (secretText && cfg.secretHeart) secretText.textContent = cfg.secretHeart;
  if (couponTitle && cfg.coupon?.title) couponTitle.textContent = cfg.coupon.title;
  if (couponSubtitle && cfg.coupon?.subtitle) couponSubtitle.textContent = cfg.coupon.subtitle;
  if (couponList && cfg.coupon?.items) {
    couponList.innerHTML = "";
    for (const item of cfg.coupon.items) {
      const li = document.createElement("li");
      li.textContent = item;
      couponList.appendChild(li);
    }
  }

  const closeSecret = () => secretModal?.classList.remove("show");
  const openCoupon = () => couponModal?.classList.add("show");
  const closeCoupon = () => couponModal?.classList.remove("show");

  window.openSecretHeartModal = () => {
    secretModal?.classList.add("show");
    window.spawnCelebrationHearts?.(10);
  };

  if (secretClose) secretClose.addEventListener("click", closeSecret);
  if (secretModal) {
    secretModal.addEventListener("click", (e) => e.target === secretModal && closeSecret());
  }
  if (couponClose) couponClose.addEventListener("click", closeCoupon);
  if (couponModal) {
    couponModal.addEventListener("click", (e) => e.target === couponModal && closeCoupon());
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (secretModal?.classList.contains("show")) closeSecret();
      if (couponModal?.classList.contains("show")) closeCoupon();
    }
  });

  const couponBtn = document.getElementById("may15-coupon-btn");
  if (couponBtn) couponBtn.addEventListener("click", openCoupon);

  window.bindMay15HeartEgg = () => {
    const icon = document.getElementById("cal-detail-icon");
    if (!icon || icon.dataset.eggBound === "1") return;
    icon.dataset.eggBound = "1";
    let taps = [];
    icon.classList.add("calendar-detail-icon--tappable");
    icon.addEventListener("click", () => {
      if (icon.hidden) return;
      const now = Date.now();
      taps = taps.filter((t) => now - t < 600);
      taps.push(now);
      if (taps.length >= 3) {
        taps = [];
        window.openSecretHeartModal?.();
      }
    });
  };

  window.bindMay15HeartEgg();

  if (!isMay15()) return;

  window.spawnCelebrationHearts?.(16);

  const countdowns = document.getElementById("countdowns");
  const extrasHost = document.getElementById("may15-extras");

  if (cfg.togetherSince && countdowns && !document.getElementById("together-countdown")) {
    const [sy, sm, sd] = cfg.togetherSince.split("-").map(Number);
    const today = getTodayDate();
    const start = new Date(sy, sm - 1, sd);
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysTogether = Math.max(0, Math.floor((today - start) / msPerDay) + 1);

    const block = document.createElement("div");
    block.id = "together-countdown";
    block.className = "day-countdown day-countdown--together";
    block.innerHTML = `
      <p class="day-countdown-title">llevamos</p>
      <p class="day-countdown-value">${daysTogether}</p>
      <p class="day-countdown-label">${daysTogether === 1 ? "día juntos" : "días juntos"}</p>
    `;
    countdowns.appendChild(block);
  }

  const updateTime = () => {
    const timeEl = document.getElementById("may15-time");
    if (!timeEl || !cfg.timezones?.length) return;
    const fmt = (zone) =>
      new Intl.DateTimeFormat("es", {
        timeZone: zone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());
    const lines = cfg.timezones.map((t) => `${t.label}: ${fmt(t.zone)}`);
    timeEl.textContent = `en este momento son las\n${lines.join("\ny ")}`;
  };

  if (extrasHost && cfg.timezones?.length) {
    extrasHost.hidden = false;
    updateTime();
    window.setInterval(updateTime, 60_000);
  }
})();
