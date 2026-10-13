import { useSyncExternalStore } from "react";

/** Update progress reported by the desktop app (see electron/updater.js). */
export type UpdateState = {
  status: "idle" | "checking" | "up-to-date" | "available" | "downloading" | "installing" | "error";
  currentVersion: string;
  version?: string;
  percent?: number;
  message?: string;
};

/** Progress of "Set up for me" (installing Ollama), reported by electron/ollamaSetup.js. */
export type OllamaSetupState = {
  status: "idle" | "downloading" | "verifying" | "installing" | "starting" | "done" | "error";
  percent?: number;
  message?: string;
  installerGB?: number;
  installedGB?: number;
};

/** The small API the desktop app's preload script puts on `window.ladderly`. */
export type DesktopBridge = {
  desktop: true;
  /** Missing in desktop apps older than 0.1.3. */
  ollama?: {
    getSetup: () => Promise<OllamaSetupState | null>;
    install: () => Promise<OllamaSetupState | null>;
    onSetup: (listener: (state: OllamaSetupState) => void) => () => void;
  };
  updates: {
    get: () => Promise<UpdateState | null>;
    check: () => Promise<UpdateState | null>;
    install: () => Promise<UpdateState | null>;
    onChange: (listener: (state: UpdateState) => void) => () => void;
  };
};

declare global {
  interface Window {
    ladderly?: DesktopBridge;
  }
}

/**
 * The desktop bridge, when running inside the Windows app.
 * @returns {DesktopBridge | null} The bridge, or `null` in a normal browser (and during server rendering).
 */
export function desktopBridge(): DesktopBridge | null {
  return typeof window !== "undefined" && window.ladderly?.desktop ? window.ladderly : null;
}

/** The bridge never appears or disappears while the page is open, so there's nothing to subscribe to. */
const noSubscribe = () => () => {};

/**
 * Whether the page is running inside the Windows app. Safe for server rendering (false there) and hydration.
 * @returns {boolean} True in the desktop app.
 */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(noSubscribe, () => desktopBridge() !== null, () => false);
}
