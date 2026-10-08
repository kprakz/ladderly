// User settings for the desktop app, stored as JSON in the app's user-data folder
// (on Windows: %APPDATA%\Ladderly\config.json).
const fs = require("node:fs");
const path = require("node:path");

/**
 * @typedef {Object} DesktopConfig
 * @property {string} [anthropicApiKey] Anthropic API key. When missing, the app runs in demo mode.
 * @property {boolean} [demoMode] Force demo mode even when a key is set.
 */

/**
 * Returns the full path of the desktop config file.
 * @param {string} userDataDir Electron's user-data folder (`app.getPath("userData")`).
 * @returns {string} Absolute path to `config.json`.
 */
function configPath(userDataDir) {
  return path.join(userDataDir, "config.json");
}

/**
 * Reads the desktop config file. A missing or unreadable file gives an empty config (demo mode).
 * @param {string} userDataDir Electron's user-data folder.
 * @returns {DesktopConfig} The parsed settings, or `{}` if there are none.
 */
function loadConfig(userDataDir) {
  try {
    const parsed = JSON.parse(fs.readFileSync(configPath(userDataDir), "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Creates a config file with empty settings if none exists, so users can find and edit it.
 * @param {string} userDataDir Electron's user-data folder.
 * @returns {void}
 */
function ensureConfigFile(userDataDir) {
  const file = configPath(userDataDir);
  if (fs.existsSync(file)) return;
  try {
    fs.mkdirSync(userDataDir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ anthropicApiKey: "", demoMode: true }, null, 2));
  } catch {
    // Not fatal: the app still runs in demo mode.
  }
}

/**
 * Converts the desktop config into environment variables for the local Next.js server.
 * @param {DesktopConfig} config Settings from `loadConfig`.
 * @returns {Record<string, string>} Variables to merge into the server's environment.
 */
function configToEnv(config) {
  const env = { LADDERLY_LOCAL: "1" }; // lets the local server use Ollama and report disk/memory
  const key = typeof config.anthropicApiKey === "string" ? config.anthropicApiKey.trim() : "";
  if (key) env.ANTHROPIC_API_KEY = key;
  env.DEMO_MODE = config.demoMode === false && key ? "false" : "true";
  return env;
}

module.exports = { configPath, loadConfig, ensureConfigFile, configToEnv };
