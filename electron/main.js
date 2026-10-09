// Electron main process: starts the local Ladderly server and shows it in a desktop window.
const path = require("node:path");
const { app, BrowserWindow, Menu, dialog, nativeTheme, shell } = require("electron");
const { configPath, configToEnv, ensureConfigFile, loadConfig } = require("./config");
const { choosePort, startServer } = require("./server");
const { checkNow, initUpdater } = require("./updater");

/** Fixed local port, so localStorage (saved paths) keeps the same origin between launches. */
const PREFERRED_PORT = 47821;

/** @type {Electron.UtilityProcess | null} */
let serverProcess = null;
/** @type {BrowserWindow | null} */
let mainWindow = null;
/** Set once the app starts quitting, so the server exiting then is not reported as a crash. */
let quitting = false;

/**
 * Finds the folder holding the Next.js standalone server.
 * @returns {string} `resources/app-server` in the installed app, or `.next/standalone` during development.
 */
function serverDirectory() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "app-server")
    : path.join(__dirname, "..", ".next", "standalone");
}

/**
 * Creates the main window and loads the local server's page into it.
 * Links to other sites open in the user's default browser instead of inside the app.
 * @param {string} url Base URL of the local server, e.g. `http://127.0.0.1:47821`.
 * @returns {BrowserWindow} The created window.
 */
function createWindow(url) {
  const win = new BrowserWindow({
    width: 1200,
    height: 860,
    minWidth: 380,
    minHeight: 500,
    title: "Ladderly",
    // Installed builds use the .exe's embedded icon; development runs use the source icon.
    icon: app.isPackaged ? undefined : path.join(__dirname, "..", "build", "icon.png"),
    // Matches the page background (dark or light, following the system), so there is no flash before it paints
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#09090b" : "#fafafa",
    autoHideMenuBar: true,
    show: false,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, preload: path.join(__dirname, "preload.js") },
  });

  win.webContents.setWindowOpenHandler(({ url: target }) => {
    if (/^https?:\/\//.test(target)) shell.openExternal(target);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (event, target) => {
    if (!target.startsWith(url)) {
      event.preventDefault();
      if (/^https?:\/\//.test(target)) shell.openExternal(target);
    }
  });

  win.once("ready-to-show", () => win.show());
  // The learning app lives at /app (the site root is the download website).
  win.loadURL(`${url}/app`);
  return win;
}

/**
 * Builds the application menu (shown with the Alt key).
 * @returns {Electron.Menu} The menu to install with `Menu.setApplicationMenu`.
 */
function buildMenu() {
  const userData = app.getPath("userData");
  return Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Open Settings File (API key)…",
          click: () => {
            ensureConfigFile(userData);
            shell.openPath(configPath(userData));
          },
        },
        {
          label: "Restart to Apply Settings",
          click: () => {
            app.relaunch();
            app.quit();
          },
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
        ...(app.isPackaged ? [] : [{ role: /** @type {const} */ ("toggleDevTools") }]),
      ],
    },
    {
      label: "Help",
      submenu: [
        { label: "Check for Updates…", click: () => void checkNow({ interactive: true }) },
        { label: "Project on GitHub", click: () => shell.openExternal("https://github.com/kprakz/ladderly") },
        {
          label: "About Ladderly",
          click: () =>
            dialog.showMessageBox({
              type: "info",
              title: "About Ladderly",
              message: `Ladderly ${app.getVersion()}`,
              detail: "Structured learning paths from zero to competent in any skill.",
            }),
        },
      ],
    },
  ]);
}

/**
 * App startup: loads settings, starts the local server, then opens the window.
 * Shows an error dialog and quits if the server cannot start.
 * @returns {Promise<void>}
 */
async function start() {
  const userData = app.getPath("userData");
  ensureConfigFile(userData);
  Menu.setApplicationMenu(buildMenu());

  try {
    const port = await choosePort(PREFERRED_PORT);
    const server = await startServer({ serverDir: serverDirectory(), port, env: configToEnv(loadConfig(userData)) });
    serverProcess = server.child;
    serverProcess.on("exit", (code) => {
      if (code !== 0 && !quitting) {
        dialog.showErrorBox("Ladderly", `The Ladderly server stopped unexpectedly (code ${code}).`);
        app.quit();
      }
    });
    mainWindow = createWindow(server.url);
    initUpdater(server.url);
  } catch (err) {
    dialog.showErrorBox("Ladderly could not start", err instanceof Error ? err.message : String(err));
    app.quit();
  }
}

// Only one copy of the app at a time; a second launch focuses the existing window.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });
  app.whenReady().then(start);
  app.on("window-all-closed", () => app.quit());
  app.on("before-quit", () => {
    quitting = true;
    serverProcess?.kill();
  });
}
