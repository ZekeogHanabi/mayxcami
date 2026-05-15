// Fechas importantes — edita aquí
// date: YYYY-MM-DD | recurring: true repite cada año | icon: "heart" (opcional)
// popup: mensaje del modal solo ese día (recurring = mismo día cada año)
window.IMPORTANT_DATES = [
  { date: "2026-04-17", label: "primera versión de la web" },
  {
    date: "2026-05-15",
    label: "Aniversario segundo mes",
    icon: "heart",
    recurring: true,
    popup: "♥ Hoy llevamos 2 meses juntos, te amo ♥",
    youtube: "https://www.youtube.com/watch?v=EDITAR",
    linkText: "escuchar →",
    letterSummary: "Abrelo hoy uwu",
    letter: `Bonita,

dos meses no es tanto tiempo en un calendario, pero para mí sí lo es en todo lo demás.

gracias por quedarte, por escucharme, por hacerme sentir que no estoy solo en esto.
Espero poder ser todo lo que buscas y mucho mas, y que podamos estar juntos toda la vida.
También espero que te gusten los cambios en nuestra pagina c:

te quiero mucho ♥`,
  },
  {
    date: "2026-05-20",
    label: "Cumple de May",
    recurring: true,
    popup: "♥ Hoy es tu cumpleaños, felicidades! ♥",
  },
  {
    date: "2026-06-06",
    label: "Cumple de Cami",
    recurring: true,
    popup: "♥ Hoy es mi cumpleaños... gracias por estar aquí conmigo ♥",
  },
  {
    date: "2026-06-15",
    label: "3 meses aniversario",
    recurring: true,
    popup: "♥ Hoy llevamos 3 meses juntos, te amo ♥",
  },
];

// Extras del 15 de mayo — edita aquí
window.MAY15_EXTRAS = {
  month: 5,
  day: 15,
  togetherSince: "2026-03-15",
  secretHeart: "quiero decirte otra vez que te elijo, hoy y siempre que pueda ♥",
  timezones: [
    { label: "París (Cami)", zone: "Europe/Paris" },
    { label: "Chicago (May)", zone: "America/Chicago" },
  ],
  coupon: {
    title: "cupón especial",
    subtitle: "canjeable por (tú eliges cuándo):",
    items: ["un abrazo", "una llamada", "lo que tú elijas ♥"],
  },
};

// Contadores — edita fecha y título aquí
window.COUNTDOWNS = [
  { date: "2026-06-15", title: "Días que faltan para tu viaje", pastLabel: "ya pasó tu viaje" },
  { date: "2026-12-24", title: "días para navidad (quizá nos veamos :p)", pastLabel: "ya fue navidad" },
];
