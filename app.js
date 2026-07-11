import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBW8UgrlPfScBljKTEU2nxvZcQk4soGCyA",
  authDomain: "postavy-redm-2-0.firebaseapp.com",
  projectId: "postavy-redm-2-0",
  storageBucket: "postavy-redm-2-0.firebasestorage.app",
  messagingSenderId: "471320391062",
  appId: "1:471320391062:web:497240a0d1ccc4b769c1b7"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const statesRef = collection(db, "characterStates");
const eventsRef = collection(db, "characterEvents");
const localStatesKey = "croweFamily2CharacterStates";
const localEventsKey = "croweFamily2CharacterEvents";
const adminDiscordId = "417061947759001600";

const characters = [
  {
    id: "zeke",
    discordId: "417061947759001600",
    listName: "Ezekiel",
    name: "Ezekiel “Zeke” Crowe",
    role: "Psanec / samotářský tulák",
    age: "36 let",
    origin: "Louisiana",
    year: "1899",
    statusText: "Na útěku",
    portrait: "images/zeke.png",
    overview: "Tichý, nebezpečný a kontrolovaný muž, který přežil vlastní smrt a je pronásledován svou minulostí. Ezekiel “Zeke” Crowe přichází rokem 1899 jako psanec bez domova, bez klidu a bez odpovědí, které už roky hledá.",
    overviewBlocks: [
      { title: "Současnost", text: "Bez domova, bez jistoty a bez místa, kde by mohl zakotvit. Žije na cestě a drží se stranou lidí i zákona." },
      { title: "Motivace", text: "Přežít, zjistit pravdu o noci roku 1895 a najít člověka nebo zradu, která všechno spustila." }
    ],
    lore: `Ezekiel “Zeke” Crowe se narodil roku 1866 v Louisianě, krátce po konci občanské války. Přišel na svět v zapadlé oblasti u bažin, daleko od bohatství, zákona i naděje na lepší život. Jeho dětství nebylo ničím jiným než bojem o přežití. Otec byl násilnický opilec, který pracoval jen tehdy, když musel, a většinu času topil vztek v lahvi. Matka byla tichá a zlomená žena, která jednoho dne prostě zmizela. Nikdo ji nikdy nehledal a nikdo Zekovi nikdy neřekl, co se s ní skutečně stalo.

Už jako dítě působil Zeke jinak než ostatní. Neplakal, ani když měl. Nedával najevo strach, ani když ho ostatní cítili až v kostech. Brzy pochopil, že ve světě, kde vyrůstal, je slabost pozvánka k utrpení. Naučil se krást, prát se a přežít bez pomoci druhých. Ve věku kolem třinácti let poprvé někoho vážně zranil. Neudělal to ze zuřivosti, ale z chladného rozhodnutí. A právě tehdy se v něm něco zlomilo natrvalo.

Když dospíval, zmizel z rodného kraje a přidal se ke skupině psanců. Nebyla to ale obyčejná banda zlodějů a opilců. Byli to muži, kteří nechtěli jen peníze. Bavilo je šířit strach, ovládat ostatní a ukazovat, že zákon končí tam, kde začíná jejich vůle. Zeke mezi ně zapadl až příliš snadno. Nemluvil zbytečně, nikdy neváhal a při násilí působil až nepřirozeně klidně. Ostatní v bandě si ho postupně začali vážit, ale zároveň se ho báli.

Pak přišel rok 1895. Noc, která ho změnila navždy. Banda tábořila daleko od civilizace, když přišlo ticho, výstřely a oheň. Tábor se proměnil v peklo. Muži umírali ve zmatku, křiku a plamenech. Ráno po útoku nezůstalo nic než spálené dřevo, mrtvá těla a pach krve. Všichni byli považováni za mrtvé. I Zeke.

Byl nalezen mezi ostatními, bez známek života, těžce raněný a popálený. Jenže nějakým způsobem přežil. Nikdo přesně neví jak. A možná to neví ani on sám. Probral se jako člověk, který sice dýchá, ale část jeho duše v tom ohni už zůstala navždy.

Do roku 1899 tak přichází jako muž bez domova, bez skutečné minulosti, kterou by chtěl vyprávět, a bez budoucnosti, kterou by si plánoval. Navenek působí klidně, tiše a ovládaně. Uvnitř je ale plný prázdna, vzteku a neklidu, který se nikdy úplně neztiší.`,
    appearance: "Vysoký, hubený, ale pevný muž s ostře řezanými rysy. Tmavé oči, chladný a prázdný pohled, který je ostatním nepříjemný. Přes pravé oko se táhne výrazná jizva a na kůži jsou jemné stopy starých popálenin. Nosí středně dlouhé tmavé vlasy, vousy, dlouhý tmavý kabát, černou košili, vestu a opotřebovaný klobouk.",
    personality: "Tichý, nebezpečný a kontrolovaný. Nemluví zbytečně a nikdy nezvyšuje hlas, protože nepotřebuje křik, aby vzbudil respekt. Jedná promyšleně a v lidech vyvolává napětí už jen svou přítomností.",
    quote: "„Muž, který přežil vlastní smrt a od té doby hledí na svět, jako by se do něj už nikdy úplně nevrátil.“"
  },
  {
    id: "violet",
    discordId: "795365012494483486",
    listName: "Violet",
    name: "Violet Crowe",
    role: "Manipulátorka / střelkyně / stratég",
    age: "24 let",
    origin: "Louisiana",
    year: "1899",
    statusText: "Ve stínu",
    portrait: "images/Violet.png",
    overview: "Violet Crowe je nejmladší ze sourozenců Croweových. Vyrůstala ve světě, kde přežití bylo důležitější než nevinnost. Je tichá, bystrá a nebezpečně klidná.",
    overviewBlocks: [
      { title: "Vztahy", text: "K Zekemu cítí respekt a vidí v něm člověka, který jí rozumí beze slov. Silase respektuje, ale ví, že si před ním musí hlídat i to, co zůstane nevyřčené." },
      { title: "Motivace", text: "Udržet si svobodu, chránit svůj klid a přežít bez toho, aby ji někdo znovu proměnil v nástroj pro cizí vůli." }
    ],
    lore: `Violet Crowe vyrůstala s vědomím, že chyba může člověka stát víc než jen bolest. Jako nejmladší ze sourozenců Croweových se brzy naučila pozorovat, skrývat emoce a odhadovat nebezpečí dřív, než dostane jméno.

Naučila se spíš číst ticho než slova. Když ostatní křičeli, mlčela. Když se kolem ní lidé snažili získat převahu silou, hledala slabé místo v jejich jistotě. Právě proto je nebezpečná jinak než Zeke nebo Silas. Nepotřebuje být nejhlasitější v místnosti. Stačí jí vědět, co kdo chce, čeho se bojí a kdy ztratí kontrolu.

William Hart se pro ni stal někým, komu dokázala věřit víc než ostatním. Ne proto, že by ji zachránil, ale protože se ji nikdy nepokusil vlastnit. Jejich pouto je tiché, komplikované a pevné právě tím, že stojí na respektu.

V roce 1899 působí Violet jako žena, která se pohybuje mezi lidmi s opatrností i jistotou. Umí manipulovat, dokáže získat důvěru během několika minut a když už musí sáhnout po zbrani, většinou je pozdě na lítost.`,
    appearance: "Štíhlá žena vysoká 165 cm s tmavými vlasy, bledší tváří a neklidným, přesto soustředěným pohledem. Nosí tmavé elegantní oblečení s fialovými detaily, praktický pásek se zbraní a doplňky, které působí jemně, dokud si člověk nevšimne, jak připravená ve skutečnosti je.",
    personality: "Výborná v manipulaci a čtení lidí. Dokáže získat důvěru během několika minut, skvěle pozoruje okolí a umí lhát bez emocí. Preferuje slova před zbraní, ale není bezbranná.",
    quote: "„Lidé říkají mnohem víc, když si myslí, že neposloucháš.“"
  },
  {
    id: "william",
    discordId: "550294660090691594",
    listName: "William",
    name: "William Hart",
    role: "Vyjednavač / ochránce / stratég",
    age: "28 let",
    origin: "Texas",
    year: "1899",
    statusText: "Připravený",
    portrait: "images/William.png",
    overview: "William Hart je klidný, silný a spolehlivý muž, který si prošel světem obchodu, dluhů i zrad. Naučil se spoléhat jen na sebe, svou hlavu a klid v každé situaci.",
    overviewBlocks: [
      { title: "Vztahy", text: "Violet je jeho snoubenka a člověk, kterému důvěřuje víc než komukoli jinému. Miluje ji, ale nikdy by ji k ničemu nenutil a respektuje její sílu i temnotu." },
      { title: "Motivace", text: "Udržet sebe i své blízké naživu, chránit ty, na kterých mu záleží, a zůstat o krok napřed před lidmi, kteří se nechají ovládat ziskem." }
    ],
    lore: `William Hart pochází z Texasu a už od mládí poznal, že klid bývá v nebezpečném světě cennější než rychlá ruka u zbraně. Nevyrostl jako muž, který touží po slávě. Naučil se pozorovat, naslouchat a číst lidi dřív, než ukážou své skutečné úmysly.

Časem se pohyboval mezi obchodem, dluhy a lidmi, kteří slibovali víc, než kdy mohli splnit. Viděl, jak snadno se z dohody stane past a jak rychle se přátelé mění v nepřátele, když jde o peníze nebo moc. Právě tam se naučil vyjednávat, zachovávat chladnou hlavu i ve chvílích, kdy ostatní sahali po zbrani, a poznat, kdy má slovo větší cenu než výstřel.

Setkal se s Violet v Louisianě během obchodní cesty. Nebylo to přátelství na první pohled, ale něco mezi nimi začalo růst. Když se Violet rozhodla jít s ním, William věděl, že ji nenechá samotnou. Ne proto, že by ji považoval za slabou, ale protože pochopil, že některé pouto se nevyjednává.

Roku 1899 působí jako muž, který mluví málo, ale když už promluví, lidé poslouchají. Je loajální k těm, na kterých mu záleží, a nebezpečný pro každého, kdo by se jim pokusil ublížit.`,
    appearance: "Štíhlý, pevný muž vysoký 185 cm s klidným výrazem, ostrými rysy a tmavým pohledem. Nosí tmavý kabát, vestu, klobouk a oblečení, které působí upraveně, ale ne okázale.",
    personality: "Klidný, trpělivý a rozvážný. William je výborný ve vyjednávání, umí číst lidi i situace a zachovává chladnou hlavu i v nebezpečí.",
    quote: "„Ne každý, kdo mlčí, je slabý. Někdy jen víc pozoruje.“"
  },
  {
    id: "eleanor",
    discordId: "1454130138240520407",
    listName: "Eleanor",
    name: "Eleanor “Ellie” Whitmore",
    role: "Empatická vypravěčka / opora / nový začátek",
    age: "24 let",
    origin: "Springfield",
    year: "1899",
    statusText: "Ve West Havenu",
    portrait: "images/elie.png",
    overview: "Eleanor Whitmore, které blízcí říkají Ellie, je vzdělaná, klidná a empatická žena ze Springfieldu. Do West Havenu přijela, protože věří, že člověk musí někdy riskovat, aby našel štěstí.",
    overviewBlocks: [
      { title: "Základní informace", text: "Narodila se roku 1875 ve Springfieldu. V roce 1899 je jí 24 let. Díky otci obchodníkovi a matce učitelce měla lepší vzdělání než většina žen své doby." },
      { title: "Společný cíl", text: "Nehledá slávu, moc ani problémy. Chce najít místo, kde budoucnost může být lepší než minulost." }
    ],
    lore: `Eleanor Whitmore se narodila roku 1875 ve městě Springfield. Její rodina patřila mezi slušně zajištěné obyvatele města. Otec byl obchodník a matka učitelka. Díky tomu měla Eleanor lepší vzdělání než většina žen své doby.

Naučila se číst, psát a zajímala se o svět kolem sebe. Přesto nikdy netoužila po luxusu. Více než drahé šaty ji zajímali lidé.

Jako mladá dívka byla Eleanor známá svou laskavostí. Pomáhala nemocným sousedům, starala se o děti a často působila jako prostředník při hádkách. Nebyla naivní. Jen věřila, že většina problémů se dá vyřešit rozumným rozhovorem.

Eleanor nikdy nechtěla zůstat celý život ve stejném městě. Chtěla poznat svět a zažít něco nového. Věřila, že člověk musí někdy riskovat, aby našel štěstí.

Do West Havenu přijela s nadšením i obavami. Nové místo znamenalo nové příležitosti, ale také nové nebezpečí. Přesto byla odhodlaná vytvořit si zde domov, ať už budoucnost přinese cokoliv.`,
    appearance: "Působí klidně, pozorně a upraveně bez zbytečného luxusu. Její vzhled stojí spíš na čistotě, jemnosti a soustředěném pohledu než na okázalosti. V lidech často vyvolává pocit, že je opravdu poslouchá.",
    personality: "Klidná, empatická, chytrá, trpělivá a věrná. Eleanor věří v rozhovor a snaží se vidět v lidech to lepší.",
    quote: "„Někdy musí člověk riskovat, aby zjistil, jestli na něj někde čeká domov.“"
  },
  {
    id: "silas",
    discordId: "702917011235143800",
    listName: "Silas",
    name: "Silas “Sil” Crowe",
    role: "Vyjednavač / manipulátor",
    age: "31 let",
    origin: "Louisiana",
    year: "1899",
    statusText: "Hledá pravdu",
    portrait: "images/Silas.png",
    overview: "Silas “Sil” Crowe je mladší bratr Ezekiela Crowea, muž s klidnou tváří a nebezpečně bystrou myslí. Roku 1899 přichází kvůli pravdě o noci, která měla pohřbít jeho bratra.",
    overviewBlocks: [
      { title: "Současnost", text: "Drží se ve stínu, naslouchá, sbírá útržky informací a vstupuje mezi lidi tak nenápadně, že si často ani nevšimnou, kdy začali mluvit víc, než chtěli." },
      { title: "Motivace", text: "Zjistit, kdo naplánoval masakr roku 1895, proč měl Zeke zemřít a co z minulosti zůstalo ukryté i před jeho vlastním bratrem." }
    ],
    lore: `Silas “Sil” Crowe se narodil roku 1868 v Louisianě, ve stejném světě jako jeho starší bratr Ezekiel. Vyrůstali spolu v prostředí, kde nebylo místo pro slabost ani chyby. Jejich otec byl násilnický a nepředvídatelný muž, který si respekt vynucoval silou. Matka byla tichá, zlomená žena, která jednoho dne zmizela beze stopy.

Zatímco Zeke se uzavíral do sebe a učil se přežít v tichu, Silas si zvolil jinou cestu. Naučil se mluvit, přizpůsobovat se a číst lidi kolem sebe. Už jako mladý pochopil, že přežít neznamená jen vydržet bolest, ale také vědět, kdy se usmát, kdy mlčet a kdy říct přesně to, co chce druhý slyšet.

Když Zeke odešel z domova a postupně se dostal mezi psance, Silas zůstal. Ne proto, že by nemohl odejít, ale proto, že pochopil jednu věc: svět nepatří těm, kdo utíkají, ale těm, kdo se naučí hrát jeho hru.

Zpráva o zničení bandy, ve které byl i Zeke, se k němu dostala rychle. Mluvilo se o ohni, krvi a tom, že nikdo nepřežil. Silas tomu věřil alespoň zpočátku. Ale něco mu nesedělo. Znal svého bratra příliš dobře.

Roku 1899 přichází do nového kraje. Klidný, upravený, téměř nenápadný muž, který na první pohled nepůsobí nebezpečně. Ale pod povrchem je někdo, kdo si pamatuje víc, než by měl.`,
    appearance: "Klidný, upravený a téměř nenápadný muž, který nepůsobí hrozivě na první pohled. Jeho síla není v divokosti, ale v kontrole.",
    personality: "Pozorný, přizpůsobivý a nebezpečně přesvědčivý. Umí mluvit tak, aby lidé slyšeli přesně to, co slyšet chtějí. Ví víc, než říká, a málokdy ukáže, co si skutečně myslí.",
    quote: "„Svět nepatří těm, kdo utíkají. Patří těm, kdo se naučí hrát jeho hru.“"
  }
];

