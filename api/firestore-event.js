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
    const event = body.event && typeof body.event === "object" ? body.event : null;
    const characterId = String(event?.characterId || "");
    const eventId = String(event?.id || `${Date.now()}-${characterId}-event`);

    if (!characterId || !event) {
      res.status(400).json({ error: "Missing event" });
      return;
    }

    if (session.discordId !== adminDiscordId && session.characterId !== characterId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const payload = {
      ...event,
      id: eventId,
      characterId,
      actorDiscordId: session.discordId,
      actorName: session.username || event.actorName || "",
      createdAtMs: Number(event.createdAtMs || Date.now()),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("characterEvents").doc(eventId).set(payload, { merge: true });
    res.status(200).json({ ok: true, event: payload });
  } catch (error) {
    console.error("Firestore event write failed.", error);
    res.status(500).json({ error: "Firestore event write failed" });
  }
};
