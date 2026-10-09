// Keeps the desktop app up to date: checks GitHub Releases on startup and every few hours, tells the window when a
// newer version exists, and on one click downloads it (with progress), verifies it, installs it silently and
// reopens Ladderly. The window talks to this through the small bridge in preload.js.
const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const { spawn } = require("node:child_process");
const path = require("node:path");
const { checkForUpdate, downloadInstaller } = require("./update-core");

/** Where the latest release's files are (latest.yml and the installer). */
const RELEASE_FEED = "https://github.com/kprakz/ladderly/releases/latest/download";
/** How often to check again while the app stays open. */
const CHECK_EVERY_MS = 6 * 60 * 60 * 1000;
/** Wait a little after startup so the check doesn't slow the first load. */
const FIRST_CHECK_DELAY_MS = 10 * 1000;

/**
 * @typedef {Object} UpdateState
 * @property {"idle" | "checking" | "up-to-date" | "available" | "downloading" | "installing" | "error"} status
 * @property {string} currentVersion The running version.
 * @property {string} [version] The newer version, when one is available.
 * @property {number} [percent] Download progress, 0–100.
 * @property {string} [message] What went wrong, for "error".
 */

/** @type {UpdateState} */
let state = { status: "idle", currentVersion: app.getVersion() };
/** @type {import("./update-core").UpdateInfo | null} */
let available = null;
let serverOrigin = "";

/**
 * The release feed: GitHub, or LADDERLY_UPDATE_FEED when testing an unpackaged build.
 * @returns {string} The feed's base URL.
 */
function feedUrl() {
  return (!app.isPackaged && process.env.LADDERLY_UPDATE_FEED) || RELEASE_FEED;
}

/**
 * Changes the update state and tells every window.
 * @param {Partial<UpdateState>} changes Fields to change.
 * @returns {void}
 */
function setState(changes) {
  state = { ...state, ...changes };
  for (const win of BrowserWindow.getAllWindows()) win.webContents.send("updates:state", state);
}

/**
 * Checks for a newer release. Quiet by default; with `interactive` (from the Help menu) it also says
 * "You're up to date" or explains an error in a dialog.
 * @param {{ interactive?: boolean }} [options]
 * @returns {Promise<UpdateState>} The new state.
 */
async function checkNow({ interactive = false } = {}) {
  if (state.status === "downloading" || state.status === "installing") return state;
  setState({ status: "checking", message: undefined });
  try {
    available = await checkForUpdate({ feedUrl: feedUrl(), currentVersion: app.getVersion() });
    setState(available ? { status: "available", version: available.version } : { status: "up-to-date", version: undefined });
    if (interactive && !available) {
      dialog.showMessageBox({ type: "info", title: "Ladderly", message: "You're up to date.", detail: `Ladderly ${app.getVersion()} is the latest version.` });
    }
  } catch (err) {
    setState({ status: "idle" });
    if (interactive) {
      dialog.showMessageBox({ type: "warning", title: "Ladderly", message: "Couldn't check for updates.", detail: "Check your internet connection and try again." });
    }
    console.error("Update check failed:", err instanceof Error ? err.message : err);
  }
  return state;
}

/**
 * Downloads, verifies and installs the available update, then quits so the installer can replace the app.
 * The installer runs silently (`/S`) and reopens Ladderly when it's done (`--force-run`).
 * @returns {Promise<UpdateState>} The state ("installing" on success, "error" otherwise).
 */
async function installNow() {
  if (!available || state.status === "downloading" || state.status === "installing") return state;
  const info = available;
  setState({ status: "downloading", percent: 0 });
  try {
    const destination = path.join(app.getPath("temp"), `Ladderly-Setup-${info.version}.exe`);
    await downloadInstaller({
      url: `${feedUrl()}/${info.file}`,
      destination,
      sha512: info.sha512,
      size: info.size,
      onProgress: (fraction) => setState({ percent: Math.round(fraction * 100) }),
    });
    setState({ status: "installing", percent: 100 });
    spawn(destination, ["/S", "--updated", "--force-run"], { detached: true, stdio: "ignore" }).unref();
    setTimeout(() => app.quit(), 800);
  } catch (err) {
    setState({ status: "error", message: err instanceof Error ? err.message : "The update couldn't be downloaded." });
  }
  return state;
}

/**
 * Only the app's own pages (served by the local server) may use the update bridge.
 * @param {Electron.IpcMainInvokeEvent} event The IPC event.
 * @returns {boolean} True if the request came from the local server's origin.
 */
function fromApp(event) {
  try {
    return new URL(event.senderFrame?.url ?? "").origin === serverOrigin;
  } catch {
    return false;
  }
}

/**
 * Sets up the IPC bridge and the automatic checks. Call once, after the local server is running.
 * @param {string} serverUrl The local server's base URL, e.g. "http://127.0.0.1:47821".
 * @returns {void}
 */
function initUpdater(serverUrl) {
  serverOrigin = new URL(serverUrl).origin;
  ipcMain.handle("updates:get", (event) => (fromApp(event) ? state : null));
  ipcMain.handle("updates:check", (event) => (fromApp(event) ? checkNow() : null));
  ipcMain.handle("updates:install", (event) => (fromApp(event) ? installNow() : null));

  // Packaged builds check automatically; dev builds only when a test feed is given.
  if (app.isPackaged || process.env.LADDERLY_UPDATE_FEED) {
    setTimeout(() => void checkNow(), FIRST_CHECK_DELAY_MS);
    setInterval(() => void checkNow(), CHECK_EVERY_MS).unref();
  }
}

module.exports = { initUpdater, checkNow };
