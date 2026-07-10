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
const localStatesKey = "croweFamily2CharacterStates";

const characters = [
  {
    id: "zeke",
    discordId: "417061947759001600",
    listName: "Ezekiel",
    name: "Ezekiel “Zeke” Crowe",
    role: "Psanec / samotářský tulák",
    age: "36 let",
    origin: "Louisiana",
    statusText: "Na útěku",
    portrait: "images/zeke.png",
    overview: "Tichý, nebezpečný a kontrolovaný muž, který přežil vlastní smrt a je pronásledován svou minulostí.",
    personality: "Nemluví zbytečně a nikdy nezvyšuje hlas. Jeho klid působí hůř než křik."
  },
  {
    id: "violet",
    discordId: "795365012494483486",
    listName: "Violet",
    name: "Violet Crowe",
    role: "Manipulátorka / střelkyně / stratég",
    age: "24 let",
    origin: "Louisiana",
    statusText: "Ve stínu",
    portrait: "images/Violet.png",
    overview: "Nejmladší ze sourozenců Croweových. Tichá, bystrá a nebezpečně klidná.",
    personality: "Výborně čte lidi, plánuje dopředu a dává přednost slovům před zbraní, dokud není pozdě."
  },
  {
    id: "william",
    discordId: "550294660090691594",
    listName: "William",
    name: "William Hart",
    role: "Vyjednavač / ochránce / stratég",
    age: "28 let",
    origin: "Texas",
    statusText: "Připravený",
    portrait: "images/William.png",
    overview: "Klidný, silný a spolehlivý muž, který umí číst lidi dřív, než ukážou své úmysly.",
    personality: "Rozvážný, loajální a pevný. Nehledá potíže, ale když přijdou, bývá připraven."
  },
  {
    id: "eleanor",
    discordId: "1454130138240520407",
    listName: "Eleanor",
    name: "Eleanor “Ellie” Whitmore",
    role: "Empatická vypravěčka / opora / nový začátek",
    age: "24 let",
    origin: "Springfield",
    statusText: "Ve West Havenu",
    portrait: "images/elie.png",
    overview: "Vzdělaná, klidná a empatická žena, která věří, že člověk musí někdy riskovat, aby našel štěstí.",
    personality: "Trpělivá, věrná a laskavá. Snaží se vidět v lidech to lepší, i když ji to může bolet."
  },
  {
    id: "silas",
    discordId: "702917011235143800",
    listName: "Silas",
    name: "Silas “Sil” Crowe",
    role: "Vyjednavač / manipulátor",
    age: "31 let",
    origin: "Louisiana",
    statusText: "Hledá pravdu",
    portrait: "images/Silas.png",
    overview: "Mladší bratr Ezekiela Crowea s klidnou tváří a nebezpečně bystrou myslí.",
    personality: "Umí mluvit tak, aby lidé slyšeli přesně to, co chtějí slyšet. Ví víc, než říká."
  }
];

const refs = {
  loginShell: document.getElementById("loginShell"),
  appShell: document.getElementById("appShell"),
  authError: document.getElementById("authError"),
  activeCharacterName: document.getElementById("activeCharacterName"),
  profileButton: document.getElementById("profileButton"),
  profileAvatar: document.getElementById("profileAvatar"),
  profileMenu: document.getElementById("profileMenu"),
  profileName: document.getElementById("profileName"),
  wakeButton: document.getElementById("wakeButton"),
  sleepButton: document.getElementById("sleepButton"),
  characterInfoButton: document.getElementById("characterInfoButton"),
  logoutButton: document.getElementById("logoutButton"),
  characterPortrait: document.getElementById("characterPortrait"),
  summaryName: document.getElementById("summaryName"),
  summaryRole: document.getElementById("summaryRole"),
  summaryStatus: document.getElementById("summaryStatus"),
  summarySession: document.getElementById("summarySession"),
  summaryTotal: document.getElementById("summaryTotal"),
  firebaseStatus: document.getElementById("firebaseStatus"),
  memberTable: document.getElementById("memberTable"),
  characterDialog: document.getElementById("characterDialog"),
  dialogCloseButton: document.getElementById("dialogCloseButton"),
  dialogPortrait: document.getElementById("dialogPortrait"),
  dialogKicker: document.getElementById("dialogKicker"),
  dialogName: document.getElementById("dialogName"),
  dialogFacts: document.getElementById("dialogFacts"),
  dialogOverview: document.getElementById("dialogOverview"),
  dialogPersonality: document.getElementById("dialogPersonality")
};

let session = null;
let activeCharacter = null;
let states = new Map();
let usingLocalFallback = false;

const getCharacter = (characterId) => characters.find((character) => character.id === characterId);

const getDefaultState = (characterId) => ({
  characterId,
  status: "asleep",
  currentStartedAt: null,
  totalMs: 0,
  updatedAtMs: Date.now()
});

const normalizeState = (characterId, state = {}) => ({
  ...getDefaultState(characterId),
  ...state,
  totalMs: Number(state.totalMs || 0),
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
  const data = Object.fromEntries(states.entries());
  localStorage.setItem(localStatesKey, JSON.stringify(data));
};

const formatDuration = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
};

const getLiveMs = (state) => (
  state.status === "awake" && state.currentStartedAt
    ? Date.now() - Number(state.currentStartedAt)
    : 0
);

const getTotalMs = (state) => Number(state.totalMs || 0) + getLiveMs(state);

