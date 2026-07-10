const universalCode = "1212";
const profileKey = "croweFamily2Profile";
const characters = [
  { id: "violet-crowe", name: "Violet Crowe", role: "Rodina Crowe" },
  { id: "william-crowe", name: "William Crowe", role: "Rodina Crowe" },
  { id: "thomas-crowe", name: "Thomas Crowe", role: "Rodina Crowe" },
  { id: "zeke-crowe", name: "Zeke Crowe", role: "Rodina Crowe" }
];

const refs = {
  loginShell: document.getElementById("loginShell"),
  appShell: document.getElementById("appShell"),
  authTitle: document.getElementById("authTitle"),
  authText: document.getElementById("authText"),
  authBody: document.getElementById("authBody"),
  authError: document.getElementById("authError"),
  activeCharacterName: document.getElementById("activeCharacterName"),
  logoutButton: document.getElementById("logoutButton")
};

let pendingCharacterId = "";

const getProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(profileKey) || "null");
  } catch {
    return null;
  }
};

const saveProfile = (profile) => {
  localStorage.setItem(profileKey, JSON.stringify(profile));
};

const setError = (message = "") => {
  refs.authError.textContent = message;
};

const clearAuthBody = () => {
  refs.authBody.replaceChildren();
  setError();
};

const getCharacter = (characterId) => characters.find((character) => character.id === characterId);

const completeLogin = (characterId) => {
  const character = getCharacter(characterId);
  refs.activeCharacterName.textContent = character?.name || "Crowe Family 2.0";
  refs.loginShell.hidden = true;
  refs.appShell.hidden = false;
};

const renderPasswordLogin = () => {
  clearAuthBody();
  const profile = getProfile();
  const character = getCharacter(profile?.characterId);

  refs.authTitle.textContent = "Přihlášení";
  refs.authText.textContent = character
    ? `Zadej svoje 4místné heslo pro postavu ${character.name}.`
    : "Zadej svoje 4místné heslo.";

  const form = document.createElement("form");
  form.className = "auth-form";

  const input = document.createElement("input");
  input.className = "auth-input";
  input.type = "password";
  input.inputMode = "numeric";
  input.maxLength = 4;
  input.pattern = "[0-9]{4}";
  input.placeholder = "----";
  input.autocomplete = "off";

  const submit = document.createElement("button");
  submit.className = "auth-button primary";
  submit.type = "submit";
  submit.textContent = "Vstoupit";

  form.append(input, submit);
  refs.authBody.appendChild(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (input.value === profile?.passcode) {
      completeLogin(profile.characterId);
      return;
    }

    setError("Špatné heslo.");
  });

  requestAnimationFrame(() => input.focus());
};

const renderCreatePassword = () => {
  clearAuthBody();
  const character = getCharacter(pendingCharacterId);
  if (!character) return;

  refs.authTitle.textContent = "Vytvoř heslo";
  refs.authText.textContent = `${character.name} bude tvoje postava. Vytvoř si 4místné heslo pro další přihlášení.`;

  const form = document.createElement("form");
  form.className = "auth-form";

  const input = document.createElement("input");
  input.className = "auth-input";
  input.type = "password";
  input.inputMode = "numeric";
  input.maxLength = 4;
  input.pattern = "[0-9]{4}";
  input.placeholder = "1234";
  input.autocomplete = "off";

  const submit = document.createElement("button");
  submit.className = "auth-button primary";
  submit.type = "submit";
  submit.textContent = "Uložit";

  form.append(input, submit);
  refs.authBody.appendChild(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!/^\d{4}$/.test(input.value)) {
      setError("Heslo musí mít přesně 4 čísla.");
      return;
    }

    saveProfile({
      characterId: pendingCharacterId,
      passcode: input.value
    });
    completeLogin(pendingCharacterId);
  });

  requestAnimationFrame(() => input.focus());
};

const renderConfirmCharacter = () => {
  clearAuthBody();
  const character = getCharacter(pendingCharacterId);
  if (!character) return;

  refs.authTitle.textContent = character.name;
  refs.authText.textContent = "Je to opravdu tvoje postava?";

  const actions = document.createElement("div");
  actions.className = "auth-actions";

  const noButton = document.createElement("button");
  noButton.className = "auth-button";
  noButton.type = "button";
  noButton.textContent = "Ne";

  const yesButton = document.createElement("button");
  yesButton.className = "auth-button primary";
  yesButton.type = "button";
  yesButton.textContent = "Ano";

  actions.append(noButton, yesButton);
  refs.authBody.appendChild(actions);

  noButton.addEventListener("click", renderCharacterChoice);
  yesButton.addEventListener("click", renderCreatePassword);
};

const renderCharacterChoice = () => {
  clearAuthBody();
  refs.authTitle.textContent = "Zvol si postavu";
  refs.authText.textContent = "Klikni na postavu, která patří tobě.";

  const grid = document.createElement("div");
  grid.className = "auth-character-grid";

  characters.forEach((character) => {
    const button = document.createElement("button");
    button.className = "auth-character";
    button.type = "button";

    const name = document.createElement("strong");
    name.textContent = character.name;

    const role = document.createElement("span");
    role.textContent = character.role;

    button.append(name, role);
    button.addEventListener("click", () => {
      pendingCharacterId = character.id;
      renderConfirmCharacter();
    });

    grid.appendChild(button);
  });

  refs.authBody.appendChild(grid);
};

const renderUniversalCode = () => {
  clearAuthBody();
  refs.authTitle.textContent = "Vstupní kód";
  refs.authText.textContent = "Pro první vstup použij univerzální kód.";

  const form = document.createElement("form");
  form.className = "auth-form";

  const input = document.createElement("input");
  input.className = "auth-input";
  input.type = "password";
  input.inputMode = "numeric";
  input.maxLength = 4;
  input.placeholder = "1212";
  input.autocomplete = "off";

  const submit = document.createElement("button");
  submit.className = "auth-button primary";
  submit.type = "submit";
  submit.textContent = "Pokračovat";

  form.append(input, submit);
  refs.authBody.appendChild(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (input.value !== universalCode) {
      setError("Špatný vstupní kód.");
      return;
    }

    renderCharacterChoice();
  });

  requestAnimationFrame(() => input.focus());
};

refs.logoutButton.addEventListener("click", () => {
  refs.appShell.hidden = true;
  refs.loginShell.hidden = false;
  renderPasswordLogin();
});

if (getProfile()) {
  renderPasswordLogin();
} else {
  renderUniversalCode();
}
