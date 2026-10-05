// Builds the Next.js app as a standalone server and prepares it for packaging into the desktop app.
// Used by the `desktop:*` npm scripts.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

/**
 * Copies a folder into the standalone build, replacing any previous copy.
 * The standalone server does not include static assets by default.
 * @param {string} from Source folder, relative to the project root.
 * @param {string} to Destination folder, relative to the standalone folder.
 * @returns {void}
 */
function copyInto(from, to) {
  const src = path.join(root, from);
  if (!existsSync(src)) return;
  const dest = path.join(standalone, to);
  rmSync(dest, { recursive: true, force: true });
  cpSync(src, dest, { recursive: true });
}

/**
 * Deletes any `.env*` files from the standalone build so no secrets end up in the installer.
 * @returns {string[]} Names of the files that were removed.
 */
function removeEnvFiles() {
  const removed = readdirSync(standalone).filter((name) => name.startsWith(".env"));
  for (const name of removed) rmSync(path.join(standalone, name), { force: true });
  return removed;
}

/**
 * Runs `next build` with standalone output enabled.
 * @returns {void} Exits the process with the build's exit code if the build fails.
 */
function buildStandalone() {
  const result = spawnSync("npx next build", {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, BUILD_STANDALONE: "1" },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
  if (!existsSync(path.join(standalone, "server.js"))) {
    console.error("Build finished but .next/standalone/server.js is missing.");
    process.exit(1);
  }
}

buildStandalone();

copyInto(path.join(".next", "static"), path.join(".next", "static"));
copyInto("public", "public");
const removed = removeEnvFiles();
console.log(`Standalone build ready${removed.length ? ` (removed ${removed.join(", ")})` : ""}.`);