const renderMemberTable = () => {
  refs.memberTable.replaceChildren();

  characters.forEach((character) => {
    const state = normalizeState(character.id, states.get(character.id));
    const row = document.createElement("div");
    row.className = "member-row";

    const portrait = document.createElement("img");
    portrait.src = character.portrait;
    portrait.alt = character.name;

    const name = document.createElement("strong");
    name.textContent = character.name;

    const status = document.createElement("span");
    status.textContent = state.status === "awake" ? "Vzhůru" : "Spí";

    const time = document.createElement("span");
    time.textContent = formatDuration(getTotalMs(state));

    row.append(portrait, name, status, time);
    refs.memberTable.appendChild(row);
  });
};

const renderSummary = () => {
  if (!activeCharacter) return;
  const state = normalizeState(activeCharacter.id, states.get(activeCharacter.id));

  refs.activeCharacterName.textContent = activeCharacter.name;
  refs.characterPortrait.src = activeCharacter.portrait;
  refs.characterPortrait.alt = activeCharacter.name;
  refs.summaryName.textContent = activeCharacter.name;
  refs.summaryRole.textContent = activeCharacter.role;
  refs.summaryStatus.textContent = state.status === "awake" ? "Vzhůru" : "Spí";
  refs.summarySession.textContent = formatDuration(getLiveMs(state));
  refs.summaryTotal.textContent = formatDuration(getTotalMs(state));
  refs.wakeButton.disabled = state.status === "awake";
  refs.sleepButton.disabled = state.status !== "awake";

  renderMemberTable();
};

const renderProfile = () => {
  refs.profileAvatar.src = session.avatarUrl || activeCharacter.portrait;
  refs.profileAvatar.alt = session.username || activeCharacter.name;
  refs.profileName.textContent = `${session.username || "Discord"} · ${activeCharacter.listName}`;
};

const showCharacterInfo = () => {
  refs.dialogPortrait.src = activeCharacter.portrait;
  refs.dialogPortrait.alt = activeCharacter.name;
  refs.dialogKicker.textContent = activeCharacter.role;
  refs.dialogName.textContent = activeCharacter.name;
  refs.dialogFacts.replaceChildren();

  [
    ["Věk", activeCharacter.age],
    ["Původ", activeCharacter.origin],
    ["Stav", activeCharacter.statusText],
    ["Discord ID", activeCharacter.discordId]
  ].forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    refs.dialogFacts.append(dt, dd);
  });

  refs.dialogOverview.textContent = activeCharacter.overview;
  refs.dialogPersonality.textContent = activeCharacter.personality;
  refs.characterDialog.showModal();
};

const persistState = async (characterId, nextState) => {
  states.set(characterId, normalizeState(characterId, nextState));
  saveLocalStates();
  renderSummary();

  if (usingLocalFallback) return;

  try {
    await setDoc(doc(statesRef, characterId), {
      ...nextState,
      characterId,
      updatedAtMs: Date.now(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    usingLocalFallback = true;
    refs.firebaseStatus.textContent = "Lokální režim";
    console.warn("Firestore write failed, using local fallback.", error);
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

const wakeCharacter = async () => {
  const state = normalizeState(activeCharacter.id, states.get(activeCharacter.id));
  if (state.status === "awake") return;

  await sendCharacterAction("wake");
  await persistState(activeCharacter.id, {
    ...state,
    status: "awake",
    currentStartedAt: Date.now()
  });
};

const sleepCharacter = async () => {
  const state = normalizeState(activeCharacter.id, states.get(activeCharacter.id));
  if (state.status !== "awake") return;

  const durationMs = getLiveMs(state);
  await sendCharacterAction("sleep", durationMs);
  await persistState(activeCharacter.id, {
    ...state,
    status: "asleep",
    currentStartedAt: null,
    totalMs: Number(state.totalMs || 0) + durationMs
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
        states.set(stateDoc.id, normalizeState(stateDoc.id, stateDoc.data()));
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
  const response = await fetch("/api/discord-session");
  if (!response.ok) return null;
  const data = await response.json();
  return data.authenticated ? data : null;
};

const boot = async () => {
  showLoginErrorFromUrl();
  loadLocalStates();

  session = await loadSession();
  if (!session?.characterId) {
    refs.loginShell.hidden = false;
    refs.appShell.hidden = true;
    return;
  }

  activeCharacter = getCharacter(session.characterId);
  if (!activeCharacter) {
    refs.authError.textContent = "Discord účet není napojený na povolenou postavu.";
    return;
  }

  refs.loginShell.hidden = true;
  refs.appShell.hidden = false;
  renderProfile();
  renderSummary();
  startFirestore();
};

refs.profileButton.addEventListener("click", () => {
  const isOpen = !refs.profileMenu.hidden;
  refs.profileMenu.hidden = isOpen;
  refs.profileButton.setAttribute("aria-expanded", String(!isOpen));
});

refs.wakeButton.addEventListener("click", () => {
  wakeCharacter().catch((error) => {
    refs.firebaseStatus.textContent = error.message;
  });
});

refs.sleepButton.addEventListener("click", () => {
  sleepCharacter().catch((error) => {
    refs.firebaseStatus.textContent = error.message;
  });
});

refs.characterInfoButton.addEventListener("click", showCharacterInfo);
refs.dialogCloseButton.addEventListener("click", () => refs.characterDialog.close());
refs.logoutButton.addEventListener("click", () => {
  window.location.href = "/api/discord-logout";
});

setInterval(renderSummary, 1000);
boot();
