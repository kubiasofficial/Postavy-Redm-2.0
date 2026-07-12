const DISCORD_API_BASE = "https://discord.com/api/v10";
const GALLERY_CHANNEL_ID = "1505429527021621278";
const DEFAULT_PHOTO_LIMIT = 48;
const MAX_DISCORD_PAGES = 5;
const MAX_THREAD_SCAN = 50;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const threadedChannelTypes = new Set([15, 16]);

const isPhotoAttachment = (attachment) => {
  const contentType = String(attachment.content_type || "").toLowerCase();
  if (allowedImageTypes.has(contentType)) return true;

  const filename = String(attachment.filename || "").toLowerCase();
  return /\.(jpe?g|png|webp)$/.test(filename);
};

const isLikelyImageUrl = (url = "") => (
  /\.(jpe?g|png|webp)(?:\?.*)?$/i.test(String(url))
);

const cleanCaption = (content = "") => (
  String(content)
    .replace(/<a?:[^:>]+:\d+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220)
);

const normalizeUrl = (url = "") => String(url).trim();

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

const getMessagePhotos = (message) => {
  const caption = cleanCaption(message.content);
  const base = {
    caption,
    authorId: message.author?.id || null,
    authorName: getAuthorName(message),
    messageId: message.id || null,
    uploadedAt: message.timestamp || null,
    createdAt: message.timestamp || null
  };

  const attachments = Array.isArray(message.attachments)
    ? message.attachments
        .filter(isPhotoAttachment)
        .map((attachment) => ({
          ...base,
          id: attachment.id,
          url: normalizeUrl(attachment.url),
          proxyUrl: normalizeUrl(attachment.proxy_url || attachment.url),
          filename: attachment.filename || "photo",
          width: attachment.width || null,
          height: attachment.height || null,
          source: "attachment"
        }))
    : [];

  const embeds = Array.isArray(message.embeds)
    ? message.embeds.flatMap((embed, index) => {
        const candidates = [
          { kind: "image", item: embed.image },
          { kind: "thumbnail", item: embed.thumbnail }
        ];

        return candidates
          .filter(({ item }) => item?.url && (item.width || item.height || isLikelyImageUrl(item.url)))
          .map(({ kind, item }) => ({
            ...base,
            id: `${message.id}-${kind}-${index}`,
            url: normalizeUrl(item.url),
            proxyUrl: normalizeUrl(item.proxy_url || item.url),
            filename: embed.title || embed.provider?.name || `${kind}-${index + 1}`,
            width: item.width || null,
            height: item.height || null,
            source: "embed"
          }));
      })
    : [];

  return [...attachments, ...embeds];
};

const getChannelMessages = async (token, channelId, maxPages = MAX_DISCORD_PAGES) => {
  const messages = [];
  let before = "";

  for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
    const search = new URLSearchParams({ limit: "100" });
    if (before) search.set("before", before);

    const page = await fetchDiscordJson(`/channels/${channelId}/messages?${search}`, token);
    if (!Array.isArray(page) || page.length === 0) break;

    messages.push(...page);
    before = page[page.length - 1].id;
    if (page.length < 100) break;
  }

  return messages;
};

const getThreadCandidates = async (token, channel) => {
  const threads = new Map();
  const addThread = (thread) => {
    if (thread?.id && String(thread.parent_id) === GALLERY_CHANNEL_ID) {
      threads.set(thread.id, thread);
    }
  };

  if (channel.guild_id) {
    try {
      const active = await fetchDiscordJson(`/guilds/${channel.guild_id}/threads/active`, token);
      (active?.threads || []).forEach(addThread);
    } catch {
      // Some bots can read a channel but cannot list every active guild thread.
    }
  }

  try {
    const archived = await fetchDiscordJson(`/channels/${GALLERY_CHANNEL_ID}/threads/archived/public?limit=100`, token);
    (archived?.threads || []).forEach(addThread);
  } catch {
    // Public archived threads are best-effort; the gallery can still use active threads.
  }

  return [...threads.values()]
    .sort((a, b) => String(b.last_message_id || b.id).localeCompare(String(a.last_message_id || a.id)))
    .slice(0, MAX_THREAD_SCAN);
};

const getGalleryMessages = async (token, photoLimit) => {
  const channel = await fetchDiscordJson(`/channels/${GALLERY_CHANNEL_ID}`, token);

  if (!threadedChannelTypes.has(channel.type)) {
    const messages = await getChannelMessages(token, GALLERY_CHANNEL_ID);
    return {
      channelType: channel.type,
      threadCount: 0,
      messages
    };
  }

  const threads = await getThreadCandidates(token, channel);
  const messages = [];

  for (const thread of threads) {
    const threadMessages = await getChannelMessages(token, thread.id, 1);
    messages.push(...threadMessages);
    const loadedPhotoCount = messages.reduce((count, message) => count + getMessagePhotos(message).length, 0);
    if (loadedPhotoCount >= photoLimit) break;
  }

  return {
    channelType: channel.type,
    threadCount: threads.length,
    messages
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
    const photoLimit = getRequestedLimit(req.query?.limit);
    const { channelType, threadCount, messages } = await getGalleryMessages(token, photoLimit);

    const photos = messages
      .flatMap(getMessagePhotos)
      .slice(0, photoLimit);

    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=600");
    return res.status(200).json({
      photos,
      meta: {
        channelId: GALLERY_CHANNEL_ID,
        channelType,
        threadCount,
        messageCount: messages.length
      }
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      error: "Unable to load Discord gallery",
      details: error.details || error.message
    });
  }
};
