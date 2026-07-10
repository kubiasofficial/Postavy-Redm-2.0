const fs = require("fs");
const path = require("path");
const { commands } = require("../api/discord-bot");

const DISCORD_API_BASE = "https://discord.com/api/v10";

const loadLocalEnv = () => {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) return;

      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();

      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) process.env[key] = value;
    });
};

loadLocalEnv();

const requiredEnv = ["DISCORD_BOT_TOKEN", "DISCORD_APPLICATION_ID"];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing env: ${missing.join(", ")}`);
  process.exit(1);
}

const commandUrl = process.env.DISCORD_GUILD_ID
  ? `${DISCORD_API_BASE}/applications/${process.env.DISCORD_APPLICATION_ID}/guilds/${process.env.DISCORD_GUILD_ID}/commands`
  : `${DISCORD_API_BASE}/applications/${process.env.DISCORD_APPLICATION_ID}/commands`;

fetch(commandUrl, {
  method: "PUT",
  headers: {
    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(commands)
})
  .then(async (response) => {
    const body = await response.text();
    if (!response.ok) {
      throw new Error(`${response.status} ${body}`);
    }

    const scope = process.env.DISCORD_GUILD_ID ? "guild" : "global";
    console.log(`Registered ${JSON.parse(body).length} ${scope} Discord commands.`);
  })
  .catch((error) => {
    console.error(`Command registration failed: ${error.message}`);
    process.exit(1);
  });
