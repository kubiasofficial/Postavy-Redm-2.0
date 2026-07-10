const { webcrypto } = require("crypto");

const WEBSITE_URL = "https://postavy-redm-2-0.vercel.app/";

const interactionType = {
  ping: 1,
  applicationCommand: 2
};

const responseType = {
  pong: 1,
  channelMessageWithSource: 4
};

const commands = [
  {
    name: "crowe",
    description: "Overi, ze CrowesBot 2.0 bezi.",
    type: 1
  },
  {
    name: "web",
    description: "Posle odkaz na Crowe Family 2.0 web.",
    type: 1
  },
  {
    name: "prikazy",
    description: "Ukaze prikazy CrowesBota 2.0.",
    type: 1
  }
];

const getRawBody = async (req) => {
  if (typeof req.body === "string") return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
  if (req.body && typeof req.body === "object") return JSON.stringify(req.body);

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
};

const hexToBytes = (hex) => {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  return Uint8Array.from(hex.match(/.{2}/g).map((byte) => parseInt(byte, 16)));
};

const verifyDiscordRequest = async (req, rawBody) => {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) throw new Error("Missing DISCORD_PUBLIC_KEY");

  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];
  if (!signature || !timestamp) return false;

  const keyBytes = hexToBytes(publicKey);
  const signatureBytes = hexToBytes(signature);
  if (!keyBytes || !signatureBytes) return false;

  const key = await webcrypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "Ed25519" },
    false,
    ["verify"]
  );

  return webcrypto.subtle.verify(
    "Ed25519",
    key,
    signatureBytes,
    new TextEncoder().encode(`${timestamp}${rawBody}`)
  );
};

const json = (res, status, payload) => (
  res.status(status).setHeader("Content-Type", "application/json").send(JSON.stringify(payload))
);

const interactionResponse = (content, options = {}) => ({
  type: responseType.channelMessageWithSource,
  data: {
    content,
    flags: options.ephemeral ? 64 : undefined,
    embeds: options.embeds
  }
});

const handleCommandsHelp = () => interactionResponse("", {
  ephemeral: true,
  embeds: [
    {
      title: "CrowesBot 2.0 | Prikazy",
      color: 0xb88945,
      fields: [
        {
          name: "/crowe",
          value: "Overi, ze bot odpovida."
        },
        {
          name: "/web",
          value: "Posle odkaz na Crowe Family 2.0 web."
        },
        {
          name: "/prikazy",
          value: "Ukaze tenhle prehled."
        }
      ],
      footer: {
        text: "Crowe Family 2.0"
      },
      timestamp: new Date().toISOString()
    }
  ]
});

const handleCommand = (interaction) => {
  switch (interaction.data?.name) {
    case "crowe":
      return interactionResponse("CrowesBot 2.0 je pripraveny. Rodina Crowe je online.");
    case "web":
      return interactionResponse(`Crowe Family 2.0 web: ${WEBSITE_URL}`);
    case "prikazy":
      return handleCommandsHelp(interaction);
    default:
      return interactionResponse("Neznamy prikaz.", { ephemeral: true });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    return json(res, 200, {
      ok: true,
      name: "CrowesBot 2.0",
      commands
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const rawBody = await getRawBody(req);
    const verified = await verifyDiscordRequest(req, rawBody);
    if (!verified) return json(res, 401, { error: "Invalid request signature" });

    const interaction = JSON.parse(rawBody);
    if (interaction.type === interactionType.ping) {
      return json(res, 200, { type: responseType.pong });
    }

    if (interaction.type !== interactionType.applicationCommand) {
      return json(res, 400, { error: "Unsupported interaction type" });
    }

    return json(res, 200, handleCommand(interaction));
  } catch (error) {
    return json(res, 200, interactionResponse(`Bot narazil na chybu: ${error.message}`, { ephemeral: true }));
  }
};

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: false
  }
};
module.exports.commands = commands;
