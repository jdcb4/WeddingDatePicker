const dateDisplay = document.querySelector("#dateDisplay");
const dateMeta = document.querySelector("#dateMeta");
const pickButton = document.querySelector("#pickButton");
const reasonText = document.querySelector("#reasonText");
const rejectList = document.querySelector("#rejectList");
const rejectCount = document.querySelector("#rejectCount");

const dayMs = 24 * 60 * 60 * 1000;
const formatter = new Intl.DateTimeFormat("en-AU", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const shortFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

let rejectionTotal = 0;
let spinTimer = 0;

const fixedDateReasons = [
  [1, 1, "New Year's Day, and half the guest list is still pretending resolutions count"],
  [1, 2, "the official day for finding glitter in places glitter should not be"],
  [1, 4, "World Braille Day, so the seating chart needs to be tactile and that takes time"],
  [1, 6, "Epiphany, and someone will insist the wise men need plus-ones"],
  [1, 7, "Orthodox Christmas, which means the Greek side has the calendar receipts"],
  [1, 14, "Orthodox New Year, and the yiayias get another veto"],
  [1, 25, "Burns Night, and the bagpipes would win the soundcheck"],
  [1, 26, "Australia Day, and every BBQ in the country has already booked the folding chairs"],
  [1, 27, "Mozart's birthday, so the string quartet will become unbearable"],
  [2, 2, "Groundhog Day, and repeating the same argument about chair covers is too on-brand"],
  [2, 4, "World Cancer Day, so the only acceptable plan is respectful quiet"],
  [2, 11, "International Day of Women and Girls in Science, and the seating algorithm needs peer review"],
  [2, 13, "Galentine's Day, and the bridesmaids have a protected group booking"],
  [2, 14, "Valentine's Day, which is too obvious and somehow already booked since 2019"],
  [2, 17, "Random Acts of Kindness Day, and letting the celebrant have a weekend off counts"],
  [2, 20, "World Day of Social Justice, and the open bar allocation is not equitable yet"],
  [2, 21, "International Mother Language Day, so the speeches need four translations"],
  [2, 22, "World Thinking Day, and thinking about the invoice is enough for one day"],
  [3, 1, "the first day of autumn in Australia, and the weather has entered its opinions era"],
  [3, 3, "World Wildlife Day, and the botanical garden has declared itself emotionally unavailable"],
  [3, 8, "International Women's Day, and every florist is booked for better causes"],
  [3, 14, "Pi Day, so the cake maths gets politically charged"],
  [3, 17, "St Patrick's Day, and one uncle cannot be trusted near green accessories"],
  [3, 20, "International Day of Happiness, and the pressure is frankly unreasonable"],
  [3, 21, "Harmony Day, and the family group chat is nowhere near compliant"],
  [3, 22, "World Water Day, so the venue will remember its fountain surcharge"],
  [3, 25, "Greek Independence Day, and the dancing schedule is already at full capacity"],
  [3, 31, "World Backup Day, and nobody has backed up the vows"],
  [4, 1, "April Fools' Day, and nobody will believe the invitation is real"],
  [4, 2, "World Autism Awareness Day, so the sensory plan deserves proper attention"],
  [4, 7, "World Health Day, and the buffet risk assessment has gone feral"],
  [4, 10, "Sibling Day, which guarantees at least one speech becomes evidence"],
  [4, 22, "Earth Day, and the confetti has to submit an environmental impact statement"],
  [4, 23, "World Book Day, and the guest book will demand a literary agent"],
  [4, 25, "Anzac Day, so absolutely not"],
  [4, 29, "International Dance Day, and the first dance cannot compete with professionals"],
  [5, 1, "May Day, and every worker deserves not to assemble centrepieces"],
  [5, 4, "Star Wars Day, and someone will say 'I do' in a voice"],
  [5, 5, "Cinco de Mayo, and the margarita budget becomes legally binding"],
  [5, 8, "World Red Cross Day, and the first-aid table will look too official"],
  [5, 12, "International Nurses Day, so the nurses on the invite list are finally sleeping"],
  [5, 17, "World Baking Day, and the cake supplier will be smug enough already"],
  [5, 20, "World Bee Day, and the honey favours will start negotiating"],
  [5, 25, "Africa Day, and one cousin will pitch a destination wedding slideshow"],
  [5, 26, "National Sorry Day in Australia, and it needs respect, not canapes"],
  [5, 27, "the start of Reconciliation Week, so the calendar has better priorities"],
  [5, 31, "World No Tobacco Day, and the cigar bar idea can finally stay dead"],
  [6, 1, "the first day of winter in Australia, and all outdoor ceremony optimism expires"],
  [6, 5, "World Environment Day, and the ice sculpture has been cancelled by ethics"],
  [6, 8, "World Oceans Day, so every beach venue adds a mysterious tide fee"],
  [6, 12, "Loving Day, and the romance bar is unfairly high"],
  [6, 14, "World Blood Donor Day, and the red wine jokes get too easy"],
  [6, 20, "World Refugee Day, so the day deserves more seriousness than table runners"],
  [6, 21, "World Music Day, and the DJ will try to become a curator"],
  [6, 30, "the end of the Australian financial year, so every accountant guest is unavailable"],
  [7, 1, "the first day of the financial year, and everyone is pretending to be organised"],
  [7, 4, "US Independence Day, and the American relatives will bring fireworks energy"],
  [7, 7, "World Chocolate Day, so the dessert table will unionise"],
  [7, 14, "Bastille Day, and the seating plan may revolt"],
  [7, 17, "World Emoji Day, and the invitations would contain too many tiny reactions"],
  [7, 20, "the Moon landing anniversary, and the videographer will ask for a lunar package"],
  [7, 24, "Tequila Day, and the speeches do not need that level of confidence"],
  [7, 30, "International Day of Friendship, so every plus-one dispute becomes diplomatic"],
  [8, 1, "the ceremonial birthday of every racehorse in the Southern Hemisphere, which is not a sentence to explain in vows"],
  [8, 9, "International Day of the World's Indigenous Peoples, and it deserves clear space"],
  [8, 12, "International Youth Day, and the kids' table has overthrown management"],
  [8, 13, "International Left-Handers Day, and the calligraphy place cards need a rethink"],
  [8, 19, "World Photography Day, so every guest thinks they are the official photographer"],
  [8, 26, "Wear It Purple Day season, and the colour palette committee will reopen nominations"],
  [9, 1, "the first day of spring in Australia, and every allergy has RSVP'd yes"],
  [9, 8, "International Literacy Day, so the invitation typo audit must continue"],
  [9, 19, "Talk Like a Pirate Day, and the celebrant has been waiting years for this"],
  [9, 21, "International Day of Peace, and the seating chart is not there yet"],
  [10, 1, "International Coffee Day, and nobody should make vows before espresso"],
  [10, 3, "Mean Girls Day, and the dress code will become a quote-off"],
  [10, 4, "the start of World Space Week, and the venue lighting will be called 'cosmic'"],
  [10, 5, "World Teachers' Day, and every teacher guest deserves quiet marking time"],
  [10, 10, "World Mental Health Day, so the spreadsheet can take a breath"],
  [10, 16, "World Food Day, and the caterer will use it in the invoice subject line"],
  [10, 24, "United Nations Day, and the family diplomacy team is under-resourced"],
  [10, 28, "Ohi Day, Greek National Day, so the only acceptable answer is 'no'"],
  [10, 31, "Halloween, and the photos would age into a costume party"],
  [11, 1, "All Saints' Day, and the guest list is already aspirational"],
  [11, 5, "Guy Fawkes Night, and nobody needs pyrotechnic opinions"],
  [11, 11, "Remembrance Day, so the calendar says pause"],
  [11, 13, "World Kindness Day, and rejecting this date is our kind act"],
  [11, 19, "International Men's Day, and the groomsmen admin will peak at chaos"],
  [11, 21, "World Television Day, and someone will stream the ceremony vertically"],
  [11, 25, "the International Day for the Elimination of Violence Against Women, and it deserves respect"],
  [11, 30, "St Andrew's Day, and the tartan discourse is not ready"],
  [12, 1, "the first day of summer in Australia, and makeup has filed a heat complaint"],
  [12, 3, "International Day of Persons with Disabilities, so access planning must lead the day"],
  [12, 5, "International Volunteer Day, and the bridal party has volunteered enough"],
  [12, 10, "Human Rights Day, and nobody has the right to choose beige chair sashes"],
  [12, 21, "the December solstice window, and the sun is being dramatic"],
  [12, 24, "Christmas Eve, and the florist is already speaking in surcharges"],
  [12, 25, "Christmas Day, obviously"],
  [12, 26, "Boxing Day, and everyone is full of pavlova and regret"],
  [12, 31, "New Year's Eve, and the countdown would upstage the vows"],
];

const specificDateReasons = [
  [2026, 5, 15, "NRL Magic Round weekend, and Suncorp Stadium has absorbed every available voice"],
  [2026, 5, 16, "NRL Magic Round weekend, and Brisbane is already wearing every jersey it owns"],
  [2026, 5, 17, "NRL Magic Round weekend, and the hotel prices have discovered ambition"],
  [2026, 5, 27, "State of Origin Game I, and the NSW guests will not hear a single vow"],
  [2026, 6, 17, "State of Origin Game II at the MCG, and every Victorian will suddenly care about rugby league"],
  [2026, 7, 8, "State of Origin Game III, and the group chat will become uninhabitable"],
  [2026, 9, 26, "the 2026 AFL Grand Final at the MCG, and that is not a wedding date, that is a national scheduling injury"],
  [2026, 10, 4, "the 2026 NRL Grand Final at Accor Stadium, and the reception would need a broadcast rights deal"],
  [2026, 10, 15, "the Rugby League World Cup opener, and every sports fan has entered international mode"],
  [2026, 11, 15, "the Rugby League World Cup finals, and nobody should compete with that many national anthems"],
];

const weekPatternRules = [
  {
    name: "Mother's Day",
    match: (date) => date.getMonth() === 4 && nthWeekdayOfMonth(date) === 2 && date.getDay() === 0,
    reason: "Mother's Day in Australia, and every mum has already booked emotional jurisdiction",
  },
  {
    name: "Father's Day",
    match: (date) => date.getMonth() === 8 && nthWeekdayOfMonth(date) === 1 && date.getDay() === 0,
    reason: "Father's Day in Australia, and every dad will pretend not to cry somewhere else",
  },
  {
    name: "Melbourne Cup",
    match: (date) => date.getMonth() === 10 && nthWeekdayOfMonth(date) === 1 && date.getDay() === 2,
    reason: "Melbourne Cup Day, and fascinators cannot be allowed near the veil",
  },
  {
    name: "AFL Grand Final",
    match: (date) => date.getMonth() === 8 && isLastWeekdayOfMonth(date, 6),
    reason: "the probable AFL Grand Final weekend, and half the guests will be looking at scores",
  },
  {
    name: "NRL Grand Final",
    match: (date) => date.getMonth() === 9 && nthWeekdayOfMonth(date) === 1 && date.getDay() === 0,
    reason: "NRL Grand Final day, and the reception would become a live sports venue",
  },
  {
    name: "R U OK Day",
    match: (date) => date.getMonth() === 8 && nthWeekdayOfMonth(date) === 2 && date.getDay() === 4,
    reason: "R U OK? Day, and the planning spreadsheet is not ready to answer honestly",
  },
  {
    name: "Black Friday",
    match: (date) => date.getMonth() === 10 && nthWeekdayOfMonth(date) === 4 && date.getDay() === 5,
    reason: "Black Friday, and the registry will turn into a competitive sport",
  },
  {
    name: "Cyber Monday",
    match: (date) => {
      const lastFriday = lastWeekdayInMonth(date.getFullYear(), 10, 5);
      const cyberMonday = addDays(lastFriday, 3);
      return sameDate(date, cyberMonday);
    },
    reason: "Cyber Monday, and every vendor website will mysteriously crash",
  },
  {
    name: "Thanksgiving",
    match: (date) => date.getMonth() === 10 && nthWeekdayOfMonth(date) === 4 && date.getDay() === 4,
    reason: "US Thanksgiving, and the American relatives are legally unavailable",
  },
  {
    name: "World Beard Day",
    match: (date) => date.getMonth() === 8 && nthWeekdayOfMonth(date) === 1 && date.getDay() === 6,
    reason: "World Beard Day, and the groom's party grooming timeline collapses",
  },
];

const catchAllReasons = [
  "Mercury has not submitted a vendor insurance certificate",
  "the seating chart font has entered mediation",
  "the group chat will need at least six more business days to overreact",
  "the celebrant has a suspiciously specific brunch conflict",
  "the florist says that is a 'premium emotion' date",
  "the venue coordinator used the phrase 'bespoke surcharge'",
  "the good napkins are apparently seasonal",
  "someone's cousin has a milestone birthday, probably",
  "the weather app is giving too many opinions",
  "the cake tasting would clash with pretending to save money",
  "the DJ needs time to remove three forbidden songs from the playlist",
  "the printer is spiritually opposed to place cards that day",
  "the spreadsheet has circular references and so does the family",
  "the bridal party has reached its maximum weekly admin load",
  "the ring bearer logistics require a royal commission",
  "the invitation envelopes are still in their healing era",
  "the hotel block says 'limited availability' in a threatening tone",
  "the confetti supplier is observing a personal day",
  "the menu tasting would become a hostage negotiation",
  "the best man speech is still legally too long",
  "the dance floor needs more time to accept its fate",
  "the dress code discourse has not cooled below room temperature",
  "the aisle runner is having second thoughts",
  "the honeymoon flights are doing surge pricing theatre",
  "the centrepieces require a level of confidence nobody has earned",
  "the family photo list is still missing three important grudges",
  "the reception timeline has developed side quests",
  "the RSVP deadline would become a suggestion, not a deadline",
  "the gift registry is pretending a toaster is a personality",
  "the vows need another pass for jokes that will survive grandparents",
  "the hair trial cannot be rushed by mere love",
  "the makeup trial has requested better lighting and fewer opinions",
  "the bar tab has seen the guest list and resigned",
  "the parking situation has become a philosophical problem",
  "the wet-weather plan is just optimism wearing a blazer",
  "the photo booth props are still negotiating custody",
  "the seating plan puts two aunties within tactical range",
  "the candle budget has exceeded the GDP of a small reception",
  "the flower girl basket is missing its emotional support ribbon",
  "the recovery brunch cannot recover from that date",
];

function normaliseDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return normaliseDate(copy);
}

