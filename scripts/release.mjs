// Publishes the built desktop app as a GitHub release, so the website's download button and the in-app
// "Update now" both pick it up. Run with `npm run desktop:release` after bumping "version" in package.json.
// Needs the GitHub CLI (`gh`), signed in with `gh auth login`.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const tag = `v${version}`;
const files = ["dist/Ladderly-Setup.exe", "dist/Ladderly-Setup.exe.blockmap", "dist/latest.yml"];

/**
 * Stops with a message.
 * @param {string} message What's wrong and how to fix it.
 * @returns {never}
 */
function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

/**
 * Runs a command and returns its result.
 * @param {string} command The command line.
 * @returns {import("node:child_process").SpawnSyncReturns<string>} The result.
 */
function run(command) {
  return spawnSync(command, { shell: true, encoding: "utf8" });
}

for (const file of files) if (!existsSync(file)) fail(`${file} is missing. Run \`npm run desktop:build\` first.`);
const latest = readFileSync("dist/latest.yml", "utf8");
if (!latest.includes(`version: ${version}`)) fail(`dist/latest.yml isn't for version ${version}. Rebuild with \`npm run desktop:build\`.`);
if (run("gh --version").status !== 0) fail("The GitHub CLI isn't installed. Get it from https://cli.github.com and run `gh auth login`.");
if (run(`gh release view ${tag}`).status === 0) fail(`Release ${tag} already exists. Bump "version" in package.json for a new release.`);

console.log(`Publishing Ladderly ${version} as ${tag}…`);
const result = spawnSync("gh", ["release", "create", tag, ...files, "--title", `Ladderly ${version}`, "--generate-notes", "--latest"], { stdio: "inherit" });
if (result.status !== 0) fail("Publishing failed (see above).");
console.log(`\n✔ Released ${tag}. Installed apps will offer the update within a few hours (or via Help → Check for Updates).`);
