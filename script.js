const dateDisplay = document.querySelector("#dateDisplay");
const pickButton = document.querySelector("#pickButton");
const reasonText = document.querySelector("#reasonText");
const rejectionsPanel = document.querySelector(".rejections-panel");
const rejectToggle = document.querySelector("#rejectToggle");
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
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let rejectionTotal = 0;
let spinTimer = 0;
let audioContext = null;

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
  [2026, 3, 7, "a Canberra Raiders game day against the Sea Eagles, and someone will check the score during the vows"],
  [2026, 3, 8, "Collingwood's Opening Round game against St Kilda, and the Magpie Army has already taken the MCG hostage"],
  [2026, 3, 13, "a Canberra Raiders game day in New Zealand, and the timezone excuse is too good to waste"],
  [2026, 3, 14, "a double booking with both Wests Tigers and Collingwood game days, so the sports fans are unusable"],
  [2026, 3, 19, "a Canberra Raiders game day against the Bulldogs, and the green-machine contingent will be emotionally unavailable"],
  [2026, 3, 21, "a Wests Tigers game day, and hope is a full-contact sport"],
  [2026, 3, 27, "a Wests Tigers game day in Auckland, and the group chat will become a live ladder predictor"],
  [2026, 3, 29, "a Canberra Raiders Sunday game, which is basically a formal objection"],
  [2026, 4, 2, "Collingwood playing Brisbane on Easter Thursday, and the Pies fans have already left spiritually"],
  [2026, 4, 5, "a Canberra Raiders game day, and Newcastle away trips create too many alibis"],
  [2026, 4, 6, "a Wests Tigers Easter Monday game, and that is already a family argument with studs"],
  [2026, 4, 10, "Collingwood at Gather Round, and every South Australian venue has declared a footy emergency"],
  [2026, 4, 11, "a Canberra Raiders game day in Perth, and the travel budget just made a noise"],
  [2026, 4, 12, "a Wests Tigers game day, and nobody can process Sunday vows plus Sunday football"],
  [2026, 4, 16, "Collingwood v Carlton, and that rivalry cannot be seated politely"],
  [2026, 4, 17, "a Canberra Raiders game day, and Storm week makes everyone weirdly tense"],
  [2026, 4, 18, "a Wests Tigers game day, and Campbelltown has prior emotional custody"],
  [2026, 4, 23, "Wests Tigers v Canberra Raiders, so the wedding would be the undercard"],
  [2026, 4, 25, "Anzac Day and Essendon v Collingwood, so the calendar has already filed an objection"],
  [2026, 4, 30, "Collingwood v Hawthorn at the MCG, and the old-footy grudges need the room"],
  [2026, 5, 2, "a Canberra Raiders game day, and the Titans fixture is apparently non-negotiable"],
  [2026, 5, 3, "a Wests Tigers game day, and the Sharks have already eaten the timeline"],
  [2026, 5, 9, "Geelong v Collingwood, and the Pies fans will treat the drive like a pilgrimage"],
  [2026, 5, 10, "both Raiders and Wests Tigers game day, which is too much rugby league for one guest list"],
  [2026, 5, 16, "a Wests Tigers Magic Round game day, and Brisbane has stolen all the hotel rooms"],
  [2026, 5, 21, "a Canberra Raiders Thursday night game, which means Friday morning apologies"],
  [2026, 5, 23, "Collingwood v West Coast, and the Magpie Army has booked the noise allocation"],
  [2026, 5, 30, "a Wests Tigers game day, and the reception playlist cannot compete with a Bulldogs match"],
  [2026, 5, 31, "a Canberra Raiders Sunday game, and the green jumpers have right of way"],
  [2026, 6, 5, "a Canberra Raiders game day against the Roosters, and the sports argument will dress itself as analysis"],
  [2026, 6, 7, "a Wests Tigers game day, and also the eve of Collingwood's Big Freeze appointment"],
  [2026, 6, 8, "Collingwood v Melbourne in the King's Birthday Big Freeze match, and the calendar is already wearing a beanie"],
  [2026, 6, 13, "a Canberra Raiders game day, and Parramatta away fixtures are basically a logistics trap"],
  [2026, 6, 14, "a Wests Tigers game day, and Leichhardt Oval has the guest list by the throat"],
  [2026, 6, 20, "both Wests Tigers and Collingwood game day, so the ceremony would need live score breaks"],
  [2026, 6, 21, "a Canberra Raiders game day, and the Sunday afternoon slot owns the couch"],
  [2026, 6, 27, "Collingwood v Richmond at the MCG, and the black-and-white noise will drown the vows"],
  [2026, 6, 28, "both Raiders and Wests Tigers game day, which is a double-booked excuse with studs on"],
  [2026, 7, 4, "both Wests Tigers and Collingwood game day, and the fixture computer clearly hates romance"],
  [2026, 7, 10, "both Wests Tigers and Collingwood game day, so the date is already at capacity"],
  [2026, 7, 11, "a Canberra Raiders game day, and Bulldogs away will create too many score-checkers"],
  [2026, 7, 18, "both Raiders, Wests Tigers and Collingwood game day, which is legally too much football"],
  [2026, 7, 23, "Adelaide v Collingwood, and Thursday-night Pies discourse cannot be contained"],
  [2026, 7, 25, "Raiders v Wests Tigers, so the wedding would be a curtain-raiser with centrepieces"],
  [2026, 7, 30, "Collingwood v Geelong on a Thursday night, and every neutral guest will stop being neutral"],
  [2026, 8, 1, "a Canberra Raiders game day in Mudgee, and the away-trip excuses are already packed"],
  [2026, 8, 2, "a Wests Tigers Sunday game, and the group chat has chosen footy"],
  [2026, 8, 9, "both Raiders and Collingwood game day, and nobody can serve canapes through that much tension"],
  [2026, 8, 15, "a Canberra Raiders game day, and the Sharks fixture has swallowed the afternoon"],
  [2026, 8, 16, "a Wests Tigers game day, and Dragons week is not emotionally wedding-compatible"],
  [2026, 8, 21, "a Canberra Raiders game day against the Broncos, and Friday night football has veto power"],
  [2026, 8, 23, "a Wests Tigers game day against the Roosters, and brunch recovery is already doomed"],
  [2026, 8, 29, "a Wests Tigers game day in Townsville, and the travel excuse is airtight"],
  [2026, 9, 5, "a Canberra Raiders game day in Townsville, and finals maths will be too loud"],
  [2026, 9, 6, "a Wests Tigers game day, and nobody wants Panthers-related stress near the cake"],
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

