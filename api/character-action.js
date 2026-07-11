const characters = {
  zeke: {
    name: 'Ezekiel "Zeke" Crowe',
    portrait: "images/zeke.png",
    wakeTitle: "Zeke je vzhůru",
    sleepTitle: "Zeke usnul",
    footer: "Zápis doktora • West Haven",
    wakeMessages: [
      "Zeke otevřel oči a ordinace ztichla tak rychle, jako by někdo přerušil modlitbu.",
      "Zeke se probudil bez jediného slova. West Haven přesto pochopil, že se něco změnilo.",
      "Zeke je vzhůru. Někde v saloonu právě někdo přehodnotil své plány.",
      "Zeke otevřel oči a staré hříchy ve West Havenu si připomněly své jméno."
    ],
    sleepMessages: [
      "Zeke konečně spí. West Haven si dovolil vydechnout, ale jen potichu.",
      "Zeke zavřel oči. Nikdo neoslavuje nahlas, ale úleva je cítit.",
      "Na chvíli není třeba sledovat dveře. Zeke odpočívá.",
      "Zeke spí. Nikdo tomu nevěří dost na to, aby se přestal ohlížet."
    ]
  },
  violet: {
    name: "Violet Crowe",
    portrait: "images/Violet.png",
    wakeTitle: "Violet je vzhůru",
    sleepTitle: "Violet spí",
    footer: "Noční zápis • West Haven",
    wakeMessages: [
      "Violet otevřela oči a místnost se tvářila klidněji, než měla.",
      "Violet se probudila bez hluku. Přesto se zdálo, že všechna tajemství udělala krok zpátky.",
      "Violet je vzhůru a každé nevyřčené slovo v místnosti působí hlasitěji.",
      "Violet nespí a pravda si dnes raději sedne rovně."
    ],
    sleepMessages: [
      "Violet spí a West Haven se tváří, že to nic neznamená.",
      "Violet zavřela oči. Někteří lidé přesto dál hlídají, co říkají.",
      "Violet odpočívá. Její klid působí upraveněji než pravda.",
      "Violet spí. West Haven si na chvíli může myslet, že mu něco neuniká."
    ]
  },
  william: {
    name: "William Hart",
    portrait: "images/William.png",
    wakeTitle: "William je vzhůru",
    sleepTitle: "William spí",
    footer: "Strážní poznámka • West Haven",
    wakeMessages: [
      "William otevřel oči a místnost působila o něco méně ztraceně.",
      "William je na nohou. Hluk ve městě se nezmenšil, ale působí méně nebezpečně.",
      "William se vrátil do dne s výrazem člověka, který už počítá možnosti.",
      "William je na nohou. West Haven má znovu komu věřit, i když jen potichu."
    ],
    sleepMessages: [
      "William spí a město má na chvíli jednoho ochránce méně na nohou.",
      "William zavřel oči až ve chvíli, kdy si byl jistý, že ostatní mohou dýchat.",
      "William odpočívá a zítřejší problémy si budou muset počkat.",
      "William spí a West Haven se učí stát rovně bez jeho pohledu."
    ]
  },
  eleanor: {
    name: 'Eleanor "Ellie" Whitmore',
    portrait: "images/elie.png",
    wakeTitle: "Ellie je vzhůru",
    sleepTitle: "Ellie usnula",
    footer: "Tichý zápis • West Haven",
    wakeMessages: [
      "Ellie otevřela oči a místnost působila o něco méně tvrdě.",
      "Eleanor Whitmore je vzhůru. Někdo ve West Havenu dnes možná dostane trpělivější odpověď.",
      "Ellie se probudila s klidem člověka, který i nový den zkusí nejdřív pochopit."
    ],
    sleepMessages: [
      "Ellie usnula a West Haven si na chvíli nechal své obavy pro sebe.",
      "Eleanor odpočívá. Ticho kolem ní je měkké, ale ne slabé.",
      "Ellie spí a dnešní rozhovory konečně ztratily ostří."
    ]
  },
  silas: {
    name: 'Silas "Sil" Crowe',
    portrait: "images/Silas.png",
    wakeTitle: "Silas je vzhůru",
    sleepTitle: "Silas odpočívá",
    footer: "Tichý záznam • West Haven",
    wakeMessages: [
      "Silas otevřel oči a v místnosti bylo najednou méně jistoty než před chvílí.",
      "Silas je vzhůru a někdo už určitě řekl víc, než měl.",
      "Silas vstal bez spěchu. Přesto se zdálo, že už je pozdě.",
      "Silas je vzhůru. Pravda se dnes bude schovávat hůř než obvykle."
    ],
    sleepMessages: [
      "Silas spí. West Haven si oddechl, ale nikdo si není jistý, jestli to nebylo součástí plánu.",
      "Silas odpočívá a město má chvíli pocit, že jeho tajemství zůstala v bezpečí.",
      "Silas spí. Nikdo neví, jestli je to odpočinek, nebo další tah.",
      "Silas zavřel oči a West Haven si dovolil zapomenout jen na pár minut."
    ]
  }
};

const colors = {
  wake: 0x2f9b5f,
  sleep: 0xb93642
};

const decodeSession = (value) => {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    return null;
  }
};

const getCookie = (req, name) => {
  const cookies = String(req.headers.cookie || "").split(";").map((item) => item.trim());
  const prefix = `${name}=`;
  const cookie = cookies.find((item) => item.startsWith(prefix));
  return cookie ? cookie.slice(prefix.length) : "";
};

const readJson = async (req) => {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};

const formatDuration = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
};

const pick = (items) => items[Math.floor(Math.random() * items.length)];

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const webhookUrl = process.env.DISCORD_STATUS_WEBHOOK_URL;
  if (!webhookUrl) {
    res.status(500).json({ error: "Chybí DISCORD_STATUS_WEBHOOK_URL ve Vercelu." });
    return;
  }

  const session = decodeSession(getCookie(req, "crowe_session"));
  if (!session?.characterId) {
    res.status(401).json({ error: "Nejsi přihlášený přes Discord." });
    return;
  }

  const body = await readJson(req);
  const character = characters[body.characterId];
  if (!character || session.characterId !== body.characterId) {
    res.status(403).json({ error: "Tahle postava nepatří přihlášenému Discord účtu." });
    return;
  }

  const isWake = body.action === "wake";
  const isSleep = body.action === "sleep";
  if (!isWake && !isSleep) {
    res.status(400).json({ error: "Neznámá akce." });
    return;
  }

  const actionName = isWake ? "Probuzení" : "Spánek";
  const title = isWake ? character.wakeTitle : character.sleepTitle;
  const message = pick(isWake ? character.wakeMessages : character.sleepMessages);
  const baseUrl = `https://${req.headers.host || "postavy-redm-2-0.vercel.app"}`;
  const fields = [
    { name: "Postava", value: character.name, inline: true },
    { name: "Discord", value: session.username || session.discordId, inline: true },
    { name: "Stav", value: isWake ? "Vzhůru" : "Spí", inline: true }
  ];

  if (isSleep) {
    fields.push({ name: "Délka sezení", value: formatDuration(body.durationMs), inline: true });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "CrowesBot 2.0",
      embeds: [
        {
          author: { name: actionName },
          title,
          description: message,
          color: isWake ? colors.wake : colors.sleep,
          thumbnail: { url: `${baseUrl}/${character.portrait}` },
          fields,
          footer: { text: character.footer },
          timestamp: new Date().toISOString()
        }
      ]
    })
  });

  if (!response.ok) {
    res.status(500).json({ error: `Discord webhook selhal: ${response.status}` });
    return;
  }

  res.status(200).json({ ok: true });
};
