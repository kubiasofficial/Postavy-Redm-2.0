const { admin, db } = require("./firebase-admin");
const { readJson, requireAdmin, requireSession } = require("./session-utils");

const sanitizeCharacter = (character) => ({
  id: String(character.id || "").trim(),
  discordId: String(character.discordId || "").trim(),
  listName: String(character.listName || "").trim(),
  name: String(character.name || "").trim(),
  role: String(character.role || "").trim(),
  age: String(character.age || "").trim(),
  origin: String(character.origin || "").trim(),
  year: String(character.year || "1899").trim(),
  statusText: String(character.statusText || "").trim(),
  portrait: String(character.portrait || "").trim(),
  overview: String(character.overview || "").trim(),
  overviewBlocks: Array.isArray(character.overviewBlocks)
    ? character.overviewBlocks.slice(0, 2).map((block) => ({
      title: String(block.title || "").trim(),
      text: String(block.text || "").trim()
    }))
    : [],
  lore: String(character.lore || "").trim(),
  appearance: String(character.appearance || "").trim(),
  personality: String(character.personality || "").trim(),
  quote: String(character.quote || "").trim()
});

const readCharacters = async () => {
  const snapshot = await db.collection("characters").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    if (!requireSession(req, res)) return;
    try {
      res.status(200).json({ characters: await readCharacters() });
    } catch (error) {
      console.error("Firestore characters read failed.", error);
      res.status(500).json({ error: "Firestore characters read failed" });
    }
    return;
  }

  if (req.method !== "PUT") {
    res.setHeader("Allow", "GET, PUT");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = requireAdmin(req, res);
  if (!session) return;

  try {
    const body = await readJson(req);
    const characters = Array.isArray(body.characters)
      ? body.characters.map(sanitizeCharacter).filter((character) => character.id)
      : [];

    if (!characters.length) {
      res.status(400).json({ error: "At least one character is required" });
      return;
    }

    const batch = db.batch();
    const collectionRef = db.collection("characters");
    const existing = await collectionRef.get();
    existing.docs.forEach((doc) => batch.delete(doc.ref));
    characters.forEach((character) => {
      batch.set(collectionRef.doc(character.id), {
        ...character,
        updatedByDiscordId: session.discordId,
        updatedAtMs: Date.now(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    await batch.commit();

    res.status(200).json({ ok: true, characters });
  } catch (error) {
    console.error("Firestore characters write failed.", error);
    res.status(500).json({ error: "Firestore characters write failed" });
  }
};
