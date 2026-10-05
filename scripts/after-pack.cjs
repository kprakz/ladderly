// electron-builder "afterPack" hook: copies the Next.js standalone server into the packaged app.
// Done here instead of via `extraResources`, which skips `node_modules` and dot-folders like `.next`.
const fs = require("node:fs");
const path = require("node:path");

/**
 * Copies `.next/standalone` to `resources/app-server` inside the packaged app, leaving out `.env*` files.
 * @param {import("electron-builder").AfterPackContext} context Build info from electron-builder; `appOutDir` is the unpacked app folder.
 * @returns {Promise<void>}
 */
exports.default = async function afterPack(context) {
  const src = path.join(context.packager.projectDir, ".next", "standalone");
  const dest = path.join(context.appOutDir, "resources", "app-server");
  if (!fs.existsSync(path.join(src, "server.js"))) {
    throw new Error("Missing .next/standalone/server.js. Run `node scripts/build-desktop.mjs` first.");
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, {
    recursive: true,
    filter: (file) => !path.basename(file).startsWith(".env"),
  });
};