function sameDate(first, second) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function daysBetween(start, end) {
  return Math.round((normaliseDate(end) - normaliseDate(start)) / dayMs);
}

function randomDateInWindow() {
  const today = normaliseDate(new Date());
  const end = new Date(today);
  end.setFullYear(end.getFullYear() + 2);
  const offset = Math.floor(Math.random() * (daysBetween(today, end) + 1));
  return addDays(today, offset);
}

function nthWeekdayOfMonth(date) {
  return Math.ceil(date.getDate() / 7);
}

function isLastWeekdayOfMonth(date, weekday) {
  if (date.getDay() !== weekday) return false;
  return addDays(date, 7).getMonth() !== date.getMonth();
}

function lastWeekdayInMonth(year, month, weekday) {
  const date = new Date(year, month + 1, 0, 12);
  while (date.getDay() !== weekday) {
    date.setDate(date.getDate() - 1);
  }
  return normaliseDate(date);
}

function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day, 12);
}

function orthodoxEasterSunday(year) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const julianMonth = Math.floor((d + e + 114) / 31);
  const julianDay = ((d + e + 114) % 31) + 1;
  const gregorianOffset = year >= 2100 ? 14 : 13;
  return addDays(new Date(year, julianMonth - 1, julianDay, 12), gregorianOffset);
}