const refs = {
  loginShell: document.getElementById("loginShell"),
  appShell: document.getElementById("appShell"),
  authError: document.getElementById("authError"),
  activeCharacterName: document.getElementById("activeCharacterName"),
  menuPage: document.getElementById("menuPage"),
  zekeSideLeft: document.getElementById("zekeSideLeft"),
  zekeSideRight: document.getElementById("zekeSideRight"),
  characterPage: document.getElementById("characterPage"),
  adminPage: document.getElementById("adminPage"),
  backToMenuButton: document.getElementById("backToMenuButton"),
  profileButton: document.getElementById("profileButton"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileMenu: document.getElementById("profileMenu"),
  profileName: document.getElementById("profileName"),
  wakeButton: document.getElementById("wakeButton"),
  sleepButton: document.getElementById("sleepButton"),
  quickWakeButton: document.getElementById("quickWakeButton"),
  quickSleepButton: document.getElementById("quickSleepButton"),
  characterInfoButton: document.getElementById("characterInfoButton"),
  adminButton: document.getElementById("adminButton"),
  openCharacterPageButton: document.getElementById("openCharacterPageButton"),
  logoutButton: document.getElementById("logoutButton"),
  characterPortrait: document.getElementById("characterPortrait"),
  summaryName: document.getElementById("summaryName"),
  summaryRole: document.getElementById("summaryRole"),
  heroStatusText: document.getElementById("heroStatusText"),
  heroSessionText: document.getElementById("heroSessionText"),
  heroTodayText: document.getElementById("heroTodayText"),
  summaryStatus: document.getElementById("summaryStatus"),
  summarySession: document.getElementById("summarySession"),
  summaryTotal: document.getElementById("summaryTotal"),
  firebaseStatus: document.getElementById("firebaseStatus"),
  awakeCount: document.getElementById("awakeCount"),
  familyAwakeCount: document.getElementById("familyAwakeCount"),
  familyTodayTotal: document.getElementById("familyTodayTotal"),
  lastActivityText: document.getElementById("lastActivityText"),
  memberTable: document.getElementById("memberTable"),
  eventList: document.getElementById("eventList"),
  adminPanel: document.getElementById("adminPanel"),
  adminCharacterSelect: document.getElementById("adminCharacterSelect"),
  adminNoteInput: document.getElementById("adminNoteInput"),
  adminForceWakeButton: document.getElementById("adminForceWakeButton"),
  adminForceSleepButton: document.getElementById("adminForceSleepButton"),
  adminResetButton: document.getElementById("adminResetButton"),
  adminStatus: document.getElementById("adminStatus"),
  characterPagePortrait: document.getElementById("characterPagePortrait"),
  characterPageRole: document.getElementById("characterPageRole"),
  characterPageName: document.getElementById("characterPageName"),
  characterPageQuote: document.getElementById("characterPageQuote"),
  characterPageFacts: document.getElementById("characterPageFacts"),
  characterPageStats: document.getElementById("characterPageStats"),
  characterEventList: document.getElementById("characterEventList"),
  characterDossierGrid: document.getElementById("characterDossierGrid"),
  characterPageLore: document.getElementById("characterPageLore"),
  characterOverviewBlocks: document.getElementById("characterOverviewBlocks"),
  characterPageAppearance: document.getElementById("characterPageAppearance"),
  characterPagePersonality: document.getElementById("characterPagePersonality"),
  nightReportModal: document.getElementById("nightReportModal"),
  nightReportInput: document.getElementById("nightReportInput"),
  nightReportMeta: document.getElementById("nightReportMeta"),
  nightReportStatus: document.getElementById("nightReportStatus"),
  cancelSleepButton: document.getElementById("cancelSleepButton"),
  skipReportSleepButton: document.getElementById("skipReportSleepButton"),
  submitReportSleepButton: document.getElementById("submitReportSleepButton")
};

let session = null;
let activeCharacter = null;
let states = new Map();
let events = [];
let usingLocalFallback = false;

const getCharacter = (characterId) => characters.find((character) => character.id === characterId);

const getDefaultState = (characterId) => ({
  characterId,
  status: "asleep",
  currentStartedAt: null,
  totalMs: 0,
  todayMs: 0,
  todayDate: new Date().toISOString().slice(0, 10),
  lastSessionMs: 0,
  longestSessionMs: 0,
  lastActionAtMs: null,
  updatedAtMs: Date.now()
});

const normalizeState = (characterId, state = {}) => ({
  ...getDefaultState(characterId),
  ...state,
  totalMs: Number(state.totalMs || 0),
  todayMs: Number(state.todayMs || 0),
  lastSessionMs: Number(state.lastSessionMs || 0),
  longestSessionMs: Number(state.longestSessionMs || 0),
  lastActionAtMs: state.lastActionAtMs ? Number(state.lastActionAtMs) : null,
  currentStartedAt: state.currentStartedAt || null,
  updatedAtMs: Number(state.updatedAtMs || Date.now())
});

const loadLocalStates = () => {
  try {
    const data = JSON.parse(localStorage.getItem(localStatesKey) || "{}");
    states = new Map(characters.map((character) => [
      character.id,
      normalizeState(character.id, data[character.id])
    ]));
  } catch {
    states = new Map(characters.map((character) => [character.id, getDefaultState(character.id)]));
  }
};

const saveLocalStates = () => {
  localStorage.setItem(localStatesKey, JSON.stringify(Object.fromEntries(states.entries())));
};

const loadLocalEvents = () => {
  try {
    events = JSON.parse(localStorage.getItem(localEventsKey) || "[]")
      .filter((event) => characters.some((character) => character.id === event.characterId))
      .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0))
      .slice(0, 80);
  } catch {
    events = [];
  }
};

