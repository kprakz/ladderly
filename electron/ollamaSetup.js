// "Set up for me": downloads and installs Ollama (the free app that runs open-source models) without the learner
// having to visit another website. It follows Ollama's own install script (scripts/install.ps1 in ollama/ollama):
// download OllamaSetup.exe, refuse it unless Windows says it's validly signed by Ollama Inc., create the
// "upgraded" marker so Ollama starts hidden, run it silently (per-user, no admin), then wait for it to start.
const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("node:child_process");
const { existsSync, mkdirSync, rmSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { isSignedBy } = require("./signature");
const { downloadFile } = require("./update-core");

const INSTALLER_URL = "https://ollama.com/download/OllamaSetup.exe";
/**
 * Where to download the installer from: Ollama, or LADDERLY_OLLAMA_INSTALLER_URL when testing an unpackaged build.
 * @returns {string} The URL.
 */
function installerUrl() {
  return (!app.isPackaged && process.env.LADDERLY_OLLAMA_INSTALLER_URL) || INSTALLER_URL;
}
/** Ollama's Windows installer is about 1.6 GB; installed it takes about 2.8 GB. */
const INSTALLER_GB = 1.6;
const INSTALLED_GB = 2.8;
/**
 * The Ollama server address: the standard one, or LADDERLY_TEST_OLLAMA_URL when testing an unpackaged build.
 * @returns {string} The base URL.
 */
function ollamaUrl() {
  return (!app.isPackaged && process.env.LADDERLY_TEST_OLLAMA_URL) || "http://127.0.0.1:11434";
}

/**
 * @typedef {Object} SetupState
 * @property {"idle" | "downloading" | "verifying" | "installing" | "starting" | "done" | "error"} status
 * @property {number} [percent] Download progress, 0–100.
 * @property {string} [message] What went wrong, for "error".
 */

/** @type {SetupState} */
let state = { status: "idle" };

/**
 * Where Ollama is installed for this Windows user (the installer's default, no admin needed).
 * @returns {string} The folder.
 */
function installDir() {
  return path.join(process.env.LOCALAPPDATA ?? app.getPath("home"), "Programs", "Ollama");
}

/**
 * Changes the setup state and tells every window.
 * @param {SetupState} next The new state.
 * @returns {void}
 */
function setState(next) {
  state = next;
  for (const win of BrowserWindow.getAllWindows()) win.webContents.send("ollama:setup", state);
}

/**
 * Whether the Ollama server answers.
 * @returns {Promise<boolean>} True if it's running.
 */
async function isRunning() {
  try {
    const res = await fetch(`${ollamaUrl()}/api/version`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Waits for the Ollama server to start answering.
 * @param {number} seconds How long to wait at most.
 * @returns {Promise<boolean>} True once it answers, false if it never did.
 */
async function waitForServer(seconds) {
  for (let i = 0; i < seconds; i++) {
    if (await isRunning()) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

/**
 * Starts Ollama if it's installed but not running (its tray app starts the server).
 * @returns {Promise<boolean>} True once the server answers.
 */
async function startOllama() {
  if (await isRunning()) return true;
  const exe = path.join(installDir(), "ollama app.exe");
  if (!existsSync(exe)) return false;
  spawn(exe, [], { detached: true, stdio: "ignore", windowsHide: true }).unref();
  return waitForServer(30);
}

/**
 * Downloads, verifies and silently installs Ollama, then makes sure it's running. Progress goes to the windows as
 * "ollama:setup" events. Never runs a file that isn't validly signed by Ollama Inc.
 * @returns {Promise<SetupState>} The final state ("done" or "error").
 */
async function installOllama() {
  if (state.status === "downloading" || state.status === "verifying" || state.status === "installing" || state.status === "starting") return state;
  if (process.platform !== "win32") {
    setState({ status: "error", message: "Automatic setup is only available on Windows. Install Ollama from ollama.com." });
    return state;
  }
  if (await isRunning()) {
    setState({ status: "done" });
    return state;
  }
  if (existsSync(path.join(installDir(), "ollama app.exe"))) {
    setState({ status: "starting" });
    setState((await startOllama()) ? { status: "done" } : { status: "error", message: "Ollama is installed but didn't start. Open Ollama from the Start menu, then try again." });
    return state;
  }

  const installer = path.join(app.getPath("temp"), "OllamaSetup.exe");
  try {
    setState({ status: "downloading", percent: 0 });
    await downloadFile({
      url: installerUrl(),
      destination: installer,
      onProgress: (fraction) => setState({ status: "downloading", percent: Math.round(fraction * 100) }),
    });

    setState({ status: "verifying" });
    if (!(await isSignedBy(installer, "Ollama Inc."))) {
      throw new Error("The download didn't pass its safety check (it isn't signed by Ollama), so it wasn't installed.");
    }

    // Ollama starts hidden after an install when this marker exists (it deletes the marker itself).
    const markerDir = path.join(process.env.LOCALAPPDATA ?? app.getPath("home"), "Ollama");
    mkdirSync(markerDir, { recursive: true });
    writeFileSync(path.join(markerDir, "upgraded"), "");

    setState({ status: "installing" });
    const code = await new Promise((resolve, reject) => {
      const proc = spawn(installer, ["/VERYSILENT", "/NORESTART", "/SUPPRESSMSGBOXES"], { stdio: "ignore", windowsHide: true });
      proc.on("error", reject);
      proc.on("exit", resolve);
    });
    if (code !== 0) throw new Error(`The Ollama installer stopped with code ${code}. Try again, or install it from ollama.com.`);

    setState({ status: "starting" });
    if (!(await waitForServer(60)) && !(await startOllama())) {
      throw new Error("Ollama was installed but didn't start. Open Ollama from the Start menu, then try again.");
    }
    setState({ status: "done" });
  } catch (err) {
    setState({ status: "error", message: err instanceof Error ? err.message : "Setup failed. Please try again." });
  } finally {
    rmSync(installer, { force: true });
  }
  return state;
}

/**
 * Lets the app's own page (and only it) ask for the setup, through the preload bridge.
 * @param {string} serverUrl The local server's base URL, e.g. "http://127.0.0.1:47821".
 * @returns {void}
 */
function initOllamaSetup(serverUrl) {
  const origin = new URL(serverUrl).origin;
  /**
   * Whether an IPC call came from the app's own page.
   * @param {Electron.IpcMainInvokeEvent} event The IPC event.
   * @returns {boolean} True for the local server's origin.
   */
  const fromApp = (event) => {
    try {
      return new URL(event.senderFrame?.url ?? "").origin === origin;
    } catch {
      return false;
    }
  };
  ipcMain.handle("ollama:setup:get", (event) => (fromApp(event) ? { ...state, installerGB: INSTALLER_GB, installedGB: INSTALLED_GB } : null));
  ipcMain.handle("ollama:setup:install", (event) => (fromApp(event) ? installOllama() : null));
}

module.exports = { initOllamaSetup, installOllama, startOllama };
