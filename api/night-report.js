const characters = {
  zeke: {
    name: 'Ezekiel "Zeke" Crowe',
    portrait: "images/zeke.png",
    color: 0x9d2634
  },
  scarlet: {
    name: "Scarlet Hart",
    portrait: "images/scarlet.png",
    color: 0xb88945
  },
  william: {
    name: "William Hart",
    portrait: "images/William.png",
    color: 0xb88945
  },
  adelaide: {
    name: "Adelaide Rose Blackwood",
    portrait: "images/adelaide.png",
    color: 0x8a5b3a
  },
  silas: {
    name: 'Silas "Sil" Crowe',
    portrait: "images/Silas.png",
    color: 0x6d6fa5
  },
  "tom-halbrook": {
    name: 'Thomas "Tom" Halbrook',
    portrait: "images/tom.png",
    color: 0xb48a54
  }
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

const shorten = (value, maxLength = 900) => {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const webhookUrl = process.env.DISCORD_NIGHT_REPORT_WEBHOOK_URL;
  if (!webhookUrl) {
    res.status(500).json({ error: "Chybi DISCORD_NIGHT_REPORT_WEBHOOK_URL ve Vercelu." });
    return;
  }

  const session = decodeSession(getCookie(req, "crowe_session"));
  if (!session?.characterId) {
    res.status(401).json({ error: "Nejsi prihlaseny pres Discord." });
    return;
  }

  const body = await readJson(req);
  const character = characters[body.characterId];
  if (!character || session.characterId !== body.characterId) {
    res.status(403).json({ error: "Tahle postava nepatri prihlasenemu Discord uctu." });
    return;
  }

  const reportText = String(body.reportText || "").trim();
  if (!reportText) {
    res.status(200).json({ ok: true, skipped: true });
    return;
  }

  const baseUrl = `https://${req.headers.host || "postavy-redm-2-0.vercel.app"}`;
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "CrowesBot 2.0",
      embeds: [
        {
          author: { name: "Nocni zapis rodiny Crowe" },
          title: `${character.name} odevzdal/a nocni report`,
          description: shorten(reportText),
          color: character.color,
          thumbnail: { url: `${baseUrl}/${character.portrait}` },
          fields: [
            { name: "Postava", value: character.name, inline: true },
            { name: "Discord", value: session.username || session.discordId, inline: true },
            { name: "Delka sezeni", value: formatDuration(body.durationMs), inline: true }
          ],
          footer: { text: "Crowe Family 2.0 • dobrovolny report" },
          timestamp: new Date().toISOString()
        }
      ]
    })
  });

  if (!response.ok) {
    res.status(500).json({ error: `Discord report webhook selhal: ${response.status}` });
    return;
  }

  res.status(200).json({ ok: true });
};
