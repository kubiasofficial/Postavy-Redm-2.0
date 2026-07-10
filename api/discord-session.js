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

module.exports = (req, res) => {
  const session = decodeSession(getCookie(req, "crowe_session"));
  if (!session?.discordId || !session?.characterId) {
    res.status(200).json({ authenticated: false });
    return;
  }

  res.status(200).json({
    authenticated: true,
    ...session
  });
};
