(() => {
  const TZ = "America/Chicago";
  const ANNIVERSARY_MONTH = 5;
  const ANNIVERSARY_DAY = 15;
  const DOS_TARGET = "dos";

  const letterEl = document.getElementById("day-letter");
  const bodyEl = document.getElementById("day-letter-body");
  const summaryEl = document.getElementById("day-letter-summary");
  if (!letterEl || !bodyEl) return;

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

  const isMay15 = () => {
    const params = new URLSearchParams(window.location.search);
    const dateOverride = params.get("date");
    if (dateOverride && /^\d{4}-\d{2}-\d{2}$/.test(dateOverride)) {
      const [, m, d] = dateOverride.split("-").map(Number);
      return m === ANNIVERSARY_MONTH && d === ANNIVERSARY_DAY;
    }
    const today = getTodayParts();
    return today.month === ANNIVERSARY_MONTH && today.day === ANNIVERSARY_DAY;
  };

  const findLetterEntry = () =>
    (window.IMPORTANT_DATES || []).find((e) => {
      if (!e.letter) return false;
      const [, m, d] = e.date.split("-").map(Number);
      return m === ANNIVERSARY_MONTH && d === ANNIVERSARY_DAY;
    });

  const revealLetter = (openDetails = false) => {
    if (!isMay15()) return;
    const entry = findLetterEntry();
    if (!entry?.letter) return;

    if (summaryEl && entry.letterSummary) summaryEl.textContent = entry.letterSummary;
    bodyEl.textContent = entry.letter;
    letterEl.hidden = false;
    if (openDetails) letterEl.open = true;

    letterEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  window.revealAnniversaryLetter = revealLetter;

  let dosBuf = "";
  window.addEventListener("keydown", (e) => {
    if (!isMay15()) return;
    const k = String(e.key || "").toLowerCase();
    if (!/^[a-z]$/.test(k)) return;
    dosBuf = (dosBuf + k).slice(-DOS_TARGET.length);
    if (dosBuf === DOS_TARGET) revealLetter(true);
  });

  if (isMay15()) {
    revealLetter(false);
  } else {
    letterEl.hidden = true;
  }
})();