function movableReasonsForYear(year) {
  const easter = easterSunday(year);
  const orthodoxEaster = orthodoxEasterSunday(year);
  const kingsBirthdayNsw = (() => {
    const juneFirst = new Date(year, 5, 1, 12);
    const offset = (8 - juneFirst.getDay()) % 7;
    return addDays(juneFirst, offset + 7);
  })();

  return [
    [addDays(easter, -2), "Good Friday, and even the calendar is taking a solemn long weekend"],
    [addDays(easter, -1), "Easter Saturday, and the chocolate logistics are already strained"],
    [easter, "Easter Sunday, and the family lunch has seniority"],
    [addDays(easter, 1), "Easter Monday, so everyone is recovering from long-weekend confidence"],
    [orthodoxEaster, "Greek Orthodox Easter, and the lamb has right of way"],
    [addDays(orthodoxEaster, -2), "Greek Orthodox Good Friday, so the date is off limits"],
    [kingsBirthdayNsw, "the King's Birthday public holiday in NSW, and the long weekend outranks romance"],
  ];
}

function getDateReason(date) {
  const specificMatch = specificDateReasons.find(([year, month, day]) => {
    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
  });
  if (specificMatch) return specificMatch[3];

  const exactMatch = fixedDateReasons.find(([month, day]) => {
    return date.getMonth() + 1 === month && date.getDate() === day;
  });
  if (exactMatch) return exactMatch[2];

  const movableMatch = movableReasonsForYear(date.getFullYear()).find(([eventDate]) =>
    sameDate(date, eventDate),
  );
  if (movableMatch) return movableMatch[1];

  const weeklyMatch = weekPatternRules.find((rule) => rule.match(date));
  if (weeklyMatch) return weeklyMatch.reason;

  if (date.getDate() === 13 && date.getDay() === 5) {
    return "Friday the 13th, and the venue contract just hissed quietly";
  }
  if (date.getDate() === 1) {
    return "the first of the month, and rent has already taken the good vibes";
  }
  if (date.getDate() === new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
    return "the last day of the month, and everyone will say 'next month is less busy'";
  }
  if (date.getDay() === 6) {
    return "a Saturday, which means every wedding vendor is booked or lying";
  }
  if (date.getDay() === 0) {
    return "a Sunday, and nobody wants to iron a shirt with the Monday scaries watching";
  }

  const dayIndex = daysBetween(new Date(date.getFullYear(), 0, 1, 12), date);
  return catchAllReasons[dayIndex % catchAllReasons.length];
}