const saveLocalEvents = () => {
  localStorage.setItem(localEventsKey, JSON.stringify(events.slice(0, 80)));
};

const formatDuration = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
};

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getReadableTime = (ms) => (
  ms
    ? new Intl.DateTimeFormat("cs-CZ", { hour: "2-digit", minute: "2-digit" }).format(new Date(ms))
    : "Zatím nikdy"
);

const getWeekStartMs = () => {
  const date = new Date();
  const day = (date.getDay() + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date.getTime();
};

const getLiveMs = (state) => (
  state.status === "awake" && state.currentStartedAt
    ? Date.now() - Number(state.currentStartedAt)
    : 0
);

const getTotalMs = (state) => Number(state.totalMs || 0) + getLiveMs(state);

const getTodayMs = (state) => {
  const todayBase = state.todayDate === getTodayKey() ? Number(state.todayMs || 0) : 0;
  return todayBase + getLiveMs(state);
};

const getWeekMs = (characterId, state) => {
  const weekStart = getWeekStartMs();
  const eventMs = events
    .filter((event) => event.characterId === characterId && Number(event.createdAtMs || 0) >= weekStart)
    .reduce((sum, event) => sum + Number(event.durationMs || 0), 0);
  return eventMs + getLiveMs(state);
};

const setAppPage = (page) => {
  const isCharacter = page === "character";
  const isAdmin = page === "admin";
  refs.menuPage.hidden = isCharacter || isAdmin;
  refs.characterPage.hidden = !isCharacter;
  refs.adminPage.hidden = !isAdmin;
  refs.menuPage.classList.toggle("is-active", !isCharacter && !isAdmin);
  refs.characterPage.classList.toggle("is-active", isCharacter);
  refs.adminPage.classList.toggle("is-active", isAdmin);
  refs.backToMenuButton.hidden = !isCharacter && !isAdmin;
  refs.profileMenu.hidden = true;
  refs.profileButton.setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
};

const renderEventList = (container, list) => {
  container.replaceChildren();

  if (!list.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Zatím tu není žádná událost.";
    container.appendChild(empty);
    return;
  }

  list.slice(0, 12).forEach((event) => {
    const character = getCharacter(event.characterId);
    if (!character) return;

    const item = document.createElement("article");
    item.className = `event-item ${event.action === "wake" ? "is-wake" : event.action === "sleep" ? "is-sleep" : "is-admin"}`;

    const dot = document.createElement("span");
    dot.className = "event-dot";

    const body = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = event.title || (
      event.action === "wake"
        ? `${character.name} je vzhůru`
        : event.action === "sleep"
          ? `${character.name} usnul/a`
          : `${character.name}: admin zásah`
    );

    const meta = document.createElement("small");
    const parts = [getReadableTime(event.createdAtMs)];
    if (event.durationMs) parts.push(`sezení ${formatDuration(event.durationMs)}`);
    if (event.note) parts.push(event.note);
    meta.textContent = parts.join(" · ");

    body.append(title, meta);
    item.append(dot, body);
    container.appendChild(item);
  });
};

const renderFamilyStatus = () => {
  let awake = 0;
  let todayTotal = 0;

  characters.forEach((character) => {
    const state = normalizeState(character.id, states.get(character.id));
    if (state.status === "awake") awake += 1;
    todayTotal += getTodayMs(state);
  });

  const lastEvent = events[0];
  refs.familyAwakeCount.textContent = `${awake} / ${characters.length}`;
  refs.familyTodayTotal.textContent = formatDuration(todayTotal);
  refs.lastActivityText.textContent = lastEvent
    ? `${getCharacter(lastEvent.characterId)?.listName || "Postava"} · ${lastEvent.action === "wake" ? "probuzení" : lastEvent.action === "sleep" ? "spánek" : "admin"}`
    : "Zatím žádná";
  renderEventList(refs.eventList, events);
};

const renderMemberTable = () => {
  refs.memberTable.replaceChildren();
  let awake = 0;

  characters.forEach((character) => {
    const state = normalizeState(character.id, states.get(character.id));
    if (state.status === "awake") awake += 1;

    const button = document.createElement("button");
    button.className = `member-row ${state.status === "awake" ? "is-awake" : ""}`;
    button.type = "button";
    button.addEventListener("click", () => {
      renderCharacterPage(character);
      setAppPage("character");
    });

    const portrait = document.createElement("img");
    portrait.src = character.portrait;
    portrait.alt = character.name;

    const content = document.createElement("span");
    content.className = "member-main";
    const name = document.createElement("strong");
    name.textContent = character.name;
    const role = document.createElement("small");
    role.textContent = character.role;
    content.append(name, role);

    const status = document.createElement("span");
    status.className = "status-pill";
    status.textContent = state.status === "awake" ? "Vzhůru" : "Spí";

    const time = document.createElement("span");
    time.className = "member-time";
    time.textContent = formatDuration(getTotalMs(state));

    button.append(portrait, content, status, time);
    refs.memberTable.appendChild(button);
  });

  refs.awakeCount.textContent = `${awake} vzhůru`;
};

const renderSummary = () => {
  if (!activeCharacter) return;
  const state = normalizeState(activeCharacter.id, states.get(activeCharacter.id));
  const isAwake = state.status === "awake";

  refs.activeCharacterName.textContent = activeCharacter.name;
  refs.characterPortrait.src = activeCharacter.portrait;
  refs.characterPortrait.alt = activeCharacter.name;
  refs.summaryName.textContent = activeCharacter.name;
  refs.summaryRole.textContent = activeCharacter.overview;
  refs.summaryStatus.textContent = isAwake ? "Vzhůru" : "Spí";
  refs.summaryStatus.closest(".stat-card").classList.toggle("is-awake", isAwake);
  refs.summarySession.textContent = formatDuration(getLiveMs(state));
  refs.summaryTotal.textContent = formatDuration(getTotalMs(state));
  refs.heroStatusText.textContent = isAwake ? "Vzhuru" : "Spi";
  refs.heroSessionText.textContent = formatDuration(getLiveMs(state));
  refs.heroTodayText.textContent = formatDuration(getTodayMs(state));
  refs.zekeSideLeft.hidden = activeCharacter.id !== "zeke";
  refs.zekeSideRight.hidden = activeCharacter.id !== "zeke";

  [refs.wakeButton, refs.quickWakeButton].forEach((button) => { button.disabled = isAwake; });
  [refs.sleepButton, refs.quickSleepButton].forEach((button) => { button.disabled = !isAwake; });

  renderMemberTable();
  renderFamilyStatus();
  if (!refs.characterPage.hidden) renderCharacterPage(getCharacter(refs.characterPage.dataset.characterId) || activeCharacter);
};

const renderProfile = () => {
  refs.profileAvatar.src = session.avatarUrl || activeCharacter.portrait;
  refs.profileAvatar.alt = session.username || activeCharacter.name;
  refs.profileName.textContent = `${session.username || "Discord"} · ${activeCharacter.listName}`;
};

const setupAdmin = () => {
  const isAdmin = session?.discordId === adminDiscordId;
  refs.adminButton.hidden = !isAdmin;
  refs.adminPanel.hidden = !isAdmin;
  if (!isAdmin) return;

  refs.adminCharacterSelect.replaceChildren(
    ...characters.map((character) => {
      const option = document.createElement("option");
      option.value = character.id;
      option.textContent = character.name;
      return option;
    })
  );
  refs.adminCharacterSelect.value = activeCharacter.id;
};

const getAdminSelection = () => getCharacter(refs.adminCharacterSelect.value) || activeCharacter;

const runAdminAction = async (action) => {
  if (session?.discordId !== adminDiscordId) return;
  const character = getAdminSelection();
  const state = normalizeState(character.id, states.get(character.id));
  const note = refs.adminNoteInput.value.trim();
  const now = Date.now();

  if (action === "wake") {
    if (state.status === "awake") {
      refs.adminStatus.textContent = "Postava už je vzhůru.";
      return;
    }
    await persistState(character.id, {
      ...state,
      status: "awake",
      currentStartedAt: now,
      todayDate: getTodayKey(),
      lastActionAtMs: now
    });
    await recordEvent({ characterId: character.id, action: "admin", note: note || "Ručně probuzeno", title: `${character.name} ručně probuzen/a` });
  }

  if (action === "sleep") {
    const durationMs = getLiveMs(state);
    const todayMs = state.todayDate === getTodayKey() ? Number(state.todayMs || 0) + durationMs : durationMs;
    await persistState(character.id, {
      ...state,
      status: "asleep",
      currentStartedAt: null,
      totalMs: Number(state.totalMs || 0) + durationMs,
      todayDate: getTodayKey(),
      todayMs,
      lastSessionMs: durationMs,
      longestSessionMs: Math.max(Number(state.longestSessionMs || 0), durationMs),
      lastActionAtMs: now
    });
    await recordEvent({ characterId: character.id, action: "admin", durationMs, note: note || "Ručně uspáno", title: `${character.name} ručně uspán/a` });
  }

  if (action === "reset") {
    await persistState(character.id, {
      ...getDefaultState(character.id),
      updatedAtMs: now,
      lastActionAtMs: now
    });
    await recordEvent({ characterId: character.id, action: "admin", note: note || "Reset času", title: `${character.name}: reset času` });
  }

  refs.adminStatus.textContent = "Admin akce byla uložena.";
  refs.adminNoteInput.value = "";
};

const renderCharacterPage = (character = activeCharacter) => {
  refs.characterPage.dataset.characterId = character.id;
  const state = normalizeState(character.id, states.get(character.id));
  refs.characterPagePortrait.src = character.portrait;
  refs.characterPagePortrait.alt = character.name;
  refs.characterPageRole.textContent = character.role;
  refs.characterPageName.textContent = character.name;
  refs.characterPageQuote.textContent = character.quote;
  refs.characterPageFacts.replaceChildren();

  [
    ["Věk", character.age],
    ["Původ", character.origin],
    ["Rok", character.year],
    ["Stav", character.statusText],
    ["Discord ID", character.discordId]
  ].forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    refs.characterPageFacts.append(dt, dd);
  });

  refs.characterPageLore.replaceChildren(
    ...character.lore.split(/\n\s*\n/).map((paragraph) => {
      const p = document.createElement("p");
      p.textContent = paragraph;
      return p;
    })
  );

  refs.characterOverviewBlocks.replaceChildren(
    ...character.overviewBlocks.map((block) => {
      const card = document.createElement("div");
      const title = document.createElement("strong");
      const text = document.createElement("p");
      title.textContent = block.title;
      text.textContent = block.text;
      card.append(title, text);
      return card;
    })
  );

  refs.characterPageAppearance.textContent = character.appearance;
  refs.characterPagePersonality.textContent = character.personality;

  const lastCharacterEvent = events.find((event) => event.characterId === character.id);
  const dossierItems = [
    ["Volaci jmeno", character.listName],
    ["Rok deje", character.year],
    ["Puvod", character.origin],
    ["Role", character.role],
    ["Dnes vzhuru", formatDuration(getTodayMs(state))],
    ["Tento tyden", formatDuration(getWeekMs(character.id, state))],
    ["Nejdelsi sezeni", formatDuration(state.longestSessionMs)],
    ["Posledni stopa", lastCharacterEvent ? getReadableTime(lastCharacterEvent.createdAtMs) : "Zatim zadna"]
  ];

  refs.characterDossierGrid.replaceChildren(
    ...dossierItems.map(([label, value]) => {
      const item = document.createElement("div");
      const span = document.createElement("span");
      const strong = document.createElement("strong");
      span.textContent = label;
      strong.textContent = value;
      item.append(span, strong);
      return item;
    })
  );

  const statItems = [
    ["Stav", state.status === "awake" ? "Vzhůru" : "Spí"],
    ["Dnes", formatDuration(getTodayMs(state))],
    ["Tento týden", formatDuration(getWeekMs(character.id, state))],
    ["Aktuální sezení", formatDuration(getLiveMs(state))],
    ["Poslední sezení", formatDuration(state.lastSessionMs)],
    ["Nejdelší sezení", formatDuration(state.longestSessionMs)],
    ["Celkem vzhůru", formatDuration(getTotalMs(state))],
    ["Poslední aktivita", getReadableTime(state.lastActionAtMs)]
  ];

  refs.characterPageStats.replaceChildren(
    ...statItems.map(([label, value]) => {
      const item = document.createElement("div");
      const span = document.createElement("span");
      const strong = document.createElement("strong");
      span.textContent = label;
      strong.textContent = value;
      item.append(span, strong);
      return item;
    })
  );

  renderEventList(
    refs.characterEventList,
    events.filter((event) => event.characterId === character.id)
  );
};

