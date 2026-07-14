const adminDiscordId = "417061947759001600";

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

const getSession = (req) => decodeSession(getCookie(req, "crowe_session"));

const requireSession = (req, res) => {
  const session = getSession(req);
  if (!session?.discordId || !session?.characterId) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return session;
};

const requireAdmin = (req, res) => {
  const session = requireSession(req, res);
  if (!session) return null;
  if (session.discordId !== adminDiscordId) {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }
  return session;
};

const readJson = async (req) => {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
};

module.exports = {
  adminDiscordId,
  getSession,
  requireSession,
  requireAdmin,
  readJson
};