function renderCandidate(date, spinning = false) {
  dateDisplay.textContent = formatter.format(date);
  dateDisplay.classList.toggle("is-spinning", spinning);
  dateMeta.textContent = `Between ${shortFormatter.format(normaliseDate(new Date()))} and ${shortFormatter.format(
    twoYearsFromToday(),
  )}`;
}

function twoYearsFromToday() {
  const today = normaliseDate(new Date());
  const end = new Date(today);
  end.setFullYear(end.getFullYear() + 2);
  return normaliseDate(end);
}

function addRejection(date, reason) {
  if (rejectList.querySelector(".empty-state")) {
    rejectList.innerHTML = "";
  }

  const item = document.createElement("li");
  const dateLine = document.createElement("span");
  const reasonLine = document.createElement("span");
  dateLine.className = "reject-date";
  reasonLine.className = "reject-reason";
  dateLine.textContent = formatter.format(date);
  reasonLine.textContent = reason;
  item.append(dateLine, reasonLine);
  rejectList.prepend(item);

  rejectionTotal += 1;
  rejectCount.textContent = String(rejectionTotal);

  while (rejectList.children.length > 8) {
    rejectList.lastElementChild.remove();
  }
}

function pickDate() {
  clearInterval(spinTimer);
  pickButton.disabled = true;
  pickButton.querySelector("span:last-child").textContent = "Consulting excuses...";
  reasonText.classList.remove("has-result");
  reasonText.textContent = "Checking public holidays, family politics, weather omens and sport fixtures.";

  let ticks = 0;
  const maxTicks = 24 + Math.floor(Math.random() * 14);

  spinTimer = window.setInterval(() => {
    ticks += 1;
    renderCandidate(randomDateInWindow(), true);

    if (ticks >= maxTicks) {
      clearInterval(spinTimer);
      const finalDate = randomDateInWindow();
      const reason = getDateReason(finalDate);
      renderCandidate(finalDate, false);
      reasonText.textContent = `Uh oh, that's ${reason}. Better pick again.`;
      reasonText.classList.add("has-result");
      addRejection(finalDate, reason);
      pickButton.disabled = false;
      pickButton.querySelector("span:last-child").textContent = "Pick again";
    }
  }, 58);
}

pickButton.addEventListener("click", pickDate);
dateMeta.textContent = `Between ${shortFormatter.format(normaliseDate(new Date()))} and ${shortFormatter.format(
  twoYearsFromToday(),
)}`;
