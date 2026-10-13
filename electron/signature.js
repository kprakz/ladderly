// Checks a downloaded Windows program's digital signature before Ladderly runs it (no Electron imports, so it can be
// tested with plain Node). Uses Windows' own check, Get-AuthenticodeSignature, like Ollama's install script.
const { execFile } = require("node:child_process");

/**
 * Asks Windows whether a file has a valid signature from a given organisation.
 * @param {string} file The file to check.
 * @param {string} organisation The exact organisation name, e.g. "Ollama Inc.".
 * @returns {Promise<boolean>} True only for a valid signature whose certificate's organisation (O=) matches exactly.
 */
function isSignedBy(file, organisation) {
  const script =
    "$s = Get-AuthenticodeSignature -LiteralPath $env:LADDERLY_CHECK_FILE; " +
    "[pscustomobject]@{ status = [string]$s.Status; subject = [string]$s.SignerCertificate.Subject } | ConvertTo-Json -Compress";
  // Anchored so "O=Not Ollama Inc." can't pass for "O=Ollama Inc.".
  const escaped = organisation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(^|, )O=${escaped}(,|$)`);
  return new Promise((resolve) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", script],
      { env: { ...process.env, LADDERLY_CHECK_FILE: file }, windowsHide: true, timeout: 60000 },
      (err, stdout) => {
        if (err) return resolve(false);
        try {
          const { status, subject } = JSON.parse(stdout.trim());
          resolve(status === "Valid" && pattern.test(subject));
        } catch {
          resolve(false);
        }
      },
    );
  });
}

module.exports = { isSignedBy };
