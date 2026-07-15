const { readJson, requireAdmin } = require("./session-utils");

const targetWebhooks = {
  statusWebhook: "DISCORD_STATUS_WEBHOOK_URL",
  nightWebhook: "DISCORD_NIGHT_REPORT_WEBHOOK_URL"
};

const sanitizeEmbed = (embed = {}) => {
  const title = String(embed.title || "").trim().slice(0, 256);
  const description = String(embed.description || "").trim().slice(0, 4096);
  const url = String(embed.url || "").trim();
  const color = Number.isFinite(Number(embed.color)) ? Number(embed.color) : 0x9B1F2E;

  return {
    title: title || "Crowe Family notice",
    description: description || "Zprava z admin panelu.",
    ...(url ? { url } : {}),
    color,
    footer: {
      text: "Crowe Family 2.0 | admin zprava"
    },
    timestamp: new Date().toISOString()
  };
};

const sendJson = async (url, payload, headers = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = requireAdmin(req, res);
  if (!session) return;

  try {
    const body = await readJson(req);
    const target = String(body.target || "statusWebhook");
    const channelId = String(body.channelId || "").trim();
    const content = String(body.content || "").trim().slice(0, 2000);
    const payload = {
      ...(content ? { content } : {}),
      allowed_mentions: {
        parse: ["everyone", "roles", "users"]
      },
      embeds: [sanitizeEmbed(body.embed)]
    };

    if (targetWebhooks[target]) {
      const webhookUrl = process.env[targetWebhooks[target]];
      if (!webhookUrl) {
        res.status(500).json({ error: `Missing ${targetWebhooks[target]}` });
        return;
      }
      await sendJson(webhookUrl, payload);
      res.status(200).json({ ok: true, target });
      return;
    }

    if (!channelId) {
      res.status(400).json({ error: "Missing channel ID" });
      return;
    }

    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      res.status(500).json({ error: "Missing DISCORD_BOT_TOKEN" });
      return;
    }

    await sendJson(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      payload,
      { Authorization: `Bot ${token}` }
    );

    res.status(200).json({ ok: true, target: "customChannel", channelId });
  } catch (error) {
    console.error("Admin Discord embed failed.", error);
    res.status(500).json({ error: "Discord embed se nepodarilo odeslat." });
  }
};
