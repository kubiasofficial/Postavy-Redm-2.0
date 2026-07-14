const { db } = require("./firebase-admin");
const { requireSession } = require("./session-utils");

const readCollection = async (name) => {
  const snapshot = await db.collection(name).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!requireSession(req, res)) return;

  try {
    const [states, events, characters] = await Promise.all([
      readCollection("characterStates"),
      readCollection("characterEvents"),
      readCollection("characters")
    ]);

    res.status(200).json({
      states,
      events: events
        .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0))
        .slice(0, 120),
      characters
    });
  } catch (error) {
    console.error("Firestore data read failed.", error);
    res.status(500).json({ error: "Firestore read failed" });
  }
};
