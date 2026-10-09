/** Update progress reported by the desktop app (see electron/updater.js). */
export type UpdateState = {
  status: "idle" | "checking" | "up-to-date" | "available" | "downloading" | "installing" | "error";
  currentVersion: string;
  version?: string;
  percent?: number;
  message?: string;
};

/** The small API the desktop app's preload script puts on `window.ladderly`. */
export type DesktopBridge = {
  desktop: true;
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
