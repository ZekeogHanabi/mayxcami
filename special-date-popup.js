(() => {
  const TZ = "America/Chicago";

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

  const findTodayPopup = () => {
    const today = getTodayParts();
    const params = new URLSearchParams(window.location.search);
    const dateOverride = params.get("date");

    if (dateOverride && /^\d{4}-\d{2}-\d{2}$/.test(dateOverride)) {
      const [y, m, d] = dateOverride.split("-").map(Number);
      return (window.IMPORTANT_DATES || []).find((e) => {
        if (!e.popup) return false;
        const [ey, em, ed] = e.date.split("-").map(Number);
        if (e.recurring) return em === m && ed === d;
        return ey === y && em === m && ed === d;
      });
    }

    return (window.IMPORTANT_DATES || []).find((e) => {
      if (!e.popup) return false;
      const [, m, d] = e.date.split("-").map(Number);
      if (e.recurring) return m === today.month && d === today.day;
      const [y, em, ed] = e.date.split("-").map(Number);
      return y === today.year && em === today.month && ed === today.day;
    });
  };

  const storageKey = (entry) => {
    const [, m, d] = entry.date.split("-");
    return `specialPopupDismissed-${entry.recurring ? `${m}-${d}` : entry.date}`;
  };

  const modal = document.getElementById("special-date-modal");
  const modalText = document.getElementById("special-date-modal-text");
  const modalClose = document.getElementById("special-date-modal-close");
  const modalLink = document.getElementById("special-date-modal-link");

  if (!modal || !modalText) return;

  const entry = findTodayPopup();
  if (!entry?.popup) return;

  try {
    if (sessionStorage.getItem(storageKey(entry)) === "1") return;
  } catch {}

  modalText.textContent = entry.popup;

  if (modalLink) {
    if (entry.link) {
      modalLink.href = entry.link;
      modalLink.textContent = entry.linkText || "ver sorpresita →";
      modalLink.style.display = "inline-block";
    } else {
      modalLink.style.display = "none";
    }
  }

  modal.classList.add("show");
  window.spawnCelebrationHearts?.(22);

  const close = () => {
    modal.classList.remove("show");
    window.spawnCelebrationHearts?.(14);
    try {
      sessionStorage.setItem(storageKey(entry), "1");
    } catch {}
  };

  if (modalClose) modalClose.addEventListener("click", close);
  modal.addEventListener("click", (e) => e.target === modal && close());
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) close();
  });
})();
