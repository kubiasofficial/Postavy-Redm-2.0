const DISCORD_API_BASE = "https://discord.com/api/v10";
const GALLERY_CHANNEL_ID = "1505429527021621278";
const DEFAULT_PHOTO_LIMIT = 48;
const MAX_DISCORD_PAGES = 5;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const isPhotoAttachment = (attachment) => {
  const contentType = String(attachment.content_type || "").toLowerCase();
  if (allowedImageTypes.has(contentType)) return true;

  const filename = String(attachment.filename || "").toLowerCase();
  return /\.(jpe?g|png|webp)$/.test(filename);
};

const cleanCaption = (content = "") => (
  String(content)
    .replace(/<a?:[^:>]+:\d+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220)
);

const normalizeUrl = (url = "") => String(url).trim();

const fetchDiscordJson = async (path, token) => {
  const response = await fetch(`${DISCORD_API_BASE}${path}`, {
    headers: {
      Authorization: `Bot ${token}`
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error("Discord request failed");
    error.status = response.status;
    error.details = data || text;
    throw error;
  }

  return data;
};

const getRequestedLimit = (value) => {
  const parsed = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_PHOTO_LIMIT;
  return Math.min(parsed, 100);
};

const getAuthorName = (message) => (
  message.member?.nick ||
  message.author?.global_name ||
  message.author?.username ||
  "Neznámý autor"
);

const getMessagePhotoCount = (message) => (
  Array.isArray(message.attachments)
    ? message.attachments.filter(isPhotoAttachment).length
    : 0
);

const getDebugPayload = async (token, messages, photos) => {
  const [bot, channel] = await Promise.all([
    fetchDiscordJson("/users/@me", token),
    fetchDiscordJson(`/channels/${GALLERY_CHANNEL_ID}`, token)
  ]);

  return {
    bot: {
      id: bot.id,
      username: bot.username,
      globalName: bot.global_name || null
    },
    channel: {
      id: channel.id,
      name: channel.name || null,
      type: channel.type,
      guildId: channel.guild_id || null,
      parentId: channel.parent_id || null
    },
    counts: {
      messages: messages.length,
      photos: photos.length,
      messagesWithAttachments: messages.filter((message) => Array.isArray(message.attachments) && message.attachments.length > 0).length,
      matchingPhotoAttachments: messages.reduce((count, message) => count + getMessagePhotoCount(message), 0),
      embeds: messages.reduce((count, message) => count + (Array.isArray(message.embeds) ? message.embeds.length : 0), 0)
    },
    sampleMessages: messages.slice(0, 5).map((message) => ({
      id: message.id,
      authorId: message.author?.id || null,
      authorName: getAuthorName(message),
      attachmentCount: Array.isArray(message.attachments) ? message.attachments.length : 0,
      photoAttachmentCount: getMessagePhotoCount(message),
      embedCount: Array.isArray(message.embeds) ? message.embeds.length : 0,
      attachmentTypes: Array.isArray(message.attachments)
        ? message.attachments.map((attachment) => ({
            filename: attachment.filename || null,
            contentType: attachment.content_type || null,
            width: attachment.width || null,
            height: attachment.height || null
          }))
        : [],
      createdAt: message.timestamp || null
    }))
  };
};

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "Missing DISCORD_BOT_TOKEN" });
  }

  try {
    const messages = [];
    let before = "";
    const photoLimit = getRequestedLimit(req.query?.limit);

    for (let pageNumber = 0; pageNumber < MAX_DISCORD_PAGES; pageNumber += 1) {
      const search = new URLSearchParams({ limit: "100" });
      if (before) search.set("before", before);

      const response = await fetch(`${DISCORD_API_BASE}/channels/${GALLERY_CHANNEL_ID}/messages?${search}`, {
        headers: {
          Authorization: `Bot ${token}`
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({
          error: "Discord gallery request failed",
          details: await response.text()
        });
      }

      const page = await response.json();
      if (!Array.isArray(page) || page.length === 0) break;

      messages.push(...page);
      before = page[page.length - 1].id;

      const loadedPhotoCount = messages.reduce((count, message) => (
        count + (Array.isArray(message.attachments)
          ? message.attachments.filter(isPhotoAttachment).length
          : 0)
      ), 0);

      if (loadedPhotoCount >= photoLimit || page.length < 100) break;
    }

    const photos = messages
      .flatMap((message) => (
        Array.isArray(message.attachments)
          ? message.attachments
              .filter(isPhotoAttachment)
              .map((attachment) => ({
                id: attachment.id,
                url: normalizeUrl(attachment.url),
                proxyUrl: normalizeUrl(attachment.proxy_url || attachment.url),
                filename: attachment.filename || "photo",
                caption: cleanCaption(message.content),
                authorId: message.author?.id || null,
                authorName: getAuthorName(message),
                messageId: message.id || null,
                width: attachment.width || null,
                height: attachment.height || null,
                uploadedAt: message.timestamp || null,
                createdAt: message.timestamp || null
              }))
          : []
      ))
      .slice(0, photoLimit);

    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=600");
    if (String(req.query?.debug || "") === "1") {
      return res.status(200).json({
        photos,
        debug: await getDebugPayload(token, messages, photos)
      });
    }

    return res.status(200).json({ photos });
  } catch (error) {
    return res.status(error.status || 500).json({
      error: "Unable to load Discord gallery",
      details: error.details || error.message
    });
  }
};
