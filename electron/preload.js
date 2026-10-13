// The only bridge between the app's web page and the desktop shell. It exposes a tiny, fixed API on
// `window.ladderly` (updates and Ollama setup); the page gets no other access to Node or Electron.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ladderly", {
  desktop: true,
  ollama: {
    /** @returns {Promise<object | null>} The "Set up for me" state, with the download and installed sizes. */
    getSetup: () => ipcRenderer.invoke("ollama:setup:get"),
    /** @returns {Promise<object | null>} The final state after downloading, verifying and installing Ollama. */
    install: () => ipcRenderer.invoke("ollama:setup:install"),
    /**
     * Calls `listener` whenever the setup state changes.
     * @param {(state: object) => void} listener Receives the new state.
     * @returns {() => void} Stops listening.
     */
    onSetup: (listener) => {
      const handler = (_event, state) => listener(state);
      ipcRenderer.on("ollama:setup", handler);
      return () => ipcRenderer.removeListener("ollama:setup", handler);
    },
  },
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
