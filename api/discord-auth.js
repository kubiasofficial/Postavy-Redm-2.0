const DISCORD_API_BASE = "https://discord.com/api/v10";
const allowedCharacters = {
  "417061947759001600": "zeke",
  "795365012494483486": "violet",
  "550294660090691594": "william",
  "1454130138240520407": "eleanor",
  "702917011235143800": "silas"
};

const getBaseUrl = (req) => {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
};

const encodeSession = (session) => Buffer.from(JSON.stringify(session), "utf8").toString("base64url");

const redirectWithSession = (res, session) => {
  res.writeHead(302, {
    Location: "/",
    "Set-Cookie": [
      `crowe_session=${encodeSession(session)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
    ],
    "Cache-Control": "no-store"
  });
  res.end();
};

module.exports = async (req, res) => {
  const clientId = process.env.DISCORD_APPLICATION_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const baseUrl = getBaseUrl(req);
  const redirectUri = `${baseUrl}/api/discord-auth`;

  if (!clientId || !clientSecret) {
    res.status(500).send("Missing DISCORD_APPLICATION_ID or DISCORD_CLIENT_SECRET");
    return;
  }

  if (!req.query.code) {
    const search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "identify"
    });
    res.redirect(`https://discord.com/oauth2/authorize?${search.toString()}`);
    return;
  }

  try {
    const tokenResponse = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: redirectUri
      })
    });

    if (!tokenResponse.ok) throw new Error(await tokenResponse.text());
    const token = await tokenResponse.json();

    const userResponse = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: { Authorization: `Bearer ${token.access_token}` }
    });
    if (!userResponse.ok) throw new Error(await userResponse.text());
    const user = await userResponse.json();

    const characterId = allowedCharacters[user.id];
    if (!characterId) {
      res.redirect("/?error=unknown_discord");
      return;
    }

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
      : "";

    const session = {
      discordId: user.id,
      username: user.global_name || user.username,
      avatarUrl,
      characterId
    };

    redirectWithSession(res, session);
  } catch (error) {
    res.redirect(`/?error=discord_login_failed`);
  }
};
