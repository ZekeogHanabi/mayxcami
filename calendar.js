(() => {
  const MONTHS = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const WEEKDAYS = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];
  const ICONS = { heart: "♥" };
  const ANNIVERSARY_MONTH = 5;
  const ANNIVERSARY_DAY = 15;

  const dates = (window.IMPORTANT_DATES || []).map((e) => {
    const [y, m, d] = e.date.split("-").map(Number);
    return {
      date: e.date,
      label: e.label,
      icon: e.icon || null,
      youtube: e.youtube || null,
      link: e.link || null,
      linkText: e.linkText || "escuchar →",
      letter: e.letter || null,
      recurring: Boolean(e.recurring),
      parts: [y, m, d],
    };
  });

  const byExact = new Map();
  const byMonthDay = new Map();

  for (const e of dates) {
    const [, m, d] = e.parts;
    const md = `${m}-${d}`;
    if (e.recurring) {
      if (!byMonthDay.has(md)) byMonthDay.set(md, []);
      byMonthDay.get(md).push(e);
    } else {
      byExact.set(e.date, e);
    }
  }

  const grid = document.getElementById("cal-grid");
  const monthLabel = document.getElementById("cal-month-label");
  const prevBtn = document.getElementById("cal-prev");
  const nextBtn = document.getElementById("cal-next");
  const detail = document.getElementById("cal-detail");
  const detailIcon = document.getElementById("cal-detail-icon");
  const detailDate = document.getElementById("cal-detail-date");
  const detailLabel = document.getElementById("cal-detail-label");

  if (!grid || !monthLabel) return;

  const today = new Date();
  const todayKey = formatKey(today.getFullYear(), today.getMonth() + 1, today.getDate());

  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedKey = null;

  function formatKey(y, m, d) {
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function monthDayKey(m, d) {
    return `${m}-${d}`;
  }

  function formatDisplay(y, m, d) {
    return `${d} de ${MONTHS[m - 1]} de ${y}`;
  }

  function getEventsForDay(y, m, d) {
    const exact = byExact.get(formatKey(y, m, d));
    const recurring = byMonthDay.get(monthDayKey(m, d)) || [];
    const list = [];
    if (exact) list.push(exact);
    for (const e of recurring) {
      if (!list.some((x) => x.label === e.label)) list.push(e);
    }
    return list;
  }

  function renderDetailLabels(events) {
    if (!detailLabel) return;
    detailLabel.innerHTML = "";
    events.forEach((e, i) => {
      if (i > 0) detailLabel.appendChild(document.createTextNode(" · "));
      const targetLink = e.link || (e.youtube && !String(e.youtube).includes("EDITAR") ? e.youtube : null);
      if (targetLink) {
        detailLabel.appendChild(document.createTextNode(`${e.label} · `));
        const link = document.createElement("a");
        link.href = targetLink;
        if (targetLink.startsWith("http")) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        link.className = "calendar-detail-link";
        link.textContent = e.linkText;
        detailLabel.appendChild(link);
      } else {
        detailLabel.appendChild(document.createTextNode(e.label));
      }
    });
  }

  function onDaySelected(m, d) {
    if (m === ANNIVERSARY_MONTH && d === ANNIVERSARY_DAY) {
      window.bindMay15HeartEgg?.();
    }
  }

  function showDetail(y, m, d, events) {
    if (!detail || !detailDate || !detailLabel) return;
    if (!events.length) {
      hideDetail();
      return;
    }

    selectedKey = formatKey(y, m, d);
    detail.hidden = false;
    detail.classList.add("calendar-detail--visible");
    detailDate.textContent = formatDisplay(y, m, d);
    renderDetailLabels(events);
    onDaySelected(m, d);

    if (detailIcon) {
      const icon = events.find((e) => e.icon)?.icon;
      if (icon && ICONS[icon]) {
        detailIcon.textContent = ICONS[icon];
        detailIcon.hidden = false;
      } else {
        detailIcon.textContent = "";
        detailIcon.hidden = true;
      }
    }

    renderMonth();
  }

  function hideDetail() {
    selectedKey = null;
    if (!detail) return;
    detail.classList.remove("calendar-detail--visible");
    detail.hidden = true;
    if (detailIcon) {
      detailIcon.textContent = "";
      detailIcon.hidden = true;
    }
    renderMonth();
  }

  function renderMonth() {
    monthLabel.textContent = `${MONTHS[viewMonth]} ${viewYear}`;

    grid.innerHTML = "";
    for (const wd of WEEKDAYS) {
      const el = document.createElement("div");
      el.className = "calendar-weekday";
      el.textContent = wd;
      grid.appendChild(el);
    }

    const first = new Date(viewYear, viewMonth, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement("div");
      empty.className = "calendar-day calendar-day--empty";
      grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const m = viewMonth + 1;
      const key = formatKey(viewYear, m, day);
      const events = getEventsForDay(viewYear, m, day);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "calendar-day";
      cell.textContent = String(day);

      if (key === todayKey) cell.classList.add("calendar-day--today");
      if (events.length > 0) {
        cell.classList.add("calendar-day--event");
        cell.title = events.map((e) => e.label).join(", ");
        cell.addEventListener("click", () => showDetail(viewYear, m, day, events));
      }
      if (selectedKey === key) cell.classList.add("calendar-day--selected");

      grid.appendChild(cell);
    }
  }

  prevBtn?.addEventListener("click", () => {
    viewMonth -= 1;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    renderMonth();
  });

  nextBtn?.addEventListener("click", () => {
    viewMonth += 1;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    renderMonth();
  });

  renderMonth();

  const todayEvents = getEventsForDay(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );
  if (todayEvents.length > 0) {
    showDetail(today.getFullYear(), today.getMonth() + 1, today.getDate(), todayEvents);
  }
})();
