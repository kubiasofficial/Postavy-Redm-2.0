const { admin, db } = require("./firebase-admin");
const { adminDiscordId, readJson, requireSession } = require("./session-utils");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = requireSession(req, res);
  if (!session) return;

  try {
    const body = await readJson(req);
    const characterId = String(body.characterId || "");
    const state = body.state && typeof body.state === "object" ? body.state : null;

    if (!characterId || !state) {
      res.status(400).json({ error: "Missing character state" });
      return;
    }

    if (session.discordId !== adminDiscordId && session.characterId !== characterId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const payload = {
      ...state,
      characterId,
      updatedAtMs: Date.now(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("characterStates").doc(characterId).set(payload, { merge: true });
    res.status(200).json({ ok: true, state: payload });
  } catch (error) {
    console.error("Firestore state write failed.", error);
    res.status(500).json({ error: "Firestore state write failed" });
  }
};
