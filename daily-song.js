(() => {
  const TZ = "America/Chicago";
  const START_DATE = new Date(2026, 4, 15);
  const DAILY_SONGS = [
    "Santiago Cruz - Cuando Regreses",
    "Shakira - Día de Enero",	
    "Manuel Medrano - Si Pudiera",
    "Andrés Calamaro - La parte de adelante",
    "Soda Stereo - Entre Caníbales",
    "Andrés Cepeda - Como te atreves - Guitarra y Voz Live",
    "Fonseca - Te Mando Flores - Acoustic",
    "Manuel Medrano - Donde nadie pueda ir",
    "Felipe Pelaez - Loco",
    "Rex Orange County  - Television/So Far So God",
    "Andrés Cepeda - El Beso - Guitarra y Voz Live",
    "Julio Jaramillo - Te Esperaré",
    "Julieta Venegas, Ana Tijoux - Eres para Mí",
    "Santiago Cruz - Y Si Te Quedas, ¿Qué?",
    "AnnenMayKantereit - Ausgehen",
    "León Larregui - Locos",
    "Andrés Cepeda - Sé Morir - Guitarra y Voz Live",
    "Andrés Cepeda - Enfermedad de Ti",
    "Soda Stereo - Corazón Delator - Me Verás Volver Gira 2007",
    "Los Bunkers - Ven Aquí",
    "Radiohead - Creep - Acoustic",
    "Sandro - Porque Yo Te Amo",
    "Andrés Cepeda - Voy a Extrañarte",
    "Andrés Cepeda - Desesperado",
    "Andrés Cepeda - Tengo Ganas",
    "Jósean Log - Chachachá",
    "Andrés Cepeda - Día Tras Día",
    "Cabas - Bonita",
    "León Larregui - Brillas",
    "Café Tacvba - Eres",
    "Los Auténticos Decadentes - Loco (Tu Forma De Ser)",
    "La Mosca - Te Quiero Comer La Boca",
    "The Beatles - Here Comes The Sun - Remastered 2009",
    "Fonseca - Prometo",
    "Luis Silva - Como No Voy a Decirlo",
    "Kaleth Morales, Juank Ricardo - Ella Es Mi Todo",
    "Kevin Kaarl - Vámonos a Marte",
    "José José - Almohada",
    "Mon Laferte - Amor Completo",
    "Frank Sinatra, Count Basie - Fly Me To The Moon - 2008 Remastered",
    "Miranda! - Perfecta",
    "Goose house - 光るなら",
    "Enjambre - Ojos Tristes",
    "La Unión - Lobo-hombre en París",
    "Soda Stereo - Trátame Suavemente - Remasterizado 2007",
    "El Cuarteto De Nos - Enamorado tuyo",
    "Enjambre - Dulce Soledad",
    "Jarabe De Palo - El lado oscuro",
    "System Of A Down - Lonely Day",
    "Soda Stereo - Signos - Remasterizada 2007",
    "Soda Stereo - Prófugos (SEP7IMO DIA)",
    "Rata Blanca - Ella",
    "Oasis - Wonderwall",
    "KISS - I Was Made For Lovin' You",
    "Guns N' Roses - One In A Million",
    "Daniela Andrade - La Vie En Rose",
    "The Beatles - Hey Jude - Remastered 2015",
    "The All Ways - Eyes for You",
    "Manuel Medrano - Quedate",
    "Manuel Medrano - Cuando Te Pensaba",
    "Twenty One Pilots - We Don't Believe What's on TV",
    "Juanes - Es Por Ti",
    "Josean Log - Beso",
    "Joe Dassin - Les Champs-Elysées",
    "Louise Attaque - J't'emmène au vent",
    "Natalia Lafourcade, Mare Advertencia, Rubén Blades - Tú Sí Sabes Quererme",
    "The Strokes - Selfless",
    "Juanes - Para Tu Amor",
    "Carlos Vives - Volví a Nacer",
    "Tyler, The Creator, Kali Uchis - See You Again (feat. Kali Uchis)",
    "a-ha - Take on Me",
    "Green Day - Last Night on Earth",
    "Twenty One Pilots - Tear in My Heart",
    "Twenty One Pilots - Smithereens",
    "Guns N' Roses - Sweet Child O' Mine",
    "Queen - Love Of My Life - Remastered 2011",
    "Rata Blanca - Mujer Amante (versión acústica)",
    "Foster The People - I Would Do Anything for You",
    "Chicago - Michael Jakson",
    "Coldplay - Yellow",
    "Café Tacvba - Aprovechate de mi",
    "Andrés Cepeda - Piel Canela",
  ];

  const getTodayDate = () => {
    const params = new URLSearchParams(window.location.search);
    const dateOverride = params.get("date");
    if (dateOverride && /^\d{4}-\d{2}-\d{2}$/.test(dateOverride)) {
      const [year, month, day] = dateOverride.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(new Date());
    const pick = (type) => Number(parts.find((part) => part.type === type)?.value);
    return new Date(pick("year"), pick("month") - 1, pick("day"));
  };

  const getDaysSinceStart = (date) => {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.max(0, Math.floor((date - START_DATE) / msPerDay));
  };

  const title = document.getElementById("daily-song-title");
  const note = document.getElementById("daily-song-note");
  if (!title) return;

  const weekIndex = Math.floor(getDaysSinceStart(getTodayDate()) / 7);
  const songIndex = weekIndex % DAILY_SONGS.length;
  title.textContent = DAILY_SONGS[songIndex];
  if (note) note.textContent = `playlist :3 (${songIndex + 1}/${DAILY_SONGS.length})`;
})();