const persistState = async (characterId, nextState) => {
  const payload = {
    ...nextState,
    updatedAtMs: Date.now()
  };
  states.set(characterId, normalizeState(characterId, payload));
  saveLocalStates();
  renderSummary();

  if (usingLocalFallback) return;

  try {
    await setDoc(doc(statesRef, characterId), {
      ...payload,
      characterId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    usingLocalFallback = true;
    refs.firebaseStatus.textContent = "Lokální režim";
    console.warn("Firestore write failed, using local fallback.", error);
  }
};

const recordEvent = async ({ characterId, action, durationMs = 0, note = "", title = "" }) => {
  const now = Date.now();
  const event = {
    id: `${now}-${characterId}-${action}`,
    characterId,
    action,
    durationMs,
    note,
    title,
    actorDiscordId: session?.discordId || "",
    actorName: session?.username || "",
    createdAtMs: now
  };

  events = [event, ...events.filter((item) => item.id !== event.id)].slice(0, 80);
  saveLocalEvents();
  renderFamilyStatus();
  if (!refs.characterPage.hidden) renderCharacterPage(getCharacter(refs.characterPage.dataset.characterId) || activeCharacter);

  if (usingLocalFallback) return;

  try {
    await setDoc(doc(eventsRef, event.id), { ...event, createdAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    usingLocalFallback = true;
    refs.firebaseStatus.textContent = "Lokální režim";
    console.warn("Firestore event write failed, using local fallback.", error);
  }
};

const sendCharacterAction = async (action, durationMs = 0) => {
  const response = await fetch("/api/character-action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      characterId: activeCharacter.id,
      durationMs
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Akci se nepodařilo odeslat.");
};

const sendNightReport = async ({ reportText, durationMs }) => {
  if (!reportText.trim()) return;

  const response = await fetch("/api/night-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      characterId: activeCharacter.id,
      durationMs,
      reportText: reportText.trim()
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Report se nepodarilo odeslat.");
};

const setReportModal = (open) => {
  refs.nightReportModal.hidden = !open;
  refs.nightReportModal.setAttribute("aria-hidden", String(!open));
  if (open) refs.nightReportInput.focus();
};

const openSleepReport = () => {
  const state = normalizeState(activeCharacter.id, states.get(activeCharacter.id));
  if (state.status !== "awake") return;
  refs.nightReportInput.value = "";
  refs.nightReportStatus.textContent = "";
  refs.nightReportMeta.textContent = `Sezeni: ${formatDuration(getLiveMs(state))}. Report neni povinny.`;
  setReportModal(true);
};

const wakeCharacter = async () => {
  const state = normalizeState(activeCharacter.id, states.get(activeCharacter.id));
  if (state.status === "awake") return;

  await sendCharacterAction("wake");
  await persistState(activeCharacter.id, {
    ...state,
    status: "awake",
    currentStartedAt: Date.now(),
    todayDate: getTodayKey(),
    lastActionAtMs: Date.now()
  });
  await recordEvent({
    characterId: activeCharacter.id,
    action: "wake",
    title: `${activeCharacter.name} je vzhůru`
  });
};

const sleepCharacter = async (reportText = "") => {
  const state = normalizeState(activeCharacter.id, states.get(activeCharacter.id));
  if (state.status !== "awake") return;

  const durationMs = getLiveMs(state);
  await sendCharacterAction("sleep", durationMs);
  await sendNightReport({ reportText, durationMs });
  const todayMs = state.todayDate === getTodayKey() ? Number(state.todayMs || 0) + durationMs : durationMs;
  await persistState(activeCharacter.id, {
    ...state,
    status: "asleep",
    currentStartedAt: null,
    totalMs: Number(state.totalMs || 0) + durationMs,
    todayDate: getTodayKey(),
    todayMs,
    lastSessionMs: durationMs,
    longestSessionMs: Math.max(Number(state.longestSessionMs || 0), durationMs),
    lastActionAtMs: Date.now()
  });
  await recordEvent({
    characterId: activeCharacter.id,
    action: "sleep",
    durationMs,
    note: reportText.trim() ? `Report: ${reportText.trim()}` : "",
    title: `${activeCharacter.name} usnul/a`
  });
};

const startFirestore = () => {
  characters.forEach((character) => {
    if (!states.has(character.id)) states.set(character.id, getDefaultState(character.id));
  });

  try {
    onSnapshot(statesRef, (snapshot) => {
      usingLocalFallback = false;
      refs.firebaseStatus.textContent = "Připraveno";
      snapshot.forEach((stateDoc) => {
        if (characters.some((character) => character.id === stateDoc.id)) {
          states.set(stateDoc.id, normalizeState(stateDoc.id, stateDoc.data()));
        }
      });
      characters.forEach((character) => {
        if (!states.has(character.id)) states.set(character.id, getDefaultState(character.id));
      });
      renderSummary();
    }, (error) => {
      usingLocalFallback = true;
      refs.firebaseStatus.textContent = "Lokální režim";
      console.warn("Firestore blocked, using local fallback.", error);
      renderSummary();
    });

    onSnapshot(eventsRef, (snapshot) => {
      const remoteEvents = [];
      snapshot.forEach((eventDoc) => {
        const data = eventDoc.data();
        if (characters.some((character) => character.id === data.characterId)) {
          remoteEvents.push({ id: eventDoc.id, ...data });
        }
      });
      events = remoteEvents
        .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0))
        .slice(0, 80);
      saveLocalEvents();
      renderFamilyStatus();
      if (!refs.characterPage.hidden) renderCharacterPage(getCharacter(refs.characterPage.dataset.characterId) || activeCharacter);
    }, (error) => {
      console.warn("Firestore events blocked, using local event history.", error);
      renderFamilyStatus();
    });
  } catch (error) {
    usingLocalFallback = true;
    refs.firebaseStatus.textContent = "Lokální režim";
    console.warn("Firestore init failed, using local fallback.", error);
  }
};

const showLoginErrorFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  if (!error) return;

  refs.authError.textContent = error === "unknown_discord"
    ? "Tenhle Discord účet není napojený na žádnou povolenou postavu."
    : "Discord přihlášení se nepodařilo.";
  window.history.replaceState({}, "", window.location.pathname);
};

const loadSession = async () => {
  const response = await fetch("/api/discord-session", {
    cache: "no-store",
    credentials: "include"
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.authenticated ? data : null;
};

const runCharacterAction = (action) => {
  if (action === "sleep") {
    openSleepReport();
    return;
  }

  const task = wakeCharacter;
  task().catch((error) => {
    refs.firebaseStatus.textContent = error.message;
  });
};

const boot = async () => {
  showLoginErrorFromUrl();
  loadLocalStates();
  loadLocalEvents();

  session = await loadSession();
  if (!session?.characterId) {
    refs.loginShell.hidden = false;
    refs.appShell.hidden = true;
    window.scrollTo(0, 0);
    return;
  }

  activeCharacter = getCharacter(session.characterId);
  if (!activeCharacter) {
    refs.authError.textContent = "Discord účet není napojený na povolenou postavu.";
    return;
  }

  refs.loginShell.hidden = true;
  refs.appShell.hidden = false;
  setAppPage("menu");
  renderProfile();
  setupAdmin();
  renderSummary();
  renderCharacterPage(activeCharacter);
  startFirestore();
};

refs.profileButton.addEventListener("click", () => {
  const isOpen = !refs.profileMenu.hidden;
  refs.profileMenu.hidden = isOpen;
  refs.profileButton.setAttribute("aria-expanded", String(!isOpen));
});

[refs.characterInfoButton, refs.openCharacterPageButton].forEach((button) => {
  button.addEventListener("click", () => {
    renderCharacterPage(activeCharacter);
    setAppPage("character");
  });
});

refs.adminButton.addEventListener("click", () => {
  setupAdmin();
  setAppPage("admin");
});
refs.backToMenuButton.addEventListener("click", () => setAppPage("menu"));
refs.wakeButton.addEventListener("click", () => runCharacterAction("wake"));
refs.quickWakeButton.addEventListener("click", () => runCharacterAction("wake"));
refs.sleepButton.addEventListener("click", () => runCharacterAction("sleep"));
refs.quickSleepButton.addEventListener("click", () => runCharacterAction("sleep"));
refs.cancelSleepButton.addEventListener("click", () => setReportModal(false));
refs.skipReportSleepButton.addEventListener("click", () => {
  refs.nightReportStatus.textContent = "Uspavam bez reportu...";
  sleepCharacter("").then(() => {
    setReportModal(false);
  }).catch((error) => {
    refs.nightReportStatus.textContent = error.message;
  });
});
refs.submitReportSleepButton.addEventListener("click", () => {
  const reportText = refs.nightReportInput.value.trim();
  refs.nightReportStatus.textContent = reportText ? "Odesilam report a uspavam..." : "Uspavam bez reportu...";
  sleepCharacter(reportText).then(() => {
    setReportModal(false);
  }).catch((error) => {
    refs.nightReportStatus.textContent = error.message;
  });
});
refs.adminForceWakeButton.addEventListener("click", () => runAdminAction("wake"));
refs.adminForceSleepButton.addEventListener("click", () => runAdminAction("sleep"));
refs.adminResetButton.addEventListener("click", () => runAdminAction("reset"));
refs.logoutButton.addEventListener("click", () => {
  window.location.href = "/api/discord-logout";
});

setInterval(renderSummary, 1000);
boot();
