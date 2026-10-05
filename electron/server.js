// Starts the bundled Next.js standalone server in a background process and waits until it responds.
const http = require("node:http");
const net = require("node:net");
const { utilityProcess } = require("electron");

/**
 * Checks whether a TCP port is free on 127.0.0.1.
 * @param {number} port Port number to test.
 * @returns {Promise<boolean>} `true` if nothing is listening on the port.
 */
function isPortFree(port) {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once("error", () => resolve(false));
    probe.once("listening", () => probe.close(() => resolve(true)));
    probe.listen(port, "127.0.0.1");
  });
}

/**
 * Asks the OS for any free port on 127.0.0.1.
 * @returns {Promise<number>} A port number that was free at the time of the call.
 */
function getRandomFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = /** @type {net.AddressInfo} */ (probe.address());
      probe.close(() => resolve(port));
    });
  });
}

/**
 * Picks the port for the local server. The preferred port is used whenever possible because
 * saved paths live in localStorage, which is tied to the page's origin (including its port).
 * @param {number} preferred The fixed port the app normally uses.
 * @returns {Promise<number>} `preferred` if it is free, otherwise a random free port.
 */
async function choosePort(preferred) {
  return (await isPortFree(preferred)) ? preferred : getRandomFreePort();
}

/**
 * Polls a URL until it answers with any HTTP response, or gives up after a timeout.
 * @param {string} url The URL to poll, e.g. `http://127.0.0.1:47821/`.
 * @param {number} timeoutMs How long to keep trying, in milliseconds.
 * @returns {Promise<void>} Resolves when the server responds; rejects on timeout.
 */
function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    /**
     * Makes one request; on failure, retries after 200 ms until the deadline passes.
     * @returns {void}
     */
    const attempt = () => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (Date.now() > deadline) reject(new Error(`Server did not start within ${timeoutMs / 1000}s`));
        else setTimeout(attempt, 200);
      });
    };
    attempt();
  });
}

/**
 * Starts the Next.js standalone server (`server.js`) in an Electron utility process.
 * @param {Object} options
 * @param {string} options.serverDir Folder containing the standalone `server.js`.
 * @param {number} options.port Port to listen on (127.0.0.1 only).
 * @param {Record<string, string>} options.env Extra environment variables (API key, demo mode).
 * @returns {Promise<{ url: string, child: Electron.UtilityProcess }>} The server's base URL and process handle.
 */
async function startServer({ serverDir, port, env }) {
  const child = utilityProcess.fork(require("node:path").join(serverDir, "server.js"), [], {
    cwd: serverDir,
    serviceName: "Ladderly server",
    stdio: "pipe",
    env: { ...process.env, ...env, NODE_ENV: "production", PORT: String(port), HOSTNAME: "127.0.0.1" },
  });
  child.stdout?.on("data", (d) => process.stdout.write(`[server] ${d}`));
  child.stderr?.on("data", (d) => process.stderr.write(`[server] ${d}`));

  const url = `http://127.0.0.1:${port}`;
  await waitForServer(url, 20_000);
  return { url, child };
}

module.exports = { choosePort, startServer, isPortFree, getRandomFreePort, waitForServer };