const anniversaryDateReasons = [
  [1, 3, "J.R.R. Tolkien's birthday, and someone will try to make the vows 14 hours long"],
  [1, 8, "Elvis Presley's birthday, and the celebrant might enter by jumpsuit"],
  [1, 10, "Tintin first appeared in print, and every clue says this date is cursed"],
  [1, 15, "Wikipedia Day, so every relative will edit the facts in real time"],
  [1, 19, "Dolly Parton's birthday, and the bar for rhinestones is too high"],
  [1, 24, "International Day of Education, and nobody wants a pop quiz on table numbers"],
  [1, 28, "Data Privacy Day, so the guest list cannot be shared with the caterer yet"],
  [2, 1, "Harry Styles' birthday, and the playlist would become a constitutional issue"],
  [2, 3, "the day the music died, and the DJ has taken that personally"],
  [2, 7, "Charles Dickens' birthday, so the invoice will arrive in three volumes"],
  [2, 10, "Lunar New Year season more often than not, and the calendar refuses to explain itself calmly"],
  [2, 15, "Singles Awareness Day, which is a hostile environment for plus-one negotiations"],
  [2, 18, "Pluto's discovery anniversary, and even planets get demoted on this date"],
  [2, 23, "International Dog Biscuit Appreciation Day, so the pet table has prior claims"],
  [2, 29, "leap day, and anniversaries every four years are too economical to be trusted"],
  [3, 2, "Dr Seuss's birthday, and rhyming vows are not covered by insurance"],
  [3, 7, "Alexander Graham Bell Day, and everyone will call during the ceremony"],
  [3, 10, "Mario Day, and the ring bearer will demand a karting entrance"],
  [3, 12, "the World Wide Web's birthday, so the livestream will absolutely fail"],
  [3, 15, "the Ides of March, and stabbing the seating plan in the back is too literal"],
  [3, 18, "Global Recycling Day, and reusing this excuse is sustainable"],
  [3, 23, "World Meteorological Day, meaning the weather gets a formal vote"],
  [3, 27, "World Theatre Day, and the speeches are dramatic enough already"],
  [4, 3, "Find a Rainbow Day, and the photographer will chase lighting until midnight"],
  [4, 8, "Draw a Bird Day, and the invitation designer cannot be given ideas"],
  [4, 12, "International Day of Human Space Flight, and the budget is already in orbit"],
  [4, 15, "Tax Day in the US, and the accountant guests are emotionally audited"],
  [4, 18, "World Heritage Day, so the old family grudges are demanding protection"],
  [4, 26, "Richter Scale Day, and the dance floor cannot pass seismic certification"],
  [5, 2, "World Tuna Day, and seafood jokes have been banned from the speeches"],
  [5, 3, "World Press Freedom Day, so the auntie newsletter cannot be restrained"],
  [5, 6, "International No Diet Day, and the cake tasting needs sacred space"],
  [5, 10, "World Lupus Day, and the date deserves more care than canape panic"],
  [5, 15, "International Day of Families, and yours has enough agenda items already"],
  [5, 18, "International Museum Day, so every family story becomes an exhibit"],
  [5, 22, "World Goth Day, and the dress code will lose a negotiation"],
  [5, 24, "World Schizophrenia Awareness Day, and the calendar says choose thoughtfully"],
  [5, 28, "Amnesty International's founding anniversary, and several guests need pardons"],
  [6, 2, "International Sex Workers' Day, so the date is reserved for adult conversations"],
  [6, 3, "World Bicycle Day, and the transport plan has too many moving parts"],
  [6, 6, "D-Day anniversary, so the date already carries enough history"],
  [6, 9, "Donald Duck's screen debut anniversary, and one more formal outfit joke is too many"],
  [6, 13, "World Softball Day, and throwing the bouquet is already sport enough"],
  [6, 16, "Bloomsday, so the speeches would become modernist and impossible to follow"],
  [6, 18, "International Sushi Day, and the caterer will try to upsell tiny boats"],
  [6, 23, "International Women in Engineering Day, and the seating plan needs a structural engineer"],
  [6, 26, "International Day Against Drug Abuse and Illicit Trafficking, so skip the suspicious bucks-party energy"],
  [7, 2, "World UFO Day, and there are already enough unidentified relatives"],
  [7, 6, "International Kissing Day, which is far too on the nose"],
  [7, 10, "Nikola Tesla's birthday, so the lighting technician gets too much power"],
  [7, 12, "Malala Day, and the date deserves a better cause than centrepieces"],
  [7, 16, "World Snake Day, and the guest list has enough hissy behaviour"],
  [7, 18, "Nelson Mandela International Day, so the date needs respect, not chair-cover discourse"],
  [7, 22, "Pi Approximation Day, and the cake fractions will become political"],
  [7, 29, "NASA's founding anniversary, and the budget has already left the atmosphere"],
  [8, 3, "Watermelon Day, and the summer-themed favours would get out of hand"],
  [8, 5, "Neil Armstrong's birthday, and one small step down the aisle is too easy a line"],
  [8, 8, "International Cat Day, and the pet-sitter economy has collapsed"],
  [8, 14, "World Lizard Day, and the groomsmen are already giving reptile energy"],
  [8, 16, "National Rum Day in the US, and the bar tab cannot hear about it"],
  [8, 21, "World Senior Citizens Day, and every grandparent has earned veto rights"],
  [8, 24, "Pluto Demotion Day, which proves labels can change at the last minute"],
  [8, 28, "the anniversary of Martin Luther King Jr's 'I Have a Dream' speech, so do not waste it on bonbonniere"],
  [9, 5, "World Beard Day weekend territory, and the groom prep becomes unstable"],
  [9, 10, "World Suicide Prevention Day, so the date deserves care and space"],
  [9, 12, "International Day of the World's Indigenous Peoples season is still in the calendar's notes"],
  [9, 15, "Wikipedia's birthday in Scots? Close enough for someone online to argue"],
  [9, 18, "International Observe the Moon Night territory, and the photographer will overpromise"],
  [9, 23, "International Day of Sign Languages, and the dance-floor signals are already confusing"],
  [9, 26, "the usual AFL Grand Final danger zone, and Melbourne calendars have trauma"],
  [9, 29, "International Coffee Day eve, and nobody should commit before caffeine"],
  [10, 2, "International Day of Non-Violence, and the seating chart is not compliant"],
  [10, 6, "Mad Hatter Day, and the hats would become a liability"],
  [10, 9, "World Post Day, so the invitations would finally arrive and ruin the surprise"],
  [10, 12, "Hugh Jackman's birthday, and someone will request a musical number"],
  [10, 14, "World Standards Day, and the dress code fails certification"],
  [10, 20, "World Statistics Day in some years, and the RSVP sample size is unacceptable"],
  [10, 25, "Pablo Picasso's birthday, and the seating plan is already cubist"],
  [10, 30, "Mischief Night, and the bucks party cannot be trusted near it"],
  [11, 3, "Sandwich Day, and the late-night snack station will steal the reception"],
  [11, 7, "Marie Curie's birthday, so the chemistry jokes become unbearable"],
  [11, 10, "Sesame Street's premiere anniversary, and counting guests is hard enough"],
  [11, 14, "World Diabetes Day, so dessert planning needs actual care"],
  [11, 17, "International Students' Day, and half the cousins have exams in spirit"],
  [11, 23, "Fibonacci Day, and the table layout will spiral"],
  [11, 27, "Jimi Hendrix's birthday, and the guitarist will request a solo nobody approved"],
  [12, 2, "Britney Spears' birthday, and one more 'Toxic' request will break the DJ"],
  [12, 4, "International Cheetah Day, and the day is moving too fast already"],
  [12, 8, "Pretend to Be a Time Traveler Day, and late RSVPs will abuse the concept"],
  [12, 12, "Frank Sinatra's birthday, and the first dance will get standards it cannot meet"],
  [12, 15, "International Tea Day, and the family gossip service is fully booked"],
  [12, 18, "International Migrants Day, so airport logistics have a formal say"],
  [12, 23, "Festivus, and the airing of grievances would consume the reception"],
  [12, 29, "Tick Tock Day, and the wedding countdown is already too smug"],
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

const catchAllReasonMakers = [
  (date) => `the ${ordinal(date.getDate())} of ${monthNames[date.getMonth()]}, and ordinal dates make the invitation typography look smug`,
  (date) => `${formatter.format(date)} is exactly ${daysBetween(startOfYear(date), date) + 1} days into the year, which is too numerically specific to ignore`,
  (date) => `week ${weekOfYear(date)} of ${date.getFullYear()}, and the spreadsheet says that week is already emotionally overbooked`,
  (date) => `a ${weekdayName(date)}, and ${weekdayName(date)} weddings are how group chats become evidence`,
  (date) => `only ${daysUntilEndOfMonth(date)} days before ${monthNames[date.getMonth()]} ends, so everyone will say "let's just wait until next month"`,
  (date) => `${daysSinceMonthStarted(date)} days into ${monthNames[date.getMonth()]}, which is too early for invoices and too late for optimism`,
  (date) => `the ${ordinal(nthWeekdayOfMonth(date))} ${weekdayName(date)} in ${monthNames[date.getMonth()]}, and that is suspiciously niche`,
  (date) => `in ${seasonForDate(date)}, and ${seasonForDate(date)} has already lodged a weather objection`,
  (date) => `a date with digits adding to ${dateDigitSum(date)}, and the numerology auntie has concerns`,
  (date) => `${Math.abs(daysBetween(date, twoYearsFromToday()))} days before the two-year cutoff, which is cutting it emotionally fine`,
  (date) => `too close to the ${monthNames[date.getMonth()]} calendar-page turn, and nobody has the stamina for a new tab`,
  (date) => `the kind of ${weekdayName(date)} where people say "quick one" and disappear for six hours`,
  (date) => `${monthNames[date.getMonth()]} already has public-holiday energy, even when it technically does not`,
  (date) => `a ${date.getFullYear()} date, and the save-the-date magnet budget has not approved those digits`,
  (date) => `the ${ordinal(date.getDate())}, which is too close to someone's rent, payday, or mysterious direct debit`,
  (date) => `one of those ${monthNames[date.getMonth()]} dates where venues start saying "limited seasonal availability"`,
  (date) => `a date whose ISO code is ${toIsoDate(date)}, and nobody wants a wedding that looks like a software ticket`,
  (date) => `${weekdayName(date)} the ${ordinal(date.getDate())}, which sounds like a cursed children's book title`,
  (date) => `inside quarter ${Math.floor(date.getMonth() / 3) + 1}, and quarterly planning has already ruined enough lives`,
  (date) => `close enough to ${monthNames[(date.getMonth() + 1) % 12]} for everyone to suggest moving it there instead`,
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

function startOfYear(date) {
  return new Date(date.getFullYear(), 0, 1, 12);
}

function weekdayName(date) {
  return new Intl.DateTimeFormat("en-AU", { weekday: "long" }).format(date);
}

function ordinal(value) {
  const suffixes = ["th", "st", "nd", "rd"];
  const teen = value % 100;
  return `${value}${suffixes[(teen - 20) % 10] || suffixes[teen] || suffixes[0]}`;
}

function weekOfYear(date) {
  return Math.ceil((daysBetween(startOfYear(date), date) + startOfYear(date).getDay() + 1) / 7);
}

function daysUntilEndOfMonth(date) {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 12);
  return daysBetween(date, lastDay);
}

function daysSinceMonthStarted(date) {
  return date.getDate() - 1;
}

function seasonForDate(date) {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "autumn";
  if (month >= 5 && month <= 7) return "winter";
  if (month >= 8 && month <= 10) return "spring";
  return "summer";
}

function dateDigitSum(date) {
  return toIsoDate(date)
    .replaceAll("-", "")
    .split("")
    .reduce((total, digit) => total + Number(digit), 0);
}

function toIsoDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function randomDateInWindow() {
  const today = normaliseDate(new Date());
  const end = new Date(today);
  end.setFullYear(end.getFullYear() + 2);
  const offset = Math.floor(Math.random() * (daysBetween(today, end) + 1));
  return addDays(today, offset);
}

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playTone({ frequency, duration, type = "sine", gain = 0.08, slideTo = null }) {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const volume = context.createGain();
  const now = context.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
  }

  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(volume);
  volume.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playSpinTick(tick) {
  playTone({
    frequency: tick % 2 === 0 ? 540 : 680,
    duration: 0.035,
    type: "square",
    gain: 0.035,
  });
}

function playRejectBuzz() {
  playTone({ frequency: 180, slideTo: 90, duration: 0.34, type: "sawtooth", gain: 0.13 });
  window.setTimeout(() => {
    playTone({ frequency: 120, slideTo: 70, duration: 0.22, type: "sawtooth", gain: 0.11 });
  }, 120);
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

  const exactMatch = [...fixedDateReasons, ...anniversaryDateReasons].find(([month, day]) => {
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
  return catchAllReasonMakers[dayIndex % catchAllReasonMakers.length](date);
}

function renderCandidate(date, spinning = false) {
  const dateText = formatter.format(date);
  dateDisplay.textContent = dateText;
  dateDisplay.classList.toggle("is-spinning", spinning);
  dateDisplay.classList.toggle("is-long", dateText.length > 25);
  if (spinning) dateDisplay.classList.remove("is-rejected");
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

function toggleRejectedDates() {
  const expanded = rejectToggle.getAttribute("aria-expanded") === "true";
  rejectToggle.setAttribute("aria-expanded", String(!expanded));
  rejectList.hidden = expanded;
  rejectionsPanel.classList.toggle("is-collapsed", expanded);
}

function pickDate() {
  clearInterval(spinTimer);
  getAudioContext();
  pickButton.disabled = true;
  pickButton.querySelector("span:last-child").textContent = "Consulting excuses...";
  dateDisplay.classList.remove("is-rejected");
  reasonText.classList.remove("has-result");
  reasonText.textContent = "Checking public holidays, family politics, weather omens and sport fixtures.";

  let ticks = 0;
  const maxTicks = 24 + Math.floor(Math.random() * 14);

  spinTimer = window.setInterval(() => {
    ticks += 1;
    renderCandidate(randomDateInWindow(), true);
    if (ticks % 2 === 0) {
      playSpinTick(ticks);
    }

    if (ticks >= maxTicks) {
      clearInterval(spinTimer);
      const finalDate = randomDateInWindow();
      const reason = getDateReason(finalDate);
      renderCandidate(finalDate, false);
      dateDisplay.classList.add("is-rejected");
      playRejectBuzz();
      reasonText.textContent = `Uh oh, that's ${reason}. Better pick again.`;
      reasonText.classList.add("has-result");
      addRejection(finalDate, reason);
      pickButton.disabled = false;
      pickButton.querySelector("span:last-child").textContent = "Pick again";
    }
  }, 58);
}

pickButton.addEventListener("click", pickDate);
rejectToggle.addEventListener("click", toggleRejectedDates);
