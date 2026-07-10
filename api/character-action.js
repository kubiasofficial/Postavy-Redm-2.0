const characters = {
  zeke: { name: "Ezekiel Crowe", color: 0x8f1f2d },
  violet: { name: "Violet Crowe", color: 0x7c4f86 },
  william: { name: "William Hart", color: 0x6c7f8c },
  eleanor: { name: "Eleanor Whitmore", color: 0xc08d78 },
  silas: { name: "Silas Crowe", color: 0x615c8b }
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

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const webhookUrl = process.env.DISCORD_STATUS_WEBHOOK_URL;
  if (!webhookUrl) {
    res.status(500).json({ error: "Chybi DISCORD_STATUS_WEBHOOK_URL ve Vercelu." });
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

  const isWake = body.action === "wake";
  const isSleep = body.action === "sleep";
  if (!isWake && !isSleep) {
    res.status(400).json({ error: "Neznama akce." });
    return;
  }

  const title = isWake ? `${character.name} je vzhůru` : `${character.name} usnul/a`;
  const description = isWake
    ? `${character.name} se probouzí a je označen/a jako vzhůru.`
    : `${character.name} usíná. Dnešní sezení: ${formatDuration(body.durationMs)}.`;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "CrowesBot 2.0",
      embeds: [
        {
          title,
          description,
          color: character.color,
          fields: [
            { name: "Discord", value: session.username || session.discordId, inline: true },
            { name: "Postava", value: character.name, inline: true }
          ],
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
