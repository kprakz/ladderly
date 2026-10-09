// Update checking and downloading, without Electron, so it can be tested with plain Node.
// Releases are published on GitHub with electron-builder's `latest.yml` next to `Ladderly-Setup.exe`:
// latest.yml gives the newest version, the installer's file name and its SHA-512, which we verify after download.
const { createHash } = require("node:crypto");
const { createWriteStream, rmSync } = require("node:fs");

/**
 * @typedef {Object} UpdateInfo
 * @property {string} version Newest version, e.g. "0.2.0".
 * @property {string} file Installer file name, e.g. "Ladderly-Setup.exe".
 * @property {string} sha512 Base64 SHA-512 of the installer.
 * @property {number} size Installer size in bytes (0 if unknown).
 * @property {string} [releaseDate] ISO date of the release, if given.
 */

/**
 * Reads the fields we need from electron-builder's latest.yml (a small, flat YAML file).
 * @param {string} text The file's contents.
 * @returns {UpdateInfo} The parsed update info.
 * @throws {Error} If the version, file name or checksum is missing.
 */
function parseLatestYml(text) {
  /**
   * Finds a top-level `key: value` line.
   * @param {string} key The key to look for.
   * @returns {string | undefined} The value without quotes, if present.
   */
  const field = (key) => {
    const match = text.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return match ? match[1].trim().replace(/^['"]|['"]$/g, "") : undefined;
  };
  const version = field("version");
  const file = field("path");
  const sha512 = field("sha512");
  if (!version || !file || !sha512) throw new Error("The update information is incomplete.");
  if (!/^[\w.-]+\.exe$/i.test(file)) throw new Error("The update file name looks wrong.");
  const sizeMatch = text.match(/^\s+size:\s*(\d+)/m);
  return { version, file, sha512, size: sizeMatch ? Number(sizeMatch[1]) : 0, releaseDate: field("releaseDate") };
}

/**
 * Compares two versions like "0.10.2" and "0.9.0" (numeric parts; a pre-release such as "1.0.0-beta" sorts before "1.0.0").
 * @param {string} a First version.
 * @param {string} b Second version.
 * @returns {number} Positive if a is newer, negative if b is newer, 0 if the same.
 */
function compareVersions(a, b) {
  const [mainA, preA = ""] = a.replace(/^v/, "").split("-", 2);
  const [mainB, preB = ""] = b.replace(/^v/, "").split("-", 2);
  const pa = mainA.split(".").map(Number);
  const pb = mainB.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff) return diff;
  }
  if (preA === preB) return 0;
  if (!preA) return 1;
  if (!preB) return -1;
  return preA < preB ? -1 : 1;
}

/**
 * Asks the release server whether there's a newer version.
 * @param {Object} options
 * @param {string} options.feedUrl Base URL of the latest release's files, e.g. ".../releases/latest/download".
 * @param {string} options.currentVersion The running app's version.
 * @returns {Promise<UpdateInfo | null>} The newer release, or `null` when up to date.
 * @throws {Error} If the release can't be reached or read.
 */
async function checkForUpdate({ feedUrl, currentVersion }) {
  const res = await fetch(`${feedUrl}/latest.yml`, { cache: "no-store", redirect: "follow" });
  if (res.status === 404) return null; // No release published yet.
  if (!res.ok) throw new Error(`The update server answered ${res.status}.`);
  const info = parseLatestYml(await res.text());
  return compareVersions(info.version, currentVersion) > 0 ? info : null;
}

/**
 * Downloads the installer to `destination`, reporting progress, and checks its SHA-512 against latest.yml.
 * Deletes the partial file on any failure, so a damaged installer is never run.
 * @param {Object} options
 * @param {string} options.url The installer's URL.
 * @param {string} options.destination Where to save it.
 * @param {string} options.sha512 Expected base64 SHA-512.
 * @param {number} [options.size] Expected size in bytes, used when the server doesn't send Content-Length.
 * @param {(fraction: number) => void} [options.onProgress] Called with 0–1 as bytes arrive.
 * @param {AbortSignal} [options.signal] Cancels the download.
 * @returns {Promise<string>} The path of the verified installer.
 * @throws {Error} On network errors, cancellation or a checksum mismatch.
 */
async function downloadInstaller({ url, destination, sha512, size = 0, onProgress, signal }) {
  const res = await fetch(url, { redirect: "follow", signal });
  if (!res.ok || !res.body) throw new Error(`The download failed (${res.status}).`);
  const total = Number(res.headers.get("content-length")) || size;
  const hash = createHash("sha512");
  const out = createWriteStream(destination);
  let received = 0;
  try {
    const reader = res.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      hash.update(value);
      received += value.length;
      if (!out.write(value)) await new Promise((resolve) => out.once("drain", resolve));
      if (total) onProgress?.(Math.min(1, received / total));
    }
    await new Promise((resolve, reject) => out.end((err) => (err ? reject(err) : resolve(undefined))));
    if (hash.digest("base64") !== sha512) throw new Error("The downloaded update didn't pass its safety check.");
    return destination;
  } catch (err) {
    out.destroy();
    rmSync(destination, { force: true });
    throw err;
  }
}

module.exports = { parseLatestYml, compareVersions, checkForUpdate, downloadInstaller };
