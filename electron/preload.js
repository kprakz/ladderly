// The only bridge between the app's web page and the desktop shell. It exposes a tiny, fixed API on
// `window.ladderly` (version and updates); the page gets no other access to Node or Electron.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ladderly", {
  desktop: true,
  updates: {
    /** @returns {Promise<object | null>} The current update state. */
    get: () => ipcRenderer.invoke("updates:get"),
    /** @returns {Promise<object | null>} The state after checking. */
    check: () => ipcRenderer.invoke("updates:check"),
    /** @returns {Promise<object | null>} The state after starting the download and install. */
    install: () => ipcRenderer.invoke("updates:install"),
    /**
     * Calls `listener` whenever the update state changes.
     * @param {(state: object) => void} listener Receives the new state.
     * @returns {() => void} Stops listening.
     */
    onChange: (listener) => {
      const handler = (_event, state) => listener(state);
      ipcRenderer.on("updates:state", handler);
      return () => ipcRenderer.removeListener("updates:state", handler);
    },
  },
});
